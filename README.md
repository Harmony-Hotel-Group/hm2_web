# Hotel Majestic II - Coming Soon Page

This repository contains the "Under Construction" landing page for the Hotel Majestic II website. The page is built with Astro, Tailwind CSS, and features a responsive design with WhatsApp contact integration and Google Maps location display.

## Project Overview

Hotel Majestic II is a colonial hotel located in Cuenca, Ecuador (UNESCO World Heritage Site). This temporary landing page serves as a placeholder while the full website is being developed.

## Features

- Responsive design that works on mobile and desktop
- WhatsApp contact button for direct communication
- Google Maps integration showing hotel location
- Brand-consistent color scheme (navy blue and gold)
- Custom typography with Playfair Display and Lato fonts
- Simple, elegant user interface

## Tech Stack

- [Astro](https://astro.build/) - Static site generator
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [Google Fonts](https://fonts.google.com/) - Playfair Display and Lato fonts
- [Google Maps](https://www.google.com/maps) - Location embedding
- [pnpm](https://pnpm.io/) - Package manager

## Getting Started

### Prerequisites

- Node.js (version 18 or higher)
- pnpm (package manager)

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   ```

2. Navigate to the project directory:
   ```bash
   cd hm2_web
   ```

3. Install dependencies:
   ```bash
   pnpm install
   ```

### Development

Start the development server:
```bash
pnpm run dev
```

The site will be available at `http://localhost:4322/`.

### Building for Production

Generate a production build:
```bash
pnpm run build
```

Preview the production build:
```bash
pnpm run preview
```

## Project Structure

```
src/
├── components/
│   └── RoomCard.astro    # Room component (prepared for full site)
├── layouts/
│   └── Layout.astro      # Base HTML structure
├── pages/
│   └── index.astro       # Main landing page
├── styles/
│   └── global.css        # Global styles and Tailwind imports
└── env.d.ts              # TypeScript definitions
```

## Customization

### Colors

The color palette is defined in `tailwind.config.mjs`:
- Primary (Navy Blue): `#1e3a8a`
- Accent (Gold): `#d4af37`
- Background: `#f8fafc`
- Text: `#334155`

### Fonts

Fonts are imported in `src/layouts/Layout.astro`:
- Headings: Playfair Display (serif)
- Body text: Lato (sans-serif)

## Deployment

This site can be deployed to any static hosting service such as:
- Vercel
- Netlify
- GitHub Pages
- Cloudflare Pages

## Contact

For inquiries about Hotel Majestic II:
- Phone: +593 980098757
- Email: reservasmajestic2@hgchatnoir.com
- Address: Calle Gran Colombia 2-07 y Manuel Vega, Cuenca

## License

This project is proprietary to Hotel Majestic II and should not be used without permission.