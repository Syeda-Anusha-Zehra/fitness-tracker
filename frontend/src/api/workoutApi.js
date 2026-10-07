import api from "./axios";

export const fetchWorkoutCategories = () =>
  api.get("/workouts/meta/categories").then((res) => res.data.categories);

export const fetchWorkouts = (filters = {}) => {
  const params = {};
  if (filters.category && filters.category !== "All") params.category = filters.category;
  if (filters.search) params.search = filters.search;
  if (filters.startDate) params.startDate = filters.startDate;
  if (filters.endDate) params.endDate = filters.endDate;
  return api.get("/workouts", { params }).then((res) => res.data.workouts);
};

export const createWorkout = (payload) => api.post("/workouts", payload).then((res) => res.data.workout);

export const updateWorkout = (id, payload) => api.put(`/workouts/${id}`, payload).then((res) => res.data.workout);

export const deleteWorkout = (id) => api.delete(`/workouts/${id}`).then((res) => res.data);

export const fetchWorkoutWeeklySummary = (days = 7) =>
  api.get("/workouts/summary/weekly", { params: { days } }).then((res) => res.data);
