# Gym-Z

A premium, mobile-first Progressive Web App for gym owners to manage members, renewals and expiries, without spreadsheets. It works offline and exports PDFs.

Built with React, Vite, Tailwind CSS and Firebase (Authentication + Firestore).

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Technologies Used](#technologies-used)
3. [Design System](#design-system)
4. [Folder Structure](#folder-structure)
5. [Installation](#installation)
6. [Running the Development Server](#running-the-development-server)
7. [Building for Production](#building-for-production)
8. [Deploying the Application](#deploying-the-application)
9. [Installing the PWA on Android](#installing-the-pwa-on-android)
10. [Offline Mode and Sync](#offline-mode-and-sync)
11. [PDF Export](#pdf-export)
12. [Firebase Project Setup From Scratch](#firebase-project-setup-from-scratch)
13. [Environment Variables (.env)](#environment-variables-env)
14. [Firestore Security Rules](#firestore-security-rules)
15. [Database Structure](#database-structure)
16. [Reusable Components](#reusable-components)
17. [Modifying Pages](#modifying-pages)
18. [Modifying Components](#modifying-components)
19. [Adding New Features](#adding-new-features)
20. [Changing Business Logic](#changing-business-logic)
21. [Customizing the UI](#customizing-the-ui)
22. [Deploying Updates](#deploying-updates)
23. [Suggested Future Improvements](#suggested-future-improvements)

---

## Project Overview

Gym-Z gives a gym owner a private, isolated workspace where they can:

- Sign in with Google and land in the right place automatically: first-time owners are guided to create a gym workspace, while returning owners go straight to their dashboard
- Create custom membership plans (7/15/30/45/90/180/365 days, or anything else) with their own fees
- Add members with duplicate detection by phone number (prevents double entries, surfaces history + a one-tap **Renew Membership** action instead). The Add Member form includes a **Cancel** button that returns to the Members list without saving. On mobile and tablet, a raised round **+** button in the center of the bottom tab bar opens Add Member from anywhere; on desktop, an **Add Member** button sits at the top of the sidebar
- See a dashboard **Needs Attention** section prioritizing who needs action first: expired, expiring today, tomorrow, within 3 days, within 7 days, grouped under urgency headers with a validity-bar card per member. Based on each member's **effective coverage end date** (their scheduled future membership if one is queued via Extend, otherwise their current `expiryDate`), so a member who already renewed never shows up needing attention just because their old segment is about to lapse. The **Members** page itself is a plain, simple grouped list with no validity bar or urgency headers; urgency alerts live only on the Dashboard. Members has its own **Sort** dropdown (Needs Attention, Newest First, Oldest First by joining date) and a row of **filter chips** (All / Active / Expiring / Expired)
- Send **renewal reminders** in one tap. A **Remind** button appears on Dashboard cards for members who are expired or expiring within 3 days, and a **Remind** action tile appears on every non-blacklisted Member Profile. It opens a sheet with **WhatsApp**, **SMS** (for members without WhatsApp) and **Call**, with a ready-made Hinglish message, and the date of the last reminder is shown on the member. Reminders use plain `wa.me` / `sms:` / `tel:` links, so there is no API, cost or backend; the owner taps Send in their own app
- **Renew Membership** branches on whether the current membership is expired or still active: expired memberships always restart today; active memberships offer **Extend Current Membership** (queues the new plan to begin the moment the current one ends, no days lost) or **Start Immediately** (ends current coverage today, discards remaining days). Advance-scheduled memberships from Extend auto-activate app-wide (Dashboard, Members list, Member Profile) the moment their start date arrives, with no manual step needed
- Dashboard stat cards (Total, Active, Expiring Soon, Expired, Blacklisted) are tappable; each navigates straight to a pre-filtered Members or Blacklist view. **Active**, **Expiring Soon**, and **Expired** always exclude blacklisted members, both on the dashboard counts and the "Needs Attention" list, since a blacklisted member is on a separate track and isn't someone the owner needs to renew
- Maintain a permanent, append-only member profile: personal info, current membership, full renewal history, lifetime amount paid, blacklist history. The profile has a row of large **action tiles** directly under the member's name: **Renew**, **Remind**, **PDF** and **More**. Download PDF is always one tap away, no longer hidden in a menu
- Blacklist/un-blacklist members from the profile's **More** menu. It reads **Blacklist Member** for an active member and switches to **Remove from Blacklist** once blacklisted, retaining their full history either way
- Browse blacklisted members on the **Blacklist** page as clickable cards. Tapping a card opens that member's full profile; a **Remove from Blacklist** button on the card itself also un-blacklists directly from the list
- Permanently remove a member from a gym via a confirmation-gated **Remove Member** action, grouped in the same **More** menu as the Blacklist toggle. This deletes the member document, their full renewal history, and any blacklist entry referencing them, and decrements the gym's `activeMemberCount`
- Instantly search members by name or phone, fast even with thousands of records
- **Work offline.** Members, plans and the dashboard open without internet, and changes made offline (adding members, renewing, blacklisting, removing) are saved on the device and **sync automatically** when the connection returns, even if the app was closed in between. A status banner shows "You're offline", "syncing" and "All changes synced" (see [Offline Mode and Sync](#offline-mode-and-sync))
- **Download PDFs**: a single member's full report (details + renewal history) from the **PDF** tile on the member's profile, or a member list table from the **PDF** button on the Members page. The list export follows the current filter, search and sort. PDFs are generated on the device, so they also work offline (see [PDF Export](#pdf-export))
- Appear on a public, no-login **Gym Rankings** leaderboard ranked by active member count. To protect each gym's privacy, the leaderboard shows the exact count only up to 20 and displays **20+** for anything above that
- Use an Apple-inspired interface: system font stack, pill buttons, grouped lists, bottom-sheet modals on phones, a two-column profile on desktop, and automatic light/dark themes (see [Design System](#design-system))

The app installs as a standalone PWA on Android. The service worker caches the app itself and Firestore's local cache keeps the data, so it opens and works with no connection once it has been opened online at least once on that device.

## Technologies Used

| Layer              | Choice                                                                                  |
| ------------------ | --------------------------------------------------------------------------------------- |
| UI library         | React 18 (functional components + hooks)                                                |
| Build tool         | Vite 5                                                                                  |
| Styling            | Tailwind CSS 3, themed through CSS variables (see Design System)                        |
| Icons              | Built-in inline SVG set (`components/ui/Icon.jsx`), no icon library or emoji            |
| Typography         | System font stack (SF Pro on Apple devices), Inter as the cross-platform fallback       |
| Routing            | React Router v6                                                                         |
| Auth               | Firebase Authentication (Google sign-in)                                                |
| Database           | Firebase Firestore                                                                      |
| Offline data       | Firestore persistent local cache (IndexedDB) with a queued-write sync                   |
| Hosting (optional) | Firebase Hosting or Vercel                                                              |
| PWA                | `vite-plugin-pwa` (Workbox-generated service worker, precaches the app shell and fonts) |
| PDF export         | `jspdf` + `jspdf-autotable` (loaded on demand)                                          |

## Design System

The UI follows a clean, Apple-style language: quiet surfaces, generous spacing, one accent color, and no glassmorphism or heavy glows.

**Theme tokens.** All surface, text and accent colors are CSS variables defined in `src/index.css` as space-separated RGB triplets (for example `--ink-900: 10 10 12`). `tailwind.config.js` maps them with `rgb(var(--ink-900) / <alpha-value>)`, so opacity utilities such as `bg-ink-700/60` keep working. Light mode is simply a second set of values under `html.light`, so **no per-class `!important` overrides exist anymore**. A new component only has to use the `ink-*`, `copper-*`, `steel-*` and `vitality-*` classes and it is automatically correct in both themes.

| Token family  | Role                                                                                               |
| ------------- | -------------------------------------------------------------------------------------------------- |
| `ink-900`     | Page background                                                                                    |
| `ink-800`     | Card / sheet surface                                                                               |
| `ink-700/600` | Hairlines, chips, secondary fills                                                                  |
| `ink-500`     | Secondary text                                                                                     |
| `ink-300…50`  | Text scale, from muted to primary                                                                  |
| `copper-*`    | The single brand accent (`copper-500` `#E85D12` for fills, `copper-400` for accent text and icons) |
| `steel-*`     | Secondary accent (info tones)                                                                      |
| `vitality-*`  | Functional status colors (ok, warn, critical, expired) used by badges and the validity bar         |

**Shape and motion.** Buttons are pills (`rounded-full`), cards use `rounded-xl2` (1.25rem), inputs are 44px tall with a soft focus ring, and modals are bottom sheets with a grabber on phones and centered dialogs from `sm` up. Motion uses `fade-up` and `sheet-up` keyframes with an iOS-style easing curve.

**Layout across devices.**

| Screen             | Navigation                                             | Content                                                     |
| ------------------ | ------------------------------------------------------ | ----------------------------------------------------------- |
| Phone (`< sm`)     | Bottom tab bar with a raised center **+** (Add Member) | Single column, 2-up stat cards, full-bleed chip row         |
| Tablet (`sm`–`lg`) | Same bottom tab bar                                    | 2-column cards, 4-up stats                                  |
| Desktop (`≥ lg`)   | Sticky left sidebar with an **Add Member** button      | Content capped at `max-w-5xl`, 5-up stats, 2-column profile |

## Folder Structure

```
gym-z/
├── public/
│   └── icons/                  # PWA icons (192, 512, maskable, apple-touch)
├── src/
│   ├── components/
│   │   ├── ui/                 # Generic, app-agnostic primitives
│   │   │   ├── Button.jsx             # Pill buttons: primary, secondary, ghost, danger, subtle
│   │   │   ├── Card.jsx
│   │   │   ├── Icon.jsx               # Inline SVG icon set: <Icon name="home" />
│   │   │   ├── Input.jsx
│   │   │   ├── Select.jsx
│   │   │   ├── Badge.jsx
│   │   │   ├── Spinner.jsx
│   │   │   ├── Modal.jsx              # Bottom sheet on mobile, dialog on desktop, Esc to close
│   │   │   └── ValidityBar.jsx        # Slim membership validity bar
│   │   ├── layout/             # App chrome (nav, footer, page shell)
│   │   │   ├── Navbar.jsx
│   │   │   ├── Sidebar.jsx            # Desktop (lg+) side nav with Add Member button
│   │   │   ├── BottomNav.jsx          # Mobile + tablet tab bar with raised Add button
│   │   │   ├── Footer.jsx             # "Made by Zaryab" on every page (withNav prop adds tab-bar clearance)
│   │   │   ├── OfflineBanner.jsx      # Offline / syncing / synced status strip
│   │   │   └── AppShell.jsx           # Wraps every authenticated page (renders OfflineBanner)
│   │   ├── dashboard/
│   │   │   ├── StatCard.jsx           # Icon chip + big number; `featured` variant for Total Members
│   │   │   └── ExpiryAttentionList.jsx
│   │   ├── members/
│   │   │   ├── MemberCard.jsx         # Validity-bar card; used ONLY inside UrgencyMemberGroups on the Dashboard's Needs Attention section; shows Remind button when showRemind is set
│   │   │   ├── MemberListItem.jsx     # Plain row (no validity bar); rendered inside one grouped Card on the Members page
│   │   │   ├── UrgencyMemberGroups.jsx # Urgency-grouped member list (headers + MemberCard grid); used only by the Dashboard
│   │   │   ├── ReminderMenu.jsx       # Remind trigger (button or tile layout) + sheet (WhatsApp / SMS / Call)
│   │   │   ├── MemberForm.jsx         # Includes optional Cancel button (see onCancel prop)
│   │   │   ├── DuplicateMemberModal.jsx
│   │   │   └── RenewalHistory.jsx
│   │   ├── plans/
│   │   │   ├── PlanCard.jsx
│   │   │   └── PlanFormModal.jsx
│   │   ├── blacklist/
│   │   │   ├── BlacklistEntryCard.jsx # Clickable card -> member profile, plus Remove from Blacklist button
│   │   │   └── AddToBlacklistModal.jsx
│   │   └── rankings/
│   │       └── GymRankCard.jsx        # Shows member count capped at "20+"
│   ├── pages/                  # One file per route
│   │   ├── Landing.jsx
│   │   ├── Login.jsx
│   │   ├── CreateGym.jsx              # Gym profile registration; account menu (Logout) when no gym exists yet
│   │   ├── Dashboard.jsx
│   │   ├── Members.jsx                # Search + sort + filter chips + grouped list + PDF list export
│   │   ├── AddMember.jsx
│   │   ├── MemberProfile.jsx          # Identity card + action tiles (Renew, Remind, PDF, More) + membership, personal info and history cards
│   │   ├── MembershipPlans.jsx
│   │   ├── Blacklist.jsx
│   │   ├── GymRankings.jsx            # Public, no login required
│   │   └── NotFound.jsx
│   ├── context/
│   │   ├── AuthContext.jsx            # Current user + their gym workspace (gym also cached in localStorage for offline)
│   │   └── ThemeContext.jsx           # Light/Dark mode
│   ├── firebase/
│   │   ├── config.js                  # Firebase app initialization + Firestore persistent offline cache
│   │   ├── auth.js                    # Auth + Google sign-in wrapper functions
│   │   └── firestore.js               # All Firestore reads/writes live here (writes go through commit() for offline safety)
│   ├── router/
│   │   ├── AppRouter.jsx
│   │   └── ProtectedRoute.jsx         # Redirects to /login if not authenticated
│   ├── utils/
│   │   ├── dateUtils.js               # Date string <-> Date helpers
│   │   ├── membershipUtils.js         # Urgency buckets, effective-expiry helper + validity bar color logic
│   │   ├── reminderUtils.js           # Reminder message builder, phone normalisation, WhatsApp/SMS/tel links
│   │   └── pdfUtils.js                # PDF builders: single member report + member list table
│   ├── App.jsx
│   ├── main.jsx                       # React root, wraps providers + router
│   └── index.css                      # Tailwind entry, theme CSS variables (dark + light), base styles
├── firestore.rules             # Security rules (see below)
├── vercel.json                 # Vercel headers (optional)
├── index.html                  # Loads the Inter font only
├── vite.config.js              # Includes vite-plugin-pwa configuration (precache + font caching)
├── tailwind.config.js          # Maps theme CSS variables to color tokens, fonts, shadows, animations
├── postcss.config.js
├── .env.example
└── package.json
```

### What each important file does

- **`src/firebase/config.js`**: the only place `initializeApp` is called. All other modules import `auth` and `db` from here. It creates Firestore with `persistentLocalCache` + `persistentMultipleTabManager`, which stores data in the browser's IndexedDB so it can be read offline and queues offline writes. If persistent cache can't start (e.g. a browser that blocks IndexedDB), it falls back to `getFirestore(app)` with the normal in-memory cache and logs a warning, so the app still runs, just without offline support.
- **`src/firebase/auth.js`**: every auth operation (Google sign-in, logout) as a plain async function, so pages never talk to the Firebase SDK directly.
- **`src/firebase/firestore.js`**: every Firestore read/write. This is the single source of truth for the database shape; if you're adding a new field or collection, start here. Every write goes through the internal `commit()` helper (see [Offline Mode and Sync](#offline-mode-and-sync)). `addMember`, `deleteMember`, `addToBlacklist`, `removeFromBlacklist` and `writeRenewal` each use one `writeBatch` so the member change, its history record and the `activeMemberCount` change succeed or fail together. Includes `deleteMember(gymId, memberId)`, which batch-deletes a member's document, their `renewals` subcollection, and any matching `blacklist` entry, and decrements the gym's `activeMemberCount` in that same batch. Also includes `removeFromBlacklist(gymId, memberId)`, which takes just the member id: it looks up and deletes the matching blacklist entry itself, so any screen holding a member (Member Profile included) can un-blacklist directly without first loading blacklist entries. `getMemberRenewals` sorts newest-first in JavaScript (not with a Firestore `orderBy`), because renewals created offline don't have a server timestamp yet and would otherwise be dropped from the query.
- **`src/context/AuthContext.jsx`**: exposes `{ user, gym, gymId, loading, refreshGym, setGym }` app-wide via `useAuth()`. `gymId` is what every page uses to scope its Firestore queries to that gym's private subtree. The gym document is also saved in `localStorage` (key `gymz:gym`, tied to the user's uid). If the device is offline, or the gym can't be fetched, the saved copy is used, so an owner is never wrongly sent to **Create Gym** just because there is no internet.
- **`src/router/ProtectedRoute.jsx`**: the gatekeeper for authenticated routes. It redirects signed-in users to the right workspace screen and sends first-time users to `/create-gym` until a gym exists.
- **`src/utils/membershipUtils.js`**: turns an expiry date into an urgency bucket (expired / today / tomorrow / 3 days / 7 days / healthy) and into the validity bar's color + percentage. Also exports `getEffectiveExpiryDate(member)`, which returns a member's scheduled membership's expiry if one is queued (from a prior Extend), otherwise their plain `expiryDate`. Every urgency/attention calculation is based on this, not the raw field, so already-renewed members don't show as needing attention. `groupByUrgency()` buckets every member including a `healthy` group, but only `UrgencyMemberGroups.jsx` (Dashboard) consumes it. Members.jsx uses `sortByUrgency()` purely as one of its three sort options (the other two, Newest/Oldest, sort directly by `joiningDate` inline in `Members.jsx`, not via this file). This is the file to edit if you want to change the color thresholds.
- **`src/firebase/firestore.js`** also owns scheduled-membership promotion: `computeScheduledPromotion()` is a pure function that decides whether a member's `scheduledMembership` (queued by an Extend renewal) is due to activate. Both `getMember` and `subscribeToMembers` call it, so Dashboard, Members list, and Member Profile can never show inconsistent membership state.
- **`src/components/ui/Icon.jsx`**: the app's whole icon set as inline SVG, used as `<Icon name="users" size={20} />`. Available names: `home, users, plus, card, ban, trophy, check, clock, alert, download, file, more, sun, moon, chevronRight, chevronLeft, bell, refresh, trash, x, search, logout, chat, phone`. Icons inherit `currentColor`, so color them with a text class. To add an icon, add one entry to the `P` map. `StatCard` takes an icon **name** (a string), not an emoji.
- **`src/components/rankings/GymRankCard.jsx`**: one row on the public Gym Rankings page. It formats the member count through `formatMemberCount()`, which shows the real number up to `MEMBER_COUNT_CAP` (20) and `20+` above it.
- **`src/utils/reminderUtils.js`**: everything about reminder text and links, with no React and no Firebase. `normalizePhone()` turns whatever is stored (spaces, dashes, `+`, a leading `0`, a bare 10-digit number) into a digits-only number with country code, or `null` if unusable. `buildReminderMessage(member, gymName)` builds the Hinglish message using the member's **effective** expiry date. `whatsappUrl`, `smsUrl` and `telUrl` build the links.
- **`src/components/members/ReminderMenu.jsx`**: the Remind trigger and its sheet. The trigger has two layouts: `layout="button"` (default, a small pill used on Dashboard cards) and `layout="tile"` (the square icon tile used on the Member Profile action row). It renders the sheet through a React portal on `document.body` (so a parent card's CSS transform can't break the sheet's fixed positioning) and stops click events so tapping it inside a clickable card never opens the member profile. It also records `lastRemindedAt`.
- **`src/components/layout/OfflineBanner.jsx`**: a thin status strip rendered at the top of `AppShell`. It listens to the browser's `online` / `offline` events. Offline it shows that changes are being saved on the device. When the connection returns it calls Firestore's `waitForPendingWrites(db)`, shows "syncing", then briefly shows "All changes synced". It renders nothing when everything is normal.
- **`src/utils/pdfUtils.js`**: builds PDFs with `jspdf` and `jspdf-autotable`, with no React and no Firebase. `downloadMemberPdf(member, renewals, gymName)` creates the single member report. `downloadMembersListPdf(members, gymName, label)` creates the list table. The PDF libraries are loaded with dynamic `import()` the first time a PDF is requested, so they don't slow down the first page load.

## Installation

**Prerequisites:** Node.js 18+ and npm.

```bash
git clone <your-repo-url> gym-z
cd gym-z
npm install
```

Then copy the environment template and fill in your Firebase project's keys (see [Firebase Project Setup](#firebase-project-setup-from-scratch) below):

```bash
cp .env.example .env
```

## Running the Development Server

```bash
npm run dev
```

Vite will start on `http://localhost:5173`. Hot module reload is enabled; edits to any file in `src/` reflect instantly.

> **Offline mode cannot be tested with `npm run dev`.** The service worker is disabled in dev (`devOptions.enabled: false`). Use `npm run build` + `npm run preview` instead (see [Offline Mode and Sync](#offline-mode-and-sync)).

### Local testing

1. Configure Firebase with Google sign-in enabled (see [Firebase Project Setup](#firebase-project-setup-from-scratch)).
2. Open `http://localhost:5173/login` and click **Continue with Google**.
3. After sign-in, the app automatically routes you to `/dashboard` if your gym already exists, or `/create-gym` if you are setting up your first gym. On `/create-gym`, a **⋯** menu in the navbar offers **Logout** even before a gym workspace exists (e.g. right after deleting one).
4. Once a gym exists, the dashboard, members, plans, and blacklist screens load from the authenticated gym workspace.
5. Inside the main app, the navbar shows the current gym name (with a gradient initial tile) plus a **⋯ menu** with **Delete Gym** and **Logout** actions for the active workspace. Logging out returns you to the public landing page (`/`), not the login screen.

> Google sign-in opens as a popup window (falls back to a full-page redirect only if the popup is blocked or unsupported, e.g. in some installed PWA contexts). Your domain must be listed under Firebase → Authentication → Settings → Authorized domains (`localhost` is included by default).

> **Tip:** if a change doesn't show up locally (for example the new UI, the **PDF** button or the **PDF** tile is missing after an update), a stale service worker may be serving old files. In DevTools → Application → Service Workers, click **Unregister**, then Storage → **Clear site data**, and hard reload (Ctrl+Shift+R). For an installed PWA on a phone, clear the app's storage or reinstall it.

### Google sign-in troubleshooting

If sign-in fails, check the following in Firebase Console:

1. **Authentication → Sign-in method → Google** must be enabled with a support email set.
2. **Authentication → Settings → Authorized domains** should include `localhost` and your deployed host (for example `your-app.vercel.app`).
3. The `VITE_FIREBASE_*` values in `.env` (or your host's environment variables) must match the Firebase web app you registered.
4. For Vercel deployments, confirm the deployed site uses the same Firebase project as the configured API key.
5. Publish the Firestore rules from this repo if you see `Missing or insufficient permissions` after sign-in:

```bash
firebase deploy --only firestore:rules
```

**Why popup instead of redirect:** `src/firebase/auth.js` uses `signInWithPopup` as the primary sign-in method, falling back to `signInWithRedirect` only when a popup can't open (blocked, or `auth/operation-not-supported-in-this-environment`, which happens in some installed/standalone PWA contexts). This is intentional: `signInWithRedirect` depends on Firebase's `authDomain` (`*.firebaseapp.com`) successfully persisting auth state across the redirect round-trip. Modern Chrome treats that domain as **third-party storage** relative to your app's own domain (e.g. a Vercel URL) and silently partitions/blocks it; the redirect to Google completes, but the auth result never makes it back, with no visible error. Popups avoid this entirely by relaying the result over `postMessage` between windows instead of via storage. The `same-origin-allow-popups` value in `vercel.json`'s `Cross-Origin-Opener-Policy` header is required for the popup flow to work.

## Building for Production

```bash
npm run build
```

Outputs an optimized, minified build to `dist/`, including the generated service worker and web manifest (via `vite-plugin-pwa`).

Preview the production build locally before deploying:

```bash
npm run preview
```

`npm run preview` (usually `http://localhost:4173`) is the way to test offline behavior and the installed-PWA experience, since it serves the real service worker.

## Deploying the Application

### Option A: Firebase Hosting (recommended, pairs naturally with the rest of the stack)

```bash
npm install -g firebase-tools
firebase login
firebase init hosting
# When asked for the public directory, enter: dist
# Configure as a single-page app: Yes
# Set up automatic builds with GitHub: optional

npm run build
firebase deploy --only hosting
```

### Option B: Any static host (Vercel, Netlify, Cloudflare Pages, etc.)

1. Build command: `npm run build`
2. Output directory: `dist`
3. Add the same environment variables from `.env` to the host's environment variable settings (all `VITE_FIREBASE_*` keys).
4. Configure SPA fallback routing (all paths → `index.html`) so React Router's client-side routes resolve correctly on refresh.

## Installing the PWA on Android

1. Open the deployed Gym-Z URL in **Chrome for Android**.
2. Log in (or just browse; the manifest is available on any page).
3. Tap the **⋮** menu → **Install app** (or **Add to Home screen**). Chrome may also show an automatic "Install Gym-Z" banner.
4. Confirm the install. Gym-Z now launches full-screen from the home screen icon, in standalone mode with no browser UI, exactly like a native app.
5. Open the app **online at least once** and visit Members (and any member profiles you want available offline). After that, the service worker holds the app itself and Firestore's local cache holds the data, so the app keeps working with a weak or no connection (see [Offline Mode and Sync](#offline-mode-and-sync)).

## Offline Mode and Sync

Gym-Z is built to keep working on weak or missing gym wifi, with two layers working together:

1. **The app itself**: the service worker (`vite-plugin-pwa`) precaches the JS, CSS, HTML and icons (files up to 5 MB, `maximumFileSizeToCacheInBytes`), serves `index.html` as the navigation fallback, and caches Google Fonts with a `StaleWhileRevalidate` rule. This is why the app opens with no internet. The PDF libraries are included in the precache, so PDF export also works offline. Because the UI uses the system font stack first, text renders correctly even if the Inter web font was never cached.
2. **The data**: Firestore's persistent local cache (`src/firebase/config.js`) stores everything the device has loaded in IndexedDB. Reads come from that cache when offline. Writes made offline are queued on the device and uploaded automatically when the connection returns, even if the app was closed in between. Multiple open tabs share the same cache.

### What works offline

- Opening the app and viewing members, plans and the dashboard (anything already loaded once online)
- Adding members, renewing (Expired / Extend / Start Immediately), blacklisting and un-blacklisting, removing members, editing plans
- Searching, filtering and sorting members
- Downloading PDFs (single member and member list)
- The **Remind** sheet and the **Call** button

### What does not work offline (or has limits)

- **First use on a device**: the app must be opened online once so the data is cached. Nothing can be shown for data the device has never loaded.
- **Member renewal history**: shown offline only for members whose profile was opened online at least once.
- **Duplicate phone detection**: offline, only the data on that device is checked. Two devices that both add the same phone number while offline can create a duplicate.
- **Removing a member offline**: if that member's renewal history was never loaded on the device, the old renewal records can be left behind (the member itself is removed).
- **WhatsApp / SMS reminders**: the Remind sheet opens and the message is ready, but WhatsApp needs internet to send. SMS only needs mobile network signal.
- **Fresh Google sign-in**: an owner who is already signed in stays signed in offline, but a new sign-in needs internet.
- **Gym Rankings**: needs live data from all gyms.

### How writes behave: the `commit()` helper

A Firestore write promise only resolves once the **server** confirms it. Awaiting it while offline would freeze buttons and spinners forever. So every write in `src/firebase/firestore.js` goes through `commit(promise)`:

- **Offline** (`navigator.onLine === false`): returns immediately. The write stays queued in the local cache and syncs later. A failure after the fact is only logged to the console.
- **Online**: waits for the server up to `SYNC_WAIT_MS` (4000 ms), so real errors such as permission denied still reach the UI. If the server is slow, it stops waiting after 4 seconds and the write continues in the background.

Because of that last point, a write that the server rejects **after** the 4-second window would already have shown success to the user. This only happens when something is already wrong with the rules or data.

Scheduled-membership auto-promotion inside `subscribeToMembers` writes without `commit()` on purpose: it runs in the background, never blocks the UI, and logs a warning on failure.

### Sync banner

`OfflineBanner.jsx` (rendered by `AppShell`) shows:

| State                     | Banner                                                             |
| ------------------------- | ------------------------------------------------------------------ |
| Offline                   | "You're offline — changes are saved on this device and will sync…" |
| Back online, uploading    | "Back online — syncing your changes..."                            |
| Upload finished           | "All changes synced." (for 3 seconds)                              |
| Online, nothing to report | Hidden                                                             |

The "synced" tone uses the Tailwind class `vitality-good`, which is defined in `tailwind.config.js` (`#3C9A5C`). If you rename or remove that color, update the class in `OfflineBanner.jsx` to a green you already use.

### Testing offline locally

1. `npm run build` then `npm run preview` (offline mode does not work in `npm run dev`).
2. Open the preview URL in Chrome, log in, open **Members** and one or two member profiles.
3. DevTools (F12) → **Network** → set throttling to **Offline**. The offline banner appears.
4. Add a member, renew a member, search, download a PDF, and reload the page to confirm it still opens.
5. Set throttling back to **No throttling**. The banner shows "syncing", then "All changes synced."
6. Open the Firebase console → Firestore and confirm the offline changes arrived.

## PDF Export

All PDFs are generated **on the device** (no server, no cost) in `src/utils/pdfUtils.js`.

- **Single member**: `MemberProfile.jsx` → **PDF** action tile (directly under the member's name; it shows "Preparing…" while the file is built). Contains the member's status (Active / Expired / Blacklisted), phone, alt phone, age, gender, address, current plan and fee, joined date, expiry date, lifetime paid, notes, the next scheduled membership (if any), and the full renewal history table. File name: `<member-name>-gym-z.pdf`.
- **Member list**: `Members.jsx` → **PDF** button next to **Add Member**. It exports **exactly what is on screen**: the active filter chip (Active / Expiring / Expired), the search text and the sort order are all applied. With no filter or search it is the whole member list. The table has #, Name, Phone, Plan, Joined, Expires, Status and Paid, and expired/blacklisted statuses are shown in red. The button is disabled when the list is empty. File name: `gym-members-<label>.pdf`.
- Every page has a header with the gym name, and a footer with the generation date and page numbers.
- **Rupee symbol:** jsPDF's built-in fonts cannot draw `₹`, so PDFs show amounts as `Rs. 1,500`. To show `₹`, embed a custom TTF font that includes it (see Future Improvements).
- The "Expires" and "Status" in the list use the member's **effective** expiry date (including a scheduled membership), the same rule as the rest of the app. The single-member PDF shows the current `expiryDate` and lists any scheduled membership separately.

## Firebase Project Setup From Scratch

### 1. Create the Firebase project

1. Go to [console.firebase.google.com](https://console.firebase.google.com) and click **Add project**.
2. Name it (e.g. `gym-z-prod`), accept/decline Google Analytics as you prefer, and click **Create project**.
3. Once created, click the **Web (`</>`)** icon to register a web app. Name it "Gym-Z Web" and skip Firebase Hosting setup for now if you plan to configure it later.
4. Copy the `firebaseConfig` object shown; you'll paste these values into your `.env` file.

### 2. Enable Firebase Authentication

1. In the console sidebar, go to **Build → Authentication → Get started**.
2. Under **Sign-in method**, enable **Google**.
3. Set a project support email when prompted. Firebase auto-provisions the OAuth client for your web app, so no extra env vars are needed beyond the standard `VITE_FIREBASE_*` keys.
4. Add your deployed domain (and `localhost` for dev) under **Authentication → Settings → Authorized domains**.

### 3. Creating the Firestore Database

1. Go to **Build → Firestore Database → Create database**.
2. Choose **Start in production mode** (the app ships its own rules, see below).
3. Pick a Cloud Firestore location close to your users (e.g. `asia-south1` for India); this cannot be changed later.
4. Once created, go to the **Rules** tab and replace the default rules with the contents of `firestore.rules` in this repo, then **Publish**.

### 4. Where to place Firebase configuration keys

Never hardcode Firebase keys into source files. They belong in `.env` at the project root (already git-ignored):

```bash
cp .env.example .env
```

Then fill in the values from the `firebaseConfig` object you copied in step 1:

```env
VITE_FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=1234567890
VITE_FIREBASE_APP_ID=1:1234567890:web:abcdef1234567890
```

Vite only exposes env vars prefixed with `VITE_` to client code (see `src/firebase/config.js`, which reads them via `import.meta.env`). Restart `npm run dev` after editing `.env`; Vite does not hot-reload environment variable changes.

## Environment Variables (.env)

| Variable                            | Where to find it                                               |
| ----------------------------------- | -------------------------------------------------------------- |
| `VITE_FIREBASE_API_KEY`             | Firebase Console → Project Settings → General → Web app config |
| `VITE_FIREBASE_AUTH_DOMAIN`         | same location                                                  |
| `VITE_FIREBASE_PROJECT_ID`          | same location                                                  |
| `VITE_FIREBASE_STORAGE_BUCKET`      | same location (optional, not required by the app)              |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | same location                                                  |
| `VITE_FIREBASE_APP_ID`              | same location                                                  |

## Firestore Security Rules

The full, ready-to-publish rules live in [`firestore.rules`](./firestore.rules). Summary of the contract they enforce:

- `users/{ownerUid}`: stores the owner's personal list of gyms as a `gymIds` array so a single owner can manage multiple gym workspaces.
- `gyms/{gymId}`: the top-level gym document is readable by everyone for rankings, but only the authenticated owner whose uid matches `ownerUid` can update or delete it. The app also writes the gym's `ownerUid` and a `createdAt` timestamp here.
- `gyms/{gymId}/members/*`, `membershipPlans/*`, `blacklist/*`, and each member's nested `renewals/*`: readable/writable **only** by the authenticated owner whose uid matches the gym's `ownerUid`. This keeps each gym workspace private and prevents cross-gym data access. This same rule covers member deletion, scheduled-membership promotion, blacklist toggling and the `lastRemindedAt` stamp (plain fields on the already owner-scoped member doc), so no rule changes were needed for any of the renewal/removal/blacklist/reminder features.
- **Offline mode, PDF export and the UI redesign need no rule changes.** Offline writes are queued on the device and, when they sync, go to the same paths and are checked by the same owner-only rules as online writes. PDFs are generated entirely in the browser.

To publish updated rules after editing `firestore.rules`:

```bash
firebase deploy --only firestore:rules
```

## Database Structure

```
users (collection)
└── {ownerUid}                   # Firebase Auth uid of the gym owner
    └── gymIds: [gymIdA, gymIdB, ...]

gyms (collection)
└── {gymId}                      # auto-generated Firestore document id
    ├── ownerUid, gymName, ownerName, ownerEmail, phone
    ├── city, state, shortAddress
    ├── activeMemberCount (number, kept in sync on add/remove; shown publicly capped at "20+")
    ├── reminderTemplate (optional string; the owner's custom reminder wording. Empty/missing = use the built-in Hinglish default)
    ├── createdAt
    │
    ├── membershipPlans (subcollection)
    │   └── {planId} → { name, durationDays, fee, createdAt }
    │
    ├── members (subcollection)
    │   └── {memberId} → {
    │         fullName, phone, altPhone, address, age, gender,
    │         joiningDate, expiryDate, planName, membershipFee,
    │         notes, status, blacklisted,
    │         scheduledMembership (null, or { planName, membershipFee, startDate, expiryDate }
    │           — queued by an "Extend" renewal; auto-promoted into the current
    │           membership fields once startDate is reached, on any page load),
    │         lastRemindedAt (optional 'YYYY-MM-DD'; set when the owner taps WhatsApp or SMS in the Remind sheet),
    │         lifetimeAmountPaid (only ever increases, never resets), createdAt
    │       }
    │       └── renewals (subcollection)
    │           └── {renewalId} → { type: 'new'|'renewal', planName, amount, startDate, expiryDate, createdAt }
    │             (append-only — every renewal, including Extend/Start Immediately, adds a new record; nothing is ever overwritten)
    │
    └── blacklist (subcollection)
        └── {entryId} → { memberId, reason, notes, dateAdded }
```

> **Legacy fields:** documents created before the streak feature was removed may still contain `streakDays` and `streakStartDate` (members) or `gracePeriodDays` (gyms), and gyms that saved a custom reminder message while it was available may still contain `reminderTemplate`. Nothing in the app reads or writes these fields anymore, so they are harmless and can be left in place or cleaned up manually from the Firestore console.

> **Offline timestamps:** `createdAt` and `dateAdded` use `serverTimestamp()`. For a record written offline the value is `null` on the device until it syncs. Code that sorts by these fields must tolerate `null` (this is why `getMemberRenewals` sorts in JavaScript and treats `null` as newest).

**Why nested subcollections instead of flat top-level collections?** Firestore security rules can express "only the owner of this gym" as a single uid check at the `gyms/{gymId}` level and inherit it down through every subcollection (see `firestore.rules`), which is both simpler to secure and cheaper to query. Every query is naturally scoped to one gym's documents without needing a `gymId == X` filter on every read.

**Duplicate detection** queries `members` `where('phone', '==', phone)` scoped to the current gym only (`findMemberByPhone` in `src/firebase/firestore.js`). Firestore will prompt you to create a single-field index the first time this runs if one doesn't already exist implicitly (single-field equality queries are auto-indexed by default, so no manual index is normally required). Offline, the query runs against the device's local cache (including members added offline but not yet synced), so it only knows about data that device has seen.

**Member removal** (`deleteMember` in `src/firebase/firestore.js`) is a hard delete, not a soft/status flag: it batch-deletes the member document, every document in that member's `renewals` subcollection, and any `blacklist` entry whose `memberId` matches, and decrements `activeMemberCount` on the parent gym, all in one batch. There is no undo; the confirmation modal on `MemberProfile.jsx` is the only safeguard, by design, to keep the data model simple (no "deleted" status to filter around elsewhere in the app).

**Blacklist toggle**: `addToBlacklist(gymId, memberId, entry)` adds a `blacklist` entry and flips `blacklisted: true` on the member in one batch. `removeFromBlacklist(gymId, memberId)` does the reverse: it queries for any `blacklist` entries matching that `memberId`, deletes them, and flips `blacklisted: false`, all in one batch. Because it only needs a member id, `MemberProfile.jsx` can call it directly from its **More** menu without first loading blacklist entries; `Blacklist.jsx` and `BlacklistEntryCard.jsx` use the same function from the list view.

**Scheduled (advance) renewals**: when an owner picks "Extend" on a still-active membership, the new plan is written to `scheduledMembership` instead of overwriting the current membership fields. There is no backend cron in this stack, so activation is "lazy": `computeScheduledPromotion()` in `src/firebase/firestore.js` checks on every read whether `scheduledMembership.startDate` has arrived, and if so promotes it into the current membership fields immediately, before any page renders data. This runs inside both `getMember` (Member Profile) and `subscribeToMembers` (Dashboard, Members list), so the gym owner never needs to open a specific member's profile for it to take effect; opening any page that lists members is enough. If a member already has a scheduled membership and renews again with Extend, the new one chains off the end of the _scheduled_ one (not the currently active one), so memberships never overlap.

**Effective expiry / urgency calculation**: `getEffectiveExpiryDate(member)` in `src/utils/membershipUtils.js` returns `member.scheduledMembership?.expiryDate || member.expiryDate`. `groupByUrgency`, `sortByUrgency`, the Dashboard stat cards, the Members page filters, the reminder message and the PDF list export all use this instead of the raw `expiryDate`, so a member who already renewed via Extend (and is just waiting on their scheduled start date) is correctly treated as covered, not as needing attention.

**Gym Rankings** reads the root `gyms` collection ordered by `activeMemberCount desc`; this requires no composite index since it's a single-field sort. Sorting uses the real count; only the _displayed_ number is capped at `20+` (see `GymRankCard.jsx`). The cap is display-only: the real `activeMemberCount` is still stored on the publicly readable gym document, so it hides the number in the UI but does not make it secret. Truly hiding it would require storing a separate public field and keeping the real count out of public reads.

## Reusable Components

All components under `src/components/ui/` are intentionally generic (no Firebase imports, no business logic) so they can be reused or lifted into a design system:

- **`Button`**: pill-shaped; variants `primary` (copper), `secondary` (neutral fill), `ghost` (outlined), `danger`, `subtle`; sizes `sm` (36px) | `md` (44px) | `lg` (48px); supports `loading`.
- **`Card`**: the base surface for every panel (`ink-800`, hairline border, soft shadow).
- **`Icon`**: the shared SVG icon set (`<Icon name="bell" size={20} strokeWidth={1.8} />`). Replaces all emoji.
- **`Input` / `Select`**: labeled 44px form fields with built-in error display and a soft focus ring. `Input` also accepts `wrapperClassName` for layout classes on the outer label. `Select` uses the shared `.select-chevron` class from `index.css` for its arrow.
- **`Modal`**: bottom sheet with a grabber on mobile, centered dialog on desktop. Closes on backdrop click and the **Esc** key. The optional `footer` slot is pinned under the scrolling body and respects the iOS safe area. It is **not** a portal: it renders where you place it. If you open one from inside an element that has a CSS `transform` (for example a hover-lift card), wrap it in `createPortal(..., document.body)` as `ReminderMenu.jsx` does, otherwise its fixed positioning is relative to that element.
- **`Badge`**: small status pill (`warn`, `critical`, `success`, `neutral`).
- **`ValidityBar`**: the slim rounded membership-validity bar, driven entirely by `utils/membershipUtils.js`. Pass `showLabel={false}` for the compact version used on Dashboard cards.

Feature-specific components (`components/members/*`, `components/plans/*`, etc.) compose these primitives with Firestore calls and are the layer to extend when adding member/plan/blacklist features.

## Guide to Modifying Pages

Every route maps 1:1 to a file in `src/pages/`. To change what a screen shows:

1. Open the matching file (e.g. `src/pages/Dashboard.jsx`).
2. Pages read data via hooks (`useAuth()` for the current gym) and the functions exported from `src/firebase/firestore.js`; they don't call Firestore directly.
3. Most pages wrap their content in `<AppShell>` (adds the offline banner/navbar/sidebar/bottom nav/footer). Public pages like `Landing`, `Login`, `GymRankings` instead compose `<Navbar>` + `<Footer>` directly since they don't need the authenticated app chrome.
4. `MemberProfile.jsx` is laid out as two columns on desktop (`lg:grid-cols-5`): the left column (3/5) holds the **identity card**, **membership card** and **personal info card**; the right column (2/5, sticky) holds **Renewal History**. On phones the columns stack. The identity card ends with a row of **action tiles** (`ActionTile`, a small helper at the bottom of the file): **Renew** (primary, copper), **Remind** (rendered by `ReminderMenu` with `layout="tile"`, hidden for blacklisted members), **PDF** (calls `downloadMemberPdf` directly, shows "Preparing…" via `pdfBusy`) and **More**. The **More** dropdown now holds only the secondary actions: the **Blacklist toggle** (label swaps between "Blacklist Member" and "Remove from Blacklist" based on `member.blacklisted`) and the destructive **Remove Member**, with its own outside-click-to-close handling. Remove Member is still gated behind a confirmation `<Modal>` before calling `deleteMember`; the blacklist toggle is a direct call (with a native `confirm()` when un-blacklisting) since it's non-destructive and already reversible.
5. `AddMember.jsx` passes an `onCancel` handler into `MemberForm` that navigates back to `/members` without saving. `MemberForm` only renders the Cancel button when `onCancel` is supplied, so other callers of the form are unaffected.
6. `Dashboard.jsx`'s **Needs Attention** section renders `ExpiryAttentionList.jsx`, which delegates to `UrgencyMemberGroups.jsx` (urgency headers + `MemberCard` grid, `includeHealthy=false`). A count pill next to the heading shows `expired + expiring soon`, and a **See all** link opens the Members page. `Members.jsx` intentionally does **not** use `UrgencyMemberGroups` or `MemberCard`: it renders `MemberListItem` rows inside one grouped `Card` (no validity bar, no urgency headers, no Remind button), with a search field, a sort `<select>`, and a horizontally scrollable row of **filter chips**, so alerts/urgency visuals stay exclusive to the Dashboard while Members stays simple and scannable. Its header also holds the **PDF** export button and the member count.
7. `MemberProfile.jsx` wraps its data load in `try/catch`: if a member can't be loaded offline (never cached), it logs a warning and the spinner stays instead of crashing the page.
8. In the Renew modal, the Extend / Start Immediately choice is a pair of radio-style cards (`ModeOption`, a helper at the bottom of `MemberProfile.jsx`), and the **Confirm Renewal** button lives in the modal's pinned `footer`.

## Guide to Modifying Components

- UI-only tweaks (spacing, color, copy) → edit the component directly; Tailwind utility classes are used inline throughout.
- Shared visual language (colors, fonts, radii, shadows) → edit the CSS variables in `src/index.css` and the mappings in `tailwind.config.js` once, and it propagates everywhere (both themes).
- If a change is needed in many places (e.g. every button should get a new hover state) → edit the primitive in `src/components/ui/`, not each call site.
- Need an icon? Add it to the `P` map in `Icon.jsx` instead of using emoji or adding an icon library.

## Guide to Adding New Features

Example: adding a "Trainer Assignment" feature to members.

1. **Data model**: add a `trainerId` / `trainerName` field to the member document shape (document the change in the [Database Structure](#database-structure) section above).
2. **Firestore layer**: add any new query/mutation functions to `src/firebase/firestore.js` (e.g. `assignTrainer(gymId, memberId, trainerId)`). **Wrap every write in `commit()`** (for example `await commit(updateDoc(...))`) so the feature keeps working offline and never freezes waiting for the server. For several related writes, use one `writeBatch` and `await commit(batch.commit())`.
3. **UI**: add the field to `MemberForm.jsx` and display it in `MemberProfile.jsx`. If it should appear in PDFs, add it to the `rows` list in `downloadMemberPdf` or the columns in `downloadMembersListPdf` (`src/utils/pdfUtils.js`).
4. **Security rules**: if you add a new top-level subcollection (e.g. `gyms/{gymId}/trainers`), it's automatically covered by the existing wildcard rule in `firestore.rules` (`match /{subcollection}/{docId}`), so no rule changes are needed unless you want different permissions for it.

For destructive actions specifically (like Remove Member), follow the pattern already established: tuck the action behind the profile's **More** menu rather than a prominent tile, and require a confirmation `<Modal>` before calling the Firestore mutation. See `src/pages/MemberProfile.jsx` for a working reference. Frequent, safe actions (Renew, Remind, PDF) belong in the visible action-tile row.

## Guide to Changing Business Logic

- **Urgency thresholds / dashboard categories** → `src/utils/membershipUtils.js` (`getUrgencyBucket`).
- **Validity bar color thresholds** → `src/utils/membershipUtils.js` (`getValidityIndicator`).
- **What counts as "effective expiry" for urgency purposes** → `getEffectiveExpiryDate()` in `src/utils/membershipUtils.js`. Edit here if scheduled-membership handling needs to change; `groupByUrgency`, `sortByUrgency`, `Dashboard.jsx`, `Members.jsx`, the reminder message and the PDF list all funnel through it.
- **Where urgency grouping/headers/validity bars appear** → only `src/components/dashboard/ExpiryAttentionList.jsx` (via `UrgencyMemberGroups.jsx`) on the Dashboard. `Members.jsx` deliberately avoids both; it's a flat, searchable, sortable list using `MemberListItem` (no bar, no grouping). If you want the grouped urgency view with validity bars back on Members too, swap its render to `<UrgencyMemberGroups members={filtered} includeHealthy />` instead of the grouped `MemberListItem` card.
- **Members page sort options** → `src/pages/Members.jsx`, the `sortBy` state and its `useMemo` branch. Currently: `urgency` (via `sortByUrgency()`), `newest`/`oldest` (inline `localeCompare` on `joiningDate`, since it's a plain `YYYY-MM-DD` string). Add more options by extending `SORT_OPTIONS` and the corresponding branch.
- **Members page filter chips** → `FILTER_CHIPS` in `src/pages/Members.jsx`. Each chip sets the `?filter=` query param (the same param the Dashboard stat cards use). To add a chip, add an entry there, a label in `FILTER_LABELS` (used for the PDF name), and a branch in the `filtered` `useMemo`.
- **Which Dashboard cards show the Remind button** → `REMIND_BUCKETS` in `src/components/members/UrgencyMemberGroups.jsx` (currently expired, expires today, expires tomorrow, within 3 days). Add `within_7_days` to the set to show it on every Needs Attention card. Blacklisted members never get the button (checked in `MemberCard.jsx`, `MemberProfile.jsx` and `ReminderMenu.jsx`).
- **Reminder message wording** → `buildReminderMessage()` and `getStatusText()` in `src/utils/reminderUtils.js`. The message is Hinglish and the same for every gym. `getStatusText()` produces the phrase for expired / today / tomorrow / "N din baaki". Edit those two to change the wording or language.
- **Reminder phone handling / country code** → `normalizePhone()` and `DEFAULT_COUNTRY_CODE` (`"91"`) in `src/utils/reminderUtils.js`. 10-digit numbers get the country code added; numbers that already include one (11–15 digits) are left alone; anything else is treated as invalid, so the WhatsApp, SMS and Call rows are disabled and a note is shown. Change the constant for a country other than India.
- **"Last reminded" tracking** → `ReminderMenu.jsx` writes `lastRemindedAt` (via `updateMember`) when the owner taps **WhatsApp** or **SMS**. **Call** does not count. The app cannot know whether the message was actually sent, only that the owner opened it.
- **Renewal behavior (Extend vs Start Immediately vs Expired)** → `src/firebase/firestore.js`: `renewExpiredMembership()`, `extendMembership()`, `renewMembershipImmediately()` all funnel through the shared `writeRenewal()` helper, which is the one place that writes history and increments lifetime paid (as one batch passed through `commit()`). `MemberProfile.jsx` decides which function to call based on `daysUntil(member.expiryDate) < 0` and the owner's Extend/Start Immediately choice. `AddMember.jsx` also calls `renewExpiredMembership` / `extendMembership` when the owner taps Renew on a duplicate-phone match.
- **Scheduled membership auto-activation** → `computeScheduledPromotion()` in `src/firebase/firestore.js`. This is the single source of truth for "is a queued Extend renewal due yet"; edit here if you need to change the activation condition. Both `getMember` and `subscribeToMembers` call it automatically.
- **Offline write behavior** → `commit()` and `SYNC_WAIT_MS` at the top of `src/firebase/firestore.js`. Raise `SYNC_WAIT_MS` if you want the app to wait longer for the server before moving on (a longer wait surfaces server errors more reliably but makes slow connections feel slower). Set it very low to treat every write as fire-and-forget.
- **Offline gym fallback** → `loadGym()`, `readCachedGym()` and `writeCachedGym()` in `src/context/AuthContext.jsx` (localStorage key `GYM_CACHE_KEY = "gymz:gym"`). The cache is cleared when the gym resolves to `null`.
- **Offline cache setup** → `src/firebase/config.js` (`persistentLocalCache` + `persistentMultipleTabManager`, with the memory-cache fallback). Change the tab manager to `persistentSingleTabManager()` if you ever need to avoid multi-tab cache sharing.
- **PDF content and layout** → `src/utils/pdfUtils.js`. `downloadMemberPdf` (rows list, renewal table) and `downloadMembersListPdf` (columns, status colors) are the two entry points. Brand colors are the `BRAND` and `DARK` constants at the top. `getStatus()` decides Active / Expired / Blacklisted.
- **What the PDF list button exports** → `handleDownloadPdf` in `src/pages/Members.jsx`. It passes the `filtered` list, so filter + search + sort all apply. To always export every member, pass `members` instead of `filtered`.
- **Dashboard stat card destinations** → `src/pages/Dashboard.jsx` passes an `onClick` to each `StatCard` that navigates to `/members?filter=active|expiring|expired` or `/blacklist`. `src/pages/Members.jsx` reads the `filter` query param via `useSearchParams` and applies it on top of the existing search/sort logic. Both exclude blacklisted members from `active`/`expiring`/`expired`.
- **Duplicate detection key** → currently phone number, enforced in `findMemberByPhone` (`src/firebase/firestore.js`). Changing the unique identifier means updating this query and the Firestore rule assumptions.
- **Member removal behavior** → `deleteMember` (`src/firebase/firestore.js`). It's a hard delete of the member, their renewals, and their blacklist entry, plus an `activeMemberCount` decrement, all in one batch. To make it a soft delete instead (e.g. for audit trails), replace the `batch.delete(memberRef)` call with a `status: 'removed'` flag update and filter it out in `subscribeToMembers`/`Members.jsx` instead.
- **Blacklist toggle behavior** → `addToBlacklist` / `removeFromBlacklist` in `src/firebase/firestore.js`. `MemberProfile.jsx`'s **More** menu picks which one to call based on `member.blacklisted`.

## Guide to Customizing the UI

- **Color palette** → the CSS variables at the top of `src/index.css`. `:root` holds the dark theme and `html.light` holds the light theme. Values are RGB triplets (`--ink-900: 10 10 12`). Changing a variable restyles the whole app in that theme. The brand accent `copper-500` (`#E85D12`) and its hover shade are fixed hex values in `tailwind.config.js`; `copper-400` (accent text/icons) is a variable so it can be lighter in dark mode and deeper in light mode.
- **Shadows, radii, animations** → `tailwind.config.js` (`boxShadow.card` reads `--shadow-card`, which differs per theme; `borderRadius.xl2`; `fade-up` and `sheet-up` keyframes).
- **Light/Dark mode** → `src/context/ThemeContext.jsx` toggles a `.light` class on `<html>` and stores the choice in localStorage. Because the colors are variables, there is nothing else to maintain: new components automatically support both themes as long as they use the `ink-*` / `copper-*` / `vitality-*` classes (avoid hard-coded hex or `bg-white`).
- **Typography** → the system font stack is set in `tailwind.config.js` (`fontFamily.display`, `body`, `mono`): SF Pro on Apple devices, Inter elsewhere, then Segoe UI / Roboto. Inter is the only web font loaded, via the `<link>` in `index.html`. The `font-mono` class no longer means a monospace face; it maps to the same sans stack, and `index.css` applies tabular numerals to it so numbers (phones, dates, counts) stay aligned. Use it on any numeric readout.
- **Navbar branding** → `src/components/layout/Navbar.jsx` shows the **Gym-Z** wordmark (with the `-Z` in copper) on public pages and, inside the app, a gradient tile with the gym's first letter next to the gym name. Gym actions (Delete Gym, Logout) live in a single **⋯** dropdown. On `/create-gym`, if the user is signed in but has no gym yet, a lighter **⋯** menu offering just **Logout** appears instead, so a user who just deleted their gym isn't stranded without a way out. The Back button is a copper chevron link.
- **Navigation** → `Sidebar.jsx` (visible from `lg`, sticky, with an **Add Member** pill on top; the Add Member entry is intentionally not in its link list) and `BottomNav.jsx` (visible below `lg`, a 5-column grid whose center cell is the raised round **+** button). Both mark the active item by pathname, and the Members item stays inactive on `/members/add`. Edit the `LINKS` / `LEFT` / `RIGHT` arrays to add or reorder destinations.
- **Page shell** → `AppShell.jsx` caps content at `max-w-5xl` and puts the Footer inside the content column. `Footer` takes `withNav` to add bottom padding so the mobile tab bar never covers it.
- **Offline banner** → `src/components/layout/OfflineBanner.jsx`. Edit the three messages and the tone classes there. It sits above the Navbar inside `AppShell`.
- **Dashboard** → `Dashboard.jsx` shows today's date, a large greeting and the gym line. The stat grid is 2 columns on phones, 4 on tablets and 5 on desktop. The **Total Members** card uses `StatCard`'s `featured` prop: it spans the full row on phones and tablets (icon left, chevron right) and becomes a normal tile on desktop. `StatCard` tones: `default`, `copper`, `warn`, `critical`, `steel`.
- **Members page header** → `src/pages/Members.jsx` shows the title, a live member count, a secondary **PDF** button (with a loading state while the PDF is built) and the primary **Add Member** button (label shortens to **Add** on phones).
- **Member profile actions** → see the action-tile description under [Modifying Pages](#modifying-pages). The Renew modal branches its content: expired memberships show a simple notice, active memberships show two radio-style cards (Extend / Start Immediately) with the recommended option marked by a copper border, tint and a **Recommended** tag, since it's a binary, consequential choice. The membership card shows a days-left chip, the validity bar, and three stats (Joined, Expires, Lifetime Paid); an **Up Next** panel appears when a scheduled membership exists. A "Last reminded" line appears under the phone number once a reminder has been sent.
- **Remind sheet** → `src/components/members/ReminderMenu.jsx`. A single sheet with the message preview, a last-reminded line, and three icon rows (**WhatsApp**, **SMS**, **Call**). On Dashboard cards a small "Reminded <date>" label sits beside the button; pass `showLastReminded={false}` to hide it (the Member Profile does, since it shows the date under the phone number instead). Use `layout="tile"` for the square tile version.
- **Blacklist page cards** → `src/components/blacklist/BlacklistEntryCard.jsx` wraps the member name/phone/reason block in a `<Link>` to that member's profile, with the **Remove from Blacklist** button kept outside the link so it doesn't trigger navigation.
- **Add Member form** → `src/components/members/MemberForm.jsx` accepts an optional `onCancel` prop; when passed (currently only from `AddMember.jsx`), a ghost-styled **Cancel** button renders next to the submit button.
- **Duplicate member popup** → `src/components/members/DuplicateMemberModal.jsx` shows Current Plan, Expiry Date and Lifetime Paid (the last spans both grid columns), plus **View Full History** and **Renew Membership** actions.
- **Member list styles** → two different presentations, deliberately kept apart: `src/components/members/MemberCard.jsx` (avatar tinted by validity color, days-left chip, slim validity bar, plan name, optional Remind button) is used ONLY inside `UrgencyMemberGroups.jsx` on the Dashboard's Needs Attention section. `src/components/members/MemberListItem.jsx` is a plainer row (gradient avatar initial, name, phone/plan, days-left chip, chevron on larger screens; no validity bar) used ONLY by `Members.jsx`, which wraps all rows in one `Card` with `divide-y` so they read as a single grouped list. Keep this split if you want alerts/urgency visuals to stay exclusive to the Dashboard.
- **Ranking member count display** → `src/components/rankings/GymRankCard.jsx` defines `MEMBER_COUNT_CAP` (default 20). Counts above it render as `20+`; counts at or below it show the real number. Change the constant to move the cap. This is display-only: the real `activeMemberCount` is still stored in Firestore and is publicly readable.
- **Pages restyled automatically** → Login, CreateGym, MembershipPlans, Blacklist, GymRankings, AddMember, NotFound, MemberForm, PlanCard, PlanFormModal, BlacklistEntryCard, GymRankCard, DuplicateMemberModal and RenewalHistory were not rewritten; they inherit the new look from the shared tokens and primitives (`Button`, `Card`, `Input`, `Select`, `Modal`, `Badge`). Edit them directly only if you want page-specific layout changes.

## Guide to Deploying Updates

```bash
git pull
npm install          # only if dependencies changed (e.g. jspdf / jspdf-autotable)
npm run build
firebase deploy --only hosting   # or push to your static host's connected branch
```

If you changed `firestore.rules`, deploy those too (not needed for offline mode, PDF export or UI changes):

```bash
firebase deploy --only firestore:rules
```

The service worker (via `vite-plugin-pwa`, `registerType: 'autoUpdate'`) automatically fetches and activates new builds for users who already have the PWA installed, typically on their next app open (sometimes the second open). After an update that adds offline support, each device should be opened **online once** so its data gets saved for offline use.

## Suggested Future Improvements

- Fully automatic reminders (no tap needed) via the WhatsApp Business API and a scheduled Cloud Function. This needs Meta approval, pre-approved message templates, per-message fees and Firebase's paid plan, so the current one-tap `wa.me` flow is the lightweight version.
- A bulk "Remind everyone expiring soon" action that walks the owner through one WhatsApp message after another.
- Role-based staff accounts per gym (currently one owner account per gym).
- Export to CSV / Excel (PDF export of single members and member lists already exists), plus PDF export of financial summaries.
- Embed a TTF font with the `₹` glyph in `pdfUtils.js` so PDFs show the rupee symbol instead of `Rs.`.
- Pre-load every member's renewal history in the background so profiles are always complete offline, not only the ones opened online before.
- A "Pending sync" indicator per member (or a count in the banner) so the owner can see exactly which offline changes haven't uploaded yet.
- Cross-device duplicate detection for phone numbers added offline on different devices (needs a server-side check, e.g. a Cloud Function, when changes sync).
- A monthly revenue summary on the Dashboard, built from the existing renewal history amounts.
- Multi-branch support for gym chains (a `branches` subcollection under a parent gym).
- Server-side aggregation (Cloud Functions) for `activeMemberCount` instead of client-side `increment()`, to make it fully tamper-resistant.
- A truly private member count for rankings: store a separate public field (e.g. a bucketed `memberCountBadge`) and keep the real `activeMemberCount` out of public reads, instead of only capping the displayed number.
- Push notifications (via Firebase Cloud Messaging) for expiring memberships, once the PWA has a service worker already in place to extend.
- Soft-delete / archive option for removed members (currently a hard delete) for gyms that want an audit trail before permanent removal.
- Server-side (Cloud Function) promotion of scheduled memberships on a nightly schedule, as a backstop for gyms that go multiple days without opening the app (currently promotion only runs on page load, which is sufficient for daily-use gyms but has a theoretical gap for fully inactive ones).
- Real account deletion for the gym owner (distinct from Delete Gym, which only removes the gym workspace) would need Firebase re-auth before calling `deleteUser`, plus cleanup of any remaining owned gyms.
- Follow the system theme (`prefers-color-scheme`) on first launch instead of always defaulting to dark.
- Move `MemberCard`'s validity bar and chip to the member's **effective** expiry date (it still reads the raw `expiryDate`), so Dashboard cards match the rest of the app for members with a scheduled membership.

---

**Made by Zaryab**
