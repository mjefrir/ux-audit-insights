export type Severity = 1 | 2 | 3 | 4;
export type DevEffort = "Low" | "Medium" | "High";

export interface Finding {
  id: string;
  severity: Severity;
  location: string;
  problem: string;
  justification: string;
  recommendation: string;
  devEffort: DevEffort;
  aiConfidence: number;
}

export interface AuditResult {
  overallScore: number;
  findings: Finding[];
}

export function generateMockAudit(): AuditResult {
  const findings: Finding[] = [
    {
      id: "f1",
      severity: 4,
      location: "Primary CTA — Hero section",
      problem: "Primary action lacks sufficient contrast against background",
      justification:
        "Nielsen #4 (Consistency & standards) and WCAG 2.1 AA require a 4.5:1 contrast ratio for interactive text. Current ratio appears ~2.8:1, making the action easy to miss for users with low vision.",
      recommendation:
        "Darken the button background to the primary-600 token and use white foreground. Re-test contrast in both light and dark themes.",
      devEffort: "Low",
      aiConfidence: 94,
    },
    {
      id: "f2",
      severity: 4,
      location: "Checkout — Payment step",
      problem: "No visible system status during payment processing",
      justification:
        "Nielsen #1 (Visibility of system status). Users get no feedback after submitting payment, which causes double-submissions and abandonment on slower networks.",
      recommendation:
        "Add an inline loading state on the submit button and a non-dismissible progress overlay. Disable the form during the request.",
      devEffort: "Medium",
      aiConfidence: 88,
    },
    {
      id: "f3",
      severity: 3,
      location: "Top navigation",
      problem: "Active route is not visually distinguished",
      justification:
        "Nielsen #6 (Recognition rather than recall). Users lose orientation within the product, increasing cognitive load when switching contexts.",
      recommendation:
        "Apply an underline and foreground color change to the active nav item. Persist state on route changes.",
      devEffort: "Low",
      aiConfidence: 91,
    },
    {
      id: "f4",
      severity: 3,
      location: "Onboarding form — Step 2",
      problem: "Error messages appear only after submit, not inline",
      justification:
        "Nielsen #9 (Help users recognize, diagnose, and recover from errors). Late feedback forces users to re-scan the form, which is costly on mobile.",
      recommendation:
        "Validate on blur and show field-level errors with an icon and helper text. Keep the global error summary as a fallback.",
      devEffort: "Medium",
      aiConfidence: 83,
    },
    {
      id: "f5",
      severity: 2,
      location: "Dashboard — Empty state",
      problem: "Empty state lacks a clear next action",
      justification:
        "Nielsen #7 (Flexibility & efficiency of use). First-time users see a blank panel without guidance, slowing time-to-value.",
      recommendation:
        "Add an illustration, a one-line explanation, and a primary CTA to create the first item.",
      devEffort: "Low",
      aiConfidence: 79,
    },
    {
      id: "f6",
      severity: 1,
      location: "Footer",
      problem: "Inconsistent link styling between footer and body",
      justification:
        "Nielsen #4 (Consistency & standards). Minor cosmetic drift but reduces perceived polish.",
      recommendation: "Unify link tokens (color, underline-offset) across all surfaces.",
      devEffort: "Low",
      aiConfidence: 72,
    },
  ];

  const weight: Record<Severity, number> = { 4: 18, 3: 10, 2: 5, 1: 2 };
  const penalty = findings.reduce((s, f) => s + weight[f.severity], 0);
  const overallScore = Math.max(0, Math.min(100, 100 - penalty));

  return { overallScore, findings };
}
