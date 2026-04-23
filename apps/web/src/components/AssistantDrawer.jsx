import { Bot, MessageSquarePlus, RotateCcw, Send, Sparkles, X } from "lucide-react";

const defaultStarterPrompts = [
  "How do I create a room?",
  "How do I invite friends?",
  "How do I invite a photographer?",
  "How do I download photos?",
];

function uniquePrompts(prompts) {
  return Array.from(new Set([...(prompts || []), ...defaultStarterPrompts])).slice(0, 4);
}

export function AssistantDrawer({
  canUseAssistant,
  error,
  input,
  isOpen,
  isSending,
  messages,
  onClose,
  onClearConversation,
  onInputChange,
  onPromptSelect,
  onSubmit,
  suggestedPrompts = defaultStarterPrompts,
}) {
  const visiblePrompts = uniquePrompts(suggestedPrompts);

  return (
    <>
      <div
        aria-hidden={!isOpen}
        className={[
          "fixed inset-0 z-40 bg-slate-950/24 backdrop-blur-[3px] transition duration-300",
          isOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0",
        ].join(" ")}
        onClick={onClose}
      />

      <aside
        aria-hidden={!isOpen}
        aria-label="AI Assistant"
        className={[
          "fixed inset-y-0 right-0 z-50 flex h-[100dvh] w-full max-w-[520px] flex-col overflow-hidden border-l border-white/70 bg-[linear-gradient(180deg,rgba(255,251,247,0.98)_0%,rgba(248,251,255,0.98)_48%,rgba(255,255,255,0.99)_100%)] shadow-[0_34px_110px_rgba(15,23,42,0.22)] backdrop-blur-2xl transition-transform duration-300",
          isOpen ? "translate-x-0" : "translate-x-full",
        ].join(" ")}
      >
        <div className="relative overflow-hidden border-b border-white/80 px-5 pb-5 pt-5 sm:px-7 sm:pb-6 sm:pt-6">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_0%,rgba(249,115,22,0.18),transparent_34%),radial-gradient(circle_at_86%_22%,rgba(20,184,166,0.12),transparent_30%)]" />
          <div className="relative flex flex-col gap-5">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <span className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-white/80 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-orange-700 shadow-sm">
                  <Sparkles className="h-3.5 w-3.5" />
                  AI Assistant
                </span>
                <h2 className="mt-4 max-w-[14rem] text-2xl font-semibold leading-tight tracking-tight text-slate-950 sm:max-w-none sm:text-[1.75rem]">
                  PixRoom+ AI Assistant
                </h2>
                <p className="mt-2 max-w-md text-sm leading-6 text-slate-600">
                  Ask me how to use rooms, invitations, photos, and photographers.
                </p>
              </div>

              <button
                aria-label="Close AI Assistant"
                className="app-btn-icon shrink-0 bg-white/90"
                onClick={onClose}
                type="button"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {canUseAssistant ? (
              <div className="flex flex-wrap items-center gap-2">
                <button
                  className="inline-flex min-h-10 items-center justify-center gap-2 rounded-2xl border border-slate-200/90 bg-white/86 px-3.5 text-xs font-semibold text-slate-600 shadow-[0_10px_24px_rgba(15,23,42,0.06)] transition hover:-translate-y-0.5 hover:border-orange-200 hover:bg-orange-50 hover:text-orange-700"
                  onClick={onClearConversation}
                  type="button"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  Clear conversation
                </button>
                <div className="inline-flex min-h-10 items-center gap-2 rounded-2xl border border-emerald-100 bg-emerald-50/90 px-3.5 text-xs font-semibold text-emerald-700">
                  <Bot className="h-3.5 w-3.5" />
                  Context aware help
                </div>
              </div>
            ) : null}
          </div>
        </div>

        {!canUseAssistant ? (
          <div className="m-5 rounded-[28px] border border-amber-200 bg-amber-50/90 p-5 text-sm text-amber-900 shadow-[0_18px_45px_rgba(15,23,42,0.06)] sm:m-7">
            <div className="flex items-start gap-3">
              <div className="rounded-2xl bg-white/80 p-3 text-amber-700">
                <Bot className="h-5 w-5" />
              </div>
              <div>
                <p className="font-semibold">Assistant access is not active on this plan.</p>
                <p className="mt-2 leading-6 text-amber-800">
                  Upgrade to Premium or Photographer to get AI help for rooms, sharing, and client delivery.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="flex-1 space-y-6 overflow-y-auto px-5 py-5 sm:px-7 sm:py-6">
              {messages.length === 0 ? (
                <section className="rounded-[30px] border border-white/80 bg-white/90 p-5 shadow-[0_22px_55px_rgba(15,23,42,0.07)]">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[linear-gradient(135deg,#fff7ed_0%,#ffedd5_100%)] text-orange-700 shadow-sm">
                      <MessageSquarePlus className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-lg font-semibold tracking-tight text-slate-950">
                        How can I help with PixRoom+?
                      </h3>
                      <p className="mt-1 text-sm leading-6 text-slate-500">
                        Start with one of these common actions.
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 grid gap-3 sm:grid-cols-2">
                    {visiblePrompts.map((prompt) => (
                      <button
                        key={prompt}
                        className="group flex min-h-[74px] items-center justify-between gap-3 rounded-[22px] border border-slate-200 bg-[linear-gradient(180deg,#ffffff_0%,#fffaf6_100%)] px-4 py-3 text-left text-sm font-semibold leading-5 text-slate-700 shadow-[0_10px_28px_rgba(15,23,42,0.04)] transition hover:-translate-y-0.5 hover:border-orange-200 hover:bg-orange-50 hover:text-orange-800 hover:shadow-[0_16px_36px_rgba(15,23,42,0.08)]"
                        onClick={() => onPromptSelect(prompt)}
                        type="button"
                      >
                        <span>{prompt}</span>
                        <Sparkles className="h-4 w-4 shrink-0 text-orange-500 opacity-70 transition group-hover:opacity-100" />
                      </button>
                    ))}
                  </div>
                </section>
              ) : null}

              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={message.role === "user" ? "flex justify-end" : "flex justify-start"}
                  >
                    <div
                      className={[
                        "max-w-[88%] rounded-[26px] px-4 py-3.5 text-sm leading-6 shadow-[0_14px_32px_rgba(15,23,42,0.07)] sm:max-w-[82%]",
                        message.role === "user"
                          ? "rounded-br-lg border border-orange-300/80 bg-[linear-gradient(135deg,#fb923c_0%,#f97316_100%)] text-white"
                          : "rounded-bl-lg border border-slate-200 bg-white/96 text-slate-700",
                      ].join(" ")}
                    >
                      <p
                        className={[
                          "mb-1.5 text-[11px] font-semibold uppercase tracking-[0.16em]",
                          message.role === "user" ? "text-orange-50/80" : "text-orange-600",
                        ].join(" ")}
                      >
                        {message.role === "user" ? "You" : "PixRoom+ AI"}
                      </p>
                      <p className="whitespace-pre-wrap">{message.content}</p>
                    </div>
                  </div>
                ))}
              </div>

              {error ? (
                <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                  {error}
                </div>
              ) : null}
            </div>

            <div className="border-t border-white/80 bg-white/78 px-5 py-5 shadow-[0_-18px_45px_rgba(15,23,42,0.04)] backdrop-blur-xl sm:px-7">
              <form className="space-y-4" onSubmit={onSubmit}>
                <label className="block">
                  <span className="mb-2 block text-sm font-semibold text-slate-700">
                    Ask PixRoom+ AI
                  </span>
                  <textarea
                    className="app-field min-h-[118px] w-full resize-none border-slate-200 bg-white/95 shadow-[0_12px_30px_rgba(15,23,42,0.04)]"
                    onChange={(event) => onInputChange(event.target.value)}
                    placeholder="Example: How do I invite a photographer to my room?"
                    value={input}
                  />
                </label>

                <button
                  className="app-btn-primary inline-flex h-12 w-full items-center justify-center gap-2 px-5 text-sm disabled:cursor-not-allowed disabled:opacity-60"
                  disabled={isSending}
                  type="submit"
                >
                  <Send className="h-4 w-4" />
                  {isSending ? "Thinking..." : "Send message"}
                </button>
              </form>
            </div>
          </>
        )}
      </aside>
    </>
  );
}
