interface Props {
  total: number;
  selected: number | "all";
  counts: number[]; // findings per screen index
  onChange: (next: number | "all") => void;
}

export function ScreenFilter({ total, selected, counts, onChange }: Props) {
  const totalFindings = counts.reduce((s, n) => s + n, 0);
  const baseBtn =
    "inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-medium transition";
  const active = "border-foreground bg-foreground text-background";
  const idle = "border-border bg-card text-foreground/80 hover:bg-muted";

  return (
    <div className="flex flex-wrap gap-1.5">
      <button
        type="button"
        onClick={() => onChange("all")}
        className={`${baseBtn} ${selected === "all" ? active : idle}`}
      >
        All screens
        <span className="rounded bg-background/20 px-1 text-[10px] tabular-nums">
          {totalFindings}
        </span>
      </button>
      {Array.from({ length: total }).map((_, i) => (
        <button
          key={i}
          type="button"
          onClick={() => onChange(i)}
          className={`${baseBtn} ${selected === i ? active : idle}`}
        >
          Screen {i + 1}
          <span className="rounded bg-background/20 px-1 text-[10px] tabular-nums">
            {counts[i] ?? 0}
          </span>
        </button>
      ))}
    </div>
  );
}
