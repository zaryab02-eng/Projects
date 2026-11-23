import { useRef, useState } from "react";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  setDoc,
  writeBatch,
} from "firebase/firestore";
import { ImagePlus, ChevronLeft, ChevronRight } from "lucide-react";
import { db } from "../firebase";
import { uploadImage } from "../lib/upload";
import useCollection from "../lib/useCollection";
import { useSite } from "../lib/site";
import {
  Sheet,
  Field,
  ImagePicker,
  Spinner,
  friendlyError,
  useConfirm,
} from "./ui";

function PhotoForm({ item, items, onClose, notify }) {
  const { siteId } = useSite();
  const [confirmNode, ask] = useConfirm();
  const [title, setTitle] = useState(item.title || "");
  const [description, setDescription] = useState(item.description || "");
  const [file, setFile] = useState(null);
  const [busy, setBusy] = useState(false);
  const index = items.findIndex((x) => x.id === item.id);

  const save = async () => {
    setBusy(true);
    try {
      let src = item.src;
      if (file)
        src = await uploadImage(file, {
          maxSize: 1600,
          folder: `${siteId}/gallery`,
        });
      await setDoc(
        doc(db, "sites", siteId, "gallery", item.id),
        { src, title: title.trim(), description: description.trim() },
        { merge: true },
      );
      notify("Saved");
      onClose();
    } catch (e) {
      notify(friendlyError(e), "error");
      setBusy(false);
    }
  };

  const remove = async () => {
    const yes = await ask("Remove this photo from your website?", {
      yes: "Yes, remove it",
      no: "No, keep it",
    });
    if (!yes) return;
    setBusy(true);
    try {
      await deleteDoc(doc(db, "sites", siteId, "gallery", item.id));
      notify("Photo removed");
      onClose();
    } catch (e) {
      notify(friendlyError(e), "error");
      setBusy(false);
    }
  };

  // swap the order value with the neighbour
  const move = async (dir) => {
    const other = items[index + dir];
    if (!other) return;
    setBusy(true);
    try {
      const batch = writeBatch(db);
      batch.update(doc(db, "sites", siteId, "gallery", item.id), {
        order: other.order,
      });
      batch.update(doc(db, "sites", siteId, "gallery", other.id), {
        order: item.order,
      });
      await batch.commit();
      notify(dir < 0 ? "Moved earlier" : "Moved later");
      onClose();
    } catch (e) {
      notify(friendlyError(e), "error");
      setBusy(false);
    }
  };

  return (
    <>
      <Sheet
        title="Edit photo"
        onClose={busy ? () => {} : onClose}
        footer={
          <div className="flex gap-3">
            <button onClick={remove} disabled={busy} className="btn-danger">
              Delete
            </button>
            <button
              onClick={save}
              disabled={busy}
              className="btn-primary flex-1"
            >
              {busy ? <Spinner /> : "Save"}
            </button>
          </div>
        }
      >
        <div className="space-y-6">
          <ImagePicker
            url={item.src}
            file={file}
            onPick={setFile}
            onClear={() => setFile(null)}
            aspect="aspect-[4/3]"
            removable={Boolean(file)}
          />
          <Field
            label="Title"
            hint={`Shown large when someone opens the photo. ${title.length}/24`}
          >
            <input
              className="input"
              maxLength={24}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Our clinic visit"
            />
          </Field>
          <Field label="Caption (optional)" hint={`${description.length}/180`}>
            <textarea
              className="input"
              rows={3}
              maxLength={180}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </Field>
          <div>
            <p className="mb-2 text-base font-bold">Order on the website</p>
            <div className="flex gap-3">
              <button
                onClick={() => move(-1)}
                disabled={busy || index <= 0}
                className="btn-ghost flex-1"
              >
                <ChevronLeft className="h-5 w-5" /> Earlier
              </button>
              <button
                onClick={() => move(1)}
                disabled={busy || index >= items.length - 1}
                className="btn-ghost flex-1"
              >
                Later <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </Sheet>
      {confirmNode}
    </>
  );
}

export default function Gallery({ notify }) {
  const { siteId } = useSite();
  const { items, loading, error } = useCollection("gallery");
  const [editing, setEditing] = useState(null);
  const [progress, setProgress] = useState(null);
  const input = useRef(null);

  const addPhotos = async (files) => {
    const list = Array.from(files);
    if (!list.length) return;
    let done = 0;
    for (let i = 0; i < list.length; i++) {
      setProgress(`Uploading ${i + 1} of ${list.length}…`);
      try {
        const src = await uploadImage(list[i], {
          maxSize: 1600,
          folder: `${siteId}/gallery`,
        });
        await addDoc(collection(db, "sites", siteId, "gallery"), {
          src,
          title: "",
          description: "",
          order: Date.now() + i,
        });
        done++;
      } catch (e) {
        notify(friendlyError(e), "error");
        break;
      }
    }
    setProgress(null);
    if (done) notify(done === 1 ? "Photo added" : `${done} photos added`);
  };

  return (
    <div className="px-4 pb-40 pt-4">
      <input
        ref={input}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => {
          addPhotos(e.target.files);
          e.target.value = "";
        }}
      />

      {items.length > 0 && (
        <p className="text-base text-ink/70">
          Tap a photo to give it a title or remove it.
        </p>
      )}
      {!loading && items.length > 0 && items.length < 8 && (
        <p className="mt-3 rounded-2xl bg-mist p-4 text-base text-ink/80">
          Tip: your website gallery looks best with 8 or more photos.
        </p>
      )}
      {error && (
        <p className="mt-4 rounded-2xl bg-[#b4141a] p-4 text-base font-semibold text-white">
          {friendlyError(error)}
        </p>
      )}
      {loading && (
        <div className="mt-16 flex justify-center text-brand-dark">
          <Spinner className="h-8 w-8" />
        </div>
      )}

      {!loading && items.length === 0 && !error && (
        <div className="mt-10 rounded-3xl border-2 border-dashed border-ink/25 bg-white p-8 text-center">
          <h3 className="text-2xl">No photos yet</h3>
          <p className="mx-auto mt-2 max-w-xs text-base text-ink/70">
            Tap <b>Add photos</b> below. They will appear in your website
            gallery.
          </p>
        </div>
      )}

      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
        {items.map((g) => (
          <button
            key={g.id}
            onClick={() => setEditing(g)}
            className="relative aspect-square overflow-hidden rounded-2xl bg-mist text-left"
          >
            <img
              src={g.src}
              alt={g.title || "Gallery photo"}
              loading="lazy"
              className="h-full w-full object-contain"
            />
            <span className="absolute inset-x-0 bottom-0 truncate bg-gradient-to-t from-ink/85 to-transparent px-3 pb-2 pt-8 text-sm font-bold text-white">
              {g.title || "No title"}
            </span>
          </button>
        ))}
      </div>

      <button
        onClick={() => input.current?.click()}
        disabled={Boolean(progress)}
        className="fixed bottom-28 left-1/2 z-30 flex h-16 -translate-x-1/2 items-center gap-2 whitespace-nowrap rounded-full bg-brand-dark px-8 text-lg font-bold text-white shadow-xl transition active:scale-95 disabled:opacity-90"
        style={{ marginBottom: "env(safe-area-inset-bottom)" }}
      >
        {progress ? (
          <>
            <Spinner /> {progress}
          </>
        ) : (
          <>
            <ImagePlus className="h-6 w-6" /> Add photos
          </>
        )}
      </button>

      {editing && (
        <PhotoForm
          key={editing.id}
          item={editing}
          items={items}
          onClose={() => setEditing(null)}
          notify={notify}
        />
      )}
    </div>
  );
}
