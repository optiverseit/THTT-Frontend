import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";
import { useAuth } from "../../context/AuthContext";

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: string[];
}

const ProtectedRoute = ({
  children,
  allowedRoles,
}: ProtectedRouteProps) => {
  // Use AuthContext state (not raw localStorage) so React re-renders immediately
  // when logout() is called — no timing issues with async localStorage reads.
  const { isLoggedIn } = useAuth();
  const role = localStorage.getItem("role");

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  if (
    allowedRoles &&
    (!role || !allowedRoles.includes(role))
  ) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;