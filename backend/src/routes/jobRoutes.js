import { Router } from 'express';
import {
  getJobs,
  getJob,
  createJob,
  updateJob,
  deleteJob,
  getMyJobs,
} from '../controllers/jobController.js';
import { protect, authorize } from '../middleware/auth.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = Router();

router.get('/', asyncHandler(getJobs));
router.get('/mine/list', protect, authorize('recruiter', 'admin'), asyncHandler(getMyJobs));
router.get('/:id', asyncHandler(getJob));

router.post('/', protect, authorize('recruiter', 'admin'), asyncHandler(createJob));
router.put('/:id', protect, authorize('recruiter', 'admin'), asyncHandler(updateJob));
router.delete('/:id', protect, authorize('recruiter', 'admin'), asyncHandler(deleteJob));

export default router;
