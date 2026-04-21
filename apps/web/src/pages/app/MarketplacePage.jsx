import { useEffect, useMemo, useState } from "react";
import {
  Bookmark,
  CalendarDays,
  HeartHandshake,
  MapPin,
  RotateCcw,
  Search,
  Star,
} from "lucide-react";
import { StatusBadge } from "../../components/StatusBadge";
import { useAuth } from "../../hooks/useAuth";
import { api, getAssetUrl } from "../../lib/api";

const initialFilters = {
  location: "",
  eventType: "",
  budget: "",
  availability: "all",
};

async function fetchMarketplaceData(token, filters) {
  return Promise.all([
    api.marketplace.listPhotographers(token, filters),
    api.marketplace.listSaved(token),
    api.marketplace.listSkipped(token),
    api.marketplace.listBookingRequests(token),
  ]);
}

function PhotographerModal({ onClose, onRequest, photographer }) {
  if (!photographer) {
    return null;
  }

  const gallery = [photographer.profilePhoto, ...(photographer.portfolioImages || [])].filter(Boolean);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/35 px-4 py-6 backdrop-blur-sm">
      <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-[32px] border border-white/70 bg-white shadow-[0_25px_80px_rgba(15,23,42,0.25)]">
        <div className="flex items-start justify-between gap-4 border-b border-slate-200 px-6 py-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-orange-700">Photographer profile</p>
            <h3 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">{photographer.name}</h3>
            <p className="mt-2 text-sm text-slate-500">
              {`${photographer.location || "Location not listed"} | ${photographer.priceRange || "Price on request"}`}
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

        <div className="grid gap-6 px-6 py-6 lg:grid-cols-[1fr_1fr]">
          <div className="space-y-4">
            {gallery.length ? (
              <div className="grid gap-3 sm:grid-cols-2">
                {gallery.slice(0, 4).map((image, index) => (
                  <div key={`${image}-${index}`} className="overflow-hidden rounded-[24px] bg-slate-100">
                    <img
                      alt={`${photographer.name} portfolio ${index + 1}`}
                      className="aspect-[4/3] w-full object-cover"
                      src={getAssetUrl(image)}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-[28px] border border-dashed border-slate-200 bg-slate-50/90 px-4 py-10 text-center text-sm text-slate-500">
                Portfolio photos will appear here.
              </div>
            )}
          </div>

          <div className="space-y-5">
            <p className="text-sm leading-7 text-slate-500">
              {photographer.bio || "This photographer has not added a bio yet."}
            </p>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-[24px] border border-slate-200 bg-slate-50/90 px-4 py-4">
                <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Specialty</p>
                <p className="mt-2 text-sm font-medium text-slate-900">
                  {photographer.specialties?.length ? photographer.specialties.join(", ") : "General events"}
                </p>
              </div>
              <div className="rounded-[24px] border border-slate-200 bg-slate-50/90 px-4 py-4">
                <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Availability</p>
                <p className="mt-2 text-sm font-medium text-slate-900">
                  {photographer.isAvailable ? "Available now" : "Currently booked"}
                </p>
              </div>
            </div>

            <div className="rounded-[28px] border border-amber-100 bg-[linear-gradient(180deg,#fffaf0_0%,#ffffff_100%)] p-5">
              <div className="flex items-center gap-3">
                <Star className="h-5 w-5 text-amber-500" />
                <p className="font-semibold text-slate-900">
                  {photographer.rating || 0} / 5 from {photographer.reviewCount || 0} reviews
                </p>
              </div>
              <button className="app-btn-primary mt-4 inline-flex h-11 items-center justify-center px-4 text-sm" onClick={() => onRequest(photographer)} type="button">
                Choose photographer
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function BookingModal({ error, form, isSubmitting, onChange, onClose, onSubmit, photographer }) {
  if (!photographer) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/35 px-4 py-6 backdrop-blur-sm">
      <div className="w-full max-w-2xl rounded-[32px] border border-white/70 bg-white shadow-[0_25px_80px_rgba(15,23,42,0.25)]">
        <div className="flex items-start justify-between gap-4 border-b border-slate-200 px-6 py-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-orange-700">Choose photographer</p>
            <h3 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">{photographer.name}</h3>
          </div>
          <button
            className="inline-flex h-11 items-center justify-center rounded-2xl border border-slate-200 px-4 text-sm font-semibold text-slate-600 transition hover:border-slate-300 hover:bg-slate-50"
            onClick={onClose}
            type="button"
          >
            Close
          </button>
        </div>

        <form className="space-y-4 px-6 py-6" onSubmit={onSubmit}>
          {error ? (
            <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
              {error}
            </div>
          ) : null}

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">Event type</span>
              <input
                className="app-field w-full"
                name="eventType"
                onChange={onChange}
                placeholder="Wedding, birthday, launch..."
                value={form.eventType}
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium text-slate-700">Event date</span>
              <input
                className="app-field w-full"
                name="eventDate"
                onChange={onChange}
                type="date"
                value={form.eventDate}
              />
            </label>
          </div>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-700">Location</span>
            <input
              className="app-field w-full"
              name="location"
              onChange={onChange}
              placeholder="Tunis, Hammamet, Sousse..."
              value={form.location}
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-700">Message</span>
            <textarea
              className="app-field min-h-36 w-full"
              name="message"
              onChange={onChange}
              placeholder="Tell them a little about your event."
              rows="5"
              value={form.message}
            />
          </label>

          <button className="app-btn-primary inline-flex h-12 items-center justify-center px-5 text-sm disabled:cursor-not-allowed disabled:opacity-60" disabled={isSubmitting} type="submit">
            {isSubmitting ? "Sending..." : "Send request"}
          </button>
        </form>
      </div>
    </div>
  );
}

export function MarketplacePage() {
  const { token } = useAuth();
  const [filters, setFilters] = useState(initialFilters);
  const [photographers, setPhotographers] = useState([]);
  const [savedPhotographers, setSavedPhotographers] = useState([]);
  const [skippedPhotographers, setSkippedPhotographers] = useState([]);
  const [bookingRequests, setBookingRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState("");
  const [isResettingSkipped, setIsResettingSkipped] = useState(false);
  const [isSubmittingRequest, setIsSubmittingRequest] = useState(false);
  const [selectedPhotographer, setSelectedPhotographer] = useState(null);
  const [bookingPhotographer, setBookingPhotographer] = useState(null);
  const [bookingForm, setBookingForm] = useState({
    eventType: "",
    eventDate: "",
    location: "",
    message: "",
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [bookingError, setBookingError] = useState("");

  useEffect(() => {
    let ignore = false;

    const timeoutId = window.setTimeout(async () => {
      try {
        setError("");
        const [discoverData, savedData, skippedData, bookingData] = await fetchMarketplaceData(token, filters);

        if (!ignore) {
          setPhotographers(discoverData.photographers);
          setSavedPhotographers(savedData.photographers);
          setSkippedPhotographers(skippedData.skipped);
          setBookingRequests(bookingData.bookingRequests);
          setIsLoading(false);
        }
      } catch (loadError) {
        if (!ignore) {
          setError(loadError.message);
          setIsLoading(false);
        }
      }
    }, 250);

    return () => {
      ignore = true;
      window.clearTimeout(timeoutId);
    };
  }, [filters, token]);

  const pendingBookingRequests = useMemo(
    () => bookingRequests.filter((request) => request.status === "pending"),
    [bookingRequests],
  );

  function handleFilterChange(event) {
    setFilters((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
  }

  async function refreshSavedAndSkipped() {
    const [savedData, skippedData] = await Promise.all([
      api.marketplace.listSaved(token),
      api.marketplace.listSkipped(token),
    ]);

    setSavedPhotographers(savedData.photographers);
    setSkippedPhotographers(skippedData.skipped);
  }

  async function handleInterest(photographer, action) {
    try {
      setIsSaving(photographer.id);
      setMessage("");
      setError("");
      await api.marketplace.updateInterest(token, photographer.id, action);
      await refreshSavedAndSkipped();

      if (action === "saved") {
        setSavedPhotographers((current) => {
          if (current.some((item) => item.id === photographer.id)) {
            return current;
          }

          return [...current, photographer];
        });
        setMessage(`${photographer.name} was saved.`);
      } else {
        setPhotographers((current) => current.filter((item) => item.id !== photographer.id));
        setMessage(`${photographer.name} was hidden for now.`);
      }
    } catch (actionError) {
      setError(actionError.message);
    } finally {
      setIsSaving("");
    }
  }

  async function handleResetSkipped() {
    try {
      setIsResettingSkipped(true);
      setMessage("");
      setError("");
      const response = await api.marketplace.resetSkipped(token);

      if (response.photographers?.length) {
        setPhotographers((current) => {
          const existingIds = new Set(current.map((item) => item.id));
          const restored = response.photographers.filter((item) => !existingIds.has(item.id));
          return [...restored, ...current];
        });
      }

      await refreshSavedAndSkipped();
      setMessage(response.message);
    } catch (resetError) {
      setError(resetError.message);
    } finally {
      setIsResettingSkipped(false);
    }
  }

  function handleClearFilters() {
    setFilters(initialFilters);
    setMessage("Filters cleared.");
  }

  async function handleBookingSubmit(event) {
    event.preventDefault();

    if (!bookingPhotographer) {
      return;
    }

    try {
      setBookingError("");
      setIsSubmittingRequest(true);
      const response = await api.marketplace.requestBooking(token, bookingPhotographer.id, bookingForm);
      const bookingData = await api.marketplace.listBookingRequests(token);
      setBookingRequests(bookingData.bookingRequests);
      setBookingForm({
        eventType: "",
        eventDate: "",
        location: "",
        message: "",
      });
      setBookingPhotographer(null);
      setMessage(response.message);
    } catch (submitError) {
      setBookingError(submitError.message);
    } finally {
      setIsSubmittingRequest(false);
    }
  }

  if (isLoading) {
    return <div className="page-state">Loading photographers...</div>;
  }

  return (
    <>
      <PhotographerModal
        onClose={() => setSelectedPhotographer(null)}
        onRequest={(photographer) => {
          setSelectedPhotographer(null);
          setBookingPhotographer(photographer);
        }}
        photographer={selectedPhotographer}
      />

      <BookingModal
        error={bookingError}
        form={bookingForm}
        isSubmitting={isSubmittingRequest}
        onChange={(event) =>
          setBookingForm((current) => ({ ...current, [event.target.name]: event.target.value }))
        }
        onClose={() => {
          setBookingPhotographer(null);
          setBookingError("");
        }}
        onSubmit={handleBookingSubmit}
        photographer={bookingPhotographer}
      />

      <div className="space-y-6 lg:space-y-8">
        <section className="rounded-[36px] border border-white/80 bg-[linear-gradient(135deg,#fffaf5_0%,#ffffff_42%,#f4fbff_100%)] p-6 shadow-[0_24px_60px_rgba(15,23,42,0.06)] sm:p-8">
          <div className="grid gap-8 xl:grid-cols-[1.08fr_0.92fr]">
            <div>
              <span className="inline-flex rounded-full border border-orange-200 bg-orange-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-orange-700">
                Find a photographer
              </span>
              <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950 sm:text-[2.7rem]">
                Browse great photographers without the clutter.
              </h2>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
                Keep it simple: browse cards, look at one strong photo, save your favorites, and
                choose a photographer when you feel ready.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3 xl:grid-cols-1">
              <div className="rounded-[28px] border border-white/80 bg-white/88 p-5 shadow-[0_18px_45px_rgba(15,23,42,0.05)]">
                <p className="text-xs uppercase tracking-[0.16em] text-slate-400">Available now</p>
                <p className="mt-2 text-3xl font-semibold text-slate-950">
                  {photographers.filter((item) => item.isAvailable).length}
                </p>
              </div>
              <div className="rounded-[28px] border border-white/80 bg-white/88 p-5 shadow-[0_18px_45px_rgba(15,23,42,0.05)]">
                <p className="text-xs uppercase tracking-[0.16em] text-slate-400">Saved</p>
                <p className="mt-2 text-3xl font-semibold text-slate-950">{savedPhotographers.length}</p>
              </div>
              <div className="rounded-[28px] border border-white/80 bg-white/88 p-5 shadow-[0_18px_45px_rgba(15,23,42,0.05)]">
                <p className="text-xs uppercase tracking-[0.16em] text-slate-400">Open requests</p>
                <p className="mt-2 text-3xl font-semibold text-slate-950">{pendingBookingRequests.length}</p>
              </div>
            </div>
          </div>
        </section>

        {(message || error) && (
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
          </div>
        )}

        <section className="grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
          <section className="rounded-[32px] border border-white/80 bg-white/88 p-6 shadow-[0_22px_55px_rgba(15,23,42,0.06)]">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-slate-100 p-3 text-slate-700">
                <Search className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-slate-950">Keep filters simple</h3>
                <p className="text-sm text-slate-500">Only use a few filters when you really need them.</p>
              </div>
            </div>

            <div className="mt-5 grid gap-4">
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-700">Location</span>
                <input
                  className="app-field w-full"
                  name="location"
                  onChange={handleFilterChange}
                  placeholder="Tunis, Sousse..."
                  value={filters.location}
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-700">Event type</span>
                <input
                  className="app-field w-full"
                  name="eventType"
                  onChange={handleFilterChange}
                  placeholder="Wedding, corporate event..."
                  value={filters.eventType}
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-700">Price range</span>
                <input
                  className="app-field w-full"
                  name="budget"
                  onChange={handleFilterChange}
                  placeholder="EUR 500-1500"
                  value={filters.budget}
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-700">Availability</span>
                <select
                  className="app-field w-full"
                  name="availability"
                  onChange={handleFilterChange}
                  value={filters.availability}
                >
                  <option value="all">Show everyone</option>
                  <option value="available">Only available now</option>
                </select>
              </label>
            </div>

            <div className="mt-5 flex flex-wrap gap-3">
              <button className="app-btn-secondary inline-flex h-11 items-center justify-center gap-2 px-4 text-sm" onClick={handleClearFilters} type="button">
                <RotateCcw className="h-4 w-4" />
                Clear filters
              </button>
              <button className="app-btn-secondary inline-flex h-11 items-center justify-center gap-2 px-4 text-sm" onClick={handleResetSkipped} type="button">
                <RotateCcw className="h-4 w-4" />
                {isResettingSkipped ? "Resetting..." : "Show hidden photographers"}
              </button>
            </div>
          </section>

          <section className="rounded-[32px] border border-white/80 bg-white/88 p-6 shadow-[0_22px_55px_rgba(15,23,42,0.06)]">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-semibold text-slate-950">Photographers</h3>
                <p className="mt-2 text-sm text-slate-500">
                  Compare the basics first: photo, location, specialty, price, and rating.
                </p>
              </div>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                {photographers.length} results
              </span>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {photographers.length ? (
                photographers.map((photographer) => {
                  const heroImage = photographer.profilePhoto || photographer.portfolioImages?.[0];

                  return (
                    <article
                      key={photographer.id}
                      className="overflow-hidden rounded-[28px] border border-slate-200 bg-[linear-gradient(180deg,#ffffff_0%,#f8fbff_100%)]"
                    >
                      <div className="bg-slate-100">
                        {heroImage ? (
                          <img
                            alt={photographer.name}
                            className="aspect-[4/3] w-full object-cover"
                            src={getAssetUrl(heroImage)}
                          />
                        ) : (
                          <div className="flex aspect-[4/3] items-center justify-center bg-[linear-gradient(135deg,#dbeafe_0%,#ecfeff_100%)] text-sm font-semibold text-slate-500">
                            Photo coming soon
                          </div>
                        )}
                      </div>

                      <div className="p-5">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <h4 className="text-xl font-semibold text-slate-950">{photographer.name}</h4>
                            <p className="mt-2 inline-flex items-center gap-2 text-sm text-slate-500">
                              <MapPin className="h-4 w-4" />
                              {photographer.location || "Location not listed"}
                            </p>
                          </div>
                          {photographer.isAvailable ? <StatusBadge status="accepted" label="Available" /> : null}
                        </div>

                        <div className="mt-4 grid gap-3 sm:grid-cols-2">
                          <div className="rounded-2xl bg-slate-50 px-3 py-3">
                            <p className="text-xs uppercase tracking-[0.14em] text-slate-400">Specialty</p>
                            <p className="mt-1 text-sm font-medium text-slate-900">
                              {photographer.specialties?.[0] || "General events"}
                            </p>
                          </div>
                          <div className="rounded-2xl bg-slate-50 px-3 py-3">
                            <p className="text-xs uppercase tracking-[0.14em] text-slate-400">Price</p>
                            <p className="mt-1 text-sm font-medium text-slate-900">
                              {photographer.priceRange || "On request"}
                            </p>
                          </div>
                        </div>

                        <p className="mt-4 inline-flex items-center gap-2 text-sm text-slate-600">
                          <Star className="h-4 w-4 text-amber-500" />
                          {photographer.rating || 0} ({photographer.reviewCount || 0} reviews)
                        </p>

                        <div className="mt-5 flex flex-wrap gap-2">
                          <button className="app-btn-secondary inline-flex h-11 items-center justify-center px-4 text-sm" onClick={() => setSelectedPhotographer(photographer)} type="button">
                            View profile
                          </button>
                          <button className="app-btn-primary inline-flex h-11 items-center justify-center px-4 text-sm" onClick={() => setBookingPhotographer(photographer)} type="button">
                            Choose photographer
                          </button>
                          <button
                            className="inline-flex h-11 items-center justify-center rounded-2xl border border-emerald-200 bg-emerald-50 px-4 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-100"
                            disabled={isSaving === photographer.id}
                            onClick={() => handleInterest(photographer, "saved")}
                            type="button"
                          >
                            {isSaving === photographer.id ? "Saving..." : "Save"}
                          </button>
                        </div>
                      </div>
                    </article>
                  );
                })
              ) : (
                <div className="rounded-[28px] border border-dashed border-slate-200 bg-slate-50/90 px-6 py-10 text-center md:col-span-2">
                  <h4 className="text-lg font-semibold text-slate-950">No photographers found</h4>
                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    Try clearing the filters or showing hidden photographers again.
                  </p>
                </div>
              )}
            </div>
          </section>
        </section>

        <section className="grid gap-6 xl:grid-cols-[1fr_1fr]">
          <section className="rounded-[32px] border border-white/80 bg-white/88 p-6 shadow-[0_22px_55px_rgba(15,23,42,0.06)]">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-sky-50 p-3 text-sky-700">
                <Bookmark className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-slate-950">Saved photographers</h3>
                <p className="text-sm text-slate-500">Keep your favorites together while you decide.</p>
              </div>
            </div>

            <div className="mt-5 space-y-3">
              {savedPhotographers.length ? (
                savedPhotographers.map((photographer) => (
                  <article
                    key={photographer.id}
                    className="rounded-[24px] border border-slate-200 bg-[linear-gradient(180deg,#ffffff_0%,#f8fbff_100%)] px-4 py-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-medium text-slate-900">{photographer.name}</p>
                        <p className="mt-1 text-sm text-slate-500">{photographer.location || "Location not listed"}</p>
                      </div>
                      <StatusBadge status={photographer.interest || "saved"} />
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                      <button className="app-btn-secondary inline-flex h-10 items-center justify-center px-4 text-sm" onClick={() => setSelectedPhotographer(photographer)} type="button">
                        View profile
                      </button>
                      <button className="app-btn-primary inline-flex h-10 items-center justify-center px-4 text-sm" onClick={() => setBookingPhotographer(photographer)} type="button">
                        Choose
                      </button>
                    </div>
                  </article>
                ))
              ) : (
                <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/90 px-4 py-6 text-sm text-slate-500">
                  Save photographers you like and they will stay here.
                </div>
              )}
            </div>
          </section>

          <section className="rounded-[32px] border border-white/80 bg-white/88 p-6 shadow-[0_22px_55px_rgba(15,23,42,0.06)]">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-emerald-50 p-3 text-emerald-700">
                <HeartHandshake className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-slate-950">My photographer requests</h3>
                <p className="text-sm text-slate-500">See who you contacted and what is still pending.</p>
              </div>
            </div>

            <div className="mt-5 space-y-3">
              {bookingRequests.length ? (
                bookingRequests.slice(0, 6).map((request) => (
                  <article
                    key={request.id}
                    className="rounded-[24px] border border-slate-200 bg-[linear-gradient(180deg,#ffffff_0%,#f8fbff_100%)] px-4 py-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-medium text-slate-900">{request.photographer?.name}</p>
                        <p className="mt-1 text-sm text-slate-500">{request.eventType || "Event request"}</p>
                      </div>
                      <StatusBadge status={request.status} />
                    </div>

                    <div className="mt-3 flex flex-wrap gap-4 text-sm text-slate-500">
                      <span className="inline-flex items-center gap-2">
                        <CalendarDays className="h-4 w-4" />
                        {request.eventDate ? new Date(request.eventDate).toLocaleDateString() : "Date not set"}
                      </span>
                      <span className="inline-flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        {request.location || "Location not set"}
                      </span>
                    </div>
                  </article>
                ))
              ) : (
                <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/90 px-4 py-6 text-sm text-slate-500">
                  When you choose a photographer, your request will appear here.
                </div>
              )}
            </div>

            {skippedPhotographers.length ? (
              <div className="mt-5 rounded-[24px] border border-slate-200 bg-slate-50/90 px-4 py-4">
                <p className="text-sm font-semibold text-slate-900">Hidden photographers</p>
                <p className="mt-1 text-sm text-slate-500">
                  {skippedPhotographers.length} photographer{skippedPhotographers.length > 1 ? "s are" : " is"} hidden right now.
                </p>
              </div>
            ) : null}
          </section>
        </section>
      </div>
    </>
  );
}
