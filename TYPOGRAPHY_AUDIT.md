# Auditoría de tipografía

Se verificó la tipografía computada en navegador headless comparando el mockup original contra la migración Next.js.

## Corrección aplicada

El problema principal era la ubicación de los aliases tipográficos:

- `--font-baskervville`, `--font-nunito` y `--font-inter` son variables generadas por `next/font` sobre el `<body>`.
- Los aliases `--font-display` y `--font-menu` estaban definidos en `:root`, donde esas variables todavía no existían.
- Eso hacía que muchos `font: ... var(--font-display)` y `font: ... var(--font-menu)` quedaran inválidos y el navegador cayera al reset sans-serif de Tailwind.

La solución fue:

- Cargar Tailwind primero.
- Cargar el CSS legacy después.
- Definir `--font-display` y `--font-menu` en `body`, junto a las variables reales de `next/font`.
- Reponer pesos nativos que el mockup heredaba del navegador en privacidad y títulos `h2` del artículo de blog.

## Rutas desktop verificadas

Todas coinciden en los selectores visibles auditados:

- `/`
- `/clases`
- `/clases/primer-contacto-con-torno`
- `/workshops`
- `/workshops/gran-formato`
- `/reservas-privadas`
- `/reservas-privadas/experiencia-para-dos`
- `/gift-card`
- `/gift-card/beginner-class`
- `/shop`
- `/shop/taza-irregular-azul`
- `/blog`
- `/blog/como-empezar-una-pieza-sin-tenerlo-todo-claro`
- `/carrito`
- `/el-estudio`
- `/politica-privacidad`

## Rutas mobile verificadas

Con viewport de 390px y menú mobile abierto:

- `/`
- `/clases`
- `/clases/primer-contacto-con-torno`
- `/shop`
- `/blog`
- `/el-estudio`

## Reportes generados

- `reports/typography-audit.md`
- `reports/typography-audit.json`
- `reports/typography-mobile-audit.md`
- `reports/typography-mobile-audit.json`
