import AdminShell from "@/components/admin/AdminShell";
import ShopPageEditor from "@/components/admin/ShopPageEditor";
import { getPublicNavigationItems } from "@/lib/cms/navigation-public";
import { getCategories } from "@/lib/cms/product-categories";
import { getProducts } from "@/lib/cms/products";
import { getSettings } from "@/lib/cms/settings";
import { getShopPageSettings } from "@/lib/cms/shop-page";
import { getPublicShopData } from "@/lib/cms/shop-public";

export default async function ShopPage() {
  const [page, products, categories, shopData, navigationItems, settings] = await Promise.all([
    getShopPageSettings(),
    getProducts(),
    getCategories(),
    getPublicShopData(),
    getPublicNavigationItems("main"),
    getSettings(),
  ]);
  const activeProducts = products.filter((product) => product.status !== "deleted");

  return (
    <AdminShell>
      <ShopPageEditor
        page={page}
        products={activeProducts}
        categories={categories}
        published={shopData.published}
        shopCategories={shopData.shopCategories}
        navigationItems={navigationItems}
        menuSettings={settings.menu}
      />
    </AdminShell>
  );
}
