"use client";

import { useState } from "react";
import Link from "@/components/admin/AdminLink";
import { FeaturedSection } from "@/components/home/FeaturedSection";
import { IntroSlider } from "@/components/home/IntroSlider";
import { HomeGiftCardSection } from "@/features/home/HomeGiftCardSection";
import type { ExperienceItem, GiftCardItem } from "@/data/types";
import type { HomeIntroSlide, HomePageSettings } from "@/lib/cms/types";
import { assetPath } from "@/lib/assets";
import AdminActionModal from "./AdminActionModal";
import MediaSelectField from "./MediaSelectField";

type TabKey = "carousel" | "classes" | "workshops" | "gifts" | "preview";
type ModalState = { type: "success" | "error"; title: string; message?: string } | null;

const tabs: Array<{ key: TabKey; label: string }> = [
  { key: "carousel", label: "Carousel destacado" },
  { key: "classes", label: "Clases" },
  { key: "workshops", label: "Workshops" },
  { key: "gifts", label: "Experiencias" },
  { key: "preview", label: "Vista previa" },
];

function sortBySelected<T extends { id: string }>(items: readonly T[], selectedIds: string[]) {
  if (!selectedIds.length) return [...items];
  const selected = new Set(selectedIds);
  return [...items]
    .filter((item) => selected.has(item.id))
    .sort((a, b) => selectedIds.indexOf(a.id) - selectedIds.indexOf(b.id));
}

function selectedOrAll<T extends { id: string }>(items: readonly T[], selectedIds: string[]) {
  const selected = sortBySelected(items, selectedIds);
  return selected.length ? selected : [...items];
}

export default function HomePageEditor({
  page,
  classes,
  workshops,
  giftCards,
}: {
  page: HomePageSettings;
  classes: ExperienceItem[];
  workshops: ExperienceItem[];
  giftCards: GiftCardItem[];
}) {
  const [tab, setTab] = useState<TabKey>("carousel");
  const [status, setStatus] = useState(page.status);
  const [introSlides, setIntroSlides] = useState(page.introSlides);
  const [classesTitle, setClassesTitle] = useState(page.classesTitle);
  const [classesSubtitle, setClassesSubtitle] = useState(page.classesSubtitle);
  const [classesFeaturedIds, setClassesFeaturedIds] = useState(page.classesFeaturedIds);
  const [workshopsTitle, setWorkshopsTitle] = useState(page.workshopsTitle);
  const [workshopsSubtitle, setWorkshopsSubtitle] = useState(page.workshopsSubtitle);
  const [workshopsFeaturedIds, setWorkshopsFeaturedIds] = useState(page.workshopsFeaturedIds);
  const [giftTitle, setGiftTitle] = useState(page.giftTitle);
  const [giftSubtitle, setGiftSubtitle] = useState(page.giftSubtitle);
  const [giftFeaturedIds, setGiftFeaturedIds] = useState(page.giftFeaturedIds);
  const [isLoading, setIsLoading] = useState(false);
  const [modal, setModal] = useState<ModalState>(null);

  function updateSlide(index: number, next: Partial<HomeIntroSlide>) {
    setIntroSlides((current) => current.map((slide, slideIndex) => slideIndex === index ? { ...slide, ...next } : slide));
  }

  function addSlide() {
    setIntroSlides((current) => [
      ...current,
      {
        id: `intro-${Date.now()}`,
        text: "",
        buttonText: "Ver mas",
        buttonHref: "/clases",
        image: "/img/hero-bg.jpg",
        imageAlt: "Imagen de Casa Rosier",
        isVisible: true,
        sortOrder: current.length,
      },
    ]);
  }

  function removeSlide(index: number) {
    setIntroSlides((current) => current.filter((_, slideIndex) => slideIndex !== index).map((slide, sortOrder) => ({ ...slide, sortOrder })));
  }

  function toggleSelected(id: string, selectedIds: string[], setSelectedIds: (ids: string[]) => void) {
    setSelectedIds(selectedIds.includes(id) ? selectedIds.filter((item) => item !== id) : [...selectedIds, id]);
  }

  async function save(nextStatus = status) {
    setIsLoading(true);
    setModal(null);
    const response = await fetch("/api/admin/home-page", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        status: nextStatus,
        introSlides: introSlides.map((slide, sortOrder) => ({ ...slide, sortOrder })),
        classesTitle,
        classesSubtitle,
        classesFeaturedIds,
        workshopsTitle,
        workshopsSubtitle,
        workshopsFeaturedIds,
        giftTitle,
        giftSubtitle,
        giftFeaturedIds,
      }),
    });

    if (!response.ok) {
      const data = await response.json().catch(() => ({})) as { error?: string };
      setModal({ type: "error", title: "No se pudo guardar", message: data.error || "Intenta de nuevo." });
      setIsLoading(false);
      return;
    }

    setStatus(nextStatus);
    setModal({ type: "success", title: nextStatus === "published" ? "Home publicada" : "Borrador guardado", message: "La configuracion de Home quedo lista." });
    setIsLoading(false);
  }

  const selectedClasses = selectedOrAll(classes, classesFeaturedIds);
  const selectedWorkshops = selectedOrAll(workshops, workshopsFeaturedIds);
  const selectedGiftCards = selectedOrAll(giftCards, giftFeaturedIds);

  return (
    <div className="cms-editor-shell">
      <AdminActionModal open={Boolean(modal)} type={modal?.type} title={modal?.title ?? ""} message={modal?.message} confirmLabel="Entendido" onClose={() => setModal(null)} />

      <header className="cms-page-editor-head">
        <div className="cms-page-editor-head__main">
          <h1>Home</h1>
          <p>Edicion de secciones principales de la pagina inicial</p>
          <div className="cms-page-editor-meta">
            <span className={`status-pill status-pill--${status}`}>{status}</span>
            <span>{introSlides.filter((slide) => slide.isVisible).length} slides visibles</span>
            <span>{classesFeaturedIds.length || classes.length} clases en home</span>
            <span>{giftFeaturedIds.length || giftCards.length} experiencias</span>
          </div>
        </div>
        <div className="cms-page-editor-actions">
          <Link className="secondary-btn" href="/admin/dashboard">Volver</Link>
          <button type="button" className="secondary-btn cms-outline-accent" onClick={() => save("draft")} disabled={isLoading}>{isLoading ? "Guardando..." : "Borrador"}</button>
          <button type="button" className="primary-btn" onClick={() => save("published")} disabled={isLoading}>{isLoading ? "Publicando..." : "Publicar"}</button>
        </div>
      </header>

      <nav className="cms-editor-tabs" aria-label="Secciones del editor de Home">
        {tabs.map((item) => (
          <button type="button" key={item.key} className={tab === item.key ? "is-active" : ""} onClick={() => setTab(item.key)}>
            {item.label}
          </button>
        ))}
      </nav>

      <div className="cms-editor-main">
        {tab === "carousel" ? (
          <section className="form-block cms-editor-card cms-home-editor-card">
            <div className="cms-editor-card__head">
              <div>
                <p className="auth-kicker">Home</p>
                <h3>Carousel destacado</h3>
                <p className="cms-editor-card__description">Cada slide usa una imagen de la biblioteca o una subida nueva. No se aceptan URLs manuales para evitar imágenes rotas en producción.</p>
              </div>
              <button type="button" className="primary-btn" onClick={addSlide}>Agregar slide</button>
            </div>
            <div className="cms-home-slides">
              {introSlides.map((slide, index) => (
                <article className="cms-home-slide-card" key={slide.id}>
                  <div className="cms-home-slide-card__media">
                    <MediaSelectField
                      label={`Imagen slide ${index + 1}`}
                      value={slide.image}
                      onChange={(image) => updateSlide(index, { image })}
                      previewClassName="cms-home-slide-card__preview"
                    />
                  </div>
                  <div className="cms-home-slide-card__body">
                    <div className="cms-home-slide-card__head">
                      <div>
                        <p className="auth-kicker">Slide {index + 1}</p>
                        <h4>{slide.buttonText || "Slide sin boton"}</h4>
                      </div>
                      <label className="cms-switch-row">
                        <input type="checkbox" checked={slide.isVisible} onChange={(event) => updateSlide(index, { isVisible: event.target.checked })} />
                        <span>Visible</span>
                      </label>
                    </div>
                    <div className="grid-2">
                      <label className="field span-2"><span>Texto</span><textarea rows={3} value={slide.text} onChange={(event) => updateSlide(index, { text: event.target.value })} /></label>
                      <label className="field"><span>Boton</span><input value={slide.buttonText} onChange={(event) => updateSlide(index, { buttonText: event.target.value })} /></label>
                      <label className="field"><span>Link</span><input value={slide.buttonHref} onChange={(event) => updateSlide(index, { buttonHref: event.target.value })} /></label>
                      <label className="field span-2"><span>Texto alternativo</span><input value={slide.imageAlt} onChange={(event) => updateSlide(index, { imageAlt: event.target.value })} /></label>
                    </div>
                    <div className="cms-home-slide-card__actions">
                      <button type="button" className="danger-btn" onClick={() => removeSlide(index)}>Eliminar slide</button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        ) : null}

        {tab === "classes" ? (
          <FeaturedPicker title={classesTitle} subtitle={classesSubtitle} items={classes} selectedIds={classesFeaturedIds} onTitleChange={setClassesTitle} onSubtitleChange={setClassesSubtitle} onToggle={(id) => toggleSelected(id, classesFeaturedIds, setClassesFeaturedIds)} emptyText="No hay clases publicadas." />
        ) : null}

        {tab === "workshops" ? (
          <FeaturedPicker title={workshopsTitle} subtitle={workshopsSubtitle} items={workshops} selectedIds={workshopsFeaturedIds} onTitleChange={setWorkshopsTitle} onSubtitleChange={setWorkshopsSubtitle} onToggle={(id) => toggleSelected(id, workshopsFeaturedIds, setWorkshopsFeaturedIds)} emptyText="No hay workshops publicados." />
        ) : null}

        {tab === "gifts" ? (
          <FeaturedPicker title={giftTitle} subtitle={giftSubtitle} items={giftCards} selectedIds={giftFeaturedIds} onTitleChange={setGiftTitle} onSubtitleChange={setGiftSubtitle} onToggle={(id) => toggleSelected(id, giftFeaturedIds, setGiftFeaturedIds)} emptyText="No hay gift cards publicadas." />
        ) : null}

        {tab === "preview" ? (
          <div className="cms-preview-frame">
            <div className="cms-public-preview__toolbar">Vista previa de escritorio</div>
            <div className="cms-public-preview">
              <div className="cms-public-preview__scale">
                <IntroSlider slides={introSlides.filter((slide) => slide.isVisible)} />
                <FeaturedSection id="clases-destacadas" title={classesTitle} subtitle={classesSubtitle} items={selectedClasses} variant="classes" />
                <FeaturedSection id="workshops-destacados" title={workshopsTitle} subtitle={workshopsSubtitle} items={selectedWorkshops} variant="workshops" />
                <HomeGiftCardSection title={giftTitle} subtitle={giftSubtitle} items={selectedGiftCards} />
              </div>
            </div>
          </div>
        ) : null}
      </div>

      <div className="admin-sticky-actionbar">
        <span className="admin-sticky-actionbar__meta">{introSlides.length} slides · {selectedClasses.length} clases · {selectedGiftCards.length} experiencias</span>
        <button type="button" className="secondary-btn" onClick={() => setTab("preview")}>Vista previa</button>
        <button type="button" className="secondary-btn" onClick={() => save("draft")} disabled={isLoading}>{isLoading ? "Guardando..." : "Borrador"}</button>
        <button type="button" className="primary-btn" onClick={() => save("published")} disabled={isLoading}>{isLoading ? "Publicando..." : "Publicar"}</button>
      </div>
    </div>
  );
}

function FeaturedPicker({
  title,
  subtitle,
  items,
  selectedIds,
  onTitleChange,
  onSubtitleChange,
  onToggle,
  emptyText,
}: {
  title: string;
  subtitle: string;
  items: ExperienceItem[];
  selectedIds: string[];
  onTitleChange: (value: string) => void;
  onSubtitleChange: (value: string) => void;
  onToggle: (id: string) => void;
  emptyText: string;
}) {
  return (
    <section className="form-block cms-editor-card cms-home-editor-card">
      <div className="cms-home-section-settings grid-2">
        <label className="field"><span>Titulo</span><input value={title} onChange={(event) => onTitleChange(event.target.value)} /></label>
        <label className="field"><span>Subtitulo</span><input value={subtitle} onChange={(event) => onSubtitleChange(event.target.value)} /></label>
      </div>
      <div className="cms-home-feature-grid">
        {items.length ? items.map((item) => (
          <label className={`cms-home-feature-card ${selectedIds.includes(item.id) ? "is-selected" : ""}`} key={item.id}>
            <span className="cms-home-feature-card__image">
              <img src={assetPath(item.coverImage)} alt="" loading="lazy" decoding="async" />
            </span>
            <span className="cms-home-feature-card__content">
              <span className="cms-home-feature-card__topline">
                <input type="checkbox" checked={selectedIds.includes(item.id)} onChange={() => onToggle(item.id)} />
                <span>{selectedIds.includes(item.id) ? "Visible en home" : "Oculto en home"}</span>
              </span>
              <strong>{item.title}</strong>
              <small>{item.category}</small>
              <span className="cms-home-feature-card__excerpt">{item.excerpt}</span>
            </span>
          </label>
        )) : <p className="muted">{emptyText}</p>}
      </div>
    </section>
  );
}
