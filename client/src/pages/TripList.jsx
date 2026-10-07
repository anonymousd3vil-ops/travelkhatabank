
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  FiPlus,
  FiArrowUpRight,
  FiMap,
  FiMapPin,
  FiUsers,
  FiCreditCard,
  FiShield,
  FiUser,
  FiArrowRight,
  FiCompass,
  FiLoader,
  FiAlertCircle,
} from 'react-icons/fi';
import { FaMountain } from 'react-icons/fa';

import { fetchTrips } from '../store/tripSlice.js';
import { inr } from '../utils/format.js';

export default function TripList() {
  const d = useDispatch();
  const { trips = [], tripsLoaded } = useSelector((s) => s.trip);

  useEffect(() => {
    d(fetchTrips());
  }, [d]);

  return (
    <div className="rise mx-auto max-w-7xl space-y-7 pb-8">
      {/* Hero */}
      <section className="relative isolate overflow-hidden rounded-3xl bg-linear-to-br from-slate-950 via-teal-950 to-emerald-800 p-6 text-white shadow-lg sm:p-8 lg:p-10">
        <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full border border-white/10" />
        <div className="pointer-events-none absolute -right-5 -top-5 h-44 w-44 rounded-full border border-white/10" />
        <div className="pointer-events-none absolute -bottom-24 left-1/3 h-64 w-64 rounded-full bg-teal-400/10 blur-3xl" />

        <div className="relative z-10 flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
          <div className="min-w-0 flex-1">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-teal-300/20 bg-teal-300/10 px-3 py-2 text-xs font-semibold uppercase tracking-widest text-teal-200">
              <FaMountain />
              Your travel dashboard
            </div>

            <h1 className="max-w-xl text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
              Your trips,
              <br className="hidden sm:block" /> your memories.
            </h1>

            <p className="mt-4 max-w-lg text-sm leading-7 text-slate-300 sm:text-base">
              Plan adventures, organize group expenses, and keep every
              traveller on the same page. Spend less time calculating and more
              time exploring.
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Link
                to="/trips/new"
                className="group inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-teal-950 shadow-md transition hover:-translate-y-0.5 hover:bg-teal-50"
              >
                <FiPlus size={18} />
                Create a trip
                <FiArrowUpRight
                  size={16}
                  className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </Link>

              <span className="inline-flex items-center gap-2 text-xs font-medium text-teal-100/80">
                <FiShield size={15} />
                Your group expenses, organized
              </span>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm sm:min-w-52 md:flex-col md:items-start md:gap-2">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 text-teal-200">
              <FiMap size={23} />
            </div>

            <div>
              <p className="text-3xl font-extrabold tracking-tight">
                {tripsLoaded ? trips.length : '—'}
              </p>
              <p className="mt-1 text-xs text-teal-100/80">
                {trips.length === 1
                  ? 'Trip in your collection'
                  : 'Trips in your collection'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section heading */}
      <section className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <FiCompass className="text-teal-700" size={20} />
            <h2 className="text-xl font-extrabold tracking-tight text-slate-900">
              All trips
            </h2>
          </div>
          <p className="mt-1.5 text-sm text-slate-500">
            All your adventures in one place.
          </p>
        </div>

        {tripsLoaded && trips.length > 0 && (
          <span className="inline-flex w-fit items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600">
            <span className="h-2 w-2 rounded-full bg-teal-500" />
            {trips.length} {trips.length === 1 ? 'trip' : 'trips'}
          </span>
        )}
      </section>

      {/* Loading state */}
      {!tripsLoaded && (
        <div className="rounded-2xl border border-slate-200 bg-white px-5 py-14 text-center shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-50 text-teal-700">
            <FiLoader className="animate-spin" size={25} />
          </div>
          <h3 className="mt-4 font-bold text-slate-900">
            Finding your trips
          </h3>
          <p className="mt-2 text-sm text-slate-500">
            Getting your travel dashboard ready…
          </p>
        </div>
      )}

      {/* Empty state */}
      {tripsLoaded && trips.length === 0 && (
        <div className="overflow-hidden rounded-3xl border border-dashed border-teal-200 bg-white px-5 py-12 text-center shadow-sm sm:py-16">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-teal-50 text-teal-700">
            <FaMountain size={29} />
          </div>

          <h3 className="mt-5 text-xl font-extrabold tracking-tight text-slate-900">
            Your next adventure starts here
          </h3>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
            You haven't created or joined any trips yet. Gather your friends,
            choose a destination, and start organizing your shared expenses.
          </p>

          <Link
            to="/trips/new"
            className="mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-teal-700 px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-teal-800 hover:shadow-md"
          >
            <FiPlus size={18} />
            Plan your first trip
            <FiArrowRight size={16} />
          </Link>
        </div>
      )}

      {/* Trip cards */}
      {tripsLoaded && trips.length > 0 && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {trips.map((t) => (
            <Link
              key={t.id}
              to={`/trips/${t.id}`}
              className="group relative isolate overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-teal-300 hover:shadow-xl hover:shadow-teal-950/5 sm:p-6"
            >
              {/* Decorative background */}
              <div className="pointer-events-none absolute -right-8 -top-8 -z-10 h-32 w-32 rounded-full bg-teal-50 transition-transform duration-300 group-hover:scale-125" />

              {/* Card heading */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-teal-50 text-teal-700 transition-colors group-hover:bg-teal-700 group-hover:text-white">
                  <FiMapPin size={22} />
                </div>

                <span
                  className={`inline-flex max-w-40 items-center gap-1.5 rounded-full px-2.5 py-1.5 text-[11px] font-bold ${
                    t.isManager
                      ? 'bg-teal-50 text-teal-800'
                      : 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {t.isManager ? (
                    <FiShield size={13} className="shrink-0" />
                  ) : (
                    <FiUser size={13} className="shrink-0" />
                  )}
                  <span className="truncate">
                    {t.isManager ? 'Expense Manager' : 'Member'}
                  </span>
                </span>
              </div>

              {/* Destination */}
              <h3 className="mt-5 break-words text-lg font-extrabold leading-snug text-slate-900 transition-colors group-hover:text-teal-800">
                {t.destination}
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Your group adventure
              </p>

              {/* Trip stats */}
              <div className="mt-5 grid grid-cols-2 gap-3">
                <div className="min-w-0 rounded-xl bg-slate-50 p-3 transition-colors group-hover:bg-teal-50/70">
                  <div className="flex items-center gap-1.5 text-slate-500">
                    <FiUsers size={14} />
                    <span className="text-xs">Travellers</span>
                  </div>
                  <p className="mt-2 text-lg font-extrabold text-slate-900">
                    {t.heads}
                  </p>
                </div>

                <div className="min-w-0 rounded-xl bg-slate-50 p-3 transition-colors group-hover:bg-teal-50/70">
                  <div className="flex items-center gap-1.5 text-slate-500">
                    <FiCreditCard size={14} />
                    <span className="text-xs">Per head</span>
                  </div>
                  <p className="mt-2 break-words text-base font-extrabold text-slate-900">
                    {inr(t.perHead)}
                  </p>
                </div>
              </div>

              {/* Card footer */}
              <div className="mt-5 flex items-center justify-between gap-3 border-t border-slate-100 pt-4">
                <span className="text-xs font-semibold text-slate-500 transition-colors group-hover:text-teal-800">
                  View trip details
                </span>

                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-600 transition-all group-hover:translate-x-1 group-hover:bg-teal-700 group-hover:text-white">
                  <FiArrowUpRight size={18} />
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Create another trip */}
      {tripsLoaded && trips.length > 0 && (
        <Link
          to="/trips/new"
          className="group flex items-center gap-4 rounded-2xl border border-dashed border-slate-300 bg-white p-4 transition-colors hover:border-teal-400 hover:bg-teal-50/50 sm:p-5"
        >
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600 transition-colors group-hover:bg-teal-100 group-hover:text-teal-800">
            <FiPlus size={23} />
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-sm font-bold text-slate-800">
              Planning another adventure?
            </p>
            <p className="mt-1 text-xs leading-5 text-slate-500">
              Create a new trip and invite your group.
            </p>
          </div>

          <FiArrowRight
            size={19}
            className="shrink-0 text-slate-400 transition-transform group-hover:translate-x-1 group-hover:text-teal-700"
          />
        </Link>
      )}
    </div>
  );
}
