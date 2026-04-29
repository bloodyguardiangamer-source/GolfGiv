"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Search, Heart, Loader2 } from "lucide-react";

type Charity = {
  id: string;
  name: string;
  description: string;
  image_url: string;
  website: string;
  is_featured: boolean;
};

export default function CharitiesDirectory() {
  const [charities, setCharities] = useState<Charity[]>([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCharities = async () => {
      setIsLoading(true);
      try {
        const url = search ? `/api/charities?search=${encodeURIComponent(search)}` : "/api/charities";
        const res = await fetch(url);
        const data = await res.json();
        setCharities(data.charities || []);
      } catch (err) {
        console.error("Failed to fetch charities", err);
      } finally {
        setIsLoading(false);
      }
    };

    // Debounce search
    const timer = setTimeout(() => {
      fetchCharities();
    }, 300);

    return () => clearTimeout(timer);
  }, [search]);

  return (
    <div className="min-h-screen bg-[#0a0a14] pt-24 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-12">
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-white">
            Our Supported <span className="text-primary">Charities</span>
          </h1>
          <p className="text-muted text-lg max-w-2xl mx-auto">
            Discover the organizations making a difference. Select your preferred charity and we'll contribute a percentage of your subscription fee to their cause.
          </p>
        </div>

        <div className="relative max-w-xl mx-auto">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-muted" />
          </div>
          <input
            type="text"
            placeholder="Search charities..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#111120] border border-border rounded-full py-4 pl-12 pr-6 text-white placeholder-muted focus:outline-none focus:border-primary transition-colors"
          />
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {charities.map((charity) => (
              <Link href={`/charities/${charity.id}`} key={charity.id} className="group">
                <div className="bg-[#111120] border border-border rounded-xl overflow-hidden hover:border-primary/50 transition-all duration-300 hover:-translate-y-1 h-full flex flex-col">
                  <div className="aspect-[16/9] relative bg-[#1c1c30] overflow-hidden">
                    {charity.image_url ? (
                      <img 
                        src={charity.image_url} 
                        alt={charity.name}
                        className="object-cover w-full h-full opacity-80 group-hover:opacity-100 transition-opacity duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex items-center justify-center w-full h-full text-muted">
                        <Heart className="w-8 h-8" />
                      </div>
                    )}
                    {charity.is_featured && (
                      <div className="absolute top-3 right-3 bg-primary text-[#0a0a14] text-xs font-bold px-3 py-1 rounded-full">
                        Featured
                      </div>
                    )}
                  </div>
                  <div className="p-6 flex-1 flex flex-col">
                    <h3 className="text-xl font-bold text-white mb-2 font-serif group-hover:text-primary transition-colors">
                      {charity.name}
                    </h3>
                    <p className="text-muted text-sm line-clamp-3 mb-4 flex-1">
                      {charity.description}
                    </p>
                    <span className="text-primary text-sm font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                      Learn more &rarr;
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
        
        {!isLoading && charities.length === 0 && (
          <div className="text-center py-20 bg-[#111120] border border-border rounded-xl">
            <Heart className="w-12 h-12 text-muted mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">No charities found</h3>
            <p className="text-muted">Try adjusting your search terms.</p>
          </div>
        )}
      </div>
    </div>
  );
}
