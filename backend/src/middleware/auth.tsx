import jwt, { type JwtPayload } from 'jsonwebtoken';
import type { NextFunction, Request, RequestHandler, Response } from 'express';
import User, { type Role } from '../models/User.js';

interface AuthTokenPayload extends JwtPayload {
  id: string;
}

/**
 * Verify the JWT from the Authorization header and attach the user to req.user.
 */
export async function protect(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    let token: string | undefined;
    const header = req.headers.authorization;
    if (header && header.startsWith('Bearer ')) {
      token = header.split(' ')[1];
    }

    if (!token) {
      res.status(401).json({ message: 'Not authorised, no token provided' });
      return;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as AuthTokenPayload;
    const user = await User.findById(decoded.id);
    if (!user) {
      res.status(401).json({ message: 'Not authorised, user not found' });
      return;
    }

    req.user = user;
    next();
  } catch {
    res.status(401).json({ message: 'Not authorised, token invalid or expired' });
  }
}

/**
 * Role-Based Access Control middleware.
 * Usage: authorize('recruiter', 'admin')
 */
export function authorize(...roles: Role[]): RequestHandler {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      res.status(403).json({ message: 'Forbidden: insufficient permissions' });
      return;
    }
    next();
  };
}
