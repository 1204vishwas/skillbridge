import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/client';
import { Job } from '../types';
import JobCard from '../components/JobCard';
import { useAuth } from '../context/AuthContext';
import {
  IconSearch,
  IconBriefcase,
  IconChart,
  IconBookmark,
  IconUser,
  IconCheck,
} from '../components/icons';

const features = [
  { icon: IconUser, title: 'JWT Authentication', desc: 'Secure sign-up & login with role-based access for students and recruiters.' },
  { icon: IconBriefcase, title: 'Job & Internship Listings', desc: 'Browse curated roles with powerful search, filters and pagination.' },
  { icon: IconChart, title: 'Application Tracking', desc: 'Track every application from “Applied” to “Hired” on your dashboard.' },
  { icon: IconBookmark, title: 'Save & Manage Profile', desc: 'Bookmark opportunities and manage your resume and profile in one place.' },
];

export default function Home() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState<Job[]>([]);

  useEffect(() => {
    api.get('/jobs?limit=3').then((res) => setJobs(res.data.jobs)).catch(() => {});
  }, []);

  const dashPath =
    user?.role === 'admin' ? '/admin' : user?.role === 'recruiter' ? '/recruiter' : '/dashboard';

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-brand-50 to-transparent dark:from-brand-950/30" />
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:py-28">
          <div className="mx-auto max-w-3xl text-center">
            <span className="badge mb-4 bg-brand-100 text-brand-700 dark:bg-brand-900/40 dark:text-brand-300">
              🚀 Your career starts here
            </span>
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl dark:text-white">
              Explore jobs. Track applications.
              <span className="block text-brand-600">Build your career.</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-600 dark:text-slate-300">
              SkillBridge is a full-stack career platform where students and freshers find
              internships, jobs and learning opportunities — all in one organised, personalised
              dashboard.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link to="/jobs" className="btn-primary !px-6 !py-3 text-base">
                <IconSearch className="h-5 w-5" /> Browse Jobs
              </Link>
              {user ? (
                <Link to={dashPath} className="btn-secondary !px-6 !py-3 text-base">
                  Go to Dashboard
                </Link>
              ) : (
                <Link to="/register" className="btn-secondary !px-6 !py-3 text-base">
                  Create Free Account
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f) => (
            <div key={f.title} className="card p-6">
              <div className="grid h-12 w-12 place-items-center rounded-xl bg-brand-600 text-white">
                <f.icon className="h-6 w-6" />
              </div>
              <h3 className="mt-4 font-semibold text-slate-900 dark:text-white">{f.title}</h3>
              <p className="mt-1.5 text-sm text-slate-600 dark:text-slate-400">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Latest jobs */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Latest Openings</h2>
            <p className="text-slate-500">Fresh opportunities added by recruiters</p>
          </div>
          <Link to="/jobs" className="text-sm font-semibold text-brand-600 hover:underline">
            View all →
          </Link>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {jobs.map((job) => (
            <JobCard key={job._id} job={job} />
          ))}
        </div>
      </section>

      {/* CTA banner */}
      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6">
        <div className="card overflow-hidden bg-brand-600 p-8 text-white sm:p-12">
          <div className="grid gap-6 md:grid-cols-2 md:items-center">
            <div>
              <h2 className="text-2xl font-bold sm:text-3xl">Are you hiring?</h2>
              <p className="mt-2 text-brand-100">
                Post jobs and internships, review applicants and manage your hiring pipeline with
                SkillBridge for recruiters.
              </p>
            </div>
            <ul className="grid gap-2 text-sm">
              {['Post unlimited jobs', 'Review & shortlist applicants', 'Role-based recruiter dashboard'].map(
                (t) => (
                  <li key={t} className="flex items-center gap-2">
                    <IconCheck className="h-5 w-5 text-white" /> {t}
                  </li>
                )
              )}
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
