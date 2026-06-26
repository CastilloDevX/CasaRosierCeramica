import type { ExperienceItem, ExperienceKind } from "@/data/types";

export const experiences = [
  {
    "id": "class-01",
    "kind": "class",
    "slug": "primer-contacto-con-torno",
    "title": "Primer contacto con torno",
    "subtitle": "Experiencia ceramica: modela y decora tu pieza",
    "category": "Clases - Iniciacion",
    "excerpt": "Tecnica base para centrar, levantar y terminar tus primeras piezas.",
    "description": [
      "Podras alternar entre sesiones de modelado y las practicas basicas de torno, creando piezas sencillas para entender como responde la arcilla en cada etapa.",
      "Disponemos de una biblioteca propia de engobes y esmaltes, con materiales pensados para que explores el color, la superficie y la coccion con acompanamiento cercano.",
      "La idea es que entiendas cada decision: composicion, estados de la arcilla, herramientas y pequenos gestos que transforman el resultado."
    ],
    "coverImage": "img/clase-1.png",
    "heroImage": "img/hero-bg.jpg",
    "heroTitle": "Un dia de Ceramica",
    "listingTitle": "Cursos y talleres de ceramica",
    "listingSubtitle": "En Barcelona",
    "introHighlight": "Una experiencia guiada para crear y decorar tu primera pieza, sin experiencia previa.",
    "galleryImages": [
      "img/social-2.jpg",
      "img/clase-1.png",
      "img/workshop-2.jpg",
      "img/intro-b.jpg"
    ],
    "videoCardImage": "img/social-2.jpg",
    "videoCardLabel": "VIDEO",
    "priceOptions": [
      {
        "label": "Bono 4 clases",
        "price": "100 EUR"
      },
      {
        "label": "Bono 2 clases",
        "price": "70 EUR"
      }
    ],
    "duration": "Sesiones de 2 h.",
    "schedule": [
      {
        "day": "Martes",
        "slots": [
          "10:30 a 12:30",
          "18:00 a 20:00"
        ]
      },
      {
        "day": "Miercoles",
        "slots": [
          "10:00 a 12:00",
          "19:00 a 21:00"
        ]
      },
      {
        "day": "Sabado",
        "slots": [
          "Consultar disponibilidad"
        ]
      }
    ],
    "included": [
      "Engobes y esmaltes",
      "Hornadas",
      "Pastas"
    ],
    "program": [
      {
        "title": "Primera clase: funciones quimicas",
        "content": "Entender la funcion quimica y fisica de un engobe: composicion base, equilibrio arcilla-frita-fundente y comportamiento en crudo y coccion.",
        "points": [
          "Relacion entre mezcla, aplicacion y superficie final.",
          "Lectura basica de defectos y pequenos ajustes."
        ]
      },
      {
        "title": "2da clase: la reologia de los esmaltes",
        "content": "Trabajamos densidad, aplicacion y control del acabado para conseguir resultados consistentes."
      },
      {
        "title": "Como se fabrican los engobes comerciales",
        "content": "Revision de materiales, formulaciones sencillas y criterios para elegir o adaptar productos comerciales."
      }
    ],
    "whatYouWillLearn": [
      "En el taller trabajamos desde la curiosidad y la practica guiada. Queremos que entiendas el proceso y no solo el resultado.",
      "Vas a aprender nociones basicas de modelado, torno, texturas, engobes, color y pequenos recursos de acabado para tus primeras piezas.",
      "Tambien hablaremos de tiempos de secado, ritmo de trabajo y decisiones que ayudan a construir una pieza con mas criterio."
    ],
    "whoCanJoin": [
      "Es un espacio pensado para principiantes, personas sin experiencia previa y alumnas que buscan volver a practicar con acompanamiento.",
      "No es necesario tener conocimientos de ceramica. Solo ganas de trabajar con las manos y tiempo para observar el proceso."
    ],
    "paymentMethods": [
      "Transferencia bancaria",
      "PayPal",
      "Tarjeta de credito",
      "Efectivo",
      "Bizum"
    ],
    "additionalInfo": "Cualquier consulta o informacion adicional que necesites, puedes escribir al WhatsApp 633788860 o al correo info@casarosierceramica.com.",
    "ctaHref": "https://wa.me/34633788860",
    "seoTitle": "Primer contacto con torno | Casa Rosier",
    "seoDescription": "Clase de iniciacion a la ceramica en Barcelona para aprender torno, modelado y decoracion en un entorno editorial y artesanal.",
    "isPublished": true,
    "order": 1
  },
  {
    "id": "class-02",
    "kind": "class",
    "slug": "modelado-expresivo",
    "title": "Modelado expresivo",
    "subtitle": "Experiencia ceramica: volumen, gesto y lenguaje propio",
    "category": "Clases - Modelado",
    "excerpt": "Construccion manual para crear volumen, textura y lenguaje propio.",
    "description": [
      "Una clase pensada para trabajar la pieza desde la mano, el gesto y la observacion del volumen.",
      "Exploramos tecnicas de construccion manual para crear recipientes, pequenas esculturas y objetos utiles con caracter.",
      "La propuesta combina demostracion, practica y correcciones personalizadas."
    ],
    "coverImage": "img/clase-2.png",
    "heroImage": "img/intro-e.jpg",
    "heroTitle": "Modelado expresivo",
    "listingTitle": "Cursos y talleres de ceramica",
    "listingSubtitle": "En Barcelona",
    "introHighlight": "Una sesion para construir volumen y textura con calma, criterio y acompanamiento cercano.",
    "galleryImages": [
      "img/clase-2.png",
      "img/intro-e.jpg",
      "img/social-4.jpeg",
      "img/workshop-1.jpg"
    ],
    "videoCardImage": "img/social-4.jpeg",
    "videoCardLabel": "VIDEO",
    "priceOptions": [
      {
        "label": "Bono 4 clases",
        "price": "110 EUR"
      },
      {
        "label": "Clase suelta",
        "price": "32 EUR"
      }
    ],
    "duration": "Sesiones de 2 h.",
    "schedule": [
      {
        "day": "Lunes",
        "slots": [
          "18:00 a 20:00"
        ]
      },
      {
        "day": "Jueves",
        "slots": [
          "11:00 a 13:00",
          "19:00 a 21:00"
        ]
      }
    ],
    "included": [
      "Arcillas de prueba",
      "Herramientas basicas",
      "Coccion de piezas seleccionadas"
    ],
    "program": [
      {
        "title": "Volumen y estructura",
        "content": "Bases para construir piezas estables, equilibradas y con mejor lectura formal."
      },
      {
        "title": "Textura y superficie",
        "content": "Recursos para intervenir la piel de la pieza con repeticion, contraste y ritmo."
      },
      {
        "title": "Correccion y acabado",
        "content": "Refinamos uniones, bordes, proporciones y decisiones de cierre."
      }
    ],
    "whatYouWillLearn": [
      "Aprenderas a levantar piezas desde placas, churros y pellizco combinando tecnica y expresion.",
      "Tambien veras como corregir proporciones y mejorar el acabado sin perder frescura."
    ],
    "whoCanJoin": [
      "Ideal para personas que disfrutan del trabajo manual y quieren desarrollar sensibilidad material.",
      "Puede hacerse sin experiencia previa."
    ],
    "paymentMethods": [
      "Transferencia bancaria",
      "Tarjeta de credito",
      "Bizum"
    ],
    "additionalInfo": "Podemos adaptar el ritmo de la clase si buscas una experiencia mas tranquila o un enfoque mas tecnico.",
    "ctaHref": "https://wa.me/34633788860",
    "seoTitle": "Modelado expresivo | Casa Rosier",
    "seoDescription": "Clase de modelado manual en Barcelona para trabajar volumen, textura y construccion ceramica con acompanamiento.",
    "isPublished": true,
    "order": 2
  },
  {
    "id": "class-03",
    "kind": "class",
    "slug": "color-y-acabados",
    "title": "Color y acabados",
    "subtitle": "Experiencia ceramica: capas, contraste y superficie",
    "category": "Clases - Esmaltes",
    "excerpt": "Capas, contrastes y control de coccion para resultados consistentes.",
    "description": [
      "Esta experiencia se centra en color, prueba y control de superficie para que entiendas como responden engobes y esmaltes.",
      "Trabajamos aplicacion, combinaciones y pequenos cambios que alteran brillo, densidad y lectura final.",
      "Es una clase ideal para quienes quieren profundizar en el lenguaje visual de sus piezas."
    ],
    "coverImage": "img/clase-3.png",
    "heroImage": "img/intro-d.jpg",
    "heroTitle": "Color y acabados",
    "listingTitle": "Cursos y talleres de ceramica",
    "listingSubtitle": "En Barcelona",
    "introHighlight": "Un taller para entender color, materia y reaccion de la superficie con una mirada precisa.",
    "galleryImages": [
      "img/clase-3.png",
      "img/intro-d.jpg",
      "img/social-3.jpg",
      "img/workshop-3.jpg"
    ],
    "videoCardImage": "img/social-3.jpg",
    "videoCardLabel": "VIDEO",
    "priceOptions": [
      {
        "label": "Bono 3 sesiones",
        "price": "95 EUR"
      },
      {
        "label": "Clase suelta",
        "price": "38 EUR"
      }
    ],
    "duration": "Sesiones de 2 h.",
    "schedule": [
      {
        "day": "Viernes",
        "slots": [
          "10:30 a 12:30",
          "17:30 a 19:30"
        ]
      }
    ],
    "included": [
      "Muestrario de engobes",
      "Biblioteca de esmaltes",
      "Piezas de prueba"
    ],
    "program": [
      {
        "title": "Bases de color",
        "content": "Lectura de contraste, temperatura visual y relacion entre soporte y acabado."
      },
      {
        "title": "Aplicacion y capas",
        "content": "Brocha, inmersion, veladuras y pequenos gestos para modular la superficie."
      },
      {
        "title": "Pruebas y registro",
        "content": "Como documentar resultados para construir tu propio archivo de ensayo."
      }
    ],
    "whatYouWillLearn": [
      "Aprenderas a planificar pruebas, leer resultados y construir un criterio propio para el acabado.",
      "Tambien vas a mejorar la forma en que registras formulas, capas y observaciones."
    ],
    "whoCanJoin": [
      "Recomendado para alumnas que ya hicieron una primera aproximacion a la ceramica o quieren profundizar en color.",
      "Tambien sirve para principiantes con ganas de observar y probar con metodo."
    ],
    "paymentMethods": [
      "Transferencia bancaria",
      "PayPal",
      "Bizum"
    ],
    "additionalInfo": "Si vienes con piezas propias, podemos revisar previamente si son adecuadas para la sesion.",
    "ctaHref": "https://wa.me/34633788860",
    "seoTitle": "Color y acabados | Casa Rosier",
    "seoDescription": "Taller de esmaltes y superficies en Barcelona para trabajar color, capas y acabados de forma precisa.",
    "isPublished": true,
    "order": 3
  },
  {
    "id": "class-04",
    "kind": "workshop",
    "slug": "gran-formato",
    "title": "Piezas de gran formato",
    "subtitle": "Workshop de estructura, escala y secado",
    "category": "Workshop - Intensivo",
    "excerpt": "Metodos de estructura y secado para trabajar escala sin deformaciones.",
    "description": [
      "Una experiencia intensiva para pensar piezas mas grandes sin perder estructura.",
      "Revisamos soportes, tiempos, armado y estrategias de secado."
    ],
    "coverImage": "img/workshop-1.jpg",
    "heroImage": "img/workshop-1.jpg",
    "heroTitle": "Piezas de gran formato",
    "listingTitle": "Workshops de ceramica",
    "listingSubtitle": "En Barcelona",
    "introHighlight": "Un workshop para ganar confianza cuando la pieza empieza a crecer.",
    "galleryImages": [
      "img/workshop-1.jpg",
      "img/social-1.jpg",
      "img/intro-c.jpg"
    ],
    "videoCardImage": "img/social-1.jpg",
    "videoCardLabel": "VIDEO",
    "priceOptions": [
      {
        "label": "Workshop intensivo",
        "price": "140 EUR"
      }
    ],
    "duration": "Sesiones de 3 h.",
    "schedule": [
      {
        "day": "Sabado",
        "slots": [
          "11:00 a 14:00"
        ]
      }
    ],
    "included": [
      "Acompanamiento tecnico",
      "Arcilla de trabajo",
      "Material de apoyo"
    ],
    "program": [
      {
        "title": "Escala y estructura",
        "content": "Como organizar una pieza de mayor tamano desde el inicio."
      },
      {
        "title": "Secado y soporte",
        "content": "Evitar tensiones, hundimientos y deformaciones frecuentes."
      }
    ],
    "whatYouWillLearn": [
      "Veras criterios practicos para trabajar gran formato con mas control."
    ],
    "whoCanJoin": [
      "Pensado para alumnas con base previa o curiosidad por escalar su trabajo."
    ],
    "paymentMethods": [
      "Transferencia bancaria",
      "Tarjeta de credito"
    ],
    "additionalInfo": "Podemos revisar referencias o piezas previas antes del workshop.",
    "ctaHref": "https://wa.me/34633788860",
    "seoTitle": "Piezas de gran formato | Casa Rosier",
    "seoDescription": "Workshop ceramico de gran formato en Barcelona para trabajar escala, estructura y secado.",
    "isPublished": true,
    "order": 4
  },
  {
    "id": "class-05",
    "kind": "workshop",
    "slug": "torno-avanzado",
    "title": "Torno avanzado",
    "subtitle": "Workshop de ritmo, simetria y precision",
    "category": "Workshop - Avanzado",
    "excerpt": "Ritmo, simetria y precision para elevar tu repertorio tecnico.",
    "description": [
      "Profundizamos en el control de paredes, apertura, series y pequenas correcciones para mejorar consistencia.",
      "Ideal para alumnas que ya tienen una primera base en torno y quieren ordenar tecnica."
    ],
    "coverImage": "img/workshop-2.jpg",
    "heroImage": "img/workshop-2.jpg",
    "heroTitle": "Torno avanzado",
    "listingTitle": "Workshops de ceramica",
    "listingSubtitle": "En Barcelona",
    "introHighlight": "Una practica precisa para afinar gesto, repeticion y lectura tecnica.",
    "galleryImages": [
      "img/workshop-2.jpg",
      "img/social-2.jpg",
      "img/intro-a.jpg"
    ],
    "videoCardImage": "img/social-2.jpg",
    "videoCardLabel": "VIDEO",
    "priceOptions": [
      {
        "label": "Workshop intensivo",
        "price": "150 EUR"
      }
    ],
    "duration": "Sesiones de 3 h.",
    "schedule": [
      {
        "day": "Miercoles",
        "slots": [
          "19:00 a 22:00"
        ]
      }
    ],
    "included": [
      "Uso de torno",
      "Correccion personalizada",
      "Pasta de trabajo"
    ],
    "program": [
      {
        "title": "Control y simetria",
        "content": "Rutinas para mejorar estabilidad, pared y perfil."
      },
      {
        "title": "Series cortas",
        "content": "Como repetir con mas consistencia sin tensar el proceso."
      }
    ],
    "whatYouWillLearn": [
      "Vas a ordenar tecnica y detectar tus errores repetidos con mas rapidez."
    ],
    "whoCanJoin": [
      "Requiere experiencia previa basica en torno."
    ],
    "paymentMethods": [
      "Transferencia bancaria",
      "Bizum"
    ],
    "additionalInfo": "Trae ropa comoda y, si quieres, fotos de piezas tuyas para orientar la clase.",
    "ctaHref": "https://wa.me/34633788860",
    "seoTitle": "Torno avanzado | Casa Rosier",
    "seoDescription": "Workshop de torno avanzado en Barcelona para mejorar precision, ritmo y consistencia.",
    "isPublished": true,
    "order": 5
  },
  {
    "id": "class-06",
    "kind": "workshop",
    "slug": "experimentacion-material",
    "title": "Experimentacion material",
    "subtitle": "Workshop creativo de pasta, superficie y combinaciones",
    "category": "Workshop - Creativo",
    "excerpt": "Pruebas de pasta, superficies y combinaciones para nuevas series.",
    "description": [
      "Un espacio mas libre para mezclar recursos, testear materiales y abrir nuevas direcciones de trabajo.",
      "Se proponen ejercicios para activar ideas y observar resultados sin perder criterio."
    ],
    "coverImage": "img/workshop-3.jpg",
    "heroImage": "img/workshop-3.jpg",
    "heroTitle": "Experimentacion material",
    "listingTitle": "Workshops de ceramica",
    "listingSubtitle": "En Barcelona",
    "introHighlight": "Un workshop para probar, observar y abrir caminos sin caer en formulas rapidas.",
    "galleryImages": [
      "img/workshop-3.jpg",
      "img/social-4.jpeg",
      "img/intro-e.jpg"
    ],
    "videoCardImage": "img/social-4.jpeg",
    "videoCardLabel": "VIDEO",
    "priceOptions": [
      {
        "label": "Workshop creativo",
        "price": "125 EUR"
      }
    ],
    "duration": "Sesiones de 2,5 h.",
    "schedule": [
      {
        "day": "Viernes",
        "slots": [
          "18:30 a 21:00"
        ]
      }
    ],
    "included": [
      "Muestrario de pastas",
      "Pruebas de textura",
      "Biblioteca de referencias"
    ],
    "program": [
      {
        "title": "Prueba de materiales",
        "content": "Combinamos soportes, texturas y acabados para abrir nuevas lecturas."
      },
      {
        "title": "Serie experimental",
        "content": "Pequeno ejercicio para pensar familia, variacion y criterio visual."
      }
    ],
    "whatYouWillLearn": [
      "Aprenderas a estructurar un ensayo material y a leer resultados con mas distancia."
    ],
    "whoCanJoin": [
      "Abierto a principiantes curiosos y a alumnas que quieran salir de rutinas conocidas."
    ],
    "paymentMethods": [
      "Transferencia bancaria",
      "PayPal",
      "Bizum"
    ],
    "additionalInfo": "Si estas desarrollando una serie, podemos orientar el workshop hacia esa busqueda.",
    "ctaHref": "https://wa.me/34633788860",
    "seoTitle": "Experimentacion material | Casa Rosier",
    "seoDescription": "Workshop creativo de ceramica en Barcelona para probar materiales, texturas y combinaciones.",
    "isPublished": true,
    "order": 6
  },
  {
    "id": "gift-01",
    "kind": "gift-card",
    "slug": "beginner-class",
    "title": "Beginner Class",
    "subtitle": "Gift card: una primera experiencia en torno",
    "category": "Experiencia - Iniciacion",
    "excerpt": "Una experiencia guiada para introducirte al torno, la forma y el ritmo del taller.",
    "description": [
      "Esta gift card esta pensada para regalar una primera aproximacion a la ceramica desde el torno, con una experiencia cuidada y accesible.",
      "La persona que la recibe trabaja con acompanamiento cercano, conoce el ritmo del taller y crea sus primeras piezas en un entorno tranquilo.",
      "Es una opcion adecuada para regalar una actividad sensible, manual y memorable, sin necesidad de experiencia previa."
    ],
    "coverImage": "img/gift-1.jpg",
    "heroImage": "img/gift-1.jpg",
    "heroTitle": "Regala una experiencia en ceramica",
    "listingTitle": "Tarjetas de regalo",
    "listingSubtitle": "Experiencias en Barcelona",
    "introHighlight": "Una gift card editorial y serena para regalar tiempo de taller, materia y una primera pieza hecha a mano.",
    "galleryImages": [
      "img/gift-1.jpg",
      "img/social-2.jpg",
      "img/clase-1.png"
    ],
    "videoCardImage": "img/social-2.jpg",
    "videoCardLabel": "VIDEO",
    "giftCardTypeLabel": "Tarjeta digital o fisica?",
    "giftCardTypeOptions": [
      "Para imprimir o enviar por e-mail",
      "Retirar por el estudio"
    ],
    "priceOptions": [
      {
        "label": "Gift card individual",
        "price": "75 EUR"
      },
      {
        "label": "Gift card para dos",
        "price": "140 EUR"
      }
    ],
    "duration": "Sesion de 2 h.",
    "schedule": [
      {
        "day": "Disponible",
        "slots": [
          "Canje segun agenda del estudio"
        ]
      }
    ],
    "included": [
      "Materiales basicos",
      "Coccion de una seleccion de piezas",
      "Acompanamiento en taller"
    ],
    "program": [
      {
        "title": "Bienvenida al taller",
        "content": "Recorrido breve por el espacio, herramientas y tiempos del proceso."
      },
      {
        "title": "Primer contacto con torno",
        "content": "Centrado, apertura y levantado de una forma sencilla."
      },
      {
        "title": "Cierre de la experiencia",
        "content": "Revision de piezas, secado y siguientes pasos del proceso."
      }
    ],
    "whatYouWillLearn": [
      "La experiencia busca que la persona pueda tocar la arcilla, entender el gesto inicial del torno y llevarse una memoria real del taller.",
      "No se trata de un regalo comercial rapido, sino de una experiencia cuidada y con acompanamiento."
    ],
    "whoCanJoin": [
      "Ideal para principiantes, parejas o personas que quieren regalar una actividad distinta.",
      "No hace falta experiencia previa."
    ],
    "paymentMethods": [
      "Transferencia bancaria",
      "Tarjeta de credito",
      "Bizum"
    ],
    "additionalInfo": "Podemos preparar la gift card en formato digital y orientar el regalo segun disponibilidad o tipo de experiencia.",
    "ctaHref": "https://wa.me/34633788860",
    "seoTitle": "Beginner Class Gift Card | Casa Rosier",
    "seoDescription": "Tarjeta de regalo para una primera experiencia de ceramica en Barcelona, con torno, acompanamiento y atmosfera artesanal.",
    "isPublished": true,
    "order": 1
  },
  {
    "id": "gift-02",
    "kind": "gift-card",
    "slug": "sculpture-class",
    "title": "Sculpture Class",
    "subtitle": "Gift card: una experiencia de volumen y textura",
    "category": "Experiencia - Escultura",
    "excerpt": "Sesion orientada a volumen y textura para crear piezas expresivas con tecnica y control.",
    "description": [
      "Una tarjeta de regalo pensada para quienes disfrutan del trabajo manual, el volumen y la construccion de una pieza con caracter.",
      "La experiencia se centra en modelado expresivo, texturas y pequenos recursos de acabado para crear una pieza singular.",
      "Es una forma de regalar tiempo de estudio y una experiencia mas plastica, material y contemplativa."
    ],
    "coverImage": "img/workshop-2.jpg",
    "heroImage": "img/workshop-2.jpg",
    "heroTitle": "Regala una experiencia de escultura",
    "listingTitle": "Tarjetas de regalo",
    "listingSubtitle": "Experiencias en Barcelona",
    "introHighlight": "Una gift card para regalar una sesion de modelado, volumen y sensibilidad material en un entorno calmado.",
    "galleryImages": [
      "img/workshop-2.jpg",
      "img/social-4.jpeg",
      "img/clase-2.png"
    ],
    "videoCardImage": "img/social-4.jpeg",
    "videoCardLabel": "VIDEO",
    "giftCardTypeLabel": "Tarjeta digital o fisica?",
    "giftCardTypeOptions": [
      "Para imprimir o enviar por e-mail",
      "Retirar por el estudio"
    ],
    "priceOptions": [
      {
        "label": "Gift card individual",
        "price": "80 EUR"
      },
      {
        "label": "Gift card para dos",
        "price": "150 EUR"
      }
    ],
    "duration": "Sesion de 2 h.",
    "schedule": [
      {
        "day": "Disponible",
        "slots": [
          "Canje segun agenda del estudio"
        ]
      }
    ],
    "included": [
      "Materiales basicos",
      "Herramientas de modelado",
      "Coccion de una seleccion de piezas"
    ],
    "program": [
      {
        "title": "Introduccion al modelado",
        "content": "Presentacion de tecnicas sencillas de construccion manual."
      },
      {
        "title": "Volumen y textura",
        "content": "Desarrollo de una pieza expresiva con acompanamiento cercano."
      },
      {
        "title": "Acabado y cierre",
        "content": "Revision de superficies, correccion de detalles y explicacion del proceso posterior."
      }
    ],
    "whatYouWillLearn": [
      "La persona que recibe la gift card entra en contacto con el modelado de forma accesible y cuidada.",
      "La experiencia combina expresion, tecnica basica y una atmosfera serena de estudio."
    ],
    "whoCanJoin": [
      "Pensada para principiantes, amantes de lo manual o personas que valoran experiencias sensibles y calmadas.",
      "No requiere experiencia previa."
    ],
    "paymentMethods": [
      "Transferencia bancaria",
      "PayPal",
      "Bizum"
    ],
    "additionalInfo": "La gift card puede entregarse como regalo digital o reservarse como experiencia para una fecha concreta.",
    "ctaHref": "https://wa.me/34633788860",
    "seoTitle": "Sculpture Class Gift Card | Casa Rosier",
    "seoDescription": "Tarjeta de regalo para una experiencia de modelado y escultura ceramica en Barcelona, con acompanamiento y atmosfera editorial.",
    "isPublished": true,
    "order": 2
  },
  {
    "id": "private-01",
    "kind": "private-booking",
    "slug": "experiencia-para-dos",
    "title": "Experiencia para dos",
    "subtitle": "Reserva privada: una sesion de ceramica para compartir",
    "category": "Experiencias - Para dos",
    "excerpt": "Una experiencia privada para venir en pareja, con calma, acompanamiento y una pieza creada entre dos.",
    "description": [
      "Una reserva pensada para compartir el taller de forma privada, sin prisa y con acompanamiento cercano durante todo el proceso.",
      "La experiencia combina una introduccion al trabajo con arcilla, una pequena demostracion tecnica y tiempo suficiente para modelar, probar y construir una pieza con sentido propio.",
      "Es una propuesta adecuada para parejas, amigas o personas que quieren regalarse un rato distinto en el estudio, con una atmosfera cuidada y artesanal."
    ],
    "coverImage": "img/social-2.jpg",
    "heroImage": "img/social-2.jpg",
    "heroTitle": "Experiencia privada para dos",
    "listingTitle": "Experiencias",
    "listingSubtitle": "Experiencias en Barcelona",
    "introHighlight": "Una sesion privada para compartir el taller, tocar la arcilla y crear una memoria material entre dos personas.",
    "galleryImages": [
      "img/social-2.jpg",
      "img/clase-1.png",
      "img/workshop-2.jpg",
      "img/intro-b.jpg"
    ],
    "videoCardImage": "img/social-2.jpg",
    "videoCardLabel": "VIDEO",
    "priceOptions": [
      {
        "label": "Sesion privada para dos",
        "price": "140 EUR"
      }
    ],
    "duration": "Sesion de 2 h.",
    "schedule": [
      {
        "day": "Disponible",
        "slots": [
          "Canje segun agenda del estudio"
        ]
      }
    ],
    "included": [
      "Materiales basicos",
      "Uso de herramientas",
      "Coccion de una seleccion de piezas"
    ],
    "program": [
      {
        "title": "Bienvenida y presentacion",
        "content": "Recibimos a las dos personas, presentamos el espacio y marcamos el ritmo de la sesion."
      },
      {
        "title": "Modelado guiado",
        "content": "Trabajamos una pieza sencilla desde la mano y la observacion del material."
      },
      {
        "title": "Cierre del proceso",
        "content": "Revisamos piezas, resolvemos dudas y explicamos secado, coccion y retirada."
      }
    ],
    "whatYouWillLearn": [
      "La experiencia permite entender de forma accesible como responde la arcilla, como se construye una pieza sencilla y como se acompana el proceso desde el estudio.",
      "Tambien es una forma de compartir tiempo de calidad en un entorno sereno, material y muy cuidado."
    ],
    "whoCanJoin": [
      "Pensada para parejas, amistades o dos personas que quieran venir juntas al taller.",
      "No hace falta experiencia previa."
    ],
    "paymentMethods": [
      "Transferencia bancaria",
      "Tarjeta de credito",
      "Bizum"
    ],
    "additionalInfo": "Podemos adaptar el tono de la sesion si buscas una experiencia mas romantica, mas relajada o simplemente un plan distinto para compartir.",
    "ctaHref": "https://wa.me/34633788860",
    "seoTitle": "Experiencia privada para dos | Casa Rosier",
    "seoDescription": "Reserva privada para dos personas en el estudio de ceramica Casa Rosier en Barcelona, con acompanamiento y una experiencia artesanal compartida.",
    "isPublished": true,
    "order": 1
  },
  {
    "id": "private-02",
    "kind": "private-booking",
    "slug": "celebracion-privada",
    "title": "Celebracion privada",
    "subtitle": "Reserva privada: un encuentro de ceramica para celebrar",
    "category": "Experiencias - Celebraciones",
    "excerpt": "Una reserva de estudio para pequenos grupos que quieran celebrar de una forma sensible, manual y distinta.",
    "description": [
      "Esta experiencia esta pensada para celebraciones pequenas: cumpleanos, encuentros especiales o planes intimos con una atmosfera tranquila y bien acompasada.",
      "El taller se adapta al grupo para que todas las personas puedan participar desde un lugar accesible, con una propuesta clara y un ritmo agradable.",
      "La ceramica se convierte aqui en una excusa para compartir, conversar, hacer con las manos y construir un recuerdo comun."
    ],
    "coverImage": "img/social-3.jpg",
    "heroImage": "img/social-3.jpg",
    "heroTitle": "Celebracion privada en el taller",
    "listingTitle": "Experiencias",
    "listingSubtitle": "Experiencias en Barcelona",
    "introHighlight": "Una celebracion de pequeno formato para reunirse en el estudio y vivir una experiencia manual, sensible y compartida.",
    "galleryImages": [
      "img/social-3.jpg",
      "img/workshop-3.jpg",
      "img/intro-d.jpg",
      "img/social-1.jpg"
    ],
    "videoCardImage": "img/social-1.jpg",
    "videoCardLabel": "VIDEO",
    "priceOptions": [
      {
        "label": "Grupo de 4 personas",
        "price": "220 EUR"
      },
      {
        "label": "Grupo de 6 personas",
        "price": "320 EUR"
      }
    ],
    "duration": "Sesion de 2,5 h.",
    "schedule": [
      {
        "day": "Disponible",
        "slots": [
          "Segun agenda del estudio y tamano del grupo"
        ]
      }
    ],
    "included": [
      "Materiales y herramientas",
      "Dinamica guiada",
      "Coccion de piezas seleccionadas"
    ],
    "program": [
      {
        "title": "Recepcion del grupo",
        "content": "Introduccion breve al espacio y planteamiento de la actividad."
      },
      {
        "title": "Experiencia guiada",
        "content": "Cada participante desarrolla una pieza sencilla con ayuda del taller."
      },
      {
        "title": "Cierre y recogida",
        "content": "Organizamos las piezas, explicamos el proceso posterior y resolvemos dudas."
      }
    ],
    "whatYouWillLearn": [
      "El grupo se lleva una primera aproximacion al trabajo con arcilla y una experiencia compartida que mezcla observacion, proceso y juego material.",
      "La sesion prioriza la experiencia y el acompanamiento antes que la perfeccion tecnica."
    ],
    "whoCanJoin": [
      "Ideal para pequenos grupos que quieren celebrar algo de forma distinta.",
      "No requiere experiencia previa."
    ],
    "paymentMethods": [
      "Transferencia bancaria",
      "Bizum"
    ],
    "additionalInfo": "Si necesitas ajustar aforo, horario o tono de la experiencia, podemos definirlo contigo antes de reservar.",
    "ctaHref": "https://wa.me/34633788860",
    "seoTitle": "Celebracion privada | Casa Rosier",
    "seoDescription": "Reserva privada de ceramica para pequenas celebraciones en Barcelona, con actividad guiada y ambiente editorial.",
    "isPublished": true,
    "order": 2
  },
  {
    "id": "private-03",
    "kind": "private-booking",
    "slug": "sesion-para-equipos",
    "title": "Sesion para equipos",
    "subtitle": "Reserva privada: ceramica para equipos y grupos de trabajo",
    "category": "Experiencias - Equipos",
    "excerpt": "Una sesion privada para equipos pequenos que quieran salir del formato habitual y compartir una experiencia manual.",
    "description": [
      "Pensada para equipos creativos, pequenos estudios o grupos de trabajo que buscan una actividad distinta, pausada y con una relacion mas directa con la materia.",
      "La propuesta puede enfocarse como una experiencia de cohesion, una pausa compartida o un encuentro fuera del ritmo habitual del trabajo.",
      "La ceramica ofrece aqui un contexto muy claro: observar, ensayar, equivocarse, conversar y construir algo en comun con las manos."
    ],
    "coverImage": "img/social-4.jpeg",
    "heroImage": "img/social-4.jpeg",
    "heroTitle": "Sesion privada para equipos",
    "listingTitle": "Experiencias",
    "listingSubtitle": "Experiencias en Barcelona",
    "introHighlight": "Una reserva privada para equipos pequenos que quieren compartir una experiencia artesanal con sentido y buen ritmo.",
    "galleryImages": [
      "img/social-4.jpeg",
      "img/workshop-1.jpg",
      "img/intro-e.jpg",
      "img/social-2.jpg"
    ],
    "videoCardImage": "img/social-4.jpeg",
    "videoCardLabel": "VIDEO",
    "priceOptions": [
      {
        "label": "Equipo de 6 personas",
        "price": "360 EUR"
      },
      {
        "label": "Equipo de 8 personas",
        "price": "460 EUR"
      }
    ],
    "duration": "Sesion de 2,5 h.",
    "schedule": [
      {
        "day": "Disponible",
        "slots": [
          "Consultar disponibilidad y formato"
        ]
      }
    ],
    "included": [
      "Materiales basicos",
      "Diseno de sesion guiada",
      "Acompanamiento del equipo del estudio"
    ],
    "program": [
      {
        "title": "Introduccion y contexto",
        "content": "Explicamos el espacio, el material y el enfoque de la sesion para el grupo."
      },
      {
        "title": "Trabajo guiado",
        "content": "Cada participante desarrolla una propuesta sencilla con ritmo comun y acompanamiento cercano."
      },
      {
        "title": "Puesta en comun",
        "content": "Cierre del encuentro con revision de piezas y comentarios finales."
      }
    ],
    "whatYouWillLearn": [
      "La sesion ayuda a comprender el valor del proceso, la observacion y el trabajo material compartido.",
      "Es una experiencia util para equipos que quieren salir del formato corporativo estandar y vivir algo mas humano y pausado."
    ],
    "whoCanJoin": [
      "Pensada para equipos pequenos, colectivos creativos o grupos de trabajo.",
      "No hace falta experiencia previa en ceramica."
    ],
    "paymentMethods": [
      "Transferencia bancaria"
    ],
    "additionalInfo": "Podemos adaptar la sesion al numero de personas, al tipo de grupo y al tono del encuentro.",
    "ctaHref": "https://wa.me/34633788860",
    "seoTitle": "Sesion privada para equipos | Casa Rosier",
    "seoDescription": "Experiencia privada de ceramica para equipos y grupos de trabajo en Barcelona, en un estudio calmado y artesanal.",
    "isPublished": true,
    "order": 3
  }
] satisfies ExperienceItem[];

export const published = experiences.filter((item) => item.isPublished).sort((a, b) => a.order - b.order);

export function byKind<K extends ExperienceKind>(kind: K) {
  return published.filter((item): item is Extract<(typeof experiences)[number], { kind: K }> => item.kind === kind);
}

export function bySlug(slug: string) {
  return experiences.find((item) => item.slug === slug) ?? null;
}

export const classes = byKind("class");
export const workshops = byKind("workshop");
export const giftCards = byKind("gift-card");
export const privateExperiences = byKind("private-booking");
