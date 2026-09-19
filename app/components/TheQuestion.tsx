"use client";
import { useEffect, useRef, useState } from "react";
import { Translations, Lang } from "../i18n";
import useIsMobile from "./useIsMobile";
import s from "./TheQuestion.module.css";

export default function TheQuestion({ tr, lang }: { tr: Translations; lang: Lang }) {
  const isAr = lang === "ar";
  const isMobile = useIsMobile();
  const mirror = isAr && !isMobile;
  const hFont = isAr ? "var(--font-arabic)" : "var(--font-heading)";
  const mFont = isAr ? "var(--font-arabic)" : "var(--font-geist-mono)";
  const dFont = isAr ? "var(--font-arabic)" : "var(--font-body)";
  const [visible, setVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const fadeIn = (delay: string) => ({
    opacity: visible ? 1 : 0,
    transform: visible ? "translateY(0)" : "translateY(28px)",
    transition: `opacity 0.8s ease ${delay}, transform 0.9s cubic-bezier(0.16,1,0.3,1) ${delay}`,
  });

  return (
    <section
      ref={sectionRef}
      className={`${s.section} ${mirror ? s.sectionRtl : s.sectionLtr}`}
      style={{ minHeight: isMobile ? "auto" : undefined }}
    >
      <div className={`${s.sectionLabel} ${mirror ? s.sectionLabelRtl : s.sectionLabelLtr}`} style={fadeIn("0s")}>
        <span style={{ fontFamily: mFont, fontSize: isAr ? "0.85rem" : "0.72rem", letterSpacing: isAr ? "0" : "0.18em", color: "var(--fg-muted)", textTransform: isAr ? "none" : "uppercase" }}>
          {tr.sectionLabel01}
        </span>
        <div className={s.labelLine} />
      </div>

      <div className={`${s.contentWrapper} ${mirror ? s.contentWrapperRtl : s.contentWrapperLtr}`}>
        <p style={{ fontFamily: dFont, fontSize: isAr ? "clamp(1.1rem,2.5vw,1.5rem)" : "clamp(1.05rem,2.4vw,1.45rem)", color: "var(--fg-dim)", fontWeight: isAr ? 400 : 300, lineHeight: isAr ? 1.9 : 1.7, marginBottom: "clamp(1.5rem,4vw,3rem)", ...fadeIn("0.15s") }}>
          {tr.questionIntro}
        </p>

        <div className={`${s.quoteWrapper} ${mirror ? s.quoteWrapperRtl : s.quoteWrapperLtr}`} style={fadeIn("0.3s")}>
          <p style={{ fontFamily: hFont, fontSize: "clamp(1.65rem,5.2vw,4rem)", fontWeight: 700, letterSpacing: isAr ? "-0.01em" : "-0.025em", lineHeight: isAr ? 1.3 : 1.1, color: "var(--fg)" }}>
            {tr.questionQuote[0]}
            <br />
            <span style={{ color: "var(--accent)" }}>{tr.questionQuote[1]}</span>
          </p>
        </div>

        <p style={{ fontFamily: dFont, fontSize: isAr ? "clamp(1rem,2vw,1.2rem)" : "clamp(0.95rem,1.8vw,1.1rem)", color: "var(--fg-dim)", fontWeight: isAr ? 400 : 300, lineHeight: isAr ? 1.9 : 1.7, maxWidth: "520px", marginLeft: mirror ? "auto" : 0, ...fadeIn("0.5s") }}>
          {tr.questionClose.split("\n").map((line, i) => <span key={i}>{line}{i === 0 && <br />}</span>)}
        </p>
      </div>

      <div className={`${s.ghostNumber} ${mirror ? s.ghostNumberRtl : s.ghostNumberLtr}`} style={fadeIn("0.1s")}>01</div>
    </section>
  );
}
