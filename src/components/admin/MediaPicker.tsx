"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import Loader from "@/components/ui/Loader";
import EmptyState from "@/components/ui/EmptyState";
import type { MediaAsset } from "@/lib/cms/types";

function isImage(asset: MediaAsset) {
  const extension = asset.file_type.toLowerCase();
  const mimeType = asset.mime_type.toLowerCase();
  return ["jpg", "jpeg", "png", "webp", "gif", "svg", "avif"].includes(extension) || mimeType.startsWith("image/");
}

function isAbsoluteUrl(url: string) {
  return /^https?:\/\//i.test(url);
}

export default function MediaPicker({
  onSelect,
  onClose,
  onBusyChange,
}: {
  onSelect: (url: string) => void;
  onClose: () => void;
  onBusyChange?: (busy: boolean) => void;
}) {
  const [assets, setAssets] = useState<MediaAsset[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      const response = await fetch("/api/admin/media?status=active");
      if (response.ok) {
        const data = await response.json();
        setAssets(data.assets || []);
      } else {
        setAssets([]);
      }
      setIsLoading(false);
    }
    load();
  }, []);

  async function uploadFile(file: File) {
    setIsUploading(true);
    setUploadError(null);
    onBusyChange?.(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", "general");

    try {
      const response = await fetch("/api/admin/media/upload", {
        method: "POST",
        body: formData,
      });
      const data = await response.json().catch(() => ({})) as { asset?: MediaAsset; error?: string };

      if (!response.ok || !data.asset) {
        setUploadError(data.error || "No se pudo subir la imagen.");
        return;
      }

      setAssets((current) => [data.asset as MediaAsset, ...current.filter((asset) => asset.id !== data.asset?.id)]);
    } catch {
      setUploadError("No se pudo subir la imagen. Revisa tu conexión e intenta de nuevo.");
    } finally {
      setIsUploading(false);
      onBusyChange?.(false);
    }
  }

  const imageAssets = assets.filter((a) => a.status === "active" && isImage(a));

  return (
    <div className="media-library-picker space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h3 className="media-library-picker__title text-headline-sm text-on-surface">Biblioteca del proyecto</h3>
          <p className="media-library-picker__copy text-label-md text-on-surface-variant">Selecciona una imagen activa.</p>
        </div>
        <div className="media-library-picker__actions">
          <label className="primary-btn" aria-disabled={isUploading} style={{ cursor: isUploading ? "wait" : "pointer" }}>
            {isUploading ? "Subiendo..." : "Subir imagen"}
            <input
              type="file"
              accept="image/*"
              hidden
              disabled={isUploading}
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) void uploadFile(file);
                event.target.value = "";
              }}
            />
          </label>
          <button type="button" className="secondary-btn" onClick={onClose} disabled={isUploading}>
            Cerrar
          </button>
        </div>
      </div>
      {uploadError ? <p className="form-error">{uploadError}</p> : null}
      {isLoading ? (
        <Loader />
      ) : imageAssets.length === 0 ? (
        <EmptyState
          icon="image"
          title="No hay archivos"
          description="No se encontraron imágenes activas en la biblioteca."
        />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {imageAssets
            .map((asset) => (
              <button
                key={asset.id}
                type="button"
                className="media-library-picker__asset group text-left rounded-xl border border-outline-variant bg-surface-container-lowest overflow-hidden hover:border-primary-container hover:shadow-lg transition-all"
                disabled={isUploading}
                onClick={() => {
                  if (isUploading) return;
                  onSelect(asset.file_url);
                  onClose();
                }}
              >
                <div className="relative aspect-square overflow-hidden bg-surface-container">
                  {isAbsoluteUrl(asset.file_url) ? (
                    <img src={asset.file_url} alt={asset.alt_text || asset.original_name} className="h-full w-full object-cover transition-transform group-hover:scale-[1.02]" />
                  ) : (
                    <Image src={asset.file_url} alt={asset.alt_text || asset.original_name} fill sizes="(min-width: 640px) 33vw, 50vw" className="object-cover group-hover:scale-[1.02] transition-transform" unoptimized />
                  )}
                </div>
                <div className="p-3">
                  <div className="media-library-picker__name text-label-md text-on-surface font-medium truncate">{asset.original_name}</div>
                  <div className="media-library-picker__folder text-[11px] text-on-surface-variant/70 truncate">{asset.folder}</div>
                </div>
              </button>
            ))}
        </div>
      )}
    </div>
  );
}
