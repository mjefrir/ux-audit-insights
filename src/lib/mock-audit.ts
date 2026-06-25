export type Severity = 1 | 2 | 3 | 4;
export type DevEffort = "Low" | "Medium" | "High";

export interface Finding {
  id: string;
  screenIndex: number;
  severity: Severity;
  location: string;
  problem: string;
  justification: string;
  recommendation: string;
  devEffort: DevEffort;
  aiConfidence: number;
}

export interface ScreenInput {
  id: string;
  file: File;
  previewUrl: string;
}

export interface AuditContext {
  domain: string;
  persona: string;
  goal: string;
}

/**
 * Lean chronological marker passed from one screen's analysis to the next.
 * Intentionally excludes findings, violations, justifications, or any audit
 * verdict — only the prior screen's identity and the user action that led
 * into the next screen. Keeps the API call payload bounded.
 */
export interface PastContext {
  previousScreenLabel: string;
  actionSummary: string;
}

export interface ScreenAuditResult {
  screenIndex: number;
  screenLabel: string;
  summary_state: string;
  action_summary: string;
  findings: Finding[];
}

export interface FlowAuditResult {
  overallScore: number;
  screens: ScreenAuditResult[];
  findings: Finding[];
}

const SEV_WEIGHT: Record<Severity, number> = { 4: 18, 3: 10, 2: 5, 1: 2 };

// Seeded pool of candidate findings. Every entry maps to exactly ONE of
// Nielsen Norman Group's 10 Usability Heuristics. No WCAG, no Apple HIG,
// no Material guidelines, no other frameworks are used as evaluation basis.
// Reference: https://www.nngroup.com/articles/ten-usability-heuristics/
const POOL: Omit<Finding, "id" | "screenIndex">[] = [
  {
    severity: 4,
    location: "Submit flow",
    problem: "No visible system status during processing",
    justification:
      "Heuristic #1 — Visibility of System Status. After tapping submit the interface gives no feedback (no spinner, no disabled state, no progress), so users cannot tell whether the system received their action.",
    recommendation:
      "Show an inline button spinner, disable the form, and surface a progress indicator until the response returns.",
    devEffort: "Medium",
    aiConfidence: 90,
  },
  {
    severity: 3,
    location: "Header iconography",
    problem: "Icons use system-jargon metaphors unfamiliar to the target persona",
    justification:
      "Heuristic #2 — Match Between System and the Real World. Icons reference internal product concepts rather than objects/words from the user's domain, forcing users to translate before acting.",
    recommendation:
      "Replace abstract glyphs with familiar real-world metaphors and pair each icon with a short text label.",
    devEffort: "Low",
    aiConfidence: 82,
  },
  {
    severity: 3,
    location: "Destructive action",
    problem: "No clear undo or exit path after a committing action",
    justification:
      "Heuristic #3 — User Control and Freedom. The destructive action commits immediately with no emergency exit, trapping users who tapped by mistake.",
    recommendation:
      "Provide an explicit Cancel/Back affordance and a time-boxed Undo toast after the action commits.",
    devEffort: "Medium",
    aiConfidence: 85,
  },
  {
    severity: 3,
    location: "Top navigation",
    problem: "Active route is not visually distinguished, breaking platform convention",
    justification:
      "Heuristic #4 — Consistency and Standards. Other screens in this product (and conventional navigation patterns users already know) mark the active item; this screen does not, forcing recall.",
    recommendation:
      "Apply a consistent active-state treatment (underline + foreground color) matching the rest of the product.",
    devEffort: "Low",
    aiConfidence: 88,
  },
  {
    severity: 4,
    location: "Form fields",
    problem: "Easy-to-confuse fields lack confirmation or constraints before commit",
    justification:
      "Heuristic #5 — Error Prevention. The form accepts ambiguous input (similar-looking options, free-text where a picker would do) without a confirmation step, inviting slips.",
    recommendation:
      "Constrain input with pickers/format masks where possible and add a confirmation step for irreversible commits.",
    devEffort: "Medium",
    aiConfidence: 83,
  },
  {
    severity: 3,
    location: "Multi-step flow",
    problem: "Users must remember information from a previous step",
    justification:
      "Heuristic #6 — Recognition Rather Than Recall. The current screen asks users to recall values (selected plan, recipient, prior input) that were entered earlier instead of surfacing them.",
    recommendation:
      "Echo a compact summary of prior selections at the top of the screen so users recognize rather than recall.",
    devEffort: "Medium",
    aiConfidence: 84,
  },
  {
    severity: 2,
    location: "Primary task surface",
    problem: "No accelerator for experienced users to skip repetitive steps",
    justification:
      "Heuristic #7 — Flexibility and Efficiency of Use. Every user, novice or expert, must walk the same path; there are no shortcuts, saved defaults, or bulk actions.",
    recommendation:
      "Add accelerators (keyboard shortcuts, saved templates, bulk actions) that experts can opt into without burdening novices.",
    devEffort: "Medium",
    aiConfidence: 78,
  },
  {
    severity: 2,
    location: "Content density",
    problem: "Screen contains visual elements that do not support the user's current goal",
    justification:
      "Heuristic #8 — Aesthetic and Minimalist Design. Decorative or rarely-needed content competes with the primary action for the user's attention, diluting visual hierarchy.",
    recommendation:
      "Remove or progressively disclose non-essential elements so the primary action dominates the visual hierarchy.",
    devEffort: "Low",
    aiConfidence: 80,
  },
  {
    severity: 4,
    location: "Error messaging",
    problem: "Error message is a generic code with no diagnosis or recovery path",
    justification:
      "Heuristic #9 — Help Users Recognize, Diagnose, and Recover from Errors. The message uses technical jargon (or a numeric code), does not explain the cause, and gives no constructive next step.",
    recommendation:
      "Rewrite errors in plain language, state the cause precisely, and offer a concrete recovery action (retry, edit field, contact support).",
    devEffort: "Low",
    aiConfidence: 89,
  },
  {
    severity: 2,
    location: "Complex feature",
    problem: "No contextual help or documentation entry point",
    justification:
      "Heuristic #10 — Help and Documentation. The feature exposes advanced controls but offers no inline guidance, tooltip, or link to docs, so users hit a wall when stuck.",
    recommendation:
      "Add a contextual help affordance (tooltip, link to focused docs, or inline tip) located at the point of need.",
    devEffort: "Low",
    aiConfidence: 76,
  },
];

const POOL_ID: Omit<Finding, "id" | "screenIndex">[] = [
  {
    severity: 4,
    location: "Alur pengiriman",
    problem: "Tidak ada status sistem yang terlihat selama pemrosesan",
    justification:
      "Heuristik #1 — Visibilitas Status Sistem. Setelah mengetuk kirim, antarmuka tidak memberikan umpan balik (tidak ada spinner, tidak ada status dinonaktifkan, tidak ada progres), sehingga pengguna tidak dapat mengetahui apakah sistem menerima tindakan mereka.",
    recommendation:
      "Tampilkan spinner tombol inline, nonaktifkan formulir, dan tampilkan indikator kemajuan hingga respons kembali.",
    devEffort: "Medium",
    aiConfidence: 90,
  },
  {
    severity: 3,
    location: "Ikonografi header",
    problem: "Ikon menggunakan metafora jargon sistem yang tidak dikenal oleh persona sasaran",
    justification:
      "Heuristik #2 — Kecocokan Antara Sistem dan Dunia Nyata. Ikon merujuk pada konsep produk internal daripada objek/kata dari domain pengguna, memaksa pengguna untuk menerjemahkan sebelum bertindak.",
    recommendation:
      "Ganti glif abstrak dengan metafora dunia nyata yang familier dan pasangkan setiap ikon dengan label teks pendek.",
    devEffort: "Low",
    aiConfidence: 82,
  },
  {
    severity: 3,
    location: "Tindakan destruktif",
    problem: "Tidak ada jalur pembatalan (undo) atau jalan keluar yang jelas setelah tindakan komitmen",
    justification:
      "Heuristik #3 — Kontrol dan Kebebasan Pengguna. Tindakan destruktif langsung dilakukan tanpa jalan keluar darurat, menjebak pengguna yang mengetuk secara tidak sengaja.",
    recommendation:
      "Sediakan pembatalan/kembali yang jelas dan berikan toast Urungkan (Undo) dengan batas waktu setelah tindakan dikomit.",
    devEffort: "Medium",
    aiConfidence: 85,
  },
  {
    severity: 3,
    location: "Navigasi atas",
    problem: "Rute aktif tidak dibedakan secara visual, melanggar konvensi platform",
    justification:
      "Heuristik #4 — Konsistensi dan Standar. Layar lain dalam produk ini (dan pola navigasi konvensional yang sudah dikenal pengguna) tidak menandai item aktif; layar ini tidak, memaksa pengguna untuk mengingat.",
    recommendation:
      "Terapkan perlakuan status aktif yang konsisten (garis bawah + warna latar depan) yang cocok dengan bagian produk lainnya.",
    devEffort: "Low",
    aiConfidence: 88,
  },
  {
    severity: 4,
    location: "Bidang formulir",
    problem: "Bidang yang mudah membingungkan kurang memiliki konfirmasi atau batasan sebelum komit",
    justification:
      "Heuristik #5 — Pencegahan Kesalahan. Formulir menerima input yang ambigu (opsi yang tampak serupa, teks bebas di mana pemilih opsi dapat digunakan) tanpa langkah konfirmasi, mengundang kesalahan.",
    recommendation:
      "Batasi input dengan pemilih/masker format jika memungkinkan dan tambahkan langkah konfirmasi untuk komit yang tidak dapat dibatalkan.",
    devEffort: "Medium",
    aiConfidence: 83,
  },
  {
    severity: 3,
    location: "Alur multi-langkah",
    problem: "Pengguna harus mengingat informasi dari langkah sebelumnya",
    justification:
      "Heuristik #6 — Pengenalan daripada Pemanggilan Kembali. Layar saat ini meminta pengguna untuk mengingat nilai (rencana yang dipilih, penerima, masukan sebelumnya) yang dimasukkan sebelumnya alih-alih menampilkannya.",
    recommendation:
      "Tampilkan ringkasan ringkas dari pilihan sebelumnya di bagian atas layar sehingga pengguna mengenali alih-alih memanggil kembali.",
    devEffort: "Medium",
    aiConfidence: 84,
  },
  {
    severity: 2,
    location: "Permukaan tugas utama",
    problem: "Tidak ada akselerator bagi pengguna berpengalaman untuk melewati langkah berulang",
    justification:
      "Heuristik #7 — Fleksibilitas dan Efisiensi Penggunaan. Setiap pengguna, baik pemula maupun ahli, harus menempuh jalur yang sama; tidak ada pintasan, default tersimpan, atau tindakan massal.",
    recommendation:
      "Tambahkan akselerator (pintasan keyboard, templat tersimpan, tindakan massal) yang dapat dipilih oleh pengguna ahli tanpa membebani pemula.",
    devEffort: "Medium",
    aiConfidence: 78,
  },
  {
    severity: 2,
    location: "Kepadatan konten",
    problem: "Layar berisi elemen visual yang tidak mendukung tujuan pengguna saat ini",
    justification:
      "Heuristik #8 — Desain Estetis dan Minimalis. Konten dekoratif atau yang jarang dibutuhkan bersaing dengan tindakan utama untuk perhatian pengguna, melemahkan hierarki visual.",
    recommendation:
      "Hapus atau tampilkan secara bertahap elemen non-esensial sehingga tindakan utama mendominasi hierarki visual.",
    devEffort: "Low",
    aiConfidence: 80,
  },
  {
    severity: 4,
    location: "Pesan kesalahan",
    problem: "Pesan kesalahan berupa kode umum tanpa diagnosis atau jalur pemulihan",
    justification:
      "Heuristik #9 — Membantu Pengguna Mengenali, Mendiagnosis, dan Memulihkan diri dari Kesalahan. Pesan menggunakan jargon teknis (atau kode numerik), tidak menjelaskan penyebabnya, dan tidak memberikan langkah pemulihan yang konstruktif.",
    recommendation:
      "Tulis ulang kesalahan dalam bahasa yang jelas, sebutkan penyebabnya secara tepat, dan tawarkan tindakan pemulihan yang konkret (coba lagi, edit bidang, hubungi dukungan).",
    devEffort: "Low",
    aiConfidence: 89,
  },
  {
    severity: 2,
    location: "Fitur kompleks",
    problem: "Tidak ada bantuan kontekstual atau titik masuk dokumentasi",
    justification:
      "Heuristik #10 — Bantuan dan Dokumentasi. Fitur ini menampilkan kontrol lanjutan tetapi tidak menawarkan panduan inline, tooltip, atau tautan ke dokumen, sehingga pengguna menemui jalan buntu saat macet.",
    recommendation:
      "Tambahkan fitur bantuan kontekstual (tooltip, tautan ke dokumen terfokus, atau tip inline) yang terletak di titik yang dibutuhkan.",
    devEffort: "Low",
    aiConfidence: 76,
  },
];

function rng(seed: number) {
  let s = seed * 9301 + 49297;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

function buildSummaryState(screenIndex: number, fileName: string, lang: "en" | "id"): string {
  const archetypesEn = [
    "entry / landing surface — orienting the user to product value",
    "authentication step — collecting credentials before progressing",
    "primary task surface — the user is mid-flow performing the core action",
    "confirmation / review step — user verifying before commit",
    "result / success state — outcome of the prior action",
    "settings / configuration surface",
  ];
  const archetypesId = [
    "permukaan entri / pendaratan — mengarahkan pengguna ke nilai produk",
    "langkah autentikasi — mengumpulkan kredensial sebelum melanjutkan",
    "permukaan tugas utama — pengguna berada di tengah alur melakukan tindakan inti",
    "langkah konfirmasi / tinjauan — pengguna memverifikasi sebelum melakukan komit",
    "hasil / status sukses — hasil dari tindakan sebelumnya",
    "permukaan pengaturan / konfigurasi",
  ];
  const archetypes = lang === "id" ? archetypesId : archetypesEn;
  const arch = archetypes[screenIndex % archetypes.length];
  return lang === "id"
    ? `Layar ${screenIndex + 1} (${fileName}) — ${arch}.`
    : `Screen ${screenIndex + 1} (${fileName}) — ${arch}.`;
}

function buildActionSummary(screenIndex: number, lang: "en" | "id"): string {
  const actionsEn = [
    "User landed on the entry surface.",
    "User submitted credentials to authenticate.",
    "User performed the primary task action.",
    "User reviewed details before confirming.",
    "User reached the success outcome.",
    "User adjusted configuration preferences.",
  ];
  const actionsId = [
    "Pengguna mendarat di permukaan entri.",
    "Pengguna mengirimkan kredensial untuk autentikasi.",
    "Pengguna melakukan tindakan tugas utama.",
    "Pengguna meninjau detail sebelum mengonfirmasi.",
    "Pengguna mencapai hasil sukses.",
    "Pengguna menyesuaikan preferensi konfigurasi.",
  ];
  const actions = lang === "id" ? actionsId : actionsEn;
  return actions[screenIndex % actions.length];
}

async function analyzeScreen(args: {
  screen: ScreenInput;
  index: number;
  context: AuditContext;
  pastContext: PastContext | null;
  language: "en" | "id";
}): Promise<ScreenAuditResult> {
  const { screen, index, pastContext, language } = args;
  // Simulate per-screen latency.
  const delay = 700 + Math.floor(Math.random() * 500);
  await new Promise((r) => setTimeout(r, delay));

  const rand = rng(index + 1 + screen.file.size);
  const count = 1 + Math.floor(rand() * 3); // 1–3 findings
  const pool = language === "id" ? POOL_ID : POOL;
  const picks = new Set<number>();
  while (picks.size < count) picks.add(Math.floor(rand() * pool.length));

  const findings: Finding[] = Array.from(picks).map((poolIdx, i) => {
    const base = pool[poolIdx];
    // Reference only the prior screen label + user action — never prior findings.
    const tiedToPast =
      pastContext && i === 0
        ? language === "id"
          ? ` Datang dari ${pastContext.previousScreenLabel} (${pastContext.actionSummary}), layar ini harus menjaga kontinuitas.`
          : ` Coming from ${pastContext.previousScreenLabel} (${pastContext.actionSummary}), this screen should preserve continuity.`
        : "";
    return {
      ...base,
      id: `s${index}-f${i}`,
      screenIndex: index,
      justification: base.justification + tiedToPast,
    };
  });

  return {
    screenIndex: index,
    screenLabel: language === "id" ? `Layar ${index + 1}` : `Screen ${index + 1}`,
    summary_state: buildSummaryState(index, screen.file.name, language),
    action_summary: buildActionSummary(index, language),
    findings,
  };
}

export async function runFlowAudit(args: {
  screens: ScreenInput[];
  context: AuditContext;
  language?: "en" | "id";
  onProgress?: (result: ScreenAuditResult, index: number, total: number) => void;
}): Promise<FlowAuditResult> {
  const { screens, context, language = "en", onProgress } = args;
  const results: ScreenAuditResult[] = [];
  // Lean chronological marker only. Findings are NEVER chained forward.
  let pastContext: PastContext | null = null;

  // Track signatures of issues already raised in prior screens so we never
  // re-emit an identical problem/justification/recommendation on a later
  // screen.
  const seenSignatures = new Set<string>();
  const sig = (f: Finding) => `${f.location}|${f.problem}`;

  for (let i = 0; i < screens.length; i++) {
    const result = await analyzeScreen({
      screen: screens[i],
      index: i,
      context,
      pastContext,
      language,
    });

    // Drop findings whose (location + problem) signature already appeared
    const uniqueFindings = result.findings.filter((f) => {
      const key = sig(f);
      if (seenSignatures.has(key)) return false;
      seenSignatures.add(key);
      return true;
    });

    const dedupedResult: ScreenAuditResult = {
      ...result,
      findings: uniqueFindings,
    };
    results.push(dedupedResult);
    pastContext = {
      previousScreenLabel: dedupedResult.screenLabel,
      actionSummary: dedupedResult.action_summary,
    };
    onProgress?.(dedupedResult, i, screens.length);
  }

  const allFindings = results.flatMap((r) => r.findings);
  const penalty = allFindings.reduce((s, f) => s + SEV_WEIGHT[f.severity], 0);
  const overallScore = Math.max(0, Math.min(100, 100 - penalty));

  return { overallScore, screens: results, findings: allFindings };
}
