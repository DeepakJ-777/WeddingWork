<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface HeroProps {
  brideName?: string;
  groomName?: string;
  eventType?: "betrothal" | "wedding";
  eventDate?: string;
  heroImage?: string;
  subtitle?: string;
}

const props = withDefaults(defineProps<HeroProps>(), {
  brideName: "DIVYA",
  groomName: "JOHN",
  eventType: "betrothal",
  eventDate: "27 DECEMBER 2026",
  heroImage: "/photos/beach-opt.webp",
  subtitle: "TOGETHER WITH THEIR FAMILIES",
});

const heroContainerRef = ref<HTMLElement | null>(null);
const heroImageRef = ref<HTMLElement | null>(null);
const namesWrapperRef = ref<HTMLElement | null>(null);
const scrollIndicatorRef = ref<HTMLElement | null>(null);
const metaElementsRef = ref<HTMLElement | null>(null);

let ctx: gsap.Context | null = null;

onMounted(() => {
  if (!heroContainerRef.value) return;

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  ctx = gsap.context(() => {
    // Entrance reveal
    const entranceTl = gsap.timeline({ defaults: { ease: "power3.out" } });

    entranceTl
      .fromTo(
        heroImageRef.value,
        { scale: 1.05, filter: "brightness(0.7) blur(3px)" },
        { scale: 1, filter: "brightness(1) blur(0px)", duration: 1.6, ease: "power2.out" }
      )
      .fromTo(
        ".hero-ornament",
        { opacity: 0, y: -15 },
        { opacity: 1, y: 0, duration: 1 },
        "-=1.1"
      )
      .fromTo(
        ".hero-subtitle",
        { opacity: 0, letterSpacing: "0.35em" },
        { opacity: 1, letterSpacing: "0.22em", duration: 1 },
        "-=0.9"
      )
      .fromTo(
        namesWrapperRef.value,
        { opacity: 0, y: 25 },
        { opacity: 1, y: 0, duration: 1.2 },
        "-=0.8"
      )
      .fromTo(
        metaElementsRef.value,
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 1 },
        "-=0.7"
      )
      .fromTo(
        scrollIndicatorRef.value,
        { opacity: 0 },
        { opacity: 1, duration: 0.8 },
        "-=0.5"
      );

    // Controlled Fluid Scroll Transition: fluid parallax that keeps the couple gracefully framed without pushing them down
    if (!prefersReducedMotion) {
      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: heroContainerRef.value,
          start: "top top",
          end: "bottom top",
          scrub: 1,
        },
      });

      scrollTl
        // 1. Subtle, graceful parallax zoom centered on the couple's heads
        .to(
          heroImageRef.value,
          {
            yPercent: 14,
            scale: 1.05,
            ease: "none",
          },
          0
        )
        // 2. Subtitle, ornament, and scroll prompt dissolve
        .to(
          [".hero-ornament", ".hero-subtitle", scrollIndicatorRef.value],
          {
            opacity: 0,
            y: -20,
            ease: "power1.out",
            duration: 0.4,
          },
          0
        )
        // 3. Names smoothly elevate without jarring jumps
        .to(
          namesWrapperRef.value,
          {
            y: -45,
            opacity: 0.2,
            ease: "power1.out",
            duration: 0.6,
          },
          0
        )
        // 4. Date badge fades away
        .to(
          metaElementsRef.value,
          {
            opacity: 0,
            y: -20,
            ease: "power1.out",
            duration: 0.4,
          },
          0
        )
        // 5. Soft scrim transition into countdown
        .to(
          ".hero-scrim-end",
          {
            opacity: 0.4,
            ease: "power1.inOut",
            duration: 0.6,
          },
          0.3
        );
    }
  }, heroContainerRef.value);
});

onUnmounted(() => {
  ctx?.revert();
});
</script>

<template>
  <div ref="heroContainerRef" class="hero-container">
    <!-- Background Image Container with Proper Aspect Ratio & Coverage -->
    <div class="hero-media-wrapper">
      <div
        ref="heroImageRef"
        class="hero-media"
        :style="{ backgroundImage: `url(${heroImage})` }"
        role="img"
        :aria-label="`${brideName} & ${groomName} Portrait`"
      ></div>

      <!-- Multiple Subtle Overlays for Contrast while Keeping Couple Radiant -->
      <div class="hero-overlay-gradient"></div>
      <div class="hero-overlay-vignette"></div>
      <div class="hero-scrim-end"></div>
    </div>

    <!-- Delicate Botanical SVG Corner Art -->
    <svg class="botanical-corner botanical-tl" viewBox="0 0 140 140" fill="none" aria-hidden="true">
      <path d="M10,10 Q60,15 90,50 Q110,80 120,130" stroke="rgba(248, 246, 241, 0.45)" stroke-width="1" />
      <path d="M10,10 Q15,60 50,90 Q80,110 130,120" stroke="rgba(248, 246, 241, 0.45)" stroke-width="1" />
      <path d="M30,20 C45,30 50,45 40,60 C30,45 20,35 30,20 Z" fill="rgba(248, 246, 241, 0.15)" stroke="rgba(184, 155, 94, 0.3)" stroke-width="0.8" />
      <path d="M20,30 C30,45 45,50 60,40 C45,30 35,20 20,30 Z" fill="rgba(248, 246, 241, 0.15)" stroke="rgba(184, 155, 94, 0.3)" stroke-width="0.8" />
      <circle cx="10" cy="10" r="2" fill="rgba(184, 155, 94, 0.7)" />
    </svg>

    <svg class="botanical-corner botanical-tr" viewBox="0 0 140 140" fill="none" aria-hidden="true">
      <path d="M130,10 Q80,15 50,50 Q30,80 20,130" stroke="rgba(248, 246, 241, 0.45)" stroke-width="1" />
      <path d="M130,10 Q125,60 90,90 Q60,110 10,120" stroke="rgba(248, 246, 241, 0.45)" stroke-width="1" />
      <path d="M110,20 C95,30 90,45 100,60 C110,45 120,35 110,20 Z" fill="rgba(248, 246, 241, 0.15)" stroke="rgba(184, 155, 94, 0.3)" stroke-width="0.8" />
      <path d="M120,30 C110,45 95,50 80,40 C95,30 105,20 120,30 Z" fill="rgba(248, 246, 241, 0.15)" stroke="rgba(184, 155, 94, 0.3)" stroke-width="0.8" />
      <circle cx="130" cy="10" r="2" fill="rgba(184, 155, 94, 0.7)" />
    </svg>

    <!-- Foreground Content (Anchored in lower half so couple's heads in upper portion are unobstructed) -->
    <div class="hero-content">
      <!-- Christian Cross Ornament -->
      <div class="hero-ornament">
        <svg class="christian-cross" viewBox="0 0 24 34" fill="none" aria-hidden="true">
          <line x1="12" y1="2" x2="12" y2="32" stroke="var(--gold-light)" stroke-width="1.2" stroke-linecap="round" />
          <line x1="4" y1="10" x2="20" y2="10" stroke="var(--gold-light)" stroke-width="1.2" stroke-linecap="round" />
          <circle cx="12" cy="10" r="3.2" stroke="var(--gold-light)" stroke-width="0.8" />
        </svg>
      </div>

      <!-- Formal Opening Subtitle -->
      <p class="hero-subtitle">{{ subtitle }}</p>

      <!-- Couple Names in Oversized Editorial Display -->
      <div ref="namesWrapperRef" class="names-editorial-group">
        <h1 class="couple-name bride-name">{{ brideName }}</h1>
        <div class="weds-bridge">
          <span class="weds-script">&</span>
        </div>
        <h1 class="couple-name groom-name">{{ groomName }}</h1>
      </div>

      <!-- Meta: Event Type Badge & Ceremony Date -->
      <div ref="metaElementsRef" class="hero-meta-group">
        <div class="event-capsule">
          <span class="capsule-pip"></span>
          <span class="capsule-text">BETROTHAL</span>
        </div>
        <p class="hero-date">{{ eventDate }}</p>
      </div>

      <!-- Centered Scroll Indicator (Part of centered content flow) -->
      <div ref="scrollIndicatorRef" class="hero-scroll-indicator" aria-hidden="true">
        <span class="indicator-label">SCROLL TO BEGIN</span>
        <div class="indicator-track">
          <div class="indicator-dot"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.hero-container {
  position: relative;
  width: 100vw;
  min-height: 100vh;
  min-height: 100dvh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding: 3rem 1.5rem;
  color: var(--white);
  background-color: var(--charcoal);
  user-select: none;
}

/* Background Media & Framing: shows both couple and lower scene clearly */
.hero-media-wrapper {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  overflow: hidden;
}

.hero-media {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center 40%;
  background-repeat: no-repeat;
  will-change: transform, filter;
  transform-origin: center center;
}

/* Subtle Dark Overlay Gradient Layer to keep white text easily readable without hiding the couple */
.hero-overlay-gradient {
  position: absolute;
  inset: 0;
  background: radial-gradient(
    circle at center,
    rgba(28, 28, 26, 0.45) 0%,
    rgba(28, 28, 26, 0.65) 60%,
    rgba(28, 28, 26, 0.85) 100%
  );
  z-index: 2;
}

.hero-overlay-vignette {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    180deg,
    rgba(22, 34, 28, 0.35) 0%,
    rgba(28, 28, 26, 0.2) 30%,
    rgba(28, 28, 26, 0.4) 70%,
    rgba(28, 28, 26, 0.75) 100%
  );
  z-index: 3;
}

.hero-scrim-end {
  position: absolute;
  inset: 0;
  background: var(--charcoal);
  opacity: 0;
  z-index: 4;
  pointer-events: none;
}

/* Botanical Corners */
.botanical-corner {
  position: absolute;
  width: clamp(75px, 11vw, 135px);
  height: clamp(75px, 11vw, 135px);
  z-index: 5;
  pointer-events: none;
  opacity: 0.85;
}

.botanical-tl {
  top: 1.5rem;
  left: 1.5rem;
}

.botanical-tr {
  top: 1.5rem;
  right: 1.5rem;
}

/* Foreground Content */
.hero-content {
  position: relative;
  z-index: 10;
  max-width: 1150px;
  width: 100%;
  padding: 0 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

/* Christian Cross Ornament */
.hero-ornament {
  margin-bottom: 0.85rem;
  opacity: 0.95;
  filter: drop-shadow(0 2px 8px rgba(0, 0, 0, 0.6));
}

.christian-cross {
  width: 20px;
  height: 30px;
  display: block;
}

/* Subtitle */
.hero-subtitle {
  font-family: var(--font-body);
  font-size: clamp(0.7rem, 1.2vw, 0.85rem);
  font-weight: 600;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--gold-light);
  margin-bottom: 0.5rem;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.8);
}

/* Names Editorial Layout */
.names-editorial-group {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  margin: 0.15rem 0 1.25rem 0;
  position: relative;
}

.couple-name {
  font-family: var(--font-display);
  font-size: clamp(3rem, 9vw, 6.8rem);
  line-height: 0.95;
  font-weight: 400;
  letter-spacing: 0.06em;
  color: var(--ivory);
  text-shadow: 0 4px 30px rgba(0, 0, 0, 0.75), 0 1px 3px rgba(0, 0, 0, 0.9);
  text-transform: uppercase;
}

.weds-bridge {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  margin: -0.4rem 0;
  z-index: 2;
}

.weds-bridge::before,
.weds-bridge::after {
  content: "";
  display: inline-block;
  width: clamp(28px, 6vw, 65px);
  height: 1px;
  background: linear-gradient(
    90deg,
    transparent 0%,
    var(--gold-light) 50%,
    transparent 100%
  );
  opacity: 0.75;
}

.weds-script {
  font-family: var(--font-script);
  font-size: clamp(2.4rem, 5vw, 3.8rem);
  color: var(--gold-light);
  padding: 0 1.25rem;
  line-height: 1;
  text-shadow: 0 2px 15px rgba(0, 0, 0, 0.9);
  font-style: italic;
  font-weight: 400;
  transform: translateY(-2px);
}

/* Meta: Capsule & Date */
.hero-meta-group {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.event-capsule {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.35rem 1.15rem;
  border-radius: 9999px;
  background: rgba(28, 28, 26, 0.55);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border: 1px solid var(--border-gold);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
}

.capsule-pip {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: var(--gold);
  box-shadow: 0 0 8px var(--gold);
}

.capsule-text {
  font-family: var(--font-body);
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.22em;
  color: var(--gold-pale);
  text-transform: uppercase;
}

.hero-date {
  font-family: var(--font-display);
  font-size: clamp(1.15rem, 2.2vw, 1.6rem);
  letter-spacing: 0.16em;
  font-weight: 400;
  color: var(--white);
  text-shadow: 0 2px 12px rgba(0, 0, 0, 0.75);
}

/* Scroll Indicator */
.hero-scroll-indicator {
  margin-top: clamp(1.25rem, 3vh, 2.25rem);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  z-index: 10;
  pointer-events: none;
}

.indicator-label {
  font-family: var(--font-body);
  font-size: 0.65rem;
  letter-spacing: 0.28em;
  font-weight: 500;
  color: rgba(248, 246, 241, 0.75);
  text-transform: uppercase;
}

.indicator-track {
  width: 1px;
  height: 32px;
  background: rgba(248, 246, 241, 0.25);
  position: relative;
  overflow: hidden;
}

.indicator-dot {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 14px;
  background: linear-gradient(
    180deg,
    transparent 0%,
    var(--gold-light) 60%,
    transparent 100%
  );
  animation: scrollGlow 2.2s cubic-bezier(0.65, 0, 0.35, 1) infinite;
}

@keyframes scrollGlow {
  0% { transform: translateY(-100%); opacity: 0; }
  30% { opacity: 1; }
  80% { opacity: 0.8; }
  100% { transform: translateY(180%); opacity: 0; }
}

/* Mobile Tweaks */
@media (max-width: 640px) {
  .hero-container {
    padding: 2.5rem 1rem;
  }

  .hero-media {
    background-position: center 40%;
    transform-origin: center center;
  }

  .couple-name {
    font-size: clamp(2.5rem, 11vw, 3.6rem);
    letter-spacing: 0.04em;
  }

  .weds-script {
    font-size: 2rem;
  }

  .hero-date {
    font-size: 1.05rem;
    letter-spacing: 0.12em;
  }

  .botanical-corner {
    width: 55px;
    height: 55px;
  }

  .hero-scroll-indicator {
    margin-top: 1rem;
  }
}
</style>
