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
  s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

function Gate({ title, text, spinner }) {
  return (
    <div className="flex min-h-full flex-col items-center justify-center bg-ink p-8 text-center text-paper">
      {spinner ? (
        <Spinner className="h-8 w-8 text-brand" />
      ) : (
        <>
          <h1 className="text-3xl">{title}</h1>
          <p className="mt-3 max-w-sm text-paper/70">{text}</p>
          <button onClick={() => signOut(auth)} className="btn-rose mt-8">Sign out</button>
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
          }
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
    return <Gate title="Account not linked" text="This login is not connected to a website yet. Please contact the person who set up your website." />;
  if (status === "error")
    return <Gate title="Could not load" text="Please check your internet connection and the Firestore rules, then sign in again." />;
  return <SiteContext.Provider value={value}>{children}</SiteContext.Provider>;
}
