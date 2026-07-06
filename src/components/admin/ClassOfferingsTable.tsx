"use client";

import Image from "next/image";
import Link from "@/components/admin/AdminLink";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { Offering } from "@/lib/cms/types";

type Toast = { type: "success" | "error"; message: string };

function formatCurrency(value: number | null, currency: string) {
  if (value === null) return "0€";
  const symbol = currency === "EUR" ? "€" : currency === "USD" ? "$" : currency;
  return currency === "EUR" ? `${value}${symbol}` : `${symbol}${value}`;
}

function formatStatus(status: Offering["status"]) {
  if (status === "published") return "Publicado";
  if (status === "draft") return "Borrador";
  if (status === "archived") return "Archivado";
  return "Eliminado";
}

export default function ClassOfferingsTable({
  offerings,
  basePath = "/admin/clases",
  typeLabel = "Clase",
}: {
  offerings: Offering[];
  basePath?: string;
  typeLabel?: string;
}) {
  const router = useRouter();
  const [toast, setToast] = useState<Toast | null>(null);
  const [pendingId, setPendingId] = useState<string | null>(null);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 3000);
    return () => window.clearTimeout(timer);
  }, [toast]);

  function successMessage(action: string) {
    if (action === "duplicate") return `${typeLabel} duplicado correctamente.`;
    if (action === "publish") return `${typeLabel} publicado correctamente.`;
    if (action === "draft") return `${typeLabel} pasado a borrador correctamente.`;
    if (action === "trash") return `${typeLabel} enviado a la papelera correctamente.`;
    return "Acción completada correctamente.";
  }

  async function patchOffering(id: string, action: string) {
    if (action === "trash" && !window.confirm("¿Mover este registro a la papelera?")) return;

    setToast(null);
    setPendingId(id);
    try {
      const response = await fetch(`/api/admin/offerings/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });

      if (response.ok) {
        setToast({ type: "success", message: successMessage(action) });
        router.refresh();
        return;
      }

      const data = (await response.json().catch(() => ({}))) as { error?: string };
      setToast({ type: "error", message: data.error || "No se pudo completar la acción." });
    } catch {
      setToast({ type: "error", message: "No se pudo conectar con el servidor. Intenta nuevamente." });
    } finally {
      setPendingId(null);
    }
  }

  return (
    <div className="space-y-4">
      {toast ? (
        <div
          className={`rounded-xl border px-4 py-3 text-label-md ${
            toast.type === "success"
              ? "border-emerald-200 bg-emerald-50 text-emerald-900"
              : "border-error bg-error-container text-on-error-container"
          }`}
          role={toast.type === "error" ? "alert" : "status"}
          aria-live="polite"
        >
          {toast.message}
        </div>
      ) : null}

      {offerings.map((offering, index) => {
        const isPending = pendingId === offering.id;
        const duration = offering.duration || "Duración sin definir";

        return (
          <article
            key={offering.id}
            className="flex flex-col gap-4 rounded-2xl border border-outline-variant bg-surface-container-lowest p-4 transition-colors hover:bg-surface-container-low sm:flex-row sm:items-center"
          >
            <Link
              href={`${basePath}/${offering.id}/edit`}
              className={`relative h-32 w-full overflow-hidden rounded-xl border sm:h-20 sm:w-[120px] sm:flex-none ${
                index === 0 ? "border-secondary ring-2 ring-secondary-container" : "border-outline-variant"
              }`}
            >
              {offering.cover_image_url ? (
                <Image
                  src={offering.cover_image_url}
                  alt={offering.title}
                  fill
                  sizes="(min-width: 640px) 120px, 100vw"
                  className="object-cover"
                  unoptimized
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-surface-container-high text-outline">
                  <span className="material-symbols-outlined text-3xl">image</span>
                </div>
              )}
            </Link>

            <div className="min-w-0 flex-1">
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-surface-container-high px-2.5 py-1 text-label-md font-medium text-on-surface-variant">
                  {typeLabel}
                </span>
                <span className="rounded-full bg-surface-container-high px-2.5 py-1 text-label-md font-medium text-on-surface-variant">
                  {formatStatus(offering.status)}
                </span>
              </div>
              <Link
                href={`${basePath}/${offering.id}/edit`}
                className="block text-title-md font-bold text-on-surface transition-colors hover:text-primary"
              >
                {offering.title}
              </Link>
              <p className="mt-1 line-clamp-2 text-body-md text-on-surface-variant">
                {offering.excerpt || "Sin descripción corta."}
              </p>
              <p className="mt-2 text-label-md text-on-surface">
                <span className="font-bold text-secondary">{formatCurrency(offering.price, offering.currency)}</span>
                <span className="mx-2 text-on-surface-variant">·</span>
                <span>Duración total: {duration}</span>
              </p>
            </div>

            <div className="flex items-center gap-2 border-t border-outline-variant pt-3 sm:flex-col sm:items-stretch sm:border-l sm:border-t-0 sm:pl-4 sm:pt-0">
              <Link
                href={`${basePath}/${offering.id}/edit`}
                className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-label-md font-semibold text-on-surface-variant transition-colors hover:bg-surface-container-high hover:text-primary"
              >
                <span className="material-symbols-outlined text-lg">edit</span>
                Editar
              </Link>
              <button
                type="button"
                disabled={isPending}
                onClick={() => patchOffering(offering.id, "duplicate")}
                className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-label-md font-semibold text-on-surface-variant transition-colors hover:bg-surface-container-high hover:text-primary disabled:cursor-not-allowed disabled:opacity-50"
              >
                <span className="material-symbols-outlined text-lg">content_copy</span>
                {isPending ? "Procesando..." : "Duplicar"}
              </button>
              {offering.status === "published" ? (
                <button
                  type="button"
                  disabled={isPending}
                  onClick={() => patchOffering(offering.id, "draft")}
                  className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-label-md font-semibold text-on-surface-variant transition-colors hover:bg-surface-container-high hover:text-primary disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <span className="material-symbols-outlined text-lg">edit_note</span>
                  Borrador
                </button>
              ) : (
                <button
                  type="button"
                  disabled={isPending}
                  onClick={() => patchOffering(offering.id, "publish")}
                  className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-label-md font-semibold text-secondary transition-colors hover:bg-secondary-container/10 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <span className="material-symbols-outlined text-lg">publish</span>
                  Publicar
                </button>
              )}
              <button
                type="button"
                disabled={isPending}
                onClick={() => patchOffering(offering.id, "trash")}
                className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-label-md font-semibold text-error transition-colors hover:bg-error-container disabled:cursor-not-allowed disabled:opacity-50"
              >
                <span className="material-symbols-outlined text-lg">delete</span>
                Eliminar
              </button>
            </div>
          </article>
        );
      })}
    </div>
  );
}
