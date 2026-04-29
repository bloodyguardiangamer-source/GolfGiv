"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { Loader2, Upload, Check } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useRealtime } from "./RealtimeProvider";

export function WinningsOverview() {
  const [winnings, setWinnings] = useState<any[]>([]);
  const [totalWon, setTotalWon] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [uploadingId, setUploadingId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeUploadWinId, setActiveUploadWinId] = useState<string | null>(null);
  const { refreshKey } = useRealtime();

  const fetchWinnings = useCallback(async () => {
    try {
      const res = await fetch("/api/user/winnings");
      const data = await res.json();
      if (data.winnings) {
        setWinnings(data.winnings);
        const total = data.winnings.reduce((acc: number, curr: any) => acc + Number(curr.prize_amount || 0), 0);
        setTotalWon(total);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Refetch on any realtime change (especially winners table)
  useEffect(() => {
    fetchWinnings();
  }, [fetchWinnings, refreshKey]);

  const handleUploadClick = (winId: string) => {
    setActiveUploadWinId(winId);
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !activeUploadWinId) return;

    setUploadingId(activeUploadWinId);
    const supabase = createClient();
    const fileExt = file.name.split('.').pop();
    const filePath = `${activeUploadWinId}-${Date.now()}.${fileExt}`;

    try {
      const { error: uploadError } = await supabase.storage
        .from('winner-proofs')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Update the local state to show it's uploaded
      alert("Proof uploaded successfully! We will review it shortly.");
      
    } catch (err: any) {
      alert("Failed to upload proof: " + err.message);
    } finally {
      setUploadingId(null);
      setActiveUploadWinId(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  if (isLoading) {
    return (
      <div className="bg-[#111120] border border-[#f5c842]/40 rounded-xl p-6 flex justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-[#f5c842]" />
      </div>
    );
  }

  return (
    <div className="bg-[#111120] border border-[#f5c842]/40 rounded-xl p-6 relative overflow-hidden">
      {/* Subtle gold glow background */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-[#f5c842]/5 rounded-full blur-2xl pointer-events-none"></div>
      
      <h4 className="text-[11px] font-medium text-muted uppercase tracking-widest mb-4">
        Your Winnings
      </h4>
      
      <div className="mb-6 relative z-10">
        <div className="text-4xl font-bold text-[#f5c842] tracking-tight mb-1">
          £{totalWon.toLocaleString(undefined, { minimumFractionDigits: 2 })}
        </div>
        <p className="text-sm text-muted">Total lifetime winnings</p>
      </div>

      <div className="relative z-10 space-y-3">
        <input 
          type="file" 
          ref={fileInputRef} 
          className="hidden" 
          accept="image/*,.pdf" 
          onChange={handleFileChange} 
        />
        
        {winnings.length === 0 ? (
          <div className="text-center p-4 bg-[#1c1c30]/50 rounded-md border border-border backdrop-blur-sm">
            <p className="text-sm text-muted">You haven't won any prizes yet. Keep entering your scores!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {winnings.map((win) => (
              <div key={win.id} className="p-3 bg-[#1c1c30] rounded-md border border-border flex justify-between items-center">
                <div>
                  <p className="text-sm font-bold text-white">£{Number(win.prize_amount).toLocaleString()}</p>
                  <p className="text-xs text-muted">{win.draw_entries?.draws?.draw_month ? new Date(win.draw_entries.draws.draw_month).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'Unknown'}</p>
                  <p className="text-[10px] text-muted/60 uppercase tracking-wider">{win.payment_status === 'paid' ? '✓ Paid' : 'Pending payout'}</p>
                </div>
                <button 
                  onClick={() => handleUploadClick(win.id)}
                  disabled={uploadingId === win.id}
                  className="flex items-center gap-2 text-xs font-bold text-primary hover:text-white transition-colors border border-primary/50 hover:border-white px-3 py-1.5 rounded-md disabled:opacity-50"
                >
                  {uploadingId === win.id ? (
                    <Loader2 className="w-3 h-3 animate-spin" />
                  ) : (
                    <Upload className="w-3 h-3" />
                  )}
                  {uploadingId === win.id ? 'Uploading...' : 'Proof'}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
