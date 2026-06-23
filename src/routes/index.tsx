import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ScanLine } from "lucide-react";
import { InputForm } from "@/components/audit/InputForm";
import { ResultsDashboard } from "@/components/audit/ResultsDashboard";
import {
  runFlowAudit,
  type FlowAuditResult,
  type ScreenAuditResult,
  type ScreenInput,
} from "@/lib/mock-audit";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "UX Audit Engine — Sequential flow heuristic review" },
      {
        name: "description",
        content:
          "Upload an entire user flow and get a prioritized list of UX findings. Each screen is analyzed sequentially with prior-screen context.",
      },
      { property: "og:title", content: "UX Audit Engine" },
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
              <h1 className="text-sm font-semibold tracking-tight">UX Audit Engine</h1>
              <div className="text-[11px] text-muted-foreground">
                Sequential heuristic review for product flows
              </div>
            </div>
          </div>
          <div className="hidden text-xs text-muted-foreground sm:block">
            Mock analysis · Screens processed one-by-one with chained context
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
          <ResultsDashboard
            state={state}
            screens={screens}
            progress={progress}
            result={result}
          />
        </section>
      </main>
    </div>
  );
}
