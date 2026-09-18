"use client";
import { useEffect, useRef } from "react";
import s from "./ScrollProgressLine.module.css";

export default function ScrollProgressLine({ progress }: { progress: number }) {
  const fillRef = useRef<HTMLDivElement>(null);
  const dotRef  = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const pct = `${progress * 100}%`;
    if (fillRef.current) fillRef.current.style.width = pct;
    if (dotRef.current)  dotRef.current.style.left   = pct;
  }, [progress]);

  return (
    <div className={s.track}>
      <div ref={fillRef} className={s.fill} />
      <div
        ref={dotRef}
        className={s.dot}
        style={{ opacity: progress > 0.005 && progress < 0.995 ? 1 : 0 }}
      />
    </div>
  );
}
