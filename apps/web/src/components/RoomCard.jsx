import { Link } from "react-router-dom";
import { StatusBadge } from "./StatusBadge";

export function RoomCard({ room }) {
  const photosCount = room.uploadsCount ?? room.uploads?.length ?? 0;
  const commentsCount = room.comments?.length ?? 0;
  const peopleCount = room.membersCount ?? room.members?.length ?? 0;

  return (
    <article className="rounded-[30px] border border-white/80 bg-white/88 p-5 shadow-[0_18px_45px_rgba(15,23,42,0.05)]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-xl font-semibold text-slate-950">{room.title}</h3>
          <p className="mt-2 text-sm leading-6 text-slate-500">{room.description || "No description yet."}</p>
        </div>
        <StatusBadge
          label={room.visibility === "private" ? "Private" : "Public"}
          status={room.visibility === "private" ? "saved" : "live"}
        />
      </div>

      <div className="mt-5 grid grid-cols-3 gap-3">
        <div className="rounded-2xl bg-slate-50 px-3 py-3">
          <p className="text-xs uppercase tracking-[0.14em] text-slate-400">People</p>
          <p className="mt-1 font-semibold text-slate-950">{peopleCount}</p>
        </div>
        <div className="rounded-2xl bg-slate-50 px-3 py-3">
          <p className="text-xs uppercase tracking-[0.14em] text-slate-400">Photos</p>
          <p className="mt-1 font-semibold text-slate-950">{photosCount}</p>
        </div>
        <div className="rounded-2xl bg-slate-50 px-3 py-3">
          <p className="text-xs uppercase tracking-[0.14em] text-slate-400">Code</p>
          <p className="mt-1 font-semibold text-slate-950">{room.code}</p>
        </div>
      </div>

      <div className="mt-5 flex items-center justify-between">
        <p className="text-sm text-slate-500">{commentsCount} messages</p>
        <Link className="app-btn-primary inline-flex h-11 items-center justify-center px-4 text-sm" to={`/app/rooms/${room.id}`}>
          Open room
        </Link>
      </div>
    </article>
  );
}
