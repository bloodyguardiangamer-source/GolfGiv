import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { format } from "date-fns";
import { Heart, Plus, Star } from "lucide-react";
import { CharityAdminActions } from "@/components/admin/CharityAdminActions";

export const metadata = {
  title: "Manage Charities | Admin | GolfGive",
};

export default async function AdminCharitiesPage() {
  const supabase = await createClient();

  const { data: charities } = await supabase
    .from("charities")
    .select("*, users(count)")
    .order("is_featured", { ascending: false })
    .order("name", { ascending: true });

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-serif font-bold text-white mb-2">Charities</h1>
          <p className="text-muted">Manage charity directory, media, and features.</p>
        </div>
        <Link
          href="/admin/charities/new"
          className="flex items-center gap-2 bg-primary hover:bg-primary-deep text-[#0a0a14] px-5 py-2.5 rounded-lg font-bold text-sm transition-all hover:scale-[1.02]"
        >
          <Plus className="w-4 h-4" />
          Add Charity
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {charities?.map((charity) => (
          <div key={charity.id} className="bg-surface border border-border rounded-xl overflow-hidden group">
            <div 
              className="h-32 bg-gradient-to-br from-[#1c1c30] to-[#2c2c48] relative flex items-center justify-center p-4"
              style={charity.image_url ? { backgroundImage: `url(${charity.image_url})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}}
            >
              {!charity.image_url && <Heart className="w-10 h-10 text-muted/30" />}
              {charity.is_featured && (
                <div className="absolute top-3 right-3 bg-primary text-[#0a0a14] px-2.5 py-1 rounded-sm flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest">
                  <Star className="w-3 h-3 fill-current" />
                  Featured
                </div>
              )}
            </div>
            
            <div className="p-5">
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-white font-bold text-lg leading-tight">{charity.name}</h3>
                <span className={`px-2 py-0.5 rounded-sm text-[10px] font-bold uppercase tracking-widest ${charity.is_active ? 'bg-primary/20 text-primary' : 'bg-muted/20 text-muted'}`}>
                  {charity.is_active ? 'Active' : 'Inactive'}
                </span>
              </div>
              
              <p className="text-muted text-sm line-clamp-2 mb-4 h-10">
                {charity.description || "No description provided."}
              </p>
              
              <div className="flex items-center justify-between pt-4 border-t border-border">
                <div className="text-sm">
                  <span className="text-primary font-bold">{charity.users?.[0]?.count || 0}</span>
                  <span className="text-muted ml-1 text-xs">Supporters</span>
                </div>
                <CharityAdminActions 
                  charityId={charity.id} 
                  isFeatured={charity.is_featured} 
                  isActive={charity.is_active} 
                />
              </div>
            </div>
          </div>
        ))}

        {charities?.length === 0 && (
          <div className="col-span-full py-12 text-center border border-dashed border-border rounded-xl bg-[#1c1c30]/30">
            <Heart className="w-12 h-12 text-muted/30 mx-auto mb-4" />
            <h3 className="text-white font-bold mb-1">No Charities Found</h3>
            <p className="text-muted text-sm mb-4">You haven't added any charities to the directory yet.</p>
            <button className="text-primary font-bold text-sm hover:underline">Add First Charity</button>
          </div>
        )}
      </div>
    </div>
  );
}
