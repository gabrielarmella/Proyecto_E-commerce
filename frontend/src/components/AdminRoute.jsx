import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function AdminRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) return <p className="px-4 py-8 text-center text-slate-600">Cargando...</p>;
  if (!user) return <Navigate to="/login" replace />;

  // Ajustá esto según tu backend (role / isAdmin)
  const isAdmin = user?.role === "admin" || user?.isAdmin === true;

  if (!isAdmin) return <Navigate to="/" replace />;

  return children;
}
