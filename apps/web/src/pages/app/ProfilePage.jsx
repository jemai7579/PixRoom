import { useState } from "react";
import { Link } from "react-router-dom";
import { StatusBanner } from "../../components/StatusBanner";
import { useAuth } from "../../hooks/useAuth";
import { api } from "../../lib/api";

export function ProfilePage() {
  const { token, user, updateUser } = useAuth();
  const [form, setForm] = useState({
    name: user.name || "",
    city: user.photographerProfile?.city || "",
    phone: user.photographerProfile?.phone || "",
    bio: user.photographerProfile?.bio || "",
    specialties: (user.photographerProfile?.specialties || []).join(", "),
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  function handleChange(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage("");
    setError("");

    try {
      setIsSaving(true);
      const data = await api.users.updateProfile(token, form);
      updateUser(data.user);
      setMessage("Profile updated.");
    } catch (saveError) {
      setError(saveError.message);
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="page-grid">
      <section className="panel hero-panel">
        <span className="eyebrow">Profile</span>
        <h2>Your PixRoom+ profile</h2>
        <p>
          Keep your account details current and complete your photographer profile if you create
          rooms or deliver galleries for clients.
        </p>

        <div className="button-row">
          <Link className="button button--secondary" to="/app/billing">
            Manage plan
          </Link>
          <Link className="button button--secondary" to="/app/marketplace">
            Open marketplace
          </Link>
        </div>
      </section>

      <StatusBanner type="success">{message}</StatusBanner>
      <StatusBanner type="error">{error}</StatusBanner>

      <section className="panel page-panel">
        <form className="form-grid" onSubmit={handleSubmit}>
          <label className="field">
            <span>Name</span>
            <input name="name" value={form.name} onChange={handleChange} />
          </label>

          <label className="field">
            <span>Email</span>
            <input disabled value={user.email} />
          </label>

          {user.role === "photographer" ? (
            <>
              <label className="field">
                <span>City</span>
                <input name="city" value={form.city} onChange={handleChange} placeholder="Tunis" />
              </label>

              <label className="field">
                <span>Phone</span>
                <input name="phone" value={form.phone} onChange={handleChange} placeholder="+216..." />
              </label>

              <label className="field field--full">
                <span>Bio</span>
                <textarea
                  name="bio"
                  rows="4"
                  value={form.bio}
                  onChange={handleChange}
                  placeholder="Tell clients about your style and experience"
                />
              </label>

              <label className="field field--full">
                <span>Specialties</span>
                <input
                  name="specialties"
                  value={form.specialties}
                  onChange={handleChange}
                  placeholder="Weddings, corporate, family sessions"
                />
              </label>
            </>
          ) : null}

          <button className="button button--primary" disabled={isSaving} type="submit">
            {isSaving ? "Saving..." : "Save profile"}
          </button>
        </form>
      </section>
    </div>
  );
}
