import React, { createContext, useContext, useState, useEffect } from "react";

export type Language = "en" | "id";

export const translations = {
  en: {
    // Header
    title: "Heuristic Evaluation Checker",
    subtitle: "Sequential heuristic review for product flows",
    headerHint: "Mock analysis · Screens processed one-by-one with chained context",
    // InputForm
    auditContext: "Audit context",
    auditContextDesc: "Provide product context so findings are tailored to your users.",
    domainLabel: "Product Domain & Stage",
    domainHint: "e.g. Fintech mobile app — MVP",
    domainPlaceholder: "Fintech — MVP",
    personaLabel: "Target User Persona",
    personaHint: "Who is this for?",
    personaPlaceholder: "Freelancers, 25–40, managing irregular income",
    goalLabel: "Current User Goal",
    goalHint: "What are they trying to accomplish?",
    goalPlaceholder: "Transfer money to a saved recipient in under 30s",
    flowScreensLabel: "Flow screens",
    flowScreensHint:
      "Upload screens in order — they'll be analyzed sequentially with prior-screen context",
    analyzeFlow: "Analyze Flow",
    analyzingFlow: "Analyzing flow…",
    // FlowGallery
    addMoreScreens: "Add more screens",
    dropScreensHere: "Drop screens here",
    uploadHint: "PNG, JPG or WEBP · multiple files · click to browse",
    screenLabel: "Screen",
    removeScreen: "Remove screen",
    // ResultsDashboard
    resultsTitle: "Heuristic Evaluation Results",
    resultsSubtitle:
      "Upload your flow screens and click Analyze Flow. Each screen is reviewed in order, carrying context forward.",
    overview: "Overview",
    heuristicViolations: "Heuristic Violations",
    sortedBySeverity: "Sorted by severity (highest first)",
    noViolations: "No violations found on this screen.",
    allScreens: "All Screens",
    finding: "Finding",
    justification: "Justification",
    recommendation: "Recommendation",
    severity: "Severity",
    severityEffort: "Severity & Effort",
    devEffort: "Dev Effort",
    aiConfidence: "AI Confidence",
    severityCritical: "Critical",
    severityMajor: "Major",
    severityMinor: "Minor",
    severityCosmetic: "Cosmetic",
    effortLow: "Low",
    effortMedium: "Medium",
    effortHigh: "High",
    uxHealthScore: "UX Health Score",
    scoreGood: "Good",
    scoreWarn: "Warning",
    scoreBad: "Poor",
    // SequentialProgress
    progressQueued: "queued",
    progressAnalyzing: "Analyzing Screen",
    progressAnalyzed: "analyzed",
    progressChained: "Analyzing with chronological marker from Screen",
  },
  id: {
    // Header
    title: "Pemeriksa Evaluasi Heuristik",
    subtitle: "Tinjauan heuristik berurutan untuk alur produk",
    headerHint: "Analisis simulasi · Layar diproses satu per satu dengan konteks berantai",
    // InputForm
    auditContext: "Konteks audit",
    auditContextDesc: "Berikan konteks produk agar temuan dapat disesuaikan dengan pengguna Anda.",
    domainLabel: "Domain & Tahap Produk",
    domainHint: "contoh: Aplikasi seluler Fintech — MVP",
    domainPlaceholder: "Fintech — MVP",
    personaLabel: "Persona Pengguna Sasaran",
    personaHint: "Untuk siapa produk ini?",
    personaPlaceholder: "Pekerja lepas, usia 25–40, mengelola pendapatan tidak menentu",
    goalLabel: "Tujuan Pengguna Saat Ini",
    goalHint: "Apa yang ingin mereka capai?",
    goalPlaceholder: "Transfer uang ke penerima tersimpan dalam kurang dari 30 detik",
    flowScreensLabel: "Layar Alur",
    flowScreensHint:
      "Unggah gambar layar secara berurutan — analisis akan dilakukan berantai berdasarkan konteks layar sebelumnya",
    analyzeFlow: "Analisis Alur",
    analyzingFlow: "Menganalisis alur…",
    // FlowGallery
    addMoreScreens: "Tambah layar lagi",
    dropScreensHere: "Letakkan layar di sini",
    uploadHint: "PNG, JPG atau WEBP · beberapa file · klik untuk mencari",
    screenLabel: "Layar",
    removeScreen: "Hapus layar",
    // ResultsDashboard
    resultsTitle: "Hasil Evaluasi Heuristik",
    resultsSubtitle:
      "Unggah gambar layar alur Anda lalu klik Analisis Alur. Setiap layar ditinjau secara berurutan dengan membawa konteks sebelumnya.",
    overview: "Ringkasan",
    heuristicViolations: "Pelanggaran Heuristik",
    sortedBySeverity: "Diurutkan berdasarkan tingkat keparahan (tertinggi dahulu)",
    noViolations: "Tidak ditemukan pelanggaran di layar ini.",
    allScreens: "Semua Layar",
    finding: "Temuan",
    justification: "Justifikasi",
    recommendation: "Rekomendasi",
    severity: "Tingkat Keparahan",
    severityEffort: "Keparahan & Upaya",
    devEffort: "Upaya Dev",
    aiConfidence: "Keyakinan AI",
    severityCritical: "Kritis",
    severityMajor: "Mayor",
    severityMinor: "Minor",
    severityCosmetic: "Kosmetik",
    effortLow: "Rendah",
    effortMedium: "Sedang",
    effortHigh: "Tinggi",
    uxHealthScore: "Skor Kesehatan UX",
    scoreGood: "Baik",
    scoreWarn: "Peringatan",
    scoreBad: "Buruk",
    // SequentialProgress
    progressQueued: "antre",
    progressAnalyzing: "Menganalisis Layar",
    progressAnalyzed: "teranalisis",
    progressChained: "Menganalisis dengan penanda kronologis dari Layar",
  },
};

type TranslationsKey = keyof typeof translations.en;

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: TranslationsKey) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en");

  useEffect(() => {
    const saved = localStorage.getItem("preferred_language") as Language;
    if (saved === "en" || saved === "id") {
      setLanguageState(saved);
    } else {
      // Try browser language
      const browserLang = navigator.language.slice(0, 2);
      if (browserLang === "id") {
        setLanguageState("id");
      }
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("preferred_language", lang);
  };

  const t = (key: TranslationsKey): string => {
    return translations[language][key] || translations.en[key] || String(key);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
