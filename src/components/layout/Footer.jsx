import { useNavigate } from "react-router-dom";

export default function Footer() {
  const navigate = useNavigate();

  return (
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

      <div style={{ display: "flex", gap: 24 }}>
        {[
          { label: "Home",      path: "/" },
          { label: "Analyze",   path: "/analyze" },
          { label: "Dashboard", path: "/dashboard" },
          { label: "Research",  path: "/research" },
        ].map((l) => (
          <span
            key={l.label}
            onClick={() => navigate(l.path)}
            style={{
              fontFamily: "'IBM Plex Mono', monospace", fontSize: 10,
              color: "#2d333d", cursor: "pointer", transition: "color 0.2s",
            }}
            onMouseEnter={e => e.target.style.color = "#c8f060"}
            onMouseLeave={e => e.target.style.color = "#2d333d"}
          >{l.label}</span>
        ))}
      </div>

      <span style={{
        fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, color: "#2d333d",
      }}>Built with React + Vite + Claude API</span>
    </footer>
  );
}