import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
  Cell,
} from "recharts";
import { useAuth } from "../context/AuthContext";
import ProgressRing from "../components/ProgressRing";
import { fetchDailyTotals, fetchWeeklyTotals } from "../api/nutritionApi";
import { fetchGoals } from "../api/goalApi";
import { fetchReminders } from "../api/reminderApi";
import { fetchNotifications } from "../api/notificationApi";
import { fetchWorkoutWeeklySummary } from "../api/workoutApi";

const today = () => new Date().toISOString().slice(0, 10);
const weekdayLabel = (dateStr) =>
  new Date(dateStr + "T00:00:00").toLocaleDateString(undefined, { weekday: "short" });

export default function Dashboard() {
  const { user } = useAuth();
  const [totals, setTotals] = useState(null);
  const [weekly, setWeekly] = useState([]);
  const [workoutWeekly, setWorkoutWeekly] = useState(null);
  const [goals, setGoals] = useState([]);
  const [reminders, setReminders] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [totalsData, weeklyData, goalsData, remindersData, notificationsData, workoutWeeklyData] = await Promise.all([
          fetchDailyTotals(today()),
          fetchWeeklyTotals(7),
          fetchGoals(),
          fetchReminders(),
          fetchNotifications(),
          fetchWorkoutWeeklySummary(7),
        ]);
        setTotals(totalsData);
        setWeekly(weeklyData);
        setGoals(goalsData);
        setReminders(remindersData);
        setNotifications(notificationsData);
        setWorkoutWeekly(workoutWeeklyData);
      } catch {
        // Non-fatal — dashboard just shows what loaded successfully
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const activeGoals = (goals || []).filter((g) => !g.completed).slice(0, 3);
  const completedGoalsCount = (goals || []).filter((g) => g.completed).length;
  const activeReminders = (reminders || []).filter((r) => r.isActive).slice(0, 3);
  const unreadNotifications = (notifications || []).filter((n) => !n.read);

  const weeklyAvgCalories = (weekly || []).length
    ? Math.round((weekly || []).reduce((sum, d) => sum + d.calories, 0) / weekly.length)
    : 0;
  const daysLoggedThisWeek = (weekly || []).filter((d) => d.calories > 0).length;

  const chartData = (weekly || []).map((d) => ({ ...d, label: weekdayLabel(d.date) }));
  const workoutsThisWeek = (workoutWeekly?.days || []).reduce((sum, d) => sum + d.count, 0) || 0;
  const workoutChartData = (workoutWeekly?.days || []).map((d) => ({ ...d, label: weekdayLabel(d.date) }));
  const macroData = totals
    ? [
        { name: "Protein", value: totals.protein, fill: "#c6f135" },
        { name: "Carbs", value: totals.carbs, fill: "#ff7a3d" },
        { name: "Fat", value: totals.fat, fill: "#4da6ff" },
      ]
    : [];

  return (
    <div className="page-container">
      <div className="page-hero">
        <span className="hero-mark" aria-hidden="true">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
            <path d="M13 2 4 14h6l-1 8 9-12h-6l1-8Z" fill="currentColor" />
          </svg>
        </span>
        <h1>Welcome back, {user?.name?.split(" ")[0]}</h1>
        <p>Here's where things stand today.</p>
      </div>

      {loading ? (
        <p className="muted">Loading your overview...</p>
      ) : (
        <>
          {/* Ring stats, matching the Steps/Calories rings in the reference design */}
          <div className="ring-stats-row">
            <ProgressRing
              id="today-cal"
              value={totals?.calories ?? 0}
              max={2000}
              centerText={totals?.calories ?? 0}
              sublabel="kcal"
              label="Today"
            />
            <ProgressRing
              id="week-avg"
              value={weeklyAvgCalories}
              max={2000}
              centerText={weeklyAvgCalories}
              sublabel="kcal"
              label="7-day avg"
            />
            <ProgressRing
              id="days-logged"
              value={daysLoggedThisWeek}
              max={7}
              centerText={`${daysLoggedThisWeek}/7`}
              sublabel="days"
              label="Logged"
            />
            <ProgressRing
              id="goals-done"
              value={completedGoalsCount}
              max={(goals || []).length || 1}
              centerText={completedGoalsCount}
              sublabel="goals"
              label="Achieved"
            />
            <ProgressRing
              id="workouts-week"
              value={workoutsThisWeek}
              max={Math.max(workoutsThisWeek, 5)}
              centerText={workoutsThisWeek}
              sublabel="sessions"
              label="Workouts"
            />
          </div>

          {/* Charts */}
          <div className="charts-row">
            <div className="chart-card">
              <h3>Workouts — last 7 days</h3>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={workoutChartData} margin={{ top: 8, right: 12, left: -12, bottom: 0 }}>
                  <CartesianGrid stroke="rgba(255,255,255,0.08)" vertical={false} />
                  <XAxis dataKey="label" tick={{ fontSize: 12, fill: "#9a9a92" }} axisLine={false} tickLine={false} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: "#9a9a92" }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{ borderRadius: 12, background: "#171715", border: "1px solid rgba(255,255,255,0.12)", fontFamily: "Inter" }}
                    labelStyle={{ color: "#f2f2ec" }}
                    itemStyle={{ color: "#4da6ff" }}
                  />
                  <Bar dataKey="count" radius={[8, 8, 0, 0]} fill="#4da6ff" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="chart-card">
              <h3>Calories — last 7 days</h3>
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={chartData} margin={{ top: 8, right: 12, left: -12, bottom: 0 }}>
                  <CartesianGrid stroke="rgba(255,255,255,0.08)" vertical={false} />
                  <XAxis dataKey="label" tick={{ fontSize: 12, fill: "#9a9a92" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 12, fill: "#9a9a92" }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{ borderRadius: 12, background: "#171715", border: "1px solid rgba(255,255,255,0.12)", fontFamily: "Inter" }} labelStyle={{ color: "#f2f2ec" }} itemStyle={{ color: "#c6f135" }}
                  />
                  <Line type="monotone" dataKey="calories" stroke="#c6f135" strokeWidth={2.5} dot={{ r: 3, fill: "#c6f135" }} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="chart-card">
              <h3>Today's macros (g)</h3>
              {totals && totals.entries > 0 ? (
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart data={macroData} margin={{ top: 8, right: 12, left: -12, bottom: 0 }}>
                    <CartesianGrid stroke="rgba(255,255,255,0.08)" vertical={false} />
                    <XAxis dataKey="name" tick={{ fontSize: 12, fill: "#9a9a92" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 12, fill: "#9a9a92" }} axisLine={false} tickLine={false} />
                    <Tooltip
                      contentStyle={{ borderRadius: 12, background: "#171715", border: "1px solid rgba(255,255,255,0.12)", fontFamily: "Inter" }}
                      labelStyle={{ color: "#f2f2ec" }}
                      itemStyle={{ color: "#c6f135" }}
                    />
                    <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                      {macroData.map((entry, i) => (
                        <Cell key={i} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <p className="muted">No entries logged yet today.</p>
              )}
            </div>
          </div>

          <Link className="dashboard-cta-secondary" to="/nutrition">Log a meal →</Link>

          {/* Active goals */}
          <div className="dashboard-section">
            <div className="dashboard-section-header">
              <h3>Active Goals</h3>
              <Link to="/goals">View all →</Link>
            </div>
            {activeGoals.length === 0 ? (
              <p className="muted">No active goals. <Link to="/goals">Create one</Link> to start tracking.</p>
            ) : (
              <div className="goals-grid">
                {activeGoals.map((goal) => (
                  <div key={goal._id} className="goal-card">
                    <div className="goal-card-header">
                      <div>
                        <span className="goal-type-badge">{goal.type}</span>
                        <h4>{goal.title}</h4>
                      </div>
                    </div>
                    <div className="goal-progress-track">
                      <div className="goal-progress-fill" style={{ width: `${goal.progress}%` }} />
                    </div>
                    <div className="goal-progress-label">
                      <span>{goal.progress}% complete</span>
                      <span>{goal.current}{goal.unit} of {goal.target}{goal.unit}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Reminders + Notifications side by side */}
          <div className="dashboard-two-col">
            <div className="dashboard-section">
              <div className="dashboard-section-header">
                <h3>Upcoming Reminders</h3>
                <Link to="/reminders">View all →</Link>
              </div>
              {activeReminders.length === 0 ? (
                <p className="muted">No active reminders. <Link to="/reminders">Add one</Link>.</p>
              ) : (
                <ul className="mini-list">
                  {activeReminders.map((r) => (
                    <li key={r._id}>
                      <span className="mini-list-time">{r.reminderTime}</span> {r.title}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="dashboard-section">
              <div className="dashboard-section-header">
                <h3>Notifications {unreadNotifications.length > 0 && `(${unreadNotifications.length})`}</h3>
                <Link to="/notifications">View all →</Link>
              </div>
              {(notifications || []).length === 0 ? (
                <p className="muted">Nothing yet.</p>
              ) : (
                <ul className="mini-list">
                  {(notifications || []).slice(0, 3).map((n) => (
                    <li key={n._id} className={n.read ? "" : "mini-list-unread"}>{n.title}</li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
