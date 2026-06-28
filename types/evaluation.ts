import type {
  EvaluationResultSchema,
  EvaluateRequestSchema,
  IndicatorSchema,
  KillerQuestionSchema,
  ScoredDimensionSchema,
  VerdictSchema,
} from "@/lib/schema";
import type { z } from "zod";

export type Indicator = z.infer<typeof IndicatorSchema>;
export type ScoredDimension = z.infer<typeof ScoredDimensionSchema>;
export type KillerQuestion = z.infer<typeof KillerQuestionSchema>;
export type Verdict = z.infer<typeof VerdictSchema>;
export type EvaluationResult = z.infer<typeof EvaluationResultSchema>;
export type EvaluateRequest = z.infer<typeof EvaluateRequestSchema>;

export const DIMENSION_LABELS: Record<
  keyof EvaluationResult["dimensions"],
  string
> = {
  market_size: "Market Size",
  competition_level: "Competition Level",
  build_complexity: "Build Complexity",
  monetisation_potential: "Monetisation Potential",
  founder_market_fit: "Founder-Market Fit",
  time_to_validate: "Time to Validate",
};

export const VERDICT_LABELS: Record<Verdict, string> = {
  build_it: "Build It",
  validate_first: "Validate First",
  park_it: "Park It",
};
