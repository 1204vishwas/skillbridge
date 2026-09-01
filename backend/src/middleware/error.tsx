import type { NextFunction, Request, Response } from 'express';

/** Shape of the various error objects we may receive (Mongoose, generic, etc.). */
interface AppError extends Error {
  code?: number;
  keyValue?: Record<string, unknown>;
  errors?: Record<string, { message: string }>;
  path?: string;
  value?: unknown;
}

/** 404 handler for unmatched routes. */
export function notFound(req: Request, res: Response): void {
  res.status(404).json({ message: `Route not found: ${req.originalUrl}` });
}

/** Central error handler. */
export function errorHandler(err: AppError, _req: Request, res: Response, _next: NextFunction): void {
  console.error('❌', err.message);

  // Mongoose duplicate key
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    res.status(409).json({ message: `${field} already exists` });
    return;
  }

  // Mongoose validation
  if (err.name === 'ValidationError' && err.errors) {
    const messages = Object.values(err.errors).map((e) => e.message);
    res.status(400).json({ message: messages.join(', ') });
    return;
  }

  // Invalid ObjectId
  if (err.name === 'CastError') {
    res.status(400).json({ message: `Invalid ${err.path}: ${err.value}` });
    return;
  }

  const status = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;
  res.status(status).json({ message: err.message || 'Server error' });
}
