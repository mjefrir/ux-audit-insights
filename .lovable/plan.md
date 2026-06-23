# Sequential Loop Architecture for Multi-Screen Flow

Switch the audit from a single-screenshot input to a **flow gallery** (Screen 1…N) and process each screen one-by-one, passing a compact `summary_state` from the previous screen as context. Final dashboard merges all findings.

This iteration keeps **mock processing** (no external API) — same constraint as the previous step. Wiring to Lovable AI Gateway can be a follow-up once you confirm.

## UX

**Left panel — Flow input**
- Keep Domain / Persona / Goal fields.
- Replace single Dropzone with a **multi-image gallery uploader**:
  - Drop or browse → multiple files accepted at once.
  - Each thumbnail shows ordinal badge `Screen 1`, `Screen 2`, … (order = upload order).
  - Reorder via drag handle, remove via X, add more appends to the end.
  - Renumbering is automatic on any change.
- Submit button: `Analyze Flow (N screens)`, disabled until context fields + ≥1 screen.

**Right panel — Sequential progress + dashboard**
- While running, show a stepper:
  - `Screen 1 ✓ analyzed → Screen 2 ⏳ analyzing… → Screen 3 ⋯ queued`
  - Each completed step is expandable to peek at that screen's `summary_state` and finding count.
- When all screens complete:
  - **Overall health gauge** (weighted across all findings).
  - **Per-screen tabs / segmented control** to filter findings by screen, plus an "All screens" view.
  - Severity chip summary (Critical / Major / Minor / Cosmetic) — global + per-screen.
  - Finding cards add a `Screen N` badge alongside severity.

## Sequential Loop (mock backend)

A single async runner processes screens in order:

```text
for i in 0..N-1:
  prev = i === 0 ? null : results[i-1].summary_state
  result_i = analyzeScreen({
    screen: screens[i],          // file + ordinal
    context: { domain, persona, goal },
    pastContext: prev,           // ← carries forward, no prior images
  })
  results.push(result_i)
  emit progress(i, result_i)
```

Each `analyzeScreen` returns:
```ts
{
  screenIndex: number,
  summary_state: string,    // 1–2 sentence recap of what this screen is/does, used as next screen's pastContext
  findings: Finding[],      // same shape as today + screenIndex field
}
```

The mock implementation:
- Simulates ~700–1200 ms per screen via `setTimeout`.
- Picks 1–3 findings per screen from a seeded pool keyed by `screenIndex` so results feel coherent.
- Builds a deterministic `summary_state` like `"Screen 2 — Login form with email/password and SSO options; user is mid-authentication."` that the next mock step echoes into its justification to make the chaining visible.
- Exposes progress via a callback so UI can stream updates.

Aggregation:
- `overallScore` = weighted penalty across **all** findings (existing formula reused).
- `findings` = concatenation of all per-screen findings, tagged with `screenIndex`.

## Files

**New**
- `src/components/audit/FlowGallery.tsx` — multi-file dropzone + ordered thumbnail grid (add / remove / reorder).
- `src/components/audit/SequentialProgress.tsx` — stepper showing per-screen status + summary_state peek.
- `src/components/audit/ScreenFilter.tsx` — "All / Screen 1 / Screen 2 …" filter bar for the dashboard.

**Updated**
- `src/lib/mock-audit.ts`
  - Add `ScreenInput`, `ScreenAuditResult`, `FlowAuditResult` types.
  - Add `runFlowAudit({ screens, context, onProgress })` async iterator that loops sequentially and emits progress.
  - Extend `Finding` with `screenIndex`.
- `src/components/audit/InputForm.tsx` — swap Dropzone → FlowGallery, update submit label + enable rule.
- `src/components/audit/ResultsDashboard.tsx` — show SequentialProgress while loading; once ready, show gauge + ScreenFilter + filtered findings list.
- `src/components/audit/FindingCard.tsx` — add `Screen N` badge.
- `src/routes/index.tsx` — state: `screens: ScreenInput[]`, `flowResult: FlowAuditResult | null`, `progress: ScreenAuditResult[]`; submit kicks off `runFlowAudit` and streams progress.

**Removed/unused**
- `Dropzone.tsx` superseded by `FlowGallery.tsx` (delete to avoid drift).

## Out of scope (this iteration)

- No real AI calls; still mock. Real Lovable AI Gateway wiring (sending image + pastContext per screen, parsing JSON) is a separate step.
- No persistence between sessions; refresh clears the flow.
- No export/share of the report.
- No cancel button mid-run (can add later if desired).

## Notes for technical reviewers

- The loop is a plain async `for…of` so it can later be swapped to call a `createServerFn` per screen without restructuring UI state.
- `summary_state` is intentionally a short string (the only thing passed forward) — this is the exact shape needed to avoid token bloat when we move to real models.
- Progress is pushed via callback, not polled, so the stepper updates immediately as each screen finishes.
