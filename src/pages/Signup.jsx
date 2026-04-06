import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import ParticleField from "../components/three/ParticleField";

export default function Signup() {
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [confirm,  setConfirm]  = useState("");
  const [error,    setError]    = useState("");
  const [success,  setSuccess]  = useState(false);
  const [loading,  setLoading]  = useState(false);
  const { signUp }  = useAuth();
  const navigate    = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await signUp(email, password);
      setSuccess(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
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
          textAlign: "center", maxWidth: 420,
        }}>
          <div style={{
            width: 64, height: 64, borderRadius: "50%",
            background: "rgba(200,240,96,0.1)",
            border: "0.5px solid rgba(200,240,96,0.3)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 28, color: "#c8f060",
            margin: "0 auto 24px",
          }}>✓</div>
          <h2 style={{
            fontFamily: "'Syne', sans-serif", fontWeight: 800,
            fontSize: 28, letterSpacing: "-0.8px",
            color: "#eceae2", marginBottom: 12,
          }}>Check your email</h2>
          <p style={{
            fontSize: 14, color: "#555d6a",
            lineHeight: 1.7, marginBottom: 32,
          }}>
            We sent a confirmation link to <strong style={{ color: "#eceae2" }}>{email}</strong>.
            Click it to activate your account then sign in.
          </p>
          <button
            onClick={() => navigate("/login")}
            style={{
              background: "linear-gradient(135deg, #c8f060, #a8e040)",
              color: "#050607", border: "none", borderRadius: 8,
              padding: "12px 32px", fontFamily: "'Syne', sans-serif",
              fontWeight: 700, fontSize: 15, cursor: "pointer",
            }}
          >Go to Sign In →</button>
        </div>
      </div>
    );
  }

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
        }}>
          <div style={{ marginBottom: 32 }}>
            <div style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: 10, color: "#c8f060",
              letterSpacing: "0.2em", marginBottom: 10, opacity: 0.8,
            }}>FREE ACCOUNT</div>
            <h1 style={{
              fontFamily: "'Syne', sans-serif", fontWeight: 800,
              fontSize: 28, letterSpacing: "-0.8px",
              background: "linear-gradient(135deg, #eceae2, rgba(236,234,226,0.6))",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            }}>Create your account</h1>
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
                  fontSize: 14, outline: "none", transition: "border-color 0.2s",
                  boxSizing: "border-box",
                }}
                onFocus={e => e.target.style.borderColor = "rgba(200,240,96,0.4)"}
                onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.1)"}
              />
            </div>

            {/* Password */}
            <div style={{ marginBottom: 16 }}>
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
                placeholder="Min 6 characters"
                style={{
                  width: "100%", background: "rgba(255,255,255,0.03)",
                  border: "0.5px solid rgba(255,255,255,0.1)",
                  borderRadius: 8, padding: "12px 16px",
                  color: "#eceae2", fontFamily: "'Instrument Sans', sans-serif",
                  fontSize: 14, outline: "none", transition: "border-color 0.2s",
                  boxSizing: "border-box",
                }}
                onFocus={e => e.target.style.borderColor = "rgba(200,240,96,0.4)"}
                onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.1)"}
              />
            </div>

            {/* Confirm */}
            <div style={{ marginBottom: 24 }}>
              <label style={{
                display: "block",
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: 10, color: "#404752",
                letterSpacing: "0.12em", marginBottom: 8,
              }}>CONFIRM PASSWORD</label>
              <input
                type="password"
                value={confirm}
                onChange={e => setConfirm(e.target.value)}
                placeholder="••••••••"
                style={{
                  width: "100%", background: "rgba(255,255,255,0.03)",
                  border: "0.5px solid rgba(255,255,255,0.1)",
                  borderRadius: 8, padding: "12px 16px",
                  color: "#eceae2", fontFamily: "'Instrument Sans', sans-serif",
                  fontSize: 14, outline: "none", transition: "border-color 0.2s",
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
              disabled={loading || !email || !password || !confirm}
              style={{
                width: "100%",
                background: loading || !email || !password || !confirm
                  ? "rgba(255,255,255,0.05)"
                  : "linear-gradient(135deg, #c8f060, #a8e040)",
                color: loading || !email || !password || !confirm
                  ? "#333a44" : "#050607",
                border: "none", borderRadius: 8,
                padding: "13px", fontFamily: "'Syne', sans-serif",
                fontWeight: 700, fontSize: 15,
                cursor: loading || !email || !password || !confirm
                  ? "not-allowed" : "pointer",
                transition: "all 0.25s", letterSpacing: "-0.2px",
              }}
              onMouseEnter={e => {
                if (!loading && email && password && confirm) {
                  e.target.style.transform = "translateY(-2px)";
                  e.target.style.boxShadow = "0 8px 30px rgba(200,240,96,0.2)";
                }
              }}
              onMouseLeave={e => {
                e.target.style.transform = "translateY(0)";
                e.target.style.boxShadow = "none";
              }}
            >
              {loading ? "Creating account..." : "Create Account →"}
            </button>
          </form>

          {/* Footer */}
          <div style={{
            textAlign: "center", marginTop: 28,
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: 11, color: "#333a44",
          }}>
            Already have an account?{" "}
            <span
              onClick={() => navigate("/login")}
              style={{ color: "#c8f060", cursor: "pointer" }}
            >Sign in</span>
          </div>
        </div>

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