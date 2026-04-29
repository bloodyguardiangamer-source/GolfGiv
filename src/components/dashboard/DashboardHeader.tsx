"use client";

import { useState, useEffect, useCallback } from "react";
import { Menu, Bell, X } from "lucide-react";
import { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { usePathname } from "next/navigation";

// Notification types
type Notification = {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: "draw" | "score" | "winner" | "system";
};

export function DashboardHeader({ user, profile }: { user: User; profile: any }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  // Fetch real notifications from recent draws, winners, etc.
  const fetchNotifications = useCallback(async () => {
    const supabase = createClient();
    const notifs: Notification[] = [];

    try {
      // Check latest draw
      const { data: latestDraw } = await supabase
        .from("draws")
        .select("*")
        .eq("status", "published")
        .order("published_at", { ascending: false })
        .limit(1)
        .single();

      if (latestDraw) {
        notifs.push({
          id: `draw-${latestDraw.id}`,
          title: "Draw Published",
          message: `The ${new Date(latestDraw.draw_month + 'T00:00:00').toLocaleDateString('en-US', { month: 'long', year: 'numeric' })} draw results are in!`,
          time: latestDraw.published_at ? new Date(latestDraw.published_at).toLocaleDateString() : "Recently",
          read: false,
          type: "draw",
        });
      }

      // Check if user has any winnings
      const { data: wins } = await supabase
        .from("winners")
        .select("*, draw_entries(draws(draw_month))")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(3);

      wins?.forEach((w) => {
        notifs.push({
          id: `win-${w.id}`,
          title: "🎉 You Won!",
          message: `You won $${Number(w.prize_amount).toLocaleString()}! Upload your scorecard proof.`,
          time: new Date(w.created_at).toLocaleDateString(),
          read: w.verification_status !== "pending",
          type: "winner",
        });
      });

      // Check score count
      const { count } = await supabase
        .from("scores")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user.id);

      if (count !== null && count < 5) {
        notifs.push({
          id: "score-reminder",
          title: "Score Reminder",
          message: `You have ${count}/5 scores entered. Add ${5 - count} more to be eligible for the next draw.`,
          time: "Now",
          read: count >= 5,
          type: "score",
        });
      }
    } catch (e) {
      // Fail silently - notifications are non-critical
    }

    setNotifications(notifs);
    setUnreadCount(notifs.filter((n) => !n.read).length);
  }, [user.id]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  // Close notif panel when clicking outside
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest(".notif-panel") && !target.closest(".notif-trigger")) {
        setIsNotifOpen(false);
      }
    };
    if (isNotifOpen) document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, [isNotifOpen]);

  const navItems = isAdmin
    ? [
        { name: "Overview", href: "/admin" },
        { name: "Users", href: "/admin/users" },
        { name: "Draws", href: "/admin/draws" },
        { name: "Charities", href: "/admin/charities" },
        { name: "Winners", href: "/admin/winners" },
      ]
    : [
        { name: "Overview", href: "/dashboard" },
        { name: "My Scores", href: "/dashboard/scores" },
        { name: "My Charity", href: "/dashboard/charity" },
        { name: "Draws & Prizes", href: "/dashboard/prizes" },
        { name: "Settings", href: "/dashboard/settings" },
      ];

  return (
    <>
      <header className="h-16 border-b border-border bg-[#0a0a14] flex items-center justify-between px-4 md:px-8 relative z-40">
        <div className="flex items-center gap-4">
          {/* Hamburger — toggles mobile sidebar */}
          <button
            className="md:hidden text-muted hover:text-white transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        <div className="flex items-center gap-6">
          {/* Notification Bell */}
          <button
            className="notif-trigger text-muted hover:text-primary transition-colors relative"
            onClick={() => setIsNotifOpen(!isNotifOpen)}
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary rounded-full text-[9px] font-bold text-[#0a0a14] flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>

          <div className="flex items-center gap-3 border-l border-border pl-6">
            <div className="w-8 h-8 rounded-full bg-[#1c1c30] flex items-center justify-center text-sm font-medium text-white border border-border">
              {profile?.full_name?.charAt(0) || user.email?.charAt(0).toUpperCase() || "U"}
            </div>
            <div className="hidden md:block">
              <p className="text-sm font-medium text-white leading-none">
                {profile?.full_name || "Golfer"}
              </p>
              <p className="text-[11px] text-muted mt-1 leading-none uppercase tracking-wider">{user.email}</p>
            </div>
          </div>
        </div>
      </header>

      {/* Notification Panel */}
      {isNotifOpen && (
        <div className="notif-panel absolute right-4 top-[calc(var(--header-offset,4rem)+0.5rem)] w-80 bg-surface border border-border rounded-xl shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200"
          style={{ top: isAdmin ? "calc(4rem + 1.5rem + 8px)" : "4.5rem" }}
        >
          <div className="p-4 border-b border-border flex items-center justify-between">
            <h3 className="text-sm font-bold text-white">Notifications</h3>
            {unreadCount > 0 && (
              <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                {unreadCount} new
              </span>
            )}
          </div>
          <div className="max-h-80 overflow-y-auto divide-y divide-border">
            {notifications.length === 0 ? (
              <div className="p-6 text-center text-muted text-sm">
                No notifications yet.
              </div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  className={`p-4 hover:bg-[#1c1c30]/50 transition-colors ${!n.read ? "bg-primary/5 border-l-2 border-primary" : ""}`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-sm font-bold text-white">{n.title}</p>
                      <p className="text-xs text-muted mt-1 leading-relaxed">{n.message}</p>
                    </div>
                    <span className="text-[10px] text-muted whitespace-nowrap">{n.time}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          {/* Sidebar Panel */}
          <aside className="absolute top-0 left-0 h-full w-72 bg-surface border-r border-border flex flex-col animate-in slide-in-from-left duration-300">
            <div className="p-6 border-b border-border flex items-center justify-between">
              <Link href={isAdmin ? "/admin" : "/dashboard"} className="text-xl font-serif font-bold text-white">
                Golf<span className="text-primary">Give</span>
                {isAdmin && <span className="text-xs uppercase tracking-widest text-[#f5c842] ml-2 font-sans font-medium">Admin</span>}
              </Link>
              <button onClick={() => setIsMobileMenuOpen(false)} className="text-muted hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav className="flex-1 px-4 py-4 space-y-1.5 overflow-y-auto">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-md transition-colors text-sm ${
                      isActive
                        ? isAdmin
                          ? "bg-[#f5c842]/10 text-[#f5c842] font-medium"
                          : "bg-primary/10 text-primary font-medium"
                        : "text-muted hover:bg-[#1c1c30] hover:text-white"
                    }`}
                  >
                    {item.name}
                  </Link>
                );
              })}
            </nav>

            {isAdmin && (
              <div className="px-4 pb-2">
                <Link
                  href="/dashboard"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 w-full text-left rounded-md text-muted hover:bg-primary/10 hover:text-primary transition-colors text-sm"
                >
                  Switch to User View
                </Link>
              </div>
            )}

            <div className="p-4 border-t border-border">
              <button
                onClick={async () => {
                  const supabase = createClient();
                  await supabase.auth.signOut();
                  window.location.href = "/";
                }}
                className="flex items-center gap-3 px-4 py-3 w-full text-left rounded-md text-muted hover:bg-[#1c1c30] hover:text-[#ff6b4a] transition-colors text-sm"
              >
                Sign Out
              </button>
            </div>
          </aside>
        </div>
      )}
    </>
  );
}
