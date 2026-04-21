import { Link } from "react-router-dom";
import { DemoActionButton } from "../../components/demo/DemoActionButton";
import { DemoLockedNotice } from "../../components/demo/DemoLockedNotice";
import { useDemo } from "../../contexts/DemoContext";

export function DemoRoomsPage() {
  const { workspace } = useDemo();

  return (
    <div className="space-y-6 lg:space-y-8">
      <section className="rounded-[36px] border border-white/80 bg-white/88 p-6 shadow-[0_22px_55px_rgba(15,23,42,0.06)] sm:p-8">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
          <div className="max-w-3xl">
            <span className="inline-flex rounded-full border border-sky-100 bg-sky-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-sky-700">
              Demo rooms
            </span>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950 sm:text-[2.5rem]">
              Browse realistic rooms, privacy states, and sample gallery activity
            </h2>
            <p className="mt-3 text-sm leading-7 text-slate-500 sm:text-base">
              Visitors can open room previews, see how uploads are organized, and understand what
              public versus private access looks like in PixRoom+.
            </p>
          </div>

          <DemoActionButton
            label="Create a real room"
            caption="Sign up to start creating rooms and inviting people."
          />
        </div>
      </section>

      <DemoLockedNotice message="Rooms in demo mode are fully browseable, but creating, editing, or deleting rooms is locked until signup." />

      <section className="grid gap-5 xl:grid-cols-3">
        {workspace.rooms.map((room) => (
          <article
            key={room.id}
            className="rounded-[30px] border border-slate-200 bg-white/90 p-5 shadow-[0_18px_45px_rgba(15,23,42,0.05)]"
          >
            <div className="h-40 rounded-[24px]" style={{ background: room.coverGradient }} />
            <div className="mt-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                    {room.visibility}
                  </span>
                  <h3 className="mt-3 text-lg font-semibold text-slate-950">{room.title}</h3>
                </div>
                {room.joined ? (
                  <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                    Joined
                  </span>
                ) : null}
              </div>

              <p className="mt-3 text-sm leading-6 text-slate-500">{room.description}</p>

              <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-2xl bg-slate-50 px-4 py-3">
                  <p className="text-slate-400">Invite code</p>
                  <p className="mt-1 font-semibold text-slate-900">{room.code}</p>
                </div>
                <div className="rounded-2xl bg-slate-50 px-4 py-3">
                  <p className="text-slate-400">Updated</p>
                  <p className="mt-1 font-semibold text-slate-900">{room.updatedAt}</p>
                </div>
                <div className="rounded-2xl bg-slate-50 px-4 py-3">
                  <p className="text-slate-400">People</p>
                  <p className="mt-1 font-semibold text-slate-900">{room.participants}</p>
                </div>
                <div className="rounded-2xl bg-slate-50 px-4 py-3">
                  <p className="text-slate-400">Uploads</p>
                  <p className="mt-1 font-semibold text-slate-900">{room.uploadsCount}</p>
                </div>
              </div>

              <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
                {room.ownerType} • {room.privacyLabel}
              </div>

              <div className="mt-5 flex items-center justify-between gap-3">
                <Link
                  className="inline-flex h-11 items-center justify-center rounded-2xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
                  to={`/demo/rooms/${room.id}`}
                >
                  Open preview
                </Link>
                <DemoActionButton
                  caption=""
                  className="text-right"
                  label="Join for real"
                  to="/register"
                  variant="secondary"
                />
              </div>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}
