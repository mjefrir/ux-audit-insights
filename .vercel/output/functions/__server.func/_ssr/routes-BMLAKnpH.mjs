import { r as __toESM } from "../_runtime.mjs";
import { n as require_jsx_runtime, r as require_react } from "../_libs/react+tanstack__react-query.mjs";
import { n as useLanguage } from "./LanguageContext-CuJq6Dh8.mjs";
import { a as MapPin, c as Gauge, d as Sparkles, f as LoaderCircle, i as ScanLine, l as Circle, n as X, o as ImagePlus, p as Layers, r as ScanSearch, s as GripVertical, t as ZoomIn, u as Check } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-BMLAKnpH.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function FlowGallery({ screens, onChange }) {
	const { t } = useLanguage();
	const [dragOver, setDragOver] = (0, import_react.useState)(false);
	const [dragIndex, setDragIndex] = (0, import_react.useState)(null);
	const inputRef = (0, import_react.useRef)(null);
	const addFiles = (0, import_react.useCallback)((files) => {
		if (!files) return;
		const next = [];
		Array.from(files).forEach((f) => {
			if (!f.type.startsWith("image/")) return;
			next.push({
				id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
				file: f,
				previewUrl: URL.createObjectURL(f)
			});
		});
		if (next.length) onChange([...screens, ...next]);
	}, [screens, onChange]);
	const remove = (id) => {
		const target = screens.find((s) => s.id === id);
		if (target) URL.revokeObjectURL(target.previewUrl);
		onChange(screens.filter((s) => s.id !== id));
	};
	const reorder = (from, to) => {
		if (from === to) return;
		const next = [...screens];
		const [moved] = next.splice(from, 1);
		next.splice(to, 0, moved);
		onChange(next);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
			type: "button",
			onClick: () => inputRef.current?.click(),
			onDragOver: (e) => {
				e.preventDefault();
				setDragOver(true);
			},
			onDragLeave: () => setDragOver(false),
			onDrop: (e) => {
				e.preventDefault();
				setDragOver(false);
				addFiles(e.dataTransfer.files);
			},
			className: `flex w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed px-6 py-8 text-center transition ${dragOver ? "border-foreground/40 bg-muted/60" : "border-border bg-muted/20 hover:bg-muted/40"}`,
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex h-10 w-10 items-center justify-center rounded-full bg-card text-muted-foreground shadow-sm",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ImagePlus, { size: 18 })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-sm font-medium text-foreground",
					children: screens.length ? t("addMoreScreens") : t("dropScreensHere")
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-xs text-muted-foreground",
					children: t("uploadHint")
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					ref: inputRef,
					type: "file",
					accept: "image/png,image/jpeg,image/webp",
					multiple: true,
					className: "hidden",
					onChange: (e) => {
						addFiles(e.target.files);
						e.currentTarget.value = "";
					}
				})
			]
		}), screens.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
			className: "grid grid-cols-2 gap-2 sm:grid-cols-3",
			children: screens.map((s, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
				draggable: true,
				onDragStart: () => setDragIndex(i),
				onDragOver: (e) => e.preventDefault(),
				onDrop: (e) => {
					e.preventDefault();
					if (dragIndex !== null) reorder(dragIndex, i);
					setDragIndex(null);
				},
				className: "group relative overflow-hidden rounded-lg border bg-card shadow-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative aspect-[4/3] w-full bg-muted/40",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: s.previewUrl,
							alt: `${t("screenLabel")} ${i + 1}`,
							className: "h-full w-full object-cover"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "absolute left-1.5 top-1.5 rounded-md bg-foreground/85 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-background",
							children: [
								t("screenLabel"),
								" ",
								i + 1
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => remove(s.id),
							className: "absolute right-1.5 top-1.5 rounded-md bg-background/80 p-1 text-foreground opacity-0 backdrop-blur transition group-hover:opacity-100 hover:bg-background",
							"aria-label": `${t("removeScreen")} ${i + 1}`,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { size: 12 })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "absolute bottom-1.5 right-1.5 rounded-md bg-background/80 p-1 text-muted-foreground opacity-0 backdrop-blur transition group-hover:opacity-100",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GripVertical, { size: 12 })
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "truncate px-2 py-1.5 text-[11px] text-muted-foreground",
					children: s.file.name
				})]
			}, s.id))
		})]
	});
}
function InputForm(props) {
	const { domain, persona, goal, screens, isAnalyzing, onChange, onSubmit } = props;
	const { language, t } = useLanguage();
	const canSubmit = Boolean(screens.length > 0 && !isAnalyzing);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
		onSubmit: (e) => {
			e.preventDefault();
			if (canSubmit) onSubmit();
		},
		className: "flex flex-col gap-5 rounded-2xl border bg-card p-6 shadow-sm",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "text-base font-semibold tracking-tight",
				children: t("auditContext")
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-xs text-muted-foreground",
				children: t("auditContextDesc")
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: t("domainLabel"),
				hint: t("domainHint"),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					value: domain,
					onChange: (e) => onChange({ domain: e.target.value }),
					placeholder: t("domainPlaceholder"),
					className: "input-base"
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: t("personaLabel"),
				hint: t("personaHint"),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
					value: persona,
					onChange: (e) => onChange({ persona: e.target.value }),
					placeholder: t("personaPlaceholder"),
					rows: 3,
					className: "input-base resize-none"
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: t("goalLabel"),
				hint: t("goalHint"),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
					value: goal,
					onChange: (e) => onChange({ goal: e.target.value }),
					placeholder: t("goalPlaceholder"),
					rows: 3,
					className: "input-base resize-none"
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
				label: t("flowScreensLabel"),
				hint: t("flowScreensHint"),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FlowGallery, {
					screens,
					onChange: (next) => onChange({ screens: next })
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "submit",
				disabled: !canSubmit,
				className: `mt-1 inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium shadow-sm transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-40 ${canSubmit ? "bg-emerald-600 text-white btn-glow hover:scale-[1.02] hover:bg-emerald-500 active:scale-[0.98]" : "bg-primary text-primary-foreground"}`,
				children: isAnalyzing ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, {
					size: 16,
					className: "animate-spin"
				}), t("analyzingFlow")] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { size: 16 }),
					t("analyzeFlow"),
					screens.length > 0 ? ` (${screens.length} ${language === "id" ? "layar" : `screen${screens.length === 1 ? "" : "s"}`})` : ""
				] })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("style", { children: `
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
      ` })
		]
	});
}
function Field({ label, hint, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
		className: "flex flex-col gap-1.5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-xs font-medium text-foreground",
				children: label
			}),
			children,
			hint && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-[11px] text-muted-foreground",
				children: hint
			})
		]
	});
}
var sevMeta = {
	4: {
		barClass: "bg-sev-critical",
		pillClass: "bg-sev-critical text-sev-critical-foreground"
	},
	3: {
		barClass: "bg-sev-major",
		pillClass: "bg-sev-major text-sev-major-foreground"
	},
	2: {
		barClass: "bg-sev-minor",
		pillClass: "bg-sev-minor text-sev-minor-foreground"
	},
	1: {
		barClass: "bg-sev-cosmetic",
		pillClass: "bg-sev-cosmetic text-sev-cosmetic-foreground"
	}
};
function FindingCard({ finding }) {
	const { language, t } = useLanguage();
	const meta = sevMeta[finding.severity];
	const getSevLabel = (sev) => {
		switch (sev) {
			case 4: return t("severityCritical");
			case 3: return t("severityMajor");
			case 2: return t("severityMinor");
			case 1: return t("severityCosmetic");
			default: return "";
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative overflow-hidden rounded-2xl border bg-card shadow-sm",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: `absolute inset-y-0 left-0 w-1 ${meta.barClass}` }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col gap-4 p-5 pl-6",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: `inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider ${meta.pillClass}`,
							children: [
								t("severity"),
								" ",
								finding.severity,
								" · ",
								getSevLabel(finding.severity)
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "inline-flex items-center gap-1 rounded-full border border-border bg-muted/40 px-2 py-0.5 text-[11px] font-medium text-foreground/80",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Layers, { size: 11 }),
								language === "id" ? "Layar" : "Screen",
								" ",
								finding.screenIndex + 1
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "inline-flex items-center gap-1 text-xs text-muted-foreground",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { size: 12 }), finding.location]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "text-base font-semibold leading-snug tracking-tight",
					children: finding.problem
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
					title: t("justification"),
					children: finding.justification
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
					title: t("recommendation"),
					children: finding.recommendation
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex flex-wrap items-center justify-end gap-3 border-t pt-3",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex min-w-[160px] items-center gap-2 text-xs",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-muted-foreground",
								children: t("aiConfidence")
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "relative h-1.5 w-24 overflow-hidden rounded-full bg-muted",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "absolute inset-y-0 left-0 rounded-full bg-foreground",
									style: { width: `${finding.aiConfidence}%` }
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "tabular-nums font-medium",
								children: [finding.aiConfidence, "%"]
							})
						]
					})
				})
			]
		})]
	});
}
function Section({ title, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "mb-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground",
		children: title
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "text-sm leading-relaxed text-foreground/85",
		children
	})] });
}
function SequentialProgress({ screens, completed }) {
	const { language, t } = useLanguage();
	const currentIndex = completed.length;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-2xl border bg-card p-5 shadow-sm",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-4 flex items-baseline justify-between",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "text-sm font-semibold tracking-tight",
				children: language === "id" ? "Analisis sekuensial" : "Sequential analysis"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "text-xs text-muted-foreground tabular-nums",
				children: [
					completed.length,
					" / ",
					screens.length,
					" ",
					language === "id" ? "layar" : `screen${screens.length === 1 ? "" : "s"}`
				]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
			className: "flex flex-col gap-2",
			children: screens.map((s, i) => {
				const done = i < currentIndex;
				const active = i === currentIndex;
				const result = done ? completed[i] : null;
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: `flex gap-3 rounded-xl border p-3 transition ${active ? "border-foreground/30 bg-muted/40" : done ? "border-border bg-card" : "border-dashed border-border/70 bg-card opacity-70"}`,
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex-shrink-0",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: s.previewUrl,
								alt: "",
								className: "h-12 w-12 rounded-md border object-cover"
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0 flex-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-xs font-semibold",
									children: [
										language === "id" ? "Layar" : "Screen",
										" ",
										i + 1
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "truncate text-[11px] text-muted-foreground",
									children: s.file.name
								})]
							}), result ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-1 line-clamp-2 text-[11px] text-muted-foreground",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-medium text-foreground/80",
										children: result.action_summary
									}),
									" ",
									"· ",
									result.findings.length,
									" ",
									language === "id" ? "temuan" : `finding${result.findings.length === 1 ? "" : "s"}`
								]
							}) : active ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-[11px] text-muted-foreground",
								children: i > 0 ? `${t("progressChained")} ${i}…` : language === "id" ? "Menganalisis…" : "Analyzing…"
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-[11px] text-muted-foreground capitalize",
								children: t("progressQueued")
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex-shrink-0 self-center",
							children: done ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, {
								size: 16,
								className: "text-sev-cosmetic-foreground"
							}) : active ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, {
								size: 16,
								className: "animate-spin text-foreground"
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Circle, {
								size: 16,
								className: "text-muted-foreground/50"
							})
						})
					]
				}, s.id);
			})
		})]
	});
}
function ScreenFilter({ total, selected, counts, onChange }) {
	const totalFindings = counts.reduce((s, n) => s + n, 0);
	const baseBtn = "inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-medium transition";
	const active = "border-foreground bg-foreground text-background";
	const idle = "border-border bg-card text-foreground/80 hover:bg-muted";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-wrap gap-1.5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
			type: "button",
			onClick: () => onChange("all"),
			className: `${baseBtn} ${selected === "all" ? active : idle}`,
			children: ["All screens", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "rounded bg-background/20 px-1 text-[10px] tabular-nums",
				children: totalFindings
			})]
		}), Array.from({ length: total }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
			type: "button",
			onClick: () => onChange(i),
			className: `${baseBtn} ${selected === i ? active : idle}`,
			children: [
				"Screen ",
				i + 1,
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "rounded bg-background/20 px-1 text-[10px] tabular-nums",
					children: counts[i] ?? 0
				})
			]
		}, i))]
	});
}
var sevOrder = [
	4,
	3,
	2,
	1
];
var sevChipClass = {
	4: "bg-sev-critical-soft text-sev-critical",
	3: "bg-sev-major-soft text-sev-major",
	2: "bg-sev-minor-soft text-sev-minor-foreground",
	1: "bg-sev-cosmetic-soft text-foreground/70"
};
function ResultsDashboard({ state, screens, progress, result }) {
	const { language, t } = useLanguage();
	const [filter, setFilter] = (0, import_react.useState)("all");
	const [lightboxUrl, setLightboxUrl] = (0, import_react.useState)(null);
	const [lightboxLabel, setLightboxLabel] = (0, import_react.useState)("");
	const getSevLabel = (sev) => {
		switch (sev) {
			case 4: return t("severityCritical");
			case 3: return t("severityMajor");
			case 2: return t("severityMinor");
			case 1: return t("severityCosmetic");
			default: return "";
		}
	};
	const openLightbox = (url, label) => {
		setLightboxUrl(url);
		setLightboxLabel(label);
	};
	const closeLightbox = () => setLightboxUrl(null);
	if (state === "idle") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyShell, {
		icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScanSearch, { size: 28 }),
		title: language === "id" ? "Jalankan analisis untuk melihat hasil" : "Run an analysis to see results",
		body: t("resultsSubtitle")
	});
	if (state === "loading" || !result) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SequentialProgress, {
		screens,
		completed: progress
	});
	const perScreenCounts = result.screens.map((s) => s.findings.length);
	const visible = filter === "all" ? result.findings : result.findings.filter((f) => f.screenIndex === filter);
	const counts = sevOrder.map((s) => ({
		sev: s,
		n: visible.filter((f) => f.severity === s).length
	}));
	const sorted = [...visible].sort((a, b) => b.severity - a.severity || a.screenIndex - b.screenIndex);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-2xl border bg-card p-6 shadow-sm",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-muted-foreground",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Gauge, { size: 14 }), t("uxHealthScore")]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-foreground/80",
						children: language === "id" ? `${result.findings.length} temuan di ${result.screens.length} layar, dianalisis secara berurutan.` : `${result.findings.length} findings across ${result.screens.length} screen${result.screens.length === 1 ? "" : "s"}, analyzed sequentially.`
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4",
						children: counts.map(({ sev, n }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: `rounded-xl px-3 py-2 ${sevChipClass[sev]}`,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-[11px] font-medium uppercase tracking-wider opacity-80",
								children: getSevLabel(sev)
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-xl font-semibold tabular-nums",
								children: n
							})]
						}, sev))
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col gap-3 rounded-2xl border bg-card p-5 shadow-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-baseline justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-sm font-semibold tracking-tight",
						children: language === "id" ? "Filter berdasarkan layar" : "Filter by screen"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-xs text-muted-foreground",
						children: language === "id" ? "Konteks berantai: setiap layar dianalisis dengan summary_state sebelumnya" : "Context chained: each screen analyzed with prior summary_state"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScreenFilter, {
					total: result.screens.length,
					counts: perScreenCounts,
					selected: filter,
					onChange: setFilter
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col gap-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-baseline justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
							className: "text-sm font-semibold tracking-tight",
							children: [language === "id" ? "Temuan" : "Findings", filter !== "all" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "ml-2 text-xs font-normal text-muted-foreground",
								children: [
									"· ",
									language === "id" ? "Layar" : "Screen",
									" ",
									filter + 1
								]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs text-muted-foreground",
							children: t("sortedBySeverity")
						})]
					}),
					filter !== "all" && screens[filter] && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex gap-4 rounded-2xl border bg-card p-4 shadow-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative flex-shrink-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => openLightbox(screens[filter].previewUrl, `${language === "id" ? "Layar" : "Screen"} ${filter + 1}`),
								className: "group relative block cursor-zoom-in rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-ring",
								"aria-label": language === "id" ? "Perbesar gambar" : "Zoom image",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: screens[filter].previewUrl,
									alt: `${language === "id" ? "Layar" : "Screen"} ${filter + 1}`,
									className: "h-36 w-28 rounded-xl border object-cover shadow-sm transition duration-200 group-hover:brightness-90"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "absolute inset-0 flex items-center justify-center rounded-xl bg-black/0 transition duration-200 group-hover:bg-black/30",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ZoomIn, {
										size: 22,
										className: "text-white opacity-0 drop-shadow-md transition duration-200 group-hover:opacity-100"
									})
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "absolute left-1.5 top-1.5 rounded-md bg-foreground/85 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-background",
								children: [
									language === "id" ? "Layar" : "Screen",
									" ",
									filter + 1
								]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex min-w-0 flex-1 flex-col justify-between gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[11px] font-semibold uppercase tracking-wider text-muted-foreground",
								children: language === "id" ? "Konteks Layar" : "Screen Context"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-sm leading-relaxed text-foreground/80",
								children: result.screens[filter]?.summary_state ?? screens[filter].file.name
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-3",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-[11px] text-muted-foreground",
										children: screens[filter].file.name
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-muted-foreground/40",
										children: "·"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-[11px] font-medium text-muted-foreground",
										children: [
											sorted.length,
											" ",
											language === "id" ? "temuan" : `finding${sorted.length === 1 ? "" : "s"}`
										]
									})
								]
							})]
						})]
					}),
					sorted.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "rounded-xl border border-dashed bg-card/40 p-8 text-center text-sm text-muted-foreground",
						children: t("noViolations")
					}) : sorted.map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FindingCard, { finding: f }, f.id))
				]
			})
		]
	}), lightboxUrl && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lightbox, {
		src: lightboxUrl,
		label: lightboxLabel,
		onClose: closeLightbox
	})] });
}
function Lightbox({ src, label, onClose }) {
	(0, import_react.useEffect)(() => {
		const onKey = (e) => {
			if (e.key === "Escape") onClose();
		};
		document.addEventListener("keydown", onKey);
		const prev = document.body.style.overflow;
		document.body.style.overflow = "hidden";
		return () => {
			document.removeEventListener("keydown", onKey);
			document.body.style.overflow = prev;
		};
	}, [onClose]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm",
		style: { animation: "lightbox-in 0.18s ease" },
		onClick: onClose,
		role: "dialog",
		"aria-modal": "true",
		"aria-label": label,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				onClick: onClose,
				className: "absolute right-4 top-4 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-white/10 text-white backdrop-blur transition hover:bg-white/25",
				"aria-label": "Close",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { size: 18 })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "absolute left-4 top-4 rounded-lg bg-white/10 px-3 py-1 text-sm font-semibold text-white backdrop-blur",
				children: label
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src,
				alt: label,
				onClick: (e) => e.stopPropagation(),
				className: "max-h-[90vh] max-w-[90vw] cursor-default rounded-2xl object-contain shadow-2xl",
				style: { animation: "lightbox-img-in 0.2s ease" }
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("style", { children: `
        @keyframes lightbox-in {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes lightbox-img-in {
          from { transform: scale(0.93); opacity: 0; }
          to   { transform: scale(1);   opacity: 1; }
        }
      ` })
		]
	});
}
function EmptyShell({ icon, title, body }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-[480px] flex-col items-center justify-center rounded-2xl border border-dashed bg-card/40 p-10 text-center",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex h-14 w-14 items-center justify-center rounded-full bg-muted text-muted-foreground",
				children: icon
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "mt-4 text-base font-semibold tracking-tight",
				children: title
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 max-w-sm text-sm text-muted-foreground",
				children: body
			})
		]
	});
}
var SEV_WEIGHT = {
	4: 18,
	3: 10,
	2: 5,
	1: 2
};
var POOL = [
	{
		severity: 4,
		location: "Submit flow",
		problem: "No visible system status during processing",
		justification: "Heuristic #1 — Visibility of System Status. After tapping submit the interface gives no feedback (no spinner, no disabled state, no progress), so users cannot tell whether the system received their action.",
		recommendation: "Show an inline button spinner, disable the form, and surface a progress indicator until the response returns.",
		devEffort: "Medium",
		aiConfidence: 90
	},
	{
		severity: 3,
		location: "Header iconography",
		problem: "Icons use system-jargon metaphors unfamiliar to the target persona",
		justification: "Heuristic #2 — Match Between System and the Real World. Icons reference internal product concepts rather than objects/words from the user's domain, forcing users to translate before acting.",
		recommendation: "Replace abstract glyphs with familiar real-world metaphors and pair each icon with a short text label.",
		devEffort: "Low",
		aiConfidence: 82
	},
	{
		severity: 3,
		location: "Destructive action",
		problem: "No clear undo or exit path after a committing action",
		justification: "Heuristic #3 — User Control and Freedom. The destructive action commits immediately with no emergency exit, trapping users who tapped by mistake.",
		recommendation: "Provide an explicit Cancel/Back affordance and a time-boxed Undo toast after the action commits.",
		devEffort: "Medium",
		aiConfidence: 85
	},
	{
		severity: 3,
		location: "Top navigation",
		problem: "Active route is not visually distinguished, breaking platform convention",
		justification: "Heuristic #4 — Consistency and Standards. Other screens in this product (and conventional navigation patterns users already know) mark the active item; this screen does not, forcing recall.",
		recommendation: "Apply a consistent active-state treatment (underline + foreground color) matching the rest of the product.",
		devEffort: "Low",
		aiConfidence: 88
	},
	{
		severity: 4,
		location: "Form fields",
		problem: "Easy-to-confuse fields lack confirmation or constraints before commit",
		justification: "Heuristic #5 — Error Prevention. The form accepts ambiguous input (similar-looking options, free-text where a picker would do) without a confirmation step, inviting slips.",
		recommendation: "Constrain input with pickers/format masks where possible and add a confirmation step for irreversible commits.",
		devEffort: "Medium",
		aiConfidence: 83
	},
	{
		severity: 3,
		location: "Multi-step flow",
		problem: "Users must remember information from a previous step",
		justification: "Heuristic #6 — Recognition Rather Than Recall. The current screen asks users to recall values (selected plan, recipient, prior input) that were entered earlier instead of surfacing them.",
		recommendation: "Echo a compact summary of prior selections at the top of the screen so users recognize rather than recall.",
		devEffort: "Medium",
		aiConfidence: 84
	},
	{
		severity: 2,
		location: "Primary task surface",
		problem: "No accelerator for experienced users to skip repetitive steps",
		justification: "Heuristic #7 — Flexibility and Efficiency of Use. Every user, novice or expert, must walk the same path; there are no shortcuts, saved defaults, or bulk actions.",
		recommendation: "Add accelerators (keyboard shortcuts, saved templates, bulk actions) that experts can opt into without burdening novices.",
		devEffort: "Medium",
		aiConfidence: 78
	},
	{
		severity: 2,
		location: "Content density",
		problem: "Screen contains visual elements that do not support the user's current goal",
		justification: "Heuristic #8 — Aesthetic and Minimalist Design. Decorative or rarely-needed content competes with the primary action for the user's attention, diluting visual hierarchy.",
		recommendation: "Remove or progressively disclose non-essential elements so the primary action dominates the visual hierarchy.",
		devEffort: "Low",
		aiConfidence: 80
	},
	{
		severity: 4,
		location: "Error messaging",
		problem: "Error message is a generic code with no diagnosis or recovery path",
		justification: "Heuristic #9 — Help Users Recognize, Diagnose, and Recover from Errors. The message uses technical jargon (or a numeric code), does not explain the cause, and gives no constructive next step.",
		recommendation: "Rewrite errors in plain language, state the cause precisely, and offer a concrete recovery action (retry, edit field, contact support).",
		devEffort: "Low",
		aiConfidence: 89
	},
	{
		severity: 2,
		location: "Complex feature",
		problem: "No contextual help or documentation entry point",
		justification: "Heuristic #10 — Help and Documentation. The feature exposes advanced controls but offers no inline guidance, tooltip, or link to docs, so users hit a wall when stuck.",
		recommendation: "Add a contextual help affordance (tooltip, link to focused docs, or inline tip) located at the point of need.",
		devEffort: "Low",
		aiConfidence: 76
	}
];
var POOL_ID = [
	{
		severity: 4,
		location: "Alur pengiriman",
		problem: "Tidak ada status sistem yang terlihat selama pemrosesan",
		justification: "Heuristik #1 — Visibilitas Status Sistem. Setelah mengetuk kirim, antarmuka tidak memberikan umpan balik (tidak ada spinner, tidak ada status dinonaktifkan, tidak ada progres), sehingga pengguna tidak dapat mengetahui apakah sistem menerima tindakan mereka.",
		recommendation: "Tampilkan spinner tombol inline, nonaktifkan formulir, dan tampilkan indikator kemajuan hingga respons kembali.",
		devEffort: "Medium",
		aiConfidence: 90
	},
	{
		severity: 3,
		location: "Ikonografi header",
		problem: "Ikon menggunakan metafora jargon sistem yang tidak dikenal oleh persona sasaran",
		justification: "Heuristik #2 — Kecocokan Antara Sistem dan Dunia Nyata. Ikon merujuk pada konsep produk internal daripada objek/kata dari domain pengguna, memaksa pengguna untuk menerjemahkan sebelum bertindak.",
		recommendation: "Ganti glif abstrak dengan metafora dunia nyata yang familier dan pasangkan setiap ikon dengan label teks pendek.",
		devEffort: "Low",
		aiConfidence: 82
	},
	{
		severity: 3,
		location: "Tindakan destruktif",
		problem: "Tidak ada jalur pembatalan (undo) atau jalan keluar yang jelas setelah tindakan komitmen",
		justification: "Heuristik #3 — Kontrol dan Kebebasan Pengguna. Tindakan destruktif langsung dilakukan tanpa jalan keluar darurat, menjebak pengguna yang mengetuk secara tidak sengaja.",
		recommendation: "Sediakan pembatalan/kembali yang jelas dan berikan toast Urungkan (Undo) dengan batas waktu setelah tindakan dikomit.",
		devEffort: "Medium",
		aiConfidence: 85
	},
	{
		severity: 3,
		location: "Navigasi atas",
		problem: "Rute aktif tidak dibedakan secara visual, melanggar konvensi platform",
		justification: "Heuristik #4 — Konsistensi dan Standar. Layar lain dalam produk ini (dan pola navigasi konvensional yang sudah dikenal pengguna) tidak menandai item aktif; layar ini tidak, memaksa pengguna untuk mengingat.",
		recommendation: "Terapkan perlakuan status aktif yang konsisten (garis bawah + warna latar depan) yang cocok dengan bagian produk lainnya.",
		devEffort: "Low",
		aiConfidence: 88
	},
	{
		severity: 4,
		location: "Bidang formulir",
		problem: "Bidang yang mudah membingungkan kurang memiliki konfirmasi atau batasan sebelum komit",
		justification: "Heuristik #5 — Pencegahan Kesalahan. Formulir menerima input yang ambigu (opsi yang tampak serupa, teks bebas di mana pemilih opsi dapat digunakan) tanpa langkah konfirmasi, mengundang kesalahan.",
		recommendation: "Batasi input dengan pemilih/masker format jika memungkinkan dan tambahkan langkah konfirmasi untuk komit yang tidak dapat dibatalkan.",
		devEffort: "Medium",
		aiConfidence: 83
	},
	{
		severity: 3,
		location: "Alur multi-langkah",
		problem: "Pengguna harus mengingat informasi dari langkah sebelumnya",
		justification: "Heuristik #6 — Pengenalan daripada Pemanggilan Kembali. Layar saat ini meminta pengguna untuk mengingat nilai (rencana yang dipilih, penerima, masukan sebelumnya) yang dimasukkan sebelumnya alih-alih menampilkannya.",
		recommendation: "Tampilkan ringkasan ringkas dari pilihan sebelumnya di bagian atas layar sehingga pengguna mengenali alih-alih memanggil kembali.",
		devEffort: "Medium",
		aiConfidence: 84
	},
	{
		severity: 2,
		location: "Permukaan tugas utama",
		problem: "Tidak ada akselerator bagi pengguna berpengalaman untuk melewati langkah berulang",
		justification: "Heuristik #7 — Fleksibilitas dan Efisiensi Penggunaan. Setiap pengguna, baik pemula maupun ahli, harus menempuh jalur yang sama; tidak ada pintasan, default tersimpan, atau tindakan massal.",
		recommendation: "Tambahkan akselerator (pintasan keyboard, templat tersimpan, tindakan massal) yang dapat dipilih oleh pengguna ahli tanpa membebani pemula.",
		devEffort: "Medium",
		aiConfidence: 78
	},
	{
		severity: 2,
		location: "Kepadatan konten",
		problem: "Layar berisi elemen visual yang tidak mendukung tujuan pengguna saat ini",
		justification: "Heuristik #8 — Desain Estetis dan Minimalis. Konten dekoratif atau yang jarang dibutuhkan bersaing dengan tindakan utama untuk perhatian pengguna, melemahkan hierarki visual.",
		recommendation: "Hapus atau tampilkan secara bertahap elemen non-esensial sehingga tindakan utama mendominasi hierarki visual.",
		devEffort: "Low",
		aiConfidence: 80
	},
	{
		severity: 4,
		location: "Pesan kesalahan",
		problem: "Pesan kesalahan berupa kode umum tanpa diagnosis atau jalur pemulihan",
		justification: "Heuristik #9 — Membantu Pengguna Mengenali, Mendiagnosis, dan Memulihkan diri dari Kesalahan. Pesan menggunakan jargon teknis (atau kode numerik), tidak menjelaskan penyebabnya, dan tidak memberikan langkah pemulihan yang konstruktif.",
		recommendation: "Tulis ulang kesalahan dalam bahasa yang jelas, sebutkan penyebabnya secara tepat, dan tawarkan tindakan pemulihan yang konkret (coba lagi, edit bidang, hubungi dukungan).",
		devEffort: "Low",
		aiConfidence: 89
	},
	{
		severity: 2,
		location: "Fitur kompleks",
		problem: "Tidak ada bantuan kontekstual atau titik masuk dokumentasi",
		justification: "Heuristik #10 — Bantuan dan Dokumentasi. Fitur ini menampilkan kontrol lanjutan tetapi tidak menawarkan panduan inline, tooltip, atau tautan ke dokumen, sehingga pengguna menemui jalan buntu saat macet.",
		recommendation: "Tambahkan fitur bantuan kontekstual (tooltip, tautan ke dokumen terfokus, atau tip inline) yang terletak di titik yang dibutuhkan.",
		devEffort: "Low",
		aiConfidence: 76
	}
];
function rng(seed) {
	let s = seed * 9301 + 49297;
	return () => {
		s = (s * 9301 + 49297) % 233280;
		return s / 233280;
	};
}
function buildSummaryState(screenIndex, fileName, lang) {
	const archetypes = lang === "id" ? [
		"permukaan entri / pendaratan — mengarahkan pengguna ke nilai produk",
		"langkah autentikasi — mengumpulkan kredensial sebelum melanjutkan",
		"permukaan tugas utama — pengguna berada di tengah alur melakukan tindakan inti",
		"langkah konfirmasi / tinjauan — pengguna memverifikasi sebelum melakukan komit",
		"hasil / status sukses — hasil dari tindakan sebelumnya",
		"permukaan pengaturan / konfigurasi"
	] : [
		"entry / landing surface — orienting the user to product value",
		"authentication step — collecting credentials before progressing",
		"primary task surface — the user is mid-flow performing the core action",
		"confirmation / review step — user verifying before commit",
		"result / success state — outcome of the prior action",
		"settings / configuration surface"
	];
	const arch = archetypes[screenIndex % archetypes.length];
	return lang === "id" ? `Layar ${screenIndex + 1} (${fileName}) — ${arch}.` : `Screen ${screenIndex + 1} (${fileName}) — ${arch}.`;
}
function buildActionSummary(screenIndex, lang) {
	const actions = lang === "id" ? [
		"Pengguna mendarat di permukaan entri.",
		"Pengguna mengirimkan kredensial untuk autentikasi.",
		"Pengguna melakukan tindakan tugas utama.",
		"Pengguna meninjau detail sebelum mengonfirmasi.",
		"Pengguna mencapai hasil sukses.",
		"Pengguna menyesuaikan preferensi konfigurasi."
	] : [
		"User landed on the entry surface.",
		"User submitted credentials to authenticate.",
		"User performed the primary task action.",
		"User reviewed details before confirming.",
		"User reached the success outcome.",
		"User adjusted configuration preferences."
	];
	return actions[screenIndex % actions.length];
}
async function analyzeScreen(args) {
	const { screen, index, pastContext, language } = args;
	const delay = 700 + Math.floor(Math.random() * 500);
	await new Promise((r) => setTimeout(r, delay));
	const rand = rng(index + 1 + screen.file.size);
	const count = 1 + Math.floor(rand() * 3);
	const pool = language === "id" ? POOL_ID : POOL;
	const picks = /* @__PURE__ */ new Set();
	while (picks.size < count) picks.add(Math.floor(rand() * pool.length));
	const findings = Array.from(picks).map((poolIdx, i) => {
		const base = pool[poolIdx];
		const tiedToPast = pastContext && i === 0 ? language === "id" ? ` Datang dari ${pastContext.previousScreenLabel} (${pastContext.actionSummary}), layar ini harus menjaga kontinuitas.` : ` Coming from ${pastContext.previousScreenLabel} (${pastContext.actionSummary}), this screen should preserve continuity.` : "";
		return {
			...base,
			id: `s${index}-f${i}`,
			screenIndex: index,
			justification: base.justification + tiedToPast
		};
	});
	return {
		screenIndex: index,
		screenLabel: language === "id" ? `Layar ${index + 1}` : `Screen ${index + 1}`,
		summary_state: buildSummaryState(index, screen.file.name, language),
		action_summary: buildActionSummary(index, language),
		findings
	};
}
async function runFlowAudit(args) {
	const { screens, context, language = "en", onProgress } = args;
	const results = [];
	let pastContext = null;
	const seenSignatures = /* @__PURE__ */ new Set();
	const sig = (f) => `${f.location}|${f.problem}`;
	for (let i = 0; i < screens.length; i++) {
		const result = await analyzeScreen({
			screen: screens[i],
			index: i,
			context,
			pastContext,
			language
		});
		const uniqueFindings = result.findings.filter((f) => {
			const key = sig(f);
			if (seenSignatures.has(key)) return false;
			seenSignatures.add(key);
			return true;
		});
		const dedupedResult = {
			...result,
			findings: uniqueFindings
		};
		results.push(dedupedResult);
		pastContext = {
			previousScreenLabel: dedupedResult.screenLabel,
			actionSummary: dedupedResult.action_summary
		};
		onProgress?.(dedupedResult, i, screens.length);
	}
	const allFindings = results.flatMap((r) => r.findings);
	const penalty = allFindings.reduce((s, f) => s + SEV_WEIGHT[f.severity], 0);
	return {
		overallScore: Math.max(0, Math.min(100, 100 - penalty)),
		screens: results,
		findings: allFindings
	};
}
function Index() {
	const { language, setLanguage, t } = useLanguage();
	const [domain, setDomain] = (0, import_react.useState)("");
	const [persona, setPersona] = (0, import_react.useState)("");
	const [goal, setGoal] = (0, import_react.useState)("");
	const [screens, setScreens] = (0, import_react.useState)([]);
	const [state, setState] = (0, import_react.useState)("idle");
	const [progress, setProgress] = (0, import_react.useState)([]);
	const [result, setResult] = (0, import_react.useState)(null);
	const handleChange = (patch) => {
		if (patch.domain !== void 0) setDomain(patch.domain);
		if (patch.persona !== void 0) setPersona(patch.persona);
		if (patch.goal !== void 0) setGoal(patch.goal);
		if (patch.screens !== void 0) setScreens(patch.screens);
	};
	const handleSubmit = async () => {
		setState("loading");
		setProgress([]);
		setResult(null);
		setResult(await runFlowAudit({
			screens,
			context: {
				domain,
				persona,
				goal
			},
			language,
			onProgress: (r) => {
				setProgress((prev) => [...prev, r]);
			}
		}));
		setState("ready");
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-background text-foreground",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
			className: "sticky top-0 z-10 border-b bg-background/80 backdrop-blur",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto flex max-w-7xl items-center justify-between px-6 py-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex h-8 w-8 items-center justify-center rounded-lg bg-foreground text-background",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScanLine, { size: 16 })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "text-sm font-semibold tracking-tight",
						children: t("title")
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-[11px] text-muted-foreground",
						children: t("subtitle")
					})] })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "hidden text-xs text-muted-foreground sm:block",
						children: t("headerHint")
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-1 rounded-lg border bg-muted/40 p-0.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => setLanguage("en"),
							className: `cursor-pointer rounded-md px-2 py-1 text-[11px] font-semibold transition ${language === "en" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`,
							children: "EN"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => setLanguage("id"),
							className: `cursor-pointer rounded-md px-2 py-1 text-[11px] font-semibold transition ${language === "id" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"}`,
							children: "ID"
						})]
					})]
				})]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
			className: "mx-auto grid max-w-7xl gap-6 px-6 py-8 lg:grid-cols-[minmax(0,420px)_1fr]",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "lg:sticky lg:top-20 lg:self-start",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(InputForm, {
					domain,
					persona,
					goal,
					screens,
					isAnalyzing: state === "loading",
					onChange: handleChange,
					onSubmit: handleSubmit
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResultsDashboard, {
				state,
				screens,
				progress,
				result
			}) })]
		})]
	});
}
//#endregion
export { Index as component };
