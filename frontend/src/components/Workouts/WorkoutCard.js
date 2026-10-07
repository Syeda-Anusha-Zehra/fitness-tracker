import React from "react";

export default function WorkoutCard({ workout, onEdit, onDelete }) {
  return (
    <div className="goal-card">
      <div className="goal-card-header">
        <div>
          <span className="goal-type-badge">{workout.category}</span>
          <h4>{workout.title}</h4>
        </div>
        <div className="goal-header-actions">
          <button className="link-edit" onClick={() => onEdit(workout)}>Update</button>
          <button className="link-danger" onClick={() => onDelete(workout._id)}>Delete</button>
        </div>
      </div>

      <p className="workout-meta">
        {new Date(workout.date).toLocaleDateString()}
        {workout.durationMinutes ? ` · ${workout.durationMinutes} min` : ""}
      </p>

      <ul className="exercise-list">
        {workout.exercises.map((ex) => (
          <li key={ex._id}>
            <strong>{ex.name}</strong> — {ex.sets} × {ex.reps}{ex.weight ? ` @ ${ex.weight}kg` : ""}
          </li>
        ))}
      </ul>

      {workout.tags?.length > 0 && (
        <div className="workout-tags">
          {workout.tags.map((t) => <span key={t} className="workout-tag">#{t}</span>)}
        </div>
      )}

      {workout.notes && <p className="goal-notes">{workout.notes}</p>}
    </div>
  );
}
