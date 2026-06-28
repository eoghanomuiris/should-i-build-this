import type { Indicator, ScoredDimension } from "@/types/evaluation";

export function scoreToIndicator(score: number): Indicator {
  if (score >= 4) return "green";
  if (score === 3) return "amber";
  return "red";
}

export function normalizeDimension(
  dimension: ScoredDimension,
): ScoredDimension {
  const expected = scoreToIndicator(dimension.score);
  if (dimension.indicator !== expected) {
    return { ...dimension, indicator: expected };
  }
  return dimension;
}
