import {
  CalendarClock,
  Camera,
  Home,
  Images,
  Settings,
  UserRoundPlus,
  Users,
  X,
} from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { PixroomLogo } from "./PixroomLogo";
import { UserCard } from "./UserCard";

const memberNavigation = [
  { label: "Home", to: "/app/dashboard", icon: Home },
  { label: "My rooms", to: "/app/rooms", icon: Images },
  { label: "Create room", to: "/app/rooms/new", icon: Camera },
  { label: "Friends", to: "/app/friends", icon: Users },
  { label: "Find photographer", to: "/app/photographers", icon: UserRoundPlus },
  { label: "Settings", to: "/app/settings", icon: Settings },
];

const photographerNavigation = [
  { label: "Home", to: "/app/dashboard", icon: Home },
  { label: "Requests", to: "/app/requests", icon: UserRoundPlus },
  { label: "Client rooms", to: "/app/client-rooms", icon: Images },
  { label: "Portfolio", to: "/app/portfolio", icon: Camera },
  { label: "Availability", to: "/app/availability", icon: CalendarClock },
  { label: "Settings", to: "/app/settings", icon: Settings },
];

function isActivePath(pathname, to) {
  if (to === "/app/dashboard") {
    return pathname === to;
  }

  return pathname === to || pathname.startsWith(`${to}/`);
}

export function Sidebar({ isOpen, onClose, onLogout, user }) {
  const location = useLocation();
  const navigation = user.role === "photographer" ? photographerNavigation : memberNavigation;
  const helperCopy =
    user.role === "photographer"
      ? "Keep requests, client rooms, portfolio, and finished photos close."
      : "Create a room, invite your people, and share photos without the clutter.";

  return (
    <aside
      className={[
        "fixed inset-y-0 left-0 z-40 flex h-screen w-80 max-w-[88vw] flex-col overflow-hidden border-r border-white/80 bg-[linear-gradient(180deg,rgba(255,252,249,0.98)_0%,rgba(247,250,255,0.96)_100%)] px-4 pb-4 pt-3.5 shadow-[0_24px_70px_rgba(15,23,42,0.10)] backdrop-blur-xl transition-transform duration-300 lg:translate-x-0 lg:px-5 lg:pt-3.5",
        isOpen ? "translate-x-0" : "-translate-x-full",
      ].join(" ")}
    >
      <div className="flex shrink-0 items-center justify-between gap-3">
        <PixroomLogo
          className="max-w-[118px]"
          imageClassName="max-w-[94px]"
          onClick={onClose}
          subtitle={user.role === "photographer" ? "Photographer tools" : "Share memories together"}
          to="/"
        />

        <button
          aria-label="Close navigation"
          className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-600 transition hover:border-slate-300 hover:bg-slate-50 lg:hidden"
          onClick={onClose}
          type="button"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="mt-4 flex-1 overflow-y-auto pr-1">
        <div className="rounded-[28px] border border-white/80 bg-white/82 p-4 shadow-[0_18px_45px_rgba(15,23,42,0.05)]">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">Go to</p>
          <nav className="mt-3 space-y-1.5">
            {navigation.map((item) => {
              const Icon = item.icon;
              const active = isActivePath(location.pathname, item.to);

              return (
                <NavLink
                  key={item.to}
                  className={[
                    "flex items-center gap-3 rounded-2xl px-3.5 py-3 text-sm font-medium transition",
                    active
                      ? "border border-orange-200 bg-orange-50 text-orange-800 shadow-[0_12px_25px_rgba(249,115,22,0.08)]"
                      : "text-slate-600 hover:bg-slate-100/80 hover:text-slate-950",
                  ].join(" ")}
                  onClick={onClose}
                  to={item.to}
                >
                  <span
                    className={[
                      "flex h-10 w-10 items-center justify-center rounded-2xl transition",
                      active
                        ? "bg-white text-orange-700 shadow-sm"
                        : "bg-white/90 text-slate-600 shadow-[0_8px_20px_rgba(15,23,42,0.04)]",
                    ].join(" ")}
                  >
                    <Icon className="h-4 w-4" />
                  </span>
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        <div className="mt-5 rounded-[28px] border border-emerald-100 bg-[linear-gradient(180deg,#f3fbf8_0%,#fffdf9_100%)] p-4.5 shadow-[0_14px_35px_rgba(15,23,42,0.04)]">
          <p className="text-sm font-semibold text-slate-900">Start simple</p>
          <p className="mt-1.5 text-sm leading-6 text-slate-500">{helperCopy}</p>
        </div>
      </div>

      <div className="shrink-0 pt-4">
        <UserCard onLogout={onLogout} user={user} />
      </div>
    </aside>
  );
}
