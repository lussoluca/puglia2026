# AGENTS.md

## Project Overview

Static travel planning web app for a family trip to Puglia (southern Italy) in August/September 2026: 13 days by car from Alessandria, 12 nights across six stops (Montemarciano in the Marche, Vieste on the Gargano, Ostuni as the main base for six nights, then Matera, the Costa dei Trabocchi and Cervia on the way home). The site is a PWA (Progressive Web App) with offline support via Service Worker.

**Tech stack:** Astro 6.x · TypeScript (strict) · Plain CSS · Leaflet.js (maps, CDN) · Static JSON data layer  
**Deployment:** GitHub Pages at `https://lussoluca.github.io/puglia2026/`

---

## Requirements

- **Node.js >= 22.12.0** (enforced in `package.json` `engines` field)
- **npm** (uses `package-lock.json` — do not switch to pnpm or yarn)

---

## Setup

```bash
npm install
```

There are no environment variables required for local development. No `.env` file is needed.

---

## Development

```bash
# Start dev server with hot reload at http://localhost:4321
npm run dev

# Type-check all .astro and .ts files (installs @astrojs/check on first run)
npm run astro check

# Preview the production build locally
npm run preview
```

---

## Build & Deployment

```bash
# Build production site to ./dist/
npm run build
```

The site deploys automatically to GitHub Pages on every push to `main` via `.github/workflows/deploy.yml`. The pipeline runs: `npm ci` → `npm run build` → upload `./dist/` → deploy via `actions/deploy-pages@v4`.

The `BASE_URL` (`/puglia2026/`) is injected by Astro at build time via `import.meta.env.BASE_URL` — always use this variable when constructing internal links or asset paths.

---

## Project Architecture

### Directory Structure

```
puglia2026/
├── astro.config.mjs           # Astro config: site URL + base path for GitHub Pages
├── tsconfig.json              # TypeScript strict config (extends astro/tsconfigs/strict)
├── package.json               # Single prod dependency: astro
│
├── src/
│   ├── layouts/
│   │   └── Layout.astro       # HTML shell: navbar, footer, Leaflet CDN, SW registration
│   ├── pages/
│   │   ├── index.astro        # Single-page site, one section per component
│   │   └── day/
│   │       └── [day].astro    # Day detail pages 1-13, generated via getStaticPaths()
│   ├── components/            # One component per content section
│   │   ├── Hero.astro
│   │   ├── Overview.astro
│   │   ├── DailyLocation.astro    # Table: where we sleep and what we do each day
│   │   ├── Accommodation.astro    # The six stops
│   │   ├── Itinerary.astro
│   │   ├── Suggestions.astro      # Friend-recommended places, grouped by direction
│   │   ├── Contacts.astro         # Addresses and useful phone numbers
│   │   ├── Map.astro              # Interactive Leaflet map
│   │   ├── Beaches.astro
│   │   ├── Restaurants.astro
│   │   ├── Events.astro
│   │   ├── Budget.astro           # Shows live GPL price from MIMIT
│   │   ├── Weather.astro
│   │   ├── Gallery.astro          # Lightbox gallery with filters
│   │   ├── Checklist.astro        # LocalStorage-backed packing checklist
│   │   └── Tips.astro
│   ├── styles/
│   │   └── global.css             # Single global CSS file — no preprocessor, no Tailwind
│   └── data/                      # All app content as static JSON (no database, no API)
│       ├── trip.json
│       ├── itinerary.json         # 13-day itinerary, one entry per day page
│       ├── daily-locations.json   # Rows of the "Dove Saremo Ogni Giorno" table
│       ├── accommodation.json     # The six stops
│       ├── suggestions.json       # Friend recommendations + Castellana experiences
│       ├── contacts.json
│       ├── budget.json            # Budget; GPL price updated automatically by CI
│       ├── map-points.json
│       ├── beaches.json
│       ├── restaurants.json
│       ├── events.json
│       ├── gallery.json
│       ├── weather.json
│       ├── checklist.json
│       ├── tips.json
│       └── food-tips.json
│
├── public/
│   ├── manifest.json          # PWA Web App Manifest
│   ├── sw.js                  # Service Worker (network-first HTML, stale-while-revalidate assets)
│   ├── favicon.svg / favicon.ico
│   ├── apple-touch-icon.png
│   ├── icon-192.png / icon-512.png  # PWA icons
│   └── gallery/               # Static images (JPG) + thumbnails in thumb/
│
├── scripts/
│   └── update-fuel-price.sh   # Fetches live GPL price from MIMIT, patches budget.json
│
├── .github/workflows/
│   ├── deploy.yml             # Deploy to GitHub Pages on push to main
│   └── update-fuel-price.yml  # Daily cron: auto-update GPL price and commit
│
└── .agents/skills/
    ├── travel-verify/         # AI skill: systematic travel plan fact-checking
    └── adversarial-verify/    # AI skill: adversarial code/data/docs review (CoV)
```

### Routing

| URL | Page |
|-----|------|
| `/puglia2026/` | Main page |
| `/puglia2026/day/1/` … `/puglia2026/day/13/` | Day detail pages (static, generated from `itinerary.json`) |

### Component Props Pattern

Components accept optional props with JSON data and option flags. When props are omitted the component loads its own JSON defaults, so every section also works standalone. Examples:

```astro
<Budget budgetData={budget} summaryTitle="Totale stimato (alloggi esclusi)" />
<Map mapData={mapPoints} homeLabel="Alessandria" homeCoords={[44.9122, 8.6152]} />
<Checklist checklistData={checklist} storageKey="puglia2026-checklist" />
```

### Data Layer

All app content lives in `src/data/` as static JSON files. There is no external API or database. When adding or updating content, edit the appropriate JSON file directly. The `budget.json` fuel price is updated automatically by the daily GitHub Actions workflow.

Two files must stay consistent with each other when the plan changes: `itinerary.json` (one entry per day, drives the day pages) and `daily-locations.json` (one row per day in the overview table). `suggestions.json` references day numbers through `plannedDay`.

### Inline Scripts

`Layout.astro` and `Map.astro` use `is:inline` / `define:vars` scripts. These are **not** transpiled by Astro, so they must be plain JavaScript: no type annotations, no non-null assertions (`!`), no `as` casts. TypeScript syntax there throws a `SyntaxError` at runtime.

### PWA

- Cache name: `puglia2026-v3` (bump this in `public/sw.js` when making breaking changes to cached assets)
- Strategy: network-first for HTML navigation, stale-while-revalidate for same-origin assets, network-then-cache for CDN resources (Leaflet tiles, Google Fonts)
- The Service Worker hardcodes `/puglia2026` as the base path — update `sw.js` if the deployment path changes

### Checklist Persistence

Packing checklist state is stored in `localStorage` under `puglia2026-checklist`.

---

## Automated Workflows (GitHub Actions)

### `deploy.yml` — Deploy on push to `main`
Triggers on push to `main` or manual dispatch. Runs `npm ci` → `npm run build` → deploys `./dist/` to GitHub Pages.

### `update-fuel-price.yml` — Daily GPL price update
Runs daily at 09:00 UTC (after MIMIT publishes at ~08:30 Italian time). Downloads the MIMIT national fuel price CSV, computes the national average for GPL self-service, patches `src/data/budget.json`, and commits the change with a bot identity if the value changed.

The script recomputes `grandTotal` by summing the numeric part of every category total, so any category whose total is not a number is skipped by design.

To run this manually:
```bash
bash scripts/update-fuel-price.sh
```

---

## Code Style

- **No linter or formatter is configured.** There is no ESLint, Prettier, or Stylelint setup.
- TypeScript strict mode (via `astro/tsconfigs/strict`) provides type safety for `.astro` and `.ts` files.
- Styling lives in `src/styles/global.css` plus scoped `<style>` blocks in the newer components. Do not introduce Tailwind, SCSS, or CSS Modules without discussion.
- Content is written in Italian. Keep place names, opening hours and prices verifiable, and mark anything uncertain as such in the copy itself.

---

## External Dependencies (CDN, runtime)

These are loaded at runtime and are not bundled — do not install them as npm packages:

- **Leaflet 1.9.4** — `https://unpkg.com/leaflet@1.9.4/` (CSS + JS)
- **Google Fonts** — Playfair Display + Inter from `fonts.googleapis.com`
- **OpenStreetMap tiles** — used by Leaflet for map rendering

---

## Agent Skills

This project includes two AI agent skill definitions in `.agents/skills/`:

- **`travel-verify`**: Systematic travel plan fact-checking. Reads all `src/data/*.json` files and verifies geography, driving time realism, budget math, night counts, and cross-file consistency.
- **`adversarial-verify`**: General-purpose adversarial code/data/docs review using Chain-of-Verification (CoV) with red-teaming techniques.

---

## Common Gotchas

- Always use `import.meta.env.BASE_URL` for internal links and asset paths, not hardcoded `/puglia2026/`.
- Inline scripts (`is:inline`, `define:vars`) must be plain JavaScript — see **Inline Scripts** above.
- The Service Worker (`public/sw.js`) hardcodes the base path — it must be updated manually if the deployment path changes.
- Node.js >= 22.12.0 is required. Older versions will fail.
- There is only one npm dependency (`astro`). Do not add dependencies without good reason.
- Some images under `public/gallery/` are no longer referenced by `gallery.json` (leftovers from the earlier Salento itinerary). They are harmless but are not shipped in any page.
