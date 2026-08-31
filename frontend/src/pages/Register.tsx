import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { apiError } from '../api/client';
import { IconLogo } from '../components/icons';
import { Role } from '../types';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [role, setRole] = useState<Role>('student');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password.length < 6) return setError('Password must be at least 6 characters');
    setLoading(true);
    setError('');
    try {
      const u = await register(form.name, form.email, form.password, role);
      navigate(u.role === 'recruiter' ? '/recruiter' : '/dashboard');
    } catch (err) {
      setError(apiError(err, 'Registration failed'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto flex max-w-md flex-col px-4 py-12">
      <div className="mb-6 flex flex-col items-center text-center">
        <IconLogo className="h-12 w-12 text-brand-600" />
        <h1 className="mt-3 text-2xl font-bold text-slate-900 dark:text-white">Create your account</h1>
        <p className="text-slate-500">Join SkillBridge and kickstart your career</p>
      </div>

      <form onSubmit={submit} className="card space-y-4 p-6">
        {error && (
          <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700 dark:bg-red-900/30 dark:text-red-300">
            {error}
          </p>
        )}

        {/* Role picker */}
        <div>
          <label className="label">I am a</label>
          <div className="grid grid-cols-2 gap-2">
            {(['student', 'recruiter'] as Role[]).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRole(r)}
                className={`rounded-lg border px-3 py-2 text-sm font-medium capitalize transition ${
                  role === r
                    ? 'border-brand-600 bg-brand-50 text-brand-700 dark:bg-brand-900/40 dark:text-brand-300'
                    : 'border-slate-300 text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800'
                }`}
              >
                {r === 'student' ? 'Student / Fresher' : 'Recruiter'}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="label">Full name</label>
          <input className="input" value={form.name} onChange={set('name')} required />
        </div>
        <div>
          <label className="label">Email</label>
          <input type="email" className="input" value={form.email} onChange={set('email')} required autoComplete="email" />
        </div>
        <div>
          <label className="label">Password</label>
          <input
            type="password"
            className="input"
            value={form.password}
            onChange={set('password')}
            required
            minLength={6}
            autoComplete="new-password"
          />
          <p className="mt-1 text-xs text-slate-400">At least 6 characters</p>
        </div>

        <button type="submit" className="btn-primary w-full" disabled={loading}>
          {loading ? 'Creating account...' : 'Create Account'}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-500">
        Already have an account?{' '}
        <Link to="/login" className="font-semibold text-brand-600 hover:underline">
          Log in
        </Link>
      </p>
    </div>
  );
}
