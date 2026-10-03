<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";
import { useLenis } from "../composables/useLenis.js";
import WeddingHero from "../components/wedding/WeddingHero.vue";

// Initialize Lenis smooth scroll synchronized with GSAP ScrollTrigger
useLenis();

const route = useRoute();

// Extract slug to determine if this is the Betrothal or Wedding invitation
const slug = computed(() => (route.params.slug as string) || "divya-john-wedding");

// Independent configuration for Betrothal vs Wedding
const isBetrothal = computed(() => slug.value.toLowerCase().includes("betrothal"));

// Separate photography and details for each experience
const invitationConfig = computed(() => {
  if (isBetrothal.value) {
    return {
      brideName: "DIVYA",
      groomName: "JOHN",
      eventType: "betrothal" as const,
      eventDate: "12 DECEMBER 2026",
      subtitle: "TOGETHER WITH THEIR FAMILIES",
      // Refined intimate couple portrait for Betrothal
      heroImage: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=2400&q=85",
      introQuote: "Two lives, two souls, united in love and promise before God.",
      introNote: "We request the honor of your presence as we celebrate our Betrothal & Ring Exchange ceremony.",
    };
  }

  // Default: Wedding Invitation
  return {
    brideName: "DIVYA",
    groomName: "JOHN",
    eventType: "wedding" as const,
    eventDate: "18 DECEMBER 2026",
    subtitle: "TOGETHER WITH THEIR FAMILIES",
    // Majestic editorial ceremony portrait for Wedding
    heroImage: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=2400&q=85",
    introQuote: "I have found the one whom my soul loves.",
    introNote: "Join us in holy matrimony as we begin our lifelong journey blessed by God and our loved ones.",
  };
});
</script>

<template>
  <div class="invitation-experience">
    <!-- CINEMATIC PINNED HERO SECTION -->
    <WeddingHero
      :bride-name="invitationConfig.brideName"
      :groom-name="invitationConfig.groomName"
      :event-type="invitationConfig.eventType"
      :event-date="invitationConfig.eventDate"
      :hero-image="invitationConfig.heroImage"
      :subtitle="invitationConfig.subtitle"
    />

    <!-- ELEGANT BREATHING SPACE / INTRO PREVIEW (Demonstrates hero pinning exit transition) -->
    <section class="story-preview-section">
      <div class="story-ornament">
        <svg class="preview-cross" viewBox="0 0 18 26" fill="none" aria-hidden="true">
          <line x1="9" y1="2" x2="9" y2="24" stroke="var(--gold)" stroke-width="1.2" stroke-linecap="round" />
          <line x1="3" y1="8" x2="15" y2="8" stroke="var(--gold)" stroke-width="1.2" stroke-linecap="round" />
        </svg>
      </div>

      <p class="story-quote">"{{ invitationConfig.introQuote }}"</p>
      <div class="story-divider"></div>
      <p class="story-note">{{ invitationConfig.introNote }}</p>

      <div class="invitation-type-tag">
        <span>CURRENT INVITATION VIEW: <strong>{{ isBetrothal ? 'BETROTHAL' : 'WEDDING' }}</strong></span>
        <div class="toggle-links">
          <router-link to="/invite/divya-john-betrothal" class="btn-toggle" :class="{ active: isBetrothal }">
            View Betrothal Link
          </router-link>
          <router-link to="/invite/divya-john-wedding" class="btn-toggle" :class="{ active: !isBetrothal }">
            View Wedding Link
          </router-link>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.invitation-experience {
  position: relative;
  background-color: var(--ivory);
  min-height: 100vh;
}

/* Story Preview (Breathing room following the cinematic hero) */
.story-preview-section {
  position: relative;
  z-index: 20;
  background-color: var(--ivory);
  color: var(--charcoal);
  padding: 8rem 2rem 10rem 2rem;
  max-width: 860px;
  margin: 0 auto;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.story-ornament {
  margin-bottom: 2rem;
}

.preview-cross {
  width: 18px;
  height: 26px;
  opacity: 0.85;
}

.story-quote {
  font-family: var(--font-display);
  font-size: clamp(1.8rem, 4vw, 2.75rem);
  font-style: italic;
  font-weight: 400;
  line-height: 1.35;
  color: var(--charcoal);
  max-width: 720px;
  margin-bottom: 1.5rem;
}

.story-divider {
  width: 60px;
  height: 1px;
  background-color: var(--gold);
  opacity: 0.6;
  margin: 1.25rem 0 1.75rem 0;
}

.story-note {
  font-family: var(--font-body);
  font-size: 1.05rem;
  line-height: 1.8;
  color: var(--muted);
  max-width: 580px;
}

/* Quick Preview Switcher for Testing */
.invitation-type-tag {
  margin-top: 5rem;
  padding: 1.25rem 1.75rem;
  background: var(--warm-white);
  border: 1px solid var(--border-gold);
  border-radius: 12px;
  font-size: 0.82rem;
  letter-spacing: 0.08em;
  color: var(--charcoal);
}

.invitation-type-tag strong {
  color: var(--deep-green);
}

.toggle-links {
  display: flex;
  gap: 0.75rem;
  margin-top: 0.85rem;
  justify-content: center;
  flex-wrap: wrap;
}

.btn-toggle {
  padding: 0.45rem 1rem;
  border-radius: 6px;
  font-size: 0.78rem;
  font-weight: 600;
  border: 1px solid var(--border-gold);
  color: var(--charcoal);
  background: var(--white);
  transition: all 0.2s ease;
}

.btn-toggle.active {
  background: var(--deep-green);
  color: var(--white);
  border-color: var(--deep-green);
}

.btn-toggle:hover:not(.active) {
  background: var(--ivory);
}
</style>
