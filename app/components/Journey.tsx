"use client";
import { Translations, Lang } from "../i18n";
import s from "./Journey.module.css";

export default function Journey({ tr, lang }: { tr: Translations; lang: Lang }) {
  const isAr = lang === "ar";
  const hFont = isAr ? "var(--font-arabic)" : "var(--font-heading)";
  const mFont = isAr ? "var(--font-arabic)" : "var(--font-geist-mono)";
  const dFont = isAr ? "var(--font-arabic)" : "var(--font-body)";

  return (
    <section style={{ width: "100%", height: "100%", minHeight: "100svh", display: "flex", flexDirection: "column", justifyContent: "center", padding: "clamp(4rem,8vw,6rem) clamp(1.5rem,8vw,7rem)", position: "relative", overflow: "hidden" }}>

      <div style={{ marginBottom: "clamp(1.5rem,4vw,3rem)", display: "flex", alignItems: "center", gap: "1rem", flexDirection: isAr ? "row-reverse" : "row" }}>
        <span style={{ fontFamily: mFont, fontSize: isAr ? "0.85rem" : "0.72rem", letterSpacing: isAr ? "0" : "0.18em", color: "var(--fg-muted)", textTransform: isAr ? "none" : "uppercase" }}>{tr.sectionLabel03}</span>
        <div style={{ flex: 1, height: "1px", background: "var(--line)", maxWidth: "80px" }} />
      </div>

      <h2 style={{ fontFamily: hFont, fontSize: "clamp(1.8rem,4.2vw,3.2rem)", fontWeight: 700, letterSpacing: isAr ? "-0.01em" : "-0.025em", lineHeight: isAr ? 1.3 : 1.1, color: "var(--fg)", marginBottom: "clamp(2rem,5vw,4rem)", maxWidth: "600px", textAlign: isAr ? "right" : "left", marginLeft: isAr ? "auto" : 0 }}>
        {tr.journeyHeadline[0]}
        <br />
        <span style={{ color: "var(--accent)" }}>{tr.journeyHeadline[1]}</span>
      </h2>

      {/* Horizontal timeline */}
      <div style={{ position: "relative" }}>
        {/* Connecting line */}
        <div className={`${s.connector} ${isAr ? s.connectorRtl : s.connectorLtr}`} />

        <div className={`${s.grid} ${isAr ? s.gridRtl : ""}`}>
          {tr.steps.map((step, i) => (
            <div key={step.num} className={s.step} style={{ position: "relative", paddingTop: "clamp(1.5rem,3vw,2.5rem)", textAlign: isAr ? "right" : "left" }}>
              {/* Node */}
              <div style={{ position: "absolute", top: 0, left: isAr ? "auto" : 0, right: isAr ? 0 : "auto", width: "clamp(0.9rem,1.5vw,1.2rem)", height: "clamp(0.9rem,1.5vw,1.2rem)", border: "1px solid var(--accent)", background: "var(--bg)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1 }}>
                <div style={{ width: "3px", height: "3px", background: "var(--accent)", borderRadius: "50%" }} />
              </div>

              <div style={{ display: "flex", alignItems: "baseline", gap: "0.5rem", marginBottom: "0.5rem", flexDirection: isAr ? "row-reverse" : "row" }}>
                <span style={{ fontFamily: mFont, fontSize: isAr ? "0.75rem" : "0.7rem", color: "var(--accent-dim)", letterSpacing: isAr ? "0" : "0.12em" }}>{step.num}</span>
                <span style={{ fontFamily: mFont, fontSize: isAr ? "0.75rem" : "0.7rem", color: "var(--fg-muted)", letterSpacing: isAr ? "0" : "0.12em", textTransform: isAr ? "none" : "uppercase" }}>{step.title}</span>
              </div>

              <h3 style={{ fontFamily: hFont, fontSize: "clamp(1.15rem,2.3vw,1.45rem)", fontWeight: 700, color: "var(--fg)", marginBottom: "0.5rem", lineHeight: isAr ? 1.4 : 1.2, letterSpacing: isAr ? "0" : "-0.01em" }}>{step.headline}</h3>
              <p style={{ fontFamily: dFont, fontSize: isAr ? "clamp(0.85rem,1.4vw,0.95rem)" : "clamp(0.95rem,1.4vw,1.05rem)", color: "var(--fg-dim)", fontWeight: isAr ? 400 : 300, lineHeight: isAr ? 1.8 : 1.6 }}>{step.body}</p>

              {step.timing && (
                <div style={{ marginTop: "0.6rem", display: "flex", alignItems: "center", gap: "0.4rem", flexDirection: isAr ? "row-reverse" : "row" }}>
                  <div style={{ width: "12px", height: "1px", background: "var(--accent-dim)" }} />
                  <span style={{ fontFamily: mFont, fontSize: isAr ? "0.7rem" : "0.7rem", color: "var(--accent-dim)", letterSpacing: isAr ? "0" : "0.1em" }}>{step.timing}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
