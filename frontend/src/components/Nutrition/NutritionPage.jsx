import React, { useEffect, useState, useCallback } from "react";
import AddNutritionForm from "./AddNutritionForm";
import NutritionFilters from "./NutritionFilters";
import NutritionList from "./NutritionList";
import DailyTotals from "./DailyTotals";
import {
  fetchNutrition,
  fetchDailyTotals,
  createNutrition,
  updateNutrition,
  deleteNutrition,
} from "../../api/nutritionApi";
import "../../styles/Nutrition.css";

const today = () => new Date().toISOString().slice(0, 10);

export default function NutritionPage() {
  const [records, setRecords] = useState([]);
  const [totals, setTotals] = useState(null);
  const [filters, setFilters] = useState({ mealType: "All" });
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [totalsDate, setTotalsDate] = useState(today());

  const loadRecords = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await fetchNutrition(filters);
      setRecords(data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load nutrition records.");
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const loadTotals = useCallback(async () => {
    try {
      const data = await fetchDailyTotals(totalsDate);
      setTotals(data);
    } catch (err) {
      // Non-fatal - totals card just won't show
    }
  }, [totalsDate]);

  useEffect(() => {
    loadRecords();
  }, [loadRecords]);

  useEffect(() => {
    loadTotals();
  }, [loadTotals]);

  const handleCreate = async (payload) => {
    setSubmitting(true);
    setError("");
    try {
      await createNutrition(payload);
      setShowForm(false);
      await loadRecords();
      if (payload.date === totalsDate) await loadTotals();
      return true;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save nutrition record.");
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdate = async (id, payload) => {
    setError("");
    try {
      await updateNutrition(id, payload);
      await loadRecords();
      await loadTotals();
      return true;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update nutrition record.");
      return false;
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this nutrition record?")) return;
    try {
      await deleteNutrition(id);
      await loadRecords();
      await loadTotals();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete nutrition record.");
    }
  };

  return (
    <div className="nutrition-page">
      <div className="nutrition-hero">
        <span className="hero-mark" aria-hidden="true">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
            <path d="M13 2 4 14h6l-1 8 9-12h-6l1-8Z" fill="currentColor" />
          </svg>
        </span>
        <h1>Nutrition</h1>
        <p>Log what you eat and see how each day adds up — calories, protein, carbs and fat, at a glance.</p>
        <div className="hero-add-btn">
          <button onClick={() => setShowForm((s) => !s)}>
            {showForm ? "Close" : "Add Nutrition"}
          </button>
        </div>
      </div>

      {error && <div className="error-banner">{error}</div>}

      {showForm && (
        <AddNutritionForm
          onSubmit={handleCreate}
          onCancel={() => setShowForm(false)}
          submitting={submitting}
        />
      )}

      <div className="totals-date-picker">
        <label>
          Totals for
          <input
            type="date"
            value={totalsDate}
            onChange={(e) => setTotalsDate(e.target.value)}
          />
        </label>
      </div>
      <DailyTotals totals={totals} date={totalsDate} />

      <NutritionFilters filters={filters} onChange={setFilters} />
      <NutritionList records={records} onDelete={handleDelete} onUpdate={handleUpdate} loading={loading} />
    </div>
  );
}
