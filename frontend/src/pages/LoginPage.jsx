import React, { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { API_BASE_URL } from "../api/client.api.js";

export default function LoginPage() {
  const { login, loading, error, setError } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    await login({ email, password });
  };

  const handleGoogle = () => {
    window.location.href = `${API_BASE_URL}/api/auth/google`;
  };

  return (
    <div className="max-w-md mx-auto bg-white shadow rounded p-6">
      <h1 className="text-xl font-semibold mb-4">Login</h1>
      {error && <div className="form-error">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          className="w-full border rounded p-2"
          placeholder="Email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          type="email"
          name="email"
          autoComplete="email"
          required
        />
        <input
          className="w-full border rounded p-2"
          placeholder="Password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          type="password"
          name="password"
          autoComplete="current-password"
          required
        />
        <button className="btn-primary" type="submit" disabled={loading}>
          {loading ? "Loading..." : "Login"}
        </button>
      </form>

      <button onClick={handleGoogle} className="w-full mt-3 border rounded p-2">
        Continuar con Google
      </button>
    </div>
  );
}
