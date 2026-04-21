import {
  Bot,
  Camera,
  ImagePlus,
  MessageCircleHeart,
  Send,
  Sparkles,
  Users,
} from "lucide-react";

function FloatingChip({ className, icon: Icon, label }) {
  return (
    <div
      className={`absolute flex items-center gap-2 rounded-2xl border border-white/80 bg-white/88 px-3 py-2 text-sm font-medium text-slate-700 shadow-[0_18px_40px_rgba(15,23,42,0.08)] backdrop-blur-sm ${className}`}
    >
      <Icon className="h-4 w-4 text-orange-500" />
      <span>{label}</span>
    </div>
  );
}

export function HeroIllustration() {
  return (
    <div className="relative mx-auto w-full max-w-[680px]">
      <div className="pointer-events-none absolute -left-6 top-14 h-40 w-40 rounded-full bg-orange-200/45 blur-3xl" />
      <div className="pointer-events-none absolute -right-6 top-10 h-48 w-48 rounded-full bg-cyan-200/40 blur-3xl" />
      <div className="pointer-events-none absolute bottom-4 left-1/3 h-44 w-44 rounded-full bg-emerald-200/35 blur-3xl" />

      <FloatingChip className="left-2 top-10 rotate-[-5deg]" icon={Send} label="Invite sent" />
      <FloatingChip className="right-4 top-16 rotate-[6deg]" icon={ImagePlus} label="Photos shared" />
      <FloatingChip className="left-10 bottom-20 rotate-[4deg]" icon={Users} label="Room ready" />
      <FloatingChip className="right-10 bottom-10 rotate-[-4deg]" icon={Camera} label="Final gallery" />

      <div className="relative overflow-hidden rounded-[38px] border border-white/80 bg-[linear-gradient(160deg,rgba(255,255,255,0.9)_0%,rgba(246,251,255,0.95)_52%,rgba(255,248,241,0.96)_100%)] p-6 shadow-[0_28px_90px_rgba(15,23,42,0.12)] sm:p-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(251,146,60,0.12),transparent_24%),radial-gradient(circle_at_bottom_right,rgba(45,212,191,0.12),transparent_26%)]" />

        <div className="relative grid gap-5 lg:grid-cols-[1.08fr_0.92fr]">
          <div className="space-y-4">
            <div className="rounded-[30px] border border-white/70 bg-white/90 p-5 shadow-[0_16px_40px_rgba(15,23,42,0.06)]">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">PixRoom+ helper</p>
                  <h3 className="mt-2 text-xl font-semibold tracking-tight text-slate-950">
                    Keep every room simple
                  </h3>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-50 text-orange-600">
                  <Sparkles className="h-5 w-5" />
                </div>
              </div>

              <div className="mt-5 grid gap-3">
                <div className="rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-600">
                  1. Create the room
                </div>
                <div className="rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-600">
                  2. Invite your people
                </div>
                <div className="rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-600">
                  3. Share guest and photographer photos
                </div>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-[26px] border border-white/70 bg-white/88 p-4 shadow-[0_16px_35px_rgba(15,23,42,0.05)]">
                <p className="text-sm font-semibold text-slate-900">Guest photos</p>
                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Behind-the-scenes moments from everyone in the room.
                </p>
              </div>
              <div className="rounded-[26px] border border-white/70 bg-white/88 p-4 shadow-[0_16px_35px_rgba(15,23,42,0.05)]">
                <p className="text-sm font-semibold text-slate-900">Photographer photos</p>
                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Final edited images delivered in the same place.
                </p>
              </div>
            </div>
          </div>

          <div className="relative flex min-h-[360px] items-center justify-center">
            <div className="absolute h-64 w-64 rounded-full bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.95),rgba(255,237,213,0.8)_45%,rgba(255,255,255,0.2)_72%)] blur-sm" />

            <div className="relative">
              <div className="absolute -left-10 top-24 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/90 text-cyan-600 shadow-[0_18px_40px_rgba(15,23,42,0.08)]">
                <MessageCircleHeart className="h-6 w-6" />
              </div>
              <div className="absolute -right-8 top-10 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/90 text-emerald-600 shadow-[0_18px_40px_rgba(15,23,42,0.08)]">
                <Camera className="h-6 w-6" />
              </div>

              <div className="relative flex h-64 w-52 flex-col items-center justify-center rounded-[38px] border border-white/70 bg-[linear-gradient(180deg,#fffdf9_0%,#ffffff_35%,#f1fbff_100%)] shadow-[0_26px_80px_rgba(15,23,42,0.12)]">
                <div className="absolute top-5 h-4 w-20 rounded-full bg-slate-100" />
                <div className="flex h-24 w-24 items-center justify-center rounded-[28px] bg-[linear-gradient(135deg,#fff7ed_0%,#ecfeff_100%)] text-slate-900 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)]">
                  <Bot className="h-12 w-12" />
                </div>
                <div className="mt-6 grid gap-3">
                  <div className="h-3 w-28 rounded-full bg-slate-100" />
                  <div className="h-3 w-20 rounded-full bg-slate-100" />
                </div>
                <div className="mt-6 flex gap-3">
                  <div className="h-12 w-12 rounded-2xl bg-orange-100" />
                  <div className="h-12 w-12 rounded-2xl bg-cyan-100" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
