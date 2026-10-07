
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import {
  FiArrowRight,
  FiCheck,
  FiCheckCircle,
  FiDollarSign,
  FiFileText,
  FiInfo,
  FiPlus,
  FiUsers,
  FiX,
} from 'react-icons/fi';

import { addEntry, fetchTrip } from '../store/tripSlice.js';
import { CATEGORIES, inr } from '../utils/format.js';

export default function EntryForm({ tripId, type, members, onDone }) {
  const d = useDispatch();
  const isDebit = type === 'debit';

  const [f, setF] = useState({
    title: '',
    amount: '',
    category: 'Food',
    participants: [],
  });
  const [custom, setCustom] = useState(false);
  const [shares, setShares] = useState({});
  const [err, setErr] = useState('');

  const set = (k, v) => setF((p) => ({ ...p, [k]: v }));

  const toggle = (id) => {
    set(
      'participants',
      f.participants.includes(id)
        ? f.participants.filter((x) => x !== id)
        : [...f.participants, id]
    );
  };

  const allSelected =
    members.length > 0 && f.participants.length === members.length;

  const amount = Number(f.amount) || 0;

  const sharesSum = f.participants.reduce(
    (total, id) => total + (Number(shares[id]) || 0),
    0
  );

  const nameOf = (id) => members.find((m) => m.id === id)?.name;

  const equalShare =
    f.participants.length > 0 ? amount / f.participants.length : 0;

  const sharesMatch = Math.abs(sharesSum - amount) <= 0.01;

  const submit = async (e) => {
    e.preventDefault();
    setErr('');

    if (!Number.isFinite(amount) || amount <= 0) {
      return setErr('Enter a valid amount greater than zero.');
    }

    const body = {
      id: tripId,
      type,
      title: f.title.trim(),
      amount,
      category: f.category,
    };

    if (isDebit) {
      if (!f.participants.length) {
        return setErr('Select at least one member involved.');
      }

      if (custom) {
        if (!sharesMatch) {
          return setErr(
            `Shares add up to ${inr(sharesSum)}, expected ${inr(amount)}.`
          );
        }

        body.shares = f.participants.map((id) => ({
          user: id,
          amount: Number(shares[id]) || 0,
        }));
      } else {
        body.participants = f.participants;
      }
    }

    try {
      await toast.promise(d(addEntry(body)).unwrap(), {
        loading: 'Saving entry…',
        success: 'Entry saved successfully!',
        error: (m) => String(m),
      });

      d(fetchTrip(tripId));
      onDone();
    } catch {
      // The toast already displays the error.
    }
  };

  return (
    <form onSubmit={submit} className="space-y-6">
      {/* Header */}
      <div className="flex items-start gap-4">
        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${
            isDebit
              ? 'bg-rose-50 text-rose-600'
              : 'bg-emerald-50 text-emerald-600'
          }`}
        >
          {isDebit ? (
            <FiDollarSign size={23} />
          ) : (
            <FiPlus size={23} />
          )}
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="text-lg font-bold tracking-tight text-slate-900">
            {isDebit ? 'Add an expense' : 'Add a contribution'}
          </h3>
          <p className="mt-1 text-sm leading-5 text-slate-500">
            {isDebit
              ? 'Record a shared expense and decide who should split the cost.'
              : 'Record money added to the group fund.'}
          </p>
        </div>
      </div>

      {/* Basic details */}
      <div className="space-y-4">
        <div>
          <label
            htmlFor="entry-title"
            className="mb-2 block text-sm font-semibold text-slate-700"
          >
            {isDebit ? 'Expense description' : 'Contribution reason'}
          </label>

          <div className="relative">
            <FiFileText
              size={18}
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              id="entry-title"
              className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10"
              required
              maxLength={120}
              value={f.title}
              onChange={(e) => set('title', e.target.value)}
              placeholder={
                isDebit
                  ? 'e.g. Dinner at Shillong'
                  : 'e.g. Extra trip contribution'
              }
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label
              htmlFor="entry-amount"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Amount
            </label>

            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-500">
                ₹
              </span>
              <input
                id="entry-amount"
                className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-9 pr-4 text-sm font-semibold text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10"
                type="number"
                min="0.01"
                step="any"
                required
                value={f.amount}
                onChange={(e) => set('amount', e.target.value)}
                placeholder="0.00"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="entry-category"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Category
            </label>

            <select
              id="entry-category"
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm text-slate-800 outline-none transition focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10"
              value={f.category}
              onChange={(e) => set('category', e.target.value)}
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Participants */}
      {isDebit && (
        <div className="space-y-4 border-t border-slate-100 pt-5">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
                <FiUsers size={19} />
              </div>

              <div>
                <h4 className="text-sm font-bold text-slate-900">
                  Who was involved?
                </h4>
                <p className="mt-1 text-xs text-slate-500">
                  Select the members sharing this expense.
                </p>
              </div>
            </div>

            <button
              type="button"
              disabled={members.length === 0}
              onClick={() =>
                set(
                  'participants',
                  allSelected ? [] : members.map((m) => m.id)
                )
              }
              className="shrink-0 rounded-lg px-2 py-1.5 text-xs font-semibold text-teal-700 transition hover:bg-teal-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {allSelected ? 'Clear all' : 'Select all'}
            </button>
          </div>

          {members.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-5 text-center">
              <FiUsers className="mx-auto text-slate-400" size={22} />
              <p className="mt-2 text-sm font-medium text-slate-700">
                No members available
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Add members to this trip before recording a shared expense.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {members.map((m) => {
                const selected = f.participants.includes(m.id);

                return (
                  <button
                    type="button"
                    key={m.id}
                    aria-pressed={selected}
                    onClick={() => toggle(m.id)}
                    className={`flex min-w-0 items-center gap-3 rounded-xl border p-3 text-left transition ${
                      selected
                        ? 'border-teal-500 bg-teal-50/70 ring-2 ring-teal-500/10'
                        : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                        selected
                          ? 'bg-teal-700 text-white'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {m.name?.charAt(0)?.toUpperCase() || '?'}
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="break-words text-sm font-semibold text-slate-800">
                        {m.name}
                      </p>
                      {selected && (
                        <p className="mt-0.5 text-xs text-teal-700">
                          Included in split
                        </p>
                      )}
                    </div>

                    <span
                      className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
                        selected
                          ? 'border-teal-700 bg-teal-700 text-white'
                          : 'border-slate-300 bg-white text-transparent'
                      }`}
                    >
                      <FiCheck size={12} />
                    </span>
                  </button>
                );
              })}
            </div>
          )}

          {/* Split mode */}
          <div className="rounded-2xl border border-slate-200 bg-slate-50/80 p-4">
            <div className="flex items-start gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-slate-600 shadow-sm">
                <FiDollarSign size={18} />
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-slate-900">
                  Split calculation
                </p>
                <p className="mt-1 text-xs leading-5 text-slate-500">
                  {custom
                    ? 'Enter each participant’s share manually.'
                    : 'The expense is divided equally among selected members.'}
                </p>
              </div>
            </div>

            <label className="mt-4 flex cursor-pointer items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-3">
              <div className="min-w-0">
                <p className="text-sm font-semibold text-slate-800">
                  Custom shares
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  Set a different amount for each person.
                </p>
              </div>

              <input
                type="checkbox"
                checked={custom}
                onChange={(e) => setCustom(e.target.checked)}
                className="h-4 w-4 shrink-0 accent-teal-700"
              />
            </label>

            {f.participants.length > 0 && (
              <div className="mt-4 space-y-3">
                {!custom ? (
                  <div className="flex items-center justify-between gap-3 rounded-xl bg-teal-50 px-3 py-3">
                    <div>
                      <p className="text-xs font-medium text-teal-800">
                        Each person pays
                      </p>
                      <p className="mt-1 text-xs text-teal-700">
                        {f.participants.length}{' '}
                        {f.participants.length === 1 ? 'member' : 'members'}{' '}
                        selected
                      </p>
                    </div>
                    <p className="text-lg font-bold text-teal-800">
                      {inr(equalShare)}
                    </p>
                  </div>
                ) : (
                  <>
                    {f.participants.map((id) => (
                      <div
                        key={id}
                        className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-3"
                      >
                        <div className="min-w-0 flex-1">
                          <p className="break-words text-sm font-semibold text-slate-800">
                            {nameOf(id) || 'Member'}
                          </p>
                        </div>

                        <div className="relative w-32 shrink-0">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-400">
                            ₹
                          </span>
                          <input
                            aria-label={`Share amount for ${nameOf(id) || 'member'}`}
                            className="w-full rounded-lg border border-slate-200 py-2 pl-7 pr-2 text-sm font-semibold outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/10"
                            type="number"
                            min="0"
                            step="any"
                            value={shares[id] ?? ''}
                            onChange={(e) =>
                              setShares((prev) => ({
                                ...prev,
                                [id]: e.target.value,
                              }))
                            }
                            placeholder="0.00"
                          />
                        </div>
                      </div>
                    ))}

                    <div
                      className={`flex items-center justify-between gap-3 rounded-xl px-3 py-3 ${
                        sharesMatch
                          ? 'bg-emerald-50 text-emerald-800'
                          : 'bg-amber-50 text-amber-800'
                      }`}
                    >
                      <div className="flex min-w-0 items-center gap-2">
                        {sharesMatch ? (
                          <FiCheckCircle size={17} className="shrink-0" />
                        ) : (
                          <FiInfo size={17} className="shrink-0" />
                        )}
                        <span className="text-xs font-semibold">
                          {sharesMatch ? 'Shares balanced' : 'Amount remaining'}
                        </span>
                      </div>

                      <span className="shrink-0 text-sm font-bold">
                        {inr(sharesSum)} / {inr(amount)}
                      </span>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Error */}
      {err && (
        <div
          role="alert"
          className="flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700"
        >
          <FiInfo size={17} className="mt-0.5 shrink-0" />
          <p className="min-w-0 flex-1">{err}</p>
          <button
            type="button"
            aria-label="Dismiss error"
            onClick={() => setErr('')}
            className="shrink-0 rounded p-0.5 hover:bg-rose-100"
          >
            <FiX size={16} />
          </button>
        </div>
      )}

      {/* Submit */}
      <div className="border-t border-slate-100 pt-5">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-medium text-slate-500">
              {isDebit ? 'Total expense' : 'Contribution amount'}
            </p>
            <p className="mt-1 text-xl font-extrabold tracking-tight text-slate-900">
              {inr(amount)}
            </p>
          </div>

          {isDebit && f.participants.length > 0 && (
            <div className="text-right">
              <p className="text-xs text-slate-500">Participants</p>
              <p className="mt-1 text-sm font-bold text-slate-800">
                {f.participants.length} selected
              </p>
            </div>
          )}
        </div>

        <button
          type="submit"
          className={`group flex w-full items-center justify-center gap-2 rounded-xl px-5 py-3.5 text-sm font-bold text-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus:ring-4 disabled:cursor-not-allowed disabled:opacity-50 ${
            isDebit
              ? 'bg-teal-700 hover:bg-teal-800 focus:ring-teal-700/20'
              : 'bg-emerald-600 hover:bg-emerald-700 focus:ring-emerald-600/20'
          }`}
        >
          {isDebit ? <FiDollarSign size={18} /> : <FiPlus size={18} />}
          <span>{isDebit ? 'Save expense' : 'Save contribution'}</span>
          <FiArrowRight
            size={17}
            className="transition-transform group-hover:translate-x-1"
          />
        </button>

        <p className="mt-3 text-center text-xs leading-5 text-slate-400">
          {isDebit
            ? 'Your entry will be added to the trip ledger.'
            : 'Your contribution will be recorded in the group fund.'}
        </p>
      </div>
    </form>
  );
}
