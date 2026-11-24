# Website Admin: one phone app for many websites

Last updated: 24 Nov 2026

## 0. Quick facts (read this first in a new chat)

| Item                        | Value                                                                                                    |
| --------------------------- | -------------------------------------------------------------------------------------------------------- |
| What it is                  | Installable phone app (PWA) where a website owner changes his own website: products, photos, categories  |
| Stack                       | React + Vite + Tailwind, Firebase Auth + Firestore, Cloudinary (photos), Cloudflare Pages (hosting)      |
| Folder                      | `admin-app` (inside the repo `zaryab02-eng/Projects`, next to `natusz-website`)                          |
| Hosting                     | Its own Cloudflare Pages project (`natusz-admin`), separate from every website                           |
| One app, many sites         | Each login is linked to ONE `siteId`; it only sees and edits that site                                   |
| Language                    | Simple English only                                                                                      |
| Never change without asking | Firestore data format (section 3), `firestore.rules`, the Cloudinary upload logic in `src/lib/upload.js` |
| Keep                        | `noindex` and the title "Website Admin" in `index.html` (so Google never lists the admin)                |

```
                         ┌────────────────────────────────────────────┐
 Admin app (ONE copy,    │ Firebase (ONE project)                     │       Website A  (natusz)
 hosted once) ──────────►│  Auth:      logins                         │◄────── reads sites/natusz/...
  login → users/{uid}    │  Firestore: users/{uid}   → siteId         │
  → edits its own site   │             sites/natusz/...               │◄────── Website B  (clientb)
                         │             sites/clientb/...              │        reads sites/clientb/...
                         └────────────────────────────────────────────┘
  photos ──► Cloudinary (free), stored in folders  natusz/…  clientb/…
```

---

## 1. Folder map (what each file does)

```
admin-app/
├─ .env.example            Template for keys (copy to .env)
├─ firestore.rules         Security rules (paste into Firebase)
├─ index.html              noindex + title "Website Admin" (keep)
├─ vite.config.js          App name, colours, icons, PWA ("installable")
├─ tailwind.config.js      Brand colours (ink, deep, brand, brand-dark, mist, paper, rose)
├─ public/                 App icons
└─ src/
   ├─ main.jsx             Starts the app
   ├─ App.jsx              Login check, header (tab name + site name), bottom bar: Products / Photos / Settings
   ├─ index.css            Global look: 18px base text, .input, .btn, .btn-primary, .btn-ghost, .btn-danger, .btn-rose
   ├─ firebase.js          Firebase connection, `siteUrl`, `cloudinaryReady`
   ├─ data/products.js     DEFAULT categories + 18 sample products (used by "Add samples")
   ├─ lib/site.jsx         Finds which site the login manages; provides siteId, siteName, categories, getCategory, slugify
   ├─ lib/useCollection.js Live list from sites/{siteId}/{products|gallery}, sorted by `order`
   ├─ lib/upload.js        Shrinks photos on the phone, uploads to Cloudinary (unsigned preset)
   ├─ lib/useInstall.js    "Install app" logic (Android / iPhone)
   └─ components/
      ├─ ui.jsx            Shared pieces: Sheet (form panel with big Back button), Field, Switch (Yes/No),
      │                    ImagePicker, Spinner, useToast (green/red message at TOP), useConfirm ("Are you sure?" box),
      │                    friendlyError
      ├─ Login.jsx         Email + password, Show/Hide, Forgot password
      ├─ Products.jsx      Product list + product form
      ├─ Gallery.jsx       Photo grid + photo form (shown to the owner as "Photos")
      ├─ Categories.jsx    Edit categories (opened from Settings)
      └─ Settings.jsx      Site name, categories, see website, sign out, "More options" (install, samples)
```

---

## 2. Screens (what the owner sees)

- **Products tab:** list of big rows (photo, name, price · category, "Hidden from website" label). Search box appears only when there are more than 8 products. Big **Add product** button at the bottom.
- **Product form (opens as a panel with a big Back button):** Photo, Product name, Price (₹), Category, Short description, "Show on website" (Yes/No). A **More details** button opens: pack size, composition, form, how to use, any other detail, and "Show on home page".
- **Photos tab:** grid of photos with titles, big **Add photos** button (several at once). Tap a photo: title (max 24 characters), caption (max 180), Earlier / Later (order), Delete.
- **Settings tab:** site name, Product categories, See my website (only if `VITE_SITE_URL` is set), Signed in as + Sign out. **More options** (collapsed): Install app, Add sample products.
- **Safety:** every delete asks "Are you sure?" with two large buttons (no browser pop-ups). Every save shows a message at the top of the screen.

### Design rules (keep these when changing the UI)

Target user: a non-technical owner aged 40 to 50 on a phone.

1. Text at least 18px (`html { font-size: 18px }`); secondary text dark enough to read (`text-ink/70`, never lighter than `/60`).
2. Every button at least 56px tall, with a word (never an icon alone). Bottom bar has icon + text.
3. One main action per screen; rare things hide under "More details" / "More options".
4. Plain words: "Add product", "Save", "Show on website", "Delete". No tech words (no site id, no "Firestore").
5. Confirm before delete with `useConfirm`; confirm result with `useToast`. Do not use `window.confirm`.
6. No colour picker, no pack-drawing dropdown (removed on purpose; see section 3 notes).

---

## 3. Data format (Firestore). The websites depend on this, do not change it

```
users/{uid}                      siteId (string)            ← links a login to one website; created by hand
sites/{siteId}                   name (string), categories (array)
   categories[i]                 { id, name, blurb, color }
sites/{siteId}/products/{id}     name, category (category id or "others"), description,
                                 details: [ { label, value }, ... ],
                                 pack, form, composition      ← copied from details named "Pack size", "Form", "Composition"
                                 featured (bool), visible (bool), image (Cloudinary URL or ""), visual ("tube"|"jar"|"bottle"), order (number)
sites/{siteId}/gallery/{id}      src (Cloudinary URL), title, description, order (number)
```

Notes:

- **Price** is saved as a detail `{ label: "Price", value: "250" }`. The website shows it in bold with ₹.
- `visual` is kept (default "tube") because the website uses it when a product has no photo; the owner no longer sees it.
- Category `color` is kept (default `#059EA9`) because the website uses it for no-photo products; the owner no longer sees a colour picker.
- Photos are shrunk on the phone before upload (products 1200px, gallery 1600px). Deleting a photo removes it from the website only; the file stays in Cloudinary.
- The website makes each product's web address from its name, so renaming a product changes its link.

---

## 4. One-time setup

### A. Firebase (about 10 minutes)

1. https://console.firebase.google.com → **Add project** (Analytics not needed).
2. **Authentication → Get started → Email/Password → Enable.**
3. **Firestore Database → Create database** → production mode → location `asia-south1` (Mumbai) for India.
4. Firestore **Rules** tab: paste `firestore.rules` from this folder → **Publish**. (Anyone may read site content, only the linked login may write.)
5. **Project settings → Your apps → Web (`</>`)** → register an app → copy `apiKey`, `authDomain`, `projectId`, `appId`.
6. Recommended: **Authentication → Settings → User actions** → turn off **Enable create (sign-up)**.

### B. Cloudinary (about 5 minutes)

1. Sign up free at https://cloudinary.com, note the **Cloud name** (never use or share the API secret).
2. **Settings → Upload → Upload presets → Add**: Signing mode **Unsigned**, name `sites_unsigned`, Save.

### C. `.env` file (no quotes, no spaces around `=`)

```
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_APP_ID=...
VITE_CLOUDINARY_CLOUD_NAME=...
VITE_CLOUDINARY_UPLOAD_PRESET=sites_unsigned
VITE_SITE_URL=          (optional; leave empty when you manage several sites)
```

### D. Run

```bash
npm install
npm run dev
```

After changing `.env`, stop (`Ctrl + C`) and run `npm run dev` again.

---

## 5. Give a website owner an account (about 2 minutes, in the Firebase console)

1. **Authentication → Users → Add user** (email + password). Copy the **User UID**.
2. **Firestore → collection `users` → new document**, Document ID = that UID (not Auto-ID), field `siteId` (string) = the website id, e.g. `natusz`.
3. Optional: collection `sites`, document `natusz`, field `name` = `Natusz Healthcare` (shown in the app header).

Two people can manage one site: give each a `users/{uid}` document with the same `siteId`.
First sign-in: **Settings → More options → Add samples** copies the sample products and categories so the owner can edit instead of typing.
Remove someone's access: delete their `users/{uid}` document and their Authentication user.

---

## 6. Put the admin app online (Cloudflare Pages)

1. Code is on GitHub (repo `zaryab02-eng/Projects`, folder `admin-app`; folder names without spaces).
2. Cloudflare → **Workers & Pages → Create → Pages → Connect to Git** (if you only see Workers, use the small link "Looking to deploy Pages? Get started").
3. Settings: Framework **Vite**, build command `npm run build`, output `dist`, **Root directory = `admin-app`**.
4. Environment variables: the 4 Firebase values, `VITE_CLOUDINARY_CLOUD_NAME`, `VITE_CLOUDINARY_UPLOAD_PRESET`, `NODE_VERSION` = `20`.
5. Deploy. In Firebase → **Authentication → Settings → Authorized domains** add the `xxxx.pages.dev` address (and any custom domain). Without this, login fails online.
6. Share this one address with all clients.
7. Changed a variable? **Deployments → Retry deployment** (values are baked in at build time).

**Install on a phone** (needs https): Android Chrome ⋮ → Install app; iPhone Safari Share → Add to Home Screen.
**After a new version:** the installed app updates itself; close it fully and open it twice to see the new look.

---

## 7. Connecting a website (and adding a new one)

Each website has its own `.env` with the same four Firebase values plus its own `VITE_SITE_ID` (e.g. `natusz`). It reads `sites/<VITE_SITE_ID>/products`, `/gallery` and the site document's `categories`.

Checklist for a brand-new website `clientb`:

1. Build the site, `VITE_SITE_ID=clientb` in its `.env` and in Cloudflare.
2. Create the owner's login and `users/{uid}` document with `siteId = clientb` (section 5).
3. The owner signs in to the same admin app, sets categories (Settings → Product categories), then adds products and photos.
4. The new website's product card and pop-up must show the `details` list (copy `ProductCard.jsx` / `ProductModal.jsx` from the Natusz website).

The Natusz website is pre-rendered: at build time a script copies the public product list. **After adding, renaming or deleting products, redeploy the website project** (Deployments → Retry) so product pages and the sitemap update. Visitors see changes without that.

---

## 8. Free-plan limits (so no subscription is needed)

| Service                    | Free allowance                                                                        | What uses it                                                                                                          |
| -------------------------- | ------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| Firebase Firestore (Spark) | about 50,000 reads/day, 20,000 writes/day, 1 GiB data                                 | Each website visit reads all products + gallery + site doc (about 30 to 40 reads); each website build reads them once |
| Firebase Auth              | tens of thousands of users                                                            | a handful of owner logins: no concern                                                                                 |
| Cloudinary                 | 25 credits/month (1 credit = 1 GB storage OR 1 GB bandwidth OR 1,000 transformations) | photo storage + visitors loading photos                                                                               |
| Cloudflare Pages           | 500 builds/month, unlimited visitors for static pages, up to 100 projects per account | every push rebuilds every project connected to the repo                                                               |

**Real bottleneck: Firestore reads.** Rough guide: 50,000 ÷ 35 reads ≈ 1,400 website visits per day in total across ALL websites. When this runs out, Spark stops serving reads until the next day (no bill, but sites show sample data).
**Photos have no per-site count limit,** only the shared Cloudinary credits (about 3,000+ photos per GB because photos are shrunk).
**Builds:** if several websites share one repo, one push triggers one build per website. Use Cloudflare **Build watch paths** (project Settings → Builds) so each project only rebuilds when its own folder changes.
Limits can change; check the Firebase, Cloudinary and Cloudflare pricing pages before relying on exact numbers.

Ways to stretch the free plan later: make websites use only the build-time copy of products (near-zero reads, needs a redeploy per change via a Cloudflare deploy hook); or move a busy client to its own Firebase project.

---

## 9. Troubleshooting

- **"Almost there" screen:** `.env` missing, or app not restarted after creating it.
- **"Account not linked":** the login has no `users/{uid}` document, or the Document ID is not exactly the User UID.
- **"Not allowed" when saving:** rules not Published, or `siteId` misspelled.
- **Header shows the id instead of a name:** add `sites/<siteId>` with field `name`.
- **Photo upload fails:** check the Cloudinary cloud name and that the preset is **Unsigned**.
- **Blank white screen:** press F12 → Console, read the red error, send it with the file it names.
- **Login fails online but works on localhost:** add the address under Firebase → Authorized domains.
- **Website shows sample products:** check `VITE_SITE_ID` and the four Firebase values on the website (and in Cloudflare), and that the site has products.
- **New product is on the list but its own page or sitemap entry is missing:** redeploy the website project.
- **Old design still showing on the phone:** close the installed app fully and open it twice.
- **Install button missing:** open the https address, not localhost.
- **GitHub "Google API key" secret alert:** it is the public Firebase web key. Make sure `.env`, `dist`, `node_modules` and build temp folders (`.vite-react-ssg-temp`) are in `.gitignore`, then close the alert as a false positive.
- **Price or details not showing on the website:** the website's `ProductCard.jsx`, `ProductModal.jsx`, `src/lib/content.jsx` and `catalog.js` must be the versions that read `details`.

---

## 10. Change log

- **24 Nov 2026, UI redesign:** larger text, 56px buttons, plain words, big Back button on forms, "Are you sure?" box and top messages, separate Price field, "More details" section, tab renamed Photos, rare options under "More options". Data format and rules unchanged.
- **23 Nov 2026:** website pre-rendering (product pages, sitemap); admin unchanged.
- Earlier: Product details list, Others category, photos shown whole, Settings blank-screen fix.

To pause a client's public website, see "Pause / resume the website" in `WEBSITE-README.md`. The admin app is not affected.
