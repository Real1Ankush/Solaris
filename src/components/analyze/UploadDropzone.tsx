import { useRef, useState, type DragEvent } from "react";
import { ImageUp } from "lucide-react";

export function UploadDropzone({
  onFile, hasFile,
}: { onFile: (file: File | null) => void; hasFile: boolean }) {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    onFile(event.dataTransfer.files?.[0] ?? null);
  };

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      className={`rounded-lg border border-dashed px-6 py-10 text-center transition-colors duration-200 ${
        isDragging ? "border-[#ffb020]/60 bg-[#ffb020]/5" : "border-white/[0.14] bg-white/[0.02]"
      }`}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="sr-only"
        onChange={(e) => onFile(e.target.files?.[0] ?? null)}
      />
      <ImageUp className="mx-auto h-6 w-6 text-slate-600" aria-hidden />
      <p className="mt-3 text-sm text-slate-300">
        {hasFile ? "Drop another image to replace it" : "Drop a solar-panel image here"}
      </p>
      <p className="mt-1 font-mono text-[10px] tracking-[0.14em] text-slate-600">JPG · JPEG · PNG · WEBP · MAX 10 MB</p>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="mt-4 rounded-md border border-white/15 px-3.5 py-1.5 text-xs text-slate-200 transition-colors hover:bg-white/[0.05]"
      >
        Browse files
      </button>
    </div>
  );
}