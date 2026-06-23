import { useState } from "react";
import type {
  FlowAuditResult,
  ScreenAuditResult,
  ScreenInput,
  Severity,
} from "@/lib/mock-audit";
import { HealthGauge } from "./HealthGauge";
import { FindingCard } from "./FindingCard";
import { SequentialProgress } from "./SequentialProgress";
import { ScreenFilter } from "./ScreenFilter";
import { Gauge, ScanSearch } from "lucide-react";

interface Props {
  state: "idle" | "loading" | "ready";
  screens: ScreenInput[];
  progress: ScreenAuditResult[];
  result: FlowAuditResult | null;
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

export function ResultsDashboard({ state, screens, progress, result }: Props) {
  const [filter, setFilter] = useState<number | "all">("all");

  if (state === "idle") {
    return (
      <EmptyShell
        icon={<ScanSearch size={28} />}
        title="Run an analysis to see results"
        body="Upload your flow screens and click Analyze Flow. Each screen is reviewed in order, carrying context forward."
      />
    );
  }

  if (state === "loading" || !result) {
    return <SequentialProgress screens={screens} completed={progress} />;
  }

  const perScreenCounts = result.screens.map((s) => s.findings.length);
  const visible =
    filter === "all"
      ? result.findings
      : result.findings.filter((f) => f.screenIndex === filter);
  const counts = sevOrder.map((s) => ({
    sev: s,
    n: visible.filter((f) => f.severity === s).length,
  }));
  const sorted = [...visible].sort(
    (a, b) => b.severity - a.severity || a.screenIndex - b.screenIndex,
  );

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
            {result.findings.length} findings across {result.screens.length} screen
            {result.screens.length === 1 ? "" : "s"}, analyzed sequentially.
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

      <div className="flex flex-col gap-3 rounded-2xl border bg-card p-5 shadow-sm">
        <div className="flex items-baseline justify-between">
          <h2 className="text-sm font-semibold tracking-tight">Filter by screen</h2>
          <span className="text-xs text-muted-foreground">
            Context chained: each screen analyzed with prior summary_state
          </span>
        </div>
        <ScreenFilter
          total={result.screens.length}
          counts={perScreenCounts}
          selected={filter}
          onChange={setFilter}
        />
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex items-baseline justify-between">
          <h2 className="text-sm font-semibold tracking-tight">
            Findings
            {filter !== "all" && (
              <span className="ml-2 text-xs font-normal text-muted-foreground">
                · Screen {filter + 1}
              </span>
            )}
          </h2>
          <span className="text-xs text-muted-foreground">
            Sorted by severity (highest first)
          </span>
        </div>
        {sorted.length === 0 ? (
          <div className="rounded-xl border border-dashed bg-card/40 p-8 text-center text-sm text-muted-foreground">
            No findings on this screen.
          </div>
        ) : (
          sorted.map((f) => <FindingCard key={f.id} finding={f} />)
        )}
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
