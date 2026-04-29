import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-brand">Blog<em>Flow</em></Link>
        <div className="navbar-right">
          {user ? (
            <>
              <div className="nav-user">
                <img src={user.avatar} alt={user.name} className="nav-avatar"
                  onError={(e) => { e.target.src = `https://ui-avatars.com/api/?name=${user.name[0]}&background=2d2d2d&color=fff`; }} />
                <Link to="/profile" style={{ fontWeight: 500, fontSize: '13px', color: 'var(--ink2)' }}>{user.name.split(' ')[0]}</Link>
              </div>
              <div className="nav-divider" />
              <Link to="/write"><button className="nav-btn red">+ Write</button></Link>
              <button className="nav-btn" onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login"><button className="nav-btn">Login</button></Link>
              <Link to="/register"><button className="nav-btn primary">Get Started</button></Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
