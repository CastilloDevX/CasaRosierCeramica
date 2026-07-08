import Link from "next/link";
import type { ReactNode } from "react";
import { HeaderInterno } from "@/components/layout/HeaderInterno";
import { SitePage } from "@/features/shared/layout/SitePage";
import { getLegalSettings } from "@/lib/cms/legal";
import { DEFAULT_PRIVACY_POLICY_MARKDOWN } from "@/lib/cms/types";
import { formatDate } from "@/lib/utils";

export async function PrivacyPolicyPage() {
  const settings = await getLegalSettings();
  const title = settings.privacy_policy_title || "Política de privacidad";
  const content = settings.privacy_policy_content.trim() || DEFAULT_PRIVACY_POLICY_MARKDOWN;
  const updatedAt = settings.updated_at
    ? formatDate(settings.updated_at)
    : null;

  return (
    <SitePage
      bodyClass="blog-post-page legal-policy-page"
      header={
        <HeaderInterno height="small" overlayTitle className="blog-hero legal-hero">
          <>
            <p className="blog-post-hero__category">Política de privacidad</p>
            <h1 className="page-hero__title blog-hero__title">
              {title}
            </h1>
            <p className="blog-post-hero__meta">
              Casa Rosier{updatedAt ? ` · Actualizado el ${updatedAt}` : ""}
            </p>
          </>
        </HeaderInterno>
      }
    >
      <section className="blog-post legal-policy section">
        <div className="container article-wrapper blog-post__container">
          <div className="article-header blog-post__header legal-policy__header">
            <p className="blog-post-hero__category">Documento legal</p>
            <h2 className="article-title blog-post__article-title">{title}</h2>
          </div>
          <article className="article-content blog-post__content legal-policy__content">
            <LegalText content={content} />
          </article>
        </div>
      </section>
      <section className="blog-post-nav legal-policy__nav">
        <div className="container blog-post-nav__container">
          <Link href="/">Volver al inicio</Link>
        </div>
      </section>
    </SitePage>
  );
}

function LegalText({ content }: { content: string }) {
  const nodes: ReactNode[] = [];
  const paragraphLines: string[] = [];
  let listItems: string[] = [];
  let listType: "ul" | "ol" | null = null;
  let quoteLines: string[] = [];

  function flushParagraph(key: string) {
    if (!paragraphLines.length) return;
    const lines = [...paragraphLines];
    paragraphLines.length = 0;
    nodes.push(
      <p key={key}>
        {lines.map((line, index) => (
          <span key={`${line}-${index}`}>
            {index > 0 && <br />}
            {renderInline(line)}
          </span>
        ))}
      </p>,
    );
  }

  function flushQuote(key: string) {
    if (!quoteLines.length) return;
    const lines = [...quoteLines];
    quoteLines = [];
    nodes.push(
      <blockquote key={key}>
        {lines.map((line, index) => (
          <span key={`${line}-${index}`}>
            {index > 0 && <br />}
            {renderInline(line)}
          </span>
        ))}
      </blockquote>,
    );
  }

  function flushList(key: string) {
    if (!listItems.length || !listType) return;
    const items = [...listItems];
    const currentType = listType;
    listItems = [];
    listType = null;
    const children = items.map((item, index) => (
      <li key={`${item}-${index}`}>{renderInline(item)}</li>
    ));
    nodes.push(
      currentType === "ol" ? (
        <ol key={key}>{children}</ol>
      ) : (
        <ul key={key}>{children}</ul>
      ),
    );
  }

  content
    .replace(/\r\n/g, "\n")
    .split("\n")
    .forEach((rawLine, index) => {
      const line = rawLine.trim();
      if (!line) {
        flushParagraph(`p-${index}`);
        flushQuote(`quote-${index}`);
        flushList(`list-${index}`);
        return;
      }

      const alignedBlock = parseAlignedTextBlock(line);
      if (alignedBlock) {
        flushParagraph(`p-${index}`);
        flushQuote(`quote-${index}`);
        flushList(`list-${index}`);
        nodes.push(renderTextBlock(alignedBlock.tag, alignedBlock.content, `aligned-${index}`, alignedBlock.align));
        return;
      }

      const alignedList = parseAlignedListBlock(line);
      if (alignedList) {
        flushParagraph(`p-${index}`);
        flushQuote(`quote-${index}`);
        flushList(`list-${index}`);
        nodes.push(renderListBlock(alignedList.tag, alignedList.items, `aligned-list-${index}`, alignedList.align));
        return;
      }

      const iframe = line.match(/^<iframe\b[^>]*\bsrc=["']([^"']+)["'][^>]*>\s*<\/iframe>$/i);
      if (iframe) {
        flushParagraph(`p-${index}`);
        flushQuote(`quote-${index}`);
        flushList(`list-${index}`);
        const src = safeHref(iframe[1]);
        if (src !== "#") nodes.push(renderEmbed(src, `iframe-${index}`));
        return;
      }

      const image = line.match(/^!\[([^\]]*)\]\(([^)]+)\)$/);
      if (image) {
        flushParagraph(`p-${index}`);
        flushQuote(`quote-${index}`);
        flushList(`list-${index}`);
        const src = safeHref(image[2]);
        if (src !== "#") nodes.push(renderImage(src, image[1], `image-${index}`));
        return;
      }

      const heading = line.match(/^(#{1,3})\s+(.+)$/);
      if (heading) {
        flushParagraph(`p-${index}`);
        flushQuote(`quote-${index}`);
        flushList(`list-${index}`);
        nodes.push(renderTextBlock(`h${heading[1].length}` as "h1" | "h2" | "h3", heading[2], `h-${index}`));
        return;
      }

      const quote = line.match(/^>\s*(.+)$/);
      if (quote) {
        flushParagraph(`p-${index}`);
        flushList(`list-${index}`);
        quoteLines.push(quote[1]);
        return;
      }

      const unorderedItem = line.match(/^[-*]\s+(.+)$/);
      const orderedItem = line.match(/^\d+\.\s+(.+)$/);
      if (unorderedItem || orderedItem) {
        flushParagraph(`p-${index}`);
        flushQuote(`quote-${index}`);
        const nextType = orderedItem ? "ol" : "ul";
        if (listType && listType !== nextType) {
          flushList(`list-${index}`);
        }
        listType = nextType;
        listItems.push((orderedItem || unorderedItem)?.[1] ?? "");
        return;
      }

      flushList(`list-${index}`);
      flushQuote(`quote-${index}`);
      paragraphLines.push(line);
    });

  flushParagraph("p-final");
  flushQuote("quote-final");
  flushList("list-final");

  return <>{nodes}</>;
}

function renderInline(value: string): ReactNode[] {
  const parts: ReactNode[] = [];
  const pattern =
    /(\[([^\]]+)\]\(([^)]+)\)|\*\*([^*]+)\*\*|__([^_]+)__|<u>(.*?)<\/u>|~~([^~]+)~~|<s>(.*?)<\/s>|_([^_]+)_|\*([^*]+)\*)/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(value)) !== null) {
    if (match.index > lastIndex) {
      parts.push(value.slice(lastIndex, match.index));
    }

    const key = `${match.index}-${match[0]}`;
    if (match[2] && match[3]) {
      const href = safeHref(match[3]);
      const isExternal = /^https?:\/\//.test(href);
      parts.push(
        <a
          href={href}
          key={key}
          rel={isExternal ? "noreferrer" : undefined}
          target={isExternal ? "_blank" : undefined}
        >
          {match[2]}
        </a>,
      );
    } else if (match[4] || match[5]) {
      parts.push(<strong key={key}>{match[4] || match[5]}</strong>);
    } else if (match[6]) {
      parts.push(<u key={key}>{match[6]}</u>);
    } else if (match[7] || match[8]) {
      parts.push(<s key={key}>{match[7] || match[8]}</s>);
    } else if (match[9] || match[10]) {
      parts.push(<em key={key}>{match[9] || match[10]}</em>);
    }

    lastIndex = pattern.lastIndex;
  }

  if (lastIndex < value.length) {
    parts.push(value.slice(lastIndex));
  }

  return parts;
}

function renderTextBlock(tag: "p" | "h1" | "h2" | "h3", content: string, key: string, align?: "left" | "center" | "right") {
  const style = align && align !== "left" ? { textAlign: align } : undefined;
  const children = renderInline(stripInlineHtml(content));
  if (tag === "h1") return <h1 key={key} style={style}>{children}</h1>;
  if (tag === "h2") return <h2 key={key} style={style}>{children}</h2>;
  if (tag === "h3") return <h3 key={key} style={style}>{children}</h3>;
  return <p key={key} style={style}>{children}</p>;
}

function renderListBlock(tag: "ul" | "ol", items: string[], key: string, align?: "left" | "center" | "right") {
  const style = align && align !== "left" ? { textAlign: align } : undefined;
  const children = items.map((item, index) => (
    <li key={`${item}-${index}`}>{renderInline(stripInlineHtml(item))}</li>
  ));
  return tag === "ol" ? <ol key={key} style={style}>{children}</ol> : <ul key={key} style={style}>{children}</ul>;
}

function renderImage(src: string, alt: string, key: string) {
  return (
    <figure className="rich-text-image legal-policy__image" key={key}>
      <img src={src} alt={stripInlineHtml(alt)} loading="lazy" />
    </figure>
  );
}

function renderEmbed(src: string, key: string) {
  return (
    <div className="rich-text-embed legal-policy__embed" key={key}>
      <iframe src={src} title="Contenido embebido" loading="lazy" allowFullScreen />
    </div>
  );
}

function parseAlignedTextBlock(line: string) {
  const match = line.match(/^<(p|div|h[1-3])\s+style=["'][^"']*text-align:\s*(left|center|right);?[^"']*["'][^>]*>(.*)<\/\1>$/i);
  if (!match) return null;
  const tag = match[1].toLowerCase() === "div" ? "p" : match[1].toLowerCase();
  return {
    tag: tag as "p" | "h1" | "h2" | "h3",
    align: normalizeAlign(match[2]),
    content: match[3].trim(),
  };
}

function parseAlignedListBlock(line: string) {
  const match = line.match(/^<(ul|ol)\s+style=["'][^"']*text-align:\s*(left|center|right);?[^"']*["'][^>]*>(.*)<\/\1>$/i);
  if (!match) return null;
  const items = Array.from(match[3].matchAll(/<li[^>]*>(.*?)<\/li>/gi))
    .map((item) => item[1].trim())
    .filter(Boolean);
  return {
    tag: match[1].toLowerCase() as "ul" | "ol",
    align: normalizeAlign(match[2]),
    items,
  };
}

function normalizeAlign(value: string): "left" | "center" | "right" {
  const normalized = value.trim().toLowerCase();
  if (normalized === "center" || normalized === "right") return normalized;
  return "left";
}

function stripInlineHtml(value: string) {
  return value
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/?(span|div|p)[^>]*>/gi, "")
    .replace(/<strong[^>]*>(.*?)<\/strong>/gi, "**$1**")
    .replace(/<b[^>]*>(.*?)<\/b>/gi, "**$1**")
    .replace(/<em[^>]*>(.*?)<\/em>/gi, "_$1_")
    .replace(/<i[^>]*>(.*?)<\/i>/gi, "_$1_")
    .replace(/<u[^>]*>(.*?)<\/u>/gi, "<u>$1</u>")
    .replace(/<(s|strike|del)[^>]*>(.*?)<\/\1>/gi, "~~$2~~")
    .replace(/<a\b[^>]*href=["']([^"']+)["'][^>]*>(.*?)<\/a>/gi, (_match, href: string, text: string) => {
      const safe = safeHref(href);
      return safe === "#" ? text : `[${text}](${safe})`;
    })
    .replace(/<(?!\/?u\b)[^>]+>/g, "");
}

function safeHref(value: string) {
  const trimmed = value.trim();
  if (/^(https?:\/\/|mailto:|tel:|\/)/.test(trimmed)) {
    return trimmed;
  }
  return "#";
}
