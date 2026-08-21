import { create } from "zustand";
import { persist } from "zustand/middleware";

interface GateState {
  gateToken: string | null;
  unlockedAt: number | null;
  setGate: (token: string) => void;
  clearGate: () => void;
  isUnlocked: () => boolean;
}

// Gate token lives for 120 min server-side (STUDIO_GATE_TOKEN_EXPIRE_MINUTES).
// We mirror that client-side so the lock re-engages without waiting on a 401.
const GATE_TTL_MS = 120 * 60 * 1000;

export const useGateStore = create<GateState>()(
  persist(
    (set, get) => ({
      gateToken: null,
      unlockedAt: null,
      setGate: (token) => set({ gateToken: token, unlockedAt: Date.now() }),
      clearGate: () => set({ gateToken: null, unlockedAt: null }),
      isUnlocked: () => {
        const { gateToken, unlockedAt } = get();
        if (!gateToken || !unlockedAt) return false;
        return Date.now() - unlockedAt < GATE_TTL_MS;
      },
    }),
    { name: "studio-gate" }
  )
);