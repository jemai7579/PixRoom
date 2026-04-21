import { useState } from "react";
import { ArrowRight, LockKeyhole, Mail } from "lucide-react";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { AuthExperienceShell } from "../../components/AuthExperienceShell";
import { StatusBanner } from "../../components/StatusBanner";
import { useAuth } from "../../hooks/useAuth";
import { getPostAuthRoute } from "../../lib/auth";

const inputClassName =
  "w-full rounded-[20px] border border-slate-200 bg-slate-50/80 px-4 py-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-300 focus:bg-white focus:ring-4 focus:ring-emerald-100";

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const redirect = searchParams.get("redirect") || location.state?.redirectTo || "";

  function handleChange(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (!form.email || !form.password) {
      setError("Please enter both your email and password.");
      return;
    }

    try {
      setIsSubmitting(true);
      const user = await login(form);
      navigate(redirect || getPostAuthRoute(user), { replace: true });
    } catch (submitError) {
      setError(submitError.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AuthExperienceShell
      badge="Login"
      cta="Sign back in to manage rooms, uploads, invitations, and premium access."
      description="Welcome back to the calm, premium way to organize shared galleries and room-based photo experiences."
      footer={
        <p>
          New here?{" "}
          <Link className="font-semibold text-emerald-700 transition hover:text-emerald-800" to="/register">
            Create an account
          </Link>
        </p>
      }
      highlights={[
        "Return to your latest rooms and collaboration activity instantly.",
        "Review private galleries, uploads, and invitation flows in one workspace.",
        "Access premium room controls without losing the personal, photo-first feel.",
      ]}
      title="Welcome back to your photo rooms."
    >
      <div>
        <h2 className="text-3xl font-semibold tracking-[-0.04em] text-slate-950 sm:text-[2.4rem]">
          Sign in
        </h2>
        <p className="mt-3 text-sm leading-7 text-slate-500 sm:text-base">
          Manage rooms, uploads, invitations, and premium access from your PixRoom+ workspace.
        </p>
      </div>

      <div className="mt-5 space-y-3">
        <StatusBanner type="error">{error}</StatusBanner>
      </div>

      <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
        <label className="block">
          <span className="mb-2 block text-sm font-medium text-slate-700">Email</span>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-4 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-slate-400" />
            <input
              className={`${inputClassName} pl-11`}
              name="email"
              onChange={handleChange}
              placeholder="you@example.com"
              type="email"
              value={form.email}
            />
          </div>
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-medium text-slate-700">Password</span>
          <div className="relative">
            <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-slate-400" />
            <input
              className={`${inputClassName} pl-11`}
              name="password"
              onChange={handleChange}
              placeholder="Enter your password"
              type="password"
              value={form.password}
            />
          </div>
        </label>

        <button
          className="inline-flex h-13 w-full items-center justify-center gap-2 rounded-[22px] bg-orange-500 px-5 text-sm font-semibold text-white shadow-[0_18px_40px_rgba(249,115,22,0.22)] transition hover:bg-orange-600 hover:shadow-[0_22px_50px_rgba(249,115,22,0.24)] disabled:cursor-not-allowed disabled:bg-orange-300 disabled:text-white/80 disabled:shadow-none"
          disabled={isSubmitting}
          type="submit"
        >
          {isSubmitting ? "Signing in..." : "Log in"}
          <ArrowRight className="h-4 w-4" />
        </button>
      </form>
    </AuthExperienceShell>
  );
}
