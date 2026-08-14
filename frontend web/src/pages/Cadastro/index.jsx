import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../services/api";
import ThemeToggle from "../../components/ThemeToggle";
import "./cadastro.css";

function Cadastro() {
    const [login, setLogin] = useState("");
    const [senha, setSenha] = useState("");
    const [confirmarSenha, setConfirmarSenha] = useState("");

    const [mostrarSenha, setMostrarSenha] = useState(false);
    const [mostrarConfirmarSenha, setMostrarConfirmarSenha] = useState(false);

    const [erro, setErro] = useState("");
    const [sucesso, setSucesso] = useState("");
    const [carregando, setCarregando] = useState(false);

    const navigate = useNavigate();

    async function handleSubmit(event) {
        event.preventDefault();

        setErro("");
        setSucesso("");

        if (senha !== confirmarSenha) {
            setErro("A senha e a confirmação de senha não são iguais.");
            return;
        }

        setCarregando(true);

        try {
            await api.post("/cadastro", {
                login,
                senha
            });

            setSucesso("Cadastro realizado com sucesso!");

            setLogin("");
            setSenha("");
            setConfirmarSenha("");

            setTimeout(() => {
                navigate("/login");
            }, 1500);

        } catch (error) {
            console.error("Erro ao realizar cadastro:", error);

            if (error.response?.data?.mensagem) {
                setErro(error.response.data.mensagem);
            } else {
                setErro("Não foi possível realizar o cadastro.");
            }
        } finally {
            setCarregando(false);
        }
    }

    function voltarParaLogin() {
        navigate("/login");
    }

    return (
        <main className="cadastro-container">
            <div className="auth-theme"><ThemeToggle /></div>
            <form
                className="cadastro-form"
                onSubmit={handleSubmit}
            >
                <div className="auth-brand">NEKI</div>
                <h1>Crie sua conta</h1>
                <p className="auth-subtitle">Preencha os dados para começar sua jornada.</p>

                <div className="cadastro-field">
                    <label htmlFor="login">
                        Login
                    </label>

                    <input
                        id="login"
                        type="text"
                        value={login}
                        onChange={(event) =>
                            setLogin(event.target.value)
                        }
                        placeholder="Digite seu login"
                        autoComplete="username"
                        required
                    />
                </div>

                <div className="cadastro-field">
                    <label htmlFor="senha">
                        Senha
                    </label>

                    <div className="cadastro-password">
                        <input
                            id="senha"
                            type={
                                mostrarSenha
                                    ? "text"
                                    : "password"
                            }
                            value={senha}
                            onChange={(event) =>
                                setSenha(event.target.value)
                            }
                            placeholder="Digite sua senha"
                            autoComplete="new-password"
                            required
                        />

                        <button
                            type="button"
                            onClick={() =>
                                setMostrarSenha(!mostrarSenha)
                            }
                        >
                            {mostrarSenha
                                ? "Ocultar"
                                : "Visualizar"}
                        </button>
                    </div>
                </div>

                <div className="cadastro-field">
                    <label htmlFor="confirmarSenha">
                        Confirmar Senha
                    </label>

                    <div className="cadastro-password">
                        <input
                            id="confirmarSenha"
                            type={
                                mostrarConfirmarSenha
                                    ? "text"
                                    : "password"
                            }
                            value={confirmarSenha}
                            onChange={(event) =>
                                setConfirmarSenha(
                                    event.target.value
                                )
                            }
                            placeholder="Confirme sua senha"
                            autoComplete="new-password"
                            required
                        />

                        <button
                            type="button"
                            onClick={() =>
                                setMostrarConfirmarSenha(
                                    !mostrarConfirmarSenha
                                )
                            }
                        >
                            {mostrarConfirmarSenha
                                ? "Ocultar"
                                : "Visualizar"}
                        </button>
                    </div>
                </div>

                {erro && (
                    <p className="cadastro-error">
                        {erro}
                    </p>
                )}

                {sucesso && (
                    <p className="cadastro-success">
                        {sucesso}
                    </p>
                )}

                <button
                    type="submit"
                    className="cadastro-button"
                    disabled={carregando}
                >
                    {carregando
                        ? "Salvando..."
                        : "Salvar"}
                </button>

                <button
                    type="button"
                    className="cadastro-login"
                    onClick={voltarParaLogin}
                >
                    Voltar para Login
                </button>
            </form>
        </main>
    );
}

export default Cadastro;
