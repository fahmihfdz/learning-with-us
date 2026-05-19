import { useState, useEffect, useRef } from "react";

import { DICTIONARY } from "./content";

function useInView(options = {}) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setInView(true);
      },
      { threshold: 0.15, ...options },
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, inView];
}

function FadeIn({ children, delay = 0, direction = "up", className = "" }) {
  const [ref, inView] = useInView();

  let initialTransform = "translateY(32px)";
  if (direction === "left") initialTransform = "translateX(-32px)";
  if (direction === "right") initialTransform = "translateX(32px)";
  if (direction === "none") initialTransform = "translate(0)";

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translate(0)" : initialTransform,
        transition: `opacity 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) ${delay}s, transform 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) ${delay}s`,
        height: "100%",
      }}
    >
      {children}
    </div>
  );
}

export default function App() {
  const [lang, setLang] = useState("en");
  const content = DICTIONARY[lang];
  const enNav = DICTIONARY.en.nav.links;

  const [active, setActive] = useState(enNav[0]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [formOpen, setFormOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (section) => {
    setActive(section);
    setMenuOpen(false);
    const id = section
      .toLowerCase()
      .replace(/[^a-z]/g, "-")
      .replace(/-+/g, "-");
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div
      style={{
        fontFamily: "'Georgia', 'Times New Roman', serif",
        background: "#F5F0E8",
        minHeight: "100vh",
        color: "#1C1A14",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400;1,700&family=Courier+Prime:ital,wght@0,400;0,700;1,400&family=EB+Garamond:ital,wght@0,400;0,500;0,600;1,400&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #F5F0E8; }
        .playfair { font-family: 'Playfair Display', serif; }
        .garamond { font-family: 'EB Garamond', serif; }
        .courier { font-family: 'Courier Prime', monospace; }
        .btn-primary {
          background: #8B1A1A; color: #F5F0E8; border: none; cursor: pointer;
          font-family: 'Courier Prime', monospace; font-size: 11px; letter-spacing: 0.2em;
          text-transform: uppercase; padding: 14px 28px; transition: all 0.2s;
        }
        .btn-primary:hover { background: #6B1414; transform: translateY(-1px); box-shadow: 0 4px 16px rgba(139,26,26,0.3); }
        .btn-outline {
          background: transparent; color: #F5F0E8; border: 1px solid rgba(245,240,232,0.5); cursor: pointer;
          font-family: 'Courier Prime', monospace; font-size: 11px; letter-spacing: 0.2em;
          text-transform: uppercase; padding: 12px 24px; transition: all 0.2s;
        }
        .btn-outline:hover { background: rgba(245,240,232,0.1); border-color: #F5F0E8; }
        .grain-overlay {
          position: fixed; top: 0; left: 0; width: 100%; height: 100%;
          pointer-events: none; z-index: 9999; opacity: 0.03;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E");
        }
        .tag { display: inline-block; font-family: 'Courier Prime', monospace; font-size: 10px; letter-spacing: 0.2em; text-transform: uppercase; padding: 4px 10px; }
        .divider { border: none; border-top: 1px solid rgba(28,26,20,0.15); }
        
        .nav-link { position: relative; cursor: pointer; transition: color 0.3s ease; }
        .nav-link::after { content: ''; position: absolute; bottom: -4px; left: 0; width: 0; height: 1px; background: #8B1A1A; transition: width 0.3s ease; }
        .nav-link:hover::after { width: 100%; }
        .nav-link:hover { color: #8B1A1A; }
        
        .footer-link { transition: color 0.3s ease, transform 0.3s ease; display: inline-block; }
        .footer-link:hover { color: #B8860B !important; transform: translateX(4px); }
        
        .footer-tag { transition: color 0.3s ease; }
        .footer-tag:hover { color: #F5F0E8 !important; }
        
        .card-hover { transition: transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1), box-shadow 0.4s ease; }
        .card-hover:hover { transform: translateY(-6px) scale(1.01); box-shadow: 0 16px 40px rgba(28,26,20,0.15); }
        
        .decorative-line { width: 40px; height: 2px; background: #8B1A1A; }
        
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #F5F0E8; }
        ::-webkit-scrollbar-thumb { background: #8B1A1A; }
        
        @keyframes fadeDown { from { opacity:0; transform: translateY(-15px); } to { opacity:1; transform: translateY(0); } }
        .fade-down { animation: fadeDown 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; }
        
        @keyframes float { 0% { transform: translateY(0px); } 50% { transform: translateY(-10px); } 100% { transform: translateY(0px); } }
        .float-anim { animation: float 6s ease-in-out infinite; }
        
        @keyframes pulseGlow { 0% { box-shadow: 0 0 0 0 rgba(139,26,26,0.3); } 70% { box-shadow: 0 0 0 8px rgba(139,26,26,0); } 100% { box-shadow: 0 0 0 0 rgba(139,26,26,0); } }
        .btn-primary:hover { animation: pulseGlow 1.5s infinite; }

        .grid-hero { display: grid; grid-template-columns: 1fr 1fr; gap: 48px; align-items: center; }
        .flex-stats { display: flex; gap: 40px; margin-top: 48px; }
        .grid-tactile { display: grid; grid-template-columns: 280px 1fr; gap: 0; }
        .grid-faculty { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px; }
        .grid-about { display: grid; grid-template-columns: 1fr 1fr; gap: 80px; align-items: start; }
        .grid-vision { display: grid; grid-template-columns: 1fr 1fr; gap: 2px; margin-bottom: 48px; }
        .grid-core { display: grid; grid-template-columns: repeat(4, 1fr); gap: 24px; }
        .grid-protocol { display: grid; grid-template-columns: 240px 1fr; gap: 48px; align-items: center; }
        .flex-protocol-steps { display: flex; gap: 12px; }
        .grid-services { display: grid; grid-template-columns: repeat(3, 1fr); gap: 2px; }
        .flex-apply { display: flex; justify-content: space-between; align-items: center; margin-top: 48px; padding: 48px; }
        .apply-btns { display: flex; gap: 16px; flex-shrink: 0; }
        .grid-footer { display: grid; grid-template-columns: 2fr 1fr 1fr; gap: 48px; margin-bottom: 48px; }
        .flex-footer-bottom { display: flex; justify-content: space-between; align-items: center; }
        
        .nav-container { padding: 0 40px; }
        .nav-links { display: flex; gap: 32px; }
        .nav-menu-btn { display: none; cursor: pointer; }
        .mobile-menu { display: none; flex-direction: column; gap: 16px; background: rgba(245,240,232,0.98); padding: 24px; position: absolute; top: 64px; left: 0; right: 0; border-bottom: 1px solid rgba(28,26,20,0.12); backdrop-filter: blur(8px); }
        .mobile-menu.open { display: flex; }
        
        .section-pad { padding: 100px 40px; }
        .hero-pad { padding: 80px 40px 60px; }
        .tactile-wrap { padding: 0 40px 80px; }
        .tactile-header { padding: 32px; border-right: 1px solid rgba(28,26,20,0.12); }
        .tactile-content { padding: 32px; }
        .protocol-pad { padding: 60px 40px; }
        .footer-pad { padding: 60px 40px 30px; }

        @media (max-width: 992px) {
          .grid-tactile { grid-template-columns: 1fr; }
          .tactile-header { border-right: none; border-bottom: 1px solid rgba(28,26,20,0.12); }
          .grid-faculty { grid-template-columns: 1fr 1fr; }
          .grid-core { grid-template-columns: 1fr 1fr; }
          .grid-services { grid-template-columns: 1fr 1fr; }
          .grid-footer { grid-template-columns: 1fr 1fr; }
          .footer-brand { grid-column: 1 / -1; margin-bottom: 16px; }
          .grid-about { gap: 40px; }
        }

        @media (max-width: 768px) {
          .grid-hero { grid-template-columns: 1fr; gap: 32px; }
          .flex-stats { flex-direction: column; gap: 24px; margin-top: 32px; }
          .grid-faculty { grid-template-columns: 1fr; }
          .grid-about { grid-template-columns: 1fr; }
          .grid-vision { grid-template-columns: 1fr; }
          .grid-core { grid-template-columns: 1fr; }
          .grid-protocol { grid-template-columns: 1fr; gap: 24px; text-align: center; }
          .lang-switcher-desktop { display: none !important; }
          .lang-switcher-mobile { display: flex !important; justify-content: center; margin-bottom: 16px; }

          .grid-services { grid-template-columns: 1fr; }
          .grid-footer { grid-template-columns: 1fr; gap: 32px; text-align: left; }
          .grid-footer .footer-brand { align-items: flex-start; text-align: left; }
          .grid-footer > div { display: flex; flex-direction: column; align-items: flex-start; }
          .flex-footer-bottom { flex-direction: column; gap: 16px; text-align: center; }
          .flex-apply { flex-direction: column; text-align: center; gap: 24px; padding: 32px 24px; }
          
          .nav-container { padding: 0 20px; }
          .nav-links { display: none; }
          .nav-menu-btn { display: block; }
          
          .section-pad { padding: 60px 20px; }
          .hero-pad { padding: 40px 20px; }
          .tactile-wrap { padding: 0 20px 60px; }
          .tactile-header, .tactile-content { padding: 24px 16px; }
          .protocol-pad { padding: 40px 20px; }
          .footer-pad { padding: 40px 20px 20px; }
        }

        .lang-switcher-desktop { display: flex; }
        .lang-switcher-mobile { display: none; }
      `}</style>

      <div className="grain-overlay" />

      {/* NAVBAR */}
      <nav
        className="nav-container"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          background:
            scrolled || menuOpen ? "rgba(245,240,232,0.97)" : "transparent",
          borderBottom:
            scrolled || menuOpen ? "1px solid rgba(28,26,20,0.12)" : "none",
          backdropFilter: scrolled || menuOpen ? "blur(8px)" : "none",
          transition: "all 0.3s",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: "64px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            onClick={() => setLang(lang === "en" ? "id" : "en")}
            className="lang-switcher-desktop"
            style={{
              cursor: "pointer",
              fontFamily: "'Courier Prime', monospace",
              fontSize: 12,
              border: "1px solid rgba(28,26,20,0.2)",
              borderRadius: 4,
              overflow: "hidden",
            }}
          >
            <span
              style={{
                padding: "4px 8px",
                background: lang === "en" ? "#8B1A1A" : "transparent",
                color: lang === "en" ? "#F5F0E8" : "#1C1A14",
              }}
            >
              EN
            </span>
            <span
              style={{
                padding: "4px 8px",
                background: lang === "id" ? "#8B1A1A" : "transparent",
                color: lang === "id" ? "#F5F0E8" : "#1C1A14",
              }}
            >
              ID
            </span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span
              className="nav-menu-btn"
              onClick={() => setMenuOpen(!menuOpen)}
              style={{
                fontSize: 18,
                fontFamily: "'Courier Prime',monospace",
                color: "#8B1A1A",
                paddingRight: 8,
              }}
            >
              ☰
            </span>
            <span
              className="playfair"
              style={{
                fontSize: 18,
                fontWeight: 700,
                letterSpacing: "0.05em",
                cursor: "pointer",
              }}
              onClick={() => scrollTo(enNav[0])}
            >
              LEARNING WITH US.
            </span>
          </div>
        </div>
        <div className="nav-links">
          {content.nav.links.map((link, i) => {
            const sectionId = enNav[i];
            return (
              <span
                key={sectionId}
                className="nav-link garamond"
                onClick={() => scrollTo(sectionId)}
                style={{
                  fontSize: 15,
                  letterSpacing: "0.03em",
                  color: active === sectionId ? "#8B1A1A" : "#1C1A14",
                  borderBottom:
                    active === sectionId
                      ? "2px solid #8B1A1A"
                      : "2px solid transparent",
                  paddingBottom: 2,
                }}
              >
                {link}
              </span>
            );
          })}
        </div>
        <div
          onClick={() => setFormOpen(true)}
          style={{
            width: 32,
            height: 32,
            borderRadius: "50%",
            border: "1px solid rgba(28,26,20,0.3)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            fontSize: 14,
            transition: "background 0.2s, color 0.2s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = "#8B1A1A";
            e.currentTarget.style.color = "#F5F0E8";
            e.currentTarget.style.borderColor = "#8B1A1A";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.color = "#1C1A14";
            e.currentTarget.style.borderColor = "rgba(28,26,20,0.3)";
          }}
        >
          ◎
        </div>

        <div className={`mobile-menu ${menuOpen ? "open" : ""}`}>
          <div
            onClick={() => setLang(lang === "en" ? "id" : "en")}
            className="lang-switcher-mobile"
            style={{
              cursor: "pointer",
              fontFamily: "'Courier Prime', monospace",
              fontSize: 12,
              border: "1px solid rgba(28,26,20,0.2)",
              borderRadius: 4,
              overflow: "hidden",
              width: "fit-content",
              alignSelf: "center",
            }}
          >
            <span
              style={{
                padding: "4px 12px",
                background: lang === "en" ? "#8B1A1A" : "transparent",
                color: lang === "en" ? "#F5F0E8" : "#1C1A14",
              }}
            >
              EN
            </span>
            <span
              style={{
                padding: "4px 12px",
                background: lang === "id" ? "#8B1A1A" : "transparent",
                color: lang === "id" ? "#F5F0E8" : "#1C1A14",
              }}
            >
              ID
            </span>
          </div>
          {content.nav.links.map((link, i) => {
            const sectionId = enNav[i];
            return (
              <span
                key={sectionId}
                className="nav-link garamond"
                onClick={() => scrollTo(sectionId)}
                style={{
                  fontSize: 16,
                  letterSpacing: "0.03em",
                  textAlign: "center",
                  color: active === sectionId ? "#8B1A1A" : "#1C1A14",
                  padding: "8px 0",
                }}
              >
                {link}
              </span>
            );
          })}
        </div>
      </nav>

      {/* CONTACT / ENROLL MODAL */}
      {formOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 20,
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "rgba(28,26,20,0.8)",
              backdropFilter: "blur(4px)",
            }}
            onClick={() => setFormOpen(false)}
          />
          <div
            className="fade-down"
            style={{
              position: "relative",
              background: "#F5F0E8",
              border: "1px solid rgba(28,26,20,0.12)",
              width: "100%",
              maxWidth: 500,
              padding: 40,
              zIndex: 10000,
              boxShadow: "0 24px 64px rgba(0,0,0,0.2)",
            }}
          >
            <button
              onClick={() => setFormOpen(false)}
              style={{
                position: "absolute",
                top: 20,
                right: 20,
                background: "transparent",
                border: "none",
                fontSize: 24,
                cursor: "pointer",
                color: "#1C1A14",
              }}
            >
              ×
            </button>
            <div style={{ textAlign: "center", marginBottom: 32 }}>
              <span
                className="courier tag"
                style={{
                  background: "#8B1A1A",
                  color: "#F5F0E8",
                  marginBottom: 12,
                  display: "inline-block",
                }}
              >
                {content.modal.tag}
              </span>
              <h3
                className="playfair"
                style={{
                  fontSize: 28,
                  fontWeight: 700,
                  color: "#1C1A14",
                  marginBottom: 8,
                }}
              >
                {content.modal.title}
              </h3>
              <p
                className="garamond"
                style={{ fontSize: 15, color: "#6B6358" }}
              >
                {content.modal.desc}
              </p>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                alert(content.modal.success);
                setFormOpen(false);
              }}
              style={{ display: "flex", flexDirection: "column", gap: 16 }}
            >
              <div>
                <label
                  className="courier"
                  style={{
                    display: "block",
                    fontSize: 10,
                    letterSpacing: "0.1em",
                    marginBottom: 6,
                    color: "#1C1A14",
                    textTransform: "uppercase",
                  }}
                >
                  {content.modal.name}
                </label>
                <input
                  required
                  type="text"
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    background: "rgba(255,255,255,0.5)",
                    border: "1px solid rgba(28,26,20,0.15)",
                    fontFamily: "'EB Garamond', serif",
                    fontSize: 16,
                    outline: "none",
                  }}
                />
              </div>
              <div>
                <label
                  className="courier"
                  style={{
                    display: "block",
                    fontSize: 10,
                    letterSpacing: "0.1em",
                    marginBottom: 6,
                    color: "#1C1A14",
                    textTransform: "uppercase",
                  }}
                >
                  {content.modal.email}
                </label>
                <input
                  required
                  type="email"
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    background: "rgba(255,255,255,0.5)",
                    border: "1px solid rgba(28,26,20,0.15)",
                    fontFamily: "'EB Garamond', serif",
                    fontSize: 16,
                    outline: "none",
                  }}
                />
              </div>
              <div>
                <label
                  className="courier"
                  style={{
                    display: "block",
                    fontSize: 10,
                    letterSpacing: "0.1em",
                    marginBottom: 6,
                    color: "#1C1A14",
                    textTransform: "uppercase",
                  }}
                >
                  {content.modal.intent}
                </label>
                <textarea
                  required
                  rows={4}
                  style={{
                    width: "100%",
                    padding: "12px 16px",
                    background: "rgba(255,255,255,0.5)",
                    border: "1px solid rgba(28,26,20,0.15)",
                    fontFamily: "'EB Garamond', serif",
                    fontSize: 16,
                    outline: "none",
                    resize: "vertical",
                  }}
                ></textarea>
              </div>
              <button
                type="submit"
                className="btn-primary"
                style={{ marginTop: 8, width: "100%" }}
              >
                {content.modal.submit}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* HERO — HOME */}
      <section
        id="home"
        style={{
          paddingTop: 64,
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <div className="hero-pad" style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div className="grid-hero">
            <div>
              <FadeIn delay={0} direction="left">
                <span
                  className="courier tag"
                  style={{
                    background: "#8B1A1A",
                    color: "#F5F0E8",
                    marginBottom: 20,
                    display: "inline-block",
                  }}
                >
                  {content.hero.est}
                </span>
              </FadeIn>
              <FadeIn delay={0.1} direction="left">
                <h1
                  className="playfair"
                  style={{
                    fontSize: "clamp(28px, 7vw, 68px)",
                    fontWeight: 900,
                    lineHeight: 1.1,
                    marginBottom: 24,
                    letterSpacing: "-0.01em",
                  }}
                >
                  {content.hero.title1} <br />
                  <em style={{ color: "#8B1A1A" }}>{content.hero.title2}</em>
                </h1>
              </FadeIn>
              <FadeIn delay={0.2} direction="left">
                <p
                  className="garamond"
                  style={{
                    fontSize: 18,
                    lineHeight: 1.75,
                    color: "#3A3630",
                    marginBottom: 32,
                    maxWidth: 460,
                  }}
                >
                  {content.hero.desc}
                </p>
              </FadeIn>
              <FadeIn delay={0.3}>
                <div style={{ display: "flex", gap: 16 }}>
                  <button
                    className="btn-primary"
                    onClick={() => scrollTo(enNav[1])}
                  >
                    {content.hero.btnAbout}
                  </button>
                  <button
                    className="btn-outline"
                    style={{
                      color: "#1C1A14",
                      border: "1px solid rgba(28,26,20,0.35)",
                    }}
                    onClick={() => scrollTo(enNav[3])}
                  >
                    {content.hero.btnServices}
                  </button>
                </div>
              </FadeIn>
              <FadeIn delay={0.4}>
                <div className="flex-stats">
                  {content.hero.stats.map(([num, lbl]) => (
                    <div key={lbl}>
                      <div
                        className="playfair"
                        style={{
                          fontSize: 28,
                          fontWeight: 700,
                          color: "#8B1A1A",
                        }}
                      >
                        {num}
                      </div>
                      <div
                        className="courier"
                        style={{
                          fontSize: 10,
                          letterSpacing: "0.15em",
                          color: "#6B6358",
                          textTransform: "uppercase",
                        }}
                      >
                        {lbl}
                      </div>
                    </div>
                  ))}
                </div>
              </FadeIn>
            </div>
            <FadeIn delay={0.15} direction="right">
              <div style={{ position: "relative" }}>
                <div
                  style={{
                    background: "#2C2418",
                    width: "100%",
                    paddingBottom: "75%",
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      backgroundImage: "url('/src/assets/hero_photo.png')",
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  ></div>
                  <div
                    style={{
                      position: "absolute",
                      bottom: 0,
                      right: 0,
                      background: "rgba(28,26,20,0.85)",
                      padding: "8px 16px",
                    }}
                  >
                    <span
                      className="courier"
                      style={{
                        color: "#F5F0E8",
                        fontSize: 10,
                        letterSpacing: "0.2em",
                      }}
                    >
                      {content.hero.archiveRef}
                    </span>
                  </div>
                </div>
                <div
                  style={{
                    position: "absolute",
                    top: -16,
                    right: -16,
                    width: 120,
                    height: 120,
                    border: "2px solid rgba(139,26,26,0.3)",
                    zIndex: -1,
                  }}
                />
              </div>
            </FadeIn>
          </div>
        </div>

        {/* Tactile Wisdom strip */}
        <div className="tactile-wrap">
          <div
            className="grid-tactile"
            style={{
              maxWidth: 1100,
              margin: "0 auto",
              border: "1px solid rgba(28,26,20,0.12)",
            }}
          >
            <div className="tactile-header">
              <div style={{ fontSize: 24, marginBottom: 16 }}>💡</div>
              <h3
                className="playfair"
                style={{ fontSize: 22, fontWeight: 700, marginBottom: 16 }}
              >
                {content.approach.title}
              </h3>
              <p
                className="garamond"
                style={{
                  fontSize: 15,
                  lineHeight: 1.7,
                  color: "#4A4438",
                  marginBottom: 24,
                }}
              >
                {content.approach.desc}
              </p>
              <hr className="divider" style={{ marginBottom: 24 }} />
              {content.approach.items.map((item, i) => (
                <div
                  key={item}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    marginBottom: 10,
                  }}
                >
                  <div
                    style={{
                      width: 10,
                      height: 10,
                      background: ["#8B1A1A", "#B8860B", "#2C4A6E"][i],
                      flexShrink: 0,
                    }}
                  />
                  <span
                    className="courier"
                    style={{ fontSize: 11, letterSpacing: "0.1em" }}
                  >
                    {item}
                  </span>
                </div>
              ))}
            </div>
            <div className="tactile-content">
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  marginBottom: 24,
                }}
              >
                <h3
                  className="playfair"
                  style={{ fontSize: 24, fontWeight: 700 }}
                >
                  {content.approach.teamTitle}
                </h3>
                <span
                  className="courier"
                  style={{
                    fontSize: 10,
                    letterSpacing: "0.2em",
                    color: "#6B6358",
                  }}
                >
                  {content.approach.teamEst}
                </span>
              </div>
              <div className="grid-faculty" id="team">
                {content.faculty.map((f, i) => (
                  <div
                    key={f.name}
                    className="card-hover"
                    style={{
                      background: "#EDE8DC",
                      border: "1px solid rgba(28,26,20,0.1)",
                    }}
                  >
                    <div
                      style={{
                        background: "#2C2418",
                        height: 160,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        overflow: "hidden",
                      }}
                    >
                      <img
                        src={
                          [
                            "/src/assets/trainer_photo.png",
                            "/src/assets/global_network_photo.png",
                            "/src/assets/counselors_photo.png",
                          ][i]
                        }
                        alt={f.name}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    </div>
                    <div style={{ padding: "14px" }}>
                      <span
                        className="tag"
                        style={{
                          background: f.color,
                          color: "#F5F0E8",
                          fontSize: 9,
                          marginBottom: 8,
                          display: "inline-block",
                        }}
                      >
                        {f.role}
                      </span>
                      <div
                        className="playfair"
                        style={{
                          fontWeight: 700,
                          fontSize: 15,
                          marginBottom: 6,
                        }}
                      >
                        {f.name}
                      </div>
                      <div
                        className="garamond"
                        style={{
                          fontSize: 13,
                          fontStyle: "italic",
                          color: "#4A4438",
                          marginBottom: 8,
                        }}
                      >
                        {f.quote}
                      </div>
                      <div
                        className="garamond"
                        style={{
                          fontSize: 12,
                          color: "#6B6358",
                          lineHeight: 1.5,
                        }}
                      >
                        {f.desc}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section
        id="about"
        className="section-pad"
        style={{ background: "#1C1A14", color: "#F5F0E8" }}
      >
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div className="grid-about">
            <FadeIn direction="left">
              <div>
                <span
                  className="courier tag"
                  style={{
                    background: "#8B1A1A",
                    color: "#F5F0E8",
                    marginBottom: 20,
                    display: "inline-block",
                  }}
                >
                  ABOUT US
                </span>
                <h2
                  className="playfair"
                  style={{
                    color: "rgba(245,240,232,0.8)",
                    fontSize: "clamp(32px, 4vw, 52px)",
                    fontWeight: 900,
                    lineHeight: 1.1,
                    marginBottom: 28,
                  }}
                >
                  {content.about.title1} <em>{content.about.title2}</em>
                </h2>
                <p
                  className="garamond"
                  style={{
                    fontSize: 17,
                    lineHeight: 1.8,
                    color: "rgba(245,240,232,0.8)",
                    marginBottom: 20,
                  }}
                >
                  {content.about.desc1}
                </p>
                <p
                  className="garamond"
                  style={{
                    fontSize: 17,
                    lineHeight: 1.8,
                    color: "rgba(245,240,232,0.8)",
                    marginBottom: 32,
                  }}
                >
                  {content.about.desc2}
                </p>
                <button
                  className="btn-primary"
                  style={{ background: "#B8860B" }}
                >
                  {content.about.timelineTitle}
                </button>
              </div>
            </FadeIn>
            <FadeIn direction="right" delay={0.2}>
              <div>
                {/* Timeline */}
                <div
                  style={{
                    borderLeft: "2px solid rgba(139,26,26,0.5)",
                    paddingLeft: 28,
                  }}
                >
                  {content.timeline.map((item, i) => (
                    <div
                      key={item.year}
                      style={{ marginBottom: 28, position: "relative" }}
                    >
                      <div
                        style={{
                          position: "absolute",
                          left: -36,
                          top: 4,
                          width: 14,
                          height: 14,
                          borderRadius: "50%",
                          background:
                            i === 0 ? "#8B1A1A" : "rgba(245,240,232,0.2)",
                          border:
                            "2px solid " +
                            (i === 0 ? "#8B1A1A" : "rgba(245,240,232,0.3)"),
                        }}
                      />
                      <div
                        className="courier"
                        style={{
                          fontSize: 11,
                          letterSpacing: "0.2em",
                          color: "#B8860B",
                          marginBottom: 4,
                        }}
                      >
                        {item.year}
                      </div>
                      <div
                        className="garamond"
                        style={{
                          fontSize: 15,
                          lineHeight: 1.6,
                          color: "rgba(245,240,232,0.75)",
                        }}
                      >
                        {item.event}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* VISION & MISSION */}
      <section
        id="vision-mission"
        className="section-pad"
        style={{ background: "#F5F0E8" }}
      >
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <FadeIn>
            <div style={{ textAlign: "center", marginBottom: 64 }}>
              <span
                className="courier tag"
                style={{
                  background: "#8B1A1A",
                  color: "#F5F0E8",
                  marginBottom: 16,
                  display: "inline-block",
                }}
              >
                OUR PRINCIPLES
              </span>
              <h2
                className="playfair"
                style={{
                  fontSize: "clamp(32px,4vw,52px)",
                  fontWeight: 900,
                  lineHeight: 1.1,
                }}
              >
                Vision & Mission
              </h2>
            </div>
          </FadeIn>

          <div className="grid-vision">
            <FadeIn delay={0.1}>
              <div
                style={{
                  background: "#2C2418",
                  color: "#F5F0E8",
                  padding: "56px 48px",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <div style={{ marginBottom: 20 }}>
                  <div
                    style={{
                      width: 48,
                      height: 48,
                      border: "2px solid #B8860B",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginBottom: 20,
                      fontSize: 20,
                    }}
                  >
                    ◈
                  </div>
                  <span
                    className="courier"
                    style={{
                      fontSize: 10,
                      letterSpacing: "0.25em",
                      color: "#B8860B",
                      textTransform: "uppercase",
                    }}
                  >
                    {content.visionMission.visionTag}
                  </span>
                </div>
                <h3
                  className="playfair"
                  style={{
                    fontSize: 28,
                    fontWeight: 700,
                    marginBottom: 20,
                    lineHeight: 1.2,
                  }}
                >
                  {content.visionMission.visionTitle}
                </h3>
                <p
                  className="garamond"
                  style={{
                    fontSize: 16,
                    lineHeight: 1.8,
                    flexGrow: 1,
                    color: "rgba(245,240,232,0.75)",
                  }}
                >
                  {content.visionMission.visionDesc}
                </p>
              </div>
            </FadeIn>
            <FadeIn delay={0.2}>
              <div
                style={{
                  background: "#8B1A1A",
                  color: "#F5F0E8",
                  padding: "56px 48px",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <div style={{ marginBottom: 20 }}>
                  <div
                    style={{
                      width: 48,
                      height: 48,
                      border: "2px solid rgba(245,240,232,0.4)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginBottom: 20,
                      fontSize: 20,
                    }}
                  >
                    ◉
                  </div>
                  <span
                    className="courier"
                    style={{
                      fontSize: 10,
                      letterSpacing: "0.25em",
                      color: "rgba(245,240,232,0.7)",
                      textTransform: "uppercase",
                    }}
                  >
                    {content.visionMission.missionTag}
                  </span>
                </div>
                <h3
                  className="playfair"
                  style={{
                    fontSize: 28,
                    fontWeight: 700,
                    marginBottom: 20,
                    lineHeight: 1.2,
                  }}
                >
                  {content.visionMission.missionTitle}
                </h3>
                <p
                  className="garamond"
                  style={{
                    fontSize: 16,
                    lineHeight: 1.8,
                    flexGrow: 1,
                    color: "rgba(245,240,232,0.85)",
                  }}
                >
                  {content.visionMission.missionDesc}
                </p>
              </div>
            </FadeIn>
          </div>

          {/* Core Values */}
          <FadeIn delay={0.1}>
            <div
              style={{
                background: "#EDE8DC",
                border: "1px solid rgba(28,26,20,0.12)",
                padding: "48px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 36,
                }}
              >
                <h3
                  className="playfair"
                  style={{ fontSize: 24, fontWeight: 700 }}
                >
                  Core Values
                </h3>
                <span
                  className="courier"
                  style={{
                    fontSize: 10,
                    letterSpacing: "0.2em",
                    color: "#6B6358",
                  }}
                >
                  EST. 2014
                </span>
              </div>
              <div className="grid-core">
                {content.coreValues.map(({ title, desc }, idx) => (
                  <div
                    key={title}
                    style={{ borderTop: "2px solid #8B1A1A", paddingTop: 20 }}
                  >
                    <div style={{ fontSize: 22, marginBottom: 8 }}>
                      {["🌱", "⭐", "🗣️", "📚"][idx]}
                    </div>
                    <div
                      className="playfair"
                      style={{
                        fontSize: 18,
                        fontWeight: 700,
                        marginBottom: 10,
                      }}
                    >
                      {title}
                    </div>
                    <div
                      className="garamond"
                      style={{
                        fontSize: 14,
                        lineHeight: 1.6,
                        color: "#4A4438",
                      }}
                    >
                      {desc}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Interactive Learning Method Banner */}
      <section className="protocol-pad" style={{ background: "#B8860B" }}>
        <div
          className="grid-protocol"
          style={{ maxWidth: 1100, margin: "0 auto" }}
        >
          <div style={{ color: "#F5F0E8" }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>✦</div>
            <h3
              className="playfair"
              style={{ fontSize: 28, fontWeight: 900, lineHeight: 1.1 }}
            >
              {content.protocol.title1} {content.protocol.title2}
            </h3>
          </div>
          <div style={{ color: "#F5F0E8" }}>
            <p
              className="garamond"
              style={{
                fontSize: 17,
                lineHeight: 1.7,
                marginBottom: 24,
                color: "rgba(245,240,232,0.9)",
              }}
            >
              {content.protocol.desc}
            </p>
            <div className="flex-protocol-steps">
              {content.protocol.steps.map((step) => (
                <span
                  key={step}
                  className="courier"
                  style={{
                    border: "1px solid rgba(245,240,232,0.5)",
                    padding: "10px 18px",
                    fontSize: 11,
                    letterSpacing: "0.12em",
                    color: "#F5F0E8",
                    textTransform: "uppercase",
                  }}
                >
                  {step}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* PRODUCTS & SERVICES */}
      <section
        id="products-services"
        className="section-pad"
        style={{ background: "#F5F0E8" }}
      >
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <FadeIn>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-end",
                marginBottom: 60,
              }}
            >
              <div>
                <span
                  className="courier tag"
                  style={{
                    background: "#8B1A1A",
                    color: "#F5F0E8",
                    marginBottom: 16,
                    display: "inline-block",
                  }}
                >
                  {content.servicesConfig.tag}
                </span>
                <h2
                  className="playfair"
                  style={{
                    fontSize: "clamp(32px,4vw,52px)",
                    fontWeight: 900,
                    lineHeight: 1.1,
                  }}
                >
                  {content.servicesConfig.title1}{" "}
                  <em style={{ color: "#8B1A1A" }}>
                    {content.servicesConfig.title2}
                  </em>
                </h2>
              </div>
              <div style={{ maxWidth: 320, textAlign: "right" }}>
                <p
                  className="garamond"
                  style={{ fontSize: 16, lineHeight: 1.7, color: "#4A4438" }}
                >
                  {content.servicesConfig.desc}
                </p>
              </div>
            </div>
          </FadeIn>

          <div className="grid-services">
            {content.services.map((svc, i) => (
              <FadeIn key={svc.code} delay={i * 0.08}>
                <div
                  className="card-hover"
                  style={{
                    background:
                      i % 3 === 0
                        ? "#EDE8DC"
                        : i % 3 === 1
                          ? "#2C2418"
                          : "#EDE8DC",
                    color: i % 3 === 1 ? "#F5F0E8" : "#1C1A14",
                    padding: "36px 32px",
                    cursor: "pointer",
                    border: "1px solid rgba(28,26,20,0.08)",
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      marginBottom: 20,
                    }}
                  >
                    <span style={{ fontSize: 28 }}>{svc.icon}</span>
                    <span
                      className="courier"
                      style={{
                        fontSize: 10,
                        letterSpacing: "0.2em",
                        color:
                          i % 3 === 1 ? "rgba(245,240,232,0.4)" : "#9A8E7E",
                      }}
                    >
                      {svc.code}
                    </span>
                  </div>
                  <div
                    style={{
                      width: 32,
                      height: 2,
                      background: "#8B1A1A",
                      marginBottom: 16,
                    }}
                  />
                  <h4
                    className="playfair"
                    style={{
                      fontSize: 20,
                      fontWeight: 700,
                      marginBottom: 14,
                      lineHeight: 1.2,
                    }}
                  >
                    {svc.title}
                  </h4>
                  <p
                    className="garamond"
                    style={{
                      fontSize: 15,
                      lineHeight: 1.7,
                      flexGrow: 1,
                      color: i % 3 === 1 ? "rgba(245,240,232,0.7)" : "#4A4438",
                    }}
                  >
                    {svc.desc}
                  </p>
                  <div style={{ marginTop: 24 }}>
                    <span
                      className="courier"
                      style={{
                        fontSize: 10,
                        letterSpacing: "0.2em",
                        color: "#8B1A1A",
                        borderBottom: "1px solid #8B1A1A",
                        paddingBottom: 2,
                        cursor: "pointer",
                      }}
                    >
                      {content.servicesConfig.learnMore}
                    </span>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>

          <FadeIn delay={0.2}>
            <div
              className="flex-apply"
              style={{
                background: "#1C1A14",
                color: "#F5F0E8",
                border: "1px solid rgba(245,240,232,0.1)",
              }}
            >
              <div>
                <h3
                  className="playfair"
                  style={{ fontSize: 26, fontWeight: 700, marginBottom: 10 }}
                >
                  {content.cta.title}
                </h3>
                <p
                  className="garamond"
                  style={{ fontSize: 16, color: "rgba(245,240,232,0.7)" }}
                >
                  {content.cta.desc}
                </p>
              </div>
              <div className="apply-btns">
                <button
                  className="btn-primary"
                  onClick={() => setFormOpen(true)}
                >
                  {content.cta.btnEnroll}
                </button>
                <button
                  className="btn-outline"
                  onClick={() => scrollTo(enNav[3])}
                >
                  {content.cta.btnExplore}
                </button>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* FOOTER */}
      <footer
        className="footer-pad"
        style={{
          background: "#0F0D09",
          color: "#F5F0E8",
          borderTop: "1px solid rgba(28,26,20,0.1)",
        }}
      >
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div className="grid-footer">
            <div className="footer-brand">
              <div
                className="playfair"
                style={{
                  fontSize: 22,
                  fontWeight: 700,
                  marginBottom: 16,
                  letterSpacing: "0.05em",
                }}
              >
                LEARNING WITH US
              </div>
              <p
                className="garamond"
                style={{
                  fontSize: 15,
                  lineHeight: 1.8,
                  color: "rgba(245,240,232,0.55)",
                  maxWidth: 300,
                  marginBottom: 28,
                }}
              >
                {content.footer.brandDesc}
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
                {content.footer.links1.map((link, idx) => (
                  <span
                    key={link}
                    onClick={() => {
                      if (idx === 0)
                        scrollTo(enNav[1]); // About
                      else if (idx === 1)
                        document
                          .getElementById("team")
                          ?.scrollIntoView({ behavior: "smooth" }); // Team
                      else if (idx === 2)
                        scrollTo(enNav[3]); // Courses
                      else if (idx === 3) setFormOpen(true); // Contact
                    }}
                    className="courier footer-tag"
                    style={{
                      fontSize: 10,
                      letterSpacing: "0.15em",
                      color: "rgba(245,240,232,0.4)",
                      cursor: "pointer",
                      textTransform: "uppercase",
                    }}
                  >
                    {link}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <div
                className="courier"
                style={{
                  fontSize: 10,
                  letterSpacing: "0.2em",
                  color: "#B8860B",
                  textTransform: "uppercase",
                  marginBottom: 24,
                }}
              >
                {content.footer.programs}
              </div>
              {content.footer.links2.map((link) => (
                <div key={link} style={{ marginBottom: 12 }}>
                  <span
                    onClick={() => scrollTo(enNav[3])}
                    className="garamond footer-link"
                    style={{
                      fontSize: 15,
                      color: "rgba(245,240,232,0.6)",
                      cursor: "pointer",
                    }}
                  >
                    {link}
                  </span>
                </div>
              ))}
            </div>
            <div>
              <div
                className="courier"
                style={{
                  fontSize: 10,
                  letterSpacing: "0.2em",
                  color: "#B8860B",
                  textTransform: "uppercase",
                  marginBottom: 24,
                }}
              >
                {content.footer.connect}
              </div>
              {content.footer.links3.map((link, idx) => (
                <div key={link} style={{ marginBottom: 12 }}>
                  <span
                    onClick={() => {
                      if (idx === 0)
                        window.open("https://instagram.com", "_blank");
                      else if (idx === 1)
                        window.open("https://linkedin.com", "_blank");
                      else if (idx === 2)
                        window.location.href =
                          "mailto:contact@learningwithus.com";
                      else if (idx === 3) setFormOpen(true);
                    }}
                    className="garamond footer-link"
                    style={{
                      fontSize: 15,
                      color: "rgba(245,240,232,0.6)",
                      cursor: "pointer",
                    }}
                  >
                    {link}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <hr
            style={{
              border: "none",
              borderTop: "1px solid rgba(245,240,232,0.1)",
              marginBottom: 24,
            }}
          />
          <div className="flex-footer-bottom">
            <span
              className="courier"
              style={{
                fontSize: 10,
                letterSpacing: "0.2em",
                color: "rgba(245,240,232,0.35)",
                textAlign: "center",
              }}
            >
              {content.footer.copyright}
            </span>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 24,
                justifyContent: "center",
              }}
            >
              <span
                className="courier footer-tag"
                style={{
                  fontSize: 10,
                  letterSpacing: "0.15em",
                  color: "rgba(245,240,232,0.25)",
                  cursor: "pointer",
                }}
              >
                {content.footer.terms}
              </span>
              <span
                className="courier footer-tag"
                style={{
                  fontSize: 10,
                  letterSpacing: "0.15em",
                  color: "rgba(245,240,232,0.25)",
                  cursor: "pointer",
                }}
              >
                {content.footer.privacy}
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
