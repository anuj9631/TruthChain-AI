import { useState, useEffect, useRef } from "react";

const CLAIMS = [
  "5G towers cause memory loss in urban residents...",
  "Scientists link tap water fluoride to IQ reduction...",
  "New study: mRNA vaccines alter human DNA permanently...",
  "Election machines in 4 states remotely compromised...",
];

const STATS = [
  { value: "2.4M", label: "Claims Analyzed" },
  { value: "94%", label: "Detection Accuracy" },
  { value: "18min", label: "Avg. Before Viral" },
  { value: "140+", label: "Countries Monitored" },
];

const FEATURES = [
  {
    icon: "◈",
    title: "Viral Prediction",
    desc: "Detects misinformation spread patterns before they hit mainstream — 18 minutes ahead on average.",
    tag: "CORE ENGINE",
    color: "#c8f060",
  },
  {
    icon: "⬡",
    title: "Network Mapping",
    desc: "Traces exactly which communities will amplify a claim next, using graph-based social modeling.",
    tag: "GRAPH AI",
    color: "#5ce4b8",
  },
  {
    icon: "◎",
    title: "Risk Scoring",
    desc: "Every claim gets a 0–100 Viral Risk Index based on emotion, source credibility, and velocity signals.",
    tag: "SCORING",
    color: "#ffb74d",
  },
  {
    icon: "⟁",
    title: "Real-time Alerts",
    desc: "Live feed of dangerous claims ranked by spread risk. Built for journalists, researchers, and analysts.",
    tag: "LIVE FEED",
    color: "#ff6b6b",
  },
];

function TypewriterText({ texts }) {
  const [display, setDisplay] = useState("");
  const [idx, setIdx] = useState(0);
  const [phase, setPhase] = useState("typing");

  useEffect(() => {
    const current = texts[idx];
    let timeout;
    if (phase === "typing") {
      if (display.length < current.length) {
        timeout = setTimeout(() => setDisplay(current.slice(0, display.length + 1)), 38);
      } else {
        timeout = setTimeout(() => setPhase("deleting"), 2200);
      }
    } else {
      if (display.length > 0) {
        timeout = setTimeout(() => setDisplay(display.slice(0, -1)), 18);
      } else {
        setIdx((i) => (i + 1) % texts.length);
        setPhase("typing");
      }
    }
    return () => clearTimeout(timeout);
  }, [display, phase, idx, texts]);

  return (
    <span style={{ color: "#ff6b6b", fontFamily: "'IBM Plex Mono', monospace", fontSize: "0.95em" }}>
      {display}
      <span style={{ animation: "blink 1s step-end infinite", color: "#ff6b6b" }}>|</span>
    </span>
  );
}

function GridBackground() {
  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none",
      backgroundImage: `linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)`,
      backgroundSize: "40px 40px",
      animation: "gridMove 8s linear infinite",
      maskImage: "radial-gradient(ellipse 80% 60% at 50% 0%, black 40%, transparent 100%)",
    }} />
  );
}

function Scanline() {
  return (
    <div style={{
      position: "fixed", top: 0, left: 0, right: 0, height: "2px", zIndex: 1,
      background: "linear-gradient(transparent, rgba(200,240,96,0.06), transparent)",
      animation: "scanline 7s linear infinite", pointerEvents: "none",
    }} />
  );
}

export default function App() {
  const [hovered, setHovered] = useState(null);
  const heroRef = useRef(null);

  return (
    <div style={{ position: "relative", minHeight: "100vh" }}>
      <GridBackground />
      <Scanline />

      {/* NAV */}
      <nav className="animate-fadeup" style={{
        position: "relative", zIndex: 10,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "20px 48px",
        borderBottom: "0.5px solid rgba(255,255,255,0.07)",
        backdropFilter: "blur(12px)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{
            fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 22,
            color: "#c8f060", letterSpacing: "-0.5px",
          }}>Truth</span>
          <span style={{
            fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 22,
            color: "#e9e6de",
          }}>Chain</span>
          <span style={{
            fontFamily: "'IBM Plex Mono', monospace", fontSize: 10,
            background: "rgba(200,240,96,0.12)", color: "#c8f060",
            padding: "2px 8px", borderRadius: 4, letterSpacing: "0.1em",
          }}>AI</span>
        </div>

        <div style={{ display: "flex", gap: 32, alignItems: "center" }}>
          {["How it Works", "Research", "API"].map((item) => (
            <a key={item} href="#" style={{
              color: "#666d7a", fontSize: 13, textDecoration: "none",
              fontFamily: "'IBM Plex Mono', monospace", letterSpacing: "0.04em",
              transition: "color 0.2s",
            }}
              onMouseEnter={e => e.target.style.color = "#e9e6de"}
              onMouseLeave={e => e.target.style.color = "#666d7a"}
            >{item}</a>
          ))}
          <button style={{
            background: "#c8f060", color: "#070809", border: "none",
            borderRadius: 6, padding: "8px 20px", fontFamily: "'IBM Plex Mono', monospace",
            fontSize: 12, fontWeight: 500, letterSpacing: "0.05em", cursor: "pointer",
            transition: "opacity 0.15s",
          }}
            onMouseEnter={e => e.target.style.opacity = "0.85"}
            onMouseLeave={e => e.target.style.opacity = "1"}
          >Try Free →</button>
        </div>
      </nav>

      {/* HERO */}
      <section ref={heroRef} style={{
        position: "relative", zIndex: 10,
        maxWidth: 980, margin: "0 auto", padding: "100px 24px 80px",
        textAlign: "center",
      }}>
        <div className="animate-fadeup delay-1" style={{
          display: "inline-flex", alignItems: "center", gap: 8,
          background: "rgba(255,107,107,0.08)", border: "0.5px solid rgba(255,107,107,0.25)",
          borderRadius: 20, padding: "6px 16px", marginBottom: 40,
        }}>
          <span style={{
            width: 7, height: 7, borderRadius: "50%", background: "#ff6b6b",
            display: "inline-block", animation: "pulse-ring 2s infinite",
          }} />
          <span style={{
            fontFamily: "'IBM Plex Mono', monospace", fontSize: 11,
            color: "#ff6b6b", letterSpacing: "0.1em",
          }}>LIVE — MONITORING 2.4M CLAIMS GLOBALLY</span>
        </div>

        <h1 className="animate-fadeup delay-2" style={{
          fontFamily: "'Syne', sans-serif", fontWeight: 800,
          fontSize: "clamp(42px, 7vw, 82px)",
          lineHeight: 1.05, letterSpacing: "-2px",
          marginBottom: 28,
        }}>
          Stop misinformation<br />
          <span style={{ color: "#c8f060" }}>before</span> it goes viral
        </h1>

        <p className="animate-fadeup delay-3" style={{
          fontSize: 18, color: "#7a8294", maxWidth: 560, margin: "0 auto 20px",
          lineHeight: 1.7, fontWeight: 400,
        }}>
          The only AI that predicts how a false claim will spread — 18 minutes ahead of the curve.
          Built for researchers, journalists, and truth defenders.
        </p>

        <div className="animate-fadeup delay-3" style={{
          fontFamily: "'IBM Plex Mono', monospace", fontSize: 14,
          color: "#555d6a", marginBottom: 48, minHeight: 24,
        }}>
          Analyzing: <TypewriterText texts={CLAIMS} />
        </div>

        <div className="animate-fadeup delay-4" style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <button style={{
            background: "#c8f060", color: "#070809", border: "none",
            borderRadius: 8, padding: "14px 32px",
            fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 15,
            cursor: "pointer", transition: "all 0.15s", letterSpacing: "-0.2px",
          }}
            onMouseEnter={e => { e.target.style.transform = "scale(1.03)"; e.target.style.opacity = "0.9"; }}
            onMouseLeave={e => { e.target.style.transform = "scale(1)"; e.target.style.opacity = "1"; }}
          >Start Analyzing Free →</button>

          <button style={{
            background: "transparent", color: "#e9e6de",
            border: "0.5px solid rgba(255,255,255,0.15)",
            borderRadius: 8, padding: "14px 32px",
            fontFamily: "'Syne', sans-serif", fontWeight: 700, fontSize: 15,
            cursor: "pointer", transition: "all 0.15s",
          }}
            onMouseEnter={e => e.target.style.borderColor = "rgba(255,255,255,0.35)"}
            onMouseLeave={e => e.target.style.borderColor = "rgba(255,255,255,0.15)"}
          >View Research →</button>
        </div>
      </section>

      {/* STATS */}
      <section style={{
        position: "relative", zIndex: 10,
        borderTop: "0.5px solid rgba(255,255,255,0.06)",
        borderBottom: "0.5px solid rgba(255,255,255,0.06)",
        padding: "36px 48px",
        display: "flex", justifyContent: "center",
        gap: "clamp(24px, 6vw, 96px)", flexWrap: "wrap",
      }}>
        {STATS.map((s, i) => (
          <div key={i} className={`animate-fadeup delay-${i + 2}`} style={{ textAlign: "center" }}>
            <div style={{
              fontFamily: "'Syne', sans-serif", fontWeight: 800,
              fontSize: 34, color: "#c8f060", letterSpacing: "-1px",
            }}>{s.value}</div>
            <div style={{
              fontFamily: "'IBM Plex Mono', monospace", fontSize: 11,
              color: "#555d6a", letterSpacing: "0.1em", marginTop: 4,
            }}>{s.label}</div>
          </div>
        ))}
      </section>

      {/* FEATURES */}
      <section style={{
        position: "relative", zIndex: 10,
        maxWidth: 1040, margin: "0 auto", padding: "96px 24px",
      }}>
        <div style={{ textAlign: "center", marginBottom: 64 }}>
          <div style={{
            fontFamily: "'IBM Plex Mono', monospace", fontSize: 11,
            color: "#5ce4b8", letterSpacing: "0.16em", marginBottom: 16,
          }}>HOW IT WORKS</div>
          <h2 style={{
            fontFamily: "'Syne', sans-serif", fontWeight: 800,
            fontSize: "clamp(28px, 4vw, 48px)", letterSpacing: "-1px",
          }}>Four layers of detection</h2>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: 16,
        }}>
          {FEATURES.map((f, i) => (
            <div key={i}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              style={{
                background: hovered === i ? "#0f1114" : "transparent",
                border: `0.5px solid ${hovered === i ? "rgba(255,255,255,0.13)" : "rgba(255,255,255,0.07)"}`,
                borderRadius: 12, padding: "28px 24px",
                cursor: "default", transition: "all 0.2s ease",
                transform: hovered === i ? "translateY(-4px)" : "translateY(0)",
              }}>
              <div style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: 28, color: f.color, marginBottom: 16,
                transition: "transform 0.2s",
                transform: hovered === i ? "scale(1.1)" : "scale(1)",
                display: "inline-block",
              }}>{f.icon}</div>

              <div style={{
                fontFamily: "'IBM Plex Mono', monospace", fontSize: 9,
                color: f.color, letterSpacing: "0.14em",
                marginBottom: 10, opacity: 0.7,
              }}>{f.tag}</div>

              <h3 style={{
                fontFamily: "'Syne', sans-serif", fontWeight: 700,
                fontSize: 18, marginBottom: 10, letterSpacing: "-0.3px",
              }}>{f.title}</h3>

              <p style={{ fontSize: 13, color: "#666d7a", lineHeight: 1.7 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{
        position: "relative", zIndex: 10,
        maxWidth: 720, margin: "0 auto 100px",
        textAlign: "center", padding: "0 24px",
      }}>
        <div style={{
          background: "#0f1114",
          border: "0.5px solid rgba(200,240,96,0.2)",
          borderRadius: 16, padding: "56px 40px",
          boxShadow: "0 0 80px rgba(200,240,96,0.04)",
        }}>
          <div style={{
            fontFamily: "'IBM Plex Mono', monospace", fontSize: 10,
            color: "#c8f060", letterSpacing: "0.14em", marginBottom: 20,
          }}>FREE FOR RESEARCHERS & STUDENTS</div>

          <h2 style={{
            fontFamily: "'Syne', sans-serif", fontWeight: 800,
            fontSize: "clamp(24px, 4vw, 40px)", letterSpacing: "-1px", marginBottom: 16,
          }}>Ready to fight misinformation?</h2>

          <p style={{ color: "#666d7a", fontSize: 15, marginBottom: 36, lineHeight: 1.7 }}>
            Join researchers using TruthChain AI to detect, track,<br />
            and analyze false narratives before they cause harm.
          </p>

          <button style={{
            background: "#c8f060", color: "#070809", border: "none",
            borderRadius: 8, padding: "14px 40px",
            fontFamily: "'Syne', sans-serif", fontWeight: 700,
            fontSize: 15, cursor: "pointer", letterSpacing: "-0.2px",
            transition: "all 0.15s",
          }}
            onMouseEnter={e => e.target.style.opacity = "0.88"}
            onMouseLeave={e => e.target.style.opacity = "1"}
          >Launch TruthChain AI →</button>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{
        position: "relative", zIndex: 10,
        borderTop: "0.5px solid rgba(255,255,255,0.06)",
        padding: "24px 48px",
        display: "flex", justifyContent: "space-between", alignItems: "center",
        flexWrap: "wrap", gap: 12,
      }}>
        <span style={{
          fontFamily: "'IBM Plex Mono', monospace", fontSize: 11,
          color: "#333b47", letterSpacing: "0.06em",
        }}>© 2026 TRUTHCHAIN AI · PORTFOLIO PROJECT</span>
        <span style={{
          fontFamily: "'IBM Plex Mono', monospace", fontSize: 11,
          color: "#333b47",
        }}>Powered by Claude · Built with React + Vite</span>
      </footer>
    </div>
  );
}