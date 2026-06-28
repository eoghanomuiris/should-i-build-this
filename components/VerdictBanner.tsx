import type { Verdict } from "@/types/evaluation";
import { VERDICT_LABELS } from "@/types/evaluation";

const VERDICT_STYLES: Record<
  Verdict,
  { banner: string; badge: string; icon: string }
> = {
  build_it: {
    banner: "border-emerald-200 bg-emerald-50",
    badge: "bg-emerald-600 text-white",
    icon: "✓",
  },
  validate_first: {
    banner: "border-amber-200 bg-amber-50",
    badge: "bg-amber-600 text-white",
    icon: "?",
  },
  park_it: {
    banner: "border-red-200 bg-red-50",
    badge: "bg-red-600 text-white",
    icon: "✕",
  },
};

type VerdictBannerProps = {
  verdict: Verdict;
  summary: string;
};

export function VerdictBanner({ verdict, summary }: VerdictBannerProps) {
  const styles = VERDICT_STYLES[verdict];

  return (
    <div
      className={`rounded-xl border p-6 ${styles.banner}`}
      role="status"
    >
      <div className="mb-3 flex items-center gap-3">
        <span
          className={`flex h-10 w-10 items-center justify-center rounded-full text-lg font-bold ${styles.badge}`}
          aria-hidden="true"
        >
          {styles.icon}
        </span>
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-slate-600">
            Overall Verdict
          </p>
          <h2 className="text-2xl font-bold text-slate-900">
            {VERDICT_LABELS[verdict]}
          </h2>
        </div>
      </div>
      <p className="text-sm leading-relaxed text-slate-700">{summary}</p>
    </div>
  );
}
