import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api, { apiError } from '../api/client';
import Spinner from '../components/Spinner';

const JOB_TYPES = ['Full-time', 'Part-time', 'Internship', 'Contract', 'Remote'];

const empty = {
  title: '',
  company: '',
  location: '',
  type: 'Full-time',
  category: 'General',
  description: '',
  requirements: '',
  skills: '',
  salaryMin: '',
  salaryMax: '',
  experience: 'Fresher',
};

export default function PostJob() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [form, setForm] = useState(empty);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isEdit) return;
    api
      .get(`/jobs/${id}`)
      .then((res) => {
        const j = res.data.job;
        setForm({
          title: j.title,
          company: j.company,
          location: j.location,
          type: j.type,
          category: j.category,
          description: j.description,
          requirements: (j.requirements || []).join('\n'),
          skills: (j.skills || []).join(', '),
          salaryMin: String(j.salaryMin || ''),
          salaryMax: String(j.salaryMax || ''),
          experience: j.experience,
        });
      })
      .catch((err) => setError(apiError(err)))
      .finally(() => setLoading(false));
  }, [id, isEdit]);

  const set =
    (k: string) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    const payload = {
      ...form,
      requirements: form.requirements.split('\n').map((s) => s.trim()).filter(Boolean),
      skills: form.skills.split(',').map((s) => s.trim()).filter(Boolean),
      salaryMin: Number(form.salaryMin) || 0,
      salaryMax: Number(form.salaryMax) || 0,
    };
    try {
      if (isEdit) await api.put(`/jobs/${id}`, payload);
      else await api.post('/jobs', payload);
      navigate('/recruiter');
    } catch (err) {
      setError(apiError(err));
      setSaving(false);
    }
  };

  if (loading) return <Spinner label="Loading job..." />;

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
        {isEdit ? 'Edit Job' : 'Post a New Job'}
      </h1>
      <p className="mt-1 text-slate-500">Fill in the details below to publish your opening.</p>

      <form onSubmit={submit} className="card mt-6 space-y-4 p-6">
        {error && (
          <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700 dark:bg-red-900/30 dark:text-red-300">
            {error}
          </p>
        )}

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label">Job title *</label>
            <input className="input" value={form.title} onChange={set('title')} required />
          </div>
          <div>
            <label className="label">Company *</label>
            <input className="input" value={form.company} onChange={set('company')} required />
          </div>
          <div>
            <label className="label">Location *</label>
            <input className="input" value={form.location} onChange={set('location')} required />
          </div>
          <div>
            <label className="label">Type</label>
            <select className="input" value={form.type} onChange={set('type')}>
              {JOB_TYPES.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">Category</label>
            <input className="input" value={form.category} onChange={set('category')} />
          </div>
          <div>
            <label className="label">Experience</label>
            <input className="input" value={form.experience} onChange={set('experience')} />
          </div>
          <div>
            <label className="label">Salary min (₹)</label>
            <input
              type="number"
              className="input"
              value={form.salaryMin}
              onChange={set('salaryMin')}
            />
          </div>
          <div>
            <label className="label">Salary max (₹)</label>
            <input
              type="number"
              className="input"
              value={form.salaryMax}
              onChange={set('salaryMax')}
            />
          </div>
        </div>

        <div>
          <label className="label">Description *</label>
          <textarea
            className="input min-h-[120px]"
            value={form.description}
            onChange={set('description')}
            required
          />
        </div>
        <div>
          <label className="label">Requirements (one per line)</label>
          <textarea
            className="input min-h-[90px]"
            placeholder={'React basics\nGit\nHTML/CSS'}
            value={form.requirements}
            onChange={set('requirements')}
          />
        </div>
        <div>
          <label className="label">Skills (comma separated)</label>
          <input
            className="input"
            placeholder="React, TypeScript, Tailwind CSS"
            value={form.skills}
            onChange={set('skills')}
          />
        </div>

        <div className="flex gap-3">
          <button type="submit" className="btn-primary" disabled={saving}>
            {saving ? 'Saving...' : isEdit ? 'Update Job' : 'Publish Job'}
          </button>
          <button type="button" onClick={() => navigate('/recruiter')} className="btn-secondary">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
