// Provides the current Firebase user + the matching gym document (the
// gym's private workspace) to the whole app. Every protected page reads
// `gymId` from here to scope its Firestore queries to gyms/{gymId}/...
//
// OFFLINE: the gym document is also saved in localStorage. If the gym
// can't be loaded (no internet, cache miss), the saved copy is used so
// the owner is never wrongly sent to "Create Gym" while offline.
import { createContext, useContext, useEffect, useState } from "react";
import { getRedirectResult, onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase/config.js";
import { getOwnerPrimaryGym } from "../firebase/firestore.js";

const GYM_CACHE_KEY = "gymz:gym";

function readCachedGym(uid) {
  try {
    const raw = localStorage.getItem(GYM_CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed?.uid === uid ? parsed.gym : null;
  } catch {
    return null;
  }
}

function writeCachedGym(uid, gym) {
  try {
    if (gym) {
      localStorage.setItem(GYM_CACHE_KEY, JSON.stringify({ uid, gym }));
    } else {
      localStorage.removeItem(GYM_CACHE_KEY);
    }
  } catch {
    // Storage unavailable — offline fallback simply won't be available.
  }
}

async function loadGym(uid) {
  const cached = readCachedGym(uid);
  if (
    typeof navigator !== "undefined" &&
    navigator.onLine === false &&
    cached
  ) {
    return cached;
  }
  try {
    const gym = await getOwnerPrimaryGym(uid);
    writeCachedGym(uid, gym);
    return gym;
  } catch (error) {
    if (cached) return cached;
    throw error;
  }
}

function getSafeAuthState() {
  if (!auth) {
    return { user: null, loading: false };
  }
  return null;
}

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [gym, setGym] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const safeAuth = getSafeAuthState();
    if (safeAuth) {
      setUser(null);
      setGym(null);
      setLoading(false);
      return;
    }

    let isMounted = true;
    let unsubscribe = null;

    const finalizeAuth = async (firebaseUser) => {
      if (!isMounted) return;

      setUser(firebaseUser);
      if (firebaseUser) {
        try {
          const gymDoc = await loadGym(firebaseUser.uid);
          if (isMounted) {
            setGym(gymDoc);
          }
        } catch (error) {
          console.warn("Unable to load gym data:", error);
          if (isMounted) {
            setGym(null);
          }
        }
      } else {
        if (isMounted) {
          setGym(null);
        }
      }

      if (isMounted) {
        setLoading(false);
      }
    };

    const initializeAuth = async () => {
      try {
        const redirectResult = await getRedirectResult(auth);
        const redirectUser = redirectResult?.user ?? null;
        if (redirectUser) {
          await finalizeAuth(redirectUser);
          return;
        }
      } catch (error) {
        console.warn("Google redirect sign-in failed:", error);
      }

      unsubscribe = onAuthStateChanged(auth, finalizeAuth);
    };

    initializeAuth();

    return () => {
      isMounted = false;
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  const refreshGym = async () => {
    if (user) {
      try {
        const gymDoc = await loadGym(user.uid);
        setGym(gymDoc);
        return gymDoc;
      } catch (error) {
        console.warn("Unable to refresh gym data:", error);
        setGym(null);
        return null;
      }
    }
    setGym(null);
    return null;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        gym,
        gymId: gym?.id || null,
        loading,
        refreshGym,
        setGym,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
