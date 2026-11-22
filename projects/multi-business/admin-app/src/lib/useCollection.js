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
      }
    );
    return stop;
  }, [siteId, name]);

  return { items, loading, error };
}
