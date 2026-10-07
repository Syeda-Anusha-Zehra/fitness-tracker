import React from "react";
import { Link } from "react-router-dom";
import PublicNavbar from "../components/PublicNavbar";

const FEATURES = [
  { icon: "🥗", title: "Nutrition Tracking", description: "Log meals, hit your macros, and see daily totals as clear progress rings." },
  { icon: "🏋️", title: "Workout Logging", description: "Track every exercise — sets, reps, weight — and watch your training add up over the week." },
  { icon: "🎯", title: "Goal Setting", description: "Set a target, update your progress, and get notified the moment you hit it." },
  { icon: "⏰", title: "Reminders", description: "Nudges for workouts, meals, and water so nothing slips through the cracks." },
];

export default function Landing() {
  return (
    <div className="public-page">
      <PublicNavbar />

      <section className="landing-hero">
        <div className="landing-hero-copy">
          <span className="landing-badge">⚡ Track everything in one place</span>
          <h1>
            PRIORITIZE<br />
            <span className="landing-accent">YOUR HEALTH</span>
          </h1>
          <p className="landing-quote">"Your mind will quit a thousand times before your body will."</p>
          <p className="landing-subtext">
            Nutrition, workouts, and goals — tracked together, so you always know
            exactly where you stand.
          </p>
          <div className="landing-cta-row">
            <Link to="/register" className="public-btn public-btn-solid">Start Training →</Link>
            <Link to="/login" className="public-btn public-btn-outline">Log In</Link>
          </div>

          <div className="landing-stats-row">
            <div><h3>50K+</h3><p>Active Users</p></div>
            <div><h3>120+</h3><p>Workout Plans</p></div>
            <div><h3>98%</h3><p>Success Rate</p></div>
          </div>
        </div>

        <div className="landing-hero-image">
          <img
            src="https://images.unsplash.com/photo-1672344048213-76b6e77304bd?fm=jpg&q=80&w=1200&fit=crop&auto=format"
            alt="Athlete training in the gym"
            loading="lazy"
          />
        </div>
      </section>

      <section className="landing-features">
        {FEATURES.map((f) => (
          <div className="landing-feature-card" key={f.title}>
            <div className="about-value-icon">{f.icon}</div>
            <h3>{f.title}</h3>
            <p>{f.description}</p>
          </div>
        ))}
      </section>

      <section className="landing-about">
        <h2>About Fitness Tracker</h2>
        <p>
          We built this because juggling separate apps for nutrition, workouts,
          and goals never quite worked. Fitness Tracker keeps all three in one
          place — under your own private account — so you can see the full
          picture instead of three disconnected ones.
        </p>
        <Link to="/about" className="landing-about-link">Read our full story →</Link>
      </section>

      <section className="about-cta">
        <h2>Ready to Get Started?</h2>
        <p>Create a free account and log your first workout today.</p>
        <Link to="/register" className="public-btn public-btn-solid">Get Started Free</Link>
      </section>

      <footer className="public-footer">
        <p>© 2026 Fitness Tracker. All rights reserved.</p>
      </footer>
    </div>
  );
}
