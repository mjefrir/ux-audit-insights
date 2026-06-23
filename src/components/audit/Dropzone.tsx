import { useCallback, useRef, useState } from "react";
import { ImagePlus, X } from "lucide-react";

interface DropzoneProps {
  file: File | null;
  previewUrl: string | null;
  onChange: (file: File | null, previewUrl: string | null) => void;
}

export function Dropzone({ file, previewUrl, onChange }: DropzoneProps) {
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = useCallback(
    (files: FileList | null) => {
      const f = files?.[0];
      if (!f || !f.type.startsWith("image/")) return;
      const url = URL.createObjectURL(f);
      onChange(f, url);
    },
    [onChange],
  );

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    handleFiles(e.dataTransfer.files);
  };

  if (file && previewUrl) {
    return (
      <div className="relative overflow-hidden rounded-xl border bg-muted/30">
        <img src={previewUrl} alt="Screenshot preview" className="max-h-64 w-full object-contain" />
        <div className="flex items-center justify-between gap-2 border-t bg-card px-3 py-2 text-xs">
          <div className="min-w-0 truncate">
            <span className="font-medium text-foreground">{file.name}</span>
            <span className="ml-2 text-muted-foreground">
              {(file.size / 1024).toFixed(0)} KB
            </span>
          </div>
          <button
            type="button"
            onClick={() => onChange(null, null)}
            className="flex items-center gap-1 rounded-md px-2 py-1 text-muted-foreground transition hover:bg-muted hover:text-foreground"
            aria-label="Remove screenshot"
          >
            <X size={14} />
            Remove
          </button>
        </div>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => inputRef.current?.click()}
      onDragOver={(e) => {
        e.preventDefault();
        setDragOver(true);
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={onDrop}
      className={`flex w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed px-6 py-10 text-center transition ${
        dragOver
          ? "border-foreground/40 bg-muted/60"
          : "border-border bg-muted/20 hover:bg-muted/40"
      }`}
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-card text-muted-foreground shadow-sm">
        <ImagePlus size={18} />
      </div>
      <div className="text-sm font-medium text-foreground">Drop a screenshot here</div>
      <div className="text-xs text-muted-foreground">PNG, JPG or WEBP · click to browse</div>
      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        className="hidden"
        onChange={(e) => handleFiles(e.target.files)}
      />
    </button>
  );
}
