import { useEffect, useState } from "react";

const STATS = [
  { label: "Claims Analyzed", value: 2400000, display: "2.4M", suffix: "+", color: "#c8f060" },
  { label: "Detection Accuracy", value: 94, display: "94", suffix: "%", color: "#5ce4b8" },
  { label: "Avg Minutes Ahead", value: 18, display: "18", suffix: "m", color: "#ffb74d" },
  { label: "Countries Monitored", value: 140, display: "140", suffix: "+", color: "#ff6b6b" },
];

export default function StatsBar() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
      gap: 12, marginBottom: 24,
    }}>
      {STATS.map((s, i) => (
        <div key={i} style={{
          background: "rgba(10,12,15,0.8)",
          border: `0.5px solid ${s.color}22`,
          borderRadius: 12, padding: "20px 24px",
          backdropFilter: "blur(16px)",
          transition: `all 0.6s cubic-bezier(0.16,1,0.3,1) ${i * 0.1}s`,
          transform: visible ? "translateY(0)" : "translateY(20px)",
          opacity: visible ? 1 : 0,
          position: "relative", overflow: "hidden",
        }}>
          {/* Accent line top */}
          <div style={{
            position: "absolute", top: 0, left: 0, right: 0,
            height: 2,
            background: `linear-gradient(90deg, transparent, ${s.color}66, transparent)`,
          }} />

          <div style={{
            fontFamily: "'IBM Plex Mono', monospace", fontSize: 9,
            color: "#404752", letterSpacing: "0.14em",
            marginBottom: 10, textTransform: "uppercase",
          }}>{s.label}</div>

          <div style={{
            fontFamily: "'Syne', sans-serif", fontWeight: 800,
            fontSize: 32, letterSpacing: "-1px",
            color: s.color, lineHeight: 1,
          }}>
            {s.display}
            <span style={{ fontSize: 16, opacity: 0.7 }}>{s.suffix}</span>
          </div>
        </div>
      ))}
    </div>
  );
}