import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { getPostAuthRoute } from "../lib/auth";

export function PublicOnlyRoute() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div className="page-state">Loading...</div>;
  }

  if (user) {
    return <Navigate to={getPostAuthRoute(user)} replace />;
  }

  return <Outlet />;
}
