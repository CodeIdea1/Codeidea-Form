"use client";
import { useEffect, useState } from "react";
import { Translations, Lang } from "../i18n";

export default function SuccessState({ name, tr, lang }: { name: string; tr: Translations; lang: Lang }) {
  const [step, setStep] = useState(0);
  const isAr = lang === "ar";
  const hFont = isAr ? "var(--font-arabic)" : "var(--font-heading)";
  const mFont = isAr ? "var(--font-arabic)" : "var(--font-geist-mono)";
  const dFont = isAr ? "var(--font-arabic)" : "var(--font-body)";

  useEffect(() => {
    const timers = tr.miniJourney.map((_, i) => setTimeout(() => setStep(i + 1), 400 + i * 350));
    return () => timers.forEach(clearTimeout);
  }, [tr.miniJourney]);

  return (
    <div style={{ minHeight: "100svh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: isAr ? "flex-end" : "flex-start", padding: "clamp(2rem,8vw,7rem) clamp(1.5rem,8vw,7rem)", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: "600px", height: "600px", borderRadius: "50%", background: "radial-gradient(circle, rgba(200,184,154,0.04) 0%, transparent 70%)", animation: "pulse 4s ease-in-out infinite", pointerEvents: "none" }} />

      <style>{`
        @keyframes pulse { 0%,100%{transform:translate(-50%,-50%) scale(1);opacity:.5} 50%{transform:translate(-50%,-50%) scale(1.15);opacity:1} }
        @keyframes drawCheck { from{stroke-dashoffset:40} to{stroke-dashoffset:0} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
      `}</style>

      <div style={{ position: "relative", zIndex: 1, maxWidth: "700px", textAlign: isAr ? "right" : "left" }}>
        <div style={{ marginBottom: "clamp(2rem,5vw,3.5rem)", animation: "fadeUp 0.8s cubic-bezier(0.16,1,0.3,1) 0.1s both", display: "flex", justifyContent: isAr ? "flex-end" : "flex-start" }}>
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
            <rect x="0.5" y="0.5" width="39" height="39" stroke="var(--accent)" strokeOpacity="0.4" />
            <polyline points="10,21 17,28 30,14" stroke="var(--accent)" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="40" strokeDashoffset="40" style={{ animation: "drawCheck 0.7s cubic-bezier(0.16,1,0.3,1) 0.5s forwards" }} />
          </svg>
        </div>

        <h1 style={{ fontFamily: hFont, fontSize: "clamp(2.9rem,8.7vw,6.8rem)", fontWeight: 700, letterSpacing: isAr ? "-0.01em" : "-0.03em", lineHeight: isAr ? 1.2 : 0.92, color: "var(--fg)", marginBottom: "clamp(1rem,3vw,2rem)", animation: "fadeUp 0.9s cubic-bezier(0.16,1,0.3,1) 0.2s both" }}>
          {tr.successTitle}{name ? "،" : "."}
          {name && <span style={{ color: "var(--accent)", display: "block" }}>{name}.</span>}
        </h1>

        <p style={{ fontFamily: dFont, fontSize: isAr ? "clamp(1rem,2.2vw,1.3rem)" : "clamp(1rem,2.1vw,1.3rem)", color: "var(--fg-dim)", fontWeight: isAr ? 400 : 300, lineHeight: isAr ? 1.9 : 1.7, maxWidth: "460px", marginBottom: "clamp(2.5rem,6vw,5rem)", animation: "fadeUp 0.9s cubic-bezier(0.16,1,0.3,1) 0.4s both", marginLeft: isAr ? "auto" : 0 }}>
          {tr.successSub.split("\n").map((line, i) => <span key={i}>{line}{i === 0 && <br />}</span>)}
        </p>

        <div style={{ display: "flex", flexDirection: "column", animation: "fadeUp 0.9s cubic-bezier(0.16,1,0.3,1) 0.6s both" }}>
          {tr.miniJourney.map((item, i) => (
            <div key={item.status} style={{ display: "flex", alignItems: "center", gap: "clamp(1rem,3vw,2rem)", padding: "clamp(0.6rem,1.2vw,0.85rem) 0", borderBottom: i < tr.miniJourney.length - 1 ? "1px solid var(--line)" : "none", opacity: step > i ? 1 : 0.2, transition: "opacity 0.5s ease", flexDirection: isAr ? "row-reverse" : "row" }}>
              <span style={{ fontFamily: mFont, fontSize: isAr ? "0.85rem" : "0.7rem", letterSpacing: isAr ? "0" : "0.15em", color: item.done ? "var(--accent)" : "var(--fg-muted)", textTransform: isAr ? "none" : "uppercase", minWidth: isAr ? "4rem" : "3.5rem", textAlign: isAr ? "right" : "left" }}>{item.status}</span>
              <span style={{ fontFamily: mFont, fontSize: isAr ? "0.9rem" : "0.75rem", letterSpacing: isAr ? "0" : "0.1em", color: item.done ? "var(--fg)" : "var(--fg-dim)", textTransform: isAr ? "none" : "uppercase" }}>
                {item.done ? "✓ " : "← "}{item.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
