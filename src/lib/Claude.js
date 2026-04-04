const API_KEY = import.meta.env.VITE_GROQ_API_KEY;
const API_URL = "https://api.groq.com/openai/v1/chat/completions";
const MODEL   = "llama-3.3-70b-versatile";

export async function analyzeClaim(claim) {
  if (!API_KEY) throw new Error("Missing VITE_GROQ_API_KEY in .env");

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

  const res = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${API_KEY}`,
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 1000,
      temperature: 0.4,
      messages: [
        {
          role: "system",
          content: "You are TruthChain AI. You always respond with valid JSON only. No markdown, no explanation, no backticks. Just raw JSON.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
    }),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err?.error?.message || "Groq API request failed");
  }

  const data = await res.json();
  const text = data.choices?.[0]?.message?.content || "";

  try {
    return JSON.parse(text);
  } catch {
    const match = text.match(/\{[\s\S]*\}/);
    if (match) return JSON.parse(match[0]);
    throw new Error("Could not parse response as JSON");
  }
}