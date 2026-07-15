import { HeaderInterno } from "@/components/layout/HeaderInterno";
import { ShopGrid } from "@/components/shop/ShopGrid";
import { IdeaPromptSection } from "@/features/shared/contextual-sections/IdeaPromptSection";
import { SitePage } from "@/features/shared/layout/SitePage";
import { getShopPageSettings } from "@/lib/cms/shop-page";
import { getPublicShopData } from "@/lib/cms/shop-public";

export async function ShopIndexPage() {
  const [{ published, shopCategories }, page] = await Promise.all([
    getPublicShopData(),
    getShopPageSettings(),
  ]);
  const hero = page.hero;
  const heroVariant = hero.heroVariant ?? "text";
  const isImageLikeHero = heroVariant === "image" || heroVariant === "presentation";

  return (
    <SitePage
      bodyClass="shop-page"
      header={(
        <HeaderInterno
          image={hero.heroImage || "/img/social-2.jpg"}
          variant={heroVariant}
          hero={hero}
          height={isImageLikeHero ? "large" : "medium"}
          eyebrow={hero.heroSubtitle}
          title={hero.heroTitle || "Shop"}
          overlayTitle={isImageLikeHero}
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
          heroTitleImageScale={hero.titleImageScale}
          heroTitleImageScaleTablet={hero.titleImageScaleTablet}
          heroTitleImageScaleMobile={hero.titleImageScaleMobile}
          heroTitleImagePositionX={hero.titleImagePositionX}
          heroTitleImagePositionY={hero.titleImagePositionY}
          heroTitleImagePositionXTablet={hero.titleImagePositionXTablet}
          heroTitleImagePositionYTablet={hero.titleImagePositionYTablet}
          heroTitleImagePositionXMobile={hero.titleImagePositionXMobile}
          heroTitleImagePositionYMobile={hero.titleImagePositionYMobile}
          heroTitleImageSecondaryScale={hero.titleImageSecondaryScale}
          heroTitleImageSecondaryScaleTablet={hero.titleImageSecondaryScaleTablet}
          heroTitleImageSecondaryScaleMobile={hero.titleImageSecondaryScaleMobile}
          heroTitleImageSecondaryPositionX={hero.titleImageSecondaryPositionX}
          heroTitleImageSecondaryPositionY={hero.titleImageSecondaryPositionY}
          heroTitleImageSecondaryPositionXTablet={hero.titleImageSecondaryPositionXTablet}
          heroTitleImageSecondaryPositionYTablet={hero.titleImageSecondaryPositionYTablet}
          heroTitleImageSecondaryPositionXMobile={hero.titleImageSecondaryPositionXMobile}
          heroTitleImageSecondaryPositionYMobile={hero.titleImageSecondaryPositionYMobile}
          heroTitlePositionY={hero.heroTitlePositionY}
          heroTitlePositionYTablet={hero.heroTitlePositionYTablet}
          heroTitlePositionYMobile={hero.heroTitlePositionYMobile}
          heroTitleScale={hero.heroTitleScale}
          heroTitleScaleTablet={hero.heroTitleScaleTablet}
          heroTitleScaleMobile={hero.heroTitleScaleMobile}
          presentationTextPositionX={hero.presentationTextPositionX}
          presentationTextPositionY={hero.presentationTextPositionY}
          presentationTextPositionXTablet={hero.presentationTextPositionXTablet}
          presentationTextPositionYTablet={hero.presentationTextPositionYTablet}
          presentationTextPositionXMobile={hero.presentationTextPositionXMobile}
          presentationTextPositionYMobile={hero.presentationTextPositionYMobile}
          presentationTextScale={hero.presentationTextScale}
          presentationTextScaleTablet={hero.presentationTextScaleTablet}
          presentationTextScaleMobile={hero.presentationTextScaleMobile}
          presentationImagePositionX={hero.presentationImagePositionX}
          presentationImagePositionY={hero.presentationImagePositionY}
          presentationImagePositionXTablet={hero.presentationImagePositionXTablet}
          presentationImagePositionYTablet={hero.presentationImagePositionYTablet}
          presentationImagePositionXMobile={hero.presentationImagePositionXMobile}
          presentationImagePositionYMobile={hero.presentationImagePositionYMobile}
          presentationImageScale={hero.presentationImageScale}
          presentationImageScaleTablet={hero.presentationImageScaleTablet}
          presentationImageScaleMobile={hero.presentationImageScaleMobile}
        />
      )}
    >
      <ShopGrid published={published} shopCategories={shopCategories} />
      {page.showSocialGallerySection ? <IdeaPromptSection context="shop" /> : null}
    </SitePage>
  );
}
