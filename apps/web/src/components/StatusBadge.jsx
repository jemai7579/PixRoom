const statusToneMap = {
  pending: "border-amber-200 bg-amber-50 text-amber-700",
  accepted: "border-emerald-200 bg-emerald-50 text-emerald-700",
  rejected: "border-rose-200 bg-rose-50 text-rose-700",
  cancelled: "border-slate-200 bg-slate-100 text-slate-600",
  saved: "border-sky-200 bg-sky-50 text-sky-700",
  liked: "border-violet-200 bg-violet-50 text-violet-700",
  skipped: "border-slate-200 bg-slate-100 text-slate-600",
  live: "border-emerald-200 bg-emerald-50 text-emerald-700",
};

function toLabel(status) {
  return status.replaceAll("_", " ");
}

export function StatusBadge({ label, status, className = "" }) {
  if (!status) {
    return null;
  }

  return (
    <span
      className={[
        "inline-flex items-center rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em]",
        statusToneMap[status] || "border-slate-200 bg-slate-100 text-slate-600",
        className,
      ].join(" ")}
    >
      {label || toLabel(status)}
    </span>
  );
}
