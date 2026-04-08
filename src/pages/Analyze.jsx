import { useRef } from "react";
import Navbar      from "../components/layout/Navbar";
import Footer      from "../components/layout/Footer";
import ParticleField from "../components/three/ParticleField";
import ClaimInput  from "../components/ui/ClaimInput";
import RiskGauge   from "../components/ui/RiskGauge";
import MetricBar   from "../components/ui/MetricBar";
import { useAnalyze } from "../hooks/useAnalyze";

/* ── Skeleton ── */
function Skeleton({ h = 20, w = "100%", mb = 0 }) {
  return (
    <div style={{
      height: h, width: w, borderRadius: 6, marginBottom: mb,
      background: "linear-gradient(90deg, #0f1216 25%, #161a20 50%, #0f1216 75%)",
      backgroundSize: "200% 100%",
      animation: "shimmer 1.4s infinite",
    }} />
  );
}

/* ── Spread stage ── */
function SpreadStage({ stage }) {
  return (
    <div style={{
      display: "flex", gap: 16, padding: "14px 16px",
      background: "rgba(255,255,255,0.02)",
      border: "0.5px solid rgba(255,255,255,0.06)",
      borderRadius: 10, marginBottom: 8,
    }}>
      <div style={{
        fontFamily: "'IBM Plex Mono', monospace",
        fontSize: 10, color: "#333a44",
        minWidth: 24, marginTop: 2,
      }}>{stage.step}</div>
      <div>
        <div style={{
          fontFamily: "'Syne', sans-serif", fontWeight: 600,
          fontSize: 14, color: "#eceae2", marginBottom: 4,
        }}>{stage.platform}</div>
        <div style={{ fontSize: 12, color: "#555d6a", lineHeight: 1.65 }}>{stage.desc}</div>
      </div>
    </div>
  );
}

/* ── Tag ── */
function Tag({ label }) {
  const colors = {
    "fear-based":        { bg: "rgba(255,107,107,0.1)",  color: "#ff6b6b" },
    "no-citation":       { bg: "rgba(255,183,77,0.1)",   color: "#ffb74d" },
    "identity-threat":   { bg: "rgba(255,107,107,0.1)",  color: "#ff6b6b" },
    "high-shareability": { bg: "rgba(200,240,96,0.1)",   color: "#c8f060" },
    "anonymous-source":  { bg: "rgba(255,183,77,0.1)",   color: "#ffb74d" },
    "us-vs-them":        { bg: "rgba(255,107,107,0.1)",  color: "#ff6b6b" },
    "viral":             { bg: "rgba(200,240,96,0.1)",   color: "#c8f060" },
    "emotional":         { bg: "rgba(255,107,107,0.1)",  color: "#ff6b6b" },
  };
  const style = colors[label.toLowerCase()] || { bg: "rgba(92,228,184,0.1)", color: "#5ce4b8" };
  return (
    <span style={{
      display: "inline-block",
      fontFamily: "'IBM Plex Mono', monospace",
      fontSize: 10, letterSpacing: "0.08em",
      padding: "3px 10px", borderRadius: 20,
      background: style.bg, color: style.color,
      border: `0.5px solid ${style.color}33`,
      margin: "0 4px 6px 0",
    }}>{label}</span>
  );
}

/* ── Panel ── */
function Panel({ title, accent = "#c8f060", children, badge }) {
  return (
    <div style={{
      background: "rgba(10,12,15,0.7)",
      border: "0.5px solid rgba(255,255,255,0.07)",
      borderRadius: 14, overflow: "hidden",
      backdropFilter: "blur(16px)",
    }}>
      <div style={{
        padding: "12px 18px",
        borderBottom: "0.5px solid rgba(255,255,255,0.05)",
        display: "flex", alignItems: "center",
        justifyContent: "space-between",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ width: 5, height: 5, borderRadius: "50%", background: accent }} />
          <span style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: 9, letterSpacing: "0.16em",
            color: "#404752", textTransform: "uppercase",
          }}>{title}</span>
        </div>
        {badge}
      </div>
      <div style={{ padding: "18px" }}>{children}</div>
    </div>
  );
}

/* ── Saved badge ── */
function SavedBadge() {
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 6,
      fontFamily: "'IBM Plex Mono', monospace",
      fontSize: 9, color: "#5ce4b8", letterSpacing: "0.1em",
      background: "rgba(92,228,184,0.08)",
      border: "0.5px solid rgba(92,228,184,0.2)",
      borderRadius: 20, padding: "3px 10px",
    }}>
      <span>✓</span> SAVED TO DATABASE
    </div>
  );
}

/* ── Empty state ── */
function EmptyState() {
  return (
    <div style={{
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      minHeight: 340, textAlign: "center", padding: "40px 20px",
    }}>
      <div style={{
        width: 64, height: 64, borderRadius: "50%",
        background: "rgba(200,240,96,0.05)",
        border: "0.5px solid rgba(200,240,96,0.1)",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 26, marginBottom: 20, color: "#c8f060", opacity: 0.5,
      }}>◈</div>
      <div style={{
        fontFamily: "'Syne', sans-serif", fontWeight: 600,
        fontSize: 18, color: "#2a2e36", marginBottom: 8,
      }}>Awaiting analysis</div>
      <div style={{
        fontFamily: "'IBM Plex Mono', monospace",
        fontSize: 11, color: "#252930", letterSpacing: "0.08em",
      }}>Paste a claim above to begin</div>
    </div>
  );
}

/* ── Loading skeleton ── */
function LoadingSkeleton() {
  return (
    <div>
      <style>{`
        @keyframes shimmer {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
      <div style={{ display: "grid", gridTemplateColumns: "240px 1fr", gap: 12, marginBottom: 12 }}>
        <div style={{
          background: "rgba(10,12,15,0.7)", border: "0.5px solid rgba(255,255,255,0.07)",
          borderRadius: 14, padding: 18,
        }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "16px 0" }}>
            <Skeleton h={140} w={140} mb={12} />
            <Skeleton h={28} w={100} />
          </div>
        </div>
        <div style={{
          background: "rgba(10,12,15,0.7)", border: "0.5px solid rgba(255,255,255,0.07)",
          borderRadius: 14, padding: 18,
        }}>
          {[1,2,3,4].map(i => <Skeleton key={i} h={44} mb={10} />)}
        </div>
      </div>
      <div style={{
        background: "rgba(10,12,15,0.7)", border: "0.5px solid rgba(255,255,255,0.07)",
        borderRadius: 14, padding: 18, marginBottom: 12,
      }}>
        {[1,2,3].map(i => <Skeleton key={i} h={64} mb={8} />)}
      </div>
      <div style={{
        background: "rgba(10,12,15,0.7)", border: "0.5px solid rgba(255,255,255,0.07)",
        borderRadius: 14, padding: 18,
      }}>
        <Skeleton h={20} mb={8} />
        <Skeleton h={20} w="85%" mb={8} />
        <Skeleton h={20} w="70%" mb={16} />
        <Skeleton h={16} w="60%" />
      </div>
    </div>
  );
}

/* ── Results ── */
function Results({ result, saved }) {
  return (
    <div style={{
      display: "flex", flexDirection: "column", gap: 12,
      animation: "fadeUp 0.6s cubic-bezier(0.16,1,0.3,1) both",
    }}>
      <style>{`
        @keyframes fadeUp {
          from { opacity:0; transform:translateY(20px); }
          to   { opacity:1; transform:translateY(0); }
        }
      `}</style>

      {/* Row 1 */}
      <div className="analyze-grid">
        <Panel
          title="Viral Risk Index"
          accent="#ff6b6b"
          badge={saved ? <SavedBadge /> : null}
        >
          <RiskGauge score={result.risk_score} level={result.risk_level} />
        </Panel>

        <Panel title="Signal Breakdown" accent="#ffb74d">
          {result.metrics.map((m, i) => (
            <MetricBar key={i} name={m.name} value={m.value} />
          ))}
        </Panel>
      </div>

      {/* Row 2 */}
      <Panel title="Predicted Spread Path" accent="#5ce4b8">
        {result.spread_stages.map((s, i) => (
          <SpreadStage key={i} stage={s} />
        ))}
      </Panel>

      {/* Row 3 */}
      <Panel title="AI Verdict & Analysis" accent="#c8f060">
        <div style={{
          background: "rgba(200,240,96,0.04)",
          border: "0.5px solid rgba(200,240,96,0.12)",
          borderLeft: "2px solid #c8f060",
          borderRadius: 8, padding: "14px 16px", marginBottom: 16,
          fontSize: 14, color: "#c8c6be", lineHeight: 1.7,
        }}>
          {result.verdict}
        </div>

        <div style={{ marginBottom: 16 }}>
          {result.tags.map((tag, i) => <Tag key={i} label={tag} />)}
        </div>

        <div style={{
          fontSize: 13, color: "#555d6a", lineHeight: 1.8,
          borderTop: "0.5px solid rgba(255,255,255,0.05)",
          paddingTop: 14,
        }}>
          {result.analysis}
        </div>
      </Panel>
    </div>
  );
}

/* ── MAIN PAGE ── */
export default function Analyze() {
  const { result, loading, error, saved, analyze, reset } = useAnalyze();
  const resultRef = useRef(null);

  const handleAnalyze = async (claim) => {
    reset();
    await analyze(claim);
    setTimeout(() => {
      resultRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 200);
  };

  return (
    <div style={{ position: "relative", minHeight: "100vh", background: "#050607" }}>
      <ParticleField />
      <Navbar />

      <main style={{
        position: "relative", zIndex: 10,
        maxWidth: 1000, margin: "0 auto",
        padding: "60px 24px 100px",
      }}>
        {/* Header */}
        <div style={{ marginBottom: 48 }}>
          <div style={{
            fontFamily: "'IBM Plex Mono', monospace", fontSize: 10,
            color: "#c8f060", letterSpacing: "0.2em",
            marginBottom: 12, opacity: 0.8,
          }}>TRUTHCHAIN AI · ANALYZER</div>
          <h1 style={{
            fontFamily: "'Syne', sans-serif", fontWeight: 800,
            fontSize: "clamp(32px, 5vw, 56px)", letterSpacing: "-1.5px",
            background: "linear-gradient(135deg, #eceae2 0%, rgba(236,234,226,0.5) 100%)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            marginBottom: 12,
          }}>Analyze a Claim</h1>
          <p style={{ fontSize: 15, color: "#555d6a", maxWidth: 520, lineHeight: 1.7 }}>
            Paste any claim, headline, or tweet. TruthChain AI will score its viral
            risk, map its spread path, and save results to the database.
          </p>
        </div>

        {/* Input */}
        <div style={{
          background: "rgba(10,12,15,0.8)",
          border: "0.5px solid rgba(255,255,255,0.07)",
          borderRadius: 16, padding: "28px",
          backdropFilter: "blur(20px)", marginBottom: 32,
        }}>
          <ClaimInput onAnalyze={handleAnalyze} loading={loading} />
        </div>

        {/* Error */}
        {error && (
          <div style={{
            background: "rgba(255,107,107,0.06)",
            border: "0.5px solid rgba(255,107,107,0.2)",
            borderRadius: 10, padding: "16px 20px",
            marginBottom: 24, display: "flex",
            alignItems: "flex-start", gap: 12,
          }}>
            <span style={{ color: "#ff6b6b", fontSize: 16 }}>⚠</span>
            <div>
              <div style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: 11, color: "#ff6b6b",
                letterSpacing: "0.06em", marginBottom: 4,
              }}>ANALYSIS ERROR</div>
              <div style={{ fontSize: 13, color: "#8a4444", lineHeight: 1.6 }}>{error}</div>
            </div>
          </div>
        )}

        {/* Results */}
        <div ref={resultRef}>
          {loading          && <LoadingSkeleton />}
          {!loading && result  && <Results result={result} saved={saved} />}
          {!loading && !result && !error && <EmptyState />}
        </div>
      </main>

      <Footer />
    </div>
  );
}