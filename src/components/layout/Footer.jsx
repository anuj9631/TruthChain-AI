import { useNavigate } from "react-router-dom";

export default function Footer() {
  const navigate = useNavigate();

  return (
    <footer style={{
      position: "relative", zIndex: 10,
      borderTop: "0.5px solid rgba(255,255,255,0.05)",
      padding: "28px 24px",
    }}>
      <div style={{
        maxWidth: 1100, margin: "0 auto",
        display: "flex", justifyContent: "space-between",
        alignItems: "center", flexWrap: "wrap", gap: 16,
      }}>
        {/* Logo */}
        <div
          onClick={() => navigate("/")}
          style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}
        >
          <div style={{
            width: 22, height: 22, borderRadius: 5,
            background: "linear-gradient(135deg, #c8f060, #5ce4b8)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 9, fontWeight: 700, color: "#050607",
            fontFamily: "'IBM Plex Mono', monospace",
          }}>TC</div>
          <span style={{
            fontFamily: "'Syne', sans-serif", fontWeight: 700,
            fontSize: 14, letterSpacing: "-0.3px",
          }}>
            <span style={{ color: "#c8f060" }}>Truth</span>
            <span style={{ color: "#3a3f49" }}>Chain AI</span>
          </span>
        </div>

        {/* Links */}
        <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
          {[
            { label: "Home",      path: "/"          },
            { label: "Analyze",   path: "/analyze"   },
            { label: "Dashboard", path: "/dashboard" },
            { label: "Research",  path: "/research"  },
          ].map((l) => (
            <span key={l.label}
              onClick={() => navigate(l.path)}
              style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: 10, color: "#2d333d",
                cursor: "pointer", transition: "color 0.2s",
                letterSpacing: "0.06em",
              }}
              onMouseEnter={e => e.target.style.color = "#c8f060"}
              onMouseLeave={e => e.target.style.color = "#2d333d"}
            >{l.label}</span>
          ))}
        </div>

        <span style={{
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: 10, color: "#2d333d",
        }}>© 2026 TruthChain AI </span>
      </div>
    </footer>
  );
}