import { useEffect, useMemo, useState } from "react";
import {
  BellRing,
  FolderLock,
  KeyRound,
  Mail,
  MessageSquareText,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";
import { useLocation } from "react-router-dom";
import { SettingsTabs } from "../../components/SettingsTabs";
import { SubscriptionCard } from "../../components/SubscriptionCard";
import { useAuth } from "../../hooks/useAuth";
import {
  buildAppUser,
  photographerSettingsTabs,
  userSettingsTabs,
} from "../../lib/mockAppData";
import { api } from "../../lib/api";

function Field({ label, ...props }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-slate-700">{label}</span>
      <input
        className="app-field w-full"
        {...props}
      />
    </label>
  );
}

function TextAreaField({ label, ...props }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-slate-700">{label}</span>
      <textarea
        className="app-field min-h-36 w-full"
        {...props}
      />
    </label>
  );
}

function SelectField({ label, children, ...props }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-medium text-slate-700">{label}</span>
      <select
        className="app-field w-full"
        {...props}
      >
        {children}
      </select>
    </label>
  );
}

function SectionCard({ children, className = "" }) {
  return (
    <section
      className={`rounded-[32px] border border-white/80 bg-white/88 p-6 shadow-[0_22px_55px_rgba(15,23,42,0.06)] ${className}`}
    >
      {children}
    </section>
  );
}

export function SettingsPage() {
  const { token, user, updateUser } = useAuth();
  const location = useLocation();
  const appUser = useMemo(() => buildAppUser(user), [user]);
  const isPhotographer = appUser.role === "photographer";
  const settingsTabs = isPhotographer ? photographerSettingsTabs : userSettingsTabs;
  const [activeTab, setActiveTab] = useState(settingsTabs[0].id);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [profileForm, setProfileForm] = useState({
    name: appUser.fullName,
    displayName: appUser.displayName,
    bio: appUser.bio,
    location: appUser.location,
    city: appUser.location,
    phone: appUser.phone,
    priceRange: appUser.priceRange,
    specialties: appUser.specialties.join(", "),
    servicePackages: appUser.servicePackages.join(", "),
    portfolioImages: appUser.portfolioImages.join(", "),
    profilePhoto: appUser.avatar,
    isAvailable: appUser.isAvailable,
    availabilityLabel: appUser.availabilityLabel,
    bookingPreferences: appUser.bookingPreferences,
    communicationPreferences: appUser.communicationPreferences,
  });
  const [normalUserPreferences, setNormalUserPreferences] = useState({
    invitationFlow: "friends_first",
    roomPrivacy: "invite_only",
    savedPhotographerAlerts: "enabled",
    friendVisibility: "friends_only",
    discoveryPrivacy: "visible",
  });
  const [securityState, setSecurityState] = useState({
    has2FA: true,
    activeSessions: 3,
    lastPasswordUpdate: "27 days ago",
  });

  useEffect(() => {
    const requestedTab = location.state?.settingsTab;
    if (requestedTab && settingsTabs.some((tab) => tab.id === requestedTab)) {
      setActiveTab(requestedTab);
    }
  }, [location.state, settingsTabs]);

  async function saveProfile(payload, successMessage) {
    try {
      setIsSaving(true);
      setError("");
      setMessage("");
      const response = await api.users.updateProfile(token, payload);
      updateUser(response.user);
      setMessage(successMessage);
    } catch (saveError) {
      setError(saveError.message);
    } finally {
      setIsSaving(false);
    }
  }

  function renderUserProfileTab() {
    return (
      <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <SectionCard>
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-sky-50 p-3 text-sky-700">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-slate-950">Profile settings</h2>
              <p className="text-sm text-slate-500">
                Keep your member identity clear for rooms, invites, and saved photographer workflows.
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <Field
              label="Full name"
              onChange={(event) =>
                setProfileForm((current) => ({ ...current, name: event.target.value }))
              }
              value={profileForm.name}
            />
            <Field label="Email" readOnly type="email" value={appUser.email} />
            <Field
              label="Phone"
              onChange={(event) =>
                setProfileForm((current) => ({ ...current, phone: event.target.value }))
              }
              value={profileForm.phone}
            />
            <Field label="Account role" readOnly value={appUser.roleLabel} />
          </div>

          <div className="mt-6">
            <button
              className="app-btn-primary inline-flex h-12 items-center justify-center px-5 text-sm disabled:cursor-not-allowed disabled:opacity-60"
              disabled={isSaving}
              onClick={() =>
                saveProfile(
                  { name: profileForm.name, phone: profileForm.phone },
                  "Profile updated successfully.",
                )
              }
              type="button"
            >
              {isSaving ? "Saving..." : "Save profile"}
            </button>
          </div>
        </SectionCard>

        <SectionCard className="bg-[linear-gradient(180deg,#f9fbff_0%,#ffffff_100%)]">
          <h3 className="text-lg font-semibold text-slate-950">Member focus</h3>
          <div className="mt-5 space-y-4">
            {[
              "Create or join rooms quickly without extra workspace clutter.",
              "Keep invitation handling and saved photographers close to your daily flow.",
              "Use settings mainly for privacy, security, and subscription control.",
            ].map((item) => (
              <div key={item} className="rounded-2xl border border-slate-200 bg-white px-4 py-4 text-sm leading-6 text-slate-600">
                {item}
              </div>
            ))}
          </div>
        </SectionCard>
      </div>
    );
  }

  function renderPhotographerProfileTab() {
    return (
      <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <SectionCard>
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-emerald-50 p-3 text-emerald-700">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-slate-950">Photographer profile</h2>
              <p className="text-sm text-slate-500">
                Shape the marketplace profile clients see when they discover your work.
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-4">
            <Field
              label="Display name"
              onChange={(event) =>
                setProfileForm((current) => ({ ...current, displayName: event.target.value }))
              }
              value={profileForm.displayName}
            />
            <Field
              label="Profile photo"
              onChange={(event) =>
                setProfileForm((current) => ({ ...current, profilePhoto: event.target.value }))
              }
              placeholder="/uploads/profile.jpg or https://..."
              value={profileForm.profilePhoto}
            />
            <TextAreaField
              label="Bio"
              onChange={(event) =>
                setProfileForm((current) => ({ ...current, bio: event.target.value }))
              }
              placeholder="Describe your photography style, event focus, and what makes your work feel distinct."
              rows="5"
              value={profileForm.bio}
            />
            <div className="grid gap-4 md:grid-cols-2">
              <Field
                label="Location"
                onChange={(event) =>
                  setProfileForm((current) => ({
                    ...current,
                    location: event.target.value,
                    city: event.target.value,
                  }))
                }
                value={profileForm.location}
              />
              <Field
                label="Phone"
                onChange={(event) =>
                  setProfileForm((current) => ({ ...current, phone: event.target.value }))
                }
                value={profileForm.phone}
              />
            </div>
          </div>

          <div className="mt-6">
            <button
              className="app-btn-primary inline-flex h-12 items-center justify-center px-5 text-sm disabled:cursor-not-allowed disabled:opacity-60"
              disabled={isSaving}
              onClick={() =>
                saveProfile(
                  {
                    name: profileForm.name,
                    displayName: profileForm.displayName,
                    profilePhoto: profileForm.profilePhoto,
                    bio: profileForm.bio,
                    location: profileForm.location,
                    city: profileForm.city,
                    phone: profileForm.phone,
                  },
                  "Photographer profile updated successfully.",
                )
              }
              type="button"
            >
              {isSaving ? "Saving..." : "Save photographer profile"}
            </button>
          </div>
        </SectionCard>

        <SectionCard className="bg-[linear-gradient(180deg,#f9fbff_0%,#ffffff_100%)]">
          <h3 className="text-lg font-semibold text-slate-950">Marketplace preview</h3>
          <div className="mt-5 rounded-[32px] border border-slate-200 bg-[linear-gradient(180deg,#ffffff_0%,#f6fbff_100%)] p-5">
            <p className="text-2xl font-semibold text-slate-950">
              {profileForm.displayName || "Your display name"}
            </p>
            <p className="mt-2 text-sm text-slate-500">
              {profileForm.location || "Location not added"} • {profileForm.priceRange || "Pricing on request"}
            </p>
            <p className="mt-4 text-sm leading-7 text-slate-500">
              {profileForm.bio || "Your short photographer bio will appear here once you add it."}
            </p>
          </div>
        </SectionCard>
      </div>
    );
  }

  function renderPortfolioTab() {
    return (
      <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <SectionCard>
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-sky-50 p-3 text-sky-700">
              <FolderLock className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-slate-950">Portfolio visibility</h2>
              <p className="text-sm text-slate-500">
                Control what users can see when they browse your photographer profile.
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-4">
            <TextAreaField
              label="Portfolio images"
              onChange={(event) =>
                setProfileForm((current) => ({ ...current, portfolioImages: event.target.value }))
              }
              placeholder="Separate image paths or URLs with commas"
              rows="6"
              value={profileForm.portfolioImages}
            />
          </div>

          <div className="mt-6">
            <button
              className="app-btn-primary inline-flex h-12 items-center justify-center px-5 text-sm disabled:cursor-not-allowed disabled:opacity-60"
              disabled={isSaving}
              onClick={() =>
                saveProfile(
                  {
                    portfolioImages: profileForm.portfolioImages,
                    profilePhoto: profileForm.profilePhoto,
                  },
                  "Portfolio visibility updated successfully.",
                )
              }
              type="button"
            >
              {isSaving ? "Saving..." : "Save portfolio visibility"}
            </button>
          </div>
        </SectionCard>

        <SectionCard className="bg-[linear-gradient(180deg,#f9fbff_0%,#ffffff_100%)]">
          <h3 className="text-lg font-semibold text-slate-950">Visibility notes</h3>
          <div className="mt-5 space-y-4">
            {[
              "Add your strongest event work first so the top of the profile feels premium.",
              "Keep a balanced mix of portraits, atmosphere, and storytelling moments.",
              "Refresh the portfolio when your style evolves or your target clients change.",
            ].map((item) => (
              <div key={item} className="rounded-2xl border border-slate-200 bg-white px-4 py-4 text-sm leading-6 text-slate-600">
                {item}
              </div>
            ))}
          </div>
        </SectionCard>
      </div>
    );
  }

  function renderServicesTab() {
    return (
      <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <SectionCard>
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-amber-50 p-3 text-amber-700">
              <Mail className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-slate-950">Services and pricing</h2>
              <p className="text-sm text-slate-500">
                Tell users what you shoot and how your offer is packaged.
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-4">
            <Field
              label="Specialties"
              onChange={(event) =>
                setProfileForm((current) => ({ ...current, specialties: event.target.value }))
              }
              placeholder="Wedding, graduation, birthday, corporate event"
              value={profileForm.specialties}
            />
            <Field
              label="Price range"
              onChange={(event) =>
                setProfileForm((current) => ({ ...current, priceRange: event.target.value }))
              }
              placeholder="900 - 1800 TND"
              value={profileForm.priceRange}
            />
            <TextAreaField
              label="Services and packages"
              onChange={(event) =>
                setProfileForm((current) => ({ ...current, servicePackages: event.target.value }))
              }
              placeholder="Half-day coverage, full-day coverage, same-day teaser delivery..."
              rows="5"
              value={profileForm.servicePackages}
            />
          </div>

          <div className="mt-6">
            <button
              className="app-btn-primary inline-flex h-12 items-center justify-center px-5 text-sm disabled:cursor-not-allowed disabled:opacity-60"
              disabled={isSaving}
              onClick={() =>
                saveProfile(
                  {
                    specialties: profileForm.specialties,
                    priceRange: profileForm.priceRange,
                    servicePackages: profileForm.servicePackages,
                  },
                  "Services and pricing updated successfully.",
                )
              }
              type="button"
            >
              {isSaving ? "Saving..." : "Save services & pricing"}
            </button>
          </div>
        </SectionCard>

        <SectionCard className="bg-[linear-gradient(180deg,#f9fbff_0%,#ffffff_100%)]">
          <h3 className="text-lg font-semibold text-slate-950">Offer summary</h3>
          <div className="mt-5 space-y-4">
            {[
              ["Specialties", profileForm.specialties || "Add the kinds of events you cover best"],
              ["Price range", profileForm.priceRange || "Set the budget signal clients should expect"],
              [
                "Packages",
                profileForm.servicePackages || "Describe the services or packages you want clients to compare.",
              ],
            ].map(([label, value]) => (
              <div key={label} className="rounded-2xl border border-slate-200 bg-white px-4 py-4">
                <p className="text-xs uppercase tracking-[0.18em] text-slate-400">{label}</p>
                <p className="mt-2 text-sm font-medium leading-6 text-slate-900">{value}</p>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>
    );
  }

  function renderAvailabilityTab() {
    return (
      <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <SectionCard>
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-emerald-50 p-3 text-emerald-700">
              <BellRing className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-slate-950">Availability</h2>
              <p className="text-sm text-slate-500">
                Make it obvious when you are open to new work and what your current schedule looks like.
              </p>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            <label className="flex items-center justify-between rounded-[24px] border border-slate-200 bg-slate-50/90 px-4 py-4">
              <div>
                <p className="font-medium text-slate-900">Open for new bookings</p>
                <p className="mt-1 text-sm text-slate-500">
                  Turn this off when your calendar is full.
                </p>
              </div>
              <input
                checked={profileForm.isAvailable}
                className="h-5 w-5 accent-emerald-600"
                onChange={(event) =>
                  setProfileForm((current) => ({ ...current, isAvailable: event.target.checked }))
                }
                type="checkbox"
              />
            </label>

            <Field
              label="Availability label"
              onChange={(event) =>
                setProfileForm((current) => ({ ...current, availabilityLabel: event.target.value }))
              }
              placeholder="Available for weddings in June"
              value={profileForm.availabilityLabel}
            />
          </div>

          <div className="mt-6">
            <button
              className="app-btn-primary inline-flex h-12 items-center justify-center px-5 text-sm disabled:cursor-not-allowed disabled:opacity-60"
              disabled={isSaving}
              onClick={() =>
                saveProfile(
                  {
                    isAvailable: profileForm.isAvailable,
                    availabilityLabel: profileForm.availabilityLabel,
                  },
                  "Availability updated successfully.",
                )
              }
              type="button"
            >
              {isSaving ? "Saving..." : "Save availability"}
            </button>
          </div>
        </SectionCard>

        <SectionCard className="bg-[linear-gradient(180deg,#f9fbff_0%,#ffffff_100%)]">
          <h3 className="text-lg font-semibold text-slate-950">Client-facing status</h3>
          <div className="mt-5 rounded-[28px] border border-slate-200 bg-white px-5 py-5">
            <p className="text-sm font-medium text-slate-900">
              {profileForm.isAvailable ? "Visible as available" : "Visible as currently unavailable"}
            </p>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              {profileForm.availabilityLabel || "Add a label so clients understand your current schedule."}
            </p>
          </div>
        </SectionCard>
      </div>
    );
  }

  function renderBookingTab() {
    return (
      <SectionCard>
        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-violet-50 p-3 text-violet-700">
            <Mail className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-slate-950">Booking preferences</h2>
            <p className="text-sm text-slate-500">
              Set expectations before a client sends a collaboration request.
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-4">
          <TextAreaField
            label="Booking preferences"
            onChange={(event) =>
              setProfileForm((current) => ({ ...current, bookingPreferences: event.target.value }))
            }
            placeholder="Share the details you need before saying yes to a booking request."
            rows="5"
            value={profileForm.bookingPreferences}
          />
        </div>

        <div className="mt-6">
          <button
            className="app-btn-primary inline-flex h-12 items-center justify-center px-5 text-sm disabled:cursor-not-allowed disabled:opacity-60"
            disabled={isSaving}
            onClick={() =>
              saveProfile(
                { bookingPreferences: profileForm.bookingPreferences },
                "Booking preferences updated successfully.",
              )
            }
            type="button"
          >
            {isSaving ? "Saving..." : "Save booking preferences"}
          </button>
        </div>
      </SectionCard>
    );
  }

  function renderCommunicationTab() {
    return (
      <SectionCard>
        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-amber-50 p-3 text-amber-700">
            <MessageSquareText className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-slate-950">Client communication preferences</h2>
            <p className="text-sm text-slate-500">
              Share how you like to communicate once a client reaches out.
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-4">
          <TextAreaField
            label="Communication preferences"
            onChange={(event) =>
              setProfileForm((current) => ({
                ...current,
                communicationPreferences: event.target.value,
              }))
            }
            placeholder="Example: Email first for planning details, WhatsApp for day-of coordination."
            rows="5"
            value={profileForm.communicationPreferences}
          />
        </div>

        <div className="mt-6">
          <button
            className="app-btn-primary inline-flex h-12 items-center justify-center px-5 text-sm disabled:cursor-not-allowed disabled:opacity-60"
            disabled={isSaving}
            onClick={() =>
              saveProfile(
                { communicationPreferences: profileForm.communicationPreferences },
                "Communication preferences updated successfully.",
              )
            }
            type="button"
          >
            {isSaving ? "Saving..." : "Save communication preferences"}
          </button>
        </div>
      </SectionCard>
    );
  }

  function renderSecurityTab() {
    return (
      <div className="grid gap-6 xl:grid-cols-2">
        <SectionCard>
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-sky-50 p-3 text-sky-700">
              <KeyRound className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-slate-950">Account security</h2>
              <p className="text-sm text-slate-500">
                Keep your PixRoom+ account protected with strong sign-in habits and session awareness.
              </p>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
              <p className="font-medium text-slate-900">Password updates</p>
              <p className="mt-1 text-sm text-slate-500">
                Last changed {securityState.lastPasswordUpdate}.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="font-medium text-slate-900">Two-factor authentication</p>
                  <p className="mt-1 text-sm text-slate-500">
                    {securityState.has2FA
                      ? "Enabled for your dashboard sign-in."
                      : "Add an extra approval step for workspace changes."}
                  </p>
                </div>
                <button
                  className={`inline-flex h-11 items-center justify-center rounded-2xl px-4 text-sm font-semibold transition ${
                    securityState.has2FA
                      ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                      : "app-btn-primary"
                  }`}
                  onClick={() =>
                    setSecurityState((current) => ({ ...current, has2FA: !current.has2FA }))
                  }
                  type="button"
                >
                  {securityState.has2FA ? "Disable" : "Enable"}
                </button>
              </div>
            </div>
          </div>
        </SectionCard>

        <SectionCard>
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-violet-50 p-3 text-violet-700">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-slate-950">Active sessions</h2>
              <p className="text-sm text-slate-500">
                {securityState.activeSessions} devices are currently signed in.
              </p>
            </div>
          </div>

          <div className="mt-6 space-y-3">
            {[
              { device: "MacBook Pro - Chrome", location: "Tunis, TN", active: true },
              { device: "iPhone 15 - Safari", location: "Tunis, TN", active: false },
              { device: "Windows PC - Edge", location: "Sfax, TN", active: false },
            ].map((session) => (
              <div
                key={session.device}
                className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4"
              >
                <div>
                  <p className="font-medium text-slate-900">{session.device}</p>
                  <p className="text-sm text-slate-500">{session.location}</p>
                </div>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    session.active ? "bg-emerald-50 text-emerald-700" : "bg-slate-200 text-slate-700"
                  }`}
                >
                  {session.active ? "Current session" : "Recent session"}
                </span>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>
    );
  }

  function renderUserInvitationsTab() {
    return (
      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <SectionCard>
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-amber-50 p-3 text-amber-700">
              <Mail className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-slate-950">Invitation preferences</h2>
              <p className="text-sm text-slate-500">
                Control how room invites and friend flows feel in your daily experience.
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <SelectField
              label="Preferred invitation flow"
              onChange={(event) =>
                setNormalUserPreferences((current) => ({
                  ...current,
                  invitationFlow: event.target.value,
                }))
              }
              value={normalUserPreferences.invitationFlow}
            >
              <option value="friends_first">Invite through friends first</option>
              <option value="manual_code">Prefer room code entry</option>
            </SelectField>
            <SelectField
              label="Default room privacy"
              onChange={(event) =>
                setNormalUserPreferences((current) => ({
                  ...current,
                  roomPrivacy: event.target.value,
                }))
              }
              value={normalUserPreferences.roomPrivacy}
            >
              <option value="invite_only">Invite only</option>
              <option value="public">Public</option>
              <option value="private">Private</option>
            </SelectField>
          </div>

          <div className="mt-6 rounded-[28px] border border-slate-200 bg-slate-50/90 p-5 text-sm text-slate-500">
            Keep invitations simple: rooms, friends, and photographer discovery should feel coordinated instead of noisy.
          </div>
        </SectionCard>

        <SectionCard className="bg-[linear-gradient(180deg,#f9fbff_0%,#ffffff_100%)]">
          <h3 className="text-lg font-semibold text-slate-950">What this affects</h3>
          <div className="mt-5 space-y-4">
            {[
              "How quickly you can invite trusted people into rooms.",
              "Whether room access feels more private or more open by default.",
              "How friend requests and room invitations fit together across PixRoom+.",
            ].map((item) => (
              <div key={item} className="rounded-2xl border border-slate-200 bg-white px-4 py-4 text-sm leading-6 text-slate-600">
                {item}
              </div>
            ))}
          </div>
        </SectionCard>
      </div>
    );
  }

  function renderPrivacyTab() {
    return (
      <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <SectionCard>
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-violet-50 p-3 text-violet-700">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-slate-950">Friends and privacy</h2>
              <p className="text-sm text-slate-500">
                Decide how visible your account feels inside the social and discovery parts of PixRoom+.
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-4">
            <SelectField
              label="Friend visibility"
              onChange={(event) =>
                setNormalUserPreferences((current) => ({
                  ...current,
                  friendVisibility: event.target.value,
                }))
              }
              value={normalUserPreferences.friendVisibility}
            >
              <option value="friends_only">Friends only</option>
              <option value="discoverable">Discoverable to all signed-in users</option>
            </SelectField>
            <SelectField
              label="Saved photographer alerts"
              onChange={(event) =>
                setNormalUserPreferences((current) => ({
                  ...current,
                  savedPhotographerAlerts: event.target.value,
                }))
              }
              value={normalUserPreferences.savedPhotographerAlerts}
            >
              <option value="enabled">Enabled</option>
              <option value="muted">Muted</option>
            </SelectField>
            <SelectField
              label="Discovery visibility"
              onChange={(event) =>
                setNormalUserPreferences((current) => ({
                  ...current,
                  discoveryPrivacy: event.target.value,
                }))
              }
              value={normalUserPreferences.discoveryPrivacy}
            >
              <option value="visible">Visible to other members</option>
              <option value="limited">Keep profile lower-key</option>
            </SelectField>
          </div>
        </SectionCard>

        <SectionCard className="bg-[linear-gradient(180deg,#f9fbff_0%,#ffffff_100%)]">
          <h3 className="text-lg font-semibold text-slate-950">Privacy guidance</h3>
          <div className="mt-5 space-y-4">
            {[
              "Friends are for trusted, reusable room invitations.",
              "Saved photographer alerts help you keep up with professionals you are considering.",
              "Privacy settings should support rooms and discovery without making the app feel hidden.",
            ].map((item) => (
              <div key={item} className="rounded-2xl border border-slate-200 bg-white px-4 py-4 text-sm leading-6 text-slate-600">
                {item}
              </div>
            ))}
          </div>
        </SectionCard>
      </div>
    );
  }

  function renderSubscriptionTab() {
    return (
      <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <div className="space-y-6">
          <SectionCard>
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-slate-100 p-3 text-slate-700">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-slate-950">Current subscription</h2>
                <p className="text-sm text-slate-500">
                  {isPhotographer
                    ? "Review the professional tools tied to your photographer plan."
                    : "Review the plan that powers your rooms, invites, and premium features."}
                </p>
              </div>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {[
                ["Plan", appUser.plan],
                ["Status", appUser.billingStatus],
                ["Private rooms", appUser.plan === "Starter" ? "Upgrade required" : "Included"],
                ["AI assistant", appUser.canUseAssistant ? "Included" : "Upgrade required"],
              ].map(([label, value]) => (
                <div key={label} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-slate-400">{label}</p>
                  <p className="mt-2 text-lg font-semibold text-slate-950">{value}</p>
                </div>
              ))}
            </div>
          </SectionCard>
        </div>

        <SubscriptionCard
          ctaLabel="Explore upgrades"
          description={
            isPhotographer
              ? "Built for photographers who need a polished marketplace presence, stronger room delivery tools, and a professional workspace."
              : "Built for members who want private rooms, smoother invites, and premium sharing controls."
          }
          features={
            isPhotographer
              ? [
                  "Photographer discovery presence",
                  "Professional room delivery workflow",
                  "Portfolio and pricing visibility",
                  "Premium collaboration tools",
                ]
              : [
                  "Private and invite-only rooms",
                  "AI assistant across the dashboard",
                  "Higher storage for large photo collections",
                  "Premium room collaboration controls",
                ]
          }
          highlighted
          onAction={() => setActiveTab("subscription")}
          plan={isPhotographer ? "Photographer Pro" : "Premium access"}
          price={isPhotographer ? "18 DT" : "12 DT"}
          status={isPhotographer ? "Professional tools unlocked" : "Recommended for active room sharing"}
        />
      </div>
    );
  }

  const photographerContent = {
    profile: renderPhotographerProfileTab(),
    portfolio: renderPortfolioTab(),
    services: renderServicesTab(),
    availability: renderAvailabilityTab(),
    booking: renderBookingTab(),
    communication: renderCommunicationTab(),
    security: renderSecurityTab(),
    subscription: renderSubscriptionTab(),
  };

  const userContent = {
    profile: renderUserProfileTab(),
    security: renderSecurityTab(),
    invitations: renderUserInvitationsTab(),
    privacy: renderPrivacyTab(),
    subscription: renderSubscriptionTab(),
  };

  const tabContent = isPhotographer ? photographerContent : userContent;

  return (
    <div className="space-y-6 lg:space-y-8">
      <section className="rounded-[36px] border border-white/80 bg-white/84 p-6 shadow-[0_22px_55px_rgba(15,23,42,0.06)] sm:p-8">
        <div className="max-w-3xl">
          <span className="inline-flex rounded-full border border-slate-200 bg-slate-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-600">
            Settings
          </span>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950 sm:text-[2.7rem]">
            {isPhotographer
              ? "Control your photographer workspace"
              : "Control your member experience"}
          </h2>
          <p className="mt-3 text-sm leading-7 text-slate-500 sm:text-base">
            {isPhotographer
              ? "Manage your public profile, portfolio visibility, services, availability, communication style, security, and professional subscription settings."
              : "Manage your account profile, invitation flow, privacy preferences, security, and subscription settings."}
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

      <SettingsTabs activeTab={activeTab} onChange={setActiveTab} tabs={settingsTabs} />

      {tabContent[activeTab]}
    </div>
  );
}
