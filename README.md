# Casa Rosier Cerámica

Sitio web de Casa Rosier Cerámica desarrollado con Next.js, React,
TypeScript y Tailwind CSS.

Deploy público: [https://casa-rosier-ceramica.vercel.app](https://casa-rosier-ceramica.vercel.app)

Escrito por: Jose Manuel Castillo Queh  
Ingeniero de Software

## Estado del proyecto

El proyecto está migrado a Next.js App Router y actualmente usa una
arquitectura modular orientada a dominio. La capa `src/app` queda como routing
fino: cada ruta expone metadata, parámetros estáticos o validación mínima, y
delega la pantalla real a `src/features`.

El sitio conserva CSS legacy para proteger fidelidad visual, pero la
composición de páginas ya está separada por intención de negocio. Esto deja el
proyecto listo para conectar un CRM o CMS en una fase posterior sin repartir
lógica editorial por todas las rutas.

## Stack técnico

- Next.js con App Router.
- React.
- TypeScript en modo estricto.
- Tailwind CSS integrado de forma progresiva.
- CSS legacy conservado para identidad visual.
- Datos editoriales en módulos TypeScript.
- Componentes reutilizables por dominio.
- Persistencia de carrito con `localStorage`.

## Arquitectura

La arquitectura sigue un enfoque screaming architecture: las carpetas expresan
el negocio antes que la tecnología.

```text
src/
  app/                       Routing de Next.js, metadata y params.
  components/                Componentes visuales reutilizables y legacy-safe.
  data/                      Datos estáticos actuales, reemplazables por CRM.
  features/
    home/                    Pantalla y secciones de inicio.
    experiences/             Clases, workshops, reservas privadas y gift cards.
    blog/                    Índice y detalle de blog.
    shop/                    Listado y detalle de tienda.
    cart/                    Pantalla de carrito.
    studio/                  Página El estudio.
    legal/                   Páginas legales.
    shared/
      contextual-sections/   Secciones reutilizables dependientes de contexto.
      layout/                Layout común de página.
  lib/                       Utilidades de infraestructura ligera.
```

## Patrón de páginas

Cada página debe seguir este flujo:

1. `src/app/**/page.tsx` declara metadata y delega.
2. `src/features/<dominio>/<Pantalla>.tsx` compone la pantalla.
3. Las secciones repetidas se importan desde `features/shared`.
4. Los componentes visuales sin decisión de negocio viven en `components`.

Ejemplo:

```tsx
export default function ClassesPage() {
  return <ExperienceCollectionPage config={experienceCollections.classes} />;
}
```

## Preparación para CRM

Todavía no hay base de datos ni integración externa. La preparación consiste en
aislar los puntos que un CRM modificará:

- `src/data/*`: fuente actual de contenido estático.
- `src/features/experiences/experienceRoutes.ts`: configuración de listados de
  clases, workshops, reservas privadas y gift cards.
- `src/features/shared/contextual-sections/ideaPromptContent.ts`: registry de
  contenido contextual para secciones compartidas.
- `src/features/shared/layout/SitePage.tsx`: shell común para body class,
  header, main y footer.

Cuando llegue el CRM, el objetivo es reemplazar los providers de contenido o
registries por adapters de API, manteniendo las pantallas y componentes sin
conocer detalles de red, autenticación o persistencia.

## Sección contextual reutilizable

La sección “Y tu, cuando tuviste tu ultima idea?” ya no se importa como una
galería fija desde cada página. Ahora se usa:

```tsx
<IdeaPromptSection context="experience-list" />
```

El contenido por contexto vive en:

```text
src/features/shared/contextual-sections/ideaPromptContent.ts
```

Esto permite que home, blog, experiencias y estudio reciban contenido distinto
cuando el CRM lo entregue, sin tocar las rutas ni duplicar markup.

## Scripts

```bash
npm run dev
npm run build
npm run lint
npm run typecheck
```

## Convenciones

- Mantener `src/app` delgado.
- No importar `src/data` directamente desde rutas si existe un módulo en
  `features` que representa ese caso de uso.
- No duplicar secciones globales; usar `features/shared/contextual-sections`.
- No acoplar lógica futura del CRM a componentes visuales.
- Preservar CSS legacy salvo que exista una razón clara para migrarlo.
- Nuevas pantallas deben entrar como `src/features/<dominio>/<NombrePage>.tsx`.

## Verificación recomendada

Antes de entregar cambios:

```bash
npm run typecheck
npm run lint
npm run build
```

Para cambios visuales, revisar al menos:

- `/`
- `/clases`
- `/workshops`
- `/reservas-privadas`
- `/gift-card`
- `/el-estudio`
- `/blog`
- `/shop`
