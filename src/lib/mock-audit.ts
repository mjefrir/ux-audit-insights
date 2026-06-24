export type Severity = 1 | 2 | 3 | 4;
export type DevEffort = "Low" | "Medium" | "High";

export interface Finding {
  id: string;
  screenIndex: number;
  severity: Severity;
  location: string;
  problem: string;
  justification: string;
  recommendation: string;
  devEffort: DevEffort;
  aiConfidence: number;
}

export interface ScreenInput {
  id: string;
  file: File;
  previewUrl: string;
}

export interface AuditContext {
  domain: string;
  persona: string;
  goal: string;
}

/**
 * Lean chronological marker passed from one screen's analysis to the next.
 * Intentionally excludes findings, violations, justifications, or any audit
 * verdict — only the prior screen's identity and the user action that led
 * into the next screen. Keeps the API call payload bounded.
 */
export interface PastContext {
  previousScreenLabel: string;
  actionSummary: string;
}

export interface ScreenAuditResult {
  screenIndex: number;
  screenLabel: string;
  summary_state: string;
  action_summary: string;
  findings: Finding[];
}

export interface FlowAuditResult {
  overallScore: number;
  screens: ScreenAuditResult[];
  findings: Finding[];
}

const SEV_WEIGHT: Record<Severity, number> = { 4: 18, 3: 10, 2: 5, 1: 2 };

// Seeded pool of candidate findings. Every entry maps to exactly ONE of
// Nielsen Norman Group's 10 Usability Heuristics. No WCAG, no Apple HIG,
// no Material guidelines, no other frameworks are used as evaluation basis.
// Reference: https://www.nngroup.com/articles/ten-usability-heuristics/
const POOL: Omit<Finding, "id" | "screenIndex">[] = [
  {
    severity: 4,
    location: "Submit flow",
    problem: "No visible system status during processing",
    justification:
      "Heuristic #1 — Visibility of System Status. After tapping submit the interface gives no feedback (no spinner, no disabled state, no progress), so users cannot tell whether the system received their action.",
    recommendation: "Show an inline button spinner, disable the form, and surface a progress indicator until the response returns.",
    devEffort: "Medium",
    aiConfidence: 90,
  },
  {
    severity: 3,
    location: "Header iconography",
    problem: "Icons use system-jargon metaphors unfamiliar to the target persona",
    justification:
      "Heuristic #2 — Match Between System and the Real World. Icons reference internal product concepts rather than objects/words from the user's domain, forcing users to translate before acting.",
    recommendation: "Replace abstract glyphs with familiar real-world metaphors and pair each icon with a short text label.",
    devEffort: "Low",
    aiConfidence: 82,
  },
  {
    severity: 3,
    location: "Destructive action",
    problem: "No clear undo or exit path after a committing action",
    justification:
      "Heuristic #3 — User Control and Freedom. The destructive action commits immediately with no emergency exit, trapping users who tapped by mistake.",
    recommendation: "Provide an explicit Cancel/Back affordance and a time-boxed Undo toast after the action commits.",
    devEffort: "Medium",
    aiConfidence: 85,
  },
  {
    severity: 3,
    location: "Top navigation",
    problem: "Active route is not visually distinguished, breaking platform convention",
    justification:
      "Heuristic #4 — Consistency and Standards. Other screens in this product (and conventional navigation patterns users already know) mark the active item; this screen does not, forcing recall.",
    recommendation: "Apply a consistent active-state treatment (underline + foreground color) matching the rest of the product.",
    devEffort: "Low",
    aiConfidence: 88,
  },
  {
    severity: 4,
    location: "Form fields",
    problem: "Easy-to-confuse fields lack confirmation or constraints before commit",
    justification:
      "Heuristic #5 — Error Prevention. The form accepts ambiguous input (similar-looking options, free-text where a picker would do) without a confirmation step, inviting slips.",
    recommendation: "Constrain input with pickers/format masks where possible and add a confirmation step for irreversible commits.",
    devEffort: "Medium",
    aiConfidence: 83,
  },
  {
    severity: 3,
    location: "Multi-step flow",
    problem: "Users must remember information from a previous step",
    justification:
      "Heuristic #6 — Recognition Rather Than Recall. The current screen asks users to recall values (selected plan, recipient, prior input) that were entered earlier instead of surfacing them.",
    recommendation: "Echo a compact summary of prior selections at the top of the screen so users recognize rather than recall.",
    devEffort: "Medium",
    aiConfidence: 84,
  },
  {
    severity: 2,
    location: "Primary task surface",
    problem: "No accelerator for experienced users to skip repetitive steps",
    justification:
      "Heuristic #7 — Flexibility and Efficiency of Use. Every user, novice or expert, must walk the same path; there are no shortcuts, saved defaults, or bulk actions.",
    recommendation: "Add accelerators (keyboard shortcuts, saved templates, bulk actions) that experts can opt into without burdening novices.",
    devEffort: "Medium",
    aiConfidence: 78,
  },
  {
    severity: 2,
    location: "Content density",
    problem: "Screen contains visual elements that do not support the user's current goal",
    justification:
      "Heuristic #8 — Aesthetic and Minimalist Design. Decorative or rarely-needed content competes with the primary action for the user's attention, diluting visual hierarchy.",
    recommendation: "Remove or progressively disclose non-essential elements so the primary action dominates the visual hierarchy.",
    devEffort: "Low",
    aiConfidence: 80,
  },
  {
    severity: 4,
    location: "Error messaging",
    problem: "Error message is a generic code with no diagnosis or recovery path",
    justification:
      "Heuristic #9 — Help Users Recognize, Diagnose, and Recover from Errors. The message uses technical jargon (or a numeric code), does not explain the cause, and gives no constructive next step.",
    recommendation: "Rewrite errors in plain language, state the cause precisely, and offer a concrete recovery action (retry, edit field, contact support).",
    devEffort: "Low",
    aiConfidence: 89,
  },
  {
    severity: 2,
    location: "Complex feature",
    problem: "No contextual help or documentation entry point",
    justification:
      "Heuristic #10 — Help and Documentation. The feature exposes advanced controls but offers no inline guidance, tooltip, or link to docs, so users hit a wall when stuck.",
    recommendation: "Add a contextual help affordance (tooltip, link to focused docs, or inline tip) located at the point of need.",
    devEffort: "Low",
    aiConfidence: 76,
  },
];

function rng(seed: number) {
  let s = seed * 9301 + 49297;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

function buildSummaryState(screenIndex: number, fileName: string): string {
  const archetypes = [
    "entry / landing surface — orienting the user to product value",
    "authentication step — collecting credentials before progressing",
    "primary task surface — the user is mid-flow performing the core action",
    "confirmation / review step — user verifying before commit",
    "result / success state — outcome of the prior action",
    "settings / configuration surface",
  ];
  const arch = archetypes[screenIndex % archetypes.length];
  return `Screen ${screenIndex + 1} (${fileName}) — ${arch}.`;
}

function buildActionSummary(screenIndex: number): string {
  const actions = [
    "User landed on the entry surface.",
    "User submitted credentials to authenticate.",
    "User performed the primary task action.",
    "User reviewed details before confirming.",
    "User reached the success outcome.",
    "User adjusted configuration preferences.",
  ];
  return actions[screenIndex % actions.length];
}

async function analyzeScreen(args: {
  screen: ScreenInput;
  index: number;
  context: AuditContext;
  // Only chronological marker — never findings from prior screens.
  pastContext: PastContext | null;
}): Promise<ScreenAuditResult> {
  const { screen, index, pastContext } = args;
  // Simulate per-screen latency.
  const delay = 700 + Math.floor(Math.random() * 500);
  await new Promise((r) => setTimeout(r, delay));

  const rand = rng(index + 1 + screen.file.size);
  const count = 1 + Math.floor(rand() * 3); // 1–3 findings
  const picks = new Set<number>();
  while (picks.size < count) picks.add(Math.floor(rand() * POOL.length));

  const findings: Finding[] = Array.from(picks).map((poolIdx, i) => {
    const base = POOL[poolIdx];
    // Reference only the prior screen label + user action — never prior findings.
    const tiedToPast =
      pastContext && i === 0
        ? ` Coming from ${pastContext.previousScreenLabel} (${pastContext.actionSummary}), this screen should preserve continuity.`
        : "";
    return {
      ...base,
      id: `s${index}-f${i}`,
      screenIndex: index,
      justification: base.justification + tiedToPast,
    };
  });

  return {
    screenIndex: index,
    screenLabel: `Screen ${index + 1}`,
    summary_state: buildSummaryState(index, screen.file.name),
    action_summary: buildActionSummary(index),
    findings,
  };
}

export async function runFlowAudit(args: {
  screens: ScreenInput[];
  context: AuditContext;
  onProgress?: (result: ScreenAuditResult, index: number, total: number) => void;
}): Promise<FlowAuditResult> {
  const { screens, context, onProgress } = args;
  const results: ScreenAuditResult[] = [];
  // Lean chronological marker only. Findings are NEVER chained forward.
  let pastContext: PastContext | null = null;

  // Track signatures of issues already raised in prior screens so we never
  // re-emit an identical problem/justification/recommendation on a later
  // screen. The analyzer judges each screen on its own visual evidence; the
  // orchestrator simply filters out duplicates that would otherwise repeat
  // the same verdict across the flow.
  const seenSignatures = new Set<string>();
  const sig = (f: Finding) => `${f.location}|${f.problem}`;

  for (let i = 0; i < screens.length; i++) {
    const result = await analyzeScreen({
      screen: screens[i],
      index: i,
      context,
      pastContext,
    });

    // Drop findings whose (location + problem) signature already appeared
    // on an earlier screen. In a real backend this is where you'd compare
    // perceptual hashes of the two screenshots and only keep the duplicate
    // if the frames are visually identical (i.e. true regression evidence).
    const uniqueFindings = result.findings.filter((f) => {
      const key = sig(f);
      if (seenSignatures.has(key)) return false;
      seenSignatures.add(key);
      return true;
    });

    const dedupedResult: ScreenAuditResult = {
      ...result,
      findings: uniqueFindings,
    };
    results.push(dedupedResult);
    pastContext = {
      previousScreenLabel: dedupedResult.screenLabel,
      actionSummary: dedupedResult.action_summary,
    };
    onProgress?.(dedupedResult, i, screens.length);
  }

  const allFindings = results.flatMap((r) => r.findings);
  const penalty = allFindings.reduce((s, f) => s + SEV_WEIGHT[f.severity], 0);
  const overallScore = Math.max(0, Math.min(100, 100 - penalty));

  return { overallScore, screens: results, findings: allFindings };
}
