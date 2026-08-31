import { useRef, useState } from 'react';
import api, { apiError } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { Chip } from '../components/Badge';

export default function Profile() {
  const { user, setUser } = useAuth();
  const fileRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    name: user?.name || '',
    headline: user?.headline || '',
    bio: user?.bio || '',
    location: user?.location || '',
    skills: (user?.skills || []).join(', '),
  });
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');
  const [uploading, setUploading] = useState(false);

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMsg('');
    try {
      const payload = {
        ...form,
        skills: form.skills
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean),
      };
      const res = await api.put('/users/profile', payload);
      setUser(res.data.user);
      setMsg('✅ Profile updated');
    } catch (err) {
      setMsg(apiError(err));
    } finally {
      setSaving(false);
    }
  };

  const uploadResume = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setMsg('');
    try {
      const fd = new FormData();
      fd.append('resume', file);
      const res = await api.post('/users/resume', fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setUser(res.data.user);
      setMsg('✅ Resume uploaded');
    } catch (err) {
      setMsg(apiError(err));
    } finally {
      setUploading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <h1 className="text-3xl font-bold text-slate-900 dark:text-white">My Profile</h1>
      <p className="mt-1 text-slate-500 capitalize">Signed in as {user.role}</p>

      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        {/* Summary card */}
        <div className="card h-fit p-6 text-center">
          <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-brand-600 text-2xl font-bold text-white">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <h2 className="mt-3 font-bold text-slate-900 dark:text-white">{user.name}</h2>
          <p className="text-sm text-slate-500">{user.email}</p>
          {user.headline && <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{user.headline}</p>}
          {(user.skills?.length ?? 0) > 0 && (
            <div className="mt-3 flex flex-wrap justify-center gap-1.5">
              {user.skills!.map((s) => (
                <Chip key={s}>{s}</Chip>
              ))}
            </div>
          )}

          {user.role === 'student' && (
            <div className="mt-5 border-t border-slate-200 pt-5 dark:border-slate-800">
              <p className="mb-2 text-sm font-medium">Resume</p>
              {user.resumeUrl ? (
                <a
                  href={user.resumeUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm text-brand-600 hover:underline"
                >
                  View uploaded resume
                </a>
              ) : (
                <p className="text-xs text-slate-400">No resume uploaded</p>
              )}
              <input
                ref={fileRef}
                type="file"
                accept=".pdf,.doc,.docx"
                className="hidden"
                onChange={uploadResume}
              />
              <button
                onClick={() => fileRef.current?.click()}
                className="btn-secondary mt-3 w-full !py-1.5 !text-xs"
                disabled={uploading}
              >
                {uploading ? 'Uploading...' : 'Upload Resume'}
              </button>
            </div>
          )}
        </div>

        {/* Edit form */}
        <form onSubmit={save} className="card space-y-4 p-6 lg:col-span-2">
          {msg && (
            <p className="rounded-lg bg-slate-100 p-3 text-sm dark:bg-slate-800">{msg}</p>
          )}
          <div>
            <label className="label">Full name</label>
            <input className="input" value={form.name} onChange={set('name')} required />
          </div>
          <div>
            <label className="label">Headline</label>
            <input
              className="input"
              placeholder="e.g. Aspiring Full-Stack Developer"
              value={form.headline}
              onChange={set('headline')}
            />
          </div>
          <div>
            <label className="label">Location</label>
            <input className="input" value={form.location} onChange={set('location')} />
          </div>
          <div>
            <label className="label">Skills (comma separated)</label>
            <input
              className="input"
              placeholder="React, Node.js, MongoDB"
              value={form.skills}
              onChange={set('skills')}
            />
          </div>
          <div>
            <label className="label">Bio</label>
            <textarea className="input min-h-[100px]" value={form.bio} onChange={set('bio')} />
          </div>
          <button type="submit" className="btn-primary" disabled={saving}>
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  );
}
