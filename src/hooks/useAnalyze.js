import { useState, useCallback } from "react";
import { analyzeClaim } from "../lib/claude";

export function useAnalyze() {
  const [result,  setResult]  = useState(null);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState(null);

  const analyze = useCallback(async (claim) => {
    if (!claim.trim()) return;
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const data = await analyzeClaim(claim.trim());
      setResult(data);
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
  }, []);

  return { result, loading, error, analyze, reset };
}