import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { postAPI } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { fmtDate, errMsg, renderContent } from '../utils/helpers';
import CommentSection from '../components/CommentSection';

function PostDetail() {
  const { id }    = useParams();
  const navigate  = useNavigate();
  const { user }  = useAuth();
  const [post,    setPost]    = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState('');
  const [liked,   setLiked]   = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [deleting, setDeleting]   = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await postAPI.getOne(id);
        setPost(data);
        setLikeCount(data.likes?.length || 0);
        setLiked(user ? data.likes?.includes(user._id) : false);
      } catch (e) { setError(errMsg(e)); }
      finally { setLoading(false); }
    })();
  }, [id, user]);

  const handleLike = async () => {
    if (!user) { navigate('/login'); return; }
    try {
      const { data } = await postAPI.like(id);
      setLiked(data.liked);
      setLikeCount(data.likes);
    } catch { /* ignore */ }
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this post? This cannot be undone.')) return;
    setDeleting(true);
    try {
      await postAPI.delete(id);
      navigate('/');
    } catch (e) { alert(errMsg(e)); setDeleting(false); }
  };

  if (loading) return <div className="spinner" />;
  if (error)   return <div className="container" style={{ padding: '60px 24px' }}><div className="alert alert-error">{error}</div></div>;
  if (!post)   return null;

  const isAuthor = user?._id === post.author?._id;

  return (
    <article className="post-detail">
      {/* Cover */}
      <img
        src={post.coverImage}
        alt={post.title}
        className="post-detail-cover"
        onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800'; }}
      />

      {/* Category */}
      <div className="post-detail-cat">{post.category}</div>

      {/* Title */}
      <h1 className="post-detail-title">{post.title}</h1>

      {/* Byline */}
      <div className="post-detail-byline">
        <img
          src={post.author?.avatar}
          alt={post.author?.name}
          className="post-detail-avatar"
          onError={(e) => { e.target.src = `https://ui-avatars.com/api/?name=${post.author?.name?.[0]}&background=2d2d2d&color=fff`; }}
        />
        <div className="post-detail-byline-info">
          <div className="post-detail-byline-name">{post.author?.name}</div>
          <div className="post-detail-byline-meta">
            {fmtDate(post.createdAt)} · {post.readTime} min read
          </div>
        </div>

        <div className="post-detail-actions">
          <button className={`like-btn ${liked ? 'liked' : ''}`} onClick={handleLike}>
            {liked ? '♥' : '♡'} {likeCount}
          </button>
          {isAuthor && (
            <>
              <button className="btn btn-outline btn-sm" onClick={() => navigate(`/edit/${id}`)}>Edit</button>
              <button className="btn btn-danger btn-sm" onClick={handleDelete} disabled={deleting}>
                {deleting ? '…' : 'Delete'}
              </button>
            </>
          )}
        </div>
      </div>

      {/* Content */}
      <div
        className="post-content"
        dangerouslySetInnerHTML={{ __html: renderContent(post.content) }}
      />

      {/* Tags */}
      {post.tags?.length > 0 && (
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '32px' }}>
          {post.tags.map(t => <span key={t} className="tag-pill">#{t}</span>)}
        </div>
      )}

      {/* Comments */}
      <CommentSection postId={id} />
    </article>
  );
}

export default PostDetail;
