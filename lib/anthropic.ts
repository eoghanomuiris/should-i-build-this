import Anthropic from "@anthropic-ai/sdk";
import { CLAUDE_TIMEOUT_MS } from "@/lib/constants";

export const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
  timeout: CLAUDE_TIMEOUT_MS,
});
