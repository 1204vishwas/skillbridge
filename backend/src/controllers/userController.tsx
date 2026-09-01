import type { Request, Response } from 'express';
import User, { type IUser } from '../models/User.js';
import Job from '../models/Job.js';

/** PUT /api/users/profile — update own profile */
export async function updateProfile(req: Request, res: Response): Promise<void> {
  const allowed: Array<keyof IUser> = ['name', 'headline', 'bio', 'location', 'skills', 'resumeUrl'];
  const updates: Partial<IUser> = {};
  for (const key of allowed) {
    if (req.body[key] !== undefined) {
      (updates as Record<string, unknown>)[key] = req.body[key];
    }
  }
  const user = await User.findByIdAndUpdate(req.user!._id, updates, {
    new: true,
    runValidators: true,
  });
  res.json({ user });
}

/** POST /api/users/resume — save uploaded resume url */
export async function uploadResume(req: Request, res: Response): Promise<void> {
  if (!req.file) {
    res.status(400);
    throw new Error('No file uploaded');
  }
  const resumeUrl = `/uploads/${req.file.filename}`;
  const user = await User.findByIdAndUpdate(req.user!._id, { resumeUrl }, { new: true });
  res.json({ user, resumeUrl });
}

/** POST /api/users/saved/:jobId — toggle saved job */
export async function toggleSavedJob(req: Request, res: Response): Promise<void> {
  const { jobId } = req.params;
  const job = await Job.findById(jobId);
  if (!job) {
    res.status(404);
    throw new Error('Job not found');
  }

  const user = (await User.findById(req.user!._id))!;
  const idx = user.savedJobs.findIndex((j) => j.toString() === jobId);
  if (idx >= 0) {
    user.savedJobs.splice(idx, 1);
  } else {
    user.savedJobs.push(job._id);
  }
  await user.save();
  res.json({ savedJobs: user.savedJobs });
}

/** GET /api/users/saved — list saved jobs */
export async function getSavedJobs(req: Request, res: Response): Promise<void> {
  const user = await User.findById(req.user!._id).populate({
    path: 'savedJobs',
    populate: { path: 'postedBy', select: 'name' },
  });
  res.json({ jobs: user?.savedJobs ?? [] });
}
