import { anthropic } from "@/lib/anthropic";
import {
  CLAUDE_MAX_TOKENS,
  CLAUDE_MODEL,
  RATE_LIMIT_MAX,
  RATE_LIMIT_WINDOW_MS,
} from "@/lib/constants";
import {
  getEvaluationErrorMessage,
  isRetryableEvaluationError,
} from "@/lib/errors";
import { normalizeDimension } from "@/lib/indicators";
import {
  buildUserMessage,
  RETRY_USER_MESSAGE,
  SYSTEM_PROMPT,
} from "@/lib/prompt";
import {
  EvaluateRequestSchema,
  EvaluationResultSchema,
} from "@/lib/schema";
import type { EvaluationResult } from "@/types/evaluation";
import { NextResponse } from "next/server";

const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return true;
  }

  if (entry.count >= RATE_LIMIT_MAX) {
    return false;
  }

  entry.count += 1;
  return true;
}

function extractJsonText(text: string): string {
  const trimmed = text.trim();
  const fenceMatch = trimmed.match(/^```(?:json)?\s*([\s\S]*?)\s*```$/);
  if (fenceMatch) {
    return fenceMatch[1].trim();
  }
  return trimmed;
}

function normalizeResult(result: EvaluationResult): EvaluationResult {
  const dimensions = Object.fromEntries(
    Object.entries(result.dimensions).map(([key, dimension]) => [
      key,
      normalizeDimension(dimension),
    ]),
  ) as EvaluationResult["dimensions"];

  return { ...result, dimensions };
}

async function callClaude(
  idea: string,
  isRetry = false,
): Promise<EvaluationResult> {
  const messages: Array<{ role: "user" | "assistant"; content: string }> = [
    { role: "user", content: buildUserMessage(idea) },
  ];

  if (isRetry) {
    messages.push({ role: "assistant", content: "{}" });
    messages.push({ role: "user", content: RETRY_USER_MESSAGE });
  }

  const response = await anthropic.messages.create({
    model: CLAUDE_MODEL,
    max_tokens: CLAUDE_MAX_TOKENS,
    temperature: 0.3,
    system: SYSTEM_PROMPT,
    messages,
  });

  const textBlock = response.content.find((block) => block.type === "text");
  if (!textBlock || textBlock.type !== "text") {
    throw new Error("No text response from Claude");
  }

  const parsed = JSON.parse(extractJsonText(textBlock.text));
  const validated = EvaluationResultSchema.parse(parsed);
  return normalizeResult(validated);
}

export async function POST(request: Request) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json(
      { error: "Server misconfigured" },
      { status: 500 },
    );
  }

  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    "unknown";

  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { error: "Too many requests. Please wait a minute and try again." },
      { status: 429 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 },
    );
  }

  const parsed = EvaluateRequestSchema.safeParse(body);
  if (!parsed.success) {
    const message =
      parsed.error.issues[0]?.message ?? "Invalid request";
    return NextResponse.json({ error: message }, { status: 400 });
  }

  try {
    try {
      const result = await callClaude(parsed.data.idea);
      return NextResponse.json(result);
    } catch (firstError) {
      if (!isRetryableEvaluationError(firstError)) {
        throw firstError;
      }

      const result = await callClaude(parsed.data.idea, true);
      return NextResponse.json(result);
    }
  } catch (error) {
    console.error("Evaluation error:", error);
    const { message, status } = getEvaluationErrorMessage(error);
    return NextResponse.json({ error: message }, { status });
  }
}
