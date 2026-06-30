# Developer Handoff & Project Documentation

## 1. Project Overview
**OperDiva** is a high-performance, cinematic landing page for a WordPress plugin designed to optimize websites for AI agents and LLMs. The site focuses on a futuristic, "Agentic Web" aesthetic with deep-space themes and glassmorphism.

## 2. Technology Stack
- **Framework:** React 19 (Vite)
- **Language:** TypeScript
- **Styling:** Tailwind CSS 4.0
- **Animations:** Motion (Framer Motion)
- **Icons:** Lucide React
- **Build Tool:** Vite

## 3. Project Structure
```text
/
├── .env.example        # Environment variable templates
├── index.html          # Entry HTML
├── package.json        # Dependencies and scripts
├── tsconfig.json       # TypeScript configuration
├── vite.config.ts      # Vite & Tailwind configuration
└── src/
    ├── App.tsx         # Main application logic & components
    ├── main.tsx        # React entry point
    └── index.css       # Global styles & Tailwind imports
```

## 4. Design System
### Colors
- **Background:** `#020617` (Slate 950)
- **Primary (Brand):** `rgb(14, 165, 233)` (Sky 500) - Used for glows and primary buttons.
- **Secondary:** `rgb(139, 92, 246)` (Violet 500) - Used for gradients and accents.
- **Glass:** Semi-transparent white/slate with `backdrop-blur`.

### Typography
- **Display/Headings:** Sans-serif (system) with `font-bold` and `tracking-tight`.
- **Body:** Standard sans-serif for readability.
- **Special:** `glow-text` class for neon-gradient effects.

### Spacing & Layout
- **Section Padding:** Optimized `py-12` to `py-16` for a compact, fast-scrolling experience.
- **Container:** `max-w-7xl` for standard desktop width.

## 5. Component Breakdown (Inside App.tsx)
- **Navbar:** Sticky glassmorphism header with navigation links.
- **Hero Section:** Animated video background (YouTube iframe) with immersive HUD overlay.
- **Social Proof:** Infinite scrolling marquee of trusted AI ecosystem logos.
- **Value Props:** 3-column grid highlighting the "how it works" flow with connecting lines.
- **Features Grid:** Bento-style grid with hover states and icons.
- **Demo/Video:** Scaled 115% to hide YouTube branding, wrapped in a high-tech frame.
- **Comparison:** Side-by-side "Old Way" vs "New Way" cards.
- **FAQ:** Interactive accordion using state-based toggles.
- **Pricing:** Three-tier model (Lite, Pro, Custom) with a "Growth Plan" highlight for the Pro tier.
- **Footer:** Multi-column layout with product, company, and legal links.

## 6. Animations & Interactions
- **Infinite Scroll:** Custom Tailwind animation for the logos.
- **Motion Effects:** Staggered `initial/animate` transitions for section entry.
- **HUD Pulse:** CSS animations for the scanlines and background glows.
- **Hover States:** Scaled buttons and shadow glows (`hover:shadow-[0_0_30px_rgba(14,165,233,0.3)]`).

## 7. Customization Guide
### How to change Content:
- **Text:** All text is located in `App.tsx`. Use CMD+F to find specific strings.
- **Colors:** Find `--color-brand-primary` and `--color-brand-secondary` in `index.css` or Tailwind classes in `App.tsx`.
- **Section Order:** Rearrange the component calls (e.g., `<FAQSection />`) in the main `App` component return statement.
- **Pricing:** Update the pricing cards in the `#pricing` section of `App.tsx`.

## 8. Best Practices Used
- **Mobile-First:** Used `md:` prefixes for responsive adjustments.
- **Performance:** Using SVGs (Lucide) and optimized iframe embed params for fast loads.
- **SEO Ready:** Descriptive headers and semantic HTML tags.
- **Type Safety:** Functional components with TypeScript props/interfaces.

## 9. Deployment Instructions
1. Run `npm install` to install dependencies.
2. Run `npm run build` to generate the `dist/` folder.
3. Upload the contents of `dist/` to any static hosting provider (Vercel, Netlify, Cloudflare Pages, etc.).

---
*Documentation generated for OperDiva Handoff.*
