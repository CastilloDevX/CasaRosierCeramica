import AdminShell from "@/components/admin/AdminShell";
import SectionEmptyState from "@/components/admin/SectionEmptyState";
import TrashTable from "@/components/admin/TrashTable";
import { getOfferings } from "@/lib/cms/offerings";
import { getMediaAssets } from "@/lib/cms/media";
import { getHeaders } from "@/lib/cms/headers";
import { getMenus } from "@/lib/cms/menus";
import { getPages } from "@/lib/cms/pages";
import { getSocialGalleries } from "@/lib/cms/social-galleries";
import { getTestimonials } from "@/lib/cms/testimonials";
import { getFooters } from "@/lib/cms/footers";
import { getPromoBanners } from "@/lib/cms/promo-banners";
import { getFaqs } from "@/lib/cms/faqs";
import { getTeachers } from "@/lib/cms/teachers";
import { getLandingPages } from "@/lib/cms/landing-pages";
import { getReservations } from "@/lib/cms/reservations";
import { getForms } from "@/lib/cms/forms";
import { getFormSubmissions } from "@/lib/cms/form-submissions";
import { getBlogPosts } from "@/lib/cms/blog";
import { getProducts } from "@/lib/cms/products";
import { getCategories } from "@/lib/cms/product-categories";
import { getOrders } from "@/lib/cms/orders";
import { getCoupons } from "@/lib/cms/coupons";
import { getShippingMethods } from "@/lib/cms/shipping";
import { getRedirects } from "@/lib/cms/redirects";
import { getTrashItems } from "@/lib/cms/trash";
import type { TrashItem } from "@/lib/cms/types";

export default async function TrashPage() {
  const [trashItems, offerings, mediaAssets, headers, menus, pages, socialGalleries, testimonials, footers, promoBanners, faqs, teachers, landingPages, reservations, forms, formSubmissions, blogPosts, products, productCategories, orders, coupons, shippingMethods, redirects] = await Promise.all([
    getTrashItems(),
    getOfferings(),
    getMediaAssets(),
    getHeaders(),
    getMenus(),
    getPages(),
    getSocialGalleries(),
    getTestimonials(),
    getFooters(),
    getPromoBanners(),
    getFaqs(),
    getTeachers(),
    getLandingPages(),
    getReservations(),
    getForms(),
    getFormSubmissions(),
    getBlogPosts(),
    getProducts(),
    getCategories(),
    getOrders(),
    getCoupons(),
    getShippingMethods(),
    getRedirects(),
  ]);

  const offeringFallbacks: TrashItem[] = offerings
    .filter((item) => item.status === "deleted" || item.deleted_at)
    .filter((item) => !trashItems.some((t) => t.entity_id === item.id))
    .map((item) => ({
      id: item.id,
      entity_type: "offering",
      entity_id: item.id,
      title: item.title,
      deleted_by: "local-admin",
      deleted_at: item.deleted_at || item.updated_at,
      restore_data: item,
    }));

  const mediaFallbacks: TrashItem[] = mediaAssets
    .filter((item) => item.status === "deleted" || item.deleted_at)
    .filter((item) => !trashItems.some((t) => t.entity_id === item.id))
    .map((item) => ({
      id: item.id,
      entity_type: "media",
      entity_id: item.id,
      title: item.original_name || item.file_name,
      deleted_by: "local-admin",
      deleted_at: item.deleted_at || item.updated_at,
      restore_data: item,
    }));

  const headerFallbacks: TrashItem[] = headers
    .filter((item) => item.status === "deleted" || item.deleted_at)
    .filter((item) => !trashItems.some((t) => t.entity_id === item.id))
    .map((item) => ({
      id: item.id,
      entity_type: "header",
      entity_id: item.id,
      title: item.name,
      deleted_by: "local-admin",
      deleted_at: item.deleted_at || item.updated_at,
      restore_data: item,
    }));

  const menuFallbacks: TrashItem[] = menus
    .filter((item) => item.status === "deleted" || item.deleted_at)
    .filter((item) => !trashItems.some((t) => t.entity_id === item.id))
    .map((item) => ({
      id: item.id,
      entity_type: "menu",
      entity_id: item.id,
      title: item.name,
      deleted_by: "local-admin",
      deleted_at: item.deleted_at || item.updated_at,
      restore_data: item,
    }));

  const pageFallbacks: TrashItem[] = pages
    .filter((item) => item.status === "deleted" || item.deleted_at)
    .filter((item) => !trashItems.some((t) => t.entity_id === item.id))
    .map((item) => ({
      id: item.id,
      entity_type: "page",
      entity_id: item.id,
      title: item.title,
      deleted_by: "local-admin",
      deleted_at: item.deleted_at || item.updated_at,
      restore_data: item,
    }));

  function makeFallback<T extends { id: string; status?: string; deleted_at?: string | null; updated_at: string }>(items: T[], entityType: string, getTitle: (i: T) => string): TrashItem[] {
    return items.filter((i) => i.status === "deleted" || i.deleted_at).filter((i) => !trashItems.some((t) => t.entity_id === i.id)).map((i) => ({ id: i.id, entity_type: entityType, entity_id: i.id, title: getTitle(i), deleted_by: "local-admin", deleted_at: i.deleted_at || i.updated_at, restore_data: i }));
  }

  const items = [
    ...trashItems, ...offeringFallbacks, ...mediaFallbacks, ...headerFallbacks, ...menuFallbacks, ...pageFallbacks,
    ...makeFallback(socialGalleries, "social_gallery", (i) => i.name),
    ...makeFallback(testimonials, "testimonial", (i) => i.name),
    ...makeFallback(footers, "footer", (i) => i.name),
    ...makeFallback(promoBanners, "promo_banner", (i) => i.title),
    ...makeFallback(faqs, "faq", (i) => i.question),
    ...makeFallback(teachers, "teacher", (i) => i.name),
    ...makeFallback(landingPages, "landing_page", (i) => i.title),
    ...makeFallback(reservations, "reservation", (i) => `${i.customer_name} — ${i.date}`),
    ...makeFallback(forms, "form", (i) => i.name),
    ...makeFallback(formSubmissions, "form_submission", (i) => `${i.name} — ${i.subject || i.form_name}`),
    ...makeFallback(blogPosts, "blog_post", (i) => i.title),
    ...makeFallback(products, "product", (i) => i.name),
    ...makeFallback(productCategories, "product_category", (i) => i.name),
    ...makeFallback(orders, "order", (i) => `${i.customer_name} — ${i.id.slice(0, 8)}`),
    ...makeFallback(coupons, "coupon", (i) => i.code),
    ...makeFallback(shippingMethods, "shipping_method", (i) => i.name),
    ...makeFallback(redirects, "redirect", (i) => `${i.source_url} → ${i.target_url}`),
  ];

  return (
    <AdminShell>
      <div className="section-head">
        <div>
          <p className="auth-kicker">CMS</p>
          <h2>Papelera</h2>
        </div>
      </div>

      {items.length ? (
        <TrashTable items={items} />
      ) : (
        <SectionEmptyState title="Papelera vacía" description="No hay contenidos eliminados por ahora." />
      )}
    </AdminShell>
  );
}
