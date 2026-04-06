import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import ParticleField from "../components/three/ParticleField";

export default function Login() {
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [error,    setError]    = useState("");
  const [loading,  setLoading]  = useState(false);
  const { signIn }  = useAuth();
  const navigate    = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return;
    setLoading(true);
    setError("");
    try {
      await signIn(email, password);
      navigate("/analyze");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: "relative", minHeight: "100vh",
      background: "#050607", display: "flex",
      alignItems: "center", justifyContent: "center",
      padding: "24px",
    }}>
      <ParticleField />

      <div style={{
        position: "relative", zIndex: 10,
        width: "100%", maxWidth: 420,
      }}>

        {/* Logo */}
        <div
          onClick={() => navigate("/")}
          style={{
            display: "flex", alignItems: "center",
            gap: 10, marginBottom: 48, cursor: "pointer",
            justifyContent: "center",
          }}
        >
          <div style={{
            width: 32, height: 32, borderRadius: 8,
            background: "linear-gradient(135deg, #c8f060, #5ce4b8)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 13, fontWeight: 700, color: "#050607",
            fontFamily: "'IBM Plex Mono', monospace",
          }}>TC</div>
          <span style={{
            fontFamily: "'Syne', sans-serif", fontWeight: 800,
            fontSize: 22, letterSpacing: "-0.5px",
          }}>
            <span style={{ color: "#c8f060" }}>Truth</span>
            <span style={{ color: "#eceae2" }}>Chain</span>
          </span>
        </div>

        {/* Card */}
        <div style={{
          background: "rgba(10,12,15,0.9)",
          border: "0.5px solid rgba(255,255,255,0.08)",
          borderRadius: 16, padding: "40px 36px",
          backdropFilter: "blur(20px)",
          boxShadow: "0 0 80px rgba(200,240,96,0.03)",
        }}>
          <div style={{ marginBottom: 32 }}>
            <div style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: 10, color: "#c8f060",
              letterSpacing: "0.2em", marginBottom: 10, opacity: 0.8,
            }}>WELCOME BACK</div>
            <h1 style={{
              fontFamily: "'Syne', sans-serif", fontWeight: 800,
              fontSize: 28, letterSpacing: "-0.8px",
              background: "linear-gradient(135deg, #eceae2, rgba(236,234,226,0.6))",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            }}>Sign in to TruthChain</h1>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Email */}
            <div style={{ marginBottom: 16 }}>
              <label style={{
                display: "block",
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: 10, color: "#404752",
                letterSpacing: "0.12em", marginBottom: 8,
              }}>EMAIL</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                style={{
                  width: "100%", background: "rgba(255,255,255,0.03)",
                  border: "0.5px solid rgba(255,255,255,0.1)",
                  borderRadius: 8, padding: "12px 16px",
                  color: "#eceae2", fontFamily: "'Instrument Sans', sans-serif",
                  fontSize: 14, outline: "none",
                  transition: "border-color 0.2s",
                  boxSizing: "border-box",
                }}
                onFocus={e => e.target.style.borderColor = "rgba(200,240,96,0.4)"}
                onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.1)"}
              />
            </div>

            {/* Password */}
            <div style={{ marginBottom: 24 }}>
              <label style={{
                display: "block",
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: 10, color: "#404752",
                letterSpacing: "0.12em", marginBottom: 8,
              }}>PASSWORD</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                style={{
                  width: "100%", background: "rgba(255,255,255,0.03)",
                  border: "0.5px solid rgba(255,255,255,0.1)",
                  borderRadius: 8, padding: "12px 16px",
                  color: "#eceae2", fontFamily: "'Instrument Sans', sans-serif",
                  fontSize: 14, outline: "none",
                  transition: "border-color 0.2s",
                  boxSizing: "border-box",
                }}
                onFocus={e => e.target.style.borderColor = "rgba(200,240,96,0.4)"}
                onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.1)"}
              />
            </div>

            {/* Error */}
            {error && (
              <div style={{
                background: "rgba(255,107,107,0.06)",
                border: "0.5px solid rgba(255,107,107,0.2)",
                borderRadius: 8, padding: "10px 14px",
                marginBottom: 20,
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: 11, color: "#ff6b6b",
              }}>{error}</div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading || !email || !password}
              style={{
                width: "100%",
                background: loading || !email || !password
                  ? "rgba(255,255,255,0.05)"
                  : "linear-gradient(135deg, #c8f060, #a8e040)",
                color: loading || !email || !password ? "#333a44" : "#050607",
                border: "none", borderRadius: 8,
                padding: "13px", fontFamily: "'Syne', sans-serif",
                fontWeight: 700, fontSize: 15,
                cursor: loading || !email || !password ? "not-allowed" : "pointer",
                transition: "all 0.25s",
                letterSpacing: "-0.2px",
              }}
              onMouseEnter={e => {
                if (!loading && email && password) {
                  e.target.style.transform = "translateY(-2px)";
                  e.target.style.boxShadow = "0 8px 30px rgba(200,240,96,0.2)";
                }
              }}
              onMouseLeave={e => {
                e.target.style.transform = "translateY(0)";
                e.target.style.boxShadow = "none";
              }}
            >
              {loading ? "Signing in..." : "Sign In →"}
            </button>
          </form>

          {/* Footer */}
          <div style={{
            textAlign: "center", marginTop: 28,
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: 11, color: "#333a44",
          }}>
            Don't have an account?{" "}
            <span
              onClick={() => navigate("/signup")}
              style={{ color: "#c8f060", cursor: "pointer" }}
            >Sign up free</span>
          </div>
        </div>

        {/* Back to home */}
        <div
          onClick={() => navigate("/")}
          style={{
            textAlign: "center", marginTop: 20,
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: 10, color: "#2a2e36",
            cursor: "pointer", letterSpacing: "0.08em",
            transition: "color 0.2s",
          }}
          onMouseEnter={e => e.target.style.color = "#555d6a"}
          onMouseLeave={e => e.target.style.color = "#2a2e36"}
        >← BACK TO HOME</div>
      </div>
    </div>
  );
}