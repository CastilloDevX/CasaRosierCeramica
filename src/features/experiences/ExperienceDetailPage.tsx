import Image from "next/image";
import { DetailPage } from "@/components/collections/DetailPage";
import { HeaderInterno } from "@/components/layout/HeaderInterno";
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
          title={item.heroTitle}
          overlayTitle={item.heroVariant === "image"}
          heroMenuTone={item.heroMenuTone}
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
          {item.heroVariant === "image" ? (
            <div className="page-hero__script-stack">
              {item.heroTitleImage ? (
                <Image src={item.heroTitleImage} alt={item.heroTitle || item.title} fill sizes="520px" className="page-hero__script-image page-hero__script-image--back" unoptimized />
              ) : (
                <span className="page-hero__script-fallback page-hero__script-fallback--back">Casa Rosier</span>
              )}
              {item.heroTitleImageSecondary ? (
                <Image src={item.heroTitleImageSecondary} alt={item.heroTitle || item.title} fill sizes="520px" className="page-hero__script-image page-hero__script-image--front" unoptimized />
              ) : (
                <span className="page-hero__script-fallback page-hero__script-fallback--front">{item.heroTitle || item.title}</span>
              )}
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
