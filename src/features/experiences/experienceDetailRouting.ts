import type { Metadata } from "next";
import {
  bySlug as staticBySlug,
  classes,
  giftCards,
  privateExperiences,
  workshops
} from "@/data/classes";
import type { ExperienceItem, ExperienceKind } from "@/data/types";
import { getOfferings } from "@/lib/cms/offerings";
import type { ClassOfferingDetails, Offering } from "@/lib/cms/types";

const itemsByKind = {
  class: classes,
  workshop: workshops,
  "private-booking": privateExperiences,
  "gift-card": giftCards
} satisfies Record<ExperienceKind, readonly ExperienceItem[]>;

function splitParagraphs(value: string) {
  return value
    .split(/\n{2,}|\r?\n/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function splitList(value: string) {
  return value
    .split(/\r?\n|,/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function kindFromOffering(type: Offering["type"]): ExperienceKind {
  if (type === "workshop") return "workshop";
  if (type === "gift_card") return "gift-card";
  if (type === "experience") return "private-booking";
  return "class";
}

function formatPrice(value: number | null) {
  return value === null ? "" : `${value} EUR`;
}

function ctaHref(details: Partial<ClassOfferingDetails>) {
  const whatsapp = details.whatsappNumber || details.content?.contactWhatsapp || "34633788860";
  return `https://wa.me/${whatsapp}`;
}

function cmsOfferingToExperienceItem(offering: Offering): ExperienceItem {
  const details = offering.details.class ?? {};
  const content = { ...details.content };
  const galleryImages = (details.galleryImages?.length ? details.galleryImages : offering.gallery.map((image, order) => ({ image, alt: "", order })))
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
    .map((item) => item.image)
    .filter(Boolean);
  const priceOptions = (details.pricing?.length ? details.pricing : offering.price !== null ? [{ description: "Precio base", price: offering.price, order: 0 }] : [])
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
    .map((item) => ({ label: item.description || "Precio", price: formatPrice(item.price) }));
  const schedule = details.showScheduleOnFrontend === false
    ? []
    : (details.scheduleDays ?? [])
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
      .map((item) => ({
        day: item.title || item.date || "Disponible",
        slots: [item.startTime && item.endTime ? `${item.startTime} a ${item.endTime}` : item.description || "Consultar disponibilidad"].filter(Boolean),
      }));

  return {
    id: offering.id,
    kind: kindFromOffering(offering.type),
    slug: offering.slug,
    title: offering.title,
    subtitle: offering.subtitle || offering.title,
    category: details.heroSubtitle || offering.type,
    excerpt: offering.excerpt,
    description: splitParagraphs(offering.description),
    coverImage: offering.cover_image_url || galleryImages[0] || details.heroImage || "img/hero-bg.jpg",
    heroImage: details.heroImage || offering.cover_image_url || "img/hero-bg.jpg",
    heroVariant: details.heroVariant ?? "text",
    heroMenuTone: details.heroMenuTone ?? (details.heroVariant === "image" ? "light" : "dark"),
    heroTitleImage: details.titleImage,
    heroTitleImageSecondary: details.titleImageSecondary,
    heroTitle: details.heroTitle || offering.title,
    listingTitle: offering.title,
    listingSubtitle: details.heroSubtitle || "",
    introHighlight: details.highlightDescription || offering.excerpt,
    galleryImages: galleryImages.length ? galleryImages : [offering.cover_image_url || details.heroImage || "img/hero-bg.jpg"],
    videoCardImage: details.videoPoster || galleryImages[0] || offering.cover_image_url || "img/hero-bg.jpg",
    videoCardLabel: details.videoUrl ? "VIDEO" : "IMAGEN",
    priceOptions,
    duration: details.durationText || offering.duration,
    schedule,
    included: details.includedItems?.length ? details.includedItems : [],
    program: (content.modules ?? []).sort((a, b) => a.order - b.order).map((item) => ({ title: item.title, content: item.description })),
    whatYouWillLearn: splitParagraphs(content.learningContent ?? ""),
    whoCanJoin: splitParagraphs(content.participationContent ?? ""),
    paymentMethods: splitList(content.paymentMethods ?? ""),
    additionalInfo: content.extraInfo || `Cualquier consulta o información adicional que necesites, puedes escribir al WhatsApp ${details.whatsappNumber || content.contactWhatsapp || "633788860"}.`,
    showIdeaPromptSection: details.showIdeaPromptSection ?? true,
    ctaHref: ctaHref(details),
    seoTitle: offering.seo_title || `${offering.title} | Casa Rosier`,
    seoDescription: offering.seo_description || offering.excerpt,
    isPublished: offering.status === "published",
    order: 0,
  };
}

async function getCmsItems() {
  const offerings = await getOfferings();
  return offerings
    .filter((item) => item.status === "published")
    .map(cmsOfferingToExperienceItem);
}

async function bySlug(slug: string) {
  const cmsItem = (await getCmsItems()).find((item) => item.slug === slug);
  return cmsItem ?? staticBySlug(slug);
}

export async function generateExperienceStaticParams(kind: ExperienceKind) {
  const cmsItems = await getCmsItems();
  const slugs = new Set([
    ...itemsByKind[kind].map((item) => item.slug),
    ...cmsItems.filter((item) => item.kind === kind).map((item) => item.slug),
  ]);
  return Array.from(slugs).map((slug) => ({ slug }));
}

export async function generateExperienceMetadata(
  params: Promise<{ slug: string }>
): Promise<Metadata> {
  const item = await bySlug((await params).slug);
  return item
    ? {
        title: { absolute: item.seoTitle },
        description: item.seoDescription
      }
    : {};
}

export async function getExperienceRouteItem(
  params: Promise<{ slug: string }>,
  kind: ExperienceKind
) {
  const item = await bySlug((await params).slug);
  return item?.kind === kind ? item : null;
}
