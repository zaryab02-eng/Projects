# Sham's Alam Gun House — Project Handoff Guide

This project is a React + TypeScript + Vite website for Sham's Alam Gun House. It is designed as a premium, single-page marketing website for a licensed gun repair and restoration business.

This README is written so that any AI assistant, future developer, or client-side editor can understand the project structure, business purpose, and exactly where to change names, addresses, photos, contact details, and other content.

---

## 1. Project Purpose

This website is built to present Sham's Alam Gun House as a trusted, licensed, family-run workshop for:

- gun repair
- firearm restoration
- cleaning and maintenance
- metal refinishing
- wooden stock restoration
- safety inspections
- accessories sales

The site is currently a single-page experience with sections for hero, legacy, about, services, before/after gallery, workshop gallery, accessories shop, reviews, highlights, why choose us, and contact.

---

## 2. Tech Stack

- React 18
- TypeScript
- Vite
- Tailwind CSS
- Framer Motion
- React Router DOM
- lucide-react

---

## 3. Project Structure

```text
ShamsAlamGunHouse/
├── index.html
├── package.json
├── postcss.config.js
├── tailwind.config.ts
├── tsconfig.json
├── tsconfig.node.json
├── vite.config.ts
├── public/
├── src/
│   ├── App.tsx
│   ├── main.tsx
│   ├── index.css
│   ├── vite-env.d.ts
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
│   │   └── Home.tsx
│   └── types/
│       └── index.ts
```

---

## 4. How the Site Works

The homepage is assembled in [src/pages/Home.tsx](src/pages/Home.tsx). Each section is a separate component and most of the visible content comes from the data files in [src/data](src/data).

The app shell is in [src/App.tsx](src/App.tsx). It contains the navbar, footer, and floating WhatsApp button.

---

## 5. Where to Change Business Information

These are the main files to edit for business identity and content.

### 5.1 Business Name, Tagline, and Legal Name

File: [src/data/siteConfig.ts](src/data/siteConfig.ts)

Change these values:

- shopName
- legalName
- tagline
- heroSubline

Current business name: Sham's Alam Gun House

### 5.2 Address, Phone, Email, Hours, Social Links

File: [src/data/siteConfig.ts](src/data/siteConfig.ts)

Edit these fields:

- contact.phoneDisplay
- contact.phoneHref
- contact.email
- contact.address
- contact.hours
- links.instagram
- links.facebook

### 5.3 WhatsApp Message and Link

File: [src/data/siteConfig.ts](src/data/siteConfig.ts)

The WhatsApp link is generated from:

- contact.whatsappNumber
- contact.whatsappHref

You can also update the pre-filled message in [src/components/layout/WhatsAppFloatButton.tsx](src/components/layout/WhatsAppFloatButton.tsx).

### 5.4 SEO and Browser Title

File: [index.html](index.html)

Update:

- title
- meta description
- author
- Open Graph title/description
- Twitter title/description

### 5.5 Legal Disclaimer / License Info

File: [src/data/siteConfig.ts](src/data/siteConfig.ts)

Change:

- license.number
- legalDisclaimer

---

## 6. Where to Change Photos and Images

Images are mostly stored as URLs inside the data files, not inside the section components.

### 6.1 Hero Background

File: [src/components/sections/Hero.tsx](src/components/sections/Hero.tsx)

Replace the background image URL in the section style.

### 6.2 About Section Image

File: [src/components/sections/AboutUs.tsx](src/components/sections/AboutUs.tsx)

Replace the image URL used in the main about image.

### 6.3 Timeline Photos

File: [src/data/timeline.ts](src/data/timeline.ts)

Each timeline entry has a photo field. Replace those URLs with your real images.

### 6.4 Before/After Restoration Images

File: [src/data/restorations.ts](src/data/restorations.ts)

Each project has:

- beforeImage
- afterImage

Use matching images with similar framing for the slider to look correct.

### 6.5 Workshop Gallery Images

File: [src/data/gallery.ts](src/data/gallery.ts)

Each gallery item includes:

- src
- alt
- category

### 6.6 Product Images

File: [src/data/products.ts](src/data/products.ts)

Each product entry has an image field. Replace these with your product photos.

### 6.7 Review Screenshots

File: [src/data/reviews.ts](src/data/reviews.ts)

Each review contains a screenshot URL and customer name.

---

## 7. Where to Change Text Content

### 7.1 Homepage Sections

These files contain the section layout and visible text:

- [src/components/sections/Hero.tsx](src/components/sections/Hero.tsx)
- [src/components/sections/AboutUs.tsx](src/components/sections/AboutUs.tsx)
- [src/components/sections/Services.tsx](src/components/sections/Services.tsx)
- [src/components/sections/BeforeAfterGallery.tsx](src/components/sections/BeforeAfterGallery.tsx)
- [src/components/sections/WorkshopGallery.tsx](src/components/sections/WorkshopGallery.tsx)
- [src/components/sections/AccessoriesShop.tsx](src/components/sections/AccessoriesShop.tsx)
- [src/components/sections/Reviews.tsx](src/components/sections/Reviews.tsx)
- [src/components/sections/BusinessHighlights.tsx](src/components/sections/BusinessHighlights.tsx)
- [src/components/sections/WhyChooseUs.tsx](src/components/sections/WhyChooseUs.tsx)
- [src/components/sections/Contact.tsx](src/components/sections/Contact.tsx)

### 7.2 Data-Driven Content

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

## 8. How to Run the Project

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

## 9. Recommended Editing Workflow

1. Update business identity in [src/data/siteConfig.ts](src/data/siteConfig.ts)
2. Replace placeholder images in the relevant data files
3. Update contact details and social links
4. Edit service/product/review/timeline copy in the data files
5. Update SEO metadata in [index.html](index.html)
6. Run the project locally and verify the result

---

## 10. Important Notes for Future AI Assistants

When updating this project, preserve these rules:

- Keep business content in the data files whenever possible
- Do not hard-code business details directly into components unless necessary
- Use the existing siteConfig as the main source of truth for contact details
- Replace placeholder images before publishing
- Keep the business name as Sham's Alam Gun House everywhere it appears

---

## 11. Quick Summary

If you want to make the site your real business website, the most important files to edit are:

- [src/data/siteConfig.ts](src/data/siteConfig.ts) for name, address, phone, email, hours, legal info
- [src/data/timeline.ts](src/data/timeline.ts) for family history
- [src/data/services.ts](src/data/services.ts) for services offered
- [src/data/restorations.ts](src/data/restorations.ts) for before/after work
- [src/data/gallery.ts](src/data/gallery.ts) for workshop photos
- [src/data/products.ts](src/data/products.ts) for accessories/products
- [src/data/reviews.ts](src/data/reviews.ts) for social proof
- [index.html](index.html) for SEO and browser metadata

---

## 12. Final Note

This project is now set up to be easily customized for Sham's Alam Gun House. If you paste this README into another AI tool, it should be able to understand the project structure, where to edit content, and how to continue development.

### Shared style utilities

Reusable class combinations live in `src/index.css` under `@layer components`, e.g. `.btn-primary`, `.btn-ghost`, `.card-surface`, `.section-heading`, `.eyebrow`, `.glass-panel`. Prefer editing these over changing className strings in every component — they're the site's design system in CSS form.

---

## 13. Animations

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

---

## 14. Adding New Pages

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
4. If deploying to a static host, make sure it's configured to fall back to `index.html` for unknown paths (SPA routing) — see [Section 8](#8-deployment).

`Navbar`, `Footer`, and `WhatsAppFloatButton` are already outside `<Routes>` in `App.tsx`, so they'll automatically appear on the new page too.

---

## 15. Reusable Components

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

## 16. Best Practices Followed

- **Content/component separation** — all editable text, prices, and image URLs live in `src/data/`, never hardcoded inside JSX.
- **Single source of truth** — `siteConfig.ts` centralizes business identity so contact details never drift out of sync between the Navbar, Footer, and Contact section.
- **Typed data contracts** — every content shape (`Product`, `Service`, `TimelineGeneration`, etc.) is defined once in `src/types/index.ts`, so a malformed data entry fails at compile time, not in the browser.
- **Component boundaries** — `sections/` never import from each other; shared logic lives in `shared/` or `ui/` instead, keeping each section independently movable/removable.
- **Path aliases** (`@/`) instead of long relative imports (`../../../data/...`), configured in both `tsconfig.json` and `vite.config.ts`.
- **Environment-driven config** — anything environment-specific (WhatsApp number, map embed, form endpoint) is read from `import.meta.env`, never hardcoded, with safe fallbacks for local development.

---

## 17. Performance Optimizations

- **Lazy-loaded images** — every content image (`loading="lazy"`) below the hero fold is deferred until it's near the viewport.
- **Code splitting** — `vite.config.ts` splits `react`/`react-dom`/`react-router-dom` and `framer-motion` into separate vendor chunks, so route/library code caches independently from your own code.
- **Animate-once reveals** — `RevealOnScroll` uses `viewport={{ once: true }}`, so animations don't re-trigger or keep listening after the first play, reducing scroll-handler overhead on long pages.
- **CSS-driven masonry & filtering** — the Workshop Gallery uses native CSS columns instead of a JS masonry library; category filters use array `.filter()` on already-loaded data rather than re-fetching.
- **No unnecessary client state libraries** — the project relies on local component state and props; there's no global state library to ship or hydrate, since the site has no cross-page shared state yet.

**For production, also consider:** converting all images to WebP/AVIF, adding explicit `width`/`height` attributes (or `aspect-ratio` CSS, already used in several sections) to prevent layout shift, and serving images from an image CDN that can resize on the fly.

---

## 18. SEO Considerations

- `index.html` includes descriptive `<title>`, `<meta name="description">`, Open Graph, and Twitter Card tags — update these with the real business name/description before launch.
- Semantic heading levels are used throughout (`h1` in the Hero only, `h2` for section titles via `SectionHeading`, `h3` for card/item titles) — don't skip levels when adding new sections.
- All content is server-rendered-equivalent at build time in the sense that it's static JSX, not fetched client-side, so crawlers see full content without executing JS-heavy data fetches.
- `alt` text is required and descriptive on every content image (see `data/*.ts` — every image entry has a paired `alt`/`title` field).
- Add a `sitemap.xml` and `robots.txt` to `public/` once the site has a real domain and (if applicable) multiple pages.

---

## 19. Accessibility Considerations

- **Visible focus states** — `:focus-visible` is styled globally in `index.css` with a brass outline, so keyboard users can always see what's focused.
- **Keyboard-operable before/after slider** — `BeforeAfterSlider` responds to arrow keys when its handle is focused, not just drag gestures.
- **`aria-label`s** on icon-only controls (menu toggle, WhatsApp float button, slider handle) since they have no visible text.
- **Reduced motion respected** — see [Section 13](#13-animations).
- **Color contrast** — the ivory-on-iron and ash-on-charcoal text pairings were chosen to stay comfortably readable at body-copy sizes; if you customize the palette (Section 12), re-check contrast with a tool like the [WebAIM contrast checker](https://webaim.org/resources/contrastchecker/).
- **Form labels** — every input in the Contact form has a real, associated `<label>` (not just a placeholder).

---

## 20. Future Enhancements

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

---

_Questions about a specific file? Every non-trivial file in this project has a short doc-comment at the top explaining its purpose — start there._
