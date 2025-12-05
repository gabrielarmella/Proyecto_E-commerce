import { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { useNavigate, Link } from "react-router-dom";

function LoginPage() {
    const { login, error } = useAuth();
    const navigate = useNavigate();
    const [form, setForm] = useState({ email: "", password: "" });
    const [submitting, setSubmitting] = useState(false);

    const handleChange = (e) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        const res = await login(form.email, form.password);
        setSubmitting(false);
        if (res.success) navigate("/");
    };

    return (
        <div style={{ maxWidth: "400px", margin: "2rem auto"}}>
            <h2>Iniciar Sesión</h2>
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: "1rem" }}>
                    <label>Email:</label>
                    <input
                        name="email"
                        type="email"
                        value={form.email}
                        onChange={handleChange}
                        required
                        style={{ width: "100%", padding: "0.5rem" }}
                    />
                </div>
                <div style={{ marginBottom: "1rem" }}>
                    <label>Contraseña:</label>
                    <input
                        name="password"
                        type="password"
                        value={form.password}
                        onChange={handleChange}
                        required
                        style={{ width: "100%", padding: "0.5rem" }}
                    />
                </div>
                {error && <p style={{ color: "red" }}>{error}</p>}

                <button type="submit" disabled={submitting}>
                    {submitting ? "Ingresando..." : "Ingresar"}
                </button>
            </form>
            <p style={{ marginTop: "1rem", fontSize: "0.9rem"}}>
                ¿No tenes cuenta? <Link to ="/register">Registrate acá</Link>
            </p>
        </div>
    );
}

export default LoginPage;