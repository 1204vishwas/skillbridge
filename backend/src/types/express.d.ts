import type { HydratedUser } from '../models/User.js';

// Augment Express's Request so authenticated handlers can read `req.user`
// after the `protect` middleware attaches the current user.
declare global {
  namespace Express {
    interface Request {
      user?: HydratedUser;
    }
  }
}

export {};
