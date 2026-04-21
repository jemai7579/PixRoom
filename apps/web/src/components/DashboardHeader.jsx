export function DashboardHeader({ title, description, actions }) {
  return (
    <section className="rounded-[36px] border border-white/70 bg-[linear-gradient(135deg,#fffaf5_0%,#ffffff_48%,#f3fbff_100%)] p-6 shadow-[0_25px_60px_rgba(15,23,42,0.08)] sm:p-8">
      <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
        <div className="max-w-3xl">
          <span className="inline-flex rounded-full border border-orange-200 bg-orange-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-orange-700">
            Dashboard
          </span>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950 sm:text-[2.7rem]">
            {title}
          </h2>
          <p className="mt-3 text-sm leading-7 text-slate-500 sm:text-base">{description}</p>
        </div>

        <div className="flex flex-wrap gap-3">{actions}</div>
      </div>
    </section>
  );
}
