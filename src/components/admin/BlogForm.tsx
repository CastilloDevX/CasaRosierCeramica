"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import type { BlogPost, BlogPostBlock, BlogPostBlockType, BlogPostStatus } from "@/lib/cms/types";
import { BLOG_BLOCK_TYPES } from "@/lib/cms/types";
import { assetPath, internalHref } from "@/lib/assets";
import MediaSelectField from "./MediaSelectField";

type StepKey = "structure" | "preview";

const categoryOptions = ["Procesos", "Esmaltes", "Taller"] as const;
const blockLabels: Record<string, string> = {
  text: "Texto",
  heading: "Subtítulo",
  image: "Imagen",
  quote: "Frase destacada",
  gallery: "Galería",
  list: "Lista",
  video: "Video",
  cta: "CTA",
  faq: "FAQ",
  custom_html: "HTML",
};
const blockTypes = BLOG_BLOCK_TYPES.filter((type) =>
  ["text", "heading", "image", "quote", "list", "cta"].includes(type),
);

function newBlock(type: BlogPostBlockType, index: number): BlogPostBlock {
  const now = new Date().toISOString();
  return {
    id: `new_${Date.now()}_${index}`,
    type,
    title: "",
    text: "",
    image_id: "",
    source_url: "",
    is_visible: true,
    sort_order: index,
    custom_html: type === "heading" ? "3" : "",
    created_at: now,
    updated_at: now,
  };
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
}

function textParagraphs(value: string) {
  return value.split(/\n{2,}/).map((part) => part.trim()).filter(Boolean);
}

function FieldLabel({ children, required = false }: { children: string; required?: boolean }) {
  return (
    <label className="text-label-md font-bold uppercase tracking-wide text-on-surface-variant">
      {children}{required ? " *" : ""}
    </label>
  );
}

function TextField({
  label,
  help,
  required,
  error,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & { label: string; help?: string; required?: boolean; error?: string }) {
  return (
    <div className="space-y-1.5">
      <FieldLabel required={required}>{label}</FieldLabel>
      <input
        {...props}
        className={`block min-h-11 w-full rounded-xl border bg-surface-container-lowest px-4 py-3 text-body-md text-on-surface transition-colors placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-2 focus:ring-secondary-container ${
          error ? "border-error" : "border-outline-variant"
        } ${props.className ?? ""}`}
      />
      {help && !error ? <p className="text-label-md text-on-surface-variant/70">{help}</p> : null}
      {error ? <p className="text-label-md text-error">{error}</p> : null}
    </div>
  );
}

function TextAreaField({
  label,
  help,
  required,
  error,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string; help?: string; required?: boolean; error?: string }) {
  return (
    <div className="space-y-1.5">
      <FieldLabel required={required}>{label}</FieldLabel>
      <textarea
        {...props}
        className={`block min-h-[112px] w-full rounded-xl border bg-surface-container-lowest px-4 py-3 text-body-md text-on-surface transition-colors placeholder:text-on-surface-variant/50 focus:outline-none focus:ring-2 focus:ring-secondary-container ${
          error ? "border-error" : "border-outline-variant"
        } ${props.className ?? ""}`}
      />
      {help && !error ? <p className="text-label-md text-on-surface-variant/70">{help}</p> : null}
      {error ? <p className="text-label-md text-error">{error}</p> : null}
    </div>
  );
}

function SelectField({
  label,
  children,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement> & { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <FieldLabel>{label}</FieldLabel>
      <select
        {...props}
        className="block min-h-11 w-full rounded-xl border border-outline-variant bg-surface-container-lowest px-4 py-3 text-body-md text-on-surface transition-colors focus:outline-none focus:ring-2 focus:ring-secondary-container"
      >
        {children}
      </select>
    </div>
  );
}

function SwitchField({
  checked,
  onChange,
  label,
  description,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
  description?: string;
}) {
  return (
    <label className="flex min-h-16 cursor-pointer items-center justify-between gap-4 rounded-xl border border-outline-variant bg-surface-container-lowest px-4 py-3">
      <span>
        <span className="block text-label-lg font-bold text-on-surface">{label}</span>
        {description ? <span className="mt-1 block text-label-md text-on-surface-variant">{description}</span> : null}
      </span>
      <input className="h-5 w-5 accent-[#674bb5]" type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} />
    </label>
  );
}

function ArticlePreview({
  title,
  excerpt,
  cover,
  blocks,
}: {
  title: string;
  excerpt: string;
  cover: string;
  blocks: BlogPostBlock[];
}) {
  const visibleBlocks = blocks.filter((block) => block.is_visible !== false);
  return (
    <div className="overflow-hidden rounded-2xl border border-outline-variant bg-[#fbfaf6] text-[#4b443d] shadow-sm">
      <div className="border-b border-outline-variant bg-surface-container-low px-4 py-2 text-label-md font-semibold text-on-surface-variant">
        Vista previa de artículo
      </div>
      <div className="mx-auto max-w-[1040px] px-8 py-12">
        <header className="mx-auto mb-8 max-w-[760px] text-center">
          <h1 className="font-serif text-[clamp(34px,4vw,46px)] leading-none text-[#4a443e]">
            {title || "Título de la bitácora"}
          </h1>
          <p className="mt-5 text-left font-sans text-[17px] leading-7 text-[#716960]">
            {excerpt || "Texto introductorio de la bitácora."}
          </p>
        </header>
        <figure className="mx-auto mb-8 max-w-[760px] overflow-hidden bg-[#eee8e2]">
          {cover ? (
            <Image src={assetPath(cover)} alt={title || "Imagen principal"} width={680} height={560} className="aspect-[1.2/1] w-full object-cover" unoptimized />
          ) : (
            <div className="grid aspect-[1.2/1] place-items-center text-sm text-[#7b7066]">Imagen principal</div>
          )}
        </figure>
        <article className="mx-auto max-w-[760px]">
          {visibleBlocks.map((block, index) => {
            if (block.type === "quote") {
              return <blockquote className="my-7 font-serif text-[clamp(28px,3vw,36px)] italic leading-tight text-[#9b7053]" key={block.id}><p>{block.text || "Frase destacada"}</p></blockquote>;
            }
            if (block.type === "heading") {
              const Tag = block.custom_html === "2" ? "h2" : "h3";
              return <Tag className="mb-2 mt-5 font-sans text-[17px] font-semibold leading-7 text-[#625b54]" key={block.id}>{block.title || "Subtítulo"}</Tag>;
            }
            if (block.type === "image") {
              const next = visibleBlocks[index + 1];
              const prev = visibleBlocks[index - 1];
              const isGalleryImage = next?.type === "image" || prev?.type === "image";
              if (prev?.type === "image") return null;
              const images = [block, ...visibleBlocks.slice(index + 1).filter((item, i) => i < 1 && item.type === "image")];
              if (isGalleryImage) {
                return (
                  <div className="my-8 grid grid-cols-2 gap-0" key={block.id}>
                    {images.map((image) => (
                      <figure key={image.id} className="overflow-hidden bg-[#eee8e2]">
                        {image.image_id ? <Image src={assetPath(image.image_id)} alt={image.title || ""} width={360} height={420} className="aspect-[.86/1] w-full object-cover" unoptimized /> : null}
                      </figure>
                    ))}
                  </div>
                );
              }
              return (
                <figure className="my-8 overflow-hidden bg-[#eee8e2]" key={block.id}>
                  {block.image_id ? <Image src={assetPath(block.image_id)} alt={block.title || ""} width={680} height={560} className="aspect-[1.2/1] w-full object-cover" unoptimized /> : null}
                </figure>
              );
            }
            if (block.type === "list") {
              return <ul className="mb-5 list-disc pl-5 font-sans text-[17px] leading-7 text-[#625b54]" key={block.id}>{block.text.split("\n").filter(Boolean).map((item) => <li key={item}>{item.replace(/^[-*\d.]+\s*/, "")}</li>)}</ul>;
            }
            if (block.type === "cta") {
              return <div className="my-6 text-center" key={block.id}><Link className="blog-post__button" href={internalHref(block.source_url || "/clases")}>{block.title || "Ver clases"}</Link></div>;
            }
            return textParagraphs(block.text).map((paragraph) => (
              <p className="mb-5 font-sans text-[17px] leading-7 text-[#625b54]" key={`${block.id}-${paragraph.slice(0, 18)}`}>{paragraph}</p>
            ));
          })}
          {!visibleBlocks.length ? <p className="font-sans text-[17px] leading-7 text-[#625b54]">Agrega bloques de contenido para ver la estructura del artículo.</p> : null}
        </article>
      </div>
    </div>
  );
}

export default function BlogForm({ mode, item }: { mode: "create" | "edit"; item?: BlogPost }) {
  const router = useRouter();
  const itemCategory = item?.category ?? "Procesos";
  const hasKnownCategory = categoryOptions.includes(itemCategory as (typeof categoryOptions)[number]);
  const [step, setStep] = useState<StepKey>("structure");
  const [title, setTitle] = useState(item?.title ?? "");
  const [slug, setSlug] = useState(item?.slug ?? "");
  const [status, setStatus] = useState<BlogPostStatus>(item?.status ?? "draft");
  const [excerpt, setExcerpt] = useState(item?.excerpt ?? "");
  const [featuredImageId, setFeaturedImageId] = useState(item?.featured_image_id ?? "");
  const [categoryMode, setCategoryMode] = useState(hasKnownCategory ? itemCategory : "custom");
  const [customCategory, setCustomCategory] = useState(hasKnownCategory ? "" : itemCategory);
  const [isFeatured, setIsFeatured] = useState(item?.is_featured ?? false);
  const [featuredOrder, setFeaturedOrder] = useState(item?.featured_order ?? 0);
  const [featuredExcerpt, setFeaturedExcerpt] = useState(item?.featured_excerpt ?? "");
  const [visibleInListing, setVisibleInListing] = useState(item?.visible_in_listing ?? true);
  const [sortOrder, setSortOrder] = useState(item?.sort_order ?? 0);
  const [tagsInput, setTagsInput] = useState(item?.tags?.join(", ") ?? "");
  const [seoTitle, setSeoTitle] = useState(item?.seo_title ?? "");
  const [seoDescription, setSeoDescription] = useState(item?.seo_description ?? "");
  const [seoImage, setSeoImage] = useState(item?.seo_image ?? "");
  const [blocks, setBlocks] = useState<BlogPostBlock[]>(item?.blocks ?? []);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const readingTime = useMemo(
    () => Math.max(1, Math.ceil(blocks.map((block) => [block.title, block.text].join(" ")).join(" ").split(/\s+/).filter(Boolean).length / 200)),
    [blocks],
  );
  const editorTitle = title.trim() || (mode === "create" ? "Nuevo artículo" : item?.title || "Bitácora");
  const visibleBlockCount = blocks.filter((block) => block.is_visible).length;

  function addBlock(type: BlogPostBlockType = "text") {
    setBlocks((current) => [...current, newBlock(type, current.length)]);
  }

  function updateBlock(idx: number, key: keyof BlogPostBlock, value: BlogPostBlock[keyof BlogPostBlock]) {
    const copy = [...blocks];
    copy[idx] = { ...copy[idx], [key]: value };
    setBlocks(copy);
  }

  function removeBlock(idx: number) {
    setBlocks(blocks.filter((_, i) => i !== idx));
  }

  function duplicateBlock(idx: number) {
    const copy = { ...blocks[idx], id: `new_${Date.now()}_${idx}` };
    setBlocks([...blocks.slice(0, idx + 1), copy, ...blocks.slice(idx + 1)]);
  }

  function moveBlock(idx: number, dir: "up" | "down") {
    if ((dir === "up" && idx === 0) || (dir === "down" && idx === blocks.length - 1)) return;
    const next = [...blocks];
    const target = dir === "up" ? idx - 1 : idx + 1;
    [next[idx], next[target]] = [next[target], next[idx]];
    setBlocks(next);
  }

  async function save(nextStatus = status) {
    setIsLoading(true);
    setError(null);

    if (!title.trim()) {
      setError("El título es obligatorio.");
      setIsLoading(false);
      setStep("structure");
      return;
    }

    const category = categoryMode === "custom" ? customCategory.trim() : categoryMode;
    const tags = tagsInput.split(",").map((tag) => tag.trim()).filter(Boolean);
    const res = await fetch(mode === "create" ? "/api/admin/bitacora" : `/api/admin/bitacora/${item?.id}`, {
      method: mode === "create" ? "POST" : "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        slug,
        status: nextStatus,
        excerpt,
        content: "",
        featured_image_id: featuredImageId,
        author_id: "Casa Rosier",
        category: category || "Procesos",
        tags,
        is_featured: isFeatured,
        featured_order: featuredOrder,
        featured_excerpt: featuredExcerpt,
        visible_in_listing: visibleInListing,
        sort_order: sortOrder,
        seo_title: seoTitle,
        seo_description: seoDescription,
        seo_image: seoImage,
        blocks: blocks.map((block, i) => ({ ...block, sort_order: i })),
      }),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({ error: "Error" }));
      setError((data as { error?: string }).error || "No se pudo guardar la bitácora.");
      setIsLoading(false);
      return;
    }

    router.push("/admin/bitacora");
    router.refresh();
  }

  return (
    <div className="cms-editor-shell">
      <header className="cms-page-editor-head">
        <div className="cms-page-editor-head__main">
          <h1>{editorTitle}</h1>
          <p>Edición personalizada de página de bitácora</p>
          <div className="cms-page-editor-meta" aria-label="Resumen del artículo">
            <span className={`status-pill status-pill--${status}`}>{status}</span>
            <span>{readingTime} min de lectura</span>
            <span>{visibleBlockCount} bloques visibles</span>
          </div>
        </div>
        <div className="cms-page-editor-actions">
          <Link className="secondary-btn" href="/admin/bitacora">Volver</Link>
          <button type="button" className="secondary-btn cms-outline-accent" onClick={() => save("draft")} disabled={isLoading}>
            {isLoading ? "Guardando..." : "Guardar boceto"}
          </button>
          <button type="button" className="primary-btn" onClick={() => save("published")} disabled={isLoading}>
            {isLoading ? "Publicando..." : "Publicar"}
          </button>
        </div>
      </header>

      <nav className="cms-editor-tabs" aria-label="Secciones del editor">
        <button type="button" className={step === "structure" ? "is-active" : ""} onClick={() => setStep("structure")}>
          Estructura
        </button>
        <button type="button" className={step === "preview" ? "is-active" : ""} onClick={() => setStep("preview")}>
          Vista previa
        </button>
      </nav>

      {error ? <p className="form-error cms-editor-error" role="alert">{error}</p> : null}

      <div className="cms-editor-main">
        {step === "structure" ? (
          <div className="space-y-6">
            <section className="form-block cms-editor-card">
              <div className="cms-editor-card__head">
                <div>
                  <p className="auth-kicker">Paso 1</p>
                  <h3>Presentación del artículo</h3>
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <TextField label="Título" required value={title} onChange={(event) => setTitle(event.target.value)} onBlur={() => { if (!slug.trim()) setSlug(slugify(title)); }} />
                <TextField label="Slug" value={slug} help="Se genera automáticamente si lo dejas vacío." onChange={(event) => setSlug(slugify(event.target.value))} />
                <TextAreaField label="Texto introductorio" required value={excerpt} onChange={(event) => setExcerpt(event.target.value)} className="md:col-span-2" />
                <SelectField label="Estado" value={status} onChange={(event) => setStatus(event.target.value as BlogPostStatus)}>
                  <option value="draft">Borrador</option>
                  <option value="published">Publicado</option>
                  <option value="archived">Archivado</option>
                </SelectField>
                <SelectField label="Tipo" value={categoryMode} onChange={(event) => setCategoryMode(event.target.value)}>
                  {categoryOptions.map((category) => <option key={category} value={category}>{category}</option>)}
                  <option value="custom">Nuevo tipo</option>
                </SelectField>
                {categoryMode === "custom" ? <TextField label="Nuevo tipo" value={customCategory} onChange={(event) => setCustomCategory(event.target.value)} /> : null}
                <TextField label="Orden" type="number" value={sortOrder} onChange={(event) => setSortOrder(Number(event.target.value))} />
                <TextField label="Tags" value={tagsInput} placeholder="cerámica, proceso, taller" onChange={(event) => setTagsInput(event.target.value)} className="md:col-span-2" />
                <div className="md:col-span-2">
                  <MediaSelectField label="Imagen principal" value={featuredImageId} onChange={setFeaturedImageId} />
                </div>
                <SwitchField checked={visibleInListing} onChange={setVisibleInListing} label="Visible en listado" description="Controla si aparece en el grid principal de /blog." />
              </div>
            </section>

            <section className="form-block cms-editor-card">
              <div className="cms-editor-card__head">
                <div>
                  <p className="auth-kicker">Destacados</p>
                  <h3>Componente superior de /blog</h3>
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <SwitchField checked={isFeatured} onChange={setIsFeatured} label="Mostrar en destacados" description="Aparecerá en el carrusel de destacados." />
                <TextField label="Orden destacado" type="number" value={featuredOrder} onChange={(event) => setFeaturedOrder(Number(event.target.value))} />
                <TextAreaField label="Texto para destacado" value={featuredExcerpt} onChange={(event) => setFeaturedExcerpt(event.target.value)} placeholder={excerpt} className="md:col-span-2" />
              </div>
            </section>

            <section className="form-block cms-editor-card">
              <div className="cms-editor-card__head">
                <div>
                  <p className="auth-kicker">Cuerpo</p>
                  <h3>Bloques de contenido</h3>
                </div>
                <div className="row-actions">
                  {blockTypes.map((type) => (
                    <button key={type} type="button" className="secondary-btn" onClick={() => addBlock(type)}>{blockLabels[type]}</button>
                  ))}
                </div>
              </div>
              <div className="space-y-4">
                {blocks.length === 0 ? (
                  <div className="empty-inline">
                    <strong>No hay bloques todavía.</strong>
                    <span>Agrega texto, subtítulos, frases o imágenes para construir la página.</span>
                  </div>
                ) : blocks.map((block, idx) => (
                  <article key={block.id} className="cms-block-card">
                    <header className="cms-block-card__head">
                      <div>
                        <span className="entity-badge">{blockLabels[block.type]}</span>
                        <strong>{block.title || block.text.slice(0, 70) || `Bloque ${idx + 1}`}</strong>
                      </div>
                      <div className="row-actions">
                        <button type="button" className="secondary-btn icon-btn" onClick={() => moveBlock(idx, "up")} disabled={idx === 0} aria-label="Subir bloque"><span className="material-symbols-outlined">arrow_upward</span></button>
                        <button type="button" className="secondary-btn icon-btn" onClick={() => moveBlock(idx, "down")} disabled={idx === blocks.length - 1} aria-label="Bajar bloque"><span className="material-symbols-outlined">arrow_downward</span></button>
                        <button type="button" className="secondary-btn" onClick={() => duplicateBlock(idx)}>Duplicar</button>
                        <button type="button" className="danger-btn" onClick={() => removeBlock(idx)}>Eliminar</button>
                      </div>
                    </header>
                    <div className="grid gap-4 md:grid-cols-2">
                      <SelectField label="Tipo de bloque" value={block.type} onChange={(event) => updateBlock(idx, "type", event.target.value as BlogPostBlockType)}>
                        {blockTypes.map((type) => <option key={type} value={type}>{blockLabels[type]}</option>)}
                      </SelectField>
                      <SwitchField checked={block.is_visible} onChange={(checked) => updateBlock(idx, "is_visible", checked)} label="Visible" />
                      {block.type === "heading" ? (
                        <>
                          <SelectField label="Nivel" value={block.custom_html || "3"} onChange={(event) => updateBlock(idx, "custom_html", event.target.value)}>
                            <option value="2">H2</option>
                            <option value="3">H3</option>
                          </SelectField>
                          <TextField label="Subtítulo" value={block.title} onChange={(event) => updateBlock(idx, "title", event.target.value)} />
                        </>
                      ) : null}
                      {block.type === "text" || block.type === "quote" || block.type === "list" ? (
                        <TextAreaField
                          label={block.type === "quote" ? "Frase" : block.type === "list" ? "Elementos" : "Texto"}
                          value={block.text}
                          help={block.type === "list" ? "Un elemento por línea." : undefined}
                          onChange={(event) => updateBlock(idx, "text", event.target.value)}
                          className="md:col-span-2"
                          rows={block.type === "text" ? 7 : 4}
                        />
                      ) : null}
                      {block.type === "image" ? (
                        <>
                          <div className="md:col-span-2"><MediaSelectField label="Imagen" value={block.image_id} onChange={(url) => updateBlock(idx, "image_id", url)} /></div>
                          <TextField label="Alt / título de imagen" value={block.title} onChange={(event) => updateBlock(idx, "title", event.target.value)} className="md:col-span-2" />
                        </>
                      ) : null}
                      {block.type === "cta" ? (
                        <>
                          <TextField label="Texto del botón" value={block.title} onChange={(event) => updateBlock(idx, "title", event.target.value)} />
                          <TextField label="URL" value={block.source_url} onChange={(event) => updateBlock(idx, "source_url", event.target.value)} />
                        </>
                      ) : null}
                    </div>
                  </article>
                ))}
              </div>
            </section>

            <section className="form-block cms-editor-card">
              <div className="cms-editor-card__head">
                <div>
                  <p className="auth-kicker">SEO</p>
                  <h3>Metadatos</h3>
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <TextField label="SEO title" value={seoTitle} maxLength={70} help={`${seoTitle.length}/70 caracteres`} onChange={(event) => setSeoTitle(event.target.value)} className="md:col-span-2" />
                <TextAreaField label="SEO description" value={seoDescription} maxLength={160} help={`${seoDescription.length}/160 caracteres`} onChange={(event) => setSeoDescription(event.target.value)} className="md:col-span-2" />
                <div className="md:col-span-2"><MediaSelectField label="SEO image" value={seoImage} onChange={setSeoImage} /></div>
              </div>
            </section>

            <div className="sticky-form-actions form-actions">
              <button type="button" className="secondary-btn" onClick={() => setStep("preview")}>Continuar a vista previa</button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <ArticlePreview title={title} excerpt={excerpt} cover={featuredImageId} blocks={blocks} />
          </div>
        )}
      </div>
    </div>
  );
}
