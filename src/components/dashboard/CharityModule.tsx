"use client";

import { useState, useEffect, useCallback } from "react";
import { Heart, Search, Loader2, Check } from "lucide-react";
import { useRealtime } from "./RealtimeProvider";

type Charity = {
  id: string;
  name: string;
  description: string;
  image_url: string;
};

export function CharityModule() {
  const [charities, setCharities] = useState<Charity[]>([]);
  const [selectedCharity, setSelectedCharity] = useState<Charity | null>(null);
  const [percentage, setPercentage] = useState(10);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { refreshKey } = useRealtime();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [charitiesRes, profileRes] = await Promise.all([
          fetch("/api/charities"),
          fetch("/api/user/profile")
        ]);
        
        let loadedCharities: Charity[] = [];
        if (charitiesRes.ok) {
          const data = await charitiesRes.json();
          loadedCharities = data.charities || [];
          setCharities(loadedCharities);
        }
        
        if (profileRes.ok) {
          const profile = await profileRes.json();
          if (profile?.profile) {
            setPercentage(profile.profile.charity_percentage || 10);
            if (profile.profile.charity_id && loadedCharities.length > 0) {
              const selected = loadedCharities.find(c => c.id === profile.profile.charity_id);
              if (selected) setSelectedCharity(selected);
            }
          }
        }
      } catch (e) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [refreshKey]);

  const handleSave = async () => {
    if (!selectedCharity) return;
    setIsSaving(true);
    try {
      await fetch("/api/user/charity", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          charity_id: selectedCharity.id,
          charity_percentage: percentage
        })
      });
      setIsModalOpen(false);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSaving(false);
    }
  };

  const filteredCharities = charities.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="bg-[#111120] border border-border rounded-xl p-6">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-xl font-serif font-bold text-white mb-1">Your Impact</h3>
          <p className="text-muted text-sm">Review your selected charity and contribution.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="text-[12px] font-bold tracking-widest uppercase text-primary hover:text-[#0a0a14] transition-colors border border-primary hover:bg-primary rounded-md px-3 py-1.5"
        >
          {selectedCharity ? "Change" : "Select Charity"}
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-8"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>
      ) : selectedCharity ? (
        <div className="bg-[#1c1c30] rounded-xl p-6 border border-border">
          <div className="flex items-center gap-4 mb-6">
            {selectedCharity.image_url ? (
              <img src={selectedCharity.image_url} alt={selectedCharity.name} className="w-16 h-16 rounded-full object-cover border-2 border-[#2c2c48]" />
            ) : (
              <div className="w-16 h-16 rounded-full bg-[#111120] border-2 border-border flex items-center justify-center flex-shrink-0">
                <Heart className="w-6 h-6 text-primary" />
              </div>
            )}
            <div>
              <h4 className="text-lg font-bold text-white leading-tight">{selectedCharity.name}</h4>
              <p className="text-sm text-muted line-clamp-1 mt-1">{selectedCharity.description}</p>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted">Current Contribution</span>
              <span className="font-bold text-white">{percentage}% of your fee</span>
            </div>
            <div className="h-2 bg-[#111120] rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary rounded-full transition-all duration-500 ease-out"
                style={{ width: `${percentage}%` }}
              />
            </div>
            <p className="text-[11px] text-muted text-right">You can adjust this between 10% and 100%.</p>
          </div>
        </div>
      ) : (
        <div className="bg-[#1c1c30] border border-border border-dashed rounded-xl p-8 text-center flex flex-col items-center justify-center cursor-pointer hover:bg-[#2c2c48] transition-colors group" onClick={() => setIsModalOpen(true)}>
          <Heart className="w-8 h-8 text-muted mb-3 group-hover:text-primary transition-colors" />
          <h4 className="text-white font-bold mb-1">No Charity Selected</h4>
          <p className="text-sm text-muted mb-4">Please select a charity to complete your profile.</p>
          <span className="text-primary font-bold text-sm">Select Now &rarr;</span>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          <div className="relative bg-[#111120] border border-border rounded-xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl">
            <div className="p-6 border-b border-border">
              <h3 className="text-2xl font-serif font-bold text-white">Select Charity</h3>
              <p className="text-muted text-sm mt-1">Choose where your impact goes.</p>
            </div>

            <div className="p-6 overflow-y-auto flex-1 min-h-[300px]">
              <div className="relative mb-6">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                <input 
                  type="text" 
                  placeholder="Search charities..." 
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="w-full bg-[#1c1c30] border border-border rounded-md pl-10 pr-4 py-3 text-sm text-white focus:outline-none focus:border-primary"
                />
              </div>

              <div className="grid gap-3">
                {filteredCharities.length > 0 ? (
                  filteredCharities.map(charity => (
                    <div 
                      key={charity.id}
                      onClick={() => setSelectedCharity(charity)}
                      className={`p-4 rounded-xl border cursor-pointer flex gap-4 items-center transition-all ${
                        selectedCharity?.id === charity.id 
                          ? 'border-primary bg-primary/5' 
                          : 'border-border bg-[#1c1c30] hover:border-primary/50'
                      }`}
                    >
                      {charity.image_url ? (
                        <img src={charity.image_url} alt="" className="w-12 h-12 rounded-full object-cover flex-shrink-0" />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-[#111120] flex items-center justify-center flex-shrink-0">
                          <Heart className="w-5 h-5 text-muted" />
                        </div>
                      )}
                      <div className="flex-1">
                        <h4 className="font-bold text-white">{charity.name}</h4>
                        <p className="text-xs text-muted line-clamp-1">{charity.description}</p>
                      </div>
                      {selectedCharity?.id === charity.id && (
                        <Check className="w-5 h-5 text-primary flex-shrink-0" />
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted text-sm">No charities found matching "{search}"</p>
                  </div>
                )}
              </div>

              <div className="mt-8 border-t border-border pt-6">
                <h4 className="text-sm font-bold text-white mb-4">Contribution Percentage</h4>
                <div className="flex items-center gap-6">
                  <input 
                    type="range" 
                    min="10" 
                    max="100" 
                    step="5"
                    value={percentage}
                    onChange={(e) => setPercentage(parseInt(e.target.value))}
                    className="flex-1 accent-primary"
                  />
                  <span className="text-xl font-bold text-primary font-mono w-16 text-right">{percentage}%</span>
                </div>
                <p className="text-xs text-muted mt-2">Minimum required contribution is 10%.</p>
              </div>
            </div>

            <div className="p-6 border-t border-border flex justify-end gap-3 bg-[#1c1c30] rounded-b-xl">
              <button onClick={() => setIsModalOpen(false)} className="px-6 py-2.5 rounded-md border border-border text-white text-sm font-bold hover:bg-[#2c2c48] transition-colors">
                Cancel
              </button>
              <button 
                onClick={handleSave} 
                disabled={!selectedCharity || isSaving}
                className="px-6 py-2.5 rounded-md bg-primary text-[#0a0a14] text-sm font-bold hover:bg-[#8bdd2a] transition-all disabled:opacity-50 flex items-center gap-2"
              >
                {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
                Save Selection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
