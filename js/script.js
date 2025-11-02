/* ========================================
   UTILITY FUNCTIONS
   ======================================== */

const hideElement = (element) => {
  if (element) element.style.display = "none";
};

const showElement = (element, displayType = "flex") => {
  if (element) element.style.display = displayType;
};

const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/* ========================================
   GLOBAL VARIABLES
   ======================================== */

let heartAnimationActive = false;
let isIntersectionObserverSupported = "IntersectionObserver" in window;
let canvas, stage, container, captureContainers, captureIndex;

/* ========================================
   MAIN INITIALIZATION
   ======================================== */

document.addEventListener("DOMContentLoaded", () => {
  const giftIcon = document.getElementById("gift-icon");
  const giftBoxSection = document.getElementById("gift-box-section");
  const couponsSection = document.getElementById("coupons-section");
  const specialLetterCoupon = document.getElementById("special-letter-coupon");
  const letterModal = document.getElementById("letter-modal");
  const closeModalButton = document.querySelector(".close-button");
  const music = document.getElementById("backgroundMusic");
  const canvas = document.getElementById("testCanvas");

  setupLazyLoading();
  setupMobileTouchEvents();

  if (giftIcon) {
    giftIcon.addEventListener("click", () => {
      hideElement(giftBoxSection);

      confetti({
        particleCount: 200,
        spread: 120,
        origin: { y: 0.6 },
      });

      showElement(canvas, "block");
      initHeartAnimation();
      heartAnimationActive = true;

      try {
        music.volume = 0.5;
        music.play();
      } catch (err) {
        console.log("Musik gagal autoplay: ", err);
      }

      setTimeout(() => {
        showElement(couponsSection, "block");
        couponsSection.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 800);
    });
  }

  if (specialLetterCoupon) {
    specialLetterCoupon.addEventListener("click", () => {
      showElement(letterModal, "flex");
    });
  }

  if (closeModalButton) {
    closeModalButton.addEventListener("click", () => {
      hideElement(letterModal);
    });
  }

  if (letterModal) {
    window.addEventListener("click", (event) => {
      if (event.target == letterModal) {
        hideElement(letterModal);
      }
    });
  }

  setupVisibilityChange();
  preloadCriticalAssets();
});

/* ========================================
   LAZY LOADING IMAGES
   ======================================== */

function setupLazyLoading() {
  const images = document.querySelectorAll(".memory-star img");

  if (isIntersectionObserverSupported) {
    const imageObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target;
            if (img.dataset.src) {
              img.src = img.dataset.src;
              img.removeAttribute("data-src");
            }
            img.classList.add("loaded");
            observer.unobserve(img);
          }
        });
      },
      {
        rootMargin: "50px 0px",
        threshold: 0.01,
      }
    );

    images.forEach((img) => {
      img.setAttribute("loading", "lazy");
      imageObserver.observe(img);
    });
  } else {
    images.forEach((img) => {
      if (img.dataset.src) {
        img.src = img.dataset.src;
      }
    });
  }
}

/* ========================================
   MOBILE TOUCH EVENTS
   ======================================== */

function setupMobileTouchEvents() {
  if (window.innerWidth <= 768) {
    const memoryStars = document.querySelectorAll(".memory-star");

    memoryStars.forEach((star) => {
      star.addEventListener("touchstart", function (e) {
        memoryStars.forEach((s) => s.classList.remove("touched"));
        this.classList.add("touched");
      });
    });

    document.addEventListener("touchstart", function (e) {
      if (!e.target.closest(".memory-star")) {
        memoryStars.forEach((s) => s.classList.remove("touched"));
      }
    });
  }
}

/* ========================================
   VISIBILITY CHANGE HANDLER
   ======================================== */

function setupVisibilityChange() {
  document.addEventListener("visibilitychange", () => {
    if (document.hidden && heartAnimationActive) {
      if (typeof createjs !== "undefined" && createjs.Ticker) {
        createjs.Ticker.paused = true;
      }
    } else if (heartAnimationActive) {
      if (typeof createjs !== "undefined" && createjs.Ticker) {
        createjs.Ticker.paused = false;
      }
    }
  });
}

/* ========================================
   HEART ANIMATION (CREATEJS)
   ======================================== */

function initHeartAnimation() {
  canvas = document.getElementById("testCanvas");

  if (!canvas || typeof createjs === "undefined") {
    console.warn("Canvas or CreateJS not available");
    return;
  }

  stage = new createjs.Stage(canvas);
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const w = canvas.width;
  const h = canvas.height;

  container = new createjs.Container();
  stage.addChild(container);

  captureContainers = [];
  captureIndex = 0;

  const heartCount = window.innerWidth <= 768 ? 50 : 100;

  for (let i = 0; i < heartCount; i++) {
    const heart = new createjs.Shape();
    heart.graphics.beginFill(
      createjs.Graphics.getHSL(
        Math.random() * 30 - 45,
        100,
        50 + Math.random() * 30
      )
    );
    heart.graphics
      .moveTo(0, -12)
      .curveTo(1, -20, 8, -20)
      .curveTo(16, -20, 16, -10)
      .curveTo(16, 0, 0, 12);
    heart.graphics
      .curveTo(-16, 0, -16, -10)
      .curveTo(-16, -20, -8, -20)
      .curveTo(-1, -20, 0, -12);
    heart.y = -100;

    container.addChild(heart);
  }

  for (let i = 0; i < heartCount; i++) {
    const captureContainer = new createjs.Container();
    captureContainer.cache(0, 0, w, h);
    captureContainers.push(captureContainer);
  }

  createjs.Ticker.timingMode = createjs.Ticker.RAF;
  createjs.Ticker.on("tick", tick);

  window.addEventListener("resize", debounce(handleResize, 250));
}

function tick(event) {
  if (!canvas || !stage) return;

  const w = canvas.width;
  const h = canvas.height;
  const l = container.numChildren;

  captureIndex = (captureIndex + 1) % captureContainers.length;
  stage.removeChildAt(0);
  const captureContainer = captureContainers[captureIndex];
  stage.addChildAt(captureContainer, 0);
  captureContainer.addChild(container);

  for (let i = 0; i < l; i++) {
    const heart = container.getChildAt(i);
    if (heart.y < -50) {
      heart._x = Math.random() * w;
      heart.y = h * (1 + Math.random()) + 50;
      heart.perX = (1 + Math.random() * 2) * h;
      heart.offX = Math.random() * h;
      heart.ampX = heart.perX * 0.1 * (0.15 + Math.random());
      heart.velY = -Math.random() * 2 - 1;
      heart.scale = Math.random() * 2 + 1;
      heart._rotation = Math.random() * 40 - 20;
      heart.alpha = Math.random() * 0.75 + 0.05;
      heart.compositeOperation =
        Math.random() < 0.33 ? "lighter" : "source-over";
    }
    const int = ((heart.offX + heart.y) / heart.perX) * Math.PI * 2;
    heart.y += (heart.velY * heart.scaleX) / 2;
    heart.x = heart._x + Math.cos(int) * heart.ampX;
    heart.rotation = heart._rotation + Math.sin(int) * 30;
  }

  captureContainer.updateCache("source-over");
  stage.update(event);
}

function handleResize() {
  if (canvas && stage) {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const w = canvas.width;
    const h = canvas.height;

    captureContainers.forEach((container) => {
      container.uncache();
      container.cache(0, 0, w, h);
    });
  }
}

/* ========================================
   GIFT MODAL (GIF COUPONS)
   ======================================== */

const giftModal = document.getElementById("gift-modal");
const closeGiftButton = document.querySelector(".close-button-gift");
const giftImage = document.getElementById("gift-image");
const allClickableCoupons = document.querySelectorAll(".clickable-coupon");

allClickableCoupons.forEach((coupon) => {
  coupon.addEventListener("click", () => {
    const gifUrl = coupon.getAttribute("data-gif-src");
    giftImage.setAttribute("src", gifUrl);
    giftModal.style.display = "flex";
  });
});

if (closeGiftButton) {
  closeGiftButton.addEventListener("click", () => {
    giftModal.style.display = "none";
    giftImage.setAttribute("src", "");
  });
}

if (giftModal) {
  window.addEventListener("click", (event) => {
    if (event.target == giftModal) {
      giftModal.style.display = "none";
      giftImage.setAttribute("src", "");
    }
  });
}

/* ========================================
   GALLERY NAVIGATION
   ======================================== */

const showGalleryButton = document.getElementById("show-gallery-button");

if (showGalleryButton) {
  showGalleryButton.addEventListener("click", () => {
    hideElement(document.getElementById("letter-modal"));
    hideElement(document.getElementById("coupons-section"));

    const gallerySection = document.getElementById("gallery-section");
    showElement(gallerySection, "block");

    window.scrollTo({ top: 0, behavior: "smooth" });

    setTimeout(() => {
      if (isIntersectionObserverSupported) {
        setupLazyLoading();
      }
    }, 100);
  });
}

/* ========================================
   PRELOAD CRITICAL ASSETS
   ======================================== */

function preloadCriticalAssets() {
  const criticalImages = [
    "images/gift-icon.png",
    "images/10.jpg",
    "images/9.jpg",
    "images/5.jpg",
  ];

  criticalImages.forEach((src) => {
    const link = document.createElement("link");
    link.rel = "preload";
    link.as = "image";
    link.href = src;
    document.head.appendChild(link);
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", preloadCriticalAssets);
} else {
  preloadCriticalAssets();
}
