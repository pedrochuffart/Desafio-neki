import { createContext, useContext, useState } from "react";
import { api } from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [token, setToken] = useState(
        localStorage.getItem("token")
    );

    const [usuarioId, setUsuarioId] = useState(
        localStorage.getItem("usuarioId")
    );

    async function login(login, senha) {
        const response = await api.post("/login", {
            login,
            senha
        });

        const novoToken = response.data.token;

        const payload = JSON.parse(
            atob(novoToken.split(".")[1])
        );

        const novoUsuarioId = payload.usuarioId;

        localStorage.setItem("token", novoToken);
        localStorage.setItem(
            "usuarioId",
            novoUsuarioId
        );

        setToken(novoToken);
        setUsuarioId(novoUsuarioId);

        return response.data;
    }

    function logout() {
        localStorage.removeItem("token");
        localStorage.removeItem("usuarioId");

        setToken(null);
        setUsuarioId(null);
    }

    return (
        <AuthContext.Provider
            value={{
                token,
                usuarioId,
                login,
                logout,
                autenticado: Boolean(token)
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}