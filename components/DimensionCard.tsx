import { StatusIndicator } from "@/components/StatusIndicator";
import type { ScoredDimension } from "@/types/evaluation";

type DimensionCardProps = {
  label: string;
  dimension: ScoredDimension;
};

export function DimensionCard({ label, dimension }: DimensionCardProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-3 flex items-start justify-between gap-3">
        <h3 className="text-sm font-semibold text-slate-900">{label}</h3>
        <StatusIndicator status={dimension.indicator} />
      </div>

      <div className="mb-3 flex items-center gap-1" aria-label={`Score ${dimension.score} out of 5`}>
        {Array.from({ length: 5 }, (_, i) => (
          <span
            key={i}
            className={`h-2.5 flex-1 rounded-full ${
              i < dimension.score ? "bg-slate-800" : "bg-slate-200"
            }`}
          />
        ))}
      </div>

      <p className="text-xs font-medium text-slate-500">
        Score: {dimension.score}/5
      </p>
      <p className="mt-2 text-sm leading-relaxed text-slate-600">
        {dimension.rationale}
      </p>
    </div>
  );
}
