import { useState, useRef, useEffect } from "react";

export default function TrustMeVideo() {
  const [showVideo, setShowVideo] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Preload video in the background
  useEffect(() => {
    const vid = document.createElement("video");
    vid.src = "/video.mp4";
    vid.preload = "auto";
    vid.load();

    // Prevent page scroll
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const handleTrustClick = () => {
    setShowVideo(true);

    setTimeout(() => {
      if (videoRef.current) {
        videoRef.current.muted = false;
        videoRef.current
          .play()
          .catch((err) => console.error("Playback error:", err));
      }
    }, 150);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black overflow-hidden">
      {!showVideo && (
        <div className="absolute inset-0 flex items-center justify-center bg-black transition-opacity duration-1000">
          <button
            onClick={handleTrustClick}
            className="px-4 py-2 bg-pink-500 text-black font-bold text-[1.2rem] rounded-[0.7rem] hover:bg-purple-700 transition-colors duration-200"
          >
            Trust Zaryab
          </button>
        </div>
      )}

      {showVideo && (
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover"
          autoPlay
          loop
          playsInline
          preload="auto"
          src="/video.mp4"
        />
      )}
    </div>
  );
}
