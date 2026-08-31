import { useEffect, useState } from 'react';
import api, { apiError } from '../api/client';
import { User } from '../types';
import Spinner from '../components/Spinner';
import { IconUser, IconBriefcase, IconChart } from '../components/icons';
import { timeAgo } from '../lib/format';

interface Stats {
  totals: {
    users: number;
    students: number;
    recruiters: number;
    jobs: number;
    activeJobs: number;
    applications: number;
  };
  applicationsByStatus: { _id: string; count: number }[];
  jobsByType: { _id: string; count: number }[];
  recentApplications: {
    _id: string;
    status: string;
    createdAt: string;
    applicant?: { name: string };
    job?: { title: string; company: string };
  }[];
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = () => {
    setLoading(true);
    Promise.all([api.get('/admin/stats'), api.get('/admin/users')])
      .then(([s, u]) => {
        setStats(s.data);
        setUsers(u.data.users);
      })
      .catch((err) => setError(apiError(err)))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const deleteUser = async (uid: string) => {
    if (!confirm('Delete this user and all their data?')) return;
    await api.delete(`/admin/users/${uid}`);
    setUsers((list) => list.filter((u) => u._id !== uid));
  };

  if (loading) return <Spinner label="Loading admin dashboard..." />;
  if (error) return <p className="mx-auto max-w-3xl px-4 py-16 text-center text-red-600">{error}</p>;
  if (!stats) return null;

  const cards = [
    { label: 'Total Users', value: stats.totals.users, icon: IconUser, sub: `${stats.totals.students} students · ${stats.totals.recruiters} recruiters` },
    { label: 'Total Jobs', value: stats.totals.jobs, icon: IconBriefcase, sub: `${stats.totals.activeJobs} active` },
    { label: 'Applications', value: stats.totals.applications, icon: IconChart, sub: 'across all jobs' },
  ];

  const maxStatus = Math.max(1, ...stats.applicationsByStatus.map((s) => s.count));

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Admin Dashboard</h1>
      <p className="mt-1 text-slate-500">Platform analytics and user management</p>

      {/* KPI cards */}
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        {cards.map((c) => (
          <div key={c.label} className="card p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-500">{c.label}</p>
              <c.icon className="h-5 w-5 text-brand-600" />
            </div>
            <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">{c.value}</p>
            <p className="mt-1 text-xs text-slate-400">{c.sub}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <div className="card p-6">
          <h2 className="font-semibold text-slate-900 dark:text-white">Applications by Status</h2>
          <div className="mt-4 space-y-3">
            {stats.applicationsByStatus.length === 0 && (
              <p className="text-sm text-slate-400">No applications yet.</p>
            )}
            {stats.applicationsByStatus.map((s) => (
              <div key={s._id}>
                <div className="mb-1 flex justify-between text-sm">
                  <span className="text-slate-600 dark:text-slate-300">{s._id}</span>
                  <span className="font-medium">{s.count}</span>
                </div>
                <div className="h-2 rounded-full bg-slate-100 dark:bg-slate-800">
                  <div
                    className="h-2 rounded-full bg-brand-600"
                    style={{ width: `${(s.count / maxStatus) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card p-6">
          <h2 className="font-semibold text-slate-900 dark:text-white">Jobs by Type</h2>
          <div className="mt-4 flex flex-wrap gap-3">
            {stats.jobsByType.map((t) => (
              <div key={t._id} className="rounded-xl border border-slate-200 px-4 py-3 dark:border-slate-800">
                <p className="text-2xl font-bold text-brand-600">{t.count}</p>
                <p className="text-xs text-slate-500">{t._id}</p>
              </div>
            ))}
          </div>

          <h3 className="mt-6 text-sm font-semibold text-slate-700 dark:text-slate-300">
            Recent Applications
          </h3>
          <ul className="mt-2 space-y-2 text-sm">
            {stats.recentApplications.map((a) => (
              <li key={a._id} className="flex items-center justify-between">
                <span className="text-slate-600 dark:text-slate-300">
                  <span className="font-medium">{a.applicant?.name || 'User'}</span> →{' '}
                  {a.job?.title || 'job'}
                </span>
                <span className="text-xs text-slate-400">{timeAgo(a.createdAt)}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Users table */}
      <h2 className="mt-10 text-xl font-bold text-slate-900 dark:text-white">Users</h2>
      <div className="card mt-4 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500 dark:border-slate-800 dark:bg-slate-900/50">
              <tr>
                <th className="px-5 py-3">Name</th>
                <th className="px-5 py-3">Email</th>
                <th className="px-5 py-3">Role</th>
                <th className="px-5 py-3">Joined</th>
                <th className="px-5 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {users.map((u) => (
                <tr key={u._id} className="hover:bg-slate-50 dark:hover:bg-slate-900/40">
                  <td className="px-5 py-3 font-medium">{u.name}</td>
                  <td className="px-5 py-3 text-slate-500">{u.email}</td>
                  <td className="px-5 py-3">
                    <span className="badge bg-slate-100 capitalize text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                      {u.role}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-slate-500">{u.createdAt ? timeAgo(u.createdAt) : '—'}</td>
                  <td className="px-5 py-3 text-right">
                    {u.role !== 'admin' && (
                      <button
                        onClick={() => deleteUser(u._id)}
                        className="text-xs font-medium text-red-600 hover:underline"
                      >
                        Delete
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
