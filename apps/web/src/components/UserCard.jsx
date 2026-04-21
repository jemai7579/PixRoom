import { LogOut } from "lucide-react";

export function UserCard({ onLogout, user }) {
  return (
    <div className="rounded-[28px] border border-slate-200/80 bg-[linear-gradient(180deg,#ffffff_0%,#f7fafc_100%)] p-4 shadow-[0_18px_40px_rgba(15,23,42,0.05)]">
      <div className="flex items-center gap-3">
        {user.avatar ? (
          <img
            alt={user.fullName}
            className="h-12 w-12 rounded-2xl object-cover"
            src={user.avatar}
          />
        ) : (
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-900 text-sm font-semibold text-white">
            {user.initials}
          </div>
        )}

        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-slate-950">{user.fullName}</p>
          <p className="truncate text-xs text-slate-500">{user.email}</p>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between rounded-2xl bg-slate-50/90 px-3 py-3 text-sm">
        <div>
          <p className="font-medium text-slate-900">{user.plan}</p>
          <p className="text-slate-500">{user.roleLabel}</p>
        </div>
        <button
          className="app-btn-danger min-h-10 px-4 text-sm"
          onClick={onLogout}
          type="button"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </button>
      </div>
    </div>
  );
}
