import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function GuestRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <p className="px-4 py-8 text-center text-slate-600">
        Cargando sesión...
      </p>
    );
  }

  if (user) return <Navigate to="/" replace />;

  return children;
}
