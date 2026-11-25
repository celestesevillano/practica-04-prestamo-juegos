import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api";

function LoginPage() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e: FormEvent){
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            const res = await api.post("/api/auth/login", { email, password });
            localStorage.setItem("token", res.data.token);
            navigate("/games")
        } catch (err: any) {
            setError(err.response?.data?.message ?? "No se pudo iniciar sesión");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center">
            <form onSubmit={handleSubmit} className="flex flex-col gap-3 w-80">
                <h1 className= "text-2xl font-bold">Iniciar sesion</h1>
                <input
                type="email"
                placeholder="Correo"
                className="input input-bordered"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                />
                <input
                type="password"
                placeholder="Contrasena"
                className="input input-bordered"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                />
                {error && <p className="text-red-600">{error}</p>}
                <button type= "submit" className="btn btn-primary" disabled={loading}>
                    {loading ? "Entrando...": "Entrar"}
                </button>
                <Link to="/register" className="link">Crear cuenta</Link>
            </form>
        </div>
    );
}
export default LoginPage