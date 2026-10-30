// Thin status strip: shows when the device is offline (changes are saved
// locally) and briefly confirms when everything has synced after reconnect.
import { useEffect, useState } from "react";
import { waitForPendingWrites } from "firebase/firestore";
import { db } from "../../firebase/config.js";

export default function OfflineBanner() {
  const [online, setOnline] = useState(
    typeof navigator === "undefined" ? true : navigator.onLine,
  );
  const [syncState, setSyncState] = useState("idle"); // idle | syncing | done

  useEffect(() => {
    let doneTimer;

    const handleOffline = () => {
      setOnline(false);
      setSyncState("idle");
    };

    const handleOnline = async () => {
      setOnline(true);
      if (!db) return;
      setSyncState("syncing");
      try {
        await waitForPendingWrites(db);
        setSyncState("done");
        doneTimer = setTimeout(() => setSyncState("idle"), 3000);
      } catch {
        setSyncState("idle");
      }
    };

    window.addEventListener("offline", handleOffline);
    window.addEventListener("online", handleOnline);
    return () => {
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("online", handleOnline);
      clearTimeout(doneTimer);
    };
  }, []);

  if (online && syncState === "idle") return null;

  let text;
  let tone = "bg-copper-500/15 text-copper-400";
  if (!online) {
    text =
      "You're offline — changes are saved on this device and will sync when you're back online.";
  } else if (syncState === "syncing") {
    text = "Back online — syncing your changes...";
  } else {
    text = "All changes synced.";
    tone = "bg-vitality-good/15 text-vitality-good";
  }

  return (
    <div
      role="status"
      className={`text-center text-xs font-medium px-4 py-2 ${tone}`}
    >
      {text}
    </div>
  );
}
