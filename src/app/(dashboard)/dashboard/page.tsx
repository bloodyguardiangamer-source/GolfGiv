import { ScoreEntry } from "@/components/dashboard/ScoreEntry";
import { SubscriptionCard } from "@/components/dashboard/SubscriptionCard";
import { CharityModule } from "@/components/dashboard/CharityModule";
import { ParticipationSummary } from "@/components/dashboard/ParticipationSummary";
import { WinningsOverview } from "@/components/dashboard/WinningsOverview";
import { LatestResults } from "@/components/dashboard/LatestResults";

export const metadata = {
  title: "Dashboard | GolfGive",
  description: "Manage your scores, subscription, and charity contributions.",
};

export default function DashboardPage() {
  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-serif font-bold text-white">Dashboard</h1>
        <p className="text-muted mt-1">Welcome back. Here's your overview.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (Main Actions) */}
        <div className="lg:col-span-2 space-y-6">
          <LatestResults />
          <ScoreEntry />
          <CharityModule />
        </div>

        {/* Right Column (Status & Summaries) */}
        <div className="space-y-6">
          <SubscriptionCard />
          <ParticipationSummary />
          <WinningsOverview />
        </div>
      </div>
    </div>
  );
}
