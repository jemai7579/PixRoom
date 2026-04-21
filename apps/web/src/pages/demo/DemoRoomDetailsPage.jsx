import { Link, useParams } from "react-router-dom";
import { DemoActionButton } from "../../components/demo/DemoActionButton";
import { DemoLockedNotice } from "../../components/demo/DemoLockedNotice";
import { getDemoRoom } from "../../lib/demoData";

export function DemoRoomDetailsPage() {
  const { roomId } = useParams();
  const room = getDemoRoom(roomId);

  return (
    <div className="space-y-6 lg:space-y-8">
      <section className="rounded-[36px] border border-white/80 bg-white/88 p-6 shadow-[0_22px_55px_rgba(15,23,42,0.06)] sm:p-8">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
          <div className="max-w-3xl">
            <span className="inline-flex rounded-full border border-violet-100 bg-violet-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-violet-700">
              Demo room details
            </span>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950 sm:text-[2.5rem]">
              {room.title}
            </h2>
            <p className="mt-3 text-sm leading-7 text-slate-500 sm:text-base">{room.description}</p>
            <div className="mt-4 flex flex-wrap gap-3 text-sm text-slate-600">
              <span className="rounded-full bg-slate-100 px-3 py-1 font-medium">Code: {room.code}</span>
              <span className="rounded-full bg-slate-100 px-3 py-1 font-medium">{room.visibility}</span>
              <span className="rounded-full bg-slate-100 px-3 py-1 font-medium">{room.participants} people</span>
              <span className="rounded-full bg-slate-100 px-3 py-1 font-medium">{room.uploadsCount} uploads</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <DemoActionButton label="Upload photos" caption="Create an account to upload and manage real photos." />
            <DemoActionButton
              label="Invite people"
              caption="Sign up to send room invitations and join links."
              variant="secondary"
            />
          </div>
        </div>
      </section>

      <DemoLockedNotice message="The gallery, messages, and room settings are visible here, but all uploads, invitations, and edits are locked in preview mode." />

      <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <section className="rounded-[32px] border border-white/80 bg-white/88 p-6 shadow-[0_22px_55px_rgba(15,23,42,0.06)]">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-semibold text-slate-950">Gallery preview</h3>
              <p className="mt-2 text-sm text-slate-500">
                Sample uploads show how the room gallery feels once guests and photographers start contributing.
              </p>
            </div>
            <Link className="text-sm font-semibold text-slate-700 transition hover:text-slate-950" to="/demo/rooms">
              Back to rooms
            </Link>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {room.uploads.map((upload) => (
              <article key={upload.id} className="overflow-hidden rounded-[24px] border border-slate-200 bg-white">
                <div className="h-44" style={{ background: upload.gradient }} />
                <div className="px-4 py-4">
                  <p className="font-medium text-slate-900">{upload.title}</p>
                  <p className="mt-1 text-sm text-slate-500">Uploaded by {upload.author}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <aside className="space-y-6">
          <section className="rounded-[32px] border border-slate-200 bg-[linear-gradient(180deg,#f9fbff_0%,#ffffff_100%)] p-6 shadow-[0_20px_50px_rgba(15,23,42,0.05)]">
            <h3 className="text-lg font-semibold text-slate-950">Read-only room tools</h3>
            <div className="mt-5 space-y-4">
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-700">Choose image</span>
                <input
                  className="w-full rounded-2xl border border-slate-200 bg-slate-100 px-4 py-3 text-sm text-slate-400"
                  disabled
                  type="file"
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-700">Invite collaborator</span>
                <input
                  className="w-full rounded-2xl border border-slate-200 bg-slate-100 px-4 py-3 text-sm text-slate-400"
                  disabled
                  placeholder="guest@example.com"
                />
              </label>
            </div>

            <DemoActionButton
              className="mt-5"
              label="Create an account to use this feature"
              caption="Sign up to start creating rooms and uploading photos."
            />
          </section>

          <section className="rounded-[32px] border border-white/80 bg-white/88 p-6 shadow-[0_22px_55px_rgba(15,23,42,0.06)]">
            <h3 className="text-lg font-semibold text-slate-950">Room messages</h3>
            <div className="mt-5 space-y-3">
              {room.comments.map((item) => (
                <article key={item.id} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
                  <p className="font-medium text-slate-900">{item.author}</p>
                  <p className="mt-2 text-sm leading-6 text-slate-500">{item.message}</p>
                </article>
              ))}
            </div>
          </section>
        </aside>
      </section>
    </div>
  );
}
