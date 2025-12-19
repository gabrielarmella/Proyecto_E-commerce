import { createContext, useContext, useEffect, useState } from "react";
import { loginRequest, registerRequest, getMeRequest } from "../api/auth.js";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    //cargar usuario si hay token (login normal o Google OAuth)
    useEffect(() => {
        const loadUser = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    setLoading(false);
                    return;
                }
                const res = await getMeRequest();
                // backend -> {success, data: user}
                const userData = res.data || res.user || res;;
                setUser(userData);
            } catch (err) {
                console.log(err);
                console.error("LOAD USER ERROR =>", err);
                localStorage.removeItem("token");
                setUser(null);
            } finally {
                setLoading(false);
            }
        };
        loadUser();
    }, []);

    const login = async (email, password) => {
        try {
            setError(null);
            const res = await loginRequest({ email, password });
            localStorage.setItem("token", res.token);
            setUser(res.user);
            return { success: true };
        } catch (err) {
            console.error("LOGIN ERROR =>", err);
            setError("credenciales incorrectas o errror en el servidor");
            return { success: false };
        }
    };

    const register = async (name, email, password) => {
        try {
            setError(null);
            await registerRequest({ name, email, password });
            return await login(email, password);
        } catch (err) {
            console.error("REGISTER ERROR =>", err);
            setError(
            err.response?.data?.message || "No se pudo registrar el usuario."
            );
            return { success: false };
        }
    };

    const logout = () => {
        localStorage.removeItem("token");
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, error, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
                