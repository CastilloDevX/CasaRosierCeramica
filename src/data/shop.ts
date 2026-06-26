import type { ShopCategory, ShopItem } from "@/data/types";

export const shopCategories = [
  {
    "key": "all",
    "label": "Todas"
  },
  {
    "key": "jarrones",
    "label": "Jarrones"
  },
  {
    "key": "tazas",
    "label": "Tazas"
  },
  {
    "key": "platos",
    "label": "Platos"
  },
  {
    "key": "cuencos",
    "label": "Cuencos"
  },
  {
    "key": "esculturas",
    "label": "Esculturas"
  },
  {
    "key": "piezas-unicas",
    "label": "Piezas unicas"
  }
] satisfies ShopCategory[];

export const shopItems = [
  {
    "id": "shop-01",
    "slug": "jarron-de-gres-blanco",
    "name": "Jarron de gres blanco",
    "category": "jarrones",
    "categoryLabel": "Jarrones",
    "price": "85 EUR",
    "availability": "Disponible",
    "image": "img/clase-2.png",
    "gallery": [
      "img/clase-2.png",
      "img/intro-e.jpg",
      "img/social-4.jpeg"
    ],
    "description": "Un jarron de presencia silenciosa, construido a mano y acabado con un esmalte blanco satinado que suaviza la lectura de la superficie.",
    "details": {
      "Medidas": "18 x 12 cm",
      "Material": "Gres de alta temperatura",
      "Tecnica": "Modelado manual",
      "Acabado": "Esmalte blanco satinado",
      "Ano": "2026"
    },
    "availabilityNote": "Pieza disponible para entrega inmediata.",
    "seoTitle": "Jarron de gres blanco | Casa Rosier Shop",
    "seoDescription": "Pieza ceramica disponible en Casa Rosier: jarron de gres blanco modelado a mano.",
    "order": 1,
    "isPublished": true
  },
  {
    "id": "shop-02",
    "slug": "taza-irregular-azul",
    "name": "Taza irregular azul",
    "category": "tazas",
    "categoryLabel": "Tazas",
    "price": "32 EUR",
    "availability": "Disponible",
    "image": "img/social-3.jpg",
    "gallery": [
      "img/social-3.jpg",
      "img/intro-d.jpg",
      "img/workshop-3.jpg"
    ],
    "description": "Taza de perfil irregular y gesto visible, pensada para el uso cotidiano sin perder una lectura artesanal y muy directa.",
    "details": {
      "Medidas": "9 x 8 cm",
      "Material": "Gres",
      "Tecnica": "Torno y alteracion manual",
      "Acabado": "Esmalte azul brillante",
      "Ano": "2026"
    },
    "availabilityNote": "Hay varias unidades disponibles dentro de una serie pequena.",
    "seoTitle": "Taza irregular azul | Casa Rosier Shop",
    "seoDescription": "Taza ceramica azul de serie pequena disponible en Casa Rosier Shop.",
    "order": 2,
    "isPublished": true
  },
  {
    "id": "shop-03",
    "slug": "plato-de-superficie-calida",
    "name": "Plato de superficie calida",
    "category": "platos",
    "categoryLabel": "Platos",
    "price": "42 EUR",
    "availability": "Disponible",
    "image": "img/intro-b.jpg",
    "gallery": [
      "img/intro-b.jpg",
      "img/intro-a.jpg",
      "img/social-2.jpg"
    ],
    "description": "Plato de borde abierto y tono calido, pensado como pieza funcional con una superficie suave y ligeramente irregular.",
    "details": {
      "Medidas": "24 x 24 cm",
      "Material": "Gres claro",
      "Tecnica": "Placa y refinado manual",
      "Acabado": "Esmalte crema satinado",
      "Ano": "2026"
    },
    "availabilityNote": "Disponible como pieza individual.",
    "seoTitle": "Plato de superficie calida | Casa Rosier Shop",
    "seoDescription": "Plato ceramico de superficie calida disponible en Casa Rosier Shop.",
    "order": 3,
    "isPublished": true
  },
  {
    "id": "shop-04",
    "slug": "cuenco-de-esmalte-mate",
    "name": "Cuenco de esmalte mate",
    "category": "cuencos",
    "categoryLabel": "Cuencos",
    "price": "48 EUR",
    "availability": "Disponible",
    "image": "img/clase-1.png",
    "gallery": [
      "img/clase-1.png",
      "img/intro-c.jpg",
      "img/social-1.jpg"
    ],
    "description": "Cuenco de volumen limpio y esmalte mate, con un acabado calmado que deja a la forma tomar protagonismo.",
    "details": {
      "Medidas": "16 x 16 cm",
      "Material": "Gres oscuro",
      "Tecnica": "Torno",
      "Acabado": "Esmalte negro mate",
      "Ano": "2026"
    },
    "availabilityNote": "Disponible en una serie muy corta.",
    "seoTitle": "Cuenco de esmalte mate | Casa Rosier Shop",
    "seoDescription": "Cuenco ceramico de esmalte mate disponible en Casa Rosier Shop.",
    "order": 4,
    "isPublished": true
  },
  {
    "id": "shop-05",
    "slug": "pieza-escultorica-organica",
    "name": "Pieza escultorica organica",
    "category": "esculturas",
    "categoryLabel": "Esculturas",
    "price": "120 EUR",
    "availability": "Pieza unica",
    "image": "img/gift-1.jpg",
    "gallery": [
      "img/gift-1.jpg",
      "img/social-4.jpeg",
      "img/intro-e.jpg"
    ],
    "description": "Una pieza escultorica de lectura organica, construida desde el volumen y la tension entre hueco, curva y materia.",
    "details": {
      "Medidas": "28 x 18 cm",
      "Material": "Gres chamotado",
      "Tecnica": "Construccion manual",
      "Acabado": "Sin esmalte, superficie pulida",
      "Ano": "2026"
    },
    "availabilityNote": "Solo existe esta pieza.",
    "seoTitle": "Pieza escultorica organica | Casa Rosier Shop",
    "seoDescription": "Escultura ceramica organica y pieza unica disponible en Casa Rosier Shop.",
    "order": 5,
    "isPublished": true
  },
  {
    "id": "shop-06",
    "slug": "serie-mineral-01",
    "name": "Serie mineral 01",
    "category": "piezas-unicas",
    "categoryLabel": "Piezas unicas",
    "price": "140 EUR",
    "availability": "Pieza unica",
    "image": "img/workshop-1.jpg",
    "gallery": [
      "img/workshop-1.jpg",
      "img/social-5.jpg",
      "img/intro-d.jpg"
    ],
    "description": "Una pieza unica de caracter mas contemplativo, con superficie mineral y un equilibrio entre estructura y gesto.",
    "details": {
      "Medidas": "31 x 14 cm",
      "Material": "Gres y engobe",
      "Tecnica": "Modelado manual",
      "Acabado": "Superficie mineral mate",
      "Ano": "2026"
    },
    "availabilityNote": "Pieza unica disponible.",
    "seoTitle": "Serie mineral 01 | Casa Rosier Shop",
    "seoDescription": "Pieza unica ceramica de la serie mineral disponible en Casa Rosier Shop.",
    "order": 6,
    "isPublished": true
  }
] satisfies ShopItem[];

export const published = shopItems.filter((item) => item.isPublished).sort((a, b) => a.order - b.order);

export function byCategory(category?: string) {
  if (!category || category === "all") return published;
  return published.filter((item) => item.category === category);
}

export function bySlug(slug: string) {
  return shopItems.find((item) => item.slug === slug) ?? null;
}
