import { useState } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  FiLogOut,
  FiMap,
  FiBook,
  FiMenu,
  FiX,
  FiUser,
  FiChevronRight,
  FiCompass,
} from 'react-icons/fi';
import { FaPlane } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { logout } from '../store/authSlice.js';

const navItems = [
  { to: '/trips', label: 'Trips', icon: FiMap },
  { to: '/personal', label: 'My Expenses', icon: FiBook },
];

const navLinkClass = ({ isActive }) =>
  `flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm transition-all duration-200 ${
    isActive
      ? 'bg-teal-50 font-semibold text-teal-800'
      : 'text-slate-600 hover:bg-slate-50 hover:text-teal-800'
  }`;

export default function Layout() {
  const d = useDispatch();
  const nav = useNavigate();
  const user = useSelector((s) => s.auth.user);
  const [menuOpen, setMenuOpen] = useState(false);

  const out = () => {
    d(logout());
    setMenuOpen(false);
    toast.success('Logged out');
    nav('/login');
  };

  const closeMenu = () => setMenuOpen(false);

  const initial = user?.name?.trim()?.[0]?.toUpperCase() || 'U';

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      {/* Top navigation */}
      <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/95 shadow-sm backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
          {/* Brand */}
          <Link
            to="/trips"
            onClick={closeMenu}
            className="group flex min-w-0 items-center gap-2.5"
          >
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-teal-800 to-emerald-600 text-white shadow-sm transition-transform group-hover:scale-105">
              <FaPlane className="text-lg" />
            </span>

            <span className="min-w-0">
              <span className="block truncate text-base font-extrabold tracking-tight text-teal-950 sm:text-lg">
                TravelKhataBank
              </span>
              <span className="hidden text-[10px] font-medium uppercase tracking-[0.16em] text-slate-400 min-[420px]:block">
                Travel. Track. Together.
              </span>
            </span>
          </Link>

          {/* Desktop navigation */}
          <nav
            aria-label="Main navigation"
            className="hidden items-center gap-1 md:flex"
          >
            {navItems.map(({ to, label, icon: Icon }) => (
              <NavLink key={to} to={to} className={navLinkClass}>
                <Icon className="text-base" />
                {label}
              </NavLink>
            ))}
          </nav>

          {/* Account actions */}
          <div className="flex shrink-0 items-center gap-2">
            <Link
              to="/profile"
              aria-label="View profile"
              title="Your profile"
              className="group flex items-center gap-2 rounded-xl p-1.5 transition hover:bg-slate-50"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-linear-to-br from-teal-700 to-emerald-500 text-sm font-bold text-white ring-2 ring-teal-50 transition group-hover:ring-teal-200">
                {initial}
              </span>

              <span className="hidden max-w-28 text-left lg:block">
                <span className="block truncate text-sm font-semibold text-slate-800">
                  {user?.name || 'My account'}
                </span>
                <span className="block text-xs text-slate-500">
                  View profile
                </span>
              </span>
            </Link>

            <button
              type="button"
              onClick={out}
              aria-label="Log out"
              title="Log out"
              className="hidden h-9 w-9 items-center justify-center rounded-xl text-slate-500 transition hover:bg-red-50 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-red-200 sm:flex"
            >
              <FiLogOut className="text-lg" />
            </button>

            {/* Mobile menu toggle */}
            <button
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={menuOpen}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-700 transition hover:bg-slate-50 md:hidden"
            >
              {menuOpen ? (
                <FiX className="text-xl" />
              ) : (
                <FiMenu className="text-xl" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile navigation panel */}
        {menuOpen && (
          <div className="border-t border-slate-100 bg-white px-4 py-4 shadow-lg md:hidden sm:px-6">
            <div className="mb-3 flex items-center gap-2 px-3 py-2">
              <FiCompass className="text-teal-700" />
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Navigate
              </span>
            </div>

            <nav aria-label="Mobile navigation" className="space-y-1">
              {navItems.map(({ to, label, icon: Icon }) => (
                <NavLink
                  key={to}
                  to={to}
                  onClick={closeMenu}
                  className={navLinkClass}
                >
                  <Icon className="text-lg" />
                  <span className="flex-1">{label}</span>
                  <FiChevronRight className="text-slate-400" />
                </NavLink>
              ))}

              <NavLink
                to="/profile"
                onClick={closeMenu}
                className={navLinkClass}
              >
                <FiUser className="text-lg" />
                <span className="flex-1">My Profile</span>
                <FiChevronRight className="text-slate-400" />
              </NavLink>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={out}
                  className="flex w-full items-center gap-2 rounded-xl px-3 py-3 text-sm font-medium text-red-600 transition hover:bg-red-50"
                >
                  <FiLogOut className="text-lg" />
                  Log out
                </button>
              </div>
            </nav>
          </div>
        )}
      </header>

      {/* Page content */}
      <main className="mx-auto w-full max-w-7xl min-w-0 flex-1 px-4 py-5 sm:px-6 sm:py-7 lg:px-8">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-4 text-center sm:flex-row sm:px-6 sm:text-left lg:px-8">
          <p className="text-xs text-slate-500">
            <span className="font-semibold text-teal-800">
              TravelKhataBank
            </span>
            {' '}· Make every trip count.
          </p>

          <p className="text-xs text-slate-400">
            Your journeys, organized in one place.
          </p>
        </div>
      </footer>
    </div>
  );
}
