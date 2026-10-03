<script setup lang="ts">
import { useLenis } from "../composables/useLenis.js";
import WeddingHero from "../components/wedding/WeddingHero.vue";
import BetrothalCountdown from "../components/wedding/BetrothalCountdown.vue";
import BetrothalStory from "../components/wedding/BetrothalStory.vue";
import BetrothalDetails from "../components/wedding/BetrothalDetails.vue";
import BetrothalRSVP from "../components/wedding/BetrothalRSVP.vue";
import BetrothalFinal from "../components/wedding/BetrothalFinal.vue";

// Initialize Lenis smooth scroll synchronized with GSAP ScrollTrigger
useLenis();

const betrothalData = {
  brideName: "DIVYA",
  groomName: "JOHN",
  eventType: "betrothal" as const,
  eventDate: "18 DECEMBER 2026",
  subtitle: "TOGETHER WITH THEIR FAMILIES",
  heroImage: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=2400&q=85",
};
</script>

<template>
  <main class="betrothal-invite-flow">
    <!-- 1. CINEMATIC HERO (Pinned viewport with zoom & text lift) -->
    <WeddingHero
      :bride-name="betrothalData.brideName"
      :groom-name="betrothalData.groomName"
      :event-type="betrothalData.eventType"
      :event-date="betrothalData.eventDate"
      :hero-image="betrothalData.heroImage"
      :subtitle="betrothalData.subtitle"
    />

    <!-- 2. COUNTDOWN -->
    <BetrothalCountdown
      target-date="2026-12-18"
      target-time="18:00"
    />

    <!-- 3. OUR STORY / PHOTO EXPERIENCE (Kinetic marquee + Pinned horizontal scroll) -->
    <BetrothalStory />

    <!-- 4. BETROTHAL EVENT & LOCATION (Date, Time, Venue, Google Maps & Calendar) -->
    <BetrothalDetails />

    <!-- 5. EVENTIFY RSVP FLOW (Name, Attending Yes/No, Guest counter, Confirmation) -->
    <BetrothalRSVP />

    <!-- 6. FINAL SERENE BENEDICTION -->
    <BetrothalFinal
      :bride-name="betrothalData.brideName"
      :groom-name="betrothalData.groomName"
      event-date="18 · 12 · 2026"
    />
  </main>
</template>

<style scoped>
.betrothal-invite-flow {
  position: relative;
  background-color: var(--ivory);
  width: 100vw;
  overflow-x: hidden;
}
</style>
