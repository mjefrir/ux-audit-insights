import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ScanLine } from "lucide-react";
import { InputForm } from "@/components/audit/InputForm";
import { ResultsDashboard } from "@/components/audit/ResultsDashboard";
import { generateMockAudit, type AuditResult } from "@/lib/mock-audit";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "UX Audit Engine — Heuristic interface review" },
      {
        name: "description",
        content:
          "Upload an interface screenshot and get a prioritized list of UX findings with severity, recommendations, and dev effort.",
      },
      { property: "og:title", content: "UX Audit Engine" },
      {
        property: "og:description",
        content:
          "Heuristic UX audit of any screen — prioritized findings, recommendations, and dev effort estimates.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  const [domain, setDomain] = useState("");
  const [persona, setPersona] = useState("");
  const [goal, setGoal] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [state, setState] = useState<"idle" | "loading" | "ready">("idle");
  const [result, setResult] = useState<AuditResult | null>(null);

  const handleChange = (patch: {
    domain?: string;
    persona?: string;
    goal?: string;
    file?: File | null;
    previewUrl?: string | null;
  }) => {
    if (patch.domain !== undefined) setDomain(patch.domain);
    if (patch.persona !== undefined) setPersona(patch.persona);
    if (patch.goal !== undefined) setGoal(patch.goal);
    if (patch.file !== undefined) setFile(patch.file);
    if (patch.previewUrl !== undefined) {
      if (previewUrl && patch.previewUrl !== previewUrl) URL.revokeObjectURL(previewUrl);
      setPreviewUrl(patch.previewUrl);
    }
  };

  const handleSubmit = () => {
    setState("loading");
    setResult(null);
    setTimeout(() => {
      setResult(generateMockAudit());
      setState("ready");
    }, 1200);
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
                Heuristic review for product teams
              </div>
            </div>
          </div>
          <div className="hidden text-xs text-muted-foreground sm:block">
            Mock analysis · No data leaves your browser
          </div>
        </div>
      </header>

      <main className="mx-auto grid max-w-7xl gap-6 px-6 py-8 lg:grid-cols-[minmax(0,420px)_1fr]">
        <section className="lg:sticky lg:top-20 lg:self-start">
          <InputForm
            domain={domain}
            persona={persona}
            goal={goal}
            file={file}
            previewUrl={previewUrl}
            isAnalyzing={state === "loading"}
            onChange={handleChange}
            onSubmit={handleSubmit}
          />
        </section>
        <section>
          <ResultsDashboard state={state} result={result} />
        </section>
      </main>
    </div>
  );
}
