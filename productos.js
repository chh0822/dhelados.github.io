/* ==========================================================================
   D HELADOS · DATOS DE LA CARTA
   --------------------------------------------------------------------------
   Este es el ÚNICO archivo que necesitás editar para cambiar la carta.
   carta.html lo lee y arma todo solo (categorías, buscador, pedido).

   CÓMO AGREGAR UN PRODUCTO
   1. Copiá un bloque { ... } de la lista PRODUCTOS (desde la llave { hasta la },)
   2. Pegalo debajo, cambiale el id (sin espacios ni tildes) y los textos.
   3. Poné en "categoria" el id de una de las CATEGORIAS.
   4. Guardá y recargá la página.

   CAMPOS DE UN PRODUCTO
   id          texto único, ej. 'cono-doble'
   categoria   id de la categoría, ej. 'conos'
   nombre      lo que se ve en la carta
   descripcion texto corto (1–2 líneas)
   precio      número SIN puntos. 0 = "A consultar"
   foto        ruta a la imagen, ej. './public/productos/cono.jpg'
               (si lo dejás vacío '' se muestra un dibujo con el color de la categoría)
   etiqueta    opcional: 'Más pedido', 'Nuevo', 'Promo'… ('' = sin etiqueta)
   destacado   true = aparece en "Lo más pedido" arriba de todo
   agotado     true = se ve en la carta pero no se puede pedir
   opciones    opcional, lista de grupos (ver abajo)

   GRUPOS DE OPCIONES
   { titulo:'Tamaño', tipo:'unico', items:[ {nombre:'Chico', precio:8000, sabores:1}, ... ] }
       → el cliente elige UNO. "precio" se SUMA al precio del producto.
         "sabores" (opcional) dice cuántos sabores permite ese tamaño
         (sabores: 0 = esa opción no pide elegir sabor, ej. brownie sin helado).
   { titulo:'Sabores', tipo:'sabores', lista:'helados', max:2 }
       → chips de sabores sacados de SABORES.helados.
         Si hay un tamaño con "sabores", ese número manda sobre "max".
   { titulo:'Extras', tipo:'multiple', max:3, items:[ {nombre:'Salsa', precio:2000} ] }
       → el cliente puede marcar varios (opcional). Sin "max" = todos los que quiera.
   TOPPINGS
       → escribí TOPPINGS dentro de opciones para sumar la lista de toppings de la carta.
   ========================================================================== */

const TIENDA = {
  nombre: 'D Helados',
  bajada: 'Heladería artesanal · Pilar, Paraguay',
  whatsapp: '595975650919',          // sin + ni espacios
  logo: './public/logo_hela.png',
  portada: './public/hero_helado.png',
  direccion: 'Calle 8 de Diciembre casi Avda. Irala, Pilar',
  mapa: 'https://www.google.com/maps/search/?api=1&query=D+Helados+8+de+Diciembre+Pilar+Paraguay',
  moneda: 'Gs.',

  // Horario por día: 0 = domingo, 1 = lunes … 6 = sábado. null = cerrado ese día.
  horario: {
    0: ['13:00', '22:00'],
    1: ['12:00', '23:00'],
    2: ['12:00', '23:00'],
    3: ['12:00', '23:00'],
    4: ['12:00', '23:00'],
    5: ['12:00', '23:00'],
    6: ['12:00', '23:00']
  },

  delivery: {
    activo: true,
    costo: 0,                          // 0 = no se suma al total
    texto: 'El costo del delivery se confirma por WhatsApp según tu zona.'
  },

  pagos: ['Efectivo', 'Transferencia bancaria', 'Pago con QR / Tarjeta']
};

/* Listas de sabores. Cada producto elige cuál usar con  lista: 'helados'  etc.
   Para ocultar un sabor que se acabó hoy, agregalo a AGOTADOS (se ve tachado). */
const SABORES = {
  // Sabores de helado de vitrina (vasitos, conos, kilo, sombreritos, milkshakes)
  helados: [
    'Dulce de leche Micro', 'Dulce de leche Tentación', 'Durazno', 'Chocolate Grampiamonte', 'Chocopop', 'Dulce de Leche Clásico', 'Dulce de Leche Brownie', 'Dulce de Leche Granizado',
    'Frutilla a la crema', 'Flan', 'Frutos del Bosque', 'Granizado', 'Chocolate Amargo', 'Chocolate c/Almendras', 'Chocolate c/Avellanas', 'Chocolate Micro',
    'Limón', 'Leche Condensada', 'Leche condensada c/Brownie y Nutella', '4 Leches', 'Menta Granizada', 'Coco', 'Chocolate Clásico', 'Chocolate Blanco',
    'Menta Clásica', 'Mburukuja', 'Unicornio', 'Americana c/Nutella', 'Banana Split', 'Bombón', 'Crema con Almendras', 'Cereza', 'Coco Split',
    'Oreo', 'Pavé', 'Piña', 'Portuguesa', 'Pie de Limón', 'Tramontana', 'Vainilla', 'Amarena', 'Americana', 'Americana c/Brownie'
  ],
  alfajores: ['Chocolate', 'Americana', 'Dulce de leche', '4 leches'],
  tortas: ['Frutilla', 'Frutichoco', 'Oreo', 'Tramontana', 'Pavé', 'Chocolate', 'Dulce de leche', 'Chocobomba', 'Almendras'],
  palitosSin: ['Dulce de leche', 'Chocolate', 'Menta granizada', 'Limón al agua', 'Piña', 'Durazno', 'Granizado', 'Oreo', 'Frutilla', '4 leches'],
  palitosCon: ['Americana', 'Dulce de leche', '4 leches']
};

const AGOTADOS = [
  // 'Maracuyá',
];

/* Categorías en el orden en que aparecen.
   tono:  pink · mus · steel · lilac · rasp · cob   (colores de la paleta)
   icono: vaso · cono · kilo · shake · paleta · torta · copa · brownie · alfajor · extra */
const CATEGORIAS = [
  { id: 'conos',       nombre: 'Conos y vasitos',    tono: 'pink',  icono: 'cono'    },
  { id: 'sombreritos', nombre: 'Sombreritos',        tono: 'mus',   icono: 'copa'    },
  { id: 'kilo',        nombre: 'Por kilo',           tono: 'steel', icono: 'kilo'    },
  { id: 'shakes',      nombre: 'Milkshakes',         tono: 'lilac', icono: 'shake'   },
  { id: 'acai',        nombre: 'Camadinhas de açaí', tono: 'rasp',  icono: 'copa'    },
  { id: 'brownies',    nombre: 'Brownies',           tono: 'mus',   icono: 'brownie' },
  { id: 'alfajores',   nombre: 'Alfajores helados',  tono: 'pink',  icono: 'alfajor' },
  { id: 'palitos',     nombre: 'Palitos helados',    tono: 'rasp',  icono: 'paleta'  },
  { id: 'tortas',      nombre: 'Tortas heladas',     tono: 'cob',   icono: 'torta'   }
];

/* Toppings de la carta. Se pueden sumar a cualquier producto que tenga  TOPPINGS  en sus opciones. */
const TOPPINGS = {
  titulo: 'Toppings', tipo: 'multiple',
  items: [
    { nombre: 'Oreo',              precio: 2000 },
    { nombre: 'Nutella',           precio: 5000 },
    { nombre: 'Licor',             precio: 3000 },
    { nombre: 'Chocolate caliente', precio: 3000 },
    { nombre: 'Almendras',         precio: 3000 },
    { nombre: 'Miel',              precio: 2000 },
    { nombre: 'Dulce de leche',    precio: 2000 },
    { nombre: 'Banana',            precio: 2000 },
    { nombre: 'Granola',           precio: 3000 },
    { nombre: 'Chantilly',         precio: 2000 },
    { nombre: 'Rocklets',          precio: 2000 },
    { nombre: 'Mogul',             precio: 2000 },
    { nombre: 'Leche condensada',  precio: 2000 }
  ]
};

const PRODUCTOS = [
  /* ---------- CONOS Y VASITOS ---------- */
  {
    id: 'cono-vasito',
    categoria: 'conos',
    nombre: 'Cono o vasito',
    descripcion: 'Elegí cono crujiente o vasito y combiná hasta 3 sabores.',
    precio: 0,
    foto: './public/productos/conos.jpg',
    etiqueta: 'Más pedido',
    destacado: true,
    opciones: [
      { titulo: 'Presentación', tipo: 'unico', items: [
        { nombre: 'Cono',    precio: 0 },
        { nombre: 'Vasito',  precio: 0 }
      ]},
      { titulo: 'Cantidad de sabores', tipo: 'unico', items: [
        { nombre: '1 sabor',   precio: 8000,  sabores: 1 },
        { nombre: '2 sabores', precio: 12000, sabores: 2 },
        { nombre: '3 sabores', precio: 16000, sabores: 3 }
      ]},
      { titulo: 'Sabores', tipo: 'sabores', lista: 'helados' }
    ]
  },
  {
    id: 'vasito-diet',
    categoria: 'conos',
    nombre: 'Vasito diet',
    descripcion: 'Helado sin azúcar agregado. Consultá los sabores diet del día.',
    precio: 22000,
    foto: ''
  },

  /* ---------- SOMBRERITOS ---------- */
  {
    id: 'sombrerito',
    categoria: 'sombreritos',
    nombre: 'Sombrerito',
    descripcion: 'Canastita de barquillo con bochas de helado, salsa y su barquillo.',
    precio: 0,
    foto: './public/productos/sombreritos.jpg',
    destacado: true,
    opciones: [
      { titulo: 'Tamaño', tipo: 'unico', items: [
        { nombre: '2 sabores', precio: 16000, sabores: 2 },
        { nombre: '3 sabores', precio: 22000, sabores: 3 }
      ]},
      { titulo: 'Sabores', tipo: 'sabores', lista: 'helados' }
    ]
  },

  /* ---------- POR KILO ---------- */
  {
    id: 'pote',
    categoria: 'kilo',
    nombre: 'Helado por kilo',
    descripcion: 'Envase térmico para llevar a casa o compartir en reuniones.',
    precio: 0,
    foto: './public/productos/kilo.jpg',
    etiqueta: 'Para compartir',
    destacado: true,
    opciones: [
      // "sabores" = cuántos sabores entran en cada tamaño (ajustalo si hace falta)
      { titulo: 'Tamaño', tipo: 'unico', items: [
        { nombre: '¼ kg', precio: 22000, sabores: 2 },
        { nombre: '½ kg', precio: 32000, sabores: 3 },
        { nombre: '1 kg', precio: 52000, sabores: 4 }
      ]},
      { titulo: 'Sabores', tipo: 'sabores', lista: 'helados' }
    ]
  },

  /* ---------- MILKSHAKES ---------- */
  {
    id: 'milkshake',
    categoria: 'shakes',
    nombre: 'Milkshake',
    descripcion: 'Batido cremoso preparado al instante. ¡Agregale los toppings que más te gusten!',
    precio: 0,
    foto: './public/productos/milkshake.jpg',
    destacado: true,
    opciones: [
      { titulo: 'Tamaño', tipo: 'unico', items: [
        { nombre: '2 sabores', precio: 22000, sabores: 2 },
        { nombre: '3 sabores', precio: 27000, sabores: 3 }
      ]},
      { titulo: 'Sabores', tipo: 'sabores', lista: 'helados' },
      TOPPINGS
    ]
  },

  /* ---------- AÇAÍ ---------- */
  {
    id: 'acai',
    categoria: 'acai',
    nombre: 'Camadinha de açaí',
    descripcion: 'Capas de açaí bien frío. ¡Agregale los toppings que más te gusten!',
    precio: 0,
    foto: './public/productos/acai.jpg',
    opciones: [
      { titulo: 'Tamaño', tipo: 'unico', items: [
        { nombre: '300 ml', precio: 25000 },
        { nombre: '500 ml', precio: 35000 }
      ]},
      TOPPINGS
    ]
  },

  /* ---------- BROWNIES ---------- */
  {
    id: 'brownie',
    categoria: 'brownies',
    nombre: 'Brownie',
    descripcion: 'Brownie de chocolate, solo o con una bocha de helado encima.',
    precio: 0,
    foto: './public/productos/brownie.jpg',
    opciones: [
      // sabores: 0 = no pide elegir sabor
      { titulo: 'Presentación', tipo: 'unico', items: [
        { nombre: 'Sin helado', precio: 10000, sabores: 0 },
        { nombre: 'Con helado', precio: 22000, sabores: 1 }
      ]},
      { titulo: 'Sabor del helado', tipo: 'sabores', lista: 'helados' },
      TOPPINGS
    ]
  },

  /* ---------- ALFAJORES HELADOS ---------- */
  {
    id: 'alfajor',
    categoria: 'alfajores',
    nombre: 'Alfajor helado',
    descripcion: 'Alfajor relleno de helado y bañado en chocolate.',
    precio: 0,
    foto: './public/productos/alfajores.jpg',
    opciones: [
      { titulo: 'Tamaño', tipo: 'unico', items: [
        { nombre: 'Pequeño', precio: 12000 },
        { nombre: 'Grande',  precio: 15000 }
      ]},
      { titulo: 'Sabor', tipo: 'sabores', lista: 'alfajores', max: 1 }
    ]
  },

  /* ---------- PALITOS HELADOS ---------- */
  {
    id: 'palito',
    categoria: 'palitos',
    nombre: 'Palito sin cobertura',
    descripcion: 'Palito helado artesanal, de crema o al agua.',
    precio: 8000,
    foto: './public/productos/palito.jpg',
    opciones: [{ titulo: 'Sabor', tipo: 'sabores', lista: 'palitosSin', max: 1 }]
  },
  {
    id: 'palito-cobertura',
    categoria: 'palitos',
    nombre: 'Palito con cobertura',
    descripcion: 'Palito helado bañado en chocolate.',
    precio: 10000,
    foto: './public/productos/palito-cobertura.jpg',
    opciones: [{ titulo: 'Sabor', tipo: 'sabores', lista: 'palitosCon', max: 1 }]
  },

  /* ---------- TORTAS HELADAS ---------- */
  {
    id: 'torta',
    categoria: 'tortas',
    nombre: 'Torta helada',
    descripcion: 'Ideal para cumpleaños y celebraciones. También por porción.',
    precio: 0,
    foto: './public/productos/torta.jpg',
    destacado: true,
    opciones: [
      { titulo: 'Tamaño', tipo: 'unico', items: [
        { nombre: 'Torta cuadrada', precio: 50000 },
        { nombre: 'Torta redonda',  precio: 80000 },
        { nombre: 'Por porción',    precio: 13000 }
      ]},
      { titulo: 'Sabor', tipo: 'sabores', lista: 'tortas', max: 1 }
    ]
  }
];
