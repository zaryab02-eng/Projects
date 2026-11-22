# Natusz Healthcare Pvt Ltd: Website

A premium, multi-page website for **Natusz Healthcare Pvt Ltd** (pharmaceutical marketing, skin care
medicines), Dombivli East, Thane, Maharashtra.

Built with **React + Vite + Tailwind CSS + GSAP + React Router**.

| Page     | Route       | What it has                                                                                                                      |
| -------- | ----------- | -------------------------------------------------------------------------------------------------------------------------------- |
| Home     | `/`         | Animated logo hero, category strip, scroll-reveal statement, category tiles, featured products, "what to expect", call to action |
| About    | `/about`    | Company story, founder note, values, company details                                                                             |
| Products | `/products` | Search bar, category filters, sort, product cards, detail pop-up, **tap to message on WhatsApp**                                 |
| Gallery  | `/gallery`  | Full-screen draggable zoom-grid gallery (your supplied GSAP code)                                                                |
| Contact  | `/contact`  | Phone, email, address, WhatsApp, message form (sends via WhatsApp), Google Map                                                   |

---

## 1. Setup (first time)

1. Install **Node.js (LTS version)** from https://nodejs.org if you don't have it. Check with `node -v`.
2. Put this whole folder anywhere on your computer, e.g. `natusz-website`.
   (Or create the folders yourself in VS Code and paste each file at the same path shown below.)
3. Open the folder in **VS Code**, then open the terminal (`Ctrl + ~`) and run:

```bash
npm install
npm run dev
```

4. Open the address it prints (usually http://localhost:5173; if the admin app is running too, this one may be 5174).

Other commands:

```bash
npm run build     # makes the final website in the /dist folder
npm run preview   # test the built website locally
```

> The gallery uses GSAP's `Draggable`, `Flip`, `CustomEase` and `InertiaPlugin`. These are included free in
> the `gsap` package from version 3.13, so no extra setup is needed.

---

## 2. Folder map

```
natusz-website/
├─ index.html                  Page title, description, Google Fonts
├─ tailwind.config.js          Brand colours and fonts
├─ .env.example                Template for the Firebase values and site id (copy to .env)
├─ public/
│  ├─ favicon.svg              Browser tab icon
│  ├─ gallery/                 Gallery photos (placeholders g01.svg to g14.svg)
│  └─ products/                Put real product photos here
└─ src/
   ├─ config/site.js           ★ Phone, WhatsApp, email, address, founder name, social links
   ├─ data/products.js         ★ Built-in sample products and categories (fallback)
   ├─ data/gallery.js          ★ Built-in sample gallery (fallback)
   ├─ lib/firebase.js          Connects to Firebase, reads VITE_SITE_ID
   ├─ lib/content.jsx          Loads products, gallery and categories from Firebase
   ├─ lib/images.js            Asks Cloudinary for web-sized photos
   ├─ lib/ready.js             Makes the hero and gallery wait for the opening intro to finish
   ├─ pages/                   One file per page (Home, About, Products, Gallery, Contact, NotFound)
   ├─ components/              Reusable pieces (Navbar, Footer, Logo, product cards, animations...)
   ├─ gallery/NatuszGallery.js The gallery engine (your supplied code, adapted)
   ├─ gallery.css              Gallery styling (only affects the Gallery page)
   ├─ index.css                Global styles and button styles
   ├─ lib/whatsapp.js          Builds the WhatsApp message links
   └─ App.jsx                  List of pages / routes
```

★ = the files you will edit most often.

> **Products and gallery are now managed from the admin app** (section 8). The files in `src/data/` are only used as a
> fallback when Firebase is empty or unreachable.

---

## 3. Where to make changes

### Phone number, WhatsApp number, email, address

Edit **`src/config/site.js`**. This one file feeds the navbar, footer, contact page, floating WhatsApp
button and every "Enquire on WhatsApp" button.

- `whatsappNumber`: digits only with country code, no `+` or spaces (e.g. `919278450910`)
- `phoneDisplay` / `phoneTel`: how the number is shown / dialled
- `social`: paste Instagram / Facebook / LinkedIn links to show those icons in the footer (leave `""` to hide)
- `mapQuery`: what Google Maps searches for on the Contact page

### Add, edit or remove a product

**Use the admin app** (Products tab). It saves to Firebase and the website updates straight away.

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

### Page text (headlines, About story, founder note, values)

- Home page text: top of **`src/pages/Home.jsx`** (`statement`, `principles`) and the hero headline in the JSX
- About page text: **`src/pages/About.jsx`** (`values`, story paragraphs, founder quote)
- Contact form topics: `topics` list at the top of **`src/pages/Contact.jsx`**

### Colours and fonts

- Colours: **`tailwind.config.js`** → `colors`. They come from the logo (`brand` teal, `rose` red, `ink` and `deep` dark teals).
  Change a value there and the whole site follows.
- Fonts: **`index.html`** (the Google Fonts link) and `fontFamily` in `tailwind.config.js`.
  Currently Fraunces (headings) and Manrope (body).

### Menu items

**`src/components/Navbar.jsx`** → the `navLinks` list. The footer menu uses the same list.
The menu bar is see-through only at the very top of the Home page. On every other page it is solid, so the links are always readable.

### Add a new page

1. Create `src/pages/Offers.jsx` (copy any existing page).
2. In `src/App.jsx` import it and add `<Route path="/offers" element={<Offers />} />`.
3. Add `{ to: "/offers", label: "Offers" }` to `navLinks` in `Navbar.jsx`.

### Logo

The logo is drawn as vectors in `src/components/logoPaths.js` (converted from the supplied PDF), and used through
`src/components/Logo.jsx`. If the company ever changes its logo, replace those paths or swap `Logo.jsx` for an `<img>`.

### Footer disclaimer and copyright

`src/components/Footer.jsx`

---

## 4. Things to replace before going live

1. **Products**: load the samples in the admin app, then edit or replace them with Ahmed's real range. Product details
   for medicines should be accurate and approved by him.
2. **Gallery photos**: upload real photos in the admin app (8 or more looks best).
3. **Founder quote and company story** in `src/pages/About.jsx`: written as a draft; let Ahmed approve or edit the wording.
4. **Social links** in `src/config/site.js` (empty for now).
5. Optional: add real **business hours** or **GST / drug licence numbers** (many pharma sites show these in the footer).

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
5. **Save and Deploy.** You get a `.pages.dev` link. Open it to check the site.
6. Buy a domain (e.g. `natuszhealthcare.com`) and connect it: Pages project → **Custom domains**.
7. If you change an environment variable later, redeploy (Deployments → Retry), because values are baked in at build time.

`public/_redirects` and `vercel.json` are not needed on Cloudflare Pages; you can delete them. Cloudflare serves
`index.html` for page links like `/products`, so refreshing those pages works.

To update the live website later: change files, then `git add .`, `git commit -m "update"`, `git push`.
If the website and the admin app share one repo, one push rebuilds both Cloudflare projects. That is normal.

---

## 6. Ideas for later

- Enquiry basket (add several products, send one WhatsApp message)
- Product photos and price lists / PDF catalogue download
- Blog or "Skin care tips" page
- Doctors / chemists login area
- Multiple languages (Hindi, Marathi)
- Google Analytics, a Google Business profile link, SEO title and description per page

---

## 7. Troubleshooting

- **Blank page or "module not found"**: run `npm install` again, then `npm run dev`.
- **Fonts look different**: they load from Google Fonts, so internet is required.
- **Gallery looks empty on first load**: the grid animates in after the opening logo screen; wait a second.
- **WhatsApp opens with no text**: check `whatsappNumber` in `src/config/site.js` is digits only.
- **A change doesn't show**: save the file; if it still doesn't, stop the terminal (`Ctrl + C`) and run `npm run dev` again.
- **Website shows sample products, not the ones from the admin app**: check the four Firebase values and
  `VITE_SITE_ID=natusz` in `.env` (and in Cloudflare's environment variables), restart `npm run dev`, and make sure
  the admin app has products saved for that site id.
- **A detail (like price) added in the admin app does not show:** make sure `ProductCard.jsx`, `ProductModal.jsx` and
  `src/lib/content.jsx` are the new versions that read the `details` list, then refresh.
- **Hero blank on the very first visit, fine after a refresh:** make sure `src/lib/ready.js` is the current version
  (it starts the waiting animations outside the intro's own GSAP callback, with an 8 second safety net).
- **Gallery photo does not open when tapped:** `src/gallery/NatuszGallery.js` needs the `onClick` callback inside
  `initDraggable` (Draggable can swallow normal taps).
- **Gallery is slow on a phone:** blur is only used on computers with a mouse. Phones use a darker backdrop (`src/gallery.css`).
- **Product pop-up opens out of place or its close button is hidden:** make sure `ProductModal.jsx` is the current
  version. It draws the pop-up directly on the page body so it always appears in the same place.

---

## 8. Connecting the admin app (edit products and gallery from a phone)

A separate project, the **admin app**, lets Ahmed log in on his phone and change products, categories and gallery photos
without touching code. It is hosted **separately** from this website, and **one admin app can manage many websites**
(each website has its own id). This website reads its content from Firebase.

1. Set up the admin app first (see its README, sections 1 to 3), including Ahmed's account linked to site id `natusz`.
2. In this project copy `.env.example` to `.env` and fill in:
   - the **same four Firebase values** as the admin app
   - `VITE_SITE_ID=natusz` (this website's id; it must match the `siteId` given to Ahmed's login)
3. Run `npm install`, then `npm run dev`.
4. When deploying on Cloudflare, add the same five values under **Environment variables** (plus `NODE_VERSION` = `20`),
   then redeploy once.

How it behaves:

- If Firebase has content for this site id, the website shows it (products, gallery, and the category list).
- If Firebase is empty, not configured, or unreachable, it shows the built-in samples in `src/data/products.js`
  and `src/data/gallery.js`, so the site never looks broken.
- Changes made in the admin app appear on the website immediately, with no redeploy.
- **Others:** a product in the "Others" category (or in a category that was deleted) is grouped under **Others**. The
  Others card and filter only appear when at least one product uses it (`src/lib/content.jsx`).
- **Product details:** whatever details the owner adds (price, pack size, anything) show in the product pop-up
  (`src/components/ProductModal.jsx`). The card shows the first two short details under the name (`ProductCard.jsx`).
  A detail named **Price, MRP, Cost or Rate** is shown in bold, and a plain number gets a rupee sign (250 shows as ₹250).
- **Photos:** product photos are shown whole (`object-contain`), never stretched or cropped. In the gallery, the small
  grid tiles are square crops; opening a photo shows the whole picture (`src/gallery.css`).
- Categories are managed in the admin app (Settings → Edit categories). The list in `src/data/products.js` is only the
  fallback used when nothing is set in Firebase.

Relevant files: `src/lib/firebase.js` (connection and site id), `src/lib/content.jsx` (loads products, gallery and
categories), `src/lib/images.js` (asks Cloudinary for web-sized photos).

### Reusing this setup for another website

For your next website, copy only the pieces it needs (`src/lib/firebase.js`, `src/lib/content.jsx`, `src/lib/images.js`),
use a new `VITE_SITE_ID` (e.g. `clientb`), and create that owner's login in the admin app (admin README, section 2).
