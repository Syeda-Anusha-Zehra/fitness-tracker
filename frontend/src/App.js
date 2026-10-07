import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";
import ReminderPoller from "./components/ReminderPoller";

import Landing from "./pages/Landing";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Goals from "./pages/Goals";
import Workouts from "./pages/Workouts";
import Profile from "./pages/Profile";
import Reminders from "./pages/Reminders";
import Notifications from "./pages/Notifications";
import Feedback from "./pages/Feedback";
import Settings from "./pages/Settings";
import Reports from "./pages/Reports";
import NutritionPage from "./components/Nutrition/NutritionPage";

import "./styles/theme.css";

const PUBLIC_PATHS = ["/", "/about", "/contact", "/login", "/register"];

function Layout({ children }) {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const isPublicPage = PUBLIC_PATHS.includes(location.pathname);

  return (
    <>
      {isAuthenticated && !isPublicPage && <Navbar />}
      {isAuthenticated && <ReminderPoller />}
      {children}
    </>
  );
}

function AppRoutes() {
  return (
    <Layout>
      <Routes>
        {/* Public marketing site */}
        <Route path="/" element={<Landing />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Authenticated app */}
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/nutrition" element={<ProtectedRoute><NutritionPage /></ProtectedRoute>} />
        <Route path="/workouts" element={<ProtectedRoute><Workouts /></ProtectedRoute>} />
        <Route path="/goals" element={<ProtectedRoute><Goals /></ProtectedRoute>} />
        <Route path="/reminders" element={<ProtectedRoute><Reminders /></ProtectedRoute>} />
        <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
        <Route path="/feedback" element={<ProtectedRoute><Feedback /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
        <Route path="/reports" element={<ProtectedRoute><Reports /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
}

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}
