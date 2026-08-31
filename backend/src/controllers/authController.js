import User, { ROLES } from '../models/User.js';
import { signToken } from '../utils/token.js';

/** POST /api/auth/register */
export async function register(req, res) {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error('Name, email and password are required');
  }

  // Never allow self-registration as admin.
  const safeRole = role === 'recruiter' ? 'recruiter' : 'student';
  if (role && !ROLES.includes(role)) {
    res.status(400);
    throw new Error('Invalid role');
  }

  const exists = await User.findOne({ email });
  if (exists) {
    res.status(409);
    throw new Error('An account with this email already exists');
  }

  const user = await User.create({ name, email, password, role: safeRole });
  const token = signToken(user._id);

  res.status(201).json({ token, user });
}

/** POST /api/auth/login */
export async function login(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error('Email and password are required');
  }

  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.comparePassword(password))) {
    res.status(401);
    throw new Error('Invalid email or password');
  }

  const token = signToken(user._id);
  res.json({ token, user });
}

/** GET /api/auth/me */
export async function getMe(req, res) {
  res.json({ user: req.user });
}
