const positive = new Set(["good","great","win","growth","rise","up","surge","beat","record","strong"]);
const negative = new Set(["bad","loss","fall","down","drop","decline","weak","crash","fail","risk"]);
export function quickSentiment(text: string): number {
  const tokens = (text || "").toLowerCase().split(/[^a-z]+/g).filter(Boolean);
  let score = 0;
  for (const t of tokens) {
    if (positive.has(t)) score += 1;
    if (negative.has(t)) score -= 1;
  }
  return Math.max(-1, Math.min(1, score / Math.max(1, tokens.length / 10)));
}
