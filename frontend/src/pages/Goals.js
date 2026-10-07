import React, { useEffect, useState, useCallback, useRef } from "react";
import AddGoalForm from "../components/Goals/AddGoalForm";
import GoalCard from "../components/Goals/GoalCard";
import { fetchGoals, createGoal, updateGoal, deleteGoal } from "../api/goalApi";

export default function Goals() {
  const [goals, setGoals] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const formRef = useRef(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await fetchGoals();
      setGoals(data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load goals.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  useEffect(() => {
    if ((showForm || editingGoal) && formRef.current) {
      formRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [showForm, editingGoal]);

  const handleCreate = async (payload) => {
    setSubmitting(true);
    setError("");
    try {
      await createGoal(payload);
      setShowForm(false);
      await load();
      return true;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create goal.");
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  const handleSaveEdit = async (payload) => {
    setSubmitting(true);
    setError("");
    try {
      await updateGoal(editingGoal._id, payload);
      setEditingGoal(null);
      await load();
      return true;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update goal.");
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this goal?")) return;
    try {
      await deleteGoal(id);
      await load();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete goal.");
    }
  };

  const openAdd = () => {
    setEditingGoal(null);
    setShowForm((s) => !s);
  };

  const openEdit = (goal) => {
    setShowForm(false);
    setEditingGoal(goal);
  };

  return (
    <div className="page-container">
      <div className="page-hero">
        <span className="hero-mark" aria-hidden="true">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.4" />
            <circle cx="12" cy="12" r="4.5" stroke="currentColor" strokeWidth="1.4" />
            <circle cx="12" cy="12" r="1" fill="currentColor" />
          </svg>
        </span>
        <h1>Goals</h1>
        <p>Set targets for weight, running, workouts and more — and track progress over time.</p>
        <button onClick={openAdd}>{showForm ? "Close" : "Add Goal"}</button>
      </div>

      {error && <div className="error-banner">{error}</div>}

      {showForm && <div ref={formRef}><AddGoalForm onSubmit={handleCreate} onCancel={() => setShowForm(false)} submitting={submitting} /></div>}
      {editingGoal && (
        <div ref={formRef}>
          <AddGoalForm
            initialGoal={editingGoal}
            onSubmit={handleSaveEdit}
            onCancel={() => setEditingGoal(null)}
            submitting={submitting}
          />
        </div>
      )}

      {loading ? (
        <p className="muted">Loading goals...</p>
      ) : (goals || []).length === 0 ? (
        <p className="muted">No goals yet. Add one to start tracking progress.</p>
      ) : (
        <div className="goals-grid">
          {(goals || []).map((goal) => (
            <GoalCard
              key={goal._id}
              goal={goal}
              onDelete={handleDelete}
              onEdit={openEdit}
            />
          ))}
        </div>
      )}
    </div>
  );
}
