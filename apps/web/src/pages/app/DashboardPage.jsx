import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Bot,
  Camera,
  Download,
  Images,
  ImageUp,
  MailPlus,
  Plus,
  UserRoundPlus,
  Users,
} from "lucide-react";
import { StatusBadge } from "../../components/StatusBadge";
import { useAuth } from "../../hooks/useAuth";
import { api } from "../../lib/api";
import { buildAppUser, buildDashboardData } from "../../lib/mockAppData";

function QuickAction({ description, icon: Icon, label, state, to }) {
  return (
    <Link
      className="group rounded-[24px] border border-white/80 bg-white/90 p-5 shadow-[0_14px_35px_rgba(15,23,42,0.05)] transition hover:-translate-y-1 hover:border-orange-200 hover:shadow-[0_20px_45px_rgba(15,23,42,0.08)]"
      state={state}
      to={to}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#fff7ed_0%,#ecfeff_100%)] text-slate-900">
          <Icon className="h-5 w-5" />
        </div>
        <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-slate-50 text-slate-500 transition group-hover:bg-orange-50 group-hover:text-orange-700">
          <Plus className="h-4 w-4" />
        </span>
      </div>
      <h3 className="mt-5 text-lg font-semibold text-slate-950">{label}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-500">{description}</p>
    </Link>
  );
}

function TrackingCard({ icon: Icon, label, value }) {
  return (
    <article className="rounded-[24px] border border-white/80 bg-white/90 p-5 shadow-[0_14px_35px_rgba(15,23,42,0.05)]">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">{label}</p>
          <p className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">{value}</p>
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-50 text-slate-700">
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </article>
  );
}

function ActivityItem({ label, value }) {
  return (
    <div className="flex flex-col gap-1 rounded-[22px] border border-slate-200 bg-slate-50/80 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm font-medium text-slate-600">{label}</p>
      <p className="text-sm font-semibold text-slate-950">{value}</p>
    </div>
  );
}

function countAcceptedPhotographers(invitations) {
  return (invitations.history || []).filter(
    (invitation) =>
      invitation.status === "accepted" && invitation.invitee?.role === "photographer",
  ).length;
}

function getLatestPhotoLabel(rawRooms) {
  const uploads = (rawRooms || [])
    .flatMap((room) =>
      (room.uploads || []).map((upload) => ({
        ...upload,
        roomName: room.title || room.name,
      })),
    )
    .filter(Boolean)
    .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));

  const latest = uploads[0];

  if (!latest) {
    return "No photos yet";
  }

  return latest.roomName ? `${latest.originalName || "Photo"} in ${latest.roomName}` : latest.originalName || "Photo uploaded";
}

export function DashboardPage() {
  const { token, user } = useAuth();
  const navigate = useNavigate();
  const appUser = useMemo(() => buildAppUser(user), [user]);
  const [dashboard, setDashboard] = useState(() => buildDashboardData(appUser));
  const [rawRooms, setRawRooms] = useState([]);
  const [roomInvitations, setRoomInvitations] = useState({
    pendingReceived: [],
    pendingSent: [],
    history: [],
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [activeInvitationId, setActiveInvitationId] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [dataMode, setDataMode] = useState("live");

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
          setRawRooms(data.rooms || []);
          setRoomInvitations(invitations);
          setDataMode("live");
        }
      } catch {
        if (!ignore) {
          setDashboard(buildDashboardData(appUser));
          setRawRooms([]);
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

  async function handleInvitationAction(invitationId, action) {
    try {
      setError("");
      setMessage("");
      setActiveInvitationId(invitationId);
      const response =
        action === "accept"
          ? await api.rooms.acceptInvitation(token, invitationId)
          : await api.rooms.rejectInvitation(token, invitationId);

      setMessage(response.message);
      const invitations = await api.rooms.listInvitations(token);
      setRoomInvitations(invitations);

      if (action === "accept" && response.roomId) {
        navigate(`/app/rooms/${response.roomId}`);
      }
    } catch (invitationError) {
      setError(invitationError.message);
    } finally {
      setActiveInvitationId("");
    }
  }

  if (isLoading) {
    return <div className="page-state">Loading dashboard...</div>;
  }

  const stats = dashboard.stats || [];
  const latestRooms = dashboard.latestRooms || [];
  const pendingReceived = roomInvitations.pendingReceived || [];
  const pendingSent = roomInvitations.pendingSent || [];
  const latestRoom = latestRooms[0]?.name || "No room created yet";
  const latestInvitation = pendingSent[0]?.invitee?.name
    ? `${pendingSent[0].invitee.name} invited to ${pendingSent[0].room?.title || "a room"}`
    : "No invitation sent yet";
  const latestPhoto = getLatestPhotoLabel(rawRooms);
  const totalRooms = stats.find((item) => item.key === "rooms")?.value ?? 0;
  const photosUploaded = stats.find((item) => item.key === "uploads")?.value ?? 0;
  const pendingInvitations = pendingReceived.length + pendingSent.length;
  const photographersJoined = countAcceptedPhotographers(roomInvitations);

  return (
    <div className="space-y-6 lg:space-y-7">
      <section className="rounded-[32px] border border-white/80 bg-[linear-gradient(135deg,#fffaf5_0%,#ffffff_46%,#f4fbff_100%)] p-6 shadow-[0_22px_55px_rgba(15,23,42,0.06)] sm:p-8">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
          <div className="max-w-3xl">
            <span className="inline-flex rounded-full border border-orange-200 bg-orange-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-orange-700">
              PixRoom+ workspace
            </span>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950 sm:text-[2.6rem]">
              Welcome, {appUser.firstName}
            </h2>
            <p className="mt-3 text-sm leading-6 text-slate-600 sm:text-base">
              Create a room, invite guests, add a photographer, then upload and download photos.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link className="app-btn-primary h-12 px-5 text-sm" to="/app/rooms/new">
              <Camera className="h-4 w-4" />
              Create Room
            </Link>
            <Link className="app-btn-secondary h-12 px-5 text-sm" to="/app/assistant">
              <Bot className="h-4 w-4" />
              Ask AI
            </Link>
          </div>
        </div>

        {dataMode === "mock" ? (
          <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            Live dashboard data is unavailable, so sample workspace data is shown.
          </div>
        ) : null}
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <QuickAction
          description="Start an event gallery."
          icon={Camera}
          label="Create a Room"
          to="/app/rooms/new"
        />
        <QuickAction
          description="Prepare guests for room invites."
          icon={Users}
          label="Invite Friends"
          to="/app/friends"
        />
        <QuickAction
          description="Find help for your event."
          icon={MailPlus}
          label="Invite Photographer"
          to="/app/photographers"
        />
        <QuickAction
          description="Browse available photographers."
          icon={UserRoundPlus}
          label="View Photographers"
          to="/app/photographers"
        />
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <TrackingCard icon={Images} label="Total Rooms" value={totalRooms} />
        <TrackingCard icon={ImageUp} label="Photos Uploaded" value={photosUploaded} />
        <TrackingCard icon={MailPlus} label="Pending Invitations" value={pendingInvitations} />
        <TrackingCard icon={UserRoundPlus} label="Photographers Joined" value={photographersJoined} />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1fr_0.9fr]">
        <section className="rounded-[28px] border border-white/80 bg-white/90 p-6 shadow-[0_18px_45px_rgba(15,23,42,0.05)]">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h3 className="text-xl font-semibold text-slate-950">Recent activity</h3>
              <p className="mt-1 text-sm text-slate-500">Track the work that matters.</p>
            </div>
            <Link className="text-sm font-semibold text-orange-700 transition hover:text-orange-800" to="/app/rooms">
              View my rooms
            </Link>
          </div>

          <div className="mt-5 grid gap-3">
            <ActivityItem label="Latest room created" value={latestRoom} />
            <ActivityItem label="Latest invitation sent" value={latestInvitation} />
            <ActivityItem label="Latest photo uploaded" value={latestPhoto} />
          </div>
        </section>

        <section
          className="rounded-[28px] border border-white/80 bg-white/90 p-6 shadow-[0_18px_45px_rgba(15,23,42,0.05)]"
          id="invitations"
        >
          <div className="flex items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-semibold text-slate-950">Invitations</h3>
              <p className="mt-1 text-sm text-slate-500">Accept or reject room invites.</p>
            </div>
            <StatusBadge label={`${pendingReceived.length} pending`} status="pending" />
          </div>

          {(message || error) ? (
            <div className="mt-4 space-y-3">
              {message ? (
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                  {message}
                </div>
              ) : null}
              {error ? (
                <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                  {error}
                </div>
              ) : null}
            </div>
          ) : null}

          <div className="mt-5 space-y-3">
            {pendingReceived.length ? (
              pendingReceived.slice(0, 4).map((invitation) => (
                <article
                  className="rounded-[22px] border border-slate-200 bg-slate-50/80 px-4 py-4"
                  key={invitation.id}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold text-slate-950">{invitation.room?.title}</p>
                      <p className="mt-1 text-sm text-slate-500">
                        From {invitation.inviter?.name || "Organizer"}
                      </p>
                    </div>
                    <StatusBadge status={invitation.status} />
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <button
                      className="app-btn-primary min-h-10 px-4 text-sm disabled:cursor-not-allowed disabled:opacity-60"
                      disabled={activeInvitationId === invitation.id}
                      onClick={() => handleInvitationAction(invitation.id, "accept")}
                      type="button"
                    >
                      {activeInvitationId === invitation.id ? "Working..." : "Accept"}
                    </button>
                    <button
                      className="app-btn-secondary min-h-10 px-4 text-sm disabled:cursor-not-allowed disabled:opacity-60"
                      disabled={activeInvitationId === invitation.id}
                      onClick={() => handleInvitationAction(invitation.id, "reject")}
                      type="button"
                    >
                      Reject
                    </button>
                  </div>
                </article>
              ))
            ) : (
              <div className="rounded-[22px] border border-dashed border-slate-200 bg-slate-50/80 px-4 py-8 text-center">
                <p className="font-semibold text-slate-950">No pending invitations</p>
                <p className="mt-2 text-sm text-slate-500">New room invites will appear here.</p>
              </div>
            )}
          </div>
        </section>
      </section>

      <section className="rounded-[28px] border border-slate-200 bg-[linear-gradient(180deg,#fff8f1_0%,#ffffff_100%)] p-6 shadow-[0_18px_45px_rgba(15,23,42,0.05)]">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-xl font-semibold text-slate-950">Main workflow</h3>
            <p className="mt-1 text-sm text-slate-500">
              Create your room, invite guests, add a photographer, then share and download photos.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link className="app-btn-ghost h-11 px-4 text-sm" to="/app/rooms">
              <Images className="h-4 w-4" />
              My Rooms
            </Link>
            <Link className="app-btn-ghost h-11 px-4 text-sm" to="/app/rooms">
              <Download className="h-4 w-4" />
              Photos
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
