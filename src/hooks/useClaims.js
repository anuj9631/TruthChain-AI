import { useState, useEffect, useCallback } from "react";
import { supabase } from "../lib/supabase";

/* ── Save a new claim result ── */
export async function saveClaim(claim, result) {
  const { data, error } = await supabase
    .from("claims")
    .insert([{
      claim,
      risk_score:    result.risk_score,
      risk_level:    result.risk_level,
      metrics:       result.metrics,
      spread_stages: result.spread_stages,
      verdict:       result.verdict,
      tags:          result.tags,
      analysis:      result.analysis,
    }])
    .select()
    .single();

  if (error) {
    console.error("Supabase save error:", error.message);
    return null;
  }
  return data;
}

/* ── Fetch all claims ── */
export function useClaims({ filter = "ALL", limit = 50 } = {}) {
  const [claims,  setClaims]  = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  const fetchClaims = useCallback(async () => {
    setLoading(true);
    setError(null);

    let query = supabase
      .from("claims")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(limit);

    if (filter !== "ALL") {
      query = query.eq("risk_level", filter);
    }

    const { data, error: err } = await query;

    if (err) {
      setError(err.message);
      setLoading(false);
      return;
    }

    setClaims(data || []);
    setLoading(false);
  }, [filter, limit]);

  useEffect(() => {
    fetchClaims();
  }, [fetchClaims]);

  /* Real-time subscription */
  useEffect(() => {
    const channel = supabase
      .channel("claims-changes")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "claims" },
        (payload) => {
          setClaims((prev) => [payload.new, ...prev].slice(0, limit));
        }
      )
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, [limit]);

  return { claims, loading, error, refetch: fetchClaims };
}

/* ── Fetch dashboard stats ── */
export function useDashboardStats() {
  const [stats,   setStats]   = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      const { data, error } = await supabase
        .from("claims")
        .select("risk_level, risk_score, created_at");

      if (error || !data) { setLoading(false); return; }

      const high     = data.filter(c => c.risk_level === "HIGH").length;
      const moderate = data.filter(c => c.risk_level === "MODERATE").length;
      const low      = data.filter(c => c.risk_level === "LOW").length;
      const total    = data.length;
      const avgScore = total > 0
        ? Math.round(data.reduce((s, c) => s + c.risk_score, 0) / total)
        : 0;

      setStats({ total, high, moderate, low, avgScore });
      setLoading(false);
    }
    fetchStats();
  }, []);

  return { stats, loading };
}