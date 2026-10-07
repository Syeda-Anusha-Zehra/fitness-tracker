import React, { useState, useRef, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    setMenuOpen(false);
    logout();
    navigate("/");
  };

  const goTo = (path) => {
    setMenuOpen(false);
    navigate(path);
  };

  return (
    <nav className="app-navbar">
      <div className="navbar-inner">
        <span className="navbar-brand">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M13 2 4 14h6l-1 8 9-12h-6l1-8Z" fill="currentColor" />
          </svg>
          Fitness Tracker
        </span>

        <div className="navbar-links">
          <NavLink to="/dashboard" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
            Dashboard
          </NavLink>
          <NavLink to="/nutrition" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
            Nutrition
          </NavLink>
          <NavLink to="/workouts" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
            Workouts
          </NavLink>
          <NavLink to="/goals" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
            Goals
          </NavLink>
          <NavLink to="/reminders" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
            Reminders
          </NavLink>
          <NavLink to="/reports" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")}>
            Reports
          </NavLink>
        </div>

        <div className="navbar-user" ref={menuRef}>
          <span className="navbar-username">{user?.name}</span>

          <button
            type="button"
            className="navbar-gear-btn"
            aria-label="Account settings"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((o) => !o)}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"
                stroke="currentColor"
                strokeWidth="1.6"
              />
              <path
                d="M19.4 13.5a1.7 1.7 0 0 0 .34 1.87l.06.06a2.06 2.06 0 1 1-2.92 2.92l-.06-.06a1.7 1.7 0 0 0-1.87-.34 1.7 1.7 0 0 0-1.03 1.56V19.6a2.06 2.06 0 1 1-4.12 0v-.09a1.7 1.7 0 0 0-1.11-1.56 1.7 1.7 0 0 0-1.87.34l-.06.06a2.06 2.06 0 1 1-2.92-2.92l.06-.06a1.7 1.7 0 0 0 .34-1.87 1.7 1.7 0 0 0-1.56-1.03H4.4a2.06 2.06 0 1 1 0-4.12h.09a1.7 1.7 0 0 0 1.56-1.11 1.7 1.7 0 0 0-.34-1.87l-.06-.06a2.06 2.06 0 1 1 2.92-2.92l.06.06a1.7 1.7 0 0 0 1.87.34H10.6A1.7 1.7 0 0 0 11.6 3.4V3.4a2.06 2.06 0 1 1 4.12 0v.09a1.7 1.7 0 0 0 1.03 1.56 1.7 1.7 0 0 0 1.87-.34l.06-.06a2.06 2.06 0 1 1 2.92 2.92l-.06.06a1.7 1.7 0 0 0-.34 1.87v.09a1.7 1.7 0 0 0 1.56 1.03h.09a2.06 2.06 0 1 1 0 4.12h-.09a1.7 1.7 0 0 0-1.56 1.03Z"
                stroke="currentColor"
                strokeWidth="1.1"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          {menuOpen && (
            <div className="navbar-dropdown">
              <button type="button" onClick={() => goTo("/profile")}>Profile</button>
              <button type="button" onClick={() => goTo("/notifications")}>Alerts</button>
              <button type="button" onClick={() => goTo("/feedback")}>Feedback</button>
              <button type="button" onClick={() => goTo("/settings")}>Settings</button>
              <div className="navbar-dropdown-divider" />
              <button type="button" className="navbar-dropdown-logout" onClick={handleLogout}>Log out</button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
