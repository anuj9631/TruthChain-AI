import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import ParticleField from "../components/three/ParticleField";

export default function Research() {
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
          color: "#ffb74d", letterSpacing: "0.2em", marginBottom: 16,
        }}>PHASE 6 — COMING SOON</div>
        <h1 style={{
          fontFamily: "'Syne', sans-serif", fontWeight: 800,
          fontSize: "clamp(32px, 5vw, 60px)", letterSpacing: "-1.5px",
          background: "linear-gradient(135deg, #eceae2, rgba(236,234,226,0.5))",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
        }}>Research</h1>
        <p style={{ color: "#555d6a", marginTop: 16, fontSize: 15 }}>
          Methodology and research paper coming in Phase 6.
        </p>
      </div>
      <Footer />
    </div>
  );
}