import type { CmsHeroSettings } from "./types";

export const DEFAULT_HERO_IMAGE = "/img/hero-bg.jpg";

export const defaultHeroSettings: CmsHeroSettings = {
  heroVariant: "text",
  heroTitle: "",
  heroSubtitle: "",
  heroPresentationText: "",
  heroPresentationTextColor: "#FFFFFF",
  heroPresentationImage: "",
  heroMenuTone: "dark",
  heroMenuColor: "#3f3933",
  heroMenuScale: 1,
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
  heroImage: DEFAULT_HERO_IMAGE,
  titleImage: "",
  titleImageSecondary: "",
};

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

export function normalizeHeroSettings(input: unknown, fallback?: Partial<CmsHeroSettings>): CmsHeroSettings {
  const source = input && typeof input === "object" ? input as Partial<CmsHeroSettings> : {};
  const merged = { ...defaultHeroSettings, ...fallback, ...source };
  const heroVariant = merged.heroVariant === "image" || merged.heroVariant === "presentation" || merged.heroVariant === "text"
    ? merged.heroVariant
    : "text";
  const heroMenuTone = merged.heroMenuTone === "light" || merged.heroMenuTone === "dark"
    ? merged.heroMenuTone
    : heroVariant === "image" || heroVariant === "presentation" ? "light" : "dark";

  return {
    ...defaultHeroSettings,
    ...merged,
    heroVariant,
    heroTitle: firstText(merged.heroTitle, fallback?.heroTitle),
    heroSubtitle: firstText(merged.heroSubtitle, fallback?.heroSubtitle),
    heroPresentationText: firstText(merged.heroPresentationText),
    heroPresentationTextColor: firstText(merged.heroPresentationTextColor, defaultHeroSettings.heroPresentationTextColor),
    heroPresentationImage: firstText(merged.heroPresentationImage),
    heroMenuTone,
    heroMenuColor: firstText(
      merged.heroMenuColor,
      heroMenuTone === "light" ? "#ffffff" : "#3f3933",
    ),
    heroMenuScale: typeof merged.heroMenuScale === "number" ? merged.heroMenuScale : Number(merged.heroMenuScale) || 1,
    heroLogoPositionX: firstText(merged.heroLogoPositionX, defaultHeroSettings.heroLogoPositionX),
    heroLogoPositionY: firstText(merged.heroLogoPositionY, defaultHeroSettings.heroLogoPositionY),
    heroLogoWidth: firstText(merged.heroLogoWidth, defaultHeroSettings.heroLogoWidth),
    heroLogoTabletPositionX: firstText(merged.heroLogoTabletPositionX, merged.heroLogoPositionX, defaultHeroSettings.heroLogoTabletPositionX),
    heroLogoTabletPositionY: firstText(merged.heroLogoTabletPositionY, merged.heroLogoPositionY, defaultHeroSettings.heroLogoTabletPositionY),
    heroLogoTabletWidth: firstText(merged.heroLogoTabletWidth, merged.heroLogoWidth, defaultHeroSettings.heroLogoTabletWidth),
    heroLogoMobilePositionX: firstText(merged.heroLogoMobilePositionX, merged.heroLogoPositionX, defaultHeroSettings.heroLogoMobilePositionX),
    heroLogoMobilePositionY: firstText(merged.heroLogoMobilePositionY, defaultHeroSettings.heroLogoMobilePositionY),
    heroLogoMobileWidth: firstText(merged.heroLogoMobileWidth, defaultHeroSettings.heroLogoMobileWidth),
    heroMenuPositionY: firstText(merged.heroMenuPositionY, defaultHeroSettings.heroMenuPositionY),
    heroMenuTabletPositionY: firstText(merged.heroMenuTabletPositionY, merged.heroMenuPositionY, defaultHeroSettings.heroMenuTabletPositionY),
    heroMenuMobilePositionY: firstText(merged.heroMenuMobilePositionY, defaultHeroSettings.heroMenuMobilePositionY),
    heroImage: firstText(merged.heroImage, defaultHeroSettings.heroImage),
    titleImage: firstText(merged.titleImage),
    titleImageSecondary: firstText(merged.titleImageSecondary),
  };
}
