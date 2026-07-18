Here's the updated README reflecting all the changes we made — coverage-aware urgency logic, blacklist exclusions, the blacklist toggle button, member menu restructure, the Add Member cancel button, removed Renewal Settings, and the CreateGym account menu.

**`README.md`** (full file)

```markdown
# Gym-Z

A premium, mobile-first Progressive Web App for gym owners to manage members, renewals, expiries and membership streaks — without spreadsheets.

Built with React, Vite, Tailwind CSS and Firebase (Authentication + Firestore).

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
12. [Database Structure](#database-structure)
13. [Reusable Components](#reusable-components)
14. [Modifying Pages](#modifying-pages)
15. [Modifying Components](#modifying-components)
16. [Adding New Features](#adding-new-features)
17. [Changing Business Logic](#changing-business-logic)
18. [Customizing the UI](#customizing-the-ui)
19. [Deploying Updates](#deploying-updates)
20. [Suggested Future Improvements](#suggested-future-improvements)

---

## Project Overview

Gym-Z gives a gym owner a private, isolated workspace where they can:

- Sign in with Google and land in the right place automatically: first-time owners are guided to create a gym workspace, while returning owners go straight to their dashboard
- Create custom membership plans (7/15/30/45/90/180/365 days, or anything else) with their own fees
- Add members with duplicate detection by phone number (prevents double entries, surfaces history + a one-tap **Renew Membership** action instead). The Add Member form includes a **Cancel** button that returns to the Members list without saving
- See a dashboard **Needs Attention** section prioritizing who needs action first: expired, expiring today, tomorrow, within 3 days, within 7 days — grouped under urgency headers with a validity-bar card per member. Based on each member's **effective coverage end date** (their scheduled future membership if one is queued via Extend, otherwise their current `expiryDate`), so a member who already renewed never shows up needing attention just because their old segment is about to lapse. The **Members** page itself is a plain, simple row list with no validity bar or urgency headers — urgency alerts live only on the Dashboard. Members has its own **Sort** dropdown instead: Needs Attention First (urgency order), Newest Members First, or Oldest Members First (by joining date)
- Track a **Loyalty Streak** — the member's total continuous, paid membership duration in days (not attendance). Shows "New Member" until 30 continuous days are completed; displays in days up to 1 year, then switches to "X Years Y Months". Resets completely if a member doesn't renew within the gym's configurable grace period (default 30 days; currently fixed, no in-app setting — see [Suggested Future Improvements](#suggested-future-improvements))
- **Renew Membership** now branches on whether the current membership is expired or still active: expired memberships always restart today; active memberships offer **Extend Current Membership** (queues the new plan to begin the moment the current one ends — no days lost) or **Start Immediately** (ends current coverage today, discards remaining days). Advance-scheduled memberships from Extend auto-activate app-wide (Dashboard, Members list, Member Profile) the moment their start date arrives — no manual step needed
- Dashboard stat cards (Total, Active, Expiring Soon, Expired, Blacklisted) are tappable — each navigates straight to a pre-filtered Members or Blacklist view. **Active**, **Expiring Soon**, and **Expired** always exclude blacklisted members, both on the dashboard counts and the "Needs Attention" list, since a blacklisted member is on a separate track and isn't someone the owner needs to renew
- Maintain a permanent, append-only member profile: personal info, current membership, full renewal history, lifetime amount paid, blacklist history
- Blacklist/un-blacklist members from a member's profile via a single toggle action in the **⋮ menu** — it reads **Blacklist Member** for an active member and switches to **Remove from Blacklist** once blacklisted, retaining their full history either way
- Browse blacklisted members on the **Blacklist** page as clickable cards — tapping a card opens that member's full profile; a **Remove from Blacklist** button on the card itself also un-blacklists directly from the list
- Permanently remove a member from a gym via a confirmation-gated **Remove Member** action, grouped in the same **⋮ menu** as the Blacklist toggle on the member's profile — this deletes the member document, their full renewal history, and any blacklist entry referencing them, and decrements the gym's `activeMemberCount`
- Instantly search members by name or phone, fast even with thousands of records
- Appear on a public, no-login **Gym Rankings** leaderboard ranked by active member count

The app installs as a standalone PWA on Android and works offline for previously loaded data via a service worker.

## Technologies Used

| Layer              | Choice                                               |
| ------------------ | ---------------------------------------------------- |
| UI library         | React 18 (functional components + hooks)             |
| Build tool         | Vite 5                                               |
| Styling            | Tailwind CSS 3                                       |
| Routing            | React Router v6                                      |
| Auth               | Firebase Authentication (Google sign-in)             |
| Database           | Firebase Firestore                                   |
| Hosting (optional) | Firebase Hosting or Vercel                           |
| PWA                | `vite-plugin-pwa` (Workbox-generated service worker) |

## Folder Structure
```

gym-z/
├── public/
│ └── icons/ # PWA icons (192, 512, maskable, apple-touch)
├── src/
│ ├── components/
│ │ ├── ui/ # Generic, app-agnostic primitives
│ │ │ ├── Button.jsx
│ │ │ ├── Card.jsx
│ │ │ ├── Input.jsx
│ │ │ ├── Select.jsx
│ │ │ ├── Badge.jsx
│ │ │ ├── Spinner.jsx
│ │ │ ├── Modal.jsx
│ │ │ └── ValidityBar.jsx # The membership validity gradient bar
│ │ ├── layout/ # App chrome (nav, footer, page shell)
│ │ │ ├── Navbar.jsx
│ │ │ ├── Sidebar.jsx # Desktop side nav
│ │ │ ├── BottomNav.jsx # Mobile tab bar
│ │ │ ├── Footer.jsx # "Made by Zaryab" on every page
│ │ │ └── AppShell.jsx # Wraps every authenticated page
│ │ ├── dashboard/
│ │ │ ├── StatCard.jsx
│ │ │ └── ExpiryAttentionList.jsx
│ │ ├── members/
│ │ │ ├── MemberCard.jsx # Validity-bar card; used ONLY inside UrgencyMemberGroups on the Dashboard's Needs Attention section
│ │ │ ├── MemberListItem.jsx # Plain compact row (no validity bar) — used only by the Members page's list
│ │ │ ├── UrgencyMemberGroups.jsx # Urgency-grouped member list (headers + MemberCard grid) — used only by the Dashboard's Needs Attention section
│ │ │ ├── MemberForm.jsx # Includes optional Cancel button (see onCancel prop)
│ │ │ ├── DuplicateMemberModal.jsx
│ │ │ └── RenewalHistory.jsx
│ │ ├── plans/
│ │ │ ├── PlanCard.jsx
│ │ │ └── PlanFormModal.jsx
│ │ ├── blacklist/
│ │ │ ├── BlacklistEntryCard.jsx # Clickable card -> member profile, plus Remove from Blacklist button
│ │ │ └── AddToBlacklistModal.jsx
│ │ └── rankings/
│ │ └── GymRankCard.jsx
│ ├── pages/ # One file per route
│ │ ├── Landing.jsx
│ │ ├── Login.jsx
│ │ ├── CreateGym.jsx # Google sign-in + gym profile registration; ⋮ account menu (Logout) when no gym exists yet
│ │ ├── Dashboard.jsx
│ │ ├── Members.jsx # List + instant search
│ │ ├── AddMember.jsx
│ │ ├── MemberProfile.jsx # Permanent member profile + Renew action, ⋮ menu (Blacklist toggle + Remove Member)
│ │ ├── MembershipPlans.jsx
│ │ ├── Blacklist.jsx
│ │ ├── GymRankings.jsx # Public, no login required
│ │ └── NotFound.jsx
│ ├── context/
│ │ ├── AuthContext.jsx # Current user + their gym workspace
│ │ └── ThemeContext.jsx # Light/Dark mode
│ ├── firebase/
│ │ ├── config.js # Firebase app initialization
│ │ ├── auth.js # Auth + Google sign-in wrapper functions
│ │ └── firestore.js # All Firestore reads/writes live here
│ ├── router/
│ │ ├── AppRouter.jsx
│ │ └── ProtectedRoute.jsx # Redirects to /login if not authenticated
│ ├── utils/
│ │ ├── dateUtils.js # Date string <-> Date helpers
│ │ ├── membershipUtils.js # Urgency buckets, effective-expiry helper + validity bar color logic
│ │ └── streakUtils.js # Membership streak calculation
│ ├── App.jsx
│ ├── main.jsx # React root, wraps providers + router
│ └── index.css # Tailwind entry + base styles
├── firestore.rules # Security rules (see below)
├── vercel.json # Vercel headers (optional)
├── index.html
├── vite.config.js # Includes vite-plugin-pwa configuration
├── tailwind.config.js # Color tokens, fonts, animations
├── postcss.config.js
├── .env.example
└── package.json

````

### What each important file does

- **`src/firebase/config.js`** — the only place `initializeApp` is called. All other modules import `auth` and `db` from here.
- **`src/firebase/auth.js`** — every auth operation (Google sign-in, logout) as a plain async function, so pages never talk to the Firebase SDK directly.
- **`src/firebase/firestore.js`** — every Firestore read/write. This is the single source of truth for the database shape; if you're adding a new field or collection, start here. Includes `deleteMember(gymId, memberId)`, which batch-deletes a member's document, their `renewals` subcollection, and any matching `blacklist` entry, then decrements the gym's `activeMemberCount`. Also includes `removeFromBlacklist(gymId, memberId)`, which takes just the member id — it looks up and deletes the matching blacklist entry itself, so any screen holding a member (Member Profile included) can un-blacklist directly without first loading blacklist entries.
- **`src/context/AuthContext.jsx`** — exposes `{ user, gym, gymId, loading }` app-wide via `useAuth()`. `gymId` (the Firebase Auth uid) is what every page uses to scope its Firestore queries to that gym's private subtree.
- **`src/router/ProtectedRoute.jsx`** — the gatekeeper for authenticated routes. It redirects signed-in users to the right workspace screen and sends first-time users to `/create-gym` until a gym exists.
- **`src/utils/membershipUtils.js`** — turns an expiry date into an urgency bucket (expired / today / tomorrow / 3 days / 7 days / healthy) and into the validity bar's color + percentage. Also exports `getEffectiveExpiryDate(member)`, which returns a member's scheduled membership's expiry if one is queued (from a prior Extend), otherwise their plain `expiryDate` — every urgency/attention calculation is based on this, not the raw field, so already-renewed members don't show as needing attention. `groupByUrgency()` buckets every member including a `healthy` group, but only `UrgencyMemberGroups.jsx` (Dashboard) consumes it — Members.jsx uses `sortByUrgency()` purely as one of its three sort options (the other two — Newest/Oldest — sort directly by `joiningDate` inline in `Members.jsx`, not via this file). This is the file to edit if you want to change the color thresholds.
- **`src/utils/streakUtils.js`** — computes the Loyalty Streak (in continuous days) on every renewal, and resets it if the gap since the member's last coverage exceeded the grace period. This is NOT attendance-based, by design. `formatStreak()` returns `null` (render as "New Member") until 30 days are reached, then formats as days or, past 1 year, "X Years Y Months".
- **`src/firebase/firestore.js`** also owns scheduled-membership promotion: `computeScheduledPromotion()` is a pure function that decides whether a member's `scheduledMembership` (queued by an Extend renewal) is due to activate. Both `getMember` and `subscribeToMembers` call it, so Dashboard, Members list, and Member Profile can never show inconsistent membership state.

## Installation

**Prerequisites:** Node.js 18+ and npm.

```bash
git clone <your-repo-url> gym-z
cd gym-z
npm install
````

Then copy the environment template and fill in your Firebase project's keys (see [Firebase Project Setup](#firebase-project-setup-from-scratch) below):

```bash
cp .env.example .env
```

## Running the Development Server

```bash
npm run dev
```

Vite will start on `http://localhost:5173`. Hot module reload is enabled — edits to any file in `src/` reflect instantly.

### Local testing

1. Configure Firebase with Google sign-in enabled (see [Firebase Project Setup](#firebase-project-setup-from-scratch)).
2. Open `http://localhost:5173/login` and click **Continue with Google**.
3. After sign-in, the app automatically routes you to `/dashboard` if your gym already exists, or `/create-gym` if you are setting up your first gym. On `/create-gym`, a **⋮** menu in the navbar offers **Logout** even before a gym workspace exists (e.g. right after deleting one).
4. Once a gym exists, the dashboard, members, plans, and blacklist screens load from the authenticated gym workspace.
5. Inside the main app, the navbar shows the current gym name (in cursive) plus a **⋮ menu** with **Delete Gym** and **Logout** actions for the active workspace. Logging out returns you to the public landing page (`/`), not the login screen.

> Google sign-in opens as a popup window (falls back to a full-page redirect only if the popup is blocked or unsupported, e.g. in some installed PWA contexts). Your domain must be listed under Firebase → Authentication → Settings → Authorized domains (`localhost` is included by default).

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

**Why popup instead of redirect:** `src/firebase/auth.js` uses `signInWithPopup` as the primary sign-in method, falling back to `signInWithRedirect` only when a popup can't open (blocked, or `auth/operation-not-supported-in-this-environment`, which happens in some installed/standalone PWA contexts). This is intentional — `signInWithRedirect` depends on Firebase's `authDomain` (`*.firebaseapp.com`) successfully persisting auth state across the redirect round-trip. Modern Chrome treats that domain as **third-party storage** relative to your app's own domain (e.g. a Vercel URL) and silently partitions/blocks it — the redirect to Google completes, but the auth result never makes it back, with no visible error. Popups avoid this entirely by relaying the result over `postMessage` between windows instead of via storage. The `same-origin-allow-popups` value in `vercel.json`'s `Cross-Origin-Opener-Policy` header is required for the popup flow to work.

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
2. Under **Sign-in method**, enable **Google**.
3. Set a project support email when prompted. Firebase auto-provisions the OAuth client for your web app — no extra env vars are needed beyond the standard `VITE_FIREBASE_*` keys.
4. Add your deployed domain (and `localhost` for dev) under **Authentication → Settings → Authorized domains**.

### 3. Creating the Firestore Database

1. Go to **Build → Firestore Database → Create database**.
2. Choose **Start in production mode** (the app ships its own rules — see below).
3. Pick a Cloud Firestore location close to your users (e.g. `asia-south1` for India) — this cannot be changed later.
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

Vite only exposes env vars prefixed with `VITE_` to client code (see `src/firebase/config.js`, which reads them via `import.meta.env`). Restart `npm run dev` after editing `.env` — Vite does not hot-reload environment variable changes.

## Environment Variables (.env)

| Variable                            | Where to find it                                               |
| ----------------------------------- | -------------------------------------------------------------- |
| `VITE_FIREBASE_API_KEY`             | Firebase Console → Project Settings → General → Web app config |
| `VITE_FIREBASE_AUTH_DOMAIN`         | same location                                                  |
| `VITE_FIREBASE_PROJECT_ID`          | same location                                                  |
| `VITE_FIREBASE_STORAGE_BUCKET`      | same location (optional — not required by the app)             |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | same location                                                  |
| `VITE_FIREBASE_APP_ID`              | same location                                                  |

## Firestore Security Rules

The full, ready-to-publish rules live in [`firestore.rules`](./firestore.rules). Summary of the contract they enforce:

- `users/{ownerUid}` — stores the owner's personal list of gyms as a `gymIds` array so a single owner can manage multiple gym workspaces.
- `gyms/{gymId}` — the top-level gym document is readable by everyone for rankings, but only the authenticated owner whose uid matches `ownerUid` can update or delete it. The app also writes the gym's `ownerUid` and a `createdAt` timestamp here.
- `gyms/{gymId}/members/*`, `membershipPlans/*`, `blacklist/*`, and each member's nested `renewals/*` — readable/writable **only** by the authenticated owner whose uid matches the gym's `ownerUid`. This keeps each gym workspace private and prevents cross-gym data access. This same rule covers member deletion, scheduled-membership promotion, and blacklist toggling (a plain field on the already owner-scoped member doc) — no rule changes were needed for any of the renewal/streak/removal/blacklist features.

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
    ├── activeMemberCount (number, kept in sync on add/renew/remove)
    ├── gracePeriodDays (defaults to 30 on gym creation; no in-app editor currently — see Suggested Future Improvements)
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
    │         streakDays (total continuous days; 0 until first renewal),
    │         streakStartDate (anchor date the streak is measured from; null until first renewal),
    │         lifetimeAmountPaid (only ever increases, never resets), createdAt
    │       }
    │       └── renewals (subcollection)
    │           └── {renewalId} → { type: 'new'|'renewal', planName, amount, startDate, expiryDate, createdAt }
    │             (append-only — every renewal, including Extend/Start Immediately, adds a new record; nothing is ever overwritten)
    │
    └── blacklist (subcollection)
        └── {entryId} → { memberId, reason, notes, dateAdded }
```

**Why nested subcollections instead of flat top-level collections?** Firestore security rules can express "only the owner of this gym" as a single uid check at the `gyms/{gymId}` level and inherit it down through every subcollection (see `firestore.rules`), which is both simpler to secure and cheaper to query — every query is naturally scoped to one gym's documents without needing a `gymId == X` filter on every read.

**Duplicate detection** queries `members` `where('phone', '==', phone)` scoped to the current gym only (`findMemberByPhone` in `src/firebase/firestore.js`) — Firestore will prompt you to create a single-field index the first time this runs if one doesn't already exist implicitly (single-field equality queries are auto-indexed by default, so no manual index is normally required).

**Member removal** (`deleteMember` in `src/firebase/firestore.js`) is a hard delete, not a soft/status flag: it batch-deletes the member document, every document in that member's `renewals` subcollection, and any `blacklist` entry whose `memberId` matches, then decrements `activeMemberCount` on the parent gym. There is no undo — the confirmation modal on `MemberProfile.jsx` is the only safeguard, by design, to keep the data model simple (no "deleted" status to filter around elsewhere in the app).

**Blacklist toggle** — `addToBlacklist(gymId, memberId, entry)` adds a `blacklist` entry and flips `blacklisted: true` on the member. `removeFromBlacklist(gymId, memberId)` does the reverse: it queries for any `blacklist` entries matching that `memberId`, deletes them, and flips `blacklisted: false`, all in one batch. Because it only needs a member id, `MemberProfile.jsx` can call it directly from its **⋮ menu** without first loading blacklist entries; `Blacklist.jsx` and `BlacklistEntryCard.jsx` use the same function from the list view.

**Scheduled (advance) renewals** — when an owner picks "Extend" on a still-active membership, the new plan is written to `scheduledMembership` instead of overwriting the current membership fields. There is no backend cron in this stack, so activation is "lazy": `computeScheduledPromotion()` in `src/firebase/firestore.js` checks on every read whether `scheduledMembership.startDate` has arrived, and if so promotes it into the current membership fields immediately, before any page renders data. This runs inside both `getMember` (Member Profile) and `subscribeToMembers` (Dashboard, Members list), so the gym owner never needs to open a specific member's profile for it to take effect — opening any page that lists members is enough. If a member already has a scheduled membership and renews again with Extend, the new one chains off the end of the _scheduled_ one (not the currently active one), so memberships never overlap.

**Effective expiry / urgency calculation** — `getEffectiveExpiryDate(member)` in `src/utils/membershipUtils.js` returns `member.scheduledMembership?.expiryDate || member.expiryDate`. `groupByUrgency`, `sortByUrgency`, the Dashboard stat cards, and the Members page filters all use this instead of the raw `expiryDate`, so a member who already renewed via Extend (and is just waiting on their scheduled start date) is correctly treated as covered, not as needing attention.

**Gym Rankings** reads the root `gyms` collection ordered by `activeMemberCount desc` — this requires no composite index since it's a single-field sort.

## Reusable Components

All components under `src/components/ui/` are intentionally generic (no Firebase imports, no business logic) so they can be reused or lifted into a design system:

- **`Button`** — variants: `primary` (copper), `secondary` (steel), `ghost`, `danger`, `subtle`; sizes `sm|md|lg`; supports `loading`.
- **`Card`** — the base surface for every panel.
- **`Input` / `Select`** — labeled form fields with built-in error display.
- **`Modal`** — bottom-sheet on mobile, centered dialog on desktop.
- **`Badge`** — small status pill (`warn`, `critical`, `success`, `neutral`).
- **`ValidityBar`** — the signature horizontal membership-validity gradient bar, driven entirely by `utils/membershipUtils.js`.

Feature-specific components (`components/members/*`, `components/plans/*`, etc.) compose these primitives with Firestore calls and are the layer to extend when adding member/plan/blacklist features.

## Guide to Modifying Pages

Every route maps 1:1 to a file in `src/pages/`. To change what a screen shows:

1. Open the matching file (e.g. `src/pages/Dashboard.jsx`).
2. Pages read data via hooks (`useAuth()` for the current gym) and the functions exported from `src/firebase/firestore.js` — they don't call Firestore directly.
3. Most pages wrap their content in `<AppShell>` (adds the navbar/sidebar/bottom nav/footer) — public pages like `Landing`, `Login`, `GymRankings` instead compose `<Navbar>` + `<Footer>` directly since they don't need the authenticated app chrome.
4. `MemberProfile.jsx` follows the same **⋮ overflow menu** pattern as `Navbar.jsx` for secondary/destructive actions: **Renew Membership** stays a visible primary button, while the **Blacklist toggle** (label swaps between "Blacklist Member" and "Remove from Blacklist" based on `member.blacklisted`) and the destructive **Remove Member** action both live in the same dropdown, with its own outside-click-to-close handling. Remove Member is still gated behind a confirmation `<Modal>` before calling `deleteMember`; the blacklist toggle is a direct call (with a native `confirm()` when un-blacklisting) since it's non-destructive and already reversible.
5. `AddMember.jsx` passes an `onCancel` handler into `MemberForm` that navigates back to `/members` without saving — `MemberForm` only renders the Cancel button when `onCancel` is supplied, so other callers of the form are unaffected.
6. `Dashboard.jsx`'s **Needs Attention** section renders `ExpiryAttentionList.jsx`, which delegates to `UrgencyMemberGroups.jsx` (urgency headers + `MemberCard` grid, `includeHealthy=false`). `Members.jsx` intentionally does **not** use `UrgencyMemberGroups` or `MemberCard` — it renders a plain `MemberListItem` row list (no validity bar, no urgency headers), with its own `Select` control offering three sort modes (urgency / newest / oldest by joining date), so alerts/urgency visuals stay exclusive to the Dashboard while Members stays simple and scannable.

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

For destructive actions specifically (like Remove Member), follow the pattern already established: tuck the action behind a **⋮ menu** rather than a prominent button, and require a confirmation `<Modal>` before calling the Firestore mutation — see `src/pages/MemberProfile.jsx` for a working reference.

## Guide to Changing Business Logic

- **Urgency thresholds / dashboard categories** → `src/utils/membershipUtils.js` (`getUrgencyBucket`).
- **Validity bar color thresholds** → `src/utils/membershipUtils.js` (`getValidityIndicator`).
- **What counts as "effective expiry" for urgency purposes** → `getEffectiveExpiryDate()` in `src/utils/membershipUtils.js`. Edit here if scheduled-membership handling needs to change; `groupByUrgency`, `sortByUrgency`, `Dashboard.jsx`, and `Members.jsx` all funnel through it.
- **Where urgency grouping/headers/validity bars appear** → only `src/components/dashboard/ExpiryAttentionList.jsx` (via `UrgencyMemberGroups.jsx`) on the Dashboard. `Members.jsx` deliberately avoids both — it's a flat, searchable, sortable list using `MemberListItem` (no bar, no grouping). If you want the grouped urgency view with validity bars back on Members too, swap its render to `<UrgencyMemberGroups members={filtered} includeHealthy />` instead of the `MemberListItem` list.
- **Members page sort options** → `src/pages/Members.jsx`, the `sortBy` state and its `useMemo` branch. Currently: `urgency` (via `sortByUrgency()`), `newest`/`oldest` (inline `localeCompare` on `joiningDate`, since it's a plain `YYYY-MM-DD` string). Add more options by extending `SORT_OPTIONS` and the corresponding branch.
- **Loyalty Streak calculation** → `src/utils/streakUtils.js`. `computeStreakOnRenewal()` determines continuity/reset on each renewal; `formatStreak()` controls the "New Member" threshold (`STREAK_QUALIFYING_DAYS`, default 30) and the days → years/months display switch (1 year).
- **Grace period** → `gracePeriodDays` on the gym doc, set to `DEFAULT_GRACE_PERIOD_DAYS` (from `streakUtils.js`) at gym creation. There's currently no in-app UI to edit it after creation (the previous Renewal Settings modal was removed) — change it via the Firestore console, or re-add a settings UI that calls `updateGym(gymId, { gracePeriodDays })`.
- **Renewal behavior (Extend vs Start Immediately vs Expired)** → `src/firebase/firestore.js`: `renewExpiredMembership()`, `extendMembership()`, `renewMembershipImmediately()` all funnel through the shared `writeRenewal()` helper, which is the one place that writes history, increments lifetime paid, and recomputes the streak. `MemberProfile.jsx` decides which function to call based on `daysUntil(member.expiryDate) < 0` and the owner's Extend/Start Immediately choice.
- **Scheduled membership auto-activation** → `computeScheduledPromotion()` in `src/firebase/firestore.js`. This is the single source of truth for "is a queued Extend renewal due yet" — edit here if you need to change the activation condition; both `getMember` and `subscribeToMembers` call it automatically.
- **Dashboard stat card destinations** → `src/pages/Dashboard.jsx` passes an `onClick` to each `StatCard` that navigates to `/members?filter=active|expiring|expired` or `/blacklist`. `src/pages/Members.jsx` reads the `filter` query param via `useSearchParams` and applies it on top of the existing search/sort logic. Both exclude blacklisted members from `active`/`expiring`/`expired`.
- **Duplicate detection key** → currently phone number, enforced in `findMemberByPhone` (`src/firebase/firestore.js`). Changing the unique identifier means updating this query and the Firestore rule assumptions.
- **Member removal behavior** → `deleteMember` (`src/firebase/firestore.js`). It's a hard delete of the member, their renewals, and their blacklist entry, plus an `activeMemberCount` decrement. To make it a soft delete instead (e.g. for audit trails), replace the `batch.delete(memberRef)` call with a `status: 'removed'` flag update and filter it out in `subscribeToMembers`/`Members.jsx` instead.
- **Blacklist toggle behavior** → `addToBlacklist` / `removeFromBlacklist` in `src/firebase/firestore.js`. `MemberProfile.jsx`'s **⋮ menu** picks which one to call based on `member.blacklisted`.

## Guide to Customizing the UI

- **Color palette, fonts, shadows** → `tailwind.config.js`. The current palette is an "ink + forged copper" industrial theme (`ink-*` surfaces, `copper-*` primary accent, `steel-*` secondary accent, `vitality-*` for the validity gradient).
- **Light/Dark mode** → `src/context/ThemeContext.jsx` toggles a `.light` class on `<html>`; add `.light` variant overrides in `src/index.css` or via Tailwind's `dark:`/custom selector as needed.
- **Typography** → Google Fonts are loaded in `index.html` (`Oswald` for display/headings, `Manrope` for body text, `IBM Plex Mono` for numeric/data readouts like stats and streak counters). Swap the `<link>` and `fontFamily` values in `tailwind.config.js` to change them.
- **Navbar branding** → `src/components/layout/Navbar.jsx` shows the italic "Gym-Z" wordmark on public pages and the owner's actual gym name (also italic) once inside the app. Gym actions (Delete Gym, Logout) live in a single **⋮** dropdown menu rather than separate buttons. On `/create-gym`, if the user is signed in but has no gym yet, a lighter **⋮** menu offering just **Logout** appears instead, so a user who just deleted their gym isn't stranded without a way out.
- **Member profile actions** → `src/pages/MemberProfile.jsx` mirrors the Navbar's dropdown pattern: the **⋮** menu holds the **Blacklist / Remove from Blacklist** toggle and the destructive **Remove Member** action (`text-vitality-critical` styling) together, while **Renew Membership** stays a prominent standalone button. The Renew modal itself branches its content: expired memberships show a simple notice, active memberships show two selectable cards (Extend / Start Immediately) with the recommended option visually distinguished (`border-copper-500` + tinted background) rather than using a dropdown, since it's a binary, consequential choice.
- **Blacklist page cards** → `src/components/blacklist/BlacklistEntryCard.jsx` wraps the member name/phone/reason block in a `<Link>` to that member's profile, with the **Remove from Blacklist** button kept outside the link so it doesn't trigger navigation.
- **Add Member form** → `src/components/members/MemberForm.jsx` accepts an optional `onCancel` prop; when passed (currently only from `AddMember.jsx`), a ghost-styled **Cancel** button renders next to the submit button.
- **Member list styles** → two different presentations, deliberately kept apart: `src/components/members/MemberCard.jsx` (avatar initial, validity bar, streak, plan, days remaining) is used ONLY inside `UrgencyMemberGroups.jsx` on the Dashboard's Needs Attention section. `src/components/members/MemberListItem.jsx` is a plainer compact row (avatar initial, name, phone/plan/joined line, days remaining, streak — no validity bar) used ONLY by `Members.jsx`'s list. Keep this split if you want alerts/urgency visuals to stay exclusive to the Dashboard.

## Guide to Deploying Updates

```bash
git pull
npm install          # only if dependencies changed
npm run build
firebase deploy --only hosting   # or push to your static host's connected branch
```

If you changed `firestore.rules`, deploy those too:

```bash
firebase deploy --only firestore:rules
```

The service worker (via `vite-plugin-pwa`, `registerType: 'autoUpdate'`) automatically fetches and activates new builds for users who already have the PWA installed, typically on their next app open.

## Suggested Future Improvements

- SMS/WhatsApp renewal reminders (e.g. via a Cloud Function triggered on a schedule, cross-referencing `expiryDate`).
- Role-based staff accounts per gym (currently one owner account per gym).
- Exporting member lists / financial summaries to CSV or PDF.
- Multi-branch support for gym chains (a `branches` subcollection under a parent gym).
- Server-side aggregation (Cloud Functions) for `activeMemberCount` instead of client-side `increment()`, to make it fully tamper-resistant.
- Push notifications (via Firebase Cloud Messaging) for expiring memberships, once the PWA has a service worker already in place to extend.
- Soft-delete / archive option for removed members (currently a hard delete) for gyms that want an audit trail before permanent removal.
- Server-side (Cloud Function) promotion of scheduled memberships on a nightly schedule, as a backstop for gyms that go multiple days without opening the app (currently promotion only runs on page load, which is sufficient for daily-use gyms but has a theoretical gap for fully inactive ones).
- Re-add an in-app editor for `gracePeriodDays` (previously the Navbar's Renewal Settings modal, removed for being confusing/unnecessary) — if reintroduced, put it somewhere more discoverable than a gym-level dropdown, e.g. a dedicated Settings page.
- Real account deletion for the gym owner (distinct from Delete Gym, which only removes the gym workspace) — would need Firebase re-auth before calling `deleteUser`, plus cleanup of any remaining owned gyms.

---

**Made by Zaryab**

```

```
