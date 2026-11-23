import { useEffect, useRef } from "react";
import { useContent } from "../lib/content";
import { onReady } from "../lib/ready";
import Seo from "../components/Seo";
import "../gallery.css";

/**
 * Full-screen draggable gallery. The behaviour is in src/gallery/NatuszGallery.js,
 * the look in src/gallery.css and the photos in src/data/gallery.js.
 */
export default function Gallery() {
  const galleryRef = useRef(null);
  const { galleryItems, loaded } = useContent();

  useEffect(() => {
    if (!loaded) return;
    let g = null;
    let cancelled = false;
    let stop = () => {};
    import("../gallery/NatuszGallery").then(({ NatuszGallery }) => {
      if (cancelled) return;
      // wait until the opening loader (first visit only) has finished
      stop = onReady(() => {
        if (cancelled) return;
        g = new NatuszGallery({ items: galleryItems });
        galleryRef.current = g;
        g.init();
      });
    });
    return () => {
      cancelled = true;
      stop();
      if (g) g.destroy();
      galleryRef.current = null;
    };
  }, [loaded, galleryItems]);

  const zoom = (level, e) =>
    galleryRef.current?.setZoom(level, e.currentTarget);
  const fit = (e) => galleryRef.current?.autoFitZoom(e.currentTarget);

  return (
    <div className="gallery-root">
      <Seo
        title="Gallery | Neu Natusz Healthcare Private Limited"
        description="Photo gallery of Neu Natusz Healthcare Private Limited, Dombivli, Thane: our team, products and work in skin care and dermatology."
        path="/gallery"
      />
      <h1 className="sr-only">
        Gallery of Neu Natusz Healthcare Private Limited
      </h1>

      <div className="viewport" id="viewport">
        <div className="canvas-wrapper" id="canvasWrapper">
          <div className="grid-container" id="gridContainer" />
        </div>
      </div>

      <div className="split-screen-container" id="splitScreenContainer">
        <div className="split-left" id="splitLeft">
          <div className="zoom-target" id="zoomTarget" />
        </div>
        <div className="split-right" id="splitRight" />
      </div>

      <div className="image-title-overlay" id="imageTitleOverlay">
        <div className="image-slide-number" id="imageSlideNumber">
          <span>01</span>
        </div>
        <div className="image-slide-title" id="imageSlideTitle">
          <h1>Title</h1>
        </div>
        <div className="image-slide-description" id="imageSlideDescription" />
      </div>

      <button
        className="close-button"
        id="closeButton"
        aria-label="Back to gallery"
      >
        <svg
          width="64"
          height="64"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M7.89873 16L6.35949 14.48L11.8278 9.08H0V6.92H11.8278L6.35949 1.52L7.89873 0L16 8L7.89873 16Z"
            fill="white"
          />
        </svg>
      </button>

      <p className="gallery-hint">Drag to explore. Tap a photo to open it.</p>

      <div className="controls-container" id="controlsContainer">
        <div className="percentage-indicator" id="percentageIndicator">
          60%
        </div>
        <div className="switch" id="controls">
          <button className="switch-button" onClick={(e) => zoom(0.3, e)}>
            <span className="indicator-dot" /> ZOOM OUT
          </button>
          <button
            className="switch-button switch-button-current"
            onClick={(e) => zoom(0.6, e)}
          >
            <span className="indicator-dot" /> NORMAL
          </button>
          <button className="switch-button" onClick={(e) => zoom(1.0, e)}>
            <span className="indicator-dot" /> ZOOM IN
          </button>
          <button className="switch-button" onClick={fit}>
            <span className="indicator-dot" /> FIT
          </button>
        </div>
        <button
          className="sound-toggle"
          id="soundToggle"
          aria-label="Toggle sound"
        >
          <canvas
            className="sound-wave-canvas"
            id="soundWaveCanvas"
            width="32"
            height="16"
          />
        </button>
      </div>
    </div>
  );
}
