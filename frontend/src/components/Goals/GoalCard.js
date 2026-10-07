import React from "react";

export default function GoalCard({ goal, onDelete, onEdit }) {
  return (
    <div className={`goal-card ${goal.completed ? "goal-completed" : ""}`}>
      <div className="goal-card-header">
        <div>
          <span className="goal-type-badge">{goal.type}</span>
          <h4>{goal.title}</h4>
        </div>
        <div className="goal-header-actions">
          <button className="link-edit" onClick={() => onEdit(goal)}>Update</button>
          <button className="link-danger" onClick={() => onDelete(goal._id)}>Delete</button>
        </div>
      </div>

      <div className="goal-progress-track">
        <div className="goal-progress-fill" style={{ width: `${goal.progress}%` }} />
      </div>
      <div className="goal-progress-label">
        <span>{goal.progress}% complete</span>
        <span>{goal.current}{goal.unit} of {goal.target}{goal.unit}</span>
      </div>

      {goal.completed && <div className="goal-badge-done">🎉 Goal achieved!</div>}

      {goal.notes && <p className="goal-notes">{goal.notes}</p>}
    </div>
  );
}
