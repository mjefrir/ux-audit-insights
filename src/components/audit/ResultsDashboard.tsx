import type { AuditResult, Severity } from "@/lib/mock-audit";
import { HealthGauge } from "./HealthGauge";
import { FindingCard } from "./FindingCard";
import { Gauge, Loader2, ScanSearch } from "lucide-react";

interface Props {
  state: "idle" | "loading" | "ready";
  result: AuditResult | null;
}

const sevOrder: Severity[] = [4, 3, 2, 1];
const sevLabel: Record<Severity, string> = {
  4: "Critical",
  3: "Major",
  2: "Minor",
  1: "Cosmetic",
};
const sevChipClass: Record<Severity, string> = {
  4: "bg-sev-critical-soft text-sev-critical",
  3: "bg-sev-major-soft text-sev-major",
  2: "bg-sev-minor-soft text-sev-minor-foreground",
  1: "bg-sev-cosmetic-soft text-foreground/70",
};

export function ResultsDashboard({ state, result }: Props) {
  if (state === "idle") {
    return (
      <EmptyShell
        icon={<ScanSearch size={28} />}
        title="Run an analysis to see results"
        body="Fill the form and click Analyze Interface. Findings will appear here, sorted by severity."
      />
    );
  }

  if (state === "loading" || !result) {
    return (
      <EmptyShell
        icon={<Loader2 size={28} className="animate-spin" />}
        title="Analyzing interface…"
        body="Reviewing your screenshot against heuristic and accessibility checks."
      />
    );
  }

  const counts = sevOrder.map((s) => ({
    sev: s,
    n: result.findings.filter((f) => f.severity === s).length,
  }));
  const sorted = [...result.findings].sort((a, b) => b.severity - a.severity);

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-6 rounded-2xl border bg-card p-6 shadow-sm md:flex-row md:items-center">
        <HealthGauge score={result.overallScore} />
        <div className="flex-1">
          <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
            <Gauge size={14} />
            Overall Health Score
          </div>
          <p className="mt-1 text-sm text-foreground/80">
            Based on {result.findings.length} findings across heuristic and accessibility
            categories.
          </p>
          <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
            {counts.map(({ sev, n }) => (
              <div key={sev} className={`rounded-xl px-3 py-2 ${sevChipClass[sev]}`}>
                <div className="text-[11px] font-medium uppercase tracking-wider opacity-80">
                  {sevLabel[sev]}
                </div>
                <div className="text-xl font-semibold tabular-nums">{n}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex items-baseline justify-between">
          <h2 className="text-sm font-semibold tracking-tight">Findings</h2>
          <span className="text-xs text-muted-foreground">
            Sorted by severity (highest first)
          </span>
        </div>
        {sorted.map((f) => (
          <FindingCard key={f.id} finding={f} />
        ))}
      </div>
    </div>
  );
}

function EmptyShell({
  icon,
  title,
  body,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
}) {
  return (
    <div className="flex min-h-[480px] flex-col items-center justify-center rounded-2xl border border-dashed bg-card/40 p-10 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted text-muted-foreground">
        {icon}
      </div>
      <h3 className="mt-4 text-base font-semibold tracking-tight">{title}</h3>
      <p className="mt-1 max-w-sm text-sm text-muted-foreground">{body}</p>
    </div>
  );
}
