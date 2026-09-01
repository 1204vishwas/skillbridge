import type { Request, Response } from 'express';
import User from '../models/User.js';
import Job from '../models/Job.js';
import Application from '../models/Application.js';

/** GET /api/admin/stats — dashboard analytics */
export async function getStats(_req: Request, res: Response): Promise<void> {
  const [
    totalUsers,
    totalStudents,
    totalRecruiters,
    totalJobs,
    activeJobs,
    totalApplications,
    applicationsByStatus,
    jobsByType,
    recentApplications,
  ] = await Promise.all([
    User.countDocuments(),
    User.countDocuments({ role: 'student' }),
    User.countDocuments({ role: 'recruiter' }),
    Job.countDocuments(),
    Job.countDocuments({ isActive: true }),
    Application.countDocuments(),
    Application.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
    Job.aggregate([{ $group: { _id: '$type', count: { $sum: 1 } } }]),
    Application.find()
      .populate('applicant', 'name')
      .populate('job', 'title company')
      .sort('-createdAt')
      .limit(6),
  ]);

  res.json({
    totals: {
      users: totalUsers,
      students: totalStudents,
      recruiters: totalRecruiters,
      jobs: totalJobs,
      activeJobs,
      applications: totalApplications,
    },
    applicationsByStatus,
    jobsByType,
    recentApplications,
  });
}

/** GET /api/admin/users — list users */
export async function getUsers(_req: Request, res: Response): Promise<void> {
  const users = await User.find().sort('-createdAt');
  res.json({ users });
}

/** DELETE /api/admin/users/:id — remove a user */
export async function deleteUser(req: Request, res: Response): Promise<void> {
  if (req.params.id === req.user!._id.toString()) {
    res.status(400);
    throw new Error('You cannot delete your own account');
  }
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }
  await Job.deleteMany({ postedBy: user._id });
  await Application.deleteMany({ applicant: user._id });
  res.json({ message: 'User deleted' });
}

/** GET /api/admin/jobs — all jobs */
export async function getAllJobs(_req: Request, res: Response): Promise<void> {
  const jobs = await Job.find().populate('postedBy', 'name email').sort('-createdAt');
  res.json({ jobs });
}
