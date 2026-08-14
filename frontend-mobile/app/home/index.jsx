import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    Image,
    Modal,
    Pressable,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { useTheme } from "../../contexts/ThemeContext";
import { api } from "../../services/api";
import { theme, themes } from "../../styles/theme";

const niveis = ["Iniciante", "Intermediário", "Avançado"];

export default function Home() {
    const [skills, setSkills] = useState([]);
    const [skillsDisponiveis, setSkillsDisponiveis] = useState([]);
    const [usuarioId, setUsuarioId] = useState(null);
    const [skillSelecionada, setSkillSelecionada] = useState("");
    const [nivelSelecionado, setNivelSelecionado] = useState("Iniciante");
    const [modalAberta, setModalAberta] = useState(false);
    const [carregando, setCarregando] = useState(true);
    const [salvando, setSalvando] = useState(false);

    const router = useRouter();
    const { themeMode, toggleTheme } = useTheme();
    const currentTheme = themes[themeMode] || theme;

    const logout = useCallback(async () => {
        await AsyncStorage.multiRemove(["token", "usuarioId", "loginSalvo", "senhaSalva"]);
        setUsuarioId(null);
        setSkills([]);
        setSkillsDisponiveis([]);
        router.replace("/login");
    }, [router]);

    const carregarDados = useCallback(async () => {
        try {
            setCarregando(true);

            const [usuarioIdSalvo, tokenSalvo] = await Promise.all([
                AsyncStorage.getItem("usuarioId"),
                AsyncStorage.getItem("token"),
            ]);

            if (!usuarioIdSalvo || !tokenSalvo) {
                await logout();
                return;
            }

            const id = Number(usuarioIdSalvo);
            setUsuarioId(id);

            const [responseSkills, responseDisponiveis] = await Promise.all([
                api.get(`/skills/usuario/${id}`),
                api.get("/skills"),
            ]);

            setSkills(responseSkills.data ?? []);
            setSkillsDisponiveis(responseDisponiveis.data ?? []);
        } catch (error) {
            console.error("Erro ao carregar Home:", error);

            if (error.response?.status === 401 || error.response?.status === 403) {
                await logout();
                return;
            }

            Alert.alert("Erro", "Não foi possível carregar as Skills.");
        } finally {
            setCarregando(false);
        }
    }, [logout]);

    useFocusEffect(
        useCallback(() => {
            carregarDados();
        }, [carregarDados])
    );

    async function salvarLevel(skillId, novoNivel) {
        const skillAtual = skills.find((s) => s.id === skillId);
        if (skillAtual?.level === novoNivel) {
            return;
        }

        Alert.alert(
            "Confirmar Mudança",
            `Deseja mudar o level para ${novoNivel}?`,
            [
                { text: "Cancelar", style: "cancel" },
                {
                    text: "Confirmar",
                    onPress: async () => {
                        try {
                            await api.put(`/usuario-skill/${skillId}`, {
                                level: novoNivel,
                            });

                            setSkills((listaAtual) =>
                                listaAtual.map((skill) =>
                                    skill.id === skillId ? { ...skill, level: novoNivel } : skill
                                )
                            );

                            Alert.alert("Sucesso", "Level atualizado com sucesso!");
                        } catch (error) {
                            console.error("Erro ao atualizar Level:", error);

                            if (error.response?.status === 401 || error.response?.status === 403) {
                                await logout();
                                return;
                            }

                            Alert.alert("Erro", error.response?.data?.mensagem || "Não foi possível atualizar o Level.");
                        }
                    },
                },
            ]
        );
    }

    async function excluirSkill(skillId) {
        Alert.alert("Excluir Skill", "Tem certeza que deseja excluir esta Skill?", [
            { text: "Cancelar", style: "cancel" },
            {
                text: "Excluir",
                style: "destructive",
                onPress: async () => {
                    try {
                        await api.delete(`/usuario-skill/${skillId}`);
                        setSkills((listaAtual) => listaAtual.filter((skill) => skill.id !== skillId));
                        Alert.alert("Sucesso", "Skill excluída com sucesso!");
                    } catch (error) {
                        console.error("Erro ao excluir Skill:", error);

                        if (error.response?.status === 401 || error.response?.status === 403) {
                            await logout();
                            return;
                        }

                        Alert.alert("Erro", error.response?.data?.mensagem || "Não foi possível excluir a Skill.");
                    }
                },
            },
        ]);
    }

    async function adicionarSkill() {
        if (!skillSelecionada) {
            Alert.alert("Atenção", "Selecione uma Skill.");
            return;
        }

        if (!usuarioId) {
            return;
        }

        try {
            setSalvando(true);

            await api.post("/usuario-skill", {
                usuarioId,
                skillId: Number(skillSelecionada),
                level: nivelSelecionado,
            });

            setModalAberta(false);
            setSkillSelecionada("");
            setNivelSelecionado("Iniciante");

            await carregarDados();
            Alert.alert("Sucesso", "Skill adicionada com sucesso!");
        } catch (error) {
            console.error("Erro ao adicionar Skill:", error);

            if (error.response?.status === 401 || error.response?.status === 403) {
                await logout();
                return;
            }

            Alert.alert("Erro", error.response?.data?.mensagem || "Não foi possível adicionar a Skill.");
        } finally {
            setSalvando(false);
        }
    }

    function abrirModal() {
        setSkillSelecionada("");
        setNivelSelecionado("Iniciante");
        setModalAberta(true);
    }

    function fecharModal() {
        if (salvando) {
            return;
        }

        setModalAberta(false);
    }

    if (carregando) {
        return (
            <SafeAreaView style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#0066A1" />
                <Text style={styles.loadingTexto}>Carregando Skills...</Text>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: currentTheme.background }]}>
            <View style={styles.themeToggleWrap}>
                <Pressable style={styles.themeToggle} onPress={toggleTheme}>
                    <Text style={[styles.themeToggleText, themeMode === "light" && { color: "#1a1a1a" }]}>
                        {themeMode === "dark" ? "☀️ Tema claro" : "🌙 Tema escuro"}
                    </Text>
                </Pressable>
            </View>

            <ScrollView contentContainerStyle={styles.conteudo} showsVerticalScrollIndicator={false}>
                <View style={styles.cabecalho}>
                    <View>
                        <Text style={[styles.logo, { color: currentTheme.text }]}>NEKI</Text>
                        <Text style={[styles.tituloCabecalho, { color: currentTheme.text }]}>Minhas Skills</Text>
                    </View>

                    <Pressable style={[styles.botaoSair, { borderColor: currentTheme.primary }]} onPress={logout}>
                        <Text style={[styles.textoBotaoSair, { color: currentTheme.primary }]}>Sair</Text>
                    </Pressable>
                </View>

                <Pressable style={[styles.botaoAdicionar, { backgroundColor: currentTheme.primary }]} onPress={abrirModal}>
                    <Text style={styles.textoBotaoAdicionar}>+ Adicionar Skill</Text>
                </Pressable>

                {skills.length === 0 ? (
                    <View style={[styles.estadoVazio, { backgroundColor: currentTheme.card, borderColor: currentTheme.border }]}>
                        <Text style={[styles.tituloVazio, { color: currentTheme.text }]}>Nenhuma Skill cadastrada</Text>
                        <Text style={[styles.textoVazio, { color: currentTheme.textMuted }]}>Adicione sua primeira Skill usando o botão acima.</Text>
                    </View>
                ) : (
                    skills.map((skill) => (
                        <View key={skill.id} style={[styles.card, { backgroundColor: currentTheme.card, borderColor: currentTheme.border }]}>
                            <View style={styles.cardTopo}>
                                <View style={[styles.imagemContainer, { backgroundColor: currentTheme.surfaceSoft }]}>
                                    {skill.imagem ? (
                                        <Image
                                            source={{ uri: String(skill.imagem).trim() }}
                                            style={styles.imagem}
                                            resizeMode="contain"
                                        />
                                    ) : (
                                        <View style={styles.imagemVazia} />
                                    )}
                                </View>

                                <View style={styles.informacoes}>
                                    <Text style={[styles.nomeSkill, { color: currentTheme.text }]}>{skill.nome}</Text>
                                    <Text style={[styles.descricao, { color: currentTheme.textMuted }]}>{skill.descricao}</Text>
                                </View>
                            </View>

                            <View style={styles.levelArea}>
                                <Text style={[styles.label, { color: currentTheme.textSoft }]}>Level</Text>

                                <View style={styles.niveis}>
                                    {niveis.map((nivel) => (
                                        <Pressable
                                            key={nivel}
                                            style={[
                                                styles.nivelBotao,
                                                {
                                                    borderColor: currentTheme.border,
                                                    backgroundColor: currentTheme.surfaceSoft,
                                                },
                                                skill.level === nivel && {
                                                    ...styles.nivelSelecionado,
                                                    backgroundColor: currentTheme.primary,
                                                    borderColor: currentTheme.primary,
                                                },
                                            ]}
                                            onPress={() => salvarLevel(skill.id, nivel)}
                                        >
                                            <Text
                                                style={[
                                                    styles.nivelTexto,
                                                    { color: currentTheme.textMuted },
                                                    skill.level === nivel && styles.nivelTextoSelecionado,
                                                ]}
                                            >
                                                {nivel}
                                            </Text>
                                        </Pressable>
                                    ))}
                                </View>
                            </View>

                            <Pressable
                                style={[styles.botaoExcluir, { backgroundColor: "rgba(239, 83, 80, 0.12)" }]}
                                onPress={() => excluirSkill(skill.id)}
                            >
                                <Text style={styles.textoExcluir}>Excluir Skill</Text>
                            </Pressable>
                        </View>
                    ))
                )}
            </ScrollView>

            <Modal visible={modalAberta} transparent animationType="fade" onRequestClose={fecharModal}>
                <View style={[styles.modalFundo, { backgroundColor: currentTheme.overlay }]}>
                    <View style={[styles.modal, { backgroundColor: currentTheme.card, borderColor: currentTheme.border }]}>
                        <Text style={[styles.modalTitulo, { color: currentTheme.text }]}>Adicionar Skill</Text>

                        <Text style={[styles.modalLabel, { color: currentTheme.textSoft }]}>Escolha uma Skill</Text>

                        <ScrollView style={styles.listaSkills}>
                            {skillsDisponiveis.map((skill) => {
                                const selecionada = String(skill.id) === String(skillSelecionada);
                                return (
                                    <Pressable
                                        key={skill.id}
                                        style={[
                                            styles.opcaoSkill,
                                            { backgroundColor: currentTheme.surfaceSoft, borderColor: currentTheme.border },
                                            selecionada && {
                                                backgroundColor: "rgba(29, 123, 232, 0.15)",
                                                borderColor: currentTheme.primary,
                                            },
                                        ]}
                                        onPress={() => setSkillSelecionada(String(skill.id))}
                                    >
                                        <Text
                                            style={[
                                                styles.opcaoSkillTexto,
                                                { color: currentTheme.textSoft },
                                                selecionada && { color: currentTheme.text, fontWeight: "700" },
                                            ]}
                                        >
                                            {skill.nome}
                                        </Text>
                                    </Pressable>
                                );
                            })}
                        </ScrollView>

                        <Text style={[styles.modalLabel, { color: currentTheme.textSoft }]}>Escolha o Level</Text>

                        <View style={styles.niveisModal}>
                            {niveis.map((nivel) => (
                                <Pressable
                                    key={nivel}
                                    style={[
                                        styles.nivelModal,
                                        { backgroundColor: currentTheme.surfaceSoft, borderColor: currentTheme.border },
                                        nivelSelecionado === nivel && {
                                            backgroundColor: currentTheme.primary,
                                            borderColor: currentTheme.primary,
                                        },
                                    ]}
                                    onPress={() => setNivelSelecionado(nivel)}
                                >
                                    <Text
                                        style={[
                                            styles.nivelModalTexto,
                                            { color: currentTheme.textMuted },
                                            nivelSelecionado === nivel && { color: currentTheme.white },
                                        ]}
                                    >
                                        {nivel}
                                    </Text>
                                </Pressable>
                            ))}
                        </View>

                        <View style={styles.modalBotoes}>
                            <Pressable style={[styles.botaoCancelar, { borderColor: currentTheme.border }]} onPress={fecharModal} disabled={salvando}>
                                <Text style={[styles.textoCancelar, { color: currentTheme.textSoft }]}>Cancelar</Text>
                            </Pressable>

                            <Pressable
                                style={[
                                    styles.botaoSalvar,
                                    { backgroundColor: currentTheme.primary },
                                    salvando && styles.botaoDesabilitado,
                                ]}
                                onPress={adicionarSkill}
                                disabled={salvando}
                            >
                                <Text style={styles.textoSalvar}>{salvando ? "Salvando..." : "Salvar"}</Text>
                            </Pressable>
                        </View>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },

    themeToggleWrap: {
        width: "100%",
        alignItems: "center",
        marginTop: 16,
        marginBottom: 12,
    },

    themeToggle: {
        backgroundColor: "rgba(29, 123, 232, 0.1)",
        borderRadius: 999,
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderWidth: 1.5,
        borderColor: "rgba(29, 123, 232, 0.3)",
    },

    themeToggleText: {
        color: "#edf6ff",
        fontWeight: "600",
        fontSize: 13,
        letterSpacing: 0.3,
    },

    conteudo: {
        paddingHorizontal: 16,
        paddingTop: 12,
        paddingBottom: 40,
    },

    cabecalho: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 24,
        paddingTop: 8,
    },

    logo: {
        fontSize: 32,
        fontWeight: "800",
        letterSpacing: 2.5,
        color: "#1d7be8",
    },

    tituloCabecalho: {
        fontSize: 16,
        fontWeight: "600",
        marginTop: 6,
        letterSpacing: 0.2,
    },

    botaoSair: {
        borderWidth: 1.5,
        borderRadius: 999,
        paddingHorizontal: 14,
        paddingVertical: 8,
        backgroundColor: "rgba(29, 123, 232, 0.08)",
    },

    textoBotaoSair: {
        fontSize: 12,
        fontWeight: "700",
        letterSpacing: 0.2,
    },

    botaoAdicionar: {
        borderRadius: 14,
        paddingVertical: 14,
        alignItems: "center",
        marginBottom: 20,
        shadowColor: "#1d7be8",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.25,
        shadowRadius: 8,
        elevation: 6,
    },

    textoBotaoAdicionar: {
        color: "#fff",
        fontSize: 15,
        fontWeight: "700",
        letterSpacing: 0.3,
    },

    estadoVazio: {
        borderWidth: 0,
        borderRadius: 16,
        padding: 28,
        marginTop: 20,
        alignItems: "center",
        justifyContent: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 4,
        elevation: 2,
    },

    tituloVazio: {
        fontSize: 18,
        fontWeight: "700",
        marginBottom: 8,
    },

    textoVazio: {
        fontSize: 14,
        lineHeight: 20,
        textAlign: "center",
    },

    card: {
        borderWidth: 0,
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.12,
        shadowRadius: 6,
        elevation: 4,
    },

    cardTopo: {
        flexDirection: "row",
        alignItems: "center",
    },

    imagemContainer: {
        width: 64,
        height: 64,
        borderRadius: 14,
        marginRight: 14,
        justifyContent: "center",
        alignItems: "center",
        overflow: "hidden",
    },

    imagem: {
        width: 64,
        height: 64,
        borderRadius: 14,
    },

    imagemVazia: {
        width: 64,
        height: 64,
        borderRadius: 14,
        backgroundColor: "rgba(255,255,255,0.04)",
    },

    informacoes: {
        flex: 1,
    },

    nomeSkill: {
        fontSize: 16,
        fontWeight: "700",
        marginBottom: 4,
    },

    descricao: {
        fontSize: 13,
        lineHeight: 19,
        opacity: 0.8,
    },

    levelArea: {
        marginTop: 16,
        paddingTop: 14,
        borderTopWidth: 0.5,
        borderTopColor: "rgba(255,255,255,0.1)",
    },

    label: {
        fontSize: 12,
        fontWeight: "700",
        marginBottom: 10,
        letterSpacing: 0.3,
        opacity: 0.8,
    },

    niveis: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 8,
    },

    nivelBotao: {
        borderWidth: 1.5,
        borderRadius: 20,
        paddingVertical: 7,
        paddingHorizontal: 14,
        minWidth: 80,
        alignItems: "center",
    },

    nivelSelecionado: {
        borderWidth: 1.5,
    },

    nivelTexto: {
        fontSize: 12,
        fontWeight: "600",
        letterSpacing: 0.2,
    },

    nivelTextoSelecionado: {
        color: "#fff",
        fontWeight: "700",
    },

    botaoExcluir: {
        marginTop: 16,
        borderRadius: 10,
        paddingVertical: 10,
        alignItems: "center",
    },

    textoExcluir: {
        color: "#ef5350",
        fontWeight: "700",
        fontSize: 13,
    },

    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#07111f",
    },

    loadingTexto: {
        marginTop: 16,
        color: "#edf6ff",
        fontSize: 15,
        fontWeight: "500",
    },

    modalFundo: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 20,
    },

    modal: {
        width: "100%",
        maxWidth: 440,
        borderWidth: 0,
        borderRadius: 20,
        padding: 22,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
        elevation: 10,
    },

    modalTitulo: {
        fontSize: 21,
        fontWeight: "800",
        marginBottom: 18,
        letterSpacing: 0.3,
    },

    modalLabel: {
        fontSize: 13,
        fontWeight: "700",
        marginBottom: 12,
        letterSpacing: 0.3,
        opacity: 0.85,
    },

    listaSkills: {
        maxHeight: 280,
        marginBottom: 18,
    },

    opcaoSkill: {
        borderWidth: 1.5,
        borderRadius: 12,
        paddingVertical: 14,
        paddingHorizontal: 14,
        marginBottom: 10,
    },

    opcaoSkillTexto: {
        fontSize: 14,
        fontWeight: "600",
    },

    niveisModal: {
        flexDirection: "row",
        flexWrap: "wrap",
        gap: 10,
        marginBottom: 20,
    },

    nivelModal: {
        borderWidth: 1.5,
        borderRadius: 20,
        paddingVertical: 10,
        paddingHorizontal: 16,
        minWidth: 85,
        alignItems: "center",
    },

    nivelModalTexto: {
        fontSize: 12,
        fontWeight: "700",
        letterSpacing: 0.2,
    },

    modalBotoes: {
        flexDirection: "row",
        justifyContent: "space-between",
        gap: 14,
    },

    botaoCancelar: {
        flex: 1,
        borderWidth: 1.5,
        borderRadius: 12,
        paddingVertical: 14,
        alignItems: "center",
    },

    textoCancelar: {
        fontWeight: "700",
        fontSize: 14,
    },

    botaoSalvar: {
        flex: 1,
        borderRadius: 12,
        paddingVertical: 14,
        alignItems: "center",
        shadowColor: "#1d7be8",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 4,
    },

    textoSalvar: {
        color: "#fff",
        fontWeight: "700",
        fontSize: 14,
    },

    botaoDesabilitado: {
        opacity: 0.6,
    },
});
