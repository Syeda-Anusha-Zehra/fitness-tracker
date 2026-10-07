import React, { useState } from "react";
import { downloadReport } from "../api/reportApi";

export default function Reports() {
  const [type, setType] = useState("fitness");
  const [format, setFormat] = useState("pdf");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleDownload = async (e) => {
    e.preventDefault();
    setDownloading(true);
    setError("");
    setMessage("");
    try {
      await downloadReport({ type, format, startDate, endDate });
      setMessage("Report downloaded.");
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to generate report.");
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="page-container">
      <div className="page-hero">
        <span className="hero-mark" aria-hidden="true">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
            <path d="M6 3h9l5 5v13a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z" stroke="currentColor" strokeWidth="1.4" />
            <path d="M14 3v5h5" stroke="currentColor" strokeWidth="1.4" />
            <path d="M8 13h8M8 17h8M8 9h3" stroke="currentColor" strokeWidth="1.4" />
          </svg>
        </span>
        <h1>Reports</h1>
        <p>Export your fitness progress or nutrition summary as a PDF or CSV.</p>
      </div>

      {message && <div className="success-banner">{message}</div>}
      {error && <div className="error-banner">{error}</div>}

      <form className="nutrition-form" onSubmit={handleDownload}>
        <div className="form-row">
          <label>Report Type</label>
          <div className="gender-options">
            <label className={`gender-pill ${type === "fitness" ? "active" : ""}`}>
              <input type="radio" checked={type === "fitness"} onChange={() => setType("fitness")} />
              Fitness Progress
            </label>
            <label className={`gender-pill ${type === "nutrition" ? "active" : ""}`}>
              <input type="radio" checked={type === "nutrition"} onChange={() => setType("nutrition")} />
              Nutrition Summary
            </label>
          </div>
          <span className="settings-hint">
            {type === "fitness" ? "Includes workouts (with exercises) and all your goals." : "Includes nutrition entries and their totals."}
          </span>
        </div>

        <div className="form-row">
          <label>Export Format</label>
          <div className="gender-options">
            <label className={`gender-pill ${format === "pdf" ? "active" : ""}`}>
              <input type="radio" checked={format === "pdf"} onChange={() => setFormat("pdf")} />
              PDF
            </label>
            <label className={`gender-pill ${format === "csv" ? "active" : ""}`}>
              <input type="radio" checked={format === "csv"} onChange={() => setFormat("csv")} />
              CSV
            </label>
          </div>
        </div>

        <div className="form-grid">
          <div className="form-row">
            <label>From (optional)</label>
            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
          </div>
          <div className="form-row">
            <label>To (optional)</label>
            <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
          </div>
        </div>
        <span className="settings-hint">Leave dates blank to include everything.</span>

        <div className="form-actions">
          <button type="submit" disabled={downloading}>{downloading ? "Generating..." : "Download Report"}</button>
        </div>
      </form>
    </div>
  );
}
