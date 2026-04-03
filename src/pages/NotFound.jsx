import { useNavigate } from "react-router-dom";
import { useEffect, useRef } from "react";
import ParticleField from "../components/three/ParticleField";
import Navbar from "../components/layout/Navbar";

export default function NotFound() {
  const navigate = useNavigate();
  const textRef  = useRef(null);

  useEffect(() => {
    let frame;
    const glitch = () => {
      if (!textRef.current) return;
      const r = Math.random();
      if (r < 0.04) {
        textRef.current.style.transform = `translate(${(Math.random()-0.5)*8}px, ${(Math.random()-0.5)*4}px)`;
        textRef.current.style.textShadow = `${Math.random()*10-5}px 0 #ff6b6b, ${Math.random()*-10+5}px 0 #5ce4b8`;
        setTimeout(() => {
          if (textRef.current) {
            textRef.current.style.transform = "translate(0,0)";
            textRef.current.style.textShadow = "none";
          }
        }, 80);
      }
      frame = requestAnimationFrame(glitch);
    };
    frame = requestAnimationFrame(glitch);
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <div style={{ position: "relative", minHeight: "100vh", background: "#050607" }}>
      <ParticleField />
      <Navbar />

      <div style={{
        position: "relative", zIndex: 10,
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        minHeight: "80vh", textAlign: "center", padding: "0 24px",
      }}>
        <div style={{
          fontFamily: "'IBM Plex Mono', monospace", fontSize: 10,
          color: "#ff6b6b", letterSpacing: "0.2em", marginBottom: 24,
          opacity: 0.7,
        }}>ERROR 404 — CLAIM NOT FOUND IN DATABASE</div>

        <div ref={textRef} style={{
          fontFamily: "'Syne', sans-serif", fontWeight: 800,
          fontSize: "clamp(100px, 18vw, 200px)",
          letterSpacing: "-6px", lineHeight: 1,
          background: "linear-gradient(135deg, #1a1d22 0%, #2a2d34 100%)",
          WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          marginBottom: 24, userSelect: "none",
          transition: "transform 0.05s, text-shadow 0.05s",
        }}>404</div>

        <h2 style={{
          fontFamily: "'Syne', sans-serif", fontWeight: 700,
          fontSize: "clamp(20px, 3vw, 32px)", letterSpacing: "-0.8px",
          color: "#eceae2", marginBottom: 14,
        }}>This page doesn't exist</h2>

        <p style={{
          fontSize: 15, color: "#555d6a", marginBottom: 44,
          maxWidth: 400, lineHeight: 1.7,
        }}>
          The claim you're looking for was either removed,
          never analyzed, or lost in the noise.
        </p>

        <button
          onClick={() => navigate("/")}
          style={{
            background: "linear-gradient(135deg, #c8f060, #a8e040)",
            color: "#050607", border: "none", borderRadius: 8,
            padding: "13px 32px", fontFamily: "'Syne', sans-serif",
            fontWeight: 700, fontSize: 15, cursor: "pointer",
            transition: "all 0.25s cubic-bezier(0.16,1,0.3,1)",
          }}
          onMouseEnter={e => {
            e.target.style.transform = "translateY(-3px)";
            e.target.style.boxShadow = "0 12px 40px rgba(200,240,96,0.25)";
          }}
          onMouseLeave={e => {
            e.target.style.transform = "translateY(0)";
            e.target.style.boxShadow = "none";
          }}
        >← Return to Home</button>
      </div>
    </div>
  );
}