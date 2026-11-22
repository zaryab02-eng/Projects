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

**Hosting:** the admin app and each website are **separate projects hosted separately** (e.g. on Vercel):

| Project | Hosted at (example) | How many |
|---------|---------------------|----------|
| `natusz-website` | `natuszhealthcare.com` | one per website |
| Next website | `clientb.com` | one per website |
| `natusz-admin` (this) | `admin.yourname.com` | **just one, shared by all websites** |

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
   Copy the config values (`apiKey`, `authDomain`, `projectId`, `appId`).
6. Recommended: **Authentication → Settings → User actions** → turn off **"Enable create (sign-up)"** so nobody can
   register their own account. You add accounts yourself.

### B. Cloudinary (photo storage), about 5 minutes

1. Sign up free at https://cloudinary.com. On the Dashboard note your **Cloud name**.
2. **Settings (gear) → Upload → Upload presets → Add upload preset.**
   Set **Signing mode = Unsigned**, name it (e.g. `sites_unsigned`), Save.
   (Optional: under *Upload control* limit formats to `jpg, png, webp`.)

Photos are saved in a folder per website (`natusz/products`, `natusz/gallery`, ...), so each client's photos stay separate.

### C. Fill in the `.env` file

1. In this folder copy **`.env.example`** to **`.env`**.
2. Paste the Firebase values, the Cloudinary cloud name and preset name. `VITE_SITE_URL` is optional (it adds a
   "View website" button; it is shown to every site's owner, so you can leave it empty when you have several sites).

### D. Run it

```bash
npm install
npm run dev
```

---

## 2. Giving a website owner an account (do this for each website / person)

You do this in the Firebase console. It takes about 2 minutes per person.

1. **Authentication → Users → Add user.** Enter the owner's email and a password. After it is created,
   **copy the "User UID"** shown in the list.
2. **Firestore Database → Start collection** (first time) named **`users`**.
   - **Document ID:** paste the User UID.
   - **Field:** `siteId` (string) = the website's id, e.g. `natusz`. Save.
3. *(Optional but nice)* Create a collection **`sites`**, document ID = the same site id (`natusz`),
   field `name` (string) = `Natusz Healthcare`. The app shows this name in the header. Without it, the id is shown.

That's all. The owner opens the admin app, signs in, and sees only their website.
Two people can manage the same site: give each a `users/{uid}` document with the same `siteId`.

> The first time Ahmed signs in, go to **Settings → Load sample products**. It copies the 18 sample products and
> their categories into his site so he can edit them instead of typing everything.

---

## 3. Put the admin app online (needed to install on a phone)

A phone installs the app only from a secure `https://` address.

1. Upload this folder to GitHub (`.env` is ignored on purpose, it stays private).
2. On **Vercel** (or Netlify): *New project → import the repo → Deploy.*
3. Add the `.env` values in the host's settings (Vercel: *Settings → Environment Variables*) and redeploy.
4. Use a clear address such as `admin.yourdomain.com`. **Share this one address with all your clients.**

### Install on the phone
- **Android (Chrome):** open the admin address → menu **⋮ → Install app**, or use *Install app* in the Settings tab.
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
(See `natusz-website/README.md`, "Connecting the admin app".)

### Adding a brand-new website later (checklist)
1. Build the new website and give it an id, e.g. `clientb`.
2. In its `.env`: same Firebase values, `VITE_SITE_ID=clientb`. Add the same variables when hosting it.
3. Create the owner's account and `users/{uid}` document with `siteId = clientb` (section 2).
4. The owner signs in to the **same admin app**, opens **Settings → Edit categories** to set up his categories,
   then adds products and photos.

The new website's code decides how products are displayed. The admin app's fields (name, category, pack size, form,
composition, description, photo) suit catalogue-style websites. For a very different site type we can add or rename fields.

---

## 5. Using the app

**Products tab**
- Tap **+** to add. Name, category and pack size are required; photo, composition and description are optional.
- Tap a product to edit or delete it.
- *Feature on home page* shows it on the home page (the website uses the first 4 featured products).
- *Show on website* off = hidden from visitors but kept in the list.

**Gallery tab**
- **Add photos** lets you pick several at once (camera or gallery).
- Tap a photo to add a short **title** (max 24 characters) and a **caption**, move it earlier/later, replace or delete it.
- The Natusz website gallery looks best with **8 or more different photos**.

**Settings tab**
- Which website you are managing, install button, **Edit categories** (add, rename, reorder, delete; a category that still has
  products cannot be deleted), link to the website, load sample products, sign out.

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
   ├─ data/products.js    DEFAULT categories + sample products (used for "Load sample products")
   ├─ lib/site.jsx        Finds which website the logged-in account manages
   ├─ lib/useCollection.js  Live lists, scoped to that website
   ├─ lib/upload.js       Photo shrinking and Cloudinary upload
   └─ components/         Login, Products, Gallery, Categories, Settings screens
```

## 7. Changing things later

- **Change the app name / colours / icon:** `vite.config.js` (name, theme colour), `tailwind.config.js`, `public/*.png`.
- **Add another login for the same site:** section 2 with the same `siteId`.
- **Remove someone's access:** delete their `users/{uid}` document (and their Authentication user).
- **Forgot password:** *Forgot password?* on the login screen, or reset it in Firebase → Authentication.
- **Default categories** for a site that has not set its own: `src/data/products.js` (`categories`).

## 8. Good to know

- **Deleting a photo** removes it from the website; the original file stays in Cloudinary (the free space is large).
- **If every product is deleted,** that website falls back to its built-in sample products. Use *Show on website = off*
  to hide things temporarily.
- **Free limits:** Firebase's free plan allows about 50,000 reads a day across **all** websites on the project. Each website
  visit reads the products, gallery and site document once (a few dozen reads). Many busy websites on one project can
  outgrow this; then add caching or move a busy client to its own Firebase project.
- **Separate billing / full isolation:** for a client who needs their own account, create a separate Firebase project and
  deploy a second copy of this admin app with that project's `.env`.
- **Security:** the Firebase keys in `.env` are public by design. What protects the data is the login plus the
  `users/{uid} → siteId` link checked by `firestore.rules`: a login can only write to its own site's data.

## 9. Troubleshooting

- **"Almost there" screen:** `.env` missing, or the app was not restarted after creating it.
- **"Account not linked":** that login has no `users/{uid}` document, or the document ID is not exactly the User UID.
- **"Not allowed" when saving:** rules not Published, or `siteId` in `users/{uid}` is misspelled.
- **Header shows the id instead of a name:** add the optional `sites/<siteId>` document with a `name` field.
- **Photo upload fails:** check the Cloudinary cloud name and that the preset is **Unsigned**.
- **Website still shows sample products:** check `VITE_SITE_ID` and the four Firebase values in the website's `.env`
  (and in the host's environment variables), and that the site actually has products.
- **Install button missing:** open the deployed `https://` address, not localhost.
