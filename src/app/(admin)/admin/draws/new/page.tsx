"use client";

import { useState } from "react";
import { ArrowLeft, Ticket, Settings, Zap, Play, Trophy, DollarSign, Percent } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AdminStatusModal } from "@/components/admin/AdminStatusModal";

export default function NewDrawPage() {
  const router = useRouter();
  const [mode, setMode] = useState<"random" | "algorithmic">("random");
  const [isSimulating, setIsSimulating] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [simulationResult, setSimulationResult] = useState<any>(null);

  // Prize Pool Configuration
  const [prizePoolMode, setPrizePoolMode] = useState<"auto" | "manual">("auto");
  const [customPrizePool, setCustomPrizePool] = useState<string>("5000");
  const [jackpotPercent, setJackpotPercent] = useState<string>("50");
  const [fourMatchPercent, setFourMatchPercent] = useState<string>("30");
  const [threeMatchPercent, setThreeMatchPercent] = useState<string>("20");

  const [statusModal, setStatusModal] = useState<{
    isOpen: boolean;
    type: "success" | "error";
    title: string;
    message: string;
  }>({
    isOpen: false,
    type: "success",
    title: "",
    message: "",
  });

  const totalSplitPercent = Number(jackpotPercent || 0) + Number(fourMatchPercent || 0) + Number(threeMatchPercent || 0);
  const isSplitValid = totalSplitPercent === 100;

  const handleSimulate = async () => {
    setIsSimulating(true);
    try {
      const res = await fetch("/api/draw/simulate", { method: "POST" });
      const data = await res.json();
      setSimulationResult(data);
    } catch (e) {
      console.error(e);
      setStatusModal({
        isOpen: true,
        type: "error",
        title: "Simulation Failed",
        message: "An unexpected error occurred while running the simulation."
      });
    } finally {
      setIsSimulating(false);
    }
  };

  const handlePublish = async () => {
    if (!simulationResult?.drawNumbers) return;

    if (prizePoolMode === "manual" && !isSplitValid) {
      setStatusModal({
        isOpen: true,
        type: "error",
        title: "Invalid Prize Split",
        message: `Prize tier percentages must add up to 100%. Currently: ${totalSplitPercent}%`
      });
      return;
    }
    
    setIsPublishing(true);
    try {
      const payload: any = { drawNumbers: simulationResult.drawNumbers };
      
      if (prizePoolMode === "manual") {
        payload.customPrizePool = Number(customPrizePool);
        payload.prizeSplit = {
          jackpot: Number(jackpotPercent),
          fourMatch: Number(fourMatchPercent),
          threeMatch: Number(threeMatchPercent),
        };
      }

      const res = await fetch("/api/draw/publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      
      if (data.error) {
        setStatusModal({
          isOpen: true,
          type: "error",
          title: "Publish Failed",
          message: data.error
        });
        return;
      }
      
      setStatusModal({
        isOpen: true,
        type: "success",
        title: "Draw Published",
        message: `Draw published with a $${Number(data.prizeDistribution?.totalPool || customPrizePool).toLocaleString()} prize pool! Winners have been notified.`
      });
      
      setTimeout(() => {
        router.push("/admin/draws");
      }, 2000);
    } catch (e: any) {
      console.error(e);
      setStatusModal({
        isOpen: true,
        type: "error",
        title: "Publish Error",
        message: e.message || "Failed to publish the draw. Please try again."
      });
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      <div className="flex items-center gap-4">
        <Link href="/admin/draws" className="p-2 hover:bg-[#1c1c30] rounded-full transition-colors text-muted hover:text-white">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-serif font-bold text-white mb-2">Configure Draw</h1>
          <p className="text-muted text-sm">Select mode, set prize pool, run simulation, and publish.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Config Panel */}
        <div className="space-y-6">
          {/* Step 1: Draw Mode */}
          <div className="bg-surface border border-border rounded-xl p-6">
            <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
              <Settings className="w-5 h-5 text-primary" />
              1. Select Draw Mode
            </h2>
            
            <div className="space-y-4">
              <button
                onClick={() => setMode("random")}
                className={`w-full flex items-start gap-4 p-4 rounded-lg border text-left transition-all ${
                  mode === "random" 
                    ? "border-primary bg-primary/10" 
                    : "border-border bg-[#1c1c30] hover:border-muted"
                }`}
              >
                <div className={`p-2 rounded-md ${mode === "random" ? "bg-primary text-[#0a0a14]" : "bg-[#2c2c48] text-white"}`}>
                  <Ticket className="w-5 h-5" />
                </div>
                <div>
                  <h3 className={`font-bold ${mode === "random" ? "text-primary" : "text-white"}`}>Standard Random</h3>
                  <p className="text-sm text-muted mt-1">Fisher-Yates shuffle across 1-45. Standard lottery odds.</p>
                </div>
              </button>
              
              <button
                onClick={() => setMode("algorithmic")}
                className={`w-full flex items-start gap-4 p-4 rounded-lg border text-left transition-all ${
                  mode === "algorithmic" 
                    ? "border-primary bg-primary/10" 
                    : "border-border bg-[#1c1c30] hover:border-muted"
                }`}
              >
                <div className={`p-2 rounded-md ${mode === "algorithmic" ? "bg-primary text-[#0a0a14]" : "bg-[#2c2c48] text-white"}`}>
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <h3 className={`font-bold ${mode === "algorithmic" ? "text-primary" : "text-white"}`}>Algorithmic Weighted</h3>
                  <p className="text-sm text-muted mt-1">Frequency analysis with weighted probability based on score pools.</p>
                </div>
              </button>
            </div>
          </div>

          {/* Step 2: Prize Pool Configuration */}
          <div className="bg-surface border border-[#f5c842]/30 rounded-xl p-6">
            <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-[#f5c842]" />
              2. Configure Prize Pool
            </h2>

            {/* Mode Toggle */}
            <div className="flex gap-2 mb-6">
              <button
                onClick={() => setPrizePoolMode("auto")}
                className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all ${
                  prizePoolMode === "auto"
                    ? "bg-[#f5c842] text-[#0a0a14]"
                    : "bg-[#1c1c30] text-muted border border-border hover:text-white"
                }`}
              >
                Auto (from Subs)
              </button>
              <button
                onClick={() => setPrizePoolMode("manual")}
                className={`flex-1 py-2.5 rounded-lg text-sm font-bold transition-all ${
                  prizePoolMode === "manual"
                    ? "bg-[#f5c842] text-[#0a0a14]"
                    : "bg-[#1c1c30] text-muted border border-border hover:text-white"
                }`}
              >
                Manual Amount
              </button>
            </div>

            {prizePoolMode === "auto" ? (
              <div className="p-4 bg-[#1c1c30] border border-border rounded-lg">
                <p className="text-sm text-muted mb-2">Prize pool will be automatically calculated from:</p>
                <ul className="text-sm text-white space-y-1.5">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                    Active subscriber count × $10
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#f5c842]" />
                    Previous month&apos;s jackpot rollover
                  </li>
                </ul>
              </div>
            ) : (
              <div className="space-y-5">
                {/* Custom Amount Input */}
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-widest text-muted mb-2">
                    Total Prize Pool
                  </label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#f5c842] font-bold text-lg">$</span>
                    <input
                      type="number"
                      value={customPrizePool}
                      onChange={(e) => setCustomPrizePool(e.target.value)}
                      min="100"
                      step="100"
                      className="w-full pl-10 pr-4 py-3 bg-[#1c1c30] border border-border rounded-lg text-white text-xl font-bold focus:outline-none focus:border-[#f5c842] focus:ring-1 focus:ring-[#f5c842]/30 transition-all"
                      placeholder="5000"
                    />
                  </div>
                </div>

                {/* Prize Split */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-[11px] font-bold uppercase tracking-widest text-muted flex items-center gap-1.5">
                      <Percent className="w-3.5 h-3.5" />
                      Prize Tier Split
                    </label>
                    <span className={`text-[11px] font-bold uppercase tracking-widest ${isSplitValid ? 'text-primary' : 'text-[#ff6b4a]'}`}>
                      {totalSplitPercent}% / 100%
                    </span>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-[#f5c842] font-medium">5 Matches (Jackpot)</span>
                          <span className="text-xs text-muted">${((Number(customPrizePool) * Number(jackpotPercent)) / 100).toLocaleString()}</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={jackpotPercent}
                          onChange={(e) => setJackpotPercent(e.target.value)}
                          className="w-full h-1.5 bg-[#2c2c48] rounded-full appearance-none cursor-pointer accent-[#f5c842]"
                        />
                      </div>
                      <div className="w-16">
                        <input
                          type="number"
                          value={jackpotPercent}
                          onChange={(e) => setJackpotPercent(e.target.value)}
                          min="0"
                          max="100"
                          className="w-full px-2 py-1.5 bg-[#1c1c30] border border-border rounded text-white text-sm text-center font-bold focus:outline-none focus:border-[#f5c842]"
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-primary font-medium">4 Matches</span>
                          <span className="text-xs text-muted">${((Number(customPrizePool) * Number(fourMatchPercent)) / 100).toLocaleString()}</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={fourMatchPercent}
                          onChange={(e) => setFourMatchPercent(e.target.value)}
                          className="w-full h-1.5 bg-[#2c2c48] rounded-full appearance-none cursor-pointer accent-primary"
                        />
                      </div>
                      <div className="w-16">
                        <input
                          type="number"
                          value={fourMatchPercent}
                          onChange={(e) => setFourMatchPercent(e.target.value)}
                          min="0"
                          max="100"
                          className="w-full px-2 py-1.5 bg-[#1c1c30] border border-border rounded text-white text-sm text-center font-bold focus:outline-none focus:border-primary"
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-primary/70 font-medium">3 Matches</span>
                          <span className="text-xs text-muted">${((Number(customPrizePool) * Number(threeMatchPercent)) / 100).toLocaleString()}</span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={threeMatchPercent}
                          onChange={(e) => setThreeMatchPercent(e.target.value)}
                          className="w-full h-1.5 bg-[#2c2c48] rounded-full appearance-none cursor-pointer accent-primary"
                        />
                      </div>
                      <div className="w-16">
                        <input
                          type="number"
                          value={threeMatchPercent}
                          onChange={(e) => setThreeMatchPercent(e.target.value)}
                          min="0"
                          max="100"
                          className="w-full px-2 py-1.5 bg-[#1c1c30] border border-border rounded text-white text-sm text-center font-bold focus:outline-none focus:border-primary"
                        />
                      </div>
                    </div>
                  </div>

                  {!isSplitValid && (
                    <p className="text-[#ff6b4a] text-xs mt-2 font-medium">
                      ⚠ Percentages must total 100%. Adjust the sliders above.
                    </p>
                  )}
                </div>

                {/* Visual Breakdown */}
                <div className="flex gap-0.5 h-3 rounded-full overflow-hidden mt-2">
                  <div className="bg-[#f5c842] transition-all" style={{ width: `${jackpotPercent}%` }} />
                  <div className="bg-primary transition-all" style={{ width: `${fourMatchPercent}%` }} />
                  <div className="bg-primary/50 transition-all" style={{ width: `${threeMatchPercent}%` }} />
                </div>
                <div className="flex justify-between text-[10px] text-muted font-medium">
                  <span>Jackpot {jackpotPercent}%</span>
                  <span>4-Match {fourMatchPercent}%</span>
                  <span>3-Match {threeMatchPercent}%</span>
                </div>
              </div>
            )}
          </div>

          {/* Simulate Button */}
          <button
            onClick={handleSimulate}
            disabled={isSimulating || (prizePoolMode === "manual" && !isSplitValid)}
            className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary-deep text-[#0a0a14] px-5 py-3 rounded-lg font-bold text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSimulating ? (
              <span className="w-4 h-4 border-2 border-[#0a0a14] border-t-transparent rounded-full animate-spin" />
            ) : (
              <Play className="w-4 h-4" />
            )}
            {isSimulating ? "Simulating..." : "Run Simulation"}
          </button>
        </div>

        {/* Simulation Results */}
        <div className="space-y-6">
          <div className="bg-surface border border-[#f5c842]/30 rounded-xl p-6 min-h-[400px]">
            <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
              <Trophy className="w-5 h-5 text-[#f5c842]" />
              3. Simulation Results
            </h2>
            
            {!simulationResult ? (
              <div className="h-64 flex flex-col items-center justify-center text-muted/50 border-2 border-dashed border-border rounded-lg">
                <Ticket className="w-12 h-12 mb-4 opacity-50" />
                <p>Run a simulation to preview winners.</p>
              </div>
            ) : (
              <div className="space-y-6 animate-in fade-in zoom-in-95">
                <div className="bg-[#1c1c30] border border-border p-5 rounded-lg text-center">
                  <p className="text-[11px] font-medium tracking-[0.12em] uppercase text-muted mb-3">Drawn Numbers</p>
                  <div className="flex items-center justify-center gap-3">
                    {simulationResult.drawNumbers?.map((n: number, i: number) => (
                      <div key={i} className="w-12 h-12 flex items-center justify-center bg-primary text-[#0a0a14] font-bold text-xl rounded-full">
                        {n}
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-[#1c1c30] border border-border p-4 rounded-lg">
                    <p className="text-[11px] font-medium tracking-[0.12em] uppercase text-muted mb-1">Total Entries</p>
                    <span className="text-2xl font-bold text-white">{simulationResult.totalEntries || 0}</span>
                  </div>
                  <div className="bg-[#1c1c30] border border-[#f5c842]/30 p-4 rounded-lg">
                    <p className="text-[11px] font-medium tracking-[0.12em] uppercase text-[#f5c842]/70 mb-1">Prize Pool</p>
                    <span className="text-2xl font-bold text-[#f5c842]">
                      ${prizePoolMode === "manual" 
                        ? Number(customPrizePool).toLocaleString() 
                        : (simulationResult.prizeDistribution?.totalPool || 0).toLocaleString()
                      }
                    </span>
                    {prizePoolMode === "manual" && (
                      <span className="block text-[10px] text-[#f5c842]/50 mt-0.5">Manual override</span>
                    )}
                  </div>
                </div>

                <div className="space-y-3">
                  <p className="text-[11px] font-medium tracking-[0.12em] uppercase text-muted mb-1">Projected Winners</p>
                  <div className="flex justify-between items-center text-sm border-b border-border pb-2">
                    <span className="text-white">5 Matches (Jackpot)</span>
                    <div className="text-right">
                      <span className="font-bold text-[#f5c842]">{simulationResult.matchCounts?.five || 0}</span>
                      {prizePoolMode === "manual" && (simulationResult.matchCounts?.five || 0) > 0 && (
                        <span className="text-xs text-muted ml-2">
                          (${Math.round((Number(customPrizePool) * Number(jackpotPercent)) / 100 / (simulationResult.matchCounts?.five || 1)).toLocaleString()} each)
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex justify-between items-center text-sm border-b border-border pb-2">
                    <span className="text-white">4 Matches</span>
                    <div className="text-right">
                      <span className="font-bold text-primary">{simulationResult.matchCounts?.four || 0}</span>
                      {prizePoolMode === "manual" && (simulationResult.matchCounts?.four || 0) > 0 && (
                        <span className="text-xs text-muted ml-2">
                          (${Math.round((Number(customPrizePool) * Number(fourMatchPercent)) / 100 / (simulationResult.matchCounts?.four || 1)).toLocaleString()} each)
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-white">3 Matches</span>
                    <div className="text-right">
                      <span className="font-bold text-primary">{simulationResult.matchCounts?.three || 0}</span>
                      {prizePoolMode === "manual" && (simulationResult.matchCounts?.three || 0) > 0 && (
                        <span className="text-xs text-muted ml-2">
                          (${Math.round((Number(customPrizePool) * Number(threeMatchPercent)) / 100 / (simulationResult.matchCounts?.three || 1)).toLocaleString()} each)
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <button
                  onClick={handlePublish}
                  disabled={isPublishing || (prizePoolMode === "manual" && !isSplitValid)}
                  className="w-full mt-4 bg-transparent border-2 border-[#f5c842] text-[#f5c842] hover:bg-[#f5c842] hover:text-[#0a0a14] px-5 py-3 rounded-lg font-bold text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isPublishing ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      Publishing...
                    </span>
                  ) : (
                    `Confirm & Publish Draw · $${prizePoolMode === "manual" ? Number(customPrizePool).toLocaleString() : (simulationResult.prizeDistribution?.totalPool || 0).toLocaleString()}`
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <AdminStatusModal 
        isOpen={statusModal.isOpen}
        onClose={() => setStatusModal(prev => ({ ...prev, isOpen: false }))}
        type={statusModal.type}
        title={statusModal.title}
        message={statusModal.message}
      />
    </div>
  );
}
