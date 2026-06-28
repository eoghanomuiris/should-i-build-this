"use client";

import { ErrorAlert } from "@/components/ErrorAlert";
import { IdeaForm } from "@/components/IdeaForm";
import { LoadingState } from "@/components/LoadingState";
import { ResultsPanel } from "@/components/ResultsPanel";
import { CLAUDE_TIMEOUT_MS } from "@/lib/constants";
import type { EvaluationResult } from "@/types/evaluation";
import { useCallback, useState } from "react";

type Status = "idle" | "loading" | "success" | "error";

export default function Home() {
  const [idea, setIdea] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [result, setResult] = useState<EvaluationResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = useCallback(async () => {
    setStatus("loading");
    setError(null);
    setResult(null);

    const controller = new AbortController();
    const timeoutId = setTimeout(
      () => controller.abort(),
      CLAUDE_TIMEOUT_MS + 5_000,
    );

    try {
      const response = await fetch("/api/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idea }),
        signal: controller.signal,
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error ?? "Evaluation failed. Try again.");
        setStatus("error");
        return;
      }

      setResult(data as EvaluationResult);
      setStatus("success");
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") {
        setError(
          "The evaluation timed out. Try again or shorten your description.",
        );
      } else {
        setError("Network error. Check your connection and try again.");
      }
      setStatus("error");
    } finally {
      clearTimeout(timeoutId);
    }
  }, [idea]);

  const handleReset = useCallback(() => {
    setIdea("");
    setResult(null);
    setError(null);
    setStatus("idle");
  }, []);

  const handleDismissError = useCallback(() => {
    setError(null);
    setStatus(result ? "success" : "idle");
  }, [result]);

  return (
    <main className="flex-1 bg-slate-100">
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <header className="mb-10 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Should I Build This?
          </h1>
          <p className="mt-3 text-base text-slate-600">
            Score your product idea across six dimensions — market, competition,
            complexity, monetisation, founder fit, and time to validate — plus a
            killer question to test in two weeks.
          </p>
        </header>

        <section className="mb-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <IdeaForm
            idea={idea}
            onIdeaChange={setIdea}
            onSubmit={handleSubmit}
            isLoading={status === "loading"}
            onReset={handleReset}
            showReset={status === "success"}
          />
        </section>

        {status === "loading" && <LoadingState />}

        {status === "error" && error && (
          <ErrorAlert message={error} onDismiss={handleDismissError} />
        )}

        {status === "success" && result && <ResultsPanel result={result} />}
      </div>
    </main>
  );
}
