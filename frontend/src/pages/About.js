import React from "react";
import { Link } from "react-router-dom";
import PublicNavbar from "../components/PublicNavbar";

const STATS = [
  { number: "50K+", label: "Active Users" },
  { number: "1M+", label: "Workouts Tracked" },
  { number: "120+", label: "Workout Plans" },
  { number: "4.8★", label: "User Rating" },
];

const VALUES = [
  { icon: "🎯", title: "Our Mission", description: "Help people build consistent, sustainable training and nutrition habits through simple, honest tracking." },
  { icon: "👁️", title: "Our Vision", description: "Become the fitness hub people actually keep open — no clutter, no guesswork, just the numbers that matter." },
  { icon: "💎", title: "Our Values", description: "Simplicity, ownership of your data, and tools that respect your time." },
];

export default function About() {
  return (
    <div className="public-page">
      <PublicNavbar />

      <div className="about-hero">
        <h1>About Fitness Tracker</h1>
        <p>We build fitness tools that get out of your way so you can focus on the work.</p>
      </div>

      <div className="about-stats">
        {STATS.map((s) => (
          <div className="about-stat-card" key={s.label}>
            <h2>{s.number}</h2>
            <p>{s.label}</p>
          </div>
        ))}
      </div>

      <div className="about-section">
        <div className="about-values-grid">
          {VALUES.map((v) => (
            <div className="about-value-card" key={v.title}>
              <div className="about-value-icon">{v.icon}</div>
              <h3>{v.title}</h3>
              <p>{v.description}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="about-section">
        <div className="about-story">
          <h2>Our Story</h2>
          <p>
            Fitness Tracker started from a simple frustration: most fitness apps make you
            juggle three different tools for workouts, nutrition, and goals. We
            wanted one place that tracked all of it — without the noise.
          </p>
          <p>
            Under the hood it's a full MERN stack app: nutrition logging with
            daily totals, a workout tracker with sets/reps/weight per exercise,
            goal tracking with progress rings, and reminders — all scoped to
            your own private account.
          </p>
        </div>
      </div>

      <div className="about-cta">
        <h2>Ready to Start Your Journey?</h2>
        <p>Create an account and start logging your first workout today.</p>
        <Link to="/register" className="public-btn public-btn-solid">Get Started Free</Link>
      </div>

      <footer className="public-footer">
        <p>© 2026 Fitness Tracker. All rights reserved.</p>
      </footer>
    </div>
  );
}
