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
          image={item.heroImage}
          eyebrow={item.category}
          title={item.heroTitle}
        />
      }
    >
      <DetailPage item={item} />
      <IdeaPromptSection context="experience-detail" />
    </SitePage>
  );
}
