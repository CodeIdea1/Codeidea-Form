"use client";
import { useEffect, useRef, useState, ReactNode } from "react";
import ScrollProgressLine from "./ScrollProgressLine";
import s from "./HorizontalScroll.module.css";

interface Props {
  children: ReactNode | ReactNode[];
  onScrollToLast: () => void;
  onHeroProgress?: (p: number) => void;
  lang: "en" | "ar";
  resetTrigger?: number;
  registerScrollToForm?: (scrollFn: () => void) => void;
}

export default function HorizontalScroll({ children, onScrollToLast, onHeroProgress, lang, resetTrigger, registerScrollToForm }: Props) {
  const [isMobile, setIsMobile] = useState(false);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const progressRef = useRef<number>(0);

  const scrollRef = useRef(0);
  const targetScrollRef = useRef(0);
  const rafRef = useRef<number | null>(null);

  const panels = Array.isArray(children) ? children : [children];
  const total = panels.length;

  // Register scroll to form function
  useEffect(() => {
    if (!registerScrollToForm) return;
    registerScrollToForm(() => {
      if (isMobile) {
        // On mobile, scroll to the last section smoothly
        const formSection = document.querySelector('[data-section="form"]');
        if (formSection) {
          formSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      } else {
        // On desktop, set target scroll to last panel
        const maxScroll = (total - 1) * window.innerWidth;
        targetScrollRef.current = maxScroll;
      }
    });
  }, [registerScrollToForm, isMobile, total]);

  useEffect(() => {
    scrollRef.current = 0;
    targetScrollRef.current = 0;
    if (trackRef.current) trackRef.current.style.transform = `translate3d(0px, 0, 0)`;
  }, [resetTrigger]);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    if (isMobile) return;
    let lastRenderedScroll = -1;
    let firedLast = false;
    function animate() {
      const diff = targetScrollRef.current - scrollRef.current;
      if (Math.abs(diff) > 0.5) {
        scrollRef.current += diff * 0.12;
      } else {
        scrollRef.current = targetScrollRef.current;
      }
      if (Math.abs(scrollRef.current - lastRenderedScroll) > 0.5) {
        lastRenderedScroll = scrollRef.current;
        if (trackRef.current) {
          trackRef.current.style.transform = `translate3d(${-scrollRef.current}px, 0, 0)`;
        }
        const maxScroll = (total - 1) * window.innerWidth;
        const p = maxScroll > 0 ? scrollRef.current / maxScroll : 0;
        progressRef.current = p;
        onHeroProgress?.(Math.min(1, scrollRef.current / window.innerWidth));
      }
      const maxScrollNow = (total - 1) * window.innerWidth;
      if (Math.abs(scrollRef.current - maxScrollNow) < 50) {
        if (!firedLast) { firedLast = true; onScrollToLast(); }
      } else {
        firedLast = false;
      }
      rafRef.current = requestAnimationFrame(animate);
    }
    rafRef.current = requestAnimationFrame(animate);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [isMobile, total, onScrollToLast]);

  useEffect(() => {
    if (isMobile) return;
    function onWheel(e: WheelEvent) {
      e.preventDefault();
      const maxScroll = (total - 1) * window.innerWidth;
      targetScrollRef.current = Math.max(0, Math.min(maxScroll, targetScrollRef.current + e.deltaY * 2));
    }
    window.addEventListener("wheel", onWheel, { passive: false });
    return () => window.removeEventListener("wheel", onWheel);
  }, [isMobile, total]);

  useEffect(() => {
    if (isMobile) return;
    let startY = 0, isDragging = false;
    const onStart = (e: TouchEvent) => { 
      startY = e.touches[0].clientY; 
      isDragging = true; 
    };
    const onMove = (e: TouchEvent) => {
      if (!isDragging) return;
      e.preventDefault(); // Prevent default to allow custom scroll
      const delta = (startY - e.touches[0].clientY) * 3;
      const maxScroll = (total - 1) * window.innerWidth;
      targetScrollRef.current = Math.max(0, Math.min(maxScroll, targetScrollRef.current + delta));
      startY = e.touches[0].clientY;
    };
    const onEnd = () => { isDragging = false; };
    window.addEventListener("touchstart", onStart, { passive: true });
    window.addEventListener("touchmove", onMove, { passive: false });
    window.addEventListener("touchend", onEnd, { passive: true });
    return () => {
      window.removeEventListener("touchstart", onStart);
      window.removeEventListener("touchmove", onMove);
      window.removeEventListener("touchend", onEnd);
    };
  }, [isMobile, total]);

  useEffect(() => {
    if (isMobile) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown" || e.key === "ArrowRight") {
        e.preventDefault();
        const cur = Math.round(scrollRef.current / window.innerWidth);
        targetScrollRef.current = Math.min(total - 1, cur + 1) * window.innerWidth;
      } else if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
        e.preventDefault();
        const cur = Math.round(scrollRef.current / window.innerWidth);
        targetScrollRef.current = Math.max(0, cur - 1) * window.innerWidth;
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isMobile, total]);

  if (isMobile) {
    return (
      <div className={s.mobileWrapper}>
        <ScrollProgressLine progressRef={progressRef} />
        {panels.map((child, i) => (
          <div 
            key={i}
            data-section={i === panels.length - 1 ? "form" : undefined}
            style={{ 
              minHeight: '100svh',
              width: '100%'
            }}
          >
            {child}
          </div>
        ))}
      </div>
    );
  }

  return (
    <>
      <ScrollProgressLine progressRef={progressRef} />
      <div
        dir="ltr"
        ref={trackRef}
        className={s.track}
        style={{ width: `${total * 100}vw` }}
      >
        {panels.map((child, i) => (
          <div
            key={i}
            className={s.panel}
          >
            {child}
          </div>
        ))}
      </div>
    </>
  );
}
