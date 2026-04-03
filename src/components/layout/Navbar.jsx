import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const LINKS = [
  { label: "How it Works", path: "/research" },
  { label: "Dashboard",    path: "/dashboard" },
  { label: "API Docs",     path: "#" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const navigate  = useNavigate();
  const location  = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isActive = (path) => location.pathname === path;

  return (
    <nav style={{
      position: "sticky", top: 0, zIndex: 100,
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "0 48px", height: 64,
      background: scrolled ? "rgba(5,6,7,0.9)" : "transparent",
      borderBottom: scrolled ? "0.5px solid rgba(255,255,255,0.08)" : "0.5px solid transparent",
      backdropFilter: scrolled ? "blur(20px)" : "none",
      transition: "all 0.4s ease",
    }}>
      {/* LOGO */}
      <div
        onClick={() => navigate("/")}
        style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}
      >
        <div style={{
          width: 28, height: 28, borderRadius: 6,
          background: "linear-gradient(135deg, #c8f060, #5ce4b8)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 11, fontWeight: 700, color: "#050607",
          fontFamily: "'IBM Plex Mono', monospace",
        }}>TC</div>
        <span style={{ fontFamily: "'Syne', sans-serif", fontWeight: 800, fontSize: 18, letterSpacing: "-0.5px" }}>
          <span style={{ color: "#c8f060" }}>Truth</span>
          <span style={{ color: "#eceae2" }}>Chain</span>
          <span style={{
            fontFamily: "'IBM Plex Mono', monospace", fontSize: 9,
            background: "rgba(200,240,96,0.1)", color: "#c8f060",
            padding: "1px 6px", borderRadius: 3, marginLeft: 6,
            letterSpacing: "0.1em", verticalAlign: "middle",
          }}>AI</span>
        </span>
      </div>

      {/* LINKS */}
      <div style={{ display: "flex", gap: 28, alignItems: "center" }}>
        {LINKS.map((item) => (
          <span
            key={item.label}
            onClick={() => item.path !== "#" && navigate(item.path)}
            style={{
              color: isActive(item.path) ? "#c8f060" : "#555d6a",
              fontSize: 13, cursor: "pointer",
              fontFamily: "'IBM Plex Mono', monospace", letterSpacing: "0.03em",
              transition: "color 0.2s",
              borderBottom: isActive(item.path) ? "1px solid #c8f060" : "1px solid transparent",
              paddingBottom: 2,
            }}
            onMouseEnter={e => e.target.style.color = "#eceae2"}
            onMouseLeave={e => e.target.style.color = isActive(item.path) ? "#c8f060" : "#555d6a"}
          >{item.label}</span>
        ))}

        <button
          onClick={() => navigate("/analyze")}
          style={{
            background: "transparent",
            border: "0.5px solid rgba(200,240,96,0.4)",
            color: "#c8f060", borderRadius: 6,
            padding: "7px 18px", fontFamily: "'IBM Plex Mono', monospace",
            fontSize: 11, letterSpacing: "0.06em", cursor: "pointer",
            transition: "all 0.2s",
          }}
          onMouseEnter={e => {
            e.target.style.background = "#c8f060";
            e.target.style.color = "#050607";
          }}
          onMouseLeave={e => {
            e.target.style.background = "transparent";
            e.target.style.color = "#c8f060";
          }}
        >LAUNCH APP →</button>
      </div>
    </nav>
  );
}