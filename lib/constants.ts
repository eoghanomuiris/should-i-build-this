/** Hard cap on Claude output tokens — prevents unbounded API spend per request. */
export const CLAUDE_MAX_TOKENS = 1000;

export const CLAUDE_MODEL = "claude-sonnet-4-6";

/** Abort Anthropic calls that exceed this duration (ms). */
export const CLAUDE_TIMEOUT_MS = 60_000;

export const RATE_LIMIT_WINDOW_MS = 60_000;
export const RATE_LIMIT_MAX = 10;

export const IDEA_MIN_LENGTH = 20;
export const IDEA_MAX_LENGTH = 2000;
