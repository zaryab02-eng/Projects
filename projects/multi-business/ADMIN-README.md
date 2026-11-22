# Website Admin: one phone app for many websites

An installable web app (PWA) that lets a website owner (e.g. **Ahmed**) change his website from his phone:
**add, edit, hide or delete products, manage categories, and add or remove gallery photos**, behind a login.
Changes show on the live website straight away. No code, no redeploy.

**One admin app serves many websites.** Each website has its own `siteId` (like `natusz`), and each login is linked to
exactly one site. A login only ever sees and edits its own website's content.

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

**Hosting:** the admin app and each website are **separate projects hosted separately** (we use **Cloudflare Pages**,
free, connected to GitHub):

| Project          | Hosted at (example)                      | How many                             |
| ---------------- | ---------------------------------------- | ------------------------------------ |
| `natusz-website` | `natuszhealthcare.com`                   | one per website                      |
| Next website     | `clientb.com`                            | one per website                      |
| admin app (this) | `admin.yourname.com` or `xxxx.pages.dev` | **just one, shared by all websites** |

Built with React + Vite + Tailwind. Uses **Firebase Authentication** (login), **Firestore** (data) and
**Cloudinary** (photos). All have free plans that are plenty for small business websites.

---

## 1. One-time setup (done once, for everything)

### A. Firebase (login and data), about 10 minutes

1. Go to https://console.firebase.google.com → **Add project** (e.g. `my-sites`; Analytics not needed).
2. **Build → Authentication → Get started → Email/Password → Enable → Save.**
3. **Build → Firestore Database → Create database.** Choose **production mode** and a nearby location
   (for India: `asia-south1` Mumbai).
4. Open the Firestore **Rules** tab, delete what is there, paste the contents of **`firestore.rules`** from this folder, and
   **Publish**. (No emails to edit. Access is controlled by the `users/{uid}` links in section 2.)
5. Gear icon → **Project settings → General → Your apps → Web (`</>`)** → register an app (any name, skip hosting).
   Copy the config values (`apiKey`, `authDomain`, `projectId`, `appId`). Ignore the rest of the code Firebase shows.
6. Recommended: **Authentication → Settings → User actions** → turn off **"Enable create (sign-up)"** so nobody can
   register their own account. You add accounts yourself.

### B. Cloudinary (photo storage), about 5 minutes

1. Sign up free at https://cloudinary.com. On the Dashboard note your **Cloud name**.
   (You do NOT need the API key or API secret. Never put the secret in the app or share it.)
2. **Settings (gear) → Upload → Upload presets → Add upload preset.**
   Set **Signing mode = Unsigned**, name it (e.g. `sites_unsigned`), leave Asset folder empty, Save.
   (Optional: under _Upload control_ limit formats to `jpg, png, webp`.)

Photos are saved in a folder per website (`natusz/products`, `natusz/gallery`, ...), so each client's photos stay separate.

### C. Fill in the `.env` file

1. In this folder copy **`.env.example`** to **`.env`**.
2. Fill it in like this (no quotes, no spaces around `=`):

```
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_APP_ID=...
VITE_CLOUDINARY_CLOUD_NAME=...
VITE_CLOUDINARY_UPLOAD_PRESET=sites_unsigned
VITE_SITE_URL=
```

`VITE_SITE_URL` is optional (it adds a "View website" button; it is shown to every site's owner, so you can leave it
empty when you have several sites).

### D. Run it

```bash
npm install
npm run dev
```

Open the link it prints (usually http://localhost:5173). After changing `.env`, stop the terminal (`Ctrl + C`) and run
`npm run dev` again.

---

## 2. Giving a website owner an account (do this for each website / person)

You do this in the Firebase console. It takes about 2 minutes per person.

1. **Authentication → Users → Add user.** Enter the owner's email and a password. After it is created,
   **copy the "User UID"** shown in the list.
2. **Firestore Database → Start collection** (first time) named **`users`**.
   - **Document ID:** paste the User UID (do not use Auto-ID).
   - **Field:** `siteId` (string) = the website's id, e.g. `natusz`. Save.
3. _(Optional but nice)_ Create a collection **`sites`**, document ID = the same site id (`natusz`),
   field `name` (string) = `Natusz Healthcare`. The app shows this name in the header. Without it, the id is shown.

That's all. The owner opens the admin app, signs in, and sees only their website.
Two people can manage the same site: give each a `users/{uid}` document with the same `siteId`.

> The first time Ahmed signs in, go to **Settings → Load samples**. It copies the 18 sample products and
> their categories into his site so he can edit them instead of typing everything.

---

## 3. Put the admin app online on Cloudflare Pages (needed to install on a phone)

A phone installs the app only from a secure `https://` address.

1. Put this folder on GitHub as its own **private** repo (`.env` is ignored on purpose, it stays private):
   ```bash
   git init
   git add .
   git commit -m "first"
   git branch -M main
   git remote add origin https://github.com/YOURNAME/natusz-admin.git
   git push -u origin main
   ```
2. Cloudflare dashboard → **Workers & Pages → Create**. Choose **Pages → Connect to Git**. If you only see the Workers
   screen, click the small link "Looking to deploy Pages? Get started". (Do not use the Workers setup screen.)
   Pick the repo.
3. Build settings:
   - Project name: e.g. `natusz-admin` (this becomes `natusz-admin.pages.dev`)
   - Framework preset: **Vite**
   - Build command: `npm run build`
   - Build output directory: `dist`
   - **Root directory (advanced):** if the website and the admin app live in ONE GitHub repo (our setup), type the admin
     folder's name here exactly as it appears on GitHub (use a name without spaces, like `admin-app`; rename with
     `git mv "admin app" admin-app` if needed). If the admin app has its own repo, leave it as `/`.
   - Deploy the website and the admin app as two separate Pages projects from the same repo, one at a time.
4. Under **Environment variables** add (name = value):
   `VITE_FIREBASE_API_KEY`, `VITE_FIREBASE_AUTH_DOMAIN`, `VITE_FIREBASE_PROJECT_ID`, `VITE_FIREBASE_APP_ID`,
   `VITE_CLOUDINARY_CLOUD_NAME`, `VITE_CLOUDINARY_UPLOAD_PRESET`, and `NODE_VERSION` = `20`.
5. **Save and Deploy.** Cloudflare gives you a link ending in `.pages.dev`. That is the admin address.
6. **Important:** in Firebase go to **Authentication → Settings → Authorized domains → Add domain** and add your
   `xxxx.pages.dev` address (without `https://`). Without this, login will fail on the live address.
   Add your custom domain here too if you connect one later.
7. Share this one address with all your clients.

If you change an environment variable later, go to **Deployments → Retry / redeploy**, because the values are baked in
during the build.

### Install on the phone

- **Android (Chrome):** open the admin address → menu **⋮ → Install app**, or use _Install app_ in the Settings tab.
- **iPhone (Safari):** open the address → **Share → Add to Home Screen**.

---

## 4. Connecting a website to the admin app

Each website has its own project and its own `.env`:

```
VITE_FIREBASE_API_KEY=...        ┐ the same four Firebase values
VITE_FIREBASE_AUTH_DOMAIN=...    │ for every website
VITE_FIREBASE_PROJECT_ID=...     │
VITE_FIREBASE_APP_ID=...         ┘
VITE_SITE_ID=natusz              ← THIS website's id (different for each website)
```

The website then reads `sites/<VITE_SITE_ID>/products`, `.../gallery` and the category list from the site document.
(See the website's README, "Connecting the admin app".)

### Adding a brand-new website later (checklist)

1. Build the new website and give it an id, e.g. `clientb`.
2. In its `.env`: same Firebase values, `VITE_SITE_ID=clientb`. Add the same variables in Cloudflare when hosting it.
3. Create the owner's account and `users/{uid}` document with `siteId = clientb` (section 2).
4. The owner signs in to the **same admin app**, opens **Settings → Edit categories** to set up his categories,
   then adds products and photos.

The new website's code decides how products are displayed. Every product has a name, category, photo, short description
and a **list of details the owner makes up** (pack size, price, composition, anything). So the admin app suits most
catalogue-style websites. The new website's product card and pop-up must show the `details` list (copy `ProductCard.jsx`
and `ProductModal.jsx` from the Natusz website). For a very different site type we can add or rename fields.

---

## 5. Using the app

**Products tab**

- Tap **+** to add. Only the name is required. Photo, description and details are optional.
- **Category:** pick one from your list, or **Others** (always available, even if you never created it).
- **Product details:** add any details you want, such as pack size, composition, price or "how to use". Tap a
  suggestion, or **+ My own detail** and type any name and value. Remove a detail with the X. They show in the product
  pop-up on the website. Photos of any shape (wide, tall, square) are kept whole.
- Tap a product to edit or delete it.
- _Feature on home page_ shows it on the home page (the website uses the first 4 featured products).
- _Show on website_ off = hidden from visitors but kept in the list.

**Gallery tab**

- **Add photos** lets you pick several at once (camera or gallery).
- Tap a photo to add a short **title** (max 24 characters) and a **caption**, move it earlier/later, replace or delete it.
- The Natusz website gallery looks best with **8 or more different photos**.

**Settings tab**

- Which website you are managing, **Edit categories** (add, rename, reorder, delete; a category that still has
  products cannot be deleted), install button, link to the website, load sample products, sign out.

Photos are shrunk automatically on the phone before uploading, so even big camera photos send quickly.

---

## 6. Folder map

```
natusz-admin/
├─ .env.example           Template for your keys (copy to .env)
├─ firestore.rules        Security rules to paste into Firebase
├─ vite.config.js         App name, colours, icons (the "installable" part)
├─ public/                App icons (neutral, not tied to one client)
└─ src/
   ├─ App.jsx             Login check, header (shows site name), bottom tabs
   ├─ firebase.js         Connects to Firebase
   ├─ data/products.js    DEFAULT categories + sample products (used for "Load samples")
   ├─ lib/site.jsx        Finds which website the logged-in account manages
   ├─ lib/useCollection.js  Live lists, scoped to that website
   ├─ lib/upload.js       Photo shrinking and Cloudinary upload
   └─ components/         Login, Products, Gallery, Categories, Settings screens
```

(Cloudflare does not need `public/_redirects`; you can delete it.)

## 7. Changing things later

- **Change the app name / colours / icon:** `vite.config.js` (name, theme colour), `tailwind.config.js`, `public/*.png`.
- **Add another login for the same site:** section 2 with the same `siteId`.
- **Remove someone's access:** delete their `users/{uid}` document (and their Authentication user).
- **Forgot password:** _Forgot password?_ on the login screen, or reset it in Firebase → Authentication.
- **Default categories** for a site that has not set its own: `src/data/products.js` (`categories`).
- **Update the live app:** change files, then `git add .`, `git commit -m "update"`, `git push`. Cloudflare redeploys by itself.

## 8. Good to know

- **Deleting a photo** removes it from the website; the original file stays in Cloudinary (the free space is large).
- **If every product is deleted,** that website falls back to its built-in sample products. Use _Show on website = off_
  to hide things temporarily.
- **Free limits:** Firebase's free plan allows about 50,000 reads a day across **all** websites on the project. Each website
  visit reads the products, gallery and site document once (a few dozen reads). Many busy websites on one project can
  outgrow this; then add caching or move a busy client to its own Firebase project.
- **Cloudinary free plan:** 25 credits a month, no card needed. Plenty for small business websites.
- **Separate billing / full isolation:** for a client who needs their own account, create a separate Firebase project and
  deploy a second copy of this admin app with that project's `.env`.
- **Security:** the Firebase keys in `.env` are public by design. What protects the data is the login plus the
  `users/{uid} → siteId` link checked by `firestore.rules`: a login can only write to its own site's data.
  Never share your Cloudinary API secret.

## 9. Troubleshooting

- **"Almost there" screen:** `.env` missing, or the app was not restarted after creating it.
- **"Account not linked":** that login has no `users/{uid}` document, or the document ID is not exactly the User UID.
- **"Not allowed" when saving:** rules not Published, or `siteId` in `users/{uid}` is misspelled.
- **Header shows the id instead of a name:** add the optional `sites/<siteId>` document with a `name` field.
- **Photo upload fails:** check the Cloudinary cloud name and that the preset is **Unsigned**.
- **Blank white screen on a tab:** press `F12` → Console and read the red error. (A past bug in `Settings.jsx`, a stray
  `editCats` line inside the `Row` component, caused a blank Settings screen. It is fixed in the current file.)
- **Login fails on the live `.pages.dev` address but works on localhost:** add the address under Firebase →
  Authentication → Settings → Authorized domains.
- **Website still shows sample products:** check `VITE_SITE_ID` and the four Firebase values in the website's `.env`
  (and in Cloudflare's environment variables), and that the site actually has products.
- **Install button missing:** open the deployed `https://` address, not localhost.
- **A detail (like price) shows in the admin app but not on the website:** the website's `ProductCard.jsx` and
  `ProductModal.jsx` must be the new versions that read the `details` list, and `src/lib/content.jsx` must be the new version.
- **Wide or tall photos look cut off:** the admin `src/components/ui.jsx` (photo preview), `Gallery.jsx` and `Products.jsx`
  use `object-contain` so the whole photo shows.
