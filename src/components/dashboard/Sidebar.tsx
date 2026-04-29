"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Target, Heart, Trophy, Settings, LogOut } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const navItems = [
  { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { name: "My Scores", href: "/dashboard/scores", icon: Target },
  { name: "My Charity", href: "/dashboard/charity", icon: Heart },
  { name: "Draws & Prizes", href: "/dashboard/prizes", icon: Trophy },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const supabase = createClient();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    async function checkAdmin() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase
          .from("users")
          .select("role")
          .eq("id", user.id)
          .single();
        if (data?.role === 'admin') {
          setIsAdmin(true);
        }
      }
    }
    checkAdmin();
  }, [supabase]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  return (
    <aside className="w-64 bg-surface border-r border-border hidden md:flex flex-col">
      <div className="p-6">
        <Link href="/" className="text-xl font-serif font-bold text-white flex items-center gap-2">
          Golf<span className="text-primary">Give</span>
        </Link>
      </div>

      <nav className="flex-1 px-4 space-y-2 mt-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-md transition-colors ${
                isActive
                  ? "bg-primary/10 text-primary font-medium border-l-2 border-primary"
                  : "text-muted hover:bg-[#1c1c30] hover:text-white border-l-2 border-transparent"
              }`}
            >
              <item.icon className={`w-5 h-5 ${isActive ? "text-primary" : "text-muted"}`} />
              {item.name}
            </Link>
          );
        })}

        {isAdmin && (
          <div className="pt-4 mt-4 border-t border-border/50">
            <p className="px-4 text-[10px] font-bold uppercase tracking-widest text-muted mb-2">Administration</p>
            <Link
              href="/admin"
              className={`flex items-center gap-3 px-4 py-3 rounded-md transition-colors ${
                pathname.startsWith("/admin")
                  ? "bg-[#f5c842]/10 text-[#f5c842] font-medium border-l-2 border-[#f5c842]"
                  : "text-muted hover:bg-[#1c1c30] hover:text-[#f5c842] border-l-2 border-transparent"
              }`}
            >
              <LayoutDashboard className={`w-5 h-5 ${pathname.startsWith("/admin") ? "text-[#f5c842]" : "text-muted"}`} />
              Admin Panel
            </Link>
          </div>
        )}
      </nav>

      <div className="p-4 border-t border-border">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 w-full text-left rounded-md text-muted hover:bg-[#1c1c30] hover:text-[#ff6b4a] transition-colors"
        >
          <LogOut className="w-5 h-5" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}
