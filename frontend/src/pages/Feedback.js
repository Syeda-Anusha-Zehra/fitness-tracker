import React, { useEffect, useState, useCallback } from "react";
import { fetchMyFeedback, submitFeedback } from "../api/feedbackApi";

const CATEGORIES = ["General", "Bug Report", "Feature Request", "Other"];

export default function Feedback() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [form, setForm] = useState({ rating: 5, category: "General", message: "" });

  const load = useCallback(async () => {
    setLoading(true);
    try {
      setHistory(await fetchMyFeedback());
    } catch {
      // non-fatal
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.message.trim()) return;
    setSubmitting(true);
    setError("");
    setMessage("");
    try {
      await submitFeedback(form);
      setForm({ rating: 5, category: "General", message: "" });
      setMessage("Thanks — your feedback has been recorded.");
      await load();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit feedback.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="page-container">
      <div className="page-hero">
        <h1>Feedback</h1>
        <p>Tell us what's working, what isn't, and what you'd like to see next.</p>
      </div>

      {message && <div className="success-banner">{message}</div>}
      {error && <div className="error-banner">{error}</div>}

      <form className="nutrition-form" onSubmit={handleSubmit}>
        <div className="form-row">
          <label>Rating</label>
          <div className="rating-picker">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                type="button"
                className={form.rating === n ? "rating-star active" : "rating-star"}
                onClick={() => setForm((f) => ({ ...f, rating: n }))}
              >
                ★
              </button>
            ))}
          </div>
        </div>

        <div className="form-row">
          <label>Category</label>
          <select value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}>
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        <div className="form-row">
          <label>Message</label>
          <input
            type="text"
            value={form.message}
            onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
            placeholder="What's on your mind?"
          />
        </div>

        <div className="form-actions">
          <button type="submit" disabled={submitting}>{submitting ? "Sending..." : "Submit Feedback"}</button>
        </div>
      </form>

      <div className="dashboard-section">
        <div className="dashboard-section-header"><h3>Your Past Feedback</h3></div>
        {loading ? (
          <p className="muted">Loading...</p>
        ) : (history || []).length === 0 ? (
          <p className="muted">You haven't submitted any feedback yet.</p>
        ) : (
          <div className="notifications-list">
            {(history || []).map((f) => (
              <div key={f._id} className="notification-card">
                <div>
                  <strong>{"★".repeat(f.rating)} — {f.category}</strong>
                  <p>{f.message}</p>
                  <span className="notification-time">{new Date(f.createdAt).toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
