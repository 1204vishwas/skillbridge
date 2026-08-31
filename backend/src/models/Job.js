import mongoose from 'mongoose';

const { Schema } = mongoose;

export const JOB_TYPES = ['Full-time', 'Part-time', 'Internship', 'Contract', 'Remote'];

const jobSchema = new Schema(
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

export default mongoose.model('Job', jobSchema);
