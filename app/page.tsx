"use client";
import { useState, useEffect, useRef, useCallback, startTransition } from "react";
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
  const scaleProgressRef = useRef(0);
  const heroProgressCbRef = useRef<((p: number) => void) | null>(null);
  // Setter provided by HorizontalScroll to toggle hover-scale mode on the first panel
  const hoverSetterRef = useRef<((v: boolean) => void) | null>(null);

  const tr = t[lang];

  useEffect(() => {
    const html = document.documentElement;
    html.classList.remove("dark", "light");
    html.classList.add(theme);
    html.setAttribute("dir", tr.dir);
    html.setAttribute("lang", lang);
  }, [theme, lang, tr.dir]);

  const handleHeroProgress = useCallback((p: number) => {
    heroProgressCbRef.current?.(p);
  }, []);

  const handleScaleProgress = useCallback((p: number) => {
    scaleProgressRef.current = p;
  }, []);

  function handleSuccess(name: string) {
    startTransition(() => {
      setSubmittedName(name);
      setSubmitted(true);
    });
  }

  function handleLangChange(newLang: Lang) {
    setLang(newLang);
    setScrollKey(prev => prev + 1);
  }

  if (submitted) {
    return (
      <>
        <ParticlesBackground />
        <LangThemeBar lang={lang} theme={theme} onLang={handleLangChange} onTheme={() => setTheme(p => p === "dark" ? "light" : "dark")} />
        <SuccessState name={submittedName} tr={tr} lang={lang} />
      </>
    );
  }

  // Function to scroll to the last section (form)
  const scrollToFormRef = useRef<(() => void) | null>(null);

  const handleCTAClick = useCallback(() => {
    scrollToFormRef.current?.();
  }, []);

  const sections = [
    <Hero key="hero" onCTA={handleCTAClick} tr={tr} lang={lang}
      registerProgress={cb => { heroProgressCbRef.current = cb; }}
      onHoverChange={v => hoverSetterRef.current?.(v)}
      scaleProgressRef={scaleProgressRef}
    />,
    <TheQuestion key="q" tr={tr} lang={lang} />,
    <TheAnswer key="a" tr={tr} lang={lang} />,
    <Journey key="j" tr={tr} lang={lang} />,
    <WhatYoureJoining key="w" tr={tr} lang={lang} />,
    <EarlyAccessForm key="f" onSuccess={handleSuccess} tr={tr} lang={lang} />,
  ];

  return (
    <>
      <ParticlesBackground />
      <LangThemeBar lang={lang} theme={theme} onLang={handleLangChange} onTheme={() => setTheme(p => p === "dark" ? "light" : "dark")} />
      <HorizontalScroll key={scrollKey} onScrollToLast={() => {}} onHeroProgress={handleHeroProgress} onScaleProgress={handleScaleProgress} lang={lang}
        registerHoverControl={setter => { hoverSetterRef.current = setter; }}
        registerScrollToForm={scrollFn => { scrollToFormRef.current = scrollFn; }}
      >
        {sections}
      </HorizontalScroll>
    </>
  );
}
