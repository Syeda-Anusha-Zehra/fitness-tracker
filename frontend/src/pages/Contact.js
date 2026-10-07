import React, { useState } from "react";
import PublicNavbar from "../components/PublicNavbar";
import { sendContactMessage } from "../api/contactApi";

const SUBJECTS = ["Feedback", "Bug Report", "Feature Request", "General Inquiry", "Support"];

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", subject: "Feedback", message: "" });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      await sendContactMessage(form);
      setSubmitted(true);
      setForm({ name: "", email: "", subject: "Feedback", message: "" });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send message.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="public-page">
      <PublicNavbar />

      <div className="about-hero">
        <h1>Contact Us</h1>
        <p>Have a question, suggestion, or bug to report? We'd love to hear from you.</p>
      </div>

      <div className="contact-container">
        <div className="contact-form-section">
          <h2>Send us a Message</h2>

          {error && <div className="error-banner">{error}</div>}

          {submitted ? (
            <div className="success-message">
              <div className="success-icon">✅</div>
              <h3>Message Sent!</h3>
              <p>Thanks for reaching out — we'll get back to you soon.</p>
              <button className="secondary" onClick={() => setSubmitted(false)}>Send another</button>
            </div>
          ) : (
            <form className="nutrition-form" onSubmit={handleSubmit}>
              <div className="form-row">
                <label>Full Name</label>
                <input type="text" name="name" value={form.name} onChange={handleChange} required />
              </div>
              <div className="form-row">
                <label>Email Address</label>
                <input type="email" name="email" value={form.email} onChange={handleChange} required />
              </div>
              <div className="form-row">
                <label>Subject</label>
                <select name="subject" value={form.subject} onChange={handleChange}>
                  {SUBJECTS.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div className="form-row">
                <label>Message</label>
                <input type="text" name="message" value={form.message} onChange={handleChange} required />
              </div>
              <div className="form-actions">
                <button type="submit" disabled={submitting}>{submitting ? "Sending..." : "Send Message"}</button>
              </div>
            </form>
          )}
        </div>

        <div className="contact-info-section">
          <h2>Get in Touch</h2>
          <div className="contact-info-list">
            <div className="contact-info-item"><span>📧</span><div><h4>Email</h4><p>support@fitnesstracker.app</p></div></div>
            <div className="contact-info-item"><span>📍</span><div><h4>Location</h4><p>Remote-first team</p></div></div>
            <div className="contact-info-item"><span>🕒</span><div><h4>Hours</h4><p>Mon - Fri: 9:00 AM - 6:00 PM</p></div></div>
          </div>
        </div>
      </div>

      <footer className="public-footer">
        <p>© 2026 Fitness Tracker. All rights reserved.</p>
      </footer>
    </div>
  );
}
