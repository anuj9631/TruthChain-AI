import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import ParticleField from "../components/three/ParticleField";

export default function Analyze() {
  return (
    <div style={{ position: "relative", minHeight: "100vh", background: "#050607" }}>
      <ParticleField />
      <Navbar />
      <div style={{
        position: "relative", zIndex: 10,
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        minHeight: "80vh", textAlign: "center",
      }}>
        <div style={{
          fontFamily: "'IBM Plex Mono', monospace", fontSize: 10,
          color: "#c8f060", letterSpacing: "0.2em", marginBottom: 16,
        }}>PHASE 2 — COMING NEXT</div>
        <h1 style={{
          fontFamily: "'Syne', sans-serif", fontWeight: 800,
          fontSize: "clamp(32px, 5vw, 60px)", letterSpacing: "-1.5px",
          background: "linear-gradient(135deg, #eceae2, rgba(236,234,226,0.5))",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
        }}>Analyze Page</h1>
        <p style={{ color: "#555d6a", marginTop: 16, fontSize: 15 }}>
          Claude API integration coming in Phase 2.
        </p>
      </div>
      <Footer />
    </div>
  );
}