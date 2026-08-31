import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import api, { apiError } from '../api/client';
import { Job, Pagination as PageInfo } from '../types';
import JobCard from '../components/JobCard';
import Pagination from '../components/Pagination';
import Spinner from '../components/Spinner';
import { useAuth } from '../context/AuthContext';
import { IconSearch } from '../components/icons';

const JOB_TYPES = ['Full-time', 'Part-time', 'Internship', 'Contract', 'Remote'];

export default function Jobs() {
  const { user, setUser } = useAuth();
  const [params, setParams] = useSearchParams();

  const [jobs, setJobs] = useState<Job[]>([]);
  const [pageInfo, setPageInfo] = useState<PageInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Local search input mirrors the URL param.
  const [searchInput, setSearchInput] = useState(params.get('search') || '');

  const search = params.get('search') || '';
  const type = params.get('type') || '';
  const location = params.get('location') || '';
  const page = parseInt(params.get('page') || '1', 10);

  const savedSet = useMemo(() => new Set(user?.savedJobs || []), [user]);

  useEffect(() => {
    let active = true;
    setLoading(true);
    const query = new URLSearchParams({ page: String(page), limit: '9' });
    if (search) query.set('search', search);
    if (type) query.set('type', type);
    if (location) query.set('location', location);

    api
      .get(`/jobs?${query.toString()}`)
      .then((res) => {
        if (!active) return;
        setJobs(res.data.jobs);
        setPageInfo(res.data.pagination);
        setError('');
      })
      .catch((err) => active && setError(apiError(err)))
      .finally(() => active && setLoading(false));

    return () => {
      active = false;
    };
  }, [search, type, location, page]);

  const update = (patch: Record<string, string>) => {
    const next = new URLSearchParams(params);
    Object.entries(patch).forEach(([k, v]) => {
      if (v) next.set(k, v);
      else next.delete(k);
    });
    if (!('page' in patch)) next.set('page', '1');
    setParams(next);
  };

  const onSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    update({ search: searchInput });
  };

  const toggleSave = async (jobId: string) => {
    if (!user) return;
    try {
      const res = await api.post(`/users/saved/${jobId}`);
      setUser({ ...user, savedJobs: res.data.savedJobs });
    } catch {
      /* ignore */
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Browse Jobs & Internships</h1>
      <p className="mt-1 text-slate-500">
        {pageInfo ? `${pageInfo.total} opportunities available` : 'Find your next opportunity'}
      </p>

      {/* Filters */}
      <div className="card mt-6 p-4">
        <form onSubmit={onSearchSubmit} className="grid gap-3 md:grid-cols-12">
          <div className="relative md:col-span-5">
            <IconSearch className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              className="input pl-9"
              placeholder="Search title, company or skill..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
          </div>
          <input
            className="input md:col-span-3"
            placeholder="Location"
            defaultValue={location}
            onBlur={(e) => update({ location: e.target.value })}
          />
          <select
            className="input md:col-span-2"
            value={type}
            onChange={(e) => update({ type: e.target.value })}
          >
            <option value="">All types</option>
            {JOB_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
          <button type="submit" className="btn-primary md:col-span-2">
            Search
          </button>
        </form>
        {(search || type || location) && (
          <button
            onClick={() => {
              setSearchInput('');
              setParams(new URLSearchParams());
            }}
            className="mt-2 text-sm text-brand-600 hover:underline"
          >
            Clear filters
          </button>
        )}
      </div>

      {/* Results */}
      {loading ? (
        <Spinner label="Loading jobs..." />
      ) : error ? (
        <p className="mt-10 text-center text-red-600">{error}</p>
      ) : jobs.length === 0 ? (
        <div className="card mt-8 p-12 text-center">
          <p className="text-lg font-medium text-slate-700 dark:text-slate-200">No jobs found</p>
          <p className="mt-1 text-sm text-slate-500">Try adjusting your search or filters.</p>
        </div>
      ) : (
        <>
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {jobs.map((job) => (
              <JobCard
                key={job._id}
                job={job}
                saved={savedSet.has(job._id)}
                onToggleSave={user?.role === 'student' ? toggleSave : undefined}
              />
            ))}
          </div>
          {pageInfo && (
            <Pagination
              page={pageInfo.page}
              pages={pageInfo.pages}
              onChange={(p) => update({ page: String(p) })}
            />
          )}
        </>
      )}
    </div>
  );
}
