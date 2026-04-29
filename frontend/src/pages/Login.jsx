import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Login() {
  const { login } = useAuth();
  const navigate  = useNavigate();
  const [form,    setForm]    = useState({ email: '', password: '' });
  const [error,   setError]   = useState('');
  const [loading, setLoading] = useState(false);

  const set = (f) => (e) => setForm(p => ({ ...p, [f]: e.target.value }));

  const submit = async () => {
    setLoading(true); setError('');
    const res = await login(form);
    setLoading(false);
    if (res.error) { setError(res.error); return; }
    navigate('/');
  };

  const fillDemo = (e, p) => setForm({ email: e, password: p });

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">Blog<em>Flow</em></div>
        <p className="auth-tagline">Welcome back, writer.</p>

        {error && <div className="form-error">{error}</div>}

        <div className="form-group">
          <label className="form-label">Email</label>
          <input className="form-input" type="email" placeholder="you@example.com" value={form.email} onChange={set('email')} />
        </div>
        <div className="form-group">
          <label className="form-label">Password</label>
          <input className="form-input" type="password" placeholder="••••••••" value={form.password} onChange={set('password')} onKeyDown={(e) => e.key === 'Enter' && submit()} />
        </div>

        <button className="btn btn-primary btn-full" onClick={submit} disabled={loading} style={{ marginBottom: '12px' }}>
          {loading ? 'Signing in…' : 'Sign In'}
        </button>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button className="btn btn-outline btn-sm" style={{ flex: 1 }} onClick={() => fillDemo('alice@blogflow.com', 'pass1234')}>Alice (Demo)</button>
          <button className="btn btn-outline btn-sm" style={{ flex: 1 }} onClick={() => fillDemo('bob@blogflow.com',   'pass1234')}>Bob (Demo)</button>
        </div>

        <hr className="auth-divider" />
        <p className="auth-switch">No account? <Link to="/register">Start writing for free</Link></p>
      </div>
    </div>
  );
}

export default Login;
