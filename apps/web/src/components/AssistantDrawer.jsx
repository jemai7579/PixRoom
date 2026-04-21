import { Bot, MessageSquarePlus, Send, Sparkles, X } from "lucide-react";

const starterPrompts = [
  "Summarize my pending invitations and joined rooms.",
  "Suggest a room privacy setup for a private client gallery.",
  "What does my current subscription unlock for photographers?",
];

export function AssistantDrawer({
  canUseAssistant,
  error,
  input,
  isOpen,
  isSending,
  messages,
  onClose,
  onInputChange,
  onPromptSelect,
  onSubmit,
}) {
  return (
    <>
      <div
        aria-hidden={!isOpen}
        className={[
          "fixed inset-0 z-40 bg-slate-950/18 backdrop-blur-[2px] transition duration-300",
          isOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0",
        ].join(" ")}
        onClick={onClose}
      />

      <aside
        aria-hidden={!isOpen}
        aria-label="AI Assistant"
        className={[
          "fixed inset-y-0 right-0 z-50 flex h-screen w-full max-w-[440px] flex-col border-l border-slate-200/80 bg-[linear-gradient(180deg,rgba(252,253,255,0.98)_0%,rgba(245,248,252,0.98)_100%)] shadow-[0_30px_90px_rgba(15,23,42,0.16)] backdrop-blur-xl transition-transform duration-300",
          isOpen ? "translate-x-0" : "translate-x-full",
        ].join(" ")}
      >
        <div className="flex items-start justify-between gap-4 border-b border-slate-200/80 px-5 py-5 sm:px-6">
          <div className="min-w-0">
            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-emerald-700">
              <Sparkles className="h-3.5 w-3.5" />
              AI Assistant
            </span>
            <h2 className="mt-3 text-xl font-semibold tracking-tight text-slate-950">
              Global PixRoom+ help
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Keep the current page in view while you ask about rooms, uploads, invitations, privacy,
              subscriptions, and photographer tools.
            </p>
          </div>

          <button
            aria-label="Close AI Assistant"
            className="app-btn-icon shrink-0 self-start"
            onClick={onClose}
            type="button"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {!canUseAssistant ? (
          <div className="m-5 rounded-[28px] border border-amber-200 bg-amber-50/90 p-5 text-sm text-amber-900 sm:m-6">
            <div className="flex items-start gap-3">
              <div className="rounded-2xl bg-white/80 p-3 text-amber-700">
                <Bot className="h-5 w-5" />
              </div>
              <div>
                <p className="font-semibold">Assistant access is not active on this plan.</p>
                <p className="mt-2 leading-6 text-amber-800">
                  Upgrade to a Premium or Photographer plan to get AI help for room setup, sharing
                  workflows, and client delivery.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="flex-1 space-y-5 overflow-y-auto px-5 py-5 sm:px-6">
              {messages.length === 0 ? (
                <section className="rounded-[28px] border border-slate-200 bg-white/90 p-5 shadow-[0_18px_45px_rgba(15,23,42,0.05)]">
                  <div className="flex items-center gap-3">
                    <div className="rounded-2xl bg-slate-100 p-3 text-slate-700">
                      <MessageSquarePlus className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-semibold text-slate-950">Start with a quick prompt</h3>
                      <p className="text-sm text-slate-500">
                        The conversation stays available while you navigate around the dashboard.
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 space-y-3">
                    {starterPrompts.map((prompt) => (
                      <button
                        key={prompt}
                        className="app-btn-ghost w-full justify-start px-4 py-3 text-left text-sm font-medium text-slate-700"
                        onClick={() => onPromptSelect(prompt)}
                        type="button"
                      >
                        {prompt}
                      </button>
                    ))}
                  </div>
                </section>
              ) : null}

              {messages.map((message) => (
                <div
                  key={message.id}
                  className={message.role === "user" ? "flex justify-end" : "flex justify-start"}
                >
                  <div
                    className={[
                      "max-w-[88%] rounded-[24px] px-4 py-3 text-sm leading-6 shadow-sm",
                      message.role === "user"
                        ? "border border-orange-200 bg-orange-500 text-white shadow-[0_12px_24px_rgba(249,115,22,0.22)]"
                        : "border border-slate-200 bg-white text-slate-700",
                    ].join(" ")}
                  >
                    <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.2em] opacity-65">
                      {message.role === "user" ? "You" : "PixRoom+ AI"}
                    </p>
                    <p>{message.content}</p>
                  </div>
                </div>
              ))}

              {error ? (
                <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                  {error}
                </div>
              ) : null}
            </div>

            <div className="border-t border-slate-200/80 px-5 py-5 sm:px-6">
              <form className="space-y-4" onSubmit={onSubmit}>
                <label className="block">
                  <span className="mb-2 block text-sm font-medium text-slate-700">
                    Ask about rooms, sharing, invitations, or subscriptions
                  </span>
                  <textarea
                    className="app-field min-h-[120px] w-full bg-white"
                    onChange={(event) => onInputChange(event.target.value)}
                    placeholder="How should I set up a private room for a wedding client and their guests?"
                    value={input}
                  />
                </label>

                <button className="app-btn-primary inline-flex h-12 w-full items-center justify-center gap-2 px-5 text-sm disabled:cursor-not-allowed disabled:opacity-60" disabled={isSending} type="submit">
                  <Send className="h-4 w-4" />
                  {isSending ? "Thinking..." : "Send to assistant"}
                </button>
              </form>
            </div>
          </>
        )}
      </aside>
    </>
  );
}
