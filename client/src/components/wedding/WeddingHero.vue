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
  eventType: "wedding",
  eventDate: "18 DECEMBER 2026",
  heroImage: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=2400&q=85",
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
    // Initial entrance animation on page load
    const entranceTl = gsap.timeline({ defaults: { ease: "power3.out" } });

    entranceTl
      .fromTo(
        heroImageRef.value,
        { scale: 1.08, filter: "brightness(0.7) blur(4px)" },
        { scale: 1, filter: "brightness(1) blur(0px)", duration: 1.8, ease: "power2.out" }
      )
      .fromTo(
        ".hero-ornament",
        { opacity: 0, y: -20 },
        { opacity: 1, y: 0, duration: 1.2 },
        "-=1.2"
      )
      .fromTo(
        ".hero-subtitle",
        { opacity: 0, letterSpacing: "0.4em" },
        { opacity: 1, letterSpacing: "0.22em", duration: 1.2 },
        "-=1.0"
      )
      .fromTo(
        namesWrapperRef.value,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1.4 },
        "-=0.9"
      )
      .fromTo(
        metaElementsRef.value,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 1.2 },
        "-=0.8"
      )
      .fromTo(
        scrollIndicatorRef.value,
        { opacity: 0 },
        { opacity: 1, duration: 1 },
        "-=0.6"
      );

    // ScrollTrigger cinematic pinned transition (unless user prefers reduced motion)
    if (!prefersReducedMotion) {
      const scrollTl = gsap.timeline({
        scrollTrigger: {
          trigger: heroContainerRef.value,
          start: "top top",
          end: "+=120%",
          pin: true,
          scrub: 1.1,
          anticipatePin: 1,
        },
      });

      scrollTl
        // 1. Image zooms gracefully into the scene
        .to(
          heroImageRef.value,
          {
            scale: 1.15,
            ease: "none",
          },
          0
        )
        // 2. Subtitle, ornament, and scroll indicator gently fade first
        .to(
          [".hero-ornament", ".hero-subtitle", scrollIndicatorRef.value],
          {
            opacity: 0,
            y: -30,
            ease: "power2.in",
            duration: 0.35,
          },
          0
        )
        // 3. Names glide upward and fade into light
        .to(
          namesWrapperRef.value,
          {
            y: -90,
            opacity: 0,
            scale: 0.96,
            ease: "power2.inOut",
            duration: 0.65,
          },
          0.1
        )
        // 4. Date and event badge disperse
        .to(
          metaElementsRef.value,
          {
            opacity: 0,
            y: -40,
            ease: "power2.in",
            duration: 0.45,
          },
          0.2
        )
        // 5. Subtle darkening transition to receive the incoming intro section
        .to(
          ".hero-scrim-end",
          {
            opacity: 0.6,
            ease: "power1.inOut",
            duration: 0.5,
          },
          0.5
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
    <!-- Background Image Container with Cinematic Zoom -->
    <div class="hero-media-wrapper">
      <div
        ref="heroImageRef"
        class="hero-media"
        :style="{ backgroundImage: `url(${heroImage})` }"
        role="img"
        :aria-label="`${brideName} & ${groomName} Portrait`"
      ></div>

      <!-- Multiple Subtle Overlays for Editorial Depth & Typographic Legibility -->
      <div class="hero-overlay-gradient"></div>
      <div class="hero-overlay-vignette"></div>
      <div class="hero-scrim-end"></div>
    </div>

    <!-- Delicate Botanical SVG Corner Art (White/Gold Line Art) -->
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

    <!-- Foreground Content -->
    <div class="hero-content">
      <!-- Subtle Christian Fine-Line Cross Ornament -->
      <div class="hero-ornament">
        <svg class="christian-cross" viewBox="0 0 24 34" fill="none" aria-hidden="true">
          <!-- Fine vertical cross stem -->
          <line x1="12" y1="2" x2="12" y2="32" stroke="var(--gold-light)" stroke-width="1.2" stroke-linecap="round" />
          <!-- Fine horizontal cross bar -->
          <line x1="4" y1="10" x2="20" y2="10" stroke="var(--gold-light)" stroke-width="1.2" stroke-linecap="round" />
          <!-- Central subtle ring symbol of marriage -->
          <circle cx="12" cy="10" r="3.2" stroke="var(--gold-light)" stroke-width="0.8" />
        </svg>
      </div>

      <!-- Formal Opening Subtitle -->
      <p class="hero-subtitle">{{ subtitle }}</p>

      <!-- Couple Names in Oversized Editorial Display -->
      <div ref="namesWrapperRef" class="names-editorial-group">
        <h1 class="couple-name bride-name">{{ brideName }}</h1>
        <div class="weds-bridge">
          <span class="weds-script">weds</span>
        </div>
        <h1 class="couple-name groom-name">{{ groomName }}</h1>
      </div>

      <!-- Meta: Event Type Badge & Ceremony Date -->
      <div ref="metaElementsRef" class="hero-meta-group">
        <div class="event-capsule">
          <span class="capsule-pip"></span>
          <span class="capsule-text">
            {{ eventType === 'betrothal' ? 'BETROTHAL CEREMONY' : 'HOLY MATRIMONY' }}
          </span>
        </div>
        <p class="hero-date">{{ eventDate }}</p>
      </div>
    </div>

    <!-- Minimal Scroll Indicator -->
    <div ref="scrollIndicatorRef" class="hero-scroll-indicator" aria-hidden="true">
      <span class="indicator-label">SCROLL TO BEGIN</span>
      <div class="indicator-track">
        <div class="indicator-dot"></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.hero-container {
  position: relative;
  width: 100vw;
  height: 100vh;
  height: 100dvh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: var(--white);
  background-color: var(--charcoal);
  user-select: none;
}

/* Background Media & Cinematic Zoom */
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
  inset: -5%;
  width: 110%;
  height: 110%;
  background-size: cover;
  background-position: center 30%;
  will-change: transform, filter;
  transform-origin: center center;
}

/* Gradients & Vignettes for Typographic Clarity */
.hero-overlay-gradient {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    180deg,
    rgba(28, 28, 26, 0.45) 0%,
    rgba(28, 28, 26, 0.25) 30%,
    rgba(28, 28, 26, 0.5) 70%,
    rgba(28, 28, 26, 0.85) 100%
  );
  z-index: 2;
}

.hero-overlay-vignette {
  position: absolute;
  inset: 0;
  background: radial-gradient(
    circle at center,
    transparent 35%,
    rgba(22, 34, 28, 0.4) 85%,
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
  margin-top: -1.5rem;
}

/* Christian Cross Ornament */
.hero-ornament {
  margin-bottom: 1.25rem;
  opacity: 0.92;
  filter: drop-shadow(0 2px 8px rgba(0, 0, 0, 0.45));
}

.christian-cross {
  width: 22px;
  height: 32px;
  display: block;
}

/* Subtitle */
.hero-subtitle {
  font-family: var(--font-body);
  font-size: clamp(0.7rem, 1.2vw, 0.85rem);
  font-weight: 500;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--gold-light);
  margin-bottom: 0.75rem;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.6);
}

/* Names Editorial Layout */
.names-editorial-group {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  margin: 0.25rem 0 1.5rem 0;
  position: relative;
}

.couple-name {
  font-family: var(--font-display);
  font-size: clamp(3.2rem, 10vw, 7.5rem);
  line-height: 0.95;
  font-weight: 400;
  letter-spacing: 0.06em;
  color: var(--ivory);
  text-shadow: 0 4px 30px rgba(0, 0, 0, 0.65), 0 1px 3px rgba(0, 0, 0, 0.9);
  text-transform: uppercase;
}

.weds-bridge {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  margin: -0.5rem 0;
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
  opacity: 0.65;
}

.weds-script {
  font-family: var(--font-script);
  font-size: clamp(2.4rem, 5vw, 4rem);
  color: var(--gold-light);
  padding: 0 1.25rem;
  line-height: 1;
  text-shadow: 0 2px 15px rgba(0, 0, 0, 0.8);
  font-style: italic;
  font-weight: 400;
  transform: translateY(-2px);
}

/* Meta: Capsule & Date */
.hero-meta-group {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.65rem;
}

.event-capsule {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.35rem 1rem;
  border-radius: 9999px;
  background: rgba(28, 28, 26, 0.45);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border: 1px solid var(--border-gold);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
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
  font-weight: 600;
  letter-spacing: 0.18em;
  color: var(--gold-pale);
  text-transform: uppercase;
}

.hero-date {
  font-family: var(--font-display);
  font-size: clamp(1.15rem, 2.2vw, 1.65rem);
  letter-spacing: 0.16em;
  font-weight: 400;
  color: var(--white);
  text-shadow: 0 2px 12px rgba(0, 0, 0, 0.6);
}

/* Scroll Indicator */
.hero-scroll-indicator {
  position: absolute;
  bottom: 2.25rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.65rem;
  z-index: 10;
  pointer-events: none;
}

.indicator-label {
  font-family: var(--font-body);
  font-size: 0.68rem;
  letter-spacing: 0.28em;
  font-weight: 500;
  color: rgba(248, 246, 241, 0.75);
  text-transform: uppercase;
}

.indicator-track {
  width: 1px;
  height: 38px;
  background: rgba(248, 246, 241, 0.25);
  position: relative;
  overflow: hidden;
}

.indicator-dot {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 16px;
  background: linear-gradient(
    180deg,
    transparent 0%,
    var(--gold-light) 60%,
    transparent 100%
  );
  animation: scrollGlow 2.2s cubic-bezier(0.65, 0, 0.35, 1) infinite;
}

@keyframes scrollGlow {
  0% {
    transform: translateY(-100%);
    opacity: 0;
  }
  30% {
    opacity: 1;
  }
  80% {
    opacity: 0.8;
  }
  100% {
    transform: translateY(180%);
    opacity: 0;
  }
}

/* Mobile Tweaks */
@media (max-width: 640px) {
  .hero-content {
    margin-top: 0;
  }

  .couple-name {
    font-size: clamp(2.8rem, 13vw, 4.2rem);
    letter-spacing: 0.04em;
  }

  .weds-script {
    font-size: 2.3rem;
  }

  .hero-date {
    font-size: 1.15rem;
    letter-spacing: 0.12em;
  }

  .botanical-corner {
    width: 65px;
    height: 65px;
  }

  .hero-scroll-indicator {
    bottom: 1.75rem;
  }
}
</style>
