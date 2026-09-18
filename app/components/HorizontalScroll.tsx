"use client";
import { useEffect, useRef, useState, ReactNode } from "react";
import gsap from "gsap";
import ScrollProgressLine from "./ScrollProgressLine";
import s from "./HorizontalScroll.module.css";

const HOVER_SCALE = 3;
const TARGET_Y = -300;
const TARGET_X = 200;
const SCALE_SCROLL_RANGE = 2500;

interface Props {
  children: ReactNode | ReactNode[];
  onScrollToLast: () => void;
  onHeroProgress?: (p: number) => void;
  onScaleProgress?: (p: number) => void;
  lang: "en" | "ar";
  resetTrigger?: number;
  registerHoverControl?: (setHovered: (v: boolean) => void) => void;
  registerScrollToForm?: (scrollFn: () => void) => void;
}

export default function HorizontalScroll({ children, onScrollToLast, onHeroProgress, onScaleProgress, lang, resetTrigger, registerHoverControl, registerScrollToForm }: Props) {
  const [isMobile, setIsMobile] = useState(false);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const progressRef = useRef<number>(0);

  const scrollRef = useRef(0);
  const targetScrollRef = useRef(0);
  const rafRef = useRef<number | null>(null);

  const isImageHoveredRef = useRef(false);
  const scaleScrollAccRef = useRef(0);
  const firstPanelRef = useRef<HTMLDivElement | null>(null);
  const quickYRef = useRef<((v: number) => void) | null>(null);
  const targetScaleRef = useRef(1);
  const targetYRef = useRef(0);
  const scaleRafRef = useRef<number | null>(null);
  const currentScaleRef = useRef(1);
  const currentYAnimRef = useRef(0);
  const currentXAnimRef = useRef(0);
  const targetXRef = useRef(0);

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
    const loop = () => {
      const el = firstPanelRef.current;
      if (el) {
        currentScaleRef.current += (targetScaleRef.current - currentScaleRef.current) * 0.18;
        currentYAnimRef.current += (targetYRef.current    - currentYAnimRef.current)  * 0.18;
        currentXAnimRef.current += (targetXRef.current    - currentXAnimRef.current)  * 0.18;
        gsap.set(el, { scale: currentScaleRef.current, y: currentYAnimRef.current, x: currentXAnimRef.current });
      }
      scaleRafRef.current = requestAnimationFrame(loop);
    };
    scaleRafRef.current = requestAnimationFrame(loop);
    return () => { if (scaleRafRef.current) cancelAnimationFrame(scaleRafRef.current); };
  }, []);

  useEffect(() => {
    if (!registerHoverControl) return;
    registerHoverControl((v: boolean) => {
      isImageHoveredRef.current = v;
    });
  }, [registerHoverControl]);

  useEffect(() => {
    scrollRef.current = 0;
    targetScrollRef.current = 0;
    scaleScrollAccRef.current = 0;
    if (trackRef.current) trackRef.current.style.transform = `translate3d(0px, 0, 0)`;
    if (firstPanelRef.current) gsap.set(firstPanelRef.current, { scale: 1, y: 0 });
  }, [resetTrigger]);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    if (isMobile) return;
    function animate() {
      const diff = targetScrollRef.current - scrollRef.current;
      if (Math.abs(diff) > 0.5) {
        scrollRef.current += diff * 0.12;
      } else {
        scrollRef.current = targetScrollRef.current;
      }
      // Direct DOM update instead of setState
      if (trackRef.current) {
        trackRef.current.style.transform = `translate3d(${-scrollRef.current}px, 0, 0)`;
      }
      const maxScroll = (total - 1) * window.innerWidth;
      const p = maxScroll > 0 ? scrollRef.current / maxScroll : 0;
      progressRef.current = p;
      onHeroProgress?.(Math.min(1, scrollRef.current / window.innerWidth));
      if (Math.abs(scrollRef.current - maxScroll) < 50) onScrollToLast();
      rafRef.current = requestAnimationFrame(animate);
    }
    rafRef.current = requestAnimationFrame(animate);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [isMobile, total, onScrollToLast]);

  useEffect(() => {
    if (isMobile) return;
    function onWheel(e: WheelEvent) {
      e.preventDefault();
      if (isImageHoveredRef.current) {
        scaleScrollAccRef.current = Math.max(0, Math.min(SCALE_SCROLL_RANGE, scaleScrollAccRef.current + e.deltaY));
        const p = scaleScrollAccRef.current / SCALE_SCROLL_RANGE;
        targetScaleRef.current = 1 + p * (HOVER_SCALE - 1);
        targetYRef.current = p * TARGET_Y;
        targetXRef.current = p * TARGET_X;
        onScaleProgress?.(p);
        return;
      }
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
              minHeight: '100vh',
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
            ref={i === 0 ? (el) => { if (el) firstPanelRef.current = el; } : undefined}
            className={s.panel}
          >
            {child}
          </div>
        ))}
      </div>
    </>
  );
}
