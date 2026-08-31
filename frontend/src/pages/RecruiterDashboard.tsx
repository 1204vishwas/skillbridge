import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api, { apiError } from '../api/client';
import { Job } from '../types';
import Spinner from '../components/Spinner';
import { TypeBadge } from '../components/Badge';
import { IconPlus, IconBriefcase } from '../components/icons';
import { timeAgo } from '../lib/format';

export default function RecruiterDashboard() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = () => {
    setLoading(true);
    api
      .get('/jobs/mine/list')
      .then((res) => setJobs(res.data.jobs))
      .catch((err) => setError(apiError(err)))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const remove = async (id: string) => {
    if (!confirm('Delete this job and all its applications?')) return;
    await api.delete(`/jobs/${id}`);
    setJobs((j) => j.filter((x) => x._id !== id));
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Recruiter Dashboard</h1>
          <p className="text-slate-500">Manage your job postings and applicants</p>
        </div>
        <Link to="/recruiter/post" className="btn-primary">
          <IconPlus className="h-4 w-4" /> Post a Job
        </Link>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <div className="card flex items-center gap-4 p-5">
          <div className="grid h-12 w-12 place-items-center rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-900/40 dark:text-brand-300">
            <IconBriefcase className="h-6 w-6" />
          </div>
          <div>
            <p className="text-2xl font-bold">{jobs.length}</p>
            <p className="text-sm text-slate-500">Total Postings</p>
          </div>
        </div>
        <div className="card flex items-center gap-4 p-5">
          <div className="grid h-12 w-12 place-items-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-300">
            <IconBriefcase className="h-6 w-6" />
          </div>
          <div>
            <p className="text-2xl font-bold">{jobs.filter((j) => j.isActive).length}</p>
            <p className="text-sm text-slate-500">Active</p>
          </div>
        </div>
      </div>

      <h2 className="mt-10 text-xl font-bold text-slate-900 dark:text-white">Your Job Postings</h2>
      {loading ? (
        <Spinner />
      ) : error ? (
        <p className="mt-4 text-red-600">{error}</p>
      ) : jobs.length === 0 ? (
        <div className="card mt-4 p-10 text-center">
          <p className="font-medium text-slate-700 dark:text-slate-200">No jobs posted yet</p>
          <Link to="/recruiter/post" className="btn-primary mt-4">
            Post your first job
          </Link>
        </div>
      ) : (
        <div className="mt-4 space-y-3">
          {jobs.map((job) => (
            <div
              key={job._id}
              className="card flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <div className="flex items-center gap-2">
                  <Link to={`/jobs/${job._id}`} className="font-semibold hover:text-brand-600">
                    {job.title}
                  </Link>
                  <TypeBadge type={job.type} />
                </div>
                <p className="text-sm text-slate-500">
                  {job.company} · {job.location} · posted {timeAgo(job.createdAt)}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Link
                  to={`/recruiter/jobs/${job._id}/applicants`}
                  className="btn-primary !py-1.5 !text-xs"
                >
                  View Applicants
                </Link>
                <Link
                  to={`/recruiter/edit/${job._id}`}
                  className="btn-secondary !py-1.5 !text-xs"
                >
                  Edit
                </Link>
                <button onClick={() => remove(job._id)} className="btn-danger !py-1.5 !text-xs">
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
