import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { apiError } from '../api/client';
import { IconLogo } from '../components/icons';
import { Role } from '../types';

const demoAccounts: { label: string; email: string; role: Role }[] = [
  { label: 'Student', email: 'student@skillbridge.dev', role: 'student' },
  { label: 'Recruiter', email: 'recruiter@skillbridge.dev', role: 'recruiter' },
  { label: 'Admin', email: 'admin@skillbridge.dev', role: 'admin' },
];

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string })?.from;

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const redirect = (role: Role) => {
    if (from) return navigate(from, { replace: true });
    navigate(role === 'admin' ? '/admin' : role === 'recruiter' ? '/recruiter' : '/dashboard');
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const u = await login(email, password);
      redirect(u.role);
    } catch (err) {
      setError(apiError(err, 'Login failed'));
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword('password123');
  };

  return (
    <div className="mx-auto flex max-w-md flex-col px-4 py-12">
      <div className="mb-6 flex flex-col items-center text-center">
        <IconLogo className="h-12 w-12 text-brand-600" />
        <h1 className="mt-3 text-2xl font-bold text-slate-900 dark:text-white">Welcome back</h1>
        <p className="text-slate-500">Log in to continue to SkillBridge</p>
      </div>

      <form onSubmit={submit} className="card space-y-4 p-6">
        {error && (
          <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700 dark:bg-red-900/30 dark:text-red-300">
            {error}
          </p>
        )}
        <div>
          <label className="label">Email</label>
          <input
            type="email"
            className="input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
        </div>
        <div>
          <label className="label">Password</label>
          <input
            type="password"
            className="input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
          />
        </div>
        <button type="submit" className="btn-primary w-full" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>

      <div className="card mt-4 p-4">
        <p className="mb-2 text-center text-xs font-medium uppercase tracking-wide text-slate-400">
          Try a demo account (password: password123)
        </p>
        <div className="flex gap-2">
          {demoAccounts.map((d) => (
            <button
              key={d.email}
              onClick={() => fillDemo(d.email)}
              className="btn-secondary flex-1 !py-1.5 !text-xs"
            >
              {d.label}
            </button>
          ))}
        </div>
      </div>

      <p className="mt-6 text-center text-sm text-slate-500">
        Don&apos;t have an account?{' '}
        <Link to="/register" className="font-semibold text-brand-600 hover:underline">
          Sign up
        </Link>
      </p>
    </div>
  );
}
