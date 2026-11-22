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
import { Sheet, Field, ImagePicker, Spinner, friendlyError } from "./ui";

function PhotoForm({ item, items, onClose, notify }) {
  const { siteId } = useSite();
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
    if (!window.confirm("Remove this photo from the gallery?")) return;
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
    <Sheet
      title="Edit photo"
      onClose={busy ? () => {} : onClose}
      footer={
        <div className="flex gap-3">
          <button onClick={remove} disabled={busy} className="btn-danger">
            Delete
          </button>
          <button onClick={save} disabled={busy} className="btn-primary flex-1">
            {busy ? <Spinner /> : "Save changes"}
          </button>
        </div>
      }
    >
      <div className="space-y-5">
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
          hint={`Shown large when someone opens the photo. Keep it short. ${title.length}/24`}
        >
          <input
            className="input"
            maxLength={24}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Our clinic visit"
          />
        </Field>
        <Field label="Caption" hint={`${description.length}/180`}>
          <textarea
            className="input"
            rows={3}
            maxLength={180}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </Field>
        <div className="flex gap-3">
          <button
            onClick={() => move(-1)}
            disabled={busy || index <= 0}
            className="btn-ghost flex-1"
          >
            <ChevronLeft className="h-4 w-4" /> Earlier
          </button>
          <button
            onClick={() => move(1)}
            disabled={busy || index >= items.length - 1}
            className="btn-ghost flex-1"
          >
            Later <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </Sheet>
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
    if (done)
      notify(
        done === 1
          ? "Photo added to the gallery"
          : `${done} photos added to the gallery`,
      );
  };

  return (
    <div className="px-4 pb-32 pt-4">
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

      <p className="text-sm text-ink/60">
        {items.length} photo{items.length === 1 ? "" : "s"}. Tap a photo to add
        a title or caption.
      </p>
      {!loading && items.length > 0 && items.length < 8 && (
        <p className="mt-3 rounded-xl bg-mist p-3 text-sm text-ink/70">
          Tip: the website gallery looks best with 8 or more different photos.
        </p>
      )}
      {error && (
        <p className="mt-4 rounded-xl bg-rose/10 p-4 text-sm text-rose">
          {friendlyError(error)}
        </p>
      )}
      {loading && (
        <div className="mt-16 flex justify-center text-brand">
          <Spinner className="h-7 w-7" />
        </div>
      )}

      {!loading && items.length === 0 && !error && (
        <div className="mt-10 rounded-3xl border border-dashed border-ink/20 bg-white p-8 text-center">
          <h3 className="text-2xl">No photos yet</h3>
          <p className="mx-auto mt-2 max-w-xs text-sm text-ink/60">
            Add photos and they will replace the sample pictures in the website
            gallery.
          </p>
        </div>
      )}

      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
        {items.map((g) => (
          <button
            key={g.id}
            onClick={() => setEditing(g)}
            className="group relative aspect-square overflow-hidden rounded-2xl bg-mist text-left"
          >
            <img
              src={g.src}
              alt={g.title || "Gallery photo"}
              loading="lazy"
              className="h-full w-full object-contain"
            />
            <span className="absolute inset-x-0 bottom-0 truncate bg-gradient-to-t from-ink/80 to-transparent px-3 pb-2 pt-6 text-xs font-semibold text-white">
              {g.title || "No title"}
            </span>
          </button>
        ))}
      </div>

      <button
        onClick={() => input.current?.click()}
        disabled={Boolean(progress)}
        className="fixed bottom-24 right-5 z-30 flex h-14 items-center gap-2 rounded-full bg-rose px-6 text-sm font-semibold text-white shadow-xl transition active:scale-95 disabled:opacity-80"
        style={{ marginBottom: "env(safe-area-inset-bottom)" }}
      >
        {progress ? (
          <>
            <Spinner /> {progress}
          </>
        ) : (
          <>
            <ImagePlus className="h-5 w-5" /> Add photos
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
