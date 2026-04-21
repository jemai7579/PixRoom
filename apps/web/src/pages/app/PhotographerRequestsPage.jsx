import { useEffect, useState } from "react";
import { CalendarDays, CheckCircle2, MapPin, MessageSquareText, XCircle } from "lucide-react";
import { StatusBadge } from "../../components/StatusBadge";
import { useAuth } from "../../hooks/useAuth";
import { api } from "../../lib/api";

const requestStatuses = ["pending", "accepted", "rejected", "completed"];

export function PhotographerRequestsPage() {
  const { token } = useAuth();
  const [requests, setRequests] = useState([]);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [activeRequestId, setActiveRequestId] = useState("");

  async function loadRequests() {
    const data = await api.marketplace.listBookingRequests(token);
    setRequests(data.bookingRequests);
  }

  useEffect(() => {
    let ignore = false;

    async function loadPage() {
      try {
        const data = await api.marketplace.listBookingRequests(token);
        if (!ignore) {
          setRequests(data.bookingRequests);
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

  async function handleStatusChange(requestId, status) {
    try {
      setActiveRequestId(requestId);
      setError("");
      setMessage("");
      const response = await api.marketplace.updateBookingRequestStatus(token, requestId, status);
      await loadRequests();
      setMessage(response.message);
    } catch (statusError) {
      setError(statusError.message);
    } finally {
      setActiveRequestId("");
    }
  }

  if (isLoading) {
    return <div className="page-state">Loading booking requests...</div>;
  }

  return (
    <div className="space-y-6 lg:space-y-8">
      <section className="rounded-[36px] border border-white/80 bg-[linear-gradient(135deg,#fffaf5_0%,#ffffff_45%,#f4fbff_100%)] p-6 shadow-[0_22px_55px_rgba(15,23,42,0.06)] sm:p-8">
        <div className="max-w-3xl">
          <span className="inline-flex rounded-full border border-orange-200 bg-orange-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-orange-700">
            Requests
          </span>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950 sm:text-[2.5rem]">
            Booking and collaboration requests
          </h2>
          <p className="mt-3 text-sm leading-7 text-slate-500 sm:text-base">
            Review each event request, respond clearly, and keep your client pipeline moving without leaving PixRoom+.
          </p>
        </div>
      </section>

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

      <section className="grid gap-4 md:grid-cols-4">
        {requestStatuses.map((status) => (
          <article
            key={status}
            className="rounded-[28px] border border-white/80 bg-white/88 p-5 shadow-[0_18px_40px_rgba(15,23,42,0.06)]"
          >
            <p className="text-sm font-medium capitalize text-slate-500">{status}</p>
            <p className="mt-3 text-3xl font-semibold tracking-tight text-slate-950">
              {requests.filter((request) => request.status === status).length}
            </p>
          </article>
        ))}
      </section>

      <section className="space-y-4">
        {requests.length ? (
          requests.map((request) => (
            <article
              key={request.id}
              className="rounded-[32px] border border-white/80 bg-white/88 p-6 shadow-[0_22px_55px_rgba(15,23,42,0.06)]"
            >
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="max-w-3xl">
                  <div className="flex flex-wrap items-center gap-3">
                    <h3 className="text-xl font-semibold text-slate-950">{request.eventType}</h3>
                    <StatusBadge status={request.status} />
                  </div>
                  <p className="mt-3 text-sm font-medium text-slate-900">
                    Client: {request.client?.name || "Client not available"}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-4 text-sm text-slate-500">
                    <span className="inline-flex items-center gap-2">
                      <CalendarDays className="h-4 w-4" />
                      {request.eventDate ? new Date(request.eventDate).toLocaleDateString() : "Date not set"}
                    </span>
                    <span className="inline-flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      {request.location || "Location not set"}
                    </span>
                    <span className="inline-flex items-center gap-2">
                      <MessageSquareText className="h-4 w-4" />
                      {request.client?.email || "No email shared"}
                    </span>
                  </div>
                  <div className="mt-5 rounded-[24px] border border-slate-200 bg-slate-50/90 px-4 py-4">
                    <p className="text-sm leading-7 text-slate-600">
                      {request.message || "The client did not leave a message yet."}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 lg:max-w-[280px] lg:justify-end">
                  {request.status !== "accepted" ? (
                    <button className="app-btn-primary inline-flex h-11 items-center justify-center gap-2 px-4 text-sm disabled:cursor-not-allowed disabled:opacity-60" disabled={activeRequestId === request.id} onClick={() => handleStatusChange(request.id, "accepted")} type="button">
                      <CheckCircle2 className="h-4 w-4" />
                      Accept
                    </button>
                  ) : null}
                  {request.status !== "rejected" ? (
                    <button className="app-btn-secondary inline-flex h-11 items-center justify-center gap-2 px-4 text-sm disabled:cursor-not-allowed disabled:opacity-60" disabled={activeRequestId === request.id} onClick={() => handleStatusChange(request.id, "rejected")} type="button">
                      <XCircle className="h-4 w-4" />
                      Reject
                    </button>
                  ) : null}
                  {request.status !== "completed" ? (
                    <button
                      className="inline-flex h-11 items-center justify-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-100 disabled:cursor-not-allowed disabled:opacity-60"
                      disabled={activeRequestId === request.id}
                      onClick={() => handleStatusChange(request.id, "completed")}
                      type="button"
                    >
                      Mark completed
                    </button>
                  ) : null}
                </div>
              </div>
            </article>
          ))
        ) : (
          <div className="rounded-[32px] border border-dashed border-slate-200 bg-slate-50/90 px-6 py-16 text-center">
            <h3 className="text-xl font-semibold text-slate-950">No booking requests yet</h3>
            <p className="mt-3 text-sm leading-6 text-slate-500">
              As your photographer profile gets stronger and your portfolio grows, client requests will land here.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
