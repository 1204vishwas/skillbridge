import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api, { apiError } from '../api/client';
import { Job } from '../types';
import Spinner from '../components/Spinner';
import { TypeBadge, Chip } from '../components/Badge';
import { useAuth } from '../context/AuthContext';
import { IconMapPin, IconBriefcase, IconCheck, IconBookmark } from '../components/icons';
import { formatSalary, timeAgo } from '../lib/format';

export default function JobDetail() {
  const { id } = useParams();
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [coverLetter, setCoverLetter] = useState('');
  const [applying, setApplying] = useState(false);
  const [applied, setApplied] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    setLoading(true);
    api
      .get(`/jobs/${id}`)
      .then((res) => setJob(res.data.job))
      .catch((err) => setError(apiError(err)))
      .finally(() => setLoading(false));
  }, [id]);

  const saved = !!user?.savedJobs?.includes(id || '');

  const toggleSave = async () => {
    if (!user) return navigate('/login');
    const res = await api.post(`/users/saved/${id}`);
    setUser({ ...user, savedJobs: res.data.savedJobs });
  };

  const apply = async (e: React.FormEvent) => {
    e.preventDefault();
    setApplying(true);
    setMsg('');
    try {
      await api.post('/applications', { jobId: id, coverLetter });
      setApplied(true);
      setMsg('✅ Application submitted! Track it on your dashboard.');
    } catch (err) {
      setMsg(apiError(err));
    } finally {
      setApplying(false);
    }
  };

  if (loading) return <Spinner label="Loading job..." />;
  if (error || !job)
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <p className="text-red-600">{error || 'Job not found'}</p>
        <Link to="/jobs" className="btn-primary mt-4">
          Back to jobs
        </Link>
      </div>
    );

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <Link to="/jobs" className="text-sm text-brand-600 hover:underline">
        ← Back to jobs
      </Link>

      <div className="mt-4 grid gap-6 lg:grid-cols-3">
        {/* Main */}
        <div className="lg:col-span-2">
          <div className="card p-6">
            <div className="flex items-start gap-4">
              <div className="grid h-14 w-14 shrink-0 place-items-center rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-900/40 dark:text-brand-300">
                <IconBriefcase className="h-7 w-7" />
              </div>
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{job.title}</h1>
                <p className="text-slate-500">{job.company}</p>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <TypeBadge type={job.type} />
                  <span className="inline-flex items-center gap-1 text-sm text-slate-500">
                    <IconMapPin className="h-4 w-4" /> {job.location}
                  </span>
                  <span className="text-sm text-slate-400">· Posted {timeAgo(job.createdAt)}</span>
                </div>
              </div>
            </div>

            <hr className="my-5 border-slate-200 dark:border-slate-800" />

            <h2 className="font-semibold text-slate-900 dark:text-white">Job Description</h2>
            <p className="mt-2 whitespace-pre-line text-slate-600 dark:text-slate-300">
              {job.description}
            </p>

            {job.requirements.length > 0 && (
              <>
                <h2 className="mt-6 font-semibold text-slate-900 dark:text-white">Requirements</h2>
                <ul className="mt-2 space-y-1.5">
                  {job.requirements.map((r) => (
                    <li key={r} className="flex items-start gap-2 text-slate-600 dark:text-slate-300">
                      <IconCheck className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" /> {r}
                    </li>
                  ))}
                </ul>
              </>
            )}

            {job.skills.length > 0 && (
              <>
                <h2 className="mt-6 font-semibold text-slate-900 dark:text-white">Skills</h2>
                <div className="mt-2 flex flex-wrap gap-2">
                  {job.skills.map((s) => (
                    <Chip key={s}>{s}</Chip>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <div className="card p-5">
            <p className="text-sm text-slate-500">Salary</p>
            <p className="text-xl font-bold text-slate-900 dark:text-white">
              {formatSalary(job.salaryMin, job.salaryMax)}
            </p>
            <dl className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-slate-500">Experience</dt>
                <dd className="font-medium">{job.experience}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-slate-500">Category</dt>
                <dd className="font-medium">{job.category}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-slate-500">Type</dt>
                <dd className="font-medium">{job.type}</dd>
              </div>
            </dl>

            {user?.role === 'student' && (
              <button onClick={toggleSave} className="btn-secondary mt-4 w-full">
                <IconBookmark className="h-4 w-4" fill={saved ? 'currentColor' : 'none'} />
                {saved ? 'Saved' : 'Save job'}
              </button>
            )}
          </div>

          {/* Apply box */}
          <div className="card p-5">
            <h3 className="font-semibold text-slate-900 dark:text-white">Apply for this role</h3>
            {!user ? (
              <div className="mt-3">
                <p className="text-sm text-slate-500">Log in as a student to apply.</p>
                <Link to="/login" className="btn-primary mt-3 w-full">
                  Login to apply
                </Link>
              </div>
            ) : user.role !== 'student' ? (
              <p className="mt-3 text-sm text-slate-500">
                Only student accounts can apply to jobs.
              </p>
            ) : applied ? (
              <p className="mt-3 rounded-lg bg-emerald-50 p-3 text-sm text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300">
                {msg}
              </p>
            ) : (
              <form onSubmit={apply} className="mt-3 space-y-3">
                <textarea
                  className="input min-h-[96px]"
                  placeholder="Write a short cover letter (optional)"
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                />
                {msg && <p className="text-sm text-red-600">{msg}</p>}
                <button type="submit" className="btn-primary w-full" disabled={applying}>
                  {applying ? 'Submitting...' : 'Submit Application'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
