import type { Request, Response } from 'express';
import type { FilterQuery } from 'mongoose';
import Job, { type IJob } from '../models/Job.js';
import Application from '../models/Application.js';

/**
 * GET /api/jobs
 * Public listing with search, filters and pagination.
 * Query params: search, type, category, location, page, limit, sort
 */
export async function getJobs(req: Request, res: Response): Promise<void> {
  const {
    search = '',
    type = '',
    category = '',
    location = '',
    page = '1',
    limit = '9',
    sort = '-createdAt',
  } = req.query as Record<string, string>;

  const filter: FilterQuery<IJob> = { isActive: true };

  if (search) {
    const regex = new RegExp(search, 'i');
    filter.$or = [{ title: regex }, { company: regex }, { skills: regex }];
  }
  if (type) filter.type = type;
  if (category) filter.category = category;
  if (location) filter.location = new RegExp(location, 'i');

  const pageNum = Math.max(1, parseInt(page, 10));
  const limitNum = Math.min(50, Math.max(1, parseInt(limit, 10)));
  const skip = (pageNum - 1) * limitNum;

  const [jobs, total] = await Promise.all([
    Job.find(filter)
      .populate('postedBy', 'name company')
      .sort(sort)
      .skip(skip)
      .limit(limitNum),
    Job.countDocuments(filter),
  ]);

  res.json({
    jobs,
    pagination: {
      page: pageNum,
      limit: limitNum,
      total,
      pages: Math.ceil(total / limitNum) || 1,
    },
  });
}

/** GET /api/jobs/:id */
export async function getJob(req: Request, res: Response): Promise<void> {
  const job = await Job.findById(req.params.id).populate('postedBy', 'name email');
  if (!job) {
    res.status(404);
    throw new Error('Job not found');
  }
  res.json({ job });
}

/** POST /api/jobs  (recruiter / admin) */
export async function createJob(req: Request, res: Response): Promise<void> {
  const job = await Job.create({ ...req.body, postedBy: req.user!._id });
  res.status(201).json({ job });
}

/** PUT /api/jobs/:id  (owner recruiter / admin) */
export async function updateJob(req: Request, res: Response): Promise<void> {
  const job = await Job.findById(req.params.id);
  if (!job) {
    res.status(404);
    throw new Error('Job not found');
  }
  if (req.user!.role !== 'admin' && job.postedBy.toString() !== req.user!._id.toString()) {
    res.status(403);
    throw new Error('You can only edit your own job postings');
  }
  Object.assign(job, req.body);
  await job.save();
  res.json({ job });
}

/** DELETE /api/jobs/:id  (owner recruiter / admin) */
export async function deleteJob(req: Request, res: Response): Promise<void> {
  const job = await Job.findById(req.params.id);
  if (!job) {
    res.status(404);
    throw new Error('Job not found');
  }
  if (req.user!.role !== 'admin' && job.postedBy.toString() !== req.user!._id.toString()) {
    res.status(403);
    throw new Error('You can only delete your own job postings');
  }
  await job.deleteOne();
  await Application.deleteMany({ job: job._id });
  res.json({ message: 'Job deleted' });
}

/** GET /api/jobs/mine/list  (recruiter) — jobs posted by the current recruiter */
export async function getMyJobs(req: Request, res: Response): Promise<void> {
  const jobs = await Job.find({ postedBy: req.user!._id }).sort('-createdAt');
  res.json({ jobs });
}
