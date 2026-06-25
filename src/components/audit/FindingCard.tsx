import type { Finding, Severity } from "@/lib/mock-audit";
import { MapPin, Wrench, Layers } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

const sevMeta: Record<Severity, { barClass: string; pillClass: string }> = {
  4: {
    barClass: "bg-sev-critical",
    pillClass: "bg-sev-critical text-sev-critical-foreground",
  },
  3: {
    barClass: "bg-sev-major",
    pillClass: "bg-sev-major text-sev-major-foreground",
  },
  2: {
    barClass: "bg-sev-minor",
    pillClass: "bg-sev-minor text-sev-minor-foreground",
  },
  1: {
    barClass: "bg-sev-cosmetic",
    pillClass: "bg-sev-cosmetic text-sev-cosmetic-foreground",
  },
};

const effortClass: Record<string, string> = {
  Low: "bg-sev-cosmetic-soft text-foreground/70",
  Medium: "bg-sev-minor-soft text-sev-minor-foreground",
  High: "bg-sev-major-soft text-sev-major",
};

export function FindingCard({ finding }: { finding: Finding }) {
  const { language, t } = useLanguage();
  const meta = sevMeta[finding.severity];

  const getSevLabel = (sev: Severity) => {
    switch (sev) {
      case 4:
        return t("severityCritical");
      case 3:
        return t("severityMajor");
      case 2:
        return t("severityMinor");
      case 1:
        return t("severityCosmetic");
      default:
        return "";
    }
  };

  const getEffortLabel = (effort: string) => {
    switch (effort) {
      case "Low":
        return t("effortLow");
      case "Medium":
        return t("effortMedium");
      case "High":
        return t("effortHigh");
      default:
        return effort;
    }
  };

  return (
    <div className="relative overflow-hidden rounded-2xl border bg-card shadow-sm">
      <div className={`absolute inset-y-0 left-0 w-1 ${meta.barClass}`} />
      <div className="flex flex-col gap-4 p-5 pl-6">
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider ${meta.pillClass}`}
          >
            {t("severity")} {finding.severity} · {getSevLabel(finding.severity)}
          </span>
          <span className="inline-flex items-center gap-1 rounded-full border border-border bg-muted/40 px-2 py-0.5 text-[11px] font-medium text-foreground/80">
            <Layers size={11} />
            {language === "id" ? "Layar" : "Screen"} {finding.screenIndex + 1}
          </span>
          <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
            <MapPin size={12} />
            {finding.location}
          </span>
        </div>

        <h3 className="text-base font-semibold leading-snug tracking-tight">{finding.problem}</h3>

        <Section title={t("justification")}>{finding.justification}</Section>
        <Section title={t("recommendation")}>{finding.recommendation}</Section>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t pt-3">
          <div className="flex items-center gap-2 text-xs">
            <Wrench size={12} className="text-muted-foreground" />
            <span className="text-muted-foreground">{t("devEffort")}</span>
            <span
              className={`rounded-md px-1.5 py-0.5 text-[11px] font-medium ${effortClass[finding.devEffort]}`}
            >
              {getEffortLabel(finding.devEffort)}
            </span>
          </div>
          <div className="flex min-w-[160px] items-center gap-2 text-xs">
            <span className="text-muted-foreground">{t("aiConfidence")}</span>
            <div className="relative h-1.5 w-24 overflow-hidden rounded-full bg-muted">
              <div
                className="absolute inset-y-0 left-0 rounded-full bg-foreground"
                style={{ width: `${finding.aiConfidence}%` }}
              />
            </div>
            <span className="tabular-nums font-medium">{finding.aiConfidence}%</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="mb-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
        {title}
      </div>
      <p className="text-sm leading-relaxed text-foreground/85">{children}</p>
    </div>
  );
}
