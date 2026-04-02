import { useState, useEffect, useRef, useCallback } from "react";

/* ─────────────────── DATA ─────────────────── */
const CLAIMS = [
  "5G towers cause memory loss in urban residents...",
  "Scientists link tap water fluoride to IQ decline...",
  "mRNA vaccines permanently alter human DNA...",
  "Election machines in 4 states remotely hacked...",
  "Chemtrails are secretly altering weather patterns...",
];

const STATS = [
  { value: 2400000, display: "2.4M", suffix: "+", label: "Claims Analyzed" },
  { value: 94,      display: "94",   suffix: "%",  label: "Detection Accuracy" },
  { value: 18,      display: "18",   suffix: "m",  label: "Minutes Ahead" },
  { value: 140,     display: "140",  suffix: "+",  label: "Countries Covered" },
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
    quote: "We integrated the API into our newsroom workflow. False narrative spread dropped 41%.",
    name: "Sofia Marchetti", role: "Head of Editorial, The Verge",
    avatar: "SM", color: "#ffb74d",
  },
];

/* ─────────────────── COMPONENTS ─────────────────── */

function CustomCursor() {
  const dot  = useRef(null);
  const ring = useRef(null);

  useEffect(() => {
    let rx = 0, ry = 0;
    const onMove = (e) => {
      const x = e.clientX, y = e.clientY;
      if (dot.current)  { dot.current.style.left  = x + "px"; dot.current.style.top  = y + "px"; }
      if (ring.current) {
        rx += (x - rx) * 0.12;
        ry += (y - ry) * 0.12;
        ring.current.style.left = rx + "px";
        ring.current.style.top  = ry + "px";
      }
    };
    const raf = () => { requestAnimationFrame(raf); };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <>
      <div ref={dot}  className="cursor-dot" />
      <div ref={ring} className="cursor-ring" />
    </>
  );
}

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

function Scanline() {
  return (
    <div style={{
      position: "fixed", left: 0, right: 0, height: "3px", zIndex: 1,
      background: "linear-gradient(transparent, rgba(200,240,96,0.055), transparent)",
      animation: "scanline 9s linear infinite",
      pointerEvents: "none",
    }} />
  );
}

function AmbientOrbs() {
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none", overflow: "hidden" }}>
      <div style={{
        position: "absolute", top: "-10%", left: "10%",
        width: 700, height: 700, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(200,240,96,0.045) 0%, transparent 70%)",
        animation: "orb1 18s ease-in-out infinite",
        filter: "blur(1px)",
      }} />
      <div style={{
        position: "absolute", top: "20%", right: "-5%",
        width: 600, height: 600, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(92,228,184,0.035) 0%, transparent 70%)",
        animation: "orb2 22s ease-in-out infinite",
        filter: "blur(1px)",
      }} />
      <div style={{
        position: "absolute", bottom: "10%", left: "30%",
        width: 500, height: 500, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(255,107,107,0.025) 0%, transparent 70%)",
        animation: "orb1 26s ease-in-out infinite reverse",
      }} />
    </div>
  );
}

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
      } else {
        setIdx((i) => (i + 1) % texts.length);
        setPhase("typing");
      }
    }
    return () => clearTimeout(t);
  }, [display, phase, idx, texts]);

  return (
    <span style={{ color: "#ff6b6b", fontFamily: "'IBM Plex Mono', monospace" }}>
      {display}
      <span style={{ animation: "blink 0.9s step-end infinite", color: "#ff6b6b", marginLeft: 1 }}>▋</span>
    </span>
  );
}

function AnimatedStat({ display, suffix, label, delay }) {
  const [visible, setVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.5 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={ref} style={{
      textAlign: "center",
      animation: visible ? `counterUp 0.7s ${delay}s cubic-bezier(0.16,1,0.3,1) both` : "none",
      opacity: visible ? 1 : 0,
    }}>
      <div style={{
        fontFamily: "'Syne', sans-serif", fontWeight: 800,
        fontSize: "clamp(28px, 4vw, 42px)",
        letterSpacing: "-1.5px",
        background: "linear-gradient(135deg, #c8f060 0%, #5ce4b8 100%)",
        WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
      }}>
        {display}<span style={{ fontSize: "0.6em" }}>{suffix}</span>
      </div>
      <div style={{
        fontFamily: "'IBM Plex Mono', monospace", fontSize: 10,
        color: "#505866", letterSpacing: "0.14em", marginTop: 6,
        textTransform: "uppercase",
      }}>{label}</div>
    </div>
  );
}

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
        borderRadius: 14, padding: "32px 26px",
        cursor: "default",
        transition: "all 0.35s cubic-bezier(0.16,1,0.3,1)",
        transform: visible
          ? (hov ? "translateY(-8px)" : "translateY(0)")
          : "translateY(28px)",
        opacity: visible ? 1 : 0,
        animationDelay: `${i * 0.1}s`,
        backdropFilter: "blur(12px)",
        boxShadow: hov ? `0 20px 60px ${f.glow}, 0 0 0 0.5px rgba(255,255,255,0.06)` : "none",
        position: "relative", overflow: "hidden",
      }}>

      {hov && (
        <div style={{
          position: "absolute", inset: 0, borderRadius: 14,
          background: `radial-gradient(circle at 30% 30%, ${f.glow} 0%, transparent 70%)`,
          pointerEvents: "none", transition: "opacity 0.3s",
        }} />
      )}

      <div style={{
        fontFamily: "'IBM Plex Mono', monospace", fontSize: 32,
        color: f.color, marginBottom: 18,
        display: "inline-block",
        transition: "transform 0.3s cubic-bezier(0.16,1,0.3,1), filter 0.3s",
        transform: hov ? "scale(1.15) rotate(-5deg)" : "scale(1)",
        filter: hov ? `drop-shadow(0 0 12px ${f.color}88)` : "none",
      }}>{f.icon}</div>

      <div style={{
        fontFamily: "'IBM Plex Mono', monospace", fontSize: 9,
        color: f.color, letterSpacing: "0.16em", marginBottom: 10,
        opacity: 0.75,
      }}>{f.tag}</div>

      <h3 style={{
        fontFamily: "'Syne', sans-serif", fontWeight: 700,
        fontSize: 19, marginBottom: 10, letterSpacing: "-0.4px",
        color: "#eceae2",
      }}>{f.title}</h3>

      <p style={{ fontSize: 13, color: "#5c6472", lineHeight: 1.75 }}>{f.desc}</p>

      <div style={{
        marginTop: 20, height: 1, overflow: "hidden",
        background: "rgba(255,255,255,0.05)",
      }}>
        <div style={{
          height: "100%", background: f.color,
          width: hov ? "100%" : "0%",
          transition: "width 0.5s cubic-bezier(0.16,1,0.3,1)",
        }} />
      </div>
    </div>
  );
}

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
      borderRadius: 14, padding: "28px 24px",
      backdropFilter: "blur(12px)",
      transition: "all 0.7s cubic-bezier(0.16,1,0.3,1)",
      transform: visible ? "translateY(0)" : "translateY(32px)",
      opacity: visible ? 1 : 0,
      transitionDelay: `${i * 0.12}s`,
    }}>
      <div style={{
        fontSize: 28, color: t.color, opacity: 0.4,
        fontFamily: "Georgia, serif", lineHeight: 1,
        marginBottom: 14,
      }}>"</div>
      <p style={{ fontSize: 14, color: "#8a929e", lineHeight: 1.75, marginBottom: 22 }}>{t.quote}</p>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{
          width: 38, height: 38, borderRadius: "50%",
          background: `linear-gradient(135deg, ${t.color}33, ${t.color}11)`,
          border: `1px solid ${t.color}44`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontFamily: "'IBM Plex Mono', monospace", fontSize: 11,
          color: t.color, fontWeight: 500,
        }}>{t.avatar}</div>
        <div>
          <div style={{ fontSize: 13, fontWeight: 500, color: "#ddd", letterSpacing: "-0.2px" }}>{t.name}</div>
          <div style={{ fontSize: 11, color: "#505866", marginTop: 2 }}>{t.role}</div>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────── MAIN APP ─────────────────── */
export default function App() {
  const [navScrolled, setNavScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setNavScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div style={{ position: "relative", minHeight: "100vh" }}>
      <CustomCursor />
      <GridBackground />
      <Scanline />
      <AmbientOrbs />

      {/* ── NAV ── */}
      <nav style={{
        position: "sticky", top: 0, zIndex: 100,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 48px", height: 64,
        background: navScrolled ? "rgba(5,6,7,0.88)" : "transparent",
        borderBottom: navScrolled ? "0.5px solid rgba(255,255,255,0.08)" : "0.5px solid transparent",
        backdropFilter: navScrolled ? "blur(20px)" : "none",
        transition: "all 0.4s ease",
      }}>
        <div className="animate-fadein d1" style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 28, height: 28, borderRadius: 6,
            background: "linear-gradient(135deg, #c8f060, #5ce4b8)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 13, fontWeight: 700, color: "#050607",
            fontFamily: "'IBM Plex Mono', monospace",
          }}>TC</div>
          <span style={{
            fontFamily: "'Syne', sans-serif", fontWeight: 800,
            fontSize: 18, letterSpacing: "-0.5px",
          }}>
            <span style={{ color: "#c8f060" }}>Truth</span>
            <span style={{ color: "#eceae2" }}>Chain</span>
            <span style={{
              fontFamily: "'IBM Plex Mono', monospace", fontSize: 9,
              background: "rgba(200,240,96,0.1)", color: "#c8f060",
              padding: "1px 6px", borderRadius: 3, marginLeft: 6,
              letterSpacing: "0.1em", verticalAlign: "middle",
            }}>AI</span>
          </span>
        </div>

        <div className="animate-fadein d2" style={{ display: "flex", gap: 28, alignItems: "center" }}>
          {["How it Works", "Research", "API Docs"].map((item) => (
            <a key={item} href="#" style={{
              color: "#555d6a", fontSize: 13, textDecoration: "none",
              fontFamily: "'IBM Plex Mono', monospace", letterSpacing: "0.03em",
              transition: "color 0.2s",
            }}
              onMouseEnter={e => e.target.style.color = "#eceae2"}
              onMouseLeave={e => e.target.style.color = "#555d6a"}
            >{item}</a>
          ))}
          <button style={{
            background: "transparent",
            border: "0.5px solid rgba(200,240,96,0.4)",
            color: "#c8f060", borderRadius: 6,
            padding: "7px 18px", fontFamily: "'IBM Plex Mono', monospace",
            fontSize: 11, letterSpacing: "0.06em", cursor: "pointer",
            transition: "all 0.2s",
          }}
            onMouseEnter={e => { e.target.style.background = "#c8f060"; e.target.style.color = "#050607"; }}
            onMouseLeave={e => { e.target.style.background = "transparent"; e.target.style.color = "#c8f060"; }}
          >LAUNCH APP →</button>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section style={{
        position: "relative", zIndex: 10,
        maxWidth: 1000, margin: "0 auto",
        padding: "110px 24px 90px", textAlign: "center",
      }}>
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
          lineHeight: 1.02, letterSpacing: "-2.5px",
          marginBottom: 30,
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
          fontSize: "clamp(15px, 1.8vw, 18px)",
          color: "#5c6472", maxWidth: 540, margin: "0 auto 24px",
          lineHeight: 1.75, fontWeight: 400,
        }}>
          The only AI that predicts viral misinformation <em style={{ color: "#8a929e", fontStyle: "normal" }}>18 minutes</em> before
          it explodes — for researchers, journalists, and truth defenders.
        </p>

        <div className="animate-fadeup d3" style={{
          fontFamily: "'IBM Plex Mono', monospace", fontSize: 13,
          color: "#3d444f", marginBottom: 52, minHeight: 22,
        }}>
          <span style={{ color: "#3d444f", marginRight: 8 }}>→</span>
          <TypewriterText texts={CLAIMS} />
        </div>

        <div className="animate-fadeup d4" style={{
          display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap",
        }}>
          <button style={{
            background: "linear-gradient(135deg, #c8f060 0%, #a8e040 100%)",
            color: "#050607", border: "none", borderRadius: 8,
            padding: "15px 36px",
            fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 15,
            cursor: "pointer", letterSpacing: "-0.3px",
            transition: "all 0.25s cubic-bezier(0.16,1,0.3,1)",
            boxShadow: "0 0 0 0 rgba(200,240,96,0.4)",
          }}
            onMouseEnter={e => {
              e.target.style.transform = "scale(1.04) translateY(-2px)";
              e.target.style.boxShadow = "0 12px 40px rgba(200,240,96,0.25)";
            }}
            onMouseLeave={e => {
              e.target.style.transform = "scale(1) translateY(0)";
              e.target.style.boxShadow = "0 0 0 0 rgba(200,240,96,0.4)";
            }}
          >Start Analyzing Free →</button>

          <button style={{
            background: "rgba(255,255,255,0.03)",
            color: "#9aa0aa",
            border: "0.5px solid rgba(255,255,255,0.12)",
            borderRadius: 8, padding: "15px 36px",
            fontFamily: "'Syne', sans-serif", fontWeight: 600, fontSize: 15,
            cursor: "pointer", letterSpacing: "-0.3px",
            transition: "all 0.25s",
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
          >See Research Paper →</button>
        </div>

        {/* Scroll hint */}
        <div className="animate-fadein d6" style={{
          marginTop: 72, display: "flex", flexDirection: "column",
          alignItems: "center", gap: 8, opacity: 0.35,
        }}>
          <div style={{
            fontFamily: "'IBM Plex Mono', monospace", fontSize: 9,
            letterSpacing: "0.18em", color: "#555",
          }}>SCROLL</div>
          <div style={{
            width: 1, height: 40,
            background: "linear-gradient(to bottom, #555, transparent)",
          }} />
        </div>
      </section>

      {/* ── STATS BAR ── */}
      <section style={{
        position: "relative", zIndex: 10,
        borderTop: "0.5px solid rgba(255,255,255,0.05)",
        borderBottom: "0.5px solid rgba(255,255,255,0.05)",
        padding: "44px 48px",
        background: "rgba(10,11,14,0.6)",
        backdropFilter: "blur(20px)",
        display: "flex", justifyContent: "center",
        gap: "clamp(32px, 8vw, 110px)", flexWrap: "wrap",
      }}>
        {STATS.map((s, i) => (
          <AnimatedStat key={i} {...s} delay={i * 0.1} />
        ))}
      </section>

      {/* ── FEATURES ── */}
      <section style={{
        position: "relative", zIndex: 10,
        maxWidth: 1060, margin: "0 auto", padding: "110px 24px",
      }}>
        <div style={{ textAlign: "center", marginBottom: 72 }}>
          <div style={{
            fontFamily: "'IBM Plex Mono', monospace", fontSize: 10,
            color: "#5ce4b8", letterSpacing: "0.2em", marginBottom: 16,
            opacity: 0.8,
          }}>HOW IT WORKS</div>
          <h2 style={{
            fontFamily: "'Syne', sans-serif", fontWeight: 800,
            fontSize: "clamp(30px, 4.5vw, 52px)",
            letterSpacing: "-1.5px",
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

      {/* ── TESTIMONIALS ── */}
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

      {/* ── CTA ── */}
      <section style={{
        position: "relative", zIndex: 10,
        maxWidth: 740, margin: "0 auto 110px", padding: "0 24px",
        textAlign: "center",
      }}>
        <div style={{
          background: "rgba(10,11,14,0.8)",
          border: "0.5px solid rgba(200,240,96,0.18)",
          borderRadius: 18, padding: "64px 48px",
          backdropFilter: "blur(20px)",
          boxShadow: "0 0 120px rgba(200,240,96,0.04), inset 0 0 80px rgba(200,240,96,0.015)",
          position: "relative", overflow: "hidden",
        }}>
          <div style={{
            position: "absolute", top: "-60px", left: "50%",
            transform: "translateX(-50%)",
            width: 300, height: 300, borderRadius: "50%",
            background: "radial-gradient(circle, rgba(200,240,96,0.06) 0%, transparent 70%)",
            pointerEvents: "none",
          }} />
          <div style={{
            fontFamily: "'IBM Plex Mono', monospace", fontSize: 10,
            color: "#c8f060", letterSpacing: "0.18em", marginBottom: 20,
            opacity: 0.8,
          }}>FREE FOR STUDENTS & RESEARCHERS</div>
          <h2 style={{
            fontFamily: "'Syne', sans-serif", fontWeight: 800,
            fontSize: "clamp(26px, 4vw, 44px)", letterSpacing: "-1.5px",
            marginBottom: 16,
            background: "linear-gradient(135deg, #eceae2, rgba(236,234,226,0.6))",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          }}>Ready to fight misinformation?</h2>
          <p style={{
            color: "#555d6a", fontSize: 15, marginBottom: 40, lineHeight: 1.8,
          }}>
            Join researchers using TruthChain AI to detect, track,
            and neutralize false narratives before they cause real-world harm.
          </p>
          <button style={{
            background: "linear-gradient(135deg, #c8f060, #a8e040)",
            color: "#050607", border: "none", borderRadius: 8,
            padding: "15px 44px", fontFamily: "'Syne', sans-serif",
            fontWeight: 700, fontSize: 16, cursor: "pointer",
            letterSpacing: "-0.3px", transition: "all 0.25s cubic-bezier(0.16,1,0.3,1)",
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

      {/* ── FOOTER ── */}
      <footer style={{
        position: "relative", zIndex: 10,
        borderTop: "0.5px solid rgba(255,255,255,0.05)",
        padding: "28px 48px",
        display: "flex", justifyContent: "space-between",
        alignItems: "center", flexWrap: "wrap", gap: 12,
      }}>
        <span style={{
          fontFamily: "'IBM Plex Mono', monospace", fontSize: 10,
          color: "#2d333d", letterSpacing: "0.08em",
        }}>© 2026 TRUTHCHAIN AI · PORTFOLIO PROJECT</span>
        <span style={{
          fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, color: "#2d333d",
        }}>Built with React + Vite + Claude API</span>
      </footer>
    </div>
  );
}