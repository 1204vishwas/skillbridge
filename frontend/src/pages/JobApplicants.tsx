import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api, { apiError } from '../api/client';
import { Application, ApplicationStatus, User } from '../types';
import Spinner from '../components/Spinner';
import { StatusBadge, Chip } from '../components/Badge';
import { timeAgo } from '../lib/format';

const STATUSES: ApplicationStatus[] = ['Applied', 'Reviewing', 'Shortlisted', 'Rejected', 'Hired'];

export default function JobApplicants() {
  const { id } = useParams();
  const [apps, setApps] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setLoading(true);
    api
      .get(`/applications/job/${id}`)
      .then((res) => setApps(res.data.applications))
      .catch((err) => setError(apiError(err)))
      .finally(() => setLoading(false));
  }, [id]);

  const changeStatus = async (appId: string, status: ApplicationStatus) => {
    const res = await api.patch(`/applications/${appId}/status`, { status });
    setApps((list) => list.map((a) => (a._id === appId ? { ...a, status: res.data.application.status } : a)));
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <Link to="/recruiter" className="text-sm text-brand-600 hover:underline">
        ← Back to dashboard
      </Link>
      <h1 className="mt-3 text-3xl font-bold text-slate-900 dark:text-white">Applicants</h1>
      <p className="mt-1 text-slate-500">
        {loading ? 'Loading…' : `${apps.length} candidate${apps.length === 1 ? '' : 's'} applied`}
      </p>

      {loading ? (
        <Spinner />
      ) : error ? (
        <p className="mt-6 text-red-600">{error}</p>
      ) : apps.length === 0 ? (
        <div className="card mt-6 p-10 text-center">
          <p className="font-medium text-slate-700 dark:text-slate-200">No applicants yet</p>
          <p className="mt-1 text-sm text-slate-500">Share your posting to attract candidates.</p>
        </div>
      ) : (
        <div className="mt-6 space-y-4">
          {apps.map((a) => {
            const applicant = a.applicant as User;
            return (
              <div key={a._id} className="card p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="grid h-11 w-11 place-items-center rounded-full bg-brand-600 font-semibold text-white">
                      {applicant.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-white">{applicant.name}</p>
                      <p className="text-sm text-slate-500">{applicant.email}</p>
                      {applicant.headline && (
                        <p className="text-sm text-slate-500">{applicant.headline}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusBadge status={a.status} />
                    <span className="text-xs text-slate-400">{timeAgo(a.createdAt)}</span>
                  </div>
                </div>

                {(applicant.skills?.length ?? 0) > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {applicant.skills!.map((s) => (
                      <Chip key={s}>{s}</Chip>
                    ))}
                  </div>
                )}

                {a.coverLetter && (
                  <p className="mt-3 rounded-lg bg-slate-50 p-3 text-sm text-slate-600 dark:bg-slate-800/60 dark:text-slate-300">
                    “{a.coverLetter}”
                  </p>
                )}

                <div className="mt-4 flex flex-wrap items-center gap-3">
                  <label className="text-xs font-medium text-slate-500">Update status:</label>
                  <select
                    className="input max-w-[180px] !py-1.5 !text-sm"
                    value={a.status}
                    onChange={(e) => changeStatus(a._id, e.target.value as ApplicationStatus)}
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                  {applicant.resumeUrl && (
                    <a
                      href={applicant.resumeUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sm font-medium text-brand-600 hover:underline"
                    >
                      View résumé
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
