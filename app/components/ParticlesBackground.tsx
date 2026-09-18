"use client";
import { useEffect, useRef } from "react";
import s from "./ParticlesBackground.module.css";

interface Particle {
  x: number; y: number; baseX: number; baseY: number;
  size: number; speedX: number; speedY: number;
  opacity: number; parallaxFactor: number; angle: number;
}
interface RisingParticle {
  x: number; y: number; baseX: number; baseY: number;
  size: number; speed: number; opacity: number;
  parallaxFactor: number; angle: number;
}

export default function ParticlesBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const risingRef = useRef<RisingParticle[]>([]);
  const rafRef = useRef<number | undefined>(undefined);
  const lastTimeRef = useRef(0);
  const scrollProgressRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true, desynchronized: true });
    if (!ctx) return;

    let visible = true;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    const isMobile = window.innerWidth <= 768;
    const particleCount = isMobile ? 14 : 24;
    const risingCount = isMobile ? 90 : 130;

    function setup() {
      canvas!.width = Math.floor(window.innerWidth * dpr);
      canvas!.height = Math.floor(window.innerHeight * dpr);
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
      const w = window.innerWidth, h = window.innerHeight;
      particlesRef.current = Array.from({ length: particleCount }, () => {
        const x = Math.random() * w, y = Math.random() * h;
        return { x, y, baseX: x, baseY: y, size: Math.random() * 1.5 + 0.5, speedX: (Math.random() - 0.5) * 0.4, speedY: (Math.random() - 0.5) * 0.4, opacity: Math.random() * 0.3 + 0.5, parallaxFactor: Math.random() * 1.2 + 0.6, angle: Math.random() * Math.PI * 2 };
      });
      risingRef.current = Array.from({ length: risingCount }, () => {
        const x = Math.random() * w, y = Math.random() * h;
        return { x, y, baseX: x, baseY: y, size: Math.random() * 0.8 + 0.3, speed: Math.random() * 1.5 + 0.5, opacity: Math.random() * 0.4 + 0.4, parallaxFactor: Math.random() * 0.8 + 0.4, angle: Math.random() * Math.PI * 2 };
      });
    }

    setup();

    function getParticleColor() {
      const isDark = document.documentElement.classList.contains("dark");
      return isDark ? { r: 240, g: 237, b: 232 } : { r: 14, g: 13, b: 11 };
    }

    function animate(currentTime: number) {
      if (!visible) return;
      if (currentTime - lastTimeRef.current < 33) { rafRef.current = requestAnimationFrame(animate); return; }
      lastTimeRef.current = currentTime;
      const w = window.innerWidth, h = window.innerHeight;
      const scrollProgress = scrollProgressRef.current;
      const { r, g, b } = getParticleColor();
      ctx!.clearRect(0, 0, w, h);

      risingRef.current.forEach((p) => {
        p.baseY -= p.speed;
        if (p.baseY < -10) { p.baseY = h + 10; p.baseX = Math.random() * w; }
        const dist = scrollProgress * 400 * p.parallaxFactor;
        p.x = p.baseX + Math.cos(p.angle) * dist;
        p.y = p.baseY + Math.sin(p.angle) * dist;
        ctx!.beginPath();
        ctx!.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx!.fillStyle = `rgba(${r},${g},${b},${p.opacity * 0.55})`;
        ctx!.fill();
      });

      particlesRef.current.forEach((p) => {
        p.baseX += p.speedX; p.baseY += p.speedY;
        if (p.baseX < 0 || p.baseX > w) p.speedX *= -1;
        if (p.baseY < 0 || p.baseY > h) p.speedY *= -1;
        const dist = scrollProgress * 600 * p.parallaxFactor;
        p.x = p.baseX + Math.cos(p.angle) * dist;
        p.y = p.baseY + Math.sin(p.angle) * dist;
        ctx!.beginPath();
        ctx!.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx!.fillStyle = `rgba(${r},${g},${b},${p.opacity * 0.7})`;
        ctx!.fill();
      });

      particlesRef.current.forEach((p, i) => {
        particlesRef.current.slice(i + 1, i + 4).forEach((p2) => {
          const dx = p.x - p2.x, dy = p.y - p2.y;
          const d = Math.sqrt(dx * dx + dy * dy);
          if (d < 100) {
            ctx!.beginPath();
            ctx!.strokeStyle = `rgba(${r},${g},${b},${0.12 * (1 - d / 100)})`;
            ctx!.lineWidth = 0.5;
            ctx!.moveTo(p.x, p.y); ctx!.lineTo(p2.x, p2.y); ctx!.stroke();
          }
        });
      });

      rafRef.current = requestAnimationFrame(animate);
    }

    rafRef.current = requestAnimationFrame(animate);

    const observer = new IntersectionObserver(([entry]) => {
      visible = entry?.isIntersecting ?? true;
      if (visible) { lastTimeRef.current = 0; rafRef.current = requestAnimationFrame(animate); }
      else if (rafRef.current) cancelAnimationFrame(rafRef.current);
    }, { threshold: 0 });
    observer.observe(canvas);

    window.addEventListener("resize", setup);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      observer.disconnect();
      window.removeEventListener("resize", setup);
    };
  }, []);

  return <canvas ref={canvasRef} className={s.canvas} />;
}
