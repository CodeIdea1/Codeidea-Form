"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";
import { Translations, Lang } from "../i18n";
import s from "./SiteMenu.module.css";

type Props = {
  open: boolean;
  lang: Lang;
  tr: Translations;
  onClose: () => void;
  onNavigate: (section: number) => void;
};

export default function SiteMenu({ open, lang, tr, onClose, onNavigate }: Props) {
  const isAr = lang === "ar";
  const [visible, setVisible] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);
  const originRef = useRef<{ x: number; y: number }>({ x: 40, y: 40 });
  const linkRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const numberRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const rightRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const openRef = useRef(false);

  // Circle expands from the menu button position (top-right in EN, top-left in AR)
  useEffect(() => {
    const { innerWidth } = window;
    originRef.current = isAr ? { x: 52, y: 52 } : { x: innerWidth - 52, y: 52 };
  }, [isAr]);

  const openMenu = useCallback(() => {
    if (openRef.current) return;
    openRef.current = true;
    setVisible(true);
    tlRef.current?.kill();
    const tl = gsap.timeline();
    tlRef.current = tl;
    const { x, y } = originRef.current;
    tl.set(overlayRef.current, { clipPath: `circle(0% at ${x}px ${y}px)` });
    tl.set(linkRefs.current, { y: 0, yPercent: 110, opacity: 0 });
    tl.set(numberRefs.current, { y: 20, opacity: 0 });
    tl.to(overlayRef.current, {
      clipPath: `circle(150% at ${x}px ${y}px)`,
      duration: 0.75,
      ease: "power3.inOut",
    });
    tl.to(linkRefs.current, { y: 0, yPercent: 0, opacity: 1, duration: 0.6, stagger: 0.07, ease: "power3.out" }, 0.35);
    tl.to(numberRefs.current, { y: 0, opacity: 1, duration: 0.5, stagger: 0.07, ease: "power2.out" }, 0.45);
    tl.to(rightRef.current, { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }, 0.5);
    tl.to(bottomRef.current, { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }, 0.6);
  }, []);

  const closeMenu = useCallback(() => {
    if (!openRef.current) return;
    openRef.current = false;
    tlRef.current?.kill();
    const tl = gsap.timeline({
      onComplete: () => setVisible(false),
    });
    tlRef.current = tl;
    const { x, y } = originRef.current;
    tl.to(bottomRef.current, { opacity: 0, y: 15, duration: 0.3, ease: "power2.in" }, 0);
    tl.to(rightRef.current, { opacity: 0, y: 30, duration: 0.35, ease: "power2.in" }, 0.05);
    tl.to(numberRefs.current, { opacity: 0, y: 15, duration: 0.25, stagger: 0.03, ease: "power2.in" }, 0.05);
    tl.to(linkRefs.current, { opacity: 0, y: 0, yPercent: 110, duration: 0.35, stagger: 0.04, ease: "power3.in" }, 0.1);
    tl.to(overlayRef.current, {
      clipPath: `circle(0% at ${x}px ${y}px)`,
      duration: 0.6,
      ease: "power3.inOut",
    }, 0.25);
  }, []);

  useEffect(() => {
    if (open) openMenu();
    else if (openRef.current) closeMenu();
  }, [open, openMenu, closeMenu]);

  // ESC closes the menu
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  // Block wheel/touch so panels don't scroll behind the open menu
  useEffect(() => {
    const el = overlayRef.current;
    if (!el || !open) return;
    const stop = (e: Event) => e.preventDefault();
    el.addEventListener("wheel", stop, { passive: false });
    el.addEventListener("touchmove", stop, { passive: false });
    return () => {
      el.removeEventListener("wheel", stop);
      el.removeEventListener("touchmove", stop);
    };
  }, [open]);

  useEffect(() => () => { tlRef.current?.kill(); }, []);

  const handleNavigate = useCallback((section: number) => {
    onClose();
    setTimeout(() => onNavigate(section), 450);
  }, [onClose, onNavigate]);

  // Clicking empty menu space (backdrop) closes the menu
  const handleOverlayClick = useCallback((e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest("button, a")) return;
    onClose();
  }, [onClose]);

  return (
    <div
      ref={overlayRef}
      className={`${s.overlay} ${visible ? s.overlayOpen : ""}`}
      onClick={handleOverlayClick}
    >
      <div className={s.overlayBg} />

      <div className={s.overlayContent} dir={isAr ? "rtl" : "ltr"}>
        <div className={s.menuLeft}>
          {tr.menu.map((item, i) => (
            <div key={item.section} className={s.menuNavItem}>
              <button
                ref={(el) => { linkRefs.current[i] = el; }}
                className={`${s.menuNavLink} ${isAr ? s.menuNavLinkAr : s.menuNavLinkEn}`}
                onClick={() => handleNavigate(item.section)}
              >
                <span
                  ref={(el) => { numberRefs.current[i] = el; }}
                  className={`${s.menuNavLinkNumber} ${isAr ? s.menuNavLinkNumberAr : ""}`}
                >
                  {item.num}
                </span>
                {item.label}
              </button>
            </div>
          ))}
        </div>

        <div ref={rightRef} className={s.menuRight}>
          <div className={s.menuDivider} />
          <div className={`${s.menuInfo} ${isAr ? s.menuInfoAr : ""}`}>
            <p className={s.menuInfoLabel} style={{ fontFamily: isAr ? "var(--font-arabic)" : "var(--font-geist-mono)" }}>
              {tr.menuBrand}
            </p>
            <p className={s.menuInfoValue} style={{ fontFamily: isAr ? "var(--font-arabic)" : "var(--font-body)" }}>
              {tr.footerLeft}
            </p>
            <p className={s.menuInfoValue} style={{ fontFamily: isAr ? "var(--font-arabic)" : "var(--font-body)" }}>
              {tr.footerRight}
            </p>
          </div>
        </div>
      </div>

      <div ref={bottomRef} className={s.menuBottomBar}>
        <p className={s.menuCopyright} style={{ fontFamily: isAr ? "var(--font-arabic)" : "var(--font-geist-mono)" }}>
          {tr.menuCopyright}
        </p>
        <button
          className={`${s.closeLink} ${isAr ? s.closeLinkAr : ""}`}
          onClick={onClose}
          aria-label={tr.menuClose}
          style={{ fontFamily: isAr ? "var(--font-arabic)" : "var(--font-geist-mono)" }}
        >
          {tr.menuClose}
        </button>
      </div>
    </div>
  );
}