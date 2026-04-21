import {
  ArrowRight,
  Camera,
  FolderLock,
  Image,
  Search,
  ShieldCheck,
  Sparkles,
  UserPlus,
  Users,
} from "lucide-react";
import { Link } from "react-router-dom";
import { HeroIllustration } from "../../components/HeroIllustration";
import { PixroomLogo } from "../../components/PixroomLogo";
import { useAuth } from "../../hooks/useAuth";
import { pricingPlans } from "../../lib/pricing";

const primaryButtonClass =
  "inline-flex items-center justify-center gap-2 rounded-[22px] bg-orange-500 px-6 py-3 text-sm font-semibold text-white shadow-[0_18px_40px_rgba(249,115,22,0.22)] transition hover:bg-orange-600 hover:shadow-[0_22px_45px_rgba(249,115,22,0.24)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-400 disabled:cursor-not-allowed disabled:bg-orange-300 disabled:shadow-none";

const secondaryButtonClass =
  "inline-flex items-center justify-center gap-2 rounded-[22px] border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-800 shadow-[0_12px_30px_rgba(15,23,42,0.06)] transition hover:border-slate-300 hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-300 disabled:cursor-not-allowed disabled:border-slate-200 disabled:bg-slate-100 disabled:text-slate-400 disabled:shadow-none";

const textLinkClass = "text-sm font-medium text-slate-600 transition hover:text-slate-950";

const valueBlocks = [
  {
    icon: FolderLock,
    title: "Private or public rooms",
    description: "Start an easy public room or keep things private for invited people only.",
  },
  {
    icon: Image,
    title: "Easy photo uploads",
    description: "Collect guest moments and final photographer photos in one clean gallery.",
  },
  {
    icon: UserPlus,
    title: "Invitations in seconds",
    description: "Invite friends first, then use the room code only as a backup option.",
  },
  {
    icon: Camera,
    title: "Made for photographers too",
    description: "Photographers can join the room and upload final photos in the same place.",
  },
];

const featureSections = [
  {
    eyebrow: "Create rooms",
    title: "Start with one simple room for your event",
    description:
      "Give your room a name, choose the event type, decide if it is public or private, and get started quickly.",
    bullets: [
      "Create a room in less than one minute",
      "Keep the setup simple first and hide advanced options",
      "Use one room for guests and final photographer photos",
    ],
    accent: "from-sky-100 via-cyan-50 to-white",
    cardTitle: "Start here",
    cardLines: ["Room name", "Event type", "Public or private"],
  },
  {
    eyebrow: "Share photos",
    title: "Keep every memory together in one gallery",
    description:
      "Guests can share behind-the-scenes moments and photographers can upload the final edited collection in the same room.",
    bullets: [
      "Guest photos and final photos stay together",
      "Browse All photos, Guest photos, or Photographer photos",
      "A cleaner gallery experience on mobile and desktop",
    ],
    accent: "from-emerald-100 via-white to-sky-50",
    cardTitle: "Gallery flow",
    cardLines: ["Guests upload moments", "Photographer delivers final gallery", "Everyone sees one beautiful room"],
  },
  {
    eyebrow: "Invites and access",
    title: "Invite your people without making them think too much",
    description:
      "Invite friends directly, keep track of who is pending, and use the room code only when needed.",
    bullets: [
      "Friends first, room code second",
      "Pending and accepted people are easy to understand",
      "Privacy stays clear without technical language",
    ],
    accent: "from-orange-100 via-rose-50 to-white",
    cardTitle: "Invite flow",
    cardLines: ["Invite from your friend list", "See pending invitations", "Copy room code if needed"],
  },
];

const reassurance = [
  "Designed for real events, shared memories, and beautiful photo rooms",
  "Simple enough for guests and polished enough for photographers",
  "Private room options when you need more control",
  "A cleaner way to invite, upload, and relive the event",
];

function FooterLink({ href, label, to }) {
  if (href) {
    return (
      <a className="text-sm text-slate-500 transition hover:text-slate-900" href={href}>
        {label}
      </a>
    );
  }

  return (
    <Link className="text-sm text-slate-500 transition hover:text-slate-900" to={to}>
      {label}
    </Link>
  );
}

export function HomePage() {
  const { isAuthenticated } = useAuth();
  const footerColumns = [
    {
      title: "Product",
      links: [
        { label: "Features", href: "#features" },
        { label: "For photographers", href: "#photographers" },
        { label: "Pricing", href: "#pricing" },
        { label: "Explore demo", to: "/demo" },
      ],
    },
    {
      title: "Get started",
      links: [
        { label: "Create account", to: "/register" },
        { label: "Log in", to: "/login" },
        { label: isAuthenticated ? "Go to dashboard" : "Log in to dashboard", to: isAuthenticated ? "/app/dashboard" : "/login" },
      ],
    },
    {
      title: "Explore",
      links: [
        { label: "Demo preview", to: "/demo" },
        { label: "Find photographers", href: "#photographers" },
        { label: "Pricing plans", href: "#pricing" },
      ],
    },
    {
      title: "Support",
      links: [
        { label: "Create account", to: "/register" },
        { label: "Log in", to: "/login" },
        { label: "Home", to: "/" },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(251,146,60,0.12),transparent_18%),radial-gradient(circle_at_top_right,rgba(45,212,191,0.11),transparent_20%),linear-gradient(180deg,#fffaf6_0%,#f6fbff_48%,#fffdfb_100%)] text-slate-900">
      <header className="sticky top-0 z-30 border-b border-white/70 bg-white/82 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex min-h-[56px] items-center justify-between gap-4">
            <PixroomLogo
              className="max-w-[130px]"
              imageClassName="max-h-[48px] max-w-[130px]"
              to="/"
            />

            <nav className="hidden flex-1 items-center justify-center gap-7 lg:flex">
              <a className={textLinkClass} href="#features">
                Features
              </a>
              <a className={textLinkClass} href="#photographers">
                For photographers
              </a>
              <a className={textLinkClass} href="#pricing">
                Pricing
              </a>
              <Link className={textLinkClass} to="/demo">
                Explore demo
              </Link>
            </nav>

            <div className="flex items-center gap-3">
              {isAuthenticated ? (
                <Link className={secondaryButtonClass} to="/app/dashboard">
                  Go to dashboard
                </Link>
              ) : (
                <>
                  <Link className={`${secondaryButtonClass} hidden sm:inline-flex`} to="/login">
                    Log in
                  </Link>
                  <Link className={primaryButtonClass} to="/register">
                    Create account
                  </Link>
                </>
              )}
            </div>
          </div>

          <div className="mt-3 flex flex-wrap gap-2 lg:hidden">
            <a className={secondaryButtonClass} href="#features">
              Features
            </a>
            <a className={secondaryButtonClass} href="#photographers">
              For photographers
            </a>
            <a className={secondaryButtonClass} href="#pricing">
              Pricing
            </a>
            <Link className={secondaryButtonClass} to="/demo">
              Explore demo
            </Link>
          </div>
        </div>
      </header>

      <main>
        <section className="relative overflow-hidden">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute left-[5%] top-14 h-44 w-44 rounded-full bg-orange-200/35 blur-3xl" />
            <div className="absolute right-[6%] top-20 h-56 w-56 rounded-full bg-emerald-200/24 blur-3xl" />
          </div>

          <div className="mx-auto grid max-w-7xl gap-12 px-4 pb-20 pt-8 sm:px-6 lg:grid-cols-[0.88fr_1.12fr] lg:px-8 lg:pb-24 lg:pt-10">
            <div className="relative z-10 flex flex-col justify-center">
              <span className="inline-flex w-fit items-center gap-2 rounded-full border border-orange-100 bg-orange-50 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-orange-700">
                <Sparkles className="h-3.5 w-3.5" />
                Create a room. Invite people. Share memories.
              </span>

              <h1 className="mt-7 max-w-[12ch] text-5xl font-semibold tracking-[-0.065em] text-slate-950 sm:text-6xl lg:text-[5.1rem]">
                A simpler home for shared event photos.
              </h1>

              <p className="mt-6 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
                PixRoom+ makes one thing clear from the start: create a room, invite your people,
                choose a photographer if you want, and keep every photo in one beautiful gallery.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link className={primaryButtonClass} to="/register">
                  Start free
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link className={secondaryButtonClass} to="/demo">
                  Explore demo
                  <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">
                    Read only
                  </span>
                </Link>
              </div>

              <div className="mt-10 grid gap-3 sm:grid-cols-3">
                {[
                  { label: "Rooms launched", value: "12k+" },
                  { label: "Photos shared", value: "1.8M" },
                  { label: "Invite joins", value: "98%" },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="rounded-[24px] border border-white/80 bg-white/84 px-4 py-4 shadow-[0_16px_35px_rgba(15,23,42,0.05)] backdrop-blur-sm"
                  >
                    <p className="text-xs uppercase tracking-[0.18em] text-slate-400">{item.label}</p>
                    <p className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative z-10 flex items-center">
              <HeroIllustration />
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 pb-6 sm:px-6 lg:px-8">
          <div className="rounded-[36px] border border-white/80 bg-white/78 p-6 shadow-[0_24px_60px_rgba(15,23,42,0.06)] backdrop-blur-sm sm:p-8">
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
              {valueBlocks.map((item) => {
                const Icon = item.icon;
                return (
                  <article
                    key={item.title}
                    className="rounded-[26px] border border-slate-200 bg-white px-5 py-5 shadow-[0_16px_35px_rgba(15,23,42,0.04)]"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-[18px] bg-orange-50 text-orange-600">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h2 className="mt-5 text-lg font-semibold tracking-tight text-slate-950">{item.title}</h2>
                    <p className="mt-3 text-sm leading-6 text-slate-500">{item.description}</p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8" id="features">
          <div className="max-w-3xl">
            <span className="inline-flex rounded-full border border-slate-200 bg-slate-100 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-600">
              Product flow
            </span>
            <h2 className="mt-6 text-4xl font-semibold tracking-[-0.05em] text-slate-950 sm:text-5xl">
              Every screen should answer what this is, what you can do, and what comes next.
            </h2>
            <p className="mt-5 text-base leading-8 text-slate-600">
              PixRoom+ stays focused on one clear journey instead of feeling like a complex admin panel.
            </p>
          </div>

          <div className="mt-14 space-y-8">
            {featureSections.map((section, index) => (
              <article
                key={section.title}
                className="grid gap-6 rounded-[36px] border border-white/80 bg-white/78 p-6 shadow-[0_24px_60px_rgba(15,23,42,0.06)] backdrop-blur-sm lg:grid-cols-2 lg:items-center lg:p-8"
              >
                <div className={index % 2 === 1 ? "lg:order-2" : ""}>
                  <span className="inline-flex rounded-full border border-slate-200 bg-slate-100 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-600">
                    {section.eyebrow}
                  </span>
                  <h3 className="mt-5 text-3xl font-semibold tracking-[-0.04em] text-slate-950 sm:text-[2.25rem]">
                    {section.title}
                  </h3>
                  <p className="mt-4 text-base leading-8 text-slate-600">{section.description}</p>

                  <div className="mt-6 space-y-3">
                    {section.bullets.map((item) => (
                      <div key={item} className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-4">
                        <div className="mt-1 h-2.5 w-2.5 rounded-full bg-orange-400" />
                        <p className="text-sm leading-6 text-slate-600">{item}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className={index % 2 === 1 ? "lg:order-1" : ""}>
                  <div
                    className={`rounded-[30px] border border-slate-200 bg-gradient-to-br ${section.accent} p-5 shadow-[0_20px_45px_rgba(15,23,42,0.05)]`}
                  >
                    <div className="rounded-[26px] border border-white/70 bg-white/88 p-5 shadow-[0_16px_35px_rgba(15,23,42,0.05)]">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-sm font-medium text-slate-500">{section.cardTitle}</p>
                          <p className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">
                            Clear and friendly
                          </p>
                        </div>
                        <div className="rounded-2xl bg-slate-100 p-3 text-slate-700">
                          {index === 0 ? (
                            <Camera className="h-5 w-5" />
                          ) : index === 1 ? (
                            <Image className="h-5 w-5" />
                          ) : (
                            <ShieldCheck className="h-5 w-5" />
                          )}
                        </div>
                      </div>

                      <div className="mt-6 grid gap-3">
                        {section.cardLines.map((line) => (
                          <div key={line} className="rounded-2xl bg-slate-50 px-4 py-4 text-sm text-slate-600">
                            {line}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8" id="photographers">
          <div className="grid gap-6 rounded-[36px] border border-white/80 bg-[linear-gradient(145deg,#fff8f1_0%,#f3fbff_100%)] p-6 shadow-[0_24px_60px_rgba(15,23,42,0.06)] lg:grid-cols-[1fr_1fr] lg:items-center lg:p-8">
            <div>
              <span className="inline-flex rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-emerald-700">
                For photographers
              </span>
              <h2 className="mt-5 text-3xl font-semibold tracking-[-0.04em] text-slate-950 sm:text-[2.4rem]">
                Be the photographer clients can understand at a glance.
              </h2>
              <p className="mt-4 text-base leading-8 text-slate-600">
                PixRoom+ helps photographers receive requests, join client rooms, and deliver final
                galleries in a clean, premium flow.
              </p>

              <div className="mt-6 grid gap-3">
                {[
                  "Receive clear event requests",
                  "Work inside client rooms instead of scattered folders",
                  "Upload final photos in the same room guests already know",
                ].map((item) => (
                  <div key={item} className="flex items-start gap-3 rounded-2xl border border-white/80 bg-white/80 px-4 py-4">
                    <Search className="mt-1 h-4.5 w-4.5 shrink-0 text-emerald-700" />
                    <p className="text-sm leading-6 text-slate-600">{item}</p>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <Link className={secondaryButtonClass} to="/register?plan=photographer">
                  Join as photographer
                </Link>
                <Link className={primaryButtonClass} to="/demo">
                  Explore demo
                </Link>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-[28px] border border-white/80 bg-white/88 p-5 shadow-[0_18px_40px_rgba(15,23,42,0.05)]">
                <p className="text-sm font-medium text-slate-500">Client delivery</p>
                <p className="mt-3 text-2xl font-semibold tracking-tight text-slate-950">Final photos in the room</p>
                <p className="mt-3 text-sm leading-6 text-slate-500">
                  Keep delivery simple by uploading the final gallery where the event already lives.
                </p>
              </div>
              <div className="rounded-[28px] border border-white/80 bg-white/88 p-5 shadow-[0_18px_40px_rgba(15,23,42,0.05)]">
                <p className="text-sm font-medium text-slate-500">Requests</p>
                <p className="mt-3 text-2xl font-semibold tracking-tight text-slate-950">Clear collaboration requests</p>
                <p className="mt-3 text-sm leading-6 text-slate-500">
                  Event type, date, location, and message are easy to review.
                </p>
              </div>
              <div className="rounded-[28px] border border-white/80 bg-white/88 p-5 shadow-[0_18px_40px_rgba(15,23,42,0.05)] md:col-span-2">
                <p className="text-sm font-medium text-slate-500">Discovery</p>
                <p className="mt-3 text-2xl font-semibold tracking-tight text-slate-950">Simple premium photographer cards</p>
                <p className="mt-3 text-sm leading-6 text-slate-500">
                  Clients can browse your best photo, specialty, location, price range, and rating without confusion.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="grid gap-6 rounded-[36px] border border-white/80 bg-white/82 p-6 shadow-[0_24px_60px_rgba(15,23,42,0.06)] backdrop-blur-sm lg:grid-cols-[0.95fr_1.05fr] lg:items-center lg:p-8">
            <div>
              <span className="inline-flex rounded-full border border-sky-100 bg-sky-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-sky-700">
                Explore the product
              </span>
              <h2 className="mt-5 text-3xl font-semibold tracking-[-0.04em] text-slate-950 sm:text-[2.4rem]">
                Try the read-only demo before creating your account
              </h2>
              <p className="mt-4 text-base leading-8 text-slate-600">
                Browse the demo dashboard, rooms, invitations, and photographer flow before you sign up.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link className={primaryButtonClass} to="/demo">
                  Explore demo
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link className={secondaryButtonClass} to="/register">
                  Create account
                </Link>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {[
                "See how rooms look before signing up",
                "Preview guest photos and final photos",
                "Understand invites and privacy quickly",
                "See the photographer journey too",
              ].map((item) => (
                <div key={item} className="rounded-[24px] border border-slate-200 bg-slate-50 px-4 py-4 text-sm leading-6 text-slate-600">
                  {item}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8" id="pricing">
          <div className="max-w-3xl">
            <span className="inline-flex rounded-full border border-slate-200 bg-slate-100 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-600">
              Pricing
            </span>
            <h2 className="mt-6 text-4xl font-semibold tracking-[-0.05em] text-slate-950 sm:text-5xl">
              Clear plans for simple sharing, private rooms, and photographer work
            </h2>
            <p className="mt-5 text-base leading-8 text-slate-600">
              Choose the plan that matches how you want to create rooms, invite people, and share photos.
            </p>
          </div>

          <div className="mt-10 grid gap-5 xl:grid-cols-3">
            {pricingPlans.map((plan) => (
              <article
                key={plan.name}
                className={[
                  "rounded-[32px] border p-6 shadow-[0_22px_55px_rgba(15,23,42,0.06)]",
                  plan.featured
                    ? "border-orange-200 bg-[linear-gradient(180deg,#fff7ef_0%,#ffffff_100%)] text-slate-900"
                    : "border-slate-200 bg-white/88 text-slate-900",
                ].join(" ")}
              >
                <p className="text-sm text-slate-500">{plan.name}</p>
                <div className="mt-5 flex items-end gap-2">
                  <span className="text-4xl font-semibold tracking-tight">{plan.price}</span>
                  <span className="pb-1 text-slate-500">{plan.period}</span>
                </div>
                <p className="mt-4 text-sm leading-6 text-slate-500">{plan.description}</p>

                <div className="mt-6 space-y-3">
                  {plan.features.map((feature) => (
                    <div
                      key={feature}
                      className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm text-slate-600"
                    >
                      {feature}
                    </div>
                  ))}
                </div>

                <Link
                  className={
                    plan.featured
                      ? "mt-8 inline-flex h-12 w-full items-center justify-center rounded-2xl bg-orange-500 px-5 text-sm font-semibold text-white shadow-[0_18px_40px_rgba(249,115,22,0.22)] transition hover:bg-orange-600 hover:shadow-[0_22px_45px_rgba(249,115,22,0.24)]"
                      : "mt-8 inline-flex h-12 w-full items-center justify-center rounded-2xl border border-slate-200 bg-white px-5 text-sm font-semibold text-slate-800 shadow-[0_12px_30px_rgba(15,23,42,0.06)] transition hover:border-slate-300 hover:bg-slate-50"
                  }
                  to={isAuthenticated ? "/app/settings" : `/register?plan=${plan.plan}`}
                >
                  {plan.ctaLabel}
                </Link>
              </article>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="rounded-[36px] border border-white/80 bg-[linear-gradient(145deg,#fff8f1_0%,#f3fbff_100%)] p-6 shadow-[0_24px_60px_rgba(15,23,42,0.06)] lg:p-8">
            <div className="max-w-3xl">
              <span className="inline-flex rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-emerald-700">
                Why it feels trustworthy
              </span>
              <h2 className="mt-5 text-3xl font-semibold tracking-[-0.04em] text-slate-950 sm:text-[2.35rem]">
                Lighter, clearer, and easier to use from the first click
              </h2>
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {reassurance.map((item) => (
                <div key={item} className="rounded-[26px] border border-white/80 bg-white/88 px-5 py-5 shadow-[0_16px_35px_rgba(15,23,42,0.04)]">
                  <Users className="h-5 w-5 text-emerald-700" />
                  <p className="mt-4 text-sm leading-7 text-slate-600">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/70 bg-[#f7fbff]">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <PixroomLogo
                className="max-w-[160px]"
                imageClassName="max-w-[124px]"
                subtitle="Shared memories, premium room experiences"
                to="/"
              />

              <p className="mt-5 max-w-md text-sm leading-7 text-slate-500">
                A modern product for shared photo rooms, invitations, private galleries, and photographer-friendly delivery.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <Link className={primaryButtonClass} to={isAuthenticated ? "/app/dashboard" : "/register"}>
                  {isAuthenticated ? "Go to dashboard" : "Create account"}
                </Link>
                <Link className={secondaryButtonClass} to="/demo">
                  Explore demo
                </Link>
              </div>
            </div>

            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {footerColumns.map((column) => (
                <div key={column.title}>
                  <p className="text-sm font-semibold text-slate-950">{column.title}</p>
                  <div className="mt-4 grid gap-3">
                    {column.links.map((item) => (
                      <FooterLink key={item.label} {...item} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-12 flex flex-col gap-3 border-t border-slate-200 pt-6 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
            <p>© 2026 PixRoom+. Built for photo rooms, shared memories, and event galleries.</p>
            <p>Read-only demo available before signup.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
