import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import ThemeToggle from "../../components/ThemeToggle";
import "./login.css";

function Login() {
    const [login, setLogin] = useState("");
    const [senha, setSenha] = useState("");
    const [mostrarSenha, setMostrarSenha] = useState(false);
    const [gravarSenha, setGravarSenha] = useState(false);
    const [erro, setErro] = useState("");
    const [carregando, setCarregando] = useState(false);

    const { login: realizarLogin } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const loginSalvo = localStorage.getItem("loginSalvo");
        const senhaSalva = localStorage.getItem("senhaSalva");

        if (loginSalvo && senhaSalva) {
            setLogin(loginSalvo);
            setSenha(senhaSalva);
            setGravarSenha(true);
        }
    }, []);

    async function handleSubmit(event) {
        event.preventDefault();

        setErro("");
        setCarregando(true);

        if (gravarSenha) {
            localStorage.setItem("loginSalvo", login);
            localStorage.setItem("senhaSalva", senha);
        } else {
            localStorage.removeItem("loginSalvo");
            localStorage.removeItem("senhaSalva");
        }

        try {
            await realizarLogin(login, senha);

            navigate("/home");
        } catch (error) {
            console.error("Erro ao realizar login:", error);

            if (error.response?.data?.mensagem) {
                setErro(error.response.data.mensagem);
            } else {
                setErro("Login ou senha inválidos.");
            }
        } finally {
            setCarregando(false);
        }
    }

    function irParaCadastro() {
        navigate("/cadastro");
    }

    return (
        <main className="login-container">
            <div className="auth-theme"><ThemeToggle /></div>
            <form
                className="login-form"
                onSubmit={handleSubmit}
            >
                <div className="auth-brand">NEKI</div>
                <h1>Bem-vindo de volta!</h1>
                <p className="auth-subtitle">Acesse sua conta para gerenciar suas habilidades.</p>

                <div className="login-field">
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

                <div className="login-field">
                    <label htmlFor="senha">
                        Senha
                    </label>

                    <div className="login-password">
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
                            autoComplete="current-password"
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

                <label className="login-remember">
                    <input
                        type="checkbox"
                        checked={gravarSenha}
                        onChange={(event) =>
                            setGravarSenha(event.target.checked)
                        }
                    />

                    Gravar Senha
                </label>

                {erro && (
                    <p className="login-error">
                        {erro}
                    </p>
                )}

                <button
                    type="submit"
                    className="login-button"
                    disabled={carregando}
                >
                    {carregando
                        ? "Entrando..."
                        : "Entrar"}
                </button>

                <button
                    type="button"
                    className="login-register"
                    onClick={irParaCadastro}
                >
                    Cadastrar-se
                </button>
            </form>
        </main>
    );
}

export default Login;
