import { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { useNavigate, Link } from "react-router-dom";

function RegisterPage() {
    const { register, error } = useAuth();
    const navigate = useNavigate();
    const [form, setForm] = useState({ name: "", email: "", password: ""});
    const [submitting, setSubmitting] = useState(false);

    const handleChange = (e) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value}));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        const res = await register (form.name, form.email, form.password);
        setSubmitting(false);
        if (res.success) navigate("/");
    };

    const handleGoogleRegister = () => {
        window.location.href = "http://localhost:3000/api/auth/google";
    };

    return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <h2 className="text-2xl font-semibold text-slate-900 mb-1">
          Crear cuenta
        </h2>
        <p className="text-sm text-slate-600 mb-6">
          Completa tus datos para registrarte en la tienda.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-slate-700 mb-1"
            >
              Nombre
            </label>
            <input
              id="name"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              className="block w-full rounded-md border border-slate-300 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-slate-700 mb-1"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              required
              className="block w-full rounded-md border border-slate-300 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-slate-700 mb-1"
            >
              Contraseña
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              required
              className="block w-full rounded-md border border-slate-300 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          {error && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full inline-flex items-center justify-center rounded-md bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {submitting ? "Creando cuenta..." : "Registrarse"}
          </button>
        </form>

        <p className="mt-4 text-xs text-slate-600">
          ¿Ya tenés cuenta?{" "}
          <Link
            to="/login"
            className="font-medium text-indigo-600 hover:text-indigo-700"
          >
            Iniciá sesión
          </Link>
        </p>
        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-200"></div>
          </div>
          <div className="relative flex justify-center text-xs">
            <span className="bg-white px-2 text-slate-500">o</span>
          </div>
        </div>

        {/* Google Register */}
        <button
          type="button"
          onClick={handleGoogleRegister}
          className="w-full inline-flex items-center justify-center gap-2 rounded-md border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          <svg width="18" height="18" viewBox="0 0 48 48">
            <path fill="#EA4335" d="M24 9.5c3.1 0 5.9 1.1 8.1 3.2l6-6C34.5 2.9 29.6 1 24 1 14.9 1 7.2 6.5 3.6 14.4l7 5.4C12.4 13.5 17.7 9.5 24 9.5z"/>
            <path fill="#4285F4" d="M46.5 24c0-1.6-.1-2.8-.4-4H24v8.1h12.7c-.6 3.1-2.4 5.8-5.1 7.6l7.8 6c4.6-4.2 7.1-10.4 7.1-17.7z"/>
            <path fill="#FBBC05" d="M10.6 28.4c-.5-1.5-.8-3.1-.8-4.8s.3-3.3.8-4.8l-7-5.4C1.4 16.7 0 20.2 0 24s1.4 7.3 3.6 10.6l7-5.4z"/>
            <path fill="#34A853" d="M24 47c5.6 0 10.3-1.9 13.7-5.2l-7.8-6c-2.1 1.4-4.8 2.2-7.9 2.2-6.3 0-11.6-4-13.5-9.6l-7 5.4C7.2 41.5 14.9 47 24 47z"/>
          </svg>
          Registrarse con Google
        </button>
      </div>
    </div>
  );
}

export default RegisterPage;