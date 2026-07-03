"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState, type CSSProperties, type FormEvent } from "react";
import { DetailPage } from "@/components/collections/DetailPage";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import Switch from "@/components/ui/Switch";
import { SocialGallery } from "@/components/home/SocialGallery";
import type { ExperienceItem, ExperienceKind } from "@/data/types";
import AdminActionModal from "./AdminActionModal";
import MediaLibraryModal from "./MediaLibraryModal";
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
type SaveIntent = "draft" | "publish";
type FormNotice = { type: "success" | "error"; message: string; details?: string[] };
type HeroPreviewDevice = "phone" | "tablet" | "desktop";
type LegacyOfferingDetails = Partial<ClassOfferingDetails> & {
  additionalInfo?: unknown;
  category?: unknown;
  included?: unknown;
  introHighlight?: unknown;
  paymentMethods?: unknown;
  program?: unknown;
  videoCardImage?: unknown;
  whatYouWillLearn?: unknown;
  whoCanJoin?: unknown;
};

const DEFAULT_HERO_IMAGE = "/img/hero-bg.jpg";

const heroPreviewDevices: Array<{
  key: HeroPreviewDevice;
  label: string;
  width: number;
  height: number;
}> = [
  { key: "phone", label: "Teléfono", width: 390, height: 520 },
  { key: "tablet", label: "Tablet", width: 760, height: 540 },
  { key: "desktop", label: "Desktop", width: 1180, height: 620 },
];

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
  heroLogoPositionX: "50%",
  heroLogoPositionY: "46px",
  heroLogoWidth: "118px",
  heroLogoTabletPositionX: "50%",
  heroLogoTabletPositionY: "42px",
  heroLogoTabletWidth: "106px",
  heroLogoMobilePositionX: "50%",
  heroLogoMobilePositionY: "34px",
  heroLogoMobileWidth: "92px",
  heroMenuPositionY: "132px",
  heroMenuTabletPositionY: "118px",
  heroMenuMobilePositionY: "96px",
  ctaHref: "",
  ctaConsultHref: "",
  ctaEnrollHref: "",
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
  return value.split(/\r?\n/);
}

function textValue(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function firstText(...values: unknown[]) {
  for (const value of values) {
    const text = textValue(value);
    if (text) return text;
  }
  return "";
}

function defaultCtaHref(details: Pick<ClassOfferingDetails, "whatsappNumber" | "content">) {
  const whatsapp = firstText(details.whatsappNumber, details.content?.contactWhatsapp, "34633788860").replace(/\D/g, "");
  return `https://wa.me/${whatsapp || "34633788860"}`;
}

function textList(value: unknown) {
  if (Array.isArray(value)) return value.map((item) => String(item).trim()).filter(Boolean);
  if (typeof value === "string") return value.split(/\r?\n|,/).map((item) => item.trim()).filter(Boolean);
  return [] as string[];
}

function textBlock(value: unknown) {
  return textList(value).join("\n");
}

function legacyModules(value: unknown): ClassOfferingDetails["content"]["modules"] {
  if (!Array.isArray(value)) return [];

  return value
    .map((item, index) => {
      const source = item && typeof item === "object" ? item as Record<string, unknown> : {};
      const title = firstText(source.title, `Módulo ${index + 1}`);
      const content = firstText(source.content, source.description);
      const points = textList(source.points);

      return {
        id: firstText(source.id) || createId("module"),
        title,
        description: [content, ...points.map((point) => `- ${point}`)].filter(Boolean).join("\n"),
        duration: firstText(source.duration),
        image: firstText(source.image),
        order: typeof source.order === "number" ? source.order : index,
      };
    })
    .filter((item) => item.title || item.description);
}

function legacyScheduleDays(schedule: string[]): ClassScheduleDay[] {
  return schedule.map((item, index) => {
    const [title, ...descriptionParts] = item.split(":");
    return {
      id: `schedule-${index}`,
      date: "",
      startTime: "",
      endTime: "",
      title: title?.trim() || "Disponible",
      description: descriptionParts.join(":").trim() || "Consultar disponibilidad",
      location: "",
      availableSeats: null,
      order: index,
    };
  });
}

function toClassDetails(offering: Offering): ClassOfferingDetails {
  const legacyDetails = (offering.details ?? {}) as LegacyOfferingDetails;
  const fromDetails = { ...legacyDetails, ...(offering.details.class ?? {}) } as LegacyOfferingDetails;
  const legacyContent = defaultContent();
  legacyContent.learningContent = textBlock(fromDetails.whatYouWillLearn);
  legacyContent.participationContent = textBlock(fromDetails.whoCanJoin);
  legacyContent.paymentMethods = textBlock(fromDetails.paymentMethods);
  legacyContent.extraInfo = firstText(fromDetails.additionalInfo);
  legacyContent.modules = legacyModules(fromDetails.program);

  const persistedContent = fromDetails.content ?? {};
  const mergedContent = {
    ...legacyContent,
    ...persistedContent,
    learningContent: firstText((persistedContent as Partial<ClassOfferingDetails["content"]>).learningContent, legacyContent.learningContent),
    participationContent: firstText((persistedContent as Partial<ClassOfferingDetails["content"]>).participationContent, legacyContent.participationContent),
    paymentMethods: firstText((persistedContent as Partial<ClassOfferingDetails["content"]>).paymentMethods, legacyContent.paymentMethods),
    extraInfo: firstText((persistedContent as Partial<ClassOfferingDetails["content"]>).extraInfo, legacyContent.extraInfo),
    modules: Array.isArray((persistedContent as Partial<ClassOfferingDetails["content"]>).modules) && (persistedContent as Partial<ClassOfferingDetails["content"]>).modules?.length
      ? (persistedContent as ClassOfferingDetails["content"]).modules
      : legacyContent.modules,
    activitiesSection: {
      ...legacyContent.activitiesSection,
      ...((persistedContent as Partial<ClassOfferingDetails["content"]>).activitiesSection ?? {}),
    },
  };
  const galleryImages: OfferingGalleryImage[] = Array.isArray(fromDetails.galleryImages) && fromDetails.galleryImages.length
    ? fromDetails.galleryImages
    : offering.gallery.map((image, index) => ({ image, alt: "", order: index }));

  const pricing = Array.isArray(fromDetails.pricing) && fromDetails.pricing.length
    ? fromDetails.pricing
    : offering.price !== null
      ? [{ description: "Precio base", price: offering.price, order: 0 }]
      : [];

  const scheduleDays = Array.isArray(fromDetails.scheduleDays) && fromDetails.scheduleDays.length ? fromDetails.scheduleDays : legacyScheduleDays(offering.schedule);
  const includedItems = Array.isArray(fromDetails.includedItems) && fromDetails.includedItems.length ? fromDetails.includedItems : textList(fromDetails.included);
  const heroVariant = fromDetails.heroVariant === "image" || fromDetails.heroVariant === "text"
    ? fromDetails.heroVariant
    : "text";

  return {
    ...defaultClassDetails,
    ...fromDetails,
    heroVariant,
    heroMenuTone: fromDetails.heroMenuTone === "light" || fromDetails.heroMenuTone === "dark"
      ? fromDetails.heroMenuTone
      : heroVariant === "image" ? "light" : "dark",
    heroLogoPositionX: firstText(fromDetails.heroLogoPositionX, defaultClassDetails.heroLogoPositionX),
    heroLogoPositionY: firstText(fromDetails.heroLogoPositionY, defaultClassDetails.heroLogoPositionY),
    heroLogoWidth: firstText(fromDetails.heroLogoWidth, defaultClassDetails.heroLogoWidth),
    heroLogoTabletPositionX: firstText(fromDetails.heroLogoTabletPositionX, fromDetails.heroLogoPositionX, defaultClassDetails.heroLogoTabletPositionX),
    heroLogoTabletPositionY: firstText(fromDetails.heroLogoTabletPositionY, fromDetails.heroLogoPositionY, defaultClassDetails.heroLogoTabletPositionY),
    heroLogoTabletWidth: firstText(fromDetails.heroLogoTabletWidth, fromDetails.heroLogoWidth, defaultClassDetails.heroLogoTabletWidth),
    heroLogoMobilePositionX: firstText(fromDetails.heroLogoMobilePositionX, fromDetails.heroLogoPositionX, defaultClassDetails.heroLogoMobilePositionX),
    heroLogoMobilePositionY: firstText(fromDetails.heroLogoMobilePositionY, defaultClassDetails.heroLogoMobilePositionY),
    heroLogoMobileWidth: firstText(fromDetails.heroLogoMobileWidth, defaultClassDetails.heroLogoMobileWidth),
    heroMenuPositionY: firstText(fromDetails.heroMenuPositionY, defaultClassDetails.heroMenuPositionY),
    heroMenuTabletPositionY: firstText(fromDetails.heroMenuTabletPositionY, fromDetails.heroMenuPositionY, defaultClassDetails.heroMenuTabletPositionY),
    heroMenuMobilePositionY: firstText(fromDetails.heroMenuMobilePositionY, defaultClassDetails.heroMenuMobilePositionY),
    ctaHref: firstText(fromDetails.ctaHref),
    ctaConsultHref: firstText(fromDetails.ctaConsultHref, fromDetails.ctaHref),
    ctaEnrollHref: firstText(fromDetails.ctaEnrollHref, fromDetails.ctaHref),
    heroTitle: firstText(fromDetails.heroTitle, offering.title),
    heroSubtitle: firstText(fromDetails.heroSubtitle, fromDetails.category, offering.subtitle),
    highlightDescription: firstText(fromDetails.highlightDescription, fromDetails.introHighlight, offering.excerpt),
    durationText: firstText(fromDetails.durationText, offering.duration),
    heroImage: fromDetails.heroImage || offering.cover_image_url || DEFAULT_HERO_IMAGE,
    titleImage: fromDetails.titleImage ?? "",
    titleImageSecondary: fromDetails.titleImageSecondary ?? "",
    videoUrl: fromDetails.videoUrl ?? "",
    videoPoster: firstText(fromDetails.videoPoster, fromDetails.videoCardImage),
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
    scheduleDescription: firstText(fromDetails.scheduleDescription, offering.schedule.join("\n")),
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
    whatsappNumber: firstText(fromDetails.whatsappNumber, fromDetails.content && typeof fromDetails.content === "object" ? (fromDetails.content as Partial<ClassOfferingDetails["content"]>).contactWhatsapp : ""),
    seoImage: fromDetails.seoImage ?? "",
    content: mergedContent,
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
  value,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { label: string; required?: boolean; error?: string; help?: string }) {
  return (
    <div className="space-y-1.5">
      <FieldLabel required={required}>{label}</FieldLabel>
      <input
        {...props}
        value={value ?? ""}
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
  value,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string; error?: string; help?: string }) {
  return (
    <div className="space-y-1.5">
      <FieldLabel>{label}</FieldLabel>
      <textarea
        {...props}
        value={value ?? ""}
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

function heroDeviceKeys(device: HeroPreviewDevice) {
  if (device === "phone") {
    return {
      logoX: "heroLogoMobilePositionX",
      logoY: "heroLogoMobilePositionY",
      logoWidth: "heroLogoMobileWidth",
      menuY: "heroMenuMobilePositionY",
    } as const;
  }

  if (device === "tablet") {
    return {
      logoX: "heroLogoTabletPositionX",
      logoY: "heroLogoTabletPositionY",
      logoWidth: "heroLogoTabletWidth",
      menuY: "heroMenuTabletPositionY",
    } as const;
  }

  return {
    logoX: "heroLogoPositionX",
    logoY: "heroLogoPositionY",
    logoWidth: "heroLogoWidth",
    menuY: "heroMenuPositionY",
  } as const;
}

function heroValue(details: ClassOfferingDetails, key: keyof ClassOfferingDetails) {
  const value = details[key];
  return typeof value === "string" ? value : "";
}

function HeroPositionEditor({
  details,
  activeDevice,
  onDeviceChange,
  onChange,
}: {
  details: ClassOfferingDetails;
  activeDevice: HeroPreviewDevice;
  onDeviceChange: (device: HeroPreviewDevice) => void;
  onChange: (next: Partial<ClassOfferingDetails>) => void;
}) {
  const keys = heroDeviceKeys(activeDevice);

  const updateField = (key: keyof ClassOfferingDetails, value: string) => {
    onChange({ [key]: value } as Partial<ClassOfferingDetails>);
  };

  return (
    <Card padding="lg" className="space-y-5 rounded-2xl">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h2 className="text-headline-sm text-on-surface">Posición responsive del hero</h2>
          <p className="mt-1 text-body-md text-on-surface-variant">
            Ajusta el logotipo y el menú inicial por dispositivo. Los valores aceptan %, px o rem.
          </p>
        </div>
        <div className="inline-flex rounded-xl border border-outline-variant bg-surface-container-low p-1">
          {heroPreviewDevices.map((device) => (
            <button
              type="button"
              key={device.key}
              onClick={() => onDeviceChange(device.key)}
              className={`min-h-11 rounded-lg px-4 text-label-md font-bold transition-colors ${
                activeDevice === device.key
                  ? "bg-[#9d4300] text-white shadow-sm"
                  : "text-on-surface-variant hover:bg-white"
              }`}
            >
              {device.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <fieldset className="space-y-4 rounded-xl border border-outline-variant bg-surface-container-lowest p-4">
          <legend className="px-2 text-label-md font-bold uppercase tracking-wide text-on-surface-variant">
            Propiedades del logo
          </legend>
          <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
            <TextField
              label="Logo X"
              value={heroValue(details, keys.logoX)}
              placeholder="50%"
              onChange={(event) => updateField(keys.logoX, event.target.value)}
            />
            <TextField
              label="Logo Y"
              value={heroValue(details, keys.logoY)}
              placeholder="46px"
              onChange={(event) => updateField(keys.logoY, event.target.value)}
            />
            <TextField
              label="Tamaño logo"
              value={heroValue(details, keys.logoWidth)}
              placeholder="118px"
              onChange={(event) => updateField(keys.logoWidth, event.target.value)}
            />
          </div>
        </fieldset>

        <fieldset className="space-y-4 rounded-xl border border-outline-variant bg-surface-container-lowest p-4">
          <legend className="px-2 text-label-md font-bold uppercase tracking-wide text-on-surface-variant">
            Posicionamiento del menú
          </legend>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-1.5">
              <FieldLabel>Color del menú inicial</FieldLabel>
              <select
                className="w-full rounded-xl border border-outline-variant bg-white px-4 py-3 text-body-md text-on-surface shadow-sm outline-none transition focus:border-secondary focus:ring-2 focus:ring-secondary-container"
                value={details.heroMenuTone ?? "dark"}
                onChange={(event) => onChange({ heroMenuTone: event.target.value as "light" | "dark" })}
              >
                <option value="light">Blanco</option>
                <option value="dark">Negro</option>
              </select>
            </div>
            <TextField
              label="Menú inicial Y"
              value={heroValue(details, keys.menuY)}
              placeholder="132px"
              help="También define cuándo aparece la barra secundaria en este dispositivo."
              onChange={(event) => updateField(keys.menuY, event.target.value)}
            />
          </div>
        </fieldset>
      </div>
    </Card>
  );
}

function HeroResponsivePreview({
  details,
  title,
  subtitle,
  device,
}: {
  details: ClassOfferingDetails;
  title: string;
  subtitle: string;
  device: HeroPreviewDevice;
}) {
  const preset = heroPreviewDevices.find((item) => item.key === device) ?? heroPreviewDevices[2];
  const keys = heroDeviceKeys(device);
  const isImageHero = details.heroVariant === "image";
  const isLight = details.heroMenuTone === "light";
  const navColor = isLight ? "rgba(255,255,255,0.95)" : "#3f3933";
  const logoFilter = isLight ? "brightness(0) invert(1)" : "brightness(0) saturate(100%)";
  const logoStyle = {
    left: heroValue(details, keys.logoX) || "50%",
    top: heroValue(details, keys.logoY) || "46px",
    width: heroValue(details, keys.logoWidth) || "118px",
    filter: logoFilter,
  } as CSSProperties;
  const menuStyle = {
    top: heroValue(details, keys.menuY) || "132px",
    color: navColor,
  } as CSSProperties;
  const frameStyle = {
    width: `${preset.width}px`,
    height: `${preset.height}px`,
    maxWidth: "100%",
    background: isImageHero
      ? `linear-gradient(to bottom, rgba(58,48,37,.2), rgba(251,250,246,.94)), url("${details.heroImage || DEFAULT_HERO_IMAGE}") center / cover no-repeat`
      : "#fbfaf6",
  } as CSSProperties;

  return (
    <Card padding="lg" className="space-y-5 rounded-2xl">
      <div className="flex flex-col gap-1">
        <h2 className="text-headline-sm text-on-surface">Renderizado del hero</h2>
        <p className="text-body-md text-on-surface-variant">
          Vista {preset.label.toLowerCase()} con las posiciones configuradas para ese dispositivo.
        </p>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-outline-variant bg-surface-container-low p-4">
        <div className="relative mx-auto overflow-hidden rounded-xl border border-outline-variant bg-[#fbfaf6] shadow-sm" style={frameStyle}>
          <img
            src="/img/logo-header.png"
            alt="Casa Rosier"
            className="absolute z-20 h-auto -translate-x-1/2"
            style={logoStyle}
          />

          <div
            className="absolute left-1/2 z-20 flex -translate-x-1/2 items-center justify-center whitespace-nowrap text-[12px] font-bold"
            style={menuStyle}
          >
            {device === "phone" ? (
              <button
                type="button"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-current/30"
                aria-label="Vista de botón de menú móvil"
              >
                <span className="material-symbols-outlined text-[22px]">menu</span>
              </button>
            ) : (
              <nav aria-label="Vista previa menú hero">
                <ul className="flex list-none items-center gap-4 p-0">
                  {["Inicio", "Clases", "Workshops", "Experiencias", "Gift Cards", "El Estudio", "Shop"].map((item) => (
                    <li key={item} className="flex items-center gap-2">
                      <span>{item}</span>
                      {item !== "Inicio" && item !== "Shop" ? <span aria-hidden="true">+</span> : null}
                    </li>
                  ))}
                </ul>
              </nav>
            )}
          </div>

          <div className="absolute inset-x-8 top-1/2 z-10 -translate-y-1/2 text-center">
            {isImageHero ? (
              <div className="relative mx-auto h-[150px] w-[min(520px,72%)]">
                {details.titleImage ? (
                  <Image src={details.titleImage} alt="Texto principal del hero" fill sizes="520px" className="object-contain opacity-80" unoptimized />
                ) : (
                  <span className="font-serif text-[clamp(32px,5vw,56px)] italic text-white/80">Casa Rosier</span>
                )}
                {details.titleImageSecondary ? (
                  <Image src={details.titleImageSecondary} alt="Texto secundario del hero" fill sizes="520px" className="object-contain" unoptimized />
                ) : (
                  <span className="absolute inset-0 grid place-items-center font-serif text-[clamp(28px,4vw,48px)] italic text-white">
                    {details.heroTitle || title || "Casa Rosier"}
                  </span>
                )}
              </div>
            ) : (
              <div>
                <h3 className="font-serif text-[clamp(30px,4vw,54px)] uppercase leading-none tracking-normal text-[#5b554f]">
                  {details.heroTitle || title || "Un día de cerámica"}
                </h3>
                <p className="mt-4 text-label-md uppercase text-[#a99b90]">
                  {details.heroSubtitle || subtitle || "Clases - Iniciación"}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
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

function kindForOfferingType(type: Offering["type"]): ExperienceKind {
  if (type === "workshop") return "workshop";
  if (type === "gift_card") return "gift-card";
  if (type === "experience") return "private-booking";
  return "class";
}

function formatPreviewPrice(value: number | null) {
  return value === null ? "" : `${value} EUR`;
}

function previewSchedule(details: ClassOfferingDetails) {
  if (!details.showScheduleOnFrontend) return [];
  return details.scheduleDays.map((item) => ({
    day: item.title || item.date || "Disponible",
    slots: [
      item.startTime && item.endTime
        ? `${item.startTime} a ${item.endTime}`
        : item.description || "Consultar disponibilidad",
    ].filter(Boolean),
  }));
}

function previewProgram(details: ClassOfferingDetails) {
  return [...details.content.modules]
    .sort((a, b) => a.order - b.order)
    .map((item, index) => ({
      title: item.title || `Módulo ${index + 1}`,
      content: item.description,
    }))
    .filter((item) => item.title || item.content);
}

function buildPreviewItem({
  offeringType,
  title,
  slug,
  subtitle,
  description,
  details,
}: {
  offeringType: Offering["type"];
  title: string;
  slug: string;
  subtitle: string;
  description: string;
  details: ClassOfferingDetails;
}): ExperienceItem {
  const kind = kindForOfferingType(offeringType);
  const galleryImages = details.galleryImages
    .filter((item) => item.image)
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
    .map((item) => item.image);
  const fallbackImage = details.heroImage || details.videoPoster || DEFAULT_HERO_IMAGE;
  const fallbackCta = defaultCtaHref(details);
  const consultHref = details.ctaConsultHref || details.ctaHref || fallbackCta;
  const enrollHref = details.ctaEnrollHref || details.ctaHref || fallbackCta;
  const priceOptions = details.pricing
    .filter((item) => item.description.trim() || item.price !== null)
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
    .map((item) => ({
      label: item.description || "Precio",
      price: formatPreviewPrice(item.price),
    }));
  const paymentMethods = toLines(details.content.paymentMethods.replace(/,/g, "\n"));

  return {
    id: "preview",
    kind,
    slug: slugify(slug || title || "vista-previa"),
    title: title || "Título del producto",
    subtitle: subtitle || title || "Título del producto",
    category: details.heroSubtitle || offeringType,
    excerpt: details.highlightDescription,
    description: toLines(description),
    coverImage: galleryImages[0] || fallbackImage,
    heroImage: fallbackImage,
    heroVariant: details.heroVariant,
    heroMenuTone: details.heroMenuTone,
    heroLogoPositionX: details.heroLogoPositionX,
    heroLogoPositionY: details.heroLogoPositionY,
    heroLogoWidth: details.heroLogoWidth,
    heroLogoTabletPositionX: details.heroLogoTabletPositionX,
    heroLogoTabletPositionY: details.heroLogoTabletPositionY,
    heroLogoTabletWidth: details.heroLogoTabletWidth,
    heroLogoMobilePositionX: details.heroLogoMobilePositionX,
    heroLogoMobilePositionY: details.heroLogoMobilePositionY,
    heroLogoMobileWidth: details.heroLogoMobileWidth,
    heroMenuPositionY: details.heroMenuPositionY,
    heroMenuTabletPositionY: details.heroMenuTabletPositionY,
    heroMenuMobilePositionY: details.heroMenuMobilePositionY,
    heroTitleImage: details.titleImage,
    heroTitleImageSecondary: details.titleImageSecondary,
    heroTitle: details.heroTitle || title || "Título del hero",
    listingTitle: title || "Título del producto",
    listingSubtitle: details.heroSubtitle || "",
    introHighlight: details.highlightDescription || "Texto remarcado color café.",
    galleryImages: galleryImages.length ? galleryImages : [fallbackImage],
    videoCardImage: details.videoPoster || galleryImages[0] || fallbackImage,
    videoCardLabel: details.videoUrl ? "VIDEO" : "IMAGEN",
    priceOptions: priceOptions.length ? priceOptions : [{ label: "Precio", price: "0 EUR" }],
    duration: details.durationText || "Duración pendiente",
    schedule: previewSchedule(details),
    included: details.includedItems.filter((item) => item.trim()),
    program: previewProgram(details),
    whatYouWillLearn: toLines(details.content.learningContent),
    whoCanJoin: toLines(details.content.participationContent),
    paymentMethods: paymentMethods.length ? paymentMethods : ["Transferencia bancaria", "Tarjeta", "Efectivo"],
    additionalInfo:
      details.content.extraInfo ||
      `Cualquier consulta o información adicional que necesites, puedes escribir al WhatsApp ${details.whatsappNumber || details.content.contactWhatsapp || "633788860"}.`,
    showIdeaPromptSection: details.showIdeaPromptSection,
    ctaHref: consultHref,
    ctaConsultHref: consultHref,
    ctaEnrollHref: enrollHref,
    seoTitle: title || "Vista previa",
    seoDescription: details.highlightDescription || renderPlainText(description),
    isPublished: false,
    order: 0,
  };
}

function PreviewPane({
  offeringType,
  title,
  slug,
  subtitle,
  description,
  status,
  details,
}: {
  offeringType: Offering["type"];
  title: string;
  slug: string;
  subtitle: string;
  description: string;
  status: "draft" | "published";
  details: ClassOfferingDetails;
}) {
  const heroIsImage = details.heroVariant === "image";
  const previewItem = buildPreviewItem({ offeringType, title, slug, subtitle, description, details });
  const promoPage = previewItem.kind === "private-booking" ? undefined : previewItem.kind.replace("-card", "");

  return (
    <div className="overflow-hidden rounded-2xl border border-outline-variant bg-white shadow-sm">
      <div className="border-b border-outline-variant bg-surface-container-low px-4 py-2 text-label-md font-semibold text-on-surface-variant">
        Vista previa de escritorio · {status === "published" ? "Publicado" : "Borrador"}
      </div>
      <div
        className="cms-public-preview class-detail-page"
        data-promo-page={promoPage}
      >
        <div className="cms-public-preview__topbar">
          <img src="/img/logo-header.png" alt="Casa Rosier" />
          <nav aria-label="Vista previa">
            <span>Inicio</span>
            <span>|</span>
            <span>Clases +</span>
            <span>|</span>
            <span>Workshops +</span>
            <span>|</span>
            <span>Reservas Privadas +</span>
            <span>|</span>
            <span>Tarjeta de regalo +</span>
            <span>|</span>
            <span>El Estudio</span>
            <span>|</span>
            <span>Blog</span>
          </nav>
        </div>

        <header
          className={`cms-public-preview__hero ${heroIsImage ? "cms-public-preview__hero--image" : "cms-public-preview__hero--text"}`}
          style={heroIsImage ? { backgroundImage: `url(${details.heroImage || DEFAULT_HERO_IMAGE})` } : undefined}
        >
          {heroIsImage ? (
            <div className="cms-public-preview__hero-overlay" />
          ) : null}
          <div className="cms-public-preview__hero-content">
            {heroIsImage ? (
              <div className="cms-public-preview__script-stack">
                {details.titleImage ? (
                  <Image src={details.titleImage} alt="Texto principal del hero" fill sizes="520px" className="object-contain opacity-80" unoptimized />
                ) : (
                  <span className="cms-public-preview__script-fallback cms-public-preview__script-fallback--back">Casa Rosier</span>
                )}
                {details.titleImageSecondary ? (
                  <Image src={details.titleImageSecondary} alt="Texto secundario del hero" fill sizes="520px" className="object-contain" unoptimized />
                ) : (
                  <span className="cms-public-preview__script-fallback cms-public-preview__script-fallback--front">{details.heroTitle || title || "Casa Rosier"}</span>
                )}
              </div>
            ) : (
              <div>
                <h1>{details.heroTitle || title || "Título del hero"}</h1>
                <p>{details.heroSubtitle || subtitle || "Clases - Iniciación"}</p>
              </div>
            )}
          </div>
        </header>

        <div className="cms-public-preview__body">
          <DetailPage item={previewItem} />
        </div>
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
  const [heroPreviewDevice, setHeroPreviewDevice] = useState<HeroPreviewDevice>("desktop");
  const [title, setTitle] = useState(offering.title);
  const [slug, setSlug] = useState(offering.slug);
  const [subtitle, setSubtitle] = useState(offering.subtitle);
  const [description, setDescription] = useState(offering.description);
  const [status, setStatus] = useState<"draft" | "published">(offering.status === "published" ? "published" : "draft");
  const [seoTitle, setSeoTitle] = useState(offering.seo_title);
  const [seoDescription, setSeoDescription] = useState(offering.seo_description);
  const [details, setDetails] = useState<ClassOfferingDetails>(() => toClassDetails(offering));
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [toast, setToast] = useState<FormNotice | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [savingIntent, setSavingIntent] = useState<SaveIntent | null>(null);
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

  useEffect(() => {
    const buttons = document.querySelectorAll<HTMLButtonElement>('button[form="class-edit-form"][name="intent"]');

    buttons.forEach((button) => {
      if (!button.dataset.defaultLabel) button.dataset.defaultLabel = button.textContent ?? "";
      const intent = button.value === "publish" ? "publish" : "draft";
      button.disabled = isSaving;
      button.setAttribute("aria-busy", isSaving && savingIntent === intent ? "true" : "false");
      button.textContent =
        isSaving && savingIntent === intent
          ? intent === "publish"
            ? "Publicando..."
            : "Guardando..."
      : button.dataset.defaultLabel ?? "";
    });
  }, [isSaving, savingIntent]);

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

  function errorTab(errorKey: string): TabKey {
    if (errorKey === "heroTitle") return "hero";
    if (errorKey.startsWith("schedule-")) return "schedule";
    if (errorKey.startsWith("pricing-") || errorKey === "title" || errorKey === "slug" || errorKey === "whatsappNumber") return "basic";
    if (errorKey.startsWith("gallery-")) return "additions";
    return "basic";
  }

  function errorLabel(errorKey: string) {
    if (errorKey === "title") return "Información básica - Título interno";
    if (errorKey === "slug") return "Información básica - Slug (URL)";
    if (errorKey === "heroTitle") return "Hero - Título del hero";
    if (errorKey === "whatsappNumber") return "Información básica - WhatsApp";

    const pricing = errorKey.match(/^pricing-(\d+)$/);
    if (pricing) return `Información básica - Precio ${Number(pricing[1]) + 1}`;

    const gallery = errorKey.match(/^gallery-(\d+)$/);
    if (gallery) return `Adiciones - Imagen de galería ${Number(gallery[1]) + 1}`;

    const schedule = errorKey.match(/^schedule-(date|end|seats)-(\d+)$/);
    if (schedule) return `Horario - Día ${Number(schedule[2]) + 1}`;

    return errorKey;
  }

  function validationDetails(nextErrors: Record<string, string>) {
    return Object.entries(nextErrors).map(([key, message]) => `${errorLabel(key)}: ${message}`);
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
      if (!item.date && !item.title.trim()) nextErrors[`schedule-date-${index}`] = "Agrega una fecha o un título del día.";
      if (item.startTime && !item.endTime) nextErrors[`schedule-end-${index}`] = "Agrega una hora de fin.";
      if (item.startTime && item.endTime && item.endTime < item.startTime) nextErrors[`schedule-end-${index}`] = "La hora de fin no puede ser anterior a la hora de inicio.";
      if (item.availableSeats !== null && Number(item.availableSeats) < 0) nextErrors[`schedule-seats-${index}`] = "Las plazas no pueden ser negativas.";
    });
    setErrors(nextErrors);
    return nextErrors;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setToast(null);

    const submitter = (event.nativeEvent as SubmitEvent).submitter as HTMLButtonElement | null;
    const intent: SaveIntent = submitter?.value === "publish" ? "publish" : "draft";
    const nextStatus = intent === "publish" ? "published" : "draft";

    const validationErrors = validate();
    const validationKeys = Object.keys(validationErrors);
    if (validationKeys.length > 0) {
      setActiveTab(errorTab(validationKeys[0]));
      setToast({
        type: "error",
        message: `Encontré ${validationKeys.length === 1 ? "1 campo que necesita atención" : `${validationKeys.length} campos que necesitan atención`}.`,
        details: validationDetails(validationErrors),
      });
      return;
    }

    setIsSaving(true);
    setSavingIntent(intent);

    try {
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
              heroMenuTone: details.heroMenuTone,
              heroImage: details.heroVariant === "image" ? details.heroImage || DEFAULT_HERO_IMAGE : details.heroImage,
              heroLogoPositionX: details.heroLogoPositionX.trim() || defaultClassDetails.heroLogoPositionX,
              heroLogoPositionY: details.heroLogoPositionY.trim() || defaultClassDetails.heroLogoPositionY,
              heroLogoWidth: details.heroLogoWidth.trim() || defaultClassDetails.heroLogoWidth,
              heroLogoTabletPositionX: details.heroLogoTabletPositionX.trim() || defaultClassDetails.heroLogoTabletPositionX,
              heroLogoTabletPositionY: details.heroLogoTabletPositionY.trim() || defaultClassDetails.heroLogoTabletPositionY,
              heroLogoTabletWidth: details.heroLogoTabletWidth.trim() || defaultClassDetails.heroLogoTabletWidth,
              heroLogoMobilePositionX: details.heroLogoMobilePositionX.trim() || defaultClassDetails.heroLogoMobilePositionX,
              heroLogoMobilePositionY: details.heroLogoMobilePositionY.trim() || defaultClassDetails.heroLogoMobilePositionY,
              heroLogoMobileWidth: details.heroLogoMobileWidth.trim() || defaultClassDetails.heroLogoMobileWidth,
              heroMenuPositionY: details.heroMenuPositionY.trim() || defaultClassDetails.heroMenuPositionY,
              heroMenuTabletPositionY: details.heroMenuTabletPositionY.trim() || defaultClassDetails.heroMenuTabletPositionY,
              heroMenuMobilePositionY: details.heroMenuMobilePositionY.trim() || defaultClassDetails.heroMenuMobilePositionY,
              ctaHref: details.ctaConsultHref.trim() || details.ctaHref.trim(),
              ctaConsultHref: details.ctaConsultHref.trim(),
              ctaEnrollHref: details.ctaEnrollHref.trim(),
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

      const data = (await response.json().catch(() => ({}))) as { offering?: Offering; error?: string };
      if (!response.ok) {
        setToast({ type: "error", message: data.error || "No se pudieron guardar los cambios." });
        return;
      }

      setStatus(nextStatus);
      setIsDirty(false);
      setToast({
        type: "success",
        message: nextStatus === "published" ? "Publicado exitosamente." : "Borrador guardado correctamente.",
      });
      if (mode === "create" && data.offering?.id) {
        router.push(`${basePath}/${data.offering.id}/edit`);
      } else {
        router.refresh();
      }
    } catch {
      setToast({ type: "error", message: "No se pudo conectar con el servidor. Intenta nuevamente." });
    } finally {
      setIsSaving(false);
      setSavingIntent(null);
    }
  }

  function handleCancel() {
    if (isDirty && !window.confirm("Hay cambios sin guardar. ¿Salir igualmente?")) return;
    router.push(basePath);
  }

  return (
    <>
      <AdminActionModal
        open={Boolean(toast)}
        type={toast?.type}
        title={toast?.type === "success" ? "Acción completada" : "Revisa la edición"}
        message={toast?.message}
        details={toast?.details}
        confirmLabel="Entendido"
        onClose={() => setToast(null)}
      />

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
                  <span className="mt-3 block text-label-md font-semibold text-secondary">Menú configurable sobre imagen</span>
                </button>
                <button
                  type="button"
                  onClick={() => setHeroVariant("text")}
                  className={`rounded-2xl border p-4 text-left transition-colors ${details.heroVariant === "text" ? "border-secondary bg-secondary-container/20" : "border-outline-variant hover:bg-surface-container-low"}`}
                >
                  <span className="block text-title-md font-bold text-on-surface">Hero tipográfico</span>
                  <span className="mt-1 block text-body-md text-on-surface-variant">Fondo blanco con título y subtítulo usando la tipografía definida.</span>
                  <span className="mt-3 block text-label-md font-semibold text-secondary">Menú configurable sobre fondo claro</span>
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

            <HeroPositionEditor
              details={details}
              activeDevice={heroPreviewDevice}
              onDeviceChange={setHeroPreviewDevice}
              onChange={updateDetails}
            />

            <HeroResponsivePreview
              details={details}
              title={title}
              subtitle={subtitle}
              device={heroPreviewDevice}
            />
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
              <div>
                <h2 className="text-headline-sm text-on-surface">Botones CTA</h2>
                <p className="mt-1 text-body-md text-on-surface-variant">
                  Define a dónde dirige cada botón de la página pública. Si un campo queda vacío, se usará WhatsApp.
                </p>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <TextField
                  label="Consultar"
                  value={details.ctaConsultHref}
                  placeholder={defaultCtaHref(details)}
                  help="Aparece en los botones Consultar o Comprar."
                  onChange={(event) => updateDetails({ ctaConsultHref: event.target.value, ctaHref: event.target.value })}
                />
                <TextField
                  label="Inscribirme"
                  value={details.ctaEnrollHref}
                  placeholder={defaultCtaHref(details)}
                  help="Aparece en el CTA final de la ficha."
                  onChange={(event) => updateDetails({ ctaEnrollHref: event.target.value })}
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
              <RichTextField
                label="Qué incluye"
                value={details.includedItems.join("\n")}
                onChange={updateIncludedItems}
                minHeight="150px"
                placeholder="Un elemento por línea. Puedes usar negritas, itálica, listas y enlaces."
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
            <PreviewPane offeringType={offering.type} title={title} slug={slug} subtitle={subtitle} description={description} status={status} details={details} />
            <Card padding="lg" className="space-y-5 rounded-2xl">
              <h2 className="text-headline-sm text-on-surface">Publicación</h2>
              <p className="text-body-md text-on-surface-variant">Guarda como borrador o publica esta página. Al publicar, este producto queda listo para mostrarse en su categoría correspondiente.</p>
              <div className="flex flex-wrap gap-3">
                <Button type="submit" name="intent" value="draft" variant="outlined" disabled={isSaving} aria-busy={isSaving && savingIntent === "draft"}>
                  {isSaving && savingIntent === "draft" ? "Guardando..." : "Guardar como boceto"}
                </Button>
                <Button type="submit" name="intent" value="publish" disabled={isSaving} aria-busy={isSaving && savingIntent === "publish"}>
                  {isSaving && savingIntent === "publish" ? "Publicando..." : "Publicar"}
                </Button>
              </div>
            </Card>
          </>
        ) : null}

        <div className="border-t border-outline-variant pt-5">
          <Button type="button" variant="ghost" onClick={handleCancel}>Cancelar</Button>
        </div>

        <div className="admin-sticky-actionbar">
          <span className="admin-sticky-actionbar__meta">{isDirty ? "Cambios sin guardar" : "Cambios al día"}</span>
          <Button type="submit" name="intent" value="draft" variant="outlined" disabled={isSaving} aria-busy={isSaving && savingIntent === "draft"}>
            {isSaving && savingIntent === "draft" ? "Guardando..." : "Guardar boceto"}
          </Button>
          <Button type="submit" name="intent" value="publish" disabled={isSaving} aria-busy={isSaving && savingIntent === "publish"}>
            {isSaving && savingIntent === "publish" ? "Publicando..." : "Publicar"}
          </Button>
        </div>
      </form>

      <MediaLibraryModal
        open={pickerTarget !== null}
        onSelect={handleSelectImage}
        onClose={() => setPickerTarget(null)}
      />
    </>
  );
}
