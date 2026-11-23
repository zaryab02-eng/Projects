import gsap from "gsap";
import { Draggable } from "gsap/Draggable";
import { Flip } from "gsap/Flip";
import { CustomEase } from "gsap/CustomEase";
import { InertiaPlugin } from "gsap/InertiaPlugin";
gsap.registerPlugin(Draggable, Flip, CustomEase, InertiaPlugin);
class NatuszGallery {
  constructor({ items = [] } = {}) {
    this.items = items;
    this.destroyed = false;
    this.timers = [];
    this.rafIds = [];
    this.cleanups = [];
    this.handleSplitAreaClick = this.handleSplitAreaClick.bind(this);
    this.handleZoomKeys = this.handleZoomKeys.bind(this);
    this.lastWidth = window.innerWidth;
    this.viewport = document.getElementById("viewport");
    this.canvasWrapper = document.getElementById("canvasWrapper");
    this.gridContainer = document.getElementById("gridContainer");
    this.splitScreenContainer = document.getElementById("splitScreenContainer");
    this.imageTitleOverlay = document.getElementById("imageTitleOverlay");
    this.closeButton = document.getElementById("closeButton");
    this.controlsContainer = document.getElementById("controlsContainer");
    this.soundToggle = document.getElementById("soundToggle");
    this.customEase = typeof CustomEase !== "undefined" ? CustomEase.create("smooth", ".87,0,.13,1") : "power2.inOut";
    this.centerEase = typeof CustomEase !== "undefined" ? CustomEase.create("center", ".25,.46,.45,.94") : "power2.out";
    this.config = {
      itemSize: 320,
      baseGap: 16,
      rows: 8,
      cols: 12,
      currentZoom: 0.6,
      currentGap: 32
    };
    this.zoomState = {
      isActive: false,
      selectedItem: null,
      flipAnimation: null,
      scalingOverlay: null
    };
    this.gridItems = [];
    this.gridDimensions = {};
    this.lastValidPosition = {
      x: 0,
      y: 0
    };
    this.draggable = null;
    this.viewportObserver = null;
    this.initSoundSystem();
    this.initImageData();
  }
  initSoundSystem() {
    this.soundSystem = {
      enabled: false,
      sounds: {
        click: new Audio("https://assets.codepen.io/7558/glitch-fx-001.mp3"),
        open: new Audio("https://assets.codepen.io/7558/click-glitch-001.mp3"),
        close: new Audio("https://assets.codepen.io/7558/click-glitch-001.mp3"),
        "zoom-in": new Audio(
          "https://assets.codepen.io/7558/whoosh-fx-001.mp3"
        ),
        "zoom-out": new Audio(
          "https://assets.codepen.io/7558/whoosh-fx-001.mp3"
        ),
        "drag-start": new Audio(
          "https://assets.codepen.io/7558/preloader-2s-001.mp3"
        ),
        "drag-end": new Audio(
          "https://assets.codepen.io/7558/preloader-2s-001.mp3"
        )
      },
      play: (soundName) => {
        if (!this.soundSystem.enabled || !this.soundSystem.sounds[soundName])
          return;
        try {
          const audio = this.soundSystem.sounds[soundName];
          audio.currentTime = 0;
          audio.play().catch(() => {
          });
        } catch (e) {
        }
      },
      toggle: () => {
        this.soundSystem.enabled = !this.soundSystem.enabled;
        this.soundToggle.classList.toggle("active", this.soundSystem.enabled);
        if (this.zoomState.isActive) return;
        if (this.soundSystem.enabled) {
          setTimeout(() => {
            this.soundSystem.play("click");
          }, 50);
        }
      }
    };
    Object.values(this.soundSystem.sounds).forEach((audio) => {
      audio.preload = "auto";
      audio.volume = 0.3;
    });
    this.initSoundWave();
  }
  initSoundWave() {
    const canvas = document.getElementById("soundWaveCanvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const width = 32;
    const height = 16;
    const centerY = Math.floor(height / 2);
    let startTime = Date.now();
    let currentAmplitude = this.soundSystem.enabled ? 1 : 0;
    const interpolateColor = (color1, color2, factor) => {
      const r1 = parseInt(color1.substring(1, 3), 16);
      const g1 = parseInt(color1.substring(3, 5), 16);
      const b1 = parseInt(color1.substring(5, 7), 16);
      const r2 = parseInt(color2.substring(1, 3), 16);
      const g2 = parseInt(color2.substring(3, 5), 16);
      const b2 = parseInt(color2.substring(5, 7), 16);
      const r = Math.round(r1 + factor * (r2 - r1)).toString(16).padStart(2, "0");
      const g = Math.round(g1 + factor * (g2 - g1)).toString(16).padStart(2, "0");
      const b = Math.round(b1 + factor * (b2 - b1)).toString(16).padStart(2, "0");
      return `#${r}${g}${b}`;
    };
    const animate = () => {
      if (this.destroyed) return;
      const targetAmplitude = this.soundSystem.enabled ? 1 : 0;
      currentAmplitude += (targetAmplitude - currentAmplitude) * 0.08;
      ctx.clearRect(0, 0, width, height);
      const time = (Date.now() - startTime) / 1e3;
      const muteFactor = 1 - currentAmplitude;
      const primaryColor = "#062A2E";
      const accentColor = "#ED1C24";
      const muteColor = "#9CC9CC";
      if (!this.soundSystem.enabled && currentAmplitude < 0.01) {
        ctx.fillStyle = muteColor;
        ctx.fillRect(0, centerY, width, 2);
      } else {
        ctx.fillStyle = interpolateColor(primaryColor, muteColor, muteFactor);
        for (let i = 0; i < width; i++) {
          const x = i - width / 2;
          const e = Math.exp(-x * x / 50);
          const y = centerY + Math.cos(x * 0.4 - time * 8) * e * height * 0.35 * currentAmplitude;
          ctx.fillRect(i, Math.round(y), 1, 2);
        }
        ctx.fillStyle = interpolateColor(accentColor, muteColor, muteFactor);
        for (let i = 0; i < width; i++) {
          const x = i - width / 2;
          const e = Math.exp(-x * x / 80);
          const y = centerY + Math.cos(x * 0.3 - time * 5) * e * height * 0.25 * currentAmplitude;
          ctx.fillRect(i, Math.round(y), 1, 2);
        }
      }
      requestAnimationFrame(animate);
    };
    animate();
  }
  initImageData() {
    this.fashionImages = this.items.map((item) => item.src);
    this.imageData = this.items.map((item, i) => ({
      number: String(i + 1).padStart(2, "0"),
      title: item.title,
      description: item.description
    }));
  }
  // Custom line splitting function (since we can't use SplitText)
  splitTextIntoLines(element, text) {
    element.innerHTML = "";
    const sentences = text.split(new RegExp("(?<=[.!?])\\s+"));
    const lines = [];
    const temp = document.createElement("div");
    temp.style.cssText = `
          position: absolute;
          visibility: hidden;
          width: ${element.offsetWidth}px;
          font-family: 'PPNeueMontreal', sans-serif;
          font-size: 16px;
          font-weight: 300;
          line-height: 1.4;
        `;
    document.body.appendChild(temp);
    let currentLine = "";
    sentences.forEach((sentence) => {
      const words = sentence.split(" ");
      words.forEach((word) => {
        const testLine = currentLine ? `${currentLine} ${word}` : word;
        temp.textContent = testLine;
        if (temp.offsetWidth > element.offsetWidth && currentLine) {
          lines.push(currentLine);
          currentLine = word;
        } else {
          currentLine = testLine;
        }
      });
    });
    if (currentLine) {
      lines.push(currentLine);
    }
    document.body.removeChild(temp);
    lines.forEach((lineText) => {
      const lineSpan = document.createElement("span");
      lineSpan.className = "description-line";
      lineSpan.textContent = lineText;
      element.appendChild(lineSpan);
    });
    return element.querySelectorAll(".description-line");
  }
  calculateGapForZoom(zoomLevel) {
    if (zoomLevel >= 1) return 16;
    else if (zoomLevel >= 0.6) return 32;
    else return 64;
  }
  calculateGridDimensions(gap = this.config.currentGap) {
    const totalWidth = this.config.cols * (this.config.itemSize + gap) - gap;
    const totalHeight = this.config.rows * (this.config.itemSize + gap) - gap;
    this.gridDimensions = {
      width: totalWidth,
      height: totalHeight,
      scaledWidth: totalWidth * this.config.currentZoom,
      scaledHeight: totalHeight * this.config.currentZoom,
      gap
    };
    return this.gridDimensions;
  }
  generateGridItems() {
    var _a;
    this.config.currentGap = this.calculateGapForZoom(this.config.currentZoom);
    this.calculateGridDimensions();
    this.canvasWrapper.style.width = this.gridDimensions.width + "px";
    this.canvasWrapper.style.height = this.gridDimensions.height + "px";
    this.gridContainer.innerHTML = "";
    this.gridItems = [];
    let imageIndex = 0;
    for (let row = 0; row < this.config.rows; row++) {
      for (let col = 0; col < this.config.cols; col++) {
        const item = document.createElement("div");
        item.className = "grid-item";
        const x = col * (this.config.itemSize + this.config.currentGap);
        const y = row * (this.config.itemSize + this.config.currentGap);
        item.style.left = `${x}px`;
        item.style.top = `${y}px`;
        item.style.opacity = "0";
        const imageUrl = this.fashionImages[imageIndex % this.fashionImages.length];
        imageIndex++;
        const img = document.createElement("img");
        img.src = imageUrl;
        img.alt = ((_a = this.items[(imageIndex - 1) % this.items.length]) == null ? void 0 : _a.title) || `Natusz gallery photo ${imageIndex}`;
        item.appendChild(img);
        const itemData = {
          element: item,
          img,
          row,
          col,
          baseX: x,
          baseY: y,
          imageUrl,
          index: this.gridItems.length
        };
        item.addEventListener("click", () => {
          if (!this.zoomState.isActive) {
            this.soundSystem.play("click");
            this.enterZoomMode(itemData);
          }
        });
        this.gridContainer.appendChild(item);
        this.gridItems.push(itemData);
      }
    }
  }
  setupViewportObserver() {
    if (this.viewportObserver) {
      this.viewportObserver.disconnect();
    }
    this.viewportObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (this.zoomState.selectedItem && entry.target === this.zoomState.selectedItem.element) {
            return;
          }
          if (entry.isIntersecting) {
            entry.target.classList.remove("out-of-view");
            gsap.to(entry.target, {
              opacity: 1,
              duration: 0.6,
              ease: "power2.out"
            });
          } else {
            entry.target.classList.add("out-of-view");
            gsap.to(entry.target, {
              opacity: 0.1,
              duration: 0.6,
              ease: "power2.out"
            });
          }
        });
      },
      {
        root: null,
        threshold: 0.15,
        rootMargin: "10%"
      }
    );
    this.gridItems.forEach((item) => {
      this.viewportObserver.observe(item.element);
    });
  }
  updateTitleOverlay(imageIndex) {
    const data = this.imageData[imageIndex % this.imageData.length];
    const numberElement = document.querySelector("#imageSlideNumber span");
    const titleElement = document.querySelector("#imageSlideTitle h1");
    const descriptionElement = document.getElementById("imageSlideDescription");
    if (numberElement && titleElement && descriptionElement) {
      numberElement.textContent = data.number;
      titleElement.textContent = data.title;
      this.descriptionLines = this.splitTextIntoLines(
        descriptionElement,
        data.description
      );
    }
  }
  createScalingOverlay(sourceImg) {
    const overlay = document.createElement("div");
    overlay.className = "scaling-image-overlay";
    const img = document.createElement("img");
    img.src = sourceImg.src;
    img.alt = sourceImg.alt;
    overlay.appendChild(img);
    (document.querySelector(".gallery-root") || document.body).appendChild(
      overlay
    );
    const sourceRect = sourceImg.getBoundingClientRect();
    gsap.set(overlay, {
      left: sourceRect.left,
      top: sourceRect.top,
      width: sourceRect.width,
      height: sourceRect.height,
      opacity: 1
    });
    return overlay;
  }
  enterZoomMode(selectedItemData) {
    if (this.zoomState.isActive) return;
    this.zoomState.isActive = true;
    this.zoomState.selectedItem = selectedItemData;
    this.soundSystem.play("open");
    if (this.draggable) this.draggable.disable();
    document.body.classList.add("zoom-mode");
    const splitContainer = this.splitScreenContainer;
    const zoomTarget = document.getElementById("zoomTarget");
    splitContainer.classList.add("active");
    gsap.to(splitContainer, {
      opacity: 1,
      duration: 1.2,
      ease: this.customEase
    });
    this.zoomState.scalingOverlay = this.createScalingOverlay(
      selectedItemData.img
    );
    gsap.set(selectedItemData.img, {
      opacity: 0
    });
    this.zoomState.flipAnimation = Flip.fit(
      this.zoomState.scalingOverlay,
      zoomTarget,
      {
        duration: 1.2,
        ease: this.customEase,
        absolute: true,
        onComplete: () => {
          this.updateTitleOverlay(selectedItemData.index);
          const imageTitleOverlay = this.imageTitleOverlay;
          gsap.set("#imageSlideNumber span", {
            y: 20,
            opacity: 0
          });
          gsap.set("#imageSlideTitle h1", {
            y: 60,
            opacity: 0
          });
          gsap.set(this.descriptionLines, {
            y: 80,
            opacity: 0
          });
          imageTitleOverlay.classList.add("active");
          gsap.to(imageTitleOverlay, {
            opacity: 1,
            duration: 0.3,
            ease: "power2.out"
          });
          gsap.to("#imageSlideNumber span", {
            duration: 0.8,
            y: 0,
            opacity: 1,
            ease: this.customEase,
            delay: 0.1
          });
          gsap.to("#imageSlideTitle h1", {
            duration: 0.8,
            y: 0,
            opacity: 1,
            ease: this.customEase,
            delay: 0.15
          });
          gsap.to(this.descriptionLines, {
            duration: 0.8,
            y: 0,
            opacity: 1,
            ease: this.customEase,
            delay: 0.2,
            stagger: 0.15
          });
        }
      }
    );
    this.controlsContainer.classList.add("split-mode");
    gsap.fromTo(
      this.closeButton,
      {
        x: 40,
        opacity: 0
      },
      {
        x: 0,
        opacity: 1,
        duration: 0.6,
        ease: "power2.out",
        delay: 0.9
      }
    );
    this.closeButton.classList.add("active");
    document.getElementById("splitLeft").addEventListener("click", this.handleSplitAreaClick);
    document.getElementById("splitRight").addEventListener("click", this.handleSplitAreaClick);
    document.addEventListener("keydown", this.handleZoomKeys);
  }
  handleSplitAreaClick(e) {
    if (e.target === e.currentTarget) {
      this.exitZoomMode();
    }
  }
  exitZoomMode() {
    if (!this.zoomState.isActive || !this.zoomState.selectedItem || !this.zoomState.scalingOverlay)
      return;
    this.soundSystem.play("close");
    document.removeEventListener("keydown", this.handleZoomKeys);
    const splitLeft = document.getElementById("splitLeft");
    const splitRight = document.getElementById("splitRight");
    if (splitLeft)
      splitLeft.removeEventListener("click", this.handleSplitAreaClick);
    if (splitRight)
      splitRight.removeEventListener("click", this.handleSplitAreaClick);
    const splitContainer = this.splitScreenContainer;
    const selectedElement = this.zoomState.selectedItem.element;
    const selectedImg = this.zoomState.selectedItem.img;
    if (this.zoomState.flipAnimation) {
      this.zoomState.flipAnimation.kill();
    }
    const overlayElement = this.imageTitleOverlay;
    gsap.to(overlayElement, {
      opacity: 0,
      duration: 0.3,
      ease: "power2.out"
    });
    gsap.to("#imageSlideNumber span", {
      duration: 0.4,
      y: -20,
      opacity: 0,
      ease: "power2.out"
    });
    gsap.to("#imageSlideTitle h1", {
      duration: 0.4,
      y: -60,
      opacity: 0,
      ease: "power2.out"
    });
    if (this.descriptionLines) {
      gsap.to(this.descriptionLines, {
        duration: 0.4,
        y: -80,
        opacity: 0,
        ease: "power2.out",
        stagger: -0.05,
        onComplete: () => {
          overlayElement.classList.remove("active");
          gsap.set("#imageSlideNumber span", {
            y: 20,
            opacity: 0
          });
          gsap.set("#imageSlideTitle h1", {
            y: 60,
            opacity: 0
          });
          gsap.set(this.descriptionLines, {
            y: 80,
            opacity: 0
          });
        }
      });
    }
    gsap.to(this.closeButton, {
      duration: 0.3,
      opacity: 0,
      x: 40,
      ease: "power2.in"
    });
    splitContainer.classList.remove("active");
    this.controlsContainer.classList.remove("split-mode");
    gsap.to(splitContainer, {
      opacity: 0,
      duration: 0.8,
      ease: "power2.out"
    });
    Flip.fit(this.zoomState.scalingOverlay, selectedElement, {
      duration: 1.2,
      ease: this.customEase,
      absolute: true,
      onComplete: () => {
        gsap.set(selectedImg, {
          opacity: 1
        });
        if (this.zoomState.scalingOverlay) {
          this.zoomState.scalingOverlay.remove();
          this.zoomState.scalingOverlay = null;
        }
        splitContainer.classList.remove("active");
        document.body.classList.remove("zoom-mode");
        this.closeButton.classList.remove("active");
        if (this.draggable) this.draggable.enable();
        this.zoomState.isActive = false;
        this.zoomState.selectedItem = null;
        this.zoomState.flipAnimation = null;
      }
    });
    if (this.zoomState.scalingOverlay) {
      gsap.to(this.zoomState.scalingOverlay, {
        opacity: 0.4,
        duration: 0.8,
        ease: "power2.out"
      });
    }
  }
  handleZoomKeys(e) {
    if (!this.zoomState.isActive) return;
    if (e.key === "Escape") {
      this.exitZoomMode();
    }
  }
  calculateBounds() {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const { scaledWidth, scaledHeight } = this.gridDimensions;
    const marginX = this.config.currentGap * this.config.currentZoom;
    const marginY = this.config.currentGap * this.config.currentZoom;
    let minX, maxX, minY, maxY;
    if (scaledWidth <= vw) {
      const centerX = (vw - scaledWidth) / 2;
      minX = maxX = centerX;
    } else {
      maxX = marginX;
      minX = vw - scaledWidth - marginX;
    }
    if (scaledHeight <= vh) {
      const centerY = (vh - scaledHeight) / 2;
      minY = maxY = centerY;
    } else {
      maxY = marginY;
      minY = vh - scaledHeight - marginY;
    }
    return {
      minX,
      maxX,
      minY,
      maxY
    };
  }
  initDraggable() {
    if (this.draggable) {
      this.draggable.kill();
    }
    this.calculateGridDimensions(this.config.currentGap);
    const bounds = this.calculateBounds();
    const hasInertia = typeof InertiaPlugin !== "undefined";
    this.draggable = Draggable.create(this.canvasWrapper, {
      type: "x,y",
      bounds,
      edgeResistance: 0.8,
      inertia: hasInertia,
      ...hasInertia && {
        throwProps: {
          x: {
            velocity: "auto",
            resistance: 300,
            end: (endValue) => Math.round(endValue)
          },
          y: {
            velocity: "auto",
            resistance: 300,
            end: (endValue) => Math.round(endValue)
          }
        }
      },
      onDragStart: () => {
        document.body.classList.add("dragging");
        this.soundSystem.play("drag-start");
        this.lastValidPosition.x = this.draggable.x;
        this.lastValidPosition.y = this.draggable.y;
      },
      onDrag: () => {
        this.lastValidPosition.x = this.draggable.x;
        this.lastValidPosition.y = this.draggable.y;
      },
      onDragEnd: () => {
        document.body.classList.remove("dragging");
        this.soundSystem.play("drag-end");
      },
      // Draggable can swallow normal taps, so open the photo from its own click callback
      onClick: (e) => {
        if (this.zoomState.isActive) return;
        const el = e.target && e.target.closest ? e.target.closest(".grid-item") : null;
        const itemData = el && this.gridItems.find((g) => g.element === el);
        if (itemData) {
          this.soundSystem.play("click");
          this.enterZoomMode(itemData);
        }
      }
    })[0];
  }
  handleMouseLeave() {
    if (document.body.classList.contains("dragging")) {
      document.body.classList.remove("dragging");
      gsap.to(this.canvasWrapper, {
        duration: 0.6,
        x: this.lastValidPosition.x,
        y: this.lastValidPosition.y,
        ease: "power2.out"
      });
      if (this.draggable) {
        this.draggable.endDrag();
      }
    }
  }
  calculateFitZoom() {
    const vw = window.innerWidth;
    const vh = window.innerHeight - 80;
    const currentGap = this.calculateGapForZoom(1);
    const gridWidth = this.config.cols * (this.config.itemSize + currentGap) - currentGap;
    const gridHeight = this.config.rows * (this.config.itemSize + currentGap) - currentGap;
    const margin = 40;
    const availableWidth = vw - margin * 2;
    const availableHeight = vh - margin * 2;
    const zoomToFitWidth = availableWidth / gridWidth;
    const zoomToFitHeight = availableHeight / gridHeight;
    const fitZoom = Math.min(zoomToFitWidth, zoomToFitHeight);
    return Math.max(0.1, Math.min(2, fitZoom));
  }
  playIntroAnimation() {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const screenCenterX = vw / 2;
    const screenCenterY = vh / 2;
    const canvasStyle = getComputedStyle(this.canvasWrapper);
    const canvasMatrix = new DOMMatrix(canvasStyle.transform);
    const canvasX = canvasMatrix.m41;
    const canvasY = canvasMatrix.m42;
    const canvasScale = canvasMatrix.a;
    const centerX = (screenCenterX - canvasX) / canvasScale - this.config.itemSize / 2;
    const centerY = (screenCenterY - canvasY) / canvasScale - this.config.itemSize / 2;
    this.gridItems.forEach((itemData, index) => {
      const zIndex = this.gridItems.length - index;
      gsap.set(itemData.element, {
        left: centerX,
        top: centerY,
        scale: 0.8,
        zIndex,
        opacity: 0
        // Keep hidden, will fade in during animation
      });
    });
    gsap.to(
      this.gridItems.map((item) => item.element),
      {
        duration: 0.2,
        left: (index) => this.gridItems[index].baseX,
        top: (index) => this.gridItems[index].baseY,
        scale: 1,
        opacity: 1,
        // Add fade in
        ease: "power2.out",
        stagger: {
          amount: 1.5,
          from: "start",
          grid: [this.config.rows, this.config.cols]
        },
        onComplete: () => {
          this.gridItems.forEach((itemData) => {
            gsap.set(itemData.element, {
              zIndex: 1
            });
          });
          const percentageIndicator = this.controlsContainer.querySelector(
            ".percentage-indicator"
          );
          const switchElement = this.controlsContainer.querySelector(".switch");
          const soundToggle = this.controlsContainer.querySelector(".sound-toggle");
          gsap.set(this.controlsContainer, {
            opacity: 0
          });
          gsap.set(percentageIndicator, {
            x: "-3em"
          });
          gsap.set(switchElement, {
            y: "2em"
          });
          gsap.set(soundToggle, {
            x: "3em"
          });
          const navTimeline = gsap.timeline();
          navTimeline.to(
            this.controlsContainer,
            {
              opacity: 1,
              duration: 0.5,
              ease: "power2.out"
            },
            0
          );
          navTimeline.to(
            percentageIndicator,
            {
              x: 0,
              duration: 0.2,
              ease: "power2.out"
            },
            0.25
          );
          navTimeline.to(
            switchElement,
            {
              y: 0,
              duration: 0.2,
              ease: "power2.out"
            },
            0.3
          );
          navTimeline.to(
            soundToggle,
            {
              x: 0,
              duration: 0.2,
              ease: "power2.out"
            },
            0.35
          );
          this.controlsContainer.classList.add("visible");
        }
      }
    );
  }
  autoFitZoom(buttonElement = null) {
    if (this.zoomState.isActive) {
      this.exitZoomMode();
      return;
    }
    const fitZoom = this.calculateFitZoom();
    this.config.currentZoom = fitZoom;
    const newGap = this.calculateGapForZoom(fitZoom);
    this.soundSystem.play(fitZoom < 0.6 ? "zoom-out" : "zoom-in");
    this.calculateGridDimensions(this.config.currentGap);
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const currentScaledWidth = this.gridDimensions.width * this.config.currentZoom;
    const currentScaledHeight = this.gridDimensions.height * this.config.currentZoom;
    const centerX = (vw - currentScaledWidth) / 2;
    const centerY = (vh - currentScaledHeight) / 2;
    gsap.to(this.canvasWrapper, {
      duration: 0.6,
      x: centerX,
      y: centerY,
      ease: this.centerEase,
      onComplete: () => {
        if (newGap !== this.config.currentGap) {
          this.gridItems.forEach((itemData) => {
            const newX = itemData.col * (this.config.itemSize + newGap);
            const newY = itemData.row * (this.config.itemSize + newGap);
            itemData.baseX = newX;
            itemData.baseY = newY;
            gsap.to(itemData.element, {
              duration: 1,
              left: newX,
              top: newY,
              ease: this.customEase
            });
          });
          const newWidth = this.config.cols * (this.config.itemSize + newGap) - newGap;
          const newHeight = this.config.rows * (this.config.itemSize + newGap) - newGap;
          gsap.to(this.canvasWrapper, {
            duration: 1,
            width: newWidth,
            height: newHeight,
            ease: this.customEase
          });
          this.config.currentGap = newGap;
        }
        this.calculateGridDimensions(newGap);
        const finalScaledWidth = this.gridDimensions.width * fitZoom;
        const finalScaledHeight = this.gridDimensions.height * fitZoom;
        const finalCenterX = (vw - finalScaledWidth) / 2;
        const finalCenterY = (vh - finalScaledHeight) / 2;
        gsap.to(this.canvasWrapper, {
          duration: 1.2,
          scale: fitZoom,
          x: finalCenterX,
          y: finalCenterY,
          ease: this.customEase,
          onComplete: () => {
            this.lastValidPosition.x = finalCenterX;
            this.lastValidPosition.y = finalCenterY;
            this.initDraggable();
          }
        });
      }
    });
    this.updatePercentageIndicator(fitZoom);
    document.querySelectorAll(".switch-button").forEach((btn) => {
      btn.classList.remove("switch-button-current");
    });
    if (buttonElement) {
      buttonElement.classList.add("switch-button-current");
    }
  }
  updatePercentageIndicator(zoomLevel) {
    const percentage = Math.round(zoomLevel * 100);
    document.getElementById("percentageIndicator").textContent = `${percentage}%`;
  }
  setZoom(zoomLevel, buttonElement = null) {
    if (this.zoomState.isActive) {
      this.exitZoomMode();
      return;
    }
    const newGap = this.calculateGapForZoom(zoomLevel);
    const oldZoom = this.config.currentZoom;
    this.config.currentZoom = zoomLevel;
    this.soundSystem.play(zoomLevel < oldZoom ? "zoom-out" : "zoom-in");
    this.calculateGridDimensions(this.config.currentGap);
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const currentScaledWidth = this.gridDimensions.width * oldZoom;
    const currentScaledHeight = this.gridDimensions.height * oldZoom;
    const centerX = (vw - currentScaledWidth) / 2;
    const centerY = (vh - currentScaledHeight) / 2;
    gsap.to(this.canvasWrapper, {
      duration: 0.6,
      x: centerX,
      y: centerY,
      ease: this.centerEase,
      onComplete: () => {
        if (newGap !== this.config.currentGap) {
          this.gridItems.forEach((itemData) => {
            const newX = itemData.col * (this.config.itemSize + newGap);
            const newY = itemData.row * (this.config.itemSize + newGap);
            itemData.baseX = newX;
            itemData.baseY = newY;
            gsap.to(itemData.element, {
              duration: 1.2,
              left: newX,
              top: newY,
              ease: this.customEase
            });
          });
          const newWidth = this.config.cols * (this.config.itemSize + newGap) - newGap;
          const newHeight = this.config.rows * (this.config.itemSize + newGap) - newGap;
          gsap.to(this.canvasWrapper, {
            duration: 1.2,
            width: newWidth,
            height: newHeight,
            ease: this.customEase
          });
          this.config.currentGap = newGap;
        }
        this.calculateGridDimensions(newGap);
        const finalScaledWidth = this.gridDimensions.width * zoomLevel;
        const finalScaledHeight = this.gridDimensions.height * zoomLevel;
        const finalCenterX = (vw - finalScaledWidth) / 2;
        const finalCenterY = (vh - finalScaledHeight) / 2;
        gsap.to(this.canvasWrapper, {
          duration: 1.2,
          scale: zoomLevel,
          x: finalCenterX,
          y: finalCenterY,
          ease: this.customEase,
          onComplete: () => {
            this.lastValidPosition.x = finalCenterX;
            this.lastValidPosition.y = finalCenterY;
            this.calculateGridDimensions(newGap);
            this.initDraggable();
          }
        });
      }
    });
    this.updatePercentageIndicator(zoomLevel);
    document.querySelectorAll(".switch-button").forEach((btn) => {
      btn.classList.remove("switch-button-current");
    });
    if (buttonElement) {
      buttonElement.classList.add("switch-button-current");
    } else {
      const buttons = document.querySelectorAll(".switch-button");
      if (zoomLevel === 0.3) buttons[0].classList.add("switch-button-current");
      else if (zoomLevel === 0.6)
        buttons[1].classList.add("switch-button-current");
      else if (zoomLevel === 1)
        buttons[2].classList.add("switch-button-current");
    }
  }
  resetPosition() {
    if (this.zoomState.isActive) {
      this.exitZoomMode();
      return;
    }
    this.calculateGridDimensions(this.config.currentGap);
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const { scaledWidth, scaledHeight } = this.gridDimensions;
    const centerX = (vw - scaledWidth) / 2;
    const centerY = (vh - scaledHeight) / 2;
    gsap.to(this.canvasWrapper, {
      duration: 1,
      x: centerX,
      y: centerY,
      ease: this.centerEase,
      onComplete: () => {
        this.lastValidPosition.x = centerX;
        this.lastValidPosition.y = centerY;
        this.initDraggable();
      }
    });
  }
  init() {
    this.config.currentGap = this.calculateGapForZoom(this.config.currentZoom);
    this.generateGridItems();
    gsap.set(this.viewport, { opacity: 0 });
    gsap.set(this.canvasWrapper, {
      scale: this.config.currentZoom
    });
    this.calculateGridDimensions(this.config.currentGap);
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const { scaledWidth, scaledHeight } = this.gridDimensions;
    const centerX = (vw - scaledWidth) / 2;
    const centerY = (vh - scaledHeight) / 2;
    gsap.set(this.canvasWrapper, {
      x: centerX,
      y: centerY
    });
    this.lastValidPosition.x = centerX;
    this.lastValidPosition.y = centerY;
    this.updatePercentageIndicator(this.config.currentZoom);
    this.setupEventListeners();
    gsap.to(this.viewport, {
      duration: 0.6,
      opacity: 1,
      ease: "power2.inOut",
      onComplete: () => {
        this.playIntroAnimation();
        this.later(() => {
          this.initDraggable();
          this.setupViewportObserver();
        }, 1500);
      }
    });
  }
  later(fn, ms) {
    const id = setTimeout(() => {
      if (!this.destroyed) fn();
    }, ms);
    this.timers.push(id);
    return id;
  }
  listen(target, type, handler) {
    target.addEventListener(type, handler);
    this.cleanups.push(() => target.removeEventListener(type, handler));
  }
  setupEventListeners() {
    this.listen(window, "resize", () => {
      if (window.innerWidth === this.lastWidth) return;
      this.lastWidth = window.innerWidth;
      this.later(() => {
        this.resetPosition();
        this.initDraggable();
      }, 100);
    });
    this.listen(document, "mouseleave", () => this.handleMouseLeave());
    this.listen(this.viewport, "mouseleave", () => this.handleMouseLeave());
    this.listen(this.closeButton, "click", () => this.exitZoomMode());
    this.listen(this.soundToggle, "click", () => this.soundSystem.toggle());
    this.listen(document, "keydown", (e) => {
      if (this.zoomState.isActive) return;
      switch (e.key) {
        case "1":
          this.setZoom(0.3);
          break;
        case "2":
          this.setZoom(0.6);
          break;
        case "3":
          this.setZoom(1);
          break;
        case "f":
        case "F":
          this.autoFitZoom();
          break;
      }
    });
  }
  // Called when leaving the Gallery page: stops everything this gallery started
  destroy() {
    this.destroyed = true;
    this.timers.forEach(clearTimeout);
    this.cleanups.forEach((fn) => fn());
    document.removeEventListener("keydown", this.handleZoomKeys);
    const sl = document.getElementById("splitLeft");
    const sr = document.getElementById("splitRight");
    if (sl) sl.removeEventListener("click", this.handleSplitAreaClick);
    if (sr) sr.removeEventListener("click", this.handleSplitAreaClick);
    if (this.viewportObserver) this.viewportObserver.disconnect();
    if (this.draggable) this.draggable.kill();
    if (this.zoomState.flipAnimation) this.zoomState.flipAnimation.kill();
    if (this.zoomState.scalingOverlay && this.zoomState.scalingOverlay.parentNode) {
      this.zoomState.scalingOverlay.parentNode.removeChild(
        this.zoomState.scalingOverlay
      );
    }
    gsap.killTweensOf([
      this.viewport,
      this.canvasWrapper,
      this.splitScreenContainer,
      this.imageTitleOverlay,
      this.closeButton,
      this.controlsContainer,
      ...this.gridItems.map((g) => g.element)
    ]);
    Object.values(this.soundSystem.sounds).forEach((a) => a.pause());
    document.body.classList.remove("zoom-mode", "dragging");
  }
}
export {
  NatuszGallery
};
