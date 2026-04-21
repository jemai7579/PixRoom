import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import {
  ChevronLeft,
  ChevronRight,
  Camera,
  Check,
  Copy,
  Download,
  LoaderCircle,
  MailPlus,
  MessageSquareText,
  Search,
  ShieldCheck,
  Square,
  UploadCloud,
  Users,
  X,
} from "lucide-react";
import { InviteFriendsModal } from "../../components/InviteFriendsModal";
import { StatusBadge } from "../../components/StatusBadge";
import { useAuth } from "../../hooks/useAuth";
import { api, getAssetUrl } from "../../lib/api";

const photoTabs = [
  { id: "all", label: "All photos" },
  { id: "guest", label: "Guest photos" },
  { id: "photographer", label: "Photographer photos" },
];

function getPhotographerUploads(uploads) {
  return uploads.filter((upload) => {
    const role = upload.uploadedBy?.role || upload.uploadedBy?.userRole;
    return (
      role === "photographer" ||
      upload.category === "photographer" ||
      upload.kind === "photographer" ||
      upload.isFinal === true
    );
  });
}

function getPhotoTypeLabel(upload) {
  const role = upload.uploadedBy?.role || upload.uploadedBy?.userRole;

  return role === "photographer" ||
    upload.category === "photographer" ||
    upload.kind === "photographer" ||
    upload.isFinal === true
    ? "Photographer photo"
    : "Guest photo";
}

function formatUploadDate(dateValue) {
  if (!dateValue) {
    return "Upload date unavailable";
  }

  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return "Upload date unavailable";
  }

  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function EmptyGallery({ description, title }) {
  return (
    <div className="rounded-[28px] border border-dashed border-slate-200 bg-slate-50/90 px-6 py-10 text-center">
      <h4 className="text-lg font-semibold text-slate-950">{title}</h4>
      <p className="mt-2 text-sm leading-6 text-slate-500">{description}</p>
    </div>
  );
}

function getZipFilename(roomTitle) {
  const safeTitle = String(roomTitle || "pixroom-room")
    .trim()
    .replace(/[^a-zA-Z0-9._-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  return `${safeTitle || "pixroom-room"}-photos.zip`;
}

export function RoomDetailsPage() {
  const { roomId } = useParams();
  const { token } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [room, setRoom] = useState(null);
  const [roomInvitations, setRoomInvitations] = useState([]);
  const [friends, setFriends] = useState([]);
  const [message, setMessage] = useState("");
  const [comment, setComment] = useState("");
  const [file, setFile] = useState(null);
  const [activeTab, setActiveTab] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [inviteActionId, setInviteActionId] = useState("");
  const [selectedPhotoIds, setSelectedPhotoIds] = useState([]);
  const [previewPhotoId, setPreviewPhotoId] = useState("");
  const [downloadError, setDownloadError] = useState("");
  const [downloadingPhotoId, setDownloadingPhotoId] = useState("");
  const [isDownloadingSelected, setIsDownloadingSelected] = useState(false);
  const [isDownloadingAll, setIsDownloadingAll] = useState(false);
  const [error, setError] = useState("");
  const [inviteError, setInviteError] = useState("");
  const [copyMessage, setCopyMessage] = useState("");

  async function loadRoom() {
    const data = await api.rooms.get(token, roomId);
    setRoom(data.room);
    return data.room;
  }

  async function loadInvitationTools() {
    const [friendData, invitationData] = await Promise.all([
      api.social.overview(token),
      api.rooms.listRoomInvitations(token, roomId),
    ]);

    setFriends(friendData.friends);
    setRoomInvitations(invitationData.invitations);
  }

  async function refreshRoom() {
    const nextRoom = await loadRoom();

    if (nextRoom.canManageInvitations) {
      await loadInvitationTools();
    }
  }

  useEffect(() => {
    let ignore = false;

    async function loadPage() {
      try {
        setError("");
        const nextRoom = await api.rooms.get(token, roomId);

        if (ignore) {
          return;
        }

        setRoom(nextRoom.room);

        if (nextRoom.room.canManageInvitations) {
          const [friendData, invitationData] = await Promise.all([
            api.social.overview(token),
            api.rooms.listRoomInvitations(token, roomId),
          ]);

          if (!ignore) {
            setFriends(friendData.friends);
            setRoomInvitations(invitationData.invitations);
          }
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

    loadPage();

    return () => {
      ignore = true;
    };
  }, [roomId, token]);

  useEffect(() => {
    if (!location.state?.openInviteFriends) {
      return;
    }

    setIsInviteModalOpen(true);
    navigate(location.pathname, { replace: true, state: {} });
  }, [location.pathname, location.state, navigate]);

  async function handleUpload(event) {
    event.preventDefault();
    setMessage("");
    setError("");

    if (!file) {
      setError("Choose a photo first.");
      return;
    }

    try {
      setIsUploading(true);
      await api.rooms.upload(token, roomId, file);
      setFile(null);
      setMessage("Photo uploaded.");
      await refreshRoom();
    } catch (uploadError) {
      setError(uploadError.message);
    } finally {
      setIsUploading(false);
    }
  }

  async function handleComment(event) {
    event.preventDefault();
    setMessage("");
    setError("");

    if (!comment.trim()) {
      setError("Write a message first.");
      return;
    }

    try {
      setIsSending(true);
      await api.rooms.addComment(token, roomId, comment);
      setComment("");
      setMessage("Message sent.");
      await refreshRoom();
    } catch (commentError) {
      setError(commentError.message);
    } finally {
      setIsSending(false);
    }
  }

  async function handleInvite(friendId) {
    try {
      setInviteActionId(friendId);
      setInviteError("");
      setMessage("");
      await api.rooms.inviteFriend(token, roomId, friendId);
      setMessage("Invitation sent.");
      await loadInvitationTools();
    } catch (inviteActionError) {
      setInviteError(inviteActionError.message);
    } finally {
      setInviteActionId("");
    }
  }

  async function handleCopyCode() {
    try {
      await navigator.clipboard.writeText(room?.code || "");
      setCopyMessage("Room code copied.");
      window.setTimeout(() => setCopyMessage(""), 2000);
    } catch {
      setCopyMessage("Could not copy the code.");
    }
  }

  const uploads = useMemo(() => room?.uploads || [], [room?.uploads]);
  const photographerUploads = useMemo(() => getPhotographerUploads(uploads), [uploads]);
  const guestUploads = useMemo(
    () => uploads.filter((upload) => !photographerUploads.includes(upload)),
    [photographerUploads, uploads],
  );
  const activeUploads =
    activeTab === "all" ? uploads : activeTab === "guest" ? guestUploads : photographerUploads;
  const activeUploadIds = useMemo(
    () => activeUploads.map((upload) => upload._id).filter(Boolean),
    [activeUploads],
  );
  const previewIndex = activeUploads.findIndex((upload) => upload._id === previewPhotoId);
  const previewPhoto = previewIndex >= 0 ? activeUploads[previewIndex] : null;
  const hasPreviousPhoto = previewIndex > 0;
  const hasNextPhoto = previewIndex >= 0 && previewIndex < activeUploads.length - 1;
  const selectedCount = selectedPhotoIds.length;
  const selectedActiveCount = activeUploadIds.filter((photoId) => selectedPhotoIds.includes(photoId)).length;
  const areAllActiveSelected = activeUploadIds.length > 0 && selectedActiveCount === activeUploadIds.length;
  const activeTabLabel =
    activeTab === "all"
      ? "Download all photos"
      : activeTab === "guest"
        ? "Download all guest photos"
        : "Download all photographer photos";

  useEffect(() => {
    setSelectedPhotoIds((current) => current.filter((photoId) => uploads.some((upload) => upload._id === photoId)));
  }, [uploads]);

  useEffect(() => {
    if (!previewPhotoId) {
      return;
    }

    if (!activeUploads.some((upload) => upload._id === previewPhotoId)) {
      setPreviewPhotoId(activeUploads[0]?._id || "");
    }
  }, [activeUploads, previewPhotoId]);

  useEffect(() => {
    if (!previewPhoto) {
      return undefined;
    }

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        setPreviewPhotoId("");
        return;
      }

      if (event.key === "ArrowLeft" && hasPreviousPhoto) {
        setPreviewPhotoId(activeUploads[previewIndex - 1]._id);
      }

      if (event.key === "ArrowRight" && hasNextPhoto) {
        setPreviewPhotoId(activeUploads[previewIndex + 1]._id);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [activeUploads, hasNextPhoto, hasPreviousPhoto, previewIndex, previewPhoto]);

  function togglePhotoSelection(photoId) {
    setSelectedPhotoIds((current) =>
      current.includes(photoId) ? current.filter((id) => id !== photoId) : [...current, photoId],
    );
  }

  function handleSelectAll() {
    setSelectedPhotoIds((current) => {
      const next = new Set(current);
      activeUploadIds.forEach((photoId) => next.add(photoId));
      return Array.from(next);
    });
  }

  function handleClearSelection() {
    setSelectedPhotoIds([]);
  }

  function openPreview(photoId) {
    setPreviewPhotoId(photoId);
  }

  function closePreview() {
    setPreviewPhotoId("");
  }

  function showPreviousPhoto() {
    if (!hasPreviousPhoto) {
      return;
    }

    setPreviewPhotoId(activeUploads[previewIndex - 1]._id);
  }

  function showNextPhoto() {
    if (!hasNextPhoto) {
      return;
    }

    setPreviewPhotoId(activeUploads[previewIndex + 1]._id);
  }

  async function handleSingleDownload(upload) {
    try {
      setDownloadError("");
      setDownloadingPhotoId(upload._id);
      await api.rooms.downloadPhoto(token, upload._id, upload.originalName || "pixroom-photo");
    } catch (downloadActionError) {
      setDownloadError(downloadActionError.message || "Could not download this photo.");
    } finally {
      setDownloadingPhotoId("");
    }
  }

  async function handleBulkDownload(photoIds, fallbackName, setLoadingState, emptyMessage) {
    if (!photoIds.length) {
      setDownloadError(emptyMessage);
      return;
    }

    try {
      setDownloadError("");
      setLoadingState(true);
      await api.rooms.downloadRoomPhotos(token, roomId, { fallbackName, photoIds });
    } catch (downloadActionError) {
      setDownloadError(downloadActionError.message || "Could not prepare ZIP file.");
    } finally {
      setLoadingState(false);
    }
  }

  if (isLoading) {
    return <div className="page-state">Loading room...</div>;
  }

  if (!room) {
    return <div className="page-state">Room unavailable.</div>;
  }

  const pendingInvitations = roomInvitations.filter((invitation) => invitation.status === "pending");
  const acceptedInvitations = roomInvitations.filter((invitation) => invitation.status === "accepted");

  return (
    <>
      {previewPhoto ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/72 px-3 py-4 backdrop-blur-md sm:px-6"
          onClick={closePreview}
          role="dialog"
          aria-modal="true"
          aria-label="Photo preview"
        >
          <div
            className="relative flex max-h-full w-full max-w-6xl flex-col overflow-hidden rounded-[30px] border border-white/15 bg-[linear-gradient(180deg,rgba(255,250,245,0.98)_0%,rgba(255,255,255,0.97)_100%)] shadow-[0_32px_90px_rgba(15,23,42,0.35)] lg:flex-row"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              aria-label="Close preview"
              className="absolute right-4 top-4 z-20 inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/80 bg-white/95 text-slate-700 shadow-sm transition hover:bg-orange-50"
              onClick={closePreview}
              type="button"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="relative flex min-h-[320px] flex-1 items-center justify-center bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.28),transparent_55%),linear-gradient(180deg,#1e293b_0%,#0f172a_100%)] p-4 sm:p-6">
              <button
                aria-label="Previous photo"
                className="absolute left-3 top-1/2 z-10 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-2xl border border-white/15 bg-white/10 text-white backdrop-blur transition hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-40 sm:left-5"
                disabled={!hasPreviousPhoto}
                onClick={showPreviousPhoto}
                type="button"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>

              <img
                alt={previewPhoto.originalName || "Room upload"}
                className="max-h-[70vh] w-full rounded-[24px] object-contain lg:max-h-[78vh]"
                src={getAssetUrl(previewPhoto.url)}
              />

              <button
                aria-label="Next photo"
                className="absolute right-3 top-1/2 z-10 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-2xl border border-white/15 bg-white/10 text-white backdrop-blur transition hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-40 sm:right-5"
                disabled={!hasNextPhoto}
                onClick={showNextPhoto}
                type="button"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>

            <aside className="flex w-full shrink-0 flex-col border-t border-slate-200/80 bg-white/90 p-5 sm:p-6 lg:w-[360px] lg:border-l lg:border-t-0">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-orange-600">
                  {getPhotoTypeLabel(previewPhoto)}
                </p>
                <h3 className="mt-3 text-xl font-semibold text-slate-950">
                  {previewPhoto.originalName || "Shared photo"}
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Browse the current {photoTabs.find((tab) => tab.id === activeTab)?.label.toLowerCase()} collection
                  without leaving the room.
                </p>
              </div>

              <div className="mt-6 grid gap-3">
                <div className="rounded-[24px] border border-slate-200 bg-slate-50/80 px-4 py-4">
                  <p className="text-xs uppercase tracking-[0.16em] text-slate-400">File name</p>
                  <p className="mt-2 text-sm font-medium text-slate-900">
                    {previewPhoto.originalName || "Shared photo"}
                  </p>
                </div>
                <div className="rounded-[24px] border border-slate-200 bg-slate-50/80 px-4 py-4">
                  <p className="text-xs uppercase tracking-[0.16em] text-slate-400">Uploaded by</p>
                  <p className="mt-2 text-sm font-medium text-slate-900">
                    {previewPhoto.uploadedBy?.name || "Participant"}
                  </p>
                </div>
                <div className="rounded-[24px] border border-slate-200 bg-slate-50/80 px-4 py-4">
                  <p className="text-xs uppercase tracking-[0.16em] text-slate-400">Upload date</p>
                  <p className="mt-2 text-sm font-medium text-slate-900">
                    {formatUploadDate(previewPhoto.createdAt)}
                  </p>
                </div>
                <div className="rounded-[24px] border border-slate-200 bg-slate-50/80 px-4 py-4">
                  <p className="text-xs uppercase tracking-[0.16em] text-slate-400">Position</p>
                  <p className="mt-2 text-sm font-medium text-slate-900">
                    {previewIndex + 1} of {activeUploads.length}
                  </p>
                </div>
              </div>

              <div className="mt-6 flex flex-col gap-3">
                <button
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-orange-200 bg-orange-500 px-4 py-3 text-sm font-semibold text-white shadow-[0_12px_24px_rgba(249,115,22,0.22)] transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
                  disabled={
                    isDownloadingSelected ||
                    isDownloadingAll ||
                    downloadingPhotoId === previewPhoto._id
                  }
                  onClick={() => handleSingleDownload(previewPhoto)}
                  type="button"
                >
                  {downloadingPhotoId === previewPhoto._id ? (
                    <LoaderCircle className="h-4 w-4 animate-spin" />
                  ) : (
                    <Download className="h-4 w-4" />
                  )}
                  Download photo
                </button>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    className="inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-orange-200 hover:bg-orange-50 disabled:cursor-not-allowed disabled:opacity-60"
                    disabled={!hasPreviousPhoto}
                    onClick={showPreviousPhoto}
                    type="button"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </button>
                  <button
                    className="inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-orange-200 hover:bg-orange-50 disabled:cursor-not-allowed disabled:opacity-60"
                    disabled={!hasNextPhoto}
                    onClick={showNextPhoto}
                    type="button"
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </aside>
          </div>
        </div>
      ) : null}

      <InviteFriendsModal
        error={inviteError}
        friends={friends}
        invitations={roomInvitations}
        isOpen={isInviteModalOpen}
        isSubmittingId={inviteActionId}
        onClose={() => setIsInviteModalOpen(false)}
        onInvite={handleInvite}
      />

      <div className="space-y-6 lg:space-y-8">
        <section className="rounded-[36px] border border-white/80 bg-[linear-gradient(135deg,#fffaf5_0%,#ffffff_42%,#f3fbff_100%)] p-6 shadow-[0_24px_60px_rgba(15,23,42,0.06)] sm:p-8">
          <div className="grid gap-8 xl:grid-cols-[1.1fr_0.9fr]">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <span className="inline-flex rounded-full border border-orange-200 bg-orange-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-orange-700">
                  Your room
                </span>
                <StatusBadge
                  label={room.visibility === "private" ? "Private room" : "Public room"}
                  status={room.visibility === "private" ? "saved" : "live"}
                />
              </div>
              <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950 sm:text-[2.7rem]">
                {room.title}
              </h2>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
                {room.description ||
                  "Invite people, upload behind-the-scenes moments, and keep your final gallery here too."}
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                {room.canManageInvitations ? (
                  <button className="app-btn-primary inline-flex h-12 items-center justify-center gap-2 px-5 text-sm" onClick={() => setIsInviteModalOpen(true)} type="button">
                    <MailPlus className="h-4 w-4" />
                    Invite people
                  </button>
                ) : null}
                <label className="app-btn-secondary inline-flex h-12 cursor-pointer items-center justify-center gap-2 px-5 text-sm">
                  <UploadCloud className="h-4 w-4" />
                  Upload photos
                  <input
                    accept="image/*"
                    className="hidden"
                    onChange={(event) => setFile(event.target.files?.[0] || null)}
                    type="file"
                  />
                </label>
                <Link className="app-btn-secondary inline-flex h-12 items-center justify-center gap-2 px-5 text-sm" to="/app/photographers">
                  <Search className="h-4 w-4" />
                  Choose photographer
                </Link>
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-[28px] border border-white/80 bg-white/88 p-5 shadow-[0_18px_45px_rgba(15,23,42,0.05)]">
                  <p className="text-xs uppercase tracking-[0.16em] text-slate-400">People</p>
                  <p className="mt-2 text-3xl font-semibold text-slate-950">{room.membersCount || 0}</p>
                  <p className="mt-2 text-sm text-slate-500">Already in this room</p>
                </div>
                <div className="rounded-[28px] border border-white/80 bg-white/88 p-5 shadow-[0_18px_45px_rgba(15,23,42,0.05)]">
                  <p className="text-xs uppercase tracking-[0.16em] text-slate-400">Photos</p>
                  <p className="mt-2 text-3xl font-semibold text-slate-950">{room.uploadsCount || uploads.length}</p>
                  <p className="mt-2 text-sm text-slate-500">Shared in this room</p>
                </div>
              </div>

              <div className="rounded-[28px] border border-slate-200 bg-white/90 p-5">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">Room code</p>
                    <p className="mt-1 text-2xl font-semibold tracking-[0.18em] text-slate-950">{room.code}</p>
                  </div>
                  <button className="app-btn-secondary inline-flex h-11 items-center justify-center gap-2 px-4 text-sm" onClick={handleCopyCode} type="button">
                    <Copy className="h-4 w-4" />
                    Copy
                  </button>
                </div>
                <p className="mt-3 text-sm text-slate-500">
                  Copying the code is the backup option. Inviting friends directly is easier.
                </p>
                {copyMessage ? <p className="mt-2 text-sm text-emerald-700">{copyMessage}</p> : null}
              </div>
            </div>
          </div>
        </section>

        {(message || error || downloadError) && (
          <div className="space-y-3">
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
            {downloadError ? (
              <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                {downloadError}
              </div>
            ) : null}
          </div>
        )}

        <section className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
          <section className="rounded-[32px] border border-white/80 bg-white/88 p-6 shadow-[0_22px_55px_rgba(15,23,42,0.06)]">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h3 className="text-2xl font-semibold tracking-tight text-slate-950">Photo gallery</h3>
                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Keep guest photos and final photographer photos together, but easy to browse.
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                {photoTabs.map((tab) => (
                  <button
                    key={tab.id}
                    className={[
                      "inline-flex h-10 items-center justify-center rounded-2xl px-4 text-sm font-semibold transition",
                      activeTab === tab.id
                        ? "border border-orange-200 bg-orange-500 text-white shadow-[0_12px_24px_rgba(249,115,22,0.22)]"
                        : "border border-slate-200 bg-white text-slate-700 hover:border-orange-200 hover:bg-orange-50/70",
                    ].join(" ")}
                    onClick={() => setActiveTab(tab.id)}
                    type="button"
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-6 rounded-[28px] border border-slate-200 bg-[linear-gradient(180deg,#fffaf5_0%,#ffffff_100%)] p-4 sm:p-5">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    {selectedCount ? `${selectedCount} photo${selectedCount > 1 ? "s" : ""} selected` : "No photos selected"}
                  </p>
                  <p className="mt-1 text-sm text-slate-500">
                    {activeTab === "all"
                      ? "Select any photos in this room, or download the whole gallery in one ZIP."
                      : `Bulk actions follow the current ${activeTab === "guest" ? "Guest photos" : "Photographer photos"} filter.`}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <button
                    className="inline-flex min-h-11 items-center justify-center rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-orange-200 hover:bg-orange-50 disabled:cursor-not-allowed disabled:opacity-60"
                    disabled={!activeUploadIds.length || areAllActiveSelected}
                    onClick={handleSelectAll}
                    type="button"
                  >
                    {areAllActiveSelected ? "All visible selected" : "Select all"}
                  </button>
                  {selectedCount ? (
                    <button
                      className="inline-flex min-h-11 items-center justify-center rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
                      onClick={handleClearSelection}
                      type="button"
                    >
                      Clear selection
                    </button>
                  ) : null}
                  <button
                    className="inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl border border-orange-200 bg-orange-500 px-4 py-2 text-sm font-semibold text-white shadow-[0_12px_24px_rgba(249,115,22,0.2)] transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
                    disabled={isDownloadingSelected || isDownloadingAll || !selectedCount}
                    onClick={() =>
                      handleBulkDownload(
                        selectedPhotoIds,
                        getZipFilename(room.title),
                        setIsDownloadingSelected,
                        "Select at least one photo first.",
                      )
                    }
                    type="button"
                  >
                    {isDownloadingSelected ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
                    Download selected
                  </button>
                  <button
                    className="inline-flex min-h-11 items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-orange-200 hover:bg-orange-50 disabled:cursor-not-allowed disabled:opacity-60"
                    disabled={isDownloadingSelected || isDownloadingAll || !activeUploadIds.length}
                    onClick={() =>
                      handleBulkDownload(
                        activeUploadIds,
                        getZipFilename(room.title),
                        setIsDownloadingAll,
                        "There are no photos available to download.",
                      )
                    }
                    type="button"
                  >
                    {isDownloadingAll ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
                    {activeTabLabel}
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {activeUploads.length ? (
                activeUploads.map((upload) => (
                  <figure
                    key={upload._id || upload.url}
                    className={[
                      "overflow-hidden rounded-[24px] border bg-white transition",
                      selectedPhotoIds.includes(upload._id)
                        ? "border-orange-300 ring-2 ring-orange-100"
                        : "border-slate-200",
                    ].join(" ")}
                  >
                    <div className="relative">
                      <button
                        className="block w-full"
                        onClick={() => openPreview(upload._id)}
                        type="button"
                      >
                        <img
                          alt={upload.originalName || "Room upload"}
                          className="aspect-[4/3] w-full object-cover transition duration-200 hover:scale-[1.01]"
                          src={getAssetUrl(upload.url)}
                        />
                      </button>
                      <button
                        aria-label={
                          selectedPhotoIds.includes(upload._id) ? "Deselect photo" : "Select photo"
                        }
                        className="absolute left-3 top-3 inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-white/80 bg-white/95 text-slate-700 shadow-sm transition hover:bg-orange-50"
                        onClick={(event) => {
                          event.stopPropagation();
                          togglePhotoSelection(upload._id);
                        }}
                        type="button"
                      >
                        {selectedPhotoIds.includes(upload._id) ? (
                          <Check className="h-4 w-4 text-orange-600" />
                        ) : (
                          <Square className="h-4 w-4" />
                        )}
                      </button>
                      <button
                        className="absolute right-3 top-3 inline-flex min-h-10 items-center justify-center gap-2 rounded-2xl border border-orange-200 bg-orange-500 px-3 py-2 text-sm font-semibold text-white shadow-[0_12px_24px_rgba(249,115,22,0.22)] transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60"
                        disabled={
                          isDownloadingSelected || isDownloadingAll || downloadingPhotoId === upload._id
                        }
                        onClick={(event) => {
                          event.stopPropagation();
                          handleSingleDownload(upload);
                        }}
                        type="button"
                      >
                        {downloadingPhotoId === upload._id ? (
                          <LoaderCircle className="h-4 w-4 animate-spin" />
                        ) : (
                          <Download className="h-4 w-4" />
                        )}
                        <span className="hidden sm:inline">Download</span>
                      </button>
                    </div>
                    <figcaption className="space-y-1 px-4 py-4">
                      <p className="text-sm font-medium text-slate-900">
                        {upload.originalName || "Shared photo"}
                      </p>
                      <p className="text-sm text-slate-500">
                        {upload.uploadedBy?.name ? `Uploaded by ${upload.uploadedBy.name}` : "Uploaded in this room"}
                      </p>
                      <div className="pt-3">
                        <button
                          className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-orange-200 hover:bg-orange-50 sm:hidden"
                          disabled={
                            isDownloadingSelected || isDownloadingAll || downloadingPhotoId === upload._id
                          }
                          onClick={(event) => {
                            event.stopPropagation();
                            handleSingleDownload(upload);
                          }}
                          type="button"
                        >
                          {downloadingPhotoId === upload._id ? (
                            <LoaderCircle className="h-4 w-4 animate-spin" />
                          ) : (
                            <Download className="h-4 w-4" />
                          )}
                          Download photo
                        </button>
                      </div>
                    </figcaption>
                  </figure>
                ))
              ) : activeTab === "photographer" ? (
                <EmptyGallery
                  title="No photographer photos yet"
                  description="When your photographer uploads the final gallery, it will appear here."
                />
              ) : activeTab === "guest" ? (
                <EmptyGallery
                  title="No guest photos yet"
                  description="Invite people and ask them to share behind-the-scenes moments here."
                />
              ) : (
                <EmptyGallery
                  title="No photos yet"
                  description="Upload the first photo to get this room started."
                />
              )}
            </div>
          </section>

          <div className="space-y-6">
            <section className="rounded-[32px] border border-white/80 bg-white/88 p-6 shadow-[0_22px_55px_rgba(15,23,42,0.06)]">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-emerald-50 p-3 text-emerald-700">
                  <UploadCloud className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-slate-950">Upload to this room</h3>
                  <p className="text-sm text-slate-500">Add photos without leaving the page.</p>
                </div>
              </div>

              <form className="mt-5 space-y-4" onSubmit={handleUpload}>
                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-slate-700">Choose photo</span>
                  <input
                    accept="image/*"
                    className="app-field w-full"
                    onChange={(event) => setFile(event.target.files?.[0] || null)}
                    type="file"
                  />
                </label>

                <button className="app-btn-primary inline-flex h-12 w-full items-center justify-center px-5 text-sm disabled:cursor-not-allowed disabled:opacity-60" disabled={isUploading} type="submit">
                  {isUploading ? "Uploading..." : "Upload photo"}
                </button>
              </form>
            </section>

            <section className="rounded-[32px] border border-white/80 bg-white/88 p-6 shadow-[0_22px_55px_rgba(15,23,42,0.06)]">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-sky-50 p-3 text-sky-700">
                  <Users className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-slate-950">People</h3>
                  <p className="text-sm text-slate-500">See who is invited and who already joined.</p>
                </div>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <div className="rounded-[24px] border border-slate-200 bg-slate-50/90 px-4 py-4">
                  <p className="text-xs uppercase tracking-[0.16em] text-slate-400">Pending invites</p>
                  <p className="mt-2 text-2xl font-semibold text-slate-950">{pendingInvitations.length}</p>
                </div>
                <div className="rounded-[24px] border border-slate-200 bg-slate-50/90 px-4 py-4">
                  <p className="text-xs uppercase tracking-[0.16em] text-slate-400">Accepted</p>
                  <p className="mt-2 text-2xl font-semibold text-slate-950">{acceptedInvitations.length}</p>
                </div>
              </div>

              {room.canManageInvitations ? (
                <button className="app-btn-secondary mt-5 inline-flex h-11 w-full items-center justify-center gap-2 px-4 text-sm" onClick={() => setIsInviteModalOpen(true)} type="button">
                  <MailPlus className="h-4 w-4" />
                  Invite friends
                </button>
              ) : (
                <p className="mt-5 text-sm leading-6 text-slate-500">
                  Only room managers can invite more people here.
                </p>
              )}
            </section>

            <section className="rounded-[32px] border border-slate-200 bg-[linear-gradient(180deg,#fff8f1_0%,#ffffff_100%)] p-6 shadow-[0_20px_50px_rgba(15,23,42,0.05)]">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-white p-3 text-slate-700 shadow-sm">
                  <Camera className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-slate-950">Photographer</h3>
                  <p className="text-sm text-slate-500">Add a photographer if you want final edited photos in this room.</p>
                </div>
              </div>

              <div className="mt-5 rounded-[24px] border border-slate-200 bg-white px-4 py-4">
                <p className="font-medium text-slate-900">No photographer selected yet</p>
                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Browse photographers, save the ones you like, and send a request when you are ready.
                </p>
                <Link className="app-btn-primary mt-4 inline-flex h-11 items-center justify-center gap-2 px-4 text-sm" to="/app/photographers">
                  <Search className="h-4 w-4" />
                  Choose photographer
                </Link>
              </div>
            </section>
          </div>
        </section>

        {room.canManageInvitations ? (
          <section className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
            <section className="rounded-[32px] border border-white/80 bg-white/88 p-6 shadow-[0_22px_55px_rgba(15,23,42,0.06)]">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-slate-100 p-3 text-slate-700">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-slate-950">Invitation status</h3>
                  <p className="text-sm text-slate-500">Keep track of who is still waiting and who already joined.</p>
                </div>
              </div>

              <div className="mt-5 space-y-3">
                {roomInvitations.length ? (
                  roomInvitations.map((invitation) => (
                    <article
                      key={invitation.id}
                      className="rounded-[24px] border border-slate-200 bg-[linear-gradient(180deg,#ffffff_0%,#f8fbff_100%)] px-4 py-4"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-medium text-slate-900">{invitation.invitee?.name}</p>
                          <p className="mt-1 text-sm text-slate-500">{invitation.invitee?.email}</p>
                        </div>
                        <StatusBadge status={invitation.status} />
                      </div>
                    </article>
                  ))
                ) : (
                  <EmptyGallery
                    title="No invitations yet"
                    description="Invite a few people and they will appear here."
                  />
                )}
              </div>
            </section>

            <section className="rounded-[32px] border border-white/80 bg-white/88 p-6 shadow-[0_22px_55px_rgba(15,23,42,0.06)]">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-sky-50 p-3 text-sky-700">
                  <MessageSquareText className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-slate-950">Room messages</h3>
                  <p className="text-sm text-slate-500">Use this for simple updates or missing-photo requests.</p>
                </div>
              </div>

              <form className="mt-5 space-y-4" onSubmit={handleComment}>
                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-slate-700">Message</span>
                  <textarea
                    className="app-field min-h-32 w-full"
                    onChange={(event) => setComment(event.target.value)}
                    placeholder="Please upload the group photo after dinner."
                    rows="4"
                    value={comment}
                  />
                </label>

                <button className="app-btn-primary inline-flex h-12 w-full items-center justify-center px-5 text-sm disabled:cursor-not-allowed disabled:opacity-60" disabled={isSending} type="submit">
                  {isSending ? "Sending..." : "Send message"}
                </button>
              </form>

              <div className="mt-6 space-y-3">
                {room.comments?.length ? (
                  room.comments.map((item) => (
                    <article
                      key={item._id}
                      className="rounded-[24px] border border-slate-200 bg-[linear-gradient(180deg,#ffffff_0%,#f8fbff_100%)] px-4 py-4"
                    >
                      <p className="font-medium text-slate-900">{item.author?.name || "Participant"}</p>
                      <p className="mt-2 text-sm leading-6 text-slate-500">{item.message}</p>
                    </article>
                  ))
                ) : (
                  <EmptyGallery
                    title="No messages yet"
                    description="Ask for missing moments or leave a short note for the group."
                  />
                )}
              </div>
            </section>
          </section>
        ) : null}

        {!room.canManageInvitations ? (
          <section className="rounded-[28px] border border-slate-200 bg-[linear-gradient(180deg,#f9fbff_0%,#ffffff_100%)] p-6 shadow-[0_20px_50px_rgba(15,23,42,0.05)]">
            <h3 className="text-lg font-semibold text-slate-950">Need more people in this room?</h3>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Ask the room owner to invite them, or open your friends page and get ready for the next room.
            </p>
            <Link className="app-btn-secondary mt-4 inline-flex h-11 items-center justify-center px-4 text-sm" to="/app/friends">
              Open friends
            </Link>
          </section>
        ) : null}
      </div>
    </>
  );
}
