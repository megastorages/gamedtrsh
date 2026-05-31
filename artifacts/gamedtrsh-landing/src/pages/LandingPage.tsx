import { useEffect, useRef, useState, useCallback } from "react";
import ThreeScene from "../components/ThreeScene";
import logoSrc from "/logo-dark.png";

const countries = [
  { name: "Egypt",        nameAr: "مصر",      flag: "🇪🇬", url: "https://egypt.gamedtrsh.com",  emoji: "🐪", desc: "تسوّق من أكبر متجر إلكتروني في مصر مع توصيل سريع لجميع المحافظات" },
  { name: "Saudi Arabia", nameAr: "السعودية", flag: "🇸🇦", url: "https://saudia.gamedtrsh.com", emoji: "🌴", desc: "منتجات متنوعة بأفضل الأسعار مع توصيل لجميع مناطق المملكة" },
  { name: "UAE",          nameAr: "الإمارات", flag: "🇦🇪", url: "https://uae.gamedtrsh.com",   emoji: "🏙️", desc: "تجربة تسوق مميزة مع أسرع توصيل في الإمارات العربية المتحدة" },
];

const categories = [
  { icon: "🏠", name: "Home & Living",    nameAr: "المنزل" },
  { icon: "🎮", name: "Gaming",           nameAr: "الألعاب" },
  { icon: "👶", name: "Kids & Toys",      nameAr: "الأطفال" },
  { icon: "👗", name: "Fashion",          nameAr: "الأزياء" },
  { icon: "🍳", name: "Kitchen",          nameAr: "المطبخ" },
  { icon: "📱", name: "Electronics",      nameAr: "الإلكترونيات" },
  { icon: "💄", name: "Beauty & Care",    nameAr: "الجمال والعناية" },
  { icon: "⚽", name: "Sports & Fitness", nameAr: "الرياضة" },
];

// ── Fireworks canvas ──────────────────────────────────────────────
interface FWParticle { x: number; y: number; vx: number; vy: number; alpha: number; color: string; size: number; }
interface FWRocket   { x: number; y: number; vy: number; color: string; exploded: boolean; }

function FireworksCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current!;
    const ctx = canvas.getContext("2d")!;
    let W = canvas.offsetWidth, H = canvas.offsetHeight;
    canvas.width = W; canvas.height = H;

    const COLORS = ["#f0a500","#ffd166","#ff6b6b","#06d6a0","#74b9ff","#fd79a8","#ffffff","#a29bfe"];
    const particles: FWParticle[] = [];
    const rockets: FWRocket[] = [];

    function explode(x: number, y: number, color: string) {
      const count = 80 + Math.floor(Math.random() * 60);
      for (let i = 0; i < count; i++) {
        const angle = (i / count) * Math.PI * 2;
        const speed = 1.5 + Math.random() * 5;
        particles.push({ x, y, vx: Math.cos(angle) * speed, vy: Math.sin(angle) * speed, alpha: 1, color, size: 1.5 + Math.random() * 2.5 });
      }
    }

    function spawnRocket() {
      rockets.push({ x: W * (0.15 + Math.random() * 0.7), y: H, vy: -(12 + Math.random() * 8), color: COLORS[Math.floor(Math.random() * COLORS.length)], exploded: false });
    }

    let frame = 0;
    let animId: number;

    function draw() {
      animId = requestAnimationFrame(draw);
      frame++;
      ctx.fillStyle = "rgba(4,4,14,0.18)";
      ctx.fillRect(0, 0, W, H);
      if (frame % 18 === 0) spawnRocket();
      for (let i = rockets.length - 1; i >= 0; i--) {
        const r = rockets[i];
        r.y += r.vy; r.vy *= 0.97;
        if (!r.exploded && (r.vy > -2 || r.y < H * 0.55)) { explode(r.x, r.y, r.color); r.exploded = true; }
        if (r.exploded) { rockets.splice(i, 1); continue; }
        ctx.beginPath(); ctx.arc(r.x, r.y, 2.5, 0, Math.PI * 2); ctx.fillStyle = r.color; ctx.fill();
        ctx.beginPath(); ctx.moveTo(r.x, r.y); ctx.lineTo(r.x, r.y - r.vy * 3);
        ctx.strokeStyle = r.color + "66"; ctx.lineWidth = 1.5; ctx.stroke();
      }
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.x += p.vx; p.y += p.vy; p.vy += 0.12; p.vx *= 0.96; p.vy *= 0.96; p.alpha -= 0.018;
        if (p.alpha <= 0) { particles.splice(i, 1); continue; }
        ctx.beginPath(); ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color + Math.round(p.alpha * 255).toString(16).padStart(2, "0"); ctx.fill();
      }
    }

    draw();
    const onResize = () => { W = canvas.offsetWidth; H = canvas.offsetHeight; canvas.width = W; canvas.height = H; };
    window.addEventListener("resize", onResize);
    return () => { cancelAnimationFrame(animId); window.removeEventListener("resize", onResize); };
  }, []);

  return <canvas ref={ref} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }} />;
}

// ── End-page reveal overlay ───────────────────────────────────────
function EndPageOverlay({ visible, onClose }: { visible: boolean; onClose: () => void }) {
  const [hoveredCountry, setHoveredCountry] = useState<string | null>(null);
  const [panelReady, setPanelReady] = useState(false);
  const touchStartY = useRef(0);

  useEffect(() => {
    if (visible) {
      const t = setTimeout(() => setPanelReady(true), 600);
      return () => clearTimeout(t);
    } else {
      setPanelReady(false);
    }
  }, [visible]);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    if (e.deltaY < 0) onClose();
  }, [onClose]);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
  }, []);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    const delta = e.changedTouches[0].clientY - touchStartY.current;
    if (delta > 60) onClose();
  }, [onClose]);

  return (
    <div
      onWheel={handleWheel}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      style={{
        position: "fixed", inset: 0, zIndex: 500,
        pointerEvents: visible ? "auto" : "none",
        transform: visible ? "translateY(0)" : "translateY(100%)",
        transition: "transform 0.85s cubic-bezier(0.22,1,0.36,1)",
        background: "radial-gradient(ellipse at center top, #0f0a20 0%, #05050f 60%, #020210 100%)",
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        overflow: "hidden",
      }}>
      {visible && <FireworksCanvas />}
      {/* Content */}
      <div
        style={{
          position: "relative", zIndex: 5,
          textAlign: "center", maxWidth: "860px", width: "100%",
          padding: "1.5rem",
          opacity: panelReady ? 1 : 0,
          transform: panelReady ? "translateY(0) scale(1)" : "translateY(30px) scale(0.95)",
          transition: "all 0.7s cubic-bezier(0.22,1,0.36,1)",
          overflowY: "auto", maxHeight: "100vh",
        }}
        className="text-[40px] text-center pl-[74px] pr-[74px] pt-[74px] pb-[74px] ml-[10px] mr-[10px] mt-[10px] mb-[10px]">
        {/* Logo */}
        <div style={{ marginBottom: "1.2rem" }}>
          <div style={{ display: "inline-block", position: "relative" }}>
            <div
              style={{ position: "absolute", inset: "-20px", background: "radial-gradient(ellipse, rgba(240,165,0,0.3) 0%, transparent 70%)", borderRadius: "50%", animation: "pulse-gold 2s ease-in-out infinite" }}
              className="pl-[0px] pr-[0px] pt-[0px] pb-[0px]" />
            <img src={logoSrc} alt="Gamedtrsh" style={{ height: "clamp(70px, 12vw, 120px)", objectFit: "contain", filter: "drop-shadow(0 0 40px rgba(240,165,0,0.7))", animation: "float 3s ease-in-out infinite", position: "relative" }} />
          </div>
        </div>

        <div style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", padding: "0.35rem 1rem", borderRadius: "50px", border: "1px solid rgba(240,165,0,0.4)", color: "#f0a500", fontSize: "0.78rem", letterSpacing: "2px", textTransform: "uppercase", marginBottom: "1rem", background: "rgba(240,165,0,0.06)" }}>
          <span>🎉</span><span>Ready to Shop?</span><span>🎉</span>
        </div>

        <h2 style={{ fontSize: "clamp(1.6rem, 5vw, 3.5rem)", fontWeight: 900, background: "linear-gradient(135deg, #f0a500, #ffd166, #fff, #ffd166, #f0a500)", backgroundSize: "200% auto", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text", animation: "shimmer 3s linear infinite", marginBottom: "0.5rem" }}>
          اختر بلدك وابدأ التسوّق! 🛒
        </h2>
        <p style={{ color: "rgba(255,255,255,0.5)", marginBottom: "2rem", fontSize: "clamp(0.85rem,2vw,1rem)" }}>
          Pick your country and start your shopping now!
        </p>

        <div className="overlay-countries-grid">
          {countries.map((country) => (
            <a key={country.name} href={country.url} target="_blank" rel="noopener noreferrer"
              style={{
                display: "flex", flexDirection: "column", alignItems: "center", gap: "0.8rem",
                padding: "1.5rem 1rem",
                background: hoveredCountry === country.name ? "rgba(240,165,0,0.1)" : "rgba(14,14,28,0.9)",
                backdropFilter: "blur(20px)",
                border: `1px solid ${hoveredCountry === country.name ? "rgba(240,165,0,0.7)" : "rgba(240,165,0,0.2)"}`,
                borderRadius: "20px", textDecoration: "none",
                transform: hoveredCountry === country.name ? "translateY(-10px) scale(1.04)" : "translateY(0)",
                boxShadow: hoveredCountry === country.name ? "0 25px 50px rgba(240,165,0,0.3)" : "none",
                transition: "all 0.35s cubic-bezier(0.22,1,0.36,1)",
              }}
              onMouseEnter={() => setHoveredCountry(country.name)}
              onMouseLeave={() => setHoveredCountry(null)}
            >
              <div style={{ fontSize: "2.8rem" }}>{country.flag}</div>
              <div style={{ fontSize: "1.5rem" }}>{country.emoji}</div>
              <div>
                <div style={{ color: "#fff", fontWeight: 800, fontSize: "1.1rem" }}>{country.name}</div>
                <div style={{ color: "rgba(240,165,0,0.8)", fontSize: "0.95rem", direction: "rtl" }}>{country.nameAr}</div>
              </div>
              <div style={{ padding: "0.5rem 1.4rem", borderRadius: "50px", background: hoveredCountry === country.name ? "linear-gradient(135deg,#f0a500,#e09000)" : "rgba(240,165,0,0.1)", border: "1px solid rgba(240,165,0,0.35)", color: hoveredCountry === country.name ? "#000" : "#f0a500", fontWeight: 700, fontSize: "0.85rem", transition: "all 0.3s ease" }}>
                تسوّق الآن 🛍️
              </div>
            </a>
          ))}
        </div>

        {/* ── Contact + Footer ── */}
        <div style={{ marginTop: "2rem", paddingTop: "1.5rem", borderTop: "1px solid rgba(240,165,0,0.1)", textAlign: "center" }}>
          {/* Contact us */}
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "1.2rem", marginBottom: "1.2rem", flexWrap: "wrap" }}>
            <a href="https://wa.me/201126843971" target="_blank" rel="noopener noreferrer"
              style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", padding: "0.5rem 1.2rem", borderRadius: "50px", border: "1px solid rgba(37,211,102,0.4)", color: "#25d366", background: "rgba(37,211,102,0.07)", textDecoration: "none", fontSize: "0.85rem", fontWeight: 600, transition: "all 0.25s ease" }}
              onMouseEnter={(e) => { const el = e.currentTarget as HTMLElement; el.style.background = "rgba(37,211,102,0.18)"; el.style.borderColor = "rgba(37,211,102,0.7)"; el.style.transform = "translateY(-2px)"; }}
              onMouseLeave={(e) => { const el = e.currentTarget as HTMLElement; el.style.background = "rgba(37,211,102,0.07)"; el.style.borderColor = "rgba(37,211,102,0.4)"; el.style.transform = "translateY(0)"; }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              WhatsApp
            </a>
            <a href="mailto:help@gamedtrsh.com"
              style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", padding: "0.5rem 1.2rem", borderRadius: "50px", border: "1px solid rgba(240,165,0,0.35)", color: "#f0a500", background: "rgba(240,165,0,0.07)", textDecoration: "none", fontSize: "0.85rem", fontWeight: 600, transition: "all 0.25s ease" }}
              onMouseEnter={(e) => { const el = e.currentTarget as HTMLElement; el.style.background = "rgba(240,165,0,0.18)"; el.style.borderColor = "rgba(240,165,0,0.7)"; el.style.transform = "translateY(-2px)"; }}
              onMouseLeave={(e) => { const el = e.currentTarget as HTMLElement; el.style.background = "rgba(240,165,0,0.07)"; el.style.borderColor = "rgba(240,165,0,0.35)"; el.style.transform = "translateY(0)"; }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="4" width="20" height="16" rx="2"/>
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
              </svg>
              help@gamedtrsh.com
            </a>
          </div>

          <p style={{ color: "rgba(255,255,255,0.2)", fontSize: "0.75rem", marginBottom: "0.6rem" }}>
            © 2025 Gamedtrsh · جامد طرش · Made with ❤️ for Egypt, Saudi Arabia &amp; UAE
          </p>
          <div style={{ display: "flex", justifyContent: "center", gap: "1.2rem", flexWrap: "wrap" }}>
            {countries.map((c) => (
              <a key={c.name} href={c.url} target="_blank" rel="noopener noreferrer"
                style={{ color: "rgba(240,165,0,0.35)", fontSize: "0.75rem", textDecoration: "none", transition: "color 0.2s" }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "#f0a500"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "rgba(240,165,0,0.35)"; }}
              >
                {c.flag} {c.name}
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Scroll hooks ──────────────────────────────────────────────────
function useScrollProgress() {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const update = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(total > 0 ? Math.min(window.scrollY / total, 1) : 0);
    };
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);
  return progress;
}

function useIntersection(ref: React.RefObject<Element | null>, threshold = 0.15) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [ref, threshold]);
  return visible;
}

function Section({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const visible = useIntersection(ref);
  return (
    <div ref={ref} style={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(50px)", transition: "opacity 0.85s ease, transform 0.85s ease" }}>
      {children}
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────
export default function LandingPage() {
  const progress = useScrollProgress();
  const [endOverlayOpen, setEndOverlayOpen] = useState(false);
  const endTriggered = useRef(false);
  const heroRef = useRef<HTMLDivElement>(null);
  const heroVisible = useIntersection(heroRef, 0.05);

  useEffect(() => {
    if (progress >= 0.93 && !endTriggered.current) {
      endTriggered.current = true;
      setEndOverlayOpen(true);
    }
    if (progress < 0.85) {
      endTriggered.current = false;
    }
  }, [progress]);

  const closeOverlay = useCallback(() => {
    setEndOverlayOpen(false);
    window.scrollTo({ top: window.scrollY - 200, behavior: "smooth" });
  }, []);

  return (
    <div style={{ minHeight: "380vh", position: "relative" }}>
      <ThreeScene />
      <EndPageOverlay visible={endOverlayOpen} onClose={closeOverlay} />
      {/* ── NAV ──────────────────────────────────────────────────── */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0,
        padding: "0.75rem 1.25rem",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        zIndex: 200,
        background: "rgba(4,4,14,0.78)", backdropFilter: "blur(18px)",
        borderBottom: "1px solid rgba(240,165,0,0.12)",
      }}>
        <img src={logoSrc} alt="Gamedtrsh" style={{ height: "34px", objectFit: "contain", filter: "drop-shadow(0 0 8px rgba(240,165,0,0.5))" }} />
        <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap", justifyContent: "flex-end" }}>
          {countries.map((c) => (
            <a key={c.name} href={c.url} target="_blank" rel="noopener noreferrer"
              style={{ padding: "0.35rem 0.8rem", borderRadius: "50px", border: "1px solid rgba(240,165,0,0.2)", color: "#bbb", fontSize: "0.8rem", textDecoration: "none", background: "rgba(240,165,0,0.04)", transition: "all 0.2s ease", display: "flex", alignItems: "center", gap: "0.3rem" }}
              onMouseEnter={(e) => { const el = e.currentTarget as HTMLElement; el.style.borderColor = "rgba(240,165,0,0.6)"; el.style.color = "#f0a500"; el.style.background = "rgba(240,165,0,0.1)"; el.style.transform = "translateY(-2px)"; }}
              onMouseLeave={(e) => { const el = e.currentTarget as HTMLElement; el.style.borderColor = "rgba(240,165,0,0.2)"; el.style.color = "#bbb"; el.style.background = "rgba(240,165,0,0.04)"; el.style.transform = "translateY(0)"; }}
            >
              <span>{c.flag}</span>
            </a>
          ))}
        </div>
      </nav>
      {/* ── HERO ─────────────────────────────────────────────────── */}
      <section style={{ minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "5rem 1.5rem 2rem", position: "relative", textAlign: "center" }}>
        <div
          ref={heroRef}
          style={{
            maxWidth: "720px", width: "100%",
            display: "flex", flexDirection: "column", alignItems: "center",
            opacity: heroVisible ? 1 : 0,
            transform: heroVisible ? "translateY(0) scale(1)" : "translateY(30px) scale(0.96)",
            transition: "all 1.1s cubic-bezier(0.22,1,0.36,1)",
            gap: "0",
          }}
          className="text-[18px]">

          {/* Logo with glow */}
          <div style={{ position: "relative", display: "inline-block", marginBottom: "1.8rem" }}>
            <div style={{ position: "absolute", inset: "-40px", background: "radial-gradient(ellipse, rgba(240,165,0,0.4) 0%, transparent 65%)", borderRadius: "50%", animation: "pulse-gold 2.5s ease-in-out infinite" }} />
            <img src={logoSrc} alt="Gamedtrsh" style={{ height: "clamp(110px, 20vw, 180px)", objectFit: "contain", filter: "drop-shadow(0 0 40px rgba(240,165,0,0.7))", animation: "float 3s ease-in-out infinite", position: "relative" }} />
          </div>

          <h1
            className="text-[97px]"
            style={{
              fontSize: "clamp(1.9rem, 5.5vw, 4.5rem)", fontWeight: 900, lineHeight: 1.12,
              marginBottom: "1rem",
              background: "linear-gradient(135deg,#f0a500 0%,#ffd166 45%,#fff 60%,#ffd166 80%,#f0a500 100%)",
              backgroundSize: "200% auto", WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent", backgroundClip: "text",
              animation: "shimmer 4s linear infinite",
            }}>
            كل شيء تحتاجه<br />في مكان واحد
          </h1>

          <p className="text-[#ffffffd1]" style={{ fontSize: "clamp(1.1rem,2.8vw,1.5rem)", color: "rgba(255,255,255,0.6)", marginBottom: "1.5rem", lineHeight: 1.7 }}>
            Everything You Need, Delivered to Your Door 🎁
          </p>
          <a href="#features"
            className="opacity-[0.81]"
            onClick={(e) => { e.preventDefault(); document.getElementById("features")?.scrollIntoView({ behavior: "smooth" }); }}
            style={{
              display: "inline-flex", alignItems: "center", gap: "0.75rem",
              padding: "1rem 2.2rem",
              background: "linear-gradient(135deg,#f0a500,#e09000)",
              color: "#000", fontWeight: 800, fontSize: "clamp(0.9rem,2vw,1.1rem)",
              borderRadius: "50px", textDecoration: "none",
              boxShadow: "0 10px 35px rgba(240,165,0,0.45)",
              transition: "all 0.3s ease",
              animation: "pulse-gold 2.2s ease-in-out infinite",
            }}
            onMouseEnter={(e) => { const el = e.currentTarget as HTMLElement; el.style.transform = "translateY(-4px) scale(1.04)"; el.style.boxShadow = "0 20px 55px rgba(240,165,0,0.65)"; }}
            onMouseLeave={(e) => { const el = e.currentTarget as HTMLElement; el.style.transform = "translateY(0) scale(1)"; el.style.boxShadow = "0 10px 35px rgba(240,165,0,0.45)"; }}
          >
            <span>🌍</span>
            <span>اختر بلدك — Choose Your Country</span>
            <span>👇</span>
          </a>
        </div>
      </section>
      {/* ── CATEGORIES ───────────────────────────────────────────── */}
      <section style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "5rem 1.5rem", position: "relative", zIndex: 10 }}>
        <div style={{ maxWidth: "1060px", width: "100%", textAlign: "center" }}>
          <Section>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", padding: "0.4rem 1.2rem", borderRadius: "50px", border: "1px solid rgba(240,165,0,0.35)", color: "#f0a500", fontSize: "0.82rem", letterSpacing: "2px", textTransform: "uppercase", marginBottom: "1.5rem", background: "rgba(240,165,0,0.05)" }}>
              <span>✨</span><span>Browse Categories</span><span>✨</span>
            </div>
            <h2 style={{ fontSize: "clamp(1.6rem,4vw,3.2rem)", fontWeight: 800, color: "#fff", marginBottom: "0.75rem" }}>
              تسوّق كل ما تحتاج 🛒
            </h2>
            <p
              style={{ color: "rgba(255,255,255,0.45)", marginBottom: "2.5rem", fontSize: "clamp(0.9rem,2vw,1.05rem)" }}
              className="text-[#ffffff]">
              Shop Everything You Need
            </p>

            <div className="categories-grid">
              {categories.map((cat, i) => (
                <div key={cat.name} style={{
                  padding: "1.6rem 0.9rem",
                  background: "rgba(12,12,22,0.82)", backdropFilter: "blur(18px)",
                  border: "1px solid rgba(240,165,0,0.12)", borderRadius: "18px",
                  cursor: "pointer", transition: "all 0.3s ease",
                  opacity: 0, animation: `fadeInUp 0.55s ease ${i * 0.06}s forwards`,
                }}
                  onMouseEnter={(e) => { const el = e.currentTarget as HTMLElement; el.style.transform = "translateY(-8px) scale(1.05)"; el.style.borderColor = "rgba(240,165,0,0.5)"; el.style.boxShadow = "0 20px 40px rgba(240,165,0,0.18)"; el.style.background = "rgba(240,165,0,0.07)"; }}
                  onMouseLeave={(e) => { const el = e.currentTarget as HTMLElement; el.style.transform = "translateY(0) scale(1)"; el.style.borderColor = "rgba(240,165,0,0.12)"; el.style.boxShadow = "none"; el.style.background = "rgba(12,12,22,0.82)"; }}
                >
                  <div style={{ fontSize: "2.3rem", marginBottom: "0.65rem" }}>{cat.icon}</div>
                  <div style={{ color: "#fff", fontWeight: 700, fontSize: "0.88rem", marginBottom: "0.3rem" }}>{cat.name}</div>
                  <div style={{ color: "rgba(240,165,0,0.65)", fontSize: "0.78rem", direction: "rtl" }}>{cat.nameAr}</div>
                </div>
              ))}
            </div>
          </Section>
        </div>
      </section>
      {/* ── STORE FEATURES ───────────────────────────────────────── */}
      <section id="features" style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "5rem 1.5rem", position: "relative", zIndex: 10 }}>
        <div style={{ maxWidth: "980px", width: "100%", textAlign: "center" }}>
          <Section>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", padding: "0.4rem 1.2rem", borderRadius: "50px", border: "1px solid rgba(240,165,0,0.35)", color: "#f0a500", fontSize: "0.82rem", letterSpacing: "2px", textTransform: "uppercase", marginBottom: "1.5rem", background: "rgba(240,165,0,0.05)" }}>
              <span>⭐</span><span>مميزاتنا</span><span>⭐</span>
            </div>
            <h2 style={{ fontSize: "clamp(1.8rem,5vw,3.2rem)", fontWeight: 900, color: "#fff", marginBottom: "0.6rem", direction: "rtl" }}>
              مميزات المتجر
            </h2>
            <p style={{ color: "rgba(255,255,255,0.45)", marginBottom: "3rem", fontSize: "clamp(0.9rem,2vw,1.05rem)" }}>
              كل ما تحتاجه لتجربة تسوق مثالية
            </p>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1.4rem", direction: "rtl" }}>
              {[
                { icon: "🛒", title: "تسوق سهل وسريع", desc: "نقدم لك تجربة تسوق مرنة بواجهة بسيطة وسهلة الاستخدام مع جميع الأجهزة (كمبيوتر - جوال - تابلت)" },
                { icon: "🚚", title: "توصيل سريع وفعال", desc: "نحن نعمل مع شركات التوصيل في جميع أنحاء العالم لضمان وصول منتجك إليك في أقصر وقت ممكن وبطريقة آمنة" },
                { icon: "💳", title: "طرق دفع متعددة وآمنة", desc: "الدفع مثل: Visa، Mastercard، Apple Pay، STC Pay، PayPal، الدفع عند الاستلام" },
                { icon: "🏷️", title: "عروض وخصومات", desc: "مثل: خصم عند أول طلب، كوبونات للخصومات، عروض موسمية" },
                { icon: "💬", title: "دعم العملاء", desc: "فريق دعم عملاء متواجد للرد على استفساراتك عبر الدردشة أو الواتساب" },
                { icon: "🔔", title: "تتبع الطلبات والإشعارات", desc: "إرسال تحديثات حول حالة الطلب عبر البريد أو SMS" },
              ].map((feat, i) => (
                <div key={feat.title} style={{
                  display: "flex", flexDirection: "column", alignItems: "center", gap: "0.9rem",
                  padding: "2rem 1.4rem",
                  background: "rgba(255,255,255,0.04)",
                  backdropFilter: "blur(20px)",
                  border: "1px solid rgba(255,255,255,0.09)",
                  borderRadius: "20px",
                  opacity: 0, animation: `fadeInUp 0.55s ease ${i * 0.08}s forwards`,
                  transition: "all 0.3s ease",
                }}
                  onMouseEnter={(e) => { const el = e.currentTarget as HTMLElement; el.style.borderColor = "rgba(240,165,0,0.4)"; el.style.transform = "translateY(-6px)"; el.style.background = "rgba(240,165,0,0.06)"; el.style.boxShadow = "0 20px 40px rgba(0,0,0,0.3)"; }}
                  onMouseLeave={(e) => { const el = e.currentTarget as HTMLElement; el.style.borderColor = "rgba(255,255,255,0.09)"; el.style.transform = "translateY(0)"; el.style.background = "rgba(255,255,255,0.04)"; el.style.boxShadow = "none"; }}
                >
                  <div style={{
                    width: "64px", height: "64px", borderRadius: "50%",
                    background: "rgba(255,255,255,0.07)",
                    border: "1px solid rgba(255,255,255,0.14)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "1.7rem",
                  }}>
                    {feat.icon}
                  </div>
                  <div style={{ color: "#fff", fontWeight: 800, fontSize: "1.05rem", direction: "rtl" }}>{feat.title}</div>
                  <div style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.82rem", lineHeight: 1.7, direction: "rtl", textAlign: "center" }}>{feat.desc}</div>
                </div>
              ))}
            </div>
          </Section>
        </div>
      </section>
      {/* Progress bar */}
      <div style={{ position: "fixed", top: 0, left: 0, height: "3px", width: `${progress * 100}%`, background: "linear-gradient(to right,#f0a500,#ffd166)", zIndex: 300, transition: "width 0.1s linear", boxShadow: "0 0 12px rgba(240,165,0,0.9)" }} />
      {/* Floating WhatsApp button */}
      <a
        href="https://wa.me/201126843971"
        target="_blank"
        rel="noopener noreferrer"
        style={{
          position: "fixed", bottom: "1.8rem", right: "1.8rem", zIndex: 400,
          width: "58px", height: "58px", borderRadius: "50%",
          background: "linear-gradient(135deg,#25d366,#1ebe5d)",
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 6px 28px rgba(37,211,102,0.55)",
          transition: "all 0.25s ease",
          animation: "pulse-wa 2.5s ease-in-out infinite",
        }}
        onMouseEnter={(e) => { const el = e.currentTarget as HTMLElement; el.style.transform = "scale(1.12)"; el.style.boxShadow = "0 10px 40px rgba(37,211,102,0.75)"; }}
        onMouseLeave={(e) => { const el = e.currentTarget as HTMLElement; el.style.transform = "scale(1)"; el.style.boxShadow = "0 6px 28px rgba(37,211,102,0.55)"; }}
        title="Chat with us on WhatsApp"
      >
        <svg width="30" height="30" viewBox="0 0 24 24" fill="white">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
      </a>
    </div>
  );
}
