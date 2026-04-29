import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ExternalLink, Heart } from "lucide-react";

export default async function CharityProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  
  const { data: charity, error } = await supabase
    .from("charities")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !charity) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[#0a0a14] pt-24 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <Link href="/charities" className="inline-flex items-center gap-2 text-muted hover:text-white mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to Directory
        </Link>

        <div className="bg-[#111120] border border-border rounded-2xl overflow-hidden">
          <div className="aspect-[21/9] relative bg-[#1c1c30]">
            {charity.image_url ? (
              <img 
                src={charity.image_url} 
                alt={charity.name}
                className="object-cover w-full h-full opacity-60"
              />
            ) : (
              <div className="flex items-center justify-center w-full h-full text-muted">
                <Heart className="w-16 h-16 opacity-20" />
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-[#111120] to-transparent" />
            
            <div className="absolute bottom-0 left-0 w-full p-8 md:p-12">
              {charity.is_featured && (
                <span className="inline-block bg-primary/20 text-primary text-xs font-bold px-3 py-1 rounded-full mb-4 border border-primary/30">
                  Featured Partner
                </span>
              )}
              <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-4">
                {charity.name}
              </h1>
            </div>
          </div>

          <div className="p-8 md:p-12 pt-6">
            <div className="prose prose-invert max-w-none">
              <p className="text-lg text-muted leading-relaxed whitespace-pre-wrap">
                {charity.description}
              </p>
            </div>

            <div className="mt-12 flex flex-col sm:flex-row gap-4 items-center border-t border-border pt-8">
              <Link 
                href="/dashboard"
                className="w-full sm:w-auto bg-primary hover:bg-[#8bdd2a] text-[#0a0a14] font-bold py-3 px-8 rounded-md text-[14px] tracking-[0.02em] transition-all flex justify-center items-center gap-2"
              >
                <Heart className="w-5 h-5" />
                Select in Dashboard
              </Link>
              
              {charity.website && (
                <a 
                  href={charity.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-8 py-3 rounded-md border border-border text-white text-[14px] font-medium hover:bg-[#1c1c30] transition-colors flex justify-center items-center gap-2"
                >
                  Visit Website
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
