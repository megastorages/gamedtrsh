import { useEffect, useRef, useState } from "react";

const ThreeScene = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const rafRef = useRef<number | null>(null);
  const currentScaleRef = useRef(1);
  const currentYRef = useRef(0);
  const currentBrightnessRef = useRef(1);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.playbackRate = 0.85;
    }

    const getProgress = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      return total > 0 ? Math.min(window.scrollY / total, 1) : 0;
    };

    let targetProgress = getProgress();

    const onScroll = () => {
      targetProgress = getProgress();
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    const animate = () => {
      rafRef.current = requestAnimationFrame(animate);

      // Smooth lerp toward target
      const lerpFactor = 0.055;
      currentScaleRef.current += (( 1 + targetProgress * 0.55) - currentScaleRef.current) * lerpFactor;
      currentYRef.current     += ((-targetProgress * 7)          - currentYRef.current)     * lerpFactor;
      currentBrightnessRef.current += ((1 - targetProgress * 0.18) - currentBrightnessRef.current) * lerpFactor;

      const el = containerRef.current;
      if (el) {
        const s  = currentScaleRef.current.toFixed(4);
        const ty = currentYRef.current.toFixed(3);
        const br = currentBrightnessRef.current.toFixed(3);
        el.style.transform  = `scale(${s}) translateY(${ty}%)`;
        el.style.filter     = `brightness(${br})`;
      }

      setScrollProgress(targetProgress);
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("scroll", onScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 0,
        overflow: "hidden",
        pointerEvents: "none",
      }}
    >
      {/* ── Video / Image layer ─────────────────────────────────────── */}
      <div
        ref={containerRef}
        style={{
          position: "absolute",
          inset: "-8%",           // oversize so zoom doesn't show edges
          transformOrigin: "center 42%",
          willChange: "transform, filter",
          transition: "none",
        }}
      >
        <video
          ref={videoRef}
          src="/hero-store.mp4"
          autoPlay
          loop
          muted
          playsInline
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center 45%",
            display: "block",
          }}
          onError={() => {
            // If video fails, fallback img is shown
            const v = videoRef.current;
            if (v) v.style.display = "none";
          }}
        />
        {/* Fallback image (shown if video can't load) */}
        <img
          src="/hero-store.png"
          alt=""
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center 45%",
            zIndex: -1,
          }}
        />
      </div>

      {/* ── Dark gradient overlays for text readability ─────────────── */}
      {/* Top gradient — nav area */}
      <div style={{
        position: "absolute",
        top: 0, left: 0, right: 0,
        height: "28%",
        background: "linear-gradient(to bottom, rgba(2,2,10,0.72) 0%, rgba(2,2,10,0.3) 60%, transparent 100%)",
        pointerEvents: "none",
      }} />

      {/* Center vignetted overlay for logo/text contrast */}
      <div style={{
        position: "absolute",
        inset: 0,
        background: "radial-gradient(ellipse 70% 60% at 50% 48%, rgba(2,2,12,0.55) 0%, rgba(2,2,12,0.18) 55%, transparent 100%)",
        pointerEvents: "none",
      }} />

      {/* Bottom gradient — smooth fade into content */}
      <div style={{
        position: "absolute",
        bottom: 0, left: 0, right: 0,
        height: "35%",
        background: "linear-gradient(to top, rgba(2,2,10,0.88) 0%, rgba(2,2,10,0.45) 50%, transparent 100%)",
        pointerEvents: "none",
      }} />

      {/* Left & right dark edges — cinematic crop */}
      <div style={{
        position: "absolute",
        inset: 0,
        background: "linear-gradient(to right, rgba(2,2,10,0.35) 0%, transparent 12%, transparent 88%, rgba(2,2,10,0.35) 100%)",
        pointerEvents: "none",
      }} />

      {/* ── Scroll-depth parallax depth lines (subtle) ─────────────── */}
      <div style={{
        position: "absolute",
        inset: 0,
        background: `radial-gradient(ellipse 30% 30% at 50% 40%, transparent 0%, transparent 60%, rgba(0,0,0,${(scrollProgress * 0.22).toFixed(3)}) 100%)`,
        pointerEvents: "none",
        transition: "background 0.3s ease",
      }} />
    </div>
  );
};

export default ThreeScene;
