import { useState } from "react";
import { Link } from "react-router-dom";
import { StatusBanner } from "../../components/StatusBanner";
import { useAuth } from "../../hooks/useAuth";
import { api } from "../../lib/api";

export function AssistantPage() {
  const { token, user } = useAuth();
  const [message, setMessage] = useState("");
  const [reply, setReply] = useState("");
  const [error, setError] = useState("");
  const [isSending, setIsSending] = useState(false);

  const canUseAssistant = user.features?.canUseAssistant;

  async function handleSubmit(event) {
    event.preventDefault();
    setReply("");
    setError("");

    if (!message.trim()) {
      setError("Ask a question first.");
      return;
    }

    try {
      setIsSending(true);
      const data = await api.assistant.chat(token, message);
      setReply(data.reply);
    } catch (chatError) {
      setError(chatError.message);
    } finally {
      setIsSending(false);
    }
  }

  return (
    <div className="page-grid">
      <section className="panel hero-panel">
        <span className="eyebrow">AI assistant</span>
        <h2>Ask PixRoom+ how the app works</h2>
        <p>Use the assistant to understand rooms, pricing, uploads, invitations, and premium features.</p>
      </section>

      {!canUseAssistant ? (
        <div className="panel empty-state">
          <p>The assistant is available on premium and photographer plans.</p>
          <Link className="button button--primary" to="/app/billing">
            Upgrade plan
          </Link>
        </div>
      ) : (
        <section className="panel page-panel">
          <StatusBanner type="error">{error}</StatusBanner>
          <StatusBanner type="success">{reply}</StatusBanner>

          <form className="form-grid" onSubmit={handleSubmit}>
            <label className="field field--full">
              <span>Your question</span>
              <textarea
                rows="5"
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                placeholder="How do private rooms work for premium users?"
              />
            </label>

            <button className="button button--primary" disabled={isSending} type="submit">
              {isSending ? "Thinking..." : "Ask assistant"}
            </button>
          </form>
        </section>
      )}
    </div>
  );
}
