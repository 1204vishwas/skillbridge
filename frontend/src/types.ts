export type Role = 'student' | 'recruiter' | 'admin';

export interface User {
  _id: string;
  name: string;
  email: string;
  role: Role;
  headline?: string;
  bio?: string;
  location?: string;
  skills?: string[];
  resumeUrl?: string;
  savedJobs?: string[];
  createdAt?: string;
}

export type JobType = 'Full-time' | 'Part-time' | 'Internship' | 'Contract' | 'Remote';

export interface Job {
  _id: string;
  title: string;
  company: string;
  location: string;
  type: JobType;
  category: string;
  description: string;
  requirements: string[];
  skills: string[];
  salaryMin: number;
  salaryMax: number;
  experience: string;
  postedBy: { _id: string; name: string; email?: string } | string;
  isActive: boolean;
  createdAt: string;
}

export type ApplicationStatus = 'Applied' | 'Reviewing' | 'Shortlisted' | 'Rejected' | 'Hired';

export interface Application {
  _id: string;
  job: Job;
  applicant: User | string;
  status: ApplicationStatus;
  coverLetter: string;
  resumeUrl: string;
  createdAt: string;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}
