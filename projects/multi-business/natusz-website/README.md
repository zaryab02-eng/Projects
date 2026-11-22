# Natusz Healthcare Pvt Ltd: Website

A premium, multi-page website for **Natusz Healthcare Pvt Ltd** (pharmaceutical marketing, skin care
medicines), Dombivli East, Thane, Maharashtra.

Built with **React + Vite + Tailwind CSS + GSAP + React Router**.

| Page | Route | What it has |
|------|-------|-------------|
| Home | `/` | Animated logo hero, category strip, scroll-reveal statement, category tiles, featured products, "what to expect", call to action |
| About | `/about` | Company story, founder note, values, company details |
| Products | `/products` | Search bar, category filters, sort, product cards, detail pop-up, **tap to message on WhatsApp** |
| Gallery | `/gallery` | Full-screen draggable zoom-grid gallery (your supplied GSAP code) |
| Contact | `/contact` | Phone, email, address, WhatsApp, message form (sends via WhatsApp), Google Map |

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

4. Open the address it prints (usually http://localhost:5173).

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
├─ public/
│  ├─ favicon.svg              Browser tab icon
│  ├─ gallery/                 Gallery photos (placeholders g01.svg to g14.svg)
│  └─ products/                Put real product photos here
└─ src/
   ├─ config/site.js           ★ Phone, WhatsApp, email, address, founder name, social links
   ├─ data/products.js         ★ All products and categories
   ├─ data/gallery.js          ★ Gallery photos, titles and captions
   ├─ pages/                   One file per page (Home, About, Products, Gallery, Contact, NotFound)
   ├─ components/              Reusable pieces (Navbar, Footer, Logo, product cards, animations...)
   ├─ gallery/NatuszGallery.js The gallery engine (your supplied code, adapted)
   ├─ gallery.css              Gallery styling (only affects the Gallery page)
   ├─ index.css                Global styles and button styles
   ├─ lib/whatsapp.js          Builds the WhatsApp message links
   └─ App.jsx                  List of pages / routes
```

★ = the files you will edit most often.

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
Edit **`src/data/products.js`**. Copy an existing product block and change it:

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

Real product photos: put the file in **`public/products/`** and set `image` as shown above.
Square photos with a plain or transparent background look best.

### Add or rename a category
Same file, the `categories` list at the top. Each needs an `id`, `name`, `blurb` and a `color`.
The Home page category tiles pick an icon in `src/pages/Home.jsx` (`icons` list near the top).

### Gallery photos
1. Copy your photos into **`public/gallery/`** (jpg, png or webp).
2. Edit **`src/data/gallery.js`**: change `src`, `title` (keep it short, about 20 characters) and `description`.
3. Add as many items as you like. The grid repeats them to fill itself.

Gallery controls: drag to move, tap a photo to open, **Esc** or the back arrow to close.
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

These are **sample content** so the site looks complete now:

1. **Products** in `src/data/products.js` (names, packs, compositions and descriptions are samples). Please replace with
   Ahmed's real range. Product details for medicines should be accurate and approved by him.
2. **Gallery photos**: the 14 images in `public/gallery/` are branded placeholders.
3. **Founder quote and company story** in `src/pages/About.jsx`: written as a draft; let Ahmed approve or edit the wording.
4. **Social links** in `src/config/site.js` (empty for now).
5. Optional: add real **business hours** or **GST / drug licence numbers** (many pharma sites show these in the footer).

---

## 5. Putting the website online

1. Run `npm run build`. This creates a `dist` folder.
2. Upload to any static host. Easiest options: **Vercel**, **Netlify** or **Cloudflare Pages**
   (all have free plans; connect a GitHub repo or drag in the project).
   - `vercel.json` and `public/_redirects` are already included so page links like `/products` work after a refresh.
3. Buy a domain (e.g. `natuszhealthcare.com`) and connect it in the host's dashboard.

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

---

## 8. Connecting the admin app (edit products and gallery from a phone)

A separate project, **`natusz-admin`**, lets Ahmed log in on his phone and change products, categories and gallery photos
without touching code. It is hosted **separately** from this website, and **one admin app can manage many websites**
(each website has its own id). This website reads its content from Firebase.

1. Set up the admin app first (see its README, sections 1 to 3), including Ahmed's account linked to site id `natusz`.
2. In this project copy `.env.example` to `.env` and fill in:
   - the **same four Firebase values** as the admin app
   - `VITE_SITE_ID=natusz` (this website's id; it must match the `siteId` given to Ahmed's login)
3. Run `npm install` again (adds the `firebase` package), then `npm run dev`.
4. When deploying (Vercel/Netlify), add the same five values under **Environment Variables**, then redeploy once.

How it behaves:
- If Firebase has content for this site id, the website shows it (products, gallery, and the category list).
- If Firebase is empty, not configured, or unreachable, it shows the built-in samples in `src/data/products.js`
  and `src/data/gallery.js`, so the site never looks broken.
- Changes made in the admin app appear on the website immediately, with no redeploy.
- Categories are managed in the admin app (Settings → Edit categories). The list in `src/data/products.js` is only the
  fallback used when nothing is set in Firebase.

Relevant files: `src/lib/firebase.js` (connection and site id), `src/lib/content.jsx` (loads products, gallery and
categories), `src/lib/images.js` (asks Cloudinary for web-sized photos).

### Reusing this setup for another website
For your next website, copy only the pieces it needs (`src/lib/firebase.js`, `src/lib/content.jsx`, `src/lib/images.js`),
use a new `VITE_SITE_ID` (e.g. `clientb`), and create that owner's login in the admin app (admin README, section 2).
