import { calculatePrizePool } from "./prize";
import { matchScores, evaluateEntries } from "./matcher";
import { calculateFrequencies, drawWeightedNumbers } from "./weighted";

console.log("--- DRAW ENGINE TESTS ---");

// Test 1: Matcher
const userScores = [5, 12, 23, 34, 45];
const drawNumbers = [5, 12, 23, 10, 11];
const matches = matchScores(userScores, drawNumbers);
console.log("Matcher Test:", matches === 3 ? "PASS" : "FAIL", `(Got ${matches})`);

// Test 2: Evaluate Entries
const entries = [
  { userId: "1", scores: [1, 2, 3, 4, 5] }, // 5 match
  { userId: "2", scores: [1, 2, 3, 4, 10] }, // 4 match
  { userId: "3", scores: [1, 2, 3, 11, 12] }, // 3 match
  { userId: "4", scores: [1, 2, 13, 14, 15] }, // 2 match (no prize)
];
const drawNum = [1, 2, 3, 4, 5];
const { matchCounts } = evaluateEntries(entries, drawNum);
console.log("Evaluate Test (5 match):", matchCounts[5] === 1 ? "PASS" : "FAIL");
console.log("Evaluate Test (4 match):", matchCounts[4] === 1 ? "PASS" : "FAIL");
console.log("Evaluate Test (3 match):", matchCounts[3] === 1 ? "PASS" : "FAIL");

// Test 3: Prize Pool without Rollover
const totalRevenue = 1000;
const prevRollover = 0;
const dist = calculatePrizePool(totalRevenue, prevRollover, matchCounts);
console.log("Prize Pool (Total Revenue):", dist.totalRevenue === 1000 ? "PASS" : "FAIL");
console.log("Prize Pool (Charity 20%):", dist.charityTotal === 200 ? "PASS" : "FAIL");
console.log("Prize Pool (Platform 20%):", dist.platformTotal === 200 ? "PASS" : "FAIL");
console.log("Prize Pool (Match 5 40%):", dist.prizes.match5.totalPool === 400 ? "PASS" : "FAIL");

// Test 4: Jackpot Rollover Logic (0 Match 5s)
const noWinMatchCounts = { 5: 0, 4: 2, 3: 5 };
const rolloverDist = calculatePrizePool(totalRevenue, 100, noWinMatchCounts);
// 40% of 1000 = 400. Previous rollover = 100. Total Match 5 pool should have been 500.
// Since nobody won, new rollover should be 500, and current Match 5 pool should be 0.
console.log("Rollover Logic (New Rollover):", rolloverDist.newRollover === 500 ? "PASS" : "FAIL");
console.log("Rollover Logic (0 paid out):", rolloverDist.prizes.match5.totalPool === 0 ? "PASS" : "FAIL");

// Test 5: Frequencies
const freqMap = calculateFrequencies([
  [1, 2, 3, 4, 5],
  [1, 2, 3, 4, 6]
]);
console.log("Frequencies Test:", freqMap.get(1) === 2 && freqMap.get(6) === 1 ? "PASS" : "FAIL");

console.log("--- ALL TESTS COMPLETED ---");
