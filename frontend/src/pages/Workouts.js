import React, { useEffect, useState, useCallback, useRef } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
} from "recharts";
import WorkoutForm from "../components/Workouts/WorkoutForm";
import WorkoutCard from "../components/Workouts/WorkoutCard";
import ProgressRing from "../components/ProgressRing";
import { fetchWorkouts, createWorkout, updateWorkout, deleteWorkout, fetchWorkoutWeeklySummary } from "../api/workoutApi";

const CATEGORIES = ["All", "Strength", "Cardio", "Flexibility", "HIIT", "Yoga", "Other"];
const CATEGORY_COLORS = { Strength: "#c6f135", Cardio: "#ff7a3d", Flexibility: "#4da6ff", HIIT: "#ff5c5c", Yoga: "#9a9a92", Other: "#8fd12a" };
const weekdayLabel = (dateStr) => new Date(dateStr + "T00:00:00").toLocaleDateString(undefined, { weekday: "short" });

export default function Workouts() {
  const [workouts, setWorkouts] = useState([]);
  const [weekly, setWeekly] = useState(null);
  const [category, setCategory] = useState("All");
  const [showForm, setShowForm] = useState(false);
  const [editingWorkout, setEditingWorkout] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const formRef = useRef(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [workoutsData, weeklyData] = await Promise.all([
        fetchWorkouts({ category }),
        fetchWorkoutWeeklySummary(7),
      ]);
      setWorkouts(workoutsData);
      setWeekly(weeklyData);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load workouts.");
    } finally {
      setLoading(false);
    }
  }, [category]);

  useEffect(() => { load(); }, [load]);

  useEffect(() => {
    if ((showForm || editingWorkout) && formRef.current) {
      formRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [showForm, editingWorkout]);

  const handleCreate = async (payload) => {
    setSubmitting(true);
    setError("");
    try {
      await createWorkout(payload);
      setShowForm(false);
      await load();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create workout.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleSaveEdit = async (payload) => {
    setSubmitting(true);
    setError("");
    try {
      await updateWorkout(editingWorkout._id, payload);
      setEditingWorkout(null);
      await load();
      return true;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update workout.");
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this workout?")) return;
    try {
      await deleteWorkout(id);
      await load();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete workout.");
    }
  };

  const openAdd = () => {
    setEditingWorkout(null);
    setShowForm((s) => !s);
  };

  const openEdit = (workout) => {
    setShowForm(false);
    setEditingWorkout(workout);
  };

  const totalThisWeek = (weekly?.days || []).reduce((sum, d) => sum + d.count, 0);
  const totalMinutes = (weekly?.days || []).reduce((sum, d) => sum + d.minutes, 0);
  const activeDays = (weekly?.days || []).filter((d) => d.count > 0).length;
  const categoriesLogged = (weekly?.byCategory || []).length;

  const chartData = (weekly?.days || []).map((d) => ({ ...d, label: weekdayLabel(d.date) }));
  const categoryData = (weekly?.byCategory || []).map((c) => ({ ...c, fill: CATEGORY_COLORS[c.category] || "#c6f135" }));

  return (
    <div className="page-container">
      <div className="page-hero">
        <span className="hero-mark" aria-hidden="true">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
            <path d="M13 2 4 14h6l-1 8 9-12h-6l1-8Z" fill="currentColor" />
          </svg>
        </span>
        <h1>Workouts</h1>
        <p>Log strength, cardio, and everything in between — exercises, sets, reps, and weight.</p>
        <button onClick={openAdd}>{showForm ? "Close" : "Add Workout"}</button>
      </div>

      {error && <div className="error-banner">{error}</div>}

      {showForm && <div ref={formRef}><WorkoutForm onSubmit={handleCreate} onCancel={() => setShowForm(false)} submitting={submitting} /></div>}
      {editingWorkout && (
        <div ref={formRef}>
          <WorkoutForm
            initialWorkout={editingWorkout}
            onSubmit={handleSaveEdit}
            onCancel={() => setEditingWorkout(null)}
            submitting={submitting}
          />
        </div>
      )}

      {/* Weekly graphs, matching the Nutrition page's ring + chart pattern */}
      {!loading && weekly && (
        <>
          <div className="ring-stats-row">
            <ProgressRing id="wk-count" value={totalThisWeek} max={Math.max(totalThisWeek, 7)} centerText={totalThisWeek} sublabel="workouts" label="This week" />
            <ProgressRing id="wk-minutes" value={totalMinutes} max={Math.max(totalMinutes, 300)} centerText={totalMinutes} sublabel="minutes" label="Time trained" />
            <ProgressRing id="wk-days" value={activeDays} max={7} centerText={`${activeDays}/7`} sublabel="days" label="Active days" />
            <ProgressRing id="wk-cats" value={categoriesLogged} max={Math.max(categoriesLogged, 1)} centerText={categoriesLogged} sublabel="types" label="Categories" />
          </div>

          <div className="charts-row">
            <div className="chart-card">
              <h3>Workouts — last 7 days</h3>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={chartData} margin={{ top: 8, right: 12, left: -12, bottom: 0 }}>
                  <CartesianGrid stroke="rgba(255,255,255,0.08)" vertical={false} />
                  <XAxis dataKey="label" tick={{ fontSize: 12, fill: "#9a9a92" }} axisLine={false} tickLine={false} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: "#9a9a92" }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{ borderRadius: 12, background: "#171715", border: "1px solid rgba(255,255,255,0.12)", fontFamily: "Inter" }}
                    labelStyle={{ color: "#f2f2ec" }}
                    itemStyle={{ color: "#c6f135" }}
                  />
                  <Bar dataKey="count" radius={[8, 8, 0, 0]} fill="#c6f135" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="chart-card">
              <h3>Categories this week</h3>
              {categoryData.length > 0 ? (
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={categoryData} margin={{ top: 8, right: 12, left: -12, bottom: 0 }}>
                    <CartesianGrid stroke="rgba(255,255,255,0.08)" vertical={false} />
                    <XAxis dataKey="category" tick={{ fontSize: 11, fill: "#9a9a92" }} axisLine={false} tickLine={false} />
                    <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: "#9a9a92" }} axisLine={false} tickLine={false} />
                    <Tooltip
                      contentStyle={{ borderRadius: 12, background: "#171715", border: "1px solid rgba(255,255,255,0.12)", fontFamily: "Inter" }}
                      labelStyle={{ color: "#f2f2ec" }}
                      itemStyle={{ color: "#c6f135" }}
                    />
                    <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                      {categoryData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <p className="muted">No workouts logged this week yet.</p>
              )}
            </div>
          </div>
        </>
      )}

      <div className="filter-group">
        {CATEGORIES.map((c) => (
          <button key={c} className={category === c ? "chip active" : "chip"} onClick={() => setCategory(c)} type="button">
            {c}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="muted">Loading workouts...</p>
      ) : (workouts || []).length === 0 ? (
        <p className="muted">No workouts logged yet.</p>
      ) : (
        <div className="goals-grid">
          {(workouts || []).map((w) => (
            <WorkoutCard key={w._id} workout={w} onEdit={openEdit} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </div>
  );
}
