import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Header.css';

const Header = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          <Link to="/" className="logo">
            <h1>News Dashboard</h1>
          </Link>
          <nav className="nav">
            <Link to="/" className="nav-link">Home</Link>
            {isAuthenticated ? (
              <>
                <Link to="/create" className="nav-link">Create Article</Link>
                <span className="user-info">Welcome, {user?.name}</span>
                <button onClick={handleLogout} className="btn btn-secondary">
                  Logout
                </button>
              </>
            ) : (
              <Link to="/login" className="btn btn-primary">Login</Link>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;



