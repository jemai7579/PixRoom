import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Search } from "lucide-react";
import { StatusBadge } from "./StatusBadge";

export function InviteFriendsModal({
  error,
  friends,
  invitations,
  isOpen,
  isSubmittingId,
  onClose,
  onInvite,
}) {
  const [query, setQuery] = useState("");

  const invitationMap = useMemo(
    () =>
      new Map(invitations.map((invitation) => [invitation.invitee?.id || invitation.invitee?._id, invitation])),
    [invitations],
  );

  const filteredFriends = useMemo(() => {
    const term = query.trim().toLowerCase();

    if (!term) {
      return friends;
    }

    return friends.filter((friendship) => {
      const friend = friendship.user;
      return [friend.name, friend.email, friend.location]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(term));
    });
  }, [friends, query]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/35 px-4 py-6 backdrop-blur-sm">
      <div className="max-h-[90vh] w-full max-w-4xl overflow-hidden rounded-[32px] border border-white/70 bg-white shadow-[0_25px_80px_rgba(15,23,42,0.25)]">
        <div className="flex items-start justify-between gap-4 border-b border-slate-200 px-6 py-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-orange-700">Invite people</p>
            <h3 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">
              Invite from your friends list
            </h3>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Start with people you already know on PixRoom+. This is the easiest way to fill a room.
            </p>
          </div>

          <button
            className="inline-flex h-11 items-center justify-center rounded-2xl border border-slate-200 px-4 text-sm font-semibold text-slate-600 transition hover:border-slate-300 hover:bg-slate-50"
            onClick={onClose}
            type="button"
          >
            Close
          </button>
        </div>

        <div className="max-h-[calc(90vh-110px)] overflow-y-auto px-6 py-5">
          {error ? (
            <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
              {error}
            </div>
          ) : null}

          {friends.length ? (
            <>
              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-[24px] border border-slate-200 bg-slate-50/90 px-4 py-4">
                  <p className="text-xs uppercase tracking-[0.16em] text-slate-400">Friends</p>
                  <p className="mt-2 text-2xl font-semibold text-slate-950">{friends.length}</p>
                </div>
                <div className="rounded-[24px] border border-slate-200 bg-slate-50/90 px-4 py-4">
                  <p className="text-xs uppercase tracking-[0.16em] text-slate-400">Pending</p>
                  <p className="mt-2 text-2xl font-semibold text-slate-950">
                    {invitations.filter((invitation) => invitation.status === "pending").length}
                  </p>
                </div>
                <div className="rounded-[24px] border border-slate-200 bg-slate-50/90 px-4 py-4">
                  <p className="text-xs uppercase tracking-[0.16em] text-slate-400">Accepted</p>
                  <p className="mt-2 text-2xl font-semibold text-slate-950">
                    {invitations.filter((invitation) => invitation.status === "accepted").length}
                  </p>
                </div>
              </div>

              <label className="app-search-field mt-5">
                <Search className="h-4 w-4 text-slate-400" />
                <input
                  className="app-search-input"
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search a friend by name or email"
                  value={query}
                />
              </label>

              <div className="mt-5 grid gap-4">
                {filteredFriends.length ? (
                  filteredFriends.map((friendship) => {
                    const friend = friendship.user;
                    const invitation = invitationMap.get(friend.id);
                    const isBusy = isSubmittingId === friend.id;
                    const canInvite = !invitation || invitation.status === "rejected";

                    return (
                      <article
                        key={friend.id}
                        className="flex flex-col gap-4 rounded-[28px] border border-slate-200 bg-[linear-gradient(135deg,#ffffff_0%,#f8fbff_100%)] p-5 sm:flex-row sm:items-center sm:justify-between"
                      >
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-3">
                            <h4 className="text-lg font-semibold text-slate-950">{friend.name}</h4>
                            {invitation ? <StatusBadge status={invitation.status} /> : null}
                          </div>
                          <p className="mt-2 text-sm text-slate-500">{friend.email}</p>
                          <p className="mt-1 text-sm text-slate-500">
                            {friend.location || "Location not added yet"}
                          </p>
                        </div>

                        <button
                          className={[
                            "inline-flex h-11 items-center justify-center rounded-2xl px-4 text-sm font-semibold transition",
                            canInvite
                              ? "app-btn-primary"
                              : "border border-slate-200 bg-slate-100 text-slate-500",
                          ].join(" ")}
                          disabled={!canInvite || isBusy}
                          onClick={() => onInvite(friend.id)}
                          type="button"
                        >
                          {isBusy
                            ? "Sending..."
                            : invitation?.status === "rejected"
                              ? "Invite again"
                              : canInvite
                                ? "Invite"
                                : "Already invited"}
                        </button>
                      </article>
                    );
                  })
                ) : (
                  <div className="rounded-[28px] border border-dashed border-slate-200 bg-slate-50/90 px-6 py-8 text-center">
                    <h4 className="text-lg font-semibold text-slate-950">No matching friends</h4>
                    <p className="mt-2 text-sm leading-6 text-slate-500">
                      Try another name or clear the search.
                    </p>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="mt-4 rounded-[28px] border border-dashed border-slate-200 bg-slate-50/90 px-6 py-8 text-center">
              <h4 className="text-lg font-semibold text-slate-950">No friends yet</h4>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                Build your friend list first, then inviting people to a room becomes one tap.
              </p>
              <Link className="app-btn-primary mt-5 inline-flex h-11 items-center justify-center px-4 text-sm" to="/app/friends">
                Open friends
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
