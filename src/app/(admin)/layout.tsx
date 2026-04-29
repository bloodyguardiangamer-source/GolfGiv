import { ReactNode } from "react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/");
  }

  // Already role checked in middleware but good to fetch profile for Header
  let profile = null;
  try {
    const { data } = await supabase
      .from("users")
      .select("*")
      .eq("id", user.id)
      .single();
    profile = data;
    
    // Extra safety measure
    if (profile?.role !== 'admin') {
      redirect("/dashboard");
    }
  } catch (error) {
    console.log("Error fetching admin profile", error);
    redirect("/dashboard");
  }

  return (
    <div className="flex h-screen bg-[#0a0a14] overflow-hidden flex-col">
      {/* Admin Warning Bar */}
      <div className="bg-[#f5c842] text-[#0a0a14] text-xs font-bold uppercase tracking-widest text-center py-1.5 w-full flex items-center justify-center gap-2 z-50">
        <span className="w-2 h-2 rounded-full bg-[#0a0a14] animate-pulse"></span>
        Admin Environment Active
      </div>
      
      <div className="flex flex-1 overflow-hidden">
        <AdminSidebar />
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
          <DashboardHeader user={user} profile={profile} />
          <main className="flex-1 overflow-y-auto p-4 md:p-8">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
