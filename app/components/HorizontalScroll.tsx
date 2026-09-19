"use client";
import { useEffect, useRef, useState, ReactNode } from "react";
import gsap from "gsap";
import ScrollProgressLine from "./ScrollProgressLine";
import s from "./HorizontalScroll.module.css";

const HOVER_SCALE = 1.5;
const TARGET_Y = -120;
const TARGET_X = 60;
const SCALE_SCROLL_RANGE = 1000;
const WHEEL_THRESHOLD = 24;
const DRAG_THRESHOLD = 60;

interface Props {
  children: ReactNode | ReactNode[];
  onScrollToLast: () => void;
  onHeroProgress?: (p: number) => void;
  onScaleProgress?: (p: number) => void;
  lang: "en" | "ar";
  resetTrigger?: number;
  registerHoverControl?: (setHovered: (v: boolean) => void) => void;
  registerScrollToForm?: (scrollFn: () => void) => void;
  registerScrollToIndex?: (scrollFn: (index: number) => void) => void;
}

export default function HorizontalScroll({ children, onScrollToLast, onHeroProgress, onScaleProgress, lang, resetTrigger, registerHoverControl, registerScrollToForm, registerScrollToIndex }: Props) {
  // null = not yet measured. Rendering nothing avoids emitting the desktop
  // 600vw track on mobile (which expands the layout viewport and pushes the
  // fixed loader to the bottom/right corner) before we know the width.
  const [isMobile, setIsMobile] = useState<boolean | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const progressRef = useRef<number>(0);

  const scrollRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  const scrollTweenRef = useRef<gsap.core.Tween | null>(null);

  const isImageHoveredRef = useRef(false);
  const scaleScrollAccRef = useRef(0);
  const firstPanelRef = useRef<HTMLDivElement | null>(null);
  const targetScaleRef = useRef(1);
  const targetYRef = useRef(0);
  const targetXRef = useRef(0);
  const scaleRafRef = useRef<number | null>(null);
  const currentScaleRef = useRef(1);
  const currentYAnimRef = useRef(0);
  const currentXAnimRef = useRef(0);

  const panels = Array.isArray(children) ? children : [children];
  const total = panels.length;

  // Snap to a given section index with a professional eased tween.
  const snapToSectionRef = useRef<(index: number) => void>(() => {});
  snapToSectionRef.current = (index: number) => {
    const maxScroll = (total - 1) * window.innerWidth;
    const target = Math.max(0, Math.min(maxScroll, index * window.innerWidth));
    if (scrollTweenRef.current) scrollTweenRef.current.kill();
    const from = scrollRef.current;
    if (Math.abs(target - from) < 1) return;
    const proxy = { v: from };
    scrollTweenRef.current = gsap.to(proxy, {
      v: target,
      duration: Math.min(1.1, Math.max(0.7, (Math.abs(target - from) / window.innerWidth) * 0.9 + 0.4)),
      ease: "expo.inOut",
      onUpdate: () => {
        scrollRef.current = proxy.v;
      },
      onComplete: () => {
        scrollRef.current = target;
        scrollTweenRef.current = null;
        const p = maxScroll > 0 ? scrollRef.current / maxScroll : 0;
        progressRef.current = p;
        onScrollToLast();
      },
    });
  };

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
        // On desktop, snap to the last panel
        snapToSectionRef.current(total - 1);
      }
    });
  }, [registerScrollToForm, isMobile, total]);

  useEffect(() => {
    const loop = () => {
      const el = firstPanelRef.current;
      if (el) {
        const changed =
          Math.abs(targetScaleRef.current - currentScaleRef.current) > 0.0005 ||
          Math.abs(targetYRef.current - currentYAnimRef.current) > 0.05 ||
          Math.abs(targetXRef.current - currentXAnimRef.current) > 0.05;
        if (changed) {
          currentScaleRef.current += (targetScaleRef.current - currentScaleRef.current) * 0.4;
          currentYAnimRef.current += (targetYRef.current    - currentYAnimRef.current)  * 0.4;
          currentXAnimRef.current += (targetXRef.current    - currentXAnimRef.current)  * 0.4;
          gsap.set(el, { scale: currentScaleRef.current, y: currentYAnimRef.current, x: currentXAnimRef.current });
        }
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
    if (scrollTweenRef.current) { scrollTweenRef.current.kill(); scrollTweenRef.current = null; }
    scaleScrollAccRef.current = 0;
    if (trackRef.current) trackRef.current.style.transform = `translate3d(0px, 0, 0)`;
    if (firstPanelRef.current) gsap.set(firstPanelRef.current, { scale: 1, y: 0, x: 0 });
  }, [resetTrigger]);

  useEffect(() => {
    if (!registerScrollToIndex) return;
    registerScrollToIndex((index) => {
      if (isMobile) {
        const panel = document.querySelector(`[data-panel="${index}"]`);
        if (panel) panel.scrollIntoView({ behavior: "smooth", block: "start" });
      } else {
        snapToSectionRef.current(index);
      }
    });
  }, [registerScrollToIndex, isMobile, total]);

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
      const v = scrollRef.current;
      if (Math.abs(v - lastRenderedScroll) > 0.5) {
        lastRenderedScroll = v;
        if (trackRef.current) {
          trackRef.current.style.transform = `translate3d(${-v}px, 0, 0)`;
        }
        const maxScroll = (total - 1) * window.innerWidth;
        const p = maxScroll > 0 ? v / maxScroll : 0;
        progressRef.current = p;
        onHeroProgress?.(Math.min(1, v / window.innerWidth));
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
    let wheelAcc = 0;
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
      wheelAcc += e.deltaY;
      if (Math.abs(wheelAcc) < WHEEL_THRESHOLD) return;
      const dir = wheelAcc > 0 ? 1 : -1;
      wheelAcc = 0;
      if (scrollTweenRef.current) return; // lock during snap
      const cur = Math.round(scrollRef.current / window.innerWidth);
      const next = Math.max(0, Math.min(total - 1, cur + dir));
      if (next !== cur) snapToSectionRef.current(next);
    }
    window.addEventListener("wheel", onWheel, { passive: false });
    return () => window.removeEventListener("wheel", onWheel);
  }, [isMobile, total]);

  useEffect(() => {
    if (isMobile) return;
    let originY = 0, lastY = 0, isDragging = false;
    const onStart = (e: TouchEvent) => {
      originY = e.touches[0].clientY;
      lastY = originY;
      isDragging = true;
      if (scrollTweenRef.current) { scrollTweenRef.current.kill(); scrollTweenRef.current = null; }
    };
    const onMove = (e: TouchEvent) => {
      if (!isDragging) return;
      e.preventDefault(); // Prevent default to allow custom scroll
      lastY = e.touches[0].clientY;
      // Live-track the finger (clamped)
      const delta = (originY - lastY);
      const maxScroll = (total - 1) * window.innerWidth;
      scrollRef.current = Math.max(0, Math.min(maxScroll, scrollRef.current + delta));
      originY = lastY;
    };
    const onEnd = () => {
      if (!isDragging) return;
      isDragging = false;
      // Snap to the nearest section boundary based on the drag direction
      const cur = Math.round(scrollRef.current / window.innerWidth);
      const overshoot = scrollRef.current - cur * window.innerWidth;
      let next = cur;
      if (overshoot > DRAG_THRESHOLD) next = Math.min(total - 1, cur + 1);
      else if (overshoot < -DRAG_THRESHOLD) next = Math.max(0, cur - 1);
      snapToSectionRef.current(next);
    };
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
        if (scrollTweenRef.current) return;
        snapToSectionRef.current(Math.min(total - 1, cur + 1));
      } else if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
        e.preventDefault();
        const cur = Math.round(scrollRef.current / window.innerWidth);
        if (scrollTweenRef.current) return;
        snapToSectionRef.current(Math.max(0, cur - 1));
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isMobile, total]);

  // Until the viewport is measured (SSR + first commit), render nothing so the
  // desktop track (width: 600vw, fixed) never touches a mobile screen layout.
  if (isMobile === null) return null;

  if (isMobile) {
    return (
      <div dir="ltr" className={s.mobileWrapper}>
        <ScrollProgressLine progressRef={progressRef} />
        {panels.map((child, i) => (
          <div 
            key={i}
            data-panel={i}
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
            data-panel={i}
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
