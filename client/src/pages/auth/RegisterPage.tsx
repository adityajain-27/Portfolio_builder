import { FormEvent, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowRight, Loader2, AlertCircle } from "lucide-react";
import { AuthShell } from "./AuthShell";
import { AuthInput } from "@/components/wizard/AuthInput";
import { Button } from "@/components/ui/Button";
import { api, apiErrorMessage } from "@/lib/api";
import { useAuthStore } from "@/store/authStore";

export function RegisterPage() {
  const [fullName, setFullName] = useState("");
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
      await api.post("/auth/register", { full_name: fullName, email, password });
      // Register doesn't return a token, so log in right after to get one seamlessly.
      const loginRes = await api.post("/auth/login", { email, password });
      login(loginRes.data.access_token, { email, full_name: fullName });
      navigate("/dashboard");
    } catch (err) {
      setError(apiErrorMessage(err, "Couldn't create the account"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell title="Create your account" subtitle="Your resumes get saved here — edit them anytime.">
      <form onSubmit={handleSubmit} className="space-y-4">
        <AuthInput label="Full name" required value={fullName} onChange={(e) => setFullName(e.target.value)} />
        <AuthInput label="Email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
        <AuthInput
          label="Password"
          type="password"
          required
          minLength={6}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <p className="text-[11px] text-slate/60">At least 6 characters.</p>
        {error && (
          <div className="flex items-center gap-1.5 text-xs text-danger">
            <AlertCircle size={13} /> {error}
          </div>
        )}
        <Button type="submit" disabled={loading} className="w-full" size="md">
          {loading ? <Loader2 size={15} className="animate-spin" /> : <>Create account <ArrowRight size={15} /></>}
        </Button>
      </form>
      <p className="mt-6 text-center text-sm text-slate">
        Already have an account?{" "}
        <Link to="/auth" className="text-cobalt-soft hover:underline">
          Sign in
        </Link>
      </p>
    </AuthShell>
  );
}