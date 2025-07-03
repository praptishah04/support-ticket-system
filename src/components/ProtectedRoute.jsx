// components/ProtectedRoute.jsx
import React from "react";
import { Navigate, useLocation } from "react-router-dom";

export const ProtectedRoute = ({ children, requiredRole }) => {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));
  const location = useLocation();

  // If not logged in
  if (!token || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If a specific role is required and user doesn't have it
  if (requiredRole && user.role !== requiredRole) {
    return <div className="text-center text-red-600 font-semibold mt-12">❌ You are not authorized to view this page.</div>;
  }

  // Access granted
  return children;
};
