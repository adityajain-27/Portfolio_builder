import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthUser {
  email: string;
  full_name: string;
}

interface AuthState {
  token: string | null;
  user: AuthUser | null;
  login: (token: string, user: AuthUser) => void;
  setUser: (user: AuthUser) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      login: (token, user) => set({ token, user }),
      // Called once /users/me resolves, to swap the placeholder name/email
      // (guessed at login time) for the real record from the DB.
      setUser: (user) => set({ user }),
      logout: () => set({ token: null, user: null }),
    }),
    { name: "studio-auth" }
  )
);