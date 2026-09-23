import { useRef, useState } from "react";
import { Upload, X, Loader2, ImageIcon, Link } from "lucide-react";
import { toast } from "sonner";
import { Button } from "./button";
import { Input } from "./input";

type Props = {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  bucket?: string;
  className?: string;
  previewClass?: string;
};

const MAX_SIZE = 10 * 1024 * 1024;
const ACCEPTED = "image/jpeg,image/jpg,image/png,image/webp,image/gif,image/svg+xml";

export function ImageUpload({ value, onChange, label = "Image", className = "", previewClass = "h-24 w-24" }: Props) {
  const [uploading, setUploading] = useState(false);
  const [urlMode, setUrlMode] = useState(false);
  const [urlInput, setUrlInput] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    if (!ACCEPTED.split(",").includes(file.type)) {
      toast.error("Only JPEG, PNG, WebP, GIF and SVG images are allowed");
      return;
    }
    if (file.size > MAX_SIZE) {
      toast.error("Image must be smaller than 10MB");
      return;
    }

    setUploading(true);
    try {
      const form = new FormData();
      form.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: form });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: "Upload failed" }));
        throw new Error(err.error ?? "Upload failed");
      }
      const { url } = await res.json();
      onChange(url);
      toast.success("Image uploaded");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const clear = () => { onChange(""); setUrlInput(""); if (inputRef.current) inputRef.current.value = ""; };

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-muted-foreground">{label}</span>
        <button
          type="button"
          onClick={() => setUrlMode(!urlMode)}
          className="flex items-center gap-1 text-xs text-primary hover:underline"
        >
          <Link className="h-3 w-3" />
          {urlMode ? "Upload file" : "Use URL instead"}
        </button>
      </div>

      {urlMode ? (
        <div className="flex gap-2">
          <Input
            value={urlInput}
            placeholder="https://example.com/image.jpg"
            onChange={e => setUrlInput(e.target.value)}
            className="flex-1 text-xs"
          />
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => { onChange(urlInput); toast.success("URL saved"); }}
          >
            Apply
          </Button>
        </div>
      ) : (
        <div
          className="relative flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border p-4 cursor-pointer hover:bg-secondary/50 transition"
          onDrop={handleDrop}
          onDragOver={e => e.preventDefault()}
          onClick={() => inputRef.current?.click()}
        >
          {value ? (
            <div className="relative">
              <img
                src={value}
                alt="Preview"
                className={`${previewClass} rounded-lg object-cover`}
                onError={e => { (e.target as HTMLImageElement).style.display = "none"; }}
              />
              <button
                type="button"
                onClick={e => { e.stopPropagation(); clear(); }}
                className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-white shadow"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-1 text-muted-foreground">
              {uploading ? (
                <Loader2 className="h-7 w-7 animate-spin text-primary" />
              ) : (
                <ImageIcon className="h-7 w-7" />
              )}
              <p className="text-xs text-center">
                {uploading ? "Uploading…" : "Click or drag & drop"}
              </p>
              <p className="text-[10px] text-center opacity-60">JPEG, PNG, WebP, GIF, SVG · max 10MB</p>
            </div>
          )}
          <input
            ref={inputRef}
            type="file"
            accept={ACCEPTED}
            className="hidden"
            disabled={uploading}
            onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])}
          />
        </div>
      )}

      {value && !urlMode && (
        <p className="truncate text-[10px] text-muted-foreground" title={value}>{value}</p>
      )}
    </div>
  );
}
