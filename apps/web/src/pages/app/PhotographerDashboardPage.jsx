import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  CalendarDays,
  Camera,
  Check,
  Clock3,
  FolderOpen,
  ImagePlus,
  MessageSquareText,
  X,
} from "lucide-react";
import { StatusBadge } from "../../components/StatusBadge";
import { useAuth } from "../../hooks/useAuth";
import { api } from "../../lib/api";
import { buildAppUser } from "../../lib/mockAppData";

function ActionCard({ description, icon: Icon, title, to }) {
  return (
    <Link
      className="rounded-[28px] border border-white/80 bg-white/88 p-5 shadow-[0_18px_45px_rgba(15,23,42,0.05)] transition hover:-translate-y-1 hover:border-orange-200 hover:shadow-[0_22px_50px_rgba(15,23,42,0.08)]"
      to={to}
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#fff7ed_0%,#ecfeff_100%)] text-slate-900">
        <Icon className="h-5 w-5" />
      </div>
      <h3 className="mt-5 text-lg font-semibold text-slate-950">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-500">{description}</p>
    </Link>
  );
}

function formatInvitationDate(dateValue) {
  if (!dateValue) {
    return "Date unavailable";
  }

  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return "Date unavailable";
  }

  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
  }).format(date);
}

export function PhotographerDashboardPage() {
  const { token, user } = useAuth();
  const appUser = useMemo(() => buildAppUser(user), [user]);
  const [rooms, setRooms] = useState([]);
  const [bookingRequests, setBookingRequests] = useState([]);
  const [roomInvitations, setRoomInvitations] = useState([]);
  const [invitationMessage, setInvitationMessage] = useState("");
  const [invitationError, setInvitationError] = useState("");
  const [activeInvitationId, setActiveInvitationId] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let ignore = false;

    async function loadWorkspace() {
      try {
        const [roomData, bookingData, invitationData] = await Promise.all([
          api.rooms.list(token),
          api.marketplace.listBookingRequests(token),
          api.photographer.listInvitations(token),
        ]);

        if (!ignore) {
          setRooms(roomData.rooms);
          setBookingRequests(bookingData.bookingRequests);
          setRoomInvitations(invitationData.invitations);
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

    loadWorkspace();

    return () => {
      ignore = true;
    };
  }, [token]);

  async function refreshInvitations() {
    const [roomData, invitationData] = await Promise.all([
      api.rooms.list(token),
      api.photographer.listInvitations(token),
    ]);

    setRooms(roomData.rooms);
    setRoomInvitations(invitationData.invitations);
  }

  async function handleInvitationAction(invitationId, action) {
    try {
      setInvitationError("");
      setInvitationMessage("");
      setActiveInvitationId(invitationId);

      const response =
        action === "accept"
          ? await api.invitations.accept(token, invitationId)
          : await api.invitations.reject(token, invitationId);

      setInvitationMessage(response.message);
      await refreshInvitations();
    } catch (actionError) {
      setInvitationError(actionError.message);
    } finally {
      setActiveInvitationId("");
    }
  }

  const pendingRequests = bookingRequests.filter((request) => request.status === "pending");
  const pendingRoomInvitations = roomInvitations.filter(
    (invitation) => invitation.status === "pending",
  );
  const activeClientEvents = bookingRequests.filter(
    (request) => request.status === "accepted" && request.eventDate,
  );

  const profileCompleteness = useMemo(() => {
    const checks = [
      Boolean(appUser.displayName),
      Boolean(appUser.bio),
      Boolean(appUser.location),
      Boolean(appUser.specialties.length),
      Boolean(appUser.priceRange),
      Boolean(appUser.portfolioImages.length),
    ];

    return Math.round((checks.filter(Boolean).length / checks.length) * 100);
  }, [appUser]);

  if (isLoading) {
    return <div className="page-state">Loading your photographer home...</div>;
  }

  return (
    <div className="space-y-6 lg:space-y-8">
      <section className="rounded-[36px] border border-white/80 bg-[linear-gradient(135deg,#fffaf5_0%,#ffffff_42%,#f4fbff_100%)] p-6 shadow-[0_24px_60px_rgba(15,23,42,0.06)] sm:p-8">
        <div className="grid gap-8 xl:grid-cols-[1.08fr_0.92fr]">
          <div>
            <span className="inline-flex rounded-full border border-orange-200 bg-orange-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-orange-700">
              Photographer home
            </span>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950 sm:text-[2.7rem]">
              Keep your requests, client rooms, and final photos easy to manage.
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
              PixRoom+ should help you do three things quickly: respond to requests, work inside
              client rooms, and deliver the final gallery.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3 xl:grid-cols-1">
            <div className="rounded-[28px] border border-white/80 bg-white/88 p-5 shadow-[0_18px_45px_rgba(15,23,42,0.05)]">
              <p className="text-xs uppercase tracking-[0.16em] text-slate-400">Pending requests</p>
              <p className="mt-2 text-3xl font-semibold text-slate-950">{pendingRequests.length}</p>
            </div>
            <div className="rounded-[28px] border border-white/80 bg-white/88 p-5 shadow-[0_18px_45px_rgba(15,23,42,0.05)]">
              <p className="text-xs uppercase tracking-[0.16em] text-slate-400">Room invitations</p>
              <p className="mt-2 text-3xl font-semibold text-slate-950">{pendingRoomInvitations.length}</p>
            </div>
            <div className="rounded-[28px] border border-white/80 bg-white/88 p-5 shadow-[0_18px_45px_rgba(15,23,42,0.05)]">
              <p className="text-xs uppercase tracking-[0.16em] text-slate-400">Client rooms</p>
              <p className="mt-2 text-3xl font-semibold text-slate-950">{rooms.length}</p>
            </div>
            <div className="rounded-[28px] border border-white/80 bg-white/88 p-5 shadow-[0_18px_45px_rgba(15,23,42,0.05)]">
              <p className="text-xs uppercase tracking-[0.16em] text-slate-400">Profile ready</p>
              <p className="mt-2 text-3xl font-semibold text-slate-950">{profileCompleteness}%</p>
            </div>
          </div>
        </div>
      </section>

      {error ? (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </div>
      ) : null}

      {(invitationMessage || invitationError) && (
        <div className="space-y-3">
          {invitationMessage ? (
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
              {invitationMessage}
            </div>
          ) : null}
          {invitationError ? (
            <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
              {invitationError}
            </div>
          ) : null}
        </div>
      )}

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <ActionCard
          description="See new event requests and answer them quickly."
          icon={MessageSquareText}
          title="Requests"
          to="/app/requests"
        />
        <ActionCard
          description="Open the rooms where clients and final photos live."
          icon={FolderOpen}
          title="Client rooms"
          to="/app/client-rooms"
        />
        <ActionCard
          description="Add your best work so clients understand your style."
          icon={ImagePlus}
          title="Portfolio"
          to="/app/portfolio"
        />
        <ActionCard
          description="Show whether you are open for new bookings."
          icon={Clock3}
          title="Availability"
          to="/app/availability"
        />
      </section>

      <section className="rounded-[32px] border border-white/80 bg-white/88 p-6 shadow-[0_22px_55px_rgba(15,23,42,0.06)]">
        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-emerald-50 p-3 text-emerald-700">
            <FolderOpen className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-slate-950">Room Invitations</h3>
            <p className="text-sm text-slate-500">Accept a room invite before it appears in your client rooms.</p>
          </div>
        </div>

        <div className="mt-5 space-y-3">
          {roomInvitations.length ? (
            roomInvitations.map((invitation) => (
              <article
                key={invitation.id}
                className="rounded-[24px] border border-slate-200 bg-[linear-gradient(180deg,#ffffff_0%,#f8fbff_100%)] px-4 py-4"
              >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-medium text-slate-900">{invitation.room?.title}</p>
                      <StatusBadge status={invitation.status} />
                    </div>
                    <p className="mt-1 text-sm text-slate-500">
                      Organizer: {invitation.inviter?.name || "Organizer"}
                    </p>
                    <p className="mt-1 text-sm text-slate-500">
                      Sent {formatInvitationDate(invitation.createdAt)}
                    </p>
                  </div>

                  {invitation.status === "pending" ? (
                    <div className="flex flex-wrap gap-2">
                      <button
                        className="app-btn-primary inline-flex h-10 items-center justify-center gap-2 px-4 text-sm disabled:cursor-not-allowed disabled:opacity-60"
                        disabled={activeInvitationId === invitation.id}
                        onClick={() => handleInvitationAction(invitation.id, "accept")}
                        type="button"
                      >
                        <Check className="h-4 w-4" />
                        {activeInvitationId === invitation.id ? "Working..." : "Accept"}
                      </button>
                      <button
                        className="app-btn-secondary inline-flex h-10 items-center justify-center gap-2 px-4 text-sm disabled:cursor-not-allowed disabled:opacity-60"
                        disabled={activeInvitationId === invitation.id}
                        onClick={() => handleInvitationAction(invitation.id, "reject")}
                        type="button"
                      >
                        <X className="h-4 w-4" />
                        Reject
                      </button>
                    </div>
                  ) : null}
                </div>
              </article>
            ))
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/90 px-4 py-6 text-sm text-slate-500">
              No room invitations yet.
            </div>
          )}
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <section className="rounded-[32px] border border-white/80 bg-white/88 p-6 shadow-[0_22px_55px_rgba(15,23,42,0.06)]">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-violet-50 p-3 text-violet-700">
              <MessageSquareText className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-slate-950">Requests waiting for you</h3>
              <p className="text-sm text-slate-500">Reply here first so no lead gets lost.</p>
            </div>
          </div>

          <div className="mt-5 space-y-3">
            {pendingRequests.length ? (
              pendingRequests.slice(0, 5).map((request) => (
                <article
                  key={request.id}
                  className="rounded-[24px] border border-slate-200 bg-[linear-gradient(180deg,#ffffff_0%,#f8fbff_100%)] px-4 py-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-medium text-slate-900">{request.client?.name}</p>
                      <p className="mt-1 text-sm text-slate-500">{request.eventType || "Event request"}</p>
                      <p className="mt-1 text-sm text-slate-500">{request.location || "Location not shared yet"}</p>
                    </div>
                    <StatusBadge status={request.status} />
                  </div>
                </article>
              ))
            ) : (
              <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/90 px-4 py-6 text-sm text-slate-500">
                No pending requests right now.
              </div>
            )}
          </div>
        </section>

        <section className="rounded-[32px] border border-white/80 bg-white/88 p-6 shadow-[0_22px_55px_rgba(15,23,42,0.06)]">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-sky-50 p-3 text-sky-700">
              <CalendarDays className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-slate-950">Upcoming events</h3>
              <p className="text-sm text-slate-500">Accepted work that needs your attention soon.</p>
            </div>
          </div>

          <div className="mt-5 space-y-3">
            {activeClientEvents.length ? (
              activeClientEvents.slice(0, 5).map((request) => (
                <article
                  key={request.id}
                  className="rounded-[24px] border border-slate-200 bg-[linear-gradient(180deg,#ffffff_0%,#f8fbff_100%)] px-4 py-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-medium text-slate-900">{request.eventType}</p>
                      <p className="mt-1 text-sm text-slate-500">
                        {request.client?.name} · {new Date(request.eventDate).toLocaleDateString()}
                      </p>
                      <p className="mt-1 text-sm text-slate-500">{request.location || "Location pending"}</p>
                    </div>
                    <StatusBadge status={request.status} />
                  </div>
                </article>
              ))
            ) : (
              <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/90 px-4 py-6 text-sm text-slate-500">
                Upcoming accepted events will appear here.
              </div>
            )}
          </div>
        </section>
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <section className="rounded-[32px] border border-slate-200 bg-[linear-gradient(180deg,#fff8f1_0%,#ffffff_100%)] p-6 shadow-[0_20px_50px_rgba(15,23,42,0.05)]">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-white p-3 text-slate-700 shadow-sm">
              <Camera className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-slate-950">Your profile</h3>
              <p className="text-sm text-slate-500">Make it easy for clients to trust what they see.</p>
            </div>
          </div>

          <div className="mt-5 rounded-[24px] border border-slate-200 bg-white px-4 py-4">
            <p className="font-medium text-slate-900">{appUser.displayName}</p>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              {appUser.bio || "Add a short bio so people understand your photography style."}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <StatusBadge
                label={appUser.isAvailable ? "Available now" : "Currently booked"}
                status={appUser.isAvailable ? "accepted" : "cancelled"}
              />
              {appUser.specialties.slice(0, 2).map((specialty) => (
                <StatusBadge key={specialty} label={specialty} status="saved" />
              ))}
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-3">
            <Link className="app-btn-primary inline-flex h-11 items-center justify-center px-4 text-sm" to="/app/settings">
              Edit profile
            </Link>
            <Link className="app-btn-secondary inline-flex h-11 items-center justify-center px-4 text-sm" to="/app/portfolio">
              Open portfolio
            </Link>
          </div>
        </section>

        <section className="rounded-[32px] border border-white/80 bg-white/88 p-6 shadow-[0_22px_55px_rgba(15,23,42,0.06)]">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-emerald-50 p-3 text-emerald-700">
              <FolderOpen className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-slate-950">Client rooms</h3>
              <p className="text-sm text-slate-500">Open a room when you need to upload final photos.</p>
            </div>
          </div>

          <div className="mt-5 space-y-3">
            {rooms.length ? (
              rooms.slice(0, 5).map((room) => (
                <article
                  key={room.id}
                  className="flex flex-col gap-3 rounded-[24px] border border-slate-200 bg-[linear-gradient(180deg,#ffffff_0%,#f8fbff_100%)] px-4 py-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="font-medium text-slate-900">{room.title}</p>
                    <p className="mt-1 text-sm text-slate-500">{room.code}</p>
                  </div>
                  <Link className="app-btn-primary inline-flex h-10 items-center justify-center px-4 text-sm" to={`/app/rooms/${room.id}`}>
                    Open room
                  </Link>
                </article>
              ))
            ) : (
              <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/90 px-4 py-6 text-sm text-slate-500">
                No client rooms yet.
              </div>
            )}
          </div>
        </section>
      </section>
    </div>
  );
}
