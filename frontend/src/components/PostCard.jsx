import React from 'react';
import { useNavigate } from 'react-router-dom';
import { fmtDateShort } from '../utils/helpers';

function PostCard({ post, featured = false }) {
  const navigate = useNavigate();
  return (
    <div className={`post-card ${featured ? 'featured' : ''}`} onClick={() => navigate(`/post/${post._id}`)}>
      <div className="post-card-body">
        <div className="post-card-meta">
          <span className="post-cat">{post.category}</span>
          <span className="post-meta-sep">·</span>
          <span className="post-date">{fmtDateShort(post.createdAt)}</span>
          <span className="post-meta-sep">·</span>
          <span className="post-read-time">{post.readTime} min read</span>
        </div>
        <h2 className="post-card-title">{post.title}</h2>
        <p className="post-card-excerpt">{post.excerpt}</p>
        <div className="post-card-author">
          <img src={post.author?.avatar} alt={post.author?.name} className="post-card-avatar"
            onError={(e) => { e.target.src = `https://ui-avatars.com/api/?name=${post.author?.name?.[0]}&background=2d2d2d&color=fff`; }} />
          <span className="post-card-author-name">{post.author?.name}</span>
          <div className="post-card-stats">
            <span className="post-stat">💬 {post.commentCount || 0}</span>
          </div>
        </div>
      </div>
      <div className="post-card-img-wrap">
        <img src={post.coverImage} alt={post.title} className="post-card-img"
          onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=400'; }} />
      </div>
    </div>
  );
}

export default PostCard;
