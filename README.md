# Casa Rosier Ceramica

Sitio web y CMS privado de Casa Rosier Ceramica, desarrollado con Next.js App
Router, React, TypeScript, Tailwind CSS y Supabase.

Deploy publico: [https://casa-rosier-ceramica.vercel.app](https://casa-rosier-ceramica.vercel.app)

## Vision general

El proyecto contiene dos superficies:

- Sitio publico: experiencia editorial y comercial para clases, workshops,
  reservas privadas, gift cards, blog, tienda y pagina de estudio.
- CMS privado: panel administrativo bajo `/admin/*` para gestionar contenido,
  clases, formularios, mensajes, tienda, multimedia, menus, ajustes, marketing,
  legal, auditoria, papelera y paginas editoriales personalizables.

El acceso administrativo inicia en `/auth`. El enlace publico "Administración"
esta en el footer y envia al login. La credencial inicial local es:

```text
name@admin.com
admin123
```

## Stack tecnico

- Next.js 16 con App Router.
- React 19.
- TypeScript en modo estricto.
- Tailwind CSS v4.
- Supabase Auth, PostgreSQL y Storage.
- `@supabase/ssr` y `@supabase/supabase-js`.
- Persistencia local JSON como fallback funcional del CMS.
- CSS legacy conservado para fidelidad visual del sitio publico.

## Arquitectura

La app conserva una arquitectura screaming: las carpetas expresan primero el
negocio y luego la tecnologia.

```text
src/
  app/
    admin/                  Rutas privadas del CMS.
    api/admin/              Endpoints privados del CMS.
    api/auth/               Login/logout administrativo.
    auth/                   Pantalla de autenticacion.
    (public routes)         Sitio publico Casa Rosier.
  components/
    admin/                  Formularios, tablas y widgets del CMS.
    layout/                 Layout publico y layout admin.
    ui/                     UI compartida del CMS.
  data/                     Datos publicos estaticos actuales.
  features/                 Dominios del sitio publico.
  lib/
    admin/                  Navegacion del panel.
    auth/                   Sesion local y autorizacion admin.
    cms/                    Acceso a datos del CMS.
    supabase/               Clientes y tipos Supabase.
data/                       Fallback JSON editable por el CMS.
supabase/migrations/        Migraciones SQL idempotentes.
```

## CMS privado

Todas las rutas del CMS usan el prefijo `/admin`:

- `/admin/dashboard`
- `/admin/clases`, `/admin/workshops`, `/admin/experiencias`, `/admin/gift-cards`
- `/admin/bitacora`, `/admin/estudio`, `/admin/el-estudio`, `/admin/pages`,
  `/admin/landing-pages`
- `/admin/formularios`, `/admin/mensajes`, `/admin/reservas`
- `/admin/components/*`
- `/admin/menu`, `/admin/media`
- `/admin/shop/*`
- `/admin/users`, `/admin/settings`, `/admin/marketing`, `/admin/legal-cookies`
- `/admin/history-logs`, `/admin/trash`

El diseno del CMS replica el panel fuente basado en Google Stitch/Material
Design 3: sidebar fijo, paleta purpura-naranja, tipografia Manrope/Inter,
Material Symbols, metric cards, tablas, acciones rapidas y botones con estados
consistentes.

### Editores de paginas publicas

El CMS incluye editores completos para paginas publicas con hero personalizable,
vista previa real y barra anclada de acciones:

- Clases, Workshops, Experiencias y Gift Cards: hero con imagen, hero
  tipografico y hero con presentacion; posiciones responsive de logo/menu;
  adiciones opcionales y vista previa final.
- El Estudio: pestañas de Hero, Especialistas, Texto libre, Adiciones y Vista
  previa. El contenido se guarda en `studio_page_settings` y en `teachers`.
- Bitacora: pestañas de Hero, Bitacoras, Adiciones y Vista previa. El contenido
  se guarda en `blog_page_settings`, `blog_posts` y `blog_post_blocks`.
- Papelera: filtros por entidad, fecha y buscador, con modal de confirmacion
  para eliminacion definitiva.

## Autenticacion

`/admin/*` esta protegido desde `src/app/admin/layout.tsx` mediante
`requireAdminProfile()`.

Flujos soportados:

- Sesion local firmada para el admin inicial `name@admin.com / admin123`.
- Supabase Auth cuando se configuran `NEXT_PUBLIC_SUPABASE_URL`,
  `NEXT_PUBLIC_SUPABASE_ANON_KEY` y `SUPABASE_SERVICE_ROLE_KEY`.
- Autorizacion por perfil con rol `admin` o `editor`.

Variables:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
LOCAL_ADMIN_EMAIL=name@admin.com
LOCAL_ADMIN_PASSWORD=admin123
LOCAL_AUTH_SECRET=cambiar_este_secreto_en_produccion
```

## Datos y publicacion

La capa `src/lib/cms/*` intenta leer y escribir en Supabase con cliente
privilegiado. Si Supabase no esta disponible, usa los archivos JSON en `data/`
para mantener el panel funcional durante desarrollo.

Las migraciones SQL viven en `supabase/migrations/` e incluyen tablas de
contenido, tienda, formularios, auditoria, perfiles, RLS y triggers.

Cambios recientes de base de datos para los editores nuevos:

- `022_rich_text_markdown_support.sql`: amplia campos editoriales a `text`.
- `023_offering_cms_section_controls.sql`: convierte `offerings.details` a
  `jsonb` para guardar controles de secciones y CTA.
- `024_studio_page_settings.sql`: crea `studio_page_settings`.
- `025_blog_post_hero_settings.sql`: agrega `blog_posts.hero` y migra hero
  embebido en contenido antiguo cuando exista.
- `026_blog_page_settings.sql`: crea `blog_page_settings`.
- `027_page_settings_defaults.sql`: inserta defaults iniciales para Estudio y
  Blog sin sobrescribir contenido ya guardado.

Para aplicar migraciones al proyecto Supabase enlazado:

```powershell
$env:SUPABASE_ACCESS_TOKEN="tu_token_de_supabase"
$env:SUPABASE_TELEMETRY_DISABLED="1"
npx supabase db push --linked --yes
```

Para revisar que local y remoto esten sincronizados:

```powershell
$env:SUPABASE_ACCESS_TOKEN="tu_token_de_supabase"
$env:SUPABASE_TELEMETRY_DISABLED="1"
npx supabase migration list --linked
```

No guardes tokens de Supabase en el repositorio. Usalos solo como variables de
entorno locales o secretos del proveedor de deploy.

## Scripts

```bash
npm run dev
npm run typecheck
npm run lint
npm run build
```

## Verificacion realizada

- `npm run typecheck`
- `npm run lint`
- `npm run build`
- HTTP `/auth` devuelve 200.
- `/admin/dashboard` sin sesion redirige a `/auth`.
- Login inicial devuelve 200 y crea cookie de sesion.
- `/admin/dashboard` con sesion devuelve 200.
- Login con password incorrecto devuelve 401.
