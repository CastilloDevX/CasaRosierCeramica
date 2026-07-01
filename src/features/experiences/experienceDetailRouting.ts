import type { Metadata } from "next";
import type { ExperienceItem, ExperienceKind } from "@/data/types";
import { getOfferings } from "@/lib/cms/offerings";
import type { ClassOfferingDetails, Offering } from "@/lib/cms/types";

type LegacyProgramItem = {
  title?: unknown;
  content?: unknown;
  description?: unknown;
  points?: unknown;
};

type LegacyOfferingDetails = Partial<ClassOfferingDetails> & {
  class?: Partial<ClassOfferingDetails>;
  category?: unknown;
  introHighlight?: unknown;
  videoCardImage?: unknown;
  videoCardLabel?: unknown;
  included?: unknown;
  program?: unknown;
  whatYouWillLearn?: unknown;
  whoCanJoin?: unknown;
  paymentMethods?: unknown;
  additionalInfo?: unknown;
  ctaHref?: unknown;
  giftCardTypeLabel?: unknown;
  giftCardTypeOptions?: unknown;
};

function stringValue(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function splitParagraphs(value: unknown) {
  if (Array.isArray(value)) return value.map((item) => String(item).trim()).filter(Boolean);
  return stringValue(value)
    .split(/\n{2,}|\r?\n/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function splitList(value: unknown) {
  if (Array.isArray(value)) return value.map((item) => String(item).trim()).filter(Boolean);
  return stringValue(value)
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

function ctaHref(details: LegacyOfferingDetails) {
  const configuredHref = stringValue(details.ctaHref);
  if (configuredHref) return configuredHref;
  const whatsapp = details.whatsappNumber || details.content?.contactWhatsapp || "34633788860";
  return `https://wa.me/${whatsapp}`;
}

function hasDetailValue(value: unknown): boolean {
  if (Array.isArray(value)) return value.length > 0;
  if (typeof value === "string") return value.trim().length > 0;
  if (value && typeof value === "object") {
    return Object.values(value as Record<string, unknown>).some(hasDetailValue);
  }
  return value !== null && value !== undefined;
}

function populatedDetails(value: Partial<ClassOfferingDetails>) {
  return Object.fromEntries(
    Object.entries(value).filter(([, entry]) => hasDetailValue(entry))
  ) as Partial<ClassOfferingDetails>;
}

function detailsForOffering(offering: Offering): LegacyOfferingDetails {
  const rootDetails = offering.details as LegacyOfferingDetails;
  return {
    ...rootDetails,
    ...(rootDetails.class ? populatedDetails(rootDetails.class) : {}),
  };
}

function scheduleForOffering(offering: Offering, details: LegacyOfferingDetails) {
  if (details.showScheduleOnFrontend === false) return [];

  if (details.scheduleDays?.length) {
    return details.scheduleDays
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
      .map((item) => ({
        day: item.title || item.date || "Disponible",
        slots: [item.startTime && item.endTime ? `${item.startTime} a ${item.endTime}` : item.description || "Consultar disponibilidad"].filter(Boolean),
      }));
  }

  return offering.schedule.map((item) => {
    const [day, ...slotParts] = item.split(":");
    const slots = slotParts.join(":").split(",").map((slot) => slot.trim()).filter(Boolean);
    return {
      day: day?.trim() || "Disponible",
      slots: slots.length ? slots : ["Consultar disponibilidad"],
    };
  });
}

function programForDetails(content: Partial<ClassOfferingDetails["content"]>, details: LegacyOfferingDetails) {
  if (content.modules?.length) {
    return content.modules
      .sort((a, b) => a.order - b.order)
      .map((item) => ({ title: item.title, content: item.description }));
  }

  if (!Array.isArray(details.program)) return [];

  return details.program
    .map((item, index) => {
      const programItem = item as LegacyProgramItem;
      const title = stringValue(programItem.title);
      const contentValue = stringValue(programItem.content) || stringValue(programItem.description);
      return {
        title: title || `Modulo ${index + 1}`,
        content: contentValue,
        points: splitList(programItem.points),
      };
    })
    .filter((item) => item.title || item.content || item.points?.length);
}

function cmsOfferingToExperienceItem(offering: Offering): ExperienceItem {
  const details = detailsForOffering(offering);
  const content = { ...details.content };
  const galleryImages = (details.galleryImages?.length ? details.galleryImages : offering.gallery.map((image, order) => ({ image, alt: "", order })))
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
    .map((item) => item.image)
    .filter(Boolean);
  const priceOptions = (details.pricing?.length ? details.pricing : offering.price !== null ? [{ description: "Precio base", price: offering.price, order: 0 }] : [])
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
    .map((item) => ({ label: item.description || "Precio", price: formatPrice(item.price) }));
  const schedule = scheduleForOffering(offering, details);

  return {
    id: offering.id,
    kind: kindFromOffering(offering.type),
    slug: offering.slug,
    title: offering.title,
    subtitle: offering.subtitle || offering.title,
    category: details.heroSubtitle || stringValue(details.category) || offering.type,
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
    introHighlight: details.highlightDescription || stringValue(details.introHighlight) || offering.excerpt,
    galleryImages: galleryImages.length ? galleryImages : [offering.cover_image_url || details.heroImage || "img/hero-bg.jpg"],
    videoCardImage: details.videoPoster || stringValue(details.videoCardImage) || galleryImages[0] || offering.cover_image_url || "img/hero-bg.jpg",
    videoCardLabel: details.videoUrl ? "VIDEO" : stringValue(details.videoCardLabel) || "IMAGEN",
    giftCardTypeLabel: stringValue(details.giftCardTypeLabel) || undefined,
    giftCardTypeOptions: splitList(details.giftCardTypeOptions),
    priceOptions,
    duration: details.durationText || offering.duration,
    schedule,
    included: details.includedItems?.length ? details.includedItems : splitList(details.included),
    program: programForDetails(content, details),
    whatYouWillLearn: splitParagraphs(content.learningContent || details.whatYouWillLearn),
    whoCanJoin: splitParagraphs(content.participationContent || details.whoCanJoin),
    paymentMethods: splitList(content.paymentMethods || details.paymentMethods),
    additionalInfo: content.extraInfo || stringValue(details.additionalInfo) || `Cualquier consulta o información adicional que necesites, puedes escribir al WhatsApp ${details.whatsappNumber || content.contactWhatsapp || "633788860"}.`,
    showIdeaPromptSection: details.showIdeaPromptSection ?? true,
    ctaHref: ctaHref(details),
    seoTitle: offering.seo_title || `${offering.title} | Casa Rosier`,
    seoDescription: offering.seo_description || offering.excerpt,
    isPublished: offering.status === "published",
    order: 0,
  };
}

export async function getPublicExperienceItems() {
  const offerings = await getOfferings();
  return offerings
    .filter((item) => item.status === "published")
    .map(cmsOfferingToExperienceItem);
}

async function bySlug(slug: string) {
  return (await getPublicExperienceItems()).find((item) => item.slug === slug) ?? null;
}

export async function generateExperienceStaticParams(kind: ExperienceKind) {
  const cmsItems = await getPublicExperienceItems();
  return cmsItems.filter((item) => item.kind === kind).map((item) => ({ slug: item.slug }));
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
