# PROJECT PROGRESS (read this first in a new chat)

Last updated: 22 Nov 2026

## What we are building

1. **Website** for Natusz Healthcare (React + Vite). Folder: `natusz-website`
2. **Admin app** (installable phone app, login, edits products / categories / gallery). Folder: `admin app`
   (renamed from `natusz-admin`). One admin app is meant to serve many future websites.

Both are **separate projects**: separate folders, separate GitHub repos, separate Cloudflare Pages deployments.
They only connect through **Firebase**. Photos are stored in **Cloudinary**. Everything is on free plans.

## Accounts and ids (no secrets here)

| Thing                                 | Value                                       |
| ------------------------------------- | ------------------------------------------- |
| Firebase project id                   | `storepilot-8a157`                          |
| Firestore location                    | asia-south1 (Mumbai)                        |
| Site id for this website              | `natusz`                                    |
| Firestore: `sites/natusz`             | field `name` = `Natusz Healthcare`          |
| Firestore: `users/<Ahmed's User UID>` | field `siteId` = `natusz`                   |
| Cloudinary cloud name                 | `lfpnw5u1`                                  |
| Cloudinary upload preset              | `sites_unsigned` (must be **Unsigned**)     |
| Hosting                               | Cloudflare Pages (GitHub already connected) |

The 4 Firebase values (apiKey, authDomain, projectId, appId) are in the `.env` files. Do not share the Cloudinary
API secret with anyone. It is never needed.

## .env files

**Admin app `.env`:**

```
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_APP_ID=
VITE_CLOUDINARY_CLOUD_NAME=lfpnw5u1
VITE_CLOUDINARY_UPLOAD_PRESET=sites_unsigned
VITE_SITE_URL=
```

**Website `.env`:**

```
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_APP_ID=
VITE_SITE_ID=natusz
```

(Same Firebase values in both. No quotes, no spaces around `=`.)

## DONE so far

- [x] Admin app and website code created
- [x] `npm install` done in both folders
- [x] Cloudinary account and unsigned preset created
- [x] Firebase project, Email/Password login, Firestore, rules published
- [x] Ahmed's login created, `users` and `sites` collections added
- [x] Admin app `.env` filled in, login works on localhost
- [x] Found a bug: Settings tab was a blank white screen. Cause: a stray line
      `{editCats && <Categories ... />}` inside the `Row` component. Fixed version of `Settings.jsx` is in the file
      `Settings.jsx` (copy and paste it over `src/components/Settings.jsx` in the admin folder).
- [x] Settings fixed, sample products loaded (18 products), website shows products, gallery photos show on the website
- [x] Round 2 changes written (see "Files changed in round 2" below): "Others" category, own product details
      (price etc.), photos shown whole instead of cropped or stretched. Not yet tested by running.
- [x] Gallery photo view: blurred background and menu bar, photo centred, title and caption underneath (new `gallery.css`)
- [x] Menu bar solid on every page except the top of Home, bold price with ₹
- [x] Both projects are in ONE GitHub repo (`zaryab02-eng/Projects`). Website deployed on Cloudflare Pages
      (Root directory = website folder). Admin app deploy is next.

## NEXT STEPS (do in order)

1. [ ] Paste all the round 2 files below and make the 3 small edits. Restart both apps (`Ctrl + C`, then `npm run dev`).
       Then test: add a product with a wide photo, add a "Price" detail, pick category "Others", open it on the website.
2. [x] (done) Settings works, 18 sample products loaded.
3. [ ] Website folder: make sure `.env` has the 5 lines above. Run `npm run dev` (it may use port 5174).
       Check Products page shows the products. Edit a product name in the admin app, refresh the website, and
       check the name changed.
4. [ ] Test: add a product with a photo, and add gallery photos (this tests Cloudinary).
5. [ ] Delete `public/_redirects` in both folders (not needed on Cloudflare).
6. [x] (done) Code is on GitHub in one repo holding both folders.
7. [x] (done) Cloudflare Pages: website deployed. Open its `.pages.dev` link and check products, gallery, price, menu bar.
8. [ ] Cloudflare Pages: deploy the admin app as a SECOND Pages project from the same repo, Root directory = admin folder
       (rename "admin app" to `admin-app` first: `git mv "admin app" admin-app`, then commit and push). Variables below.
9. [ ] Firebase → Authentication → Settings → **Authorized domains** → add the admin `.pages.dev` address
       (and the website's, and any custom domain). Login fails on the live address without this.
10. [ ] Install the admin app on Ahmed's phone (Android: Chrome ⋮ → Install app. iPhone: Safari Share → Add to Home Screen).
11. [ ] Optional: in the admin `.env` and Cloudflare, set `VITE_SITE_URL` to the website's address to show a
        "View website" button.
12. [ ] Replace sample content with Ahmed's real products, photos, founder quote and social links.

## Files changed in round 2 (paste each into the folder shown)

Website folder:

- `src/lib/content.jsx` (adds Others, passes details through)
- `src/components/ProductCard.jsx` (photo not stretched, shows short details)
- `src/components/ProductModal.jsx` (photo not stretched, shows all details; price in bold with ₹; opens in a portal so it
  always appears in the same place and the close button never scrolls out of view)
- `src/components/Navbar.jsx` (menu bar solid on every page except the top of Home)
- `src/lib/ready.js` (fixes the blank hero on the very first visit: waiting animations now start outside the loader's GSAP callback, plus an 8 second safety net)
- `src/gallery.css` (latest: blur on computers only, darker backdrop on phones, no drop-shadow)
- `src/gallery/NatuszGallery.js`: in `initDraggable`, after `onDragEnd: () => {...}` add a comma and an `onClick` callback
  that opens the photo (`this.enterZoomMode(itemData)` for the clicked `.grid-item`). This fixes taps that did not open photos.

Admin folder:

- `src/components/Products.jsx` (Others, own details list, photos shown whole)
- `src/components/ui.jsx` (photo preview shows whole photo, clearer error message)

**Latest `gallery.css` replaces the whole file** (website `src/gallery.css`). It already includes the back-arrow fix,
`object-fit: contain`, and the blurred, centred photo view (menu bar blurred too). Ignore the older block below and
small edit 1.

Older back-arrow block (already included in the new file):

```css
.gallery-root .close-button {
  color: #fff;
  background: rgba(4, 25, 28, 0.7);
  border-radius: 50%;
  -webkit-backdrop-filter: blur(6px);
  backdrop-filter: blur(6px);
  box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.25);
}
.gallery-root .close-button svg {
  width: 32px;
  height: 32px;
}
@media (max-width: 900px) {
  .gallery-root .close-button svg {
    width: 22px;
    height: 22px;
  }
}
```

Three small find-and-replace edits:

1. Website `src/gallery.css`: in the `.gallery-root .scaling-image-overlay img { ... }` rule change `object-fit: cover;`
   to `object-fit: contain;`.
2. Admin `src/components/Gallery.jsx`: change the one `object-cover` to `object-contain`.
3. Website `src/pages/Products.jsx`: the line starting `const hay = [` becomes
   `const hay = [p.name, p.form, p.composition, p.description, getCategory(p.category)?.name, ...(p.details || []).map((d) => d.value)]`

How products are stored now: each product has `name`, `category`, `image`, `description`, `featured`, `visible`, and a
`details` list like `[{label:"Price", value:"₹250"}]`. The admin app also still writes `pack`, `form` and `composition`
(taken from details named "Pack size", "Form", "Composition") so old code keeps working.

## GitHub commands (run in each folder's terminal; change the link)

```
git init
git add .
git commit -m "first"
git branch -M main
git remote add origin https://github.com/YOURNAME/REPO-NAME.git
git push -u origin main
```

Later updates: `git add .` then `git commit -m "update"` then `git push`. Cloudflare redeploys by itself.

## Cloudflare Pages settings

Workers & Pages → Create → choose **Pages** → Connect to Git → pick the repo. (If only the Workers screen shows, click
"Looking to deploy Pages? Get started". Do not use the Workers setup screen.)
Both projects share one repo, so make TWO Pages projects from it, one at a time. For each, set **Root directory
(advanced)** to that project's folder name. Project names: `natusz-website` and `natusz-admin`.

- Framework preset: Vite (or None)
- Build command: `npm run build`
- Build output directory: `dist`
- Variables for the **website**: `VITE_FIREBASE_API_KEY`, `VITE_FIREBASE_AUTH_DOMAIN`, `VITE_FIREBASE_PROJECT_ID`,
  `VITE_FIREBASE_APP_ID`, `VITE_SITE_ID=natusz`, `NODE_VERSION=20`
- Variables for the **admin app**: the 4 Firebase values, `VITE_CLOUDINARY_CLOUD_NAME`,
  `VITE_CLOUDINARY_UPLOAD_PRESET`, `NODE_VERSION=20`
- After changing a variable, redeploy (Deployments → Retry).

## Adding a new client website later

1. New website gets its own id, e.g. `clientb`, and `VITE_SITE_ID=clientb` in its `.env` and Cloudflare variables.
2. Firebase → Authentication → Add user → copy User UID.
3. Firestore → `users` → new document (ID = that UID) → field `siteId` = `clientb`.
4. Optional: `sites/clientb` with field `name`.
5. Client signs in to the same admin app and sets up categories (Settings → Edit categories).

## Known notes

- The code was written without being run in a browser here. Expect small bugs like the Settings one. When something
  breaks: press F12 → Console, copy the red error, and send it with the file named in the error.
- Keep folder names without spaces (e.g. `admin-app`) to avoid terminal trouble. A rename is optional.
- Firebase free limit: about 50,000 reads a day across all websites on the project.
- If every product is deleted, the website shows its built-in samples. Use "Show on website" off to hide things.
- Product fields suit catalogue-style websites. Very different site types need different fields.

## How to continue in a new chat

Paste this file, then say what step you are on and any error text you see. Also attach the file the error names
(for example `Settings.jsx`) so it can be fixed with the real code in front of it.
