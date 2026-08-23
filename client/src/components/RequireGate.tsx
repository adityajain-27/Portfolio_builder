import { useEffect } from "react";
import { Navigate, Outlet, useSearchParams } from "react-router-dom";
import { useGateStore } from "@/store/gateStore";

// A gate_token in the URL means we arrived from the portfolio site's own
// lock icon (different origin, so localStorage can't carry the token here).
// Consume it once, store it, then strip it from the URL.
export function RequireGate() {
  const [searchParams, setSearchParams] = useSearchParams();
  const setGate = useGateStore((s) => s.setGate);
  const unlocked = useGateStore((s) => s.isUnlocked());
  const incomingToken = searchParams.get("gate_token");

  useEffect(() => {
    if (incomingToken) {
      setGate(incomingToken);
      searchParams.delete("gate_token");
      setSearchParams(searchParams, { replace: true });
    }
  }, [incomingToken, searchParams, setSearchParams, setGate]);

  if (!unlocked && !incomingToken) return <Navigate to="/" replace />;
  return <Outlet />;
}