import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole: "student" | "staff" | "admin";
}

const ProtectedRoute = ({ children, requiredRole }: ProtectedRouteProps) => {
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("userRole");

  if (!token) {
    // Redirect unauthenticated users to the appropriate login page
    if (requiredRole === "admin") return <Navigate to="/admin-login" replace />;
    if (requiredRole === "staff") return <Navigate to="/staff-login" replace />;
    return <Navigate to="/login" replace />;
  }

  if (userRole !== requiredRole) {
    // Redirect users without the correct role to their assigned dashboard if possible, 
    // or back to login if role is unknown
    if (userRole === "admin") return <Navigate to="/admin" replace />;
    if (userRole === "staff") return <Navigate to="/staff" replace />;
    if (userRole === "student") return <Navigate to="/student" replace />;
    
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
