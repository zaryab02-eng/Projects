import { useState, useRef } from "react";

export default function TrustMeVideo() {
  const [showVideo, setShowVideo] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const handleTrustClick = () => {
    setShowVideo(true);
    // Delay play slightly to ensure video element is mounted
    setTimeout(() => {
      if (videoRef.current) {
        videoRef.current.muted = false; // unmute
        videoRef.current.play().catch((err) => {
          console.error("Autoplay blocked:", err);
        });
      }
    }, 200);
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black">
      {/* Button Screen */}
      {!showVideo && (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-purple-900 via-black to-blue-900 transition-opacity duration-1000">
          <button
            onClick={handleTrustClick}
            className="group relative px-12 py-6 text-2xl font-bold text-white transition-all duration-300 hover:scale-110"
            aria-label="Trust me and reveal video"
          >
            {/* Glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 rounded-full blur-xl opacity-75 group-hover:opacity-100 transition-opacity"></div>

            {/* Button */}
            <div className="relative bg-black rounded-full px-12 py-4 border-2 border-purple-500 group-hover:border-pink-500 transition-colors">
              Trust Zaryab!
            </div>
          </button>
        </div>
      )}

      {/* Video Screen */}
      {showVideo && (
        <div className="absolute inset-0 flex items-center justify-center">
          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            autoPlay
            loop
            playsInline
            controls
            src="/video.mp4" // use public folder path for simplicity
          >
            Your browser does not support the video tag.
          </video>
        </div>
      )}
    </div>
  );
}
