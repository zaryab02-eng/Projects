## AI Escape Room – Solo & Multiplayer

**AI Escape** is a React + Vite web app that lets players solve AI‑generated puzzles in a cyber‑style escape room. It supports:

- **Solo mode** with a global leaderboard
- **Multiplayer rooms** with a live in‑room leaderboard
- **Admin panel** for configuring difficulty, duration, and number of levels
- **Mini‑games** embedded between questions

The UI is fully responsive and tuned for mobile browsers (including iOS Safari).

---

## Tech Stack

- **Framework**: React 18 + React Router 6
- **Build tool**: Vite 5
- **Styling**: Tailwind CSS + custom utility classes (`card`, `btn-*`, `viewport-container`, `cyber-grid`)
- **Backend**: Firebase Realtime Database
- **AI puzzles**: Google Generative AI (`@google/generative-ai`)
- **PDF export**: `jspdf`

---

## Project Structure (High Level)

- `src/main.jsx` – App bootstrap, global error handlers (media/network safe, especially for Safari).
- `src/App.jsx` – Routing and landing page (`/`, `/admin`, `/join`, `/solo`, `/game`, `/leaderboard`, `/diagnostic`).
- `src/pages/`
  - `AdminPage.jsx` – Create multiplayer room and show room code.
  - `JoinPage.jsx` – Join an existing room by code.
  - `GamePage.jsx` – Multiplayer orchestrator (lobby, game room, results, admin dashboard).
  - `SoloGamePage.jsx` – Solo setup (difficulty, 5/10 levels) and room bootstrap.
  - `GlobalLeaderboardPage.jsx` – Global **solo** leaderboard by difficulty + level count.
- `src/components/`
  - `GameRoom.jsx` – Core gameplay UI for both solo and multiplayer.
  - `LobbyWaiting.jsx` – Pre‑game lobby.
  - `AdminPanel.jsx` – In‑room admin controls, configuration, player management, PDF export.
  - `Question.jsx` – Main puzzle UI (uses AI‑generated questions).
  - `MiniGameWrapper.jsx` + `components/minigames/*` – Mini‑games shown on selected levels.
  - `Leaderboard.jsx` – Solo/room leaderboard card list (now scrollable when many players).
  - `RoomLeaderboard.jsx` – Enhanced leaderboard layout for multiplayer views.
  - `Cinematic.jsx` – Between‑level cinematic video.
  - `DiagnosticPage.jsx` – Environment / media diagnostics.
  - `SoloLogin.jsx` – Google auth + solo display name flow.
  - `ui/OverlaysProvider.jsx` – Global overlays and confirmation dialogs.
- `src/services/`
  - `firebase.js` – Firebase app + Realtime Database setup.
  - `gameService.js` – Room/players, game lifecycle, question generation, mini‑game submissions.
  - `leaderboardService.js` – Solo global leaderboard (submit + fetch + name updates).
  - `authService.js` – Firebase Auth helpers (Google login, current user, sign out).
  - `onlineService.js` – Online player counter for the home page.
  - `gemini.js` – Integrates Google Generative AI for question generation.
- `src/hooks/`
  - `useGameState.js` – Subscribes to room state + remaining time.
  - `useAdminActivity.js` – Tracks admin activity / inactivity auto‑end logic.
  - `useAntiCheat.js`, `useTabVisibility.js` – Tab‑switch and anti‑cheat handling.
- `src/utils/`
  - `ranking.js` – Shared ranking logic for solo + multiplayer leaderboards.
  - `miniGameSelector.js` – Determines on which levels mini‑games appear.
  - `browserDetect.js`, `mediaTest.js` – iOS Safari/media tooling.
  - `notify.js`, `seededRandom.js`, `mediaTest.js`, etc.

Public assets:

- `public/videos/*` – Background, level, wrong‑answer, and final videos.
- `public/sounds/*` – Click, unlock/final, wrong sounds.
- `public/manifest.json`, `public/icon-512x512.png` – PWA manifest + icon.

---

## Firebase & Environment Configuration

This app **requires** a Firebase Realtime Database and (optionally) Firebase Auth.

- Configure Firebase credentials in `src/services/firebase.js` (or via environment variables if you’ve wired them).
- Set Realtime Database rules as described in `FIREBASE_SETUP.md` / `firebase-database-rules.json`:
  - The app writes under `rooms/`, `players/`, and `soloLeaderboards/`.
  - For development, you can temporarily use open rules as shown in `FIREBASE_SETUP.md` (not for production).
- Google Generative AI requires an API key; see `src/services/gemini.js` for how the key is read and injected.

For more deployment‑specific and Safari/media details, see:

- `IOS_SAFARI_FIX.md`
- `SAFARI_FIX_SUMMARY.md`
- `DEPLOYMENT_CHECKLIST.md`
- `TLS_ERROR_REAL_CAUSE.md`

---

## Running the Project

- **Install dependencies**

```bash
npm install
```

- **Development**

```bash
npm run dev
```

Then open the printed `localhost` URL in a modern browser (Chrome, Edge, Safari, or mobile).

- **Production build**

```bash
npm run build
npm run preview
```

---

## Core Flows (How the App Works)

- **Home (`/`)**
  - Shows **Solo Game**, **Join Game**, and **Create Multiplayer Game** options.
  - Displays a real‑time “Players Online” badge via `onlineService`.

- **Solo mode (`/solo`)**
  - Requires Google login and a solo display name (`SoloLogin`).
  - Player selects difficulty (Easy/Medium/Hard) and number of levels (5 or 10).
  - Creates a dedicated room (admin name starting with `"Solo-"`) and immediately starts the game.
  - Solo results are saved to the global leaderboard via `submitSoloResult`.

- **Multiplayer**
  - **Admin** creates a room on `/admin`, gets a short room code, and then configures:
    - Difficulty
    - Duration (minutes)
    - Total levels
  - **Players** join on `/join` using the code.
  - When all players are ready, the admin starts the game; `GamePage` orchestrates lobby → game → results.

- **Leaderboards**
  - **In‑room leaderboard** (solo + multiplayer) uses shared ranking logic in `ranking.js` and `gameService.getLeaderboard`.
  - **Global solo leaderboard** (`/leaderboard`) shows top 20 across:
    - Difficulty: Easy / Medium / Hard
    - Total levels: 5 or 10
  - Player rank is computed consistently whether they are in the top 20 or below.

---

## Notes About Scrolling & Layout

- The main layout uses `viewport-container` plus nested flex containers to avoid iOS Safari viewport glitches.
- **Leaderboards**:
  - `RoomLeaderboard` lives inside scrollable containers where needed.
  - `Leaderboard` (solo/global style) is **internally scrollable** when there are many entries (e.g. 8–9+ players), so long lists don’t overflow the screen.
- Global scroll is mostly disabled at the `html/body/#root` level; scrolling is done inside dedicated containers with `overflow-y-auto`.

---

## Known Requirements & Limits

- Designed for up to **5 concurrent players** per multiplayer room.
- Requires reliable network access to Firebase and Google Generative AI.
- Audio/video will obey the browser’s autoplay rules (especially on iOS Safari); the app includes defensive handling so it doesn’t crash if media can’t play.
