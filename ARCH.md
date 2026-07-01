# ARCH.md - Arquitectura Casa Rosier con CMS

Documento de referencia para el proyecto actual Casa Rosier Ceramica. Esta
version adapta la arquitectura del CMS fuente a la app existente con `src/`,
sitio publico y arquitectura screaming.

## 1. Vision general

Casa Rosier Ceramica es una aplicacion Next.js con sitio publico y CMS privado.
El sitio publico muestra clases, workshops, reservas privadas, gift cards, blog,
tienda y pagina de estudio. El CMS permite gestionar contenido y operaciones
internas desde rutas privadas bajo `/admin/*`.

La autenticacion administrativa vive en `/auth` y redirige al panel despues de
iniciar sesion.

## 2. Stack

| Capa | Tecnologia |
| --- | --- |
| Framework | Next.js 16 App Router |
| UI | React 19 |
| Lenguaje | TypeScript estricto |
| Estilos | Tailwind CSS v4 + CSS legacy publico |
| Backend CMS | Supabase + fallback JSON local |
| Auth | Sesion local firmada + Supabase Auth |
| Iconos CMS | Material Symbols Outlined |
| Fuentes CMS | Manrope + Inter |

## 3. Estructura implementada

```text
src/app/auth/                  Login administrativo
src/app/admin/                 Paginas CMS privadas
src/app/api/auth/              Login/logout
src/app/api/admin/             API privada CMS
src/components/admin/          Tablas, formularios y shell CMS
src/components/layout/         Layout publico y admin
src/components/ui/             UI reusable del CMS
src/lib/admin/navigation.ts    Mapa de navegacion admin
src/lib/auth/                  Sesion, roles y autorizacion
src/lib/cms/                   Capa de datos por modulo
src/lib/supabase/              Clientes y tipos Supabase
data/                          Fallback JSON local
supabase/migrations/           Schema SQL del CMS
```

## 4. Rutas admin

Todas las pantallas administrativas usan `/admin`:

| Area | Rutas |
| --- | --- |
| Inicio | `/admin`, `/admin/dashboard` |
| Clases y talleres | `/admin/clases`, `/admin/workshops`, `/admin/experiencias`, `/admin/gift-cards` |
| Contenido | `/admin/bitacora`, `/admin/pages`, `/admin/landing-pages` |
| Formularios | `/admin/formularios`, `/admin/mensajes`, `/admin/reservas` |
| Componentes | `/admin/components/headers`, `social-galleries`, `testimonials`, `footers`, `cta-blocks`, `promo-banners`, `faqs`, `teachers` |
| Sitio | `/admin/menu`, `/admin/media`, `/admin/redirecciones` |
| Tienda | `/admin/shop/products`, `categories`, `orders`, `coupons`, `shipping` |
| Sistema | `/admin/users`, `/admin/settings`, `/admin/marketing`, `/admin/legal-cookies`, `/admin/history-logs`, `/admin/trash` |

## 5. Autenticacion y autorizacion

El acceso a `/admin/*` se valida en `src/app/admin/layout.tsx`.

`requireAdminProfile()` acepta:

- Sesion local firmada con `LOCAL_ADMIN_EMAIL` y `LOCAL_ADMIN_PASSWORD`.
- Sesion Supabase Auth con perfil en `profiles`.

Roles permitidos:

- `admin`
- `editor`

El primer acceso de desarrollo usa:

```text
name@admin.com
admin123
```

En produccion se debe cambiar `LOCAL_AUTH_SECRET`, configurar Supabase y crear
perfiles administrativos reales.

## 6. Capa de datos CMS

Cada modulo en `src/lib/cms/` encapsula lectura, escritura, normalizacion,
soft delete, restore y logs cuando aplica.

Patron:

1. Intentar Supabase con `createAdminClient()`.
2. Si Supabase no esta disponible o no devuelve datos, usar `data/*.json`.
3. En operaciones de escritura, persistir localmente y hacer upsert best-effort
   en Supabase.

Esto permite desarrollar y validar el CMS sin bloquearse por credenciales
remotas, pero mantiene la ruta de produccion preparada.

## 7. Supabase

Variables requeridas para entorno conectado:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

Las migraciones en `supabase/migrations/` crean:

- `profiles`
- `offerings`
- `blog_posts`
- `pages`
- `landing_pages`
- `forms`
- `form_submissions`
- `reservations`
- `media_assets`
- `menus`
- `products`, `orders`, `coupons`, `shipping_methods`
- `settings`, `marketing_settings`, `legal_settings`
- `redirects`, `history_logs`, `trash_items`

## 8. Diseno CMS

El CMS replica el diseno fuente:

- Sidebar fijo de 280px.
- Canvas `#f8f9ff`.
- Cards blancas con borde `#cac4d4`.
- Primario purpura `#674bb5`.
- Secundario naranja `#9d4300`.
- Tipografia Manrope para contenido e Inter para labels.
- Material Symbols Outlined para iconografia.
- Botones solid/outlined, badges, metric cards, tablas y acciones rapidas.

Los tokens Tailwind estan en `src/app/tailwind.css`. Los estilos semanticos
heredados del CMS estan aislados bajo `.cms-admin` en `src/app/globals.css`.

## 9. Integracion con sitio publico

El sitio publico conserva su estructura por dominio en `src/features`.

El footer incluye el enlace "Administración" hacia `/auth`. `SiteChrome`
oculta WhatsApp y cookies en `/auth` y `/admin/*` para no interferir con el CMS.

## 10. Validaciones

Validaciones ejecutadas:

```bash
npm run typecheck
npm run lint
npm run build
```

Validaciones HTTP:

- `/auth` responde 200.
- `/admin/dashboard` sin sesion redirige a `/auth`.
- `/api/auth/login` con `name@admin.com / admin123` responde 200.
- `/admin/dashboard` con cookie de sesion responde 200.
- `/api/auth/login` con password incorrecto responde 401.

## 11. Pendientes conocidos

- Configurar credenciales Supabase reales.
- Ejecutar migraciones en el proyecto Supabase.
- Cambiar `LOCAL_AUTH_SECRET` antes de produccion.
- Resolver advertencias heredadas de lint por imports no usados cuando se
  limpien los formularios amplios del CMS.
- Revisar visualmente en navegador integrado cuando esa herramienta este
  disponible.
