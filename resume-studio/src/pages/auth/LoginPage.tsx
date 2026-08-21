import { FormEvent, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowRight, Loader2, AlertCircle } from "lucide-react";
import { AuthShell } from "./AuthShell";
import { AuthInput } from "@/components/wizard/AuthInput";
import { Button } from "@/components/ui/Button";
import { api, apiErrorMessage } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";

export function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await api.post("/auth/login", { email, password });
      // Login only returns a token — pull the display name from what the user typed
      // for now; the dashboard will refresh it once a /users/me endpoint is wired.
      login(res.data.access_token, { email, full_name: email.split("@")[0] });
      navigate("/dashboard");
    } catch (err) {
      setError(apiErrorMessage(err, "Incorrect email or password"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell title="Welcome back" subtitle="Sign in to see your saved resumes.">
      <form onSubmit={handleSubmit} className="space-y-4">
        <AuthInput label="Email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
        <AuthInput
          label="Password"
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && (
          <div className="flex items-center gap-1.5 text-xs text-danger">
            <AlertCircle size={13} /> {error}
          </div>
        )}
        <Button type="submit" disabled={loading} className="w-full" size="md">
          {loading ? <Loader2 size={15} className="animate-spin" /> : <>Sign in <ArrowRight size={15} /></>}
        </Button>
      </form>
      <p className="mt-6 text-center text-sm text-slate">
        New here?{" "}
        <Link to="/auth/register" className="text-cobalt-soft hover:underline">
          Create an account
        </Link>
      </p>
    </AuthShell>
  );
}