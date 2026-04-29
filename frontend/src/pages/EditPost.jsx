import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { postAPI } from '../utils/api';
import { CATEGORIES, errMsg } from '../utils/helpers';

function EditPost() {
  const { id }   = useParams();
  const navigate = useNavigate();
  const [form,    setForm]    = useState(null);
  const [error,   setError]   = useState('');
  const [saving,  setSaving]  = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await postAPI.getOne(id);
        setForm({
          title:       data.title,
          content:     data.content,
          excerpt:     data.excerpt || '',
          coverImage:  data.coverImage || '',
          category:    data.category,
          tags:        data.tags?.join(', ') || '',
        });
      } catch (e) { setError(errMsg(e)); }
      finally { setLoading(false); }
    })();
  }, [id]);

  const set = (f) => (e) => setForm(p => ({ ...p, [f]: e.target.value }));

  const handleSave = async () => {
    if (!form.title.trim()) { setError('Title is required.'); return; }
    if (!form.content.trim()) { setError('Content is required.'); return; }
    setSaving(true); setError('');
    try {
      const payload = { ...form, tags: form.tags ? form.tags.split(',').map(t => t.trim()).filter(Boolean) : [] };
      await postAPI.update(id, payload);
      navigate(`/post/${id}`);
    } catch (e) { setError(errMsg(e)); setSaving(false); }
  };

  if (loading) return <div className="spinner" />;
  if (!form)   return <div className="write-page"><div className="alert alert-error">{error || 'Post not found.'}</div></div>;

  return (
    <div className="write-page">
      <h1 className="write-title"><em>Edit</em> Story</h1>

      {error && <div className="form-error">{error}</div>}

      <div className="write-toolbar">
        <select className="form-select" style={{ width: 'auto' }} value={form.category} onChange={set('category')}>
          {CATEGORIES.filter(c => c !== 'All').map(c => <option key={c}>{c}</option>)}
        </select>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button className="btn btn-outline btn-sm" onClick={() => navigate(`/post/${id}`)}>Cancel</button>
          <button className="btn btn-accent btn-sm" onClick={handleSave} disabled={saving}>
            {saving ? 'Saving…' : 'Save Changes'}
          </button>
        </div>
      </div>

      <div className="form-group" style={{ marginBottom: '20px' }}>
        <input className="title-input" placeholder="Your story title…" value={form.title} onChange={set('title')} maxLength={160} />
      </div>

      <div className="form-group">
        <label className="form-label">Cover Image URL</label>
        <input className="form-input" type="url" placeholder="https://…" value={form.coverImage} onChange={set('coverImage')} />
      </div>

      {form.coverImage && (
        <img src={form.coverImage} alt="Cover" style={{ width: '100%', aspectRatio: '16/5', objectFit: 'cover', borderRadius: 'var(--radius-lg)', marginBottom: '20px' }} onError={(e) => { e.target.style.display='none'; }} />
      )}

      <div className="form-group">
        <label className="form-label">Content</label>
        <textarea className="content-input" value={form.content} onChange={set('content')} rows={20} placeholder="Tell your story…" />
      </div>

      <div className="form-group">
        <label className="form-label">Excerpt</label>
        <textarea className="form-input" rows={2} value={form.excerpt} onChange={set('excerpt')} style={{ minHeight: 'unset' }} />
      </div>

      <div className="form-group">
        <label className="form-label">Tags <span style={{ color: 'var(--ink4)', textTransform: 'none', fontWeight: 400 }}>(comma separated)</span></label>
        <input className="form-input" placeholder="react, javascript" value={form.tags} onChange={set('tags')} />
      </div>
    </div>
  );
}

export default EditPost;
