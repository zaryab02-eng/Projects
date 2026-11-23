import { useState } from "react";
import { signOut } from "firebase/auth";
import { doc, writeBatch, collection, getDocs } from "firebase/firestore";
import {
  ChevronDown,
  ChevronRight,
  Download,
  ExternalLink,
  Share,
  Tags,
} from "lucide-react";
import { auth, db, siteUrl, cloudinaryReady } from "../firebase";
import {
  products as sampleProducts,
  categories as defaultCategories,
} from "../data/products";
import { useSite } from "../lib/site";
import Categories from "./Categories";
import useInstall from "../lib/useInstall";
import { Spinner, friendlyError, useConfirm } from "./ui";

const rowClass =
  "flex w-full items-center gap-4 rounded-2xl border-2 border-ink/10 bg-white p-4 text-left text-lg font-bold";

export default function Settings({ user, notify }) {
  const { canInstall, install, installed, isIOS } = useInstall();
  const { siteId, siteName, hasCustomCategories } = useSite();
  const [confirmNode, ask] = useConfirm();
  const [seeding, setSeeding] = useState(false);
  const [editCats, setEditCats] = useState(false);
  const [more, setMore] = useState(false);

  const seed = async () => {
    const snap = await getDocs(collection(db, "sites", siteId, "products"));
    if (snap.size > 0) {
      const yes = await ask(
        "You already have products. Loading the samples will ADD them to your list. Continue?",
        { yes: "Yes, add samples", no: "Cancel", danger: false },
      );
      if (!yes) return;
    }
    setSeeding(true);
    try {
      const batch = writeBatch(db);
      const base = Date.now();
      if (!hasCustomCategories)
        batch.set(
          doc(db, "sites", siteId),
          { categories: defaultCategories },
          { merge: true },
        );
      sampleProducts.forEach((p, i) => {
        batch.set(doc(db, "sites", siteId, "products", p.id), {
          ...p,
          visible: true,
          image: "",
          order: base + i,
        });
      });
      await batch.commit();
      notify("Sample products loaded");
    } catch (e) {
      notify(friendlyError(e), "error");
    }
    setSeeding(false);
  };

  return (
    <div className="space-y-4 px-4 pb-32 pt-4">
      <div className="rounded-2xl bg-mist p-5">
        <p className="text-sm font-bold text-ink/70">Your website</p>
        <p className="mt-1 text-2xl font-bold">{siteName}</p>
      </div>

      <button onClick={() => setEditCats(true)} className={rowClass}>
        <Tags className="h-6 w-6 shrink-0 text-brand-dark" />
        <span className="flex-1">Product categories</span>
        <ChevronRight className="h-6 w-6 text-ink/50" />
      </button>

      {siteUrl && (
        <a
          href={siteUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={rowClass}
        >
          <ExternalLink className="h-6 w-6 shrink-0 text-brand-dark" />
          <span className="flex-1">See my website</span>
          <ChevronRight className="h-6 w-6 text-ink/50" />
        </a>
      )}

      {!cloudinaryReady && (
        <p className="rounded-2xl bg-[#b4141a] p-4 text-base font-semibold text-white">
          Photo uploads are not set up yet. Please contact the person who made
          your website.
        </p>
      )}

      <div className="rounded-2xl border-2 border-ink/10 bg-white p-5">
        <p className="text-sm font-bold text-ink/70">Signed in as</p>
        <p className="mt-1 break-all text-lg font-bold">{user.email}</p>
        <button
          onClick={() => signOut(auth)}
          className="btn-danger mt-4 w-full"
        >
          Sign out
        </button>
      </div>

      {/* Rarely needed things are tucked away here */}
      <div>
        <button
          onClick={() => setMore((m) => !m)}
          aria-expanded={more}
          className="flex w-full items-center justify-between px-2 py-3 text-base font-bold text-ink/70"
        >
          More options
          <ChevronDown
            className={`h-6 w-6 transition ${more ? "rotate-180" : ""}`}
          />
        </button>

        {more && (
          <div className="space-y-4">
            <div className="rounded-2xl border-2 border-ink/10 bg-white p-5">
              <h3 className="text-lg">Put this app on your phone</h3>
              {installed && (
                <p className="mt-2 text-base text-ink/70">
                  It is already installed on this phone.
                </p>
              )}
              {!installed && canInstall && (
                <button onClick={install} className="btn-primary mt-3 w-full">
                  <Download className="h-5 w-5" /> Install app
                </button>
              )}
              {!installed && !canInstall && isIOS && (
                <p className="mt-2 text-base text-ink/70">
                  On iPhone: tap <Share className="mx-1 inline h-5 w-5" /> Share
                  in Safari, then <b>Add to Home Screen</b>.
                </p>
              )}
              {!installed && !canInstall && !isIOS && (
                <p className="mt-2 text-base text-ink/70">
                  In Chrome, open the ⋮ menu and tap <b>Install app</b> (or{" "}
                  <b>Add to Home screen</b>).
                </p>
              )}
            </div>

            <div className="rounded-2xl border-2 border-ink/10 bg-white p-5">
              <h3 className="text-lg">Add sample products</h3>
              <p className="mt-2 text-base text-ink/70">
                Adds a ready-made list of sample products that you can edit or
                delete.
              </p>
              <button
                onClick={seed}
                disabled={seeding}
                className="btn-ghost mt-3 w-full"
              >
                {seeding ? <Spinner /> : "Add samples"}
              </button>
            </div>
          </div>
        )}
      </div>

      {editCats && (
        <Categories onClose={() => setEditCats(false)} notify={notify} />
      )}
      {confirmNode}
    </div>
  );
}
