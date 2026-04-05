import { useState } from "react";
import { useNavigate } from "react-router-dom";

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

function ScoreRing({ score, level }) {
  const color = getRiskColor(level);
  const r     = 18;
  const circ  = 2 * Math.PI * r;
  const fill  = (score / 100) * circ;

  return (
    <div style={{ position: "relative", width: 48, height: 48, flexShrink: 0 }}>
      <svg width="48" height="48" viewBox="0 0 48 48" style={{ transform: "rotate(-90deg)" }}>
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

export default function ClaimCard({ claim, index }) {
  const [hov, setHov] = useState(false);
  const navigate = useNavigate();
  const color = getRiskColor(claim.risk_level);

  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: "flex", alignItems: "center", gap: 16,
        padding: "16px 20px",
        background: hov ? getRiskBg(claim.risk_level) : "rgba(10,12,15,0.5)",
        border: `0.5px solid ${hov ? color + "33" : "rgba(255,255,255,0.05)"}`,
        borderRadius: 12, marginBottom: 8,
        transition: "all 0.25s cubic-bezier(0.16,1,0.3,1)",
        cursor: "pointer",
        transform: hov ? "translateX(4px)" : "translateX(0)",
        animation: `fadeUp 0.5s ${index * 0.06}s cubic-bezier(0.16,1,0.3,1) both`,
      }}
      onClick={() => navigate("/analyze")}
    >
      {/* Index */}
      <div style={{
        fontFamily: "'IBM Plex Mono', monospace",
        fontSize: 10, color: "#2a2e36",
        minWidth: 24, textAlign: "right",
      }}>
        {String(index + 1).padStart(2, "0")}
      </div>

      {/* Live dot */}
      <div style={{
        width: 6, height: 6, borderRadius: "50%",
        background: color, flexShrink: 0,
        boxShadow: `0 0 6px ${color}`,
        animation: claim.risk_level === "HIGH" ? "dotPulse 1.5s ease-in-out infinite" : "none",
      }} />

      {/* Claim text */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontSize: 14, color: hov ? "#eceae2" : "#9aa0aa",
          fontWeight: 500, marginBottom: 6,
          whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
          transition: "color 0.2s",
        }}>{claim.claim}</div>

        {/* Tags */}
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {claim.tags.slice(0, 3).map((tag, i) => (
            <span key={i} style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: 9, letterSpacing: "0.08em",
              padding: "2px 8px", borderRadius: 20,
              background: `${color}11`, color: color,
              border: `0.5px solid ${color}22`,
            }}>{tag}</span>
          ))}
        </div>
      </div>

      {/* Score ring */}
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
        minWidth: 48, textAlign: "right", flexShrink: 0,
      }}>{claim.time}</div>
    </div>
  );
}