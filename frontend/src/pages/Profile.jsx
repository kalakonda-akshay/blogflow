import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { authAPI, postAPI } from '../utils/api';
import { fmtDate, fmtDateShort, errMsg } from '../utils/helpers';
import { useNavigate } from 'react-router-dom';

function Profile() {
  const { user, updateUser, logout } = useAuth();
  const navigate = useNavigate();
  const [posts,    setPosts]    = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [editing,  setEditing]  = useState(false);
  const [form,     setForm]     = useState({ name: user?.name || '', bio: user?.bio || '' });
  const [saving,   setSaving]   = useState(false);
  const [msg,      setMsg]      = useState('');
  const [error,    setError]    = useState('');

  useEffect(() => {
    if (!user) return;
    (async () => {
      try {
        const { data } = await postAPI.getAll({ author: user._id, limit: 50 });
        setPosts(data.posts);
      } finally { setLoading(false); }
    })();
  }, [user]);

  const set = (f) => (e) => setForm(p => ({ ...p, [f]: e.target.value }));

  const handleSave = async () => {
    setSaving(true); setMsg(''); setError('');
    try {
      const { data } = await authAPI.updateProfile(form);
      updateUser(data.user);
      setMsg('Profile updated!');
      setEditing(false);
    } catch (e) { setError(errMsg(e)); }
    finally { setSaving(false); }
  };

  const handleDeletePost = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm('Delete this post?')) return;
    try {
      await postAPI.delete(id);
      setPosts(p => p.filter(x => x._id !== id));
    } catch (e) { alert(errMsg(e)); }
  };

  if (!user) return null;

  return (
    <div className="profile-page">
      {/* Header */}
      <div className="profile-header">
        <img
          src={user.avatar}
          alt={user.name}
          className="profile-avatar-lg"
          onError={(e) => { e.target.src = `https://ui-avatars.com/api/?name=${user.name[0]}&background=2d2d2d&color=fff&size=128`; }}
        />
        <div style={{ flex: 1 }}>
          {editing ? (
            <div>
              {error && <div className="form-error" style={{ marginBottom: '10px' }}>{error}</div>}
              {msg   && <div className="form-success" style={{ marginBottom: '10px' }}>{msg}</div>}
              <div className="form-group">
                <label className="form-label">Name</label>
                <input className="form-input" value={form.name} onChange={set('name')} />
              </div>
              <div className="form-group">
                <label className="form-label">Bio</label>
                <input className="form-input" placeholder="A few words about you…" value={form.bio} onChange={set('bio')} />
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button className="btn btn-primary btn-sm" onClick={handleSave} disabled={saving}>{saving ? 'Saving…' : 'Save'}</button>
                <button className="btn btn-outline btn-sm" onClick={() => setEditing(false)}>Cancel</button>
              </div>
            </div>
          ) : (
            <>
              <div className="profile-name">{user.name}</div>
              <div className="profile-bio">{user.bio || 'No bio yet.'}</div>
              <div className="profile-joined">Member since {fmtDate(user.createdAt || new Date())}</div>
              {msg && <div className="alert alert-success" style={{ marginTop: '10px' }}>{msg}</div>}
              <div style={{ display: 'flex', gap: '8px', marginTop: '14px' }}>
                <button className="btn btn-outline btn-sm" onClick={() => setEditing(true)}>Edit Profile</button>
                <button className="btn btn-ghost btn-sm" style={{ color: 'var(--accent)' }} onClick={() => { logout(); navigate('/'); }}>Logout</button>
              </div>
            </>
          )}
        </div>

        <div style={{ textAlign: 'center', background: 'var(--paper2)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '20px 28px' }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '32px', fontWeight: 900 }}>{posts.length}</div>
          <div style={{ fontSize: '12px', color: 'var(--ink4)', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Posts</div>
        </div>
      </div>

      {/* Posts */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '22px', fontWeight: 700 }}>Your Stories</h2>
        <button className="btn btn-accent btn-sm" onClick={() => navigate('/write')}>+ Write New</button>
      </div>

      {loading ? (
        <div className="spinner" />
      ) : posts.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">✍️</div>
          <div className="empty-title">Nothing written yet</div>
          <p style={{ marginBottom: '16px' }}>Your stories will appear here.</p>
          <button className="btn btn-accent" onClick={() => navigate('/write')}>Write Your First Post</button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
          {posts.map((p) => (
            <div
              key={p._id}
              style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px 0', borderBottom: '1px solid var(--paper3)', cursor: 'pointer' }}
              onClick={() => navigate(`/post/${p._id}`)}
            >
              <img
                src={p.coverImage}
                alt={p.title}
                style={{ width: '72px', height: '54px', objectFit: 'cover', borderRadius: 'var(--radius)', flexShrink: 0 }}
                onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=200'; }}
              />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 600, fontSize: '15px', marginBottom: '4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.title}</div>
                <div style={{ fontSize: '12px', color: 'var(--ink4)' }}>{fmtDateShort(p.createdAt)} · {p.category} · {p.readTime} min read · 💬 {p.commentCount || 0}</div>
              </div>
              <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
                <button
                  className="btn btn-outline btn-sm"
                  onClick={(e) => { e.stopPropagation(); navigate(`/edit/${p._id}`); }}
                >Edit</button>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={(e) => handleDeletePost(p._id, e)}
                >Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Profile;
