import React from "react";
import { NavLink } from "react-router-dom";

export default function PublicNavbar() {
  return (
    <nav className="public-navbar">
      <div className="public-navbar-inner">
        <NavLink to="/" className="public-brand">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M13 2 4 14h6l-1 8 9-12h-6l1-8Z" fill="currentColor" />
          </svg>
          Fitness Tracker
        </NavLink>

        <div className="public-nav-links">
          <NavLink to="/" end className={({ isActive }) => (isActive ? "public-nav-link active" : "public-nav-link")}>
            Home
          </NavLink>
          <NavLink to="/about" className={({ isActive }) => (isActive ? "public-nav-link active" : "public-nav-link")}>
            About
          </NavLink>
          <NavLink to="/contact" className={({ isActive }) => (isActive ? "public-nav-link active" : "public-nav-link")}>
            Contact
          </NavLink>
        </div>

        <div className="public-nav-actions">
          <NavLink to="/login" className="public-btn public-btn-outline">Login</NavLink>
          <NavLink to="/register" className="public-btn public-btn-solid">Start Training</NavLink>
        </div>
      </div>
    </nav>
  );
}
