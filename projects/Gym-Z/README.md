# Gym-Z

A premium, mobile-first Progressive Web App for gym owners to manage members, renewals, expiries and membership streaks — without spreadsheets.

Built with React, Vite, Tailwind CSS and Firebase (Authentication, Firestore, Storage).

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Technologies Used](#technologies-used)
3. [Folder Structure](#folder-structure)
4. [Installation](#installation)
5. [Running the Development Server](#running-the-development-server)
6. [Building for Production](#building-for-production)
7. [Deploying the Application](#deploying-the-application)
8. [Installing the PWA on Android](#installing-the-pwa-on-android)
9. [Firebase Project Setup From Scratch](#firebase-project-setup-from-scratch)
10. [Environment Variables (.env)](#environment-variables-env)
11. [Firestore Security Rules](#firestore-security-rules)
12. [Firebase Storage Security Rules](#firebase-storage-security-rules)
13. [Database Structure](#database-structure)
14. [Reusable Components](#reusable-components)
15. [Modifying Pages](#modifying-pages)
16. [Modifying Components](#modifying-components)
17. [Adding New Features](#adding-new-features)
18. [Changing Business Logic](#changing-business-logic)
19. [Customizing the UI](#customizing-the-ui)
20. [Deploying Updates](#deploying-updates)
21. [Suggested Future Improvements](#suggested-future-improvements)

---

## Project Overview

Gym-Z gives a gym owner a private, isolated workspace where they can:

- Sign in with a phone number and OTP, create a gym after that verification step, and manage a private gym workspace from the dashboard
- Create custom membership plans (7/15/30/45/90/180/365 days, or anything else) with their own fees
- Add members with duplicate detection by phone number (prevents double entries, surfaces history + a one-tap **Renew Membership** action instead)
- See a dashboard prioritizing who needs attention first: expired, expiring today, tomorrow, within 3 days, within 7 days
- Track a **Membership Streak** — a count of continuous, on-time renewals (not attendance) that resets if a membership stays expired past a configurable grace period (default 30 days)
- Maintain a permanent, append-only member profile: personal info, current membership, full renewal history, lifetime amount paid, blacklist history
- Blacklist/un-blacklist members while retaining their full history
- Instantly search members by name or phone, fast even with thousands of records
- Appear on a public, no-login **Gym Rankings** leaderboard once verified

The app installs as a standalone PWA on Android and works offline for previously loaded data via a service worker.

## Technologies Used

| Layer              | Choice                                               |
| ------------------ | ---------------------------------------------------- |
| UI library         | React 18 (functional components + hooks)             |
| Build tool         | Vite 5                                               |
| Styling            | Tailwind CSS 3                                       |
| Routing            | React Router v6                                      |
| Auth               | Firebase Authentication (Phone OTP only)             |
| Database           | Firebase Firestore                                   |
| File storage       | Firebase Storage                                     |
| Hosting (optional) | Firebase Hosting                                     |
| PWA                | `vite-plugin-pwa` (Workbox-generated service worker) |

## Folder Structure

```
gym-z/
├── public/
│   └── icons/                  # PWA icons (192, 512, maskable, apple-touch)
├── src/
│   ├── components/
│   │   ├── ui/                 # Generic, app-agnostic primitives
│   │   │   ├── Button.jsx
│   │   │   ├── Card.jsx
│   │   │   ├── Input.jsx
│   │   │   ├── Select.jsx
│   │   │   ├── Badge.jsx
│   │   │   ├── Spinner.jsx
│   │   │   ├── Modal.jsx
│   │   │   └── ValidityBar.jsx # The membership validity gradient bar
│   │   ├── layout/              # App chrome (nav, footer, page shell)
│   │   │   ├── Navbar.jsx
│   │   │   ├── Sidebar.jsx      # Desktop side nav
│   │   │   ├── BottomNav.jsx    # Mobile tab bar
│   │   │   ├── Footer.jsx       # "Made by Zaryab" on every page
│   │   │   └── AppShell.jsx     # Wraps every authenticated page
│   │   ├── dashboard/
│   │   │   ├── StatCard.jsx
│   │   │   └── ExpiryAttentionList.jsx
│   │   ├── members/
│   │   │   ├── MemberCard.jsx
│   │   │   ├── MemberForm.jsx
│   │   │   ├── DuplicateMemberModal.jsx
│   │   │   └── RenewalHistory.jsx
│   │   ├── plans/
│   │   │   ├── PlanCard.jsx
│   │   │   └── PlanFormModal.jsx
│   │   ├── blacklist/
│   │   │   ├── BlacklistEntryCard.jsx
│   │   │   └── AddToBlacklistModal.jsx
│   │   └── rankings/
│   │       └── GymRankCard.jsx
│   ├── pages/                   # One file per route
│   │   ├── Landing.jsx
│   │   ├── Login.jsx
│   │   ├── ForgotPassword.jsx
│   │   ├── CreateGym.jsx        # Phone OTP + gym profile registration
│   │   ├── Dashboard.jsx
│   │   ├── Members.jsx          # List + instant search
│   │   ├── AddMember.jsx
│   │   ├── MemberProfile.jsx    # Permanent member profile
│   │   ├── MembershipPlans.jsx
│   │   ├── Blacklist.jsx
│   │   ├── GymRankings.jsx      # Public, no login required
│   │   └── NotFound.jsx
│   ├── context/
│   │   ├── AuthContext.jsx      # Current user + their gym workspace
│   │   └── ThemeContext.jsx     # Light/Dark mode
│   ├── firebase/
│   │   ├── config.js            # Firebase app initialization
│   │   ├── auth.js               # Auth + Phone OTP wrapper functions
│   │   └── firestore.js          # All Firestore reads/writes live here
│   ├── router/
│   │   ├── AppRouter.jsx
│   │   └── ProtectedRoute.jsx    # Redirects to /login if not authenticated
│   ├── utils/
│   │   ├── dateUtils.js          # Date string <-> Date helpers
│   │   ├── membershipUtils.js    # Urgency buckets + validity bar color logic
│   │   └── streakUtils.js        # Membership streak calculation
│   ├── App.jsx
│   ├── main.jsx                  # React root, wraps providers + router
│   └── index.css                 # Tailwind entry + base styles
├── firestore.rules               # Security rules (see below)
├── storage.rules                 # Security rules (see below)
├── index.html
├── vite.config.js                # Includes vite-plugin-pwa configuration
├── tailwind.config.js            # Color tokens, fonts, animations
├── postcss.config.js
├── .env.example
└── package.json
```

### What each important file does

- **`src/firebase/config.js`** — the only place `initializeApp` is called. All other modules import `auth`, `db`, `storage` from here.
- **`src/firebase/auth.js`** — every auth operation (login, register, logout, password reset, phone OTP send/confirm) as a plain async function, so pages never talk to the Firebase SDK directly.
- **`src/firebase/firestore.js`** — every Firestore read/write. This is the single source of truth for the database shape; if you're adding a new field or collection, start here.
- **`src/context/AuthContext.jsx`** — exposes `{ user, gym, gymId, loading }` app-wide via `useAuth()`. `gymId` (the Firebase Auth uid) is what every page uses to scope its Firestore queries to that gym's private subtree.
- **`src/router/ProtectedRoute.jsx`** — the gatekeeper for the original auth flow. For local demo/testing, the app now also allows direct access to the main pages from `AppRouter.jsx` so you can review the UI without authenticating.
- **`src/utils/membershipUtils.js`** — turns an expiry date into an urgency bucket (expired / today / tomorrow / 3 days / 7 days) and into the validity bar's color + percentage. This is the file to edit if you want to change the color thresholds.
- **`src/utils/streakUtils.js`** — computes the next streak count on renewal and resets it if the grace period was exceeded. This is NOT attendance-based, by design.

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

Vite will start on `http://localhost:5173`. Hot module reload is enabled — edits to any file in `src/` reflect instantly.

### Demo mode for local testing

You can review the app locally with the current phone-based flow.

- Open the login page and enter a phone number to begin the OTP flow, or
- Create a new gym from the main onboarding flow once your Firebase Phone Auth project is configured
- The dashboard, members, plans, and blacklist screens are all wired to the authenticated gym workspace once a gym exists

> The app currently uses a phone-only sign-in experience. There is no email/password login path in the UI.
>
> Phone OTP (Firebase Phone Auth) requires the app to run on an origin that's authorized in your Firebase project (Authentication → Settings → Authorized domains). `localhost` is authorized by default.

### Phone OTP troubleshooting

If OTP sending fails with a `400 Bad Request`, check the following in Firebase Console:

1. Authentication → Sign-in method → Phone must be enabled.
2. Authentication → Settings → Authorized domains should include `localhost`.
3. The phone number must be entered in international format, for example `+91XXXXXXXXXX`.
4. The web app must use the correct Firebase project values from `.env`. The app will now surface a clear error if the `VITE_FIREBASE_*` values are missing instead of silently falling back to demo credentials.
5. If you see `auth/operation-not-allowed` or `SMS unable to be sent until this region enabled by the app developer`, enable Phone Authentication for the project and confirm the project region supports SMS. This is a Firebase project/region setting, not an app-code issue.
6. For development, Firebase also allows you to add test phone numbers in Authentication → Sign-in method → Phone numbers for testing, which avoids real SMS usage while you are building.

If the manifest error still appears in the browser console, refresh once after the new `public/manifest.webmanifest` file is generated and ensure the app is served from the Vite dev server.

## Building for Production

```bash
npm run build
```

Outputs an optimized, minified build to `dist/`, including the generated service worker and web manifest (via `vite-plugin-pwa`).

Preview the production build locally before deploying:

```bash
npm run preview
```

## Deploying the Application

### Option A — Firebase Hosting (recommended, pairs naturally with the rest of the stack)

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

### Option B — Any static host (Vercel, Netlify, Cloudflare Pages, etc.)

1. Build command: `npm run build`
2. Output directory: `dist`
3. Add the same environment variables from `.env` to the host's environment variable settings (all `VITE_FIREBASE_*` keys).
4. Configure SPA fallback routing (all paths → `index.html`) so React Router's client-side routes resolve correctly on refresh.

## Installing the PWA on Android

1. Open the deployed Gym-Z URL in **Chrome for Android**.
2. Log in (or just browse — the manifest is available on any page).
3. Tap the **⋮** menu → **Install app** (or **Add to Home screen**). Chrome may also show an automatic "Install Gym-Z" banner.
4. Confirm the install. Gym-Z now launches full-screen from the home screen icon, in standalone mode with no browser UI, exactly like a native app.
5. Once installed, Firestore reads are cached (via the service worker's `NetworkFirst` strategy) so recently viewed data remains available with a weak or no connection.

## Firebase Project Setup From Scratch

### 1. Create the Firebase project

1. Go to [console.firebase.google.com](https://console.firebase.google.com) and click **Add project**.
2. Name it (e.g. `gym-z-prod`), accept/decline Google Analytics as you prefer, and click **Create project**.
3. Once created, click the **Web (`</>`)** icon to register a web app. Name it "Gym-Z Web" and skip Firebase Hosting setup for now if you plan to configure it later.
4. Copy the `firebaseConfig` object shown — you'll paste these values into your `.env` file.

### 2. Enable Firebase Authentication

1. In the console sidebar, go to **Build → Authentication → Get started**.
2. Under **Sign-in method**, enable:
   - **Phone**
3. For Phone Auth in development, you can add test phone numbers under **Sign-in method → Phone → Phone numbers for testing** (avoids using your real SMS quota while building).

### 3. Enabling Phone OTP Authentication (detail)

Phone Auth requires reCAPTCHA verification, which Gym-Z sets up automatically via `getRecaptchaVerifier()` in `src/firebase/auth.js` — no extra code is needed, but:

1. Make sure **Phone** sign-in is enabled (step above).
2. Add your deployed domain (and `localhost` for dev) under **Authentication → Settings → Authorized domains**.
3. If testing on a real device/number, standard Firebase phone-auth SMS quotas apply (free tier has a daily cap).

### 4. Creating the Firestore Database

1. Go to **Build → Firestore Database → Create database**.
2. Choose **Start in production mode** (the app ships its own rules — see below).
3. Pick a Cloud Firestore location close to your users (e.g. `asia-south1` for India) — this cannot be changed later.
4. Once created, go to the **Rules** tab and replace the default rules with the contents of `firestore.rules` in this repo, then **Publish**.

### 5. Configuring Firebase Storage

1. Go to **Build → Storage → Get started**.
2. Choose the same production-mode + location settings as Firestore.
3. In the **Rules** tab, replace the default rules with the contents of `storage.rules` in this repo, then **Publish**.
4. Storage is used for the gym's verification photo (`gyms/{gymId}/photo.jpg`) — wiring up an upload UI is one of the [suggested future improvements](#suggested-future-improvements); the security rules are ready for it.

### 6. Where to place Firebase configuration keys

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

Vite only exposes env vars prefixed with `VITE_` to client code (see `src/firebase/config.js`, which reads them via `import.meta.env`). Restart `npm run dev` after editing `.env` — Vite does not hot-reload environment variable changes.

## Environment Variables (.env)

| Variable                            | Where to find it                                               |
| ----------------------------------- | -------------------------------------------------------------- |
| `VITE_FIREBASE_API_KEY`             | Firebase Console → Project Settings → General → Web app config |
| `VITE_FIREBASE_AUTH_DOMAIN`         | same location                                                  |
| `VITE_FIREBASE_PROJECT_ID`          | same location                                                  |
| `VITE_FIREBASE_STORAGE_BUCKET`      | same location                                                  |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | same location                                                  |
| `VITE_FIREBASE_APP_ID`              | same location                                                  |

## Firestore Security Rules

The full, ready-to-publish rules live in [`firestore.rules`](./firestore.rules). Summary of the contract they enforce:

- `users/{ownerUid}` — stores the owner's personal list of gyms as a `gymIds` array so a single owner can manage multiple gym workspaces.
- `gyms/{gymId}` — the top-level gym document is readable by everyone for rankings, but only the authenticated owner whose uid matches `ownerUid` can update or delete it. The app also writes the gym's `ownerUid` and a `createdAt` timestamp here.
- `gyms/{gymId}/members/*`, `membershipPlans/*`, `blacklist/*`, and each member's nested `renewals/*` — readable/writable **only** by the authenticated owner whose uid matches the gym's `ownerUid`. This keeps each gym workspace private and prevents cross-gym data access.

To publish updated rules after editing `firestore.rules`:

```bash
firebase deploy --only firestore:rules
```

## Firebase Storage Security Rules

See [`storage.rules`](./storage.rules). Gym verification photos at `gyms/{gymId}/**` are publicly readable (so they can appear on the rankings page) but only uploadable by the matching authenticated gym owner, capped at 5MB and restricted to image content types.

```bash
firebase deploy --only storage
```

## Database Structure

```
users (collection)
└── {ownerUid}                   # Firebase Auth uid of the gym owner
    └── gymIds: [gymIdA, gymIdB, ...]

gyms (collection)
└── {gymId}                      # auto-generated Firestore document id
    ├── ownerUid, gymName, ownerName, phone, phoneVerified
    ├── city, state, shortAddress
    ├── verified (bool), activeMemberCount (number, kept in sync on add/renew)
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
    │         streakCount, streakUnit,
    │         lifetimeAmountPaid, createdAt
    │       }
    │       └── renewals (subcollection)
    │           └── {renewalId} → { type: 'new'|'renewal', planName, amount, startDate, expiryDate, createdAt }
    │
    └── blacklist (subcollection)
        └── {entryId} → { memberId, reason, notes, dateAdded }
```

**Why nested subcollections instead of flat top-level collections?** Firestore security rules can express "only the owner of this gym" as a single uid check at the `gyms/{gymId}` level and inherit it down through every subcollection (see `firestore.rules`), which is both simpler to secure and cheaper to query — every query is naturally scoped to one gym's documents without needing a `gymId == X` filter on every read.

**Duplicate detection** queries `members` `where('phone', '==', phone)` scoped to the current gym only (`findMemberByPhone` in `src/firebase/firestore.js`) — Firestore will prompt you to create a single-field index the first time this runs if one doesn't already exist implicitly (single-field equality queries are auto-indexed by default, so no manual index is normally required).

**Gym Rankings** reads the root `gyms` collection ordered by `activeMemberCount desc` — this requires no composite index since it's a single-field sort.

## Reusable Components

All components under `src/components/ui/` are intentionally generic (no Firebase imports, no business logic) so they can be reused or lifted into a design system:

- **`Button`** — variants: `primary` (copper), `secondary` (steel), `ghost`, `danger`, `subtle`; sizes `sm|md|lg`; supports `loading`.
- **`Card`** — the base surface for every panel.
- **`Input` / `Select`** — labeled form fields with built-in error display.
- **`Modal`** — bottom-sheet on mobile, centered dialog on desktop.
- **`Badge`** — small status pill (`verified`, `warn`, `critical`, `success`, `neutral`).
- **`ValidityBar`** — the signature horizontal membership-validity gradient bar, driven entirely by `utils/membershipUtils.js`.

Feature-specific components (`components/members/*`, `components/plans/*`, etc.) compose these primitives with Firestore calls and are the layer to extend when adding member/plan/blacklist features.

## Guide to Modifying Pages

Every route maps 1:1 to a file in `src/pages/`. To change what a screen shows:

1. Open the matching file (e.g. `src/pages/Dashboard.jsx`).
2. Pages read data via hooks (`useAuth()` for the current gym) and the functions exported from `src/firebase/firestore.js` — they don't call Firestore directly.
3. Most pages wrap their content in `<AppShell>` (adds the navbar/sidebar/bottom nav/footer) — public pages like `Landing`, `Login`, `GymRankings` instead compose `<Navbar>` + `<Footer>` directly since they don't need the authenticated app chrome.

## Guide to Modifying Components

- UI-only tweaks (spacing, color, copy) → edit the component directly; Tailwind utility classes are used inline throughout.
- Shared visual language (colors, fonts, radii, shadows) → edit `tailwind.config.js` once, and it propagates everywhere.
- If a change is needed in many places (e.g. every button should get a new hover state) → edit the primitive in `src/components/ui/`, not each call site.

## Guide to Adding New Features

Example: adding a "Trainer Assignment" feature to members.

1. **Data model** — add a `trainerId` / `trainerName` field to the member document shape (document the change in the [Database Structure](#database-structure) section above).
2. **Firestore layer** — add any new query/mutation functions to `src/firebase/firestore.js` (e.g. `assignTrainer(gymId, memberId, trainerId)`).
3. **UI** — add the field to `MemberForm.jsx` and display it in `MemberProfile.jsx`.
4. **Security rules** — if you add a new top-level subcollection (e.g. `gyms/{gymId}/trainers`), it's automatically covered by the existing wildcard rule in `firestore.rules` (`match /{subcollection}/{docId}`) — no rule changes needed unless you want different permissions for it.

## Guide to Changing Business Logic

- **Urgency thresholds / dashboard categories** → `src/utils/membershipUtils.js` (`getUrgencyBucket`).
- **Validity bar color thresholds** → `src/utils/membershipUtils.js` (`getValidityIndicator`).
- **Streak calculation + grace period** → `src/utils/streakUtils.js`. Change `DEFAULT_GRACE_PERIOD_DAYS` to adjust the default, or pass a custom value per-gym once you add a settings field for it.
- **Duplicate detection key** → currently phone number, enforced in `findMemberByPhone` (`src/firebase/firestore.js`). Changing the unique identifier means updating this query and the Firestore rule assumptions.

## Guide to Customizing the UI

- **Color palette, fonts, shadows** → `tailwind.config.js`. The current palette is an "ink + forged copper" industrial theme (`ink-*` surfaces, `copper-*` primary accent, `steel-*` secondary accent, `vitality-*` for the validity gradient).
- **Light/Dark mode** → `src/context/ThemeContext.jsx` toggles a `.light` class on `<html>`; add `.light` variant overrides in `src/index.css` or via Tailwind's `dark:`/custom selector as needed.
- **Typography** → Google Fonts are loaded in `index.html` (`Oswald` for display/headings, `Manrope` for body text, `IBM Plex Mono` for numeric/data readouts like stats and streak counters). Swap the `<link>` and `fontFamily` values in `tailwind.config.js` to change them.

## Guide to Deploying Updates

```bash
git pull
npm install          # only if dependencies changed
npm run build
firebase deploy --only hosting   # or push to your static host's connected branch
```

If you changed `firestore.rules` or `storage.rules`, deploy those too:

```bash
firebase deploy --only firestore:rules,storage
```

The service worker (via `vite-plugin-pwa`, `registerType: 'autoUpdate'`) automatically fetches and activates new builds for users who already have the PWA installed, typically on their next app open.

## Suggested Future Improvements

- Gym photo upload UI wired to Firebase Storage (`storage.rules` already supports it) for the Verified Gym profile.
- An admin/verification workflow (even a manual one via the Firebase Console) for approving gyms and flipping `verified: true`.
- SMS/WhatsApp renewal reminders (e.g. via a Cloud Function triggered on a schedule, cross-referencing `expiryDate`).
- Role-based staff accounts per gym (currently one owner account per gym).
- Exporting member lists / financial summaries to CSV or PDF.
- Multi-branch support for gym chains (a `branches` subcollection under a parent gym).
- Server-side aggregation (Cloud Functions) for `activeMemberCount` instead of client-side `increment()`, to make it fully tamper-resistant.
- Push notifications (via Firebase Cloud Messaging) for expiring memberships, once the PWA has a service worker already in place to extend.

---

**Made by Zaryab**
