import { DemoActionButton } from "../../components/demo/DemoActionButton";
import { DemoLockedNotice } from "../../components/demo/DemoLockedNotice";
import { useDemo } from "../../contexts/DemoContext";

export function DemoActivityPage() {
  const { workspace } = useDemo();

  return (
    <div className="space-y-6 lg:space-y-8">
      <section className="rounded-[36px] border border-white/80 bg-white/88 p-6 shadow-[0_22px_55px_rgba(15,23,42,0.06)] sm:p-8">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
          <div className="max-w-3xl">
            <span className="inline-flex rounded-full border border-amber-100 bg-amber-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-amber-700">
              Demo activity
            </span>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950 sm:text-[2.5rem]">
              Invitations, joined rooms, and collaboration activity at a glance
            </h2>
            <p className="mt-3 text-sm leading-7 text-slate-500 sm:text-base">
              This view helps visitors understand how members and photographers move through rooms,
              invitations, and shared gallery activity.
            </p>
          </div>

          <DemoActionButton
            label="Start free"
            caption="Create an account to invite people and track activity in your own workspace."
          />
        </div>
      </section>

      <DemoLockedNotice message="Activity in demo mode is realistic but read-only. Invitations, joins, and messages are visible for exploration only." />

      <section className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <section className="rounded-[32px] border border-white/80 bg-white/88 p-6 shadow-[0_22px_55px_rgba(15,23,42,0.06)]">
          <h3 className="text-xl font-semibold text-slate-950">Invitations</h3>
          <div className="mt-5 space-y-3">
            {workspace.invitations.map((invite) => (
              <div key={invite.id} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-medium text-slate-900">{invite.name}</p>
                    <p className="mt-1 text-sm text-slate-500">
                      {invite.role} for {invite.room}
                    </p>
                  </div>
                  <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-600">
                    {invite.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-[32px] border border-slate-200 bg-[linear-gradient(180deg,#f9fbff_0%,#ffffff_100%)] p-6 shadow-[0_20px_50px_rgba(15,23,42,0.05)]">
          <h3 className="text-xl font-semibold text-slate-950">Joined rooms</h3>
          <div className="mt-5 space-y-3">
            {workspace.joinedRooms.map((room) => (
              <div key={room.id} className="rounded-2xl border border-slate-200 bg-white px-4 py-4">
                <p className="font-medium text-slate-900">{room.title}</p>
                <p className="mt-2 text-sm text-slate-500">{room.access}</p>
                <p className="mt-3 text-sm font-medium text-emerald-700">{room.activity}</p>
              </div>
            ))}
          </div>
        </section>
      </section>

      <section className="rounded-[32px] border border-white/80 bg-white/88 p-6 shadow-[0_22px_55px_rgba(15,23,42,0.06)]">
        <h3 className="text-xl font-semibold text-slate-950">Collaboration timeline</h3>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {workspace.activities.map((item) => (
            <article key={item.id} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-medium text-slate-900">{item.title}</p>
                  <p className="mt-2 text-sm leading-6 text-slate-500">{item.detail}</p>
                </div>
                <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-600">
                  {item.time}
                </span>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
