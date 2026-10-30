export default function Spinner({ size = "md" }) {
  const sizes = {
    sm: "h-4 w-4 border-2",
    md: "h-7 w-7 border-2",
    lg: "h-9 w-9 border-[3px]",
  };
  return (
    <div
      className={`${sizes[size]} border-ink-600 border-t-copper-500 rounded-full animate-spin`}
    />
  );
}
