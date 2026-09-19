"use client";
import { useState, useEffect, useRef } from "react";
import { Translations, Lang } from "../i18n";
import Image from "next/image";
import SiteMenu from "./SiteMenu";
import s from "./LangThemeBar.module.css";
import useIsMobile from "./useIsMobile";

type Props = {
  lang: Lang;
  theme: "dark" | "light";
  tr: Translations;
  onLang: (l: Lang) => void;
  onTheme: () => void;
  onNavigate: (section: number) => void;
  solid?: boolean;
};

export default function LangThemeBar({ lang, theme, tr, onLang, onTheme, onNavigate, solid }: Props) {
  const isDark = theme === "dark";
  const isAr = lang === "ar";
  const [menuOpen, setMenuOpen] = useState(false);
  const isMobile = useIsMobile();
  const [hidden, setHidden] = useState(false);
  const hideTimerRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isMobile) return;
    const onScroll = () => {
      setHidden(true);
      if (hideTimerRef.current) window.clearTimeout(hideTimerRef.current);
      hideTimerRef.current = window.setTimeout(() => setHidden(false), 2000);
    };
    document.addEventListener("scroll", onScroll, { capture: true, passive: true });
    document.addEventListener("touchmove", onScroll, { passive: true });
    return () => {
      document.removeEventListener("scroll", onScroll, { capture: true });
      document.removeEventListener("touchmove", onScroll);
      if (hideTimerRef.current) window.clearTimeout(hideTimerRef.current);
    };
  }, [isMobile]);

  const onBtnEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.style.borderColor = "var(--accent-dim)";
    e.currentTarget.style.color = "var(--fg)";
  };
  const onBtnLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.style.borderColor = "var(--accent-dim)";
    e.currentTarget.style.color = "var(--fg)";
  };

  return (
    <>
    <div className={`${s.bar} ${isAr ? s.barAr : s.barEn} ${solid ? s.scrolled : ""} ${isMobile && hidden ? s.barHidden : ""}`}>
      {/* Logo */}
      <div className={`${s.logoWrap} ${isAr ? s.logoWrapAr : s.logoWrapEn}`}>
        <Image
          src={isDark ? "/codeidea-logo-night.webp" : "/codeidea-logo.webp"}
          alt="Logo"
          width={180}
          height={80}
          className={s.logo}
        />
      </div>

      {/* Language + theme toggles */}
      <div className={s.actions}>
        {/* Language toggle */}
        <button
          className={`${s.btn} ${isAr ? s.btnAr : s.btnEn}`}
          onClick={() => onLang(isAr ? "en" : "ar")}
          onMouseEnter={onBtnEnter}
          onMouseLeave={onBtnLeave}
        >
          {isAr ? "EN" : "عربي"}
        </button>

        {/* Theme toggle */}
        <button
          className={`${s.btn} ${s.btnTheme}`}
          onClick={onTheme}
          title={isDark ? "Light mode" : "Dark mode"}
          onMouseEnter={onBtnEnter}
          onMouseLeave={onBtnLeave}
        >
          {isDark ? "☀" : "◑"}
        </button>

        {/* Menu toggle */}
        <button
          className={`${s.btn} ${s.menuBtn}`}
          onClick={() => setMenuOpen((o) => !o)}
          aria-label="Menu"
          aria-expanded={menuOpen}
          onMouseEnter={onBtnEnter}
          onMouseLeave={onBtnLeave}
        >
          <span className={s.lines}>
            <span className={`${s.line} ${menuOpen ? s.lineOpen : ""}`} />
            <span className={`${s.line} ${menuOpen ? s.lineOpen : ""}`} />
            <span className={`${s.line} ${menuOpen ? s.lineOpen : ""}`} />
          </span>
        </button>
      </div>
    </div>

    <SiteMenu
      open={menuOpen}
      lang={lang}
      tr={tr}
      onClose={() => setMenuOpen(false)}
      onNavigate={onNavigate}
    />
    </>
  );
}
