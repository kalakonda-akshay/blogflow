import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Register() {
  const { register } = useAuth();
  const navigate     = useNavigate();
  const [form, setForm]   = useState({ name: '', email: '', password: '', confirm: '', bio: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const set = (f) => (e) => setForm(p => ({ ...p, [f]: e.target.value }));

  const submit = async () => {
    if (form.password !== form.confirm) { setError('Passwords do not match.'); return; }
    setLoading(true); setError('');
    const res = await register(form);
    setLoading(false);
    if (res.error) { setError(res.error); return; }
    navigate('/');
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">Blog<em>Flow</em></div>
        <p className="auth-tagline">Join a community of writers.</p>

        {error && <div className="form-error">{error}</div>}

        <div className="form-group">
          <label className="form-label">Your Name</label>
          <input className="form-input" type="text" placeholder="Jane Smith" value={form.name} onChange={set('name')} />
        </div>
        <div className="form-group">
          <label className="form-label">Email</label>
          <input className="form-input" type="email" placeholder="you@example.com" value={form.email} onChange={set('email')} />
        </div>
        <div className="form-group">
          <label className="form-label">Password</label>
          <input className="form-input" type="password" placeholder="Min. 6 characters" value={form.password} onChange={set('password')} />
        </div>
        <div className="form-group">
          <label className="form-label">Confirm Password</label>
          <input className="form-input" type="password" placeholder="Repeat password" value={form.confirm} onChange={set('confirm')} onKeyDown={(e) => e.key === 'Enter' && submit()} />
        </div>
        <div className="form-group">
          <label className="form-label">Short Bio <span style={{ color: 'var(--ink4)', textTransform: 'none', fontWeight: 400 }}>(optional)</span></label>
          <input className="form-input" type="text" placeholder="Writer, thinker, coffee enthusiast…" value={form.bio} onChange={set('bio')} />
        </div>

        <button className="btn btn-accent btn-full" onClick={submit} disabled={loading}>
          {loading ? 'Creating account…' : 'Create Account & Start Writing'}
        </button>

        <hr className="auth-divider" />
        <p className="auth-switch">Already a member? <Link to="/login">Sign in</Link></p>
      </div>
    </div>
  );
}

export default Register;
