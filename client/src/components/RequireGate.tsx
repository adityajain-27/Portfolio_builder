import { Navigate, Outlet } from "react-router-dom";
import { useGateStore } from "@/store/gateStore";

export function RequireGate() {
  const unlocked = useGateStore((s) => s.isUnlocked());
  if (!unlocked) return <Navigate to="/" replace />;
  return <Outlet />;
}