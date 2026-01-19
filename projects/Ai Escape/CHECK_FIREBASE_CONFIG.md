# ⚠️ CRITICAL: Check Firebase Configuration

## The TLS Error is Likely a Firebase Connection Issue!

The "TLS error" on iOS Safari is usually caused by **Firebase failing to connect** due to missing or incorrect environment variables.

---

## ✅ Step 1: Verify Your .env File

Open `.env` in your project root and ensure ALL these variables are set:

```bash
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef
VITE_FIREBASE_DATABASE_URL=https://your_project.firebaseio.com
```

### ⚠️ CRITICAL: All variables must start with `VITE_`

Vite only exposes environment variables that start with `VITE_` to the client.

---

## ✅ Step 2: Check if Variables are Actually Set

Run this in your terminal from the project root:

```bash
npm run dev
```

Then open the browser console and check for these messages:

### ✅ Good (Firebase working):
```
✅ Firebase initialized successfully
```

### ❌ Bad (Firebase not working):
```
❌ Firebase configuration incomplete. Check environment variables:
Missing: {
  apiKey: "VITE_FIREBASE_API_KEY",
  projectId: "VITE_FIREBASE_PROJECT_ID",
  databaseURL: "VITE_FIREBASE_DATABASE_URL"
}
```

---

## ✅ Step 3: Verify on Vercel (Production)

If it works locally but fails on Vercel:

1. Go to Vercel Dashboard
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Add ALL Firebase variables:
   - `VITE_FIREBASE_API_KEY`
   - `VITE_FIREBASE_AUTH_DOMAIN`
   - `VITE_FIREBASE_PROJECT_ID`
   - `VITE_FIREBASE_STORAGE_BUCKET`
   - `VITE_FIREBASE_MESSAGING_SENDER_ID`
   - `VITE_FIREBASE_APP_ID`
   - `VITE_FIREBASE_DATABASE_URL`

5. **CRITICAL**: Redeploy after adding variables!

---

## ✅ Step 4: Get Firebase Credentials

If you don't have Firebase credentials:

### Option A: Use Existing Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Click gear icon → Project Settings
4. Scroll to "Your apps" section
5. If no web app exists, click "Add app" → Web (</>) icon
6. Register app
7. Copy the `firebaseConfig` object
8. Add each value to your `.env` file with `VITE_` prefix

### Option B: Create New Firebase Project
Follow the guide in `FIREBASE_SETUP.md`

---

## ✅ Step 5: Test Firebase Connection

After setting environment variables:

1. **Restart dev server** (if running):
   ```bash
   # Press Ctrl+C to stop
   npm run dev
   ```

2. **Build and test**:
   ```bash
   npm run build
   npm run preview
   ```

3. **Open browser console** and check for:
   - ✅ "Firebase initialized successfully"
   - ❌ No "Firebase configuration incomplete" errors

4. **Try creating a game** and see if it works

---

## 🔍 Common Issues

### Issue 1: "Firebase configuration incomplete"
**Cause**: Missing or incorrect environment variables

**Fix**:
1. Check `.env` file exists in project root
2. All variables start with `VITE_`
3. No spaces around `=` sign
4. No quotes around values (unless value contains spaces)
5. Restart dev server after changing `.env`

### Issue 2: Works locally but fails on Vercel
**Cause**: Environment variables not set on Vercel

**Fix**:
1. Add ALL variables to Vercel Dashboard → Settings → Environment Variables
2. **MUST REDEPLOY** after adding variables
3. Variables are only loaded during build, not after deployment

### Issue 3: "TLS error" on iOS Safari
**Cause**: Firebase connection failing due to missing/incorrect config

**Fix**:
1. Verify all environment variables are set correctly
2. Check Firebase project settings in Firebase Console
3. Ensure `databaseURL` points to correct region
4. Verify Firebase Realtime Database is enabled

### Issue 4: App shows alert about missing configuration
**Cause**: This is the NEW error handling I added - it means Firebase config is incomplete

**Fix**: This is GOOD! It's telling you exactly what's missing instead of showing cryptic TLS error

---

## 📋 Quick Checklist

- [ ] `.env` file exists in project root (NOT in `src/`)
- [ ] ALL 7 Firebase variables are set in `.env`
- [ ] ALL variables start with `VITE_` prefix
- [ ] No typos in variable names
- [ ] Restarted dev server after changing `.env`
- [ ] For Vercel: Added variables to Vercel Dashboard
- [ ] For Vercel: Redeployed after adding variables
- [ ] Browser console shows "✅ Firebase initialized successfully"
- [ ] No alerts about missing configuration

---

## 🧪 Test Your Configuration

Run this in browser console after app loads:

```javascript
// Check if Firebase is initialized
console.log('Firebase app name:', window.firebase?.app()?.name || 'Not initialized');

// Check if environment variables are exposed (should be undefined for security)
console.log('API Key exposed?:', import.meta.env.VITE_FIREBASE_API_KEY ? 'YES (configured)' : 'NO (missing)');
```

---

## 🆘 Still Getting TLS Error?

If you've verified ALL the above and still get TLS error:

### On iOS Safari specifically:

1. **Clear Safari cache**:
   - Settings → Safari → Clear History and Website Data

2. **Check Firebase Realtime Database rules**:
   - Go to Firebase Console → Realtime Database → Rules
   - Ensure they're not too restrictive
   - Test rules (in Firebase Console):
     ```json
     {
       "rules": {
         ".read": true,
         ".write": true
       }
     }
     ```
   - ⚠️ For testing only! Don't use in production!

3. **Check Firebase project region**:
   - Some regions might have connectivity issues
   - Try creating database in `us-central1`

4. **Disable Safari extensions** that might block requests

5. **Try on different network** (WiFi vs cellular)

---

## 📧 Need Help?

If still not working, check browser console for errors and look for:

- "Firebase configuration incomplete" → Missing env variables
- "Firebase initialization failed" → Wrong credentials or network issue
- "Unable to connect to game servers" → Firebase service down or network blocked
- Alert popup on load → Configuration error (this is intentional - better than TLS error!)

---

## ✅ Expected Behavior After Fix

1. **Local development**:
   - `npm run dev` starts without errors
   - Browser console shows "✅ Firebase initialized successfully"
   - Can create games and join rooms
   - No TLS errors on any browser

2. **Production (Vercel)**:
   - App loads without errors
   - No alert popups
   - Can create and join games
   - Works on iOS Safari

---

**Created**: 2026-01-19  
**Purpose**: Diagnose Firebase configuration issues causing TLS errors  
**Status**: Ready to test
