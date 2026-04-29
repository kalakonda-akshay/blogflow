import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { commentAPI } from '../utils/api';
import { fmtDate, errMsg } from '../utils/helpers';
import { useNavigate } from 'react-router-dom';

function CommentSection({ postId }) {
  const { user }  = useAuth();
  const navigate  = useNavigate();
  const [comments,   setComments]   = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [text,       setText]       = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error,      setError]      = useState('');

  useEffect(() => {
    (async () => {
      try { const { data } = await commentAPI.getAll(postId); setComments(data); }
      finally { setLoading(false); }
    })();
  }, [postId]);

  const handleSubmit = async () => {
    if (!text.trim()) return;
    setSubmitting(true); setError('');
    try {
      const { data } = await commentAPI.add(postId, { content: text.trim() });
      setComments(prev => [...prev, data]); setText('');
    } catch (e) { setError(errMsg(e)); }
    finally { setSubmitting(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this comment?')) return;
    try { await commentAPI.delete(id); setComments(prev => prev.filter(c => c._id !== id)); }
    catch (e) { alert(errMsg(e)); }
  };

  return (
    <section className="comment-section">
      <h3 className="comment-section-title">{comments.length} Comment{comments.length !== 1 ? 's' : ''}</h3>
      {user ? (
        <div className="comment-form">
          {error && <div className="alert alert-error">{error}</div>}
          <textarea className="comment-textarea" placeholder="Share your thoughts…" value={text} onChange={(e) => setText(e.target.value)} maxLength={1000} />
          <div className="comment-form-footer">
            <span className="comment-char">{text.length}/1000</span>
            <button className="btn btn-sm btn-outline" onClick={() => setText('')}>Clear</button>
            <button className="btn btn-sm btn-accent" onClick={handleSubmit} disabled={submitting || !text.trim()}>
              {submitting ? 'Posting…' : 'Post Comment'}
            </button>
          </div>
        </div>
      ) : (
        <div style={{ background: 'var(--paper2)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', padding: '20px', textAlign: 'center', marginBottom: '28px' }}>
          <p style={{ color: 'var(--ink3)', marginBottom: '12px', fontStyle: 'italic' }}>Join the conversation</p>
          <button className="btn btn-primary btn-sm" onClick={() => navigate('/login')}>Login to Comment</button>
        </div>
      )}
      {loading ? <div className="spinner" /> : comments.length === 0 ? (
        <p className="comment-empty">No comments yet. Be the first!</p>
      ) : (
        <div className="comment-list">
          {comments.map((c) => (
            <div className="comment-item" key={c._id}>
              <img src={c.author?.avatar} alt={c.author?.name} className="comment-avatar"
                onError={(e) => { e.target.src = `https://ui-avatars.com/api/?name=${c.author?.name?.[0]}&background=2d2d2d&color=fff`; }} />
              <div className="comment-body">
                <div className="comment-header">
                  <span className="comment-author">{c.author?.name}</span>
                  <span className="comment-date">{fmtDate(c.createdAt)}</span>
                  {user?._id === c.author?._id && (
                    <button className="comment-delete" onClick={() => handleDelete(c._id)}>Delete</button>
                  )}
                </div>
                <p className="comment-text">{c.content}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default CommentSection;
