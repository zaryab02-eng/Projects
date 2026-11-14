// One place for the photo-or-initial logic.
export default function Avatar({
  member,
  size = 44,
  className = "",
  fallbackClassName = "bg-gradient-to-br from-copper-400 to-copper-600 text-white",
  fallbackStyle,
}) {
  const initial = member?.fullName?.trim()?.[0]?.toUpperCase() || "?";
  const box = { width: size, height: size };

  if (member?.photoUrl) {
    return (
      <img
        src={member.photoUrl}
        alt=""
        draggable={false}
        style={box}
        className={`rounded-full object-cover shrink-0 bg-ink-700 ${className}`}
      />
    );
  }

  return (
    <div
      style={{ ...box, fontSize: Math.round(size * 0.4), ...fallbackStyle }}
      className={`rounded-full flex items-center justify-center font-semibold shrink-0 ${fallbackClassName} ${className}`}
    >
      {initial}
    </div>
  );
}
