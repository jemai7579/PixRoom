import { Check, Sparkles } from "lucide-react";

export function SubscriptionCard({
  ctaLabel,
  description,
  features,
  highlighted = false,
  onAction,
  plan,
  price,
  status,
}) {
  return (
    <article
      className={[
        "rounded-[32px] p-6 shadow-[0_24px_60px_rgba(15,23,42,0.08)]",
        highlighted
          ? "border border-orange-200 bg-[linear-gradient(160deg,#fff4e8_0%,#fffaf5_45%,#ecfdf5_100%)] text-slate-900"
          : "border border-slate-200 bg-white text-slate-900",
      ].join(" ")}
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className={highlighted ? "text-sm text-orange-700" : "text-sm text-slate-500"}>{status}</p>
          <h3 className="mt-2 text-2xl font-semibold tracking-tight">{plan}</h3>
          <p className={highlighted ? "mt-3 text-sm leading-6 text-slate-600" : "mt-3 text-sm leading-6 text-slate-500"}>
            {description}
          </p>
        </div>
        <div
          className={[
            "rounded-2xl p-3",
            highlighted ? "bg-white text-orange-700 shadow-sm" : "bg-emerald-50 text-emerald-700",
          ].join(" ")}
        >
          <Sparkles className="h-5 w-5" />
        </div>
      </div>

      <div className="mt-6 flex items-end gap-2">
        <span className="text-4xl font-semibold tracking-tight">{price}</span>
        <span className={highlighted ? "pb-1 text-slate-500" : "pb-1 text-slate-500"}>/month</span>
      </div>

      <div className="mt-6 space-y-3">
        {features.map((feature) => (
          <div key={feature} className="flex items-start gap-3">
            <div
              className={[
                "mt-0.5 flex h-6 w-6 items-center justify-center rounded-full",
                highlighted ? "bg-white text-emerald-700 shadow-sm" : "bg-emerald-50 text-emerald-700",
              ].join(" ")}
            >
              <Check className="h-4 w-4" />
            </div>
            <p className={highlighted ? "text-sm text-slate-700" : "text-sm text-slate-600"}>{feature}</p>
          </div>
        ))}
      </div>

      <button
        className={[
          "mt-8 inline-flex h-12 w-full items-center justify-center rounded-2xl px-5 text-sm font-semibold transition",
          highlighted ? "app-btn-primary" : "app-btn-secondary",
        ].join(" ")}
        onClick={onAction}
        type="button"
      >
        {ctaLabel}
      </button>
    </article>
  );
}
