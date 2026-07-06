import { HeaderInterno } from "@/components/layout/HeaderInterno";
import { ShopGrid } from "@/components/shop/ShopGrid";
import { SitePage } from "@/features/shared/layout/SitePage";
import { getShopPageSettings } from "@/lib/cms/shop-page";
import { getPublicShopData } from "@/lib/cms/shop-public";

export async function ShopIndexPage() {
  const [{ published, shopCategories }, page] = await Promise.all([
    getPublicShopData(),
    getShopPageSettings(),
  ]);
  const hero = page.hero;

  return (
    <SitePage
      bodyClass="shop-page"
      header={(
        <HeaderInterno
          image={hero.heroImage || "/img/social-2.jpg"}
          variant={hero.heroVariant}
          eyebrow={hero.heroSubtitle}
          title={hero.heroTitle || "Shop"}
          heroMenuTone={hero.heroMenuTone}
          heroMenuColor={hero.heroMenuColor}
          heroMenuScale={hero.heroMenuScale}
          heroLogoPositionX={hero.heroLogoPositionX}
          heroLogoPositionY={hero.heroLogoPositionY}
          heroLogoWidth={hero.heroLogoWidth}
          heroLogoTabletPositionX={hero.heroLogoTabletPositionX}
          heroLogoTabletPositionY={hero.heroLogoTabletPositionY}
          heroLogoTabletWidth={hero.heroLogoTabletWidth}
          heroLogoMobilePositionX={hero.heroLogoMobilePositionX}
          heroLogoMobilePositionY={hero.heroLogoMobilePositionY}
          heroLogoMobileWidth={hero.heroLogoMobileWidth}
          heroMenuPositionY={hero.heroMenuPositionY}
          heroMenuTabletPositionY={hero.heroMenuTabletPositionY}
          heroMenuMobilePositionY={hero.heroMenuMobilePositionY}
        />
      )}
    >
      <ShopGrid published={published} shopCategories={shopCategories} />
    </SitePage>
  );
}
