<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface Props {
  targetDate?: string; // YYYY-MM-DD format
  targetTime?: string; // e.g. "18:00"
}

const props = withDefaults(defineProps<Props>(), {
  targetDate: "2026-12-27",
  targetTime: "12:15",
});

const sectionRef = ref<HTMLElement | null>(null);

const days = ref(0);
const hours = ref(0);
const minutes = ref(0);
const seconds = ref(0);
const isPassed = ref(false);

let timerInterval: any = null;
let ctx: gsap.Context | null = null;

function calculateTime() {
  const target = new Date(`${props.targetDate}T${props.targetTime}:00`).getTime();
  const now = new Date().getTime();
  const diff = target - now;

  if (diff <= 0) {
    isPassed.value = true;
    days.value = 0;
    hours.value = 0;
    minutes.value = 0;
    seconds.value = 0;
    return;
  }

  isPassed.value = false;
  days.value = Math.floor(diff / (1000 * 60 * 60 * 24));
  hours.value = Math.floor((diff / (1000 * 60 * 60)) % 24);
  minutes.value = Math.floor((diff / 1000 / 60) % 60);
  seconds.value = Math.floor((diff / 1000) % 60);
}

function pad(num: number): string {
  return num < 10 ? `0${num}` : `${num}`;
}

onMounted(() => {
  calculateTime();
  timerInterval = setInterval(calculateTime, 1000);

  if (!sectionRef.value) return;

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReducedMotion) return;

  ctx = gsap.context(() => {
    // Elegant entrance reveal triggered by scroll
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.value,
        start: "top 78%",
        end: "bottom 30%",
        toggleActions: "play none none reverse",
      },
      defaults: { ease: "power3.out" },
    });

    tl.fromTo(
      ".countdown-ornament",
      { opacity: 0, y: -15 },
      { opacity: 1, y: 0, duration: 1 }
    )
      .fromTo(
        ".countdown-title",
        { opacity: 0, letterSpacing: "0.4em", y: 15 },
        { opacity: 1, letterSpacing: "0.22em", y: 0, duration: 1.2 },
        "-=0.8"
      )
      .fromTo(
        ".countdown-unit",
        { opacity: 0, y: 35, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, stagger: 0.12, duration: 1 },
        "-=0.8"
      )
      .fromTo(
        ".countdown-date-badge",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 1 },
        "-=0.6"
      );
  }, sectionRef.value);
});

onUnmounted(() => {
  if (timerInterval) clearInterval(timerInterval);
  ctx?.revert();
});
</script>

<template>
  <section ref="sectionRef" class="countdown-section">
    <!-- Background Watermark Geometry -->
    <div class="countdown-watermark" aria-hidden="true">27·12·2026</div>

    <div class="countdown-container">
      <!-- Cross / Star Accent -->
      <div class="countdown-ornament">
        <svg class="ornament-star" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M12,2 L14,10 L22,12 L14,14 L12,22 L10,14 L2,12 L10,10 Z" fill="var(--gold)" />
        </svg>
      </div>

      <h2 class="countdown-title">THE DAY WE BEGIN</h2>

      <!-- Active Countdown Counter -->
      <div v-if="!isPassed" class="countdown-grid">
        <div class="countdown-unit">
          <span class="unit-number">{{ pad(days) }}</span>
          <span class="unit-label">DAYS</span>
        </div>

        <div class="countdown-divider" aria-hidden="true"></div>

        <div class="countdown-unit">
          <span class="unit-number">{{ pad(hours) }}</span>
          <span class="unit-label">HOURS</span>
        </div>

        <div class="countdown-divider" aria-hidden="true"></div>

        <div class="countdown-unit">
          <span class="unit-number">{{ pad(minutes) }}</span>
          <span class="unit-label">MINUTES</span>
        </div>

        <div class="countdown-divider" aria-hidden="true"></div>

        <div class="countdown-unit">
          <span class="unit-number">{{ pad(seconds) }}</span>
          <span class="unit-label">SECONDS</span>
        </div>
      </div>

      <!-- Passed / Event Day State -->
      <div v-else class="event-arrived-badge">
        <span class="arrived-star">✦</span>
        <h3 class="arrived-text">TODAY IS THE DAY</h3>
        <p class="arrived-sub">A lifetime of love begins this evening.</p>
        <span class="arrived-star">✦</span>
      </div>

      <!-- Date Badge -->
      <div class="countdown-date-badge">
        <div class="badge-line"></div>
        <p class="badge-date">27 DECEMBER 2026 · 12:15 PM</p>
        <div class="badge-line"></div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.countdown-section {
  position: relative;
  background-color: var(--ivory);
  color: var(--charcoal);
  padding: 8rem 1.5rem 8.5rem 1.5rem;
  overflow: hidden;
  text-align: center;
}

.countdown-watermark {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-family: var(--font-display);
  font-size: clamp(4rem, 15vw, 13rem);
  font-weight: 300;
  color: rgba(184, 155, 94, 0.05);
  letter-spacing: 0.1em;
  white-space: nowrap;
  pointer-events: none;
  z-index: 1;
}

.countdown-container {
  position: relative;
  z-index: 2;
  max-width: 900px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.countdown-ornament {
  margin-bottom: 1.5rem;
  opacity: 0.85;
}

.ornament-star {
  width: 18px;
  height: 18px;
  display: block;
}

.countdown-title {
  font-family: var(--font-body);
  font-size: clamp(0.78rem, 1.4vw, 0.95rem);
  font-weight: 600;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--deep-green);
  margin-bottom: 3.5rem;
}

/* Numerals Grid */
.countdown-grid {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: clamp(0.75rem, 3.5vw, 2.5rem);
  width: 100%;
  flex-wrap: nowrap;
}

.countdown-unit {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: clamp(60px, 16vw, 120px);
}

.unit-number {
  font-family: var(--font-display);
  font-size: clamp(2.8rem, 8vw, 6.2rem);
  line-height: 0.95;
  font-weight: 300;
  color: var(--charcoal);
  letter-spacing: -0.02em;
}

.unit-label {
  font-family: var(--font-body);
  font-size: clamp(0.62rem, 1vw, 0.72rem);
  font-weight: 600;
  letter-spacing: 0.24em;
  color: var(--muted);
  text-transform: uppercase;
  margin-top: 0.85rem;
}

.countdown-divider {
  width: 1px;
  height: clamp(35px, 6vw, 60px);
  background: linear-gradient(
    180deg,
    transparent 0%,
    var(--border-gold) 50%,
    transparent 100%
  );
  opacity: 0.75;
}

/* Date Badge */
.countdown-date-badge {
  display: flex;
  align-items: center;
  gap: 1.25rem;
  margin-top: 4.5rem;
}

.badge-line {
  width: clamp(30px, 8vw, 70px);
  height: 1px;
  background-color: var(--gold);
  opacity: 0.45;
}

.badge-date {
  font-family: var(--font-display);
  font-size: clamp(0.95rem, 1.8vw, 1.25rem);
  letter-spacing: 0.16em;
  color: var(--charcoal);
  font-weight: 400;
}

/* Reached State */
.event-arrived-badge {
  padding: 2rem 2.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  border: 1px solid var(--border-gold);
  border-radius: 16px;
  background: var(--warm-white);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.03);
}

.arrived-star {
  color: var(--gold);
  font-size: 1.5rem;
}

.arrived-text {
  font-family: var(--font-display);
  font-size: clamp(2rem, 5vw, 3rem);
  letter-spacing: 0.1em;
  color: var(--charcoal);
}

.arrived-sub {
  font-family: var(--font-body);
  font-size: 0.95rem;
  color: var(--muted);
  font-style: italic;
}

/* Mobile Responsiveness */
@media (max-width: 600px) {
  .countdown-section {
    padding: 5rem 1rem 6rem 1rem;
  }

  .countdown-title {
    margin-bottom: 2.25rem;
  }

  .countdown-grid {
    gap: 0.35rem;
  }

  .countdown-unit {
    min-width: 58px;
  }

  .unit-number {
    font-size: 2.6rem;
  }

  .unit-label {
    font-size: 0.58rem;
    letter-spacing: 0.15em;
  }

  .countdown-divider {
    height: 30px;
  }

  .countdown-date-badge {
    margin-top: 3rem;
    gap: 0.75rem;
  }
}
</style>
