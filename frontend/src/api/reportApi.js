import api from "./axios";

export const downloadReport = async ({ type, format, startDate, endDate }) => {
  const params = { type, format };
  if (startDate) params.startDate = startDate;
  if (endDate) params.endDate = endDate;

  const response = await api.get("/reports/export", { params, responseType: "blob" });

  // With responseType "blob", an error response (JSON) also comes back as a
  // blob instead of throwing - detect and surface it properly.
  if (response.data.type === "application/json") {
    const text = await response.data.text();
    const parsed = JSON.parse(text);
    throw new Error(parsed.message || "Failed to generate report.");
  }

  const mime = format === "pdf" ? "application/pdf" : "text/csv";
  const blob = new Blob([response.data], { type: mime });
  const url = window.URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = `${type === "nutrition" ? "nutrition-summary" : "fitness-progress"}.${format}`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
};
