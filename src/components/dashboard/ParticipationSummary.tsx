"use client";

import { useEffect, useState, useCallback } from "react";
import { Loader2 } from "lucide-react";
import { useRealtime } from "./RealtimeProvider";

export function ParticipationSummary() {
  const [scoreCount, setScoreCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const { refreshKey } = useRealtime();

  const fetchScores = useCallback(async () => {
    try {
      const res = await fetch("/api/scores");
      const data = await res.json();
      if (data.scores) {
        setScoreCount(data.scores.length);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Refetch on any realtime change
  useEffect(() => {
    fetchScores();
  }, [fetchScores, refreshKey]);

  // Calculate next draw date (e.g., 1st of next month)
  const nextDrawDate = new Date();
  nextDrawDate.setMonth(nextDrawDate.getMonth() + 1);
  nextDrawDate.setDate(1);

  if (isLoading) {
    return (
      <div className="bg-[#111120] border border-border rounded-xl p-6 flex justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  const isEligible = scoreCount === 5;

  return (
    <div className="bg-[#111120] border border-border rounded-xl p-6">
      <h4 className="text-[11px] font-medium text-muted uppercase tracking-widest mb-4">
        Next Draw
      </h4>
      
      <div className="mb-6">
        <div className="text-3xl font-bold text-white mb-1">
          {nextDrawDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center p-3 bg-[#1c1c30] rounded-md border border-border">
          <span className="text-sm text-muted">Scores Entered</span>
          <span className="font-bold text-white">{scoreCount} / 5</span>
        </div>
        <div className="flex justify-between items-center p-3 bg-[#1c1c30] rounded-md border border-border">
          <span className="text-sm text-muted">Status</span>
          <span className={`text-sm font-bold ${isEligible ? 'text-primary' : 'text-coral'}`}>
            {isEligible ? 'Eligible' : 'Needs More Scores'}
          </span>
        </div>
      </div>
    </div>
  );
}
