import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export function RoleRoute({ allowedRoles, redirectTo = "/app/dashboard" }) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div className="page-state">Loading your workspace...</div>;
  }

  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate replace to={redirectTo} />;
  }

  return <Outlet />;
}
