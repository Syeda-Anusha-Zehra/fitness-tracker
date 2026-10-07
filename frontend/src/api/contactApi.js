import api from "./axios";

export const sendContactMessage = (payload) => api.post("/contact", payload).then((res) => res.data);
