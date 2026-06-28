import { z } from "zod";

export const IndicatorSchema = z.enum(["red", "amber", "green"]);

export const ScoredDimensionSchema = z.object({
  score: z.union([
    z.literal(1),
    z.literal(2),
    z.literal(3),
    z.literal(4),
    z.literal(5),
  ]),
  indicator: IndicatorSchema,
  rationale: z.string().min(1).max(200),
});

export const KillerQuestionSchema = z.object({
  question: z.string().min(1).max(300),
  pass_signal: z.string().min(1).max(200),
  fail_signal: z.string().min(1).max(200),
});

export const VerdictSchema = z.enum([
  "build_it",
  "validate_first",
  "park_it",
]);

export const EvaluationResultSchema = z.object({
  verdict: VerdictSchema,
  summary: z.string().min(1).max(500),
  dimensions: z.object({
    market_size: ScoredDimensionSchema,
    competition_level: ScoredDimensionSchema,
    build_complexity: ScoredDimensionSchema,
    monetisation_potential: ScoredDimensionSchema,
    founder_market_fit: ScoredDimensionSchema,
    time_to_validate: ScoredDimensionSchema,
  }),
  killer_question: KillerQuestionSchema,
});

export const EvaluateRequestSchema = z.object({
  idea: z
    .string()
    .trim()
    .min(20, "Please describe your idea in at least 20 characters.")
    .max(2000, "Please keep your idea under 2,000 characters."),
});
