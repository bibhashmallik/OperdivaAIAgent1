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

## 9. Deployment Instructions (CyberPanel Server)
To update the live site, run the following steps in the server terminal:
1. Navigate to the website directory:
   ```bash
   cd /home/wpaioptimizer.com/public_html
   ```
2. Pull the latest code (use `-f` or `reset --hard` if untracked credentials files conflict):
   ```bash
   git fetch origin
   git reset --hard origin/main
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Build the production assets (Vite frontend + Node backend):
   ```bash
   npm run build
   ```
5. Apply correct CyberPanel ownership to prevent 503 errors:
   ```bash
   chown -R wpaio5878:wpaio5878 /home/wpaioptimizer.com/public_html
   ```
6. Restart application PM2 process and LiteSpeed:
   ```bash
   pm2 restart all
   systemctl restart lsws
   ```

---

## 10. CyberPanel Gotchas & Troubleshooting (CRITICAL)

### Port Conflict (503 Service Unavailable)
- **Problem:** CyberPanel uses port `3000` internally for proxying. If the Node.js application runs on `3000`, it creates an infinite loop or gets blocked.
- **Solution:** Always verify the application runs on custom port **`3055`** (defined as `PORT = process.env.PORT || 3055` in `server.ts`).

### File Permissions (503 Service Unavailable)
- **Problem:** Running `npm run build` or `git pull` as `root` user changes file ownership to `root:root`, which blocks the LiteSpeed web server user (`wpaio5878`) from reading the files.
- **Solution:** Always run the `chown` permission restore after any server builds:
  ```bash
  chown -R wpaio5878:wpaio5878 /home/wpaioptimizer.com/public_html
  ```

### Node.js Version & WebSockets
- **Problem:** Newer packages (like `@supabase/supabase-js`) require native WebSocket support, which is missing in Node.js 20 and below, causing startup crashes.
- **Solution:** The server has been upgraded to **Node.js v22**. Ensure the server remains on Node 22+. For backward compatibility, a WebSocket polyfill (using the `ws` package) is registered globally at the top of `server.ts`:
  ```typescript
  import WebSocket from "ws";
  (global as any).WebSocket = WebSocket;
  ```

### Git Dubious Ownership Warning
- **Problem:** When logged in as `root`, Git blocks execution inside the CyberPanel user folder because of ownership differences.
- **Solution:** Configure git to allow safe access:
  ```bash
  git config --global --add safe.directory /home/wpaioptimizer.com/public_html
  ```

### Missing Credentials (.env and serviceAccountKey.json.json)
- **Problem:** Configuration files containing keys are ignored in `.gitignore` and do not push to GitHub. When deploying to a new server or environment, they must be manually created.
- **Solution:** Create `/home/wpaioptimizer.com/public_html/.env` and `/home/wpaioptimizer.com/public_html/serviceAccountKey.json.json` manually on the server.

---
*Documentation updated for WP AI Optimizer.*
