import { useState } from "react";
import { Camera, ChevronDown, Lock, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { api } from "../../lib/api";

const eventTypes = [
  "Wedding",
  "Birthday",
  "Engagement",
  "Baby shower",
  "Corporate event",
  "Graduation",
  "Trip",
  "Other",
];

function ChoiceCard({ active, description, icon: Icon, onClick, title }) {
  return (
    <button
      className={[
        "rounded-[28px] border p-5 text-left transition",
        active
          ? "border-orange-300 bg-orange-50 shadow-[0_18px_40px_rgba(249,115,22,0.08)]"
          : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50",
      ].join(" ")}
      onClick={onClick}
      type="button"
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-slate-900 shadow-sm">
        <Icon className="h-5 w-5" />
      </div>
      <h3 className="mt-4 text-lg font-semibold text-slate-950">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-500">{description}</p>
    </button>
  );
}

export function CreateRoomPage() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    eventType: "",
    description: "",
    eventDate: "",
    visibility: "private",
    inviteTiming: "now",
    photographerTiming: "later",
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showMoreSettings, setShowMoreSettings] = useState(false);

  function handleChange(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (!form.title.trim()) {
      setError("Add a room name first.");
      return;
    }

    if (!form.eventType.trim()) {
      setError("Choose an event type.");
      return;
    }

    try {
      setIsSubmitting(true);
      const payload = {
        title: form.title.trim(),
        eventType: form.eventType,
        description: form.description.trim(),
        eventDate: form.eventDate,
        visibility: form.visibility,
      };

      const data = await api.rooms.create(token, payload);
      navigate(`/app/rooms/${data.room.id}`, {
        state: {
          openInviteFriends: form.inviteTiming === "now",
        },
      });
    } catch (submitError) {
      setError(submitError.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="space-y-6 lg:space-y-8">
      <section className="rounded-[36px] border border-white/80 bg-[linear-gradient(135deg,#fffaf5_0%,#ffffff_45%,#f4fbff_100%)] p-6 shadow-[0_24px_60px_rgba(15,23,42,0.06)] sm:p-8">
        <span className="inline-flex rounded-full border border-orange-200 bg-orange-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-orange-700">
          Create your room
        </span>
        <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950 sm:text-[2.7rem]">
          Make a room in less than one minute.
        </h2>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
          Keep it simple: give the room a name, choose the event type, decide if it is public or
          private, and invite people when you are ready.
        </p>
      </section>

      <form className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]" onSubmit={handleSubmit}>
        <section className="space-y-6 rounded-[32px] border border-white/80 bg-white/88 p-6 shadow-[0_22px_55px_rgba(15,23,42,0.06)]">
          <div>
            <h3 className="text-2xl font-semibold tracking-tight text-slate-950">Basic details</h3>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              This is the only information most people need to get started.
            </p>
          </div>

          {error ? (
            <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
              {error}
            </div>
          ) : null}

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-700">Room name</span>
            <input
              className="app-field w-full"
              name="title"
              onChange={handleChange}
              placeholder="Sara & Youssef wedding"
              value={form.title}
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-700">Event type</span>
            <select
              className="app-field w-full"
              name="eventType"
              onChange={handleChange}
              value={form.eventType}
            >
              <option value="">Choose one</option>
              {eventTypes.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>

          <div>
            <span className="mb-3 block text-sm font-medium text-slate-700">Privacy</span>
            <div className="grid gap-4 sm:grid-cols-2">
              <ChoiceCard
                active={form.visibility === "private"}
                description="Only invited people can join. Best for personal events."
                icon={Lock}
                onClick={() => setForm((current) => ({ ...current, visibility: "private" }))}
                title="Private room"
              />
              <ChoiceCard
                active={form.visibility === "public"}
                description="Anyone with the room code can join more easily."
                icon={Users}
                onClick={() => setForm((current) => ({ ...current, visibility: "public" }))}
                title="Public room"
              />
            </div>
          </div>

          <button
            className="flex w-full items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-left text-sm font-semibold text-slate-900 transition hover:border-slate-300 hover:bg-white"
            onClick={() => setShowMoreSettings((current) => !current)}
            type="button"
          >
            More settings
            <ChevronDown className={["h-4 w-4 transition", showMoreSettings ? "rotate-180" : ""].join(" ")} />
          </button>

          {showMoreSettings ? (
            <div className="grid gap-4 rounded-[28px] border border-slate-200 bg-slate-50/80 p-5">
              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-700">Event date</span>
                <input
                  className="app-field w-full bg-white"
                  name="eventDate"
                  onChange={handleChange}
                  type="date"
                  value={form.eventDate}
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium text-slate-700">A short note</span>
                <textarea
                  className="app-field min-h-32 w-full bg-white"
                  name="description"
                  onChange={handleChange}
                  placeholder="Tell people what kind of photos to share."
                  rows="4"
                  value={form.description}
                />
              </label>
            </div>
          ) : null}
        </section>

        <section className="space-y-6">
          <section className="rounded-[32px] border border-white/80 bg-white/88 p-6 shadow-[0_22px_55px_rgba(15,23,42,0.06)]">
            <h3 className="text-xl font-semibold text-slate-950">What happens next?</h3>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Choose how you want to continue right after the room is created.
            </p>

            <div className="mt-5 space-y-4">
              <div>
                <span className="mb-3 block text-sm font-medium text-slate-700">Invite friends</span>
                <div className="grid gap-3">
                  <button
                    className={[
                      "rounded-2xl border px-4 py-4 text-left transition",
                      form.inviteTiming === "now"
                        ? "border-orange-300 bg-orange-50"
                        : "border-slate-200 bg-white hover:border-slate-300",
                    ].join(" ")}
                    onClick={() => setForm((current) => ({ ...current, inviteTiming: "now" }))}
                    type="button"
                  >
                    <p className="font-semibold text-slate-950">Invite friends now</p>
                    <p className="mt-1 text-sm text-slate-500">Open the invite list as soon as the room is created.</p>
                  </button>
                  <button
                    className={[
                      "rounded-2xl border px-4 py-4 text-left transition",
                      form.inviteTiming === "later"
                        ? "border-orange-300 bg-orange-50"
                        : "border-slate-200 bg-white hover:border-slate-300",
                    ].join(" ")}
                    onClick={() => setForm((current) => ({ ...current, inviteTiming: "later" }))}
                    type="button"
                  >
                    <p className="font-semibold text-slate-950">Invite later</p>
                    <p className="mt-1 text-sm text-slate-500">Create the room first and invite people when you are ready.</p>
                  </button>
                </div>
              </div>

              <div>
                <span className="mb-3 block text-sm font-medium text-slate-700">Photographer</span>
                <div className="grid gap-3">
                  <button
                    className={[
                      "rounded-2xl border px-4 py-4 text-left transition",
                      form.photographerTiming === "now"
                        ? "border-orange-300 bg-orange-50"
                        : "border-slate-200 bg-white hover:border-slate-300",
                    ].join(" ")}
                    onClick={() => setForm((current) => ({ ...current, photographerTiming: "now" }))}
                    type="button"
                  >
                    <p className="font-semibold text-slate-950">Look for a photographer now</p>
                    <p className="mt-1 text-sm text-slate-500">After you create the room, you can head straight to photographer discovery.</p>
                  </button>
                  <button
                    className={[
                      "rounded-2xl border px-4 py-4 text-left transition",
                      form.photographerTiming === "later"
                        ? "border-orange-300 bg-orange-50"
                        : "border-slate-200 bg-white hover:border-slate-300",
                    ].join(" ")}
                    onClick={() => setForm((current) => ({ ...current, photographerTiming: "later" }))}
                    type="button"
                  >
                    <p className="font-semibold text-slate-950">Add a photographer later</p>
                    <p className="mt-1 text-sm text-slate-500">Keep things simple for now and add one from the room page later.</p>
                  </button>
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-[32px] border border-slate-200 bg-[linear-gradient(180deg,#fff8f1_0%,#ffffff_100%)] p-6 shadow-[0_20px_50px_rgba(15,23,42,0.05)]">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-slate-900 shadow-sm">
                <Camera className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-950">Grandma test</h3>
                <p className="text-sm text-slate-500">This page should be understandable without help.</p>
              </div>
            </div>

            <ul className="mt-5 space-y-3 text-sm leading-6 text-slate-600">
              <li>1. Name the room.</li>
              <li>2. Choose the event type.</li>
              <li>3. Pick private or public.</li>
              <li>4. Create the room.</li>
            </ul>

            <button className="app-btn-primary mt-6 inline-flex h-12 w-full items-center justify-center px-5 text-sm disabled:cursor-not-allowed disabled:opacity-60" disabled={isSubmitting} type="submit">
              {isSubmitting ? "Creating your room..." : "Create room"}
            </button>
          </section>
        </section>
      </form>
    </div>
  );
}
