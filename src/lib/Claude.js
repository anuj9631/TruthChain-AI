const API_KEY = import.meta.env.VITE_ANTHROPIC_API_KEY;

export async function analyzeClaim(claim) {
  if (!API_KEY) throw new Error("Missing VITE_ANTHROPIC_API_KEY in .env");

  const prompt = `You are TruthChain AI, an expert misinformation early-warning system.

Analyze this claim: "${claim}"

Respond ONLY with a single valid JSON object. No markdown, no extra text, no backticks. Use this exact schema:

{
  "risk_score": <integer 0-100>,
  "risk_level": "<HIGH | MODERATE | LOW>",
  "metrics": [
    {"name": "Emotional Manipulation", "value": <0-100>},
    {"name": "Source Credibility",     "value": <0-100>},
    {"name": "Viral Velocity Risk",    "value": <0-100>},
    {"name": "Fact-Check Difficulty",  "value": <0-100>}
  ],
  "spread_stages": [
    {"step": "01", "platform": "<platform name>", "desc": "<how it spreads here in 1-2 sentences>"},
    {"step": "02", "platform": "<platform name>", "desc": "<description>"},
    {"step": "03", "platform": "<platform name>", "desc": "<description>"}
  ],
  "verdict": "<2-3 sentence plain language verdict on this claim's danger>",
  "tags": ["<4-6 short signal tags like: fear-based, no-citation, identity-threat, high-shareability>"],
  "analysis": "<3-4 sentence deeper analysis: psychological and social patterns, why this spreads, what would slow it down>"
}`;

  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": API_KEY,
      "anthropic-version": "2023-06-01",
      "anthropic-dangerous-direct-browser-access": "true",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      messages: [{ role: "user", content: prompt }],
    }),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err?.error?.message || "API request failed");
  }

  const data = await res.json();
  const text = data.content.map((b) => b.text || "").join("");

  try {
    return JSON.parse(text);
  } catch {
    const match = text.match(/\{[\s\S]*\}/);
    if (match) return JSON.parse(match[0]);
    throw new Error("Could not parse Claude response as JSON");
  }
}