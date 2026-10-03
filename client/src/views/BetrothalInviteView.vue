<script setup lang="ts">
import { useLenis } from "../composables/useLenis.js";
import WeddingHero from "../components/wedding/WeddingHero.vue";
import BetrothalCountdown from "../components/wedding/BetrothalCountdown.vue";
import BetrothalPhotoFlow from "../components/wedding/BetrothalPhotoFlow.vue";
import BetrothalDetails from "../components/wedding/BetrothalDetails.vue";
import BetrothalRSVP from "../components/wedding/BetrothalRSVP.vue";
import BetrothalFinal from "../components/wedding/BetrothalFinal.vue";

// Initialize Lenis smooth scroll synchronized with GSAP ScrollTrigger
useLenis();

const betrothalConfig = {
  brideName: "DIVYA",
  groomName: "JOHN",
  eventType: "betrothal" as const,
  eventDate: "18 DECEMBER 2026",
  subtitle: "TOGETHER WITH THEIR FAMILIES",
  // The first image the user sees: beach.jpg (optimized)
  heroImage: "/photos/beach-opt.webp",
  // The final emotional close-up portrait: final.jpg (optimized)
  finalImage: "/photos/final-opt.webp",
};
</script>

<template>
  <main class="betrothal-story-page">
    <!-- 1. HERO (First image: beach.jpg) -->
    <WeddingHero
      :bride-name="betrothalConfig.brideName"
      :groom-name="betrothalConfig.groomName"
      :event-type="betrothalConfig.eventType"
      :event-date="betrothalConfig.eventDate"
      :hero-image="betrothalConfig.heroImage"
      :subtitle="betrothalConfig.subtitle"
    />

    <!-- 2. THE COUNTDOWN -->
    <BetrothalCountdown
      target-date="2026-12-18"
      target-time="18:00"
    />

    <!-- 3 & 4. US — A NEW BEGINNING & EDITORIAL PHOTO FLOW -->
    <!-- [PHOTO] [PHOTO] -> [PHOTO] -> [PHOTO] [PHOTO] -> [PHOTO] -->
    <BetrothalPhotoFlow />

    <!-- 5 & 6. THE BETROTHAL & LOCATION (Details, Google Maps, Add to Calendar) -->
    <BetrothalDetails />

    <!-- 7. WILL YOU JOIN US? (Eventify RSVP Flow) -->
    <BetrothalRSVP />

    <!-- 8. FINAL SECTION (DIVYA & JOHN — WE'D LOVE TO HAVE YOU WITH US — final.jpg) -->
    <BetrothalFinal
      :bride-name="betrothalConfig.brideName"
      :groom-name="betrothalConfig.groomName"
      event-date="18 · 12 · 2026"
      :final-image="betrothalConfig.finalImage"
    />
  </main>
</template>

<style scoped>
.betrothal-story-page {
  position: relative;
  background-color: var(--ivory);
  width: 100vw;
  overflow-x: hidden;
}
</style>
