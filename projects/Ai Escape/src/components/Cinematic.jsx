import { useState, useEffect, useRef } from "react";

/**
 * Cinematic component - plays after each level completion
 * Shows full-screen video with player name overlay
 */
export default function Cinematic({ levelNumber, playerName, onComplete }) {
  const [canSkip, setCanSkip] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);
  const videoRef = useRef(null);

  // 🔧 CHANGE LEVEL COMPLETION VIDEO HERE
  // Videos should be placed in /public/videos/
  const videoPath = `/videos/level${levelNumber}.mp4`;

  useEffect(() => {
    // Allow skipping after 3 seconds
    const skipTimer = setTimeout(() => {
      setCanSkip(true);
    }, 3000);

    // Preload next video if available
    const nextLevel = levelNumber + 1;
    const nextVideo = document.createElement("link");
    nextVideo.rel = "prefetch";
    nextVideo.href = `/videos/level${nextLevel}.mp4`;
    document.head.appendChild(nextVideo);

    return () => {
      clearTimeout(skipTimer);
      document.head.removeChild(nextVideo);
    };
  }, [levelNumber]);

  const handleSkip = () => {
    if (!canSkip) return;

    setFadeOut(true);
    setTimeout(() => {
      onComplete();
    }, 500);
  };

  const handleVideoEnd = () => {
    handleSkip();
  };

  return (
    <div
      className={`fixed inset-0 z-50 bg-black flex items-center justify-center transition-opacity duration-500 ${
        fadeOut ? "opacity-0" : "opacity-100"
      }`}
    >
      {/* Video Background */}
      <video
        ref={videoRef}
        autoPlay
        muted
        onEnded={handleVideoEnd}
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src={videoPath} type="video/mp4" />
        {/* Fallback if video doesn't exist */}
        Your browser does not support the video tag.
      </video>

      {/* Overlay Content */}
      <div className="relative z-10 text-center">
        <div className="animate-pulse-slow">
          <h1 className="text-6xl md:text-8xl font-bold text-cyber-accent glow-text mb-4">
            LEVEL {levelNumber}
          </h1>
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-8">
            UNLOCKED
          </h2>
          <p className="text-2xl md:text-4xl text-cyber-accent">{playerName}</p>
        </div>

        {canSkip && (
          <button
            onClick={handleSkip}
            className="mt-12 px-8 py-4 bg-cyber-accent text-black font-bold rounded-lg 
                     hover:bg-opacity-80 transition-all duration-300 animate-pulse"
          >
            CONTINUE →
          </button>
        )}

        {!canSkip && (
          <p className="mt-12 text-white text-opacity-50">Please wait...</p>
        )}
      </div>

      {/* Sound effect (optional) */}
      <audio autoPlay>
        <source src="/sounds/unlock.mp3" type="audio/mpeg" />
      </audio>
    </div>
  );
}
