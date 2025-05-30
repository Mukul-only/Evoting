import { useEffect, useRef } from "react";
import Lenis from "@studio-freight/lenis";
// import LocomotiveScroll from 'locomotive-scroll'; // Choose one or combine carefully
// For this example, we'll primarily use Lenis as it's more modern and often simpler for React

const useSmoothScroll = (options = {}) => {
  const lenisRef = useRef(null);

  useEffect(() => {
    const lenis = new Lenis({
      duration: options.duration || 1.2,
      easing:
        options.easing || ((t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))),
      smoothTouch: options.smoothTouch || false,
      touchMultiplier: options.touchMultiplier || 2,
      ...options,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);
    lenisRef.current = lenis;

    return () => {
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [options]); // Re-initialize if options change

  return lenisRef; // You can return the instance if needed for direct manipulation
};

export default useSmoothScroll;
