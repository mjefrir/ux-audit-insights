import { Loader2, Sparkles } from "lucide-react";
import { FlowGallery } from "./FlowGallery";
import type { ScreenInput } from "@/lib/mock-audit";
import { useLanguage } from "@/context/LanguageContext";

interface InputFormProps {
  domain: string;
  persona: string;
  goal: string;
  screens: ScreenInput[];
  isAnalyzing: boolean;
  onChange: (patch: {
    domain?: string;
    persona?: string;
    goal?: string;
    screens?: ScreenInput[];
  }) => void;
  onSubmit: () => void;
}

export function InputForm(props: InputFormProps) {
  const { domain, persona, goal, screens, isAnalyzing, onChange, onSubmit } = props;
  const { language, t } = useLanguage();
  const canSubmit = Boolean(screens.length > 0 && !isAnalyzing);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (canSubmit) onSubmit();
      }}
      className="flex flex-col gap-5 rounded-2xl border bg-card p-6 shadow-sm"
    >
      <div>
        <h2 className="text-base font-semibold tracking-tight">{t("auditContext")}</h2>
        <p className="mt-1 text-xs text-muted-foreground">{t("auditContextDesc")}</p>
      </div>

      <Field label={t("domainLabel")} hint={t("domainHint")}>
        <input
          value={domain}
          onChange={(e) => onChange({ domain: e.target.value })}
          placeholder={t("domainPlaceholder")}
          className="input-base"
        />
      </Field>

      <Field label={t("personaLabel")} hint={t("personaHint")}>
        <textarea
          value={persona}
          onChange={(e) => onChange({ persona: e.target.value })}
          placeholder={t("personaPlaceholder")}
          rows={3}
          className="input-base resize-none"
        />
      </Field>

      <Field label={t("goalLabel")} hint={t("goalHint")}>
        <textarea
          value={goal}
          onChange={(e) => onChange({ goal: e.target.value })}
          placeholder={t("goalPlaceholder")}
          rows={3}
          className="input-base resize-none"
        />
      </Field>

      <Field label={t("flowScreensLabel")} hint={t("flowScreensHint")}>
        <FlowGallery screens={screens} onChange={(next) => onChange({ screens: next })} />
      </Field>

      <button
        type="submit"
        disabled={!canSubmit}
        className={`mt-1 inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium shadow-sm transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-40 ${
          canSubmit
            ? "bg-emerald-600 text-white btn-glow hover:scale-[1.02] hover:bg-emerald-500 active:scale-[0.98]"
            : "bg-primary text-primary-foreground"
        }`}
      >
        {isAnalyzing ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            {t("analyzingFlow")}
          </>
        ) : (
          <>
            <Sparkles size={16} />
            {t("analyzeFlow")}
            {screens.length > 0
              ? ` (${screens.length} ${language === "id" ? "layar" : `screen${screens.length === 1 ? "" : "s"}`})`
              : ""}
          </>
        )}
      </button>

      <style>{`
        .input-base {
          width: 100%;
          border-radius: 0.75rem;
          border: 1px solid var(--color-border);
          background: var(--color-background);
          padding: 0.625rem 0.75rem;
          font-size: 0.875rem;
          color: var(--color-foreground);
          outline: none;
          transition: border-color 0.15s, box-shadow 0.15s;
        }
        .input-base::placeholder { color: var(--color-muted-foreground); }
        .input-base:focus {
          border-color: var(--color-foreground);
          box-shadow: 0 0 0 3px color-mix(in oklab, var(--color-foreground) 10%, transparent);
        }
        .btn-glow {
          box-shadow: 0 0 12px color-mix(in oklab, #10b981 30%, transparent);
          animation: pulse-glow 2s infinite ease-in-out;
        }
        @keyframes pulse-glow {
          0%, 100% {
            box-shadow: 0 0 12px color-mix(in oklab, #10b981 25%, transparent);
          }
          50% {
            box-shadow: 0 0 20px color-mix(in oklab, #10b981 55%, transparent),
                        0 0 4px color-mix(in oklab, #10b981 20%, transparent);
          }
        }
      `}</style>
    </form>
  );
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-xs font-medium text-foreground">{label}</span>
      {children}
      {hint && <span className="text-[11px] text-muted-foreground">{hint}</span>}
    </label>
  );
}
