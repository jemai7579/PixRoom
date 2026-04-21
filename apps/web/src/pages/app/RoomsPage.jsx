import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { RoomCard } from "../../components/RoomCard";
import { useAuth } from "../../hooks/useAuth";
import { api } from "../../lib/api";

export function RoomsPage() {
  const { token } = useAuth();
  const location = useLocation();
  const [rooms, setRooms] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let ignore = false;

    async function loadRooms() {
      try {
        const data = await api.rooms.list(token);
        if (!ignore) {
          setRooms(data.rooms);
        }
      } catch (loadError) {
        if (!ignore) {
          setError(loadError.message);
        }
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    }

    loadRooms();

    return () => {
      ignore = true;
    };
  }, [token]);

  if (isLoading) {
    return <div className="page-state">Loading rooms...</div>;
  }

  const isPhotographerView = location.pathname.startsWith("/app/client-rooms");

  return (
    <div className="space-y-6 lg:space-y-8">
      <section className="rounded-[36px] border border-white/80 bg-[linear-gradient(135deg,#fffaf5_0%,#ffffff_42%,#f4fbff_100%)] p-6 shadow-[0_24px_60px_rgba(15,23,42,0.06)] sm:p-8">
        <h2 className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-[2.7rem]">
          {isPhotographerView ? "Client rooms" : "My rooms"}
        </h2>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
          {isPhotographerView
            ? "Open a room to deliver final photos, invite the client, or follow the gallery."
            : "Every room keeps your people, behind-the-scenes photos, and final gallery in one place."}
        </p>
        <Link className="app-btn-primary mt-6 inline-flex h-12 items-center justify-center px-5 text-sm" to="/app/rooms/new">
          Create room
        </Link>
      </section>

      {error ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </div>
      ) : null}

      {rooms.length ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {rooms.map((room) => (
            <RoomCard key={room.id} room={room} />
          ))}
        </div>
      ) : (
        <div className="rounded-[32px] border border-dashed border-slate-200 bg-slate-50/90 px-6 py-10 text-center">
          <h3 className="text-xl font-semibold text-slate-950">No rooms yet</h3>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            Create your first room and invite your friends in less than one minute.
          </p>
          <Link className="app-btn-primary mt-5 inline-flex h-11 items-center justify-center px-4 text-sm" to="/app/rooms/new">
            Create your first room
          </Link>
        </div>
      )}
    </div>
  );
}
