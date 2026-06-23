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

// Seeded pool of candidate findings the mock pulls from, keyed loosely by screen position.
const POOL: Omit<Finding, "id" | "screenIndex">[] = [
  {
    severity: 4,
    location: "Primary CTA",
    problem: "Primary action lacks sufficient contrast against background",
    justification:
      "Nielsen #4 (Consistency & standards) and WCAG 2.1 AA require a 4.5:1 contrast ratio. Current ratio appears ~2.8:1.",
    recommendation: "Darken the button to primary-600 with white foreground; re-test both themes.",
    devEffort: "Low",
    aiConfidence: 94,
  },
  {
    severity: 4,
    location: "Submit flow",
    problem: "No visible system status during processing",
    justification:
      "Nielsen #1 (Visibility of system status). Users get no feedback after submit, causing double-submissions.",
    recommendation: "Add inline button loading + non-dismissible overlay; disable the form during the request.",
    devEffort: "Medium",
    aiConfidence: 88,
  },
  {
    severity: 3,
    location: "Top navigation",
    problem: "Active route is not visually distinguished",
    justification:
      "Nielsen #6 (Recognition rather than recall). Users lose orientation when switching contexts.",
    recommendation: "Add underline + foreground color on the active nav item; persist on route change.",
    devEffort: "Low",
    aiConfidence: 91,
  },
  {
    severity: 3,
    location: "Form fields",
    problem: "Error messages appear only after submit, not inline",
    justification:
      "Nielsen #9. Late feedback forces users to re-scan the form — costly on mobile.",
    recommendation: "Validate on blur; show field-level errors with icon + helper text.",
    devEffort: "Medium",
    aiConfidence: 83,
  },
  {
    severity: 2,
    location: "Empty state",
    problem: "Empty state lacks a clear next action",
    justification:
      "Nielsen #7. First-time users see a blank panel without guidance, slowing time-to-value.",
    recommendation: "Add illustration + one-line explanation + primary CTA to create the first item.",
    devEffort: "Low",
    aiConfidence: 79,
  },
  {
    severity: 3,
    location: "Continuity from previous screen",
    problem: "Context from the prior step is not carried over visually",
    justification:
      "Nielsen #4 (Consistency). Users lose the thread of their task between screens; affordances differ.",
    recommendation: "Echo a summary of the prior step (e.g. selected plan, recipient) at the top of this screen.",
    devEffort: "Medium",
    aiConfidence: 81,
  },
  {
    severity: 1,
    location: "Footer",
    problem: "Inconsistent link styling between footer and body",
    justification: "Nielsen #4. Minor cosmetic drift but reduces perceived polish.",
    recommendation: "Unify link tokens (color, underline-offset) across surfaces.",
    devEffort: "Low",
    aiConfidence: 72,
  },
  {
    severity: 2,
    location: "Touch targets",
    problem: "Tap targets fall below the 44×44 minimum",
    justification:
      "WCAG 2.5.5 / Apple HIG. Small targets increase mis-taps, especially on the edges of the screen.",
    recommendation: "Increase icon-button hit area to at least 44×44 via padding or pseudo-elements.",
    devEffort: "Low",
    aiConfidence: 86,
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

  for (let i = 0; i < screens.length; i++) {
    const result = await analyzeScreen({
      screen: screens[i],
      index: i,
      context,
      pastContext,
    });
    results.push(result);
    pastContext = {
      previousScreenLabel: result.screenLabel,
      actionSummary: result.action_summary,
    };
    onProgress?.(result, i, screens.length);
  }

  const allFindings = results.flatMap((r) => r.findings);
  const penalty = allFindings.reduce((s, f) => s + SEV_WEIGHT[f.severity], 0);
  const overallScore = Math.max(0, Math.min(100, 100 - penalty));

  return { overallScore, screens: results, findings: allFindings };
}
