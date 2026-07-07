export type ExperienceKind =
  | "class"
  | "workshop"
  | "gift-card"
  | "private-booking";

export interface PriceOption {
  label: string;
  price: string;
}

export interface ScheduleItem {
  day: string;
  slots: string[];
}

export interface ProgramItem {
  title: string;
  content: string;
  points?: string[];
}

export interface ExperienceItem {
  id: string;
  kind: ExperienceKind;
  slug: string;
  title: string;
  subtitle: string;
  category: string;
  excerpt: string;
  description: string[];
  coverImage: string;
  heroImage: string;
  heroVariant?: "image" | "text" | "presentation";
  heroMenuTone?: "light" | "dark";
  heroMenuColor?: string;
  heroMenuScale?: number;
  heroLogoPositionX?: string;
  heroLogoPositionY?: string;
  heroLogoWidth?: string;
  heroLogoTabletPositionX?: string;
  heroLogoTabletPositionY?: string;
  heroLogoTabletWidth?: string;
  heroLogoMobilePositionX?: string;
  heroLogoMobilePositionY?: string;
  heroLogoMobileWidth?: string;
  heroMenuPositionY?: string;
  heroMenuTabletPositionY?: string;
  heroMenuMobilePositionY?: string;
  heroTitleImage?: string;
  heroTitleImageSecondary?: string;
  heroPresentationText?: string;
  heroPresentationTextColor?: string;
  heroPresentationImage?: string;
  heroTitle: string;
  listingTitle: string;
  listingSubtitle: string;
  introHighlight: string;
  galleryImages: string[];
  videoCardImage: string;
  videoCardLabel: string;
  giftCardTypeLabel?: string;
  giftCardTypeOptions?: string[];
  priceOptions: PriceOption[];
  duration: string;
  schedule: ScheduleItem[];
  included: string[];
  program: ProgramItem[];
  programSectionTitle?: string;
  learningSectionTitle?: string;
  whatYouWillLearn: string[];
  participationSectionTitle?: string;
  whoCanJoin: string[];
  paymentMethods: string[];
  additionalInfo: string;
  showIdeaPromptSection?: boolean;
  ctaHref: string;
  ctaConsultHref: string;
  ctaEnrollHref: string;
  seoTitle: string;
  seoDescription: string;
  isPublished: boolean;
  isFeatured?: boolean;
  order: number;
}

export type ClassItem = ExperienceItem & { kind: "class" };
export type WorkshopItem = ExperienceItem & { kind: "workshop" };
export type GiftCardItem = ExperienceItem & { kind: "gift-card" };
export type PrivateExperienceItem = ExperienceItem & {
  kind: "private-booking";
};

export interface ShopCategory {
  key: string;
  label: string;
}

export interface ShopItem {
  id: string;
  slug: string;
  name: string;
  category: string;
  categoryLabel: string;
  price: string;
  availability: string;
  image: string;
  gallery: string[];
  description: string;
  details: Record<string, string>;
  availabilityNote: string;
  seoTitle: string;
  seoDescription: string;
  order: number;
  isPublished: boolean;
}

export type BlogContentBlock =
  | { type: "paragraph"; content: string }
  | { type: "heading"; level: 2 | 3; content: string }
  | { type: "quote"; content: string }
  | {
      type: "image";
      src: string;
      alt?: string;
      caption?: string;
    }
  | { type: "list"; items: string[] }
  | {
      type: "gallery";
      images: Array<{ src: string; alt?: string }>;
    }
  | { type: "cta"; text: string; href: string };

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  coverImage: string;
  category: string;
  tags: string[];
  author: string;
  authorInitial: string;
  status: "published" | "draft";
  isFeatured: boolean;
  featuredOrder?: number;
  featuredImage?: string;
  featuredExcerpt?: string;
  featuredOnHome: boolean;
  visibleInListing: boolean;
  manualOrder: number;
  publishedAt: string;
  seoTitle: string;
  seoDescription: string;
  hero?: {
    heroVariant: "image" | "text" | "presentation";
    heroTitle: string;
    heroSubtitle: string;
    heroPresentationText: string;
    heroPresentationTextColor: string;
    heroPresentationImage: string;
    heroMenuTone: "light" | "dark";
    heroMenuColor: string;
    heroMenuScale: number;
    heroLogoPositionX: string;
    heroLogoPositionY: string;
    heroLogoWidth: string;
    heroLogoTabletPositionX: string;
    heroLogoTabletPositionY: string;
    heroLogoTabletWidth: string;
    heroLogoMobilePositionX: string;
    heroLogoMobilePositionY: string;
    heroLogoMobileWidth: string;
    heroMenuPositionY: string;
    heroMenuTabletPositionY: string;
    heroMenuMobilePositionY: string;
    heroImage: string;
    titleImage: string;
    titleImageSecondary: string;
  };
  contentBlocks: BlogContentBlock[];
}

export type BlogPostStatus = BlogPost["status"];

export interface NavigationItem {
  label: string;
  href: string;
  order: number;
  visible: boolean;
  target?: string;
  children?: NavigationItem[];
}

export interface CartSummaryRow {
  label: string;
  value: string;
}

export interface CartItem {
  cartItemId: string;
  productId: string;
  slug: string;
  kind: ExperienceKind | string;
  title: string;
  subtitle?: string;
  price?: string;
  quantity: number;
  giftCardType?: string;
  orderSummary?: CartSummaryRow[];
  addedAt: string;
}
