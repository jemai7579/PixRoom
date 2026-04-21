import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Camera,
  CheckCircle2,
  ImagePlus,
  Search,
  UploadCloud,
  UserPlus,
  Users,
} from "lucide-react";
import { StatusBadge } from "../../components/StatusBadge";
import { useAuth } from "../../hooks/useAuth";
import { api } from "../../lib/api";
import { buildAppUser, buildDashboardData } from "../../lib/mockAppData";
import { PhotographerDashboardPage } from "./PhotographerDashboardPage";

function ActionCard({ description, icon: Icon, title, to }) {
  return (
    <Link
      className="group rounded-[30px] border border-white/80 bg-white/88 p-5 shadow-[0_18px_45px_rgba(15,23,42,0.05)] transition hover:-translate-y-1 hover:border-orange-200 hover:shadow-[0_22px_50px_rgba(15,23,42,0.08)]"
      to={to}
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#fff7ed_0%,#ecfeff_100%)] text-slate-900">
        <Icon className="h-5 w-5" />
      </div>
      <h3 className="mt-5 text-lg font-semibold text-slate-950">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-500">{description}</p>
      <div className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-slate-900 transition group-hover:text-orange-700">
        Open
        <ArrowRight className="h-4 w-4" />
      </div>
    </Link>
  );
}

function StepCard({ description, number, title }) {
  return (
    <article className="rounded-[28px] border border-white/80 bg-white/82 p-5 shadow-[0_14px_35px_rgba(15,23,42,0.05)]">
      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-orange-50 text-sm font-semibold text-orange-700">
        {number}
      </div>
      <h3 className="mt-4 text-lg font-semibold text-slate-950">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-500">{description}</p>
    </article>
  );
}

export function DashboardPage() {
  const { token, user } = useAuth();
  const navigate = useNavigate();
  const appUser = useMemo(() => buildAppUser(user), [user]);
  const [dashboard, setDashboard] = useState(() => buildDashboardData(appUser));
  const [joinCode, setJoinCode] = useState("");
  const [joinError, setJoinError] = useState("");
  const [isJoining, setIsJoining] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [dataMode, setDataMode] = useState("live");
  const [roomInvitations, setRoomInvitations] = useState({
    pendingReceived: [],
    pendingSent: [],
    history: [],
  });
  const [invitationMessage, setInvitationMessage] = useState("");
  const [invitationError, setInvitationError] = useState("");
  const [activeInvitationId, setActiveInvitationId] = useState("");

  useEffect(() => {
    let ignore = false;

    async function loadDashboard() {
      try {
        const [data, invitations] = await Promise.all([
          api.rooms.dashboard(token),
          api.rooms.listInvitations(token),
        ]);

        if (!ignore) {
          setDashboard(buildDashboardData(appUser, data));
          setRoomInvitations(invitations);
          setDataMode("live");
        }
      } catch {
        if (!ignore) {
          setDashboard(buildDashboardData(appUser));
          setRoomInvitations({ pendingReceived: [], pendingSent: [], history: [] });
          setDataMode("mock");
        }
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    }

    loadDashboard();

    return () => {
      ignore = true;
    };
  }, [appUser, token]);

  async function handleJoinRoom(event) {
    event.preventDefault();
    setJoinError("");

    if (!joinCode.trim()) {
      setJoinError("Enter a room code first.");
      return;
    }

    try {
      setIsJoining(true);
      const result = await api.rooms.join(token, joinCode.trim());
      setJoinCode("");
      navigate(`/app/rooms/${result.roomId}`);
    } catch (joinRoomError) {
      setJoinError(joinRoomError.message);
    } finally {
      setIsJoining(false);
    }
  }

  async function handleInvitationAction(invitationId, action) {
    try {
      setInvitationError("");
      setInvitationMessage("");
      setActiveInvitationId(invitationId);
      const response =
        action === "accept"
          ? await api.rooms.acceptInvitation(token, invitationId)
          : await api.rooms.rejectInvitation(token, invitationId);

      setInvitationMessage(response.message);
      const invitations = await api.rooms.listInvitations(token);
      setRoomInvitations(invitations);

      if (action === "accept" && response.roomId) {
        navigate(`/app/rooms/${response.roomId}`);
      }
    } catch (actionError) {
      setInvitationError(actionError.message);
    } finally {
      setActiveInvitationId("");
    }
  }

  if (user?.role === "photographer") {
    return <PhotographerDashboardPage />;
  }

  if (isLoading) {
    return <div className="page-state">Loading your home page...</div>;
  }

  const pendingInvites = roomInvitations.pendingReceived || [];
  const latestRooms = dashboard.latestRooms || [];

  return (
    <div className="space-y-6 lg:space-y-8">
      <section className="overflow-hidden rounded-[36px] border border-white/80 bg-[linear-gradient(135deg,#fffaf5_0%,#ffffff_40%,#f3fbff_100%)] p-6 shadow-[0_24px_60px_rgba(15,23,42,0.06)] sm:p-8">
        <div className="grid gap-8 xl:grid-cols-[1.15fr_0.85fr]">
          <div>
            <span className="inline-flex rounded-full border border-orange-200 bg-orange-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-orange-700">
              Start in 3 steps
            </span>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950 sm:text-[2.8rem]">
              Create a room, invite your people, and share every photo in one place.
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
              PixRoom+ is made for one simple journey: start a room for your event, invite guests,
              add a photographer if you need one, and keep behind-the-scenes and final photos together.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link className="app-btn-primary inline-flex h-12 items-center justify-center gap-2 px-5 text-sm" to="/app/rooms/new">
                <Camera className="h-4 w-4" />
                Create your room
              </Link>
              <Link className="app-btn-secondary inline-flex h-12 items-center justify-center gap-2 px-5 text-sm" to="/app/rooms">
                <ImagePlus className="h-4 w-4" />
                View my rooms
              </Link>
            </div>
          </div>

          <div className="rounded-[30px] border border-white/80 bg-white/86 p-5 shadow-[0_18px_45px_rgba(15,23,42,0.05)]">
            <p className="text-sm font-semibold text-slate-900">What you can do now</p>
            <div className="mt-5 grid gap-3">
              <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3">
                <span className="text-sm text-slate-600">My rooms</span>
                <strong className="text-slate-950">{dashboard.stats[0]?.value}</strong>
              </div>
              <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3">
                <span className="text-sm text-slate-600">Pending invites</span>
                <strong className="text-slate-950">{pendingInvites.length}</strong>
              </div>
              <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3">
                <span className="text-sm text-slate-600">Photos shared</span>
                <strong className="text-slate-950">{dashboard.stats[1]?.value}</strong>
              </div>
            </div>

            {dataMode === "mock" ? (
              <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                You are seeing sample activity right now.
              </div>
            ) : null}
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <StepCard
          number="1"
          title="Create your room"
          description="Pick a room name, choose the event type, and decide if it should be public or private."
        />
        <StepCard
          number="2"
          title="Invite your people"
          description="Invite friends directly, or share the room code if that is easier."
        />
        <StepCard
          number="3"
          title="Share your photos"
          description="Guests can add behind-the-scenes photos, and your photographer can upload the final gallery."
        />
      </section>

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

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <ActionCard
          title="Create a room"
          description="Start a room for a wedding, birthday, trip, or any event."
          icon={Camera}
          to="/app/rooms/new"
        />
        <ActionCard
          title="Join a room"
          description="Use a code from a friend and go straight into the room."
          icon={Users}
          to="/app/dashboard#join-room"
        />
        <ActionCard
          title="Invite friends"
          description="Build your friend list now so room invites take one tap later."
          icon={UserPlus}
          to="/app/friends"
        />
        <ActionCard
          title="Find a photographer"
          description="Browse simple photographer cards and save the ones you like."
          icon={Search}
          to="/app/photographers"
        />
        <ActionCard
          title="View my rooms"
          description="Open a room to upload photos, invite more people, or see the gallery."
          icon={ImagePlus}
          to="/app/rooms"
        />
        <ActionCard
          title="Upload photos"
          description="Open any room and add behind-the-scenes moments right away."
          icon={UploadCloud}
          to="/app/rooms"
        />
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <section
          className="rounded-[32px] border border-white/80 bg-white/88 p-6 shadow-[0_22px_55px_rgba(15,23,42,0.06)]"
          id="join-room"
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-xl font-semibold text-slate-950">Join a room</h3>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                If someone already invited you, just enter the room code here.
              </p>
            </div>
            <div className="rounded-2xl bg-slate-100 p-3 text-slate-700">
              <ArrowRight className="h-5 w-5" />
            </div>
          </div>

          <form className="mt-6 space-y-4" onSubmit={handleJoinRoom}>
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">Room code</span>
              <input
                className="app-field w-full"
                onChange={(event) => setJoinCode(event.target.value.toUpperCase())}
                placeholder="ROOM-8342"
                value={joinCode}
              />
            </label>

            {joinError ? (
              <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                {joinError}
              </div>
            ) : null}

            <button className="app-btn-primary inline-flex h-12 w-full items-center justify-center px-5 text-sm disabled:cursor-not-allowed disabled:opacity-60" disabled={isJoining} type="submit">
              {isJoining ? "Joining..." : "Join this room"}
            </button>
          </form>
        </section>

        <section className="rounded-[32px] border border-white/80 bg-white/88 p-6 shadow-[0_22px_55px_rgba(15,23,42,0.06)]">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-emerald-50 p-3 text-emerald-700">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-slate-950">Pending invitations</h3>
              <p className="text-sm text-slate-500">Accept a room invite and start sharing photos.</p>
            </div>
          </div>

          <div className="mt-5 space-y-3">
            {pendingInvites.length ? (
              pendingInvites.map((invitation) => (
                <article
                  key={invitation.id}
                  className="rounded-[24px] border border-slate-200 bg-[linear-gradient(180deg,#ffffff_0%,#f8fbff_100%)] p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-slate-950">{invitation.room?.title}</p>
                      <p className="mt-1 text-sm text-slate-500">
                        Invited by {invitation.inviter?.name || "a friend"}
                      </p>
                    </div>
                    <StatusBadge status={invitation.status} />
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    <button className="app-btn-primary inline-flex h-10 items-center justify-center px-4 text-sm disabled:cursor-not-allowed disabled:opacity-60" disabled={activeInvitationId === invitation.id} onClick={() => handleInvitationAction(invitation.id, "accept")} type="button">
                      {activeInvitationId === invitation.id ? "Working..." : "Accept"}
                    </button>
                    <button className="app-btn-secondary inline-flex h-10 items-center justify-center px-4 text-sm disabled:cursor-not-allowed disabled:opacity-60" disabled={activeInvitationId === invitation.id} onClick={() => handleInvitationAction(invitation.id, "reject")} type="button">
                      Not now
                    </button>
                  </div>
                </article>
              ))
            ) : (
              <div className="rounded-[24px] border border-dashed border-slate-200 bg-slate-50/90 px-5 py-8 text-center">
                <h4 className="text-lg font-semibold text-slate-950">No room invites yet</h4>
                <p className="mt-2 text-sm leading-6 text-slate-500">
                  When someone invites you to a room, it will show up here.
                </p>
              </div>
            )}
          </div>
        </section>
      </section>

      <section className="rounded-[32px] border border-white/80 bg-white/88 p-6 shadow-[0_22px_55px_rgba(15,23,42,0.06)]">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h3 className="text-2xl font-semibold tracking-tight text-slate-950">My rooms</h3>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Open a room to invite people, upload photos, or choose a photographer.
            </p>
          </div>
          <Link className="text-sm font-semibold text-slate-700 transition hover:text-slate-950" to="/app/rooms">
            See all rooms
          </Link>
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-3">
          {latestRooms.length ? (
            latestRooms.map((room) => (
              <article
                key={room.id}
                className="rounded-[28px] border border-slate-200 bg-[linear-gradient(180deg,#ffffff_0%,#f7fbff_100%)] p-5"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                      {room.type}
                    </span>
                    <h4 className="mt-4 text-lg font-semibold text-slate-950">{room.name}</h4>
                  </div>
                  <StatusBadge status={room.status === "Private" ? "private" : "accepted"} label={room.status} />
                </div>

                <div className="mt-5 grid grid-cols-2 gap-3">
                  <div className="rounded-2xl bg-slate-50 px-3 py-3">
                    <p className="text-xs uppercase tracking-[0.14em] text-slate-400">People</p>
                    <p className="mt-1 font-semibold text-slate-950">{room.participants}</p>
                  </div>
                  <div className="rounded-2xl bg-slate-50 px-3 py-3">
                    <p className="text-xs uppercase tracking-[0.14em] text-slate-400">Photos</p>
                    <p className="mt-1 font-semibold text-slate-950">{room.uploads}</p>
                  </div>
                </div>

                <div className="mt-5 flex items-center justify-between">
                  <span className="text-sm text-slate-500">{room.updatedAt}</span>
                  <Link
                    className="inline-flex items-center gap-2 text-sm font-semibold text-slate-900 transition hover:text-orange-700"
                    to={room.href}
                  >
                    Open room
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </article>
            ))
          ) : (
            <div className="rounded-[28px] border border-dashed border-slate-200 bg-slate-50/90 px-6 py-10 text-center lg:col-span-3">
              <h4 className="text-lg font-semibold text-slate-950">No rooms yet</h4>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                Create your first room and invite your friends in less than one minute.
              </p>
              <Link className="app-btn-primary mt-5 inline-flex h-11 items-center justify-center px-4 text-sm" to="/app/rooms/new">
                Create your first room
              </Link>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
