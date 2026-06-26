# Reporte de entrega — Migración Casa Rosier a Next.js

Fecha de verificación: 26 de junio de 2026  
Proyecto destino: `C:\Users\mrato\OneDrive\Escritorio\casarosierceramica`  
Mockup original auditado: `C:\Users\mrato\OneDrive\Escritorio\front endrororosier\public`

## 1. Resumen ejecutivo

Se migró el mockup estático de Casa Rosier, originalmente construido con HTML, CSS y JavaScript vanilla, a un proyecto moderno con Next.js App Router, React, TypeScript y Tailwind CSS.

La migración se realizó priorizando fidelidad visual sobre rediseño. Por eso se conservaron los CSS originales dentro de `src/app/legacy/` y Tailwind se integró de forma progresiva, sin reemplazar bloques complejos que ya resolvían correctamente composición, tipografía, espaciados, colores, responsive e interacciones visuales.

Estado actual:

- Proyecto Next.js funcional.
- Rutas estáticas y dinámicas implementadas.
- Datos migrados a módulos TypeScript.
- Componentes React reutilizables creados.
- Interacciones principales migradas a componentes client.
- Fuentes, CSS legacy y assets integrados.
- Tipografía auditada página por página contra el mockup original.
- `lint`, `typecheck` y `build` ejecutados correctamente.

## 2. Stack técnico implementado

| Área | Implementación |
| --- | --- |
| Framework | Next.js 16.2.9 |
| Router | App Router |
| UI | React 19.2.7 |
| Lenguaje | TypeScript 6.0.3 en modo estricto |
| Estilos | Tailwind CSS 4.3.1 + CSS legacy conservado |
| Lint | ESLint 9 con configuración Next |
| Auditoría visual/tipográfica | Scripts con `playwright-core` y Microsoft Edge local |
| Carrito | `localStorage`, clave conservada `casarosier_cart_v1` |

## 3. Auditoría del mockup original

Se revisó la carpeta original `public/` del sitio estático.

Inventario detectado:

- 31 páginas HTML.
- 11 hojas CSS.
- 14 scripts JavaScript.
- 28 imágenes e iconos disponibles.
- 4 fuentes variables locales.

### 3.1 Hojas CSS originales

Se conservaron y migraron como CSS legacy:

- `base.css`
- `home.css`
- `classes.css`
- `shop.css`
- `blog.css`
- `cart.css`
- `footer.css`
- `cookiebar.css`
- `promo-entry.css`
- `site.css`
- `studio.css`

Destino actual:

- `src/app/legacy/base.css`
- `src/app/legacy/home.css`
- `src/app/legacy/classes.css`
- `src/app/legacy/shop.css`
- `src/app/legacy/blog.css`
- `src/app/legacy/cart.css`
- `src/app/legacy/footer.css`
- `src/app/legacy/cookiebar.css`
- `src/app/legacy/promo-entry.css`
- `src/app/legacy/site.css`
- `src/app/legacy/studio.css`

### 3.2 Scripts originales revisados

El mockup original contenía lógica vanilla para navegación, sliders, modales, filtros, carrito y renderizado de datos. Esa lógica fue migrada a React/TypeScript en componentes client cuando requería navegador.

Lógicas migradas:

- Navegación desktop.
- Navegación mobile.
- Dropdowns.
- Accordions mobile.
- Slider de introducción home.
- Slider/testimonios.
- Galería social.
- Carrusel destacado del blog.
- Filtros de blog.
- Filtros de shop.
- Galerías de detalle.
- Modal/promoción de entrada.
- Cookiebar.
- Carrito con `localStorage`.

### 3.3 Referencias faltantes detectadas en origen

Estas referencias existían en HTML, CSS, JavaScript o data del mockup, pero no tenían archivo físico correspondiente:

- `scripts/cms-home.js`
- `img/clase-1.png`
- `img/clase-2.png`
- `img/clase-3.png`
- `img/c0c8f2c3-1d13-4632-9fe8-1ad322e51abd.png`
- `img/0429e735-6642-4339-8e1b-72bdade5c8ad.png`
- `img/5fd27c84-15dd-43ef-b039-2e8458a3f1a6.png`

No se eliminaron referencias de datos. Para evitar roturas visuales se implementó un fallback centralizado únicamente al renderizar imágenes.

Archivo responsable:

- `src/lib/assets.ts`

Fallbacks actuales:

| Referencia faltante | Fallback temporal |
| --- | --- |
| `img/clase-1.png` | `/img/social-2.jpg` |
| `img/clase-2.png` | `/img/intro-e.jpg` |
| `img/clase-3.png` | `/img/social-3.jpg` |
| `img/c0c8f2c3-1d13-4632-9fe8-1ad322e51abd.png` | `/img/intro-e.jpg` |
| `img/0429e735-6642-4339-8e1b-72bdade5c8ad.png` | `/img/workshop-3.jpg` |
| `img/5fd27c84-15dd-43ef-b039-2e8458a3f1a6.png` | `/img/social-5.png` |

## 4. Estructura final del proyecto

Estructura principal implementada:

```txt
src/
  app/
    layout.tsx
    page.tsx
    globals.css
    tailwind.css
    legacy/
    blog/
    carrito/
    clases/
    el-estudio/
    gift-card/
    home/
    politica-privacidad/
    reservas-privadas/
    shop/
    workshops/

  components/
    blog/
    collections/
    home/
    layout/
    shop/
    studio/
    ui/

  data/
    blog.ts
    classes.ts
    navigation.ts
    shop.ts
    types.ts

  lib/
    assets.ts
    cart.ts
    metadata.ts
    routes.ts
    utils.ts

public/
  img/
  fonts/
```

## 5. Rutas y vistas migradas

Todas las vistas solicitadas fueron migradas a App Router.

| Vista | Ruta Next.js | Archivo |
| --- | --- | --- |
| Inicio | `/` | `src/app/page.tsx` |
| Home legacy | `/home` | `src/app/home/page.tsx` |
| Clases | `/clases` | `src/app/clases/page.tsx` |
| Detalle de clase | `/clases/[slug]` | `src/app/clases/[slug]/page.tsx` |
| Workshops | `/workshops` | `src/app/workshops/page.tsx` |
| Detalle de workshop | `/workshops/[slug]` | `src/app/workshops/[slug]/page.tsx` |
| Reservas privadas | `/reservas-privadas` | `src/app/reservas-privadas/page.tsx` |
| Detalle de reserva privada | `/reservas-privadas/[slug]` | `src/app/reservas-privadas/[slug]/page.tsx` |
| Gift card | `/gift-card` | `src/app/gift-card/page.tsx` |
| Detalle de gift card | `/gift-card/[slug]` | `src/app/gift-card/[slug]/page.tsx` |
| Shop | `/shop` | `src/app/shop/page.tsx` |
| Detalle de producto | `/shop/[slug]` | `src/app/shop/[slug]/page.tsx` |
| Blog | `/blog` | `src/app/blog/page.tsx` |
| Detalle de artículo | `/blog/[slug]` | `src/app/blog/[slug]/page.tsx` |
| Carrito | `/carrito` | `src/app/carrito/page.tsx` |
| El estudio | `/el-estudio` | `src/app/el-estudio/page.tsx` |
| Política de privacidad | `/politica-privacidad` | `src/app/politica-privacidad/page.tsx` |

### 5.1 Rutas dinámicas generadas

El build genera rutas estáticas para contenido dinámico usando `generateStaticParams`.

Clases:

- `/clases/primer-contacto-con-torno`
- `/clases/modelado-expresivo`
- `/clases/color-y-acabados`

Workshops:

- `/workshops/gran-formato`
- `/workshops/torno-avanzado`
- `/workshops/experimentacion-material`

Reservas privadas:

- `/reservas-privadas/experiencia-para-dos`
- `/reservas-privadas/celebracion-privada`
- `/reservas-privadas/sesion-para-equipos`

Gift card:

- `/gift-card/beginner-class`
- `/gift-card/sculpture-class`

Shop:

- `/shop/jarron-de-gres-blanco`
- `/shop/taza-irregular-azul`
- `/shop/plato-de-superficie-calida`
- 3 rutas adicionales de producto generadas desde `src/data/shop.ts`

Blog:

- `/blog/como-empezar-una-pieza-sin-tenerlo-todo-claro`
- `/blog/engobes-esmaltes-y-pequenas-decisiones-de-superficie`
- `/blog/lo-que-pasa-en-el-taller-cuando-nadie-tiene-prisa`

## 6. Componentes implementados

### 6.1 Layout global

- `src/components/layout/SiteChrome.tsx`
- `src/components/layout/NavbarGlobal.tsx`
- `src/components/layout/HeaderHome.tsx`
- `src/components/layout/HeaderInterno.tsx`
- `src/components/layout/Footer.tsx`
- `src/components/layout/CookieBar.tsx`
- `src/components/layout/WhatsAppFloat.tsx`
- `src/components/layout/BodyClass.tsx`

Funcionalidades:

- Header diferenciado para home e internas.
- Menú desktop.
- Menú mobile.
- Dropdowns.
- Estados activos.
- Footer global.
- Cookiebar persistente.
- Botón flotante de WhatsApp.

### 6.2 Home

- `src/components/home/IntroSlider.tsx`
- `src/components/home/FeaturedSection.tsx`
- `src/components/home/SocialGallery.tsx`
- `src/components/home/TestimonialSlider.tsx`

Funcionalidades:

- Hero y composición principal conservados.
- Slider introductorio migrado a React.
- Bloques destacados.
- Galería social.
- Testimonios con comportamiento interactivo.

### 6.3 Colecciones y experiencias

- `src/components/collections/CollectionLanding.tsx`
- `src/components/collections/CollectionGrid.tsx`
- `src/components/collections/CollectionCard.tsx`
- `src/components/collections/DetailPage.tsx`
- `src/components/collections/ExperienceDetailScreen.tsx`
- `src/components/collections/Gallery.tsx`
- `src/components/collections/Accordion.tsx`

Funcionalidades:

- Listados de clases, workshops, gift cards y reservas privadas.
- Páginas de detalle reutilizables.
- Galerías de imágenes.
- Accordions.
- Preservación de estructura visual y clases CSS existentes.

### 6.4 Shop

- `src/components/shop/ShopGrid.tsx`
- `src/components/shop/ShopDetail.tsx`
- `src/components/shop/Cart.tsx`

Funcionalidades:

- Grid de productos.
- Filtros visuales.
- Detalle de producto.
- Galería de producto.
- Agregar al carrito.
- Eliminar producto.
- Limpiar carrito.
- Resumen de carrito.
- Persistencia en `localStorage`.

### 6.5 Blog

- `src/components/blog/BlogGrid.tsx`
- `src/components/blog/BlogDetail.tsx`
- `src/components/blog/FeaturedCarousel.tsx`

Funcionalidades:

- Carrusel destacado.
- Filtros por categoría.
- Grid de artículos.
- Detalle de artículo con bloques tipados.
- Artículos relacionados/navegación contextual desde datos.

### 6.6 Estudio y UI compartida

- `src/components/studio/StudioGallery.tsx`
- `src/components/ui/PromoEntry.tsx`

Funcionalidades:

- Galería visual de estudio.
- Modal/promoción de entrada con almacenamiento de sesión/local.

## 7. Datos migrados y tipados

Los datos originales JavaScript fueron convertidos a módulos TypeScript.

| Origen | Destino |
| --- | --- |
| `classes-data.js` | `src/data/classes.ts` |
| `shop-data.js` | `src/data/shop.ts` |
| `blog-data.js` | `src/data/blog.ts` |
| Navegación HTML/JS | `src/data/navigation.ts` |

Tipos creados en `src/data/types.ts`:

- `ClassItem`
- `WorkshopItem`
- `GiftCardItem`
- `PrivateExperienceItem`
- `ShopItem`
- `BlogPost`
- `NavigationItem`
- `CartItem`
- Tipos auxiliares para precios, programas, horarios, categorías y bloques de contenido.

Funciones equivalentes implementadas:

- `bySlug`
- `byKind`
- `published`
- `featured`
- `related`
- `neighbors`
- `byCategory`

## 8. Tipografía y fuentes

La tipografía fue un punto crítico de revisión porque varios componentes no estaban mostrando la fuente esperada tras la integración con Tailwind y `next/font`.

### 8.1 Fuentes disponibles en `public/fonts`

- `CormorantGaramond-VariableFont_wght.ttf`
- `CormorantGaramond-Italic-VariableFont_wght.ttf`
- `Nunito-VariableFont_wght.ttf`
- `Nunito-Italic-VariableFont_wght.ttf`

### 8.2 Configuración actual

En `src/app/layout.tsx` se configuran fuentes con `next/font`:

- `Baskervville`, como fuente display/serif principal.
- `Inter`, como fuente auxiliar.
- `Nunito`, desde archivos locales, como fuente de menú/UI.

En `src/app/globals.css` se corrigió la herencia tipográfica:

- `--font-display`
- `--font-menu`
- `font-family` base del `body`
- pesos específicos para privacidad y títulos del blog.

### 8.3 Corrección aplicada

El problema detectado era de cascada CSS:

- Las variables reales generadas por `next/font` estaban disponibles en `<body>`.
- Los aliases `--font-display` y `--font-menu` estaban inicialmente en `:root`.
- Al no existir las variables reales en ese nivel, algunos shorthand `font: ... var(...)` quedaban inválidos.
- El navegador terminaba usando una fuente sans-serif de fallback en componentes donde debía verse la fuente original.

Solución:

- Tailwind se carga primero.
- CSS legacy se carga después.
- Los aliases tipográficos se definen en `body`, donde existen las variables de `next/font`.
- Se mantuvieron las clases CSS originales para conservar pesos, tamaños y jerarquía visual.

### 8.4 Auditoría tipográfica página por página

Se generaron reportes comparando estilos computados entre mockup original y Next.js.

Reportes:

- `TYPOGRAPHY_AUDIT.md`
- `reports/typography-audit.md`
- `reports/typography-audit.json`
- `reports/typography-mobile-audit.md`
- `reports/typography-mobile-audit.json`

Rutas desktop verificadas:

| Vista | Resultado |
| --- | --- |
| `/` | 14/14 coincidencias |
| `/clases` | 9/9 coincidencias |
| `/clases/primer-contacto-con-torno` | 13/13 coincidencias |
| `/workshops` | 6/6 coincidencias |
| `/workshops/gran-formato` | 5/5 coincidencias |
| `/reservas-privadas` | 6/6 coincidencias |
| `/reservas-privadas/experiencia-para-dos` | 5/5 coincidencias |
| `/gift-card` | 6/6 coincidencias |
| `/gift-card/beginner-class` | 6/6 coincidencias |
| `/shop` | 8/8 coincidencias |
| `/shop/taza-irregular-azul` | 8/8 coincidencias |
| `/blog` | 11/11 coincidencias |
| `/blog/como-empezar-una-pieza-sin-tenerlo-todo-claro` | 7/7 coincidencias |
| `/carrito` | 6/6 coincidencias |
| `/el-estudio` | 11/11 coincidencias |
| `/politica-privacidad` | 5/5 coincidencias |

Rutas mobile verificadas con viewport de 390px y menú mobile abierto:

| Vista | Resultado |
| --- | --- |
| `/` | 7/7 coincidencias |
| `/clases` | 8/8 coincidencias |
| `/clases/primer-contacto-con-torno` | 7/7 coincidencias |
| `/shop` | 5/5 coincidencias |
| `/blog` | 6/6 coincidencias |
| `/el-estudio` | 6/6 coincidencias |

## 9. SEO y metadata

Se implementó metadata base y metadata dinámica para páginas de detalle.

Archivos relacionados:

- `src/app/layout.tsx`
- `src/lib/metadata.ts`
- páginas dinámicas `page.tsx`

Implementación:

- Idioma `es` en el layout.
- Metadata base del sitio.
- `generateMetadata` en rutas dinámicas.
- `notFound()` cuando el slug no existe o no corresponde al tipo de vista.
- Slugs limpios conservados desde los datos originales.

## 10. Carrito

Archivo principal:

- `src/lib/cart.ts`

Componente:

- `src/components/shop/Cart.tsx`

Características:

- Clave conservada: `casarosier_cart_v1`.
- Lectura segura sólo en cliente.
- Escritura en `localStorage`.
- Agregar producto.
- Eliminar producto.
- Limpiar carrito.
- Compatibilidad con carrito previamente guardado.
- Evita uso de `window`/`localStorage` en Server Components.

## 11. Tailwind y CSS legacy

Tailwind se integró sin destruir el CSS original.

Archivo Tailwind:

- `src/app/tailwind.css`

CSS global complementario:

- `src/app/globals.css`

CSS original conservado:

- `src/app/legacy/*.css`

Orden de importación actual en `src/app/layout.tsx`:

1. Tailwind.
2. CSS legacy.
3. Ajustes globales propios de la migración.

Decisión técnica:

Se evitó convertir todo a Tailwind de golpe porque el objetivo principal era preservar la apariencia del mockup. Tailwind quedó disponible para wrappers, utilidades y futuros refactors, pero los bloques visuales complejos se mantienen con clases originales.

## 12. Validaciones ejecutadas

### 12.1 Lint

Comando:

```bash
npm run lint
```

Resultado:

- Correcto.
- Sin errores reportados.

### 12.2 Typecheck

Comando:

```bash
npm run typecheck
```

Resultado:

- Correcto.
- TypeScript estricto sin errores.

### 12.3 Build de producción

Comando:

```bash
npm run build
```

Resultado:

- Correcto.
- Compilación exitosa.
- 33 páginas generadas.

Resumen del build:

- Rutas estáticas prerenderizadas.
- Rutas dinámicas generadas con SSG.
- `/_not-found` incluido por Next.js.
- Sin errores de compilación.

### 12.4 Auditoría de dependencias

Comando:

```bash
npm audit --audit-level=moderate
```

Resultado:

- Se detectaron 2 vulnerabilidades moderadas asociadas a `postcss` dentro de `next`.
- `npm audit fix --force` propone instalar `next@9.3.3`, lo cual sería un downgrade mayor y rompería el stack actual.

Decisión:

- No se aplicó `npm audit fix --force`.
- Queda pendiente actualizar Next.js cuando exista una versión estable que incorpore la corrección sin downgrade.

## 13. Archivos principales creados o modificados

### 13.1 Configuración

- `package.json`
- `package-lock.json`
- `next.config.ts`
- `tsconfig.json`
- `postcss.config.mjs`
- `eslint.config.mjs`
- `.gitignore`

### 13.2 App Router

- `src/app/layout.tsx`
- `src/app/page.tsx`
- `src/app/home/page.tsx`
- `src/app/clases/page.tsx`
- `src/app/clases/[slug]/page.tsx`
- `src/app/workshops/page.tsx`
- `src/app/workshops/[slug]/page.tsx`
- `src/app/reservas-privadas/page.tsx`
- `src/app/reservas-privadas/[slug]/page.tsx`
- `src/app/gift-card/page.tsx`
- `src/app/gift-card/[slug]/page.tsx`
- `src/app/shop/page.tsx`
- `src/app/shop/[slug]/page.tsx`
- `src/app/blog/page.tsx`
- `src/app/blog/[slug]/page.tsx`
- `src/app/carrito/page.tsx`
- `src/app/el-estudio/page.tsx`
- `src/app/politica-privacidad/page.tsx`

### 13.3 Estilos

- `src/app/tailwind.css`
- `src/app/globals.css`
- `src/app/legacy/base.css`
- `src/app/legacy/home.css`
- `src/app/legacy/classes.css`
- `src/app/legacy/shop.css`
- `src/app/legacy/blog.css`
- `src/app/legacy/cart.css`
- `src/app/legacy/footer.css`
- `src/app/legacy/cookiebar.css`
- `src/app/legacy/promo-entry.css`
- `src/app/legacy/site.css`
- `src/app/legacy/studio.css`

### 13.4 Datos y utilidades

- `src/data/types.ts`
- `src/data/navigation.ts`
- `src/data/classes.ts`
- `src/data/shop.ts`
- `src/data/blog.ts`
- `src/lib/assets.ts`
- `src/lib/cart.ts`
- `src/lib/metadata.ts`
- `src/lib/routes.ts`
- `src/lib/utils.ts`

### 13.5 Componentes

- `src/components/layout/*`
- `src/components/home/*`
- `src/components/collections/*`
- `src/components/shop/*`
- `src/components/blog/*`
- `src/components/studio/*`
- `src/components/ui/PromoEntry.tsx`

### 13.6 Reportes y scripts de auditoría

- `TYPOGRAPHY_AUDIT.md`
- `reports/typography-audit.md`
- `reports/typography-audit.json`
- `reports/typography-mobile-audit.md`
- `reports/typography-mobile-audit.json`
- `scripts/audit-typography.mjs`
- `scripts/audit-typography-mobile.mjs`

## 14. Decisiones técnicas relevantes

1. Se conservó CSS legacy para proteger la fidelidad visual.
2. Tailwind se integró progresivamente, no como reescritura completa.
3. Las rutas dinámicas usan datos tipados y `generateStaticParams`.
4. Las páginas inexistentes usan `notFound()`.
5. Toda lógica con navegador vive en componentes client.
6. El carrito mantiene la clave original de `localStorage`.
7. Los assets faltantes se resuelven con fallback centralizado, no con cambios silenciosos en los datos.
8. La tipografía se verificó con estilos computados, no sólo por inspección manual.
9. No se aplicó `npm audit fix --force` porque proponía un downgrade incompatible.

## 15. Qué hace falta o queda pendiente

Pendientes reales detectados:

1. Recuperar los 7 archivos faltantes del mockup original y reemplazar los fallbacks temporales.
2. Actualizar Next.js cuando exista versión estable que resuelva la alerta moderada de PostCSS sin forzar downgrade.
3. Si se desea una garantía visual todavía más fuerte, ejecutar comparación por screenshots pixel-a-pixel en varios breakpoints: 375, 768, 1024 y 1440 px.
4. Revisar contenido final con cliente/brand owner si aparecen textos o imágenes definitivas que no estaban en el mockup entregado.

No se detectaron pendientes bloqueantes para correr el proyecto:

- El build pasa.
- TypeScript pasa.
- ESLint pasa.
- Las rutas principales existen.
- Las rutas dinámicas se generan.
- La tipografía visible auditada coincide con el mockup en desktop y mobile.

## 16. Conclusión

La migración está funcional y lista como base de entrega técnica. El sitio conserva la estructura visual del mockup original, mantiene sus textos, slugs, assets disponibles, tipografías y comportamiento principal, pero ahora está montado sobre una arquitectura Next.js con TypeScript, componentes reutilizables, datos tipados y validaciones de build.

Lo único que no puede cerrarse al 100% desde código es la ausencia de los assets originales faltantes, porque esos archivos no existen físicamente en la carpeta fuente. Mientras se recuperan, la app usa fallbacks documentados para evitar imágenes rotas.
