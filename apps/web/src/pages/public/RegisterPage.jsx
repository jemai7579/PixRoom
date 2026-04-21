import { useMemo, useState } from "react";
import { ArrowRight, BadgeCheck, LockKeyhole, Mail, UserRound } from "lucide-react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { AuthExperienceShell } from "../../components/AuthExperienceShell";
import { StatusBanner } from "../../components/StatusBanner";
import { useAuth } from "../../hooks/useAuth";
import { getPostAuthRoute } from "../../lib/auth";

const inputClassName =
  "w-full rounded-[20px] border border-slate-200 bg-slate-50/80 px-4 py-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-emerald-300 focus:bg-white focus:ring-4 focus:ring-emerald-100";

export function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const selectedPlan = searchParams.get("plan") || "free";
  const initialRole = selectedPlan === "photographer" ? "photographer" : "user";
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: initialRole,
    plan: selectedPlan,
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const effectivePlan = useMemo(() => {
    if (form.role === "photographer") {
      return "photographer";
    }

    return form.plan === "photographer" ? "free" : form.plan;
  }, [form.plan, form.role]);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((current) => {
      const next = { ...current, [name]: value };

      if (name === "role" && value === "photographer") {
        next.plan = "photographer";
      }

      if (name === "role" && value === "user" && current.plan === "photographer") {
        next.plan = "free";
      }

      return next;
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (!form.name || !form.email || !form.password) {
      setError("Please fill in all required fields.");
      return;
    }

    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setIsSubmitting(true);
      const user = await register({
        name: form.name,
        email: form.email,
        password: form.password,
        role: form.role,
        plan: effectivePlan,
      });
      navigate(getPostAuthRoute(user), { replace: true });
    } catch (submitError) {
      setError(submitError.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AuthExperienceShell
      badge="Register"
      cta="Choose your role and plan, then start creating rooms, sharing galleries, and inviting people."
      description="Build your PixRoom+ workspace for private galleries, collaborative uploads, and polished room-based photo sharing."
      footer={
        <p>
          Already have an account?{" "}
          <Link className="font-semibold text-emerald-700 transition hover:text-emerald-800" to="/login">
            Log in
          </Link>
        </p>
      }
      highlights={[
        "Normal users can join rooms, review invitations, and upload when allowed.",
        "Photographers can create rooms, organize collections, and deliver galleries professionally.",
        "Premium plans unlock private rooms, stronger sharing controls, and AI-assisted workflows.",
      ]}
      title="Create your PixRoom+ experience."
    >
      <div>
        <h2 className="text-3xl font-semibold tracking-[-0.04em] text-slate-950 sm:text-[2.35rem]">
          Create your account
        </h2>
        <p className="mt-3 text-sm leading-7 text-slate-500 sm:text-base">
          Set up your role, choose a plan, and start sharing rooms, galleries, and invitations with
          a premium product feel from day one.
        </p>
      </div>

      <div className="mt-5 space-y-3">
        <StatusBanner type="error">{error}</StatusBanner>
        <StatusBanner type="info">
          Selected plan: <strong>{effectivePlan}</strong>
        </StatusBanner>
      </div>

      <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
        <div className="grid gap-4 md:grid-cols-2">
          <label className="block md:col-span-2">
            <span className="mb-2 block text-sm font-medium text-slate-700">Full name</span>
            <div className="relative">
              <UserRound className="pointer-events-none absolute left-4 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-slate-400" />
              <input
                className={`${inputClassName} pl-11`}
                name="name"
                onChange={handleChange}
                placeholder="Your full name"
                value={form.name}
              />
            </div>
          </label>

          <label className="block md:col-span-2">
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
                placeholder="At least 6 characters"
                type="password"
                value={form.password}
              />
            </div>
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-700">Confirm password</span>
            <div className="relative">
              <BadgeCheck className="pointer-events-none absolute left-4 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-slate-400" />
              <input
                className={`${inputClassName} pl-11`}
                name="confirmPassword"
                onChange={handleChange}
                placeholder="Repeat your password"
                type="password"
                value={form.confirmPassword}
              />
            </div>
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-700">Role</span>
            <select className={inputClassName} name="role" onChange={handleChange} value={form.role}>
              <option value="user">Normal user</option>
              <option value="photographer">Photographer</option>
            </select>
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-700">Plan</span>
            <select
              className={`${inputClassName} disabled:bg-slate-100 disabled:text-slate-400`}
              disabled={form.role === "photographer"}
              name="plan"
              onChange={handleChange}
              value={effectivePlan}
            >
              <option value="free">Freemium</option>
              <option value="premium">Premium</option>
              <option value="photographer">Photographer</option>
            </select>
          </label>
        </div>

        <button
          className="inline-flex h-13 w-full items-center justify-center gap-2 rounded-[22px] bg-orange-500 px-5 text-sm font-semibold text-white shadow-[0_18px_40px_rgba(249,115,22,0.22)] transition hover:bg-orange-600 hover:shadow-[0_22px_50px_rgba(249,115,22,0.24)] disabled:cursor-not-allowed disabled:bg-orange-300 disabled:text-white/80 disabled:shadow-none"
          disabled={isSubmitting}
          type="submit"
        >
          {isSubmitting ? "Creating account..." : "Create account"}
          <ArrowRight className="h-4 w-4" />
        </button>
      </form>
    </AuthExperienceShell>
  );
}
