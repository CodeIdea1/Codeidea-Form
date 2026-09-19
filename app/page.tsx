"use client";
import { useState, useEffect, useRef, useCallback, useMemo, startTransition } from "react";
import { Lang, t } from "./i18n";
import LangThemeBar from "./components/LangThemeBar";
import ParticlesBackground from "./components/ParticlesBackground";
import PageLoader from "./components/PageLoader";
import HorizontalScroll from "./components/HorizontalScroll";
import Hero from "./components/Hero";
import TheQuestion from "./components/TheQuestion";
import TheAnswer from "./components/TheAnswer";
import Journey from "./components/Journey";
import WhatYoureJoining from "./components/WhatYoureJoining";
import EarlyAccessForm from "./components/EarlyAccessForm";
import SuccessState from "./components/SuccessState";

export default function Page() {
  const [lang, setLang] = useState<Lang>("en");
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [submitted, setSubmitted] = useState(false);
  const [submittedName, setSubmittedName] = useState("");
  const [introDone, setIntroDone] = useState(false);
  const [scrollKey, setScrollKey] = useState(0);
  const scaleProgressRef = useRef(0);
  const heroProgressCbRef = useRef<((p: number) => void) | null>(null);
  // Setter provided by HorizontalScroll to enable the scroll-driven scale on the first panel
  const hoverSetterRef = useRef<((v: boolean) => void) | null>(null);

  // Sync lang/theme from localStorage after hydration (avoids SSR mismatch)
  useEffect(() => {
    try {
      const storedLang = window.localStorage.getItem("site-lang");
      if (storedLang === "ar") setLang("ar");
      const storedTheme = window.localStorage.getItem("site-theme");
      if (storedTheme === "light") setTheme("light");
    } catch {}
  }, []);

  const tr = t[lang];

  useEffect(() => {
    const html = document.documentElement;
    html.classList.remove("dark", "light");
    html.classList.add(theme);
    html.setAttribute("lang", lang);
    // On mobile keep the base direction LTR so the Arabic layout matches English
    // exactly and nothing shifts to the right. Desktop keeps true RTL mirroring.
    html.setAttribute("dir", window.innerWidth < 768 ? "ltr" : t[lang].dir);
  }, [theme, lang]);

  // Reload the page when crossing the desktop/mobile breakpoint (768px)
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px)");
    const onChange = () => window.location.reload();
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  // Preload theme-sensitive images so toggling dark <-> light is instant (no fetch/flash)
  useEffect(() => {
    ["/back-sec1.webp", "/back-sec2-white.webp", "/mug2.webp", "/white-mug.webp"].forEach(src => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  const [barSolid, setBarSolid] = useState(false);

  const handleHeroProgress = useCallback((p: number) => {
    heroProgressCbRef.current?.(p);
    setBarSolid(p > 0.03);
  }, []);

  // Native scroll (mobile wrapper, form section): show nav background once scrolled
  useEffect(() => {
    const onScroll = (e?: Event) => {
      let y = 0;
      const se = document.scrollingElement;
      if (se) y = se.scrollTop;
      const t = (e?.target as HTMLElement | null) ?? null;
      if (t && typeof t.scrollTop === "number" && t.scrollTop > y) y = t.scrollTop;
      setBarSolid(y > 10);
    };
    // Use capture on document so inner scroll containers (mobileWrapper etc.) are detected
    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("scroll", onScroll, { capture: true, passive: true });
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("scroll", onScroll, { capture: true });
    };
  }, []);

  const handleScaleProgress = useCallback((p: number) => {
    scaleProgressRef.current = p;
  }, []);

  const handleSuccess = useCallback((name: string) => {
    startTransition(() => {
      setSubmittedName(name);
      setSubmitted(true);
    });
  }, []);

  const handleLangChange = useCallback((newLang: Lang) => {
    try { window.localStorage.setItem("site-lang", newLang); } catch {}
    setLang(newLang);
    setScrollKey(prev => prev + 1);
  }, []);

  const handleThemeChange = useCallback(() => {
    // Non-urgent: keeps the UI responsive during the theme repaint
    startTransition(() => setTheme(p => {
      const next = p === "dark" ? "light" : "dark";
      try { window.localStorage.setItem("site-theme", next); } catch {}
      return next;
    }));
  }, []);

  // Function to scroll to the last section (form)
  const scrollToFormRef = useRef<(() => void) | null>(null);

  // Function to scroll to any section by its panel index
  const scrollToIndexRef = useRef<((index: number) => void) | null>(null);

  const handleNavigate = useCallback((index: number) => {
    scrollToIndexRef.current?.(index);
  }, []);

  const handleCTAClick = useCallback(() => {
    scrollToFormRef.current?.();
  }, []);

  const handleIntroDone = useCallback(() => setIntroDone(true), []);

  // Theme-independent sections: stable references so toggling theme doesn't re-render them
  const staticSections = useMemo(() => [
    <TheQuestion key="q" tr={tr} lang={lang} />,
    <TheAnswer key="a" tr={tr} lang={lang} />,
    <Journey key="j" tr={tr} lang={lang} />,
    <WhatYoureJoining key="w" tr={tr} lang={lang} />,
    <EarlyAccessForm key="f" onSuccess={handleSuccess} tr={tr} lang={lang} />,
  ], [tr, lang, handleSuccess]);

  if (submitted) {
    return (
      <>
        <ParticlesBackground />
        <LangThemeBar lang={lang} theme={theme} tr={tr} onLang={handleLangChange} onTheme={handleThemeChange} onNavigate={handleNavigate} solid={barSolid} />
        <SuccessState name={submittedName} tr={tr} lang={lang} />
      </>
    );
  }

  const sections = [
    <Hero key="hero" onCTA={handleCTAClick} tr={tr} lang={lang}
      theme={theme}
      active={introDone}
      registerProgress={cb => { heroProgressCbRef.current = cb; }}
      onHoverChange={v => hoverSetterRef.current?.(v)}
    />,
    ...staticSections,
  ];

  return (
    <>
      <ParticlesBackground />
      <LangThemeBar lang={lang} theme={theme} tr={tr} onLang={handleLangChange} onTheme={handleThemeChange} onNavigate={handleNavigate} solid={barSolid} />
      <HorizontalScroll key={scrollKey} onScrollToLast={() => {}} onHeroProgress={handleHeroProgress} onScaleProgress={handleScaleProgress} lang={lang}
        registerHoverControl={setter => { hoverSetterRef.current = setter; }}
        registerScrollToForm={scrollFn => { scrollToFormRef.current = scrollFn; }}
        registerScrollToIndex={scrollFn => { scrollToIndexRef.current = scrollFn; }}
      >
        {sections}
      </HorizontalScroll>
      {!introDone && <PageLoader onDone={handleIntroDone} />}
    </>
  );
}
