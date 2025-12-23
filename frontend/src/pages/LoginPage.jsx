import { useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Loader from "../components/Loader";
import ErrorAlert from "../components/ErrorAlert";

export default function LoginPage() {
  const { login, loading, error, isAuthenticated } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const onSubmit = async (e) => {
    e.preventDefault();
    setMsg("");
    try {
      await login(form);
      navigate(from, { replace: true });
    } catch (err) {
      setMsg(err.message);
    }
  };

  if (loading && isAuthenticated) return <Loader />;
  return (
    <div className="max-w-md mx-auto bg-white shadow rounded p-4">
      <h1 className="text-xl font-semibold mb-3">Login</h1>
      <ErrorAlert message={error || msg} />
      <form onSubmit={onSubmit} className="space-y-3">
        <input
          className="border px-3 py-2 rounded w-full"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <input
          type="password"
          className="border px-3 py-2 rounded w-full"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        <button
          className="w-full bg-indigo-600 text-white px-4 py-2 rounded"
          disabled={loading}
        >
          {loading ? "Ingresando..." : "Ingresar"}
        </button>
      </form>
      <p className="mt-3 text-sm">
        ¿No tienes cuenta?{" "}
        <Link to="/register" className="text-indigo-600">
          Regístrate
        </Link>
      </p>
    </div>
  );
}
