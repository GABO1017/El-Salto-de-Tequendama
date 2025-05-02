import React from "react";
import { Navigate } from "react-router-dom";
import useAuthStore from "../src/services/auth";

const ProtectedRoute = ({ children }) => {
  const { user } = useAuthStore();

  if (!user) {
    // Si no está logueado, redirige a login
    return <Navigate to="/" replace />;
  }

  // Si está logueado, renderiza el contenido normalmente
  return children;
};

export default ProtectedRoute;
