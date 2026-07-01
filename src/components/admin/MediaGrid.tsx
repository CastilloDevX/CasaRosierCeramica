"use client";

import Image from "next/image";
import { useState } from "react";
import type { MediaAsset } from "@/lib/cms/types";

function formatSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function isImage(asset: MediaAsset) {
  return ["jpg", "jpeg", "png", "webp", "gif", "svg", "avif"].includes(asset.file_type);
}

function isVideo(asset: MediaAsset) {
  return ["mp4", "webm", "mov", "m4v"].includes(asset.file_type);
}

function absoluteUrl(url: string) {
  if (/^https?:\/\//i.test(url)) return url;
  return window.location.origin + url;
}

function isAbsoluteUrl(url: string) {
  return /^https?:\/\//i.test(url);
}

export default function MediaGrid({
  assets,
  onSelect,
}: {
  assets: MediaAsset[];
  onSelect?: (url: string) => void;
}) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  async function copyUrl(url: string, id: string) {
    await navigator.clipboard.writeText(absoluteUrl(url));
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  }

  return (
    <div className="media-grid">
      {assets.map((asset) => (
        <div key={asset.id} className="media-card">
          <div className="media-preview relative">
            {isImage(asset) ? (
              isAbsoluteUrl(asset.file_url) ? (
                <img src={asset.file_url} alt={asset.alt_text || asset.original_name} className="media-img-preview" />
              ) : (
                <Image src={asset.file_url} alt={asset.alt_text || asset.original_name} fill sizes="220px" className="object-cover" unoptimized />
              )
            ) : isVideo(asset) ? (
              <video src={asset.file_url} className="media-video-preview" controls preload="metadata" />
            ) : (
              <div className="media-file-icon">
                <span>{asset.file_type.toUpperCase() || "FILE"}</span>
              </div>
            )}
          </div>

          <div className="media-info">
            <strong className="media-name">{asset.original_name}</strong>
            <p className="muted">{asset.folder} · {formatSize(asset.size)}</p>
            <a className="media-url" href={asset.file_url} target="_blank" rel="noreferrer">
              {asset.file_url}
            </a>
          </div>

          <div className="media-actions">
            {onSelect ? (
              <button
                type="button"
                className="primary-btn"
                onClick={() => onSelect(asset.file_url)}
              >
                Seleccionar
              </button>
            ) : null}
            <button
              type="button"
              className="secondary-btn"
              onClick={() => copyUrl(asset.file_url, asset.id)}
            >
              {copiedId === asset.id ? "Copiado" : "Copiar URL"}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
