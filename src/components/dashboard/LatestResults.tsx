"use client";

import { useEffect, useState, useCallback } from "react";
import { Trophy, Circle, CheckCircle2, History, Loader2 } from "lucide-react";
import { useRealtime } from "./RealtimeProvider";

type DrawResult = {
  id: string;
  draw_date: string;
  numbers: number[];
  entry: {
    matches: number;
    prize_won: number;
    scores: number[];
  } | null;
};

export function LatestResults() {
  const [result, setResult] = useState<DrawResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { refreshKey } = useRealtime();

  const fetchLatest = useCallback(async () => {
    try {
      const res = await fetch("/api/user/latest-draw");
      const data = await res.json();
      if (data.draw) {
        setResult(data.draw);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Refetch on any realtime change (especially draws/draw_entries tables)
  useEffect(() => {
    fetchLatest();
  }, [fetchLatest, refreshKey]);

  if (isLoading) {
    return (
      <div className="bg-[#111120] border border-border rounded-xl p-8 flex justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  if (!result) {
    return (
      <div className="bg-[#111120] border border-border rounded-xl p-8 text-center">
        <History className="w-8 h-8 text-muted mx-auto mb-3" />
        <h3 className="text-white font-bold mb-1">No Draws Yet</h3>
        <p className="text-sm text-muted">Results will appear here after the next monthly draw.</p>
      </div>
    );
  }

  return (
    <div className="bg-[#111120] border border-border rounded-xl overflow-hidden">
      <div className="p-6 border-b border-border flex justify-between items-center bg-[#1c1c30]/50">
        <div>
          <h3 className="text-xl font-serif font-bold text-white mb-1">Latest Draw Results</h3>
          <p className="text-xs text-muted uppercase tracking-widest">{new Date(result.draw_date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })} Draw</p>
        </div>
        {result.entry && result.entry.matches >= 3 ? (
          <div className="bg-primary/20 border border-primary/30 rounded-full px-3 py-1 flex items-center gap-2">
            <Trophy className="w-4 h-4 text-primary" />
            <span className="text-primary text-xs font-bold uppercase tracking-wider">Winner</span>
          </div>
        ) : null}
      </div>

      <div className="p-6">
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {result.numbers.map((num, i) => {
            const isMatch = result.entry?.scores.includes(num);
            return (
              <div 
                key={i} 
                className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold transition-all border-2 ${
                  isMatch 
                  ? "bg-primary text-[#0a0a14] border-primary scale-110 shadow-[0_0_15px_rgba(151,255,42,0.3)]" 
                  : "bg-[#1c1c30] text-white border-border"
                }`}
              >
                {num}
              </div>
            );
          })}
        </div>

        {result.entry ? (
          <div className="bg-[#1c1c30] rounded-xl p-4 border border-border">
            <div className="flex justify-between items-center">
              <div className="space-y-1">
                <p className="text-xs text-muted uppercase font-bold tracking-tight">Your Performance</p>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-serif font-bold text-white">{result.entry.matches}</span>
                  <span className="text-muted text-sm">matches found</span>
                </div>
              </div>
              <div className="text-right space-y-1">
                <p className="text-xs text-muted uppercase font-bold tracking-tight">Prize Won</p>
                <p className={`text-2xl font-mono font-bold ${result.entry.prize_won > 0 ? "text-primary" : "text-white"}`}>
                  £{result.entry.prize_won.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-[#1c1c30] rounded-xl p-4 border border-border border-dashed text-center">
            <p className="text-sm text-muted italic">You did not have 5 scores entered for this draw.</p>
          </div>
        )}
      </div>
    </div>
  );
}
