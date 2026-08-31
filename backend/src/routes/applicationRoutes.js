import { Router } from 'express';
import {
  applyToJob,
  getMyApplications,
  withdrawApplication,
  getApplicationsForJob,
  updateApplicationStatus,
} from '../controllers/applicationController.js';
import { protect, authorize } from '../middleware/auth.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = Router();

router.post('/', protect, authorize('student'), asyncHandler(applyToJob));
router.get('/mine', protect, authorize('student'), asyncHandler(getMyApplications));
router.delete('/:id', protect, authorize('student'), asyncHandler(withdrawApplication));

router.get(
  '/job/:jobId',
  protect,
  authorize('recruiter', 'admin'),
  asyncHandler(getApplicationsForJob)
);
router.patch(
  '/:id/status',
  protect,
  authorize('recruiter', 'admin'),
  asyncHandler(updateApplicationStatus)
);

export default router;
