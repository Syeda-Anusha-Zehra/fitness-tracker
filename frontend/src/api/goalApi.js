import api from "./axios";

export const fetchGoals = () => api.get("/goals").then((res) => res.data.goals);

export const createGoal = (payload) => api.post("/goals", payload).then((res) => res.data.goal);

export const updateGoal = (id, payload) => api.put(`/goals/${id}`, payload).then((res) => res.data.goal);

export const deleteGoal = (id) => api.delete(`/goals/${id}`).then((res) => res.data);
