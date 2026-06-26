---
name: technical-delivery-pdf-style
description: Create polished, executive-friendly technical delivery PDFs from Markdown or structured notes, using a sober Casa Rosier-inspired visual style with warm neutral colors, clean cover page, professional headers/footers, readable tables, implementation summaries, validation sections, and final QA checks. Use when Codex needs to generate a simple but elegant PDF report for software migrations, project handoffs, audits, deployment summaries, frontend reviews, technical documentation, or stakeholder deliverables.
---

# Technical Delivery PDF Style

Use this skill to create a professional PDF report from Markdown, implementation notes, audit results, migration summaries, or technical documentation.

The target output is a clean delivery document: elegant, readable, restrained, and appropriate for a technical stakeholder or manager. The design should feel like a finished object of delivery, not a raw export.

## Core intent

Create a PDF that communicates:

- What was delivered.
- What was changed.
- What was validated.
- What decisions were made.
- What remains pending.
- Where the deployed project can be reviewed.
- Who authored the report.

The style should balance technical clarity with visual polish. It should not look like a dense academic paper or a plain terminal-generated export.

## Visual personality

Use a warm, minimal, editorial technical style:

- Calm and professional.
- Spacious but not empty.
- Slightly brand-like without becoming decorative.
- Neutral enough for business delivery.
- Soft color accents instead of loud colors.
- Clear hierarchy over visual noise.

The PDF should feel like:

- A handoff document.
- A migration report.
- A technical audit summary.
- A polished internal/external deliverable.

Avoid:

- Overly colorful dashboards.
- Heavy gradients.
- Clip art.
- Excessive icons.
- Dense walls of text.
- Developer-only screenshots unless explicitly requested.
- Exposed local machine paths or private filesystem details.

## Recommended document structure

Use this structure unless the user provides a different one:

1. Cover page.
2. Executive summary.
3. Technical stack.
4. Scope or migrated views.
5. Architecture or project structure.
6. Components/modules implemented.
7. Data or content migration.
8. Styling, typography, or UI fidelity notes.
9. Interactions or functionality migrated.
10. SEO, metadata, accessibility, or performance notes when relevant.
11. Validation results.
12. Known issues, fallbacks, or pending work.
13. Conclusion.

For software migration reports, prefer these section names:

- Resumen ejecutivo.
- Stack técnico.
- Vistas migradas.
- Rutas dinámicas generadas.
- Estructura implementada.
- Componentes implementados.
- Datos migrados.
- Estilos y tipografía.
- Auditoría visual o tipográfica.
- Interacciones migradas.
- SEO y metadata.
- Validaciones.
- Referencias faltantes y fallbacks.
- Pendientes conocidos.
- Conclusión.

## Cover page

The cover should be simple and centered.

Include:

- Document title.
- Project/report subtitle.
- Deploy/public link when available.
- Verification date when available.
- Author attribution.
- Role/title of the author.

Example:

```txt
Reporte de entrega
Migración Casa Rosier a Next.js

Deploy público: https://example.vercel.app
Fecha de verificación: 26 de junio de 2026

Escrito por: Nombre del autor
Ingeniero de Software
```

Cover layout:

- Large top whitespace.
- Centered title block.
- Muted secondary metadata.
- Link in accent color.
- No large logo unless the user provides one and asks to include it.
- No clutter.

## Page layout

Use A4 portrait by default.

Recommended margins:

- Left: 1.7 cm.
- Right: 1.7 cm.
- Top: 1.75 cm.
- Bottom: 1.55 cm.

Header:

- Left: project/client name.
- Right: report category, e.g. "Migración Next.js".
- Small font, muted color.
- Thin horizontal rule below.

Footer:

- Thin horizontal rule above.
- Centered page number.
- Small muted color.

Do not make the header/footer visually dominant. They are there to make the document feel finished.

## Color palette

Use a warm neutral palette:

```txt
Primary ink:    #3A2E2A
Muted text:     #6F625D
Accent:         #A66F55
Soft surface:   #F6EFEA
Line/border:    #DDCEC5
Body text:      #2F2926
White/surface:  #FFFDFC
```

Usage:

- `Primary ink` for main headings.
- `Muted text` for metadata, headers, footers.
- `Accent` for links, table headers, small visual emphasis.
- `Soft surface` for code blocks or highlighted boxes.
- `Line/border` for dividers and table grid lines.
- `Body text` for normal paragraphs.

Keep contrast readable. If printing is expected, make table headers dark enough and avoid pale text on pale backgrounds.

## Typography

Default PDF-safe recommendation:

- Headings: Helvetica-Bold.
- Body: Helvetica.
- Code: Courier.

If a brand font is available and reliable in the environment, it may be used. Otherwise, prefer PDF-safe fonts to avoid rendering failures.

Recommended sizes:

- Cover title: 24-26 pt.
- Cover subtitle/title continuation: 24-26 pt.
- Cover metadata: 11-12 pt.
- H1 sections: 15-16 pt.
- H2 subsections: 12.5-13 pt.
- Body: 9-9.5 pt.
- Bullets: 9 pt.
- Table body: 7.2-7.8 pt.
- Table header: 7.4-8 pt.
- Header/footer: 8 pt.
- Code block: 7.5-8 pt.

Recommended leading:

- Body: font size + 4 pt.
- Tables: font size + 2 pt.
- Headings: font size + 4-5 pt.

Avoid tiny body text. Tables can be smaller, but must remain legible.

## Writing tone

Use a confident delivery tone.

Prefer:

- "Se implementó..."
- "Se migró..."
- "Se verificó..."
- "El build generó..."
- "Queda pendiente..."

Avoid:

- "Creo que..."
- "Parece que..."
- "Proyecto local..."
- "Mockup en mi PC..."
- Private paths.
- Internal scratch notes.
- Tool chatter.
- Overexplaining implementation mechanics.

The report should read as if written by the named author for a stakeholder. It should not mention Codex unless the user explicitly requests it.

## Public/private information rules

Before generating the final PDF, remove or rewrite:

- Local filesystem paths.
- User home directory names.
- OneDrive/Desktop paths.
- Private machine-specific URLs.
- Temporary ports unless explicitly relevant.
- Internal debugging messages.
- Tool names unless relevant to the report.

If a deploy URL exists, include it prominently:

- On the cover page.
- In the conclusion.
- Optionally in the README or appendix.

Example:

```txt
Deploy público:
https://casa-rosier-ceramica.vercel.app
```

## Tables

Use tables for:

- Stack technical summary.
- Route/view mappings.
- Validation results.
- Typography audit results.
- Missing references/fallbacks.
- Component inventories when concise.

Table style:

- Accent-colored header background.
- White header text.
- Thin warm border lines.
- White or near-white body cells.
- Top vertical alignment.
- Compact padding.

Do not overuse tables when bullets are clearer.

Table readability rules:

- Keep text short.
- Use route strings/code in monospace.
- Avoid 4+ columns unless necessary.
- If a table becomes too wide, split it into smaller tables.
- If a table spans pages, repeat the header row.

## Bullets and lists

Use bullets for concise inventories:

- Implemented features.
- Migrated interactions.
- Pending work.
- Key decisions.

Use numbered lists for:

- Sequential decisions.
- Ordered validation process.
- Prioritized pending items.

Avoid deep nesting. A delivery report should be easy to scan.

## Code and paths

Use inline monospace for:

- Commands.
- Routes.
- File names.
- Storage keys.
- Technical identifiers.

Examples:

```txt
`npm run build`
`/shop/[slug]`
`casarosier_cart_v1`
`src/app/layout.tsx`
```

Use code blocks for:

- Small project tree.
- Commands.
- Short config snippets.

Never let long code or paths overflow the page. Break, wrap, shorten, or summarize.

## PDF generation workflow

Preferred workflow:

1. Prepare a clean Markdown source or structured outline.
2. Remove private/local references.
3. Generate the PDF using a reliable PDF library such as ReportLab.
4. Add page header, footer, and page numbers.
5. Extract text from the generated PDF to verify required content.
6. Render selected pages to images for visual QA.
7. Inspect cover, one body page, and final page.
8. Fix spacing, overflow, repeated metadata, table readability, or missing links.
9. Deliver only after checks pass.

Use `reportlab` when creating a fresh PDF programmatically. Use `pypdf` or `pdfplumber` to extract text. Use `pypdfium2`, Poppler, or another renderer to produce page previews.

## Required final checks

Before handing off the PDF:

- Confirm the PDF file exists.
- Confirm it opens or renders successfully.
- Confirm page count is reasonable.
- Confirm author attribution is present.
- Confirm deploy/public URL is present when applicable.
- Confirm no private filesystem paths are present.
- Confirm no temporary local ports are present unless explicitly desired.
- Confirm cover page looks centered and clean.
- Confirm at least one body page has readable tables and spacing.
- Confirm final page does not look clipped.
- Confirm text extraction includes key information.

For public/stakeholder reports, explicitly search for:

```txt
C:\
Users\
OneDrive
Desktop
Escritorio
localhost
127.0.0.1
mockup original auditado
proyecto destino
```

If any appear, rewrite before delivery unless the user explicitly asked to include them.

## Recommended output paths

When working inside a repository:

```txt
output/pdf/reporte-[project-name].pdf
```

If using temporary previews:

```txt
tmp/pdfs/preview/
```

Delete temporary preview files when done unless the user asks to keep them.

## Example PDF content pattern

Use this pattern for a migration delivery:

```txt
# Reporte de entrega - Migración [Proyecto]

Fecha de verificación: [fecha]
Deploy público: [url]

Escrito por: [autor]
[rol]

## 1. Resumen ejecutivo
[Qué se migró, a qué stack, y con qué prioridad.]

## 2. Stack técnico
[Tabla con framework, router, UI, lenguaje, estilos, deploy.]

## 3. Vistas migradas
[Tabla con vista y ruta.]

## 4. Componentes implementados
[Listas por área.]

## 5. Validaciones
[Lint, typecheck, build, auditorías.]

## 6. Pendientes conocidos
[Pendientes no bloqueantes.]

## 7. Conclusión
[Estado final y enlace de deploy.]
```

## ReportLab implementation notes

When using ReportLab:

- Use `SimpleDocTemplate` with A4.
- Define custom `ParagraphStyle` objects for cover, headings, body, bullets, code, and tables.
- Build the cover manually as the first page.
- Skip duplicated Markdown title/metadata in the body if the cover already contains them.
- Convert Markdown tables to ReportLab `Table`.
- Use `repeatRows=1` for long tables.
- Use `onFirstPage` and `onLaterPages` callbacks for header/footer.
- Use `Paragraph` inside table cells to allow wrapping.
- Use small table font sizes to prevent overflow.
- Use `link` tags for deploy URLs.

Recommended ReportLab style values:

```txt
Page: A4
Margins: 1.7 cm left/right, 1.75 cm top, 1.55 cm bottom
Heading color: #3A2E2A
Body color: #2F2926
Muted color: #6F625D
Accent color: #A66F55
Border color: #DDCEC5
Soft background: #F6EFEA
```

## Handling Markdown input

When converting Markdown:

- Treat `#` as document title and usually place it on the cover.
- Treat `##` as H1 body sections.
- Treat `###` as H2 subsections.
- Convert `-` bullets to bullet paragraphs.
- Convert ordered lists to readable numbered paragraphs.
- Convert fenced code blocks to `Preformatted`.
- Convert tables to ReportLab tables.
- Convert inline code to monospace.
- Convert URLs to clickable links.

Keep the parser pragmatic. The goal is a polished delivery PDF, not complete Markdown specification coverage.

## Quality bar

The final PDF is acceptable only if:

- It looks intentionally designed.
- It is readable without zooming excessively.
- It has no clipped text.
- Tables fit within the page.
- The cover page is clean.
- The final page has a proper ending.
- Stakeholder-facing language is polished.
- No private/local development paths leak into the deliverable.

If the PDF looks like a raw export, improve spacing, hierarchy, cover design, and table styling before delivering.
