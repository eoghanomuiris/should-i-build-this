import type { KillerQuestion } from "@/types/evaluation";

type KillerQuestionCardProps = {
  killerQuestion: KillerQuestion;
};

export function KillerQuestionCard({ killerQuestion }: KillerQuestionCardProps) {
  return (
    <div className="rounded-xl border-2 border-indigo-200 bg-indigo-50 p-6">
      <div className="mb-4 flex items-center gap-2">
        <span
          className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-sm font-bold text-white"
          aria-hidden="true"
        >
          ?
        </span>
        <h3 className="text-lg font-semibold text-indigo-950">
          Your 2-week validation test
        </h3>
      </div>

      <blockquote className="mb-4 border-l-4 border-indigo-400 pl-4 text-base font-medium leading-relaxed text-indigo-950">
        {killerQuestion.question}
      </blockquote>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-lg bg-white/70 p-3">
          <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-emerald-700">
            Pass signal
          </p>
          <p className="text-sm text-slate-700">{killerQuestion.pass_signal}</p>
        </div>
        <div className="rounded-lg bg-white/70 p-3">
          <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-red-700">
            Fail signal
          </p>
          <p className="text-sm text-slate-700">{killerQuestion.fail_signal}</p>
        </div>
      </div>
    </div>
  );
}
