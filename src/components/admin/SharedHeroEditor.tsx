"use client";

import Image from "next/image";
import { useState, type CSSProperties, type InputHTMLAttributes } from "react";
import { MarkdownContent } from "@/components/ui/MarkdownContent";
import type { CmsHeroSettings, ClassHeroVariant } from "@/lib/cms/types";
import ColorPickerField from "./ColorPickerField";
import MediaSelectField from "./MediaSelectField";
import RichTextField from "./RichTextField";

type DeviceKey = "phone" | "tablet" | "desktop";

const devices: Array<{ key: DeviceKey; label: string; width: number; height: number }> = [
  { key: "phone", label: "Teléfono", width: 390, height: 520 },
  { key: "tablet", label: "Tablet", width: 760, height: 540 },
  { key: "desktop", label: "Desktop", width: 1180, height: 620 },
];

function FieldLabel({ children }: { children: string }) {
  return <label className="text-label-md font-bold uppercase tracking-wide text-on-surface-variant">{children}</label>;
}

function TextField({
  label,
  help,
  ...props
}: InputHTMLAttributes<HTMLInputElement> & { label: string; help?: string }) {
  return (
    <div className="space-y-1.5">
      <FieldLabel>{label}</FieldLabel>
      <input
        {...props}
        value={props.value ?? ""}
        className={`block min-h-11 w-full rounded-xl border border-outline-variant bg-surface-container-lowest px-4 py-3 text-body-md text-on-surface transition-colors placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-2 focus:ring-secondary-container ${props.className ?? ""}`}
      />
      {help ? <p className="text-label-md text-on-surface-variant/70">{help}</p> : null}
    </div>
  );
}

function deviceKeys(device: DeviceKey) {
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

function heroText(details: CmsHeroSettings, key: keyof CmsHeroSettings) {
  const value = details[key];
  return typeof value === "string" ? value : "";
}

export default function SharedHeroEditor({
  details,
  titleFallback,
  subtitleFallback,
  onChange,
}: {
  details: CmsHeroSettings;
  titleFallback: string;
  subtitleFallback?: string;
  onChange: (next: Partial<CmsHeroSettings>) => void;
}) {
  const [device, setDevice] = useState<DeviceKey>("desktop");
  const preset = devices.find((item) => item.key === device) ?? devices[2];
  const keys = deviceKeys(device);
  const navColor = details.heroMenuColor || (details.heroMenuTone === "light" ? "#ffffff" : "#3f3933");
  const isImageHero = details.heroVariant === "image";
  const isPresentationHero = details.heroVariant === "presentation";
  const frameStyle = {
    width: `${preset.width}px`,
    height: `${preset.height}px`,
    maxWidth: "100%",
    background: isPresentationHero
      ? `url("${details.heroImage}") center / cover no-repeat`
      : isImageHero
        ? `linear-gradient(to bottom, rgba(58,48,37,.2), rgba(251,250,246,.94)), url("${details.heroImage}") center / cover no-repeat`
        : "#fbfaf6",
  } as CSSProperties;
  const menuStyle = {
    top: heroText(details, keys.menuY) || "132px",
    color: navColor,
    transform: `translateX(-50%) scale(${device === "desktop" ? details.heroMenuScale ?? 1 : 1})`,
  } as CSSProperties;
  const logoMask = {
    backgroundColor: navColor,
    WebkitMaskImage: 'url("/img/logo-header.png")',
    maskImage: 'url("/img/logo-header.png")',
    WebkitMaskSize: "contain",
    maskSize: "contain",
    WebkitMaskRepeat: "no-repeat",
    maskRepeat: "no-repeat",
    WebkitMaskPosition: device === "desktop" ? "center" : "left center",
    maskPosition: device === "desktop" ? "center" : "left center",
  } as CSSProperties;

  function setVariant(heroVariant: ClassHeroVariant) {
    onChange({
      heroVariant,
      heroMenuTone: heroVariant === "text" ? "dark" : "light",
      heroMenuColor: heroVariant === "text" ? "#3f3933" : "#ffffff",
    });
  }

  return (
    <div className="space-y-6">
      <section className="form-block cms-editor-card">
        <div className="cms-editor-card__head">
          <div>
            <p className="auth-kicker">Hero</p>
            <h3>Presentación principal</h3>
          </div>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {([
            ["image", "Hero con imagen", "Fondo con imagen y arte/título superpuesto."],
            ["presentation", "Hero con presentación", "Fondo, texto enriquecido a la izquierda e imagen a la derecha."],
            ["text", "Hero tipográfico", "Hero sobrio con título y subtítulo editables."],
          ] as Array<[ClassHeroVariant, string, string]>).map(([value, label, description]) => (
            <button
              type="button"
              key={value}
              className={`rounded-2xl border p-4 text-left transition-colors ${details.heroVariant === value ? "border-secondary bg-secondary-container/20" : "border-outline-variant hover:bg-surface-container-low"}`}
              onClick={() => setVariant(value)}
            >
              <strong className="block text-title-sm text-on-surface">{label}</strong>
              <span className="mt-1 block text-body-sm text-on-surface-variant">{description}</span>
            </button>
          ))}
        </div>

        <div className="mt-5 grid gap-5 md:grid-cols-2">
          <TextField label="Título del hero" value={details.heroTitle} placeholder={titleFallback} onChange={(event) => onChange({ heroTitle: event.target.value })} />
          <TextField label="Subtítulo del hero" value={details.heroSubtitle} placeholder={subtitleFallback} onChange={(event) => onChange({ heroSubtitle: event.target.value })} />
          {details.heroVariant !== "text" ? (
            <div className="md:col-span-2">
              <MediaSelectField label="Imagen de fondo" value={details.heroImage} onChange={(heroImage) => onChange({ heroImage })} previewClassName="cms-shared-hero-media-preview" />
            </div>
          ) : null}
          {details.heroVariant === "image" ? (
            <>
              <MediaSelectField label="Imagen/título principal" value={details.titleImage} onChange={(titleImage) => onChange({ titleImage })} />
              <MediaSelectField label="Imagen/título secundario" value={details.titleImageSecondary} onChange={(titleImageSecondary) => onChange({ titleImageSecondary })} />
            </>
          ) : null}
          {details.heroVariant === "presentation" ? (
            <>
              <div className="md:col-span-2">
                <RichTextField label="Texto de presentación" value={details.heroPresentationText} onChange={(heroPresentationText) => onChange({ heroPresentationText })} minHeight="220px" />
              </div>
              <div className="cms-shared-hero-presentation-fields md:col-span-2">
                <ColorPickerField label="Color del texto" value={details.heroPresentationTextColor || "#FFFFFF"} onChange={(heroPresentationTextColor) => onChange({ heroPresentationTextColor })} />
                <MediaSelectField
                  label="Imagen lateral"
                  value={details.heroPresentationImage}
                  onChange={(heroPresentationImage) => onChange({ heroPresentationImage })}
                  previewClassName="cms-shared-hero-side-preview"
                />
              </div>
            </>
          ) : null}
        </div>
      </section>

      <section className="form-block cms-editor-card cms-hero-position-card">
        <div className="cms-editor-card__head cms-hero-position-card__head">
          <div>
            <h3>Posición responsive del hero</h3>
            <p>Ajusta el logotipo y el menú inicial por dispositivo. Los valores aceptan %, px o rem.</p>
          </div>
          <div className="cms-hero-device-tabs" role="tablist" aria-label="Dispositivo para editar posiciones del hero">
            {devices.map((item) => (
              <button
                type="button"
                key={item.key}
                onClick={() => setDevice(item.key)}
                className={device === item.key ? "is-active" : ""}
                role="tab"
                aria-selected={device === item.key}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        <div className="cms-hero-position-grid">
          <fieldset className="cms-hero-position-fieldset">
            <legend>Propiedades del logo</legend>
            <div className="cms-hero-position-fields cms-hero-position-fields--logo">
              <TextField label="Logo X" value={heroText(details, keys.logoX)} onChange={(event) => onChange({ [keys.logoX]: event.target.value } as Partial<CmsHeroSettings>)} />
              <TextField label="Logo Y" value={heroText(details, keys.logoY)} onChange={(event) => onChange({ [keys.logoY]: event.target.value } as Partial<CmsHeroSettings>)} />
              <TextField label="Tamaño logo" value={heroText(details, keys.logoWidth)} onChange={(event) => onChange({ [keys.logoWidth]: event.target.value } as Partial<CmsHeroSettings>)} />
            </div>
          </fieldset>

          <fieldset className="cms-hero-position-fieldset">
            <legend>Propiedades del menú</legend>
            <div className="cms-hero-position-fields cms-hero-position-fields--menu">
              <ColorPickerField
                label="Color del menú y logo"
                value={navColor}
                help="Aplica al logo, texto, iconos y separadores del menú del hero."
                onChange={(heroMenuColor) => onChange({ heroMenuColor, heroMenuTone: heroMenuColor.toLowerCase() === "#ffffff" ? "light" : "dark" })}
              />
              <TextField
                label="Menú inicial Y"
                value={heroText(details, keys.menuY)}
                help="También define cuándo aparece la barra secundaria en este dispositivo."
                onChange={(event) => onChange({ [keys.menuY]: event.target.value } as Partial<CmsHeroSettings>)}
              />
              {device === "desktop" ? (
                <div className="cms-hero-menu-scale">
                  <div className="cms-hero-menu-scale__head">
                    <FieldLabel>Escala del menú en computadora</FieldLabel>
                    <span>{(details.heroMenuScale ?? 1).toFixed(2)}x</span>
                  </div>
                  <input type="range" min="0.75" max="1.4" step="0.05" value={details.heroMenuScale ?? 1} onChange={(event) => onChange({ heroMenuScale: Number(event.target.value) })} />
                  <p>Esta escala solo se aplica al menú expandido de escritorio.</p>
                </div>
              ) : (
                <p className="cms-hero-mobile-menu-note">
                  En tablet y teléfono el hero usa logo a la izquierda y menú de hamburguesa a la derecha; la escala no aplica para estos dispositivos.
                </p>
              )}
            </div>
          </fieldset>
        </div>

        <div className="cms-hero-position-preview" aria-label="Vista de referencia del hero">
          <div className="relative mx-auto overflow-hidden rounded-xl border border-outline-variant shadow-sm" style={frameStyle}>
            {device === "desktop" ? (
              <>
                <span
                  className="absolute z-20 h-12 -translate-x-1/2"
                  style={{ ...logoMask, left: heroText(details, keys.logoX), top: heroText(details, keys.logoY), width: heroText(details, keys.logoWidth) }}
                />
                <nav className="absolute left-1/2 z-20 flex whitespace-nowrap text-[12px] font-bold" style={menuStyle} aria-label="Vista previa menú">
                  <ul className="flex list-none items-center gap-4 p-0">
                    {["Inicio", "Clases", "Workshops", "Experiencias", "Gift Cards", "El Estudio", "Shop"].map((item) => <li key={item}>{item}</li>)}
                  </ul>
                </nav>
              </>
            ) : (
              <div className="absolute inset-x-4 top-4 z-20 flex items-center justify-between" style={{ color: navColor }}>
                <span className="block h-12 w-[104px]" style={logoMask} />
                <span className="grid h-11 w-11 place-items-center rounded-full border border-current/30">
                  <span className="material-symbols-outlined text-[22px]">menu</span>
                </span>
              </div>
            )}
            <div className="absolute inset-x-8 top-1/2 z-10 -translate-y-1/2">
              {details.heroVariant === "presentation" ? (
                <div className={`cms-hero-presentation-preview cms-hero-presentation-preview--${device}`}>
                  <div className="page-hero__presentation-text" style={{ color: details.heroPresentationTextColor || "#FFFFFF" }}>
                    <MarkdownContent source={details.heroPresentationText || details.heroTitle || titleFallback} className="cms-hero-presentation-preview__copy" />
                  </div>
                  {details.heroPresentationImage ? (
                    <div className="cms-hero-presentation-preview__image">
                      <Image src={details.heroPresentationImage} alt={details.heroTitle || titleFallback} fill sizes="320px" className="object-contain" unoptimized />
                    </div>
                  ) : null}
                </div>
              ) : details.heroVariant === "image" ? (
                <div className="relative mx-auto aspect-[3.35/1] w-[min(82%,700px)]">
                  {details.titleImage ? <Image src={details.titleImage} alt="" fill sizes="700px" className="object-contain opacity-80" unoptimized /> : null}
                  {details.titleImageSecondary ? <Image src={details.titleImageSecondary} alt="" fill sizes="700px" className="object-contain" unoptimized /> : null}
                </div>
              ) : (
                <div className="text-center">
                  <h3 className="font-serif text-[clamp(30px,4vw,54px)] uppercase leading-none text-[#5b554f]">{details.heroTitle || titleFallback}</h3>
                  <p className="mt-4 text-label-md uppercase text-[#a99b90]">{details.heroSubtitle || subtitleFallback}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
