import { Preloader } from "@/components/animations/Preloader";
import { Hero } from "@/components/landing/Hero";
import { StatsBar } from "@/components/landing/StatsBar";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { CharityShowcase } from "@/components/landing/CharityShowcase";
import { PrizePool } from "@/components/landing/PrizePool";
import { DrawMechanics } from "@/components/landing/DrawMechanics";
import { SocialMarquee } from "@/components/landing/SocialMarquee";
import { SubscriptionCTA } from "@/components/landing/SubscriptionCTA";
import { Footer } from "@/components/layout/Footer";
import { SmoothScroll } from "@/components/layout/SmoothScroll";
import { PageTransition } from "@/components/layout/PageTransition";
import { Navbar } from "@/components/layout/Navbar";

export default function Home() {
  return (
    <SmoothScroll>
      <PageTransition>
        <main className="min-h-screen">
          <Preloader />
          <Navbar />
          <Hero />
          <StatsBar />
          <HowItWorks />
          <PrizePool />
          <CharityShowcase />
          <DrawMechanics />
          <SocialMarquee />
          <SubscriptionCTA />
          <Footer />
        </main>
      </PageTransition>
    </SmoothScroll>
  );
}
