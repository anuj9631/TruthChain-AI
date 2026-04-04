import { useEffect, useState } from "react";

function getRiskColor(score) {
  if (score >= 70) return "#ff6b6b";
  if (score >= 40) return "#ffb74d";
  return "#5ce4b8";
}

function getRiskLabel(level) {
  if (level === "HIGH")     return "HIGH RISK";
  if (level === "MODERATE") return "MODERATE";
  return "LOW RISK";
}

function getRiskBg(level) {
  if (level === "HIGH")     return "rgba(255,107,107,0.1)";
  if (level === "MODERATE") return "rgba(255,183,77,0.1)";
  return "rgba(92,228,184,0.1)";
}

export default function RiskGauge({ score, level }) {
  const [animated, setAnimated] = useState(0);
  const color = getRiskColor(score);
  const r     = 58;
  const circ  = 2 * Math.PI * r;

  useEffect(() => {
    setAnimated(0);
    const t = setTimeout(() => setAnimated(score), 100);
    return () => clearTimeout(t);
  }, [score]);

  const fill = (animated / 100) * circ;

  return (
    <div style={{
      display: "flex", flexDirection: "column",
      alignItems: "center", padding: "28px 20px",
    }}>
      {/* Ring */}
      <div style={{ position: "relative", width: 150, height: 150, marginBottom: 16 }}>
        <svg
          width="150" height="150" viewBox="0 0 150 150"
          style={{ transform: "rotate(-90deg)" }}
        >
          {/* Track */}
          <circle
            cx="75" cy="75" r={r}
            fill="none" stroke="#1a1d24" strokeWidth="10"
          />
          {/* Progress */}
          <circle
            cx="75" cy="75" r={r}
            fill="none"
            stroke={color}
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={`${fill} ${circ}`}
            style={{ transition: "stroke-dasharray 1.2s cubic-bezier(0.16,1,0.3,1)" }}
          />
          {/* Glow */}
          <circle
            cx="75" cy="75" r={r}
            fill="none"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
            strokeDasharray={`${fill} ${circ}`}
            opacity="0.25"
            style={{ transition: "stroke-dasharray 1.2s cubic-bezier(0.16,1,0.3,1)", filter: "blur(3px)" }}
          />
        </svg>

        {/* Center text */}
        <div style={{
          position: "absolute", top: "50%", left: "50%",
          transform: "translate(-50%, -50%)", textAlign: "center",
        }}>
          <div style={{
            fontFamily: "'Syne', sans-serif", fontWeight: 800,
            fontSize: 36, color, lineHeight: 1,
            transition: "color 0.5s",
          }}>{score}</div>
          <div style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: 10, color: "#555d6a", marginTop: 3,
          }}>/100</div>
        </div>
      </div>

      {/* Badge */}
      <div style={{
        fontFamily: "'IBM Plex Mono', monospace",
        fontSize: 11, letterSpacing: "0.1em",
        padding: "5px 16px", borderRadius: 20,
        background: getRiskBg(level), color,
        border: `0.5px solid ${color}44`,
      }}>
        {getRiskLabel(level)}
      </div>
    </div>
  );
}