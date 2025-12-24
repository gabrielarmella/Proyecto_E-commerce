import React, { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";

export default function RegisterPage() {
  const { register, loading, error, setError } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    await register({ name, email, password });
  };

  return (
    <div className="max-w-md mx-auto bg-white shadow rounded p-6">
      <h1 className="text-xl font-semibold mb-4">Register</h1>
      {error && <div className="form-error">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          className="w-full border rounded p-2"
          placeholder="Name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          required
        />
        <input
          className="w-full border rounded p-2"
          placeholder="Email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          type="email"
          required
        />
        <input
          className="w-full border rounded p-2"
          placeholder="Password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          type="password"
          minLength={6}
          required
        />
        <button className="btn-primary" type="submit" disabled={loading}>
          {loading ? "Loading..." : "Create account"}
        </button>
      </form>
    </div>
  );
}
