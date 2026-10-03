import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { onMounted, onUnmounted, ref } from "vue";

gsap.registerPlugin(ScrollTrigger);

export function useLenis() {
  const lenisInstance = ref<Lenis | null>(null);

  onMounted(() => {
    // Skip on touch/mobile devices — native scroll is faster & hardware-accelerated
    const isTouchDevice = window.matchMedia("(pointer: coarse)").matches;
    if (isTouchDevice) return;

    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const lenis = new Lenis({
      duration: 1.25,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 0.95,
    });

    lenisInstance.value = lenis;

    // Synchronize Lenis with GSAP ScrollTrigger
    lenis.on("scroll", ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);
  });

  onUnmounted(() => {
    if (lenisInstance.value) {
      lenisInstance.value.destroy();
      lenisInstance.value = null;
    }
  });

  return {
    lenis: lenisInstance,
  };
}
