export function calculateFrequencies(allScores: number[][], max: number = 45): Map<number, number> {
  const freqs = new Map<number, number>();
  for (let i = 1; i <= max; i++) freqs.set(i, 0);

  allScores.forEach(scores => {
    scores.forEach(s => {
      if (freqs.has(s)) {
        freqs.set(s, freqs.get(s)! + 1);
      }
    });
  });

  return freqs;
}

export function drawWeightedNumbers(frequencies: Map<number, number>, count: number = 5, max: number = 45): number[] {
  const numbers = new Set<number>();
  
  // Create a weighted pool
  const pool: number[] = [];
  frequencies.forEach((freq, num) => {
    // Add number to pool freq times + 1 base chance
    for (let i = 0; i < freq + 1; i++) {
      pool.push(num);
    }
  });

  while (numbers.size < count) {
    const randomIndex = Math.floor(Math.random() * pool.length);
    numbers.add(pool[randomIndex]);
  }

  return Array.from(numbers).sort((a, b) => a - b);
}
