import { HeaderInterno } from "@/components/layout/HeaderInterno";
import { ShopGrid } from "@/components/shop/ShopGrid";
import { SitePage } from "@/features/shared/layout/SitePage";
import { getPublicShopData } from "@/lib/cms/shop-public";

export async function ShopIndexPage() {
  const { published, shopCategories } = await getPublicShopData();

  return (
    <SitePage bodyClass="shop-page" header={<HeaderInterno />}>
      <ShopGrid published={published} shopCategories={shopCategories} />
    </SitePage>
  );
}
