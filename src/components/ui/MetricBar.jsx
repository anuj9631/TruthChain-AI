import { useEffect, useState } from "react";

function getBarColor(value) {
  if (value >= 70) return "#ff6b6b";
  if (value >= 40) return "#ffb74d";
  return "#5ce4b8";
}

export default function MetricBar({ name, value }) {
  const [animated, setAnimated] = useState(0);
  const color = getBarColor(value);

  useEffect(() => {
    setAnimated(0);
    const t = setTimeout(() => setAnimated(value), 200);
    return () => clearTimeout(t);
  }, [value]);

  return (
    <div style={{ padding: "10px 0", borderBottom: "0.5px solid rgba(255,255,255,0.05)" }}>
      <div style={{
        display: "flex", justifyContent: "space-between",
        alignItems: "center", marginBottom: 8,
      }}>
        <span style={{
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: 11, color: "#606876", letterSpacing: "0.04em",
        }}>{name}</span>
        <span style={{
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: 12, color, fontWeight: 500,
        }}>{value}</span>
      </div>

      {/* Bar track */}
      <div style={{
        height: 4, borderRadius: 2,
        background: "rgba(255,255,255,0.05)",
        overflow: "hidden",
      }}>
        <div style={{
          height: "100%", borderRadius: 2,
          background: `linear-gradient(90deg, ${color}99, ${color})`,
          width: `${animated}%`,
          transition: "width 1s cubic-bezier(0.16,1,0.3,1)",
          boxShadow: `0 0 8px ${color}66`,
        }} />
      </div>
    </div>
  );
}