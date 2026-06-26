import type { NavigationItem } from "@/data/types";

export const navigation: NavigationItem[] = [
  { label: "Inicio", href: "/#hero", order: 1, visible: true },
  {
    label: "Clases",
    href: "/clases",
    order: 2,
    visible: true,
    children: [
      { label: "Todas las clases", href: "/clases", order: 1, visible: true },
      {
        label: "Primer contacto con torno",
        href: "/clases/primer-contacto-con-torno",
        order: 2,
        visible: true
      },
      {
        label: "Modelado expresivo",
        href: "/clases/modelado-expresivo",
        order: 3,
        visible: true
      },
      {
        label: "Color y acabados",
        href: "/clases/color-y-acabados",
        order: 4,
        visible: true
      }
    ]
  },
  {
    label: "Workshops",
    href: "/workshops",
    order: 3,
    visible: true,
    children: [
      {
        label: "Todos los workshops",
        href: "/workshops",
        order: 1,
        visible: true
      },
      {
        label: "Gran formato",
        href: "/workshops/gran-formato",
        order: 2,
        visible: true
      },
      {
        label: "Torno avanzado",
        href: "/workshops/torno-avanzado",
        order: 3,
        visible: true
      },
      {
        label: "Experimentacion material",
        href: "/workshops/experimentacion-material",
        order: 4,
        visible: true
      }
    ]
  },
  {
    label: "Experiencias",
    href: "/reservas-privadas",
    order: 4,
    visible: true,
    children: [
      {
        label: "Todas las experiencias",
        href: "/reservas-privadas",
        order: 1,
        visible: true
      },
      {
        label: "Experiencia para dos",
        href: "/reservas-privadas/experiencia-para-dos",
        order: 2,
        visible: true
      },
      {
        label: "Celebracion privada",
        href: "/reservas-privadas/celebracion-privada",
        order: 3,
        visible: true
      },
      {
        label: "Sesion para equipos",
        href: "/reservas-privadas/sesion-para-equipos",
        order: 4,
        visible: true
      }
    ]
  },
  {
    label: "Gift Card",
    href: "/gift-card",
    order: 5,
    visible: true,
    children: [
      {
        label: "Todas las gift cards",
        href: "/gift-card",
        order: 1,
        visible: true
      },
      {
        label: "Beginner Class",
        href: "/gift-card/beginner-class",
        order: 2,
        visible: true
      },
      {
        label: "Sculpture Class",
        href: "/gift-card/sculpture-class",
        order: 3,
        visible: true
      }
    ]
  },
  {
    label: "El estudio",
    href: "/el-estudio",
    order: 6,
    visible: true,
    children: [
      {
        label: "El estudio",
        href: "/el-estudio",
        order: 1,
        visible: true
      },
      { label: "Bitacora", href: "/blog", order: 2, visible: true }
    ]
  },
  { label: "Shop", href: "/shop", order: 7, visible: true }
];
