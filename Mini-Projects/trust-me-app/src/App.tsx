import { useState } from "react";

/**
 * TrustMe Video Component
 *
 * A React component that displays a "Trust Me" button.
 * When clicked, the button fades out and a video zooms in smoothly from center.
 * The video then plays in an infinite loop covering the entire screen.
 *
 * @component
 */
export default function TrustMeVideo() {
  // State management: tracks whether to show video or button
  // false = show button screen | true = show video screen
  const [showVideo, setShowVideo] = useState<boolean>(false);

  /**
   * Handles the "Trust Me" button click event
   * Triggers the transition from button to video
   */
  const handleTrustClick = (): void => {
    setShowVideo(true);
  };

  return (
    // Main container - full viewport height, black background, hides overflow
    <div className="relative w-full h-screen overflow-hidden bg-black">
      {/* ==================== BUTTON SCREEN SECTION ==================== */}
      {/* 
        Initial screen with gradient background and centered button
        - Absolute positioning to layer on top
        - Flexbox centers the button both horizontally and vertically
        - Smooth opacity transition (1 second duration)
        - When showVideo is true: opacity-0 (invisible) + pointer-events-none (non-interactive)
        - When showVideo is false: opacity-100 (visible)
      */}
      <div
        className={`absolute inset-0 flex items-center justify-center bg-linear-to-br from-purple-900 via-black to-blue-900 transition-opacity duration-1000 ${
          showVideo ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}
      >
        {/* 
          "Trust Me" Button with hover effects
          - group: allows child elements to respond to parent hover
          - hover:scale-110: button grows 10% on hover
          - transition-all duration-300: smooth hover animation (0.3s)
        */}
        <button
          onClick={handleTrustClick}
          className="group relative px-12 py-6 text-2xl font-bold text-white transition-all duration-300 hover:scale-110"
          aria-label="Trust me and reveal video"
        >
          {/* 
            Glowing halo effect behind button
            - Positioned absolutely behind the main button content
            - Gradient background with blur creates glow effect
            - opacity-75: 75% visible normally
            - group-hover:opacity-100: 100% visible on button hover
          */}
          <div className="absolute inset-0 bg-linear-to-r from-pink-500 via-purple-500 to-blue-500 rounded-full blur-xl opacity-75 group-hover:opacity-100 transition-opacity"></div>

          {/* 
            Main button surface
            - relative: positions above the glow effect
            - bg-black: solid black background
            - rounded-full: circular shape
            - border-2: 2px border
            - border-purple-500: purple border normally
            - group-hover:border-pink-500: pink border on hover
          */}
          <div className="relative bg-black rounded-full px-12 py-4 border-2 border-purple-500 group-hover:border-pink-500 transition-colors">
            Trust Me
          </div>
        </button>
      </div>

      {/* ==================== VIDEO SCREEN SECTION ==================== */}
      {/* 
        Outer container for video - centers the animated wrapper
        - Absolute positioning to layer properly
        - Flexbox to center child content
      */}
      <div className="absolute inset-0 flex items-center justify-center">
        {/* 
          Animated wrapper for zoom effect
          - Starts at scale-0 (invisible tiny point at center)
          - Grows to scale-100 (full screen size)
          - opacity-0 to opacity-100: fades in during zoom
          - transition-all: animates all properties (scale, opacity)
          - duration-1000: 1 second animation
          - ease-out: starts fast, ends smoothly (natural deceleration)
        */}
        <div
          className={`transition-all duration-1000 ease-out ${
            showVideo
              ? "scale-100 opacity-100" // Video visible: full size, fully opaque
              : "scale-0 opacity-0" // Video hidden: zero size, transparent
          }`}
          style={{
            width: "100%",
            height: "100%",
            // transformOrigin: ensures zoom animation radiates from center
            transformOrigin: "center center",
          }}
        >
          {/* 
            HTML5 Video Element
            - w-full h-full: fills entire container
            - object-cover: maintains aspect ratio, crops to fill (no black bars)
            - autoPlay: starts playing immediately when shown
            - loop: repeats infinitely
            - muted: required for autoplay to work in modern browsers
            - playsInline: plays inline on mobile devices (iOS requirement)
          */}
          <video
            className="w-full h-full object-cover"
            autoPlay
            loop
            muted
            playsInline
            src="/video.mp4"
          >
            {/* Fallback message for browsers that don't support video tag */}
            Your browser does not support the video tag.
          </video>
        </div>
      </div>
    </div>
  );
}
