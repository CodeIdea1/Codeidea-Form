"use client";
import { useEffect, useState } from "react";

export default function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== "undefined" ? window.matchMedia(`(max-width: ${breakpoint}px)`).matches : false
  );

  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${breakpoint}px)`);
    const check = () => setIsMobile(mq.matches);
    mq.addEventListener("change", check);
    return () => mq.removeEventListener("change", check);
  }, [breakpoint]);

  return isMobile;
}