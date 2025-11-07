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

    // slight delay to ensure element is rendered
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
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-purple-900 via-black to-blue-900 transition-opacity duration-1000">
          <button
            onClick={handleTrustClick}
            className="group relative px-12 py-6 text-2xl font-bold text-white transition-all duration-300 hover:scale-110"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 rounded-full blur-xl opacity-75 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative bg-black rounded-full px-12 py-4 border-2 border-purple-500 group-hover:border-pink-500 transition-colors">
              Trust Me
            </div>
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
