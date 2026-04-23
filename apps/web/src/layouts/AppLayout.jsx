import { useEffect, useMemo, useState } from "react";
import { Menu, Sparkles } from "lucide-react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { AssistantDrawer } from "../components/AssistantDrawer";
import { Sidebar } from "../components/Sidebar";
import { useAuth } from "../hooks/useAuth";
import { api } from "../lib/api";
import { buildAssistantPayload, getAssistantSuggestions } from "../lib/assistantContext";
import { buildAppUser } from "../lib/mockAppData";

const ASSISTANT_STORAGE_KEY = "pixroom-assistant-thread";

function createMessage(role, content) {
  return {
    id: `${role}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    role,
    content,
  };
}

function getStoredMessages() {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const parsed = JSON.parse(window.localStorage.getItem(ASSISTANT_STORAGE_KEY) || "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function getPageMeta(pathname, appUser) {
  const pageEntries = [
    {
      match: ["/app/dashboard"],
      title: appUser.role === "photographer" ? "Photographer home" : "Home",
      description:
        appUser.role === "photographer"
          ? "Accept invites, open rooms, and share photos."
          : "Create a room and collect event photos in one place.",
    },
    {
      match: ["/app/rooms/new"],
      title: "Create your room",
      description: "Name the event, choose privacy, and start sharing.",
    },
    {
      match: ["/app/rooms/"],
      title: "Room",
      description: "Invite people, upload photos, and download the gallery.",
    },
    {
      match: ["/app/rooms", "/app/client-rooms"],
      title: appUser.role === "photographer" ? "Client rooms" : "My rooms",
      description:
        appUser.role === "photographer"
          ? "Open a room to upload and share event photos."
          : "Open a room to invite guests, upload photos, or download images.",
    },
    {
      match: ["/app/friends"],
      title: "Invitations",
      description: "Find people and prepare guest invitations.",
    },
    {
      match: ["/app/photographers", "/app/marketplace"],
      title: "Photographers",
      description: "Find a photographer and invite them to your room.",
    },
    {
      match: ["/app/requests"],
      title: "Requests",
      description: "Review event requests and respond quickly.",
    },
    {
      match: ["/app/portfolio"],
      title: "Portfolio",
      description: "Keep your best photos ready so clients understand your style quickly.",
    },
    {
      match: ["/app/availability"],
      title: "Availability",
      description: "Show whether you are ready for new work and keep it easy to understand.",
    },
    {
      match: ["/app/services"],
      title: "Services",
      description: "Explain what you offer in simple words and clear price ranges.",
    },
    {
      match: ["/app/settings", "/app/profile", "/app/billing"],
      title: "Profile",
      description: "Update your account and plan.",
    },
  ];

  return (
    pageEntries.find((entry) => entry.match.some((item) => pathname.startsWith(item))) ?? {
      title: "PixRoom+",
      description: "Create a room, invite people, and share memories together.",
    }
  );
}

export function AppLayout() {
  const { logout, token, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
  const [assistantInput, setAssistantInput] = useState("");
  const [assistantMessages, setAssistantMessages] = useState(() => getStoredMessages());
  const [assistantError, setAssistantError] = useState("");
  const [isAssistantSending, setIsAssistantSending] = useState(false);
  const appUser = buildAppUser(user);

  const pageMeta = useMemo(() => getPageMeta(location.pathname, appUser), [appUser, location.pathname]);
  const suggestedPrompts = useMemo(
    () => getAssistantSuggestions(location.pathname, appUser.role),
    [appUser.role, location.pathname],
  );

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    if (!assistantMessages.length) {
      window.localStorage.removeItem(ASSISTANT_STORAGE_KEY);
      window.sessionStorage.removeItem(ASSISTANT_STORAGE_KEY);
      return;
    }

    window.localStorage.setItem(ASSISTANT_STORAGE_KEY, JSON.stringify(assistantMessages));
  }, [assistantMessages]);

  function clearAssistantConversation() {
    const shouldClear = window.confirm("Clear this AI conversation?");

    if (!shouldClear) {
      return;
    }

    setAssistantMessages([]);
    setAssistantError("");
    setAssistantInput("");
    window.localStorage.removeItem(ASSISTANT_STORAGE_KEY);
    window.sessionStorage.removeItem(ASSISTANT_STORAGE_KEY);
  }

  useEffect(() => {
    if (location.state?.assistantOpen) {
      setIsAssistantOpen(true);
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.pathname, location.state, navigate]);

  useEffect(() => {
    if (!isAssistantOpen) {
      return undefined;
    }

    function handleEscape(event) {
      if (event.key === "Escape") {
        setIsAssistantOpen(false);
      }
    }

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isAssistantOpen]);

  function handleLogout() {
    logout();
    navigate("/login");
  }

  async function handleAssistantSubmit(event) {
    event.preventDefault();
    const nextMessage = assistantInput.trim();

    if (!nextMessage) {
      setAssistantError("Ask something first.");
      return;
    }

    setAssistantError("");
    setAssistantMessages((current) => [...current, createMessage("user", nextMessage)]);
    setAssistantInput("");

    try {
      setIsAssistantSending(true);
      const data = await api.assistant.chat(
        token,
        buildAssistantPayload(nextMessage, {
          appUser,
          currentPage: window.location.pathname,
          user,
        }),
      );
      setAssistantMessages((current) => [...current, createMessage("assistant", data.reply)]);
    } catch (chatError) {
      setAssistantError(chatError.message);
    } finally {
      setIsAssistantSending(false);
    }
  }

  return (
    <div className="app-theme-bg h-screen overflow-hidden text-slate-900">
      <div className="flex h-screen w-full">
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          onLogout={handleLogout}
          user={appUser}
        />

        <div className="flex min-w-0 flex-1 flex-col overflow-hidden lg:pl-80">
          <div className="flex-1 overflow-y-auto">
            <header className="sticky top-0 z-30 border-b border-white/70 bg-white/82 backdrop-blur-xl">
              <div className="flex items-start justify-between gap-4 px-4 py-4 sm:px-6 lg:px-10 lg:py-4">
                <div className="flex min-w-0 items-start gap-3">
                  <button
                    aria-label="Open navigation"
                    className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 lg:hidden"
                    onClick={() => setIsSidebarOpen(true)}
                    type="button"
                  >
                    <Menu className="h-4.5 w-4.5" />
                  </button>

                  <div className="min-w-0">
                    <h1 className="text-[1.5rem] font-semibold tracking-tight text-slate-950 sm:text-[1.5rem]">
                      {pageMeta.title}
                    </h1>
                    <p className="mt-1 max-w-3xl text-[13px] leading-5 text-slate-500 sm:text-[14px]">
                      {pageMeta.description}
                    </p>
                  </div>
                </div>

                <div className="flex shrink-0 items-start gap-3">
                  <div className="hidden rounded-[22px] border border-white/80 bg-white/85 px-4 py-2 text-right shadow-[0_18px_45px_rgba(15,23,42,0.05)] sm:block">
                    <p className="text-sm font-semibold text-slate-950">{appUser.firstName}</p>
                    <p className="text-xs text-slate-500">{appUser.role === "photographer" ? "Photographer account" : "Member account"}</p>
                  </div>

                  <button
                    className="app-btn-soft min-h-10 rounded-2xl px-4 text-sm"
                    onClick={() => {
                      setIsAssistantOpen(true);
                      setIsSidebarOpen(false);
                    }}
                    type="button"
                  >
                    <Sparkles className="h-4 w-4" />
                    <span className="hidden sm:inline">Ask PixRoom+</span>
                  </button>
                </div>
              </div>
            </header>

            <main className="px-4 py-3 sm:px-6 sm:py-4 lg:px-10 lg:py-4">
              <div className="mx-auto max-w-7xl">
                <Outlet />
              </div>
            </main>
          </div>
        </div>

        {isSidebarOpen ? (
          <button
            aria-label="Close navigation"
            className="fixed inset-0 z-30 bg-slate-950/25 backdrop-blur-sm lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
            type="button"
          />
        ) : null}

        <AssistantDrawer
          canUseAssistant={appUser.canUseAssistant}
          error={assistantError}
          input={assistantInput}
          isOpen={isAssistantOpen}
          isSending={isAssistantSending}
          messages={assistantMessages}
          onClose={() => setIsAssistantOpen(false)}
          onClearConversation={clearAssistantConversation}
          onInputChange={setAssistantInput}
          onPromptSelect={(prompt) => {
            setAssistantInput(prompt);
            setIsAssistantOpen(true);
          }}
          onSubmit={handleAssistantSubmit}
          suggestedPrompts={suggestedPrompts}
        />
      </div>
    </div>
  );
}
