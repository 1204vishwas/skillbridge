import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api, { apiError } from '../api/client';
import { Job } from '../types';
import JobCard from '../components/JobCard';
import Spinner from '../components/Spinner';
import { useAuth } from '../context/AuthContext';

export default function SavedJobs() {
  const { user, setUser } = useAuth();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = () => {
    setLoading(true);
    api
      .get('/users/saved')
      .then((res) => setJobs(res.data.jobs))
      .catch((err) => setError(apiError(err)))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const toggleSave = async (jobId: string) => {
    const res = await api.post(`/users/saved/${jobId}`);
    if (user) setUser({ ...user, savedJobs: res.data.savedJobs });
    setJobs((j) => j.filter((x) => x._id !== jobId));
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Saved Jobs</h1>
      <p className="mt-1 text-slate-500">Opportunities you bookmarked for later</p>

      {loading ? (
        <Spinner />
      ) : error ? (
        <p className="mt-6 text-red-600">{error}</p>
      ) : jobs.length === 0 ? (
        <div className="card mt-6 p-10 text-center">
          <p className="font-medium text-slate-700 dark:text-slate-200">No saved jobs yet</p>
          <p className="mt-1 text-sm text-slate-500">Tap the bookmark icon on any job to save it.</p>
          <Link to="/jobs" className="btn-primary mt-4">
            Browse Jobs
          </Link>
        </div>
      ) : (
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {jobs.map((job) => (
            <JobCard key={job._id} job={job} saved onToggleSave={toggleSave} />
          ))}
        </div>
      )}
    </div>
  );
}
