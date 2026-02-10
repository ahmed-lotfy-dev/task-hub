import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

interface GSAPProviderProps {
  children: React.ReactNode;
}

export function GSAPProvider({ children }: GSAPProviderProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      // Global subtle fade-in for page elements
      gsap.fromTo(
        ".gsap-fade-in",
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: "power2.out",
          stagger: 0.05,
          scrollTrigger: {
            trigger: ".gsap-fade-in",
            start: "top 85%",
            toggleActions: "play none none none",
          },
        }
      );

      // Stagger animation for lists
      gsap.fromTo(
        ".gsap-stagger-item",
        { opacity: 0, x: -10 },
        {
          opacity: 1,
          x: 0,
          duration: 0.4,
          ease: "power2.out",
          stagger: 0.08,
          scrollTrigger: {
            trigger: ".gsap-stagger-container",
            start: "top 80%",
            toggleActions: "play none none none",
          },
        }
      );

      // Scale in animation for cards
      gsap.fromTo(
        ".gsap-scale-in",
        { opacity: 0, scale: 0.95 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.5,
          ease: "power2.out",
          stagger: 0.1,
          scrollTrigger: {
            trigger: ".gsap-scale-in",
            start: "top 85%",
            toggleActions: "play none none none",
          },
        }
      );
    },
    { scope: containerRef }
  );

  // Refresh ScrollTrigger on route changes
  useEffect(() => {
    ScrollTrigger.refresh();
    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return <div ref={containerRef}>{children}</div>;
}

// Hook for page transitions
export function usePageTransition() {
  const pageRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (pageRef.current) {
        gsap.fromTo(
          pageRef.current,
          { opacity: 0, y: 10 },
          { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" }
        );
      }
    },
    { scope: pageRef }
  );

  return pageRef;
}

// Hook for staggered list animations
export function useStaggerAnimation<T extends HTMLElement>(
  itemsCount: number,
  delay = 0
) {
  const containerRef = useRef<T>(null);

  useGSAP(
    () => {
      if (containerRef.current) {
        const items = containerRef.current.children;
        gsap.fromTo(
          items,
          { opacity: 0, y: 15 },
          {
            opacity: 1,
            y: 0,
            duration: 0.4,
            ease: "power2.out",
            stagger: 0.06,
            delay,
          }
        );
      }
    },
    { scope: containerRef, dependencies: [itemsCount] }
  );

  return containerRef;
}

// Hook for hover animations
export function useHoverAnimation<T extends HTMLElement>() {
  const elementRef = useRef<T>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const onMouseEnter = () => {
      gsap.to(element, { scale: 1.02, duration: 0.2, ease: "power2.out" });
    };

    const onMouseLeave = () => {
      gsap.to(element, { scale: 1, duration: 0.2, ease: "power2.out" });
    };

    element.addEventListener("mouseenter", onMouseEnter);
    element.addEventListener("mouseleave", onMouseLeave);

    return () => {
      element.removeEventListener("mouseenter", onMouseEnter);
      element.removeEventListener("mouseleave", onMouseLeave);
    };
  }, []);

  return elementRef;
}
