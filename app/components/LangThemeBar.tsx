"use client";
import { Lang } from "../i18n";
import Image from "next/image";
import s from "./LangThemeBar.module.css";

type Props = {
  lang: Lang;
  theme: "dark" | "light";
  onLang: (l: Lang) => void;
  onTheme: () => void;
  solid?: boolean;
};

export default function LangThemeBar({ lang, theme, onLang, onTheme, solid }: Props) {
  const isDark = theme === "dark";
  const isAr = lang === "ar";

  const onBtnEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.style.borderColor = "var(--accent-dim)";
    e.currentTarget.style.color = "var(--fg)";
  };
  const onBtnLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.currentTarget.style.borderColor = "var(--accent-dim)";
    e.currentTarget.style.color = "var(--fg)";
  };

  return (
    <div className={`${s.bar} ${isAr ? s.barAr : s.barEn} ${solid ? s.scrolled : ""}`}>
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
      </div>
    </div>
  );
}
