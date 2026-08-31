import { ReactNode } from 'react';
import { ApplicationStatus } from '../types';

const typeColors: Record<string, string> = {
  'Full-time': 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
  'Part-time': 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
  Internship: 'bg-brand-100 text-brand-700 dark:bg-brand-900/40 dark:text-brand-300',
  Contract: 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300',
  Remote: 'bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300',
};

export function TypeBadge({ type }: { type: string }) {
  return (
    <span className={`badge ${typeColors[type] || 'bg-slate-100 text-slate-600'}`}>{type}</span>
  );
}

const statusColors: Record<ApplicationStatus, string> = {
  Applied: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
  Reviewing: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
  Shortlisted: 'bg-brand-100 text-brand-700 dark:bg-brand-900/40 dark:text-brand-300',
  Rejected: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300',
  Hired: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
};

export function StatusBadge({ status }: { status: ApplicationStatus }) {
  return <span className={`badge ${statusColors[status]}`}>{status}</span>;
}

export function Chip({ children }: { children: ReactNode }) {
  return (
    <span className="badge bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
      {children}
    </span>
  );
}
