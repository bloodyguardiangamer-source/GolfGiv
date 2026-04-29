import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Search, Users, ShieldCheck, UserX } from "lucide-react";
import { format } from "date-fns";
import { InlineRoleToggle } from "@/components/admin/InlineRoleToggle";

export const metadata = {
  title: "Manage Users | Admin | GolfGive",
};

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const supabase = await createClient();
  const resolvedParams = await searchParams;
  const query = resolvedParams.q || "";

  let dbQuery = supabase
    .from("users")
    .select("*, charities(name)")
    .order("created_at", { ascending: false });

  if (query) {
    dbQuery = dbQuery.or(`full_name.ilike.%${query}%,email.ilike.%${query}%`);
  }

  const { data: users } = await dbQuery.limit(50);

  const totalUsers = users?.length || 0;
  const adminCount = users?.filter(u => u.role === 'admin').length || 0;
  const activeCount = users?.filter(u => u.subscription_status === 'active').length || 0;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold text-white mb-2">Users</h1>
          <p className="text-muted">Manage subscribers and their details. Click on a role badge to promote/demote.</p>
        </div>
        
        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-muted" />
          </div>
          <form>
            <input
              type="text"
              name="q"
              defaultValue={query}
              placeholder="Search by name or email..."
              className="w-full bg-[#1c1c30] border border-border rounded-md py-2 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-primary transition-colors"
            />
          </form>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-surface border border-border rounded-lg p-4 flex items-center gap-3">
          <Users className="w-5 h-5 text-primary" />
          <div>
            <p className="text-2xl font-bold text-white">{totalUsers}</p>
            <p className="text-[10px] uppercase tracking-widest text-muted">Total Users</p>
          </div>
        </div>
        <div className="bg-surface border border-[#f5c842]/30 rounded-lg p-4 flex items-center gap-3">
          <ShieldCheck className="w-5 h-5 text-[#f5c842]" />
          <div>
            <p className="text-2xl font-bold text-[#f5c842]">{adminCount}</p>
            <p className="text-[10px] uppercase tracking-widest text-muted">Admins</p>
          </div>
        </div>
        <div className="bg-surface border border-primary/30 rounded-lg p-4 flex items-center gap-3">
          <UserX className="w-5 h-5 text-primary" />
          <div>
            <p className="text-2xl font-bold text-primary">{activeCount}</p>
            <p className="text-[10px] uppercase tracking-widest text-muted">Active Subs</p>
          </div>
        </div>
      </div>

      <div className="bg-surface border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-muted">
            <thead className="bg-[#1c1c30] text-[11px] uppercase tracking-[0.12em] font-medium text-muted">
              <tr>
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Charity</th>
                <th className="px-6 py-4">Joined</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {users?.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-muted">
                    No users found matching your search.
                  </td>
                </tr>
              ) : (
                users?.map((user) => (
                  <tr key={user.id} className="hover:bg-[#1c1c30]/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-medium text-white">{user.full_name}</div>
                      <div className="text-xs">{user.email}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold uppercase tracking-widest ${
                          user.subscription_status === "active"
                            ? "bg-primary/20 text-primary"
                            : user.subscription_status === "cancelled" || user.subscription_status === "lapsed"
                            ? "bg-[#ff6b4a]/20 text-[#ff6b4a]"
                            : "bg-muted/20 text-muted"
                        }`}
                      >
                        {user.subscription_status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <InlineRoleToggle userId={user.id} currentRole={user.role || 'user'} userName={user.full_name || user.email} />
                    </td>
                    <td className="px-6 py-4">
                      {user.charities?.name ? (
                        <div className="flex flex-col">
                          <span className="text-white truncate max-w-[150px]">{user.charities.name}</span>
                          <span className="text-xs text-primary">{user.charity_percentage}% split</span>
                        </div>
                      ) : (
                        <span className="text-muted/50">None</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {format(new Date(user.created_at), "MMM d, yyyy")}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {/* Using simple links for now. True admin panel would have view/edit modals */}
                      <Link 
                        href={`/admin/users/${user.id}`}
                        className="text-primary hover:text-primary-deep font-medium transition-colors"
                      >
                        View &rarr;
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
