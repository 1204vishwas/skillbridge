import Application, { APPLICATION_STATUS } from '../models/Application.js';
import Job from '../models/Job.js';

/** POST /api/applications  (student) — apply to a job */
export async function applyToJob(req, res) {
  const { jobId, coverLetter } = req.body;

  const job = await Job.findById(jobId);
  if (!job || !job.isActive) {
    res.status(404);
    throw new Error('Job not found or no longer active');
  }

  const existing = await Application.findOne({ job: jobId, applicant: req.user._id });
  if (existing) {
    res.status(409);
    throw new Error('You have already applied to this job');
  }

  const application = await Application.create({
    job: jobId,
    applicant: req.user._id,
    coverLetter: coverLetter || '',
    resumeUrl: req.user.resumeUrl || '',
  });

  res.status(201).json({ application });
}

/** GET /api/applications/mine  (student) — my applications */
export async function getMyApplications(req, res) {
  const applications = await Application.find({ applicant: req.user._id })
    .populate('job', 'title company location type')
    .sort('-createdAt');
  res.json({ applications });
}

/** DELETE /api/applications/:id  (student) — withdraw */
export async function withdrawApplication(req, res) {
  const application = await Application.findById(req.params.id);
  if (!application) {
    res.status(404);
    throw new Error('Application not found');
  }
  if (application.applicant.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorised');
  }
  await application.deleteOne();
  res.json({ message: 'Application withdrawn' });
}

/** GET /api/applications/job/:jobId  (recruiter/admin) — applicants for a job */
export async function getApplicationsForJob(req, res) {
  const job = await Job.findById(req.params.jobId);
  if (!job) {
    res.status(404);
    throw new Error('Job not found');
  }
  if (req.user.role !== 'admin' && job.postedBy.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorised to view these applications');
  }
  const applications = await Application.find({ job: req.params.jobId })
    .populate('applicant', 'name email headline skills resumeUrl location')
    .sort('-createdAt');
  res.json({ applications });
}

/** PATCH /api/applications/:id/status  (recruiter/admin) — update status */
export async function updateApplicationStatus(req, res) {
  const { status } = req.body;
  if (!APPLICATION_STATUS.includes(status)) {
    res.status(400);
    throw new Error('Invalid status');
  }

  const application = await Application.findById(req.params.id).populate('job');
  if (!application) {
    res.status(404);
    throw new Error('Application not found');
  }
  if (
    req.user.role !== 'admin' &&
    application.job.postedBy.toString() !== req.user._id.toString()
  ) {
    res.status(403);
    throw new Error('Not authorised');
  }

  application.status = status;
  await application.save();
  res.json({ application });
}
