import axios from "axios";

//Mi cliente base: todas las llamadas van a salir de aqui
const api = axios.create({
    baseURL: "http://localhost:3004",
});

// antes de cada request se pegara el token si es que existe
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    const isAuth = config.url?.includes("/api/auth/");
    if (token && !isAuth) {
        config.headers.Authorization = "Bearer " + token; 
    }
    return config;
});

//Despues de cada respuesta si es que da 401 (menos lo del login y registro) saca al usuario 
api.interceptors.response.use(
    (res) => res,
    (error) => {
        const url = error.config?.url ?? "";
        if (error.response?.status === 401 && !url.includes("/api/auth/")){
            localStorage.removeItem("token");
            window.location.href = "/login";
        }
        return Promise.reject(error);
    }
);

export default api;