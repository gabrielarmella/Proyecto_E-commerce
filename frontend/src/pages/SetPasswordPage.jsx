import { useState } from "react";
import apiClient from "../api/client";
import { useNavigate } from "react-router-dom";

export default function SetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    if (password !== confirm) {
      setError("Las contraseñas no coinciden");
      return;
    }

    try {
      await apiClient.post("/api/auth/set-password", { password });
      setSuccess("Contraseña configurada correctamente");
      setTimeout(() => navigate("/"), 1500);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Error al configurar la contraseña"
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md bg-white p-6 rounded-xl border border-slate-200">
        <h2 className="text-xl font-semibold mb-2">
          Configurar contraseña
        </h2>
        <p className="text-sm text-slate-600 mb-4">
          Creá una contraseña para poder iniciar sesión sin Google.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            placeholder="Nueva contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-md border px-3 py-2"
            required
          />
          <input
            type="password"
            placeholder="Confirmar contraseña"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            className="w-full rounded-md border px-3 py-2"
            required
          />

          {error && <p className="text-sm text-red-600">{error}</p>}
          {success && <p className="text-sm text-green-600">{success}</p>}

          <button
            type="submit"
            className="w-full rounded-md bg-indigo-600 py-2 text-white"
          >
            Guardar contraseña
          </button>
        </form>
      </div>
    </div>
  );
}
