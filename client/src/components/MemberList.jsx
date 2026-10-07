import { useState } from "react";
import toast from "react-hot-toast";
import {
  FiUsers,
  FiUser,
  FiShield,
  FiPhone,
  FiCreditCard,
  FiTrendingUp,
  FiTrendingDown,
  FiRefreshCw,
  FiCheckCircle,
  FiEye,
  FiEyeOff,
  FiCopy,
} from "react-icons/fi";

import api from "../api/axios.js";
import { inr } from "../utils/format.js";

export default function MemberList({
  members = [],
  isManager,
  managerId,
  tripId,
}) {
  const [creds, setCreds] = useState({});
  const [resetting, setResetting] = useState({});
  const [visiblePasswords, setVisiblePasswords] = useState({});

  const totalMembers = members.length;
  const totalSpent = members.reduce(
    (sum, member) => sum + Number(member.spent || 0),
    0,
  );
  const totalContributed = members.reduce(
    (sum, member) => sum + Number(member.contributed || 0),
    0,
  );

  const reset = async (id) => {
    if (resetting[id]) return;

    const confirmed = window.confirm(
      "Reset this member’s password? Their existing password will no longer work.",
    );

    if (!confirmed) return;

    setResetting((prev) => ({ ...prev, [id]: true }));

    try {
      const response = await api.post(`/trips/${tripId}/reset/${id}`);

      setCreds((prev) => ({
        ...prev,
        [id]: response.data,
      }));

      setVisiblePasswords((prev) => ({
        ...prev,
        [id]: true,
      }));

      toast.success("Password reset successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not reset password");
    } finally {
      setResetting((prev) => ({ ...prev, [id]: false }));
    }
  };

  const copyPassword = async (password) => {
    try {
      await navigator.clipboard.writeText(password);
      toast.success("Password copied to clipboard");
    } catch {
      toast.error("Could not copy password");
    }
  };

  return (
    <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition-shadow duration-300 hover:shadow-md">
      {/* Header */}
      <div className="border-b border-slate-100 p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-teal-50 text-teal-700">
              <FiUsers size={22} />
            </div>

            <div>
              <h2 className="text-lg font-bold tracking-tight text-slate-900">
                Trip members
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Manage members and track their balances.
              </p>
            </div>
          </div>

          <span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600">
            {totalMembers} {totalMembers === 1 ? "member" : "members"}
          </span>
        </div>

        {/* Overview */}
        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="rounded-2xl bg-slate-50 p-4">
            <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
              <FiCreditCard size={15} />
              Total contributed
            </div>
            <p className="mt-2 break-words text-xl font-bold text-slate-900">
              {inr(totalContributed)}
            </p>
          </div>

          <div className="rounded-2xl bg-slate-50 p-4">
            <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
              <FiTrendingDown size={15} />
              Total spent
            </div>
            <p className="mt-2 break-words text-xl font-bold text-slate-900">
              {inr(totalSpent)}
            </p>
          </div>
        </div>
      </div>

      {/* Members */}
      <div className="p-5 sm:p-6">
        <h3 className="mb-4 text-sm font-bold text-slate-800">
          Member directory
        </h3>

        {members.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/70 px-4 py-10 text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-white text-slate-400 shadow-sm">
              <FiUsers size={23} />
            </div>
            <p className="font-semibold text-slate-800">No members yet</p>
            <p className="mt-1 text-sm text-slate-500">
              Trip members will appear here.
            </p>
          </div>
        ) : (
          <ul className="space-y-3">
            {members.map((member) => {
              const isCurrentManager = member.id === managerId;
              const balance = Number(member.remaining || 0);
              const isNegative = balance < 0;
              const password = creds[member.id]?.password;
              const isPasswordVisible = visiblePasswords[member.id];

              return (
                <li
                  key={member.id}
                  className="min-w-0 rounded-2xl border border-slate-200 p-4 transition-colors hover:border-slate-300 sm:p-5"
                >
                  {/* Member identity and balance */}
                  <div className="flex min-w-0 items-start gap-3">
                    <div
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${
                        isCurrentManager
                          ? "bg-amber-50 text-amber-700"
                          : "bg-teal-50 text-teal-700"
                      }`}
                    >
                      {isCurrentManager ? (
                        <FiShield size={20} />
                      ) : (
                        <FiUser size={20} />
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <h4 className="break-words text-sm font-bold text-slate-900">
                              {member.name || "Unnamed member"}
                            </h4>

                            {isCurrentManager && (
                              <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-1 text-[10px] font-bold uppercase tracking-wide text-amber-700">
                                <FiShield size={11} />
                                Manager
                              </span>
                            )}
                          </div>

                          {member.username && (
                            <p className="mt-1 break-all text-xs text-slate-500">
                              @{member.username}
                            </p>
                          )}
                        </div>

                        <div className="shrink-0 sm:text-right">
                          <p
                            className={`text-lg font-bold ${
                              isNegative ? "text-red-600" : "text-teal-700"
                            }`}
                          >
                            {inr(balance)}
                          </p>

                          <p
                            className={`mt-0.5 text-xs font-medium ${
                              isNegative ? "text-red-500" : "text-teal-600"
                            }`}
                          >
                            {isNegative ? "Over budget" : "Remaining"}
                          </p>
                        </div>
                      </div>

                      {/* Contact */}
                      {member.phone && (
                        <p className="mt-3 flex min-w-0 items-center gap-2 break-all text-xs text-slate-500">
                          <FiPhone size={13} className="shrink-0" />
                          {member.phone}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Spending statistics */}
                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <div className="rounded-xl bg-slate-50 p-3">
                      <div className="flex items-center gap-1.5 text-xs text-slate-500">
                        <FiTrendingDown size={13} />
                        Spent
                      </div>
                      <p className="mt-1 break-words text-sm font-bold text-slate-800">
                        {inr(member.spent)}
                      </p>
                    </div>

                    <div className="rounded-xl bg-slate-50 p-3">
                      <div className="flex items-center gap-1.5 text-xs text-slate-500">
                        <FiTrendingUp size={13} />
                        Contributed
                      </div>
                      <p className="mt-1 break-words text-sm font-bold text-slate-800">
                        {inr(member.contributed)}
                      </p>
                    </div>
                  </div>

                  {/* Manager controls */}
                  {isManager && !isCurrentManager && (
                    <div className="mt-4 border-t border-slate-100 pt-4">
                      {!password ? (
                        <button
                          type="button"
                          onClick={() => reset(member.id)}
                          disabled={Boolean(resetting[member.id])}
                          className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 px-3 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-teal-200 hover:bg-teal-50 hover:text-teal-800 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
                        >
                          <FiRefreshCw
                            size={15}
                            className={
                              resetting[member.id] ? "animate-spin" : ""
                            }
                          />
                          {resetting[member.id]
                            ? "Resetting password…"
                            : "Reset password"}
                        </button>
                      ) : (
                        <div className="rounded-xl border border-teal-100 bg-teal-50/70 p-3">
                          <div className="flex items-start gap-2">
                            <FiCheckCircle
                              size={17}
                              className="mt-0.5 shrink-0 text-teal-700"
                            />

                            <div className="min-w-0 flex-1">
                              <p className="text-xs font-semibold text-teal-900">
                                Password reset successfully
                              </p>
                              <p className="mt-1 text-xs text-teal-800">
                                Share the new password securely with this
                                member.
                              </p>

                              <div className="mt-3 flex min-w-0 items-center gap-2 rounded-lg border border-teal-100 bg-white p-2">
                                <code className="min-w-0 flex-1 break-all text-sm text-slate-800">
                                  {isPasswordVisible
                                    ? password
                                    : "••••••••••••"}
                                </code>

                                <button
                                  type="button"
                                  onClick={() =>
                                    setVisiblePasswords((prev) => ({
                                      ...prev,
                                      [member.id]: !prev[member.id],
                                    }))
                                  }
                                  className="shrink-0 rounded-md p-1.5 text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
                                  aria-label={
                                    isPasswordVisible
                                      ? "Hide password"
                                      : "Show password"
                                  }
                                  title={
                                    isPasswordVisible
                                      ? "Hide password"
                                      : "Show password"
                                  }
                                >
                                  {isPasswordVisible ? (
                                    <FiEyeOff size={16} />
                                  ) : (
                                    <FiEye size={16} />
                                  )}
                                </button>

                                <button
                                  type="button"
                                  onClick={() => copyPassword(password)}
                                  className="shrink-0 rounded-md p-1.5 text-slate-500 transition hover:bg-slate-100 hover:text-teal-700"
                                  aria-label="Copy password"
                                  title="Copy password"
                                >
                                  <FiCopy size={16} />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {/* Footer */}
      {members.length > 0 && (
        <div className="flex items-start gap-2 border-t border-slate-100 bg-slate-50/70 px-5 py-3.5 text-xs leading-5 text-slate-500 sm:px-6">
          <FiShield className="mt-0.5 shrink-0 text-teal-700" size={14} />
          <p>
            Member balances are based on the trip data currently available.
            Password resets are restricted to the trip manager.
          </p>
        </div>
      )}
    </section>
  );
}
