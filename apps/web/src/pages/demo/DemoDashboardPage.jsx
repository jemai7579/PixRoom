import { Camera, CircleDot, Image, LockKeyhole, Sparkles, UserPlus } from "lucide-react";
import { Link } from "react-router-dom";
import { DemoActionButton } from "../../components/demo/DemoActionButton";
import { DemoLockedNotice } from "../../components/demo/DemoLockedNotice";
import { StatCard } from "../../components/StatCard";
import { useDemo } from "../../contexts/DemoContext";

export function DemoDashboardPage() {
  const { workspace } = useDemo();
  const featuredRooms = workspace.rooms.slice(0, 3);

  return (
    <div className="space-y-6 lg:space-y-8">
      <section className="rounded-[36px] border border-white/80 bg-white/88 p-6 shadow-[0_22px_55px_rgba(15,23,42,0.06)] sm:p-8">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
          <div className="max-w-3xl">
            <span className="inline-flex rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-emerald-700">
              Demo dashboard
            </span>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950 sm:text-[2.7rem]">
              Understand the full PixRoom+ workspace before you sign up
            </h2>
            <p className="mt-3 text-sm leading-7 text-slate-500 sm:text-base">
              This preview shows what active rooms, guest uploads, invitations, premium privacy, and
              photographer workflows look like inside the real product.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <DemoActionButton
              caption="Sign up to start creating rooms and managing your own galleries."
              label="Create room"
            />
            <DemoActionButton
              caption="Create an account to upload photos and invite people."
              label="Upload photos"
              variant="secondary"
            />
          </div>
        </div>
      </section>

      <DemoLockedNotice />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {workspace.stats.map((item, index) => (
          <StatCard
            key={item.label}
            change={item.detail}
            icon={[CircleDot, Image, UserPlus, LockKeyhole][index]}
            label={item.label}
            tone={["emerald", "sky", "violet", "amber"][index]}
            value={item.value}
          />
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.3fr_0.9fr]">
        <div className="rounded-[32px] border border-white/80 bg-white/88 p-6 shadow-[0_22px_55px_rgba(15,23,42,0.06)] sm:p-7">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h3 className="text-2xl font-semibold tracking-tight text-slate-950">Active rooms</h3>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                Visitors can explore realistic room cards, privacy states, and gallery activity before
                creating an account.
              </p>
            </div>
            <Link className="text-sm font-semibold text-slate-700 transition hover:text-slate-950" to="/demo/rooms">
              Explore all demo rooms
            </Link>
          </div>

          <div className="mt-6 grid gap-4 xl:grid-cols-3">
            {featuredRooms.map((room) => (
              <article
                key={room.id}
                className="rounded-[28px] border border-slate-200 bg-[linear-gradient(180deg,#ffffff_0%,#f8fbff_100%)] p-5"
              >
                <div
                  className="h-36 rounded-[22px]"
                  style={{ background: room.coverGradient }}
                />
                <div className="mt-5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                        {room.visibility}
                      </span>
                      <h4 className="mt-3 text-lg font-semibold text-slate-950">{room.title}</h4>
                    </div>
                    <div className="rounded-2xl bg-slate-100 p-3 text-slate-700">
                      <Camera className="h-5 w-5" />
                    </div>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-slate-500">{room.description}</p>
                  <div className="mt-4 grid grid-cols-3 gap-3 text-sm">
                    <div className="rounded-2xl bg-white px-3 py-3">
                      <p className="text-slate-400">People</p>
                      <p className="mt-1 font-semibold text-slate-900">{room.participants}</p>
                    </div>
                    <div className="rounded-2xl bg-white px-3 py-3">
                      <p className="text-slate-400">Uploads</p>
                      <p className="mt-1 font-semibold text-slate-900">{room.uploadsCount}</p>
                    </div>
                    <div className="rounded-2xl bg-white px-3 py-3">
                      <p className="text-slate-400">Code</p>
                      <p className="mt-1 font-semibold text-slate-900">{room.code}</p>
                    </div>
                  </div>
                  <div className="mt-5 flex items-center justify-between">
                    <span className="text-sm text-slate-500">{room.privacyLabel}</span>
                    <Link className="text-sm font-semibold text-emerald-700 transition hover:text-emerald-800" to={`/demo/rooms/${room.id}`}>
                      Open preview
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>

        <aside className="space-y-6">
          <section className="rounded-[32px] border border-slate-200 bg-[linear-gradient(180deg,#f9fbff_0%,#ffffff_100%)] p-6 shadow-[0_20px_50px_rgba(15,23,42,0.05)]">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-violet-50 p-3 text-violet-700">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-950">Premium room controls</h3>
                <p className="text-sm text-slate-500">See what becomes available after signup.</p>
              </div>
            </div>

            <div className="mt-5 space-y-3">
              {[
                "Private rooms for client-only access",
                "Premium privacy settings and branded delivery",
                "AI assistant access inside the dashboard",
                "Higher storage and more active galleries",
              ].map((feature) => (
                <div key={feature} className="rounded-2xl border border-slate-200 bg-white px-4 py-4 text-sm leading-6 text-slate-600">
                  {feature}
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-[32px] border border-white/80 bg-white/88 p-6 shadow-[0_22px_55px_rgba(15,23,42,0.06)]">
            <h3 className="text-lg font-semibold text-slate-950">Role preview</h3>
            <div className="mt-5 grid gap-3">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
                <p className="text-sm font-semibold text-slate-900">Normal user</p>
                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Join rooms, browse galleries, track invitations, and upload photos when the room
                  allows guest contributions.
                </p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
                <p className="text-sm font-semibold text-slate-900">Photographer</p>
                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Create rooms, manage client galleries, invite collaborators, and use premium
                  delivery tools.
                </p>
              </div>
            </div>
            <DemoActionButton
              className="mt-5"
              label="Create account"
              caption="Start free and unlock the full product once you are ready."
            />
          </section>
        </aside>
      </section>
    </div>
  );
}
