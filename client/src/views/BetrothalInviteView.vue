<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import { useLenis } from "../composables/useLenis.js";
import WeddingHero from "../components/wedding/WeddingHero.vue";
import BetrothalCountdown from "../components/wedding/BetrothalCountdown.vue";
import BetrothalPhotoFlow from "../components/wedding/BetrothalPhotoFlow.vue";
import BetrothalDetails from "../components/wedding/BetrothalDetails.vue";
import BetrothalRSVP from "../components/wedding/BetrothalRSVP.vue";
import BetrothalFinal from "../components/wedding/BetrothalFinal.vue";

// Initialize Lenis smooth scroll synchronized with GSAP ScrollTrigger
const { lenis } = useLenis();

// ── Sticky Navbar ─────────────────────────────────────────
const navScrolled = ref(false);
const activeSection = ref('');
const menuOpen = ref(false);

function toggleMenu() { menuOpen.value = !menuOpen.value; }
function closeMenu() { menuOpen.value = false; }

function scrollToSection(id: string) {
  closeMenu();
  const el = document.getElementById(id);
  if (!el) return;
  if (lenis.value) {
    lenis.value.scrollTo(el, { offset: -76, duration: 1.2 });
  } else {
    const top = el.getBoundingClientRect().top + window.scrollY - 76;
    window.scrollTo({ top, behavior: 'smooth' });
  }
}

function onScroll() {
  navScrolled.value = window.scrollY > 80;
  const sections = ['section-rsvp', 'section-pictures', 'section-location'];
  let current = '';
  for (const id of sections) {
    const el = document.getElementById(id);
    if (el && el.getBoundingClientRect().top <= 120) current = id;
  }
  activeSection.value = current;
}

onMounted(() => window.addEventListener('scroll', onScroll, { passive: true }));
onUnmounted(() => window.removeEventListener('scroll', onScroll));

const betrothalConfig = {
  brideName: "DIVYA",
  groomName: "JOHN",
  eventType: "betrothal" as const,
  eventDate: "27 DECEMBER 2026",
  subtitle: "TOGETHER WITH THEIR FAMILIES",
  heroImage: "/photos/beach-opt.webp",
  finalImage: "/photos/final-opt.webp",
};
</script>

<template>
  <main class="betrothal-story-page">

    <!-- ── STICKY TOP NAV ──────────────────────────────────── -->
    <nav class="betrothal-nav" :class="{ 'nav-scrolled': navScrolled }" aria-label="Page navigation">
      <div class="betrothal-nav-inner">

        <!-- Hamburger: mobile only (top-left) -->
        <button
          id="nav-hamburger"
          class="hamburger-btn"
          :class="{ 'is-open': menuOpen }"
          aria-label="Open navigation menu"
          :aria-expanded="menuOpen"
          @click="toggleMenu"
        >
          <span class="ham-line" />
          <span class="ham-line" />
          <span class="ham-line" />
        </button>

        <!-- Brand: desktop only -->
        <span class="betrothal-nav-brand">DIVYA &amp; JOHN</span>

        <!-- Desktop nav links -->
        <ul class="betrothal-nav-links" role="list">
          <li>
            <button id="nav-btn-rsvp" class="betrothal-nav-link"
              :class="{ active: activeSection === 'section-rsvp' }"
              aria-label="Scroll to RSVP"
              @click="scrollToSection('section-rsvp')"
            >RSVP</button>
          </li>
          <li>
            <button id="nav-btn-pictures" class="betrothal-nav-link"
              :class="{ active: activeSection === 'section-pictures' }"
              aria-label="Scroll to Pictures"
              @click="scrollToSection('section-pictures')"
            >Pictures</button>
          </li>
          <li>
            <button id="nav-btn-location" class="betrothal-nav-link"
              :class="{ active: activeSection === 'section-location' }"
              aria-label="Scroll to Location"
              @click="scrollToSection('section-location')"
            >Location</button>
          </li>
        </ul>
      </div>
    </nav>

    <!-- Mobile drawer backdrop -->
    <transition name="fade-backdrop">
      <div v-if="menuOpen" class="mobile-backdrop" aria-hidden="true" @click="closeMenu" />
    </transition>

    <!-- Mobile slide-in drawer -->
    <transition name="slide-drawer">
      <aside v-if="menuOpen" class="mobile-drawer" role="dialog" aria-label="Navigation menu">
        <div class="drawer-header">
          <span class="drawer-brand">DIVYA &amp; JOHN</span>
          <button class="drawer-close" aria-label="Close menu" @click="closeMenu">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <line x1="2" y1="2" x2="16" y2="16" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
              <line x1="16" y1="2" x2="2" y2="16" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
            </svg>
          </button>
        </div>
        <div class="drawer-divider" />
        <nav class="drawer-nav" aria-label="Mobile page navigation">
          <button class="drawer-link" @click="scrollToSection('section-rsvp')">
            <svg class="drawer-icon" viewBox="0 0 20 20" fill="none">
              <rect x="2" y="4" width="16" height="12" rx="2" stroke="currentColor" stroke-width="1.5"/>
              <path d="M2 7l8 5 8-5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            </svg>
            <span>RSVP</span>
          </button>
          <button class="drawer-link" @click="scrollToSection('section-pictures')">
            <svg class="drawer-icon" viewBox="0 0 20 20" fill="none">
              <rect x="2" y="4" width="16" height="12" rx="2" stroke="currentColor" stroke-width="1.5"/>
              <circle cx="7.5" cy="9" r="1.5" stroke="currentColor" stroke-width="1.5"/>
              <path d="M2 16l4.5-4.5 3 3 2.5-3 4 4.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <span>Pictures</span>
          </button>
          <button class="drawer-link" @click="scrollToSection('section-location')">
            <svg class="drawer-icon" viewBox="0 0 20 20" fill="none">
              <path d="M10 2a5 5 0 015 5c0 3.5-5 11-5 11S5 10.5 5 7a5 5 0 015-5z" stroke="currentColor" stroke-width="1.5"/>
              <circle cx="10" cy="7" r="1.8" stroke="currentColor" stroke-width="1.5"/>
            </svg>
            <span>Location</span>
          </button>
        </nav>
      </aside>
    </transition>

    <!-- 1. HERO -->
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
      target-date="2026-12-27"
      target-time="12:15"
    />

    <!-- 3 & 4. PHOTOS anchor -->
    <div id="section-pictures">
      <BetrothalPhotoFlow />
    </div>

    <!-- 5 & 6. LOCATION anchor -->
    <div id="section-location">
      <BetrothalDetails />
    </div>

    <!-- 7. RSVP anchor -->
    <div id="section-rsvp">
      <BetrothalRSVP />
    </div>

    <!-- 8. FINAL SECTION -->
    <BetrothalFinal
      :bride-name="betrothalConfig.brideName"
      :groom-name="betrothalConfig.groomName"
      event-date="27 · 12 · 2026"
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

/* ── Sticky Nav Bar ──────────────────────────────────────── */
.betrothal-nav {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 200;
  padding: 0.9rem 2rem;
  background: rgba(20, 17, 15, 0.15);
  backdrop-filter: blur(16px) saturate(1.4);
  -webkit-backdrop-filter: blur(16px) saturate(1.4);
  border-bottom: 1px solid rgba(197, 160, 89, 0.18);
  transition: background 0.4s ease, box-shadow 0.4s ease, border-color 0.4s ease;
}

.betrothal-nav.nav-scrolled {
  background: rgba(28, 24, 20, 0.88);
  box-shadow: 0 4px 30px rgba(0, 0, 0, 0.25);
  border-bottom-color: rgba(197, 160, 89, 0.35);
}

.betrothal-nav-inner {
  max-width: 1100px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.betrothal-nav-brand {
  font-family: var(--font-display);
  font-size: 1rem;
  font-weight: 500;
  letter-spacing: 0.22em;
  color: rgba(255, 255, 255, 0.92);
  text-transform: uppercase;
  white-space: nowrap;
}

.betrothal-nav-links {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  align-items: center;
  gap: 0.2rem;
}

.betrothal-nav-link {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.45rem 1.05rem;
  border-radius: 100px;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.78);
  background: transparent;
  border: 1px solid transparent;
  cursor: pointer;
  transition: all 0.25s ease;
  font-family: var(--font-body);
}

.betrothal-nav-link:hover {
  color: #ffffff;
  background: rgba(197, 160, 89, 0.15);
  border-color: rgba(197, 160, 89, 0.35);
}

.betrothal-nav-link.active {
  color: #ffffff;
  background: rgba(197, 160, 89, 0.22);
  border-color: rgba(197, 160, 89, 0.55);
  box-shadow: 0 0 12px rgba(197, 160, 89, 0.2);
}
/* ── Hamburger button (mobile only) ─────────────────────── */
.hamburger-btn {
  display: none; /* hidden on desktop */
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 5px;
  width: 40px;
  height: 40px;
  background: rgba(255,255,255,0.08);
  border: 1px solid rgba(197,160,89,0.3);
  border-radius: 8px;
  cursor: pointer;
  padding: 0;
  transition: background 0.2s ease;
  flex-shrink: 0;
}

.hamburger-btn:hover {
  background: rgba(197,160,89,0.15);
}

.ham-line {
  display: block;
  width: 18px;
  height: 1.8px;
  background: rgba(255,255,255,0.9);
  border-radius: 2px;
  transition: transform 0.28s ease, opacity 0.2s ease;
  transform-origin: center;
}

/* Animate to X when open */
.hamburger-btn.is-open .ham-line:nth-child(1) { transform: translateY(6.8px) rotate(45deg); }
.hamburger-btn.is-open .ham-line:nth-child(2) { opacity: 0; transform: scaleX(0); }
.hamburger-btn.is-open .ham-line:nth-child(3) { transform: translateY(-6.8px) rotate(-45deg); }

/* ── Mobile Backdrop ─────────────────────────────────────── */
.mobile-backdrop {
  position: fixed;
  inset: 0;
  z-index: 190;
  background: rgba(10, 8, 6, 0.55);
  backdrop-filter: blur(2px);
}

/* ── Mobile Slide-in Drawer ──────────────────────────────── */
.mobile-drawer {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  width: 260px;
  z-index: 300;
  background: rgba(22, 18, 15, 0.96);
  backdrop-filter: blur(20px);
  border-right: 1px solid rgba(197,160,89,0.2);
  display: flex;
  flex-direction: column;
  padding: 0;
  box-shadow: 6px 0 30px rgba(0,0,0,0.4);
}

.drawer-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.2rem 1.25rem;
}

.drawer-brand {
  font-family: var(--font-display);
  font-size: 0.85rem;
  font-weight: 500;
  letter-spacing: 0.2em;
  color: rgba(197,160,89,0.9);
  text-transform: uppercase;
}

.drawer-close {
  background: transparent;
  border: none;
  color: rgba(255,255,255,0.55);
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  transition: color 0.2s;
}
.drawer-close:hover { color: #fff; }

.drawer-divider {
  height: 1px;
  background: rgba(197,160,89,0.18);
  margin: 0 1.25rem;
}

.drawer-nav {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  padding: 1.25rem 1rem;
}

.drawer-link {
  display: flex;
  align-items: center;
  gap: 0.85rem;
  padding: 0.9rem 1rem;
  border-radius: 10px;
  background: transparent;
  border: 1px solid transparent;
  color: rgba(255,255,255,0.72);
  font-family: var(--font-body);
  font-size: 0.9rem;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  cursor: pointer;
  transition: all 0.22s ease;
  text-align: left;
}

.drawer-link:hover {
  background: rgba(197,160,89,0.1);
  border-color: rgba(197,160,89,0.25);
  color: #fff;
}

.drawer-icon {
  width: 18px;
  height: 18px;
  color: rgba(197,160,89,0.8);
  flex-shrink: 0;
}

/* ── Transitions ─────────────────────────────────────────── */
.fade-backdrop-enter-active, .fade-backdrop-leave-active { transition: opacity 0.28s ease; }
.fade-backdrop-enter-from, .fade-backdrop-leave-to { opacity: 0; }

.slide-drawer-enter-active, .slide-drawer-leave-active { transition: transform 0.3s cubic-bezier(0.4,0,0.2,1); }
.slide-drawer-enter-from, .slide-drawer-leave-to { transform: translateX(-100%); }

/* ── Responsive: mobile ≤ 768px ──────────────────────────── */
@media (max-width: 768px) {
  /* Show hamburger, hide desktop links & brand */
  .hamburger-btn { display: flex; }
  .betrothal-nav-brand { display: none; }
  .betrothal-nav-links { display: none; }

  /* Align nav inner to left edge */
  .betrothal-nav-inner {
    justify-content: flex-start;
  }

  .betrothal-nav {
    padding: 0.75rem 1rem;
  }
}
</style>
