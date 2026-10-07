import api from "./axios";

export const fetchMyFeedback = () => api.get("/feedback").then((res) => res.data.feedback);

export const submitFeedback = (payload) => api.post("/feedback", payload).then((res) => res.data.feedback);
