import { Schema, model, type HydratedDocument, type Model, type Types } from 'mongoose';

export const JOB_TYPES = ['Full-time', 'Part-time', 'Internship', 'Contract', 'Remote'] as const;
export type JobType = (typeof JOB_TYPES)[number];

export interface IJob {
  title: string;
  company: string;
  location: string;
  type: JobType;
  category: string;
  description: string;
  requirements: string[];
  skills: string[];

  salaryMin: number;
  salaryMax: number;
  experience: string;

  // Recruiter who owns the posting
  postedBy: Types.ObjectId;

  isActive: boolean;

  createdAt: Date;
  updatedAt: Date;
}

export type JobModel = Model<IJob>;
export type HydratedJob = HydratedDocument<IJob>;

const jobSchema = new Schema<IJob, JobModel>(
  {
    title: { type: String, required: true, trim: true, index: 'text' },
    company: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
    type: { type: String, enum: JOB_TYPES, default: 'Full-time' },
    category: { type: String, default: 'General', trim: true },
    description: { type: String, required: true },
    requirements: { type: [String], default: [] },
    skills: { type: [String], default: [] },

    salaryMin: { type: Number, default: 0 },
    salaryMax: { type: Number, default: 0 },
    experience: { type: String, default: 'Fresher' },

    // Recruiter who owns the posting
    postedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },

    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// Compound text index for search across the main text fields.
jobSchema.index({ title: 'text', company: 'text', description: 'text', skills: 'text' });

export default model<IJob, JobModel>('Job', jobSchema);
