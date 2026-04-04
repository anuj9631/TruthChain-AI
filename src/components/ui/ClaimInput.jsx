import { useState } from "react";

const EXAMPLES = [
  "5G towers cause long-term memory loss in people living within 2km.",
  "Leaked documents reveal COVID vaccines contain nano-microchips.",
  "Scientists confirm tap water fluoride reduces IQ by 15 points.",
  "Election machines in 4 swing states were hacked remotely.",
  "New MIT study proves global warming stopped in 2015.",
];

export default function ClaimInput({ onAnalyze, loading }) {
  const [value,  setValue]  = useState("");
  const [mode,   setMode]   = useState("text");
  const [focused, setFocused] = useState(false);

  const handleSubmit = () => {
    if (!value.trim() || loading) return;
    onAnalyze(value);
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) handleSubmit();
  };

  return (
    <div style={{ width: "100%" }}>

      {/* Mode toggle */}
      <div style={{
        display: "flex", gap: 8, marginBottom: 14,
      }}>
        {["text", "url"].map((m) => (
          <button
            key={m}
            onClick={() => { setMode(m); setValue(""); }}
            style={{
              background: mode === m ? "rgba(200,240,96,0.1)" : "transparent",
              border: `0.5px solid ${mode === m ? "rgba(200,240,96,0.35)" : "rgba(255,255,255,0.08)"}`,
              color: mode === m ? "#c8f060" : "#555d6a",
              borderRadius: 6, padding: "5px 14px",
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: 10, letterSpacing: "0.1em",
              cursor: "pointer", transition: "all 0.2s",
              textTransform: "uppercase",
            }}
          >{mode === "text" && m === "text" ? "● Text" : mode === "url" && m === "url" ? "⬡ URL" : m === "text" ? "● Text" : "⬡ URL"}</button>
        ))}
      </div>

      {/* Input */}
      <div style={{
        position: "relative",
        border: `0.5px solid ${focused ? "rgba(200,240,96,0.3)" : "rgba(255,255,255,0.08)"}`,
        borderRadius: 10, overflow: "hidden",
        transition: "border-color 0.25s",
        background: "rgba(13,15,18,0.8)",
        backdropFilter: "blur(12px)",
        boxShadow: focused ? "0 0 0 3px rgba(200,240,96,0.05)" : "none",
      }}>
        <textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onKeyDown={handleKey}
          placeholder={
            mode === "text"
              ? "Paste a headline, tweet, or claim to analyze..."
              : "Paste an article URL to extract and analyze..."
          }
          rows={4}
          style={{
            width: "100%", background: "transparent",
            border: "none", outline: "none", resize: "none",
            color: "#eceae2", fontFamily: "'Instrument Sans', sans-serif",
            fontSize: 15, lineHeight: 1.7,
            padding: "18px 20px 14px",
          }}
        />

        {/* Bottom bar */}
        <div style={{
          display: "flex", alignItems: "center",
          justifyContent: "space-between",
          padding: "10px 16px",
          borderTop: "0.5px solid rgba(255,255,255,0.05)",
        }}>
          <span style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: 10, color: "#333a44",
          }}>
            {value.length} chars · Ctrl+Enter to analyze
          </span>

          <button
            onClick={handleSubmit}
            disabled={!value.trim() || loading}
            style={{
              background: value.trim() && !loading
                ? "linear-gradient(135deg, #c8f060, #a8e040)"
                : "rgba(255,255,255,0.05)",
              color: value.trim() && !loading ? "#050607" : "#333a44",
              border: "none", borderRadius: 6,
              padding: "8px 22px",
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: 11, letterSpacing: "0.06em",
              cursor: value.trim() && !loading ? "pointer" : "not-allowed",
              transition: "all 0.25s cubic-bezier(0.16,1,0.3,1)",
              fontWeight: 500,
            }}
            onMouseEnter={e => {
              if (value.trim() && !loading) {
                e.target.style.transform = "scale(1.04)";
                e.target.style.boxShadow = "0 6px 24px rgba(200,240,96,0.25)";
              }
            }}
            onMouseLeave={e => {
              e.target.style.transform = "scale(1)";
              e.target.style.boxShadow = "none";
            }}
          >
            {loading ? "ANALYZING..." : "ANALYZE →"}
          </button>
        </div>
      </div>

      {/* Example claims */}
      <div style={{ marginTop: 14 }}>
        <div style={{
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: 9, color: "#333a44",
          letterSpacing: "0.12em", marginBottom: 8,
        }}>TRY AN EXAMPLE</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {EXAMPLES.map((ex, i) => (
            <button
              key={i}
              onClick={() => setValue(ex)}
              style={{
                background: "rgba(255,255,255,0.02)",
                border: "0.5px solid rgba(255,255,255,0.07)",
                borderRadius: 20, color: "#555d6a",
                padding: "4px 12px", fontSize: 11,
                fontFamily: "'Instrument Sans', sans-serif",
                cursor: "pointer", transition: "all 0.2s",
                maxWidth: 240, overflow: "hidden",
                textOverflow: "ellipsis", whiteSpace: "nowrap",
              }}
              onMouseEnter={e => {
                e.target.style.color = "#eceae2";
                e.target.style.borderColor = "rgba(255,255,255,0.15)";
              }}
              onMouseLeave={e => {
                e.target.style.color = "#555d6a";
                e.target.style.borderColor = "rgba(255,255,255,0.07)";
              }}
            >{ex}</button>
          ))}
        </div>
      </div>
    </div>
  );
}