import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';
import toast from 'react-hot-toast';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '', role: 'coach' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Name required';
    if (!form.email) e.email = 'Email required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Invalid email';
    if (!form.password) e.password = 'Password required';
    else if (form.password.length < 6) e.password = 'Min 6 characters';
    if (form.password !== form.confirm) e.confirm = 'Passwords do not match';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const { data } = await API.post('/auth/register', {
        name: form.name, email: form.email, password: form.password, role: form.role
      });
      login(data.user, data.token);
      toast.success(`Welcome, ${data.user.name}! 🎉`);
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">⚡ AthleteIQ</div>
        <h2>Create your account</h2>
        <p className="auth-sub">Start tracking performance today</p>
        <form onSubmit={handleSubmit} noValidate>
          <div className="field">
            <label>Full Name</label>
            <input type="text" value={form.name}
              onChange={e => setForm({...form, name: e.target.value})}
              placeholder="John Doe" />
            {errors.name && <span className="error">{errors.name}</span>}
          </div>
          <div className="field">
            <label>Email</label>
            <input type="email" value={form.email}
              onChange={e => setForm({...form, email: e.target.value})}
              placeholder="you@example.com" />
            {errors.email && <span className="error">{errors.email}</span>}
          </div>
          <div className="field">
            <label>Role</label>
            <select value={form.role} onChange={e => setForm({...form, role: e.target.value})}>
              <option value="coach">Coach</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div className="field">
            <label>Password</label>
            <input type="password" value={form.password}
              onChange={e => setForm({...form, password: e.target.value})}
              placeholder="••••••••" />
            {errors.password && <span className="error">{errors.password}</span>}
          </div>
          <div className="field">
            <label>Confirm Password</label>
            <input type="password" value={form.confirm}
              onChange={e => setForm({...form, confirm: e.target.value})}
              placeholder="••••••••" />
            {errors.confirm && <span className="error">{errors.confirm}</span>}
          </div>
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>
        <p className="auth-switch">Already have an account? <Link to="/login">Sign In</Link></p>
      </div>
    </div>
  );
}
