import React, { useEffect, useState, useCallback } from "react";
import { fetchNotifications, markNotificationRead, markAllNotificationsRead, deleteNotification } from "../api/notificationApi";

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      setNotifications(await fetchNotifications());
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load notifications.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleRead = async (id) => {
    try {
      await markNotificationRead(id);
      await load();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update notification.");
    }
  };

  const handleReadAll = async () => {
    try {
      await markAllNotificationsRead();
      await load();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update notifications.");
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteNotification(id);
      await load();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete notification.");
    }
  };

  const unreadCount = (notifications || []).filter((n) => !n.read).length;

  return (
    <div className="page-container">
      <div className="page-hero">
        <span className="hero-mark" aria-hidden="true">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
            <path d="M12 4a5 5 0 0 0-5 5v3.5L5 16h14l-2-3.5V9a5 5 0 0 0-5-5Z" stroke="currentColor" strokeWidth="1.4" />
            <path d="M10 19a2 2 0 0 0 4 0" stroke="currentColor" strokeWidth="1.4" />
          </svg>
        </span>
        <h1>Notifications</h1>
        <p>Goal achievements and system updates land here.</p>
        {unreadCount > 0 && <button onClick={handleReadAll}>Mark all as read</button>}
      </div>

      {error && <div className="error-banner">{error}</div>}

      {loading ? (
        <p className="muted">Loading notifications...</p>
      ) : (notifications || []).length === 0 ? (
        <p className="muted">No notifications yet.</p>
      ) : (
        <div className="notifications-list">
          {(notifications || []).map((n) => (
            <div key={n._id} className={`notification-card ${n.read ? "" : "unread"}`}>
              <div>
                <strong>{n.title}</strong>
                <p>{n.message}</p>
                <span className="notification-time">{new Date(n.createdAt).toLocaleString()}</span>
              </div>
              <div className="notification-actions">
                {!n.read && <button className="secondary" onClick={() => handleRead(n._id)}>Mark read</button>}
                <button className="link-danger" onClick={() => handleDelete(n._id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
