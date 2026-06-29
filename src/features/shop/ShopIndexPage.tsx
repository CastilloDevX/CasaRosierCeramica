import { HeaderInterno } from "@/components/layout/HeaderInterno";
import { ShopGrid } from "@/components/shop/ShopGrid";
import { SitePage } from "@/features/shared/layout/SitePage";

export function ShopIndexPage() {
  return (
    <SitePage bodyClass="shop-page" header={<HeaderInterno />}>
      <ShopGrid />
    </SitePage>
  );
}
