import { useState, useEffect } from "react";
import { Link, useNavigate} from "react-router-dom";
import api from "../api";

//forma de Un juego como lo manda la API
interface Game {
    id: number;
    name: string;
    category: string;
    recommendedPlayers: number;
    availableUnits: number;
}

//forma del response completa del listado
interface GamesResponse {
    items: Game[];
    page: number;
    size: number;
    totalItems: number;
    totalPages: number;
}

function GamesPage(){
    const navigate = useNavigate();
    const [page, setPage] = useState(1);
    //lo que repsonde la API y debe empezar en null porque aun no llega data
    const [data, setData] = useState<GamesResponse | null>(null);
    //ultima pagina que si llego , sirve para saber si estoy cargando
    const [loadedPage, setLoadedPage] = useState<number | null>(null);
    //mensaje de error su faklla la cansulta
    const [error, setError] = useState("");


    //es lo que se ejecuta cada vez que se abre la pagina y cada vez que se cambia de page
    useEffect(() => {
        //si el uusairo cambia raido esto impide peticiones viejas
        let cancelled = false;
        api
        .get("/api/games", { params: {page: page, size: 5 } })
        .then((res) => {
            if (!cancelled) {
                setData(res.data); // guarda lo que llego
                setLoadedPage(page); //anota que esta pagina ya llego
                setError("");
            }
        })
        .catch(()=> {
        if (!cancelled) setError("No se pudo cargar el listado");
        });
    //limpieza 
    return() => {
        cancelled = true;
    };
}, [page]);

const loading = loadedPage !== page && !error;

//cerrar seison : borrar el token y manda al login 

function logout(){
    localStorage.removeItem("token");
    navigate("/login");
}

return (
    <div className = "max-w-2xl mx-auto p-4">
        <div className = "flex justify-between items-center mb-4">
            <h1 className = "text-2xl font-bold">Juegos de mesa</h1>
            <button className = "btn btn-outline" onClick={logout}>
                Cerrar sesion
            </button>
        </div>
        {loading && <p>Cargando...</p>}
        {error && <p className = "text-red-600">{error}</p>}
        {!loading && data && data.items.length === 0 && (
            <p>No hay juegos disponibles.</p>
        )}
        {!loading && data && data.items.length > 0 && (
            <ul className = "flex flex-col gap-2">
                {data.items.map((game) => (
                    <li key={game.id} className="border rounded p-3">
                        <Link to={"/games/" + game.id} className="font-bold link">
                        {game.name}
                        </Link>
                        <p>Categoria: {game.category}</p>
                        <p>Jugadores recomendados: {game.recommendedPlayers}</p>
                        <p>Unidades disponibles: {game.availableUnits}</p>
                    </li>
                ))}
            </ul>
        )}

        {data && (
            <div className = "flex items-center gap-3 mt-4">
                <button
                className="btn"
                disabled={page <= 1}
                onClick={() => setPage(page - 1)}
                >
                    Anterior
                </button>
                <span>
                    Pagina {page} de {data.totalPages}
                </span>
                <button
                className="btn"
                disabled={page >= data.totalPages}
                onClick={() => setPage(page+1)}
                >
                    Siguiente
                </button>
                </div>
        )}
    </div>
);
}

export default GamesPage;