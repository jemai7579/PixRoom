import { Camera, CheckCircle2, LockKeyhole, Sparkles, Users } from "lucide-react";
import { PixroomLogo } from "./PixroomLogo";

const defaultHighlights = [
  "Create private rooms for your clients and guests.",
  "Share galleries, uploads, and invitations in one place.",
  "Unlock premium room controls as your photo workflow grows.",
];

const stats = [
  { label: "Shared galleries", value: "18k+" },
  { label: "Private rooms", value: "6.2k" },
  { label: "Invite joins", value: "98%" },
];

export function AuthExperienceShell({
  badge,
  children,
  cta,
  description,
  footer,
  highlights = defaultHighlights,
  title,
}) {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,rgba(251,146,60,0.18),transparent_22%),radial-gradient(circle_at_bottom_right,rgba(16,185,129,0.12),transparent_26%),linear-gradient(160deg,#fffaf6_0%,#f7fbff_32%,#eef8f5_100%)]">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-[-8%] top-[-8%] h-72 w-72 rounded-full bg-orange-200/30 blur-3xl" />
        <div className="absolute right-[6%] top-[10%] h-80 w-80 rounded-full bg-emerald-300/14 blur-3xl" />
        <div className="absolute bottom-[-8%] left-[28%] h-80 w-80 rounded-full bg-sky-200/24 blur-3xl" />
      </div>

      <div className="relative mx-auto flex min-h-screen w-full max-w-[1500px] items-center px-4 py-6 sm:px-6 lg:px-8">
        <section className="relative grid min-h-[calc(100vh-3rem)] w-full overflow-hidden rounded-[34px] border border-white/70 bg-white/50 shadow-[0_30px_120px_rgba(15,23,42,0.12)] backdrop-blur-xl lg:grid-cols-[1.02fr_0.98fr]">
          <div className="relative overflow-hidden bg-[linear-gradient(160deg,#fff7ef_0%,#ffffff_38%,#eefaf8_100%)] px-6 py-8 text-slate-900 sm:px-8 lg:px-10 lg:py-10">
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute -left-14 top-24 h-44 w-44 rounded-full border border-white/70 bg-white/40" />
              <div className="absolute right-10 top-14 h-28 w-28 rounded-[28px] border border-white/70 bg-white/50 backdrop-blur-sm" />
              <div className="absolute bottom-12 left-8 h-36 w-36 rounded-full bg-orange-200/25 blur-2xl" />
              <div className="absolute bottom-20 right-[-30px] h-40 w-40 rounded-[36px] border border-white/70 bg-gradient-to-br from-emerald-100/60 to-sky-100/40 rotate-12" />
            </div>

            <div className="relative z-10 flex h-full flex-col">
              <div className="flex items-center justify-between gap-4">
                <PixroomLogo
                  className="max-w-[150px]"
                  imageClassName="max-w-[122px]"
                  subtitle="Photo rooms, galleries, invitations"
                  to="/"
                />

                <div className="hidden rounded-full border border-slate-200 bg-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-slate-600 sm:inline-flex">
                  Premium access
                </div>
              </div>

              <div className="mt-10 lg:mt-14">
                <span className="inline-flex items-center gap-2 rounded-full border border-orange-100 bg-orange-50 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-orange-700">
                  <Sparkles className="h-3.5 w-3.5" />
                  {badge}
                </span>

                <h1 className="mt-6 max-w-[12ch] text-4xl font-semibold tracking-[-0.05em] text-slate-950 sm:text-5xl lg:text-[3.65rem]">
                  {title}
                </h1>
                <p className="mt-5 max-w-xl text-sm leading-7 text-slate-600 sm:text-base">{description}</p>
              </div>

              <div className="mt-8 grid gap-3 sm:grid-cols-3">
                {stats.map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-[24px] border border-white/80 bg-white/80 px-4 py-4 shadow-[0_16px_35px_rgba(15,23,42,0.04)]"
                  >
                    <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400">{stat.label}</p>
                    <p className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">{stat.value}</p>
                  </div>
                ))}
              </div>

              <div className="mt-8 rounded-[30px] border border-white/80 bg-white/82 p-5 shadow-[0_16px_35px_rgba(15,23,42,0.04)]">
                <div className="flex items-center gap-3">
                  <div className="rounded-2xl bg-orange-50 p-3">
                    <Users className="h-5 w-5 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-950">Create private rooms, share memories, invite your people.</p>
                    <p className="text-sm text-slate-500">Everything stays polished, collaborative, and easy to access.</p>
                  </div>
                </div>

                <div className="mt-5 space-y-3">
                  {highlights.map((item) => (
                    <div key={item} className="flex items-start gap-3 text-sm text-slate-600">
                      <CheckCircle2 className="mt-0.5 h-4.5 w-4.5 shrink-0 text-emerald-500" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-auto hidden pt-10 lg:block">
                <div className="grid grid-cols-3 gap-3">
                  <div className="rounded-[24px] border border-white/80 bg-white/82 p-4 shadow-[0_16px_35px_rgba(15,23,42,0.04)]">
                    <Camera className="h-5 w-5 text-orange-600" />
                    <p className="mt-4 text-sm font-semibold text-slate-950">Room creation</p>
                    <p className="mt-2 text-sm leading-6 text-slate-500">Launch galleries for events, shoots, and client delivery.</p>
                  </div>
                  <div className="rounded-[24px] border border-white/80 bg-white/82 p-4 shadow-[0_16px_35px_rgba(15,23,42,0.04)]">
                    <Users className="h-5 w-5 text-cyan-600" />
                    <p className="mt-4 text-sm font-semibold text-slate-950">Invitations</p>
                    <p className="mt-2 text-sm leading-6 text-slate-500">Bring guests, clients, and collaborators into the right room.</p>
                  </div>
                  <div className="rounded-[24px] border border-white/80 bg-white/82 p-4 shadow-[0_16px_35px_rgba(15,23,42,0.04)]">
                    <LockKeyhole className="h-5 w-5 text-emerald-600" />
                    <p className="mt-4 text-sm font-semibold text-slate-950">Premium access</p>
                    <p className="mt-2 text-sm leading-6 text-slate-500">Control privacy, storage, and AI help from one simple product flow.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="relative flex items-center justify-center px-4 py-6 sm:px-6 lg:px-10 lg:py-10">
            <div className="w-full max-w-[640px] rounded-[32px] border border-white/80 bg-white/92 p-5 shadow-[0_28px_70px_rgba(15,23,42,0.10)] backdrop-blur-xl sm:p-8 lg:p-9">
              <div className="mb-6 flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">{badge}</p>
                  {cta ? <p className="mt-2 text-sm leading-6 text-slate-500">{cta}</p> : null}
                </div>
                <div className="hidden rounded-2xl bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-600 sm:inline-flex">
                  PixRoom+
                </div>
              </div>

              {children}

              <div className="mt-6 border-t border-slate-200 pt-5 text-sm text-slate-500">{footer}</div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
