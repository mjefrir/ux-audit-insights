import { useCallback, useRef, useState } from "react";
import { ImagePlus, X, GripVertical } from "lucide-react";
import type { ScreenInput } from "@/lib/mock-audit";
import { useLanguage } from "@/context/LanguageContext";

interface Props {
  screens: ScreenInput[];
  onChange: (screens: ScreenInput[]) => void;
}

export function FlowGallery({ screens, onChange }: Props) {
  const { t } = useLanguage();
  const [dragOver, setDragOver] = useState(false);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const addFiles = useCallback(
    (files: FileList | null) => {
      if (!files) return;
      const next: ScreenInput[] = [];
      Array.from(files).forEach((f) => {
        if (!f.type.startsWith("image/")) return;
        next.push({
          id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          file: f,
          previewUrl: URL.createObjectURL(f),
        });
      });
      if (next.length) onChange([...screens, ...next]);
    },
    [screens, onChange],
  );

  const remove = (id: string) => {
    const target = screens.find((s) => s.id === id);
    if (target) URL.revokeObjectURL(target.previewUrl);
    onChange(screens.filter((s) => s.id !== id));
  };

  const reorder = (from: number, to: number) => {
    if (from === to) return;
    const next = [...screens];
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    onChange(next);
  };

  return (
    <div className="flex flex-col gap-3">
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          addFiles(e.dataTransfer.files);
        }}
        className={`flex w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed px-6 py-8 text-center transition ${
          dragOver
            ? "border-foreground/40 bg-muted/60"
            : "border-border bg-muted/20 hover:bg-muted/40"
        }`}
      >
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-card text-muted-foreground shadow-sm">
          <ImagePlus size={18} />
        </div>
        <div className="text-sm font-medium text-foreground">
          {screens.length ? t("addMoreScreens") : t("dropScreensHere")}
        </div>
        <div className="text-xs text-muted-foreground">
          {t("uploadHint")}
        </div>
        <input
          ref={inputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp"
          multiple
          className="hidden"
          onChange={(e) => {
            addFiles(e.target.files);
            e.currentTarget.value = "";
          }}
        />
      </button>

      {screens.length > 0 && (
        <ol className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {screens.map((s, i) => (
            <li
              key={s.id}
              draggable
              onDragStart={() => setDragIndex(i)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                if (dragIndex !== null) reorder(dragIndex, i);
                setDragIndex(null);
              }}
              className="group relative overflow-hidden rounded-lg border bg-card shadow-sm"
            >
              <div className="relative aspect-[4/3] w-full bg-muted/40">
                <img
                  src={s.previewUrl}
                  alt={`${t("screenLabel")} ${i + 1}`}
                  className="h-full w-full object-cover"
                />
                <span className="absolute left-1.5 top-1.5 rounded-md bg-foreground/85 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-background">
                  {t("screenLabel")} {i + 1}
                </span>
                <button
                  type="button"
                  onClick={() => remove(s.id)}
                  className="absolute right-1.5 top-1.5 rounded-md bg-background/80 p-1 text-foreground opacity-0 backdrop-blur transition group-hover:opacity-100 hover:bg-background"
                  aria-label={`${t("removeScreen")} ${i + 1}`}
                >
                  <X size={12} />
                </button>
                <span className="absolute bottom-1.5 right-1.5 rounded-md bg-background/80 p-1 text-muted-foreground opacity-0 backdrop-blur transition group-hover:opacity-100">
                  <GripVertical size={12} />
                </span>
              </div>
              <div className="truncate px-2 py-1.5 text-[11px] text-muted-foreground">
                {s.file.name}
              </div>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
