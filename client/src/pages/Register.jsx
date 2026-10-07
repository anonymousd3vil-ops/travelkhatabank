
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  FiUser,
  FiPhone,
  FiAtSign,
  FiLock,
  FiEye,
  FiEyeOff,
  FiArrowRight,
  FiMapPin,
  FiShield,
  FiCheckCircle,
  FiAlertCircle,
  FiLoader,
} from 'react-icons/fi';
import { FaPlane } from 'react-icons/fa';

import { register, clearError } from '../store/authSlice.js';

export default function Register() {
  const d = useDispatch();
  const nav = useNavigate();
  const { token, loading, error } = useSelector((s) => s.auth);

  const [f, setF] = useState({
    name: '',
    phone: '',
    username: '',
    password: '',
  });

  const [showPassword, setShowPassword] = useState(false);

  const set = (k) => (e) =>
    setF((prev) => ({ ...prev, [k]: e.target.value }));

  useEffect(() => {
    d(clearError());
  }, [d]);

  useEffect(() => {
    if (token) nav('/trips', { replace: true });
  }, [token, nav]);

  const submit = (e) => {
    e.preventDefault();
    d(clearError());

    const name = f.name.trim();
    const username = f.username.trim();
    const phone = f.phone.trim();

    if (!name || !username) return;

    if (f.password.length < 6) return;

    d(register({
      ...f,
      name,
      username,
      phone,
    }));
  };

  const fields = [
    {
      key: 'name',
      label: 'Full name',
      placeholder: 'Enter your full name',
      icon: FiUser,
      type: 'text',
      autoComplete: 'name',
      required: true,
    },
    {
      key: 'phone',
      label: 'Contact number',
      placeholder: 'Enter your phone number',
      icon: FiPhone,
      type: 'tel',
      autoComplete: 'tel',
      required: false,
    },
    {
      key: 'username',
      label: 'Username',
      placeholder: 'Choose a username',
      icon: FiAtSign,
      type: 'text',
      autoComplete: 'username',
      required: true,
    },
  ];

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-50 px-4 py-8 sm:px-6">
      {/* Background decoration */}
      <div className="pointer-events-none absolute -left-32 -top-32 h-80 w-80 rounded-full bg-teal-200/40 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -right-24 h-96 w-96 rounded-full bg-cyan-200/40 blur-3xl" />

      <div className="relative grid w-full max-w-5xl overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-xl shadow-slate-900/5 lg:grid-cols-2">
        {/* Left branding panel */}
        <div className="relative hidden flex-col justify-between overflow-hidden bg-linear-to-br from-slate-950 via-slate-900 to-teal-950 p-10 text-white lg:flex">
          <div className="pointer-events-none absolute -right-20 top-20 h-72 w-72 rounded-full border border-white/10" />
          <div className="pointer-events-none absolute -right-8 top-32 h-48 w-48 rounded-full border border-white/10" />
          <div className="pointer-events-none absolute -bottom-20 -left-16 h-72 w-72 rounded-full bg-teal-500/10 blur-3xl" />

          <div className="relative">
            <Link to="/login" className="inline-flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-400/15 text-teal-300 ring-1 ring-teal-300/20">
                <FaPlane size={23} />
              </div>
              <div>
                <span className="block text-xl font-extrabold tracking-tight">
                  TravelKhata
                </span>
                <span className="text-xs font-medium tracking-wide text-slate-400">
                  BANK
                </span>
              </div>
            </Link>
          </div>

          <div className="relative my-12">
            <div className="inline-flex items-center gap-2 rounded-full border border-teal-300/20 bg-teal-300/10 px-3 py-2 text-xs font-semibold text-teal-200">
              <FiMapPin size={14} />
              Your next adventure starts here
            </div>

            <h1 className="mt-6 text-4xl font-extrabold leading-tight tracking-tight xl:text-5xl">
              Great trips.
              <br />
              <span className="text-teal-300">Fair expenses.</span>
              <br />
              Zero confusion.
            </h1>

            <p className="mt-5 max-w-sm text-sm leading-7 text-slate-300">
              Bring your travel group together, track shared expenses, and
              make every contribution count — all in one place.
            </p>

            <div className="mt-8 space-y-4">
              {[
                'Manage group travel expenses',
                'Split costs among your friends',
                'Keep your trip ledger organised',
              ].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-teal-400/15 text-teal-300">
                    <FiCheckCircle size={15} />
                  </span>
                  <span className="text-sm text-slate-200">{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="relative flex items-center gap-2 border-t border-white/10 pt-5 text-xs text-slate-400">
            <FiShield size={15} className="text-teal-300" />
            Your trips and expenses, organised in one place.
          </div>
        </div>

        {/* Registration form */}
        <div className="p-6 sm:p-9 lg:p-10">
          {/* Mobile brand */}
          <Link to="/login" className="mb-8 inline-flex items-center gap-3 lg:hidden">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal-700 text-white">
              <FaPlane size={20} />
            </div>
            <div>
              <span className="block text-lg font-extrabold text-slate-900">
                TravelKhata
              </span>
              <span className="text-xs font-medium tracking-widest text-teal-700">
                BANK
              </span>
            </div>
          </Link>

          <div className="mb-7">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-50 text-teal-700">
              <FiUser size={24} />
            </div>

            <p className="text-xs font-bold uppercase tracking-[0.18em] text-teal-700">
              Get started for free
            </p>

            <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
              Create your account
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Set up your account to start managing trip finances.
            </p>
          </div>

          <form onSubmit={submit} className="space-y-4">
            {fields.map((field) => {
              const Icon = field.icon;

              return (
                <div key={field.key}>
                  <label
                    htmlFor={field.key}
                    className="mb-2 block text-sm font-semibold text-slate-700"
                  >
                    {field.label}
                    {!field.required && (
                      <span className="ml-1 font-normal text-slate-400">
                        (optional)
                      </span>
                    )}
                  </label>

                  <div className="relative">
                    <Icon
                      size={18}
                      className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      id={field.key}
                      name={field.key}
                      type={field.type}
                      autoComplete={field.autoComplete}
                      required={field.required}
                      maxLength={field.key === 'name' ? 100 : 50}
                      value={f[field.key]}
                      onChange={set(field.key)}
                      placeholder={field.placeholder}
                      className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10"
                    />
                  </div>
                </div>
              );
            })}

            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Password
              </label>

              <div className="relative">
                <FiLock
                  size={18}
                  className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  minLength={6}
                  maxLength={128}
                  required
                  value={f.password}
                  onChange={set('password')}
                  placeholder="Create a password"
                  className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-11 pr-12 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10"
                />

                <button
                  type="button"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                >
                  {showPassword ? (
                    <FiEyeOff size={18} />
                  ) : (
                    <FiEye size={18} />
                  )}
                </button>
              </div>

              <p className="mt-2 flex items-center gap-1.5 text-xs text-slate-400">
                <FiShield size={13} />
                Use at least 6 characters.
              </p>
            </div>

            {error && (
              <div
                role="alert"
                className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700"
              >
                <FiAlertCircle size={17} className="mt-0.5 shrink-0" />
                <p className="min-w-0 break-words">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="group flex w-full items-center justify-center gap-2 rounded-xl bg-teal-700 px-5 py-3.5 text-sm font-bold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-teal-800 hover:shadow-md focus:outline-none focus:ring-4 focus:ring-teal-700/20 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
            >
              {loading ? (
                <>
                  <FiLoader className="animate-spin" size={18} />
                  Creating account…
                </>
              ) : (
                <>
                  Create account
                  <FiArrowRight
                    size={18}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </>
              )}
            </button>
          </form>

          <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-slate-200" />
            <span className="text-xs text-slate-400">ALREADY REGISTERED?</span>
            <div className="h-px flex-1 bg-slate-200" />
          </div>

          <Link
            to="/login"
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-bold text-slate-700 transition hover:border-teal-200 hover:bg-teal-50 hover:text-teal-800"
          >
            Sign in to your account
            <FiArrowRight size={16} />
          </Link>

          <p className="mt-6 text-center text-xs leading-5 text-slate-400">
            By creating an account, you can organise your group trip expenses
            and keep your travel finances together.
          </p>
        </div>
      </div>
    </div>
  );
}
