import { useEffect, useRef } from "react";
import gsap from "gsap";
import s from "./PageLoader.module.css";
import useIsMobile from "./useIsMobile";

function MobileLoader({ onDone }: { onDone: () => void }) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const logoRef = useRef<HTMLImageElement>(null);
  const doneRef = useRef(onDone);
  doneRef.current = onDone;
  const entranceStartedRef = useRef(false);
  const entranceFinishedRef = useRef(false);
  const pendingExitRef = useRef(false);
  const exitScheduledRef = useRef(false);
  const STABLE_MS = 800;

  useEffect(() => {
    const overlay = overlayRef.current;
    if (!overlay) return;
    let exited = false;

    const startEntrance = () => {
      if (entranceStartedRef.current) return;
      entranceStartedRef.current = true;
      const logo = logoRef.current;
      if (!logo) { entranceFinishedRef.current = true; if (pendingExitRef.current) runExit(); return; }
      gsap.fromTo(logo,
        { clipPath: "inset(0 100% 0 0)", opacity: 0.5 },
        { clipPath: "inset(0 0% 0 0)", opacity: 1, duration: 1.3, ease: "power4.out",
          onComplete: () => { entranceFinishedRef.current = true; if (pendingExitRef.current) scheduleExit(); }
        }
      );
    };

    let runExit: () => void = () => {};
    runExit = () => {
      if (exited) return;
      exited = true;
      const video = videoRef.current;
      const logo = logoRef.current;
      const tl = gsap.timeline({ defaults: { ease: "power4.inOut" }, onComplete: () => doneRef.current() });
      if (logo) tl.to(logo, { opacity: 0, duration: 0.45, ease: "power2.in" }, 0.1);
      if (video) tl.to(video, { opacity: 0, duration: 0.45, ease: "power2.in" }, 0.1);
      tl.to(overlay, { yPercent: -100, duration: 0.95 }, 0.4);
    };

    const scheduleExit = () => {
      if (exitScheduledRef.current) return;
      exitScheduledRef.current = true;
      window.setTimeout(runExit, STABLE_MS);
    };

    const exit = () => {
      if (!entranceStartedRef.current) startEntrance();
      if (entranceFinishedRef.current) scheduleExit();
      else pendingExitRef.current = true;
    };

    const video = videoRef.current;
    const tEnded = () => exit();
    const tLoaded = () => { try { if (video) video.playbackRate = 3; } catch {} video?.play().catch(() => {}); };
    const tTime = () => { if (video && video.currentTime >= Math.max(0, (video.duration || 0) - 1.6)) startEntrance(); };
    const fallback = window.setTimeout(exit, 5000);
    if (video) {
      try { video.playbackRate = 3; } catch {}
      video.addEventListener("ended", tEnded);
      video.addEventListener("error", exit);
      video.addEventListener("loadeddata", tLoaded);
      video.addEventListener("timeupdate", tTime);
      video.play().catch(() => {});
    }
    return () => {
      window.clearTimeout(fallback);
      video?.removeEventListener("ended", tEnded);
      video?.removeEventListener("error", exit);
      video?.removeEventListener("loadeddata", tLoaded);
      video?.removeEventListener("timeupdate", tTime);
    };
  }, []);

  useEffect(() => {
    const block = (e: WheelEvent | TouchEvent) => { e.preventDefault(); e.stopImmediatePropagation(); };
    window.addEventListener("wheel", block, { capture: true, passive: false });
    window.addEventListener("touchmove", block, { capture: true, passive: false });
    return () => {
      window.removeEventListener("wheel", block, { capture: true });
      window.removeEventListener("touchmove", block, { capture: true });
    };
  }, []);

  return (
    <div ref={overlayRef} className={s.mobileOverlay} aria-hidden="true">
      <div className={s.mobileContent}>
        <video ref={videoRef} className={s.mobileVideo} src="/logo.mp4" muted playsInline preload="auto" autoPlay />
        <img ref={logoRef} className={s.mobileLogo} src="/loading-logo3.webp" alt="" />
      </div>
    </div>
  );
}

export default function PageLoader({ onDone }: { onDone: () => void }) {
  const isMobile = useIsMobile();
  const overlayRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const logoRef = useRef<HTMLImageElement>(null);
  const doneRef = useRef(onDone);
  doneRef.current = onDone;
  const entranceStartedRef = useRef(false);
  const entranceFinishedRef = useRef(false);
  const pendingExitRef = useRef(false);
  const exitScheduledRef = useRef(false);
  const STABLE_MS = 800;

  useEffect(() => {
    const overlay = overlayRef.current;
    if (!overlay) return;

    let exited = false;

    const startEntrance = () => {
      if (entranceStartedRef.current) return;
      entranceStartedRef.current = true;
      const logo = logoRef.current;
      if (!logo) {
        entranceFinishedRef.current = true;
        if (pendingExitRef.current) runExit();
        return;
      }
      // Professional clip reveal triggered near the end of the video
      gsap.fromTo(
        logo,
        { clipPath: "inset(0 100% 0 0)", opacity: 0.5 },
        {
          clipPath: "inset(0 0% 0 0)",
          opacity: 1,
          duration: 1.3,
          ease: "power4.out",
          onComplete: () => {
            entranceFinishedRef.current = true;
            if (pendingExitRef.current) scheduleExit();
          },
        }
      );
    };

    let runExit: () => void = () => {};
    runExit = () => {
      if (exited) return;
      exited = true;
      const video = videoRef.current;
      const logo = logoRef.current;
      const tl = gsap.timeline({
        defaults: { ease: "power4.inOut" },
        onComplete: () => doneRef.current(),
      });
      // Logo stays stable after its entrance, then both fade out in place together
      if (logo) tl.to(logo, { opacity: 0, duration: 0.45, ease: "power2.in" }, 0.1);
      if (video) tl.to(video, { opacity: 0, duration: 0.45, ease: "power2.in" }, 0.1);
      tl.to(overlay, { yPercent: -100, duration: 0.95 }, 0.4);
    };

    // Wait for the logo entrance to finish, keep the logo stable for a few
    // moments, then fade it out together with the video.
    const scheduleExit = () => {
      if (exitScheduledRef.current) return;
      exitScheduledRef.current = true;
      window.setTimeout(runExit, STABLE_MS);
    };

    const exit = () => {
      if (!entranceStartedRef.current) startEntrance();
      if (entranceFinishedRef.current) scheduleExit();
      else pendingExitRef.current = true;
    };

    const video = videoRef.current;
    const tEnded = () => exit();
    const tLoaded = () => {
      try { if (video) video.playbackRate = 3; } catch {}
      video?.play().catch(() => {});
    };
    const tTime = () => {
      // Trigger the logo reveal shortly before the video ends (video runs at 3x)
      if (video && video.currentTime >= Math.max(0, (video.duration || 0) - 1.6)) startEntrance();
    };
    // Fallback so the site never stays hidden if 'ended' never fires or video fails
    const fallback = window.setTimeout(exit, 5000);
    if (video) {
      try { video.playbackRate = 3; } catch {}
      video.addEventListener("ended", tEnded);
      video.addEventListener("error", exit);
      video.addEventListener("loadeddata", tLoaded);
      video.addEventListener("timeupdate", tTime);
      video.play().catch(() => {});
    }

    return () => {
      window.clearTimeout(fallback);
      video?.removeEventListener("ended", tEnded);
      video?.removeEventListener("error", exit);
      video?.removeEventListener("loadeddata", tLoaded);
      video?.removeEventListener("timeupdate", tTime);
    };
  }, []);

  useEffect(() => {
    // Block wheel/touch scrolling while the loader is on screen
    const block = (e: WheelEvent | TouchEvent) => {
      e.preventDefault();
      e.stopImmediatePropagation();
    };
    window.addEventListener("wheel", block, { capture: true, passive: false });
    window.addEventListener("touchmove", block, { capture: true, passive: false });
    return () => {
      window.removeEventListener("wheel", block, { capture: true });
      window.removeEventListener("touchmove", block, { capture: true });
    };
  }, []);

  if (isMobile) return <MobileLoader onDone={onDone} />;

  return (
    <div ref={overlayRef} className={s.overlay} aria-hidden="true">
      <div className={s.content}>
        {/* Loading logo above the video; hidden until its entrance near the end of the video */}
        <img ref={logoRef} className={s.logo} src="/loading-logo3.webp" alt="" />
        {/* Video lower, centered */}
        <video ref={videoRef} className={s.video} src="/logo.mp4" muted playsInline preload="auto" autoPlay />
      </div>
    </div>
  );
}