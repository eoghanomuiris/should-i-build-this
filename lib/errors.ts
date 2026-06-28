import {
  APIConnectionError,
  APIConnectionTimeoutError,
  APIError,
} from "@anthropic-ai/sdk";
import { ZodError } from "zod";

type AnthropicErrorBody = {
  type?: string;
  error?: {
    type?: string;
    message?: string;
  };
  message?: string;
};

function getApiErrorMessage(error: APIError): string {
  const body = error.error as AnthropicErrorBody | undefined;
  return (
    body?.error?.message ??
    body?.message ??
    error.message ??
    "Anthropic API request failed."
  );
}

export function getEvaluationErrorMessage(error: unknown): {
  message: string;
  status: number;
} {
  if (error instanceof APIConnectionTimeoutError) {
    return {
      message:
        "The evaluation timed out. The idea may be too complex — try again or shorten your description.",
      status: 504,
    };
  }

  if (error instanceof APIConnectionError) {
    return {
      message:
        "Could not reach the AI service. Check your connection and try again.",
      status: 502,
    };
  }

  if (error instanceof APIError) {
    const apiMessage = getApiErrorMessage(error);

    if (error.status === 401) {
      return {
        message:
          "Invalid Anthropic API key. Check ANTHROPIC_API_KEY in your environment.",
        status: 500,
      };
    }

    if (error.status === 429) {
      return {
        message: "Anthropic API rate limit reached. Try again in a moment.",
        status: 429,
      };
    }

    if (
      apiMessage.toLowerCase().includes("credit balance") ||
      apiMessage.toLowerCase().includes("billing")
    ) {
      return {
        message:
          "Your Anthropic API account has insufficient credits. Add credits at console.anthropic.com to continue.",
        status: 503,
      };
    }

    return {
      message: apiMessage,
      status: error.status ?? 502,
    };
  }

  if (error instanceof SyntaxError) {
    return {
      message:
        "The AI returned a malformed response. Please try again.",
      status: 502,
    };
  }

  if (error instanceof ZodError) {
    return {
      message:
        "The AI response was incomplete or invalid. Please try again.",
      status: 502,
    };
  }

  return {
    message: "Evaluation failed. Try again.",
    status: 502,
  };
}

export function isRetryableEvaluationError(error: unknown): boolean {
  return error instanceof SyntaxError || error instanceof ZodError;
}
