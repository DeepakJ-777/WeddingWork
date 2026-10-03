<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const sectionRef = ref<HTMLElement | null>(null);
let ctx: gsap.Context | null = null;

const eventData = {
  title: "THE BETROTHAL",
  day: "27",
  month: "DECEMBER",
  year: "2026",
  time: "12:15 PM IST",
  venue: "St. Mary's Cathedral, Changanacherry",
  subVenue: "Followed by Reception in the Parish Hall",
  address: "Changanacherry, Kottayam, Kerala 686101",
  mapsUrl: "https://maps.app.goo.gl/xvjBtpkPHBXFjohz8",
  venuePhoto: "/photos/st-marys-church-opt.webp",
};

// Generate Google Calendar Link (12:15 PM IST is 06:45 UTC)
function getGoogleCalendarUrl() {
  const title = encodeURIComponent("Divya & John — Betrothal");
  const details = encodeURIComponent(
    "With joyful hearts, we invite you to celebrate the Betrothal Ceremony of Divya and John at St. Mary's Cathedral, Changanacherry"
  );
  const location = encodeURIComponent(`${eventData.venue}, ${eventData.address}`);
  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}&dates=20261227T064500Z/20261227T104500Z`;
}

onMounted(() => {
  if (!sectionRef.value) return;

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReducedMotion) return;

  ctx = gsap.context(() => {
    gsap.fromTo(
      ".details-card",
      { opacity: 0, y: 45, scale: 0.98 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 1.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.value,
          start: "top 75%",
        },
      }
    );
  }, sectionRef.value);
});

onUnmounted(() => {
  ctx?.revert();
});
</script>

<template>
  <section ref="sectionRef" class="betrothal-details-section">
    <div class="details-container">
      <!-- Section Crest -->
      <div class="details-crest">
        <svg class="crest-icon" viewBox="0 0 28 36" fill="none" aria-hidden="true">
          <line x1="14" y1="2" x2="14" y2="34" stroke="var(--gold)" stroke-width="1.2" stroke-linecap="round" />
          <line x1="5" y1="11" x2="23" y2="11" stroke="var(--gold)" stroke-width="1.2" stroke-linecap="round" />
          <circle cx="14" cy="11" r="3.5" stroke="var(--gold)" stroke-width="0.9" />
        </svg>
      </div>

      <span class="sub-header">THE CEREMONY & CELEBRATION</span>
      <h2 class="main-header">{{ eventData.title }}</h2>

      <!-- Main Editorial Event Card -->
      <div class="details-card">
        <div class="card-grid">
          <!-- Left: Information Column -->
          <div class="card-info">
            <div class="date-hero">
              <span class="date-day">{{ eventData.day }}</span>
              <div class="date-month-year">
                <span class="month">{{ eventData.month }}</span>
                <span class="year">{{ eventData.year }}</span>
              </div>
            </div>

            <div class="time-callout">
              <span class="callout-icon"></span>
              <span class="callout-val">{{ eventData.time }}</span>
            </div>

            <div class="venue-block">
              <h3 class="venue-name">{{ eventData.venue }}</h3>
              <p class="venue-sub">{{ eventData.subVenue }}</p>
              <p class="venue-address"> {{ eventData.address }}</p>
            </div>

            <div class="action-buttons-group">
              <a
                :href="eventData.mapsUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="btn-action btn-gold"
              >
                <span>VIEW ON GOOGLE MAPS</span>
                <span class="arrow">↗</span>
              </a>

              <a
                :href="getGoogleCalendarUrl()"
                target="_blank"
                rel="noopener noreferrer"
                class="btn-action btn-outline"
              >
                <span>+ GOOGLE CALENDAR</span>
              </a>
            </div>
          </div>

          <!-- Right: Architecture / Venue Visual -->
          <div class="card-visual">
            <div class="venue-frame">
              <img
                :src="eventData.venuePhoto"
                :alt="eventData.venue"
                class="venue-img"
                loading="lazy"
              />
              <div class="venue-caption-plate">
                <span class="caption-label"></span>
                <span class="caption-city">ST Marys Cathedral,CHANGANACHERRY</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.betrothal-details-section {
  position: relative;
  background-color: var(--ivory);
  color: var(--charcoal);
  padding: 8rem 1.5rem 9rem 1.5rem;
}

.details-container {
  max-width: 1100px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.details-crest {
  margin-bottom: 1.25rem;
}

.crest-icon {
  width: 24px;
  height: 32px;
  display: block;
}

.sub-header {
  font-family: var(--font-body);
  font-size: 0.72rem;
  letter-spacing: 0.28em;
  font-weight: 600;
  color: var(--gold);
  text-transform: uppercase;
  margin-bottom: 0.5rem;
}

.main-header {
  font-family: var(--font-display);
  font-size: clamp(2rem, 4.5vw, 3.4rem);
  font-weight: 400;
  letter-spacing: 0.04em;
  color: var(--charcoal);
  margin-bottom: 4rem;
  text-align: center;
}

/* Card Container */
.details-card {
  width: 100%;
  background: var(--white);
  border: 1px solid var(--border-gold);
  border-radius: 20px;
  padding: clamp(2rem, 5vw, 4rem);
  box-shadow: 0 15px 50px rgba(28, 28, 26, 0.04);
}

.card-grid {
  display: grid;
  grid-template-columns: 1.45fr 1fr;
  gap: clamp(2rem, 4vw, 3.5rem);
  align-items: center;
}

/* Date Hero Display */
.date-hero {
  display: flex;
  align-items: center;
  gap: 1.25rem;
  margin-bottom: 2rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid var(--border-subtle);
}

.date-day {
  font-family: var(--font-display);
  font-size: clamp(4rem, 7vw, 6.5rem);
  font-weight: 300;
  line-height: 0.9;
  color: var(--deep-green);
  letter-spacing: -0.04em;
}

.date-month-year {
  display: flex;
  flex-direction: column;
}

.month {
  font-family: var(--font-display);
  font-size: clamp(1.4rem, 2.5vw, 2.2rem);
  font-weight: 500;
  letter-spacing: 0.14em;
  color: var(--charcoal);
  line-height: 1.1;
}

.year {
  font-family: var(--font-body);
  font-size: 0.9rem;
  letter-spacing: 0.22em;
  color: var(--gold);
  font-weight: 600;
}

.time-callout {
  display: inline-flex;
  align-items: center;
  gap: 0.65rem;
  padding: 0.4rem 1.1rem;
  background: var(--warm-white);
  border-radius: 30px;
  font-family: var(--font-body);
  font-size: 0.85rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  color: var(--charcoal);
  margin-bottom: 2rem;
}

.callout-icon {
  font-size: 1rem;
}

/* Venue Block */
.venue-block {
  margin-bottom: 2.75rem;
}

.venue-name {
  font-family: var(--font-display);
  font-size: clamp(1.5rem, 2.2vw, 2.1rem);
  font-weight: 500;
  color: var(--charcoal);
  line-height: 1.3;
  margin-bottom: 0.35rem;
}

.venue-sub {
  font-family: var(--font-body);
  font-size: 0.92rem;
  font-weight: 600;
  color: var(--deep-green);
  margin-bottom: 0.6rem;
}

.venue-address {
  font-family: var(--font-body);
  font-size: 0.92rem;
  color: var(--muted);
  line-height: 1.6;
}

/* Action Buttons */
.action-buttons-group {
  display: flex;
  flex-wrap: wrap;
  gap: 0.85rem;
}

.btn-action {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.35rem;
  border-radius: 8px;
  font-family: var(--font-body);
  font-size: 0.78rem;
  font-weight: 600;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  transition: all 0.25s ease;
  cursor: pointer;
}

.btn-gold {
  background: var(--deep-green);
  color: var(--white);
  border: 1px solid var(--deep-green);
}

.btn-gold:hover {
  background: var(--charcoal);
  border-color: var(--charcoal);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
}

.btn-outline {
  background: transparent;
  color: var(--charcoal);
  border: 1px solid var(--border-gold);
}

.btn-outline:hover {
  background: var(--warm-white);
  border-color: var(--gold);
  transform: translateY(-2px);
}

.btn-subtle {
  background: var(--warm-white);
  color: var(--muted);
  border: 1px solid transparent;
}

.btn-subtle:hover {
  color: var(--charcoal);
  border-color: var(--border-subtle);
}

/* Visual Right Column (Small, elegant cameo framing for st marys church) */
.card-visual {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
}

.venue-frame {
  position: relative;
  width: 100%;
  max-width: 270px;
  aspect-ratio: 4 / 5;
  height: auto;
  border-radius: 14px;
  overflow: hidden;
  box-shadow: 0 12px 35px rgba(28, 28, 26, 0.1);
  border: 1px solid var(--border-gold);
  background-color: var(--charcoal);
}

.venue-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center 25%;
  display: block;
}

.venue-caption-plate {
  position: absolute;
  bottom: 0.85rem;
  left: 0.85rem;
  right: 0.85rem;
  background: rgba(28, 28, 26, 0.75);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  padding: 0.6rem 0.95rem;
  border-radius: 6px;
  display: flex;
  justify-content: space-between;
  color: var(--white);
  font-family: var(--font-body);
  font-size: 0.64rem;
  letter-spacing: 0.16em;
}

.caption-label {
  color: var(--gold-light);
  font-weight: 600;
}

/* Mobile */
@media (max-width: 860px) {
  .card-grid {
    grid-template-columns: 1fr;
    gap: 2.5rem;
  }

  .venue-frame {
    max-width: 240px;
    margin: 0 auto;
  }
}
</style>
