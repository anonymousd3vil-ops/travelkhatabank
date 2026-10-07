import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import {
  FiUser,
  FiMapPin,
  FiShield,
  FiTrendingUp,
  FiUsers,
  FiCalendar,
  FiArrowUpRight,
  FiArrowRight,
  FiEdit3,
  FiLock,
  FiPhone,
  FiCheckCircle,
  FiAlertCircle,
  FiLoader,
  FiCompass,
} from "react-icons/fi";

import api from "../api/axios.js";
import { inr, fmtDate } from "../utils/format.js";

export default function Profile() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [savingInfo, setSavingInfo] = useState(false);
  const [savingPw, setSavingPw] = useState(false);

  const [form, setForm] = useState({ name: "", phone: "" });
  const [pw, setPw] = useState({ current: "", next: "" });

  useEffect(() => {
    let active = true;

    api
      .get("/users/me/profile")
      .then((r) => {
        if (!active) return;

        setData(r.data);
        setForm({
          name: r.data.user.name || "",
          phone: r.data.user.phone || "",
        });
      })
      .catch(() => {
        if (active) toast.error("Could not load profile");
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const saveInfo = async (e) => {
    e.preventDefault();
    setSavingInfo(true);

    try {
      const response = await toast.promise(
        api.put("/users/me", {
          name: form.name.trim(),
          phone: form.phone.trim(),
        }),
        {
          loading: "Updating profile…",
          success: "Profile updated successfully",
          error: (e) => e.response?.data?.message || "Could not update profile",
        },
      );

      if (data && response.data?.user) {
        setData((prev) => ({
          ...prev,
          user: { ...prev.user, ...response.data.user },
        }));
      } else {
        setData((prev) => ({
          ...prev,
          user: {
            ...prev.user,
            name: form.name.trim(),
            phone: form.phone.trim(),
          },
        }));
      }
    } catch {
      // Error is already displayed by the toast.
    } finally {
      setSavingInfo(false);
    }
  };

  const savePw = async (e) => {
    e.preventDefault();
    setSavingPw(true);

    try {
      await toast.promise(api.put("/users/me/password", pw), {
        loading: "Changing password…",
        success: "Password changed successfully",
        error: (e) => e.response?.data?.message || "Could not change password",
      });

      setPw({ current: "", next: "" });
    } catch {
      // Error is already displayed by the toast.
    } finally {
      setSavingPw(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-64 items-center justify-center">
        <div className="flex items-center gap-3 text-sm text-slate-500">
          <FiLoader className="animate-spin text-teal-700" size={20} />
          Loading your profile…
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="mx-auto max-w-lg rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-rose-50 text-rose-600">
          <FiAlertCircle size={26} />
        </div>
        <h2 className="mt-4 text-lg font-bold text-slate-900">
          Unable to load profile
        </h2>
        <p className="mt-2 text-sm text-slate-500">
          Something went wrong while retrieving your account details.
        </p>
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="mt-5 rounded-xl bg-teal-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-teal-800"
        >
          Try again
        </button>
      </div>
    );
  }

  const { user, trips = [] } = data;

  const stats = [
    {
      label: "Trips travelled",
      value: trips.length,
      icon: FiMapPin,
      description: "Your trip history",
      iconClass: "bg-teal-50 text-teal-700",
    },
    {
      label: "Trips managed",
      value: data.tripsManaged ?? 0,
      icon: FiUsers,
      description: "Trips you organised",
      iconClass: "bg-violet-50 text-violet-700",
    },
    {
      label: "My total share",
      value: inr(data.totalShare ?? 0),
      icon: FiTrendingUp,
      description: "Across your trips",
      iconClass: "bg-amber-50 text-amber-700",
    },
  ];

  return (
    <div className="rise mx-auto max-w-6xl space-y-6 pb-8">
      {/* Page heading */}
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-teal-700">
            Account settings
          </p>
          <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
            My profile
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Manage your personal details, trips and account security.
          </p>
        </div>

        <div className="flex w-fit items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700">
          <FiCheckCircle size={15} />
          Account active
        </div>
      </div>

      {/* Profile hero */}
      <section className="relative overflow-hidden rounded-3xl bg-linear-to-br from-slate-950 via-slate-900 to-teal-950 p-5 text-white shadow-lg sm:p-8">
        <div className="pointer-events-none absolute -right-12 -top-16 h-56 w-56 rounded-full border border-white/10" />
        <div className="pointer-events-none absolute -right-4 -top-8 h-40 w-40 rounded-full border border-white/10" />
        <div className="pointer-events-none absolute -bottom-20 left-1/3 h-48 w-48 rounded-full bg-teal-500/10 blur-3xl" />

        <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center">
          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-3xl border border-white/15 bg-white/10 text-3xl font-extrabold shadow-inner sm:h-24 sm:w-24 sm:text-4xl">
            {user.name?.charAt(0)?.toUpperCase() || <FiUser size={34} />}
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-teal-200">
              Welcome to your travel space
            </p>
            <h2 className="mt-1 break-words text-2xl font-extrabold sm:text-3xl">
              {user.name}
            </h2>

            <p className="mt-2 break-words text-sm text-slate-300">
              @{user.username}
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/10 px-3 py-1.5 text-xs text-slate-200">
                <FiCalendar size={13} />
                Joined {fmtDate(user.joined)}
              </span>

              {user.phone && (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/10 px-3 py-1.5 text-xs text-slate-200">
                  <FiPhone size={13} />
                  {user.phone}
                </span>
              )}
            </div>
          </div>

          <a
            href="#edit-profile"
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/10 px-4 py-3 text-sm font-semibold transition hover:bg-white/15"
          >
            <FiEdit3 size={16} />
            Edit profile
          </a>
        </div>
      </section>

      {/* Statistics */}
      <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.label}
              className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-slate-500">
                    {stat.label}
                  </p>
                  <p className="mt-3 break-words text-2xl font-extrabold tracking-tight text-slate-900">
                    {stat.value}
                  </p>
                  <p className="mt-1 text-xs text-slate-400">
                    {stat.description}
                  </p>
                </div>

                <div
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${stat.iconClass}`}
                >
                  <Icon size={21} />
                </div>
              </div>
            </div>
          );
        })}
      </section>

      {/* Trip history */}
      <section className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
        <div className="flex flex-col justify-between gap-3 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
              <FiCompass size={21} />
            </div>
            <div>
              <h2 className="font-bold text-slate-900">Trips travelled</h2>
              <p className="mt-1 text-xs text-slate-500">
                Your travel history and expense breakdowns
              </p>
            </div>
          </div>

          <Link
            to="/trips"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-teal-700 transition hover:text-teal-900"
          >
            View all trips
            <FiArrowUpRight size={16} />
          </Link>
        </div>

        {trips.length === 0 ? (
          <div className="px-5 py-12 text-center sm:px-6">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
              <FiMapPin size={25} />
            </div>
            <h3 className="mt-4 font-bold text-slate-800">
              Your journey starts here
            </h3>
            <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500">
              You haven’t travelled on any recorded trips yet. Create a trip
              with your friends to start tracking shared expenses.
            </p>
            <Link
              to="/trips"
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-teal-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-teal-800"
            >
              Explore trips
              <FiArrowRight size={16} />
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {trips.map((t) => (
              <Link
                key={t.id}
                to={`/trips/${t.id}`}
                className="group block p-5 transition hover:bg-slate-50/80 sm:px-6"
              >
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600 transition group-hover:bg-teal-50 group-hover:text-teal-700">
                    <FiMapPin size={20} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                      <div className="min-w-0">
                        <h3 className="break-words font-bold text-slate-900 transition group-hover:text-teal-800">
                          {t.destination}
                        </h3>

                        <div className="mt-1.5 flex flex-wrap items-center gap-2">
                          <span
                            className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold ${
                              t.isManager
                                ? "bg-violet-50 text-violet-700"
                                : "bg-slate-100 text-slate-600"
                            }`}
                          >
                            {t.isManager ? (
                              <FiShield size={12} />
                            ) : (
                              <FiUser size={12} />
                            )}
                            {t.isManager ? "Trip manager" : "Member"}
                          </span>

                          <span className="inline-flex items-center gap-1 text-xs text-slate-500">
                            <FiUsers size={13} />
                            {t.heads} travellers
                          </span>
                        </div>
                      </div>

                      <div className="flex shrink-0 items-center justify-between gap-3 sm:flex-col sm:items-end sm:gap-1">
                        <p className="text-xs text-slate-500">My share</p>
                        <p className="text-base font-extrabold text-slate-900">
                          {inr(t.myShare)}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
                      <p className="text-xs leading-5 text-slate-500">
                        Trip total{" "}
                        <span className="font-semibold text-slate-700">
                          {inr(t.tripTotal)}
                        </span>
                        <span className="mx-2 text-slate-300">·</span>
                        {fmtDate(t.createdAt)}
                      </p>

                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-teal-700 transition group-hover:gap-2">
                        View trip
                        <FiArrowRight size={14} />
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Account settings */}
      <section className="grid grid-cols-1 items-start gap-5 lg:grid-cols-2">
        {/* Edit profile */}
        <form
          id="edit-profile"
          onSubmit={saveInfo}
          className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6"
        >
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
              <FiUser size={21} />
            </div>
            <div>
              <h2 className="font-bold text-slate-900">Personal details</h2>
              <p className="mt-1 text-xs text-slate-500">
                Keep your information up to date.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label
                htmlFor="profile-name"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Full name
              </label>
              <input
                id="profile-name"
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10"
                required
                maxLength={100}
                value={form.name}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, name: e.target.value }))
                }
                placeholder="Enter your name"
              />
            </div>

            <div>
              <label
                htmlFor="profile-phone"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Contact number
                <span className="ml-1 font-normal text-slate-400">
                  (optional)
                </span>
              </label>
              <div className="relative">
                <FiPhone
                  size={17}
                  className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  id="profile-phone"
                  className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10"
                  type="tel"
                  maxLength={25}
                  value={form.phone}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, phone: e.target.value }))
                  }
                  placeholder="Enter contact number"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={savingInfo || !form.name.trim()}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-teal-700 px-4 py-3 text-sm font-bold text-white transition hover:bg-teal-800 focus:outline-none focus:ring-4 focus:ring-teal-700/15 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {savingInfo ? (
                <FiLoader className="animate-spin" size={17} />
              ) : (
                <FiCheckCircle size={17} />
              )}
              {savingInfo ? "Saving changes…" : "Save profile changes"}
            </button>
          </div>
        </form>

        {/* Change password */}
        <form
          onSubmit={savePw}
          className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-6"
        >
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-700">
              <FiLock size={21} />
            </div>
            <div>
              <h2 className="font-bold text-slate-900">Account security</h2>
              <p className="mt-1 text-xs text-slate-500">
                Update your password regularly.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label
                htmlFor="current-password"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Current password
              </label>
              <input
                id="current-password"
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10"
                type="password"
                autoComplete="current-password"
                required
                value={pw.current}
                onChange={(e) =>
                  setPw((prev) => ({ ...prev, current: e.target.value }))
                }
                placeholder="Enter current password"
              />
            </div>

            <div>
              <label
                htmlFor="new-password"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                New password
              </label>
              <input
                id="new-password"
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10"
                type="password"
                autoComplete="new-password"
                minLength={6}
                required
                value={pw.next}
                onChange={(e) =>
                  setPw((prev) => ({ ...prev, next: e.target.value }))
                }
                placeholder="At least 6 characters"
              />
              <p className="mt-2 text-xs text-slate-400">
                Use at least 6 characters.
              </p>
            </div>

            <button
              type="submit"
              disabled={savingPw || !pw.current || pw.next.length < 6}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700 transition hover:border-teal-200 hover:bg-teal-50 hover:text-teal-800 focus:outline-none focus:ring-4 focus:ring-teal-700/10 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {savingPw ? (
                <FiLoader className="animate-spin" size={17} />
              ) : (
                <FiShield size={17} />
              )}
              {savingPw ? "Updating password…" : "Update password"}
            </button>
          </div>

          <div className="mt-4 flex items-start gap-2 rounded-xl bg-slate-50 p-3">
            <FiShield size={16} className="mt-0.5 shrink-0 text-slate-500" />
            <p className="text-xs leading-5 text-slate-500">
              Your current password is required to make this change.
            </p>
          </div>
        </form>
      </section>
    </div>
  );
}
