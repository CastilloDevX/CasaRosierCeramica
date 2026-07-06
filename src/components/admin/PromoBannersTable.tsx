"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import AdminActionModal from "./AdminActionModal";
import type { PromoBanner, PromoStatus } from "@/lib/cms/types";

const statusLabels: Record<PromoStatus, string> = {
  draft: "Borrador",
  published: "Publicado",
  archived: "Archivado",
  deleted: "Eliminado",
};

type Notice = {
  type: "success" | "error" | "info";
  title: string;
  message: string;
  details?: string[];
};

type ConfirmAction = {
  id: string;
  action: string;
  title: string;
  message: string;
  confirmLabel: string;
};

function parseStartDate(value: string) {
  if (!value) return null;
  const date = new Date(`${value}T00:00:00`);
  return Number.isNaN(date.valueOf()) ? null : date;
}

function parseEndDate(value: string) {
  if (!value) return null;
  const date = new Date(`${value}T23:59:59`);
  return Number.isNaN(date.valueOf()) ? null : date;
}

function formatDate(value: string) {
  if (!value) return "";
  return new Date(`${value}T00:00:00`).toLocaleDateString("es-MX", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function stripMarkdown(value: string) {
  return value
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/[*_`>#-]/g, "")
    .trim();
}

function getVisibilityState(banner: PromoBanner) {
  const now = new Date();
  const start = parseStartDate(banner.start_date);
  const end = parseEndDate(banner.end_date);

  if (start && end && end < start) {
    return {
      tone: "error",
      label: "Fechas inválidas",
      message: "La fecha final es anterior a la inicial. No se mostrará hasta corregirlo.",
      canShowNow: false,
    };
  }

  if (banner.status !== "published") {
    return {
      tone: "idle",
      label: "Inactivo",
      message: "No se muestra en el home.",
      canShowNow: false,
    };
  }

  if (start && start > now) {
    return {
      tone: "warning",
      label: "Programado",
      message: `Se mostrará desde ${formatDate(banner.start_date)}.`,
      canShowNow: false,
    };
  }

  if (end && end < now) {
    return {
      tone: "error",
      label: "Vencido",
      message: `Terminó el ${formatDate(banner.end_date)}.`,
      canShowNow: false,
    };
  }

  return {
    tone: "success",
    label: "Activo ahora",
    message: "Este es el único banner visible en el home.",
    canShowNow: true,
  };
}

export default function PromoBannersTable({ items }: { items: PromoBanner[] }) {
  const router = useRouter();
  const [pending, setPending] = useState<string | null>(null);
  const [notice, setNotice] = useState<Notice | null>(null);
  const [confirm, setConfirm] = useState<ConfirmAction | null>(null);

  const activeBanner = useMemo(
    () => items.find((banner) => getVisibilityState(banner).canShowNow) ?? null,
    [items],
  );

  async function run(id: string, action: string) {
    const pendingKey = `${id}:${action}`;
    setPending(pendingKey);
    setNotice(null);

    try {
      const response = await fetch(`/api/admin/components/promo-banners/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        setNotice({
          type: "error",
          title: "No se pudo completar",
          message: typeof data.error === "string" ? data.error : "Intenta nuevamente.",
        });
        return;
      }

      const fallback = action === "publish"
        ? "Banner activo y visible en el home."
        : action === "duplicate"
          ? "Banner duplicado como borrador."
          : action === "trash"
            ? "Banner movido a la papelera."
            : "Cambio aplicado.";

      setNotice({
        type: "success",
        title: "Acción completada",
        message: typeof data.message === "string" ? data.message : fallback,
      });
      router.refresh();
    } catch {
      setNotice({
        type: "error",
        title: "No se pudo conectar",
        message: "Revisa la conexión y vuelve a intentarlo.",
      });
    } finally {
      setPending(null);
    }
  }

  return (
    <>
      <section className="promo-activation-panel" aria-label="Estado de activación de banners">
        <div>
          <p className="auth-kicker">Banner activo</p>
          <h3>{activeBanner ? activeBanner.title : "Ningún banner visible ahora"}</h3>
          <p>
            {activeBanner
              ? "Solo este banner se mostrará en el home. Activar otro archivará este automáticamente."
              : "Activa un banner para mostrarlo inmediatamente en el home."}
          </p>
        </div>
        <span className={`promo-activation-panel__status ${activeBanner ? "is-on" : "is-off"}`}>
          <span className="material-symbols-outlined" aria-hidden="true">
            {activeBanner ? "radio_button_checked" : "radio_button_unchecked"}
          </span>
          {activeBanner ? "1 activo" : "0 activos"}
        </span>
      </section>

      <div className="admin-card-list promo-card-list">
        {items.map((banner) => {
          const visibility = getVisibilityState(banner);
          const isVisible = visibility.canShowNow;
          const actionPending = (action: string) => pending === `${banner.id}:${action}`;
          const shouldActivate = !isVisible;

          return (
            <article
              key={banner.id}
              className={`admin-list-card promo-admin-card ${isVisible ? "promo-admin-card--active" : ""} ${visibility.tone === "error" ? "promo-admin-card--blocked" : ""}`}
            >
              <div className="promo-admin-card__preview">
                {banner.image_url ? (
                  <img src={banner.image_url} alt={banner.title} />
                ) : (
                  <span>Sin imagen</span>
                )}
              </div>
              <div className="admin-list-card__body">
                <div className="admin-list-card__head">
                  <div>
                    <p className="auth-kicker">{banner.key_text || "Banner promocional"}</p>
                    <h3>{banner.title}</h3>
                    <p>{stripMarkdown(banner.text) || "Sin descripción general."}</p>
                  </div>
                  <div className="badge-stack">
                    <span className={`promo-visibility-pill promo-visibility-pill--${visibility.tone}`}>
                      <span className="material-symbols-outlined" aria-hidden="true">
                        {isVisible ? "visibility" : visibility.tone === "error" ? "error" : "visibility_off"}
                      </span>
                      {visibility.label}
                    </span>
                    <span className={`status-pill status-pill--${banner.status}`}>
                      {statusLabels[banner.status]}
                    </span>
                  </div>
                </div>

                <p className="admin-list-card__copy">{visibility.message}</p>

                <div className="admin-list-card__meta">
                  <span>Botón: {banner.button_text || "Sin texto"}</span>
                  <span>{banner.start_date ? `Inicia ${formatDate(banner.start_date)}` : "Sin fecha de inicio"}</span>
                  <span>{banner.end_date ? `Finaliza ${formatDate(banner.end_date)}` : "Sin fecha de fin"}</span>
                  <span>{banner.link_url || "Sin link"}</span>
                </div>

                <div className="row-actions admin-list-card__actions promo-admin-card__actions">
                  {shouldActivate ? (
                    <button className="primary-btn" type="button" onClick={() => run(banner.id, "publish")} disabled={Boolean(pending)}>
                      <span className="material-symbols-outlined" aria-hidden="true">radio_button_checked</span>
                      {actionPending("publish") ? "Activando..." : "Activar ahora"}
                    </button>
                  ) : (
                    <button className="secondary-btn" type="button" onClick={() => run(banner.id, "draft")} disabled={Boolean(pending)}>
                      <span className="material-symbols-outlined" aria-hidden="true">toggle_off</span>
                      {actionPending("draft") ? "Desactivando..." : "Desactivar"}
                    </button>
                  )}
                  <a className="link-btn" href={`/admin/components/promo-banners/${banner.id}/edit`}>
                    <span className="material-symbols-outlined" aria-hidden="true">edit</span>
                    Editar
                  </a>
                  <button className="secondary-btn" type="button" onClick={() => run(banner.id, "duplicate")} disabled={Boolean(pending)}>
                    <span className="material-symbols-outlined" aria-hidden="true">content_copy</span>
                    {actionPending("duplicate") ? "Duplicando..." : "Duplicar"}
                  </button>
                  <button
                    className="danger-btn"
                    type="button"
                    disabled={Boolean(pending)}
                    onClick={() => setConfirm({
                      id: banner.id,
                      action: "trash",
                      title: "Eliminar banner",
                      message: `Se moverá "${banner.title}" a la papelera. Puedes restaurarlo después desde Papelera.`,
                      confirmLabel: "Eliminar",
                    })}
                  >
                    <span className="material-symbols-outlined" aria-hidden="true">delete</span>
                    {actionPending("trash") ? "Eliminando..." : "Eliminar"}
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      <AdminActionModal
        open={Boolean(notice)}
        type={notice?.type}
        title={notice?.title ?? ""}
        message={notice?.message}
        details={notice?.details}
        onClose={() => setNotice(null)}
      />

      <AdminActionModal
        open={Boolean(confirm)}
        type="confirm"
        title={confirm?.title ?? ""}
        message={confirm?.message}
        confirmLabel={confirm?.confirmLabel}
        onConfirm={() => {
          if (confirm) void run(confirm.id, confirm.action);
        }}
        onClose={() => setConfirm(null)}
      />
    </>
  );
}
