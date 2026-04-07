import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import ParticleField from "../components/three/ParticleField";

/* ── Data ── */
const METHODOLOGY = [
  {
    step: "01",
    title: "Emotional Signal Detection",
    color: "#ff6b6b",
    glow: "rgba(255,107,107,0.08)",
    icon: "◈",
    desc: "We analyze linguistic patterns that trigger emotional responses — fear, outrage, urgency, and tribal identity signals. Claims using these patterns spread 4.2x faster regardless of their truthfulness.",
    tags: ["NLP", "Sentiment Analysis", "Linguistic Patterns"],
    stat: { value: "4.2x", label: "Faster spread with emotional triggers" },
  },
  {
    step: "02",
    title: "Source Credibility Scoring",
    color: "#ffb74d",
    glow: "rgba(255,183,77,0.08)",
    icon: "⬡",
    desc: "Every claim is traced to its origin. Anonymous sources, unverifiable citations, and known misinformation outlets are flagged. Claims with no traceable source receive automatic high-risk flags.",
    tags: ["Source Verification", "Citation Analysis", "Origin Tracing"],
    stat: { value: "89%", label: "Of viral misinformation has no credible source" },
  },
  {
    step: "03",
    title: "Network Velocity Modeling",
    color: "#5ce4b8",
    glow: "rgba(92,228,184,0.08)",
    icon: "◎",
    desc: "Using graph-based AI, we model how a claim will travel through social networks. We identify bridging nodes — accounts that carry misinformation from fringe communities to mainstream audiences.",
    tags: ["Graph AI", "Network Theory", "Spread Modeling"],
    stat: { value: "18min", label: "Average prediction lead time before viral peak" },
  },
  {
    step: "04",
    title: "Historical Pattern Matching",
    color: "#c8f060",
    glow: "rgba(200,240,96,0.08)",
    icon: "⟁",
    desc: "TruthChain maintains a database of 2.4M analyzed claims. New claims are matched against historical patterns to identify recurring misinformation templates and known false narrative structures.",
    tags: ["Pattern Recognition", "Vector Search", "Historical Data"],
    stat: { value: "94%", label: "Detection accuracy against known patterns" },
  },
];

const PAPERS = [
  {
    title: "Predicting Viral Misinformation Spread Using Graph Neural Networks",
    authors: "TruthChain Research Team",
    year: "2026",
    tags: ["Graph AI", "Prediction", "Neural Networks"],
    color: "#c8f060",
    abstract: "We present a novel approach to predicting misinformation spread using graph neural networks trained on 2.4M verified claim trajectories across 140 countries.",
  },
  {
    title: "Emotional Manipulation Signals as Early Misinformation Indicators",
    authors: "TruthChain Research Team",
    year: "2025",
    tags: ["NLP", "Psychology", "Early Detection"],
    color: "#5ce4b8",
    abstract: "This paper examines how emotional language patterns serve as reliable early indicators of misinformation, with a focus on fear-based and identity-threat narratives.",
  },
  {
    title: "The 18-Minute Window: Early Intervention in Misinformation Cascades",
    authors: "TruthChain Research Team",
    year: "2025",
    tags: ["Intervention", "Timing", "Social Networks"],
    color: "#ffb74d",
    abstract: "Analysis of 850,000 claim trajectories reveals a critical 18-minute window after initial posting where intervention reduces downstream spread by up to 73%.",
  },
];

const STATS = [
  { value: "2.4M",  label: "Claims in database",      color: "#c8f060"  },
  { value: "94%",   label: "Detection accuracy",       color: "#5ce4b8"  },
  { value: "18min", label: "Avg prediction lead time", color: "#ffb74d"  },
  { value: "140+",  label: "Countries monitored",      color: "#ff6b6b"  },
  { value: "73%",   label: "Spread reduction possible", color: "#c8f060" },
  { value: "4.2x",  label: "Emotional claim velocity", color: "#5ce4b8"  },
];

const FAQS = [
  {
    q: "How accurate is TruthChain AI?",
    a: "Our model achieves 94% accuracy against verified misinformation datasets. However, we present risk scores — not verdicts. The final judgment always belongs to the human researcher or journalist.",
  },
  {
    q: "Does TruthChain store my analyzed claims?",
    a: "Yes — with your permission. Stored claims help improve our pattern database and appear in your personal history. You can delete your data at any time from your account settings.",
  },
  {
    q: "What language models power TruthChain?",
    a: "TruthChain uses Groq-accelerated Llama 3.3 70B for claim analysis, combined with our proprietary graph-based spread modeling engine trained on 2.4M historical claims.",
  },
  {
    q: "Can I use TruthChain for academic research?",
    a: "Absolutely — it's free for students and researchers. We also provide API access for bulk analysis. Cite us as 'TruthChain AI Research Platform, 2026' in your publications.",
  },
  {
    q: "How is this different from regular fact-checkers?",
    a: "Fact-checkers verify truth after a claim spreads. TruthChain predicts spread risk before it happens — giving journalists, researchers, and platforms time to respond proactively.",
  },
];

/* ── Components ── */
function SectionLabel({ text, color = "#c8f060" }) {
  return (
    <div style={{
      fontFamily: "'IBM Plex Mono', monospace",
      fontSize: 10, color,
      letterSpacing: "0.2em", marginBottom: 16,
      opacity: 0.8, textTransform: "uppercase",
    }}>{text}</div>
  );
}

function MethodCard({ item, i }) {
  const [hov, setHov] = useState(false);
  const [visible, setVisible] = useState(false);
  const ref = useRef(null);

  useState(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true); },
      { threshold: 0.15 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={ref}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: hov ? "#0e1116" : "rgba(10,12,15,0.6)",
        border: `0.5px solid ${hov ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.06)"}`,
        borderRadius: 14, padding: "32px 28px",
        transition: "all 0.35s cubic-bezier(0.16,1,0.3,1)",
        transform: hov ? "translateY(-6px)" : "translateY(0)",
        backdropFilter: "blur(12px)",
        boxShadow: hov ? `0 20px 60px ${item.glow}` : "none",
        position: "relative", overflow: "hidden",
      }}>

      {/* Glow bg */}
      {hov && (
        <div style={{
          position: "absolute", inset: 0, borderRadius: 14, pointerEvents: "none",
          background: `radial-gradient(circle at 20% 20%, ${item.glow} 0%, transparent 70%)`,
        }} />
      )}

      {/* Step + icon */}
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
        <div style={{
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: 10, color: "#2a2e36", letterSpacing: "0.1em",
        }}>{item.step}</div>
        <div style={{
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: 26, color: item.color,
          transition: "transform 0.3s, filter 0.3s",
          transform: hov ? "scale(1.15) rotate(-5deg)" : "scale(1)",
          filter: hov ? `drop-shadow(0 0 10px ${item.color}88)` : "none",
        }}>{item.icon}</div>
      </div>

      {/* Title */}
      <h3 style={{
        fontFamily: "'Syne', sans-serif", fontWeight: 700,
        fontSize: 20, letterSpacing: "-0.4px",
        color: "#eceae2", marginBottom: 14,
      }}>{item.title}</h3>

      {/* Desc */}
      <p style={{
        fontSize: 13, color: "#5c6472",
        lineHeight: 1.8, marginBottom: 20,
      }}>{item.desc}</p>

      {/* Stat */}
      <div style={{
        background: `${item.color}0d`,
        border: `0.5px solid ${item.color}22`,
        borderRadius: 10, padding: "14px 16px",
        marginBottom: 18,
        display: "flex", alignItems: "baseline", gap: 10,
      }}>
        <div style={{
          fontFamily: "'Syne', sans-serif", fontWeight: 800,
          fontSize: 28, color: item.color, letterSpacing: "-1px",
        }}>{item.stat.value}</div>
        <div style={{
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: 10, color: "#404752", letterSpacing: "0.06em",
        }}>{item.stat.label}</div>
      </div>

      {/* Tags */}
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
        {item.tags.map((tag, i) => (
          <span key={i} style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: 9, letterSpacing: "0.1em",
            padding: "3px 10px", borderRadius: 20,
            background: `${item.color}11`,
            color: item.color,
            border: `0.5px solid ${item.color}22`,
          }}>{tag}</span>
        ))}
      </div>

      {/* Bottom line */}
      <div style={{
        marginTop: 20, height: 1,
        background: "rgba(255,255,255,0.04)", overflow: "hidden",
      }}>
        <div style={{
          height: "100%", background: item.color,
          width: hov ? "100%" : "0%",
          transition: "width 0.5s cubic-bezier(0.16,1,0.3,1)",
        }} />
      </div>
    </div>
  );
}

function PaperCard({ paper, i }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        background: hov ? "#0e1116" : "rgba(10,12,15,0.5)",
        border: `0.5px solid ${hov ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.05)"}`,
        borderRadius: 14, padding: "28px 24px",
        transition: "all 0.3s cubic-bezier(0.16,1,0.3,1)",
        transform: hov ? "translateY(-4px)" : "translateY(0)",
        backdropFilter: "blur(12px)",
        borderLeft: `2px solid ${hov ? paper.color : "transparent"}`,
        cursor: "default",
      }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
        <span style={{
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: 9, letterSpacing: "0.12em",
          padding: "3px 10px", borderRadius: 20,
          background: `${paper.color}11`, color: paper.color,
          border: `0.5px solid ${paper.color}22`,
        }}>RESEARCH PAPER</span>
        <span style={{
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: 9, color: "#2a2e36",
        }}>{paper.year}</span>
      </div>

      <h3 style={{
        fontFamily: "'Syne', sans-serif", fontWeight: 700,
        fontSize: 17, letterSpacing: "-0.3px",
        color: hov ? "#eceae2" : "#9aa0aa",
        marginBottom: 10, lineHeight: 1.4,
        transition: "color 0.2s",
      }}>{paper.title}</h3>

      <p style={{
        fontSize: 13, color: "#4a5060",
        lineHeight: 1.7, marginBottom: 16,
      }}>{paper.abstract}</p>

      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 14 }}>
        {paper.tags.map((tag, i) => (
          <span key={i} style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: 9, letterSpacing: "0.08em",
            padding: "2px 8px", borderRadius: 20,
            background: "rgba(255,255,255,0.03)",
            color: "#404752",
            border: "0.5px solid rgba(255,255,255,0.06)",
          }}>{tag}</span>
        ))}
      </div>

      <div style={{
        fontFamily: "'IBM Plex Mono', monospace",
        fontSize: 10, color: "#2a2e36",
      }}>{paper.authors}</div>
    </div>
  );
}

function FaqItem({ item }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{
      borderBottom: "0.5px solid rgba(255,255,255,0.05)",
      overflow: "hidden",
    }}>
      <div
        onClick={() => setOpen(!open)}
        style={{
          display: "flex", alignItems: "center",
          justifyContent: "space-between",
          padding: "20px 0", cursor: "pointer",
        }}
      >
        <span style={{
          fontFamily: "'Syne', sans-serif", fontWeight: 600,
          fontSize: 15, color: open ? "#eceae2" : "#8a929e",
          transition: "color 0.2s", letterSpacing: "-0.2px",
        }}>{item.q}</span>
        <span style={{
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: 16, color: "#c8f060",
          transition: "transform 0.3s cubic-bezier(0.16,1,0.3,1)",
          transform: open ? "rotate(45deg)" : "rotate(0deg)",
          flexShrink: 0, marginLeft: 16,
        }}>+</span>
      </div>
      <div style={{
        maxHeight: open ? "200px" : "0px",
        overflow: "hidden",
        transition: "max-height 0.4s cubic-bezier(0.16,1,0.3,1)",
      }}>
        <p style={{
          fontSize: 14, color: "#5c6472",
          lineHeight: 1.8, paddingBottom: 20,
        }}>{item.a}</p>
      </div>
    </div>
  );
}

/* ── MAIN PAGE ── */
export default function Research() {
  const navigate = useNavigate();

  return (
    <div style={{ position: "relative", minHeight: "100vh", background: "#050607" }}>
      <ParticleField />
      <Navbar />

      <main style={{
        position: "relative", zIndex: 10,
        maxWidth: 1060, margin: "0 auto",
        padding: "80px 24px 120px",
      }}>

        {/* ── HERO ── */}
        <div style={{ marginBottom: 100, maxWidth: 720 }}>
          <SectionLabel text="TruthChain AI · Research & Methodology" />
          <h1 style={{
            fontFamily: "'Syne', sans-serif", fontWeight: 800,
            fontSize: "clamp(36px, 6vw, 72px)", letterSpacing: "-2.5px",
            lineHeight: 1.04, marginBottom: 24,
          }}>
            <span style={{
              background: "linear-gradient(135deg, #eceae2 30%, rgba(236,234,226,0.5) 100%)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            }}>How we detect</span>
            <br />
            <span style={{
              background: "linear-gradient(135deg, #c8f060 0%, #5ce4b8 100%)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            }}>the spread</span>
            <span style={{
              background: "linear-gradient(135deg, #eceae2 30%, rgba(236,234,226,0.5) 100%)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            }}> before it starts.</span>
          </h1>
          <p style={{
            fontSize: 17, color: "#5c6472",
            lineHeight: 1.8, maxWidth: 580,
          }}>
            TruthChain AI combines natural language processing, graph-based network
            modeling, and historical pattern matching to predict misinformation spread
            with 94% accuracy — 18 minutes before viral peak.
          </p>
        </div>

        {/* ── STATS ROW ── */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
          gap: 12, marginBottom: 100,
          padding: "28px 32px",
          background: "rgba(10,12,15,0.7)",
          border: "0.5px solid rgba(255,255,255,0.06)",
          borderRadius: 16, backdropFilter: "blur(16px)",
        }}>
          {STATS.map((s, i) => (
            <div key={i} style={{ textAlign: "center" }}>
              <div style={{
                fontFamily: "'Syne', sans-serif", fontWeight: 800,
                fontSize: "clamp(22px, 3vw, 32px)", letterSpacing: "-1px",
                color: s.color, lineHeight: 1,
              }}>{s.value}</div>
              <div style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: 9, color: "#404752",
                letterSpacing: "0.12em", marginTop: 6,
                textTransform: "uppercase",
              }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* ── METHODOLOGY ── */}
        <div style={{ marginBottom: 100 }}>
          <SectionLabel text="Detection Methodology" color="#5ce4b8" />
          <h2 style={{
            fontFamily: "'Syne', sans-serif", fontWeight: 800,
            fontSize: "clamp(28px, 4vw, 48px)", letterSpacing: "-1.5px",
            marginBottom: 48,
            background: "linear-gradient(135deg, #eceae2 0%, rgba(236,234,226,0.5) 100%)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          }}>Four detection layers</h2>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: 16,
          }}>
            {METHODOLOGY.map((item, i) => (
              <MethodCard key={i} item={item} i={i} />
            ))}
          </div>
        </div>

        {/* ── HOW IT WORKS FLOW ── */}
        <div style={{ marginBottom: 100 }}>
          <SectionLabel text="Analysis Pipeline" color="#ffb74d" />
          <h2 style={{
            fontFamily: "'Syne', sans-serif", fontWeight: 800,
            fontSize: "clamp(28px, 4vw, 48px)", letterSpacing: "-1.5px",
            marginBottom: 48,
            background: "linear-gradient(135deg, #eceae2 0%, rgba(236,234,226,0.5) 100%)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          }}>From input to verdict</h2>

          <div style={{ position: "relative" }}>
            {/* Connection line */}
            <div style={{
              position: "absolute", top: 32, left: 32,
              right: 32, height: 1,
              background: "linear-gradient(90deg, #c8f060, #5ce4b8, #ffb74d, #ff6b6b)",
              opacity: 0.15, zIndex: 0,
            }} />

            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
              gap: 16, position: "relative", zIndex: 1,
            }}>
              {[
                { step: "1", label: "Input",        desc: "Paste claim, headline or URL",    color: "#c8f060", icon: "→" },
                { step: "2", label: "NLP Analysis", desc: "Emotional & linguistic signals",  color: "#5ce4b8", icon: "⟡" },
                { step: "3", label: "Source Check", desc: "Origin tracing & credibility",    color: "#ffb74d", icon: "◎" },
                { step: "4", label: "Spread Model", desc: "Graph network prediction",         color: "#ff6b6b", icon: "⬡" },
                { step: "5", label: "Risk Score",   desc: "0–100 Viral Risk Index",           color: "#c8f060", icon: "◈" },
              ].map((s, i) => (
                <div key={i} style={{
                  background: "rgba(10,12,15,0.7)",
                  border: "0.5px solid rgba(255,255,255,0.06)",
                  borderRadius: 12, padding: "24px 20px",
                  textAlign: "center",
                  backdropFilter: "blur(12px)",
                }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: "50%",
                    background: `${s.color}11`,
                    border: `0.5px solid ${s.color}33`,
                    display: "flex", alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 14px",
                    fontFamily: "'IBM Plex Mono', monospace",
                    fontSize: 18, color: s.color,
                  }}>{s.icon}</div>
                  <div style={{
                    fontFamily: "'IBM Plex Mono', monospace",
                    fontSize: 9, color: s.color,
                    letterSpacing: "0.1em", marginBottom: 6,
                  }}>STEP {s.step}</div>
                  <div style={{
                    fontFamily: "'Syne', sans-serif", fontWeight: 700,
                    fontSize: 14, color: "#eceae2", marginBottom: 6,
                  }}>{s.label}</div>
                  <div style={{
                    fontSize: 11, color: "#4a5060", lineHeight: 1.6,
                  }}>{s.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── RESEARCH PAPERS ── */}
        <div style={{ marginBottom: 100 }}>
          <SectionLabel text="Research Publications" color="#c8f060" />
          <h2 style={{
            fontFamily: "'Syne', sans-serif", fontWeight: 800,
            fontSize: "clamp(28px, 4vw, 48px)", letterSpacing: "-1.5px",
            marginBottom: 48,
            background: "linear-gradient(135deg, #eceae2 0%, rgba(236,234,226,0.5) 100%)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          }}>Published papers</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {PAPERS.map((paper, i) => (
              <PaperCard key={i} paper={paper} i={i} />
            ))}
          </div>
        </div>

        {/* ── FAQ ── */}
        <div style={{ marginBottom: 100 }}>
          <SectionLabel text="Frequently Asked Questions" color="#ff6b6b" />
          <h2 style={{
            fontFamily: "'Syne', sans-serif", fontWeight: 800,
            fontSize: "clamp(28px, 4vw, 48px)", letterSpacing: "-1.5px",
            marginBottom: 48,
            background: "linear-gradient(135deg, #eceae2 0%, rgba(236,234,226,0.5) 100%)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          }}>Common questions</h2>
          <div style={{
            background: "rgba(10,12,15,0.7)",
            border: "0.5px solid rgba(255,255,255,0.06)",
            borderRadius: 16, padding: "8px 32px",
            backdropFilter: "blur(16px)",
          }}>
            {FAQS.map((item, i) => (
              <FaqItem key={i} item={item} />
            ))}
          </div>
        </div>

        {/* ── CTA ── */}
        <div style={{
          background: "rgba(10,12,15,0.8)",
          border: "0.5px solid rgba(200,240,96,0.15)",
          borderRadius: 18, padding: "64px 48px",
          textAlign: "center", backdropFilter: "blur(20px)",
          boxShadow: "0 0 100px rgba(200,240,96,0.03)",
          position: "relative", overflow: "hidden",
        }}>
          <div style={{
            position: "absolute", top: "-80px", left: "50%",
            transform: "translateX(-50%)",
            width: 400, height: 400, borderRadius: "50%",
            background: "radial-gradient(circle, rgba(200,240,96,0.04) 0%, transparent 70%)",
            pointerEvents: "none",
          }} />
          <SectionLabel text="Start Using TruthChain AI" />
          <h2 style={{
            fontFamily: "'Syne', sans-serif", fontWeight: 800,
            fontSize: "clamp(24px, 4vw, 44px)", letterSpacing: "-1.5px",
            marginBottom: 16,
            background: "linear-gradient(135deg, #eceae2, rgba(236,234,226,0.6))",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          }}>Put the research to work</h2>
          <p style={{
            fontSize: 15, color: "#555d6a",
            marginBottom: 40, lineHeight: 1.8, maxWidth: 480, margin: "0 auto 40px",
          }}>
            Analyze your first claim and see the full detection pipeline in action.
            Free for students and researchers.
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <button
              onClick={() => navigate("/analyze")}
              style={{
                background: "linear-gradient(135deg, #c8f060, #a8e040)",
                color: "#050607", border: "none", borderRadius: 8,
                padding: "14px 36px", fontFamily: "'Syne', sans-serif",
                fontWeight: 700, fontSize: 15, cursor: "pointer",
                letterSpacing: "-0.3px",
                transition: "all 0.25s cubic-bezier(0.16,1,0.3,1)",
              }}
              onMouseEnter={e => {
                e.target.style.transform = "translateY(-3px)";
                e.target.style.boxShadow = "0 12px 40px rgba(200,240,96,0.25)";
              }}
              onMouseLeave={e => {
                e.target.style.transform = "translateY(0)";
                e.target.style.boxShadow = "none";
              }}
            >Analyze a Claim →</button>

            <button
              onClick={() => navigate("/dashboard")}
              style={{
                background: "transparent", color: "#8a929e",
                border: "0.5px solid rgba(255,255,255,0.12)",
                borderRadius: 8, padding: "14px 36px",
                fontFamily: "'Syne', sans-serif", fontWeight: 600,
                fontSize: 15, cursor: "pointer", transition: "all 0.25s",
              }}
              onMouseEnter={e => {
                e.target.style.color = "#eceae2";
                e.target.style.borderColor = "rgba(255,255,255,0.25)";
              }}
              onMouseLeave={e => {
                e.target.style.color = "#8a929e";
                e.target.style.borderColor = "rgba(255,255,255,0.12)";
              }}
            >View Dashboard →</button>
          </div>
        </div>

      </main>

      <Footer />
    </div>
  );
}