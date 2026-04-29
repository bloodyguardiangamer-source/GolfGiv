import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";
import { revalidatePath } from "next/cache";

export const metadata = {
  title: "Add Charity | Admin | GolfGive",
};

export default async function NewCharityPage() {
  const handleSubmit = async (formData: FormData) => {
    "use server";
    const supabase = await createClient();
    
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const website_url = formData.get("website_url") as string;
    const logo_url = formData.get("logo_url") as string;
    
    await supabase.from("charities").insert({
      name,
      description,
      website_url: website_url || null,
      logo_url: logo_url || null,
    });
    
    revalidatePath("/admin/charities");
    redirect("/admin/charities");
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-2xl">
      <div className="flex items-center gap-4">
        <Link href="/admin/charities" className="p-2 bg-surface border border-border rounded-lg hover:bg-[#1c1c30] transition-colors">
          <ArrowLeft className="w-5 h-5 text-white" />
        </Link>
        <div>
          <h1 className="text-3xl font-serif font-bold text-white mb-2">Add New Charity</h1>
          <p className="text-muted">Register a new charity partner for the platform.</p>
        </div>
      </div>

      <div className="bg-surface border border-border rounded-xl p-6">
        <form action={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-xs font-bold uppercase tracking-widest text-muted mb-2">Charity Name *</label>
            <input 
              type="text" 
              id="name" 
              name="name" 
              required
              className="w-full bg-[#1c1c30] border border-border rounded-md px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
              placeholder="e.g. Golfers Against Cancer"
            />
          </div>
          
          <div>
            <label htmlFor="description" className="block text-xs font-bold uppercase tracking-widest text-muted mb-2">Description *</label>
            <textarea 
              id="description" 
              name="description" 
              required
              rows={4}
              className="w-full bg-[#1c1c30] border border-border rounded-md px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors resize-none"
              placeholder="Briefly describe the charity's mission..."
            />
          </div>

          <div>
            <label htmlFor="website_url" className="block text-xs font-bold uppercase tracking-widest text-muted mb-2">Website URL</label>
            <input 
              type="url" 
              id="website_url" 
              name="website_url" 
              className="w-full bg-[#1c1c30] border border-border rounded-md px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
              placeholder="https://..."
            />
          </div>

          <div>
            <label htmlFor="logo_url" className="block text-xs font-bold uppercase tracking-widest text-muted mb-2">Logo URL (Optional)</label>
            <input 
              type="url" 
              id="logo_url" 
              name="logo_url" 
              className="w-full bg-[#1c1c30] border border-border rounded-md px-4 py-3 text-white focus:outline-none focus:border-primary transition-colors"
              placeholder="https://.../logo.png"
            />
          </div>

          <div className="pt-4 border-t border-border flex justify-end gap-4">
            <Link 
              href="/admin/charities"
              className="px-6 py-3 rounded-md text-white font-bold tracking-wider text-sm hover:bg-[#1c1c30] transition-colors"
            >
              Cancel
            </Link>
            <button 
              type="submit"
              className="px-6 py-3 rounded-md bg-primary text-black font-bold tracking-wider text-sm hover:bg-primary-deep transition-colors flex items-center gap-2"
            >
              <Save className="w-4 h-4" /> Save Charity
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
