import { useState } from "react";
import { signOut } from "firebase/auth";
import { doc, writeBatch, collection, getDocs } from "firebase/firestore";
import {
  Download,
  ExternalLink,
  LogOut,
  DatabaseZap,
  Smartphone,
  Share,
  Tags,
  Globe,
} from "lucide-react";
import { auth, db, siteUrl, cloudinaryReady } from "../firebase";
import {
  products as sampleProducts,
  categories as defaultCategories,
} from "../data/products";
import { useSite } from "../lib/site";
import Categories from "./Categories";
import useInstall from "../lib/useInstall";
import { Spinner, friendlyError } from "./ui";

function Row({ icon: Icon, title, text, children }) {
  return (
    <div className="rounded-2xl border border-ink/10 bg-white p-5">
      <div className="flex items-start gap-4">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-mist text-brand-dark">
          <Icon className="h-5 w-5" />
        </span>
        <div className="min-w-0 flex-1">
          <h3 className="text-xl">{title}</h3>
          {text && (
            <p className="mt-1 text-sm leading-relaxed text-ink/60">{text}</p>
          )}
          {children && <div className="mt-4">{children}</div>}
        </div>
      </div>
    </div>
  );
}

export default function Settings({ user, notify }) {
  const { canInstall, install, installed, isIOS } = useInstall();
  const { siteId, siteName, hasCustomCategories } = useSite();
  const [seeding, setSeeding] = useState(false);
  const [editCats, setEditCats] = useState(false);

  const seed = async () => {
    const snap = await getDocs(collection(db, "sites", siteId, "products"));
    if (
      snap.size > 0 &&
      !window.confirm(
        "You already have products. Loading the samples will ADD them to your list. Continue?",
      )
    )
      return;
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
      notify("Sample products loaded. You can now edit them.");
    } catch (e) {
      notify(friendlyError(e), "error");
    }
    setSeeding(false);
  };

  return (
    <div className="space-y-4 px-4 pb-32 pt-4">
      <Row
        icon={Globe}
        title={siteName}
        text={`You are managing this website. (site id: ${siteId})`}
      />

      <Row
        icon={Tags}
        title="Categories"
        text="Add, rename, reorder or remove the product categories shown on the website."
      >
        <button onClick={() => setEditCats(true)} className="btn-ghost">
          Edit categories
        </button>
      </Row>

      <Row
        icon={Smartphone}
        title="Install this app"
        text={
          installed ? "Website Admin is installed on this phone." : undefined
        }
      >
        {!installed && canInstall && (
          <button onClick={install} className="btn-primary">
            <Download className="h-4 w-4" /> Install app
          </button>
        )}
        {!installed && !canInstall && isIOS && (
          <p className="flex flex-wrap items-center gap-1 text-sm text-ink/70">
            On iPhone: tap <Share className="mx-1 inline h-4 w-4" /> Share in
            Safari, then <b>Add to Home Screen</b>.
          </p>
        )}
        {!installed && !canInstall && !isIOS && (
          <p className="text-sm text-ink/70">
            In Chrome, open the ⋮ menu and tap <b>Install app</b> (or{" "}
            <b>Add to Home screen</b>).
          </p>
        )}
      </Row>

      {siteUrl && (
        <Row
          icon={ExternalLink}
          title="View website"
          text="See how your changes look to visitors."
        >
          <a
            href={siteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-ghost"
          >
            Open website
          </a>
        </Row>
      )}

      <Row
        icon={DatabaseZap}
        title="Load sample products"
        text="Adds the 18 Natusz sample products (and their categories) so you can edit or delete them instead of starting from nothing."
      >
        <button onClick={seed} disabled={seeding} className="btn-ghost">
          {seeding ? <Spinner /> : "Load samples"}
        </button>
      </Row>

      {!cloudinaryReady && (
        <p className="rounded-2xl bg-rose/10 p-4 text-sm text-rose">
          Photo uploads are not set up yet. Add the Cloudinary values to the
          .env file (see README).
        </p>
      )}

      <Row icon={LogOut} title="Signed in" text={user.email}>
        <button onClick={() => signOut(auth)} className="btn-danger">
          Sign out
        </button>
      </Row>

      {editCats && (
        <Categories onClose={() => setEditCats(false)} notify={notify} />
      )}
    </div>
  );
}
