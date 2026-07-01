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
  legal, auditoria y papelera.

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
- `/admin/bitacora`, `/admin/pages`, `/admin/landing-pages`
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
