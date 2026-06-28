import { DimensionCard } from "@/components/DimensionCard";
import { KillerQuestionCard } from "@/components/KillerQuestionCard";
import { VerdictBanner } from "@/components/VerdictBanner";
import type { EvaluationResult } from "@/types/evaluation";
import { DIMENSION_LABELS } from "@/types/evaluation";

type ResultsPanelProps = {
  result: EvaluationResult;
};

export function ResultsPanel({ result }: ResultsPanelProps) {
  const dimensionEntries = Object.entries(result.dimensions) as Array<
    [keyof EvaluationResult["dimensions"], (typeof result.dimensions)[keyof typeof result.dimensions]]
  >;

  return (
    <div className="space-y-6" aria-live="polite">
      <VerdictBanner verdict={result.verdict} summary={result.summary} />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {dimensionEntries.map(([key, dimension]) => (
          <DimensionCard
            key={key}
            label={DIMENSION_LABELS[key]}
            dimension={dimension}
          />
        ))}
      </div>

      <KillerQuestionCard killerQuestion={result.killer_question} />
    </div>
  );
}
