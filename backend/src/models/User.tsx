import { Schema, model, type HydratedDocument, type Model, type Types } from 'mongoose';
import bcrypt from 'bcryptjs';

/**
 * Role-Based Access:
 *  - student   : can browse jobs, save/apply, manage own profile
 *  - recruiter : can post jobs and review applications on their jobs
 *  - admin     : full access to the admin dashboard
 */
export const ROLES = ['student', 'recruiter', 'admin'] as const;
export type Role = (typeof ROLES)[number];

export interface IUser {
  name: string;
  email: string;
  password: string;
  role: Role;

  // Profile / resume management
  headline: string;
  bio: string;
  location: string;
  skills: string[];
  resumeUrl: string;

  // Saved jobs (bookmarks)
  savedJobs: Types.ObjectId[];

  createdAt: Date;
  updatedAt: Date;
}

export interface IUserMethods {
  comparePassword(candidate: string): Promise<boolean>;
}

export type UserModel = Model<IUser, {}, IUserMethods>;
export type HydratedUser = HydratedDocument<IUser, IUserMethods>;

const userSchema = new Schema<IUser, UserModel, IUserMethods>(
  {
    name: { type: String, required: [true, 'Name is required'], trim: true },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false,
    },
    role: { type: String, enum: ROLES, default: 'student' },

    // Profile / resume management
    headline: { type: String, default: '' },
    bio: { type: String, default: '' },
    location: { type: String, default: '' },
    skills: { type: [String], default: [] },
    resumeUrl: { type: String, default: '' },

    // Saved jobs (bookmarks)
    savedJobs: [{ type: Schema.Types.ObjectId, ref: 'Job' }],
  },
  { timestamps: true }
);

// Hash password before saving whenever it changed.
userSchema.pre('save', async function hashPassword(next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.comparePassword = function comparePassword(candidate: string): Promise<boolean> {
  return bcrypt.compare(candidate, this.password);
};

// Strip sensitive fields when serialising.
userSchema.methods.toJSON = function toJSON() {
  const obj: Record<string, unknown> = this.toObject();
  delete obj.password;
  delete obj.__v;
  return obj;
};

export default model<IUser, UserModel>('User', userSchema);
