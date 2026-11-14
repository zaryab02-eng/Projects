// Tap the avatar to VIEW the photo full screen (Change / Remove from
// there). With no photo yet, tapping opens the photo source sheet. The
// small camera badge always opens the source sheet directly.
import { useState } from "react";
import Avatar from "../ui/Avatar.jsx";
import Icon from "../ui/Icon.jsx";
import ImageSourceSheet from "../ui/ImageSourceSheet.jsx";
import ImageCropSheet from "../ui/ImageCropSheet.jsx";
import ImageViewer from "../ui/ImageViewer.jsx";

export default function AvatarPicker({
  member,
  size = 80,
  onChange, // (dataUrl | null) => void | Promise
  showLabel = false,
}) {
  const [sheetOpen, setSheetOpen] = useState(false);
  const [viewing, setViewing] = useState(false);
  const [file, setFile] = useState(null);
  const hasPhoto = Boolean(member?.photoUrl);

  const safeChange = async (value) => {
    try {
      await onChange(value);
    } catch (error) {
      console.warn("Could not update photo:", error);
      alert("Could not update the photo. Please try again.");
    }
  };

  const handleAvatarClick = () => {
    if (hasPhoto) setViewing(true);
    else setSheetOpen(true);
  };

  return (
    <div className="flex items-center gap-3">
      <div className="relative shrink-0">
        <button
          type="button"
          onClick={handleAvatarClick}
          aria-label={hasPhoto ? "View photo" : "Add photo"}
          className="block rounded-full active:scale-95 transition-transform"
        >
          <Avatar member={member} size={size} />
        </button>
        <button
          type="button"
          onClick={() => setSheetOpen(true)}
          aria-label="Change photo"
          className="absolute -bottom-0.5 -right-0.5 h-7 w-7 rounded-full bg-ink-700 border-2 border-ink-800 text-ink-100 flex items-center justify-center"
        >
          <Icon name="camera" size={14} />
        </button>
      </div>
      {showLabel && (
        <button
          type="button"
          onClick={() => setSheetOpen(true)}
          className="text-sm font-medium text-copper-400"
        >
          {hasPhoto ? "Change photo" : "Add photo (optional)"}
        </button>
      )}

      {viewing && hasPhoto && (
        <ImageViewer
          src={member.photoUrl}
          title={member.fullName || "Profile photo"}
          onClose={() => setViewing(false)}
          imgClassName="rounded-full object-cover"
          imgStyle={{
            width: "min(80vw, 340px)",
            height: "min(80vw, 340px)",
          }}
          actions={[
            {
              label: "Change photo",
              icon: "camera",
              onClick: () => {
                setViewing(false);
                setSheetOpen(true);
              },
            },
            {
              label: "Remove",
              icon: "trash",
              danger: true,
              onClick: () => {
                setViewing(false);
                safeChange(null);
              },
            },
          ]}
        />
      )}

      <ImageSourceSheet
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        title="Profile photo"
        camera="user"
        onFile={(f) => {
          setSheetOpen(false);
          setFile(f);
        }}
        onRemove={
          hasPhoto
            ? () => {
                setSheetOpen(false);
                safeChange(null);
              }
            : undefined
        }
      />

      {file && (
        <ImageCropSheet
          file={file}
          preset="avatar"
          onCancel={() => setFile(null)}
          onSave={async (url) => {
            await safeChange(url);
            setFile(null);
          }}
        />
      )}
    </div>
  );
}
