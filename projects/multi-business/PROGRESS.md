# PROJECT PROGRESS (read this first in a new chat)

Last updated: 28 Nov 2026

## STATUS: LIVE (SEO / pre-render update built, build check pending)

Both the website and the admin app are deployed on Cloudflare Pages and working. The owner can log in on his phone and
change products, categories and gallery photos, and the website shows the changes straight away.

On 23 Nov 2026 the website was updated for search engines (pre-rendering, product URLs, SEO tags) and the company
name / location were standardised. On 28 Nov 2026 new favicons were added and the navbar WhatsApp button was removed.
Mark the SEO update as fully done after `npm run build` passes with no errors and the live site is checked.

## Documents (which file to read for what)

- `ADMIN-README.md`: the admin app (setup, data format, design rules, limits, troubleshooting)
- `WEBSITE-README.md`: the website (setup, where to change things, SEO, pause switch, troubleshooting)
- `PROGRESS.md` (this file): status, ids, what is done, what is next

## What we built

1. **Website** for Neu Natusz Healthcare Private Limited (React + Vite + pre-rendering). Folder: `natusz-website`
2. **Admin app** (installable phone app, login, edits products / categories / gallery). Folder: `admin-app`
   (was `admin app`). One admin app is meant to serve many future websites.

Both projects live in ONE GitHub repo (`zaryab02-eng/Projects`) but are deployed as TWO separate Cloudflare Pages projects.
They only connect through **Firebase**. Photos are stored in **Cloudinary**. Everything is on free plans.

## Company facts to keep consistent everywhere

- Name: **Neu Natusz Healthcare Private Limited**; abbreviated **Neu Natusz Healthcare Pvt Ltd**
- Location: **Dombivli, Thane, Maharashtra 421203** only (never any other city)
- Working hours: **10:00 AM – 6:00 PM** (structured data currently says Monday to Saturday; confirm)
- Website: https://natusz.pages.dev

## Accounts and ids (no secrets here)

| Thing                                    | Value                                                                              |
| ---------------------------------------- | ---------------------------------------------------------------------------------- |
| GitHub repo                              | `zaryab02-eng/Projects` (holds both folders)                                       |
| Cloudflare Pages projects                | website: `natusz-website`, admin: `natusz-admin` (Root directory = each folder)    |
| Firebase project id                      | `storepilot-8a157` (Firestore in asia-south1, Mumbai)                              |
| Site id for this website                 | `natusz`                                                                           |
| Firestore `sites/natusz`                 | field `name` = `Natusz Healthcare`; also holds `categories` (set by the admin app) |
| Firestore `users/<the owner's User UID>` | field `siteId` = `natusz`                                                          |
| Cloudinary cloud name                    | `lfpnw5u1`                                                                         |
| Cloudinary upload preset                 | `sites_unsigned` (must be **Unsigned**)                                            |

Live addresses: website `natusz.pages.dev`, admin `__________.pages.dev` (fill in)

The 4 Firebase values (apiKey, authDomain, projectId, appId) are in the `.env` files and in the Cloudflare variables.
The Firebase web API key is public by design (it is in every visitor's browser). Never share the Cloudinary API secret. It is never needed.

Environment variable lists and the exact names are in `ADMIN-README.md` (section 4C) and `WEBSITE-README.md` (section 5).
No quotes, no spaces around `=`. After changing a variable on Cloudflare, redeploy (Deployments → Retry deployment).

## DONE

- [x] Admin app and website built; Firebase, Cloudinary, the owner's login and site records set up
- [x] Fixed: blank Settings tab (stray line in `Settings.jsx`)
- [x] Products: own "Product details" list (price, pack size, anything), "Others" category, photos shown whole
- [x] Website: price in bold with ₹, product pop-up opens centred with the close button always visible,
      menu bar solid on all pages except the top of Home
- [x] Gallery: blurred, centred photo view with title and caption underneath; back arrow always visible;
      taps open photos reliably (Draggable `onClick`); lighter on phones
- [x] Fixed: blank hero on the very first visit (`src/lib/ready.js`)
- [x] Both projects deployed on Cloudflare Pages; Firebase Authorized domains added; admin app installed on the owner's phone
- [x] Home swipe rows on phones, spacing pass, simplified navbar and footer, pause switch
- [x] Admin app redesigned for non-technical users (24 Nov)
- [x] Website favicons replaced with the new generated set (28 Nov)
- [x] Navbar "Enquire" WhatsApp button removed; floating WhatsApp button stays (28 Nov)

## How to update the live sites later

1. Change files on your computer and test with `npm run dev`.
2. Run `npm run build` once to check there are no red errors.
3. In the terminal at the top of the repo:
   ```
   git add .
   git commit -m "update"
   git push
   ```
4. Cloudflare rebuilds BOTH projects automatically (normal, free). Wait a few minutes.
5. If you change an environment variable on Cloudflare, redeploy that project.
6. After adding, renaming or deleting products in the admin app, redeploy the WEBSITE project (Deployments → Retry deployment) so product pages and the sitemap update.

If VS Code shows no changes to push: save the files (`Ctrl + S`), check they are inside the repo folder, and run `git status`.

## Adding a new client website later

Follow `ADMIN-README.md`, section 7 (checklist) and section 5 (create the owner's login). Short version: new id (e.g. `clientb`),
same 4 Firebase values, `VITE_SITE_ID=clientb`, copy the shared `src/lib` files and the product card / pop-up logic.

## Possible next steps (all optional)

- Buy a domain (for example `natuszhealthcare.com`) and connect it: Cloudflare Pages project → Custom domains.
  Then update `url` in `src/config/site.js`, the links in the JSON-LD in `index.html`, and `public/robots.txt`.
  Add the domain to Firebase Authorized domains if you also point the admin app at a custom domain.
- Replace sample content with the owner's real products, photos, team quote and social links.
- Give every gallery photo a short title (max 24 characters) in the admin app, so the name shows when it opens.
- Set `VITE_SITE_URL` on the admin Cloudflare project to show the "View website" button.
- Add a Cloudflare deploy hook so the website rebuilds itself after product changes.
- Ideas: enquiry basket, price list PDF, blog page, Hindi/Marathi, analytics.

## Known notes

- Firebase free limit: about 50,000 reads a day across all websites on the project.
- If every product is deleted, the website shows its built-in samples. Use "Show on website" off to hide things.
- Product fields suit catalogue-style websites. Very different site types need different fields.
- Keep folder names without spaces.
- A product's web address comes from its name. Renaming a product changes its link.
- When something breaks: press F12 → Console, copy the red error, and send it with the file named in the error.

## How to continue in a new chat

Paste this file, then say what you want to do next and any error text you see. Also attach the file the error names
(for example `Settings.jsx`) so it can be fixed with the real code in front of it.

---

## Update 28 Nov 2026 (favicons, navbar)

- Favicons: new set from a favicon generator. Files in `natusz-website/public/`: `favicon.ico`, `favicon.svg`, `favicon-96x96.png`,
  `apple-touch-icon.png`, `site.webmanifest`, `web-app-manifest-192x192.png`, `web-app-manifest-512x512.png`. The old `favicon.svg` was replaced.
  `index.html` now has 5 `<link>` lines for them (icon png, icon svg, shortcut icon, apple-touch-icon, manifest).
- `site.webmanifest`: name "Neu Natusz Healthcare Pvt Ltd", short name "Natusz", theme colour `#062A2E`, icons `purpose: "any"`
  (the logo sits close to the edges, so `maskable` could crop it).
- Google Search favicon: not showing yet. Needs a re-crawl (days to weeks). To do: Search Console, request indexing, submit sitemap. A custom domain makes it more reliable.
- `Navbar.jsx`: removed the "Enquire" WhatsApp button and its two imports (`generalEnquiryLink`, `WhatsAppIcon`). The floating WhatsApp button (`WhatsAppFloat.jsx`) and the Home call-to-action card are unchanged. On desktop the menu now sits to the right of the logo.
- Docs: `WEBSITE-README.md` updated (favicons, navbar, admin names "Photos" / "Product categories" / "More options"). `ADMIN-README.md` unchanged.
- Still to do: [ ] check `/favicon.ico` and `/favicon-96x96.png` open on the live site, [ ] check the navbar on a phone and on a desktop, [ ] Search Console steps above.

---

## Update 24 Nov 2026 (admin app redesign)

- Admin app UI redesigned for non-technical users (age 40 to 50): 18px text, 56px buttons, plain words, big Back button, "Are you sure?" box instead of browser pop-ups, messages at the top.
- Product form: photo, name, Price (₹), category, description, Show on website; everything else under "More details". Price is still saved as a detail named "Price".
- Gallery tab renamed "Photos". Install app and Add samples moved to Settings → More options. Colour picker and pack-drawing dropdown removed from the screens (data fields kept).
- Files changed (admin): `src/index.css`, `components/ui.jsx`, `App.jsx`, `Login.jsx`, `Products.jsx`, `Gallery.jsx`, `Categories.jsx`, `Settings.jsx`. No new packages.
- `ADMIN-README.md` rewritten with a quick-facts table, folder map, data format, design rules and limits, so a new chat can start from it.
- Still to do: [ ] run `npm run build` in `admin-app` and fix any red errors, [ ] test every screen on the owner's phone, [ ] push and check the Cloudflare build, [ ] set Cloudflare "Build watch paths" so each project rebuilds only for its own folder.
- Capacity (free plans): the limit is Firestore reads (about 1,400 website visits per day in total across all sites), not photos. See `ADMIN-README.md` section 8.

---

## Update 23 Nov 2026 (design / layout)

- Founder's name removed from Home and the docs; use "team" wording. Done in About.jsx and config/site.js.
- Home page now swipeable rows on phones (Home.jsx, ProductShowcase.jsx, ProductCard.jsx), spacing tightened.
- Added pause switch: `VITE_SITE_PAUSED=true` + redeploy pauses the site; remove it + redeploy resumes. See WEBSITE-README.md.
- Spacing pass done on Home, About, Products, Contact, PageHeader, Footer.
- Navbar: no drop-down; equal-width text tabs row on phones/tablets.
- Footer simplified (no WhatsApp button, no menu); short footer on About and Contact. Home hero WhatsApp button and bottom strip removed (duplicates).
- Not yet reviewed: Gallery page spacing.

## Update 23 Nov 2026 (SEO, pre-rendering, company name and location)

**Content changes**

- Company name standardised to **Neu Natusz Healthcare Private Limited** / **Neu Natusz Healthcare Pvt Ltd** (`src/config/site.js` has `legalName`, `legalNameShort`, `name`).
- Location everywhere is **Dombivli, Thane, Maharashtra 421203** (was "Dombivli East ... 421204"). Working hours **10:00 AM – 6:00 PM** shown on Contact and in the footer.
- Product images were NOT touched (the `NATUZ Q10` image is being fixed separately).

**Search engine work**

- Whole site is pre-rendered with `vite-react-ssg` (installed as `vite-react-ssg@0.8.9` because the project uses Vite 5). Every page's text is in the first HTML. The opening logo screen is only a visual overlay (`Preloader.jsx` now always starts the same on server and browser).
- New build: `npm run build` = `node scripts/fetch-content.mjs && vite-react-ssg build`. The script copies the public product list from Firebase (REST) into `src/data/snapshot.json` and writes `public/sitemap.xml`. It never fails the build.
- Every product has its own address `/products/:slug` (slug from its name, `src/lib/slug.js`). Cards are real links; the pop-up opens on top of the Products page; Close returns to the list.
- Unique `<title>`, description and Open Graph / Twitter tags on every page via `src/components/Seo.jsx`. Product pages also get `Product` JSON-LD.
- `index.html`: `Organization` + `LocalBusiness` JSON-LD (Dombivli, Thane 421203, 10:00–18:00, Mon–Sat assumed) and a marked comment where the Google Search Console verification tag goes. Real italic Fraunces font link kept.
- `public/robots.txt` and `public/sitemap.xml` added (sitemap regenerated each build).
- Routes moved to `src/routes.jsx` (the pause switch moved there from `main.jsx`). `src/App.jsx` and `vercel.json` are no longer used.
- Gallery engine loads only in the browser. `whatsapp.js` no longer prints "(undefined)" for products without a pack size.
- GitHub secret-scanning email: the Firebase web key was found in `.vite-react-ssg-temp` (build temp folder). Fix: add `.vite-react-ssg-temp`, `dist`, `node_modules`, `.env` to `.gitignore`, `git rm -r --cached .vite-react-ssg-temp`, commit, push, close the alert as false positive. No key rotation needed.

**Files changed / added (website)**
New: `src/routes.jsx`, `src/components/Seo.jsx`, `src/lib/catalog.js`, `src/lib/slug.js`, `src/lib/hydrated.js`, `src/data/snapshot.json`, `scripts/fetch-content.mjs`, `public/robots.txt`, `public/sitemap.xml`.
Changed: `index.html`, `package.json`, `vite.config.js`, `src/main.jsx`, `src/config/site.js`, `src/lib/content.jsx`, `src/lib/whatsapp.js`, `src/components/Preloader.jsx`, `ProductShowcase.jsx`, `ProductCard.jsx`, `ProductModal.jsx`, `Footer.jsx`, `Logo.jsx` (labels), `WhatsAppFloat.jsx` (label), `src/pages/Home.jsx`, `About.jsx`, `Contact.jsx`, `Products.jsx`, `Gallery.jsx`, `Paused.jsx`, `NotFound.jsx`, `src/data/gallery.js` (one line).

**Still to do for this update**

- [ ] Run `npm run build` locally: look for `[natusz] Saved N products` and `sitemap.xml written`, no red errors. Open `dist/about/index.html` and one `dist/products/<name>/index.html` and check the text is there.
- [ ] Run `npm run preview` and check Home, Products, a product card, Close, Gallery, Contact.
- [ ] Confirm every page that uses `<Seo />` has `import Seo from "../components/Seo";` (About, Home, Contact were missed once).
- [ ] Add `public/og-image.png` (1200 x 630).
- [ ] Confirm working days (Mon–Sat in the structured data) and fix `index.html` if different.
- [ ] Push, check Cloudflare build variables, then check the live site.
- [ ] Paste the Search Console verification tag into `index.html`, deploy, verify, submit `https://natusz.pages.dev/sitemap.xml`.
- [ ] Optional: restrict the Firebase API key to the site addresses in Google Cloud Console (then add a `Referer` header in `scripts/fetch-content.mjs`).
