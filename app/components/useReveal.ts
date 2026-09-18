"use client";
import { useEffect, useRef } from "react";

export function useReveal(threshold = 0.15) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.querySelectorAll(".reveal").forEach((node) =>
            node.classList.add("visible")
          );
          el.querySelectorAll(".char").forEach((node, i) => {
            setTimeout(() => node.classList.add("visible"), i * 28);
          });
          obs.disconnect();
        }
      },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);

  return ref;
}
