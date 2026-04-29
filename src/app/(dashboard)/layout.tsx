import { ReactNode } from "react";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { RealtimeProvider } from "@/components/dashboard/RealtimeProvider";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/");
  }

  // Try to fetch full user profile, fail gracefully if table doesn't exist yet
  let profile = null;
  try {
    const { data } = await supabase
      .from("users")
      .select("*")
      .eq("id", user!.id)
      .single();
    profile = data;
  } catch (error) {
    console.log("Users table might not exist yet", error);
  }

  return (
    <div className="flex h-screen bg-[#0a0a14] overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <DashboardHeader user={user} profile={profile} />
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <RealtimeProvider>
            {children}
          </RealtimeProvider>
        </main>
      </div>
    </div>
  );
}
