import { useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { checkDueReminders } from "../api/reminderApi";

const CHECK_INTERVAL_MS = 30000; // 30 seconds

function pad(n) {
  return String(n).padStart(2, "0");
}

export default function ReminderPoller() {
  const { isAuthenticated, user } = useAuth();
  const intervalRef = useRef(null);

  useEffect(() => {
    if (!isAuthenticated) return undefined;

    // Ask for browser notification permission once, so a fired reminder can
    // pop up even if the person isn't looking at the Notifications page.
    if (user?.notificationsEnabled !== false && "Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }

    const runCheck = async () => {
      const now = new Date();
      const time = `${pad(now.getHours())}:${pad(now.getMinutes())}`;
      const date = now.toISOString().slice(0, 10);

      try {
        const triggered = await checkDueReminders(time, date);
        if (
          triggered?.length &&
          user?.notificationsEnabled !== false &&
          "Notification" in window &&
          Notification.permission === "granted"
        ) {
          triggered.forEach(({ notification }) => {
            new Notification(notification.title, { body: notification.message });
          });
        }
      } catch {
        // Silent - this is a background check, not a user-initiated action
      }
    };

    runCheck();
    intervalRef.current = setInterval(runCheck, CHECK_INTERVAL_MS);

    return () => clearInterval(intervalRef.current);
  }, [isAuthenticated, user?.notificationsEnabled]);

  return null;
}
