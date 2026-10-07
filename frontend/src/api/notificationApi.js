import api from "./axios";

export const fetchNotifications = () => api.get("/notifications").then((res) => res.data.notifications);

export const markNotificationRead = (id) => api.put(`/notifications/${id}/read`).then((res) => res.data.notification);

export const markAllNotificationsRead = () => api.put("/notifications/read-all").then((res) => res.data);

export const deleteNotification = (id) => api.delete(`/notifications/${id}`).then((res) => res.data);
