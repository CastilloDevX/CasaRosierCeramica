# Casa Rosier Cerámica

Sitio web de Casa Rosier Cerámica desarrollado con Next.js, React, TypeScript y Tailwind CSS.

Deploy público: [https://casa-rosier-ceramica.vercel.app](https://casa-rosier-ceramica.vercel.app)

Escrito por: Jose Manuel Castillo Queh  
Ingeniero de Software

## Descripción

Este proyecto corresponde a la migración de un sitio estático de Casa Rosier hacia una arquitectura moderna basada en Next.js App Router. La prioridad de la implementación fue conservar la identidad visual, estructura, jerarquía tipográfica, responsive, navegación, textos, imágenes e interacciones del sitio original, evitando rediseños innecesarios.

El resultado es una aplicación web tipada, mantenible y lista para despliegue en Vercel.

## Stack técnico

- Next.js con App Router.
- React.
- TypeScript en modo estricto.
- Tailwind CSS integrado de forma progresiva.
- CSS legacy conservado para proteger fidelidad visual.
- Datos migrados a módulos TypeScript.
- Componentes reutilizables.
- Persistencia de carrito con `localStorage`.

## Rutas principales

- `/`
- `/home`
- `/clases`
- `/clases/[slug]`
- `/workshops`
- `/workshops/[slug]`
- `/reservas-privadas`
- `/reservas-privadas/[slug]`
- `/gift-card`
- `/gift-card/[slug]`
- `/shop`
- `/shop/[slug]`
- `/blog`
- `/blog/[slug]`
- `/carrito`
- `/el-estudio`
- `/politica-privacidad`

## Estructura general

```txt
src/
  app/
  components/
  data/
  lib/

public/
  img/
  fonts/
```

## Scripts disponibles

```bash
npm run dev
npm run build
npm run start
npm run lint
npm run typecheck
```

## Validaciones realizadas

- `npm run lint`: correcto.
- `npm run typecheck`: correcto.
- `npm run build`: correcto.
- Auditoría tipográfica desktop y mobile contra las vistas principales.

## Notas técnicas

- Se conservaron estilos CSS existentes en `src/app/legacy/` para mantener la apariencia visual.
- Tailwind CSS se usa como capa progresiva, no como reemplazo completo del CSS original.
- Las rutas dinámicas usan datos tipados y generación estática.
- Las páginas no existentes usan `notFound()`.
- Toda lógica dependiente de navegador vive en componentes client.
- El carrito conserva la clave `casarosier_cart_v1`.

## Pendientes conocidos

- Sustituir fallbacks temporales cuando se recuperen los assets originales faltantes.
- Actualizar Next.js cuando exista una versión estable que resuelva los avisos moderados de PostCSS sin requerir downgrade.
