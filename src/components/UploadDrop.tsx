import { useRef, useState } from "react";
import { Upload, Image as ImageIcon } from "lucide-react";

interface Props {
  onFile: (file: File) => void;
}

export function UploadDrop({ onFile }: Props) {
  const [hover, setHover] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setHover(true);
      }}
      onDragLeave={() => setHover(false)}
      onDrop={(e) => {
        e.preventDefault();
        setHover(false);
        const f = e.dataTransfer.files?.[0];
        if (f) onFile(f);
      }}
      className={`flex h-full flex-col items-center justify-center rounded-3xl border-2 border-dashed p-8 text-center transition-colors ${
        hover ? "border-coral bg-coral/5" : "border-border bg-card/50"
      }`}
    >
      <div className="mb-3 grid h-12 w-12 place-items-center rounded-2xl bg-gradient-soft">
        <ImageIcon className="h-5 w-5 text-steel" />
      </div>
      <p className="text-sm font-medium">Drop an image of the label</p>
      <p className="mt-1 text-xs text-muted-foreground">
        PNG or JPEG · processed on-device with Tesseract.js
      </p>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="mt-4 inline-flex items-center gap-2 rounded-full bg-ink px-4 py-2 text-xs font-semibold text-powder"
      >
        <Upload className="h-3.5 w-3.5" /> Choose file
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) onFile(f);
          e.currentTarget.value = "";
        }}
      />
    </div>
  );
}
