import { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { api } from "../../services/api";
import ThemeToggle from "../../components/ThemeToggle";
import "./home.css";

function Home() {
    const { usuarioId, logout } = useAuth();

    const [skills, setSkills] = useState([]);
    const [skillsDisponiveis, setSkillsDisponiveis] = useState([]);

    const [mostrarModal, setMostrarModal] = useState(false);

    const [skillSelecionada, setSkillSelecionada] = useState("");
    const [levelSelecionado, setLevelSelecionado] =
        useState("Iniciante");

    const [levelsAlterados, setLevelsAlterados] =
        useState({});

    const [carregando, setCarregando] =
        useState(true);

    const [salvandoLevel, setSalvandoLevel] =
        useState(null);

    const [salvandoSkill, setSalvandoSkill] =
        useState(false);

    const [erro, setErro] = useState("");

    async function carregarSkills() {
        try {
            const response = await api.get(
                `/skills/usuario/${usuarioId}`
            );

            setSkills(response.data);
        } catch (error) {
            console.error(
                "Erro ao carregar Skills:",
                error
            );

            setErro(
                error.response?.data?.mensagem ||
                "Não foi possível carregar suas Skills."
            );
        } finally {
            setCarregando(false);
        }
    }

    async function carregarSkillsDisponiveis() {
        try {
            const response = await api.get("/skills");

            setSkillsDisponiveis(response.data);
        } catch (error) {
            console.error(
                "Erro ao carregar Skills disponíveis:",
                error
            );

            setErro(
                error.response?.data?.mensagem ||
                "Não foi possível carregar as Skills disponíveis."
            );
        }
    }

    useEffect(() => {
        if (usuarioId) {
            carregarSkills();
            carregarSkillsDisponiveis();
        }
    }, [usuarioId]);

    async function salvarLevel(id) {
        const novoLevel = levelsAlterados[id];

        if (!novoLevel) {
            return;
        }

        try {
            setSalvandoLevel(id);
            setErro("");

            await api.put(
                `/usuario-skill/${id}`,
                {
                    level: novoLevel
                }
            );

            setLevelsAlterados((anteriores) => {
                const novos = {
                    ...anteriores
                };

                delete novos[id];

                return novos;
            });

            await carregarSkills();
        } catch (error) {
            console.error(
                "Erro ao atualizar Level:",
                error
            );

            setErro(
                error.response?.data?.mensagem ||
                "Não foi possível atualizar o Level."
            );
        } finally {
            setSalvandoLevel(null);
        }
    }

    async function excluirSkill(id) {
        const confirmar = window.confirm(
            "Deseja realmente excluir esta Skill?"
        );

        if (!confirmar) {
            return;
        }

        try {
            setErro("");

            await api.delete(
                `/usuario-skill/${id}`
            );

            await carregarSkills();
        } catch (error) {
            console.error(
                "Erro ao excluir Skill:",
                error
            );

            setErro(
                error.response?.data?.mensagem ||
                "Não foi possível excluir a Skill."
            );
        }
    }

    async function adicionarSkill(event) {
        event.preventDefault();

        if (!skillSelecionada) {
            setErro("Selecione uma Skill.");
            return;
        }

        try {
            setSalvandoSkill(true);
            setErro("");

            await api.post(
                "/usuario-skill",
                {
                    usuarioId: Number(usuarioId),
                    skillId: Number(skillSelecionada),
                    level: levelSelecionado
                }
            );

            setMostrarModal(false);

            setSkillSelecionada("");

            setLevelSelecionado(
                "Iniciante"
            );

            await carregarSkills();
        } catch (error) {
            console.error(
                "Erro ao adicionar Skill:",
                error
            );

            setErro(
                error.response?.data?.mensagem ||
                "Não foi possível adicionar a Skill."
            );
        } finally {
            setSalvandoSkill(false);
        }
    }

    function abrirModal() {
        setErro("");
        setMostrarModal(true);
    }

    function fecharModal() {
        setMostrarModal(false);

        setSkillSelecionada("");

        setLevelSelecionado(
            "Iniciante"
        );
    }

    function sair() {
        logout();
    }

    if (carregando) {
        return (
            <main className="home-container">
                <p>Carregando Skills...</p>
            </main>
        );
    }

    return (
        <main className="home-container">

            <header className="home-header">

                <div className="home-brand">NEKI</div>
                <div className="home-heading"><span>Seu espaço de aprendizado</span><h1>Minhas Skills</h1></div>
                <div className="home-actions"><ThemeToggle /><button className="home-logout" onClick={sair}>Sair</button></div>

            </header>

            <div className="skills-toolbar"><p>Organize e acompanhe suas competências.</p><button className="home-add" onClick={abrirModal}>+ Adicionar Skill</button></div>

            {erro && (
                <p className="home-error">
                    {erro}
                </p>
            )}

            {skills.length === 0 && (
                <p className="home-empty">
                    Você ainda não possui Skills associadas.
                </p>
            )}

            <section className="skills-list">

                {skills.map((skill) => (

                    <article
                        className="skill-card"
                        key={skill.id}
                    >

                        <div className="skill-image">

                            <img
                                src={skill.imagem}
                                alt={skill.nome}
                            />

                        </div>

                        <div className="skill-info">

                            <h2>
                                {skill.nome}
                            </h2>

                            <p>
                                <strong>
                                    Descrição:
                                </strong>{" "}
                                {skill.descricao}
                            </p>

                            <div className="skill-level">

                                <strong>
                                    Level:
                                </strong>

                                <select
                                    value={
                                        levelsAlterados[
                                            skill.id
                                        ] ??
                                        skill.level
                                    }
                                    onChange={(event) =>
                                        setLevelsAlterados(
                                            (anteriores) => ({
                                                ...anteriores,
                                                [skill.id]:
                                                    event.target.value
                                            })
                                        )
                                    }
                                >

                                    <option value="Iniciante">
                                        Iniciante
                                    </option>

                                    <option value="Intermediário">
                                        Intermediário
                                    </option>

                                    <option value="Avançado">
                                        Avançado
                                    </option>

                                </select>

                                {levelsAlterados[
                                    skill.id
                                ] &&
                                    levelsAlterados[
                                        skill.id
                                    ] !== skill.level && (

                                    <button
                                        type="button"
                                        className="skill-save"
                                        onClick={() =>
                                            salvarLevel(
                                                skill.id
                                            )
                                        }
                                        disabled={
                                            salvandoLevel ===
                                            skill.id
                                        }
                                    >
                                        {salvandoLevel ===
                                        skill.id
                                            ? "Salvando..."
                                            : "Salvar"}
                                    </button>

                                )}

                            </div>

                            <button
                                className="skill-delete"
                                onClick={() =>
                                    excluirSkill(
                                        skill.id
                                    )
                                }
                            >
                                Excluir
                            </button>

                        </div>

                    </article>

                ))}

            </section>

            {mostrarModal && (

                <div className="modal-overlay">

                    <div className="skill-modal">

                        <div className="modal-heading"><div><span>Nova competência</span><h2>Adicionar Skill</h2></div><button type="button" className="modal-close" onClick={fecharModal} aria-label="Fechar">×</button></div>

                        <form
                            onSubmit={
                                adicionarSkill
                            }
                        >

                            <label>
                                Skill
                            </label>

                            <select
                                value={
                                    skillSelecionada
                                }
                                onChange={(event) =>
                                    setSkillSelecionada(
                                        event.target.value
                                    )
                                }
                                required
                            >

                                <option value="">
                                    Selecione uma Skill
                                </option>

                                {skillsDisponiveis.map(
                                    (skill) => (

                                        <option
                                            key={
                                                skill.id
                                            }
                                            value={
                                                skill.id
                                            }
                                        >
                                            {skill.nome}
                                        </option>

                                    )
                                )}

                            </select>

                            <label>
                                Level
                            </label>

                            <select
                                value={
                                    levelSelecionado
                                }
                                onChange={(event) =>
                                    setLevelSelecionado(
                                        event.target.value
                                    )
                                }
                            >

                                <option value="Iniciante">
                                    Iniciante
                                </option>

                                <option value="Intermediário">
                                    Intermediário
                                </option>

                                <option value="Avançado">
                                    Avançado
                                </option>

                            </select>

                            <div className="modal-buttons">

                                <button
                                    type="submit"
                                    disabled={
                                        salvandoSkill
                                    }
                                >
                                    {salvandoSkill
                                        ? "Salvando..."
                                        : "Salvar"}
                                </button>

                                <button
                                    type="button"
                                    onClick={
                                        fecharModal
                                    }
                                >
                                    Cancelar
                                </button>

                            </div>

                        </form>

                    </div>

                </div>

            )}

        </main>
    );
}

export default Home;
