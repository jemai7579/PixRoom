import { useMemo, useState } from "react";
import { CalendarClock, CheckCircle2, Clock3 } from "lucide-react";
import { StatusBadge } from "../../components/StatusBadge";
import { useAuth } from "../../hooks/useAuth";
import { api } from "../../lib/api";
import { buildAppUser } from "../../lib/mockAppData";

export function PhotographerAvailabilityPage() {
  const { token, user, updateUser } = useAuth();
  const appUser = useMemo(() => buildAppUser(user), [user]);
  const [form, setForm] = useState({
    isAvailable: appUser.isAvailable,
    availabilityLabel: appUser.availabilityLabel,
    bookingPreferences: appUser.bookingPreferences,
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
      setMessage("Availability updated successfully.");
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
            Availability
          </span>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950 sm:text-[2.5rem]">
            Availability and booking readiness
          </h2>
          <p className="mt-3 text-sm leading-7 text-slate-500 sm:text-base">
            Let clients know whether you are open for new events and what information you expect before confirming work.
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
              <Clock3 className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-slate-950">Availability status</h3>
              <p className="text-sm text-slate-500">Update the signal users see on your profile card.</p>
            </div>
          </div>

          <div className="mt-5 space-y-4">
            <label className="flex items-center justify-between rounded-[24px] border border-slate-200 bg-slate-50/90 px-4 py-4">
              <div>
                <p className="font-medium text-slate-900">Open for new bookings</p>
                <p className="mt-1 text-sm text-slate-500">
                  Turn this off when your calendar is full or you are pausing client work.
                </p>
              </div>
              <input
                checked={form.isAvailable}
                className="h-5 w-5 accent-emerald-600"
                onChange={(event) =>
                  setForm((current) => ({ ...current, isAvailable: event.target.checked }))
                }
                type="checkbox"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">Availability label</span>
              <input
                className="app-field w-full"
                onChange={(event) =>
                  setForm((current) => ({ ...current, availabilityLabel: event.target.value }))
                }
                placeholder="Available for weddings in May and June"
                value={form.availabilityLabel}
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">Booking preferences</span>
              <textarea
                className="app-field min-h-36 w-full"
                onChange={(event) =>
                  setForm((current) => ({ ...current, bookingPreferences: event.target.value }))
                }
                placeholder="Example: Please include guest count, venue, and the style of coverage you need."
                rows="5"
                value={form.bookingPreferences}
              />
            </label>

            <button className="app-btn-primary inline-flex h-12 items-center justify-center px-5 text-sm disabled:cursor-not-allowed disabled:opacity-60" disabled={isSaving} onClick={handleSave} type="button">
              {isSaving ? "Saving..." : "Save availability"}
            </button>
          </div>
        </section>

        <section className="rounded-[32px] border border-white/80 bg-white/88 p-6 shadow-[0_22px_55px_rgba(15,23,42,0.06)]">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-emerald-50 p-3 text-emerald-700">
              <CalendarClock className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-slate-950">What clients will see</h3>
              <p className="text-sm text-slate-500">A premium preview of your current booking readiness.</p>
            </div>
          </div>

          <div className="mt-5 rounded-[32px] border border-slate-200 bg-[linear-gradient(180deg,#ffffff_0%,#f6fbff_100%)] p-5">
            <StatusBadge
              label={form.availabilityLabel || "Availability not set"}
              status={form.isAvailable ? "accepted" : "cancelled"}
            />
            <p className="mt-4 text-sm leading-7 text-slate-500">
              {form.bookingPreferences || "Clients will see your booking guidance here once you add it."}
            </p>
          </div>

          <div className="mt-5 grid gap-3">
            {[
              "Use specific seasonal wording when your schedule changes often.",
              "Keep the label short so it reads clearly inside discovery cards.",
              "Describe the essentials you need before accepting a request.",
            ].map((tip) => (
              <div key={tip} className="rounded-2xl border border-slate-200 bg-slate-50/90 px-4 py-4 text-sm text-slate-600">
                {tip}
              </div>
            ))}
          </div>
        </section>
      </section>
    </div>
  );
}
