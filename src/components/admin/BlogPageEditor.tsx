"use client";

import Image from "next/image";
import { useState } from "react";
import Link from "@/components/admin/AdminLink";
import { BlogGrid } from "@/components/blog/BlogGrid";
import { FeaturedCarousel } from "@/components/blog/FeaturedCarousel";
import { SocialGallery } from "@/components/home/SocialGallery";
import { MarkdownContent } from "@/components/ui/MarkdownContent";
import Switch from "@/components/ui/Switch";
import type { BlogPost as PublicBlogPost, NavigationItem } from "@/data/types";
import { getIdeaPromptContent } from "@/features/shared/contextual-sections/ideaPromptContent";
import { normalizeHeroSettings } from "@/lib/cms/hero-settings";
import type { SiteSettings } from "@/lib/cms/settings";
import type { BlogPageSettings, BlogPost, CmsHeroSettings, SocialGallery as CmsSocialGallery } from "@/lib/cms/types";
import AdminActionModal from "./AdminActionModal";
import BlogTable from "./BlogTable";
import CmsPublicHeroPreview from "./CmsPublicHeroPreview";
import SharedHeroEditor from "./SharedHeroEditor";

type TabKey = "hero" | "posts" | "additions" | "preview";

const tabs: Array<{ key: TabKey; label: string }> = [
  { key: "hero", label: "Hero" },
  { key: "posts", label: "Bitácoras" },
  { key: "additions", label: "Adiciones" },
  { key: "preview", label: "Vista previa" },
];

function cmsPostToPublic(post: BlogPost): PublicBlogPost {
  const publishedAt = post.published_at || post.updated_at || post.created_at;
  return {
    id: post.id,
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt,
    coverImage: post.featured_image_id || post.seo_image || "/img/social-2.jpg",
    category: post.category || "Procesos",
    tags: post.tags ?? [],
    author: post.author_id || "Casa Rosier",
    authorInitial: "C",
    status: post.status === "published" ? "published" : "draft",
    isFeatured: Boolean(post.is_featured),
    featuredOrder: post.featured_order,
    featuredImage: post.featured_image_id || post.seo_image || undefined,
    featuredExcerpt: post.featured_excerpt || post.excerpt,
    featuredOnHome: false,
    visibleInListing: post.visible_in_listing !== false,
    manualOrder: post.sort_order ?? 0,
    publishedAt,
    seoTitle: post.seo_title || post.title,
    seoDescription: post.seo_description || post.excerpt,
    hero: post.hero,
    contentBlocks: [],
  };
}

function BlogHeroPreviewContent({ hero }: { hero: CmsHeroSettings }) {
  const variant = hero.heroVariant ?? "text";

  if (variant === "presentation") {
    return (
      <div className="page-hero__presentation">
        <div className="page-hero__presentation-text" style={{ color: hero.heroPresentationTextColor || "#FFFFFF" }}>
          <MarkdownContent source={hero.heroPresentationText || hero.heroTitle || "Bitacora ceramica"} className="page-hero__presentation-copy" />
        </div>
        {hero.heroPresentationImage ? (
          <div className="page-hero__presentation-image">
            <Image src={hero.heroPresentationImage} alt={hero.heroTitle || "Bitacora ceramica"} fill sizes="420px" className="object-contain" unoptimized />
          </div>
        ) : null}
      </div>
    );
  }

  if (variant === "image") {
    return (
      <div className="page-hero__script-stack">
        {hero.titleImage ? (
          <Image src={hero.titleImage} alt={hero.heroTitle || "Bitacora ceramica"} fill sizes="520px" className="page-hero__script-image page-hero__script-image--back" unoptimized />
        ) : null}
        {hero.titleImageSecondary ? (
          <Image src={hero.titleImageSecondary} alt={hero.heroTitle || "Bitacora ceramica"} fill sizes="520px" className="page-hero__script-image page-hero__script-image--front" unoptimized />
        ) : null}
      </div>
    );
  }

  return (
    <div>
      <h1 className="page-hero__title">{hero.heroTitle || "Bitacora ceramica"}</h1>
      {hero.heroSubtitle ? <p className="page-hero__eyebrow">{hero.heroSubtitle}</p> : null}
    </div>
  );
}

export default function BlogPageEditor({
  page,
  posts,
  navigationItems,
  menuSettings,
  socialGallery,
}: {
  page: BlogPageSettings;
  posts: BlogPost[];
  navigationItems: NavigationItem[];
  menuSettings: SiteSettings["menu"];
  socialGallery: CmsSocialGallery | null;
}) {
  const [tab, setTab] = useState<TabKey>("hero");
  const [status, setStatus] = useState(page.status);
  const [hero, setHero] = useState(() => normalizeHeroSettings(page.hero, {
    heroTitle: "Bitacora ceramica",
    heroSubtitle: "Casa Rosier",
  }));
  const [showIdeaPromptSection, setShowIdeaPromptSection] = useState(page.showIdeaPromptSection);
  const [seoTitle] = useState(page.seo_title);
  const [seoDescription] = useState(page.seo_description);
  const [seoImage] = useState(page.seo_image);
  const [isLoading, setIsLoading] = useState(false);
  const [modal, setModal] = useState<{ type: "success" | "error"; title: string; message?: string } | null>(null);

  const visiblePosts = posts
    .filter((post) => post.status !== "deleted")
    .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0) || +new Date(b.updated_at) - +new Date(a.updated_at));
  const publishedPosts = visiblePosts.filter((post) => post.status === "published");
  const featuredPosts = publishedPosts.filter((post) => post.is_featured);
  const socialGalleryProps = getBlogSocialGalleryProps(socialGallery);

  async function save(nextStatus = status) {
    setIsLoading(true);
    setModal(null);

    const response = await fetch("/api/admin/blog-page", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        status: nextStatus,
        hero,
        showIdeaPromptSection,
        seo_title: seoTitle,
        seo_description: seoDescription,
        seo_image: seoImage,
      }),
    });

    if (!response.ok) {
      const data = await response.json().catch(() => ({})) as { error?: string };
      setModal({ type: "error", title: "No se pudo guardar", message: data.error || "Intenta de nuevo." });
      setIsLoading(false);
      return;
    }

    setStatus(nextStatus);
    setModal({
      type: "success",
      title: nextStatus === "published" ? "Página publicada" : "Borrador guardado",
      message: "Los cambios de la página de Bitácora se guardaron correctamente.",
    });
    setIsLoading(false);
  }

  return (
    <div className="cms-editor-shell">
      <AdminActionModal
        open={Boolean(modal)}
        type={modal?.type}
        title={modal?.title ?? ""}
        message={modal?.message}
        confirmLabel="Entendido"
        onClose={() => setModal(null)}
      />

      <header className="cms-page-editor-head">
        <div className="cms-page-editor-head__main">
          <h1>Bitácora</h1>
          <p>Edición personalizada de página de blog</p>
          <div className="cms-page-editor-meta" aria-label="Resumen de página">
            <span className={`status-pill status-pill--${status}`}>{status}</span>
            <span>{publishedPosts.length} artículos publicados</span>
            <span>{featuredPosts.length} destacados</span>
            <span>{showIdeaPromptSection ? "Idea activa" : "Idea oculta"}</span>
          </div>
        </div>
        <div className="cms-page-editor-actions">
          <Link className="secondary-btn" href="/admin">Volver</Link>
          <button type="button" className="secondary-btn cms-outline-accent" onClick={() => save("draft")} disabled={isLoading}>
            {isLoading ? "Guardando..." : "Borrador"}
          </button>
          <button type="button" className="primary-btn" onClick={() => save("published")} disabled={isLoading}>
            {isLoading ? "Publicando..." : "Publicar"}
          </button>
        </div>
      </header>

      <nav className="cms-editor-tabs" aria-label="Secciones del editor de Bitácora">
        {tabs.map((item) => (
          <button type="button" key={item.key} className={tab === item.key ? "is-active" : ""} onClick={() => setTab(item.key)}>
            {item.label}
          </button>
        ))}
      </nav>

      <div className="cms-editor-main">
        {tab === "hero" ? (
          <SharedHeroEditor
            details={hero}
            titleFallback="Bitacora ceramica"
            subtitleFallback="Casa Rosier"
            onChange={(next) => setHero((current) => ({ ...current, ...next }))}
          />
        ) : null}

        {tab === "posts" ? (
          <section className="form-block cms-editor-card">
            <div className="cms-editor-card__head">
              <div>
                <p className="auth-kicker">Paso 2</p>
                <h3>Bitácoras</h3>
              </div>
              <Link className="primary-btn" href="/admin/bitacora/new">Crear bitácora</Link>
            </div>
            {visiblePosts.length ? <BlogTable items={visiblePosts} showDuplicate={false} showArchive={false} /> : (
              <div className="empty-inline">
                <strong>Aún no hay artículos.</strong>
                <span>Crea la primera entrada de la bitácora.</span>
              </div>
            )}
          </section>
        ) : null}

        {tab === "additions" ? (
          <div className="cms-studio-additions">
            <section className="form-block cms-editor-card cms-studio-additions__card">
              <div className="cms-studio-additions__head">
                <h3>Adiciones</h3>
                <p>Activa bloques complementarios que se muestran al final de la página, antes del footer.</p>
              </div>
              <div className="cms-studio-additions__toggle-row">
                <Switch
                  checked={showIdeaPromptSection}
                  onCheckedChange={setShowIdeaPromptSection}
                  label="Incluir galería social al final de la página"
                  description="Muestra la sección “Y tu, cuando tuviste tu última idea?” con la galería social pública antes del footer."
                />
              </div>
            </section>

            <section className="form-block cms-editor-card cms-studio-additions__card">
              <div className="cms-studio-additions__head">
                <h3>Vista del componente</h3>
                <p>Referencia real de la sección que se insertará al final de la página pública.</p>
              </div>
              <div className="cms-studio-additions__preview" aria-label="Vista previa de la galería social">
                {showIdeaPromptSection ? (
                  <SocialGallery {...socialGalleryProps} />
                ) : (
                  <div className="empty-inline">
                    <strong>Galería desactivada.</strong>
                    <span>Activa la adición para ver el componente público.</span>
                  </div>
                )}
              </div>
            </section>
          </div>
        ) : null}

        {tab === "preview" ? (
          <BlogPagePreview
            hero={hero}
            posts={publishedPosts}
            showIdeaPromptSection={showIdeaPromptSection}
            navigationItems={navigationItems}
            menuSettings={menuSettings}
            socialGallery={socialGallery}
          />
        ) : null}
      </div>

      <div className="admin-sticky-actionbar">
        <span className="admin-sticky-actionbar__meta">{publishedPosts.length} artículos publicados · {featuredPosts.length} destacados · {showIdeaPromptSection ? "Idea activa" : "Idea oculta"}</span>
        <button type="button" className="secondary-btn" onClick={() => setTab("preview")}>Vista previa</button>
        <button type="button" className="secondary-btn" onClick={() => save("draft")} disabled={isLoading}>{isLoading ? "Guardando..." : "Borrador"}</button>
        <button type="button" className="primary-btn" onClick={() => save("published")} disabled={isLoading}>{isLoading ? "Publicando..." : "Publicar"}</button>
      </div>
    </div>
  );
}

function BlogPagePreview({
  hero,
  posts,
  showIdeaPromptSection,
  navigationItems,
  menuSettings,
  socialGallery,
}: {
  hero: CmsHeroSettings;
  posts: BlogPost[];
  showIdeaPromptSection: boolean;
  navigationItems: NavigationItem[];
  menuSettings: SiteSettings["menu"];
  socialGallery: CmsSocialGallery | null;
}) {
  const publicPosts = posts.map(cmsPostToPublic).sort((a, b) => +new Date(b.publishedAt) - +new Date(a.publishedAt) || a.manualOrder - b.manualOrder);
  const visiblePosts = publicPosts.filter((post) => post.visibleInListing !== false);
  const featuredPosts = publicPosts
    .filter((post) => post.isFeatured)
    .sort((a, b) => (a.featuredOrder ?? 999) - (b.featuredOrder ?? 999) || +new Date(b.publishedAt) - +new Date(a.publishedAt));
  const categories = Array.from(new Set(visiblePosts.map((post) => post.category)));
  const socialGalleryProps = getBlogSocialGalleryProps(socialGallery);

  return (
    <div className="cms-preview-frame">
      <div className="cms-public-preview__toolbar">
        Vista previa de escritorio · Publicado
      </div>
      <div className="cms-public-preview blog-page">
        <div className="cms-public-preview__scale">
          <CmsPublicHeroPreview
            hero={hero}
            navigationItems={navigationItems}
            menuSettings={menuSettings}
            height="large"
            className="blog-hero"
          >
            <BlogHeroPreviewContent hero={hero} />
          </CmsPublicHeroPreview>
          <section className="blog-intro section">
            <div className="container blog-intro__container">
              <h2>Bitacora ceramica</h2>
              <p>
                Un espacio para compartir procesos, tecnicas, reflexiones y pequenas historias alrededor de la ceramica contemporanea, el taller y la creacion con las manos.
              </p>
            </div>
          </section>
          <section className="blog-featured section">
            <div className="container blog-featured__container">
              <h2 className="blog-featured__title">Destacados</h2>
              <FeaturedCarousel posts={featuredPosts} />
            </div>
          </section>
          <section className="blog-listing section">
            <div className="container blog-listing__container">
              <BlogGrid posts={visiblePosts} categories={categories} />
            </div>
          </section>
          {showIdeaPromptSection ? <SocialGallery {...socialGalleryProps} /> : null}
        </div>
      </div>
    </div>
  );
}

function getBlogSocialGalleryProps(gallery: CmsSocialGallery | null) {
  const fallback = getIdeaPromptContent("blog");
  const posts = gallery?.items
    .filter((item) => item.is_visible !== false && item.image_url)
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((item) => ({
      image: item.image_url,
      title: item.title,
      body: item.description,
      instagramUrl: item.instagram_url,
    }));

  return {
    id: fallback.id,
    title: gallery?.title || fallback.title,
    subtitle: gallery?.description || fallback.subtitle,
    posts: posts?.length ? posts : fallback.posts,
    ariaLabel: fallback.ariaLabel,
    sourceHref: gallery?.cta_url || fallback.sourceHref,
  };
}
