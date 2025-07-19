import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import logo from './logo.png';

const Navbar = () => {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="bg-[#0C1023] text-white px-4 py-3 shadow-md">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <img src={logo} alt="Logo" className="h-9 w-20" />
          <span className="text-xl font-bold bg-gradient-to-r from-purple-500 to-indigo-500 bg-clip-text text-transparent">
            No Tip Fund Raiser
          </span>
        </Link>

        {/* Hamburger Toggle */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="sm:hidden text-white focus:outline-none"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {menuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>

        {/* Desktop Nav */}
        <div className="hidden sm:flex items-center space-x-4 text-sm font-medium">
          {user ? (
            <>
              <Link to="/about" className="hover:text-purple-400 transition">About</Link>
              <span className="text-gray-300 hidden sm:inline">Hi, {user.name}</span>
              <Link to="/dashboard" className="hover:text-purple-400 transition">Dashboard</Link>
              <Link to="/register-campaign" className="hover:text-purple-400 transition">Register Campaign</Link>
              {user.role === 'admin' && (
                <Link to="/admin" className="hover:text-purple-400 transition">Admin</Link>
              )}
              <button
                onClick={logout}
                className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-purple-400 transition">Login</Link>
              <Link to="/register" className="hover:text-purple-400 transition">Register</Link>
              <Link to="/about" className="hover:text-purple-400 transition">About</Link>
            </>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="sm:hidden mt-4 space-y-3 text-sm font-medium">
          {user ? (
            <>
              <Link to="/about" className="hover:text-purple-400 transition">About</Link>
              <p className="px-2 text-gray-400">Hi, {user.name}</p>
              <Link to="/dashboard" className="block px-2 hover:text-purple-400" onClick={() => setMenuOpen(false)}>Dashboard</Link>
              <Link to="/register-campaign" className="block px-2 hover:text-purple-400" onClick={() => setMenuOpen(false)}>Register Campaign</Link>
              {user.role === 'admin' && (
                <Link to="/admin" className="block px-2 hover:text-purple-400" onClick={() => setMenuOpen(false)}>Admin</Link>
              )}
              <button
                onClick={() => {
                  logout();
                  setMenuOpen(false);
                }}
                className="block px-2 text-left text-red-400 hover:text-red-600"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="block px-2 hover:text-purple-400" onClick={() => setMenuOpen(false)}>Login</Link>
              <Link to="/register" className="block px-2 hover:text-purple-400" onClick={() => setMenuOpen(false)}>Register</Link>
              <Link to="/about" className="hover:text-purple-400 transition">About</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
