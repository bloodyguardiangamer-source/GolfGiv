export interface PrizeConfig {
  match5Pct: number; // 0.40
  match4Pct: number; // 0.15
  match3Pct: number; // 0.05
  charityPct: number; // 0.20
  platformPct: number; // 0.20
}

export const DEFAULT_PRIZE_CONFIG: PrizeConfig = {
  match5Pct: 0.40,
  match4Pct: 0.15,
  match3Pct: 0.05,
  charityPct: 0.20,
  platformPct: 0.20,
};

export function calculatePrizePool(
  totalRevenue: number, 
  rollover: number, 
  matchCounts: { 5: number, 4: number, 3: number },
  config: PrizeConfig = DEFAULT_PRIZE_CONFIG
) {
  const currentDrawPool = totalRevenue;
  
  const rawMatch5Pool = (currentDrawPool * config.match5Pct) + rollover;
  const match4Pool = currentDrawPool * config.match4Pct;
  const match3Pool = currentDrawPool * config.match3Pct;
  
  const charityTotal = currentDrawPool * config.charityPct;
  const platformTotal = currentDrawPool * config.platformPct;

  let newRollover = 0;
  let match5Pool = rawMatch5Pool;

  // Jackpot rollover logic - if no 5-match, carry 40% (plus previous rollover) to next draw
  if (matchCounts[5] === 0) {
    newRollover = rawMatch5Pool;
    match5Pool = 0; // Nobody won it
  }

  return {
    totalRevenue,
    previousRollover: rollover,
    newRollover,
    charityTotal,
    platformTotal,
    prizes: {
      match5: {
        totalPool: match5Pool,
        perWinner: matchCounts[5] > 0 ? match5Pool / matchCounts[5] : 0
      },
      match4: {
        totalPool: match4Pool,
        perWinner: matchCounts[4] > 0 ? match4Pool / matchCounts[4] : 0
      },
      match3: {
        totalPool: match3Pool,
        perWinner: matchCounts[3] > 0 ? match3Pool / matchCounts[3] : 0
      }
    }
  };
}
