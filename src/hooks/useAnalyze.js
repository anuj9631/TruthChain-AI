import { useState, useCallback } from "react";
import { analyzeClaim } from "../lib/claude";
import { saveClaim }    from "./useClaims";

export function useAnalyze() {
  const [result,  setResult]  = useState(null);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState(null);
  const [saved,   setSaved]   = useState(false);

  const analyze = useCallback(async (claim) => {
    if (!claim.trim()) return;
    setLoading(true);
    setError(null);
    setResult(null);
    setSaved(false);

    try {
      /* Step 1 — Analyze with Groq */
      const data = await analyzeClaim(claim.trim());
      setResult(data);

      /* Step 2 — Save to Supabase */
      const saved = await saveClaim(claim.trim(), data);
      if (saved) setSaved(true);

    } catch (e) {
      setError(e.message || "Something went wrong. Check your API key.");
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setResult(null);
    setError(null);
    setLoading(false);
    setSaved(false);
  }, []);

  return { result, loading, error, saved, analyze, reset };
}