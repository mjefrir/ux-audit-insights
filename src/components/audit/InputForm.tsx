import { Loader2, Sparkles } from "lucide-react";
import { Dropzone } from "./Dropzone";

interface InputFormProps {
  domain: string;
  persona: string;
  goal: string;
  file: File | null;
  previewUrl: string | null;
  isAnalyzing: boolean;
  onChange: (patch: {
    domain?: string;
    persona?: string;
    goal?: string;
    file?: File | null;
    previewUrl?: string | null;
  }) => void;
  onSubmit: () => void;
}

export function InputForm(props: InputFormProps) {
  const { domain, persona, goal, file, previewUrl, isAnalyzing, onChange, onSubmit } = props;
  const canSubmit = Boolean(
    domain.trim() && persona.trim() && goal.trim() && file && !isAnalyzing,
  );

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (canSubmit) onSubmit();
      }}
      className="flex flex-col gap-5 rounded-2xl border bg-card p-6 shadow-sm"
    >
      <div>
        <h2 className="text-base font-semibold tracking-tight">Audit context</h2>
        <p className="mt-1 text-xs text-muted-foreground">
          Provide product context so findings are tailored to your users.
        </p>
      </div>

      <Field label="Product Domain & Stage" hint="e.g. Fintech mobile app — MVP">
        <input
          value={domain}
          onChange={(e) => onChange({ domain: e.target.value })}
          placeholder="Fintech — MVP"
          className="input-base"
        />
      </Field>

      <Field label="Target User Persona" hint="Who is this for?">
        <textarea
          value={persona}
          onChange={(e) => onChange({ persona: e.target.value })}
          placeholder="Freelancers, 25–40, managing irregular income"
          rows={3}
          className="input-base resize-none"
        />
      </Field>

      <Field label="Current User Goal" hint="What are they trying to accomplish?">
        <textarea
          value={goal}
          onChange={(e) => onChange({ goal: e.target.value })}
          placeholder="Transfer money to a saved recipient in under 30s"
          rows={3}
          className="input-base resize-none"
        />
      </Field>

      <Field label="Interface Screenshot" hint="Single image of the screen to audit">
        <Dropzone
          file={file}
          previewUrl={previewUrl}
          onChange={(f, url) => onChange({ file: f, previewUrl: url })}
        />
      </Field>

      <button
        type="submit"
        disabled={!canSubmit}
        className="mt-1 inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground shadow-sm transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
      >
        {isAnalyzing ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            Analyzing interface…
          </>
        ) : (
          <>
            <Sparkles size={16} />
            Analyze Interface
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
