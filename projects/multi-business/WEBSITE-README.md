# Neu Natusz Healthcare Private Limited: Website

A premium, multi-page website for **Neu Natusz Healthcare Private Limited** (short form: **Neu Natusz Healthcare Pvt Ltd**;
pharmaceutical marketing, skin care medicines), Dombivli, Thane, Maharashtra 421203. Working hours: 10:00 AM – 6:00 PM.

Built with **React + Vite + Tailwind CSS + GSAP + React Router**, and **pre-rendered at build time with `vite-react-ssg`**
so search engines read the full text of every page straight from the HTML.

| Page          | Route             | What it has                                                                                                                      |
| ------------- | ----------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| Home          | `/`               | Animated logo hero, category strip, scroll-reveal statement, category tiles, featured products, "what to expect", call to action |
| About         | `/about`          | Company story, team note, values, company details                                                                                |
| Products      | `/products`       | Search bar, category filters, sort, product cards, detail pop-up, **tap to message on WhatsApp**                                 |
| Product (one) | `/products/:slug` | One medicine. Opens the same pop-up on top of the Products page. Shareable and indexable by Google                               |
| Gallery       | `/gallery`        | Full-screen draggable zoom-grid gallery (your supplied GSAP code)                                                                |
| Contact       | `/contact`        | Phone, email, address, working hours, WhatsApp, message form (sends via WhatsApp), Google Map                                    |

---

## 1. Setup (first time)

1. Install **Node.js (LTS version)** from https://nodejs.org if you don't have it. Check with `node -v`.
2. Put this whole folder anywhere on your computer, e.g. `natusz-website`.
3. Open the folder in **VS Code**, then open the terminal (`Ctrl + ~`) and run:

```bash
npm install
npm run dev
```

4. Open the address it prints (usually http://localhost:5173; if the admin app is running too, this one may be 5174).

Other commands:

```bash
npm run build     # saves the latest products, pre-renders every page, writes sitemap.xml, makes the /dist folder
npm run preview   # test the built website locally
```

> `npm run build` first runs `scripts/fetch-content.mjs` (copies the admin app's products into the build and writes
> `public/sitemap.xml`), then `vite-react-ssg build` (creates one HTML file per page and per product).
> If `npm install` ever complains about `vite-react-ssg` and Vite versions (ERESOLVE), run
> `npm install -D vite-react-ssg@0.8.9`. Do not use `--force`.

> The gallery uses GSAP's `Draggable`, `Flip`, `CustomEase` and `InertiaPlugin`. These are included free in
> the `gsap` package from version 3.13, so no extra setup is needed.

---

## 2. Folder map

```
natusz-website/
├─ index.html                  Fonts, Search Console tag spot, Organization + LocalBusiness JSON-LD (no title: each page sets its own)
├─ tailwind.config.js          Brand colours and fonts
├─ vite.config.js              Vite + pre-render (SSG) options
├─ .env.example                Template for the Firebase values and site id (copy to .env)
├─ scripts/
│  └─ fetch-content.mjs        Runs before every build: saves the products and writes public/sitemap.xml
├─ public/
│  ├─ favicon.svg              Browser tab icon
│  ├─ robots.txt               Tells search engines they may crawl, and where the sitemap is
│  ├─ sitemap.xml              All pages + all products (rewritten on every build)
│  ├─ og-image.png             1200 x 630 picture shown when a link is shared (add this yourself)
│  ├─ gallery/                 Gallery photos (placeholders g01.svg to g14.svg)
│  └─ products/                Put real product photos here
└─ src/
   ├─ config/site.js           ★ Name, phone, WhatsApp, email, address, hours, website address, social links
   ├─ routes.jsx               ★ List of pages / routes (replaces the old App.jsx) and the pause switch
   ├─ main.jsx                 Starts the pre-rendered app
   ├─ data/products.js         ★ Built-in sample products and categories (fallback)
   ├─ data/gallery.js          ★ Built-in sample gallery (fallback)
   ├─ data/snapshot.json       Products saved at build time (written by the build; do not edit)
   ├─ lib/firebase.js          Connects to Firebase, reads VITE_SITE_ID
   ├─ lib/content.jsx          Loads products, gallery and categories (build-time copy first, then live from Firebase)
   ├─ lib/catalog.js           Shared product / gallery cleaning used by the build and the browser
   ├─ lib/slug.js              Turns a product name into its web address (slug)
   ├─ lib/hydrated.js          Tiny flag used by the product pop-up
   ├─ lib/images.js            Asks Cloudinary for web-sized photos
   ├─ lib/ready.js             Makes the hero and gallery wait for the opening intro to finish
   ├─ lib/whatsapp.js          Builds the WhatsApp message links
   ├─ pages/                   One file per page (Home, About, Products, Gallery, Contact, NotFound, Paused)
   ├─ components/              Reusable pieces (Navbar, Footer, Logo, Seo, Preloader, product cards, animations...)
   ├─ gallery/NatuszGallery.js The gallery engine (your supplied code, adapted)
   ├─ gallery.css              Gallery styling (only affects the Gallery page)
   └─ index.css                Global styles and button styles
```

★ = the files you will edit most often.

> **Products and gallery are managed from the admin app** (section 8). The files in `src/data/` are only used as a
> fallback when Firebase is empty or unreachable.
> `src/App.jsx` and `vercel.json` are no longer used. You can delete them.

---

## 3. Where to make changes

### Name, phone number, WhatsApp, email, address, working hours, website address

Edit **`src/config/site.js`**. This one file feeds the navbar, footer, contact page, floating WhatsApp
button, every "Enquire on WhatsApp" button and the page titles.

- `legalName`: "Neu Natusz Healthcare Private Limited". `legalNameShort` / `name`: "Neu Natusz Healthcare Pvt Ltd" (used where the name is abbreviated)
- `hours`: shown on the Contact page and in the footer (currently 10:00 AM – 6:00 PM)
- `url`: the website address used in page links and the sitemap (currently `https://natusz.pages.dev`)
- `whatsappNumber`: digits only with country code, no `+` or spaces (e.g. `919278450890`)
- `phoneDisplay` / `phoneTel`: how the number is shown / dialled
- `address`: the location is **Dombivli, Thane, Maharashtra 421203** everywhere. Do not add any other city
- `social`: paste Instagram / Facebook / LinkedIn links to show those icons in the footer (leave `""` to hide)
- `mapQuery`: what Google Maps searches for on the Contact page

### Add, edit or remove a product

**Use the admin app** (Products tab). It saves to Firebase and the website updates straight away for visitors.
A new product's own page (`/products/<slug>`) and its sitemap entry appear after the next build (see section 9).

Only edit **`src/data/products.js`** if you want to change the built-in fallback samples:

```js
{
  id: "my-new-cream",            // unique, lowercase, no spaces
  name: "My New Cream",
  category: "moisturisers",      // must match a category id
  form: "Cream",
  visual: "tube",                // "tube", "jar" or "bottle" (used until you add a photo)
  pack: "50 g",
  composition: "Ingredient 1, Ingredient 2",
  description: "One short line.",
  featured: true,                // true = also shown on the Home page (first 4 are used)
  image: "/products/my-new-cream.jpg"   // optional real photo
}
```

Products added in the admin app also carry a `details` list, for example
`details: [{ label: "Price", value: "₹250" }, { label: "Pack size", value: "50 g" }]`. The product pop-up shows
every detail in order. Products without `details` (like the built-in samples) show `form`, `pack` and `composition`.

### Product web addresses (slugs)

Every product gets an address made from its name, for example `Sun Shield SPF 50` becomes `/products/sun-shield-spf-50`
(`src/lib/slug.js`). Two products with the same name become `name` and `name-2`. **Renaming a product changes its address.**
Tapping a product card goes to that address and opens the pop-up. Close goes back to the list where you were.

### Add or rename a category

**Use the admin app** (Settings → Edit categories). The `categories` list at the top of `src/data/products.js` is only the
fallback. The Home page category tiles pick an icon in `src/pages/Home.jsx` (`icons` list near the top).

### Gallery photos

**Use the admin app** (Gallery tab). Photos go to Cloudinary and appear on the website straight away.
The built-in placeholders live in `public/gallery/` and `src/data/gallery.js` (fallback only).

Gallery controls: drag to move, tap a photo to open, **Esc** or the back arrow to close.
When a photo is open, the grid behind it and the menu bar are blurred, and the photo is shown whole in the centre with
its number, title and caption underneath (all in `src/gallery.css`). Give photos a title in the admin app so the name shows.
Keyboard: `1` zoom out, `2` normal, `3` zoom in, `F` fit.

To change the grid size, open `src/gallery/NatuszGallery.js` and look for `rows: 8, cols: 12` in the constructor.
The gallery engine is loaded only in the browser (`src/pages/Gallery.jsx`), so the build never touches it.

### Page text (headlines, About story, team note, values)

- Home page text: top of **`src/pages/Home.jsx`** (`statement`, `principles`) and the hero headline in the JSX
- About page text: **`src/pages/About.jsx`** (`values`, story paragraphs, team quote)
- Contact form topics: `topics` list at the top of **`src/pages/Contact.jsx`**

### Page titles and descriptions (SEO)

Each page has a `<Seo ... />` block near the top of its JSX (`title`, `description`, `path`). Edit those two texts to
change what Google shows. Keep titles under about 60 characters and descriptions under about 160. See section 10.

### Colours and fonts

- Colours: **`tailwind.config.js`** → `colors`. They come from the logo (`brand` teal, `rose` red, `ink` and `deep` dark teals).
  Change a value there and the whole site follows.
- Fonts: **`index.html`** (the Google Fonts link, which includes the italic Fraunces used by the Home hero) and `fontFamily` in `tailwind.config.js`.
  Currently Fraunces (headings) and Manrope (body).

### Menu items

**`src/components/Navbar.jsx`** → the `navLinks` list. The footer does not repeat the menu.
On phones and tablets the pages are shown as one equal-width row of text tabs under the logo (no drop-down); the current page has a green underline. On computers they sit in the top bar. The menu bar is see-through only at the very top of the Home page. On every other page it is solid, so the links are always readable.

### Add a new page

1. Create `src/pages/Offers.jsx` (copy any existing page) and put a `<Seo title="..." description="..." path="/offers" />` at the top of its JSX (`import Seo from "../components/Seo";`).
2. In `src/routes.jsx` import it and add `{ path: "offers", element: <Offers /> }` inside `children`.
3. Add `{ to: "/offers", label: "Offers" }` to `navLinks` in `Navbar.jsx`.
4. Add `/offers` to the list of fixed pages in `scripts/fetch-content.mjs` (the `urls` line) so it is in the sitemap.

### Logo

The logo is drawn as vectors in `src/components/logoPaths.js` (converted from the supplied PDF), and used through
`src/components/Logo.jsx`. If the company ever changes its logo, replace those paths or swap `Logo.jsx` for an `<img>`.

### Footer disclaimer and copyright

`src/components/Footer.jsx`. The footer shows logo, description, "Reach us" details (phone, email, address, working hours) and the disclaimer. On the About and Contact pages it is shortened (no contact details) because those pages already show them. To change which pages get the short footer, edit the `minimal` line.

---

## 4. Things to replace before going live

1. **Products**: load the samples in the admin app, then edit or replace them with the owner's real range. Product details
   for medicines should be accurate and approved by him.
2. **Gallery photos**: upload real photos in the admin app (8 or more looks best). The built-in placeholder pictures still say "Natusz Healthcare" inside the image.
3. **Team quote and company story** in `src/pages/About.jsx`: written as a draft; let the owner approve or edit the wording.
4. **Social links** in `src/config/site.js` (empty for now).
5. **`public/og-image.png`** (1200 x 630): the picture shown when the site is shared on WhatsApp, Facebook, etc.
6. Optional: **GST / drug licence numbers** (many pharma sites show these in the footer).
7. Check the working days in `index.html` (JSON-LD `dayOfWeek`). It currently says Monday to Saturday. Change it if the business is open on other days.

---

## 5. Putting the website online (Cloudflare Pages)

1. Put this folder on GitHub as its own **private** repo (`.env` is ignored on purpose):
   ```bash
   git init
   git add .
   git commit -m "first"
   git branch -M main
   git remote add origin https://github.com/YOURNAME/natusz-website.git
   git push -u origin main
   ```
2. Cloudflare dashboard → **Workers & Pages → Create**. Choose **Pages → Connect to Git**. If you only see the Workers
   screen, click the small link "Looking to deploy Pages? Get started". (Do not use the Workers setup screen.)
   Pick the repo.
3. Build settings:
   - Project name: e.g. `natusz-website` (this becomes `natusz-website.pages.dev`)
   - Framework preset: **Vite**
   - Build command: `npm run build`
   - Build output directory: `dist`
   - **Root directory (advanced):** if the website and the admin app live in ONE GitHub repo (our setup), type the website
     folder's name here exactly as it appears on GitHub. If the website has its own repo, leave it as `/`.
4. Under **Environment variables** add (name = value):
   `VITE_FIREBASE_API_KEY`, `VITE_FIREBASE_AUTH_DOMAIN`, `VITE_FIREBASE_PROJECT_ID`, `VITE_FIREBASE_APP_ID`,
   `VITE_SITE_ID` = `natusz`, and `NODE_VERSION` = `20`.
   These are also read by the build script, so they must be set in Cloudflare or the live build will use sample products.
5. **Save and Deploy.** You get a `.pages.dev` link. Open it to check the site.
6. Buy a domain (e.g. `natuszhealthcare.com`) and connect it: Pages project → **Custom domains**.
   Then change `url` in `src/config/site.js`, the links in the JSON-LD in `index.html`, and the sitemap line in `public/robots.txt`.
7. If you change an environment variable later, redeploy (Deployments → Retry), because values are baked in at build time.

`public/_redirects` and `vercel.json` are not needed on Cloudflare Pages; you can delete them. Every page and product now has its own HTML file, so links like `/products` and `/products/some-cream` work when opened or refreshed.

To update the live website later: change files, then `git add .`, `git commit -m "update"`, `git push`.
If the website and the admin app share one repo, one push rebuilds both Cloudflare projects. That is normal.

---

## 6. Ideas for later

- Enquiry basket (add several products, send one WhatsApp message)
- Product photos and price lists / PDF catalogue download
- Blog or "Skin care tips" page
- Doctors / chemists login area
- Multiple languages (Hindi, Marathi)
- Google Analytics, a Google Business profile link
- A Cloudflare "deploy hook" so the site rebuilds by itself when products change (see section 9)

---

## 7. Troubleshooting

- **Blank page or "module not found"**: run `npm install` again, then `npm run dev`.
- **White screen "Seo is not defined"**: a page uses `<Seo />` but is missing `import Seo from "../components/Seo";` at the top. Add the import.
- **`npm install -D vite-react-ssg` gives ERESOLVE**: the newest version needs Vite 6. Run `npm install -D vite-react-ssg@0.8.9` (works with Vite 5).
- **Build fails with a syntax error in `src/lib/hydrated.js`**: that file must contain only its 5 lines of code. Text such as `User-agent: *` belongs in `public/robots.txt`.
- **Build fails with "window / document / localStorage is not defined"**: some code runs in the browser only. Move it inside `useEffect`, or guard it with `typeof window !== "undefined"`.
- **Fonts look different**: they load from Google Fonts, so internet is required. The Home hero needs the italic Fraunces link in `index.html`.
- **Gallery looks empty on first load**: the grid animates in after the opening logo screen; wait a second.
- **WhatsApp opens with no text**: check `whatsappNumber` in `src/config/site.js` is digits only.
- **A change doesn't show**: save the file; if it still doesn't, stop the terminal (`Ctrl + C`) and run `npm run dev` again.
- **Website shows sample products, not the ones from the admin app**: check the four Firebase values and
  `VITE_SITE_ID=natusz` in `.env` (and in Cloudflare's environment variables), restart `npm run dev`, and make sure
  the admin app has products saved for that site id.
- **A new product shows on the site but its own link gives "page not found" or no sitemap entry**: its page is created at build time. Redeploy (Deployments → Retry deployment).
- **A detail (like price) added in the admin app does not show:** make sure `ProductCard.jsx`, `ProductModal.jsx` and
  `src/lib/content.jsx` / `src/lib/catalog.js` are the current versions that read the `details` list, then refresh.
- **Hero blank on the very first visit, fine after a refresh:** make sure `src/lib/ready.js` is the current version
  (it starts the waiting animations outside the intro's own GSAP callback, with an 8 second safety net).
- **Gallery photo does not open when tapped:** `src/gallery/NatuszGallery.js` needs the `onClick` callback inside
  `initDraggable` (Draggable can swallow normal taps).
- **Gallery is slow on a phone:** blur is only used on computers with a mouse. Phones use a darker backdrop (`src/gallery.css`).
- **Product pop-up opens out of place or its close button is hidden:** make sure `ProductModal.jsx` is the current
  version. It draws the pop-up directly on the page body so it always appears in the same place.
- **GitHub emails "Secrets detected" (Google API key)**: it is the Firebase web key, which is public by design. It was found in the build's temporary folder (`.vite-react-ssg-temp`). Make sure `.gitignore` contains `.vite-react-ssg-temp`, `dist`, `node_modules` and `.env`, run `git rm -r --cached .vite-react-ssg-temp`, commit, push, then close the alert on GitHub as "false positive / public key".

---

## 8. Connecting the admin app (edit products and gallery from a phone)

A separate project, the **admin app**, lets the owner log in on his phone and change products, categories and gallery photos
without touching code. It is hosted **separately** from this website, and **one admin app can manage many websites**
(each website has its own id). This website reads its content from Firebase.

1. Set up the admin app first (see its README, sections 1 to 3), including the owner's account linked to site id `natusz`.
2. In this project copy `.env.example` to `.env` and fill in:
   - the **same four Firebase values** as the admin app
   - `VITE_SITE_ID=natusz` (this website's id; it must match the `siteId` given to the owner's login)
3. Run `npm install`, then `npm run dev`.
4. When deploying on Cloudflare, add the same five values under **Environment variables** (plus `NODE_VERSION` = `20`),
   then redeploy once.

How it behaves:

- At build time the products are copied into the pre-rendered pages (so Google sees them). In the browser, the live content from Firebase then replaces that copy straight away.
- If Firebase is empty, not configured, or unreachable, it shows the built-in samples in `src/data/products.js`
  and `src/data/gallery.js`, so the site never looks broken.
- Changes made in the admin app appear for visitors immediately, with no redeploy. Only the product's own page and the sitemap wait for the next build.
- **Others:** a product in the "Others" category (or in a category that was deleted) is grouped under **Others**. The
  Others card and filter only appear when at least one product uses it (`src/lib/catalog.js`).
- **Product details:** whatever details the owner adds (price, pack size, anything) show in the product pop-up
  (`src/components/ProductModal.jsx`). The card shows the first two short details under the name (`ProductCard.jsx`).
  A detail named **Price, MRP, Cost or Rate** is shown in bold, and a plain number gets a rupee sign (250 shows as ₹250).
- **Photos:** product photos are shown whole (`object-contain`), never stretched or cropped. In the gallery, the small
  grid tiles are square crops; opening a photo shows the whole picture (`src/gallery.css`).
- Categories are managed in the admin app (Settings → Edit categories). The list in `src/data/products.js` is only the
  fallback used when nothing is set in Firebase.

Relevant files: `src/lib/firebase.js` (connection and site id), `src/lib/content.jsx` and `src/lib/catalog.js` (load products, gallery and
categories), `src/lib/images.js` (asks Cloudinary for web-sized photos), `scripts/fetch-content.mjs` (build-time copy).

### Reusing this setup for another website

For your next website, copy only the pieces it needs (`src/lib/firebase.js`, `src/lib/content.jsx`, `src/lib/catalog.js`, `src/lib/slug.js`, `src/lib/images.js`, `scripts/fetch-content.mjs`),
use a new `VITE_SITE_ID` (e.g. `clientb`), and create that owner's login in the admin app (admin README, section 2).

---

## 9. Pre-rendering, product pages and redeploys

- `npm run build` (locally and on Cloudflare) does two things: `scripts/fetch-content.mjs` reads the public product list from Firebase (REST) and writes `src/data/snapshot.json` and `public/sitemap.xml`; then `vite-react-ssg build` writes one HTML file per page and per product (for example `dist/about/index.html`, `dist/products/<slug>/index.html`).
- If Firebase cannot be reached during the build, it keeps the last saved copy (or the built-in samples) and the build still passes.
- **A new, renamed or deleted product needs a redeploy** for its own page and sitemap entry: Cloudflare → Deployments → **Retry deployment**. Visitors still see the change instantly on the Products page.
- Optional automation: Cloudflare Pages project → Settings → **Builds → Deploy hooks** creates a link that rebuilds the site when opened. You can open it after bulk product changes.
- To check a build: open `dist/about/index.html` in VS Code. You should see the real About text, the page title and "Dombivli".

---

## 10. Search engines (SEO)

- **Page titles, descriptions and share tags:** each page sets its own through `src/components/Seo.jsx` (title, description, canonical link, Open Graph and Twitter tags). Product pages get the product name, a description built from its details, and `Product` structured data.
- **Structured data:** `index.html` holds `Organization` and `LocalBusiness` JSON-LD with the Dombivli, Thane 421203 address and 10:00 – 18:00 hours (currently Monday to Saturday).
- **Google Search Console:** in `index.html`, find the big comment "GOOGLE SEARCH CONSOLE VERIFICATION" in the `<head>` and paste your verification `<meta>` tag under it. Deploy, click Verify in Search Console, then submit `https://natusz.pages.dev/sitemap.xml`.
- **`public/robots.txt`** allows crawling and points to the sitemap. **`public/sitemap.xml`** is rewritten on every build with all pages and products.
- **The opening logo screen** (`src/components/Preloader.jsx`) is only a visual overlay. The page text is already in the HTML underneath it, so crawlers are not blocked.
- If the site ever has `<meta name="robots" content="noindex">` in `index.html`, remove it. Only the Paused and Not Found pages are meant to be `noindex`.

---

## Pause / resume the website (if the client has not paid)

The website has a built-in "pause switch". Nothing is deleted. Products, photos and the admin app stay safe.

**Pause**

1. Cloudflare → Workers & Pages → the website project → **Settings** → **Variables and secrets**.
2. Add variable `VITE_SITE_PAUSED` = `true` (Production).
3. **Deployments** → latest deployment → **Retry deployment** (variables are baked in at build time).
4. Visitors now see only: "This website is temporarily unavailable. Please check back soon." (and search engines are told not to index it).

**Resume**

1. Same place: delete `VITE_SITE_PAUSED` (or set it to `false`).
2. **Retry deployment**. The full site is back in about 2 minutes.

Files involved: `src/routes.jsx` (checks the switch), `src/pages/Paused.jsx` (the page shown).

## Layout notes

- Home page: category cards and featured products are a sideways swipe row on phones (`ProductShowcase` has a `scroll` prop). On tablets and computers they become a grid.
- Wording: the site uses "our team". No personal names of the founder are shown.
- No repeated items: WhatsApp enquiry lives in the top bar and the Home call-to-action card; the footer has no WhatsApp button or menu links.
- Spacing: inner pages use a compact title band (`PageHeader.jsx`); Products' sticky search bar sits at `top-[104px]` on phones (below the two-row menu) and `top-[72px]` on computers. If the menu height changes, update those values and the top padding in `PageHeader.jsx` / the Home hero.
- Product images are never modified by the code. Replace a photo from the admin app.
