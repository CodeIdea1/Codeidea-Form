"use client";
import { Translations, Lang } from "../i18n";
import useIsMobile from "./useIsMobile";
import s from "./TheAnswer.module.css";

export default function TheAnswer({ tr, lang }: { tr: Translations; lang: Lang }) {
  const isAr = lang === "ar";
  const isMobile = useIsMobile();
  const mirror = isAr && !isMobile;
  const hFont = isAr ? "var(--font-arabic)" : "var(--font-heading)";
  const mFont = isAr ? "var(--font-arabic)" : "var(--font-geist-mono)";
  const dFont = isAr ? "var(--font-arabic)" : "var(--font-body)";

  return (
    <section style={{ width: "100%", height: "100%", minHeight: "100svh", display: "flex", flexDirection: "column", justifyContent: "center", padding: "clamp(4rem,10vw,8rem) clamp(1.5rem,8vw,7rem)", position: "relative" }}>

      <div style={{ marginBottom: "clamp(2rem,5vw,4rem)", display: "flex", alignItems: "center", gap: "1rem", flexDirection: mirror ? "row-reverse" : "row" }}>
        <span style={{ fontFamily: mFont, fontSize: isAr ? "0.85rem" : "0.72rem", letterSpacing: isAr ? "0" : "0.18em", color: "var(--fg-muted)", textTransform: isAr ? "none" : "uppercase" }}>{tr.sectionLabel02}</span>
        <div style={{ flex: 1, height: "1px", background: "var(--line)", maxWidth: "80px" }} />
      </div>

      <div style={{ maxWidth: "900px", textAlign: mirror ? "right" : "left", marginLeft: mirror ? "auto" : 0 }}>
        <h2 style={{ fontFamily: hFont, fontSize: "clamp(1.9rem,5.8vw,4.75rem)", fontWeight: 700, letterSpacing: isAr ? "-0.01em" : "-0.025em", lineHeight: isAr ? 1.3 : 1.1, color: "var(--fg)", marginBottom: "clamp(1.5rem,4vw,3rem)" }}>
          {tr.answerLine1}
          <br />
          <span style={{ color: "var(--accent)" }}>{tr.answerLine2}</span>
        </h2>

        <p style={{ fontFamily: dFont, fontSize: isAr ? "clamp(1rem,2.2vw,1.3rem)" : "clamp(1rem,2.1vw,1.3rem)", color: "var(--fg-dim)", fontWeight: isAr ? 400 : 300, lineHeight: isAr ? 1.9 : 1.75, maxWidth: "480px", marginLeft: mirror ? "auto" : 0, marginBottom: "clamp(1.5rem,3vw,2.5rem)" }}>
          {tr.answerSub}
        </p>

        <div style={{ display: "flex", alignItems: "center", gap: "1rem", flexDirection: mirror ? "row-reverse" : "row" }}>
          <div style={{ width: "40px", height: "1px", background: "var(--accent-dim)" }} />
          <span className={`${isAr ? s.badgeLabelAr : s.badgeLabel}`}>{tr.answerBadge}</span>
        </div>
      </div>

      <div style={{ position: "absolute", left: mirror ? "clamp(1.5rem,8vw,7rem)" : "auto", right: mirror ? "auto" : "clamp(1.5rem,8vw,7rem)", bottom: "clamp(2rem,6vw,5rem)", fontFamily: "var(--font-geist-mono)", fontSize: "clamp(6rem,18vw,16rem)", fontWeight: 700, color: "var(--ghost-num)", letterSpacing: "-0.05em", userSelect: "none", pointerEvents: "none", lineHeight: 1 }}>02</div>
    </section>
  );
}
