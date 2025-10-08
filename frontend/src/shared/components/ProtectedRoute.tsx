import { Navigate, Outlet } from "react-router";
import { useAuthStore } from "@/modules/auth/store/useAuthStore";
import { useEffect, useState } from "react";

export const ProtectedRoute = () => {
  const { token } = useAuthStore();
  const [isChecking, setIsChecking] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const storedData = localStorage.getItem("auth-storage");
    if (storedData) {
      try {
        const parsed = JSON.parse(storedData);
        const storedToken = parsed?.state?.token;
        if (storedToken) {
          setIsAuthenticated(true);
        }
      } catch {
        setIsAuthenticated(false);
      }
    }

    if (token) {
      setIsAuthenticated(true);
    }

    setIsChecking(false);
  }, [token]);

  if (isChecking) {
    // 👇 puedes personalizar este loader si quieres
    return (
      <div className="w-full max-w-md px-6">
        <div className="bg-background-light dark:bg-subtle-dark/50 p-8 rounded-xl border border-subtle-light dark:border-subtle-dark">
          <div className="text-center mb-8">
            <p className="text-muted-light dark:text-muted-dark mt-2">Loading...</p>
          </div>
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-primary" />
        </div>
      </div>
    );
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};