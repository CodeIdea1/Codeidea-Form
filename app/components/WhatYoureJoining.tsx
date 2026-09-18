"use client";
import { Translations, Lang } from "../i18n";

export default function WhatYoureJoining({ tr, lang }: { tr: Translations; lang: Lang }) {
  const isAr = lang === "ar";
  const hFont = isAr ? "var(--font-arabic)" : "var(--font-geist-sans)";
  const mFont = isAr ? "var(--font-arabic)" : "var(--font-geist-mono)";

  return (
    <section style={{ width: "100%", height: "100%", minHeight: "100svh", display: "flex", flexDirection: "column", justifyContent: "center", padding: "clamp(4rem,8vw,6rem) clamp(1.5rem,8vw,7rem)", position: "relative", overflow: "hidden" }}>

      <div style={{ marginBottom: "clamp(1.5rem,4vw,3rem)", display: "flex", alignItems: "center", gap: "1rem", flexDirection: isAr ? "row-reverse" : "row" }}>
        <span style={{ fontFamily: mFont, fontSize: isAr ? "0.85rem" : "0.6rem", letterSpacing: isAr ? "0" : "0.25em", color: "var(--fg-muted)", textTransform: isAr ? "none" : "uppercase" }}>{tr.sectionLabel04}</span>
        <div style={{ flex: 1, height: "1px", background: "var(--line)", maxWidth: "80px" }} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "clamp(2rem,6vw,5rem)", alignItems: "start" }}>
        {/* Left/Right: headline + footnote */}
        <div style={{ textAlign: isAr ? "right" : "left", order: isAr ? 2 : 1 }}>
          <h2 style={{ fontFamily: hFont, fontSize: "clamp(1.8rem,5vw,4rem)", fontWeight: 700, letterSpacing: isAr ? "-0.01em" : "-0.03em", lineHeight: isAr ? 1.3 : 1.0, color: "var(--fg)", marginBottom: "clamp(1rem,3vw,2rem)" }}>
            {tr.whatHeadline[0]}
            <br />
            <span style={{ color: "var(--accent)" }}>{tr.whatHeadline[1]}</span>
          </h2>
          <p style={{ fontFamily: hFont, fontSize: isAr ? "clamp(0.9rem,1.8vw,1.1rem)" : "clamp(0.85rem,1.6vw,1rem)", color: "var(--fg-muted)", fontWeight: isAr ? 400 : 300, lineHeight: isAr ? 1.9 : 1.7, maxWidth: "360px", marginLeft: isAr ? "auto" : 0 }}>
            {tr.whatFootnote}
          </p>
        </div>

        {/* Disciplines list */}
        <div style={{ display: "flex", flexDirection: "column", order: isAr ? 1 : 2 }}>
          {tr.disciplines.map((d, i) => (
            <div key={d}
              style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "clamp(0.75rem,1.8vw,1.1rem) 0", borderBottom: "1px solid var(--line)", cursor: "default", transition: "border-color 0.3s", flexDirection: isAr ? "row-reverse" : "row" }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.borderBottomColor = "var(--accent-dim)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.borderBottomColor = "var(--line)"; }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "clamp(0.75rem,2vw,1.5rem)", flexDirection: isAr ? "row-reverse" : "row" }}>
                <span style={{ fontFamily: mFont, fontSize: "0.55rem", color: "var(--fg-muted)", letterSpacing: isAr ? "0" : "0.15em" }}>{String(i + 1).padStart(2, "0")}</span>
                <span style={{ fontFamily: hFont, fontSize: isAr ? "clamp(1rem,2.5vw,1.5rem)" : "clamp(0.9rem,2.2vw,1.3rem)", fontWeight: isAr ? 500 : 400, color: "var(--fg)", letterSpacing: isAr ? "0" : "-0.01em" }}>{d}</span>
              </div>
              <span style={{ fontFamily: "var(--font-geist-mono)", fontSize: "0.7rem", color: "var(--fg-muted)", opacity: 0.4, transform: isAr ? "scaleX(-1)" : "none" }}>→</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
