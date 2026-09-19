"use client";
import { useState } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Translations, Lang } from "../i18n";
import useIsMobile from "./useIsMobile";
import s from "./EarlyAccessForm.module.css";

type FormData = { name: string; email: string; whatsapp: string; interest: string };
type Errors = Partial<Record<keyof FormData, string>>;

export default function EarlyAccessForm({ onSuccess, tr, lang }: { onSuccess: (name: string) => void; tr: Translations; lang: Lang }) {
  const [data, setData] = useState<FormData>({ name: "", email: "", whatsapp: "", interest: "" });
  const [errors, setErrors] = useState<Errors>({});
  const [loading, setLoading] = useState(false);
  const isAr = lang === "ar";
  const isMobile = useIsMobile();
  const mirror = isAr && !isMobile;
  const hFont = isAr ? "var(--font-arabic)" : "var(--font-heading)";
  const mFont = isAr ? "var(--font-arabic)" : "var(--font-geist-mono)";
  const dFont = isAr ? "var(--font-arabic)" : "var(--font-body)";

  function validate(d: FormData): Errors {
    const e: Errors = {};
    if (!d.name.trim()) e.name = tr.errRequired;
    if (!d.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.email)) e.email = tr.errEmail;
    if (!d.whatsapp.trim() || !/^\+?[\d\s\-()]{7,}$/.test(d.whatsapp)) e.whatsapp = tr.errPhone;
    if (!d.interest) e.interest = tr.errRequired;
    return e;
  }

  const set = (k: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setData((d) => ({ ...d, [k]: e.target.value }));
    if (errors[k]) setErrors((er) => ({ ...er, [k]: undefined }));
  };

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate(data);
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    
    try {
      if (!db) throw new Error("Database not available");
      await addDoc(collection(db, "leads"), {
        name: data.name,
        email: data.email,
        whatsapp: data.whatsapp,
        interest: data.interest,
        createdAt: serverTimestamp(),
        status: "new",
      });
      
      setTimeout(() => onSuccess(data.name.split(" ")[0]), 0);
    } catch (error) {
      console.error("Error submitting form:", error);
      setLoading(false);
      setErrors({ name: "Failed to submit. Please try again." });
    }
  }

  const inputStyle = (hasError: boolean): React.CSSProperties => ({
    width: "100%", background: "transparent", border: "none",
    borderBottom: `1px solid ${hasError ? "rgba(255,100,100,0.5)" : "var(--line)"}`,
    color: "var(--fg)", fontFamily: hFont,
    fontSize: isAr ? "clamp(1rem,2vw,1.15rem)" : "clamp(0.95rem,1.8vw,1.1rem)",
    fontWeight: isAr ? 400 : 300, padding: "0.75rem 0", outline: "none",
    transition: "border-color 0.3s", textAlign: isAr ? "right" : "left", direction: isAr ? "rtl" : "ltr",
  });

  const labelStyle: React.CSSProperties = {
    fontFamily: mFont, fontSize: isAr ? "0.8rem" : "0.75rem",
    letterSpacing: isAr ? "0" : "0.2em", color: "var(--fg-muted)",
    textTransform: isAr ? "none" : "uppercase", display: "block", marginBottom: "0.2rem",
    textAlign: mirror ? "right" : "left",
  };

  return (
    <section id="early-access-form" className={s.section}>

      <div style={{ marginBottom: "clamp(1.5rem,3vw,2.5rem)", display: "flex", alignItems: "center", gap: "1rem", flexDirection: mirror ? "row-reverse" : "row" }}>
        <span style={{ fontFamily: mFont, fontSize: isAr ? "0.85rem" : "0.72rem", letterSpacing: isAr ? "0" : "0.18em", color: "var(--fg-muted)", textTransform: isAr ? "none" : "uppercase" }}>{tr.sectionLabel05}</span>
        <div style={{ flex: 1, height: "1px", background: "var(--line)", maxWidth: "80px" }} />
      </div>

      <div className={s.grid}>
        <div style={{ textAlign: mirror ? "right" : "left", order: mirror ? 2 : 1 }}>
          <h2 style={{ fontFamily: hFont, fontSize: "clamp(2.2rem,5.3vw,3.75rem)", fontWeight: 700, letterSpacing: isAr ? "-0.01em" : "-0.03em", lineHeight: isAr ? 1.3 : 1.0, color: "var(--fg)", marginBottom: "1rem" }}>
            {tr.formHeadline[0]}
            <br />
            <span style={{ color: "var(--accent)" }}>{tr.formHeadline[1]}</span>
          </h2>
          <p style={{ fontFamily: dFont, fontSize: isAr ? "clamp(0.95rem,1.8vw,1.1rem)" : "clamp(0.95rem,1.8vw,1.1rem)", color: "var(--fg-dim)", fontWeight: isAr ? 400 : 300, lineHeight: isAr ? 1.9 : 1.7 }}>
            {tr.formSub}
          </p>
        </div>

        <form onSubmit={submit} noValidate style={{ display: "flex", flexDirection: "column", gap: "clamp(1rem,2vw,1.5rem)", order: mirror ? 1 : 2 }}>
          {([
            { key: "name" as const, label: tr.labelName, type: "text", placeholder: tr.placeholderName },
            { key: "email" as const, label: tr.labelEmail, type: "email", placeholder: tr.placeholderEmail },
            { key: "whatsapp" as const, label: tr.labelWhatsapp, type: "tel", placeholder: tr.placeholderWhatsapp },
          ]).map(({ key, label, type, placeholder }) => (
            <div key={key}>
              <label style={labelStyle}>{label}</label>
              <input type={type} placeholder={placeholder} value={data[key]} onChange={set(key)}
                style={inputStyle(!!errors[key])}
                onFocus={(e) => (e.target.style.borderBottomColor = "var(--accent-dim)")}
                onBlur={(e) => (e.target.style.borderBottomColor = errors[key] ? "rgba(255,100,100,0.5)" : "var(--line)")}
              />
              {errors[key] && <p style={{ fontFamily: mFont, fontSize: isAr ? "0.8rem" : "0.7rem", color: "rgba(255,120,120,0.8)", marginTop: "0.2rem", textAlign: mirror ? "right" : "left" }}>{errors[key]}</p>}
            </div>
          ))}

          <div>
            <label style={labelStyle}>{tr.labelInterest}</label>
            <select value={data.interest} onChange={set("interest")}
              style={{ ...inputStyle(!!errors.interest), cursor: "pointer", appearance: "none", backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' vight='6' viewBox='0 0 10 6'%3E%3Cpath d='M0 0l5 6 5-6z' fill='%236b6760'/%3E%3C/svg%3E")`, backgroundRepeat: "no-repeat", backgroundPosition: isAr ? "left 0.5rem center" : "right 0.5rem center", paddingLeft: isAr ? "1.5rem" : 0, paddingRight: isAr ? 0 : "1.5rem" }}>
              <option value="" disabled style={{ background: "var(--bg)" }}>{tr.placeholderInterest}</option>
              {tr.interests.map((opt) => <option key={opt} value={opt} style={{ background: "var(--bg)", color: "var(--fg)" }}>{opt}</option>)}
            </select>
            {errors.interest && <p style={{ fontFamily: mFont, fontSize: isAr ? "0.8rem" : "0.7rem", color: "rgba(255,120,120,0.8)", marginTop: "0.2rem", textAlign: mirror ? "right" : "left" }}>{errors.interest}</p>}
          </div>

          <button type="submit" disabled={loading} className={s.submitButton}
            style={{ background: loading ? "var(--fg-muted)" : "var(--fg)", color: "var(--bg)", border: "none", padding: "1rem 2rem", fontSize: isAr ? "1rem" : "0.85rem", fontFamily: hFont, letterSpacing: isAr ? "0" : "0.2em", textTransform: isAr ? "none" : "uppercase", cursor: loading ? "not-allowed" : "pointer", transition: "background 0.3s, transform 0.3s", fontWeight: isAr ? 600 : 500, marginTop: "0.5rem" }}
            onMouseEnter={(e) => { if (!loading) (e.currentTarget as HTMLButtonElement).style.background = "var(--accent)"; }}
            onMouseLeave={(e) => { if (!loading) (e.currentTarget as HTMLButtonElement).style.background = "var(--fg)"; }}>
            {loading ? tr.submitting : tr.submitCTA}
          </button>

          <p style={{ fontFamily: mFont, fontSize: isAr ? "0.8rem" : "0.7rem", color: "var(--fg-muted)", letterSpacing: isAr ? "0" : "0.12em", lineHeight: 1.6, textAlign: mirror ? "right" : "left" }}>
            {tr.formDisclaimer}
          </p>
        </form>
      </div>

      <div style={{ position: "absolute", left: mirror ? "clamp(1.5rem,8vw,7rem)" : "auto", right: mirror ? "auto" : "clamp(1.5rem,8vw,7rem)", bottom: "clamp(2rem,6vw,5rem)", fontFamily: "var(--font-geist-mono)", fontSize: "clamp(6rem,18vw,16rem)", fontWeight: 700, color: "var(--ghost-num)", letterSpacing: "-0.05em", userSelect: "none", pointerEvents: "none", lineHeight: 1 }}>05</div>
    </section>
  );
}
