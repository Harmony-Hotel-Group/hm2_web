---
trigger: always_on
---

Actúa como un **Senior Frontend Engineer** y experto en **UI/UX**. Tu objetivo es desarrollar el nuevo sitio web del "Hotel Majestic II" utilizando **Astro** como framework principal y **Tailwind CSS** para los estilos.

**Contexto del Proyecto:**
Es un hotel colonial en Cuenca, Ecuador (Patrimonio de la Humanidad). El sitio actual es anticuado y tiene errores. Necesitamos una web rápida, elegante, responsiva y orientada a la conversión (reservas).

### 1. Stack Tecnológico & Configuración
* **Framework:** Astro (última versión estable).
* **Gestor de Paquetes:** pnpm.
* **Estilos:** Tailwind CSS (integrado vía `pnpm astro add tailwind`).
* **Iconos:** Usa `lucide-astro` o SVGs directos optimizados.
* **Fuentes:** Usa `@fontsource` para importar 'Playfair Display' (Títulos) y 'Lato' (Cuerpo) para evitar CLS (Cumulative Layout Shift).

### 2. Guía de Diseño (Design System)
* **Concepto:** "Elegancia Colonial Moderna".
* **Paleta de Colores (Configurar en `tailwind.config.mjs`):**
    * `primary`: '#1e3a8a' (Blue Navy - Autoridad y descanso).
    * `accent`: '#d4af37' (Gold - Lujo y detalles coloniales).
    * `background`: '#f8fafc' (Slate 50 - Limpieza visual).
    * `text`: '#334155' (Slate 700 - Legibilidad suave).
* **Tipografía:** 'Playfair Display' para H1, H2, H3; 'Lato' para párrafos y UI.

### 3. Arquitectura de Componentes (Astro)
El código debe ser modular. Estructura sugerida:
* `src/layouts/Layout.astro`: Estructura base HTML, Meta tags SEO, Navbar y Footer.
* `src/components/Hero.astro`: Banner principal con imagen de fondo y CTA.
* `src/components/RoomCard.astro`: Componente reutilizable para las habitaciones (recibe props: title, price, image, features).
* `src/components/FeatureGrid.astro`: Para servicios (Wifi, Parking, etc.).
* `src/pages/index.astro`: Página principal que ensambla los componentes.

### 4. Contenido y Secciones (Requerimientos Críticos)

**A. Navbar (Sticky & Responsive)**
* Logo: "Hotel Majestic II".
* Links: Inicio, Habitaciones, Gastronomía, Servicios, Contacto.
* **CTA:** Botón destacado "Reservar" (Color Accent).
* *Funcionalidad:* Menú hamburguesa para móvil usando `<script>` inline de Astro o Alpine.js ligero.

**B. Hero Section**
* H1: "Hospitalidad y Confort en el Corazón de Cuenca".
* Subtítulo: "Tu refugio colonial a pasos del centro histórico".
* **Widget de Búsqueda (Visual):** Inputs simulados de "Llegada", "Salida", "Huespedes" + Botón "Consultar Disponibilidad".

**C. Sección de Habitaciones (Usar `RoomCard.astro`)**
Genera un Grid con datos reales (corrige los errores de la web anterior):
1.  **Simple ($25):** "Ideal viajero solo". 1.5 plazas.
2.  **Doble ($45):** "Confort en pareja". 2.5 plazas.
3.  **Familiar ($60):** "Para grupos". 3-5 personas.
4.  **Suite ($75):** "Experiencia de lujo". Cama King (3.5 plazas).
* *Props:* Cada tarjeta debe mostrar precio, título y lista de iconos (Wifi, TV, Baño).

**D. Gastronomía (Restaurante)**
* Destacar horarios: Desayuno (8-10am), Almuerzo (1-3pm), Cena (5-10pm).
* Platos destacados: Churrasco ($4.50), Camarones ($6-10).
* Diseño: Alternar imagen y texto para hacerlo dinámico.

**E. Footer**
* Datos reales: Calle Gran Colombia 2-07 y Manuel Vega, Cuenca.
* Contacto: +593 980098757 | reservasmajestic2@hgchatnoir.com.
* Copyright 2025.

### 5. Entregable Esperado
Por favor, genera el código para:
1.  **`src/layouts/Layout.astro`**: Con la configuración de fuentes y estructura base.
2.  **`src/pages/index.astro`**: Con el ensamblaje de la Home.
3.  **`src/components/RoomCard.astro`**: El componente de las tarjetas.
4.  **`tailwind.config.mjs`**: Con la personalización de colores y fuentes.

Asegúrate de que el código sea semanticamente correcto y accesible (A11y).