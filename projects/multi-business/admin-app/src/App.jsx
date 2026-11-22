import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { Package, Images, Settings as Cog } from "lucide-react";
import { auth, firebaseReady } from "./firebase";
import Login from "./components/Login";
import Products from "./components/Products";
import Gallery from "./components/Gallery";
import Settings from "./components/Settings";
import { Spinner, useToast } from "./components/ui";
import { SiteProvider, useSite } from "./lib/site";

const tabs = [
  { id: "products", label: "Products", Icon: Package },
  { id: "gallery", label: "Gallery", Icon: Images },
  { id: "settings", label: "Settings", Icon: Cog },
];

function SetupNeeded() {
  return (
    <div className="flex min-h-full flex-col justify-center bg-ink p-8 text-paper">
      <h1 className="text-3xl">Almost there</h1>
      <p className="mt-3 text-paper/70">
        The Firebase details are missing. Copy <code className="rounded bg-white/10 px-1.5">.env.example</code> to{" "}
        <code className="rounded bg-white/10 px-1.5">.env</code>, fill in the values (README, section 1), then restart <code className="rounded bg-white/10 px-1.5">npm run dev</code>.
      </p>
    </div>
  );
}

function Shell({ user }) {
  const { siteName } = useSite();
  const [tab, setTab] = useState("products");
  const [toastNode, notify] = useToast();
  const title = tabs.find((t) => t.id === tab).label;

  return (
    <div className="flex h-full flex-col">
      <header className="safe-top bg-ink text-paper">
        <div className="flex h-16 items-center justify-between gap-3 px-5">
          <h1 className="text-2xl">{title}</h1>
          <span className="max-w-[55%] truncate rounded-full bg-white/10 px-3 py-1 text-xs font-semibold">{siteName}</span>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto">
        {tab === "products" && <Products notify={notify} />}
        {tab === "gallery" && <Gallery notify={notify} />}
        {tab === "settings" && <Settings user={user} notify={notify} />}
      </main>

      <nav className="safe-bottom z-40 border-t border-ink/10 bg-paper/95 backdrop-blur" aria-label="Sections">
        <ul className="grid grid-cols-3">
          {tabs.map(({ id, label, Icon }) => (
            <li key={id}>
              <button
                onClick={() => setTab(id)}
                aria-current={tab === id ? "page" : undefined}
                className={`flex w-full flex-col items-center gap-1 py-3 text-xs font-semibold transition ${tab === id ? "text-brand-dark" : "text-ink/45"}`}
              >
                <Icon className="h-6 w-6" strokeWidth={tab === id ? 2.2 : 1.7} />
                {label}
              </button>
            </li>
          ))}
        </ul>
      </nav>
      {toastNode}
    </div>
  );
}

export default function App() {
  const [user, setUser] = useState(undefined); // undefined = still checking

  useEffect(() => {
    if (!firebaseReady) return;
    return onAuthStateChanged(auth, (u) => setUser(u));
  }, []);

  if (!firebaseReady) return <SetupNeeded />;
  if (user === undefined) {
    return (
      <div className="flex h-full items-center justify-center bg-ink text-brand">
        <Spinner className="h-8 w-8" />
      </div>
    );
  }
  if (!user) return <Login />;

  return (
    <SiteProvider key={user.uid} user={user}>
      <Shell user={user} />
    </SiteProvider>
  );
}
