import { Check, Loader2, Circle } from "lucide-react";
import type { ScreenAuditResult, ScreenInput } from "@/lib/mock-audit";
import { useLanguage } from "@/context/LanguageContext";

interface Props {
  screens: ScreenInput[];
  completed: ScreenAuditResult[];
}

export function SequentialProgress({ screens, completed }: Props) {
  const { language, t } = useLanguage();
  const currentIndex = completed.length;

  return (
    <div className="rounded-2xl border bg-card p-5 shadow-sm">
      <div className="mb-4 flex items-baseline justify-between">
        <h2 className="text-sm font-semibold tracking-tight">
          {language === "id" ? "Analisis sekuensial" : "Sequential analysis"}
        </h2>
        <span className="text-xs text-muted-foreground tabular-nums">
          {completed.length} / {screens.length}{" "}
          {language === "id" ? "layar" : `screen${screens.length === 1 ? "" : "s"}`}
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
                  <span className="text-xs font-semibold">
                    {language === "id" ? "Layar" : "Screen"} {i + 1}
                  </span>
                  <span className="truncate text-[11px] text-muted-foreground">{s.file.name}</span>
                </div>
                {result ? (
                  <p className="mt-1 line-clamp-2 text-[11px] text-muted-foreground">
                    <span className="font-medium text-foreground/80">{result.action_summary}</span>{" "}
                    · {result.findings.length}{" "}
                    {language === "id"
                      ? "temuan"
                      : `finding${result.findings.length === 1 ? "" : "s"}`}
                  </p>
                ) : active ? (
                  <p className="mt-1 text-[11px] text-muted-foreground">
                    {i > 0
                      ? `${t("progressChained")} ${i}…`
                      : language === "id"
                        ? "Menganalisis…"
                        : "Analyzing…"}
                  </p>
                ) : (
                  <p className="mt-1 text-[11px] text-muted-foreground capitalize">
                    {t("progressQueued")}
                  </p>
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
