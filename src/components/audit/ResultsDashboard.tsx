import { useState, useEffect } from "react";
import type { FlowAuditResult, ScreenAuditResult, ScreenInput, Severity } from "@/lib/mock-audit";

import { FindingCard } from "./FindingCard";
import { SequentialProgress } from "./SequentialProgress";
import { ScreenFilter } from "./ScreenFilter";
import { Gauge, ScanSearch, X, ZoomIn } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

interface Props {
  state: "idle" | "loading" | "ready";
  screens: ScreenInput[];
  progress: ScreenAuditResult[];
  result: FlowAuditResult | null;
}

const sevOrder: Severity[] = [4, 3, 2, 1];
const sevChipClass: Record<Severity, string> = {
  4: "bg-sev-critical-soft text-sev-critical",
  3: "bg-sev-major-soft text-sev-major",
  2: "bg-sev-minor-soft text-sev-minor-foreground",
  1: "bg-sev-cosmetic-soft text-foreground/70",
};

export function ResultsDashboard({ state, screens, progress, result }: Props) {
  const { language, t } = useLanguage();
  const [filter, setFilter] = useState<number | "all">("all");
  const [lightboxUrl, setLightboxUrl] = useState<string | null>(null);
  const [lightboxLabel, setLightboxLabel] = useState<string>("");

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

  const openLightbox = (url: string, label: string) => {
    setLightboxUrl(url);
    setLightboxLabel(label);
  };

  const closeLightbox = () => setLightboxUrl(null);

  if (state === "idle") {
    return (
      <EmptyShell
        icon={<ScanSearch size={28} />}
        title={
          language === "id"
            ? "Jalankan analisis untuk melihat hasil"
            : "Run an analysis to see results"
        }
        body={t("resultsSubtitle")}
      />
    );
  }

  if (state === "loading" || !result) {
    return <SequentialProgress screens={screens} completed={progress} />;
  }

  const perScreenCounts = result.screens.map((s) => s.findings.length);
  const visible =
    filter === "all" ? result.findings : result.findings.filter((f) => f.screenIndex === filter);
  const counts = sevOrder.map((s) => ({
    sev: s,
    n: visible.filter((f) => f.severity === s).length,
  }));
  const sorted = [...visible].sort(
    (a, b) => b.severity - a.severity || a.screenIndex - b.screenIndex,
  );

  return (
    <>
      <div className="flex flex-col gap-5">
        <div className="rounded-2xl border bg-card p-6 shadow-sm">
          <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
            <Gauge size={14} />
            {t("uxHealthScore")}
          </div>
          <p className="mt-1 text-sm text-foreground/80">
            {language === "id"
              ? `${result.findings.length} temuan di ${result.screens.length} layar, dianalisis secara berurutan.`
              : `${result.findings.length} findings across ${result.screens.length} screen${
                  result.screens.length === 1 ? "" : "s"
                }, analyzed sequentially.`}
          </p>
          <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
            {counts.map(({ sev, n }) => (
              <div key={sev} className={`rounded-xl px-3 py-2 ${sevChipClass[sev]}`}>
                <div className="text-[11px] font-medium uppercase tracking-wider opacity-80">
                  {getSevLabel(sev)}
                </div>
                <div className="text-xl font-semibold tabular-nums">{n}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-3 rounded-2xl border bg-card p-5 shadow-sm">
          <div className="flex items-baseline justify-between">
            <h2 className="text-sm font-semibold tracking-tight">
              {language === "id" ? "Filter berdasarkan layar" : "Filter by screen"}
            </h2>
            <span className="text-xs text-muted-foreground">
              {language === "id"
                ? "Konteks berantai: setiap layar dianalisis dengan summary_state sebelumnya"
                : "Context chained: each screen analyzed with prior summary_state"}
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
              {language === "id" ? "Temuan" : "Findings"}
              {filter !== "all" && (
                <span className="ml-2 text-xs font-normal text-muted-foreground">
                  · {language === "id" ? "Layar" : "Screen"} {filter + 1}
                </span>
              )}
            </h2>
            <span className="text-xs text-muted-foreground">{t("sortedBySeverity")}</span>
          </div>

          {/* Screen Preview — shown only when a specific screen tab is selected */}
          {filter !== "all" && screens[filter] && (
            <div className="flex gap-4 rounded-2xl border bg-card p-4 shadow-sm">
              <div className="relative flex-shrink-0">
                <button
                  type="button"
                  onClick={() =>
                    openLightbox(
                      screens[filter].previewUrl,
                      `${language === "id" ? "Layar" : "Screen"} ${filter + 1}`,
                    )
                  }
                  className="group relative block cursor-zoom-in rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  aria-label={language === "id" ? "Perbesar gambar" : "Zoom image"}
                >
                  <img
                    src={screens[filter].previewUrl}
                    alt={`${language === "id" ? "Layar" : "Screen"} ${filter + 1}`}
                    className="h-36 w-28 rounded-xl border object-cover shadow-sm transition duration-200 group-hover:brightness-90"
                  />
                  {/* Zoom hint overlay */}
                  <span className="absolute inset-0 flex items-center justify-center rounded-xl bg-black/0 transition duration-200 group-hover:bg-black/30">
                    <ZoomIn
                      size={22}
                      className="text-white opacity-0 drop-shadow-md transition duration-200 group-hover:opacity-100"
                    />
                  </span>
                </button>
                <span className="absolute left-1.5 top-1.5 rounded-md bg-foreground/85 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-background">
                  {language === "id" ? "Layar" : "Screen"} {filter + 1}
                </span>
              </div>
              <div className="flex min-w-0 flex-1 flex-col justify-between gap-2">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                    {language === "id" ? "Konteks Layar" : "Screen Context"}
                  </p>
                  <p className="mt-1 text-sm leading-relaxed text-foreground/80">
                    {result.screens[filter]?.summary_state ?? screens[filter].file.name}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-[11px] text-muted-foreground">
                    {screens[filter].file.name}
                  </span>
                  <span className="text-muted-foreground/40">·</span>
                  <span className="text-[11px] font-medium text-muted-foreground">
                    {sorted.length}{" "}
                    {language === "id" ? "temuan" : `finding${sorted.length === 1 ? "" : "s"}`}
                  </span>
                </div>
              </div>
            </div>
          )}

          {sorted.length === 0 ? (
            <div className="rounded-xl border border-dashed bg-card/40 p-8 text-center text-sm text-muted-foreground">
              {t("noViolations")}
            </div>
          ) : (
            sorted.map((f) => <FindingCard key={f.id} finding={f} />)
          )}
        </div>
      </div>

      {/* Fullscreen Lightbox */}
      {lightboxUrl && <Lightbox src={lightboxUrl} label={lightboxLabel} onClose={closeLightbox} />}
    </>
  );
}

// ── Lightbox ──────────────────────────────────────────────────────────────────
function Lightbox({ src, label, onClose }: { src: string; label: string; onClose: () => void }) {
  // Close on Escape key
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    // Lock body scroll
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
      style={{ animation: "lightbox-in 0.18s ease" }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={label}
    >
      {/* Close button */}
      <button
        type="button"
        onClick={onClose}
        className="absolute right-4 top-4 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-white/10 text-white backdrop-blur transition hover:bg-white/25"
        aria-label="Close"
      >
        <X size={18} />
      </button>

      {/* Label */}
      <span className="absolute left-4 top-4 rounded-lg bg-white/10 px-3 py-1 text-sm font-semibold text-white backdrop-blur">
        {label}
      </span>

      {/* Image — stop propagation so clicking the image doesn't close */}
      <img
        src={src}
        alt={label}
        onClick={(e) => e.stopPropagation()}
        className="max-h-[90vh] max-w-[90vw] cursor-default rounded-2xl object-contain shadow-2xl"
        style={{ animation: "lightbox-img-in 0.2s ease" }}
      />

      <style>{`
        @keyframes lightbox-in {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes lightbox-img-in {
          from { transform: scale(0.93); opacity: 0; }
          to   { transform: scale(1);   opacity: 1; }
        }
      `}</style>
    </div>
  );
}

// ── EmptyShell ────────────────────────────────────────────────────────────────
function EmptyShell({ icon, title, body }: { icon: React.ReactNode; title: string; body: string }) {
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
