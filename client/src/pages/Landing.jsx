import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  FaPlane,
  FaCompass,
  FaMountain,
  FaUsers,
  FaChartPie,
  FaFilePdf,
  FaBus,
} from "react-icons/fa";

const features = [
  [
    FaUsers,
    "One group wallet",
    "The manager holds the pooled money and every traveller sees where it goes.",
  ],
  [
    FaChartPie,
    "Fair splits",
    "Equal by default, or custom shares when the group splits up for activities.",
  ],
  [
    FaFilePdf,
    "Trip reports",
    "Category totals, a pie chart and a PDF of the full log in one tap.",
  ],
];
const steps = [
  "Create a trip and add your travellers",
  "Members receive their own login automatically",
  "Manager records spends, everyone follows along live",
];

export default function Landing() {
  const token = useSelector((s) => s.auth.token);
  return (
    <div className="min-h-screen overflow-hidden bg-white text-slate-900">
      {/* Navbar */}
      <header className="relative z-20 mx-auto flex max-w-7xl items-center justify-between px-5 py-5 lg:px-8">
        <Link to="/" className="flex items-center gap-2.5">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-teal-700 text-white shadow-lg shadow-teal-700/20">
            <FaCompass className="text-lg" />
          </span>
          <span className="text-xl font-extrabold tracking-tight">
            TravelKhata<span className="text-teal-700">Bank</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-8 text-sm font-medium text-slate-600 md:flex">
          <a href="#features" className="transition hover:text-teal-700">
            Features
          </a>
          <a href="#how-it-works" className="transition hover:text-teal-700">
            How it works
          </a>
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          {token ? (
            <Link
              to="/trips"
              className="rounded-xl bg-teal-700 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-teal-700/15 transition hover:-translate-y-0.5 hover:bg-teal-800"
            >
              My trips <span aria-hidden="true">→</span>
            </Link>
          ) : (
            <>
              <Link
                to="/login"
                className="rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 sm:px-4"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="rounded-xl bg-teal-700 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-teal-700/20 transition hover:-translate-y-0.5 hover:bg-teal-800 sm:px-5"
              >
                Get started <span aria-hidden="true">↗</span>
              </Link>
            </>
          )}
        </div>
      </header>

      {/* Hero */}
      <main>
        <section className="relative isolate overflow-hidden bg-linear-to-br from-teal-50 via-white to-emerald-50">
          {/* Background decoration */}
          <div className="pointer-events-none absolute -right-28 -top-28 h-96 w-96 rounded-full bg-teal-200/40 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-40 -left-20 h-96 w-96 rounded-full bg-emerald-200/30 blur-3xl" />

          <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-5 py-16 sm:py-20 lg:grid-cols-2 lg:gap-16 lg:px-8 lg:py-24">
            {/* Hero copy */}
            <div className="rise">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-teal-200 bg-white/80 px-3.5 py-2 text-xs font-semibold text-teal-800 shadow-sm sm:text-sm">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-teal-500 opacity-50" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-teal-600" />
                </span>
                Your trips. Your people. One simple khata.
              </div>

              <h1 className="max-w-xl text-4xl font-black leading-[1.12] tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
                Great trips.
                <br />
                <span className="bg-linear-to-r from-teal-700 via-teal-600 to-emerald-500 bg-clip-text text-transparent">
                  Zero money drama.
                </span>
              </h1>

              <p className="mt-6 max-w-lg text-base leading-7 text-slate-600 sm:text-lg sm:leading-8">
                From spontaneous road trips to long-awaited getaways, keep every
                expense organized and every friend in the loop. Spend less time
                calculating and more time exploring.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  to={token ? "/trips/new" : "/register"}
                  className="group inline-flex items-center justify-center gap-2 rounded-2xl bg-teal-700 px-6 py-3.5 font-bold text-white shadow-xl shadow-teal-700/20 transition duration-200 hover:-translate-y-1 hover:bg-teal-800 hover:shadow-teal-700/30"
                >
                  Plan your next trip
                  <span className="transition-transform group-hover:translate-x-1">
                    →
                  </span>
                </Link>

                <Link
                  to="/member-login"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white/80 px-6 py-3.5 font-semibold text-slate-700 transition hover:border-teal-300 hover:bg-white"
                >
                  <FaCompass className="text-teal-700" />
                  Member login
                </Link>
              </div>

              <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3 text-sm text-slate-600">
                <span className="flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-teal-100 text-teal-700">
                    ✓
                  </span>
                  Easy expense tracking
                </span>
                <span className="flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-teal-100 text-teal-700">
                    ✓
                  </span>
                  Built for groups
                </span>
              </div>
            </div>

            {/* Dashboard preview */}
            <div className="relative mx-auto w-full max-w-lg lg:max-w-none">
              <div className="absolute -inset-5 rounded-[2.5rem] bg-teal-200/30 blur-2xl" />

              <div className="relative rotate-1 rounded-4xl border border-white bg-white p-3 shadow-2xl shadow-teal-900/10 transition duration-500 hover:rotate-0 sm:p-5">
                {/* Mock trip cover */}
                <div className="relative overflow-hidden rounded-2xl bg-linear-to-br from-teal-800 via-teal-700 to-emerald-600 p-5 text-white sm:p-7">
                  <div className="absolute -right-5 -top-10 opacity-15">
                    <FaCompass className="text-9xl" />
                  </div>

                  <div className="relative flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-teal-100">
                        Your next adventure
                      </p>
                      <h2 className="mt-2 text-2xl font-bold sm:text-3xl">
                        The Goa Getaway
                      </h2>
                      <p className="mt-2 text-sm text-teal-50">
                        <span aria-hidden="true">✦</span> Good friends, great
                        memories
                      </p>
                    </div>

                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-white/20 bg-white/10">
                      <FaPlane className="text-xl" />
                    </span>
                  </div>

                  <div className="relative mt-7 flex items-center justify-between border-t border-white/20 pt-4">
                    <div>
                      <p className="text-xs text-teal-100">Trip status</p>
                      <p className="mt-1 font-semibold">Ready to explore</p>
                    </div>
                    <div className="flex -space-x-2">
                      {["V", "A", "R", "S"].map((initial, i) => (
                        <span
                          key={initial}
                          className={`flex h-9 w-9 items-center justify-center rounded-full border-2 border-teal-700 text-xs font-bold text-white ${
                            [
                              "bg-amber-500",
                              "bg-indigo-500",
                              "bg-pink-500",
                              "bg-emerald-500",
                            ][i]
                          }`}
                        >
                          {initial}
                        </span>
                      ))}
                      <span className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-teal-700 bg-white text-xs font-bold text-teal-800">
                        +2
                      </span>
                    </div>
                  </div>
                </div>

                {/* Expense summary */}
                <div className="p-3 sm:p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-slate-800">
                        Expense overview
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        A clearer picture of your trip
                      </p>
                    </div>
                    <span className="rounded-lg bg-teal-50 px-3 py-1.5 text-xs font-bold text-teal-700">
                      Sample data
                    </span>
                  </div>

                  <div className="mt-5 grid grid-cols-2 gap-3">
                    <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-100 text-teal-700">
                        ₹
                      </div>
                      <p className="mt-3 text-xs font-medium text-slate-500">
                        Total trip expenses
                      </p>
                      <p className="mt-1 text-2xl font-extrabold tracking-tight text-slate-900">
                        ₹24,500
                      </p>
                    </div>

                    <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700">
                        <span className="text-lg">↗</span>
                      </div>
                      <p className="mt-3 text-xs font-medium text-slate-500">
                        Per person share
                      </p>
                      <p className="mt-1 text-2xl font-extrabold tracking-tight text-slate-900">
                        ₹4,083
                      </p>
                    </div>
                  </div>

                  {/* Sample transactions */}
                  <div className="mt-5 space-y-4">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-bold text-slate-800">
                        Recent expenses
                      </p>
                      <span className="text-xs font-medium text-slate-400">
                        Example
                      </span>
                    </div>

                    {[
                      {
                        icon: "🏨",
                        name: "Stay & accommodation",
                        detail: "Paid by Vivek",
                        amount: "₹8,000",
                        color: "bg-orange-50",
                      },
                      {
                        icon: "🍜",
                        name: "Food & dining",
                        detail: "Paid by Ankit",
                        amount: "₹2,400",
                        color: "bg-amber-50",
                      },
                      {
                        icon: "🚕",
                        name: "Local transport",
                        detail: "Paid by Rohan",
                        amount: "₹1,200",
                        color: "bg-sky-50",
                      },
                    ].map((expense) => (
                      <div
                        key={expense.name}
                        className="flex items-center gap-3"
                      >
                        <span
                          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-lg ${expense.color}`}
                        >
                          {expense.icon}
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-semibold text-slate-800">
                            {expense.name}
                          </p>
                          <p className="mt-1 text-xs text-slate-500">
                            {expense.detail}
                          </p>
                        </div>
                        <p className="text-sm font-bold text-slate-900">
                          {expense.amount}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mx-1 mb-1 flex items-center gap-3 rounded-2xl border border-emerald-100 bg-emerald-50 p-3.5">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                    ✓
                  </span>
                  <div>
                    <p className="text-sm font-bold text-emerald-900">
                      No more awkward calculations.
                    </p>
                    <p className="mt-1 text-xs text-emerald-800">
                      Keep the memories. Organize the money.
                    </p>
                  </div>
                </div>
              </div>

              {/* Decorative floating element */}
              <div className="absolute -left-5 top-1/3 hidden -translate-y-1/2 items-center gap-3 rounded-2xl border border-white bg-white p-3 shadow-xl sm:flex">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-lg text-emerald-700">
                  ✓
                </span>
                <div>
                  <p className="text-xs font-medium text-slate-500">
                    Group expenses
                  </p>
                  <p className="text-sm font-bold text-slate-900">
                    All in one place
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom transition */}
          <div className="relative mx-auto max-w-7xl px-5 pb-10 lg:px-8">
            <div className="h-px bg-linear-to-r from-transparent via-teal-200 to-transparent" />
          </div>
        </section>

        {/* Features */}
        <section
          id="features"
          className="mx-auto max-w-7xl px-5 py-20 lg:px-8 lg:py-24"
        >
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-teal-700">
              Travel smarter
            </span>
            <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">
              Less math. More memories.
            </h2>
            <p className="mt-4 leading-7 text-slate-600">
              Everything your group needs to keep trip expenses organized,
              transparent, and stress-free.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {features.map(([Icon, title, description], index) => (
              <div
                key={title}
                className="group rounded-3xl border border-slate-200/80 bg-white p-6 transition duration-300 hover:-translate-y-1.5 hover:border-teal-200 hover:shadow-xl hover:shadow-teal-900/5 sm:p-7"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-50 text-xl text-teal-700 transition group-hover:bg-teal-700 group-hover:text-white">
                  <Icon />
                </div>
                <h3 className="mt-5 text-lg font-bold text-slate-900">
                  {title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {description}
                </p>
                <div className="mt-5 flex items-center gap-2 text-sm font-semibold text-teal-700">
                  Made for your group
                  <span className="transition-transform group-hover:translate-x-1">
                    →
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* How it works */}
        <section
          id="how-it-works"
          className="relative overflow-hidden bg-slate-950 py-20 text-white lg:py-24"
        >
          <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-teal-500/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-32 -left-24 h-80 w-80 rounded-full bg-emerald-500/10 blur-3xl" />

          <div className="relative mx-auto grid max-w-7xl gap-12 px-5 lg:grid-cols-2 lg:items-center lg:gap-20 lg:px-8">
            <div>
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-teal-400">
                Three simple steps
              </span>
              <h2 className="mt-4 max-w-lg text-3xl font-extrabold tracking-tight sm:text-4xl">
                From trip planning to expense tracking. Easy.
              </h2>
              <p className="mt-5 max-w-lg leading-7 text-slate-400">
                Set up your group, keep a record of shared spending, and make
                your next adventure about the people — not the payments.
              </p>

              <Link
                to={token ? "/trips/new" : "/register"}
                className="mt-8 inline-flex items-center gap-2 rounded-xl bg-teal-500 px-5 py-3.5 font-bold text-slate-950 transition hover:-translate-y-0.5 hover:bg-teal-400"
              >
                Start your journey <span>→</span>
              </Link>
            </div>

            <ol className="space-y-4">
              {steps.map((step, index) => (
                <li
                  key={step}
                  className="flex gap-4 rounded-2xl border border-white/10 bg-white/4 p-5 transition hover:border-teal-400/40 hover:bg-white/[0.07] sm:p-6"
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-teal-500/15 text-base font-extrabold text-teal-300">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div className="pt-1">
                    <p className="text-sm leading-6 text-slate-200 sm:text-base">
                      {step}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Final CTA */}
        <section className="px-5 py-16 sm:py-20">
          <div className="relative mx-auto max-w-5xl overflow-hidden rounded-4xl bg-linear-to-br from-teal-700 to-emerald-600 px-6 py-12 text-center text-white shadow-2xl shadow-teal-900/15 sm:px-12 sm:py-16">
            <div className="pointer-events-none absolute -right-10 -top-20 opacity-10">
              <FaCompass className="text-[14rem]" />
            </div>
            <div className="relative">
              <FaMountain className="mx-auto text-3xl text-teal-100" />
              <h2 className="mx-auto mt-5 max-w-2xl text-3xl font-extrabold tracking-tight sm:text-4xl">
                Your next adventure deserves better bookkeeping.
              </h2>
              <p className="mx-auto mt-4 max-w-xl leading-7 text-teal-50">
                Bring your friends together, organize your shared expenses, and
                focus on making memories that last.
              </p>
              <Link
                to={token ? "/trips/new" : "/register"}
                className="mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3.5 font-bold text-teal-800 shadow-lg transition hover:-translate-y-1 hover:bg-teal-50"
              >
                Plan a trip for free <span>→</span>
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-slate-50">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-5 py-7 text-center sm:flex-row sm:text-left lg:px-8">
          <Link
            to="/"
            className="flex items-center gap-2 font-bold text-slate-800"
          >
            <FaCompass className="text-teal-700" />
            TravelKhataBank
          </Link>
          <p className="text-xs text-slate-500">
            Made for the journey. Built for the group.
          </p>
          <p className="text-xs text-slate-500">
            © {new Date().getFullYear()} TravelKhataBank
          </p>
        </div>
      </footer>
    </div>
  );
}
