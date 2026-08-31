import mongoose from 'mongoose';

const { Schema } = mongoose;

export const APPLICATION_STATUS = ['Applied', 'Reviewing', 'Shortlisted', 'Rejected', 'Hired'];

const applicationSchema = new Schema(
  {
    job: { type: Schema.Types.ObjectId, ref: 'Job', required: true },
    applicant: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    status: { type: String, enum: APPLICATION_STATUS, default: 'Applied' },
    coverLetter: { type: String, default: '' },
    resumeUrl: { type: String, default: '' },
  },
  { timestamps: true }
);

// A user can apply to a given job only once.
applicationSchema.index({ job: 1, applicant: 1 }, { unique: true });

export default mongoose.model('Application', applicationSchema);
