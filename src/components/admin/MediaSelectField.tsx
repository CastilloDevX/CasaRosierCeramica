"use client";

import Image from "next/image";
import { useState } from "react";
import MediaPicker from "./MediaPicker";

function isAbsoluteUrl(url: string) {
  return /^https?:\/\//i.test(url);
}

export default function MediaSelectField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (url: string) => void;
}) {
  const [showPicker, setShowPicker] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function uploadFile(file: File) {
    setIsUploading(true);
    setError(null);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", "general");

    const response = await fetch("/api/admin/media/upload", {
      method: "POST",
      body: formData,
    });
    const data = await response.json().catch(() => ({})) as { asset?: { file_url?: string }; error?: string };
    setIsUploading(false);

    if (!response.ok || !data.asset?.file_url) {
      setError(data.error || "No se pudo subir la imagen.");
      return;
    }

    onChange(data.asset.file_url);
  }

  return (
    <div className="media-select-field">
      <span className="field-label">{label}</span>
      <div className="field-row">
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Selecciona o sube una imagen"
        />
        <button type="button" className="secondary-btn" onClick={() => setShowPicker(true)}>
          Biblioteca
        </button>
        <label className="secondary-btn" style={{ cursor: isUploading ? "wait" : "pointer" }}>
          {isUploading ? "Subiendo..." : "Subir"}
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
        {value ? (
          <button type="button" className="danger-btn" onClick={() => onChange("")}>
            Limpiar
          </button>
        ) : null}
      </div>
      {error ? <p className="form-error">{error}</p> : null}
      {value ? (
        <div className="img-preview relative">
          {isAbsoluteUrl(value) ? (
            <img src={value} alt={label} className="media-img-preview" />
          ) : (
            <Image src={value} alt={label} fill sizes="220px" className="object-cover" unoptimized />
          )}
        </div>
      ) : null}

      {showPicker ? (
        <MediaPicker
          onSelect={(url) => {
            onChange(url);
            setShowPicker(false);
          }}
          onClose={() => setShowPicker(false)}
        />
      ) : null}
    </div>
  );
}
