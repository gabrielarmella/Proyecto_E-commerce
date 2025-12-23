import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ErrorAlert from "../components/ErrorAlert";

export default function RegisterPage() {
  const { register } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    setMsg("");
    setLoading(true);
    try {
      await register(form);
      setMsg("Registro exitoso, ahora inicia sesión");
      setTimeout(() => navigate("/login"), 800);
    } catch (err) {
      setMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white shadow rounded p-4">
      <h1 className="text-xl font-semibold mb-3">Registro</h1>
      <ErrorAlert message={msg} />
      <form onSubmit={onSubmit} className="space-y-3">
        <input
          className="border px-3 py-2 rounded w-full"
          placeholder="Nombre"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
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
          {loading ? "Creando..." : "Crear cuenta"}
        </button>
      </form>
      <p className="mt-3 text-sm">
        ¿Ya tienes cuenta?{" "}
        <Link to="/login" className="text-indigo-600">
          Inicia sesión
        </Link>
      </p>
    </div>
  );
}
