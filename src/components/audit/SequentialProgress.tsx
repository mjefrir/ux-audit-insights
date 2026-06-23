import { Check, Loader2, Circle } from "lucide-react";
import type { ScreenAuditResult, ScreenInput } from "@/lib/mock-audit";

interface Props {
  screens: ScreenInput[];
  completed: ScreenAuditResult[];
}

export function SequentialProgress({ screens, completed }: Props) {
  const currentIndex = completed.length;

  return (
    <div className="rounded-2xl border bg-card p-5 shadow-sm">
      <div className="mb-4 flex items-baseline justify-between">
        <h2 className="text-sm font-semibold tracking-tight">Sequential analysis</h2>
        <span className="text-xs text-muted-foreground tabular-nums">
          {completed.length} / {screens.length} screens
        </span>
      </div>

      <ol className="flex flex-col gap-2">
        {screens.map((s, i) => {
          const done = i < currentIndex;
          const active = i === currentIndex;
          const result = done ? completed[i] : null;
          return (
            <li
              key={s.id}
              className={`flex gap-3 rounded-xl border p-3 transition ${
                active
                  ? "border-foreground/30 bg-muted/40"
                  : done
                    ? "border-border bg-card"
                    : "border-dashed border-border/70 bg-card opacity-70"
              }`}
            >
              <div className="flex-shrink-0">
                <img
                  src={s.previewUrl}
                  alt=""
                  className="h-12 w-12 rounded-md border object-cover"
                />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold">Screen {i + 1}</span>
                  <span className="truncate text-[11px] text-muted-foreground">
                    {s.file.name}
                  </span>
                </div>
                {result ? (
                  <p className="mt-1 line-clamp-2 text-[11px] text-muted-foreground">
                    {result.summary_state}{" "}
                    <span className="font-medium text-foreground/80">
                      · {result.findings.length} finding
                      {result.findings.length === 1 ? "" : "s"}
                    </span>
                  </p>
                ) : active ? (
                  <p className="mt-1 text-[11px] text-muted-foreground">
                    Analyzing with prior context…
                  </p>
                ) : (
                  <p className="mt-1 text-[11px] text-muted-foreground">Queued</p>
                )}
              </div>
              <div className="flex-shrink-0 self-center">
                {done ? (
                  <Check size={16} className="text-sev-cosmetic-foreground" />
                ) : active ? (
                  <Loader2 size={16} className="animate-spin text-foreground" />
                ) : (
                  <Circle size={16} className="text-muted-foreground/50" />
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
