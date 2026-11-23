# Website Admin: one phone app for many websites

An installable web app (PWA) that lets a website owner (the client) change his website from his phone:
**add, edit, hide or delete products, manage categories, and add or remove gallery photos**, behind a login.
Changes show on the live website straight away for visitors. No code. (A product's own page and the sitemap update after the
next website build; see section 8.)

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

| Project          | Hosted at (example)                         | How many                             |
| ---------------- | ------------------------------------------- | ------------------------------------ |
| `natusz-website` | `natusz.pages.dev` / `natuszhealthcare.com` | one per website                      |
| Next website     | `clientb.com`                               | one per website                      |
| admin app (this) | `admin.yourname.com` or `xxxx.pages.dev`    | **just one, shared by all websites** |

Built with React + Vite + Tailwind. Uses **Firebase Authentication** (login), **Firestore** (data) and
**Cloudinary** (photos). All have free plans that are plenty for small business websites.

The Natusz website is for **Neu Natusz Healthcare Private Limited**, Dombivli, Thane, Maharashtra 421203.

---

## 1. One-time setup (done once, for everything)

### A. Firebase (login and data), about 10 minutes

1. Go to https://console.firebase.google.com → **Add project** (e.g. `my-sites`; Analytics not needed).
2. **Build → Authentication → Get started → Email/Password → Enable → Save.**
3. **Build → Firestore Database → Create database.** Choose **production mode** and a nearby location
   (for India: `asia-south1` Mumbai).
4. Open the Firestore **Rules** tab, delete what is there, paste the contents of **`firestore.rules`** from this folder, and
   **Publish**. (No emails to edit. Access is controlled by the `users/{uid}` links in section 2.)
   The rules let anyone **read** a site's products and gallery (the public website needs that, and so does the website's build script) and only the linked login **write**.
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

> The first time the owner signs in, go to **Settings → Load samples**. It copies the 18 sample products and
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

The Natusz website is also **pre-rendered**: when it is built, a script copies the public product list so Google can read it,
and every product gets its own page (`/products/<name>`). Visitors still see your changes at once; the product's own page and the
sitemap update after the website is rebuilt (section 8).

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
- **Product names matter for search:** the website makes each product's web address from its name, so choose a clear name
  (for example "Sun Shield SPF 50 Gel") and avoid renaming it later, because that changes its link.

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

The admin app keeps `<meta name="robots" content="noindex, nofollow">` and the title "Website Admin" in its `index.html` on purpose,
so it never appears in Google. Do not copy that `index.html` into a website project.

## 7. Changing things later

- **Change the app name / colours / icon:** `vite.config.js` (name, theme colour), `tailwind.config.js`, `public/*.png`.
- **Add another login for the same site:** section 2 with the same `siteId`.
- **Remove someone's access:** delete their `users/{uid}` document (and their Authentication user).
- **Forgot password:** _Forgot password?_ on the login screen, or reset it in Firebase → Authentication.
- **Default categories** for a site that has not set its own: `src/data/products.js` (`categories`).
- **Update the live app:** change files, then `git add .`, `git commit -m "update"`, `git push`. Cloudflare redeploys by itself.
  If the website and the admin app share one repo, one push rebuilds both projects. That is normal.

## 8. Good to know

- **After adding, renaming or deleting products, redeploy the website** (Cloudflare → the website project → Deployments → Retry deployment)
  so each product's own page and the sitemap are updated for Google. Visitors see the change without this. Optionally set up a Cloudflare
  "deploy hook" to rebuild with one tap.
- **Deleting a photo** removes it from the website; the original file stays in Cloudinary (the free space is large).
- **If every product is deleted,** that website falls back to its built-in sample products. Use _Show on website = off_
  to hide things temporarily.
- **Free limits:** Firebase's free plan allows about 50,000 reads a day across **all** websites on the project. Each website
  visit reads the products, gallery and site document once (a few dozen reads), and each website build reads them once more.
  Many busy websites on one project can outgrow this; then add caching or move a busy client to its own Firebase project.
- **Cloudinary free plan:** 25 credits a month, no card needed. Plenty for small business websites.
- **Separate billing / full isolation:** for a client who needs their own account, create a separate Firebase project and
  deploy a second copy of this admin app with that project's `.env`.
- **Security:** the Firebase keys in `.env` are public by design (they are in every visitor's browser). What protects the data is the login plus the
  `users/{uid} → siteId` link checked by `firestore.rules`: a login can only write to its own site's data.
  Never share your Cloudinary API secret. If GitHub emails a "Google API key" secret alert, it is this public key; make sure build temp
  folders (such as `.vite-react-ssg-temp`) and `.env` are in `.gitignore`, and close the alert as a false positive.

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
- **A new product shows on the website list but its own link or the sitemap does not have it:** redeploy the website project (section 8).
- **Install button missing:** open the deployed `https://` address, not localhost.
- **A detail (like price) shows in the admin app but not on the website:** the website's `ProductCard.jsx` and
  `ProductModal.jsx` must be the new versions that read the `details` list, and `src/lib/content.jsx` / `src/lib/catalog.js` must be the new versions.
- **Wide or tall photos look cut off:** the admin `src/components/ui.jsx` (photo preview), `Gallery.jsx` and `Products.jsx`
  use `object-contain` so the whole photo shows.

---

## Note

To pause the public website for a client, see "Pause / resume the website" in WEBSITE-README.md. The admin app is not affected.

Ran terminal command: find . -mindepth 1 \( -name node_modules -o -name dist -o -name .git -o -name .env \) -prune -o -print | sort

Read
Completed with input: {
"path": "/home/zaryab/Desktop/GitHUb/Projects/projects/multi-business/admin-app/src/App.jsx",
"forceReadLargeFiles": true
}

Read
Completed with input: {
"path": "/home/zaryab/Desktop/GitHUb/Projects/projects/multi-business/admin-app/src/firebase.js",
"forceReadLargeFiles": true
}

Read
Completed with input: {
"path": "/home/zaryab/Desktop/GitHUb/Projects/projects/multi-business/admin-app/src/index.css",
"forceReadLargeFiles": true
}

Read
Completed with input: {
"path": "/home/zaryab/Desktop/GitHUb/Projects/projects/multi-business/admin-app/src/main.jsx",
"forceReadLargeFiles": true
}

Read
Completed with input: {
"path": "/home/zaryab/Desktop/GitHUb/Projects/projects/multi-business/admin-app/src/components/Categories.jsx",
"forceReadLargeFiles": true
}

Read
Completed with input: {
"path": "/home/zaryab/Desktop/GitHUb/Projects/projects/multi-business/admin-app/src/components/Gallery.jsx",
"forceReadLargeFiles": true
}

Read
Completed with input: {
"path": "/home/zaryab/Desktop/GitHUb/Projects/projects/multi-business/admin-app/src/components/Login.jsx",
"forceReadLargeFiles": true
}

Read
Completed with input: {
"path": "/home/zaryab/Desktop/GitHUb/Projects/projects/multi-business/admin-app/src/components/Products.jsx",
"forceReadLargeFiles": true
}

Read
Completed with input: {
"path": "/home/zaryab/Desktop/GitHUb/Projects/projects/multi-business/admin-app/src/components/Settings.jsx",
"forceReadLargeFiles": true
}

Read
Completed with input: {
"path": "/home/zaryab/Desktop/GitHUb/Projects/projects/multi-business/admin-app/src/components/ui.jsx",
"forceReadLargeFiles": true
}

Read , lines 1 to 30
Completed with input: {
"path": "/home/zaryab/Desktop/GitHUb/Projects/projects/multi-business/admin-app/src/data/products.js",
"view_range": [
1,
30
]
}

Read
Completed with input: {
"path": "/home/zaryab/Desktop/GitHUb/Projects/projects/multi-business/admin-app/src/lib/site.jsx",
"forceReadLargeFiles": true
}

Read
Completed with input: {
"path": "/home/zaryab/Desktop/GitHUb/Projects/projects/multi-business/admin-app/src/lib/upload.js",
"forceReadLargeFiles": true
}

Read
Completed with input: {
"path": "/home/zaryab/Desktop/GitHUb/Projects/projects/multi-business/admin-app/src/lib/useCollection.js",
"forceReadLargeFiles": true
}

Read
Completed with input: {
"path": "/home/zaryab/Desktop/GitHUb/Projects/projects/multi-business/admin-app/src/lib/useInstall.js",
"forceReadLargeFiles": true
}

Read
Completed with input: {
"path": "/home/zaryab/Desktop/GitHUb/Projects/projects/multi-business/admin-app/index.html",
"forceReadLargeFiles": true
}

Read
Completed with input: {
"path": "/home/zaryab/Desktop/GitHUb/Projects/projects/multi-business/admin-app/package.json",
"forceReadLargeFiles": true
}

Read
Completed with input: {
"path": "/home/zaryab/Desktop/GitHUb/Projects/projects/multi-business/admin-app/vite.config.js",
"forceReadLargeFiles": true
}

Read
Completed with input: {
"path": "/home/zaryab/Desktop/GitHUb/Projects/projects/multi-business/admin-app/tailwind.config.js",
"forceReadLargeFiles": true
}

Read
Completed with input: {
"path": "/home/zaryab/Desktop/GitHUb/Projects/projects/multi-business/admin-app/postcss.config.js",
"forceReadLargeFiles": true
}

Read
Completed with input: {
"path": "/home/zaryab/Desktop/GitHUb/Projects/projects/multi-business/admin-app/firestore.rules",
"forceReadLargeFiles": true
}

Ran terminal command: cd /home/zaryab/Desktop/GitHUb/Projects/projects/multi-business/admin-app && find . -mindepth 1 \( -name node_modules -o -name dist -o -name .git -o -name .env \) -prune -o -print | sort

## Project tree

```text
admin-app/
├── .env.example
├── .gitignore
├── README.md
├── firestore.rules
├── index.html
├── package-lock.json
├── package.json
├── postcss.config.js
├── public/
│   ├── apple-touch-icon.png
│   ├── favicon.svg
│   ├── icon-192.png
│   ├── icon-512.png
│   └── maskable-512.png
├── src/
│   ├── App.jsx
│   ├── components/
│   │   ├── Categories.jsx
│   │   ├── Gallery.jsx
│   │   ├── Login.jsx
│   │   ├── Products.jsx
│   │   ├── Settings.jsx
│   │   └── ui.jsx
│   ├── data/
│   │   └── products.js
│   ├── firebase.js
│   ├── index.css
│   ├── lib/
│   │   ├── site.jsx
│   │   ├── upload.js
│   │   ├── useCollection.js
│   │   └── useInstall.js
│   └── main.jsx
├── tailwind.config.js
├── vercel.json
└── vite.config.js
```

### `src/App.jsx`

```jsx
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { Package, Images, Settings as Cog } from "lucide-react";
import { auth, firebaseReady } from "./firebase";
import Login from "./components/Login";
import Products from "./components/Products";
import Gallery from "./components/Gallery";
import Settings from "./components/Settings";
import { Spinner, useToast } from "./components/ui";
import { SiteProvider, useSite } from "./lib/site";

const tabs = [
  { id: "products", label: "Products", Icon: Package },
  { id: "gallery", label: "Gallery", Icon: Images },
  { id: "settings", label: "Settings", Icon: Cog },
];

function SetupNeeded() {
  return (
    <div className="flex min-h-full flex-col justify-center bg-ink p-8 text-paper">
      <h1 className="text-3xl">Almost there</h1>
      <p className="mt-3 text-paper/70">
        The Firebase details are missing. Copy{" "}
        <code className="rounded bg-white/10 px-1.5">.env.example</code> to{" "}
        <code className="rounded bg-white/10 px-1.5">.env</code>, fill in the
        values (README, section 1), then restart{" "}
        <code className="rounded bg-white/10 px-1.5">npm run dev</code>.
      </p>
    </div>
  );
}

function Shell({ user }) {
  const { siteName } = useSite();
  const [tab, setTab] = useState("products");
  const [toastNode, notify] = useToast();
  const title = tabs.find((t) => t.id === tab).label;

  return (
    <div className="flex h-full flex-col">
      <header className="safe-top bg-ink text-paper">
        <div className="flex h-16 items-center justify-between gap-3 px-5">
          <h1 className="text-2xl">{title}</h1>
          <span className="max-w-[55%] truncate rounded-full bg-white/10 px-3 py-1 text-xs font-semibold">
            {siteName}
          </span>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto">
        {tab === "products" && <Products notify={notify} />}
        {tab === "gallery" && <Gallery notify={notify} />}
        {tab === "settings" && <Settings user={user} notify={notify} />}
      </main>

      <nav
        className="safe-bottom z-40 border-t border-ink/10 bg-paper/95 backdrop-blur"
        aria-label="Sections"
      >
        <ul className="grid grid-cols-3">
          {tabs.map(({ id, label, Icon }) => (
            <li key={id}>
              <button
                onClick={() => setTab(id)}
                aria-current={tab === id ? "page" : undefined}
                className={`flex w-full flex-col items-center gap-1 py-3 text-xs font-semibold transition ${tab === id ? "text-brand-dark" : "text-ink/45"}`}
              >
                <Icon
                  className="h-6 w-6"
                  strokeWidth={tab === id ? 2.2 : 1.7}
                />
                {label}
              </button>
            </li>
          ))}
        </ul>
      </nav>
      {toastNode}
    </div>
  );
}

export default function App() {
  const [user, setUser] = useState(undefined); // undefined = still checking

  useEffect(() => {
    if (!firebaseReady) return;
    return onAuthStateChanged(auth, (u) => setUser(u));
  }, []);

  if (!firebaseReady) return <SetupNeeded />;
  if (user === undefined) {
    return (
      <div className="flex h-full items-center justify-center bg-ink text-brand">
        <Spinner className="h-8 w-8" />
      </div>
    );
  }
  if (!user) return <Login />;

  return (
    <SiteProvider key={user.uid} user={user}>
      <Shell user={user} />
    </SiteProvider>
  );
}
```

### `src/components/Categories.jsx`

```jsx
import { useState } from "react";
import { doc, setDoc } from "firebase/firestore";
import { ArrowDown, ArrowUp, Plus, Trash2 } from "lucide-react";
import { db } from "../firebase";
import { useSite, slugify } from "../lib/site";
import useCollection from "../lib/useCollection";
import { Sheet, Spinner, friendlyError } from "./ui";

/** Edit the list of product categories for this website. */
export default function Categories({ onClose, notify }) {
  const { siteId, categories } = useSite();
  const { items: products } = useCollection("products");
  const [rows, setRows] = useState(categories.map((c) => ({ ...c })));
  const [busy, setBusy] = useState(false);

  const update = (i, patch) =>
    setRows((r) => r.map((x, j) => (j === i ? { ...x, ...patch } : x)));
  const move = (i, d) =>
    setRows((r) => {
      const next = [...r];
      const j = i + d;
      if (j < 0 || j >= next.length) return r;
      [next[i], next[j]] = [next[j], next[i]];
      return next;
    });
  const remove = (i) => {
    const c = rows[i];
    const used = c.id ? products.filter((p) => p.category === c.id).length : 0;
    if (used > 0)
      return notify(
        `${used} product(s) use “${c.name}”. Move them to another category first.`,
        "error",
      );
    setRows((r) => r.filter((_, j) => j !== i));
  };

  const save = async () => {
    if (rows.length === 0) return notify("Keep at least one category", "error");
    if (rows.some((r) => !r.name.trim()))
      return notify("Every category needs a name", "error");
    const taken = new Set(rows.filter((r) => r.id).map((r) => r.id));
    const out = rows.map((r) => {
      let id = r.id;
      if (!id) {
        const base = slugify(r.name) || "category";
        id = base;
        let n = 2;
        while (taken.has(id)) id = `${base}-${n++}`;
        taken.add(id);
      }
      return {
        id,
        name: r.name.trim(),
        blurb: (r.blurb || "").trim(),
        color: r.color || "#059EA9",
      };
    });
    setBusy(true);
    try {
      await setDoc(
        doc(db, "sites", siteId),
        { categories: out },
        { merge: true },
      );
      notify("Categories saved");
      onClose();
    } catch (e) {
      notify(friendlyError(e), "error");
      setBusy(false);
    }
  };

  return (
    <Sheet
      title="Categories"
      onClose={busy ? () => {} : onClose}
      footer={
        <button onClick={save} disabled={busy} className="btn-primary w-full">
          {busy ? <Spinner /> : "Save categories"}
        </button>
      }
    >
      <div className="space-y-3">
        {rows.map((r, i) => (
          <div
            key={r.id || `new-${i}`}
            className="rounded-2xl border border-ink/10 bg-white p-3"
          >
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={r.color || "#059EA9"}
                onChange={(e) => update(i, { color: e.target.value })}
                aria-label="Colour"
                className="h-11 w-11 shrink-0 cursor-pointer rounded-lg border border-ink/15 bg-white p-1"
              />
              <input
                className="input"
                placeholder="Category name"
                value={r.name}
                onChange={(e) => update(i, { name: e.target.value })}
              />
            </div>
            <input
              className="input mt-2"
              placeholder="One-line description (optional)"
              value={r.blurb || ""}
              onChange={(e) => update(i, { blurb: e.target.value })}
            />
            <div className="mt-2 flex justify-end gap-1">
              <button
                onClick={() => move(i, -1)}
                disabled={i === 0}
                aria-label="Move up"
                className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-mist disabled:opacity-30"
              >
                <ArrowUp className="h-4 w-4" />
              </button>
              <button
                onClick={() => move(i, 1)}
                disabled={i === rows.length - 1}
                aria-label="Move down"
                className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-mist disabled:opacity-30"
              >
                <ArrowDown className="h-4 w-4" />
              </button>
              <button
                onClick={() => remove(i)}
                aria-label="Delete category"
                className="flex h-9 w-9 items-center justify-center rounded-full text-rose hover:bg-rose/10"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
        <button
          onClick={() =>
            setRows((r) => [
              ...r,
              { id: null, name: "", blurb: "", color: "#059EA9" },
            ])
          }
          className="btn-ghost w-full"
        >
          <Plus className="h-4 w-4" /> Add category
        </button>
      </div>
    </Sheet>
  );
}
```

### `src/components/Gallery.jsx`

```jsx
import { useRef, useState } from "react";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  setDoc,
  writeBatch,
} from "firebase/firestore";
import { ImagePlus, ChevronLeft, ChevronRight } from "lucide-react";
import { db } from "../firebase";
import { uploadImage } from "../lib/upload";
import useCollection from "../lib/useCollection";
import { useSite } from "../lib/site";
import { Sheet, Field, ImagePicker, Spinner, friendlyError } from "./ui";

function PhotoForm({ item, items, onClose, notify }) {
  const { siteId } = useSite();
  const [title, setTitle] = useState(item.title || "");
  const [description, setDescription] = useState(item.description || "");
  const [file, setFile] = useState(null);
  const [busy, setBusy] = useState(false);
  const index = items.findIndex((x) => x.id === item.id);

  const save = async () => {
    setBusy(true);
    try {
      let src = item.src;
      if (file)
        src = await uploadImage(file, {
          maxSize: 1600,
          folder: `${siteId}/gallery`,
        });
      await setDoc(
        doc(db, "sites", siteId, "gallery", item.id),
        { src, title: title.trim(), description: description.trim() },
        { merge: true },
      );
      notify("Saved");
      onClose();
    } catch (e) {
      notify(friendlyError(e), "error");
      setBusy(false);
    }
  };

  const remove = async () => {
    if (!window.confirm("Remove this photo from the gallery?")) return;
    setBusy(true);
    try {
      await deleteDoc(doc(db, "sites", siteId, "gallery", item.id));
      notify("Photo removed");
      onClose();
    } catch (e) {
      notify(friendlyError(e), "error");
      setBusy(false);
    }
  };

  // swap the order value with the neighbour
  const move = async (dir) => {
    const other = items[index + dir];
    if (!other) return;
    setBusy(true);
    try {
      const batch = writeBatch(db);
      batch.update(doc(db, "sites", siteId, "gallery", item.id), {
        order: other.order,
      });
      batch.update(doc(db, "sites", siteId, "gallery", other.id), {
        order: item.order,
      });
      await batch.commit();
      notify(dir < 0 ? "Moved earlier" : "Moved later");
      onClose();
    } catch (e) {
      notify(friendlyError(e), "error");
      setBusy(false);
    }
  };

  return (
    <Sheet
      title="Edit photo"
      onClose={busy ? () => {} : onClose}
      footer={
        <div className="flex gap-3">
          <button onClick={remove} disabled={busy} className="btn-danger">
            Delete
          </button>
          <button onClick={save} disabled={busy} className="btn-primary flex-1">
            {busy ? <Spinner /> : "Save changes"}
          </button>
        </div>
      }
    >
      <div className="space-y-5">
        <ImagePicker
          url={item.src}
          file={file}
          onPick={setFile}
          onClear={() => setFile(null)}
          aspect="aspect-[4/3]"
          removable={Boolean(file)}
        />
        <Field
          label="Title"
          hint={`Shown large when someone opens the photo. Keep it short. ${title.length}/24`}
        >
          <input
            className="input"
            maxLength={24}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Our clinic visit"
          />
        </Field>
        <Field label="Caption" hint={`${description.length}/180`}>
          <textarea
            className="input"
            rows={3}
            maxLength={180}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </Field>
        <div className="flex gap-3">
          <button
            onClick={() => move(-1)}
            disabled={busy || index <= 0}
            className="btn-ghost flex-1"
          >
            <ChevronLeft className="h-4 w-4" /> Earlier
          </button>
          <button
            onClick={() => move(1)}
            disabled={busy || index >= items.length - 1}
            className="btn-ghost flex-1"
          >
            Later <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </Sheet>
  );
}

export default function Gallery({ notify }) {
  const { siteId } = useSite();
  const { items, loading, error } = useCollection("gallery");
  const [editing, setEditing] = useState(null);
  const [progress, setProgress] = useState(null);
  const input = useRef(null);

  const addPhotos = async (files) => {
    const list = Array.from(files);
    if (!list.length) return;
    let done = 0;
    for (let i = 0; i < list.length; i++) {
      setProgress(`Uploading ${i + 1} of ${list.length}…`);
      try {
        const src = await uploadImage(list[i], {
          maxSize: 1600,
          folder: `${siteId}/gallery`,
        });
        await addDoc(collection(db, "sites", siteId, "gallery"), {
          src,
          title: "",
          description: "",
          order: Date.now() + i,
        });
        done++;
      } catch (e) {
        notify(friendlyError(e), "error");
        break;
      }
    }
    setProgress(null);
    if (done)
      notify(
        done === 1
          ? "Photo added to the gallery"
          : `${done} photos added to the gallery`,
      );
  };

  return (
    <div className="px-4 pb-32 pt-4">
      <input
        ref={input}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => {
          addPhotos(e.target.files);
          e.target.value = "";
        }}
      />

      <p className="text-sm text-ink/60">
        {items.length} photo{items.length === 1 ? "" : "s"}. Tap a photo to add
        a title or caption.
      </p>
      {!loading && items.length > 0 && items.length < 8 && (
        <p className="mt-3 rounded-xl bg-mist p-3 text-sm text-ink/70">
          Tip: the website gallery looks best with 8 or more different photos.
        </p>
      )}
      {error && (
        <p className="mt-4 rounded-xl bg-rose/10 p-4 text-sm text-rose">
          {friendlyError(error)}
        </p>
      )}
      {loading && (
        <div className="mt-16 flex justify-center text-brand">
          <Spinner className="h-7 w-7" />
        </div>
      )}

      {!loading && items.length === 0 && !error && (
        <div className="mt-10 rounded-3xl border border-dashed border-ink/20 bg-white p-8 text-center">
          <h3 className="text-2xl">No photos yet</h3>
          <p className="mx-auto mt-2 max-w-xs text-sm text-ink/60">
            Add photos and they will replace the sample pictures in the website
            gallery.
          </p>
        </div>
      )}

      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
        {items.map((g) => (
          <button
            key={g.id}
            onClick={() => setEditing(g)}
            className="group relative aspect-square overflow-hidden rounded-2xl bg-mist text-left"
          >
            <img
              src={g.src}
              alt={g.title || "Gallery photo"}
              loading="lazy"
              className="h-full w-full object-contain"
            />
            <span className="absolute inset-x-0 bottom-0 truncate bg-gradient-to-t from-ink/80 to-transparent px-3 pb-2 pt-6 text-xs font-semibold text-white">
              {g.title || "No title"}
            </span>
          </button>
        ))}
      </div>

      <button
        onClick={() => input.current?.click()}
        disabled={Boolean(progress)}
        className="fixed bottom-24 right-5 z-30 flex h-14 items-center gap-2 rounded-full bg-rose px-6 text-sm font-semibold text-white shadow-xl transition active:scale-95 disabled:opacity-80"
        style={{ marginBottom: "env(safe-area-inset-bottom)" }}
      >
        {progress ? (
          <>
            <Spinner /> {progress}
          </>
        ) : (
          <>
            <ImagePlus className="h-5 w-5" /> Add photos
          </>
        )}
      </button>

      {editing && (
        <PhotoForm
          key={editing.id}
          item={editing}
          items={items}
          onClose={() => setEditing(null)}
          notify={notify}
        />
      )}
    </div>
  );
}
```

### `src/components/Login.jsx`

```jsx
import { useState } from "react";
import {
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";
import { Eye, EyeOff } from "lucide-react";
import { auth } from "../firebase";
import { Spinner } from "./ui";

const errorText = (code = "") => {
  if (
    code.includes("invalid-credential") ||
    code.includes("wrong-password") ||
    code.includes("user-not-found")
  )
    return "Email or password is not correct.";
  if (code.includes("too-many-requests"))
    return "Too many attempts. Please wait a few minutes and try again.";
  if (code.includes("network")) return "No internet connection.";
  return "Could not sign in. Please try again.";
};

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError("");
    setInfo("");
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
    } catch (err) {
      setError(errorText(err.code));
    } finally {
      setBusy(false);
    }
  };

  const reset = async () => {
    setError("");
    setInfo("");
    if (!email.trim())
      return setError(
        "Type your email above first, then tap “Forgot password”.",
      );
    try {
      await sendPasswordResetEmail(auth, email.trim());
      setInfo("Password reset email sent. Check your inbox (and spam folder).");
    } catch (err) {
      setError(errorText(err.code));
    }
  };

  return (
    <div className="safe-top flex min-h-full flex-col bg-ink px-6 text-paper">
      <div className="flex flex-1 flex-col justify-center py-10">
        <img
          src="/icon-192.png"
          alt=""
          className="mb-8 h-16 w-16 rounded-2xl"
        />
        <h1 className="text-4xl leading-tight">Website Admin</h1>
        <p className="mt-2 text-paper/65">
          Sign in to update your website’s products and gallery.
        </p>

        <form onSubmit={submit} className="mt-9 space-y-4">
          <input
            type="email"
            required
            autoComplete="email"
            inputMode="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl border border-white/15 bg-white/10 px-4 py-3.5 text-paper outline-none placeholder:text-paper/40 focus:border-brand"
          />
          <div className="relative">
            <input
              type={show ? "text" : "password"}
              required
              autoComplete="current-password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-white/15 bg-white/10 px-4 py-3.5 pr-12 text-paper outline-none placeholder:text-paper/40 focus:border-brand"
            />
            <button
              type="button"
              onClick={() => setShow((s) => !s)}
              aria-label={show ? "Hide password" : "Show password"}
              className="absolute right-2 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center text-paper/60"
            >
              {show ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>

          {error && (
            <p className="rounded-xl bg-rose/15 px-4 py-3 text-sm text-[#ffb3b6]">
              {error}
            </p>
          )}
          {info && (
            <p className="rounded-xl bg-brand/20 px-4 py-3 text-sm text-[#bfeff2]">
              {info}
            </p>
          )}

          <button type="submit" disabled={busy} className="btn-rose w-full">
            {busy ? <Spinner /> : "Sign in"}
          </button>
          <button
            type="button"
            onClick={reset}
            className="w-full py-2 text-sm text-paper/65 underline-offset-4 hover:underline"
          >
            Forgot password?
          </button>
        </form>
      </div>
    </div>
  );
}
```

### `src/components/Products.jsx`

```jsx
import { useMemo, useState } from "react";
import { addDoc, collection, deleteDoc, doc, setDoc } from "firebase/firestore";
import { Plus, Search, Star, EyeOff, X } from "lucide-react";
import { db } from "../firebase";
import { useSite } from "../lib/site";
import { uploadImage } from "../lib/upload";
import useCollection from "../lib/useCollection";
import {
  Sheet,
  Field,
  Switch,
  ImagePicker,
  Spinner,
  friendlyError,
} from "./ui";

const emptyProduct = {
  name: "",
  category: "",
  visual: "tube",
  description: "",
  featured: false,
  visible: true,
  image: "",
};

// Quick suggestions for the "details" list. The owner can also type any label of their own.
const SUGGESTIONS = ["Pack size", "Composition", "Form", "Price", "How to use"];

// Old products stored pack / form / composition as fixed fields. Turn them into detail rows.
function detailsFromProduct(p) {
  if (Array.isArray(p.details)) {
    return p.details.map((d) => ({
      label: d.label || "",
      value: d.value || "",
    }));
  }
  return [
    ["Pack size", p.pack],
    ["Form", p.form],
    ["Composition", p.composition],
  ]
    .filter(([, v]) => v && String(v).trim())
    .map(([label, value]) => ({ label, value }));
}

function useCategoryName() {
  const { getCategory } = useSite();
  return (id) => getCategory(id)?.name || (id === "others" ? "Others" : "");
}

function Thumb({ p }) {
  const { getCategory } = useSite();
  const cat = getCategory(p.category);
  if (p.image)
    return (
      <img src={p.image} alt="" className="h-full w-full object-contain" />
    );
  return (
    <div
      className="flex h-full w-full items-center justify-center font-display text-2xl text-white"
      style={{ background: cat?.color || "#059EA9" }}
    >
      {p.name?.[0]?.toUpperCase() || "?"}
    </div>
  );
}

function ProductForm({ product, onClose, notify }) {
  const { siteId, categories } = useSite();
  const isNew = !product.id;
  const hasOthers = categories.some((c) => c.id === "others");
  const [f, setF] = useState({
    ...emptyProduct,
    category: categories[0]?.id || "others",
    ...product,
    details: detailsFromProduct(product),
  });
  const [file, setFile] = useState(null);
  const [busy, setBusy] = useState(false);
  const set = (k) => (e) => setF((s) => ({ ...s, [k]: e.target.value }));

  const setDetail = (i, k, v) =>
    setF((s) => ({
      ...s,
      details: s.details.map((d, j) => (j === i ? { ...d, [k]: v } : d)),
    }));
  const addDetail = (label = "") =>
    setF((s) => ({ ...s, details: [...s.details, { label, value: "" }] }));
  const removeDetail = (i) =>
    setF((s) => ({ ...s, details: s.details.filter((_, j) => j !== i) }));

  const usedLabels = f.details.map((d) => d.label.trim().toLowerCase());
  const freeSuggestions = SUGGESTIONS.filter(
    (s) => !usedLabels.includes(s.toLowerCase()),
  );

  const save = async () => {
    if (!f.name.trim()) return notify("Please enter the product name", "error");
    setBusy(true);
    try {
      let image = f.image;
      if (file)
        image = await uploadImage(file, {
          maxSize: 1200,
          folder: `${siteId}/products`,
        });
      const rows = f.details
        .map((d) => ({ label: d.label.trim(), value: d.value.trim() }))
        .filter((d) => d.label && d.value);
      const find = (re) => rows.find((d) => re.test(d.label))?.value || "";
      const data = {
        name: f.name.trim(),
        category: f.category,
        visual: f.visual,
        description: f.description.trim(),
        details: rows,
        // kept so older website code and search still work
        pack: find(/^pack/i),
        form: find(/^form$/i),
        composition: find(/^composition/i),
        featured: Boolean(f.featured),
        visible: f.visible !== false,
        image: image || "",
      };
      if (isNew) {
        await addDoc(collection(db, "sites", siteId, "products"), {
          ...data,
          order: Date.now(),
        });
      } else {
        await setDoc(doc(db, "sites", siteId, "products", product.id), data, {
          merge: true,
        });
      }
      notify(
        isNew
          ? "Product added. It is now live on the website."
          : "Changes saved",
      );
      onClose();
    } catch (e) {
      notify(friendlyError(e), "error");
      setBusy(false);
    }
  };

  const remove = async () => {
    if (
      !window.confirm(
        `Delete “${product.name}” from the website? This cannot be undone.`,
      )
    )
      return;
    setBusy(true);
    try {
      await deleteDoc(doc(db, "sites", siteId, "products", product.id));
      notify("Product deleted");
      onClose();
    } catch (e) {
      notify(friendlyError(e), "error");
      setBusy(false);
    }
  };

  return (
    <Sheet
      title={isNew ? "New product" : "Edit product"}
      onClose={busy ? () => {} : onClose}
      footer={
        <div className="flex gap-3">
          {!isNew && (
            <button
              type="button"
              onClick={remove}
              disabled={busy}
              className="btn-danger"
            >
              Delete
            </button>
          )}
          <button
            type="button"
            onClick={save}
            disabled={busy}
            className="btn-primary flex-1"
          >
            {busy ? <Spinner /> : isNew ? "Add product" : "Save changes"}
          </button>
        </div>
      }
    >
      <div className="space-y-5">
        <Field
          label="Product photo"
          hint="Optional. Any photo shape works (wide, tall or square). The whole photo is kept."
        >
          <ImagePicker
            url={f.image}
            file={file}
            onPick={setFile}
            onClear={() => {
              setFile(null);
              setF((s) => ({ ...s, image: "" }));
            }}
            label="Take or choose a photo"
          />
        </Field>

        <Field label="Product name *">
          <input
            className="input"
            value={f.name}
            onChange={set("name")}
            placeholder="e.g. Hydra Moist Cream"
          />
        </Field>

        <Field label="Category">
          <select
            className="input"
            value={f.category}
            onChange={set("category")}
          >
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
            {!hasOthers && <option value="others">Others</option>}
          </select>
        </Field>

        <Field label="Short description">
          <textarea
            className="input"
            rows={3}
            value={f.description}
            onChange={set("description")}
          />
        </Field>

        <div>
          <p className="mb-1 text-sm font-semibold">Product details</p>
          <p className="mb-3 text-xs text-ink/55">
            Add any details you want shown on the website, like pack size,
            composition or price. Tap a suggestion or make your own.
          </p>

          <div className="space-y-3">
            {f.details.map((d, i) => (
              <div key={i} className="flex items-start gap-2">
                <input
                  className="input w-2/5 shrink-0"
                  value={d.label}
                  onChange={(e) => setDetail(i, "label", e.target.value)}
                  placeholder="Name, e.g. Pack size"
                  aria-label="Detail name"
                />
                <textarea
                  className="input min-w-0 flex-1"
                  rows={1}
                  value={d.value}
                  onChange={(e) => setDetail(i, "value", e.target.value)}
                  placeholder="Value, e.g. 50 g"
                  aria-label="Detail value"
                />
                <button
                  type="button"
                  onClick={() => removeDetail(i)}
                  aria-label="Remove this detail"
                  className="mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-ink/50 transition hover:bg-mist hover:text-rose"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            {freeSuggestions.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => addDetail(s)}
                className="rounded-full border border-ink/15 bg-white px-3 py-1.5 text-xs font-semibold text-ink/70 transition active:scale-95"
              >
                + {s}
              </button>
            ))}
            <button
              type="button"
              onClick={() => addDetail("")}
              className="rounded-full border border-brand/40 bg-mist px-3 py-1.5 text-xs font-semibold text-brand-dark transition active:scale-95"
            >
              + My own detail
            </button>
          </div>
        </div>

        {!f.image && !file && (
          <Field label="Pack drawing (used when there is no photo)">
            <select className="input" value={f.visual} onChange={set("visual")}>
              <option value="tube">Tube</option>
              <option value="jar">Jar</option>
              <option value="bottle">Bottle</option>
            </select>
          </Field>
        )}

        <Switch
          checked={f.featured}
          onChange={(v) => setF((s) => ({ ...s, featured: v }))}
          label="Feature on home page"
          hint="The first 4 featured products appear on the Home page."
        />
        <Switch
          checked={f.visible !== false}
          onChange={(v) => setF((s) => ({ ...s, visible: v }))}
          label="Show on website"
          hint="Turn off to hide it without deleting."
        />
      </div>
    </Sheet>
  );
}

export default function Products({ notify }) {
  const catName = useCategoryName();
  const { items, loading, error } = useCollection("products");
  const [query, setQuery] = useState("");
  const [editing, setEditing] = useState(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items.filter((p) =>
      [
        p.name,
        p.composition,
        p.form,
        catName(p.category),
        ...(p.details || []).map((d) => d.value),
      ]
        .join(" ")
        .toLowerCase()
        .includes(q),
    );
  }, [items, query]);

  return (
    <div className="px-4 pb-32 pt-4">
      <div className="relative">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/40" />
        <input
          className="input rounded-full pl-11"
          type="search"
          placeholder={`Search ${items.length} products`}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      {error && (
        <p className="mt-4 rounded-xl bg-rose/10 p-4 text-sm text-rose">
          {friendlyError(error)}
        </p>
      )}
      {loading && (
        <div className="mt-16 flex justify-center text-brand">
          <Spinner className="h-7 w-7" />
        </div>
      )}

      {!loading && items.length === 0 && !error && (
        <div className="mt-12 rounded-3xl border border-dashed border-ink/20 bg-white p-8 text-center">
          <h3 className="text-2xl">No products yet</h3>
          <p className="mx-auto mt-2 max-w-xs text-sm text-ink/60">
            Tap the + button to add your first product. Until then the website
            shows its built-in sample products.
          </p>
          <p className="mx-auto mt-2 max-w-xs text-sm text-ink/60">
            Tip: Settings has a button to load the sample list so you can edit
            it.
          </p>
        </div>
      )}

      <ul className="mt-4 space-y-2.5">
        {filtered.map((p) => (
          <li key={p.id}>
            <button
              onClick={() => setEditing(p)}
              className="flex w-full items-center gap-4 rounded-2xl border border-ink/10 bg-white p-3 text-left transition active:scale-[0.99]"
            >
              <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-mist">
                <Thumb p={p} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold">{p.name}</p>
                <p className="truncate text-sm text-ink/55">
                  {[catName(p.category), p.pack].filter(Boolean).join(", ")}
                </p>
                <div className="mt-1 flex gap-2 text-[11px] font-semibold">
                  {p.featured && (
                    <span className="flex items-center gap-1 text-brand-dark">
                      <Star className="h-3 w-3" /> Featured
                    </span>
                  )}
                  {p.visible === false && (
                    <span className="flex items-center gap-1 text-rose">
                      <EyeOff className="h-3 w-3" /> Hidden
                    </span>
                  )}
                </div>
              </div>
            </button>
          </li>
        ))}
      </ul>

      <button
        onClick={() => setEditing({})}
        aria-label="Add product"
        className="fixed bottom-24 right-5 z-30 flex h-14 w-14 items-center justify-center rounded-full bg-rose text-white shadow-xl transition active:scale-95"
        style={{ marginBottom: "env(safe-area-inset-bottom)" }}
      >
        <Plus className="h-7 w-7" />
      </button>

      {editing && (
        <ProductForm
          key={editing.id || "new"}
          product={editing}
          onClose={() => setEditing(null)}
          notify={notify}
        />
      )}
    </div>
  );
}
```

### `src/components/Settings.jsx`

```jsx
import { useState } from "react";
import { signOut } from "firebase/auth";
import { doc, writeBatch, collection, getDocs } from "firebase/firestore";
import {
  Download,
  ExternalLink,
  LogOut,
  DatabaseZap,
  Smartphone,
  Share,
  Tags,
  Globe,
} from "lucide-react";
import { auth, db, siteUrl, cloudinaryReady } from "../firebase";
import {
  products as sampleProducts,
  categories as defaultCategories,
} from "../data/products";
import { useSite } from "../lib/site";
import Categories from "./Categories";
import useInstall from "../lib/useInstall";
import { Spinner, friendlyError } from "./ui";

function Row({ icon: Icon, title, text, children }) {
  return (
    <div className="rounded-2xl border border-ink/10 bg-white p-5">
      <div className="flex items-start gap-4">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-mist text-brand-dark">
          <Icon className="h-5 w-5" />
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="text-xl">{title}</h3>
          {text && (
            <p className="mt-1 text-sm leading-relaxed text-ink/60">{text}</p>
          )}
          {children && <div className="mt-4">{children}</div>}
        </div>
      </div>
    </div>
  );
}

export default function Settings({ user, notify }) {
  const { canInstall, install, installed, isIOS } = useInstall();
  const { siteId, siteName, hasCustomCategories } = useSite();
  const [seeding, setSeeding] = useState(false);
  const [editCats, setEditCats] = useState(false);

  const seed = async () => {
    const snap = await getDocs(collection(db, "sites", siteId, "products"));
    if (
      snap.size > 0 &&
      !window.confirm(
        "You already have products. Loading the samples will ADD them to your list. Continue?",
      )
    )
      return;
    setSeeding(true);
    try {
      const batch = writeBatch(db);
      const base = Date.now();
      if (!hasCustomCategories)
        batch.set(
          doc(db, "sites", siteId),
          { categories: defaultCategories },
          { merge: true },
        );
      sampleProducts.forEach((p, i) => {
        batch.set(doc(db, "sites", siteId, "products", p.id), {
          ...p,
          visible: true,
          image: "",
          order: base + i,
        });
      });
      await batch.commit();
      notify("Sample products loaded. You can now edit them.");
    } catch (e) {
      notify(friendlyError(e), "error");
    }
    setSeeding(false);
  };

  return (
    <div className="space-y-4 px-4 pb-32 pt-4">
      <Row
        icon={Globe}
        title={siteName}
        text={`You are managing this website. (site id: ${siteId})`}
      />

      <Row
        icon={Tags}
        title="Categories"
        text="Add, rename, reorder or remove the product categories shown on the website."
      >
        <button onClick={() => setEditCats(true)} className="btn-ghost">
          Edit categories
        </button>
      </Row>

      <Row
        icon={Smartphone}
        title="Install this app"
        text={
          installed ? "Website Admin is installed on this phone." : undefined
        }
      >
        {!installed && canInstall && (
          <button onClick={install} className="btn-primary">
            <Download className="h-4 w-4" /> Install app
          </button>
        )}
        {!installed && !canInstall && isIOS && (
          <p className="flex flex-wrap items-center gap-1 text-sm text-ink/70">
            On iPhone: tap <Share className="mx-1 inline h-4 w-4" /> Share in
            Safari, then <b>Add to Home Screen</b>.
          </p>
        )}
        {!installed && !canInstall && !isIOS && (
          <p className="text-sm text-ink/70">
            In Chrome, open the ⋮ menu and tap <b>Install app</b> (or{" "}
            <b>Add to Home screen</b>).
          </p>
        )}
      </Row>

      {siteUrl && (
        <Row
          icon={ExternalLink}
          title="View website"
          text="See how your changes look to visitors."
        >
          <a
            href={siteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-ghost"
          >
            Open website
          </a>
        </Row>
      )}

      <Row
        icon={DatabaseZap}
        title="Load sample products"
        text="Adds the 18 Natusz sample products (and their categories) so you can edit or delete them instead of starting from nothing."
      >
        <button onClick={seed} disabled={seeding} className="btn-ghost">
          {seeding ? <Spinner /> : "Load samples"}
        </button>
      </Row>

      {!cloudinaryReady && (
        <p className="rounded-2xl bg-rose/10 p-4 text-sm text-rose">
          Photo uploads are not set up yet. Add the Cloudinary values to the
          .env file (see README).
        </p>
      )}

      <Row icon={LogOut} title="Signed in" text={user.email}>
        <button onClick={() => signOut(auth)} className="btn-danger">
          Sign out
        </button>
      </Row>

      {editCats && (
        <Categories onClose={() => setEditCats(false)} notify={notify} />
      )}
    </div>
  );
}
```

### `src/components/ui.jsx`

```jsx
import { useCallback, useEffect, useRef, useState } from "react";
import { X, ImagePlus, Loader2, Check } from "lucide-react";

/** Full-height bottom sheet used for editing. */
export function Sheet({ title, onClose, children, footer }) {
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);
  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-6"
      role="dialog"
      aria-modal="true"
    >
      <div className="absolute inset-0 bg-ink/60" onClick={onClose} />
      <div className="relative flex max-h-[94dvh] w-full max-w-xl flex-col overflow-hidden rounded-t-3xl bg-paper sm:rounded-3xl">
        <div className="flex items-center justify-between border-b border-ink/10 px-5 py-4">
          <h2 className="text-2xl">{title}</h2>
          <button
            onClick={onClose}
            aria-label="Close"
            className="flex h-10 w-10 items-center justify-center rounded-full hover:bg-mist"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-5 py-5">{children}</div>
        {footer && (
          <div className="safe-bottom border-t border-ink/10 bg-paper px-5 pb-4 pt-3">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

export function Field({ label, hint, children }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-semibold">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-xs text-ink/50">{hint}</span>}
    </label>
  );
}

export function Switch({ checked, onChange, label, hint }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="flex w-full items-center justify-between gap-4 rounded-xl border border-ink/10 bg-white px-4 py-3 text-left"
    >
      <span>
        <span className="block text-sm font-semibold">{label}</span>
        {hint && <span className="block text-xs text-ink/50">{hint}</span>}
      </span>
      <span
        className={`relative h-7 w-12 shrink-0 rounded-full transition ${checked ? "bg-brand" : "bg-ink/20"}`}
      >
        <span
          className={`absolute top-0.5 h-6 w-6 rounded-full bg-white shadow transition-all ${checked ? "left-[22px]" : "left-0.5"}`}
        />
      </span>
    </button>
  );
}

/** Pick a photo from camera or gallery, with preview. The whole photo is shown (nothing is cropped). */
export function ImagePicker({
  url,
  file,
  onPick,
  onClear,
  aspect = "aspect-square",
  label = "Add photo",
  removable = true,
}) {
  const input = useRef(null);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    if (!file) return setPreview(null);
    const u = URL.createObjectURL(file);
    setPreview(u);
    return () => URL.revokeObjectURL(u);
  }, [file]);

  const shown = preview || url;
  return (
    <div>
      <input
        ref={input}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) onPick(f);
          e.target.value = "";
        }}
      />
      {shown ? (
        <div
          className={`relative overflow-hidden rounded-2xl bg-mist ${aspect}`}
        >
          <img src={shown} alt="" className="h-full w-full object-contain" />
          <div className="absolute inset-x-0 bottom-0 flex gap-2 bg-gradient-to-t from-ink/70 to-transparent p-3">
            <button
              type="button"
              onClick={() => input.current?.click()}
              className="rounded-full bg-white px-4 py-2 text-xs font-semibold"
            >
              Change photo
            </button>
            {removable && (
              <button
                type="button"
                onClick={onClear}
                className="rounded-full bg-white/20 px-4 py-2 text-xs font-semibold text-white"
              >
                Remove
              </button>
            )}
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => input.current?.click()}
          className={`flex w-full flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-ink/20 bg-white text-ink/60 transition hover:border-brand hover:text-brand-dark ${aspect}`}
        >
          <ImagePlus className="h-8 w-8" strokeWidth={1.5} />
          <span className="text-sm font-semibold">{label}</span>
        </button>
      )}
    </div>
  );
}

export function Spinner({ className = "h-5 w-5" }) {
  return <Loader2 className={`${className} animate-spin`} />;
}

/** Small message at the bottom of the screen. */
export function useToast() {
  const [toast, setToast] = useState(null);
  const timer = useRef(null);
  const notify = useCallback((text, kind = "ok") => {
    clearTimeout(timer.current);
    setToast({ text, kind });
    timer.current = setTimeout(() => setToast(null), 3200);
  }, []);
  const node = toast ? (
    <div className="pointer-events-none fixed inset-x-0 bottom-24 z-[60] flex justify-center px-4">
      <div
        className={`flex max-w-md items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold text-white shadow-xl ${
          toast.kind === "error" ? "bg-rose" : "bg-ink"
        }`}
      >
        {toast.kind !== "error" && <Check className="h-4 w-4 text-brand" />}
        {toast.text}
      </div>
    </div>
  ) : null;
  return [node, notify];
}

export function friendlyError(e) {
  const code = e?.code || "";
  if (code.includes("permission-denied"))
    return "Not allowed. Your login may not be linked to this website, or the Firestore rules are not published.";
  if (code.includes("network") || e?.message === "Failed to fetch")
    return "No internet connection. Please try again.";
  return e?.message || "Something went wrong. Please try again.";
}
```

### `src/data/products.js` — first 30 lines

```js
// ─────────────────────────────────────────────────────────────
//  PRODUCTS: add, edit or delete products here.
//
//  ⚠ These are SAMPLE entries so the site looks complete.
//  Replace them with the real product list from Ahmed
//  (names, pack sizes, compositions, descriptions).
//
//  Each product:
//    id           unique, lowercase, no spaces
//    name         product name shown on the card
//    category     one of the category ids below
//    form         Cream, Gel, Lotion, Serum, Wash, Shampoo ...
//    visual       "tube" | "jar" | "bottle" (artwork shown until you add a photo)
//    pack         pack size, e.g. "50 g" or "100 ml"
//    composition  key ingredients / composition
//    description  one or two short lines
//    featured     true = shows on the Home page
//    image        (optional) path to a real photo, e.g. "/products/hydra-cream.jpg"
//                 Put the file in the /public/products/ folder.
// ─────────────────────────────────────────────────────────────

export const categories = [
  {
    id: "moisturisers",
    name: "Moisturisers & Emollients",
    blurb: "Everyday hydration and barrier support for dry, sensitive skin.",
    color: "#059EA9",
  },
  {
    id: "sun-care",
```

### `src/firebase.js`

```js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const env = import.meta.env;

const config = {
  apiKey: env.VITE_FIREBASE_API_KEY,
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: env.VITE_FIREBASE_PROJECT_ID,
  appId: env.VITE_FIREBASE_APP_ID,
};

export const firebaseReady = Boolean(config.apiKey && config.projectId);
export const cloudinaryReady = Boolean(
  env.VITE_CLOUDINARY_CLOUD_NAME && env.VITE_CLOUDINARY_UPLOAD_PRESET,
);
export const siteUrl = env.VITE_SITE_URL || "";

const app = firebaseReady ? initializeApp(config) : null;
export const auth = app ? getAuth(app) : null;
export const db = app ? getFirestore(app) : null;
```

### `src/index.css`

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  html,
  body,
  #root {
    height: 100%;
  }
  body {
    @apply bg-paper font-sans text-ink antialiased;
    overscroll-behavior-y: none;
    -webkit-tap-highlight-color: transparent;
  }
  h1,
  h2,
  h3 {
    font-family: "Fraunces", Georgia, serif;
    font-weight: 400;
    letter-spacing: -0.01em;
  }
  input,
  select,
  textarea {
    font-size: 16px;
  } /* stops iPhone zooming into fields */
}

@layer components {
  .input {
    @apply w-full rounded-xl border border-ink/15 bg-white px-4 py-3 outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20;
  }
  .btn {
    @apply inline-flex items-center justify-center gap-2 rounded-full px-6 py-3.5 text-sm font-semibold transition active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50;
  }
  .btn-primary {
    @apply btn bg-ink text-paper hover:bg-deep;
  }
  .btn-rose {
    @apply btn bg-rose text-white hover:bg-[#c9141b];
  }
  .btn-ghost {
    @apply btn border border-ink/20 text-ink hover:bg-mist;
  }
  .btn-danger {
    @apply btn border border-rose/30 text-rose hover:bg-rose/10;
  }
  .safe-bottom {
    padding-bottom: env(safe-area-inset-bottom);
  }
  .safe-top {
    padding-top: env(safe-area-inset-top);
  }
}
```

### `src/lib/site.jsx`

```jsx
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { signOut } from "firebase/auth";
import { doc, getDoc, onSnapshot } from "firebase/firestore";
import { auth, db } from "../firebase";
import { categories as defaultCategories } from "../data/products";
import { Spinner } from "../components/ui";

/**
 * One admin app, many websites.
 * Each login is linked to ONE website through a document  users/{uid}  with a  siteId.
 * That website's content lives under  sites/{siteId}/...  in Firestore.
 */
const SiteContext = createContext(null);
export const useSite = () => useContext(SiteContext);

export const slugify = (s) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

function Gate({ title, text, spinner }) {
  return (
    <div className="flex min-h-full flex-col items-center justify-center bg-ink p-8 text-center text-paper">
      {spinner ? (
        <Spinner className="h-8 w-8 text-brand" />
      ) : (
        <>
          <h1 className="text-3xl">{title}</h1>
          <p className="mt-3 max-w-sm text-paper/70">{text}</p>
          <button onClick={() => signOut(auth)} className="btn-rose mt-8">
            Sign out
          </button>
        </>
      )}
    </div>
  );
}

export function SiteProvider({ user, children }) {
  const [status, setStatus] = useState("loading"); // loading | ready | unlinked | error
  const [siteId, setSiteId] = useState(null);
  const [site, setSite] = useState({});

  useEffect(() => {
    let alive = true;
    let stop = () => {};
    setStatus("loading");
    (async () => {
      try {
        const link = await getDoc(doc(db, "users", user.uid));
        if (!alive) return;
        const id = link.exists() ? link.data().siteId : null;
        if (!id) return setStatus("unlinked");
        setSiteId(id);
        stop = onSnapshot(
          doc(db, "sites", id),
          (s) => {
            setSite(s.exists() ? s.data() : {});
            setStatus("ready");
          },
          () => {
            setSite({});
            setStatus("ready");
          },
        );
      } catch (e) {
        if (alive) setStatus("error");
      }
    })();
    return () => {
      alive = false;
      stop();
    };
  }, [user.uid]);

  const value = useMemo(() => {
    const custom = Array.isArray(site.categories) && site.categories.length > 0;
    const categories = custom ? site.categories : defaultCategories;
    return {
      siteId,
      siteName: site.name || siteId,
      categories,
      hasCustomCategories: custom,
      getCategory: (id) => categories.find((c) => c.id === id),
    };
  }, [siteId, site]);

  if (status === "loading") return <Gate spinner />;
  if (status === "unlinked")
    return (
      <Gate
        title="Account not linked"
        text="This login is not connected to a website yet. Please contact the person who set up your website."
      />
    );
  if (status === "error")
    return (
      <Gate
        title="Could not load"
        text="Please check your internet connection and the Firestore rules, then sign in again."
      />
    );
  return <SiteContext.Provider value={value}>{children}</SiteContext.Provider>;
}
```

### `src/lib/upload.js`

```js
// Photos are shrunk on the phone first (so uploads are quick and the website stays fast),
// then uploaded to Cloudinary using an unsigned upload preset.

export async function compressImage(file, maxSize = 1600) {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, maxSize / Math.max(bitmap.width, bitmap.height));
  const w = Math.round(bitmap.width * scale);
  const h = Math.round(bitmap.height * scale);
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  canvas.getContext("2d").drawImage(bitmap, 0, 0, w, h);
  // PNGs may have a transparent background (nice for product shots), keep those as PNG
  const type = file.type === "image/png" ? "image/png" : "image/jpeg";
  const blob = await new Promise((resolve) =>
    canvas.toBlob(resolve, type, 0.84),
  );
  return blob || file;
}

export async function uploadImage(
  file,
  { maxSize = 1600, folder = "natusz" } = {},
) {
  const cloud = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const preset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;
  if (!cloud || !preset)
    throw new Error("Cloudinary is not set up yet (see README).");

  const blob = await compressImage(file, maxSize);
  const body = new FormData();
  body.append("file", blob);
  body.append("upload_preset", preset);
  body.append("folder", folder);

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${cloud}/image/upload`,
    {
      method: "POST",
      body,
    },
  );
  const data = await res.json();
  if (!res.ok || !data.secure_url) {
    throw new Error(data?.error?.message || "Photo upload failed");
  }
  return data.secure_url;
}
```

### `src/lib/useCollection.js`

```js
import { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import { useSite } from "./site";

/** Live list of documents from a Firestore collection, sorted by their `order` field. */
export default function useCollection(name) {
  const { siteId } = useSite();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const stop = onSnapshot(
      collection(db, "sites", siteId, name),
      (snap) => {
        const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        list.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
        setItems(list);
        setLoading(false);
      },
      (err) => {
        setError(err);
        setLoading(false);
      },
    );
    return stop;
  }, [siteId, name]);

  return { items, loading, error };
}
```

### `src/lib/useInstall.js`

```js
import { useEffect, useState } from "react";

/** Handles the "Install app" button (Android/Chrome) and detects iPhone / already-installed. */
export default function useInstall() {
  const [promptEvent, setPromptEvent] = useState(null);
  const [installed, setInstalled] = useState(
    window.matchMedia("(display-mode: standalone)").matches ||
      window.navigator.standalone === true,
  );

  useEffect(() => {
    const onPrompt = (e) => {
      e.preventDefault();
      setPromptEvent(e);
    };
    const onInstalled = () => setInstalled(true);
    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent);

  const install = async () => {
    if (!promptEvent) return;
    promptEvent.prompt();
    await promptEvent.userChoice;
    setPromptEvent(null);
  };

  return { canInstall: Boolean(promptEvent), install, installed, isIOS };
}
```

### `src/main.jsx`

```jsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
```

### `index.html`

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1.0, viewport-fit=cover"
    />
    <meta name="theme-color" content="#062A2E" />
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <meta name="mobile-web-app-capable" content="yes" />
    <meta
      name="apple-mobile-web-app-status-bar-style"
      content="black-translucent"
    />
    <meta name="apple-mobile-web-app-title" content="Site Admin" />
    <meta name="robots" content="noindex, nofollow" />
    <title>Website Admin</title>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300..600&family=Manrope:wght@300..800&display=swap"
      rel="stylesheet"
    />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

### `package.json`

```json
{
  "name": "natusz-admin",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "firebase": "^11.0.0",
    "lucide-react": "^0.460.0",
    "react": "^18.3.1",
    "react-dom": "^18.3.1"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.3.4",
    "autoprefixer": "^10.4.20",
    "postcss": "^8.4.49",
    "tailwindcss": "^3.4.17",
    "vite": "^5.4.11",
    "vite-plugin-pwa": "^0.21.1"
  }
}
```

### `vite.config.js`

```js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  plugins: [
    react(),
    // Makes the app installable on a phone ("Add to Home Screen") and lets it open fast.
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.svg", "apple-touch-icon.png"],
      manifest: {
        name: "Website Admin",
        short_name: "Site Admin",
        description: "Manage the products and gallery of your website",
        start_url: "/",
        scope: "/",
        display: "standalone",
        orientation: "portrait",
        background_color: "#062A2E",
        theme_color: "#062A2E",
        icons: [
          { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
          { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
          {
            src: "/maskable-512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
      },
      workbox: {
        // Never cache calls to Firebase / Cloudinary, only the app files themselves
        navigateFallbackDenylist: [/^\/__\//],
      },
    }),
  ],
});
```

### `tailwind.config.js`

```js
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        // Brand colours (taken from the Natusz logo). Change here and the whole site follows.
        ink: "#062A2E", // deepest teal, used for dark sections
        deep: "#0A3C42", // slightly lighter dark teal
        brand: "#059EA9", // logo teal
        "brand-dark": "#047983", // teal for text on light backgrounds (better contrast)
        mist: "#E9F3F2", // pale teal-grey section background
        paper: "#F8FBFA", // page background
        rose: "#ED1C24", // logo red, use sparingly
      },
      fontFamily: {
        display: ['"Fraunces"', "Georgia", "serif"],
        sans: ['"Manrope"', "system-ui", "sans-serif"],
      },
      maxWidth: {
        site: "1280px",
      },
    },
  },
  plugins: [],
};
```

### `postcss.config.js`

```js
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
```

### `firestore.rules`

```text
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // ── Who may edit which website ─────────────────────────────
    // Every admin login has a document  users/{their user id}  containing a  siteId.
    // A login can only edit the website whose id matches its siteId.
    // (You create these users/{uid} documents yourself in the Firebase console, see README.)
    function canEdit(siteId) {
      return request.auth != null
        && exists(/databases/$(database)/documents/users/$(request.auth.uid))
        && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.siteId == siteId;
    }

    // A login can read only its own link document, and nobody can change it from the apps.
    match /users/{uid} {
      allow read: if request.auth != null && request.auth.uid == uid;
      allow write: if false;
    }

    // Website content: anyone (the public website) can READ, only that site's admin can WRITE.
    match /sites/{siteId} {
      allow read: if true;
      allow write: if canEdit(siteId);

      match /products/{id} {
        allow read: if true;
        allow write: if canEdit(siteId);
      }
      match /gallery/{id} {
        allow read: if true;
        allow write: if canEdit(siteId);
      }
    }

    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```
