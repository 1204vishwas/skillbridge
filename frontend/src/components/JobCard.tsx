import { Link } from 'react-router-dom';
import { Job } from '../types';
import { TypeBadge, Chip } from './Badge';
import { IconMapPin, IconBookmark, IconBriefcase } from './icons';
import { formatSalary, timeAgo } from '../lib/format';

interface Props {
  job: Job;
  saved?: boolean;
  onToggleSave?: (id: string) => void;
}

export default function JobCard({ job, saved, onToggleSave }: Props) {
  return (
    <div className="card group flex h-full flex-col p-5 transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="grid h-11 w-11 place-items-center rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-900/40 dark:text-brand-300">
            <IconBriefcase className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-semibold leading-tight text-slate-900 group-hover:text-brand-600 dark:text-white">
              {job.title}
            </h3>
            <p className="text-sm text-slate-500">{job.company}</p>
          </div>
        </div>
        {onToggleSave && (
          <button
            onClick={() => onToggleSave(job._id)}
            className={`rounded-lg p-1.5 transition ${
              saved
                ? 'text-brand-600'
                : 'text-slate-400 hover:bg-slate-100 hover:text-brand-600 dark:hover:bg-slate-800'
            }`}
            aria-label={saved ? 'Unsave job' : 'Save job'}
          >
            <IconBookmark className="h-5 w-5" fill={saved ? 'currentColor' : 'none'} />
          </button>
        )}
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <TypeBadge type={job.type} />
        <span className="inline-flex items-center gap-1 text-xs text-slate-500">
          <IconMapPin className="h-3.5 w-3.5" /> {job.location}
        </span>
      </div>

      <p className="mt-3 line-clamp-2 text-sm text-slate-600 dark:text-slate-400">
        {job.description}
      </p>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {job.skills.slice(0, 3).map((s) => (
          <Chip key={s}>{s}</Chip>
        ))}
      </div>

      <div className="mt-auto flex items-center justify-between pt-4">
        <div>
          <p className="text-sm font-semibold text-slate-900 dark:text-white">
            {formatSalary(job.salaryMin, job.salaryMax)}
          </p>
          <p className="text-xs text-slate-400">{timeAgo(job.createdAt)}</p>
        </div>
        <Link to={`/jobs/${job._id}`} className="btn-primary !py-1.5">
          View
        </Link>
      </div>
    </div>
  );
}
