import { Eye, LayoutDashboard, LockKeyhole, PanelsTopLeft, Sparkles, UserPlus, Camera, CreditCard } from "lucide-react";
import { NavLink, Outlet } from "react-router-dom";
import { PixroomLogo } from "../components/PixroomLogo";
import { DemoProvider } from "../contexts/DemoContext";

const demoNavigation = [
  { label: "Dashboard", to: "/demo/dashboard", icon: LayoutDashboard },
  { label: "Rooms", to: "/demo/rooms", icon: PanelsTopLeft },
  { label: "Activity", to: "/demo/activity", icon: UserPlus },
  { label: "Subscription", to: "/demo/subscription", icon: CreditCard },
  { label: "Photographer", to: "/demo/photographer", icon: Camera },
];

function DemoSidebar() {
  return (
    <aside className="hidden h-screen w-72 shrink-0 border-r border-white/80 bg-[linear-gradient(180deg,rgba(250,252,255,0.98)_0%,rgba(244,248,252,0.96)_100%)] px-5 py-5 shadow-[0_20px_60px_rgba(15,23,42,0.08)] lg:flex lg:flex-col">
      <div className="shrink-0">
        <PixroomLogo
          className="max-w-[150px]"
          imageClassName="max-w-[122px]"
          subtitle="Interactive preview"
          to="/"
        />
      </div>

      <div className="mt-8 flex-1 overflow-y-auto pr-1">
        <div className="rounded-[28px] border border-white/80 bg-white/82 p-4 shadow-[0_16px_36px_rgba(15,23,42,0.05)]">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-400">Preview navigation</p>
          <nav className="mt-4 space-y-1.5">
            {demoNavigation.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  className={({ isActive }) =>
                    [
                      "flex items-center gap-3 rounded-2xl px-3.5 py-3 text-sm font-medium transition",
                      isActive
                        ? "border border-emerald-100 bg-emerald-50 text-emerald-800 shadow-[0_12px_25px_rgba(16,185,129,0.08)]"
                        : "text-slate-600 hover:bg-slate-100/80 hover:text-slate-950",
                    ].join(" ")
                  }
                  to={item.to}
                >
                  {({ isActive }) => (
                    <>
                      <span
                        className={[
                          "flex h-10 w-10 items-center justify-center rounded-2xl transition",
                          isActive
                            ? "bg-white text-emerald-700 shadow-sm"
                            : "bg-white/90 text-slate-600 shadow-[0_8px_20px_rgba(15,23,42,0.04)]",
                        ].join(" ")}
                      >
                        <Icon className="h-4 w-4" />
                      </span>
                      <span>{item.label}</span>
                    </>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>

        <div className="mt-6 rounded-[28px] border border-sky-100 bg-[linear-gradient(180deg,#f1fbff_0%,#fbfdff_100%)] p-5">
          <p className="text-sm font-semibold text-slate-900">Read-only product tour</p>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            Explore the real structure of PixRoom+ and then create an account to start using rooms,
            uploads, invitations, and premium access for real.
          </p>
        </div>
      </div>

      <div className="shrink-0 pt-6">
        <NavLink className="app-btn-primary inline-flex h-12 w-full items-center justify-center gap-2 px-5 text-sm" to="/register">
          <Sparkles className="h-4 w-4" />
          Create account
        </NavLink>
      </div>
    </aside>
  );
}

export function DemoLayout() {
  return (
    <DemoProvider>
      <div className="app-theme-bg h-screen overflow-hidden text-slate-900">
        <div className="flex h-screen">
          <DemoSidebar />

          <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
            <header className="shrink-0 border-b border-white/70 bg-[#f8fbff]/92 backdrop-blur-xl">
              <div className="flex flex-col gap-4 px-4 py-4 sm:px-6 lg:px-10">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <div className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-amber-700">
                      <Eye className="h-3.5 w-3.5" />
                      Demo mode
                    </div>
                    <h1 className="mt-3 text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">
                      Explore PixRoom+ before signing up
                    </h1>
                    <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-500 sm:text-base">
                      Browse the dashboard, rooms, invitations, uploads, subscription, and photographer
                      tools in a realistic preview. All write actions stay locked in demo mode.
                    </p>
                  </div>

                  <div className="hidden items-center gap-3 sm:flex">
                    <NavLink className="app-btn-secondary inline-flex h-11 items-center justify-center px-4 text-sm" to="/login">
                      Log in
                    </NavLink>
                    <NavLink className="app-btn-primary inline-flex h-11 items-center justify-center gap-2 px-4 text-sm" to="/register">
                      <Sparkles className="h-4 w-4" />
                      Start free
                    </NavLink>
                  </div>
                </div>

                <div className="rounded-[24px] border border-slate-200 bg-white/80 px-4 py-3 text-sm text-slate-600 shadow-[0_12px_30px_rgba(15,23,42,0.04)]">
                  <div className="flex items-center gap-3">
                    <div className="rounded-2xl bg-slate-100 p-2.5 text-slate-700">
                      <LockKeyhole className="h-4.5 w-4.5" />
                    </div>
                    <p>
                      This is a realistic read-only preview. Create an account to start creating rooms,
                      uploading photos, inviting people, and changing plan settings.
                    </p>
                  </div>
                </div>

                <div className="overflow-x-auto lg:hidden">
                  <div className="inline-flex min-w-full gap-2 rounded-[24px] border border-white/80 bg-white/82 p-2 shadow-[0_12px_30px_rgba(15,23,42,0.04)]">
                    {demoNavigation.map((item) => {
                      const Icon = item.icon;
                      return (
                        <NavLink
                          key={item.to}
                          className={({ isActive }) =>
                            [
                              "inline-flex min-w-fit items-center gap-2 rounded-2xl px-4 py-2.5 text-sm font-semibold transition",
                              isActive
                                ? "bg-emerald-50 text-emerald-800"
                                : "text-slate-600 hover:bg-slate-50 hover:text-slate-950",
                            ].join(" ")
                          }
                          to={item.to}
                        >
                          <Icon className="h-4 w-4" />
                          {item.label}
                        </NavLink>
                      );
                    })}
                  </div>
                </div>
              </div>
            </header>

            <main className="flex-1 overflow-y-auto px-4 py-6 sm:px-6 lg:px-10 lg:py-8">
              <div className="mx-auto max-w-7xl">
                <Outlet />
              </div>
            </main>
          </div>
        </div>
      </div>
    </DemoProvider>
  );
}
