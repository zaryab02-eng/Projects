# Sham's Alam Gun House

A premium React + TypeScript + Vite website for a licensed gun repair and restoration workshop in Gorakhpur, India.

This project presents a high-trust, heritage-style brand for firearm restoration, maintenance, and accessories while keeping the layout clean and conversion-focused.

---

## Stack

- React 18
- TypeScript
- Vite
- Tailwind CSS (v3)
- Framer Motion
- React Router DOM
- lucide-react

---

## Features

- Premium single-page marketing layout for a firearms workshop
- Dedicated restoration and gallery pages
- Floating WhatsApp CTA
- Footer with contact and business hours
- Centralized business settings in one config file
- Responsive layout for mobile and desktop
- Horizontal, snap-scrolling rows (Services, Reviews, Why Choose Us) instead of wrapping card grids

---

## Getting started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the dev server

   ```bash
   npm run dev
   ```

3. Build for production

   ```bash
   npm run build
   ```

4. Preview production build locally

   ```bash
   npm run preview
   ```

---

## Project structure

```text
ShamsAlamGunHouse/
├── index.html
├── package.json
├── tailwind.config.ts
├── postcss.config.js
├── tsconfig.json
├── tsconfig.node.json
├── vite.config.ts
├── public/
│   ├── logo.png
│   ├── workshop/
│   ├── family/
│   └── reviews/
├── src/
│   ├── App.tsx
│   ├── main.tsx
│   ├── index.css
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Footer.tsx
│   │   │   ├── Navbar.tsx
│   │   │   └── WhatsAppFloatButton.tsx
│   │   ├── sections/
│   │   │   ├── AboutUs.tsx
│   │   │   ├── AccessoriesShop.tsx
│   │   │   ├── BeforeAfterGallery.tsx
│   │   │   ├── BusinessHighlights.tsx
│   │   │   ├── Contact.tsx
│   │   │   ├── Hero.tsx
│   │   │   ├── LegacyTimeline.tsx
│   │   │   ├── Reviews.tsx
│   │   │   ├── Services.tsx
│   │   │   └── WhyChooseUs.tsx
│   │   ├── shared/
│   │   │   ├── BeforeAfterSlider.tsx
│   │   │   └── ProductCard.tsx
│   │   └── ui/
│   │       ├── Button.tsx
│   │       ├── Divider.tsx
│   │       ├── RevealOnScroll.tsx
│   │       └── SectionHeading.tsx
│   ├── data/
│   │   ├── gallery.ts
│   │   ├── products.ts
│   │   ├── restorations.ts
│   │   ├── reviews.ts
│   │   ├── services.ts
│   │   ├── siteConfig.ts
│   │   └── timeline.ts
│   ├── hooks/
│   │   ├── useCountUp.ts
│   │   └── useScrolled.ts
│   ├── pages/
│   │   ├── GalleryPage.tsx
│   │   ├── Home.tsx
│   │   └── RestorationsPage.tsx
│   ├── types/
│   │   └── index.ts
│   └── vite-env.d.ts
└── README.md
```

---

## Business config

Most site content is centralized in [src/data/siteConfig.ts](src/data/siteConfig.ts). This is the main file to update when changing:

- shop name
- legal name
- phone number
- email
- address
- WhatsApp number
- social links
- hours
- legal disclaimer

### Example values to update

- `shopName`
- `legalName`
- `tagline`
- `heroSubline`
- `contact.phoneDisplay`
- `contact.phoneHref`
- `contact.email`
- `contact.address`
- `contact.hours`
- `links.instagram`
- `links.facebook`

The WhatsApp link is built dynamically from the number in `siteConfig`, so updating the number there is enough in most cases.

### Business identity & founding story

`siteConfig.ts` tracks three separate facts about the business's history — these are intentionally kept apart and should not be merged into a single date or number:

| Field                                          | Value                           | Meaning                                                                                                                                                            |
| ---------------------------------------------- | ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `establishedYear`                              | `1958`                          | When the family craft took shape under this name                                                                                                                   |
| `trustYears`                                   | `100+`                          | The business's overall trust figure, used in stats and copy. The craft itself predates 1958, carried through an earlier, older family shop before a later division |
| `independentSince` / `independentSinceDisplay` | `2023-10-03` / `3 October 2023` | When this specific shop reopened independently after the family business division                                                                                  |

These are consumed in: `AboutUs.tsx` (founding story paragraph + "Years of Trust" badge), `WhyChooseUs.tsx` (section description), and indirectly in `BusinessHighlights.tsx` via the stats in `reviews.ts`.

When editing founding-story copy anywhere on the site, use `trustYears` for the "100+ years" trust narrative — never compute it as `currentYear - establishedYear`, since that undercounts against the intended story.

---

## Environment variables

This project supports environment variables for dynamic contact and review values.

Create a `.env` file in the project root with values such as:

```bash
VITE_WHATSAPP_NUMBER=919415281681
VITE_GOOGLE_REVIEWS_URL=https://g.page/your-review-link
VITE_GOOGLE_MAPS_EMBED_URL=https://www.google.com/maps?q=your+location
```

If these are not set, the app falls back to the defaults in [src/data/siteConfig.ts](src/data/siteConfig.ts).

---

## Content editing guide

### Business text

Update text directly in the data files under [src/data](src/data):

- [src/data/services.ts](src/data/services.ts)
- [src/data/reviews.ts](src/data/reviews.ts)
- [src/data/gallery.ts](src/data/gallery.ts)
- [src/data/products.ts](src/data/products.ts)
- [src/data/timeline.ts](src/data/timeline.ts)
- [src/data/restorations.ts](src/data/restorations.ts)

#### Google rating

- **Default location:** `src/data/reviews.ts` (exported as `googleRating`).
- **Default value:** `googleRating.average` is set to `5` in the data file. Update this value to reflect a different displayed average rating.

#### Business stats (Business Highlights section)

Default `businessStats` in `src/data/reviews.ts`, scaled to match the 100+ year trust story:

- Years of Trust: **100+**
- Repairs Completed: **12,500+**
- Restorations Completed: **1,900+**
- Happy Customers: **5,500+**

Update the `value` field per stat in that array to change these; `suffix` (`"+"`) and `label` can also be edited per entry.

### Photos

| What                            | File location                                                  | Path is set in                                                                                                                                                             |
| ------------------------------- | -------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Hero background                 | `public/logo.png`                                              | `Hero.tsx` (`backgroundImage` style)                                                                                                                                       |
| About Us photo                  | `public/workshop/*.jpg`                                        | `AboutUs.tsx` (`<img src>`)                                                                                                                                                |
| Family legacy photos            | `public/family/*.jpg`                                          | `photo` field per entry in `timeline.ts` (data exists but is not yet rendered in `LegacyTimeline.tsx` — add an `<img src={gen.photo}>` there if you want these to display) |
| Google review screenshots       | `public/reviews/review-01.png` … `review-08.png`               | `reviewScreenshots` array in `reviews.ts`                                                                                                                                  |
| Gallery photos                  | `public/gallery/...` (exact structure depends on `gallery.ts`) | `gallery.ts`                                                                                                                                                               |
| Restoration before/after photos | likely two fields per entry (before/after)                     | `restorations.ts`                                                                                                                                                          |
| Product photos                  | one field per entry                                            | `products.ts`                                                                                                                                                              |

General rule: drop the image file into the matching `public/` subfolder, then either match the existing filename or update the path string in the relevant `data/*.ts` file.

### Layout and sections

The page sections are in [src/components/sections](src/components/sections). Each section can be customized without changing the app structure.

### Footer and nav

- [src/components/layout/Footer.tsx](src/components/layout/Footer.tsx)
- [src/components/layout/Navbar.tsx](src/components/layout/Navbar.tsx)
- [src/components/layout/WhatsAppFloatButton.tsx](src/components/layout/WhatsAppFloatButton.tsx)

---

## Notes

- The current project is meant to be a polished brand website rather than a full e-commerce app.
- The contact section is intentionally minimal and does not duplicate the footer details.
- For real launch content, replace demo placeholders such as the email, social URLs, and review links.

---

## Common commands

```bash
npm install
npm run dev
npm run build
npm run preview
```

If you need to update the brand identity, business details, or launch content, start in [src/data/siteConfig.ts](src/data/siteConfig.ts).

### Homepage Sections

These files contain the section layout and visible text:

- [src/components/sections/Hero.tsx](src/components/sections/Hero.tsx)
- [src/components/sections/AboutUs.tsx](src/components/sections/AboutUs.tsx)
- [src/components/sections/LegacyTimeline.tsx](src/components/sections/LegacyTimeline.tsx)
- [src/components/sections/Services.tsx](src/components/sections/Services.tsx)
- [src/components/sections/BeforeAfterGallery.tsx](src/components/sections/BeforeAfterGallery.tsx)
- [src/components/sections/AccessoriesShop.tsx](src/components/sections/AccessoriesShop.tsx)
- [src/components/sections/Reviews.tsx](src/components/sections/Reviews.tsx)
- [src/components/sections/BusinessHighlights.tsx](src/components/sections/BusinessHighlights.tsx)
- [src/components/sections/WhyChooseUs.tsx](src/components/sections/WhyChooseUs.tsx)
- [src/components/sections/Contact.tsx](src/components/sections/Contact.tsx)

### Data-Driven Content

Most text content is stored in these files:

- [src/data/services.ts](src/data/services.ts)
- [src/data/restorations.ts](src/data/restorations.ts)
- [src/data/gallery.ts](src/data/gallery.ts)
- [src/data/products.ts](src/data/products.ts)
- [src/data/reviews.ts](src/data/reviews.ts)
- [src/data/timeline.ts](src/data/timeline.ts)
- [src/data/siteConfig.ts](src/data/siteConfig.ts)

If you want to change wording, prices, descriptions, service titles, or review details, start here.

---

## How to Run the Project

Install dependencies:

```bash
npm install
```

Run locally:

```bash
npm run dev -- --host 0.0.0.0
```

Then open:

```text
http://localhost:5173/
```

Build for production:

```bash
npm run build
```

---

## Recommended Editing Workflow

1. Update business identity in [src/data/siteConfig.ts](src/data/siteConfig.ts)
2. Replace placeholder images in the relevant data files and `public/` subfolders
3. Update contact details and social links
4. Edit service/product/review/timeline copy in the data files
5. Update SEO metadata in [index.html](index.html)
6. Run the project locally and verify the result

---

## Important Notes for Future AI Assistants

When updating this project, preserve these rules:

- Keep business content in the data files whenever possible
- Do not hard-code business details directly into components unless necessary
- Use the existing `siteConfig` as the main source of truth for contact details
- Use `siteConfig.establishedYear`, `siteConfig.trustYears`, and `siteConfig.independentSince(Display)` correctly and separately — never collapse them into one figure or date
- Replace placeholder images before publishing
- Keep the business name as Sham's Alam Gun House everywhere it appears
- Keep section vertical spacing consistent — see [Section spacing](#section-spacing) below; don't reintroduce the old, larger `py-28 sm:py-36` spacing
- Keep horizontal-scroll sections (`Services`, `Reviews`, `WhyChooseUs`) using the scroll pattern described below rather than reverting to a wrapping grid, unless asked
- In Tailwind v3, avoid arbitrary-value classes with nested `calc()`/`max()` and commas (e.g. `px-[max(2.5rem,calc(...))]`) — the class scanner can silently fail to pick these up. Prefer plain responsive padding (`px-6 sm:px-8 lg:px-12`) instead

---

## Quick Summary

If you want to make the site your real business website, the most important files to edit are:

- [src/data/siteConfig.ts](src/data/siteConfig.ts) for name, address, phone, email, hours, legal info, and the founding-story fields
- [src/data/timeline.ts](src/data/timeline.ts) for family history
- [src/data/services.ts](src/data/services.ts) for services offered
- [src/data/restorations.ts](src/data/restorations.ts) for before/after work
- [src/data/gallery.ts](src/data/gallery.ts) for workshop photos
- [src/data/products.ts](src/data/products.ts) for accessories/products
- [src/data/reviews.ts](src/data/reviews.ts) for social proof and business stats
- [index.html](index.html) for SEO and browser metadata

---

## Final Note

This project is set up to be easily customized for Sham's Alam Gun House. If you paste this README into another AI tool, it should be able to understand the project structure, where to edit content, and how to continue development.

### Shared style utilities

Reusable class combinations live in `src/index.css` under `@layer components`, e.g. `.btn-primary`, `.btn-ghost`, `.card-surface`, `.section-heading`, `.eyebrow`, `.glass-panel`. Prefer editing these over changing className strings in every component — they're the site's design system in CSS form.

---

## Animations

Animations are built with **Framer Motion**. Two conventions:

1. **Scroll reveals** — almost every section uses `<RevealOnScroll>` (`src/components/ui/RevealOnScroll.tsx`), which fades and slides content in once when it scrolls into view. Usage:

   ```tsx
   <RevealOnScroll direction="left" delay={0.1}>
     <YourContent />
   </RevealOnScroll>
   ```

   `direction` accepts `up | left | right`; `delay` staggers multiple items (commonly `(index % n) * 0.08`).

2. **One-off animations** — the Hero's staggered entrance, the Navbar's mobile menu, and the animated stat counters use `motion.*` components directly, since they need custom timing not covered by `RevealOnScroll`.

The animated number counters (Business Highlights) use a custom hook, `src/hooks/useCountUp.ts`, driven by `requestAnimationFrame` rather than Framer Motion, for finer control over the counting easing.

**Reduced motion:** `src/index.css` includes a `prefers-reduced-motion` media query that collapses all animation/transition durations to near-zero for users who've requested it at the OS level — this is handled globally and doesn't need to be repeated per component.

To adjust animation feel site-wide: tweak the `transition` defaults inside `RevealOnScroll.tsx` (duration, easing curve). To adjust one section's animation only, edit that section's own `motion.*` props.

### Horizontal scroll sections

`Services`, `Reviews`, and `WhyChooseUs` use a horizontal, snap-scrolling row (Apple-style) instead of a wrapping card grid. The pattern used in all three:

- **Outer `<div>`:** `overflow-x-auto` plus hidden-scrollbar utility classes:
  ```
  [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden
  ```
- **Inner `<div>`:** a plain `flex` row with fixed-width children (`shrink-0 w-[...]`)

This works with touch, trackpad, and mouse-drag scrolling on all devices with no JS carousel library. To add snap-to-card behavior, add `snap-x snap-mandatory` on the outer scroll div and `snap-start` on each child — use simple fixed pixel widths when doing this, and avoid `calc()`/`max()` inside arbitrary Tailwind classes (see the Tailwind v3 note above).

---

## Adding New Pages

The app is already wired for multi-page growth via `react-router-dom`. To add a page (e.g. a dedicated Blog):

1. Create `src/pages/Blog.tsx`:
   ```tsx
   export default function Blog() {
     return <section className="pt-32 container-px">{/* content */}</section>;
   }
   ```
2. Register the route in `src/App.tsx`:
   ```tsx
   import Blog from "@/pages/Blog";
   // ...
   <Routes>
     <Route path="/" element={<Home />} />
     <Route path="/blog" element={<Blog />} />
   </Routes>;
   ```
3. Add a link to it in `src/components/layout/Navbar.tsx`'s `navLinks` array (use a real path like `/blog` instead of a `#anchor`).
4. If deploying to a static host, make sure it's configured to fall back to `index.html` for unknown paths (SPA routing).

`Navbar`, `Footer`, and `WhatsAppFloatButton` are already outside `<Routes>` in `App.tsx`, so they'll automatically appear on the new page too.

---

## Reusable Components

| Component              | Location                                  | Purpose                                                                |
| ---------------------- | ----------------------------------------- | ---------------------------------------------------------------------- |
| `Button`, `LinkButton` | `components/ui/Button.tsx`                | Primary/ghost CTA styles, as a `<button>` or `<a>`                     |
| `SectionHeading`       | `components/ui/SectionHeading.tsx`        | Eyebrow + title + description header, used at the top of every section |
| `RevealOnScroll`       | `components/ui/RevealOnScroll.tsx`        | Scroll-triggered fade/slide wrapper                                    |
| `Divider`              | `components/ui/Divider.tsx`               | Thin horizontal rule for separating content                            |
| `BeforeAfterSlider`    | `components/shared/BeforeAfterSlider.tsx` | Draggable before/after image comparison, keyboard-accessible           |
| `ProductCard`          | `components/shared/ProductCard.tsx`       | Accessories Shop product card with WhatsApp "Buy" link                 |

Favor extending these over writing new one-off markup — most visual consistency in the site comes from every section reusing the same handful of primitives.

---

## Best Practices Followed

- **Content/component separation** — all editable text, prices, and image URLs live in `src/data/`, never hardcoded inside JSX.
- **Single source of truth** — `siteConfig.ts` centralizes business identity so contact details and founding-story facts never drift out of sync between sections.
- **Typed data contracts** — every content shape (`Product`, `Service`, `TimelineGeneration`, etc.) is defined once in `src/types/index.ts`, so a malformed data entry fails at compile time, not in the browser.
- **Component boundaries** — `sections/` never import from each other; shared logic lives in `shared/` or `ui/` instead, keeping each section independently movable/removable.
- **Path aliases** (`@/`) instead of long relative imports (`../../../data/...`), configured in both `tsconfig.json` and `vite.config.ts`.
- **Environment-driven config** — anything environment-specific (WhatsApp number, map embed, form endpoint) is read from `import.meta.env`, never hardcoded, with safe fallbacks for local development.
- **Consistent, tightened spacing** — see [Section spacing](#section-spacing) below.

---

## Section spacing

All major sections use `py-16 sm:py-20` for vertical rhythm (reduced from an earlier `py-28 sm:py-36`). `BusinessHighlights` uses a slightly smaller `py-14 sm:py-16`. The full-viewport `Hero` (`h-[100svh]`) is intentionally excluded from this pattern. Internal gaps below section headings (e.g. before a filter row or review summary) were also tightened, typically from `mb-14` to `mb-8`. Keep new sections within this range rather than reintroducing the old, larger spacing.

---

## Performance Optimizations

- **Lazy-loaded images** — every content image (`loading="lazy"`) below the hero fold is deferred until it's near the viewport.
- **Code splitting** — `vite.config.ts` splits `react`/`react-dom`/`react-router-dom` and `framer-motion` into separate vendor chunks, so route/library code caches independently from your own code.
- **Animate-once reveals** — `RevealOnScroll` uses `viewport={{ once: true }}`, so animations don't re-trigger or keep listening after the first play, reducing scroll-handler overhead on long pages.
- **CSS-driven masonry & filtering** — the Workshop Gallery uses native CSS columns instead of a JS masonry library; category filters use array `.filter()` on already-loaded data rather than re-fetching.
- **No unnecessary client state libraries** — the project relies on local component state and props; there's no global state library to ship or hydrate, since the site has no cross-page shared state yet.

**For production, also consider:** converting all images to WebP/AVIF, adding explicit `width`/`height` attributes (or `aspect-ratio` CSS, already used in several sections) to prevent layout shift, and serving images from an image CDN that can resize on the fly.

---

## SEO Considerations

- `index.html` includes descriptive `<title>`, `<meta name="description">`, Open Graph, and Twitter Card tags — update these with the real business name/description before launch.
- Semantic heading levels are used throughout (`h1` in the Hero only, `h2` for section titles via `SectionHeading`, `h3` for card/item titles) — don't skip levels when adding new sections.
- All content is server-rendered-equivalent at build time in the sense that it's static JSX, not fetched client-side, so crawlers see full content without executing JS-heavy data fetches.
- `alt` text is required and descriptive on every content image (see `data/*.ts` — every image entry has a paired `alt`/`title` field). Give real review screenshots distinct, descriptive `alt` text (e.g. "Google review from Punit Chand") rather than a repeated generic string.
- Add a `sitemap.xml` and `robots.txt` to `public/` once the site has a real domain and (if applicable) multiple pages.

---

## Accessibility Considerations

- **Visible focus states** — `:focus-visible` is styled globally in `index.css` with a brass outline, so keyboard users can always see what's focused.
- **Keyboard-operable before/after slider** — `BeforeAfterSlider` responds to arrow keys when its handle is focused, not just drag gestures.
- **`aria-label`s** on icon-only controls (menu toggle, WhatsApp float button, slider handle) since they have no visible text.
- **Reduced motion respected** — see [Animations](#animations).
- **Color contrast** — the ivory-on-iron and ash-on-charcoal text pairings were chosen to stay comfortably readable at body-copy sizes; if you customize the palette, re-check contrast with a tool like the [WebAIM contrast checker](https://webaim.org/resources/contrastchecker/).
- **Form labels** — every input in the Contact form has a real, associated `<label>` (not just a placeholder).
- **Horizontal scroll sections** — hidden scrollbars are a visual choice only; the underlying element remains natively scrollable via touch, trackpad, keyboard (when focused), and mouse drag.

---

## Future Enhancements

Ideas for growing this project beyond the current marketing-site scope:

- **Admin dashboard** — a lightweight authenticated panel to edit `data/*.ts` content without a code deploy (would likely move data from static files into a CMS or database).
- **Online appointment booking** — a calendar/slot picker for scheduling drop-offs, backed by a booking API.
- **Customer login** — accounts so customers can view their service history.
- **Repair status tracking** — a "track my repair" page/portal tied to a job ID.
- **Online payments** — replacing the WhatsApp "Buy" flow with real checkout (Razorpay/Stripe) once the business is ready to sell online.
- **Inventory management** — stock counts and availability for the Accessories Shop.
- **Search and filtering** — full-text search across services, products, and gallery.
- **Product categories as dedicated pages** — SEO-friendly category landing pages instead of in-page filters only.
- **Blog section** — for gunsmithing tips, maintenance guides, and shop news (also good for SEO).
- **Live Google Reviews integration** — swap the manual screenshot gallery for the real Google Places API once budget/quota allows.
- **Multi-language support** — Hindi/regional language toggle via `react-i18next` or similar.
- **Dark/Light theme toggle** — the current dark theme is intentional to the brand, but a light mode could be added using Tailwind's `dark:` variant infrastructure already present in `tailwind.config.ts` (`darkMode: 'class'`).
- **Email notifications** — automated confirmation emails when the contact form or booking flow is submitted.
- **WhatsApp order automation** — a bot/Business API flow to auto-acknowledge "Buy" and booking messages.
- **Analytics dashboard** — internal reporting on popular services/products and conversion from the contact form (the `VITE_ANALYTICS_ID` env var is already reserved for this).
- **Legacy timeline photos** — render `gen.photo` from `timeline.ts` inside `LegacyTimeline.tsx` (currently unused data field).

---

_Questions about a specific file? Every non-trivial file in this project has a short doc-comment at the top explaining its purpose — start there._
