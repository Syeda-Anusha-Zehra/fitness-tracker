import React, { useState } from "react";

const CATEGORIES = ["Strength", "Cardio", "Flexibility", "HIIT", "Yoga", "Other"];
const emptyExercise = () => ({ name: "", sets: "", reps: "", weight: "", notes: "" });

const toDateInput = (date) => (date ? new Date(date).toISOString().slice(0, 10) : new Date().toISOString().slice(0, 10));

export default function WorkoutForm({ initialWorkout, onSubmit, onCancel, submitting }) {
  const [title, setTitle] = useState(initialWorkout?.title || "");
  const [category, setCategory] = useState(initialWorkout?.category || "Strength");
  const [date, setDate] = useState(toDateInput(initialWorkout?.date));
  const [durationMinutes, setDurationMinutes] = useState(initialWorkout?.durationMinutes ?? "");
  const [exercises, setExercises] = useState(
    initialWorkout?.exercises?.length
      ? initialWorkout.exercises.map((e) => ({ name: e.name, sets: e.sets, reps: e.reps, weight: e.weight ?? "", notes: e.notes || "" }))
      : [emptyExercise()]
  );
  const [tagsText, setTagsText] = useState((initialWorkout?.tags || []).join(", "));
  const [notes, setNotes] = useState(initialWorkout?.notes || "");
  const [errors, setErrors] = useState([]);

  const updateExercise = (i, field, value) =>
    setExercises((prev) => prev.map((ex, idx) => (idx === i ? { ...ex, [field]: value } : ex)));

  const addExercise = () => setExercises((prev) => [...prev, emptyExercise()]);
  const removeExercise = (i) => setExercises((prev) => (prev.length === 1 ? prev : prev.filter((_, idx) => idx !== i)));

  const validate = () => {
    const errs = [];
    if (!title.trim() || title.trim().length < 2) errs.push("Title must be at least 2 characters.");
    if (!date) errs.push("Date is required.");
    exercises.forEach((ex, i) => {
      if (!ex.name.trim()) errs.push(`Exercise #${i + 1}: name is required.`);
      if (!ex.sets || Number(ex.sets) < 1) errs.push(`Exercise #${i + 1}: sets must be at least 1.`);
      if (!ex.reps || Number(ex.reps) < 1) errs.push(`Exercise #${i + 1}: reps must be at least 1.`);
    });
    setErrors(errs);
    return errs.length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const payload = {
      title: title.trim(),
      category,
      date,
      durationMinutes: durationMinutes === "" ? 0 : Number(durationMinutes),
      exercises: exercises.map((ex) => ({
        name: ex.name.trim(),
        sets: Number(ex.sets),
        reps: Number(ex.reps),
        weight: ex.weight === "" ? 0 : Number(ex.weight),
        notes: ex.notes?.trim() || "",
      })),
      tags: tagsText.split(",").map((t) => t.trim()).filter(Boolean),
      notes: notes.trim(),
    };

    onSubmit(payload);
  };

  return (
    <form className="nutrition-form" onSubmit={handleSubmit} noValidate>
      <h3>{initialWorkout ? "Update Workout" : "Add Workout"}</h3>

      {errors.length > 0 && (
        <div className="error-banner">
          {errors.map((e, i) => <div key={i}>{e}</div>)}
        </div>
      )}

      <div className="form-row">
        <label>Title</label>
        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Push day" />
      </div>

      <div className="form-grid">
        <div className="form-row">
          <label>Category</label>
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div className="form-row">
          <label>Date</label>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </div>
        <div className="form-row">
          <label>Duration (min)</label>
          <input type="number" min="0" value={durationMinutes} onChange={(e) => setDurationMinutes(e.target.value)} />
        </div>
      </div>

      <div className="form-row">
        <label>Exercises</label>
        {exercises.map((ex, i) => (
          <div className="exercise-row" key={i}>
            <input type="text" placeholder="Exercise name" value={ex.name} onChange={(e) => updateExercise(i, "name", e.target.value)} />
            <input type="number" placeholder="Sets" min="1" value={ex.sets} onChange={(e) => updateExercise(i, "sets", e.target.value)} />
            <input type="number" placeholder="Reps" min="1" value={ex.reps} onChange={(e) => updateExercise(i, "reps", e.target.value)} />
            <input type="number" placeholder="Weight (kg)" min="0" value={ex.weight} onChange={(e) => updateExercise(i, "weight", e.target.value)} />
            <button type="button" className="secondary" onClick={() => removeExercise(i)} disabled={exercises.length === 1}>✕</button>
          </div>
        ))}
        <button type="button" className="secondary" onClick={addExercise}>+ Add exercise</button>
      </div>

      <div className="form-row">
        <label>Tags (comma separated)</label>
        <input type="text" value={tagsText} onChange={(e) => setTagsText(e.target.value)} placeholder="push, chest, gym" />
      </div>

      <div className="form-row">
        <label>Notes</label>
        <input type="text" value={notes} onChange={(e) => setNotes(e.target.value)} />
      </div>

      <div className="form-actions">
        <button type="submit" disabled={submitting}>{submitting ? "Saving..." : "Save Workout"}</button>
        <button type="button" className="secondary" onClick={onCancel} disabled={submitting}>Cancel</button>
      </div>
    </form>
  );
}
