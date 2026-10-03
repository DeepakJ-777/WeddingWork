<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const storyContainerRef = ref<HTMLElement | null>(null);
const horizontalTrackRef = ref<HTMLElement | null>(null);
const marqueeRef = ref<HTMLElement | null>(null);

let ctx: gsap.Context | null = null;

const storyChapters = [
  {
    year: "2019",
    chapter: "CHAPTER I",
    title: "The Beginning",
    location: "Kochi, Kerala",
    quote: "A chance meeting by the water, a shared laughter, and a conversation neither of us wanted to end.",
    image: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=1200&q=85",
    aspect: "portrait",
  },
  {
    year: "2021",
    chapter: "CHAPTER II",
    title: "Chasing Dreams Together",
    location: "Bangalore",
    quote: "Through bustling streets, late-night tea talks, and growing side-by-side, we discovered our anchor in each other.",
    image: "https://images.unsplash.com/photo-1522673607200-164d1b6ce486?auto=format&fit=crop&w=1200&q=85",
    aspect: "landscape",
  },
  {
    year: "2025",
    chapter: "CHAPTER III",
    title: "The Proposal",
    location: "Munnar Hills",
    quote: "Surrounded by misty green hills and morning light, John got down on one knee. With full hearts, forever was promised.",
    image: "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&w=1200&q=85",
    aspect: "portrait",
  },
  {
    year: "2026",
    chapter: "CHAPTER IV",
    title: "The Betrothal",
    location: "St. Mary's, Changanassery",
    quote: "Standing before God, blessed by our families, we take the sacred step toward holy matrimony.",
    image: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1200&q=85",
    aspect: "landscape",
  },
];

onMounted(() => {
  if (!storyContainerRef.value || !horizontalTrackRef.value) return;

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReducedMotion) return;

  ctx = gsap.context(() => {
    // 1. Horizontal Marquee Text Scroll Effect
    if (marqueeRef.value) {
      gsap.to(marqueeRef.value, {
        xPercent: -35,
        ease: "none",
        scrollTrigger: {
          trigger: storyContainerRef.value,
          start: "top bottom",
          end: "bottom top",
          scrub: 0.8,
        },
      });
    }

    // 2. Cinematic Horizontal Story Pinning
    if (!horizontalTrackRef.value || !storyContainerRef.value) return;
    const track = horizontalTrackRef.value;
    const scrollDistance = track.scrollWidth - window.innerWidth;

    if (scrollDistance > 0) {
      gsap.to(track, {
        x: -scrollDistance,
        ease: "none",
        scrollTrigger: {
          trigger: storyContainerRef.value,
          start: "top top",
          end: () => `+=${scrollDistance * 1.35}`,
          pin: true,
          scrub: 1.1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      // Parallax effect on photographs inside panels
      gsap.utils.toArray<HTMLElement>(".chapter-media").forEach((img) => {
        gsap.fromTo(
          img,
          { scale: 1.05, x: 20 },
          {
            scale: 1,
            x: -20,
            ease: "none",
            scrollTrigger: {
              trigger: storyContainerRef.value,
              start: "top top",
              end: () => `+=${scrollDistance * 1.35}`,
              scrub: 1.2,
            },
          }
        );
      });
    }
  }, storyContainerRef.value);
});

onUnmounted(() => {
  ctx?.revert();
});
</script>

<template>
  <div ref="storyContainerRef" class="story-wrapper">
    <!-- Header with Dynamic Horizontal Kinetic Marquee -->
    <div class="story-marquee-wrap" aria-hidden="true">
      <div ref="marqueeRef" class="story-marquee">
        <span>DIVYA & JOHN</span>
        <span class="marquee-bullet">✦</span>
        <span>OUR STORY</span>
        <span class="marquee-bullet">✦</span>
        <span>MEMORIES OF GRACE</span>
        <span class="marquee-bullet">✦</span>
        <span>FROM 2019 TO FOREVER</span>
        <span class="marquee-bullet">✦</span>
        <span>DIVYA & JOHN</span>
        <span class="marquee-bullet">✦</span>
        <span>OUR STORY</span>
      </div>
    </div>

    <!-- Section Intro Header -->
    <div class="story-intro-bar">
      <div class="intro-left">
        <span class="section-tag">A JOURNEY IN LOVE</span>
        <h2 class="section-heading">Every Moment Led to This</h2>
      </div>
      <div class="intro-right">
        <span class="scroll-hint">SCROLL HORIZONTALLY →</span>
      </div>
    </div>

    <!-- Pinned Horizontal Runway Panels -->
    <div ref="horizontalTrackRef" class="horizontal-track">
      <div
        v-for="(item, idx) in storyChapters"
        :key="item.year"
        class="story-panel"
        :class="`panel-${idx}`"
      >
        <div class="panel-content">
          <!-- Text Column -->
          <div class="panel-narrative">
            <span class="chapter-badge">{{ item.chapter }}</span>
            <h3 class="chapter-year">{{ item.year }}</h3>
            <h4 class="chapter-title">{{ item.title }}</h4>
            <p class="chapter-location">📍 {{ item.location }}</p>
            <div class="chapter-line"></div>
            <p class="chapter-quote">"{{ item.quote }}"</p>
          </div>

          <!-- Photography Column -->
          <div class="panel-visual">
            <div class="image-frame" :class="item.aspect">
              <img
                :src="item.image"
                :alt="item.title"
                class="chapter-media"
                loading="lazy"
              />
              <div class="image-overlay-subtle"></div>
            </div>
            <div class="image-footnote">
              <span>MEMORIES OF DIVYA & JOHN</span>
              <span>NO. 0{{ idx + 1 }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.story-wrapper {
  position: relative;
  background-color: var(--warm-white);
  color: var(--charcoal);
  width: 100vw;
  overflow: hidden;
  padding: 4rem 0 0 0;
}

/* Kinetic Marquee Banner */
.story-marquee-wrap {
  width: 100%;
  overflow: hidden;
  border-top: 1px solid var(--border-gold);
  border-bottom: 1px solid var(--border-gold);
  background: var(--ivory);
  padding: 0.85rem 0;
  user-select: none;
}

.story-marquee {
  display: flex;
  align-items: center;
  gap: 2rem;
  white-space: nowrap;
  font-family: var(--font-display);
  font-size: clamp(1.2rem, 2.5vw, 2rem);
  letter-spacing: 0.22em;
  color: var(--muted);
  text-transform: uppercase;
  will-change: transform;
}

.marquee-bullet {
  color: var(--gold);
  font-size: 0.85em;
}

/* Section Intro Bar */
.story-intro-bar {
  max-width: 1350px;
  margin: 3.5rem auto 2.5rem auto;
  padding: 0 3rem;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
}

.section-tag {
  font-family: var(--font-body);
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.26em;
  color: var(--gold);
  text-transform: uppercase;
  display: block;
  margin-bottom: 0.5rem;
}

.section-heading {
  font-family: var(--font-display);
  font-size: clamp(2rem, 4vw, 3.2rem);
  font-weight: 400;
  color: var(--charcoal);
  line-height: 1.15;
}

.scroll-hint {
  font-family: var(--font-body);
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.2em;
  color: var(--muted);
  text-transform: uppercase;
}

/* Horizontal Runway */
.horizontal-track {
  display: flex;
  height: 80vh;
  min-height: 620px;
  width: max-content;
  will-change: transform;
  padding-left: 3rem;
  padding-right: 8rem;
  padding-bottom: 3rem;
}

.story-panel {
  width: clamp(650px, 68vw, 980px);
  height: 100%;
  padding: 1.5rem 2.5rem;
  display: flex;
  align-items: center;
  flex-shrink: 0;
}

.panel-content {
  display: grid;
  grid-template-columns: 1fr 1.25fr;
  align-items: center;
  gap: 3.5rem;
  width: 100%;
  height: 100%;
  background: var(--ivory);
  border: 1px solid var(--border-gold);
  border-radius: 16px;
  padding: 3rem;
  box-shadow: 0 15px 45px rgba(28, 28, 26, 0.04);
}

/* Narrative Column */
.panel-narrative {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.chapter-badge {
  font-family: var(--font-body);
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.22em;
  color: var(--gold);
  text-transform: uppercase;
  margin-bottom: 0.5rem;
}

.chapter-year {
  font-family: var(--font-display);
  font-size: clamp(3.5rem, 6.5vw, 5.5rem);
  font-weight: 300;
  line-height: 0.95;
  color: var(--deep-green);
  letter-spacing: -0.02em;
  margin-bottom: 0.5rem;
}

.chapter-title {
  font-family: var(--font-display);
  font-size: clamp(1.4rem, 2.2vw, 2rem);
  font-weight: 500;
  color: var(--charcoal);
  margin-bottom: 0.25rem;
}

.chapter-location {
  font-family: var(--font-body);
  font-size: 0.85rem;
  font-weight: 500;
  color: var(--muted);
  margin-bottom: 1.25rem;
}

.chapter-line {
  width: 45px;
  height: 1px;
  background: var(--gold);
  opacity: 0.5;
  margin-bottom: 1.5rem;
}

.chapter-quote {
  font-family: var(--font-display);
  font-size: clamp(1.05rem, 1.4vw, 1.3rem);
  font-style: italic;
  line-height: 1.6;
  color: #4a4641;
}

/* Visual Column */
.panel-visual {
  display: flex;
  flex-direction: column;
  height: 100%;
  justify-content: center;
}

.image-frame {
  position: relative;
  width: 100%;
  height: 380px;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
}

.chapter-media {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  will-change: transform;
}

.image-overlay-subtle {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, transparent 60%, rgba(28, 28, 26, 0.2) 100%);
  pointer-events: none;
}

.image-footnote {
  display: flex;
  justify-content: space-between;
  margin-top: 0.85rem;
  font-family: var(--font-body);
  font-size: 0.68rem;
  letter-spacing: 0.18em;
  color: var(--muted);
  text-transform: uppercase;
}

/* Responsive adjustments */
@media (max-width: 900px) {
  .horizontal-track {
    height: auto;
    width: 100%;
    flex-direction: column;
    padding: 0 1.5rem 3rem 1.5rem;
  }

  .story-panel {
    width: 100%;
    padding: 1.5rem 0;
  }

  .panel-content {
    grid-template-columns: 1fr;
    gap: 2rem;
    padding: 2rem 1.5rem;
  }

  .story-intro-bar {
    padding: 0 1.5rem;
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
  }

  .image-frame {
    height: 280px;
  }
}
</style>
