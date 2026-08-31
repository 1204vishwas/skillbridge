import jwt from 'jsonwebtoken';
import User from '../models/User.js';

/**
 * Verify the JWT from the Authorization header and attach the user to req.user.
 */
export async function protect(req, res, next) {
  try {
    let token;
    const header = req.headers.authorization;
    if (header && header.startsWith('Bearer ')) {
      token = header.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({ message: 'Not authorised, no token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ message: 'Not authorised, user not found' });
    }

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Not authorised, token invalid or expired' });
  }
}

/**
 * Role-Based Access Control middleware.
 * Usage: authorize('recruiter', 'admin')
 */
export function authorize(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Forbidden: insufficient permissions' });
    }
    next();
  };
}
