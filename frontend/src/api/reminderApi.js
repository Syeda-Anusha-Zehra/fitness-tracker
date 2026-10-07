import api from "./axios";

export const fetchReminders = () => api.get("/reminders").then((res) => res.data.reminders);

export const createReminder = (payload) => api.post("/reminders", payload).then((res) => res.data.reminder);

export const updateReminder = (id, payload) => api.put(`/reminders/${id}`, payload).then((res) => res.data.reminder);

export const deleteReminder = (id) => api.delete(`/reminders/${id}`).then((res) => res.data);

export const checkDueReminders = (time, date) =>
  api.get("/reminders/check-due", { params: { time, date } }).then((res) => res.data.triggered);
