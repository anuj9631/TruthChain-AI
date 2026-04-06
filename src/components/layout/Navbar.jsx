import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

const LINKS = [
  { label: "How it Works", path: "/research"  },
  { label: "Dashboard",    path: "/dashboard" },
  { label: "API Docs",     path: "#"          },
];

export default function Navbar() {
  const [scrolled,  setScrolled]  = useState(false);
  const [menuOpen,  setMenuOpen]  = useState(false);
  const navigate  = useNavigate();
  const location  = useLocation();
  const { user, signOut } = useAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isActive = (path) => location.pathname === path;

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <nav style={{
      position: "sticky", top: 0, zIndex: 100,
      display: "flex", alignItems: "center",
      justifyContent: "space-between",
      padding: "0 48px", height: 64,
      background: scrolled ? "rgba(5,6,7,0.9)" : "transparent",
      borderBottom: scrolled
        ? "0.5px solid rgba(255,255,255,0.08)"
        : "0.5px solid transparent",
      backdropFilter: scrolled ? "blur(20px)" : "none",
      transition: "all 0.4s ease",
    }}>

      {/* Logo */}
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
        <span style={{
          fontFamily: "'Syne', sans-serif",
          fontWeight: 800, fontSize: 18, letterSpacing: "-0.5px",
        }}>
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

      {/* Links */}
      <div style={{ display: "flex", gap: 28, alignItems: "center" }}>
        {LINKS.map((item) => (
          <span
            key={item.label}
            onClick={() => item.path !== "#" && navigate(item.path)}
            style={{
              color: isActive(item.path) ? "#c8f060" : "#555d6a",
              fontSize: 13, cursor: "pointer",
              fontFamily: "'IBM Plex Mono', monospace",
              letterSpacing: "0.03em", transition: "color 0.2s",
              borderBottom: isActive(item.path)
                ? "1px solid #c8f060" : "1px solid transparent",
              paddingBottom: 2,
            }}
            onMouseEnter={e => e.target.style.color = "#eceae2"}
            onMouseLeave={e => e.target.style.color = isActive(item.path) ? "#c8f060" : "#555d6a"}
          >{item.label}</span>
        ))}

        {/* Auth section */}
        {user ? (
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div
              style={{
                width: 32, height: 32, borderRadius: "50%",
                background: "linear-gradient(135deg, rgba(200,240,96,0.2), rgba(92,228,184,0.2))",
                border: "0.5px solid rgba(200,240,96,0.3)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: 11, color: "#c8f060", cursor: "pointer",
                position: "relative",
              }}
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {user.email?.[0]?.toUpperCase() ?? "U"}

              {menuOpen && (
                <div style={{
                  position: "absolute", top: "calc(100% + 8px)", right: 0,
                  background: "#0c0e11",
                  border: "0.5px solid rgba(255,255,255,0.1)",
                  borderRadius: 10, padding: "8px",
                  minWidth: 200, zIndex: 200,
                }}>
                  <div style={{
                    fontFamily: "'IBM Plex Mono', monospace",
                    fontSize: 10, color: "#404752",
                    padding: "8px 12px", marginBottom: 4,
                    borderBottom: "0.5px solid rgba(255,255,255,0.06)",
                    letterSpacing: "0.06em",
                    whiteSpace: "nowrap", overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}>{user.email}</div>

                  {[
                    { label: "Analyze Claim", path: "/analyze"   },
                    { label: "Dashboard",     path: "/dashboard" },
                  ].map(item => (
                    <div
                      key={item.label}
                      onClick={() => { navigate(item.path); setMenuOpen(false); }}
                      style={{
                        padding: "9px 12px", borderRadius: 6,
                        fontSize: 13, color: "#8a929e", cursor: "pointer",
                        transition: "all 0.15s",
                        fontFamily: "'Instrument Sans', sans-serif",
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.background = "rgba(255,255,255,0.04)";
                        e.currentTarget.style.color = "#eceae2";
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.background = "transparent";
                        e.currentTarget.style.color = "#8a929e";
                      }}
                    >{item.label}</div>
                  ))}

                  <div style={{
                    borderTop: "0.5px solid rgba(255,255,255,0.06)",
                    marginTop: 4, paddingTop: 4,
                  }}>
                    <div
                      onClick={handleSignOut}
                      style={{
                        padding: "9px 12px", borderRadius: 6,
                        fontSize: 13, color: "#ff6b6b", cursor: "pointer",
                        transition: "all 0.15s",
                        fontFamily: "'Instrument Sans', sans-serif",
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = "rgba(255,107,107,0.08)"}
                      onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                    >Sign Out</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <button
              onClick={() => navigate("/login")}
              style={{
                background: "transparent",
                border: "0.5px solid rgba(255,255,255,0.12)",
                color: "#8a929e", borderRadius: 6, padding: "7px 16px",
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: 11, letterSpacing: "0.06em",
                cursor: "pointer", transition: "all 0.2s",
              }}
              onMouseEnter={e => {
                e.target.style.color = "#eceae2";
                e.target.style.borderColor = "rgba(255,255,255,0.25)";
              }}
              onMouseLeave={e => {
                e.target.style.color = "#8a929e";
                e.target.style.borderColor = "rgba(255,255,255,0.12)";
              }}
            >SIGN IN</button>

            <button
              onClick={() => navigate("/analyze")}
              style={{
                background: "transparent",
                border: "0.5px solid rgba(200,240,96,0.4)",
                color: "#c8f060", borderRadius: 6, padding: "7px 18px",
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: 11, letterSpacing: "0.06em",
                cursor: "pointer", transition: "all 0.2s",
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
        )}
      </div>
    </nav>
  );
}