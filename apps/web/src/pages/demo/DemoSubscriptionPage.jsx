import { DemoActionButton } from "../../components/demo/DemoActionButton";
import { DemoLockedNotice } from "../../components/demo/DemoLockedNotice";
import { useDemo } from "../../contexts/DemoContext";

export function DemoSubscriptionPage() {
  const { workspace } = useDemo();

  return (
    <div className="space-y-6 lg:space-y-8">
      <section className="rounded-[36px] border border-white/80 bg-white/88 p-6 shadow-[0_22px_55px_rgba(15,23,42,0.06)] sm:p-8">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
          <div className="max-w-3xl">
            <span className="inline-flex rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-emerald-700">
              Demo subscription
            </span>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950 sm:text-[2.5rem]">
              Preview how plans unlock private rooms, photographer tools, and premium access
            </h2>
            <p className="mt-3 text-sm leading-7 text-slate-500 sm:text-base">
              Visitors can compare plans in a realistic subscription preview, but all upgrades remain
              gated behind signup.
            </p>
          </div>

          <DemoActionButton
            label="Unlock full access"
            caption="Sign up to choose a plan and activate your real workspace."
          />
        </div>
      </section>

      <DemoLockedNotice message="Plans are browseable in preview mode, but changing subscription, billing, or private-room access requires a real account." />

      <section className="grid gap-5 xl:grid-cols-3">
        {workspace.plans.map((plan, index) => (
          <article
            key={plan.name}
            className={[
              "rounded-[32px] p-6 shadow-[0_22px_55px_rgba(15,23,42,0.06)]",
              index === 1
                ? "border border-slate-900 bg-[linear-gradient(160deg,#0f172a_0%,#123245_45%,#0f766e_100%)] text-white"
                : "border border-slate-200 bg-white/90 text-slate-900",
            ].join(" ")}
          >
            <p className={index === 1 ? "text-sm text-white/70" : "text-sm text-slate-500"}>Preview plan</p>
            <h3 className="mt-2 text-2xl font-semibold tracking-tight">{plan.name}</h3>
            <div className="mt-5 flex items-end gap-2">
              <span className="text-4xl font-semibold tracking-tight">{plan.price}</span>
              <span className={index === 1 ? "pb-1 text-white/70" : "pb-1 text-slate-500"}>/month</span>
            </div>
            <p className={index === 1 ? "mt-4 text-sm leading-6 text-white/80" : "mt-4 text-sm leading-6 text-slate-500"}>
              {plan.description}
            </p>

            <div className="mt-6 space-y-3">
              {plan.features.map((feature) => (
                <div key={feature} className={index === 1 ? "rounded-2xl border border-white/10 bg-white/10 px-4 py-4 text-sm" : "rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm text-slate-600"}>
                  {feature}
                </div>
              ))}
            </div>

            <DemoActionButton
              className="mt-6"
              label={plan.cta}
              caption="Create an account to activate this plan."
              to={`/register?plan=${index === 2 ? "photographer" : index === 1 ? "premium" : "free"}`}
              variant={index === 1 ? "secondary" : "primary"}
            />
          </article>
        ))}
      </section>
    </div>
  );
}
