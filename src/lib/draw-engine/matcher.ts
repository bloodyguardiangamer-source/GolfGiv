export function matchScores(userScores: number[], drawNumbers: number[]): number {
  return userScores.filter(s => drawNumbers.includes(s)).length;
}

export function evaluateEntries(entries: { userId: string, scores: number[] }[], drawNumbers: number[]) {
  const results = entries.map(entry => {
    const matches = matchScores(entry.scores, drawNumbers);
    return { ...entry, matches };
  });

  // Calculate totals
  const matchCounts = { 5: 0, 4: 0, 3: 0 };
  results.forEach(r => {
    if (r.matches === 5) matchCounts[5]++;
    else if (r.matches === 4) matchCounts[4]++;
    else if (r.matches === 3) matchCounts[3]++;
  });

  return { results, matchCounts };
}
