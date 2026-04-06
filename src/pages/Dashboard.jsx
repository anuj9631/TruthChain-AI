import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  LineChart, Line, BarChart, Bar,
  XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid,
} from "recharts";
import Navbar        from "../components/layout/Navbar";
import Footer        from "../components/layout/Footer";
import ParticleField from "../components/three/ParticleField";
import StatsBar      from "../components/ui/StatsBar";
import { useClaims, useDashboardStats } from "../hooks/useClaims";

const FILTERS = ["ALL", "HIGH", "MODERATE", "LOW"];

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

/* ── Helpers ── */
function getRiskColor(level) {
  if (level === "HIGH")     return "#ff6b6b";
  if (level === "MODERATE") return "#ffb74d";
  return "#5ce4b8";
}

function getRiskBg(level) {
  if (level === "HIGH")     return "rgba(255,107,107,0.08)";
  if (level === "MODERATE") return "rgba(255,183,77,0.08)";
  return "rgba(92,228,184,0.08)";
}

function timeAgo(dateStr) {
  const diff = Math.floor((Date.now() - new Date(dateStr)) / 1000);
  if (diff < 60)   return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

/* ── Custom tooltip ── */
function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: "#0c0e11",
      border: "0.5px solid rgba(255,255,255,0.1)",
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
        }}>{p.name}: {p.value}</div>
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
      backdropFilter: "blur(16px)", marginBottom: 16,
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

/* ── Score ring ── */
function ScoreRing({ score, level }) {
  const color = getRiskColor(level);
  const r     = 18;
  const circ  = 2 * Math.PI * r;
  const fill  = (score / 100) * circ;
  return (
    <div style={{ position: "relative", width: 48, height: 48, flexShrink: 0 }}>
      <svg width="48" height="48" viewBox="0 0 48 48"
        style={{ transform: "rotate(-90deg)" }}>
        <circle cx="24" cy="24" r={r} fill="none" stroke="#1a1d24" strokeWidth="4" />
        <circle cx="24" cy="24" r={r} fill="none" stroke={color}
          strokeWidth="4" strokeLinecap="round"
          strokeDasharray={`${fill} ${circ}`} />
      </svg>
      <div style={{
        position: "absolute", top: "50%", left: "50%",
        transform: "translate(-50%,-50%)",
        fontFamily: "'IBM Plex Mono', monospace",
        fontSize: 11, fontWeight: 500, color,
      }}>{score}</div>
    </div>
  );
}

/* ── Claim row ── */
function ClaimRow({ claim, index }) {
  const [hov, setHov] = useState(false);
  const navigate      = useNavigate();
  const color         = getRiskColor(claim.risk_level);

  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      onClick={() => navigate("/analyze")}
      style={{
        display: "flex", alignItems: "center", gap: 16,
        padding: "14px 18px",
        background: hov ? getRiskBg(claim.risk_level) : "rgba(10,12,15,0.3)",
        border: `0.5px solid ${hov ? color + "33" : "rgba(255,255,255,0.04)"}`,
        borderRadius: 10, marginBottom: 6,
        cursor: "pointer",
        transition: "all 0.22s cubic-bezier(0.16,1,0.3,1)",
        transform: hov ? "translateX(4px)" : "translateX(0)",
      }}
    >
      {/* Index */}
      <div style={{
        fontFamily: "'IBM Plex Mono', monospace",
        fontSize: 10, color: "#2a2e36", minWidth: 22,
      }}>{String(index + 1).padStart(2, "0")}</div>

      {/* Dot */}
      <div style={{
        width: 6, height: 6, borderRadius: "50%",
        background: color, flexShrink: 0,
        boxShadow: `0 0 6px ${color}`,
        animation: claim.risk_level === "HIGH"
          ? "dotPulse 1.5s ease-in-out infinite" : "none",
      }} />

      {/* Claim text + tags */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontSize: 13, fontWeight: 500, marginBottom: 5,
          color: hov ? "#eceae2" : "#8a929e",
          whiteSpace: "nowrap", overflow: "hidden",
          textOverflow: "ellipsis", transition: "color 0.2s",
        }}>{claim.claim}</div>
        <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
          {(claim.tags || []).slice(0, 3).map((tag, i) => (
            <span key={i} style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: 9, letterSpacing: "0.06em",
              padding: "2px 7px", borderRadius: 20,
              background: `${color}11`, color,
              border: `0.5px solid ${color}22`,
            }}>{tag}</span>
          ))}
        </div>
      </div>

      {/* Score */}
      <ScoreRing score={claim.risk_score} level={claim.risk_level} />

      {/* Risk badge */}
      <div style={{
        fontFamily: "'IBM Plex Mono', monospace",
        fontSize: 9, letterSpacing: "0.1em",
        padding: "4px 10px", borderRadius: 20,
        background: getRiskBg(claim.risk_level),
        color, border: `0.5px solid ${color}33`,
        minWidth: 80, textAlign: "center", flexShrink: 0,
      }}>{claim.risk_level}</div>

      {/* Time */}
      <div style={{
        fontFamily: "'IBM Plex Mono', monospace",
        fontSize: 10, color: "#2a2e36",
        minWidth: 56, textAlign: "right", flexShrink: 0,
      }}>{timeAgo(claim.created_at)}</div>
    </div>
  );
}

/* ── Empty feed ── */
function EmptyFeed() {
  const navigate = useNavigate();
  return (
    <div style={{
      textAlign: "center", padding: "60px 20px",
      display: "flex", flexDirection: "column",
      alignItems: "center", gap: 16,
    }}>
      <div style={{
        width: 56, height: 56, borderRadius: "50%",
        background: "rgba(200,240,96,0.05)",
        border: "0.5px solid rgba(200,240,96,0.1)",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 22, color: "#c8f060", opacity: 0.4,
      }}>◈</div>
      <div style={{
        fontFamily: "'Syne', sans-serif", fontWeight: 600,
        fontSize: 16, color: "#2a2e36",
      }}>No claims analyzed yet</div>
      <div style={{
        fontFamily: "'IBM Plex Mono', monospace",
        fontSize: 11, color: "#252930", marginBottom: 8,
      }}>Analyze your first claim to see it here</div>
      <button
        onClick={() => navigate("/analyze")}
        style={{
          background: "linear-gradient(135deg, #c8f060, #a8e040)",
          color: "#050607", border: "none", borderRadius: 6,
          padding: "9px 22px", fontFamily: "'IBM Plex Mono', monospace",
          fontSize: 11, letterSpacing: "0.06em", cursor: "pointer",
          fontWeight: 500,
        }}
      >ANALYZE FIRST CLAIM →</button>
    </div>
  );
}

/* ── Loading rows skeleton ── */
function FeedSkeleton() {
  return (
    <div>
      <style>{`@keyframes shimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }`}</style>
      {[1,2,3,4,5].map(i => (
        <div key={i} style={{
          height: 72, borderRadius: 10, marginBottom: 6,
          background: "linear-gradient(90deg, #0f1216 25%, #161a20 50%, #0f1216 75%)",
          backgroundSize: "200% 100%",
          animation: "shimmer 1.4s infinite",
          animationDelay: `${i * 0.1}s`,
        }} />
      ))}
    </div>
  );
}

/* ── MAIN DASHBOARD ── */
export default function Dashboard() {
  const [filter, setFilter] = useState("ALL");
  const { claims, loading: claimsLoading } = useClaims({ filter });
  const { stats } = useDashboardStats();

  const distData = stats ? [
    { name: "High",     value: stats.high,     fill: "#ff6b6b" },
    { name: "Moderate", value: stats.moderate,  fill: "#ffb74d" },
    { name: "Low",      value: stats.low,       fill: "#5ce4b8" },
  ] : [];

  return (
    <div style={{ position: "relative", minHeight: "100vh", background: "#050607" }}>
      <style>{`
        @keyframes dotPulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.6); opacity: 0.5; }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
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
            color: "#c8f060", letterSpacing: "0.2em",
            marginBottom: 10, opacity: 0.8,
          }}>TRUTHCHAIN AI · DASHBOARD</div>
          <div style={{
            display: "flex", alignItems: "flex-end",
            justifyContent: "space-between", flexWrap: "wrap", gap: 12,
          }}>
            <h1 style={{
              fontFamily: "'Syne', sans-serif", fontWeight: 800,
              fontSize: "clamp(28px, 4vw, 48px)", letterSpacing: "-1.5px",
              background: "linear-gradient(135deg, #eceae2 0%, rgba(236,234,226,0.5) 100%)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            }}>Live Claim Monitor</h1>

            {/* Live badge */}
            <div style={{
              display: "flex", alignItems: "center", gap: 6,
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: 9, color: "#ff6b6b", letterSpacing: "0.1em",
            }}>
              <span style={{
                width: 5, height: 5, borderRadius: "50%",
                background: "#ff6b6b", display: "inline-block",
                animation: "dotPulse 1.5s ease-in-out infinite",
              }} />
              LIVE · {claims.length} CLAIMS IN DB
            </div>
          </div>
        </div>

        {/* Stats */}
        <StatsBar />

        {/* Charts */}
        <div style={{
          display: "grid", gridTemplateColumns: "1fr 1fr",
          gap: 16, marginBottom: 4,
        }}>
          {/* Trend */}
          <Panel title="Claim Volume — Last 24 Hours" accent="#5ce4b8">
            <div style={{ height: 200 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={TREND_DATA}>
                  <CartesianGrid stroke="rgba(255,255,255,0.03)" />
                  <XAxis dataKey="time"
                    tick={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 9, fill: "#404752" }}
                    axisLine={false} tickLine={false} />
                  <YAxis
                    tick={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 9, fill: "#404752" }}
                    axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Line type="monotone" dataKey="high"     stroke="#ff6b6b" strokeWidth={2} dot={false} name="High" />
                  <Line type="monotone" dataKey="moderate" stroke="#ffb74d" strokeWidth={2} dot={false} name="Moderate" />
                  <Line type="monotone" dataKey="low"      stroke="#5ce4b8" strokeWidth={2} dot={false} name="Low" />
                </LineChart>
              </ResponsiveContainer>
            </div>
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

          {/* Distribution */}
          <Panel title="Risk Distribution" accent="#ffb74d">
            <div style={{ height: 200 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={distData} barSize={40}>
                  <XAxis dataKey="name"
                    tick={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 9, fill: "#404752" }}
                    axisLine={false} tickLine={false} />
                  <YAxis
                    tick={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 9, fill: "#404752" }}
                    axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]} name="Claims"
                    fill="#c8f060"
                    label={false}
                  >
                    {distData.map((entry, i) => (
                      <rect key={i} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Pills */}
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
                    fontSize: 20, color: d.fill,
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
          title="Analyzed Claims Feed — Real Database"
          accent="#ff6b6b"
          action={
            <div style={{ display: "flex", gap: 6 }}>
              {FILTERS.map(f => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  style={{
                    background: filter === f ? "rgba(200,240,96,0.1)" : "transparent",
                    border: `0.5px solid ${filter === f ? "rgba(200,240,96,0.35)" : "rgba(255,255,255,0.07)"}`,
                    color: filter === f ? "#c8f060" : "#404752",
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
            padding: "0 18px 10px",
            borderBottom: "0.5px solid rgba(255,255,255,0.04)",
            marginBottom: 8,
          }}>
            <div style={{ minWidth: 22 }} />
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
              fontSize: 9, color: "#2a2e36", minWidth: 56, textAlign: "right",
            }}>TIME</div>
          </div>

          {claimsLoading  && <FeedSkeleton />}
          {!claimsLoading && claims.length === 0 && <EmptyFeed />}
          {!claimsLoading && claims.map((claim, i) => (
            <ClaimRow key={claim.id} claim={claim} index={i} />
          ))}
        </Panel>

      </main>

      <Footer />
    </div>
  );
}