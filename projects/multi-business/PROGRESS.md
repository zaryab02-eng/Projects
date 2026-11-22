# PROJECT PROGRESS (read this first in a new chat)

Last updated: 23 Nov 2026

## STATUS: LIVE

Both the website and the admin app are deployed on Cloudflare Pages and working. Ahmed can log in on his phone and
change products, categories and gallery photos, and the website shows the changes straight away.

## What we built

1. **Website** for Natusz Healthcare (React + Vite). Folder: `natusz-website`
2. **Admin app** (installable phone app, login, edits products / categories / gallery). Folder: `admin-app`
   (was `admin app`). One admin app is meant to serve many future websites.

Both projects live in ONE GitHub repo (`zaryab02-eng/Projects`) but are deployed as TWO separate Cloudflare Pages projects.
They only connect through **Firebase**. Photos are stored in **Cloudinary**. Everything is on free plans.

## Accounts and ids (no secrets here)

| Thing                                | Value                                                                              |
| ------------------------------------ | ---------------------------------------------------------------------------------- |
| GitHub repo                          | `zaryab02-eng/Projects` (holds both folders)                                       |
| Cloudflare Pages projects            | website: `natusz-website`, admin: `natusz-admin` (Root directory = each folder)    |
| Firebase project id                  | `storepilot-8a157` (Firestore in asia-south1, Mumbai)                              |
| Site id for this website             | `natusz`                                                                           |
| Firestore `sites/natusz`             | field `name` = `Natusz Healthcare`; also holds `categories` (set by the admin app) |
| Firestore `users/<Ahmed's User UID>` | field `siteId` = `natusz`                                                          |
| Cloudinary cloud name                | `lfpnw5u1`                                                                         |
| Cloudinary upload preset             | `sites_unsigned` (must be **Unsigned**)                                            |

Live addresses (fill in): website `__________.pages.dev`, admin `__________.pages.dev`

The 4 Firebase values (apiKey, authDomain, projectId, appId) are in the `.env` files and in the Cloudflare variables.
Never share the Cloudinary API secret. It is never needed.

## Environment variables (same names in `.env` and in Cloudflare)

**Admin app:**

```
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_APP_ID=
VITE_CLOUDINARY_CLOUD_NAME=lfpnw5u1
VITE_CLOUDINARY_UPLOAD_PRESET=sites_unsigned
VITE_SITE_URL=          (optional: the website address, adds a "View website" button)
NODE_VERSION=20         (Cloudflare only)
```

**Website:**

```
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_APP_ID=
VITE_SITE_ID=natusz
NODE_VERSION=20         (Cloudflare only)
```

No quotes, no spaces around `=`. After changing a variable on Cloudflare, redeploy (Deployments → Retry deployment).

## DONE

- [x] Admin app and website built; Firebase, Cloudinary, Ahmed's login and site records set up
- [x] Fixed: blank Settings tab (stray line in `Settings.jsx`)
- [x] Products: own "Product details" list (price, pack size, anything), "Others" category, photos shown whole
- [x] Website: price in bold with ₹, product pop-up opens centred with the close button always visible,
      menu bar solid on all pages except the top of Home
- [x] Gallery: blurred, centred photo view with title and caption underneath; back arrow always visible;
      taps open photos reliably (Draggable `onClick`); lighter on phones
- [x] Fixed: blank hero on the very first visit (`src/lib/ready.js`)
- [x] Both projects deployed on Cloudflare Pages; Firebase Authorized domains added; admin app installed on Ahmed's phone

## Key files changed after the first version (for reference)

Website: `src/lib/content.jsx`, `src/lib/ready.js`, `src/components/ProductCard.jsx`, `ProductModal.jsx`, `Navbar.jsx`,
`src/gallery.css`, `src/gallery/NatuszGallery.js` (added `onClick` in `initDraggable`), `src/pages/Products.jsx` (search includes details).
Admin: `src/components/Settings.jsx`, `Products.jsx`, `ui.jsx`, `Gallery.jsx` (`object-contain`).

How products are stored: each product has `name`, `category`, `image`, `description`, `featured`, `visible`, and a `details`
list like `[{label:"Price", value:"250"}]`. The admin app also still writes `pack`, `form` and `composition`
(taken from details named "Pack size", "Form", "Composition") so older code keeps working.

## How to update the live sites later

1. Change files on your computer and test with `npm run dev`.
2. In the terminal at the top of the repo:
   ```
   git add .
   git commit -m "update"
   git push
   ```
3. Cloudflare rebuilds BOTH projects automatically (normal, free). Wait a few minutes.
4. If you change an environment variable on Cloudflare, redeploy that project.

## Adding a new client website later

1. New website gets its own id, e.g. `clientb`, with `VITE_SITE_ID=clientb` in its `.env` and Cloudflare variables
   (same 4 Firebase values). Copy `src/lib/firebase.js`, `content.jsx`, `images.js` and the product card / pop-up logic.
2. Firebase → Authentication → Add user → copy the User UID.
3. Firestore → `users` → new document (ID = that UID) → field `siteId` = `clientb`.
4. Optional: `sites/clientb` with field `name`.
5. The client signs in to the same admin app and sets up categories (Settings → Edit categories).
6. Add the new website's `.pages.dev` address to Firebase Authorized domains only if that site itself needs login (it does not).

## Possible next steps (all optional)

- Buy a domain (for example `natuszhealthcare.com`) and connect it: Cloudflare Pages project → Custom domains.
  Add the domain to Firebase Authorized domains if you also point the admin app at a custom domain.
- Replace sample content with Ahmed's real products, photos, founder quote and social links.
- Give every gallery photo a short title (max 24 characters) in the admin app, so the name shows when it opens.
- Set `VITE_SITE_URL` on the admin Cloudflare project to show the "View website" button.
- Ideas: enquiry basket, price list PDF, blog page, Hindi/Marathi, analytics.

## Known notes

- Firebase free limit: about 50,000 reads a day across all websites on the project.
- If every product is deleted, the website shows its built-in samples. Use "Show on website" off to hide things.
- Product fields suit catalogue-style websites. Very different site types need different fields.
- Keep folder names without spaces.
- When something breaks: press F12 → Console, copy the red error, and send it with the file named in the error.

## How to continue in a new chat

Paste this file, then say what you want to do next and any error text you see. Also attach the file the error names
(for example `Settings.jsx`) so it can be fixed with the real code in front of it.
