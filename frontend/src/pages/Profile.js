import React, { useState } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { displayWeight, displayHeight, toStoredWeight, toStoredHeight, weightUnitLabel, heightUnitLabel } from "../utils/units";

export default function Profile() {
  const { user, updateUser } = useAuth();
  const units = user?.units || "metric";

  const [form, setForm] = useState({
    name: user?.name || "",
    gender: user?.gender || "",
    age: user?.age ?? "",
    height: user?.height != null ? displayHeight(user.height, units) : "",
    weight: user?.weight != null ? displayWeight(user.weight, units) : "",
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");
    setError("");

    if (!form.name.trim()) {
      setError("Name cannot be empty.");
      setSaving(false);
      return;
    }
    if (!form.gender) {
      setError("Please select a gender.");
      setSaving(false);
      return;
    }

    // Use explicit "is it blank" checks (not truthiness) so a value like 0 isn't
    // accidentally dropped, and only send fields the user actually filled in.
    // Height/weight are converted back to cm/kg for storage regardless of
    // which unit the person is viewing/entering in.
    const payload = {
      name: form.name.trim(),
      gender: form.gender,
      age: form.age !== "" ? Number(form.age) : undefined,
      height: form.height !== "" ? toStoredHeight(Number(form.height), units) : undefined,
      weight: form.weight !== "" ? toStoredWeight(Number(form.weight), units) : undefined,
    };

    try {
      const { data } = await api.put("/users/me", payload);
      // Confirm against the server's copy rather than trusting the local form,
      // so what's shown always matches what's actually saved in MongoDB.
      const { data: me } = await api.get("/auth/me");
      updateUser(me.user);
      setForm({
        name: me.user.name || "",
        gender: me.user.gender || "",
        age: me.user.age ?? "",
        height: me.user.height != null ? displayHeight(me.user.height, units) : "",
        weight: me.user.weight != null ? displayWeight(me.user.weight, units) : "",
      });
      setMessage("Profile updated successfully.");
    } catch (err) {
      if (!err.response) {
        setError("Could not reach the server. Is the backend running?");
      } else {
        setError(err.response.data?.message || "Failed to update profile.");
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="page-container">
      <div className="page-hero">
        <h1>Profile</h1>
        <p>Your personal details, used across Nutrition and Goals.</p>
      </div>

      {message && <div className="success-banner">{message}</div>}
      {error && <div className="error-banner">{error}</div>}

      <form className="nutrition-form" onSubmit={handleSubmit}>
        <div className="form-row">
          <label>Email (cannot be changed)</label>
          <input type="email" value={user?.email || ""} disabled />
        </div>

        <div className="form-row">
          <label>Name</label>
          <input type="text" name="name" value={form.name} onChange={handleChange} />
        </div>

        <div className="form-row">
          <label>Gender</label>
          <div className="gender-options">
            <label className={`gender-pill ${form.gender === "Male" ? "active" : ""}`}>
              <input type="radio" name="gender" value="Male" checked={form.gender === "Male"} onChange={handleChange} />
              Male
            </label>
            <label className={`gender-pill ${form.gender === "Female" ? "active" : ""}`}>
              <input type="radio" name="gender" value="Female" checked={form.gender === "Female"} onChange={handleChange} />
              Female
            </label>
          </div>
        </div>

        <div className="form-grid">
          <div className="form-row">
            <label>Age</label>
            <input type="number" name="age" min="10" max="120" value={form.age} onChange={handleChange} />
          </div>
          <div className="form-row">
            <label>Height ({heightUnitLabel(units)})</label>
            <input type="number" name="height" min="0" value={form.height} onChange={handleChange} />
          </div>
          <div className="form-row">
            <label>Weight ({weightUnitLabel(units)})</label>
            <input type="number" name="weight" min="0" value={form.weight} onChange={handleChange} />
          </div>
        </div>

        <p className="settings-hint">
          Units are set in Settings — currently {units === "imperial" ? "Imperial (lb, in)" : "Metric (kg, cm)"}.
        </p>

        <div className="form-actions">
          <button type="submit" disabled={saving}>{saving ? "Saving..." : "Save Changes"}</button>
        </div>
      </form>
    </div>
  );
}
