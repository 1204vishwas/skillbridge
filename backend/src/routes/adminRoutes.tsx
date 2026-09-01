import { Router } from 'express';
import { getStats, getUsers, deleteUser, getAllJobs } from '../controllers/adminController.js';
import { protect, authorize } from '../middleware/auth.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = Router();

router.use(protect, authorize('admin'));

router.get('/stats', asyncHandler(getStats));
router.get('/users', asyncHandler(getUsers));
router.delete('/users/:id', asyncHandler(deleteUser));
router.get('/jobs', asyncHandler(getAllJobs));

export default router;
