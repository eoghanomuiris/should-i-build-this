# Should I Build This?

A single-page product idea validator. Paste a product idea, get a structured AI verdict scored across six dimensions — each with a 1–5 score, one-sentence rationale, and red/amber/green indicator — plus an overall verdict and a killer validation question you can test in two weeks.

Built as a portfolio project demonstrating PM-with-technical-depth: deliberate architecture, cost controls, and security boundaries — not vibe coding.

## Live demo

**https://should-i-build-this.vercel.app**

## What it evaluates

| Dimension | What a high score (4–5) means |
|-----------|-------------------------------|
| **Market Size** | Large, growing addressable market |
| **Competition Level** | Low competition, clear whitespace |
| **Build Complexity** | Simple MVP — weeks, not months |
| **Monetisation Potential** | Clear, proven revenue path |
| **Founder-Market Fit** | Strong domain expertise implied |
| **Time to Validate** | Core hypothesis testable within 2 weeks |

Plus a **killer question** with pass/fail signals — the single test that validates or kills the idea fast.

**Overall verdict:** Build It · Validate First · Park It

---

## Stack choices

| Layer | Choice | Why |
|-------|--------|-----|
| Framework | **Next.js 16 (App Router)** | Server-side API routes keep the Anthropic key off the client; Vercel deploy is zero-config |
| Styling | **Tailwind CSS v4** | Utility-first, no component library overhead for a single page |
| Language | **TypeScript** | Shared types between API contract, Zod schemas, and UI |
| AI | **Claude Sonnet 4.6** | Strong reasoning at reasonable cost; structured JSON output |
| Validation | **Zod** | Single source of truth for request/response shapes; runtime safety on Claude output |
| Hosting | **Vercel** | Serverless functions for the API route; edge-ready static shell |

**Deliberately excluded:** database, auth, user accounts, session storage. The app is fully stateless — every evaluation is an independent request.

---

## Data flow

```
Browser (page.tsx)
  │
  ├─ User submits idea (validated client-side: 20–2,000 chars)
  │
  └─ POST /api/evaluate
       │
       ├─ Zod validates request body
       ├─ Per-IP rate limit check (10 req/min, in-memory)
       ├─ Build system + user prompt (lib/prompt.ts)
       ├─ Anthropic Messages API (claude-sonnet-4-6, max_tokens: 1000)
       ├─ JSON.parse → Zod validates response shape
       ├─ Normalize indicator/score mismatches (lib/indicators.ts)
       ├─ On parse failure only: single retry with correction prompt
       │
       └─ Return EvaluationResult JSON → render ResultsPanel
```

The API key never leaves the server. The browser only sees the structured verdict.

---

## Security & cost controls

| Control | Implementation |
|---------|----------------|
| API key isolation | `ANTHROPIC_API_KEY` read only in server-side route; never in client bundle |
| Input validation | Zod enforces 20–2,000 char limit before any API call |
| Output cap | `max_tokens: 1000` on every Claude request — no unbounded generation |
| Rate limiting | 10 requests/minute per IP (in-memory; resets on cold start) |
| Timeout | 60s server-side (Anthropic SDK) + 65s client-side abort |
| Retry policy | Single retry on JSON parse / Zod failure only — not on API errors |
| Error messages | Actionable user-facing errors; no stack traces or key leakage |

---

## Project structure

```
app/
  page.tsx                 # Client UI + fetch orchestration
  api/evaluate/route.ts    # API proxy: validate → Claude → parse → respond
components/
  IdeaForm.tsx             # Input + char count + submit
  ResultsPanel.tsx         # Verdict + dimension grid + killer question
  DimensionCard.tsx        # Single scored dimension
  VerdictBanner.tsx        # Overall verdict + summary
  KillerQuestionCard.tsx   # 2-week validation test
  LoadingState.tsx         # Skeleton while waiting
  ErrorAlert.tsx           # API / network / timeout errors
  StatusIndicator.tsx      # Red / amber / green pill
lib/
  constants.ts             # Token limits, rate limits, timeouts (single config)
  schema.ts                # Zod request + response schemas
  prompt.ts                # System prompt + user message builder
  anthropic.ts             # SDK client (server-only)
  indicators.ts            # Score → indicator normalization
  errors.ts                # Error → user message mapping
types/
  evaluation.ts            # TypeScript types inferred from Zod
```

---

## Getting started

### Prerequisites

- Node.js 20+
- An [Anthropic API key](https://console.anthropic.com/) with credits (separate from Claude Pro)

### Setup

```bash
npm install
cp .env.local.example .env.local
# Add ANTHROPIC_API_KEY to .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Deploy to Vercel

1. Push to GitHub
2. Import in [Vercel](https://vercel.com/new) — framework preset: Next.js
3. Set `ANTHROPIC_API_KEY` in Environment Variables (Production + Preview)
4. Deploy

---

## API reference

### `POST /api/evaluate`

**Request:**
```json
{ "idea": "Your product idea (20–2,000 characters)" }
```

**Success (200):**
```json
{
  "verdict": "validate_first",
  "summary": "...",
  "dimensions": {
    "market_size": { "score": 4, "indicator": "green", "rationale": "..." },
    "competition_level": { "score": 3, "indicator": "amber", "rationale": "..." },
    "build_complexity": { "score": 3, "indicator": "amber", "rationale": "..." },
    "monetisation_potential": { "score": 4, "indicator": "green", "rationale": "..." },
    "founder_market_fit": { "score": 3, "indicator": "amber", "rationale": "..." },
    "time_to_validate": { "score": 4, "indicator": "green", "rationale": "..." }
  },
  "killer_question": {
    "question": "...",
    "pass_signal": "...",
    "fail_signal": "..."
  }
}
```

**Errors:**

| Status | Cause |
|--------|-------|
| 400 | Invalid or out-of-range input |
| 429 | App rate limit (10/min/IP) or Anthropic rate limit |
| 500 | Missing API key |
| 502 | Malformed AI response, connection failure |
| 503 | Insufficient Anthropic API credits |
| 504 | Request timeout |

---

## Known limitations

- **No persistence** — evaluations are not saved; refresh loses results
- **In-memory rate limiting** — resets on serverless cold starts; not suitable for multi-instance abuse prevention at scale
- **Founder-Market Fit inferred from idea text only** — no founder bio input in v1
- **AI output quality varies** — scores are heuristic, not market research; treat as a structured thinking tool, not due diligence
- **Claude Pro ≠ API access** — requires separate API credits at console.anthropic.com
- **~$0.01–0.02 per evaluation** — Sonnet 4.6 pricing at current rates

---

## License

MIT
