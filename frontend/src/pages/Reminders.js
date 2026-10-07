import React, { useEffect, useState, useCallback } from "react";
import { fetchReminders, createReminder, updateReminder, deleteReminder } from "../api/reminderApi";

const REMINDER_TYPES = ["workout", "meal", "water", "goal"];
const emptyForm = { type: "workout", title: "", message: "", reminderTime: "08:00", repeat: "daily" };

export default function Reminders() {
  const [reminders, setReminders] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      setReminders(await fetchReminders());
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load reminders.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    setSubmitting(true);
    setError("");
    try {
      await createReminder(form);
      setForm(emptyForm);
      setShowForm(false);
      await load();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create reminder.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggle = async (reminder) => {
    try {
      await updateReminder(reminder._id, { isActive: !reminder.isActive });
      await load();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update reminder.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this reminder?")) return;
    try {
      await deleteReminder(id);
      await load();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete reminder.");
    }
  };

  return (
    <div className="page-container">
      <div className="page-hero">
        <span className="hero-mark" aria-hidden="true">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
            <path d="M12 4a5 5 0 0 0-5 5v3.5L5 16h14l-2-3.5V9a5 5 0 0 0-5-5Z" stroke="currentColor" strokeWidth="1.4" />
            <path d="M10 19a2 2 0 0 0 4 0" stroke="currentColor" strokeWidth="1.4" />
          </svg>
        </span>
        <h1>Reminders</h1>
        <p>Nudges for workouts, meals, water, and goal check-ins.</p>
        <button onClick={() => setShowForm((s) => !s)}>{showForm ? "Close" : "Add Reminder"}</button>
      </div>

      {error && <div className="error-banner">{error}</div>}

      {showForm && (
        <form className="nutrition-form" onSubmit={handleSubmit}>
          <h3>Add Reminder</h3>
          <div className="form-row">
            <label>Title</label>
            <input type="text" name="title" value={form.title} onChange={handleChange} placeholder="e.g. Drink water" />
          </div>
          <div className="form-grid">
            <div className="form-row">
              <label>Type</label>
              <select name="type" value={form.type} onChange={handleChange}>
                {REMINDER_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div className="form-row">
              <label>Time</label>
              <input type="time" name="reminderTime" value={form.reminderTime} onChange={handleChange} />
            </div>
            <div className="form-row">
              <label>Repeat</label>
              <select name="repeat" value={form.repeat} onChange={handleChange}>
                <option value="once">Once</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
              </select>
            </div>
          </div>
          <div className="form-row">
            <label>Message (optional)</label>
            <input type="text" name="message" value={form.message} onChange={handleChange} />
          </div>
          <div className="form-actions">
            <button type="submit" disabled={submitting}>{submitting ? "Saving..." : "Save Reminder"}</button>
            <button type="button" className="secondary" onClick={() => setShowForm(false)}>Cancel</button>
          </div>
        </form>
      )}

      {loading ? (
        <p className="muted">Loading reminders...</p>
      ) : (reminders || []).length === 0 ? (
        <p className="muted">No reminders set yet.</p>
      ) : (
        <table className="nutrition-table">
          <thead>
            <tr><th>Time</th><th>Type</th><th>Title</th><th>Repeat</th><th>Active</th><th></th></tr>
          </thead>
          <tbody>
            {(reminders || []).map((r) => (
              <tr key={r._id}>
                <td>{r.reminderTime}</td>
                <td><span className="badge">{r.type}</span></td>
                <td>{r.title}</td>
                <td>{r.repeat}</td>
                <td>
                  <button className="secondary" onClick={() => handleToggle(r)}>
                    {r.isActive ? "On" : "Off"}
                  </button>
                </td>
                <td><button className="link-danger" onClick={() => handleDelete(r._id)}>Delete</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
