export function SettingsTabs({ activeTab, onChange, tabs }) {
  return (
    <div className="overflow-x-auto pb-1">
      <div className="inline-flex min-w-full gap-2 rounded-[28px] border border-white/80 bg-white/82 p-2 shadow-[0_16px_36px_rgba(15,23,42,0.05)]">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={[
              "inline-flex min-w-fit items-center justify-center rounded-[20px] border px-5 py-3 text-sm font-semibold transition",
              activeTab === tab.id
                ? "border-orange-200 bg-orange-50 text-orange-800 shadow-[0_10px_20px_rgba(249,115,22,0.10)]"
                : "border-transparent text-slate-600 hover:border-orange-100 hover:bg-orange-50/70 hover:text-slate-950",
            ].join(" ")}
            onClick={() => onChange(tab.id)}
            type="button"
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
}
