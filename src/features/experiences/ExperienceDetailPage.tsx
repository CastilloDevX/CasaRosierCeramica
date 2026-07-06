import Image from "next/image";
import { DetailPage } from "@/components/collections/DetailPage";
import { HeaderInterno } from "@/components/layout/HeaderInterno";
import { MarkdownContent } from "@/components/ui/MarkdownContent";
import type { ExperienceItem } from "@/data/types";
import { IdeaPromptSection } from "@/features/shared/contextual-sections/IdeaPromptSection";
import { SitePage } from "@/features/shared/layout/SitePage";

export function ExperienceDetailPage({ item }: { item: ExperienceItem }) {
  const promoPage =
    item.kind === "private-booking" ? undefined : item.kind.replace("-card", "");

  return (
    <SitePage
      bodyClass="class-detail-page"
      bodyData={promoPage ? { promoPage } : undefined}
      header={
        <HeaderInterno
          variant={item.heroVariant ?? "text"}
          image={item.heroImage}
          eyebrow={item.category}
          title={item.heroVariant === "image" || item.heroVariant === "presentation" ? undefined : item.heroTitle}
          overlayTitle={item.heroVariant === "image" || item.heroVariant === "presentation"}
          heroMenuTone={item.heroMenuTone}
          heroMenuColor={item.heroMenuColor}
          heroMenuScale={item.heroMenuScale}
          heroLogoPositionX={item.heroLogoPositionX}
          heroLogoPositionY={item.heroLogoPositionY}
          heroLogoWidth={item.heroLogoWidth}
          heroLogoTabletPositionX={item.heroLogoTabletPositionX}
          heroLogoTabletPositionY={item.heroLogoTabletPositionY}
          heroLogoTabletWidth={item.heroLogoTabletWidth}
          heroLogoMobilePositionX={item.heroLogoMobilePositionX}
          heroLogoMobilePositionY={item.heroLogoMobilePositionY}
          heroLogoMobileWidth={item.heroLogoMobileWidth}
          heroMenuPositionY={item.heroMenuPositionY}
          heroMenuTabletPositionY={item.heroMenuTabletPositionY}
          heroMenuMobilePositionY={item.heroMenuMobilePositionY}
        >
          {item.heroVariant === "presentation" ? (
            <div className="page-hero__presentation">
              <div className="page-hero__presentation-text" style={{ color: item.heroPresentationTextColor || "#FFFFFF" }}>
                <MarkdownContent
                  source={item.heroPresentationText || item.heroTitle || item.title}
                  className="page-hero__presentation-copy"
                />
              </div>
              {item.heroPresentationImage ? (
                <div className="page-hero__presentation-image">
                  <Image src={item.heroPresentationImage} alt={item.heroTitle || item.title} fill sizes="420px" className="object-contain" unoptimized />
                </div>
              ) : null}
            </div>
          ) : item.heroVariant === "image" ? (
            <div className="page-hero__script-stack">
              {item.heroTitleImage ? (
                <Image src={item.heroTitleImage} alt={item.heroTitle || item.title} fill sizes="520px" className="page-hero__script-image page-hero__script-image--back" unoptimized />
              ) : null}
              {item.heroTitleImageSecondary ? (
                <Image src={item.heroTitleImageSecondary} alt={item.heroTitle || item.title} fill sizes="520px" className="page-hero__script-image page-hero__script-image--front" unoptimized />
              ) : null}
            </div>
          ) : undefined}
        </HeaderInterno>
      }
    >
      <DetailPage item={item} />
      {item.showIdeaPromptSection ?? true ? <IdeaPromptSection context="experience-detail" /> : null}
    </SitePage>
  );
}
