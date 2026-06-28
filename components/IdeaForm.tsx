import {
  IDEA_MAX_LENGTH,
  IDEA_MIN_LENGTH,
} from "@/lib/constants";

type IdeaFormProps = {
  idea: string;
  onIdeaChange: (value: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
  onReset?: () => void;
  showReset?: boolean;
};

export function IdeaForm({
  idea,
  onIdeaChange,
  onSubmit,
  isLoading,
  onReset,
  showReset = false,
}: IdeaFormProps) {
  const charCount = idea.length;
  const isValid =
    charCount >= IDEA_MIN_LENGTH && charCount <= IDEA_MAX_LENGTH && !isLoading;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (isValid) {
      onSubmit();
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label
          htmlFor="idea"
          className="mb-2 block text-sm font-medium text-slate-700"
        >
          Describe your product idea
        </label>
        <textarea
          id="idea"
          name="idea"
          rows={6}
          value={idea}
          onChange={(e) => onIdeaChange(e.target.value)}
          disabled={isLoading}
          placeholder="e.g. A B2B SaaS that helps small accounting firms automate client onboarding with AI-powered document extraction and compliance checks..."
          className="w-full resize-y rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 disabled:cursor-not-allowed disabled:opacity-60"
          aria-describedby="idea-help idea-count"
        />
        <div className="mt-2 flex items-center justify-between">
          <p id="idea-help" className="text-xs text-slate-500">
            Be specific about the target user, problem, and solution.
          </p>
          <p
            id="idea-count"
            className={`text-xs ${
              charCount > IDEA_MAX_LENGTH ? "text-red-600" : "text-slate-500"
            }`}
          >
            {charCount.toLocaleString()} / {IDEA_MAX_LENGTH.toLocaleString()}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          type="submit"
          disabled={!isValid}
          aria-busy={isLoading}
          className="rounded-xl bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isLoading ? "Evaluating…" : "Evaluate my idea"}
        </button>

        {showReset && onReset && (
          <button
            type="button"
            onClick={onReset}
            disabled={isLoading}
            className="rounded-xl border border-slate-300 bg-white px-6 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Evaluate another idea
          </button>
        )}
      </div>
    </form>
  );
}
