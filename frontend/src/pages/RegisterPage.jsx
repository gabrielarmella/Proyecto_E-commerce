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

    const handleSumbit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        const res = await register (form.name, form.email, form.password);
        setSubmitting(false);
        if (res.success) navigate("/");
    };

    return (
        <div style={{ maxWidth: "400px", margin: "2rem auto"}}>
            <h2>Crear Cuenta</h2>
            <form onSubmit={handleSumbit}>
                <div style={{marginBottom: "0.5rem"}}>
                    <label>Nombre</label>
                    <input
                     name="name"
                     value={form.name}
                     onChange={handleChange}
                     required
                     style={{ width: "100%", padding: "0.5rem"}}
                    />
                </div>
                <div style={{ marginBottom: "0.5rem"}}>
                    <label>Email</label>
                    <input
                     name="email"
                     type="email"
                     value={form.email}
                     onChange={handleChange}
                     required
                     style={{ width: "100%", padding:"0.5rem"}}
                     />
                </div>
                <div style={{ marginBottom: "0.5rem"}}>
                    <label>Contraseña</label>
                    <input 
                     name="password"
                     type="password"
                     value={form.password}
                     onChange={handleChange}
                     required
                     style={{ width: "100%", padding: "0.5rem"}}
                     />
                </div>
                {error && <p style={{ color: "red"}}>{error}</p>}

                <button type="submit" disabled={submitting}>
                    {submitting ? "Creando cuenta..." : "Registrarse"}
                </button>
            </form>
            <p style={{ marginTop: "1rem", fontSize: "0.9rem"}}>
                ¿Ya tenés cuenta? <Link to="/login">Iniciá sesión</Link>
            </p>
        </div>
    );
}

export default RegisterPage;