import User, { type HydratedUser } from '../models/User.js';
import Job, { type HydratedJob, type IJob } from '../models/Job.js';
import Application from '../models/Application.js';

interface SeedOptions {
  clear?: boolean;
}

export interface SeedResult {
  admin: HydratedUser;
  recruiter: HydratedUser;
  student: HydratedUser;
  jobs: HydratedJob[];
}

/**
 * Seed demo users, jobs and applications.
 * Returns the created demo accounts. Safe to call on an empty database.
 */
export async function seedDatabase({ clear = false }: SeedOptions = {}): Promise<SeedResult> {
  if (clear) {
    await Promise.all([User.deleteMany({}), Job.deleteMany({}), Application.deleteMany({})]);
  }

  const admin = await User.create({
    name: 'Admin User',
    email: 'admin@skillbridge.dev',
    password: 'password123',
    role: 'admin',
  });

  const recruiter = await User.create({
    name: 'Riya Recruiter',
    email: 'recruiter@skillbridge.dev',
    password: 'password123',
    role: 'recruiter',
    headline: 'Talent Acquisition @ TechNova',
    location: 'Bengaluru, India',
  });

  const recruiter2 = await User.create({
    name: 'Sam Hiring',
    email: 'sam@skillbridge.dev',
    password: 'password123',
    role: 'recruiter',
    headline: 'Engineering Manager @ CloudbyteLabs',
    location: 'Remote',
  });

  const student = await User.create({
    name: 'Aarav Student',
    email: 'student@skillbridge.dev',
    password: 'password123',
    role: 'student',
    headline: 'Final year CS student | Aspiring Full-Stack Developer',
    location: 'Pune, India',
    skills: ['React', 'JavaScript', 'Node.js', 'MongoDB'],
  });

  // Required job fields for seeding; optional/defaulted fields (isActive, timestamps) are omitted.
  type JobSeed = Omit<IJob, 'isActive' | 'createdAt' | 'updatedAt'>;

  const jobsData: JobSeed[] = [
    {
      title: 'Frontend Developer Intern',
      company: 'TechNova',
      location: 'Bengaluru, India',
      type: 'Internship',
      category: 'Frontend',
      description:
        'Join our frontend team to build responsive web apps with React and TypeScript. Great learning opportunity for freshers.',
      requirements: ['React basics', 'HTML/CSS', 'Git'],
      skills: ['React', 'TypeScript', 'Tailwind CSS'],
      salaryMin: 15000,
      salaryMax: 25000,
      experience: 'Fresher',
      postedBy: recruiter._id,
    },
    {
      title: 'Full-Stack Developer',
      company: 'CloudbyteLabs',
      location: 'Remote',
      type: 'Full-time',
      category: 'Full-Stack',
      description:
        'Build and ship features across the stack using Node.js, Express and React. Work with modern CI/CD pipelines.',
      requirements: ['Node.js', 'React', 'REST APIs', 'MongoDB'],
      skills: ['Node.js', 'Express', 'React', 'MongoDB'],
      salaryMin: 600000,
      salaryMax: 1200000,
      experience: '1-3 years',
      postedBy: recruiter2._id,
    },
    {
      title: 'Backend Engineer (Node.js)',
      company: 'CloudbyteLabs',
      location: 'Hyderabad, India',
      type: 'Full-time',
      category: 'Backend',
      description:
        'Design scalable REST APIs and microservices. Strong knowledge of databases and authentication required.',
      requirements: ['Express.js', 'PostgreSQL', 'JWT', 'Docker'],
      skills: ['Node.js', 'PostgreSQL', 'Docker'],
      salaryMin: 800000,
      salaryMax: 1500000,
      experience: '2-4 years',
      postedBy: recruiter2._id,
    },
    {
      title: 'Data Analyst Intern',
      company: 'InsightIQ',
      location: 'Mumbai, India',
      type: 'Internship',
      category: 'Data',
      description:
        'Analyse product data, build dashboards and support decision-making with SQL and visualisation tools.',
      requirements: ['SQL', 'Excel', 'Python basics'],
      skills: ['SQL', 'Python', 'Power BI'],
      salaryMin: 12000,
      salaryMax: 20000,
      experience: 'Fresher',
      postedBy: recruiter._id,
    },
    {
      title: 'UI/UX Designer',
      company: 'PixelForge',
      location: 'Remote',
      type: 'Contract',
      category: 'Design',
      description:
        'Design intuitive user experiences and interfaces in Figma. Collaborate with developers to ship polished products.',
      requirements: ['Figma', 'Wireframing', 'Prototyping'],
      skills: ['Figma', 'UI Design', 'Prototyping'],
      salaryMin: 40000,
      salaryMax: 70000,
      experience: '1-2 years',
      postedBy: recruiter._id,
    },
    {
      title: 'DevOps Engineer',
      company: 'ScaleOps',
      location: 'Bengaluru, India',
      type: 'Full-time',
      category: 'DevOps',
      description:
        'Own CI/CD pipelines, container orchestration and cloud infrastructure. Experience with GitHub Actions and Docker required.',
      requirements: ['Docker', 'CI/CD', 'AWS', 'Kubernetes'],
      skills: ['Docker', 'GitHub Actions', 'AWS'],
      salaryMin: 1000000,
      salaryMax: 1800000,
      experience: '3-5 years',
      postedBy: recruiter2._id,
    },
    {
      title: 'React Native Developer',
      company: 'AppSphere',
      location: 'Chennai, India',
      type: 'Part-time',
      category: 'Mobile',
      description:
        'Develop cross-platform mobile apps using React Native. Flexible part-time role for experienced developers.',
      requirements: ['React Native', 'JavaScript', 'REST APIs'],
      skills: ['React Native', 'JavaScript'],
      salaryMin: 30000,
      salaryMax: 50000,
      experience: '1-3 years',
      postedBy: recruiter._id,
    },
    {
      title: 'Machine Learning Intern',
      company: 'NeuralWorks',
      location: 'Remote',
      type: 'Remote',
      category: 'AI/ML',
      description:
        'Assist in building and training ML models. Work with Python, scikit-learn and real-world datasets.',
      requirements: ['Python', 'ML basics', 'NumPy/Pandas'],
      skills: ['Python', 'Machine Learning', 'Pandas'],
      salaryMin: 18000,
      salaryMax: 30000,
      experience: 'Fresher',
      postedBy: recruiter2._id,
    },
  ];

  const jobs = await Job.insertMany(jobsData);

  await Application.create([
    { job: jobs[0]!._id, applicant: student._id, status: 'Applied', coverLetter: 'Excited to learn frontend!' },
    { job: jobs[1]!._id, applicant: student._id, status: 'Reviewing', coverLetter: 'I love full-stack development.' },
  ]);

  student.savedJobs = [jobs[2]!._id, jobs[4]!._id];
  await student.save();

  return { admin, recruiter, student, jobs };
}
