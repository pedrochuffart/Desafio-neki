import { Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

import Login from "../pages/Login";
import Cadastro from "../pages/Cadastro";
import Home from "../pages/Home";

function RotaProtegida({ children }) {
    const { autenticado } = useAuth();

    if (!autenticado) {
        return <Navigate to="/login" replace />;
    }

    return children;
}

function AppRouter() {
    return (
        <Routes>
            <Route
                path="/"
                element={<Navigate to="/login" replace />}
            />

            <Route
                path="/login"
                element={<Login />}
            />

            <Route
                path="/cadastro"
                element={<Cadastro />}
            />

            <Route
                path="/home"
                element={
                    <RotaProtegida>
                        <Home />
                    </RotaProtegida>
                }
            />

            <Route
                path="*"
                element={<Navigate to="/login" replace />}
            />
        </Routes>
    );
}

export default AppRouter;