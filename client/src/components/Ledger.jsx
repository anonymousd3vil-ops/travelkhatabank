import { useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import { FaFilePdf } from 'react-icons/fa';
import {
  FiActivity,
  FiArrowDownLeft,
  FiArrowUpRight,
  FiCalendar,
  FiCheckCircle,
  FiClock,
  FiFileText,
  FiShield,
  FiTrash2,
} from 'react-icons/fi';

import { voidEntry, fetchTrip } from '../store/tripSlice.js';
import { inr, fmtDate } from '../utils/format.js';
import { exportLog } from '../utils/pdf.js';

export default function Ledger({
  tripId,
  trip,
  summary,
  entries = [],
  isManager,
}) {
  const d = useDispatch();

  const activeEntries = entries.filter((entry) => !entry.voided);
  const totalDebits = activeEntries
    .filter((entry) => entry.type === 'debit')
    .reduce((sum, entry) => sum + Number(entry.amount || 0), 0);

  const totalCredits = activeEntries
    .filter((entry) => entry.type === 'credit')
    .reduce((sum, entry) => sum + Number(entry.amount || 0), 0);

  const doVoid = async (eid) => {
    if (
      !window.confirm(
        'Void this entry? It stays in the log but is no longer counted.'
      )
    ) {
      return;
    }

    try {
      await toast.promise(
        d(voidEntry({ id: tripId, eid })).unwrap(),
        {
          loading: 'Voiding entry…',
          success: 'Entry voided successfully',
          error: (message) => String(message),
        }
      );

      d(fetchTrip(tripId));
    } catch {
      // The toast already displays the error.
    }
  };

  const shareText = (entry) => {
    const shares = entry.shares?.length
      ? entry.shares.map((share) => ({
          name: share.user?.name || 'Member',
          amount: Number(share.amount || 0),
        }))
      : (entry.participants || []).map((participant) => ({
          name: participant.name || 'Member',
          amount:
            (Number(entry.amount) || 0) /
            Math.max(entry.participants?.length || 1, 1),
        }));

    return shares;
  };

  const handleExport = () => {
    try {
      exportLog(trip, summary, entries);
      toast.success('PDF downloaded');
    } catch {
      toast.error('Could not export the PDF. Please try again.');
    }
  };

  return (
    <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition-shadow duration-300 hover:shadow-md">
      {/* Header */}
      <div className="border-b border-slate-100 p-5 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-teal-50 text-teal-700">
              <FiActivity size={22} />
            </div>

            <div>
              <h2 className="text-lg font-bold tracking-tight text-slate-900">
                Expense log
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Track every transaction in your trip.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleExport}
            disabled={!entries.length}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-teal-200 hover:bg-teal-50 hover:text-teal-800 disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto"
          >
            <FaFilePdf className="text-red-500" size={16} />
            Export PDF
          </button>
        </div>

        {/* Summary */}
        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="rounded-2xl bg-slate-50 p-4">
            <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
              <FiFileText size={15} />
              Total entries
            </div>
            <p className="mt-2 text-2xl font-bold text-slate-900">
              {entries.length}
            </p>
            <p className="mt-1 text-xs text-slate-400">
              Including voided entries
            </p>
          </div>

          <div className="rounded-2xl border border-red-100 bg-red-50/60 p-4">
            <div className="flex items-center gap-2 text-xs font-medium text-red-700">
              <FiArrowUpRight size={15} />
              Total expenses
            </div>
            <p className="mt-2 break-words text-xl font-bold text-red-700">
              {inr(totalDebits)}
            </p>
            <p className="mt-1 text-xs text-red-600/70">
              Active debit entries
            </p>
          </div>

          <div className="rounded-2xl border border-teal-100 bg-teal-50/60 p-4">
            <div className="flex items-center gap-2 text-xs font-medium text-teal-700">
              <FiArrowDownLeft size={15} />
              Total credits
            </div>
            <p className="mt-2 break-words text-xl font-bold text-teal-700">
              {inr(totalCredits)}
            </p>
            <p className="mt-1 text-xs text-teal-600/70">
              Active credit entries
            </p>
          </div>
        </div>
      </div>

      {/* Transaction list */}
      <div className="p-5 sm:p-6">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h3 className="text-sm font-bold text-slate-800">
            Transactions
          </h3>

          <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
            {activeEntries.length} active
          </span>
        </div>

        {!entries.length ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50/70 px-4 py-12 text-center">
            <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-white text-slate-400 shadow-sm">
              <FiFileText size={25} />
            </div>

            <h3 className="font-semibold text-slate-800">
              No transactions yet
            </h3>

            <p className="mt-1 max-w-xs text-sm leading-6 text-slate-500">
              Your trip expenses and credits will appear here once they are
              added.
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-slate-100">
            {entries.map((entry) => {
              const isCredit = entry.type === 'credit';
              const shares = entry.type === 'debit' ? shareText(entry) : [];

              return (
                <li
                  key={entry._id}
                  className={`group py-4 first:pt-1 last:pb-1 ${
                    entry.voided ? 'opacity-60' : ''
                  }`}
                >
                  <div className="flex min-w-0 items-start gap-3">
                    {/* Transaction icon */}
                    <div
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${
                        entry.voided
                          ? 'bg-slate-100 text-slate-400'
                          : isCredit
                            ? 'bg-teal-50 text-teal-700'
                            : 'bg-red-50 text-red-600'
                      }`}
                    >
                      {entry.voided ? (
                        <FiClock size={19} />
                      ) : isCredit ? (
                        <FiArrowDownLeft size={20} />
                      ) : (
                        <FiArrowUpRight size={20} />
                      )}
                    </div>

                    {/* Transaction details */}
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between sm:gap-3">
                        <div className="min-w-0">
                          <h4
                            className={`break-words text-sm font-semibold text-slate-900 ${
                              entry.voided ? 'line-through' : ''
                            }`}
                          >
                            {entry.title || 'Untitled transaction'}
                          </h4>

                          <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-500">
                            <span className="rounded-md bg-slate-100 px-2 py-1 font-medium text-slate-600">
                              {entry.category || 'Uncategorized'}
                            </span>

                            <span className="inline-flex items-center gap-1">
                              <FiCalendar size={12} />
                              {fmtDate(entry.createdAt)}
                            </span>
                          </div>
                        </div>

                        <div className="shrink-0 text-left sm:text-right">
                          <p
                            className={`text-base font-bold ${
                              entry.voided
                                ? 'text-slate-400 line-through'
                                : isCredit
                                  ? 'text-teal-700'
                                  : 'text-red-600'
                            }`}
                          >
                            {isCredit ? '+' : '-'}
                            {inr(entry.amount)}
                          </p>

                          <span
                            className={`mt-1 inline-flex items-center gap-1 text-xs font-medium ${
                              entry.voided
                                ? 'text-slate-500'
                                : isCredit
                                  ? 'text-teal-700'
                                  : 'text-red-600'
                            }`}
                          >
                            {entry.voided ? (
                              <>
                                <FiClock size={12} />
                                Voided
                              </>
                            ) : (
                              <>
                                <FiCheckCircle size={12} />
                                {isCredit ? 'Credit' : 'Expense'}
                              </>
                            )}
                          </span>
                        </div>
                      </div>

                      {/* Creator */}
                      <p className="mt-2 break-words text-xs text-slate-500">
                        Added by{' '}
                        <span className="font-medium text-slate-700">
                          {entry.createdBy?.name || 'Unknown member'}
                        </span>
                      </p>

                      {/* Expense split */}
                      {entry.type === 'debit' && shares.length > 0 && (
                        <div className="mt-3 rounded-xl bg-slate-50 p-3">
                          <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-slate-600">
                            <FiShield size={13} />
                            Expense split
                          </p>

                          <div className="flex flex-wrap gap-2">
                            {shares.map((share, index) => (
                              <span
                                key={`${share.name}-${index}`}
                                className="inline-flex max-w-full items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs"
                              >
                                <span className="max-w-28 truncate font-medium text-slate-700">
                                  {share.name}
                                </span>
                                <span className="shrink-0 text-slate-500">
                                  {inr(share.amount)}
                                </span>
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Manager action */}
                      {isManager && !entry.voided && (
                        <div className="mt-3">
                          <button
                            type="button"
                            onClick={() => doVoid(entry._id)}
                            className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-red-600 transition hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-200"
                          >
                            <FiTrash2 size={13} />
                            Void entry
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {/* Footer */}
      {entries.length > 0 && (
        <div className="flex items-start gap-2 border-t border-slate-100 bg-slate-50/70 px-5 py-3.5 text-xs leading-5 text-slate-500 sm:px-6">
          <FiShield className="mt-0.5 shrink-0 text-teal-700" size={14} />
          <p>
            Voided entries remain in the log for transparency but are excluded
            from active totals.
          </p>
        </div>
      )}
    </section>
  );
}