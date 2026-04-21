import { Camera, FolderLock, Image, Sparkles, UserPlus } from "lucide-react";

const roomCards = [
  {
    title: "Yasmine Wedding Weekend",
    status: "Private gallery",
    uploads: "392 uploads",
    gradient: "linear-gradient(135deg,#fbcfe8 0%,#ddd6fe 100%)",
  },
  {
    title: "Sofitel Launch Party",
    status: "Public room",
    uploads: "618 uploads",
    gradient: "linear-gradient(135deg,#a5f3fc 0%,#bfdbfe 100%)",
  },
];

export function DemoPreview() {
  return (
    <div className="relative mx-auto w-full max-w-[720px]">
      <div className="pointer-events-none absolute -left-10 top-10 h-32 w-32 rounded-full bg-cyan-300/25 blur-3xl" />
      <div className="pointer-events-none absolute -right-8 top-20 h-36 w-36 rounded-full bg-emerald-300/20 blur-3xl" />

      <div className="relative overflow-hidden rounded-[34px] border border-white/80 bg-white/88 p-4 shadow-[0_28px_90px_rgba(15,23,42,0.14)] backdrop-blur-xl sm:p-5">
        <div className="rounded-[28px] border border-slate-200/80 bg-[linear-gradient(180deg,#fbfdff_0%,#f2f8fb_100%)] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.8)] sm:p-5">
          <div className="flex items-center justify-between gap-4 border-b border-slate-200/80 pb-4">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-[18px] bg-[linear-gradient(135deg,#f97316_0%,#fb923c_55%,#14b8a6_100%)] text-sm font-semibold text-white shadow-[0_14px_30px_rgba(249,115,22,0.2)]">
                P+
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-950">PixRoom+</p>
                <p className="text-xs text-slate-500">Shared photo rooms</p>
              </div>
            </div>

            <div className="hidden items-center gap-2 sm:flex">
              <div className="rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-emerald-700">
                Demo mode
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600">
                Read only
              </div>
            </div>
          </div>

          <div className="mt-5 grid gap-4 xl:grid-cols-[0.92fr_1.08fr]">
            <aside className="space-y-4 rounded-[26px] bg-[linear-gradient(180deg,#0f172a_0%,#12344b_45%,#1d7c7b_100%)] p-4 text-white shadow-[0_20px_45px_rgba(15,23,42,0.18)]">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-white/60">Workspace</p>
                <h3 className="mt-3 text-xl font-semibold tracking-tight">Create private rooms, invite your people.</h3>
                <p className="mt-3 text-sm leading-6 text-white/74">
                  Organize event photos, shared galleries, and premium access in one beautiful product.
                </p>
              </div>

              <div className="grid gap-3">
                {[
                  { icon: FolderLock, label: "Private rooms", value: "Premium enabled" },
                  { icon: Image, label: "Recent uploads", value: "2,846 photos" },
                  { icon: UserPlus, label: "Invitations", value: "18 pending" },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.label} className="rounded-2xl border border-white/12 bg-white/10 px-4 py-4 backdrop-blur-sm">
                      <div className="flex items-center gap-3">
                        <div className="rounded-2xl bg-white/10 p-2.5">
                          <Icon className="h-4.5 w-4.5" />
                        </div>
                        <div>
                          <p className="text-xs uppercase tracking-[0.14em] text-white/55">{item.label}</p>
                          <p className="mt-1 text-sm font-semibold text-white">{item.value}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </aside>

            <div className="space-y-4">
              <div className="rounded-[26px] border border-slate-200 bg-white p-4 shadow-[0_16px_40px_rgba(15,23,42,0.06)]">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium text-slate-500">Demo dashboard</p>
                    <h3 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">
                      Active rooms, uploads, privacy, and shared galleries
                    </h3>
                  </div>
                  <div className="rounded-2xl bg-emerald-50 p-3 text-emerald-700">
                    <Sparkles className="h-5 w-5" />
                  </div>
                </div>

                <div className="mt-5 grid gap-3 sm:grid-cols-3">
                  {[
                    { label: "Rooms", value: "12 live" },
                    { label: "Guests", value: "137 active" },
                    { label: "Storage", value: "182 GB" },
                  ].map((item) => (
                    <div key={item.label} className="rounded-2xl bg-slate-50 px-4 py-4">
                      <p className="text-xs uppercase tracking-[0.16em] text-slate-400">{item.label}</p>
                      <p className="mt-2 text-lg font-semibold text-slate-950">{item.value}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid gap-4 lg:grid-cols-[1.05fr_0.95fr]">
                <div className="rounded-[26px] border border-slate-200 bg-white p-4 shadow-[0_16px_40px_rgba(15,23,42,0.06)]">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-slate-900">Room previews</p>
                      <p className="text-sm text-slate-500">A realistic look at what lives inside PixRoom+.</p>
                    </div>
                    <div className="rounded-2xl bg-slate-100 p-3 text-slate-700">
                      <Camera className="h-5 w-5" />
                    </div>
                  </div>

                  <div className="mt-4 space-y-3">
                    {roomCards.map((room) => (
                      <div key={room.title} className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
                        <div className="h-28 rounded-[18px]" style={{ background: room.gradient }} />
                        <div className="mt-3 flex items-start justify-between gap-3">
                          <div>
                            <p className="font-medium text-slate-900">{room.title}</p>
                            <p className="mt-1 text-sm text-slate-500">{room.status}</p>
                          </div>
                          <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-600">
                            {room.uploads}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="rounded-[26px] border border-slate-200 bg-white p-4 shadow-[0_16px_40px_rgba(15,23,42,0.06)]">
                    <p className="text-sm font-semibold text-slate-900">Invitation flow</p>
                    <div className="mt-4 space-y-3">
                      {[
                        "Client gallery invite sent",
                        "Guest upload request accepted",
                        "Photographer added to private room",
                      ].map((item) => (
                        <div key={item} className="rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-600">
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-[26px] border border-emerald-100 bg-[linear-gradient(135deg,#f3fbf8_0%,#fbfdff_100%)] p-4 shadow-[0_16px_40px_rgba(15,23,42,0.04)]">
                    <p className="text-sm font-semibold text-slate-900">Premium controls</p>
                    <p className="mt-2 text-sm leading-6 text-slate-500">
                      Private rooms, stronger privacy, photographer workflows, and AI help all live in the same product experience.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
