import { DemoActionButton } from "../../components/demo/DemoActionButton";
import { DemoLockedNotice } from "../../components/demo/DemoLockedNotice";
import { useDemo } from "../../contexts/DemoContext";

export function DemoPhotographerPage() {
  const { workspace } = useDemo();

  return (
    <div className="space-y-6 lg:space-y-8">
      <section className="rounded-[36px] border border-white/80 bg-white/88 p-6 shadow-[0_22px_55px_rgba(15,23,42,0.06)] sm:p-8">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
          <div className="max-w-3xl">
            <span className="inline-flex rounded-full border border-violet-100 bg-violet-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-violet-700">
              Demo photographer workspace
            </span>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950 sm:text-[2.5rem]">
              See the photographer side of PixRoom+ before you join
            </h2>
            <p className="mt-3 text-sm leading-7 text-slate-500 sm:text-base">
              Preview the workspace built for client delivery, private room controls, second-shooter
              access, and marketplace visibility.
            </p>
          </div>

          <DemoActionButton
            label="Create photographer account"
            caption="Sign up to unlock client-ready room creation and gallery delivery."
            to="/register?plan=photographer"
          />
        </div>
      </section>

      <DemoLockedNotice message="This photographer workspace is fully browseable in demo mode, but collection management, invites, and delivery actions are locked until signup." />

      <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <section className="rounded-[32px] border border-white/80 bg-white/88 p-6 shadow-[0_22px_55px_rgba(15,23,42,0.06)]">
          <h3 className="text-xl font-semibold text-slate-950">Photographer tools</h3>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {workspace.photographerTools.map((item) => (
              <article key={item.title} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
                <p className="font-medium text-slate-900">{item.title}</p>
                <p className="mt-2 text-sm leading-6 text-slate-500">{item.detail}</p>
              </article>
            ))}
          </div>

          <div className="mt-6 rounded-[28px] border border-slate-200 bg-[linear-gradient(145deg,#f6fbff_0%,#eff7f4_100%)] p-5">
            <p className="text-sm font-semibold text-slate-900">Sample photographer dashboard card</p>
            <div className="mt-4 grid gap-3 md:grid-cols-3">
              <div className="rounded-2xl bg-white px-4 py-4">
                <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Client rooms</p>
                <p className="mt-2 text-xl font-semibold text-slate-950">9 active</p>
              </div>
              <div className="rounded-2xl bg-white px-4 py-4">
                <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Pending deliveries</p>
                <p className="mt-2 text-xl font-semibold text-slate-950">4 collections</p>
              </div>
              <div className="rounded-2xl bg-white px-4 py-4">
                <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Second shooters</p>
                <p className="mt-2 text-xl font-semibold text-slate-950">3 invited</p>
              </div>
            </div>
          </div>
        </section>

        <aside className="space-y-6">
          <section className="rounded-[32px] border border-slate-200 bg-[linear-gradient(180deg,#f9fbff_0%,#ffffff_100%)] p-6 shadow-[0_20px_50px_rgba(15,23,42,0.05)]">
            <h3 className="text-lg font-semibold text-slate-950">Normal user view</h3>
            <div className="mt-5 space-y-3">
              {workspace.normalUserTools.map((item) => (
                <div key={item.title} className="rounded-2xl border border-slate-200 bg-white px-4 py-4">
                  <p className="font-medium text-slate-900">{item.title}</p>
                  <p className="mt-2 text-sm leading-6 text-slate-500">{item.detail}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-[32px] border border-white/80 bg-white/88 p-6 shadow-[0_22px_55px_rgba(15,23,42,0.06)]">
            <h3 className="text-lg font-semibold text-slate-950">Conversion tip</h3>
            <p className="mt-3 text-sm leading-6 text-slate-500">
              Visitors can see both roles here, but real room creation, delivery tools, uploads, and
              invitations stay locked until they create an account.
            </p>
            <DemoActionButton
              className="mt-5"
              label="Unlock photographer tools"
              caption="Join PixRoom+ to manage client galleries and premium room controls."
              to="/register?plan=photographer"
            />
          </section>
        </aside>
      </section>
    </div>
  );
}
