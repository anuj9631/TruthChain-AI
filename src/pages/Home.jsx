import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import HeroScene from "../components/three/HeroScene";

const CLAIMS = [
  "5G towers cause memory loss in urban residents...",
  "Scientists link tap water fluoride to IQ decline...",
  "mRNA vaccines permanently alter human DNA...",
  "Election machines in 4 states remotely hacked...",
  "Chemtrails are secretly altering weather patterns...",
];

const STATS = [
  { display: "2.4M", suffix: "+", label: "Claims Analyzed" },
  { display: "94",   suffix: "%", label: "Detection Accuracy" },
  { display: "18",   suffix: "m", label: "Minutes Ahead" },
  { display: "140",  suffix: "+", label: "Countries Covered" },
];

const FEATURES = [
  {
    icon: "◈", title: "Viral Prediction",
    desc: "Detects spread patterns 18 minutes before mainstream explosion using real-time velocity modeling.",
    tag: "CORE ENGINE", color: "#c8f060", glow: "rgba(200,240,96,0.08)",
  },
  {
    icon: "⬡", title: "Network Mapping",
    desc: "Graph-based AI traces exactly which communities will amplify a claim next and why.",
    tag: "GRAPH AI", color: "#5ce4b8", glow: "rgba(92,228,184,0.08)",
  },
  {
    icon: "◎", title: "Risk Scoring",
    desc: "Every claim scored 0–100 across emotion, source trust, velocity, and historical patterns.",
    tag: "SCORING", color: "#ffb74d", glow: "rgba(255,183,77,0.08)",
  },
  {
    icon: "⟁", title: "Live Alert Feed",
    desc: "Real-time dangerous claim monitoring ranked by spread risk for journalists and analysts.",
    tag: "LIVE FEED", color: "#ff6b6b", glow: "rgba(255,107,107,0.08)",
  },
];

const TESTIMONIALS = [
  {
    quote: "TruthChain flagged the story 22 minutes before it exploded. We had a rebuttal ready.",
    name: "Dr. Priya Nair", role: "Disinformation Researcher, MIT",
    avatar: "PN", color: "#5ce4b8",
  },
  {
    quote: "The most accurate early-warning tool I've used. The network map alone is worth everything.",
    name: "James Okafor", role: "Investigative Journalist, Reuters",
    avatar: "JO", color: "#c8f060",
  },
  {
    quote: "We integrated the API into our newsroom. False narrative spread dropped 41%.",
    name: "Sofia Marchetti", role: "Head of Editorial, The Verge",
    avatar: "SM", color: "#ffb74d",
  },
];

/* ── Custom Cursor ── */
// function CustomCursor() {
//   const dot  = useRef(null);
//   const ring = useRef(null);
//   useEffect(() => {
//     let rx = 0, ry = 0;
//     const onMove = (e) => {
//       const x = e.clientX, y = e.clientY;
//       if (dot.current)  { dot.current.style.left = x + "px";  dot.current.style.top = y + "px"; }
//       if (ring.current) {
//         rx += (x - rx) * 0.12; ry += (y - ry) * 0.12;
//         ring.current.style.left = rx + "px"; ring.current.style.top = ry + "px";
//       }
//     };
//     window.addEventListener("mousemove", onMove);
//     return () => window.removeEventListener("mousemove", onMove);
//   }, []);
//   return (
//     <>
//       <div ref={dot}  className="cursor-dot" />
//       <div ref={ring} className="cursor-ring" />
//     </>
//   );
// }

/* ── Grid Background ── */
function GridBackground() {
  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none",
      backgroundImage: `
        linear-gradient(rgba(255,255,255,0.022) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255,255,255,0.022) 1px, transparent 1px)`,
      backgroundSize: "48px 48px",
      animation: "gridScroll 12s linear infinite",
      maskImage: "radial-gradient(ellipse 90% 70% at 50% 0%, black 30%, transparent 100%)",
    }} />
  );
}

/* ── Scanline ── */
function Scanline() {
  return (
    <div style={{
      position: "fixed", left: 0, right: 0, height: "3px", zIndex: 2,
      background: "linear-gradient(transparent, rgba(200,240,96,0.055), transparent)",
      animation: "scanline 9s linear infinite", pointerEvents: "none",
    }} />
  );
}

/* ── Ambient Orbs ── */
function AmbientOrbs() {
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none", overflow: "hidden" }}>
      <div style={{
        position: "absolute", top: "-10%", left: "10%",
        width: 700, height: 700, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(200,240,96,0.04) 0%, transparent 70%)",
        animation: "orb1 18s ease-in-out infinite",
      }} />
      <div style={{
        position: "absolute", top: "20%", right: "-5%",
        width: 600, height: 600, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(92,228,184,0.03) 0%, transparent 70%)",
        animation: "orb2 22s ease-in-out infinite",
      }} />
    </div>
  );
}

/* ── Typewriter ── */
function TypewriterText({ texts }) {
  const [display, setDisplay] = useState("");
  const [idx, setIdx]         = useState(0);
  const [phase, setPhase]     = useState("typing");
  useEffect(() => {
    const current = texts[idx];
    let t;
    if (phase === "typing") {
      if (display.length < current.length) {
        t = setTimeout(() => setDisplay(current.slice(0, display.length + 1)), 36);
      } else {
        t = setTimeout(() => setPhase("deleting"), 2400);
      }
    } else {
      if (display.length > 0) {
        t = setTimeout(() => setDisplay(display.slice(0, -1)), 16);
      } else { setIdx((i) => (i + 1) % texts.length); setPhase("typing"); }
    }
    return () => clearTimeout(t);
  }, [display, phase, idx, texts]);
  return (
    <span style={{ color: "#ff6b6b", fontFamily: "'IBM Plex Mono', monospace" }}>
      {display}
      <span style={{ animation: "blink 0.9s step-end infinite", color: "#ff6b6b" }}>▋</span>
    </span>
  );
}

/* ── Feature Card ── */
function FeatureCard({ f, i }) {
  const [hov, setHov] = useState(false);
  const [visible, setVisible] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.15 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return (
    <div ref={ref}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: hov ? "#0e1116" : "rgba(13,15,18,0.5)",
        border: `0.5px solid ${hov ? "rgba(255,255,255,0.14)" : "rgba(255,255,255,0.06)"}`,
        borderRadius: 14, padding: "32px 26px", cursor: "default",
        transition: "all 0.35s cubic-bezier(0.16,1,0.3,1)",
        transform: visible ? (hov ? "translateY(-8px)" : "translateY(0)") : "translateY(28px)",
        opacity: visible ? 1 : 0,
        backdropFilter: "blur(12px)",
        boxShadow: hov ? `0 20px 60px ${f.glow}` : "none",
        position: "relative", overflow: "hidden",
      }}>
      {hov && (
        <div style={{
          position: "absolute", inset: 0, borderRadius: 14,
          background: `radial-gradient(circle at 30% 30%, ${f.glow} 0%, transparent 70%)`,
          pointerEvents: "none",
        }} />
      )}
      <div style={{
        fontFamily: "'IBM Plex Mono', monospace", fontSize: 32, color: f.color,
        marginBottom: 18, display: "inline-block",
        transition: "transform 0.3s cubic-bezier(0.16,1,0.3,1), filter 0.3s",
        transform: hov ? "scale(1.15) rotate(-5deg)" : "scale(1)",
        filter: hov ? `drop-shadow(0 0 12px ${f.color}88)` : "none",
      }}>{f.icon}</div>
      <div style={{
        fontFamily: "'IBM Plex Mono', monospace", fontSize: 9,
        color: f.color, letterSpacing: "0.16em", marginBottom: 10, opacity: 0.75,
      }}>{f.tag}</div>
      <h3 style={{
        fontFamily: "'Syne', sans-serif", fontWeight: 700,
        fontSize: 19, marginBottom: 10, letterSpacing: "-0.4px", color: "#eceae2",
      }}>{f.title}</h3>
      <p style={{ fontSize: 13, color: "#5c6472", lineHeight: 1.75 }}>{f.desc}</p>
      <div style={{ marginTop: 20, height: 1, background: "rgba(255,255,255,0.05)", overflow: "hidden" }}>
        <div style={{
          height: "100%", background: f.color,
          width: hov ? "100%" : "0%",
          transition: "width 0.5s cubic-bezier(0.16,1,0.3,1)",
        }} />
      </div>
    </div>
  );
}

/* ── Testimonial Card ── */
function TestimonialCard({ t, i }) {
  const [visible, setVisible] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.2 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return (
    <div ref={ref} style={{
      background: "rgba(12,14,17,0.7)",
      border: "0.5px solid rgba(255,255,255,0.07)",
      borderRadius: 14, padding: "28px 24px", backdropFilter: "blur(12px)",
      transition: "all 0.7s cubic-bezier(0.16,1,0.3,1)",
      transform: visible ? "translateY(0)" : "translateY(32px)",
      opacity: visible ? 1 : 0,
      transitionDelay: `${i * 0.12}s`,
    }}>
      <div style={{ fontSize: 28, color: t.color, opacity: 0.4, fontFamily: "Georgia, serif", marginBottom: 14 }}>"</div>
      <p style={{ fontSize: 14, color: "#8a929e", lineHeight: 1.75, marginBottom: 22 }}>{t.quote}</p>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{
          width: 38, height: 38, borderRadius: "50%",
          background: `linear-gradient(135deg, ${t.color}33, ${t.color}11)`,
          border: `1px solid ${t.color}44`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontFamily: "'IBM Plex Mono', monospace", fontSize: 11, color: t.color, fontWeight: 500,
        }}>{t.avatar}</div>
        <div>
          <div style={{ fontSize: 13, fontWeight: 500, color: "#ddd", letterSpacing: "-0.2px" }}>{t.name}</div>
          <div style={{ fontSize: 11, color: "#505866", marginTop: 2 }}>{t.role}</div>
        </div>
      </div>
    </div>
  );
}

/* ── MAIN HOME PAGE ── */
export default function Home() {
  const navigate = useNavigate();

  return (
    <div style={{ position: "relative", minHeight: "100vh", background: "#050607" }}>
      {/* <CustomCursor /> */}
      <GridBackground />
      <Scanline />
      <AmbientOrbs />
      <Navbar />

      {/* HERO */}
      <section style={{
        position: "relative", zIndex: 10,
        maxWidth: 1000, margin: "0 auto",
        padding: "110px 24px 90px", textAlign: "center",
        minHeight: "88vh", display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
      }}>
        {/* 3D Scene behind hero */}
        <div style={{ position: "absolute", inset: 0, zIndex: 0 }}>
          <HeroScene />
        </div>

        <div style={{ position: "relative", zIndex: 2 }}>
          <div className="animate-fadeup d1" style={{
            display: "inline-flex", alignItems: "center", gap: 10,
            background: "rgba(255,107,107,0.07)",
            border: "0.5px solid rgba(255,107,107,0.22)",
            borderRadius: 24, padding: "7px 18px", marginBottom: 44,
          }}>
            <span style={{
              width: 7, height: 7, borderRadius: "50%",
              background: "#ff6b6b", display: "inline-block",
              animation: "dotPulse 1.8s ease-in-out infinite",
            }} />
            <span style={{
              fontFamily: "'IBM Plex Mono', monospace", fontSize: 10,
              color: "#ff6b6b", letterSpacing: "0.12em",
            }}>LIVE — MONITORING 2.4M CLAIMS ACROSS 140 COUNTRIES</span>
          </div>

          <h1 className="animate-fadeup d2" style={{
            fontFamily: "'Syne', sans-serif", fontWeight: 800,
            fontSize: "clamp(44px, 7.5vw, 88px)",
            lineHeight: 1.02, letterSpacing: "-2.5px", marginBottom: 30,
          }}>
            <span style={{
              background: "linear-gradient(135deg, #eceae2 30%, rgba(236,234,226,0.55) 100%)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            }}>Stop misinformation</span>
            <br />
            <span style={{
              background: "linear-gradient(135deg, #c8f060 0%, #5ce4b8 100%)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            }}>before</span>
            <span style={{
              background: "linear-gradient(135deg, #eceae2 30%, rgba(236,234,226,0.55) 100%)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            }}> it spreads.</span>
          </h1>

          <p className="animate-fadeup d3" style={{
            fontSize: "clamp(15px, 1.8vw, 18px)", color: "#5c6472",
            maxWidth: 540, margin: "0 auto 24px", lineHeight: 1.75,
          }}>
            The only AI that predicts viral misinformation{" "}
            <em style={{ color: "#8a929e", fontStyle: "normal" }}>18 minutes</em>{" "}
            before it explodes — for researchers, journalists, and truth defenders.
          </p>

          <div className="animate-fadeup d3" style={{
            fontFamily: "'IBM Plex Mono', monospace", fontSize: 13,
            color: "#3d444f", marginBottom: 52, minHeight: 22,
          }}>
            <span style={{ marginRight: 8 }}>→</span>
            <TypewriterText texts={CLAIMS} />
          </div>

          <div className="animate-fadeup d4" style={{
            display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap",
          }}>
            <button
              onClick={() => navigate("/analyze")}
              style={{
                background: "linear-gradient(135deg, #c8f060 0%, #a8e040 100%)",
                color: "#050607", border: "none", borderRadius: 8,
                padding: "15px 36px", fontFamily: "'Syne', sans-serif",
                fontWeight: 700, fontSize: 15, cursor: "pointer",
                letterSpacing: "-0.3px", transition: "all 0.25s cubic-bezier(0.16,1,0.3,1)",
              }}
              onMouseEnter={e => {
                e.target.style.transform = "scale(1.04) translateY(-2px)";
                e.target.style.boxShadow = "0 12px 40px rgba(200,240,96,0.25)";
              }}
              onMouseLeave={e => {
                e.target.style.transform = "scale(1) translateY(0)";
                e.target.style.boxShadow = "none";
              }}
            >Start Analyzing Free →</button>

            <button
              onClick={() => navigate("/research")}
              style={{
                background: "rgba(255,255,255,0.03)", color: "#9aa0aa",
                border: "0.5px solid rgba(255,255,255,0.12)",
                borderRadius: 8, padding: "15px 36px",
                fontFamily: "'Syne', sans-serif", fontWeight: 600, fontSize: 15,
                cursor: "pointer", transition: "all 0.25s",
              }}
              onMouseEnter={e => {
                e.target.style.color = "#eceae2";
                e.target.style.borderColor = "rgba(255,255,255,0.25)";
                e.target.style.background = "rgba(255,255,255,0.05)";
              }}
              onMouseLeave={e => {
                e.target.style.color = "#9aa0aa";
                e.target.style.borderColor = "rgba(255,255,255,0.12)";
                e.target.style.background = "rgba(255,255,255,0.03)";
              }}
            >See Research →</button>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section style={{
        position: "relative", zIndex: 10,
        borderTop: "0.5px solid rgba(255,255,255,0.05)",
        borderBottom: "0.5px solid rgba(255,255,255,0.05)",
        padding: "44px 48px",
        background: "rgba(10,11,14,0.6)", backdropFilter: "blur(20px)",
        display: "flex", justifyContent: "center",
        gap: "clamp(32px, 8vw, 110px)", flexWrap: "wrap",
      }}>
        {STATS.map((s, i) => (
          <div key={i} style={{ textAlign: "center" }}>
            <div style={{
              fontFamily: "'Syne', sans-serif", fontWeight: 800,
              fontSize: "clamp(28px, 4vw, 42px)", letterSpacing: "-1.5px",
              background: "linear-gradient(135deg, #c8f060 0%, #5ce4b8 100%)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            }}>{s.display}<span style={{ fontSize: "0.6em" }}>{s.suffix}</span></div>
            <div style={{
              fontFamily: "'IBM Plex Mono', monospace", fontSize: 10,
              color: "#505866", letterSpacing: "0.14em", marginTop: 6, textTransform: "uppercase",
            }}>{s.label}</div>
          </div>
        ))}
      </section>

      {/* FEATURES */}
      <section style={{
        position: "relative", zIndex: 10,
        maxWidth: 1060, margin: "0 auto", padding: "110px 24px",
      }}>
        <div style={{ textAlign: "center", marginBottom: 72 }}>
          <div style={{
            fontFamily: "'IBM Plex Mono', monospace", fontSize: 10,
            color: "#5ce4b8", letterSpacing: "0.2em", marginBottom: 16, opacity: 0.8,
          }}>HOW IT WORKS</div>
          <h2 style={{
            fontFamily: "'Syne', sans-serif", fontWeight: 800,
            fontSize: "clamp(30px, 4.5vw, 52px)", letterSpacing: "-1.5px",
            background: "linear-gradient(135deg, #eceae2 0%, rgba(236,234,226,0.5) 100%)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          }}>Four layers of detection</h2>
        </div>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))",
          gap: 16,
        }}>
          {FEATURES.map((f, i) => <FeatureCard key={i} f={f} i={i} />)}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section style={{
        position: "relative", zIndex: 10,
        maxWidth: 1060, margin: "0 auto", padding: "0 24px 110px",
      }}>
        <div style={{ textAlign: "center", marginBottom: 64 }}>
          <div style={{
            fontFamily: "'IBM Plex Mono', monospace", fontSize: 10,
            color: "#c8f060", letterSpacing: "0.2em", marginBottom: 16, opacity: 0.8,
          }}>TRUSTED BY RESEARCHERS</div>
          <h2 style={{
            fontFamily: "'Syne', sans-serif", fontWeight: 800,
            fontSize: "clamp(28px, 4vw, 46px)", letterSpacing: "-1.5px",
            background: "linear-gradient(135deg, #eceae2 0%, rgba(236,234,226,0.5) 100%)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          }}>From the frontlines</h2>
        </div>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: 16,
        }}>
          {TESTIMONIALS.map((t, i) => <TestimonialCard key={i} t={t} i={i} />)}
        </div>
      </section>

      {/* CTA */}
      <section style={{
        position: "relative", zIndex: 10,
        maxWidth: 740, margin: "0 auto 110px", padding: "0 24px", textAlign: "center",
      }}>
        <div style={{
          background: "rgba(10,11,14,0.8)",
          border: "0.5px solid rgba(200,240,96,0.18)",
          borderRadius: 18, padding: "64px 48px", backdropFilter: "blur(20px)",
          boxShadow: "0 0 120px rgba(200,240,96,0.04)",
          position: "relative", overflow: "hidden",
        }}>
          <div style={{
            fontFamily: "'IBM Plex Mono', monospace", fontSize: 10,
            color: "#c8f060", letterSpacing: "0.18em", marginBottom: 20, opacity: 0.8,
          }}>FREE FOR STUDENTS & RESEARCHERS</div>
          <h2 style={{
            fontFamily: "'Syne', sans-serif", fontWeight: 800,
            fontSize: "clamp(26px, 4vw, 44px)", letterSpacing: "-1.5px", marginBottom: 16,
            background: "linear-gradient(135deg, #eceae2, rgba(236,234,226,0.6))",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          }}>Ready to fight misinformation?</h2>
          <p style={{ color: "#555d6a", fontSize: 15, marginBottom: 40, lineHeight: 1.8 }}>
            Join researchers using TruthChain AI to detect, track,
            and neutralize false narratives before they cause real-world harm.
          </p>
          <button
            onClick={() => navigate("/analyze")}
            style={{
              background: "linear-gradient(135deg, #c8f060, #a8e040)",
              color: "#050607", border: "none", borderRadius: 8,
              padding: "15px 44px", fontFamily: "'Syne', sans-serif",
              fontWeight: 700, fontSize: 16, cursor: "pointer",
              transition: "all 0.25s cubic-bezier(0.16,1,0.3,1)",
            }}
            onMouseEnter={e => {
              e.target.style.transform = "scale(1.05) translateY(-3px)";
              e.target.style.boxShadow = "0 16px 50px rgba(200,240,96,0.3)";
            }}
            onMouseLeave={e => {
              e.target.style.transform = "scale(1) translateY(0)";
              e.target.style.boxShadow = "none";
            }}
          >Launch TruthChain AI →</button>
        </div>
      </section>

      <Footer />
    </div>
  );
}