import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ScanLine } from "lucide-react";
import { InputForm } from "@/components/audit/InputForm";
import { ResultsDashboard } from "@/components/audit/ResultsDashboard";
import { useLanguage } from "@/context/LanguageContext";
import {
  runFlowAudit,
  type FlowAuditResult,
  type ScreenAuditResult,
  type ScreenInput,
} from "@/lib/mock-audit";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Heuristic Evaluation Checker — Sequential flow heuristic review" },
      {
        name: "description",
        content:
          "Upload an entire user flow and get a prioritized list of UX findings. Each screen is analyzed sequentially with prior-screen context.",
      },
      { property: "og:title", content: "Heuristic Evaluation Checker" },
      {
        property: "og:description",
        content:
          "Sequential UX audit across multiple screens — prioritized findings, recommendations, and dev effort estimates.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  const { language, setLanguage, t } = useLanguage();
  const [domain, setDomain] = useState("");
  const [persona, setPersona] = useState("");
  const [goal, setGoal] = useState("");
  const [screens, setScreens] = useState<ScreenInput[]>([]);
  const [state, setState] = useState<"idle" | "loading" | "ready">("idle");
  const [progress, setProgress] = useState<ScreenAuditResult[]>([]);
  const [result, setResult] = useState<FlowAuditResult | null>(null);

  const handleChange = (patch: {
    domain?: string;
    persona?: string;
    goal?: string;
    screens?: ScreenInput[];
  }) => {
    if (patch.domain !== undefined) setDomain(patch.domain);
    if (patch.persona !== undefined) setPersona(patch.persona);
    if (patch.goal !== undefined) setGoal(patch.goal);
    if (patch.screens !== undefined) setScreens(patch.screens);
  };

  const handleSubmit = async () => {
    setState("loading");
    setProgress([]);
    setResult(null);
    const final = await runFlowAudit({
      screens,
      context: { domain, persona, goal },
      language,
      onProgress: (r) => {
        setProgress((prev) => [...prev, r]);
      },
    });
    setResult(final);
    setState("ready");
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-10 border-b bg-background/80 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-foreground text-background">
              <ScanLine size={16} />
            </div>
            <div>
              <h1 className="text-sm font-semibold tracking-tight">{t("title")}</h1>
              <div className="text-[11px] text-muted-foreground">{t("subtitle")}</div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden text-xs text-muted-foreground sm:block">{t("headerHint")}</div>
            <div className="flex items-center gap-1 rounded-lg border bg-muted/40 p-0.5">
              <button
                type="button"
                onClick={() => setLanguage("en")}
                className={`cursor-pointer rounded-md px-2 py-1 text-[11px] font-semibold transition ${
                  language === "en"
                    ? "bg-card text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                EN
              </button>
              <button
                type="button"
                onClick={() => setLanguage("id")}
                className={`cursor-pointer rounded-md px-2 py-1 text-[11px] font-semibold transition ${
                  language === "id"
                    ? "bg-card text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                ID
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto grid max-w-7xl gap-6 px-6 py-8 lg:grid-cols-[minmax(0,420px)_1fr]">
        <section className="lg:sticky lg:top-20 lg:self-start">
          <InputForm
            domain={domain}
            persona={persona}
            goal={goal}
            screens={screens}
            isAnalyzing={state === "loading"}
            onChange={handleChange}
            onSubmit={handleSubmit}
          />
        </section>
        <section>
          <ResultsDashboard state={state} screens={screens} progress={progress} result={result} />
        </section>
      </main>
    </div>
  );
}
