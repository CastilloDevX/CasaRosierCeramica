import Link from "next/link";
import type { ReactNode } from "react";
import { HeaderInterno } from "@/components/layout/HeaderInterno";
import { SitePage } from "@/features/shared/layout/SitePage";
import { getLegalSettings } from "@/lib/cms/legal";
import { DEFAULT_PRIVACY_POLICY_MARKDOWN } from "@/lib/cms/types";
import { formatDate } from "@/lib/utils";

export async function PrivacyPolicyPage() {
  const settings = await getLegalSettings();
  const title = settings.privacy_policy_title || "Políticas de privacidad";
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
              Políticas de privacidad
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
        flushList(`list-${index}`);
        return;
      }

      const heading = line.match(/^(#{1,3})\s+(.+)$/);
      if (heading) {
        flushParagraph(`p-${index}`);
        flushList(`list-${index}`);
        nodes.push(
          heading[1].length === 3 ? (
            <h3 key={`h-${index}`}>{renderInline(heading[2])}</h3>
          ) : (
            <h2 key={`h-${index}`}>{renderInline(heading[2])}</h2>
          ),
        );
        return;
      }

      const unorderedItem = line.match(/^[-*]\s+(.+)$/);
      const orderedItem = line.match(/^\d+\.\s+(.+)$/);
      if (unorderedItem || orderedItem) {
        flushParagraph(`p-${index}`);
        const nextType = orderedItem ? "ol" : "ul";
        if (listType && listType !== nextType) {
          flushList(`list-${index}`);
        }
        listType = nextType;
        listItems.push((orderedItem || unorderedItem)?.[1] ?? "");
        return;
      }

      flushList(`list-${index}`);
      paragraphLines.push(line);
    });

  flushParagraph("p-final");
  flushList("list-final");

  return <>{nodes}</>;
}

function renderInline(value: string): ReactNode[] {
  const parts: ReactNode[] = [];
  const pattern =
    /(\[([^\]]+)\]\(([^)]+)\)|\*\*([^*]+)\*\*|__([^_]+)__|<u>(.*?)<\/u>|_([^_]+)_|\*([^*]+)\*)/g;
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
      parts.push(<em key={key}>{match[7] || match[8]}</em>);
    }

    lastIndex = pattern.lastIndex;
  }

  if (lastIndex < value.length) {
    parts.push(value.slice(lastIndex));
  }

  return parts;
}

function safeHref(value: string) {
  const trimmed = value.trim();
  if (/^(https?:\/\/|mailto:|tel:|\/)/.test(trimmed)) {
    return trimmed;
  }
  return "#";
}
