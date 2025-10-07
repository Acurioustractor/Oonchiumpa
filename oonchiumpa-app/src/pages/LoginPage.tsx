import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import LoginForm from "../components/LoginForm";

const LoginPage: React.FC = () => {
  const { isAuthenticated } = useAuth();

  // If already authenticated, redirect to staff portal
  if (isAuthenticated()) {
    return <Navigate to="/staff-portal" replace />;
  }

  return (
    <LoginForm
      onSuccess={() => {
        // Navigation will be handled by the redirect above
      }}
    />
  );
};

export default LoginPage;
