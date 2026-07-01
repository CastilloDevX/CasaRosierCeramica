"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState, type FormEvent } from "react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Modal from "@/components/ui/Modal";
import Switch from "@/components/ui/Switch";
import { SocialGallery } from "@/components/home/SocialGallery";
import MediaPicker from "./MediaPicker";
import RichTextField from "./RichTextField";
import ClassContentTab, { defaultContent } from "./ClassContentTab";
import type {
  ClassOfferingDetails,
  ClassScheduleDay,
  Offering,
  OfferingGalleryImage,
  OfferingPriceOption,
} from "@/lib/cms/types";

type TabKey = "hero" | "basic" | "schedule" | "content" | "seo" | "additions" | "preview";
type PickerTarget = "hero" | "title" | "titleSecondary" | "gallery" | "seo" | "videoPoster" | null;

const DEFAULT_HERO_IMAGE = "/img/hero-bg.jpg";

const tabs: { key: TabKey; label: string }[] = [
  { key: "hero", label: "Hero" },
  { key: "basic", label: "Información básica" },
  { key: "schedule", label: "Horario" },
  { key: "content", label: "Contenido" },
  { key: "seo", label: "SEO" },
  { key: "additions", label: "Adiciones" },
  { key: "preview", label: "Vista previa" },
];

const defaultClassDetails: ClassOfferingDetails = {
  heroVariant: "text",
  heroTitle: "",
  heroSubtitle: "",
  heroMenuTone: "dark",
  highlightDescription: "",
  homeExcerpt: "",
  durationText: "",
  whatsappNumber: "",
  scheduleDescription: "",
  showScheduleOnFrontend: true,
  scheduleDays: [],
  menuPlacement: ["classes"],
  homeSections: [],
  heroImage: DEFAULT_HERO_IMAGE,
  titleImage: "",
  titleImageSecondary: "",
  galleryImages: [],
  videoUrl: "",
  videoPoster: "",
  includedItems: [],
  pricing: [],
  seoImage: "",
  showIdeaPromptSection: true,
  content: defaultContent(),
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
}

function createId(prefix: string) {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function menuPlacementForType(type: Offering["type"]) {
  if (type === "workshop") return ["workshops"];
  if (type === "experience") return ["experiences"];
  if (type === "gift_card") return ["gift-cards"];
  return ["classes"];
}

function toLines(value: string) {
  return value
    .split(/\r?\n/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function toClassDetails(offering: Offering): ClassOfferingDetails {
  const fromDetails = offering.details.class ?? {};
  const galleryImages: OfferingGalleryImage[] = Array.isArray(fromDetails.galleryImages) && fromDetails.galleryImages.length
    ? fromDetails.galleryImages
    : offering.gallery.map((image, index) => ({ image, alt: "", order: index }));

  const pricing = Array.isArray(fromDetails.pricing) && fromDetails.pricing.length
    ? fromDetails.pricing
    : offering.price !== null
      ? [{ description: "Precio base", price: offering.price, order: 0 }]
      : [];

  const scheduleDays = Array.isArray(fromDetails.scheduleDays) ? fromDetails.scheduleDays : [];
  const includedItems = Array.isArray(fromDetails.includedItems) ? fromDetails.includedItems : [];
  const heroVariant = fromDetails.heroVariant === "image" || fromDetails.heroVariant === "text"
    ? fromDetails.heroVariant
    : "text";

  return {
    ...defaultClassDetails,
    ...fromDetails,
    heroVariant,
    heroMenuTone: heroVariant === "image" ? "light" : "dark",
    heroTitle: fromDetails.heroTitle ?? offering.title ?? "",
    heroSubtitle: fromDetails.heroSubtitle ?? offering.subtitle ?? "",
    highlightDescription: fromDetails.highlightDescription ?? offering.excerpt ?? "",
    durationText: fromDetails.durationText ?? offering.duration ?? "",
    heroImage: fromDetails.heroImage || offering.cover_image_url || DEFAULT_HERO_IMAGE,
    titleImage: fromDetails.titleImage ?? "",
    titleImageSecondary: fromDetails.titleImageSecondary ?? "",
    videoUrl: fromDetails.videoUrl ?? "",
    videoPoster: fromDetails.videoPoster ?? "",
    includedItems,
    galleryImages: galleryImages
      .map((item, index) => ({
        image: item.image || "",
        alt: item.alt || "",
        seoTitle: item.seoTitle || "",
        seoDescription: item.seoDescription || "",
        order: item.order ?? index,
      }))
      .sort((a, b) => a.order - b.order),
    pricing: pricing.map((item, index) => ({ description: item.description || "", price: item.price ?? null, order: item.order ?? index })),
    scheduleDescription: fromDetails.scheduleDescription ?? "",
    showScheduleOnFrontend: fromDetails.showScheduleOnFrontend ?? true,
    scheduleDays: scheduleDays
      .map((item, index) => ({
        id: item.id || `schedule-${index}`,
        date: item.date || "",
        startTime: item.startTime || "",
        endTime: item.endTime || "",
        title: item.title || "",
        description: item.description || "",
        location: item.location || "",
        availableSeats: item.availableSeats ?? null,
        order: item.order ?? index,
      }))
      .sort((a, b) => (a.date || "9999-12-31").localeCompare(b.date || "9999-12-31") || a.order - b.order),
    seoImage: fromDetails.seoImage ?? "",
    content: { ...defaultContent(), ...(fromDetails.content ?? {}) },
  };
}

function FieldLabel({ children, required = false }: { children: string; required?: boolean }) {
  return (
    <label className="text-label-md font-bold uppercase tracking-wide text-on-surface-variant">
      {children}{required ? " *" : ""}
    </label>
  );
}

function TextField({
  label,
  required,
  error,
  help,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { label: string; required?: boolean; error?: string; help?: string }) {
  return (
    <div className="space-y-1.5">
      <FieldLabel required={required}>{label}</FieldLabel>
      <input
        {...props}
        className={`block w-full rounded-xl border bg-surface-container-lowest px-4 py-3 text-body-md text-on-surface transition-colors placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-2 focus:ring-secondary-container ${
          error ? "border-error" : "border-outline-variant"
        } ${props.className ?? ""}`}
      />
      {help && !error ? <p className="text-label-md text-on-surface-variant/70">{help}</p> : null}
      {error ? <p className="text-label-md text-error">{error}</p> : null}
    </div>
  );
}

function TextAreaField({
  label,
  error,
  help,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string; error?: string; help?: string }) {
  return (
    <div className="space-y-1.5">
      <FieldLabel>{label}</FieldLabel>
      <textarea
        {...props}
        className={`block min-h-[110px] w-full rounded-xl border bg-surface-container-lowest px-4 py-3 text-body-md text-on-surface transition-colors placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-2 focus:ring-secondary-container ${
          error ? "border-error" : "border-outline-variant"
        } ${props.className ?? ""}`}
      />
      {help && !error ? <p className="text-label-md text-on-surface-variant/70">{help}</p> : null}
      {error ? <p className="text-label-md text-error">{error}</p> : null}
    </div>
  );
}

function ImagePreview({ src, alt, aspect = "aspect-video" }: { src: string; alt: string; aspect?: string }) {
  if (!src) return null;
  return (
    <div className={`relative overflow-hidden rounded-xl border border-outline-variant bg-surface-container-high ${aspect}`}>
      <Image src={src} alt={alt} fill sizes="720px" className="object-cover" unoptimized />
    </div>
  );
}

function renderPlainText(value: string) {
  return value
    .replace(/\*\*/g, "")
    .replace(/_/g, "")
    .replace(/<u>|<\/u>/g, "")
    .replace(/~~/g, "")
    .replace(/^#+\s*/gm, "")
    .trim();
}

function PreviewPane({
  title,
  subtitle,
  description,
  status,
  details,
}: {
  title: string;
  subtitle: string;
  description: string;
  status: "draft" | "published";
  details: ClassOfferingDetails;
}) {
  const heroIsImage = details.heroVariant === "image";
  const galleryImage = details.galleryImages[0]?.image || details.videoPoster || details.heroImage;
  const paymentMethods = toLines(details.content.paymentMethods.replace(/,/g, "\n"));

  return (
    <div className="overflow-hidden rounded-2xl border border-outline-variant bg-white text-[#3d3833] shadow-sm">
      <div className="border-b border-outline-variant bg-surface-container-low px-4 py-2 text-label-md font-semibold text-on-surface-variant">
        Vista previa de escritorio · {status === "published" ? "Publicado" : "Borrador"}
      </div>
      <div className="origin-top bg-white">
        <section
          className={`relative flex min-h-[210px] flex-col items-center justify-start overflow-hidden ${heroIsImage ? "text-white" : "text-[#28231f]"}`}
          style={heroIsImage ? { backgroundImage: `url(${details.heroImage || DEFAULT_HERO_IMAGE})`, backgroundSize: "cover", backgroundPosition: "center" } : undefined}
        >
          {heroIsImage ? (
            <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,0.16),rgba(255,255,255,0.82))]" />
          ) : null}
          <div className="relative z-10 mt-6 text-center text-[10px] font-semibold">
            CASA ROSIER
            <div className="mt-5 flex justify-center gap-3 text-[9px]">
              <span>Clases</span><span>|</span><span>Workshops</span><span>|</span><span>Experiencias</span><span>|</span><span>Gift Card</span>
            </div>
          </div>
          <div className="relative z-10 flex flex-1 items-center justify-center px-8 text-center">
            {heroIsImage ? (
              <div className="relative h-24 w-[320px] max-w-full">
                {details.titleImage ? (
                  <Image src={details.titleImage} alt="Texto principal del hero" fill sizes="320px" className="object-contain opacity-80" unoptimized />
                ) : (
                  <p className="font-serif text-5xl italic text-white/80">Casa Rosier</p>
                )}
                {details.titleImageSecondary ? (
                  <Image src={details.titleImageSecondary} alt="Texto secundario del hero" fill sizes="320px" className="object-contain" unoptimized />
                ) : (
                  <p className="absolute inset-x-0 top-7 font-serif text-3xl italic text-white">Estudio Cerámica</p>
                )}
              </div>
            ) : (
              <div>
                <h1 className="font-serif text-4xl uppercase leading-none tracking-normal text-[#5b554f]">{details.heroTitle || title || "Título del hero"}</h1>
                <p className="mt-3 text-[11px] uppercase tracking-[0.28em] text-[#a99b90]">{details.heroSubtitle || subtitle || "Clases - Iniciación"}</p>
              </div>
            )}
          </div>
        </section>

        <section className="grid gap-5 px-8 py-8 md:grid-cols-[280px_1fr]">
          <div>
            <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-[#eee8e2]">
              {galleryImage ? <Image src={galleryImage} alt={title || "Imagen principal"} fill sizes="280px" className="object-cover" unoptimized /> : null}
            </div>
            <div className="mt-4 rounded-xl bg-[#f5f1ed] p-4 text-sm">
              <h3 className="font-semibold uppercase">Métodos de pago</h3>
              <ul className="mt-2 space-y-1 text-[#6f6258]">
                {(paymentMethods.length ? paymentMethods : ["Transferencia bancaria", "Tarjeta", "Efectivo"]).map((method) => <li key={method}>{method}</li>)}
              </ul>
            </div>
          </div>
          <div className="space-y-5">
            <header>
              <h2 className="font-serif text-3xl leading-tight text-[#5a514a]">{subtitle || title || "Título de producto"}</h2>
              <p className="mt-3 text-base text-[#8b6b55]">{details.highlightDescription || "Texto remarcado color café."}</p>
            </header>
            <p className="text-sm leading-7 text-[#685f58]">{renderPlainText(description) || "Texto descriptivo del producto."}</p>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-[#e2d8cf] p-4">
                <h3 className="font-semibold uppercase">Precio</h3>
                {details.pricing.slice(0, 2).map((price) => (
                  <p key={`${price.description}-${price.price}`} className="mt-2 flex justify-between text-sm"><span>{price.description || "Opción"}</span><strong>{price.price ?? 0} EUR</strong></p>
                ))}
              </div>
              <div className="rounded-xl border border-[#e2d8cf] p-4">
                <h3 className="font-semibold uppercase">Duración</h3>
                <p className="mt-2 text-sm">{details.durationText || "Duración pendiente"}</p>
              </div>
            </div>
            <div className="rounded-xl bg-[#f5f1ed] p-4">
              <h3 className="font-semibold uppercase">Contenido del curso</h3>
              <p className="mt-2 text-sm text-[#685f58]">{details.content.modules[0]?.title || "Módulos del producto"}</p>
            </div>
          </div>
        </section>
        {details.showIdeaPromptSection ? (
          <section className="border-t border-[#eadfd5] bg-[#fbf8f5] px-8 py-8 text-center">
            <h2 className="font-serif text-3xl leading-tight uppercase text-[#5b554f]">Y tu, cuando tuviste<br />tu ultima idea?</h2>
            <p className="mt-3 text-[11px] uppercase tracking-[0.2em] text-[#9b8a7d]">siguenos en instagram - @casarosier</p>
            <div className="mt-5 grid grid-cols-4 gap-2">
              {(details.galleryImages.length ? details.galleryImages : [{ image: details.heroImage, alt: "" }]).slice(0, 4).map((item, index) => (
                <div key={`${item.image}-${index}`} className="relative aspect-square overflow-hidden rounded-lg bg-[#eee8e2]">
                  {item.image ? <Image src={item.image} alt={item.alt || `Galería social ${index + 1}`} fill sizes="120px" className="object-cover" unoptimized /> : null}
                </div>
              ))}
            </div>
          </section>
        ) : null}
      </div>
    </div>
  );
}

export default function ClassEditForm({
  offering,
  mode = "edit",
  basePath = "/admin/clases",
}: {
  offering: Offering;
  mode?: "create" | "edit";
  basePath?: string;
}) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabKey>("hero");
  const [title, setTitle] = useState(offering.title);
  const [slug, setSlug] = useState(offering.slug);
  const [subtitle, setSubtitle] = useState(offering.subtitle);
  const [description, setDescription] = useState(offering.description);
  const [status, setStatus] = useState<"draft" | "published">(offering.status === "published" ? "published" : "draft");
  const [seoTitle, setSeoTitle] = useState(offering.seo_title);
  const [seoDescription, setSeoDescription] = useState(offering.seo_description);
  const [details, setDetails] = useState<ClassOfferingDetails>(() => toClassDetails(offering));
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [toast, setToast] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [pickerTarget, setPickerTarget] = useState<PickerTarget>(null);
  const [draggedGalleryIndex, setDraggedGalleryIndex] = useState<number | null>(null);

  useEffect(() => {
    const handler = (event: BeforeUnloadEvent) => {
      if (!isDirty) return;
      event.preventDefault();
      event.returnValue = "";
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [isDirty]);

  function updateDetails(next: Partial<ClassOfferingDetails>) {
    setDetails((current) => ({ ...current, ...next }));
    setIsDirty(true);
  }

  function setHeroVariant(heroVariant: "image" | "text") {
    updateDetails({
      heroVariant,
      heroMenuTone: heroVariant === "image" ? "light" : "dark",
      heroImage: heroVariant === "image" ? details.heroImage || DEFAULT_HERO_IMAGE : details.heroImage,
    });
  }

  function updatePricing(index: number, next: Partial<OfferingPriceOption>) {
    updateDetails({ pricing: details.pricing.map((item, i) => (i === index ? { ...item, ...next } : item)) });
  }

  function addPricing() {
    updateDetails({ pricing: [...details.pricing, { description: "", price: null, order: details.pricing.length }] });
  }

  function removePricing(index: number) {
    updateDetails({ pricing: details.pricing.filter((_, i) => i !== index).map((item, order) => ({ ...item, order })) });
  }

  function updateScheduleDay(index: number, next: Partial<ClassScheduleDay>) {
    updateDetails({
      scheduleDays: details.scheduleDays
        .map((item, i) => (i === index ? { ...item, ...next } : item))
        .map((item, order) => ({ ...item, order })),
    });
  }

  function addScheduleDay() {
    updateDetails({
      scheduleDays: [
        ...details.scheduleDays,
        {
          id: createId("schedule"),
          date: "",
          startTime: "",
          endTime: "",
          title: "",
          description: "",
          location: "",
          availableSeats: null,
          order: details.scheduleDays.length,
        },
      ],
    });
  }

  function duplicateScheduleDay(index: number) {
    const current = details.scheduleDays[index];
    if (!current) return;
    updateDetails({
      scheduleDays: [
        ...details.scheduleDays.slice(0, index + 1),
        { ...current, id: createId("schedule"), title: current.title ? `${current.title} (copia)` : "", order: index + 1 },
        ...details.scheduleDays.slice(index + 1),
      ].map((item, order) => ({ ...item, order })),
    });
  }

  function removeScheduleDay(index: number) {
    updateDetails({ scheduleDays: details.scheduleDays.filter((_, i) => i !== index).map((item, order) => ({ ...item, order })) });
  }

  function updateGalleryImage(index: number, next: Partial<OfferingGalleryImage>) {
    updateDetails({ galleryImages: details.galleryImages.map((item, i) => (i === index ? { ...item, ...next } : item)) });
  }

  function moveGalleryImage(from: number, to: number) {
    if (to < 0 || to >= details.galleryImages.length || from === to) return;
    const next = [...details.galleryImages];
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    updateDetails({ galleryImages: next.map((item, order) => ({ ...item, order })) });
  }

  function removeGalleryImage(index: number) {
    updateDetails({ galleryImages: details.galleryImages.filter((_, i) => i !== index).map((item, order) => ({ ...item, order })) });
  }

  function updateIncludedItems(value: string) {
    updateDetails({ includedItems: toLines(value) });
  }

  function handleSelectImage(url: string) {
    if (pickerTarget === "hero") updateDetails({ heroImage: url });
    if (pickerTarget === "title") updateDetails({ titleImage: url });
    if (pickerTarget === "titleSecondary") updateDetails({ titleImageSecondary: url });
    if (pickerTarget === "seo") updateDetails({ seoImage: url });
    if (pickerTarget === "videoPoster") updateDetails({ videoPoster: url });
    if (pickerTarget === "gallery") {
      updateDetails({ galleryImages: [...details.galleryImages, { image: url, alt: "", seoTitle: "", seoDescription: "", order: details.galleryImages.length }] });
    }
    setPickerTarget(null);
  }

  function validate() {
    const nextErrors: Record<string, string> = {};
    if (!title.trim()) nextErrors.title = "El título es obligatorio.";
    if (!slug.trim()) nextErrors.slug = "El slug es obligatorio.";
    if (details.heroVariant === "text" && !details.heroTitle.trim()) nextErrors.heroTitle = "Agrega el título del hero.";
    if (details.whatsappNumber && !/^\d+$/.test(details.whatsappNumber)) nextErrors.whatsappNumber = "Usa solo números, sin espacios.";
    details.pricing.forEach((item, index) => {
      if (item.price !== null && Number(item.price) < 0) nextErrors[`pricing-${index}`] = "El precio no puede ser negativo.";
    });
    details.galleryImages.forEach((item, index) => {
      if (item.image && !item.alt.trim()) nextErrors[`gallery-${index}`] = "El texto alternativo es obligatorio.";
    });
    details.scheduleDays.forEach((item, index) => {
      if (!item.date) nextErrors[`schedule-date-${index}`] = "La fecha es obligatoria.";
      if (item.startTime && !item.endTime) nextErrors[`schedule-end-${index}`] = "Agrega una hora de fin.";
      if (item.startTime && item.endTime && item.endTime < item.startTime) nextErrors[`schedule-end-${index}`] = "La hora de fin no puede ser anterior a la hora de inicio.";
      if (item.availableSeats !== null && Number(item.availableSeats) < 0) nextErrors[`schedule-seats-${index}`] = "Las plazas no pueden ser negativas.";
    });
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setToast(null);

    const submitter = (event.nativeEvent as SubmitEvent).submitter as HTMLButtonElement | null;
    const intent = submitter?.value === "publish" ? "publish" : submitter?.value === "draft" ? "draft" : status;
    const nextStatus = intent === "publish" ? "published" : "draft";

    if (!validate()) return;

    setIsSaving(true);
    const pricing = details.pricing.filter((item) => item.description.trim() || item.price !== null).map((item, order) => ({ ...item, order }));
    const galleryImages = details.galleryImages.filter((item) => item.image).map((item, order) => ({ ...item, order }));
    const scheduleDays = details.scheduleDays.map((item, order) => ({ ...item, order }));
    const primaryPrice = pricing.find((item) => item.price !== null)?.price ?? null;
    const coverImage = details.heroVariant === "image" ? details.heroImage || DEFAULT_HERO_IMAGE : galleryImages[0]?.image || details.videoPoster || offering.cover_image_url;

    const response = await fetch(mode === "create" ? "/api/admin/offerings" : `/api/admin/offerings/${offering.id}`, {
      method: mode === "create" ? "POST" : "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: title.trim(),
        slug: slugify(slug),
        subtitle: subtitle.trim(),
        excerpt: details.highlightDescription.trim(),
        description,
        duration: details.durationText.trim(),
        type: offering.type,
        status: nextStatus,
        price: primaryPrice,
        currency: "EUR",
        cover_image_url: coverImage,
        gallery: galleryImages.map((item) => item.image),
        seo_title: seoTitle.trim(),
        seo_description: seoDescription.trim(),
        details: {
          ...offering.details,
          class: {
            ...details,
            heroMenuTone: details.heroVariant === "image" ? "light" : "dark",
            heroImage: details.heroVariant === "image" ? details.heroImage || DEFAULT_HERO_IMAGE : details.heroImage,
            menuPlacement: menuPlacementForType(offering.type),
            homeSections: [],
            pricing,
            galleryImages,
            scheduleDays,
            includedItems: details.includedItems.map((item) => item.trim()).filter(Boolean),
            heroTitle: details.heroTitle.trim(),
            heroSubtitle: details.heroSubtitle.trim(),
            highlightDescription: details.highlightDescription.trim(),
            homeExcerpt: details.homeExcerpt.trim(),
            durationText: details.durationText.trim(),
            whatsappNumber: details.whatsappNumber.trim(),
            scheduleDescription: details.scheduleDescription.trim(),
            showScheduleOnFrontend: details.showScheduleOnFrontend,
            seoImage: details.seoImage,
            videoUrl: details.videoUrl.trim(),
            videoPoster: details.videoPoster.trim(),
            content: {
              ...details.content,
              learningSectionTitle: details.content.learningSectionTitle.trim(),
              learningContent: details.content.learningContent.trim(),
              participationSectionTitle: details.content.participationSectionTitle.trim(),
              participationContent: details.content.participationContent.trim(),
              paymentMethods: details.content.paymentMethods.trim(),
              contactWhatsapp: details.content.contactWhatsapp.trim(),
              contactEmail: details.content.contactEmail.trim(),
              extraInfo: details.content.extraInfo.trim(),
              modulesSectionTitle: details.content.modulesSectionTitle.trim(),
              modulesAccordionTitle: details.content.modulesAccordionTitle.trim(),
              modules: details.content.modules.map((mod, order) => ({ ...mod, title: mod.title.trim(), description: mod.description.trim(), order })),
              activitiesSection: {
                ...details.content.activitiesSection,
                title: details.content.activitiesSection.title.trim(),
                content: details.content.activitiesSection.content.trim(),
                items: details.content.activitiesSection.items.map((item, order) => ({ ...item, title: item.title.trim(), description: item.description.trim(), order })),
              },
            },
          },
        },
      }),
    });

    setIsSaving(false);
    const data = (await response.json().catch(() => ({}))) as { offering?: Offering; error?: string };
    if (!response.ok) {
      setToast(data.error || "No se pudieron guardar los cambios.");
      return;
    }

    setStatus(nextStatus);
    setIsDirty(false);
    setToast(nextStatus === "published" ? "Cambios publicados correctamente." : "Borrador guardado correctamente.");
    if (mode === "create" && data.offering?.id) {
      router.push(`${basePath}/${data.offering.id}/edit`);
    } else {
      router.refresh();
    }
  }

  function handleCancel() {
    if (isDirty && !window.confirm("Hay cambios sin guardar. ¿Salir igualmente?")) return;
    router.push(basePath);
  }

  return (
    <>
      <div className="mb-6 border-b border-outline-variant">
        <div className="flex gap-6 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={`whitespace-nowrap border-b-2 px-1 pb-3 text-label-md font-bold transition-colors ${
                activeTab === tab.key ? "border-secondary text-secondary" : "border-transparent text-on-surface-variant hover:text-on-surface"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {toast ? (
        <div className="mb-6 rounded-xl border border-outline-variant bg-surface-container-lowest px-4 py-3 text-label-md text-on-surface">
          {toast}
        </div>
      ) : null}

      <form id="class-edit-form" onSubmit={handleSubmit} className="space-y-6">
        {activeTab === "hero" ? (
          <>
            <Card padding="lg" className="space-y-5 rounded-2xl">
              <div>
                <h2 className="text-headline-sm text-on-surface">Tipo de hero</h2>
                <p className="mt-1 text-body-md text-on-surface-variant">Solo hay dos encabezados disponibles: imagen editorial con textos cursivos o fondo blanco con título tipográfico.</p>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <button
                  type="button"
                  onClick={() => setHeroVariant("image")}
                  className={`rounded-2xl border p-4 text-left transition-colors ${details.heroVariant === "image" ? "border-secondary bg-secondary-container/20" : "border-outline-variant hover:bg-surface-container-low"}`}
                >
                  <span className="block text-title-md font-bold text-on-surface">Hero con imagen</span>
                  <span className="mt-1 block text-body-md text-on-surface-variant">Imagen de fondo, gradiente blanco y dos imágenes de texto cursivo.</span>
                  <span className="mt-3 block text-label-md font-semibold text-secondary">Menú blanco automático</span>
                </button>
                <button
                  type="button"
                  onClick={() => setHeroVariant("text")}
                  className={`rounded-2xl border p-4 text-left transition-colors ${details.heroVariant === "text" ? "border-secondary bg-secondary-container/20" : "border-outline-variant hover:bg-surface-container-low"}`}
                >
                  <span className="block text-title-md font-bold text-on-surface">Hero tipográfico</span>
                  <span className="mt-1 block text-body-md text-on-surface-variant">Fondo blanco con título y subtítulo usando la tipografía definida.</span>
                  <span className="mt-3 block text-label-md font-semibold text-secondary">Menú negro automático</span>
                </button>
              </div>
            </Card>

            {details.heroVariant === "image" ? (
              <Card padding="lg" className="space-y-5 rounded-2xl">
                <h2 className="text-headline-sm text-on-surface">Hero con imagen</h2>
                <div className="grid gap-5 lg:grid-cols-[1fr_320px]">
                  <div className="space-y-4">
                    <ImagePreview src={details.heroImage || DEFAULT_HERO_IMAGE} alt="Fondo del hero" />
                    <div className="flex flex-wrap gap-3">
                      <Button type="button" variant="outlined" onClick={() => setPickerTarget("hero")}>Cambiar fondo</Button>
                      <Button type="button" variant="ghost" onClick={() => updateDetails({ heroImage: DEFAULT_HERO_IMAGE })}>Usar fondo por defecto</Button>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <FieldLabel>Imagen cursiva 1</FieldLabel>
                      <ImagePreview src={details.titleImage} alt="Texto cursivo 1" aspect="aspect-[3/1]" />
                      <Button type="button" variant="outlined" size="sm" className="mt-3" onClick={() => setPickerTarget("title")}>
                        {details.titleImage ? "Reemplazar" : "Seleccionar imagen"}
                      </Button>
                    </div>
                    <div>
                      <FieldLabel>Imagen cursiva 2</FieldLabel>
                      <ImagePreview src={details.titleImageSecondary} alt="Texto cursivo 2" aspect="aspect-[3/1]" />
                      <Button type="button" variant="outlined" size="sm" className="mt-3" onClick={() => setPickerTarget("titleSecondary")}>
                        {details.titleImageSecondary ? "Reemplazar" : "Seleccionar imagen"}
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ) : (
              <Card padding="lg" className="space-y-5 rounded-2xl">
                <h2 className="text-headline-sm text-on-surface">Hero tipográfico</h2>
                <div className="grid gap-4 md:grid-cols-2">
                  <TextField label="Título del hero" required value={details.heroTitle} error={errors.heroTitle} onChange={(event) => updateDetails({ heroTitle: event.target.value })} />
                  <TextField label="Subtítulo del hero" value={details.heroSubtitle} placeholder="Clases - Iniciación" onChange={(event) => updateDetails({ heroSubtitle: event.target.value })} />
                </div>
                <div className="rounded-2xl border border-outline-variant bg-white px-6 py-16 text-center">
                  <h3 className="font-serif text-5xl uppercase leading-none tracking-normal text-[#5b554f]">{details.heroTitle || "Un día de cerámica"}</h3>
                  <p className="mt-4 text-label-md uppercase tracking-[0.28em] text-[#a99b90]">{details.heroSubtitle || "Clases - Iniciación"}</p>
                </div>
              </Card>
            )}
          </>
        ) : null}

        {activeTab === "basic" ? (
          <>
            <Card padding="lg" className="space-y-5 rounded-2xl">
              <h2 className="text-headline-sm text-on-surface">Información básica</h2>
              <div className="grid gap-4 md:grid-cols-2">
                <TextField
                  label="Título interno"
                  required
                  value={title}
                  error={errors.title}
                  onChange={(event) => { setTitle(event.target.value); setIsDirty(true); }}
                  onBlur={() => { if (!slug.trim()) setSlug(slugify(title)); }}
                />
                <TextField
                  label="Slug (URL)"
                  required
                  value={slug}
                  error={errors.slug}
                  help="Si el slug ya existe, se agregará automáticamente un número al final."
                  onChange={(event) => { setSlug(slugify(event.target.value)); setIsDirty(true); }}
                />
              </div>
              <TextField label="Título del producto en página" value={subtitle} onChange={(event) => { setSubtitle(event.target.value); setIsDirty(true); }} />
              <TextAreaField label="Texto remarcado café" value={details.highlightDescription} onChange={(event) => updateDetails({ highlightDescription: event.target.value })} />
              <RichTextField label="Texto normal / descripción" value={description} onChange={(value) => { setDescription(value); setIsDirty(true); }} minHeight="220px" />
              <div className="grid gap-4 md:grid-cols-2">
                <TextField label="Duración" value={details.durationText} placeholder="Sesiones de 2 h." onChange={(event) => updateDetails({ durationText: event.target.value })} />
                <TextField
                  label="WhatsApp"
                  value={details.whatsappNumber}
                  error={errors.whatsappNumber}
                  help="Formato internacional sin espacios. Ej: 34633788860"
                  onChange={(event) => updateDetails({ whatsappNumber: event.target.value })}
                />
              </div>
            </Card>

            <Card padding="lg" className="space-y-5 rounded-2xl">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <h2 className="text-headline-sm text-on-surface">Precios</h2>
                <Button type="button" onClick={addPricing} size="sm">Agregar opción</Button>
              </div>
              <div className="space-y-3">
                {details.pricing.length ? details.pricing.map((item, index) => (
                  <div key={index} className="grid grid-cols-1 gap-3 rounded-xl border border-outline-variant p-4 md:grid-cols-[1fr_140px_auto] md:items-start">
                    <TextField label="Descripción" placeholder="Bono 4 clases" value={item.description} onChange={(event) => updatePricing(index, { description: event.target.value })} />
                    <TextField label="Precio (€)" type="number" min={0} value={item.price ?? ""} error={errors[`pricing-${index}`]} onChange={(event) => updatePricing(index, { price: event.target.value === "" ? null : Number(event.target.value) })} />
                    <button type="button" onClick={() => removePricing(index)} className="mt-7 inline-flex h-10 w-10 items-center justify-center rounded-lg text-error hover:bg-error-container" aria-label="Eliminar precio">
                      <span className="material-symbols-outlined">delete</span>
                    </button>
                  </div>
                )) : <p className="text-body-md text-on-surface-variant">No hay opciones de precio cargadas.</p>}
              </div>
            </Card>
          </>
        ) : null}

        {activeTab === "schedule" ? (
          <>
            <Card padding="lg" className="space-y-5 rounded-2xl">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h2 className="text-headline-sm text-on-surface">Horario</h2>
                  <p className="mt-1 text-body-md text-on-surface-variant">Fechas, turnos, ubicación y plazas disponibles.</p>
                </div>
                <Button type="button" variant="outlined" onClick={addScheduleDay}>Añadir día</Button>
              </div>
              <TextAreaField label="Descripción general del horario" value={details.scheduleDescription} onChange={(event) => updateDetails({ scheduleDescription: event.target.value })} className="min-h-[130px]" />
              <Switch
                checked={details.showScheduleOnFrontend}
                label="Mostrar horarios en la página pública"
                description="Controla si los días y turnos publicados aparecen dentro de la ficha del producto."
                onCheckedChange={(checked) => updateDetails({ showScheduleOnFrontend: checked })}
              />
            </Card>

            <div className="space-y-4">
              {details.scheduleDays.map((day, index) => (
                <Card key={day.id} padding="lg" className="space-y-4 rounded-2xl">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <h3 className="text-title-md font-bold text-on-surface">Día {index + 1}</h3>
                    <div className="flex flex-wrap gap-2">
                      <Button type="button" variant="ghost" size="sm" onClick={() => duplicateScheduleDay(index)}>Duplicar</Button>
                      <Button type="button" variant="ghost" size="sm" onClick={() => removeScheduleDay(index)}>Eliminar</Button>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                    <TextField label="Fecha / Día" type="date" required value={day.date} error={errors[`schedule-date-${index}`]} onChange={(event) => updateScheduleDay(index, { date: event.target.value })} />
                    <TextField label="Hora de inicio" type="time" value={day.startTime} onChange={(event) => updateScheduleDay(index, { startTime: event.target.value })} />
                    <TextField label="Hora de fin" type="time" value={day.endTime} error={errors[`schedule-end-${index}`]} onChange={(event) => updateScheduleDay(index, { endTime: event.target.value })} />
                  </div>
                  <TextField label="Título del día" value={day.title} onChange={(event) => updateScheduleDay(index, { title: event.target.value })} />
                  <TextAreaField label="Descripción del día" value={day.description} onChange={(event) => updateScheduleDay(index, { description: event.target.value })} />
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-[1fr_180px]">
                    <TextField label="Ubicación" value={day.location} onChange={(event) => updateScheduleDay(index, { location: event.target.value })} />
                    <TextField label="Plazas" type="number" min={0} value={day.availableSeats ?? ""} error={errors[`schedule-seats-${index}`]} onChange={(event) => updateScheduleDay(index, { availableSeats: event.target.value === "" ? null : Number(event.target.value) })} />
                  </div>
                </Card>
              ))}
              {!details.scheduleDays.length ? (
                <Card padding="lg" className="rounded-2xl text-center">
                  <p className="text-body-md text-on-surface-variant">No hay horarios cargados todavía.</p>
                  <Button type="button" variant="outlined" className="mt-4" onClick={addScheduleDay}>Añadir horario</Button>
                </Card>
              ) : null}
            </div>
          </>
        ) : null}

        {activeTab === "content" ? (
          <>
            <Card padding="lg" className="space-y-5 rounded-2xl">
              <h2 className="text-headline-sm text-on-surface">Galería, video e incluye</h2>
              <TextAreaField
                label="Qué incluye"
                value={details.includedItems.join("\n")}
                help="Un elemento por línea."
                onChange={(event) => updateIncludedItems(event.target.value)}
              />
              <div className="grid gap-4 md:grid-cols-[1fr_260px]">
                <TextField label="Video URL" value={details.videoUrl} placeholder="https://..." onChange={(event) => updateDetails({ videoUrl: event.target.value })} />
                <div>
                  <FieldLabel>Poster del video</FieldLabel>
                  <ImagePreview src={details.videoPoster} alt="Poster de video" />
                  <Button type="button" variant="outlined" size="sm" className="mt-3" onClick={() => setPickerTarget("videoPoster")}>
                    {details.videoPoster ? "Reemplazar poster" : "Seleccionar poster"}
                  </Button>
                </div>
              </div>
            </Card>

            <Card padding="lg" className="space-y-5 rounded-2xl">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-headline-sm text-on-surface">Imágenes de producto</h2>
                  <p className="mt-1 text-body-md text-on-surface-variant">Arrastra las imágenes para cambiar el orden. Cada imagen incluye SEO propio.</p>
                </div>
                <Button type="button" variant="outlined" onClick={() => setPickerTarget("gallery")}>Añadir imagen</Button>
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {details.galleryImages.map((item, index) => (
                  <div
                    key={`${item.image}-${index}`}
                    draggable
                    onDragStart={() => setDraggedGalleryIndex(index)}
                    onDragOver={(event) => event.preventDefault()}
                    onDrop={() => {
                      if (draggedGalleryIndex !== null) moveGalleryImage(draggedGalleryIndex, index);
                      setDraggedGalleryIndex(null);
                    }}
                    className="rounded-xl border border-outline-variant bg-surface-container-lowest p-4"
                  >
                    <div className="mb-3 flex items-center justify-between gap-3">
                      <span className="text-label-md font-bold uppercase tracking-wide text-on-surface-variant">Imagen {index + 1}</span>
                      <div className="flex items-center gap-1">
                        <button type="button" onClick={() => moveGalleryImage(index, index - 1)} className="inline-flex h-8 w-8 items-center justify-center rounded-lg hover:bg-surface-container-high" aria-label="Subir imagen">
                          <span className="material-symbols-outlined text-lg">arrow_upward</span>
                        </button>
                        <button type="button" onClick={() => moveGalleryImage(index, index + 1)} className="inline-flex h-8 w-8 items-center justify-center rounded-lg hover:bg-surface-container-high" aria-label="Bajar imagen">
                          <span className="material-symbols-outlined text-lg">arrow_downward</span>
                        </button>
                        <button type="button" onClick={() => removeGalleryImage(index)} className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-error hover:bg-error-container" aria-label="Eliminar imagen">
                          <span className="material-symbols-outlined text-lg">delete</span>
                        </button>
                      </div>
                    </div>
                    <ImagePreview src={item.image} alt={item.alt || `Imagen ${index + 1}`} />
                    <div className="mt-4 space-y-3 rounded-xl bg-surface-container-low p-3">
                      <TextField label="Texto alternativo (ALT)" required value={item.alt} error={errors[`gallery-${index}`]} onChange={(event) => updateGalleryImage(index, { alt: event.target.value })} />
                      <TextField label="Título SEO de imagen" value={item.seoTitle ?? ""} onChange={(event) => updateGalleryImage(index, { seoTitle: event.target.value })} />
                      <TextAreaField label="Descripción SEO de imagen" value={item.seoDescription ?? ""} onChange={(event) => updateGalleryImage(index, { seoDescription: event.target.value })} className="min-h-[80px]" />
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <ClassContentTab
              content={details.content}
              onChange={(content) => updateDetails({ content })}
              onDirty={() => setIsDirty(true)}
            />
          </>
        ) : null}

        {activeTab === "seo" ? (
          <>
            <Card padding="lg" className="space-y-5 rounded-2xl">
              <h2 className="text-headline-sm text-on-surface">SEO</h2>
              <TextField label="Título SEO" value={seoTitle} maxLength={70} help={`Caracteres: ${seoTitle.length}/70`} onChange={(event) => { setSeoTitle(event.target.value); setIsDirty(true); }} />
              <TextAreaField label="Descripción SEO" value={seoDescription} maxLength={160} help={`Caracteres: ${seoDescription.length}/160`} onChange={(event) => { setSeoDescription(event.target.value); setIsDirty(true); }} className="min-h-[100px]" />
            </Card>
            <Card padding="lg" className="space-y-5 rounded-2xl">
              <h2 className="text-headline-sm text-on-surface">Open Graph</h2>
              <ImagePreview src={details.seoImage} alt="Imagen SEO" />
              <Button type="button" variant="outlined" size="sm" onClick={() => setPickerTarget("seo")}>{details.seoImage ? "Reemplazar imagen" : "Establecer imagen SEO"}</Button>
              <div className="overflow-hidden rounded-xl border border-outline-variant bg-white p-4">
                <p className="truncate text-sm text-[#1a0dab]">{seoTitle || title || "Título SEO"}</p>
                <p className="truncate text-sm text-[#006d21]">{slug ? `casarosierceramica.com/clases/${slug}` : "casarosierceramica.com/clases/ejemplo"}</p>
                <p className="mt-1 line-clamp-2 text-sm text-[#545454]">{seoDescription || renderPlainText(description) || "Descripción SEO de la clase..."}</p>
              </div>
            </Card>
          </>
        ) : null}

        {activeTab === "additions" ? (
          <>
            <Card padding="lg" className="space-y-5 rounded-2xl">
              <div>
                <h2 className="text-headline-sm text-on-surface">Adiciones</h2>
                <p className="mt-1 text-body-md text-on-surface-variant">Activa bloques complementarios que se muestran al final de la página, antes del footer.</p>
              </div>
              <Switch
                checked={details.showIdeaPromptSection}
                label="Incluir galería social al final de la página"
                description="Muestra la sección “Y tu, cuando tuviste tu ultima idea?” con la galería social pública antes del footer."
                onCheckedChange={(checked) => updateDetails({ showIdeaPromptSection: checked })}
              />
            </Card>

            <Card padding="lg" className="space-y-5 rounded-2xl">
              <div>
                <h2 className="text-headline-sm text-on-surface">Vista del componente</h2>
                <p className="mt-1 text-body-md text-on-surface-variant">Referencia real de la sección que se insertará al final de la página pública.</p>
              </div>
              {details.showIdeaPromptSection ? (
                <div className="overflow-hidden rounded-2xl border border-outline-variant bg-white">
                  <SocialGallery />
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-outline-variant bg-surface-container-low p-8 text-center">
                  <p className="text-body-md font-semibold text-on-surface">La galería social está deshabilitada para esta página.</p>
                  <p className="mt-1 text-label-md text-on-surface-variant">Activa el switch superior para incluirla antes del footer.</p>
                </div>
              )}
            </Card>
          </>
        ) : null}

        {activeTab === "preview" ? (
          <>
            <PreviewPane title={title} subtitle={subtitle} description={description} status={status} details={details} />
            <Card padding="lg" className="space-y-5 rounded-2xl">
              <h2 className="text-headline-sm text-on-surface">Publicación</h2>
              <p className="text-body-md text-on-surface-variant">Guarda como borrador o publica esta página. Al publicar, este producto queda listo para mostrarse en su categoría correspondiente.</p>
              <div className="flex flex-wrap gap-3">
                <Button type="submit" name="intent" value="draft" variant="outlined" disabled={isSaving}>
                  {isSaving ? "Guardando..." : "Guardar como boceto"}
                </Button>
                <Button type="submit" name="intent" value="publish" disabled={isSaving}>
                  {isSaving ? "Publicando..." : "Publicar"}
                </Button>
              </div>
            </Card>
          </>
        ) : null}

        <div className="border-t border-outline-variant pt-5">
          <Button type="button" variant="ghost" onClick={handleCancel}>Cancelar</Button>
        </div>
      </form>

      <Modal open={pickerTarget !== null} onClose={() => setPickerTarget(null)} title="Seleccionar imagen">
        <MediaPicker onSelect={handleSelectImage} onClose={() => setPickerTarget(null)} />
      </Modal>
    </>
  );
}
