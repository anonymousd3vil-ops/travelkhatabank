import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login, clearError } from '../store/authSlice.js';

import {
  FiMapPin,
  FiUser,
  FiLock,
  FiShield,
  FiUsers,
  FiArrowRight,
  FiArrowUpRight,
  FiAlertCircle,
} from 'react-icons/fi';

import { FaPlane } from 'react-icons/fa';

export default function Login({ portal }) {
  const d = useDispatch();
  const nav = useNavigate();
  const { token, loading, error } = useSelector((s) => s.auth);
  const [f, setF] = useState({ username: '', password: '' });
  const isMember = portal === 'member';

  useEffect(() => { d(clearError()); }, [d, portal]);
  useEffect(() => { if (token) nav('/trips', { replace: true }); }, [token, nav]);

  const submit = (e) => { e.preventDefault(); d(login({ ...f, portal })); };

return (
  <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
    {/* Background decoration */}
    <div className="pointer-events-none absolute -left-32 -top-32 h-80 w-80 rounded-full bg-teal-100/70 blur-3xl" />
    <div className="pointer-events-none absolute -bottom-32 -right-24 h-96 w-96 rounded-full bg-emerald-100/70 blur-3xl" />

    <div className="relative grid w-full max-w-5xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl shadow-teal-950/10 lg:grid-cols-2">
      {/* Left branding panel */}
      <div className="relative hidden overflow-hidden bg-linear-to-br from-teal-950 via-teal-800 to-emerald-700 p-10 text-white lg:flex lg:flex-col lg:justify-between xl:p-14">
        <div className="pointer-events-none absolute -right-16 top-24 h-64 w-64 rounded-full border border-white/10" />
        <div className="pointer-events-none absolute -right-4 top-36 h-40 w-40 rounded-full border border-white/10" />
        <div className="pointer-events-none absolute -bottom-24 -left-20 h-72 w-72 rounded-full bg-white/5" />

        <div className="relative">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/15 bg-white/10">
            <FiMapPin className="text-2xl" />
          </div>

          <p className="mt-5 text-sm font-medium uppercase tracking-[0.25em] text-teal-200">
            TravelKhataBank
          </p>
        </div>

        <div className="relative py-12">
          <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10">
            <FaPlane className="text-3xl" />
          </div>

          <h1 className="text-4xl font-bold leading-tight xl:text-5xl">
            Every trip.
            <br />
            Every expense.
            <br />
            <span className="text-teal-200">One place.</span>
          </h1>

          <p className="mt-5 max-w-sm text-sm leading-7 text-teal-100/80">
            Travel together without losing track of money. Manage group
            expenses, keep records organized, and focus on making memories.
          </p>
        </div>

        <div className="relative flex items-center gap-2 border-t border-white/15 pt-5 text-xs text-teal-100/70">
          <FiShield />
          <span>Your group expense management workspace</span>
        </div>
      </div>

      {/* Login panel */}
      <div className="flex min-w-0 flex-col justify-center p-6 sm:p-10 lg:p-12 xl:p-14">
        {/* Mobile branding */}
        <div className="mb-8 flex items-center gap-3 lg:hidden">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-teal-800 text-white shadow-sm">
            <FiMapPin className="text-xl" />
          </div>

          <div className="min-w-0">
            <p className="text-lg font-bold text-teal-900">
              TravelKhataBank
            </p>
            <p className="text-xs text-slate-500">
              Your trips, better organized.
            </p>
          </div>
        </div>

        <div className="mb-8">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-teal-50 px-3 py-1.5 text-xs font-semibold text-teal-800">
            <span className="h-2 w-2 rounded-full bg-teal-600" />
            {isMember ? 'MEMBER PORTAL' : 'MANAGER PORTAL'}
          </div>

          <h2 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Welcome back
          </h2>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            {isMember
              ? 'Sign in to view your trips and stay up to date with group expenses.'
              : 'Sign in to manage trips, track spending, and organize group funds.'}
          </p>
        </div>

        <form onSubmit={submit} className="space-y-5">
          {/* Username */}
          <div>
            <label
              htmlFor="username"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Username
            </label>

            <div className="relative">
              <FiUser className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-lg text-slate-400" />

              <input
                id="username"
                name="username"
                autoComplete="username"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-11 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-teal-600 focus:bg-white focus:ring-4 focus:ring-teal-600/10"
                placeholder="Enter your username"
                required
                value={f.username}
                onChange={(e) =>
                  setF({ ...f, username: e.target.value })
                }
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Password
            </label>

            <div className="relative">
              <FiLock className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-lg text-slate-400" />

              <input
                id="password"
                name="password"
                autoComplete={isMember ? 'current-password' : 'current-password'}
                type="password"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-11 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-teal-600 focus:bg-white focus:ring-4 focus:ring-teal-600/10"
                placeholder="Enter your password"
                required
                value={f.password}
                onChange={(e) =>
                  setF({ ...f, password: e.target.value })
                }
              />
            </div>
          </div>

          {/* Error message */}
          {error && (
            <div
              role="alert"
              className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700"
            >
              <FiAlertCircle className="mt-0.5 shrink-0 text-base" />
              <p>{error}</p>
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            className="group flex w-full items-center justify-center gap-2 rounded-xl bg-teal-800 px-5 py-3.5 text-sm font-semibold text-white shadow-md shadow-teal-900/10 transition hover:bg-teal-900 focus:outline-none focus:ring-4 focus:ring-teal-600/20 disabled:cursor-not-allowed disabled:opacity-60"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                Signing in...
              </>
            ) : (
              <>
                Sign in
                <FiArrowRight className="transition-transform group-hover:translate-x-1" />
              </>
            )}
          </button>
        </form>

        {/* Login links */}
        <div className="mt-7 space-y-4">
          <div className="relative flex items-center">
            <div className="flex-grow border-t border-slate-200" />
            <span className="mx-3 shrink-0 text-xs text-slate-400">
              Other options
            </span>
            <div className="flex-grow border-t border-slate-200" />
          </div>

          <div className="flex flex-col gap-3 text-center text-sm min-[400px]:flex-row min-[400px]:justify-center min-[400px]:gap-5">
            {isMember ? (
              <Link
                to="/login"
                className="inline-flex items-center justify-center gap-1.5 font-medium text-teal-800 transition hover:text-teal-950"
              >
                <FiShield />
                Manager login
              </Link>
            ) : (
              <Link
                to="/member-login"
                className="inline-flex items-center justify-center gap-1.5 font-medium text-teal-800 transition hover:text-teal-950"
              >
                <FiUsers />
                Member login
              </Link>
            )}

            {!isMember && (
              <Link
                to="/register"
                className="inline-flex items-center justify-center gap-1.5 font-medium text-slate-600 transition hover:text-teal-800"
              >
                Create account
                <FiArrowUpRight />
              </Link>
            )}
          </div>
        </div>

        <p className="mt-8 text-center text-xs leading-5 text-slate-400">
          Travel together. Keep expenses clear.
        </p>
      </div>
    </div>
  </div>
);
}
