import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import { FiTrash2 } from "react-icons/fi";
import {
  fetchPersonal,
  addPersonal,
  removePersonal,
} from "../store/personalSlice.js";
import { inr, fmtDate, CATEGORIES } from "../utils/format.js";
import StatCard from "../components/StatCard.jsx";

import {
  FiCreditCard,
  FiShield,
  FiTrendingUp,
  FiTrendingDown,
  FiDollarSign,
  FiPlus,
  FiMinus,
  FiFileText,
  FiTag,
  FiChevronDown,
  FiAlertCircle,
  FiArrowRight,
  FiList,
  FiInbox,
  FiShoppingBag,
} from "react-icons/fi";

export default function Personal() {
  const d = useDispatch();
  const items = useSelector((s) => s.personal.items);
  const empty = { type: "expense", title: "", amount: "", category: "Food" };
  const [f, setF] = useState(empty);
  const [err, setErr] = useState("");

  useEffect(() => {
    d(fetchPersonal());
  }, [d]);

  const sum = (t) =>
    items.filter((i) => i.type === t).reduce((a, i) => a + i.amount, 0);
  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    try {
      await toast.promise(
        d(addPersonal({ ...f, amount: Number(f.amount) })).unwrap(),
        { loading: "Saving…", success: "Added", error: (m) => String(m) },
      );
      setF(empty);
    } catch (m) {
      setErr(String(m));
    }
  };

  return (
    <div className="rise space-y-6">
      {/* Header */}
      <section className="relative isolate overflow-hidden rounded-3xl bg-linear-to-br from-teal-950 via-teal-800 to-emerald-700 p-5 text-white shadow-lg sm:p-8">
        <div className="pointer-events-none absolute -right-12 -top-12 -z-10 h-48 w-48 rounded-full bg-white/5 sm:h-64 sm:w-64" />
        <div className="pointer-events-none absolute -bottom-16 right-1/4 -z-10 h-40 w-40 rounded-full bg-emerald-300/10" />

        <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-medium text-teal-100">
              <FiDollarSign />
              Personal finance
            </div>

            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              My expenses
            </h1>

            <p className="mt-2 max-w-lg text-sm leading-6 text-teal-100/80">
              Keep track of your personal spending during the trip, separate
              from the shared group expenses.
            </p>
          </div>

          <div className="flex h-14 w-14 shrink-0 items-center justify-center self-start rounded-2xl border border-white/15 bg-white/10 sm:h-16 sm:w-16">
            <FiCreditCard className="text-3xl" />
          </div>
        </div>

        <div className="relative mt-6 flex items-center gap-2 border-t border-white/15 pt-4 text-xs text-teal-100/80">
          <FiShield />
          <span>Your personal tracker, separate from the group ledger</span>
        </div>
      </section>

      {/* Financial summary */}
      <section>
        <div className="mb-3">
          <h2 className="text-base font-bold text-slate-900 sm:text-lg">
            Spending overview
          </h2>
          <p className="mt-1 text-xs text-slate-500 sm:text-sm">
            A quick look at your personal finances.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3 min-[420px]:grid-cols-2 lg:grid-cols-3">
          <div className="min-w-0 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md sm:p-5">
            <div className="flex items-center justify-between gap-2">
              <span className="text-sm font-medium text-slate-500">
                Total added
              </span>
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
                <FiTrendingUp className="text-lg" />
              </span>
            </div>

            <p className="mt-4 break-words text-2xl font-bold text-teal-700">
              {inr(sum("income"))}
            </p>

            <p className="mt-1 text-xs text-slate-400">
              Money added to your personal budget
            </p>
          </div>

          <div className="min-w-0 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md sm:p-5">
            <div className="flex items-center justify-between gap-2">
              <span className="text-sm font-medium text-slate-500">
                Total spent
              </span>
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-600">
                <FiTrendingDown className="text-lg" />
              </span>
            </div>

            <p className="mt-4 break-words text-2xl font-bold text-red-600">
              {inr(sum("expense"))}
            </p>

            <p className="mt-1 text-xs text-slate-400">
              Your recorded personal expenses
            </p>
          </div>

          <div className="min-w-0 rounded-2xl border border-teal-100 bg-teal-50/60 p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md sm:p-5 min-[420px]:col-span-2 lg:col-span-1">
            <div className="flex items-center justify-between gap-2">
              <span className="text-sm font-medium text-slate-600">
                Money remaining
              </span>
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-teal-800">
                <FiDollarSign className="text-lg" />
              </span>
            </div>

            <p className="mt-4 break-words text-2xl font-bold text-teal-900">
              {inr(sum("income") - sum("expense"))}
            </p>

            <p className="mt-1 text-xs text-slate-500">
              Added money minus expenses
            </p>
          </div>
        </div>
      </section>

      {/* Form and transaction history */}
      <div className="grid min-w-0 items-start gap-5 lg:grid-cols-2">
        {/* Add transaction */}
        <section className="min-w-0 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 p-5 sm:p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-teal-800">
                <FiPlus className="text-xl" />
              </div>
              <div>
                <h2 className="font-bold text-slate-900">Add a transaction</h2>
                <p className="mt-1 text-xs text-slate-500">
                  Record money in or money out.
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={submit} className="space-y-5 p-5 sm:p-6">
            {/* Transaction type */}
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Transaction type
              </label>

              <div className="grid grid-cols-2 gap-3">
                {[
                  ["expense", "Spent", FiTrendingDown],
                  ["income", "Add money", FiTrendingUp],
                ].map(([value, label, Icon]) => {
                  const active = f.type === value;
                  const isExpense = value === "expense";

                  return (
                    <button
                      type="button"
                      key={value}
                      aria-pressed={active}
                      onClick={() => setF({ ...f, type: value })}
                      className={`flex min-w-0 items-center justify-center gap-2 rounded-xl border px-3 py-3 text-sm font-semibold transition ${
                        active
                          ? isExpense
                            ? "border-red-200 bg-red-50 text-red-700 ring-2 ring-red-100"
                            : "border-teal-200 bg-teal-50 text-teal-800 ring-2 ring-teal-100"
                          : "border-slate-200 bg-white text-slate-500 hover:bg-slate-50"
                      }`}
                    >
                      <Icon className="shrink-0 text-lg" />
                      <span>{label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Description */}
            <div>
              <label
                htmlFor="personal-title"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Description
              </label>

              <div className="relative">
                <FiFileText className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />

                <input
                  id="personal-title"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-teal-600 focus:bg-white focus:ring-4 focus:ring-teal-600/10"
                  required
                  placeholder="e.g. Lunch, taxi, souvenirs"
                  value={f.title}
                  onChange={(e) => setF({ ...f, title: e.target.value })}
                />
              </div>
            </div>

            {/* Amount and category */}
            <div className="grid grid-cols-1 gap-4 min-[420px]:grid-cols-2">
              <div className="min-w-0">
                <label
                  htmlFor="personal-amount"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Amount (₹)
                </label>

                <div className="relative">
                  <FiDollarSign className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />

                  <input
                    id="personal-amount"
                    className="w-full min-w-0 rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-teal-600 focus:bg-white focus:ring-4 focus:ring-teal-600/10"
                    type="number"
                    min="1"
                    step="any"
                    required
                    placeholder="0.00"
                    value={f.amount}
                    onChange={(e) => setF({ ...f, amount: e.target.value })}
                  />
                </div>
              </div>

              <div className="min-w-0">
                <label
                  htmlFor="personal-category"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Category
                </label>

                <div className="relative">
                  <FiTag className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />

                  <select
                    id="personal-category"
                    className="w-full min-w-0 appearance-none rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-8 text-sm outline-none transition focus:border-teal-600 focus:bg-white focus:ring-4 focus:ring-teal-600/10"
                    value={f.category}
                    onChange={(e) => setF({ ...f, category: e.target.value })}
                  >
                    {CATEGORIES.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>

                  <FiChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
                </div>
              </div>
            </div>

            {/* Error */}
            {err && (
              <div
                role="alert"
                className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700"
              >
                <FiAlertCircle className="mt-0.5 shrink-0" />
                <p>{err}</p>
              </div>
            )}

            <button
              type="submit"
              className={`flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 ${
                f.type === "income"
                  ? "bg-teal-800 hover:bg-teal-900"
                  : "bg-slate-900 hover:bg-slate-800"
              }`}
            >
              <FiPlus />
              {f.type === "income" ? "Add money" : "Record expense"}
              <FiArrowRight />
            </button>

            <p className="flex items-center justify-center gap-1.5 text-center text-xs text-slate-400">
              <FiShield />
              This transaction belongs to your personal tracker.
            </p>
          </form>
        </section>

        {/* Transaction history */}
        <section className="min-w-0 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between gap-3 border-b border-slate-100 p-5 sm:p-6">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-700">
                <FiList className="text-xl" />
              </div>

              <div className="min-w-0">
                <h2 className="font-bold text-slate-900">
                  Transaction history
                </h2>
                <p className="mt-1 text-xs text-slate-500">
                  Your personal money trail.
                </p>
              </div>
            </div>

            <span className="shrink-0 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
              {items.length} {items.length === 1 ? "entry" : "entries"}
            </span>
          </div>

          {!items.length ? (
            <div className="px-5 py-12 text-center sm:px-8">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-50 text-teal-700">
                <FiInbox className="text-2xl" />
              </div>

              <h3 className="mt-4 font-semibold text-slate-800">
                No transactions yet
              </h3>

              <p className="mx-auto mt-2 max-w-xs text-sm leading-6 text-slate-500">
                Your personal expenses and added funds will appear here once you
                record your first transaction.
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-slate-100">
              {items.map((item) => {
                const isIncome = item.type === "income";

                return (
                  <li
                    key={item._id}
                    className="flex min-w-0 items-center gap-3 p-4 transition hover:bg-slate-50/80 sm:px-5"
                  >
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                        isIncome
                          ? "bg-teal-50 text-teal-700"
                          : "bg-red-50 text-red-600"
                      }`}
                    >
                      {isIncome ? (
                        <FiTrendingUp className="text-lg" />
                      ) : (
                        <FiShoppingBag className="text-lg" />
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="break-words text-sm font-semibold text-slate-800">
                        {item.title}
                      </p>

                      <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-500">
                        <span>{item.category}</span>
                        <span className="text-slate-300">•</span>
                        <span>{fmtDate(item.date)}</span>
                      </div>
                    </div>

                    <div className="flex shrink-0 items-center gap-2">
                      <span
                        className={`whitespace-nowrap text-right text-sm font-bold ${
                          isIncome ? "text-teal-700" : "text-red-600"
                        }`}
                      >
                        {isIncome ? "+" : "−"}
                        {inr(item.amount)}
                      </span>

                      <button
                        type="button"
                        onClick={() => d(removePersonal(item._id))}
                        aria-label={`Delete ${item.title}`}
                        title="Delete transaction"
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-slate-400 transition hover:bg-red-50 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-200"
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
