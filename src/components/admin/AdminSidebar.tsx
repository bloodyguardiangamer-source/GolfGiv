"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, Ticket, Heart, Trophy, LogOut, ArrowLeftRight, BarChart3 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

const navItems = [
  { name: "Overview", href: "/admin", icon: LayoutDashboard },
  { name: "Users", href: "/admin/users", icon: Users },
  { name: "Draws", href: "/admin/draws", icon: Ticket },
  { name: "Charities", href: "/admin/charities", icon: Heart },
  { name: "Winners", href: "/admin/winners", icon: Trophy },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  return (
    <aside className="w-64 bg-surface border-r border-border hidden md:flex flex-col">
      <div className="p-6">
        <Link href="/admin" className="text-xl font-serif font-bold text-white flex items-center gap-2">
          Golf<span className="text-primary">Give</span> <span className="text-xs uppercase tracking-widest text-[#f5c842] ml-2 font-sans font-medium">Admin</span>
        </Link>
      </div>

      <nav className="flex-1 px-4 space-y-1.5 mt-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/admin" && pathname?.startsWith(item.href));
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-md transition-colors ${
                isActive
                  ? "bg-[#f5c842]/10 text-[#f5c842] font-medium border-l-2 border-[#f5c842]"
                  : "text-muted hover:bg-[#1c1c30] hover:text-white border-l-2 border-transparent"
              }`}
            >
              <item.icon className={`w-5 h-5 ${isActive ? "text-[#f5c842]" : "text-muted"}`} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="px-4 pb-2">
        {/* Switch to User Dashboard */}
        <Link
          href="/dashboard"
          className="flex items-center gap-3 px-4 py-3 w-full text-left rounded-md text-muted hover:bg-primary/10 hover:text-primary transition-colors border border-transparent hover:border-primary/20"
        >
          <ArrowLeftRight className="w-5 h-5" />
          <span className="text-sm font-medium">Switch to User View</span>
        </Link>
      </div>

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
