import React, { useState } from "react";

const GOAL_TYPES = ["Weight Loss", "Weight Gain", "Muscle Gain", "Running", "Workout Frequency", "Calories", "Custom"];

const emptyForm = {
  title: "",
  type: "Weight Loss",
  start: "",
  target: "",
  current: "",
  unit: "",
  targetDate: "",
  notes: "",
};

const toFormState = (goal) =>
  goal
    ? {
        title: goal.title,
        type: goal.type,
        start: goal.start,
        target: goal.target,
        current: goal.current,
        unit: goal.unit || "",
        targetDate: goal.targetDate ? new Date(goal.targetDate).toISOString().slice(0, 10) : "",
        notes: goal.notes || "",
      }
    : emptyForm;

export default function AddGoalForm({ initialGoal, onSubmit, onCancel, submitting }) {
  const [form, setForm] = useState(toFormState(initialGoal));
  const [errors, setErrors] = useState({});

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const validate = () => {
    const next = {};
    if (!form.title.trim()) next.title = "Title is required.";
    if (form.start === "" || isNaN(Number(form.start))) next.start = "Enter a starting value.";
    if (form.target === "" || isNaN(Number(form.target))) next.target = "Enter a target value.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const payload = {
      ...form,
      title: form.title.trim(),
      start: Number(form.start),
      target: Number(form.target),
      current: form.current === "" ? Number(form.start) : Number(form.current),
      targetDate: form.targetDate || undefined,
    };

    onSubmit(payload).then((ok) => {
      if (ok && !initialGoal) setForm(emptyForm);
    });
  };

  return (
    <form className="nutrition-form" onSubmit={handleSubmit} noValidate>
      <h3>{initialGoal ? "Update Goal" : "Add Goal"}</h3>

      <div className="form-row">
        <label>Title</label>
        <input type="text" name="title" value={form.title} onChange={handleChange} placeholder="e.g. Lose 5kg by December" />
        {errors.title && <span className="field-error">{errors.title}</span>}
      </div>

      <div className="form-row">
        <label>Goal Type</label>
        <select name="type" value={form.type} onChange={handleChange}>
          {GOAL_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>

      <div className="form-grid">
        <div className="form-row">
          <label>Start Value</label>
          <input type="number" name="start" step="any" value={form.start} onChange={handleChange} />
          {errors.start && <span className="field-error">{errors.start}</span>}
        </div>
        <div className="form-row">
          <label>Target Value</label>
          <input type="number" name="target" step="any" value={form.target} onChange={handleChange} />
          {errors.target && <span className="field-error">{errors.target}</span>}
        </div>
        <div className="form-row">
          <label>Current Value</label>
          <input type="number" name="current" step="any" value={form.current} onChange={handleChange} placeholder="defaults to start" />
        </div>
        <div className="form-row">
          <label>Unit</label>
          <input type="text" name="unit" value={form.unit} onChange={handleChange} placeholder="kg, km, sessions..." />
        </div>
        <div className="form-row">
          <label>Target Date</label>
          <input type="date" name="targetDate" value={form.targetDate} onChange={handleChange} />
        </div>
      </div>

      <div className="form-row">
        <label>Notes</label>
        <input type="text" name="notes" value={form.notes} onChange={handleChange} />
      </div>

      <div className="form-actions">
        <button type="submit" disabled={submitting}>{submitting ? "Saving..." : "Save Goal"}</button>
        <button type="button" className="secondary" onClick={onCancel} disabled={submitting}>Cancel</button>
      </div>
    </form>
  );
}
