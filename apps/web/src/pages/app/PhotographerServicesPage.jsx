import { useMemo, useState } from "react";
import { Briefcase, Sparkles, Tag } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { api } from "../../lib/api";
import { buildAppUser } from "../../lib/mockAppData";

export function PhotographerServicesPage() {
  const { token, user, updateUser } = useAuth();
  const appUser = useMemo(() => buildAppUser(user), [user]);
  const [form, setForm] = useState({
    specialties: appUser.specialties.join(", "),
    priceRange: appUser.priceRange,
    servicePackages: appUser.servicePackages.join(", "),
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  async function handleSave() {
    try {
      setIsSaving(true);
      setError("");
      setMessage("");
      const response = await api.users.updateProfile(token, form);
      updateUser(response.user);
      setMessage("Services and pricing updated successfully.");
    } catch (saveError) {
      setError(saveError.message);
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="space-y-6 lg:space-y-8">
      <section className="rounded-[36px] border border-white/80 bg-[linear-gradient(135deg,#fffaf5_0%,#ffffff_45%,#f4fbff_100%)] p-6 shadow-[0_22px_55px_rgba(15,23,42,0.06)] sm:p-8">
        <div className="max-w-3xl">
          <span className="inline-flex rounded-full border border-orange-200 bg-orange-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-orange-700">
            Services
          </span>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950 sm:text-[2.5rem]">
            Services and pricing
          </h2>
          <p className="mt-3 text-sm leading-7 text-slate-500 sm:text-base">
            Explain what you shoot, how you package your work, and the pricing range clients should expect.
          </p>
        </div>
      </section>

      {message ? (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {message}
        </div>
      ) : null}
      {error ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </div>
      ) : null}

      <section className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <section className="rounded-[32px] border border-white/80 bg-white/88 p-6 shadow-[0_22px_55px_rgba(15,23,42,0.06)]">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-slate-100 p-3 text-slate-700">
              <Briefcase className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-slate-950">Professional offer</h3>
              <p className="text-sm text-slate-500">Shape how clients understand your coverage style.</p>
            </div>
          </div>

          <div className="mt-5 space-y-4">
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">Specialties</span>
              <input
                className="app-field w-full"
                onChange={(event) =>
                  setForm((current) => ({ ...current, specialties: event.target.value }))
                }
                placeholder="Wedding, graduation, birthday, corporate event"
                value={form.specialties}
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">Price range</span>
              <input
                className="app-field w-full"
                onChange={(event) =>
                  setForm((current) => ({ ...current, priceRange: event.target.value }))
                }
                placeholder="900 - 1800 TND"
                value={form.priceRange}
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">Services / packages</span>
              <textarea
                className="app-field min-h-36 w-full"
                onChange={(event) =>
                  setForm((current) => ({ ...current, servicePackages: event.target.value }))
                }
                placeholder="Half-day wedding coverage, full-day wedding coverage, same-day preview delivery..."
                rows="5"
                value={form.servicePackages}
              />
            </label>

            <button className="app-btn-primary inline-flex h-12 items-center justify-center px-5 text-sm disabled:cursor-not-allowed disabled:opacity-60" disabled={isSaving} onClick={handleSave} type="button">
              {isSaving ? "Saving..." : "Save services"}
            </button>
          </div>
        </section>

        <section className="rounded-[32px] border border-white/80 bg-white/88 p-6 shadow-[0_22px_55px_rgba(15,23,42,0.06)]">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-amber-50 p-3 text-amber-700">
              <Tag className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-slate-950">Client-facing summary</h3>
              <p className="text-sm text-slate-500">A clean view of what your marketplace card communicates.</p>
            </div>
          </div>

          <div className="mt-5 space-y-4">
            {[
              ["Specialties", form.specialties || "Add the kinds of events you shoot most often"],
              ["Price range", form.priceRange || "Set the range or package anchor clients should expect"],
              ["Packages", form.servicePackages || "Describe what is included in your services"],
            ].map(([label, value]) => (
              <div key={label} className="rounded-2xl border border-slate-200 bg-slate-50/90 px-4 py-4">
                <p className="text-xs uppercase tracking-[0.18em] text-slate-400">{label}</p>
                <p className="mt-2 text-sm font-medium leading-6 text-slate-900">{value}</p>
              </div>
            ))}
          </div>

          <div className="mt-5 rounded-[28px] border border-emerald-100 bg-[linear-gradient(180deg,#f3fbf8_0%,#fbfdff_100%)] p-5">
            <div className="flex items-center gap-3">
              <Sparkles className="h-5 w-5 text-emerald-700" />
              <p className="font-semibold text-slate-900">Premium tip</p>
            </div>
            <p className="mt-3 text-sm leading-6 text-slate-500">
              Clear specialties and concrete package language help users compare photographers with more confidence.
            </p>
          </div>
        </section>
      </section>
    </div>
  );
}
