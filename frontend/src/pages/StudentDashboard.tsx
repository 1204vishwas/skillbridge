import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api, { apiError } from '../api/client';
import { Application } from '../types';
import Spinner from '../components/Spinner';
import { StatusBadge } from '../components/Badge';
import { useAuth } from '../context/AuthContext';
import { timeAgo } from '../lib/format';
import { IconBriefcase, IconChart, IconBookmark, IconCheck } from '../components/icons';

export default function StudentDashboard() {
  const { user } = useAuth();
  const [apps, setApps] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = () => {
    setLoading(true);
    api
      .get('/applications/mine')
      .then((res) => setApps(res.data.applications))
      .catch((err) => setError(apiError(err)))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const withdraw = async (id: string) => {
    await api.delete(`/applications/${id}`);
    setApps((a) => a.filter((x) => x._id !== id));
  };

  const stats = [
    { label: 'Applications', value: apps.length, icon: IconBriefcase },
    { label: 'In Review', value: apps.filter((a) => a.status === 'Reviewing').length, icon: IconChart },
    { label: 'Shortlisted', value: apps.filter((a) => a.status === 'Shortlisted').length, icon: IconCheck },
    { label: 'Saved Jobs', value: user?.savedJobs?.length || 0, icon: IconBookmark },
  ];

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
            Hi, {user?.name.split(' ')[0]} 👋
          </h1>
          <p className="text-slate-500">Track your applications and saved jobs</p>
        </div>
        <Link to="/jobs" className="btn-primary">
          Find more jobs
        </Link>
      </div>

      {/* Stats */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="card flex items-center gap-4 p-5">
            <div className="grid h-12 w-12 place-items-center rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-900/40 dark:text-brand-300">
              <s.icon className="h-6 w-6" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">{s.value}</p>
              <p className="text-sm text-slate-500">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Applications */}
      <h2 className="mt-10 text-xl font-bold text-slate-900 dark:text-white">My Applications</h2>
      {loading ? (
        <Spinner />
      ) : error ? (
        <p className="mt-4 text-red-600">{error}</p>
      ) : apps.length === 0 ? (
        <div className="card mt-4 p-10 text-center">
          <p className="font-medium text-slate-700 dark:text-slate-200">No applications yet</p>
          <p className="mt-1 text-sm text-slate-500">Browse jobs and apply to get started.</p>
          <Link to="/jobs" className="btn-primary mt-4">
            Browse Jobs
          </Link>
        </div>
      ) : (
        <div className="card mt-4 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500 dark:border-slate-800 dark:bg-slate-900/50">
                <tr>
                  <th className="px-5 py-3">Job</th>
                  <th className="px-5 py-3">Company</th>
                  <th className="px-5 py-3">Applied</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {apps.map((a) => (
                  <tr key={a._id} className="hover:bg-slate-50 dark:hover:bg-slate-900/40">
                    <td className="px-5 py-3 font-medium">
                      {a.job ? (
                        <Link to={`/jobs/${a.job._id}`} className="hover:text-brand-600">
                          {a.job.title}
                        </Link>
                      ) : (
                        <span className="text-slate-400">Removed</span>
                      )}
                    </td>
                    <td className="px-5 py-3 text-slate-500">{a.job?.company || '—'}</td>
                    <td className="px-5 py-3 text-slate-500">{timeAgo(a.createdAt)}</td>
                    <td className="px-5 py-3">
                      <StatusBadge status={a.status} />
                    </td>
                    <td className="px-5 py-3 text-right">
                      <button
                        onClick={() => withdraw(a._id)}
                        className="text-xs font-medium text-red-600 hover:underline"
                      >
                        Withdraw
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
