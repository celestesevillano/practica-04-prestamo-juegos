import {Routes, Route, Navigate} from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import LoginPage from "./pages/LoginPage";
import GamesPage from "./pages/GamesPage";

function Register() {
  return <h1>Register</h1>
}

function GameDetail(){
  return <h1>Detalle</h1>
}


function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/games" replace />} />
      <Route path= "/login" element={<LoginPage />} />
      <Route path= "/register" element={<Register />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/games" element={<GamesPage />} />
        <Route path="/games/:id" element={<GameDetail />} />
      </Route>
      <Route path="*" element={<h1>404</h1>} />
    </Routes>
  );
}

export default App;