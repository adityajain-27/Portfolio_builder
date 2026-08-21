import { useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { api } from "@/lib/api";

export function RequireAuth() {
  const token = useAuthStore((s) => s.token);
  const setUser = useAuthStore((s) => s.setUser);

  useEffect(() => {
    if (!token) return;
    // Login/register only guess the display name client-side — sync the real
    // record from the DB once we land on an authenticated route.
    api
      .get("/users/me")
      .then((res) => setUser({ email: res.data.email, full_name: res.data.full_name }))
      .catch(() => {
        // Non-fatal: if this fails (e.g. transient network issue) the
        // interceptor already handles a real 401 by logging out.
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  if (!token) return <Navigate to="/auth" replace />;
  return <Outlet />;
}
