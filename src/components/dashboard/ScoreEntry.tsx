"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, Loader2 } from "lucide-react";
import { ScoreList } from "./ScoreList";
import { useRealtime } from "./RealtimeProvider";

type Score = {
  id: string;
  score: number;
  score_date: string;
};

export function ScoreEntry() {
  const [score, setScore] = useState("");
  const [date, setDate] = useState("");
  const [scores, setScores] = useState<Score[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { refreshKey, triggerRefresh } = useRealtime();

  const fetchScores = useCallback(async () => {
    try {
      const res = await fetch("/api/scores");
      if (!res.ok) throw new Error("Failed to fetch scores");
      const data = await res.json();
      setScores(data.scores || []);
    } catch (err: any) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Refetch whenever realtime detects a change
  useEffect(() => {
    fetchScores();
  }, [fetchScores, refreshKey]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/scores", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ score, score_date: date }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to add score");
      }

      setScore("");
      setDate("");
      // Trigger a global refresh so ParticipationSummary etc. also update
      triggerRefresh("scores");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/scores/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete score");
      setScores(scores.filter((s) => s.id !== id));
      triggerRefresh("scores");
    } catch (err: any) {
      console.error(err.message);
    }
  };

  const handleUpdate = async (id: string, newScore: number, newDate: string) => {
    try {
      const res = await fetch(`/api/scores/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ score: newScore, score_date: newDate }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update score");
      
      setScores(scores.map(s => s.id === id ? { ...s, score: newScore, score_date: newDate } : s));
      triggerRefresh("scores");
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div className="bg-[#111120] border border-border rounded-xl p-6">
      <h3 className="text-xl font-serif font-bold text-white mb-1">Enter Your Score</h3>
      <p className="text-muted text-sm mb-6">Enter up to 5 scores per month to be eligible for the draw.</p>

      {error && (
        <div className="mb-6 p-3 text-[13px] bg-red-500/10 text-red-500 border border-red-500/20 rounded-md">
          {error}
        </div>
      )}

      <form className="flex flex-col sm:flex-row gap-4" onSubmit={handleSubmit}>
        <div className="flex-1">
          <label className="block text-[11px] font-medium text-muted uppercase tracking-widest mb-2">
            Date Played
          </label>
          <input
            type="date"
            required
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full bg-[#1c1c30] border border-border rounded-md px-4 py-3 text-white text-[13px] placeholder:text-muted focus:border-primary focus:outline-none transition-colors"
          />
        </div>
        <div className="flex-1">
          <label className="block text-[11px] font-medium text-muted uppercase tracking-widest mb-2">
            Stableford Score
          </label>
          <input
            type="number"
            min="1"
            max="45"
            required
            placeholder="e.g. 36"
            value={score}
            onChange={(e) => setScore(e.target.value)}
            className="w-full bg-[#1c1c30] border border-border rounded-md px-4 py-3 text-white text-[13px] placeholder:text-muted focus:border-primary focus:outline-none transition-colors"
          />
        </div>
        <div className="flex items-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full sm:w-auto bg-primary hover:bg-[#8bdd2a] text-[#0a0a14] font-bold py-3 px-6 rounded-md text-[14px] tracking-[0.02em] transition-all duration-150 ease-out flex justify-center items-center gap-2 disabled:opacity-50 disabled:hover:scale-100 disabled:hover:bg-primary"
          >
            {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Plus className="w-5 h-5" />}
            Add Score
          </button>
        </div>
      </form>
      
      {scores.length >= 5 && (
        <p className="text-[11px] text-[#f5c842] mt-3">
          You have reached the 5-score limit. Adding a new score will automatically replace your oldest score.
        </p>
      )}

      <div className="mt-8">
        <h4 className="text-[11px] font-medium text-muted uppercase tracking-widest mb-4">
          Recent Scores
        </h4>
        <ScoreList 
          scores={scores} 
          isLoading={isLoading} 
          onDelete={handleDelete} 
          onUpdate={handleUpdate} 
        />
      </div>
    </div>
  );
}
