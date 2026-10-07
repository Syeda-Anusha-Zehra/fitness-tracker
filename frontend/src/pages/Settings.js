import React, { useState } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

export default function Settings() {
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState({
    notificationsEnabled: user?.notificationsEnabled ?? true,
    units: user?.units || "metric",
    theme: user?.theme || "dark",
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");
    setError("");
    try {
      const { data } = await api.put("/users/me", form);
      updateUser(data.user);
      document.body.setAttribute("data-theme", data.user.theme);
      setMessage("Settings saved.");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save settings.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="page-container">
      <div className="page-hero">
        <h1>Settings</h1>
        <p>Personalize the app to fit how you work.</p>
      </div>

      {message && <div className="success-banner">{message}</div>}
      {error && <div className="error-banner">{error}</div>}

      <form className="nutrition-form" onSubmit={handleSubmit}>
        <div className="form-row">
          <label>Notifications</label>
          <div className="gender-options">
            <label className={`gender-pill ${form.notificationsEnabled ? "active" : ""}`}>
              <input
                type="radio"
                checked={form.notificationsEnabled === true}
                onChange={() => setForm((f) => ({ ...f, notificationsEnabled: true }))}
              />
              On
            </label>
            <label className={`gender-pill ${!form.notificationsEnabled ? "active" : ""}`}>
              <input
                type="radio"
                checked={form.notificationsEnabled === false}
                onChange={() => setForm((f) => ({ ...f, notificationsEnabled: false }))}
              />
              Off
            </label>
          </div>
          <span className="settings-hint">Get a browser notification when a reminder is due.</span>
        </div>

        <div className="form-row">
          <label>Units</label>
          <div className="gender-options">
            <label className={`gender-pill ${form.units === "metric" ? "active" : ""}`}>
              <input
                type="radio"
                checked={form.units === "metric"}
                onChange={() => setForm((f) => ({ ...f, units: "metric" }))}
              />
              Metric (kg, cm)
            </label>
            <label className={`gender-pill ${form.units === "imperial" ? "active" : ""}`}>
              <input
                type="radio"
                checked={form.units === "imperial"}
                onChange={() => setForm((f) => ({ ...f, units: "imperial" }))}
              />
              Imperial (lb, in)
            </label>
          </div>
          <span className="settings-hint">Applies to weight and height on your Profile.</span>
        </div>

        <div className="form-row">
          <label>Theme</label>
          <div className="gender-options">
            <label className={`gender-pill ${form.theme === "dark" ? "active" : ""}`}>
              <input
                type="radio"
                checked={form.theme === "dark"}
                onChange={() => setForm((f) => ({ ...f, theme: "dark" }))}
              />
              Dark
            </label>
            <label className={`gender-pill ${form.theme === "light" ? "active" : ""}`}>
              <input
                type="radio"
                checked={form.theme === "light"}
                onChange={() => setForm((f) => ({ ...f, theme: "light" }))}
              />
              Light
            </label>
          </div>
        </div>

        <div className="form-actions">
          <button type="submit" disabled={saving}>{saving ? "Saving..." : "Save Settings"}</button>
        </div>
      </form>
    </div>
  );
}
