import { useState, useEffect, useCallback } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, LineChart, Line,
  CartesianGrid, Legend,
} from "recharts";
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import ParticleField from "../components/three/ParticleField";
import StatsBar from "../components/ui/StatsBar";
import ClaimCard from "../components/ui/ClaimCard";

/* ── Mock Data ── */
const MOCK_CLAIMS = [
  { id: 1,  claim: "5G towers cause long-term memory loss in urban populations",       risk_score: 88, risk_level: "HIGH",     tags: ["fear-based", "no-citation", "viral"],           time: "2m ago" },
  { id: 2,  claim: "COVID-19 vaccines contain nano-microchips activated via Bluetooth", risk_score: 94, risk_level: "HIGH",     tags: ["conspiracy", "identity-threat", "fear-based"],  time: "5m ago" },
  { id: 3,  claim: "New study links tap water fluoride to 15-point IQ reduction",       risk_score: 71, risk_level: "HIGH",     tags: ["fake-study", "fear-based", "health"],           time: "9m ago" },
  { id: 4,  claim: "Election machines in 4 swing states remotely hacked",              risk_score: 85, risk_level: "HIGH",     tags: ["election", "no-evidence", "identity-threat"],   time: "14m ago" },
  { id: 5,  claim: "MIT study proves global warming stopped in 2015",                  risk_score: 76, risk_level: "HIGH",     tags: ["climate-denial", "fake-study", "viral"],        time: "18m ago" },
  { id: 6,  claim: "Chemtrails are being used to secretly alter weather patterns",     risk_score: 62, risk_level: "MODERATE", tags: ["conspiracy", "anonymous-source"],               time: "22m ago" },
  { id: 7,  claim: "Chip in 2000 rupee notes can track your location via GPS",         risk_score: 68, risk_level: "MODERATE", tags: ["economic-fear", "no-citation", "viral"],        time: "31m ago" },
  { id: 8,  claim: "Eating turmeric daily cures all forms of cancer",                  risk_score: 55, risk_level: "MODERATE", tags: ["health-misinformation", "no-citation"],         time: "38m ago" },
  { id: 9,  claim: "WHO secretly planning global mandatory vaccine program in 2026",   risk_score: 79, risk_level: "HIGH",     tags: ["fear-based", "conspiracy", "identity-threat"],  time: "45m ago" },
  { id: 10, claim: "New research shows coffee consumption linked to memory loss",       risk_score: 34, risk_level: "LOW",      tags: ["health", "needs-verification"],                 time: "52m ago" },
  { id: 11, claim: "Government plans to replace paper money with digital only currency", risk_score: 48, risk_level: "MODERATE", tags: ["economic-fear", "partial-truth"],             time: "1h ago" },
  { id: 12, claim: "Drinking lemon water every morning reverses diabetes completely",   risk_score: 41, risk_level: "MODERATE", tags: ["health-misinformation", "no-citation"],         time: "1h ago" },
  { id: 13, claim: "Scientists confirm moon landing was staged by NASA in 1969",        risk_score: 22, risk_level: "LOW",      tags: ["debunked", "conspiracy"],                       time: "2h ago" },
  { id: 14, claim: "New AI model can predict human death within 24 hours",             risk_score: 58, risk_level: "MODERATE", tags: ["fear-based", "exaggerated"],                   time: "2h ago" },
  { id: 15, claim: "Russia develops invisible military aircraft undetectable by radar", risk_score: 29, risk_level: "LOW",      tags: ["unverified", "military"],                       time: "3h ago" },
];

const TREND_DATA = [
  { time: "00:00", high: 12, moderate: 8,  low: 5  },
  { time: "03:00", high: 8,  moderate: 12, low: 7  },
  { time: "06:00", high: 15, moderate: 10, low: 9  },
  { time: "09:00", high: 28, moderate: 18, low: 12 },
  { time: "12:00", high: 42, moderate: 25, low: 15 },
  { time: "15:00", high: 38, moderate: 30, low: 18 },
  { time: "18:00", high: 55, moderate: 35, low: 22 },
  { time: "21:00", high: 48, moderate: 28, low: 16 },
  { time: "Now",   high: 62, moderate: 40, low: 20 },
];

const CATEGORY_DATA = [
  { category: "Health",   count: 38, fill: "#ff6b6b" },
  { category: "Politics", count: 29, fill: "#ffb74d" },
  { category: "Science",  count: 18, fill: "#5ce4b8" },
  { category: "Economy",  count: 24, fill: "#c8f060" },
  { category: "Military", count: 11, fill: "#9b8afb" },
];

const FILTERS = ["ALL", "HIGH", "MODERATE", "LOW"];

/* ── Custom Tooltip ── */
function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: "#0c0e11", border: "0.5px solid rgba(255,255,255,0.1)",
      borderRadius: 8, padding: "10px 14px",
    }}>
      <div style={{
        fontFamily: "'IBM Plex Mono', monospace",
        fontSize: 10, color: "#555d6a", marginBottom: 6,
      }}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: 11, color: p.color, marginBottom: 2,
        }}>
          {p.name}: {p.value}
        </div>
      ))}
    </div>
  );
}

/* ── Panel ── */
function Panel({ title, accent = "#c8f060", children, action }) {
  return (
    <div style={{
      background: "rgba(10,12,15,0.8)",
      border: "0.5px solid rgba(255,255,255,0.07)",
      borderRadius: 14, overflow: "hidden",
      backdropFilter: "blur(16px)",
      marginBottom: 16,
    }}>
      <div style={{
        padding: "12px 20px",
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
        {action}
      </div>
      <div style={{ padding: "20px" }}>{children}</div>
    </div>
  );
}

/* ── Live indicator ── */
function LiveBadge({ count }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: 6,
      fontFamily: "'IBM Plex Mono', monospace",
      fontSize: 9, letterSpacing: "0.1em", color: "#ff6b6b",
    }}>
      <span style={{
        width: 5, height: 5, borderRadius: "50%",
        background: "#ff6b6b",
        animation: "dotPulse 1.5s ease-in-out infinite",
        display: "inline-block",
      }} />
      LIVE · {count} CLAIMS
    </div>
  );
}

/* ── MAIN DASHBOARD ── */
export default function Dashboard() {
  const [filter,   setFilter]   = useState("ALL");
  const [claims,   setClaims]   = useState(MOCK_CLAIMS);
  const [tick,     setTick]     = useState(0);
  const [newAlert, setNewAlert] = useState(null);

  /* Simulate new claims coming in every 30s */
  const NEW_CLAIMS = [
    { id: 100, claim: "Breaking: Unknown virus spreading in Southeast Asia",           risk_score: 91, risk_level: "HIGH",     tags: ["health-fear", "breaking", "viral"],             time: "just now" },
    { id: 101, claim: "Government secretly testing mind control via smartphones",      risk_score: 83, risk_level: "HIGH",     tags: ["conspiracy", "fear-based", "identity-threat"],  time: "just now" },
    { id: 102, claim: "New superfood discovered that cures all autoimmune diseases",   risk_score: 47, risk_level: "MODERATE", tags: ["health", "exaggerated", "no-citation"],         time: "just now" },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      const next = NEW_CLAIMS[tick % NEW_CLAIMS.length];
      setNewAlert(next);
      setClaims(prev => [{ ...next, time: "just now" }, ...prev.slice(0, 14)]);
      setTick(t => t + 1);
      setTimeout(() => setNewAlert(null), 4000);
    }, 30000);
    return () => clearInterval(interval);
  }, [tick]);

  const filtered = filter === "ALL"
    ? claims
    : claims.filter(c => c.risk_level === filter);

  const highCount = claims.filter(c => c.risk_level === "HIGH").length;
  const modCount  = claims.filter(c => c.risk_level === "MODERATE").length;
  const lowCount  = claims.filter(c => c.risk_level === "LOW").length;

  const distData = [
    { name: "High",     value: highCount, fill: "#ff6b6b" },
    { name: "Moderate", value: modCount,  fill: "#ffb74d" },
    { name: "Low",      value: lowCount,  fill: "#5ce4b8" },
  ];

  return (
    <div style={{ position: "relative", minHeight: "100vh", background: "#050607" }}>
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes dotPulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50%       { transform: scale(1.6); opacity: 0.5; }
        }
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(-20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <ParticleField />
      <Navbar />

      <main style={{
        position: "relative", zIndex: 10,
        maxWidth: 1100, margin: "0 auto",
        padding: "60px 24px 100px",
      }}>

        {/* Header */}
        <div style={{ marginBottom: 36 }}>
          <div style={{
            fontFamily: "'IBM Plex Mono', monospace", fontSize: 10,
            color: "#c8f060", letterSpacing: "0.2em", marginBottom: 10, opacity: 0.8,
          }}>TRUTHCHAIN AI · DASHBOARD</div>
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
            <h1 style={{
              fontFamily: "'Syne', sans-serif", fontWeight: 800,
              fontSize: "clamp(28px, 4vw, 48px)", letterSpacing: "-1.5px",
              background: "linear-gradient(135deg, #eceae2 0%, rgba(236,234,226,0.5) 100%)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            }}>Live Claim Monitor</h1>
            <LiveBadge count={claims.length} />
          </div>
        </div>

        {/* New alert toast */}
        {newAlert && (
          <div style={{
            background: "rgba(255,107,107,0.08)",
            border: "0.5px solid rgba(255,107,107,0.3)",
            borderRadius: 10, padding: "12px 18px",
            marginBottom: 20, display: "flex",
            alignItems: "center", gap: 12,
            animation: "slideIn 0.4s cubic-bezier(0.16,1,0.3,1)",
          }}>
            <span style={{
              width: 6, height: 6, borderRadius: "50%",
              background: "#ff6b6b", flexShrink: 0,
              animation: "dotPulse 1.5s ease-in-out infinite",
              display: "inline-block",
            }} />
            <span style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: 10, color: "#ff6b6b", letterSpacing: "0.06em",
            }}>NEW HIGH RISK CLAIM DETECTED →</span>
            <span style={{ fontSize: 13, color: "#8a4444" }}>{newAlert.claim}</span>
          </div>
        )}

        {/* Stats */}
        <StatsBar />

        {/* Charts row */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 16, marginBottom: 4,
        }}>
          {/* Trend chart */}
          <Panel title="Claim Volume — Last 24 Hours" accent="#5ce4b8">
            <div style={{ height: 200 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={TREND_DATA}>
                  <CartesianGrid stroke="rgba(255,255,255,0.03)" />
                  <XAxis
                    dataKey="time"
                    tick={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 9, fill: "#404752" }}
                    axisLine={false} tickLine={false}
                  />
                  <YAxis
                    tick={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 9, fill: "#404752" }}
                    axisLine={false} tickLine={false}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Line type="monotone" dataKey="high"     stroke="#ff6b6b" strokeWidth={2} dot={false} name="High" />
                  <Line type="monotone" dataKey="moderate" stroke="#ffb74d" strokeWidth={2} dot={false} name="Moderate" />
                  <Line type="monotone" dataKey="low"      stroke="#5ce4b8" strokeWidth={2} dot={false} name="Low" />
                </LineChart>
              </ResponsiveContainer>
            </div>
            {/* Legend */}
            <div style={{ display: "flex", gap: 16, marginTop: 12 }}>
              {[
                { label: "High",     color: "#ff6b6b" },
                { label: "Moderate", color: "#ffb74d" },
                { label: "Low",      color: "#5ce4b8" },
              ].map(l => (
                <div key={l.label} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <div style={{ width: 20, height: 2, background: l.color, borderRadius: 1 }} />
                  <span style={{
                    fontFamily: "'IBM Plex Mono', monospace",
                    fontSize: 9, color: "#404752",
                  }}>{l.label}</span>
                </div>
              ))}
            </div>
          </Panel>

          {/* Category chart */}
          <Panel title="Claims by Category" accent="#ffb74d">
            <div style={{ height: 200 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={CATEGORY_DATA} barSize={28}>
                  <XAxis
                    dataKey="category"
                    tick={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 9, fill: "#404752" }}
                    axisLine={false} tickLine={false}
                  />
                  <YAxis
                    tick={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 9, fill: "#404752" }}
                    axisLine={false} tickLine={false}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="count" radius={[4, 4, 0, 0]} name="Claims">
                    {CATEGORY_DATA.map((entry, i) => (
                      <rect key={i} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Distribution pills */}
            <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
              {distData.map(d => (
                <div key={d.name} style={{
                  flex: 1, textAlign: "center",
                  background: `${d.fill}11`,
                  border: `0.5px solid ${d.fill}22`,
                  borderRadius: 8, padding: "8px 4px",
                }}>
                  <div style={{
                    fontFamily: "'Syne', sans-serif", fontWeight: 700,
                    fontSize: 18, color: d.fill,
                  }}>{d.value}</div>
                  <div style={{
                    fontFamily: "'IBM Plex Mono', monospace",
                    fontSize: 9, color: "#404752", marginTop: 2,
                  }}>{d.name.toUpperCase()}</div>
                </div>
              ))}
            </div>
          </Panel>
        </div>

        {/* Live Feed */}
        <Panel
          title="Live Claim Feed"
          accent="#ff6b6b"
          action={
            <div style={{ display: "flex", gap: 6 }}>
              {FILTERS.map(f => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  style={{
                    background: filter === f
                      ? f === "HIGH"     ? "rgba(255,107,107,0.15)"
                      : f === "MODERATE" ? "rgba(255,183,77,0.15)"
                      : f === "LOW"      ? "rgba(92,228,184,0.15)"
                      :                   "rgba(200,240,96,0.15)"
                      : "transparent",
                    border: `0.5px solid ${
                      filter === f
                        ? f === "HIGH"     ? "rgba(255,107,107,0.4)"
                        : f === "MODERATE" ? "rgba(255,183,77,0.4)"
                        : f === "LOW"      ? "rgba(92,228,184,0.4)"
                        :                   "rgba(200,240,96,0.4)"
                        : "rgba(255,255,255,0.08)"
                    }`,
                    color: filter === f
                      ? f === "HIGH"     ? "#ff6b6b"
                      : f === "MODERATE" ? "#ffb74d"
                      : f === "LOW"      ? "#5ce4b8"
                      :                   "#c8f060"
                      : "#404752",
                    borderRadius: 6, padding: "4px 10px",
                    fontFamily: "'IBM Plex Mono', monospace",
                    fontSize: 9, letterSpacing: "0.08em",
                    cursor: "pointer", transition: "all 0.2s",
                  }}
                >{f}</button>
              ))}
            </div>
          }
        >
          {/* Column headers */}
          <div style={{
            display: "flex", alignItems: "center", gap: 16,
            padding: "0 20px 10px",
            borderBottom: "0.5px solid rgba(255,255,255,0.04)",
            marginBottom: 8,
          }}>
            <div style={{ minWidth: 24 }} />
            <div style={{ minWidth: 6 }} />
            <div style={{
              flex: 1, fontFamily: "'IBM Plex Mono', monospace",
              fontSize: 9, color: "#2a2e36", letterSpacing: "0.12em",
            }}>CLAIM</div>
            <div style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: 9, color: "#2a2e36", minWidth: 48, textAlign: "center",
            }}>SCORE</div>
            <div style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: 9, color: "#2a2e36", minWidth: 80, textAlign: "center",
            }}>RISK</div>
            <div style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: 9, color: "#2a2e36", minWidth: 48, textAlign: "right",
            }}>TIME</div>
          </div>

          {filtered.length === 0 ? (
            <div style={{
              textAlign: "center", padding: "48px 0",
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: 12, color: "#2a2e36",
            }}>No claims match this filter</div>
          ) : (
            filtered.map((claim, i) => (
              <ClaimCard key={claim.id} claim={claim} index={i} />
            ))
          )}
        </Panel>

      </main>

      <Footer />
    </div>
  );
}