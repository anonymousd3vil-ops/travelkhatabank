import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  FiUsers,
  FiList,
  FiPieChart,
  FiPlus,
  FiMinus,
  FiArrowLeft,
  FiArrowUpRight,
  FiMapPin,
  FiDollarSign,
  FiTrendingUp,
  FiTrendingDown,
  FiShield,
  FiActivity,
} from 'react-icons/fi';
import { FaPlane } from 'react-icons/fa';

import { fetchTrip, fetchEntries } from '../store/tripSlice.js';
import { inr } from '../utils/format.js';
import StatCard from '../components/StatCard.jsx';
import EntryForm from '../components/EntryForm.jsx';
import MemberList from '../components/MemberList.jsx';
import Ledger from '../components/Ledger.jsx';
import Charts from '../components/Charts.jsx';
import Modal from '../components/Modal.jsx';

const TABS = [
  ['members', 'Members', FiUsers],
  ['log', 'Expense log', FiList],
  ['charts', 'Analytics', FiPieChart],
];

export default function Dashboard() {
  const { id } = useParams();
  const d = useDispatch();

  const user = useSelector((s) => s.auth.user);
  const { trip, summary, entries, loaded } = useSelector((s) => s.trip);

  const [tab, setTab] = useState('members');
  const [modal, setModal] = useState(null);

  useEffect(() => {
    d(fetchTrip(id));
    d(fetchEntries(id));
  }, [d, id]);

  if (!loaded) {
    return (
      <div className="flex min-h-52 flex-col items-center justify-center gap-3 rounded-3xl border border-slate-200 bg-white p-8 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-50 text-teal-700">
          <FaPlane className="bob text-2xl" />
        </div>
        <p className="text-sm font-medium text-slate-600">
          Getting your trip ready...
        </p>
        <p className="text-xs text-slate-400">
          Loading your expenses and travel details.
        </p>
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white px-5 py-12 text-center">
        <FiMapPin className="mx-auto text-4xl text-slate-300" />
        <h2 className="mt-4 text-lg font-bold text-slate-900">
          Trip not found
        </h2>
        <p className="mt-2 text-sm text-slate-500">
          This trip may have been removed or you may not have access to it.
        </p>
        <Link
          className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-teal-700 hover:text-teal-900"
          to="/trips"
        >
          <FiArrowLeft />
          Back to your trips
        </Link>
      </div>
    );
  }

  const isManager = trip.manager === user?.id;

  const balance = Number(summary?.balance ?? 0);
  const credits = Number(summary?.credits ?? 0);
  const debits = Number(summary?.debits ?? 0);
  const fund = Number(summary?.fund ?? 0);

  return (
    <div className="rise space-y-5 sm:space-y-6">
      {/* Back navigation */}
      <Link
        to="/trips"
        className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-teal-800"
      >
        <FiArrowLeft />
        All trips
      </Link>

      {/* Hero header */}
      <section className="relative isolate overflow-hidden rounded-3xl bg-linear-to-br from-teal-950 via-teal-800 to-emerald-700 p-5 text-white shadow-lg sm:p-8">
        <div className="pointer-events-none absolute -right-10 -top-16 -z-10 h-52 w-52 rounded-full bg-white/5 sm:h-72 sm:w-72" />
        <div className="pointer-events-none absolute -bottom-20 right-1/4 -z-10 h-48 w-48 rounded-full bg-emerald-300/10" />

        <div className="flex flex-col gap-6">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-start">
            <div className="min-w-0 flex-1">
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-medium text-teal-100">
                  <FiMapPin />
                  Trip overview
                </span>

                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white/90">
                  {isManager ? <FiShield /> : <FiUsers />}
                  {isManager ? 'Expense Manager' : 'Trip Member'}
                </span>
              </div>

              <h1 className="break-words text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl">
                {trip.destination}
              </h1>

              <p className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-teal-100/80">
                <span className="inline-flex items-center gap-1.5">
                  <FiUsers />
                  {trip.heads} travellers
                </span>
                <span className="hidden text-white/40 sm:inline">•</span>
                <span className="inline-flex items-center gap-1.5">
                  <FiDollarSign />
                  {inr(trip.perHead)} per head
                </span>
              </p>
            </div>

            {isManager && (
              <div className="grid w-full grid-cols-1 gap-2 min-[420px]:grid-cols-2 sm:w-auto sm:min-w-48 sm:grid-cols-1">
                <button
                  type="button"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-semibold text-teal-900 shadow-sm transition hover:-translate-y-0.5 hover:bg-teal-50"
                  onClick={() => setModal('debit')}
                >
                  <FiMinus className="text-base" />
                  Record expense
                </button>

                <button
                  type="button"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/20"
                  onClick={() => setModal('credit')}
                >
                  <FiPlus className="text-base" />
                  Add money
                </button>
              </div>
            )}
          </div>

          {/* Balance highlight */}
          <div className="flex flex-col gap-3 border-t border-white/15 pt-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-medium text-teal-100/80">
                Remaining group balance
              </p>
              <p className="mt-1 break-words text-3xl font-bold tracking-tight sm:text-4xl">
                {inr(balance)}
              </p>
            </div>

            <div className="flex items-center gap-2 self-start rounded-xl border border-white/10 bg-white/10 px-3 py-2 text-xs text-teal-50 sm:self-auto">
              <FiActivity />
              <span>Live trip overview</span>
            </div>
          </div>
        </div>
      </section>

      {/* Financial summary */}
      <section>
        <div className="mb-3 flex items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-slate-900 sm:text-lg">
              Financial overview
            </h2>
            <p className="mt-1 text-xs text-slate-500 sm:text-sm">
              Track the money flowing through your trip.
            </p>
          </div>
          <FiPieChart className="shrink-0 text-xl text-teal-700" />
        </div>

        <div className="grid grid-cols-1 gap-3 min-[420px]:grid-cols-2 xl:grid-cols-4">
          <div className="min-w-0 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md sm:p-5">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-medium text-slate-500 sm:text-sm">
                Initial fund
              </span>
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                <FiDollarSign />
              </span>
            </div>
            <p className="mt-4 break-words text-xl font-bold text-slate-900 sm:text-2xl">
              {inr(fund)}
            </p>
            <p className="mt-1 text-xs text-slate-400">
              Starting trip budget
            </p>
          </div>

          <div className="min-w-0 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md sm:p-5">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-medium text-slate-500 sm:text-sm">
                Money added
              </span>
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
                <FiTrendingUp />
              </span>
            </div>
            <p className="mt-4 break-words text-xl font-bold text-teal-700 sm:text-2xl">
              {inr(credits)}
            </p>
            <p className="mt-1 text-xs text-slate-400">
              Additional contributions
            </p>
          </div>

          <div className="min-w-0 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md sm:p-5">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-medium text-slate-500 sm:text-sm">
                Total spent
              </span>
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-600">
                <FiTrendingDown />
              </span>
            </div>
            <p className="mt-4 break-words text-xl font-bold text-red-600 sm:text-2xl">
              {inr(debits)}
            </p>
            <p className="mt-1 text-xs text-slate-400">
              Recorded trip expenses
            </p>
          </div>

          <div className="min-w-0 rounded-2xl border border-teal-100 bg-teal-50/60 p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md sm:p-5">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-medium text-slate-600 sm:text-sm">
                Available balance
              </span>
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-teal-800">
                <FiDollarSign />
              </span>
            </div>
            <p className="mt-4 break-words text-xl font-bold text-teal-900 sm:text-2xl">
              {inr(balance)}
            </p>
            <p className="mt-1 text-xs text-slate-500">
              Funds currently remaining
            </p>
          </div>
        </div>
      </section>

      {/* Tabs */}
      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 px-4 pt-4 sm:px-5">
          <div className="flex gap-1 overflow-x-auto">
            {TABS.map(([key, label, Icon]) => {
              const active = tab === key;

              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setTab(key)}
                  aria-pressed={active}
                  className={`-mb-px inline-flex shrink-0 items-center justify-center gap-2 border-b-2 px-3 py-3 text-sm transition-colors sm:px-5 ${
                    active
                      ? 'border-teal-700 font-semibold text-teal-800'
                      : 'border-transparent text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <Icon className="text-base" />
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="min-w-0 p-3 sm:p-5">
          {tab === 'members' && (
            <MemberList
              tripId={id}
              members={summary.members}
              isManager={isManager}
              managerId={trip.manager}
            />
          )}

          {tab === 'log' && (
            <Ledger
              tripId={id}
              trip={trip}
              summary={summary}
              entries={entries}
              isManager={isManager}
            />
          )}

          {tab === 'charts' && <Charts entries={entries} />}
        </div>
      </section>

      {/* Expense modal */}
      {modal && (
        <Modal
          title={
            modal === 'debit'
              ? 'Record a group expense'
              : 'Add money to the pool'
          }
          onClose={() => setModal(null)}
        >
          <EntryForm
            tripId={id}
            type={modal}
            members={summary.members}
            onDone={() => setModal(null)}
          />
        </Modal>
      )}
    </div>
  );
}
