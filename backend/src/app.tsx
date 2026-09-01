import express, { type Request, type Response } from 'express';
import cors, { type CorsOptions } from 'cors';
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
app.set('trust proxy', 1);

// Origins explicitly allowed via CLIENT_URL (comma-separated for multiple).
const allowedOrigins = (process.env.CLIENT_URL || 'http://localhost:5173')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

// Any localhost / 127.0.0.1 origin (on any port) — covers Vite on 5173/5174/etc.
const isLocalhost = (origin: string): boolean =>
  /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin);

const isAllowedOrigin = (origin: string): boolean =>
  allowedOrigins.includes(origin) || isLocalhost(origin);

const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    // Same-origin / non-browser requests (no Origin header) are always allowed.
    if (!origin || isAllowedOrigin(origin)) {
      callback(null, true);
      return;
    }

    // Deny cleanly: don't throw (that strips CORS headers and 500s the request);
    // the browser simply won't receive an Access-Control-Allow-Origin header.
    console.warn(`⚠️  Blocked CORS origin: ${origin}`);
    callback(null, false);
  },
  credentials: true,
};

app.use(cors(corsOptions));
// Answer preflight (OPTIONS) for every route with the same policy.
app.options('*', cors(corsOptions));
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
app.get('/api/health', (_req: Request, res: Response) =>
  res.json({ status: 'ok', service: 'SkillBridge API' })
);

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
