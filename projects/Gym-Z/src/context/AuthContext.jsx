// Provides the current Firebase user + the matching gym document (the
// gym's private workspace) to the whole app. Every protected page reads
// `gymId` from here to scope its Firestore queries to gyms/{gymId}/...
import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase/config.js";
import { getOwnerPrimaryGym } from '../firebase/firestore.js'

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [gym, setGym] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        try {
          const gymDoc = await getOwnerPrimaryGym(firebaseUser.uid);
          setGym(gymDoc);
        } catch (error) {
          console.warn("Unable to load gym data:", error);
          setGym(null);
        }
      } else {
        setGym(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const refreshGym = async () => {
    if (user) {
      try {
        setGym(await getOwnerPrimaryGym(user.uid))
      } catch (error) {
        console.warn("Unable to refresh gym data:", error);
      }
    }
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
