<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const sectionRef = ref<HTMLElement | null>(null);
let ctx: gsap.Context | null = null;

onMounted(() => {
  if (!sectionRef.value) return;

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReducedMotion) return;

  ctx = gsap.context(() => {
    // Parallax floating shift on editorial photographs as user scrolls
    gsap.utils.toArray<HTMLElement>(".parallax-media").forEach((el) => {
      const speed = parseFloat(el.getAttribute("data-speed") || "0.08");
      gsap.fromTo(
        el,
        { y: -20 * speed * 10 },
        {
          y: 25 * speed * 10,
          ease: "none",
          scrollTrigger: {
            trigger: el,
            start: "top bottom",
            end: "bottom top",
            scrub: 1.2,
          },
        }
      );
    });

    // Reveal animation for photo frames
    gsap.utils.toArray<HTMLElement>(".flow-frame").forEach((frame) => {
      gsap.fromTo(
        frame,
        { opacity: 0, y: 35, scale: 0.98 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: frame,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        }
      );
    });
  }, sectionRef.value);
});

onUnmounted(() => {
  ctx?.revert();
});
</script>

<template>
  <section ref="sectionRef" class="photo-experience-section">
    <!-- Part A: US — A NEW BEGINNING -->
    <div class="us-feature-block">
      <div class="feature-header">
        <span class="cross-star" aria-hidden="true">✦</span>
        <h2 class="us-title">US</h2>
        <p class="us-subtitle">A NEW BEGINNING</p>
        <div class="us-divider"></div>
        <p class="us-quote">
          "Two souls with but a single thought, two hearts that beat as one."
        </p>
      </div>

      <!-- Centerpiece Portrait -->
      <div class="centerpiece-frame flow-frame">
        <img
          src="/photos/horizonsareeclose-opt.webp"
          alt="Divya and John - A New Beginning"
          class="centerpiece-img parallax-media"
          data-speed="0.05"
          loading="lazy"
        />
        <div class="frame-caption-bar">
          <span class="caption-tag">CHAPTER I</span>
          <span class="caption-text">DIVYA & JOHN</span>
        </div>
      </div>
    </div>

    <!-- Part B: EDITORIAL PHOTO FLOW -->
    <div class="editorial-flow-container">
      <!-- ROW 1: [PHOTO]  [PHOTO] -->
      <div class="flow-row row-dual">
        <div class="flow-col col-left">
          <div class="flow-frame frame-portrait">
            <img
              src="/photos/beachrunning-opt.webp"
              alt="Moments by the shore"
              class="flow-img parallax-media"
              data-speed="0.08"
              loading="lazy"
            />
            <div class="frame-tag-subtle">
              <span>UNFILTERED LAUGHTER</span>
            </div>
          </div>
        </div>

        <div class="flow-col col-right offset-down">
          <div class="flow-frame frame-landscape">
            <img
              src="/photos/sareeclose-opt.webp"
              alt="Traditional Grace"
              class="flow-img parallax-media"
              data-speed="-0.06"
              loading="lazy"
            />
            <div class="frame-tag-subtle">
              <span>GRACE & PROMISE</span>
            </div>
          </div>
        </div>
      </div>

      <!-- ROW 2: [PHOTO] (Full-width Centerpiece) -->
      <div class="flow-row row-single">
        <div class="flow-frame frame-wide">
          <img
            src="/photos/horizonsareeclosesit-opt.webp"
            alt="Moments at Dusk"
            class="flow-img parallax-media"
            data-speed="0.04"
            loading="lazy"
          />
          <div class="wide-caption-overlay">
            <p class="wide-quote">"Where you go I will go, and where you stay I will stay."</p>
            <span class="wide-meta">RUTH 1:16</span>
          </div>
        </div>
      </div>

      <!-- ROW 3: [PHOTO]  [PHOTO] -->
      <div class="flow-row row-dual">
        <div class="flow-col col-left offset-up">
          <div class="flow-frame frame-square">
            <img
              src="/photos/jenasclose-opt.webp"
              alt="Together in love"
              class="flow-img parallax-media"
              data-speed="0.07"
              loading="lazy"
            />
            <div class="frame-tag-subtle">
              <span>SIDE BY SIDE</span>
            </div>
          </div>
        </div>

        <div class="flow-col col-right">
          <div class="flow-frame frame-tall">
            <img
              src="/photos/image-copy-opt.webp"
              alt="Everyday Joy"
              class="flow-img parallax-media"
              data-speed="-0.08"
              loading="lazy"
            />
            <div class="frame-tag-subtle">
              <span>SHARED MEMORIES</span>
            </div>
          </div>
        </div>
      </div>

      <!-- ROW 4: [PHOTO] (Centered Final Narrative Portrait) -->
      <div class="flow-row row-single row-last-feature">
        <div class="flow-frame frame-centered-medium">
          <img
            src="/photos/image-opt.webp"
            alt="Cherished times"
            class="flow-img parallax-media"
            data-speed="0.05"
            loading="lazy"
          />
          <div class="frame-tag-subtle">
            <span>FOREVER IN HARMONY</span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.photo-experience-section {
  position: relative;
  background-color: var(--warm-white);
  color: var(--charcoal);
  padding: 6rem 1.5rem 8rem 1.5rem;
  overflow: hidden;
}

/* Part A: US - A New Beginning */
.us-feature-block {
  max-width: 1050px;
  margin: 0 auto 6rem auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.feature-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 3.5rem;
}

.cross-star {
  font-size: 1.25rem;
  color: var(--gold);
  margin-bottom: 0.75rem;
}

.us-title {
  font-family: var(--font-display);
  font-size: clamp(3.5rem, 8vw, 6.5rem);
  font-weight: 300;
  letter-spacing: 0.16em;
  color: var(--charcoal);
  line-height: 0.95;
  text-transform: uppercase;
}

.us-subtitle {
  font-family: var(--font-body);
  font-size: clamp(0.72rem, 1.2vw, 0.85rem);
  font-weight: 600;
  letter-spacing: 0.28em;
  color: var(--deep-green);
  text-transform: uppercase;
  margin-top: 0.5rem;
}

.us-divider {
  width: 50px;
  height: 1px;
  background-color: var(--gold);
  opacity: 0.5;
  margin: 1.5rem 0 1.25rem 0;
}

.us-quote {
  font-family: var(--font-display);
  font-size: clamp(1.15rem, 2.2vw, 1.55rem);
  font-style: italic;
  font-weight: 400;
  color: var(--muted);
  max-width: 580px;
  line-height: 1.5;
}

/* Centerpiece Frame */
.centerpiece-frame {
  position: relative;
  width: 100%;
  max-width: 900px;
  height: clamp(380px, 60vh, 620px);
  border-radius: 18px;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(28, 28, 26, 0.08);
  border: 1px solid var(--border-gold);
}

.centerpiece-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center 30%;
  display: block;
}

.frame-caption-bar {
  position: absolute;
  bottom: 1.25rem;
  left: 1.25rem;
  right: 1.25rem;
  background: rgba(28, 28, 26, 0.65);
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  border-radius: 10px;
  padding: 0.75rem 1.25rem;
  display: flex;
  justify-content: space-between;
  color: var(--white);
  font-family: var(--font-body);
  font-size: 0.72rem;
  letter-spacing: 0.18em;
}

.caption-tag {
  color: var(--gold-light);
  font-weight: 600;
}

/* Part B: Editorial Asymmetrical Photo Flow */
.editorial-flow-container {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: clamp(4rem, 8vw, 7rem);
}

.flow-row {
  width: 100%;
}

/* Dual Column Rows */
.row-dual {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: clamp(2rem, 5vw, 4.5rem);
  align-items: center;
}

.flow-col {
  display: flex;
  flex-direction: column;
}

.offset-down {
  transform: translateY(clamp(20px, 4vw, 55px));
}

.offset-up {
  transform: translateY(clamp(-20px, -4vw, -45px));
}

/* Frames & Proportions */
.flow-frame {
  position: relative;
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid var(--border-gold);
  background-color: var(--ivory);
  box-shadow: 0 15px 40px rgba(28, 28, 26, 0.05);
  transition: transform 0.4s ease, box-shadow 0.4s ease;
}

.flow-frame:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 50px rgba(28, 28, 26, 0.09);
}

.flow-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.frame-portrait {
  height: clamp(380px, 48vh, 550px);
}

.frame-landscape {
  height: clamp(300px, 38vh, 420px);
}

.frame-square {
  height: clamp(320px, 40vh, 460px);
}

.frame-tall {
  height: clamp(420px, 54vh, 600px);
}

.frame-tag-subtle {
  position: absolute;
  bottom: 0.85rem;
  left: 0.85rem;
  background: rgba(28, 28, 26, 0.6);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  padding: 0.4rem 0.85rem;
  border-radius: 6px;
  color: var(--gold-pale);
  font-family: var(--font-body);
  font-size: 0.65rem;
  letter-spacing: 0.16em;
  font-weight: 500;
  text-transform: uppercase;
}

/* Wide Frame (Row 2) */
.frame-wide {
  width: 100%;
  height: clamp(350px, 50vh, 520px);
}

.wide-caption-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, transparent 40%, rgba(28, 28, 26, 0.8) 100%);
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 2.5rem;
  color: var(--white);
  text-align: center;
}

.wide-quote {
  font-family: var(--font-display);
  font-size: clamp(1.2rem, 2.5vw, 1.85rem);
  font-style: italic;
  font-weight: 400;
  color: var(--ivory);
  margin-bottom: 0.4rem;
}

.wide-meta {
  font-family: var(--font-body);
  font-size: 0.72rem;
  letter-spacing: 0.24em;
  color: var(--gold-light);
}

/* Centered Medium Frame (Row 4) */
.row-last-feature {
  display: flex;
  justify-content: center;
}

.frame-centered-medium {
  width: 100%;
  max-width: 680px;
  height: clamp(340px, 45vh, 480px);
}

/* Mobile */
@media (max-width: 768px) {
  .row-dual {
    grid-template-columns: 1fr;
    gap: 2.5rem;
  }

  .offset-down, .offset-up {
    transform: none;
  }

  .frame-portrait, .frame-landscape, .frame-square, .frame-tall, .frame-wide, .frame-centered-medium {
    height: 320px;
  }

  .wide-caption-overlay {
    padding: 1.5rem;
  }

  .photo-experience-section {
    padding: 4rem 1rem 6rem 1rem;
  }
}
</style>
