"use client";
import { useState, useEffect, useRef, useCallback, useMemo, startTransition } from "react";
import { Lang, t } from "./i18n";
import LangThemeBar from "./components/LangThemeBar";
import ParticlesBackground from "./components/ParticlesBackground";
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
  const [scrollKey, setScrollKey] = useState(0);
  const heroProgressCbRef = useRef<((p: number) => void) | null>(null);

  const tr = t[lang];

  useEffect(() => {
    const html = document.documentElement;
    html.classList.remove("dark", "light");
    html.classList.add(theme);
    html.setAttribute("dir", tr.dir);
    html.setAttribute("lang", lang);
  }, [theme, lang, tr.dir]);

  // Preload theme-sensitive images so toggling dark <-> light is instant (no fetch/flash)
  useEffect(() => {
    ["/back-sec1.webp", "/back-sec2-white.webp", "/mug2.webp", "/mug-white.png"].forEach(src => {
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

  const handleSuccess = useCallback((name: string) => {
    startTransition(() => {
      setSubmittedName(name);
      setSubmitted(true);
    });
  }, []);

  const handleLangChange = useCallback((newLang: Lang) => {
    setLang(newLang);
    setScrollKey(prev => prev + 1);
  }, []);

  const handleThemeChange = useCallback(() => {
    // Non-urgent: keeps the UI responsive during the theme repaint
    startTransition(() => setTheme(p => (p === "dark" ? "light" : "dark")));
  }, []);

  // Function to scroll to the last section (form)
  const scrollToFormRef = useRef<(() => void) | null>(null);

  const handleCTAClick = useCallback(() => {
    scrollToFormRef.current?.();
  }, []);

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
        <LangThemeBar lang={lang} theme={theme} onLang={handleLangChange} onTheme={handleThemeChange} solid={barSolid} />
        <SuccessState name={submittedName} tr={tr} lang={lang} />
      </>
    );
  }

  const sections = [
    <Hero key="hero" onCTA={handleCTAClick} tr={tr} lang={lang}
      theme={theme}
      registerProgress={cb => { heroProgressCbRef.current = cb; }}
    />,
    ...staticSections,
  ];

  return (
    <>
      <ParticlesBackground />
      <LangThemeBar lang={lang} theme={theme} onLang={handleLangChange} onTheme={handleThemeChange} solid={barSolid} />
      <HorizontalScroll key={scrollKey} onScrollToLast={() => {}} onHeroProgress={handleHeroProgress} lang={lang}
        registerScrollToForm={scrollFn => { scrollToFormRef.current = scrollFn; }}
      >
        {sections}
      </HorizontalScroll>
    </>
  );
}
