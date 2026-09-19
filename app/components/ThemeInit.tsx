"use client";
import { useLayoutEffect } from "react";

export default function ThemeInit() {
  useLayoutEffect(() => {
    try {
      const t = window.localStorage.getItem("site-theme");
      document.documentElement.classList.remove("dark", "light");
      document.documentElement.classList.add(t === "light" ? "light" : "dark");
    } catch {}
  }, []);
  return null;
}