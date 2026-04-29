import React, { useState, useEffect, useCallback } from 'react';
import { postAPI } from '../utils/api';
import { CATEGORIES, errMsg } from '../utils/helpers';
import PostCard from '../components/PostCard';

function Home() {
  const [posts,    setPosts]    = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState('');
  const [search,   setSearch]   = useState('');
  const [category, setCategory] = useState('All');

  const fetchPosts = useCallback(async () => {
    setLoading(true); setError('');
    try {
      const params = {};
      if (search) params.search = search;
      if (category !== 'All') params.category = category;
      const { data } = await postAPI.getAll(params);
      setPosts(data.posts);
    } catch (e) { setError(errMsg(e)); }
    finally { setLoading(false); }
  }, [search, category]);

  useEffect(() => {
    const t = setTimeout(fetchPosts, 280);
    return () => clearTimeout(t);
  }, [fetchPosts]);

  const [featured, ...rest] = posts;

  return (
    <div className="container">
      <div className="masthead">
        <div className="masthead-eyebrow">Est. 2024</div>
        <h1 className="masthead-title">Blog<em>Flow</em></h1>
        <p className="masthead-sub">Stories worth reading. Voices worth hearing.</p>
        <div className="masthead-rule">
          <div className="masthead-rule-line" />
          <span className="masthead-rule-diamond">◆</span>
          <div className="masthead-rule-line" />
        </div>
      </div>

      <div className="main-layout" style={{ paddingTop: 0 }}>
        <main>
          <div className="filter-bar">
            <input className="filter-search" placeholder="Search stories…" value={search} onChange={(e) => setSearch(e.target.value)} />
            {CATEGORIES.map((c) => (
              <button key={c} className={`cat-chip ${category === c ? 'active' : ''}`} onClick={() => setCategory(c)}>{c}</button>
            ))}
          </div>

          {error && <div className="alert alert-error">{error}</div>}

          {loading ? (
            <div className="spinner" />
          ) : posts.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">✍️</div>
              <div className="empty-title">No stories yet</div>
              <p>Be the first to share something worth reading.</p>
            </div>
          ) : (
            <div className="posts-list">
              {featured && <PostCard post={featured} featured />}
              {rest.map((p) => <PostCard key={p._id} post={p} />)}
            </div>
          )}
        </main>

        <aside className="sidebar">
          <div className="sidebar-block">
            <div className="sidebar-cta">
              <h3>Start Writing</h3>
              <p>Share your ideas, stories, and expertise with our community.</p>
              <a href="/register"><button className="btn btn-accent btn-full btn-sm">Join BlogFlow</button></a>
            </div>
          </div>
          <div className="sidebar-block">
            <div className="sidebar-label">Browse Topics</div>
            <div className="sidebar-tag-cloud">
              {CATEGORIES.filter(c => c !== 'All').map((c) => (
                <span key={c} className="sidebar-tag" onClick={() => setCategory(c)}>{c}</span>
              ))}
            </div>
          </div>
          <div className="sidebar-block">
            <div className="sidebar-label">About BlogFlow</div>
            <p style={{ fontSize: '13px', color: 'var(--ink3)', lineHeight: 1.6, fontStyle: 'italic' }}>
              A platform for writers who care about craft. Write beautifully, share freely, connect genuinely.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}

export default Home;
