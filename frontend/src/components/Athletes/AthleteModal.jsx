import { useState, useEffect } from 'react';

const SPORTS = ['Football', 'Basketball', 'Swimming', 'Athletics', 'Tennis', 'Cricket', 'Other'];
const STATUSES = ['Active', 'Injured', 'Resting'];

export default function AthleteModal({ data, onSave, onClose }) {
  const isEdit = !!data;
  const [form, setForm] = useState({
    name: '', sport: 'Football', age: '', status: 'Active',
    performanceScore: 0, completedWorkouts: 0
  });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (data) setForm({
      name: data.name || '',
      sport: data.sport || 'Football',
      age: data.age || '',
      status: data.status || 'Active',
      performanceScore: data.performanceScore ?? 0,
      completedWorkouts: data.completedWorkouts ?? 0,
    });
  }, [data]);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.age || form.age < 10 || form.age > 60) e.age = 'Age must be 10–60';
    if (form.performanceScore < 0 || form.performanceScore > 100) e.performanceScore = 'Score 0–100';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setSaving(true);
    try {
      await onSave({ ...form, age: Number(form.age), performanceScore: Number(form.performanceScore), completedWorkouts: Number(form.completedWorkouts) }, data?._id);
    } finally {
      setSaving(false);
    }
  };

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal-card">
        <div className="modal-header">
          <h2>{isEdit ? 'Edit Athlete' : 'Add New Athlete'}</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body">
          <div className="modal-grid">
            <div className="field">
              <label>Full Name *</label>
              <input type="text" value={form.name} onChange={e => set('name', e.target.value)} placeholder="Athlete name" />
              {errors.name && <span className="error">{errors.name}</span>}
            </div>

            <div className="field">
              <label>Age *</label>
              <input type="number" value={form.age} onChange={e => set('age', e.target.value)} placeholder="25" min={10} max={60} />
              {errors.age && <span className="error">{errors.age}</span>}
            </div>

            <div className="field">
              <label>Sport</label>
              <select value={form.sport} onChange={e => set('sport', e.target.value)}>
                {SPORTS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            <div className="field">
              <label>Status</label>
              <select value={form.status} onChange={e => set('status', e.target.value)}>
                {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            <div className="field">
              <label>Performance Score (0–100)</label>
              <div className="slider-field">
                <input type="range" min={0} max={100} value={form.performanceScore}
                  onChange={e => set('performanceScore', e.target.value)} className="range-input" />
                <span className="range-value">{form.performanceScore}%</span>
              </div>
              {errors.performanceScore && <span className="error">{errors.performanceScore}</span>}
            </div>

            <div className="field">
              <label>Completed Workouts</label>
              <input type="number" value={form.completedWorkouts}
                onChange={e => set('completedWorkouts', e.target.value)} placeholder="0" min={0} />
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn-outline" onClick={onClose}>Cancel</button>
          <button className="btn-primary" onClick={handleSubmit} disabled={saving}>
            {saving ? 'Saving...' : isEdit ? 'Update Athlete' : 'Add Athlete'}
          </button>
        </div>
      </div>
    </div>
  );
}
