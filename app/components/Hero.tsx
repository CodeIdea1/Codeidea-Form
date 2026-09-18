"use client";
import { useEffect, useRef, useState } from "react";
import { Translations, Lang } from "../i18n";
import Image from "next/image";
import gsap from "gsap";
import s from "./Hero.module.css";

function LapParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    canvas.width = Math.floor(canvas.offsetWidth * dpr);
    canvas.height = Math.floor(canvas.offsetHeight * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const w = canvas.offsetWidth, h = canvas.offsetHeight;
    const count = 80;
    type R = { x: number; y: number; baseX: number; baseY: number; size: number; speed: number; opacity: number; angle: number };

    const rising: R[] = Array.from({ length: count }, () => {
      const x = Math.random() * w, y = Math.random() * h;
      return { x, y, baseX: x, baseY: y, size: Math.random() * 0.8 + 0.3, speed: Math.random() * 1.5 + 0.5, opacity: Math.random() * 0.4 + 0.4, angle: Math.random() * Math.PI * 2 };
    });

    let raf: number;
    let lastTime = 0;

    function getColor() {
      const isDark = document.documentElement.classList.contains("dark") || !document.documentElement.classList.contains("light");
      return isDark ? { r: 240, g: 237, b: 232 } : { r: 14, g: 13, b: 11 };
    }

    function loop(t: number) {
      if (t - lastTime < 33) { raf = requestAnimationFrame(loop); return; }
      lastTime = t;
      ctx!.clearRect(0, 0, w, h);
      const { r, g, b } = getColor();

      rising.forEach(p => {
        p.baseY -= p.speed;
        if (p.baseY < -10) { p.baseY = h + 10; p.baseX = Math.random() * w; }
        p.x = p.baseX; p.y = p.baseY;
        ctx!.beginPath();
        ctx!.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx!.fillStyle = `rgba(${r},${g},${b},${p.opacity * 0.55})`;
        ctx!.fill();
      });

      raf = requestAnimationFrame(loop);
    }

    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ position: "absolute", bottom: "1%", right: "46%", width: 380, height: 380, pointerEvents: "none", zIndex: 7 }}
    />
  );
}

const PHRASES = {
  en: [
    { top: "YOU ASKED.",       bottom: "WE BUILT IT." },
    { top: "LEARN THE",        bottom: "CRAFT." },
    { top: "START YOUR",       bottom: "JOURNEY." },
  ],
  ar: [
    { top: "طلبتوا.",          bottom: "بنيناه لكم." },
    { top: "تعلّم",            bottom: "الحرفة." },
    { top: "ابدأ",             bottom: "رحلتك." },
  ],
};

function CenterHeadline({ lang, hFont, switchRef, show, isMobile, scaleProgressRef, insideLap }: {
  lang: Lang;
  hFont: string;
  switchRef?: React.MutableRefObject<((next: number) => void) | null>;
  show?: boolean;
  isMobile?: boolean;
  scaleProgressRef?: React.MutableRefObject<number>;
  insideLap?: boolean;
}) {
  const phrases = PHRASES[lang];
  const [idx, setIdx] = useState(0);
  const animatingRef = useRef(false);
  const topRef = useRef<HTMLSpanElement>(null);
  const botRef = useRef<HTMLSpanElement>(null);
  const currentIdx = useRef(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const [isDesktop, setIsDesktop] = useState(false);

  // Detect desktop
  useEffect(() => {
    const checkDesktop = () => setIsDesktop(window.innerWidth >= 769);
    checkDesktop();
    window.addEventListener('resize', checkDesktop);
    return () => window.removeEventListener('resize', checkDesktop);
  }, []);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    if (!show) {
      gsap.set(root, { autoAlpha: 0, y: 40 });
      return;
    }
    gsap.fromTo(
      root,
      { autoAlpha: 0, y: 40 },
      { autoAlpha: 1, y: 0, duration: 1, delay: 1.7, ease: "power3.out" }
    );
  }, [show]);

  // Desktop: switch phrase with scaleProgress - poll ref via interval
  const lastDesktopIdx = useRef(-1);
  const pendingIdxRef = useRef(-1);
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!isDesktop || !show) return;
    const interval = setInterval(() => {
      const p = scaleProgressRef?.current ?? 0;
      const next = p < 0.33 ? 0 : p < 0.66 ? 1 : 2;
      if (next === lastDesktopIdx.current) return;
      pendingIdxRef.current = next;
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
      debounceTimer.current = setTimeout(() => {
        const target = pendingIdxRef.current;
        if (target === lastDesktopIdx.current) return;
        lastDesktopIdx.current = target;
        const top = topRef.current;
        const bot = botRef.current;
        if (!top || !bot) return;
        gsap.killTweensOf([top, bot]);
        gsap.to([top, bot], {
          opacity: 0, y: -15, filter: 'blur(8px)',
          duration: 0.35, ease: 'power2.in', stagger: 0.06,
          onComplete: () => {
            currentIdx.current = target;
            setIdx(target);
            gsap.fromTo([top, bot],
              { opacity: 0, y: 18, filter: 'blur(8px)' },
              { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.55, ease: 'power3.out', stagger: 0.1, overwrite: true }
            );
          }
        });
      }, 350);
    }, 100);
    return () => clearInterval(interval);
  }, [isDesktop, show, scaleProgressRef]);

  // Auto-rotate phrases on mobile only
  useEffect(() => {
    if (isDesktop || !show) return;
    
    const interval = setInterval(() => {
      const nextIdx = (currentIdx.current + 1) % phrases.length;
      switchTo(nextIdx);
    }, 2200);

    return () => clearInterval(interval);
  }, [isDesktop, show, phrases.length]);

  const switchTo = (next: number) => {
    if (animatingRef.current || next === currentIdx.current) return;
    const top = topRef.current;
    const bot = botRef.current;
    if (!top || !bot) return;
    animatingRef.current = true;

    // Slower fade-out: going up with smooth opacity fade
    gsap.to([top, bot], {
      opacity: 0,
      scale: 0.8,
      filter: 'blur(15px)',
      y: -30,
      duration: 1.5, 
      ease: "power3.in", 
      stagger: 0.2,
      onComplete: () => {
        currentIdx.current = next;
        setIdx(next);
        // Slower fade-in: coming from bottom with smooth animation
        gsap.fromTo(
          [top, bot],
          { 
            opacity: 0, 
            scale: 0.8, 
            filter: 'blur(15px)',
            y: 50
          },
          { 
            opacity: 1, 
            scale: 1,
            filter: 'blur(0px)',
            y: 0,
            duration: 1.8, 
            ease: "power4.out", 
            stagger: 0.25,
            onComplete: () => { animatingRef.current = false; } 
          }
        );
      },
    });
  };

  useEffect(() => {
    if (switchRef) switchRef.current = switchTo;
  });

  useEffect(() => {
    return () => { if (debounceTimer.current) clearTimeout(debounceTimer.current); };
  }, []);

  return (
    <div
      ref={rootRef}
      className={s.centerHeadline}
      style={insideLap ? {
        position: "absolute",
        top: "30%",
        left: "32%",
        transform: "skewY(-5deg) rotateY(-50deg) rotateX(8deg)",
        transformStyle: "preserve-3d",
        perspective: "800px",
        zIndex: 100,
        pointerEvents: "none",
        textAlign: "center",
        lineHeight: 1.1,
      } : {
        position: "absolute",
        bottom: "calc(5% + 80px)",
        right: "calc(13% + 60px)",
        top: "auto",
        left: "auto",
        transform: "translate(50%, 50%) scale(0.58) skewX(-8deg)",
        transformStyle: "preserve-3d",
        perspective: "800px",
        zIndex: 1000,
        pointerEvents: "none",
        textAlign: "center",
        lineHeight: 1.1,
      }}
    >
      <span
        ref={topRef}
        style={{
          display: "block",
          fontFamily: hFont,
          fontSize: isMobile ? "5.5vw" : "2.5vw",
          fontWeight: 700,
          color: "var(--fg)",
          letterSpacing: "-0.04em",
          textTransform: "uppercase",
          marginBottom: "0.1em",
        }}
      >
        {phrases[idx].top}
      </span>
      <span
        ref={botRef}
        style={{
          display: "block",
          fontFamily: hFont,
          fontSize: isMobile ? "5.5vw" : "2.5vw",
          fontWeight: 700,
          color: "var(--accent)",
          letterSpacing: "-0.04em",
          textTransform: "uppercase",
        }}
      >
        {phrases[idx].bottom}
      </span>
    </div>
  );
}

export default function Hero({ onCTA, tr, lang, registerProgress, onHoverChange, scaleProgressRef }: {
  onCTA: () => void;
  tr: Translations;
  lang: Lang;
  registerProgress?: (cb: (p: number) => void) => void;
  onHoverChange?: (hovered: boolean) => void;
  scaleProgressRef?: React.MutableRefObject<number>;
}) {
  const [loaded, setLoaded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const isAr = lang === "ar";
  const hFont = isAr ? "var(--font-arabic)" : "var(--font-geist-sans)";

  const lapRef = useRef<HTMLDivElement>(null);
  const headlineSwitchRef = useRef<((next: number) => void) | null>(null);

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 80);
    return () => clearTimeout(t);
  }, []);

  // Detect mobile screen
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // sync headline with scaleProgress - handled inside CenterHeadline directly

  // Hero section scale/translate on scroll
  useEffect(() => {
    const el = sectionRef.current;
    if (!el || !registerProgress) return;

    // ابتداء بـ scale طبيعي بدون أي تكبير
    gsap.set(el, { scale: 1, x: 0, force3D: true });

    registerProgress((p: number) => {
      if (isMobile) return;
      const scale = 1 - p * 0.15;
      const x = p * -200;
      gsap.set(el, { scale, x, force3D: true, overwrite: "auto" });
    });

    return () => { gsap.killTweensOf(el); };
  }, [registerProgress]);

  // lap.png animation setup
  useEffect(() => {
    const el = lapRef.current;
    if (!el) return;

    // In mobile: show immediately without animation
    if (isMobile) {
      el.style.opacity = '1';
      el.style.transform = 'none';
      return;
    }

    // Desktop: use GSAP animation
    gsap.set(el, {
      scale: 0.85,
      y: 50,
      opacity: 0,
      skewY: 6,
      rotationY: -18,
      rotationX: 10,
      transformPerspective: 900,
      force3D: true,
    });

    const mountTween = gsap.to(el, {
      scale: 1,
      y: 0,
      opacity: 1,
      duration: 1.2,
      delay: 1.3,
      ease: "power3.out",
    });

    return () => {
      mountTween.kill();
    };
  }, [isMobile]);

  return (
    <>
      {/* Images layer - outside section to avoid scale transform */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 1 }}>
        {/* Hero main image */}
        <div className={`${s.heroImg} ${s.heroImgEn} ${loaded ? s.heroImgLoaded : s.heroImgHidden}`} style={{ pointerEvents: 'none' }}>
          <Image 
            src="/saja.png"
            alt="Hero" 
            fill 
            priority 
            style={{ objectFit: "contain", objectPosition: "bottom" }} 
          />
          <div className={`${s.heroHair} ${s.hairMain}`}>
            <Image src="/main-hair.png" alt="" fill style={{ objectFit: "contain", pointerEvents: "none" }} />
          </div>
          <div className={`${s.heroHair} ${s.hair2El}`}>
            <Image src="/hair2.png" alt="" fill style={{ objectFit: "contain", pointerEvents: "none" }} />
          </div>
          <div className={`${s.heroHair} ${s.hair3El}`}>
            <Image src="/hair-33.png" alt="" fill style={{ objectFit: "contain", pointerEvents: "none" }} />
          </div>
        </div>

        {/* lap.png */}
        <div
          ref={lapRef}
          className={s.lap}
          style={{ pointerEvents: isMobile ? 'none' : 'auto' }}
          onMouseEnter={() => {
            if (isMobile) return;
            onHoverChange?.(true);
            headlineSwitchRef.current?.(1);
          }}
          onMouseLeave={() => {
            if (isMobile) return;
            onHoverChange?.(false);
            headlineSwitchRef.current?.(0);
          }}
        >
          <Image src="/lappp.png" alt="" fill style={{ objectFit: "contain", pointerEvents: "none" }} />
          {/* CenterHeadline inside lap so it moves with it */}
          {!isMobile && (
            <CenterHeadline lang={lang} hFont={hFont} switchRef={headlineSwitchRef} show={loaded} isMobile={false} scaleProgressRef={scaleProgressRef} insideLap />
          )}
        </div>

        {/* mug.png */}
        <div className={`${s.mug} ${loaded ? s.mugLoaded : s.mugHidden}`} style={{ pointerEvents: 'auto' }}>
          <div className={`${s.steamContainer} ${loaded ? s.steamVisible : s.steamHidden}`} aria-hidden="true">
            <span className={`${s.steamBlob} ${s.steam1}`} />
            <span className={`${s.steamBlob} ${s.steam2}`} />
            <span className={`${s.steamBlob} ${s.steam3}`} />
            <span className={`${s.steamBlob} ${s.steam4}`} />
          </div>
          <Image src="/mug2.png" alt="Mug" fill style={{ objectFit: "contain", pointerEvents: "none" }} />
          <div className={s.mugTip} role="tooltip" style={{ fontFamily: hFont }}>
            <span className={s.mugTipStem} aria-hidden="true" />
            <span className={s.mugTipIcon} aria-hidden="true">☕</span>
            <span className={s.mugTipText}>{tr.mugTip}</span>
          </div>
        </div>

        {/* tree */}
        <div className={`${s.tree} ${loaded ? s.treeLoaded : s.treeHidden}`}>
          <Image src="/main-tree.png" alt="" fill style={{ objectFit: "contain", objectPosition: "bottom left", pointerEvents: "none" }} />
          <div className={s.treeLeaf}>
            <Image src="/a-leaf2.png" alt="" fill style={{ objectFit: "contain", pointerEvents: "none" }} />
          </div>
          <div className={`${s.treeLeaf} ${s.leaf2}`}>
            <Image src="/a-leaf-2.png" alt="" fill style={{ objectFit: "contain", pointerEvents: "none" }} />
          </div>
          <div className={`${s.treeLeaf} ${s.leaf3}`}>
            <Image src="/a-leaf-3.png" alt="" fill style={{ objectFit: "contain", pointerEvents: "none" }} />
          </div>
          <div className={`${s.treeLeaf} ${s.leaf4}`}>
            <Image src="/a-leaf-4.png" alt="" fill style={{ objectFit: "contain", pointerEvents: "none" }} />
          </div>
          <div className={`${s.treeLeaf} ${s.leafBig}`}>
            <Image src="/a-leaf.png" alt="" fill style={{ objectFit: "contain", pointerEvents: "none" }} />
          </div>
        </div>

        {/* Center rotating headline - mobile only, desktop is inside lap */}
        {isMobile && (
          <CenterHeadline lang={lang} hFont={hFont} switchRef={headlineSwitchRef} show={loaded} isMobile={true} scaleProgressRef={scaleProgressRef} />
        )}
      </div>

      {/* Text content section - will scale on scroll */}
      <section
        ref={sectionRef}
        dir="ltr"
        className={`${s.section} ${s.sectionEn}`}
      >
      <LapParticles />

      {/* Text */}
      <div className={`${s.textBlock} ${s.textBlockEn}`}>
        <div className={s.line1Wrap}>
          <h1
            className={`${s.heading} ${s.headingEnSpacing} ${s.colorFg} ${s.headingLine1Transition} ${loaded ? s.headingLoaded : s.headingHidden}`}
            style={{ fontFamily: hFont }}
          >
            {tr.line1.map((w, i) => (
              <span key={i} className={s.wordEn}>{w}</span>
            ))}
          </h1>
        </div>
        <div className={s.line2Wrap}>
          <h1
            className={`${s.heading} ${s.headingEnSpacing} ${s.colorAccent} ${s.headingLine2Transition} ${loaded ? s.headingLoaded : s.headingHidden}`}
            style={{ fontFamily: hFont }}
          >
            {tr.line2.map((w, i) => (
              <span key={i} className={s.wordEn}>{w}</span>
            ))}
          </h1>
        </div>
        
        {/* Description text */}
        <p
          className={`${s.heroDescription} ${loaded ? s.heroDescriptionLoaded : s.heroDescriptionHidden}`}
          style={{ fontFamily: hFont }}
        >
          {tr.heroSub}
        </p>

        {/* CTA button */}
        <div className={`${s.ctaRow} ${s.ctaRowEn} ${loaded ? s.ctaRowLoaded : s.ctaRowHidden}`}>
          <button
            onClick={onCTA}
            className={`${s.btn} ${s.btnEn}`}
            style={{ fontFamily: hFont }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLButtonElement).style.background = "var(--accent)";
              (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-2px)";
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLButtonElement).style.background = "var(--fg)";
              (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)";
            }}
          >
            {tr.joinCTA}
          </button>
        </div>
      </div>

      {/* Scroll hint */}
      <div className={`${s.scrollHint} ${s.scrollHintEn} ${loaded ? s.scrollHintLoaded : s.scrollHintHidden}`}>
        <div className={s.scrollLine} />
        <span className={`${s.scrollLabel} ${s.scrollLabelEn}`} style={{ fontFamily: hFont }}>
          {tr.scroll}
        </span>
      </div>

    </section>
    </>
  );
}