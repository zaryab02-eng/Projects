import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

/**
 * Cinematic component - plays after each level completion
 * Shows full-screen video with player name overlay
 */
export default function Cinematic({ levelNumber, playerName, totalLevels, isSolo, onComplete }) {
  const navigate = useNavigate();
  const [canSkip, setCanSkip] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);
  const videoRef = useRef(null);

  // Determine if this is the final level
  const isFinalLevel = levelNumber >= (totalLevels || 0);
  
  // 🔧 CHANGE LEVEL COMPLETION VIDEO HERE
  // Videos should be placed in /public/videos/
  // Use level1.mp4 for all levels except final, use final.mp4 for final level
  const videoPath = isFinalLevel ? `/videos/final.mp4` : `/videos/level1.mp4`;

  useEffect(() => {
    // Allow skipping after 3 seconds
    const skipTimer = setTimeout(() => {
      setCanSkip(true);
    }, 3000);

    // For final level, stop video after 8 seconds and auto-complete
    if (isFinalLevel) {
      const finalVideoTimer = setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.pause();
        }
        setFadeOut(true);
        setTimeout(() => {
          onComplete();
        }, 500);
      }, 8000); // 8 seconds for final video

      return () => {
        clearTimeout(skipTimer);
        clearTimeout(finalVideoTimer);
      };
    }

    // Preload next video if available (only for non-final levels)
    if (!isFinalLevel) {
      const nextVideo = document.createElement("link");
      nextVideo.rel = "prefetch";
      nextVideo.href = `/videos/level1.mp4`;
      document.head.appendChild(nextVideo);

      return () => {
        clearTimeout(skipTimer);
        if (document.head.contains(nextVideo)) {
          document.head.removeChild(nextVideo);
        }
      };
    }

    return () => {
      clearTimeout(skipTimer);
    };
  }, [levelNumber, isFinalLevel, onComplete]);

  const handleSkip = () => {
    if (!canSkip && !isFinalLevel) return; // Allow immediate completion for final level

    setFadeOut(true);
    setTimeout(() => {
      onComplete();
    }, 500);
  };

  const handleVideoEnd = () => {
    // When video ends, automatically proceed (for both final and non-final levels)
    setFadeOut(true);
    setTimeout(() => {
      onComplete();
    }, 500);
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
      <div className="relative z-10 text-center px-4">
        <div className="animate-pulse-slow">
          {isFinalLevel ? (
            <>
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-bold text-cyber-accent glow-text mb-3 md:mb-4">
                GAME COMPLETE
              </h1>
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 md:mb-8">
                CONGRATULATIONS!
              </h2>
              <p className="text-xl sm:text-2xl md:text-3xl lg:text-4xl text-cyber-accent">
                {playerName}
              </p>
            </>
          ) : (
            <>
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-bold text-cyber-accent glow-text mb-3 md:mb-4">
                LEVEL {levelNumber}
              </h1>
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 md:mb-8">
                UNLOCKED
              </h2>
              <p className="text-xl sm:text-2xl md:text-3xl lg:text-4xl text-cyber-accent">
                {playerName}
              </p>
            </>
          )}
        </div>

        {!isFinalLevel && (
          <>
            {canSkip && (
              <button
                onClick={handleSkip}
                className="mt-8 md:mt-12 px-6 md:px-8 py-3 md:py-4 bg-cyber-accent text-black font-bold rounded-lg 
                         hover:bg-opacity-80 active:scale-95 transition-all duration-300 animate-pulse text-sm md:text-base"
              >
                CONTINUE →
              </button>
            )}

            {!canSkip && (
              <p className="mt-8 md:mt-12 text-white text-opacity-50 text-sm md:text-base">
                Please wait...
              </p>
            )}
          </>
        )}
      </div>

      {/* 🔊 Sound effect - different sound for final level */}
      <audio autoPlay>
        <source src={isFinalLevel ? "/sounds/final.mp3" : "/sounds/unlock.mp3"} type="audio/mpeg" />
      </audio>
    </div>
  );
}
