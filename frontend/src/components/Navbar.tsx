import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import {
  IconSun,
  IconMoon,
  IconLogo,
  IconMenu,
  IconX,
  IconLogout,
} from './icons';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { theme, toggle } = useTheme();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setOpen(false);
  };

  // Role-aware dashboard link.
  const dashboardPath =
    user?.role === 'admin'
      ? '/admin'
      : user?.role === 'recruiter'
        ? '/recruiter'
        : '/dashboard';

  const links = [
    { to: '/jobs', label: 'Browse Jobs' },
    ...(user ? [{ to: dashboardPath, label: 'Dashboard' }] : []),
    ...(user?.role === 'student' ? [{ to: '/saved', label: 'Saved' }] : []),
  ];

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `rounded-lg px-3 py-2 text-sm font-medium transition ${
      isActive
        ? 'bg-brand-50 text-brand-700 dark:bg-brand-900/40 dark:text-brand-300'
        : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
    }`;

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/80 backdrop-blur dark:border-slate-800 dark:bg-slate-950/80">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        <Link to="/" className="flex items-center gap-2">
          <IconLogo className="h-8 w-8 text-brand-600" />
          <span className="text-lg font-extrabold tracking-tight">
            Skill<span className="text-brand-600">Bridge</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} className={linkClass}>
              {l.label}
            </NavLink>
          ))}
        </div>

        <div className="hidden items-center gap-2 md:flex">
          <button
            onClick={toggle}
            className="btn-ghost !px-2"
            aria-label="Toggle theme"
            title="Toggle dark mode"
          >
            {theme === 'dark' ? <IconSun className="h-5 w-5" /> : <IconMoon className="h-5 w-5" />}
          </button>
          {user ? (
            <div className="flex items-center gap-2">
              <Link to="/profile" className="flex items-center gap-2 rounded-lg px-2 py-1 hover:bg-slate-100 dark:hover:bg-slate-800">
                <span className="grid h-8 w-8 place-items-center rounded-full bg-brand-600 text-sm font-semibold text-white">
                  {user.name.charAt(0).toUpperCase()}
                </span>
                <span className="text-sm font-medium">{user.name.split(' ')[0]}</span>
              </Link>
              <button onClick={handleLogout} className="btn-ghost !px-2" title="Logout">
                <IconLogout className="h-5 w-5" />
              </button>
            </div>
          ) : (
            <>
              <Link to="/login" className="btn-secondary">
                Login
              </Link>
              <Link to="/register" className="btn-primary">
                Sign Up
              </Link>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <div className="flex items-center gap-1 md:hidden">
          <button onClick={toggle} className="btn-ghost !px-2" aria-label="Toggle theme">
            {theme === 'dark' ? <IconSun className="h-5 w-5" /> : <IconMoon className="h-5 w-5" />}
          </button>
          <button onClick={() => setOpen((o) => !o)} className="btn-ghost !px-2" aria-label="Menu">
            {open ? <IconX className="h-6 w-6" /> : <IconMenu className="h-6 w-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div className="border-t border-slate-200 px-4 py-3 md:hidden dark:border-slate-800">
          <div className="flex flex-col gap-1">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                className={linkClass}
                onClick={() => setOpen(false)}
              >
                {l.label}
              </NavLink>
            ))}
            <div className="my-2 h-px bg-slate-200 dark:bg-slate-800" />
            {user ? (
              <>
                <NavLink to="/profile" className={linkClass} onClick={() => setOpen(false)}>
                  My Profile
                </NavLink>
                <button onClick={handleLogout} className="btn-secondary mt-1 justify-start">
                  Logout
                </button>
              </>
            ) : (
              <div className="flex gap-2">
                <Link to="/login" className="btn-secondary flex-1" onClick={() => setOpen(false)}>
                  Login
                </Link>
                <Link to="/register" className="btn-primary flex-1" onClick={() => setOpen(false)}>
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
