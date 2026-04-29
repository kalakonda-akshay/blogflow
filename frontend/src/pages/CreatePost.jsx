import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { postAPI } from '../utils/api';
import { CATEGORIES, errMsg } from '../utils/helpers';

const EMPTY = { title: '', content: '', excerpt: '', coverImage: '', category: 'Tech', tags: '' };

function CreatePost() {
  const navigate = useNavigate();
  const [form,     setForm]     = useState(EMPTY);
  const [error,    setError]    = useState('');
  const [saving,   setSaving]   = useState(false);
  const [preview,  setPreview]  = useState(false);

  const set = (f) => (e) => setForm(p => ({ ...p, [f]: e.target.value }));

  const handleSave = async () => {
    if (!form.title.trim()) { setError('Title is required.'); return; }
    if (!form.content.trim() || form.content.length < 10) { setError('Content must be at least 10 characters.'); return; }
    setSaving(true); setError('');
    try {
      const payload = {
        ...form,
        tags: form.tags ? form.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
      };
      const { data } = await postAPI.create(payload);
      navigate(`/post/${data._id}`);
    } catch (e) { setError(errMsg(e)); setSaving(false); }
  };

  return (
    <div className="write-page">
      <h1 className="write-title">New <em>Story</em></h1>

      {error && <div className="form-error">{error}</div>}

      {/* Toolbar */}
      <div className="write-toolbar">
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <select className="form-select" style={{ width: 'auto' }} value={form.category} onChange={set('category')}>
            {CATEGORIES.filter(c => c !== 'All').map(c => <option key={c}>{c}</option>)}
          </select>
          <button
            className={`btn btn-sm ${preview ? 'btn-accent' : 'btn-outline'}`}
            onClick={() => setPreview(p => !p)}
          >
            {preview ? 'Edit' : 'Preview'}
          </button>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button className="btn btn-outline btn-sm" onClick={() => navigate(-1)}>Cancel</button>
          <button className="btn btn-accent btn-sm" onClick={handleSave} disabled={saving}>
            {saving ? 'Publishing…' : 'Publish'}
          </button>
        </div>
      </div>

      {preview ? (
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '36px', fontWeight: 900, letterSpacing: '-1px', marginBottom: '24px', lineHeight: 1.1 }}>{form.title || 'Untitled'}</h1>
          <div
            className="post-content"
            dangerouslySetInnerHTML={{ __html: form.content.replace(/\n\n/g, '</p><p>').replace(/\n/g, '<br/>') }}
          />
        </div>
      ) : (
        <>
          <div className="form-group" style={{ marginBottom: '20px' }}>
            <input
              className="title-input"
              placeholder="Your story title…"
              value={form.title}
              onChange={set('title')}
              maxLength={160}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Cover Image URL <span style={{ color: 'var(--ink4)', textTransform: 'none', fontWeight: 400 }}>(optional)</span></label>
            <input className="form-input" type="url" placeholder="https://images.unsplash.com/…" value={form.coverImage} onChange={set('coverImage')} />
          </div>

          {form.coverImage && (
            <img
              src={form.coverImage}
              alt="Cover preview"
              style={{ width: '100%', aspectRatio: '16/5', objectFit: 'cover', borderRadius: 'var(--radius-lg)', marginBottom: '20px' }}
              onError={(e) => { e.target.style.display = 'none'; }}
            />
          )}

          <div className="form-group">
            <label className="form-label">Content</label>
            <textarea
              className="content-input"
              placeholder={`Tell your story…\n\nYou can use:\n## Heading\n**bold** *italic*\n\`\`\`code blocks\`\`\``}
              value={form.content}
              onChange={set('content')}
              rows={20}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Excerpt <span style={{ color: 'var(--ink4)', textTransform: 'none', fontWeight: 400 }}>(optional — auto-generated if blank)</span></label>
            <textarea className="form-input" rows={2} placeholder="A short summary shown on the homepage…" value={form.excerpt} onChange={set('excerpt')} style={{ minHeight: 'unset' }} />
          </div>

          <div className="form-group">
            <label className="form-label">Tags <span style={{ color: 'var(--ink4)', textTransform: 'none', fontWeight: 400 }}>(comma separated)</span></label>
            <input className="form-input" placeholder="react, javascript, webdev" value={form.tags} onChange={set('tags')} />
          </div>
        </>
      )}
    </div>
  );
}

export default CreatePost;
