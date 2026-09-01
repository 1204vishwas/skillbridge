import { Schema, model, type HydratedDocument, type Model, type Types } from 'mongoose';

export const APPLICATION_STATUS = ['Applied', 'Reviewing', 'Shortlisted', 'Rejected', 'Hired'] as const;
export type ApplicationStatus = (typeof APPLICATION_STATUS)[number];

export interface IApplication {
  job: Types.ObjectId;
  applicant: Types.ObjectId;
  status: ApplicationStatus;
  coverLetter: string;
  resumeUrl: string;

  createdAt: Date;
  updatedAt: Date;
}

export type ApplicationModel = Model<IApplication>;
export type HydratedApplication = HydratedDocument<IApplication>;

const applicationSchema = new Schema<IApplication, ApplicationModel>(
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

export default model<IApplication, ApplicationModel>('Application', applicationSchema);
