
## UX Audit Engine — Build Plan

A single-page SaaS-style tool that takes UX context + a screenshot and returns a mocked heuristic audit dashboard.

### Scope
- One route: `/` (replace placeholder in `src/routes/index.tsx`).
- No backend, no Lovable Cloud — fully client-side with internal mock JSON.
- React + Tailwind v4 (already configured) + `lucide-react` (already a shadcn dep).

### Layout
Two-column responsive layout (stacks on mobile):
- **Left (≈40%)**: Input form panel.
- **Right (≈60%)**: Results dashboard.
Sticky top header with product name, subtle logo mark, and short tagline.

### Left panel — Input form
Fields (all required to enable submit):
1. `Product Domain & Stage` — text input (e.g. "Fintech – MVP").
2. `Target User Persona` — textarea.
3. `Current User Goal` — textarea.
4. **Screenshot uploader** — drag-and-drop zone + click-to-browse:
   - Accepts single image (png/jpg/webp).
   - Shows thumbnail preview with filename, size, and a remove (X) button after upload.
   - Drag-over visual state (border + bg tint).
5. **Analyze Interface** button:
   - Disabled until all 4 fields filled.
   - On click: 1.2s simulated loading (spinner + "Analyzing interface…"), then populate dashboard from mock JSON.

### Right panel — Results dashboard
Two states:
- **Empty state**: centered icon + "Run an analysis to see results" copy.
- **Results state**:
  - **Overall Health Score**: circular gauge (SVG, stroke-dasharray animation) showing 0–100. Color shifts with score (red <50, amber 50–74, green ≥75). Subtitle: "Based on N findings across heuristic categories".
  - Summary chips: count of issues per severity (Critical / Major / Minor / Cosmetic).
  - **Findings list**: cards sorted by severity desc, each card shows:
    - Severity badge (color-coded left border + pill label).
    - Location (component path/area).
    - Problem (bold title).
    - Justification (with heuristic reference, e.g. "Nielsen #4 — Consistency").
    - Recommendation.
    - Footer row: `Dev Effort` (Low/Med/High badge) + `AI Confidence` (small horizontal bar with %).

### Severity color tokens
Defined in `src/styles.css` as semantic tokens (no hardcoded hex in components):
- `--severity-critical` red
- `--severity-major` orange
- `--severity-minor` yellow
- `--severity-cosmetic` gray
Plus `-foreground` variants and registered in `@theme inline` so `bg-severity-critical` etc. work.

### Mock data
`src/lib/mock-audit.ts` exports a function `generateMockAudit()` returning:
```ts
{ overallScore: 68, findings: [ { id, severity: 1-4, location, problem, justification, recommendation, devEffort: 'Low'|'Medium'|'High', aiConfidence: 0-100 }, ... ] }
```
~6 realistic findings spanning all 4 severities.

### File structure
- `src/routes/index.tsx` — page shell + header + 2-column grid, owns form + result state.
- `src/components/audit/InputForm.tsx` — fields, dropzone, submit.
- `src/components/audit/Dropzone.tsx` — drag-drop + preview.
- `src/components/audit/ResultsDashboard.tsx` — empty/loading/results states.
- `src/components/audit/HealthGauge.tsx` — SVG circular gauge.
- `src/components/audit/FindingCard.tsx` — single finding card.
- `src/lib/mock-audit.ts` — mock data + types.
- `src/styles.css` — add severity tokens.

### Design language
Clean SaaS aesthetic: white surfaces, soft `border` lines, generous spacing, `rounded-xl`, subtle shadows, monochrome neutrals with severity colors as the only saturated accents. Sans-serif (system stack — no extra font fetch unless requested). Inter-like feel via Tailwind defaults.

### Out of scope (for this iteration)
- Real AI/vision analysis, file persistence, multi-screenshot, export/share, auth.

Ready to build on approval.
