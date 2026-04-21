import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Search, UserPlus, UserRoundCheck } from "lucide-react";
import { StatusBadge } from "../../components/StatusBadge";
import { useAuth } from "../../hooks/useAuth";
import { api } from "../../lib/api";

function EmptyState({ description, title }) {
  return (
    <div className="rounded-[28px] border border-dashed border-slate-200 bg-slate-50/80 px-5 py-8 text-center">
      <h3 className="text-lg font-semibold text-slate-950">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-500">{description}</p>
    </div>
  );
}

function PersonCard({ actions, subtitle, title, user }) {
  return (
    <article className="flex flex-col gap-4 rounded-[28px] border border-slate-200 bg-[linear-gradient(135deg,#ffffff_0%,#f8fbff_100%)] p-5 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <div className="flex flex-wrap items-center gap-3">
          <h3 className="text-lg font-semibold text-slate-950">{title || user.name}</h3>
          {user.status ? <StatusBadge status={user.status} /> : null}
        </div>
        <p className="mt-2 text-sm text-slate-500">{user.email}</p>
        <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
      </div>
      {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
    </article>
  );
}

async function fetchFriendOverview(token) {
  return api.social.overview(token);
}

export function FriendsPage() {
  const { token } = useAuth();
  const [overview, setOverview] = useState({
    friends: [],
    pendingReceived: [],
    pendingSent: [],
    history: [],
  });
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [searchMessage, setSearchMessage] = useState("");
  const [pageMessage, setPageMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [activeId, setActiveId] = useState("");

  useEffect(() => {
    let ignore = false;

    async function loadPage() {
      try {
        const data = await fetchFriendOverview(token);
        if (!ignore) {
          setOverview(data);
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
  }, [token]);

  useEffect(() => {
    const trimmedQuery = query.trim();

    if (!trimmedQuery) {
      setResults([]);
      setSearchMessage("");
      return undefined;
    }

    const timeoutId = window.setTimeout(async () => {
      try {
        setIsSearching(true);
        const data = await api.social.searchUsers(token, trimmedQuery);
        setResults(data.users);
        setSearchMessage(data.users.length ? "" : "No matching people yet.");
      } catch (searchError) {
        setSearchMessage(searchError.message);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => window.clearTimeout(timeoutId);
  }, [query, token]);

  async function runAction(action, id) {
    try {
      setActiveId(id);
      setError("");
      setPageMessage("");
      await action();
      const data = await fetchFriendOverview(token);
      setOverview(data);

      if (query.trim()) {
        const searchData = await api.social.searchUsers(token, query.trim());
        setResults(searchData.users);
      }
    } catch (actionError) {
      setError(actionError.message);
    } finally {
      setActiveId("");
    }
  }

  if (isLoading) {
    return <div className="page-state">Loading your friends...</div>;
  }

  return (
    <div className="space-y-6 lg:space-y-8">
      <section className="rounded-[36px] border border-white/80 bg-[linear-gradient(135deg,#fffaf5_0%,#ffffff_42%,#f4fbff_100%)] p-6 shadow-[0_24px_60px_rgba(15,23,42,0.06)] sm:p-8">
        <div className="grid gap-8 xl:grid-cols-[1.1fr_0.9fr]">
          <div>
            <span className="inline-flex rounded-full border border-orange-200 bg-orange-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-orange-700">
              Friends and invites
            </span>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950 sm:text-[2.7rem]">
              Invite people faster by building your friend list first.
            </h2>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
              Once someone is in your PixRoom+ friend list, inviting them to a room becomes much easier.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3 xl:grid-cols-1">
            <div className="rounded-[28px] border border-white/80 bg-white/88 p-5 shadow-[0_18px_45px_rgba(15,23,42,0.05)]">
              <p className="text-xs uppercase tracking-[0.16em] text-slate-400">Friends</p>
              <p className="mt-2 text-3xl font-semibold text-slate-950">{overview.friends.length}</p>
            </div>
            <div className="rounded-[28px] border border-white/80 bg-white/88 p-5 shadow-[0_18px_45px_rgba(15,23,42,0.05)]">
              <p className="text-xs uppercase tracking-[0.16em] text-slate-400">Waiting for you</p>
              <p className="mt-2 text-3xl font-semibold text-slate-950">{overview.pendingReceived.length}</p>
            </div>
            <div className="rounded-[28px] border border-white/80 bg-white/88 p-5 shadow-[0_18px_45px_rgba(15,23,42,0.05)]">
              <p className="text-xs uppercase tracking-[0.16em] text-slate-400">Waiting for them</p>
              <p className="mt-2 text-3xl font-semibold text-slate-950">{overview.pendingSent.length}</p>
            </div>
          </div>
        </div>
      </section>

      {(pageMessage || error) && (
        <div className="space-y-3">
          {pageMessage ? (
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
              {pageMessage}
            </div>
          ) : null}
          {error ? (
            <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
              {error}
            </div>
          ) : null}
        </div>
      )}

      <section className="rounded-[32px] border border-white/80 bg-white/88 p-6 shadow-[0_22px_55px_rgba(15,23,42,0.06)]">
        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-slate-100 p-3 text-slate-700">
            <Search className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-slate-950">Find someone on PixRoom+</h3>
            <p className="text-sm text-slate-500">Search by name or email and send a friend request.</p>
          </div>
        </div>

        <label className="app-search-field mt-5">
          <Search className="h-4 w-4 text-slate-400" />
          <input
            className="app-search-input"
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by name or email"
            value={query}
          />
        </label>

        <div className="mt-5 grid gap-4">
          {isSearching ? (
            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm text-slate-500">
              Searching...
            </div>
          ) : null}

          {!isSearching && results.length
            ? results.map((result) => {
                const relationship = result.friendship;

                return (
                  <PersonCard
                    key={result.id}
                    subtitle={result.location || "Location not added yet"}
                    title={result.name}
                    user={{ email: result.email, status: relationship?.status }}
                    actions={
                      <>
                        {!relationship ? (
                          <button
                            className="app-btn-primary inline-flex h-11 items-center justify-center px-4 text-sm"
                            disabled={activeId === result.id}
                            onClick={() =>
                              runAction(
                                async () => {
                                  await api.social.sendFriendRequest(token, result.id);
                                  setPageMessage("Friend request sent.");
                                },
                                result.id,
                              )
                            }
                            type="button"
                          >
                            {activeId === result.id ? "Sending..." : "Send request"}
                          </button>
                        ) : null}

                        {relationship?.status === "accepted" ? (
                          <span className="inline-flex h-11 items-center justify-center rounded-2xl border border-emerald-200 bg-emerald-50 px-4 text-sm font-semibold text-emerald-700">
                            Already friends
                          </span>
                        ) : null}

                        {relationship?.status === "pending" && relationship.direction === "sent" ? (
                          <button
                            className="inline-flex h-11 items-center justify-center rounded-2xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
                            disabled={activeId === result.id}
                            onClick={() =>
                              runAction(
                                async () => {
                                  const sentRequest = overview.pendingSent.find((item) => item.user.id === result.id);
                                  if (!sentRequest) {
                                    throw new Error("Pending request not found.");
                                  }
                                  await api.social.cancelFriendRequest(token, sentRequest.id);
                                  setPageMessage("Friend request cancelled.");
                                },
                                result.id,
                              )
                            }
                            type="button"
                          >
                            Cancel request
                          </button>
                        ) : null}

                        {relationship?.status === "pending" && relationship.direction === "received" ? (
                          <>
                            <button
                              className="app-btn-primary inline-flex h-11 items-center justify-center px-4 text-sm"
                              disabled={activeId === result.id}
                              onClick={() =>
                                runAction(
                                  async () => {
                                    const request = overview.pendingReceived.find((item) => item.user.id === result.id);
                                    if (!request) {
                                      throw new Error("Pending request not found.");
                                    }
                                    await api.social.acceptFriendRequest(token, request.id);
                                    setPageMessage("Friend request accepted.");
                                  },
                                  result.id,
                                )
                              }
                              type="button"
                            >
                              Accept
                            </button>
                            <button
                              className="inline-flex h-11 items-center justify-center rounded-2xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
                              disabled={activeId === result.id}
                              onClick={() =>
                                runAction(
                                  async () => {
                                    const request = overview.pendingReceived.find((item) => item.user.id === result.id);
                                    if (!request) {
                                      throw new Error("Pending request not found.");
                                    }
                                    await api.social.rejectFriendRequest(token, request.id);
                                    setPageMessage("Friend request rejected.");
                                  },
                                  result.id,
                                )
                              }
                              type="button"
                            >
                              Not now
                            </button>
                          </>
                        ) : null}
                      </>
                    }
                  />
                );
              })
            : null}

          {!isSearching && query.trim() && !results.length && searchMessage ? (
            <EmptyState description={searchMessage} title="Nobody found" />
          ) : null}
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <section className="rounded-[32px] border border-white/80 bg-white/88 p-6 shadow-[0_22px_55px_rgba(15,23,42,0.06)]">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-emerald-50 p-3 text-emerald-700">
              <UserRoundCheck className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-slate-950">People waiting for you</h3>
              <p className="text-sm text-slate-500">Accept requests so inviting them later is easy.</p>
            </div>
          </div>

          <div className="mt-5 grid gap-4">
            {overview.pendingReceived.length ? (
              overview.pendingReceived.map((friendship) => (
                <PersonCard
                  key={friendship.id}
                  subtitle={`Sent ${new Date(friendship.createdAt).toLocaleDateString()}`}
                  user={{ email: friendship.user.email, name: friendship.user.name, status: friendship.status }}
                  actions={
                    <>
                      <button
                        className="app-btn-primary inline-flex h-11 items-center justify-center px-4 text-sm"
                        disabled={activeId === friendship.id}
                        onClick={() =>
                          runAction(
                            async () => {
                              await api.social.acceptFriendRequest(token, friendship.id);
                              setPageMessage("Friend request accepted.");
                            },
                            friendship.id,
                          )
                        }
                        type="button"
                      >
                        Accept
                      </button>
                      <button
                        className="inline-flex h-11 items-center justify-center rounded-2xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
                        disabled={activeId === friendship.id}
                        onClick={() =>
                          runAction(
                            async () => {
                              await api.social.rejectFriendRequest(token, friendship.id);
                              setPageMessage("Friend request rejected.");
                            },
                            friendship.id,
                          )
                        }
                        type="button"
                      >
                        Not now
                      </button>
                    </>
                  }
                />
              ))
            ) : (
              <EmptyState
                description="You are all caught up. New requests will appear here."
                title="No requests waiting for you"
              />
            )}
          </div>
        </section>

        <section className="rounded-[32px] border border-white/80 bg-white/88 p-6 shadow-[0_22px_55px_rgba(15,23,42,0.06)]">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-sky-50 p-3 text-sky-700">
              <UserPlus className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-slate-950">People still deciding</h3>
              <p className="text-sm text-slate-500">These friend requests are still waiting for a reply.</p>
            </div>
          </div>

          <div className="mt-5 grid gap-4">
            {overview.pendingSent.length ? (
              overview.pendingSent.map((friendship) => (
                <PersonCard
                  key={friendship.id}
                  subtitle="Waiting for their reply"
                  user={{ email: friendship.user.email, name: friendship.user.name, status: friendship.status }}
                  actions={
                    <button
                      className="inline-flex h-11 items-center justify-center rounded-2xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
                      disabled={activeId === friendship.id}
                      onClick={() =>
                        runAction(
                          async () => {
                            await api.social.cancelFriendRequest(token, friendship.id);
                            setPageMessage("Friend request cancelled.");
                          },
                          friendship.id,
                        )
                      }
                      type="button"
                    >
                      Cancel
                    </button>
                  }
                />
              ))
            ) : (
              <EmptyState
                description="People you invite will stay here until they accept or refuse."
                title="No outgoing requests"
              />
            )}
          </div>
        </section>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <section className="rounded-[32px] border border-white/80 bg-white/88 p-6 shadow-[0_22px_55px_rgba(15,23,42,0.06)]">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-violet-50 p-3 text-violet-700">
              <UserRoundCheck className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-slate-950">My friends</h3>
              <p className="text-sm text-slate-500">These people are ready for one-tap room invites.</p>
            </div>
          </div>

          <div className="mt-5 grid gap-4">
            {overview.friends.length ? (
              overview.friends.map((friendship) => (
                <PersonCard
                  key={friendship.id}
                  subtitle={friendship.user.location || "Location not added yet"}
                  user={{ email: friendship.user.email, name: friendship.user.name, status: friendship.status }}
                />
              ))
            ) : (
              <EmptyState
                description="When someone accepts your request, they will appear here."
                title="No friends yet"
              />
            )}
          </div>
        </section>

        <section className="rounded-[32px] border border-slate-200 bg-[linear-gradient(180deg,#fff8f1_0%,#ffffff_100%)] p-6 shadow-[0_20px_50px_rgba(15,23,42,0.05)]">
          <h3 className="text-xl font-semibold text-slate-950">Next step</h3>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            After you add friends, opening a room and inviting people becomes much quicker.
          </p>

          <div className="mt-5 grid gap-3">
            <Link className="app-btn-primary inline-flex h-12 items-center justify-center px-5 text-sm" to="/app/rooms">
              Open my rooms
            </Link>
            <Link className="app-btn-secondary inline-flex h-12 items-center justify-center px-5 text-sm" to="/app/rooms/new">
              Create a new room
            </Link>
          </div>
        </section>
      </section>
    </div>
  );
}
