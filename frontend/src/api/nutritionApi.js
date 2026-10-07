import api from "./axios";

export const fetchNutrition = (filters = {}) => {
  const params = {};
  if (filters.mealType && filters.mealType !== "All") params.mealType = filters.mealType;
  if (filters.date) params.date = filters.date;
  if (filters.startDate) params.startDate = filters.startDate;
  if (filters.endDate) params.endDate = filters.endDate;
  if (filters.search) params.search = filters.search;
  return api.get("/nutrition", { params }).then((res) => res.data);
};

export const fetchDailyTotals = (date) =>
  api.get("/nutrition/summary/daily", { params: { date } }).then((res) => res.data);

export const fetchWeeklyTotals = (days = 7) =>
  api.get("/nutrition/summary/weekly", { params: { days } }).then((res) => res.data.days);

export const createNutrition = (payload) =>
  api.post("/nutrition", payload).then((res) => res.data);

export const updateNutrition = (id, payload) =>
  api.put(`/nutrition/${id}`, payload).then((res) => res.data);

export const deleteNutrition = (id) =>
  api.delete(`/nutrition/${id}`).then((res) => res.data);
