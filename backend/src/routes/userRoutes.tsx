import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import {
  updateProfile,
  uploadResume,
  toggleSavedJob,
  getSavedJobs,
} from '../controllers/userController.js';
import { protect } from '../middleware/auth.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = Router();

// Ensure uploads directory exists.
const uploadDir = path.resolve('uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `resume-${req.user!._id}-${Date.now()}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
  fileFilter: (_req, file, cb) => {
    const ok = ['.pdf', '.doc', '.docx'].includes(path.extname(file.originalname).toLowerCase());
    if (ok) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF/DOC/DOCX files are allowed'));
    }
  },
});

router.put('/profile', protect, asyncHandler(updateProfile));
router.post('/resume', protect, upload.single('resume'), asyncHandler(uploadResume));
router.get('/saved', protect, asyncHandler(getSavedJobs));
router.post('/saved/:jobId', protect, asyncHandler(toggleSavedJob));

export default router;
