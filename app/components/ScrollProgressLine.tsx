"use client";
import { useEffect, useRef } from "react";
import s from "./ScrollProgressLine.module.css";

export default function ScrollProgressLine({ progressRef }: { progressRef: React.MutableRefObject<number> }) {
  const fillRef = useRef<HTMLDivElement>(null);
  const dotRef  = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let raf: number;
    function update() {
      const p = progressRef.current;
      const pct = `${p * 100}%`;
      if (fillRef.current) fillRef.current.style.width = pct;
      if (dotRef.current) {
        dotRef.current.style.left = pct;
        dotRef.current.style.opacity = p > 0.005 && p < 0.995 ? "1" : "0";
      }
      raf = requestAnimationFrame(update);
    }
    raf = requestAnimationFrame(update);
    return () => cancelAnimationFrame(raf);
  }, [progressRef]);

  return (
    <div className={s.track}>
      <div ref={fillRef} className={s.fill} />
      <div ref={dotRef} className={s.dot} />
    </div>
  );
}
