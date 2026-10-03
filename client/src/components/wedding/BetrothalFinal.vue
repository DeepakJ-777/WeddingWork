<script setup lang="ts">
interface Props {
  brideName?: string;
  groomName?: string;
  eventDate?: string;
  finalImage?: string;
}

withDefaults(defineProps<Props>(), {
  brideName: "DIVYA",
  groomName: "JOHN",
  eventDate: "27 · 12 · 2026",
  finalImage: "/photos/final-opt.webp",
});
</script>

<template>
  <footer class="final-section">
    <!-- Close-up Emotional Portrait (final.jpg) with Atmospheric Overlay -->
    <div
      class="final-bg"
      :style="{ backgroundImage: `url(${finalImage})` }"
      role="img"
      :aria-label="`${brideName} & ${groomName} Final Portrait`"
    ></div>
    <div class="final-overlay"></div>

    <div class="final-content">
      <!-- Star Accent -->
      <span class="final-star" aria-hidden="true">✦</span>

      <h2 class="final-names">{{ brideName }} & {{ groomName }}</h2>

      <p class="final-tagline">
        WE'D LOVE TO HAVE YOU WITH US
      </p>

      <p class="final-date">{{ eventDate }}</p>

      <!-- Small Christian Cross -->
      <div class="final-cross-wrap">
        <svg class="final-cross" viewBox="0 0 20 28" fill="none" aria-hidden="true">
          <line x1="10" y1="2" x2="10" y2="26" stroke="var(--gold-light)" stroke-width="1.2" stroke-linecap="round" />
          <line x1="4" y1="9" x2="16" y2="9" stroke="var(--gold-light)" stroke-width="1.2" stroke-linecap="round" />
        </svg>
      </div>

      <p class="final-footnote">
        Thank you for being part of our story and holding us in your prayers.
      </p>
    </div>
  </footer>
</template>

<style scoped>
.final-section {
  position: relative;
  min-height: 100vh;
  min-height: 100dvh;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: var(--white);
  overflow: hidden;
  background-color: var(--charcoal);
  padding: 6rem 1.5rem;
}

.final-bg {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center 20%;
  background-repeat: no-repeat;
  filter: brightness(0.62) contrast(1.08);
}

.final-overlay {
  position: absolute;
  inset: 0;
  background: radial-gradient(
    circle at center,
    rgba(22, 34, 28, 0.5) 0%,
    rgba(28, 28, 26, 0.88) 85%
  );
  z-index: 1;
}

.final-content {
  position: relative;
  z-index: 2;
  max-width: 650px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.final-star {
  font-size: 1.5rem;
  color: var(--gold-light);
  margin-bottom: 1.25rem;
  opacity: 0.9;
}

.final-names {
  font-family: var(--font-display);
  font-size: clamp(2.8rem, 6.5vw, 5.5rem);
  font-weight: 400;
  letter-spacing: 0.08em;
  color: var(--ivory);
  margin-bottom: 1.25rem;
  line-height: 1.1;
  text-shadow: 0 4px 25px rgba(0, 0, 0, 0.65);
}

.final-tagline {
  font-family: var(--font-display);
  font-size: clamp(1.2rem, 2.4vw, 1.85rem);
  font-style: italic;
  font-weight: 400;
  color: var(--gold-pale);
  margin-bottom: 1.5rem;
  letter-spacing: 0.06em;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.6);
}

.final-date {
  font-family: var(--font-body);
  font-size: 0.88rem;
  letter-spacing: 0.28em;
  color: rgba(248, 246, 241, 0.85);
  text-transform: uppercase;
  margin-bottom: 2.25rem;
}

.final-cross-wrap {
  margin-bottom: 2rem;
  opacity: 0.85;
}

.final-cross {
  width: 18px;
  height: 26px;
  display: block;
}

.final-footnote {
  font-family: var(--font-body);
  font-size: 0.85rem;
  color: rgba(248, 246, 241, 0.65);
  line-height: 1.6;
  max-width: 440px;
}
</style>
