import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import path from 'path';

import authRoutes from './routes/authRoutes.js';
import jobRoutes from './routes/jobRoutes.js';
import applicationRoutes from './routes/applicationRoutes.js';
import userRoutes from './routes/userRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import { notFound, errorHandler } from './middleware/error.js';

const app = express();

// Core middleware
app.use(
  cors({
    origin: process.env.CLIENT_URL?.split(',') || '*',
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
if (process.env.NODE_ENV !== 'test') app.use(morgan('dev'));

// Rate limit the API a bit.
app.use(
  '/api',
  rateLimit({ windowMs: 15 * 60 * 1000, max: 500, standardHeaders: true, legacyHeaders: false })
);

// Static: uploaded resumes
app.use('/uploads', express.static(path.resolve('uploads')));

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'ok', service: 'SkillBridge API' }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);

// Errors
app.use(notFound);
app.use(errorHandler);

export default app;
