import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import {
    Alert,
    Pressable,
    SafeAreaView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";
import { useTheme } from "../../contexts/ThemeContext";
import { api } from "../../services/api";
import { theme, themes } from "../../styles/theme";

export default function Login() {
    const [login, setLogin] = useState("");
    const [senha, setSenha] = useState("");
    const [mostrarSenha, setMostrarSenha] = useState(false);
    const [gravarSenha, setGravarSenha] = useState(false);
    const [carregando, setCarregando] = useState(false);

    const router = useRouter();
    const { themeMode, toggleTheme } = useTheme();
    const currentTheme = themes[themeMode] || theme;

    useEffect(() => {
        let ativo = true;

        async function carregarCredenciaisSalvas() {
            try {
                const [loginSalvo, senhaSalva, tokenSalvo] = await Promise.all([
                    AsyncStorage.getItem("loginSalvo"),
                    AsyncStorage.getItem("senhaSalva"),
                    AsyncStorage.getItem("token"),
                ]);

                if (!ativo) {
                    return;
                }

                if (tokenSalvo) {
                    router.replace("/home");
                    return;
                }

                if (loginSalvo && senhaSalva) {
                    setLogin(loginSalvo);
                    setSenha(senhaSalva);
                    setGravarSenha(true);
                }
            } catch (error) {
                console.error("Erro ao restaurar credenciais:", error);
            }
        }

        carregarCredenciaisSalvas();

        return () => {
            ativo = false;
        };
    }, [router]);

    async function realizarLogin() {
        if (!login || !senha) {
            Alert.alert("Atenção", "Informe o login e a senha.");
            return;
        }

        setCarregando(true);

        try {
            const response = await api.post("/login", {
                login,
                senha,
            });

            const token = response.data?.token;
            if (!token) {
                throw new Error("Token não retornado pelo servidor.");
            }

            const payload = jwtDecode(token);
            const usuarioId = payload.usuarioId ?? payload.userId ?? payload.sub;
            if (!usuarioId) {
                throw new Error("ID do usuário não encontrado no token.");
            }

            await AsyncStorage.setItem("token", token);
            await AsyncStorage.setItem("usuarioId", String(usuarioId));

            if (gravarSenha) {
                await AsyncStorage.setItem("loginSalvo", login);
                await AsyncStorage.setItem("senhaSalva", senha);
            } else {
                await AsyncStorage.removeItem("loginSalvo");
                await AsyncStorage.removeItem("senhaSalva");
            }

            router.replace("/home");
        } catch (error) {
            console.error("Erro ao realizar login:", error);

            const mensagem =
                error.response?.data?.mensagem ||
                error.response?.data?.message ||
                error.message ||
                "Login ou senha inválidos.";

            Alert.alert("Erro", mensagem);
        } finally {
            setCarregando(false);
        }
    }

    function irParaCadastro() {
        router.push("/cadastro");
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

            <View style={styles.formulario}>
                <Text style={[styles.logo, { color: currentTheme.text }]}>NEKI</Text>
                <Text style={[styles.titulo, { color: currentTheme.text }]}>Login</Text>
                <Text style={[styles.subtitulo, { color: currentTheme.textMuted }]}>Entre na sua conta</Text>

                <View style={styles.campo}>
                    <Text style={[styles.label, { color: currentTheme.textSoft }]}>Login</Text>
                    <TextInput
                        style={[
                            styles.input,
                            {
                                backgroundColor: currentTheme.input,
                                borderColor: currentTheme.border,
                                color: currentTheme.text,
                            },
                        ]}
                        value={login}
                        onChangeText={setLogin}
                        placeholder="Digite seu login"
                        placeholderTextColor={currentTheme.textMuted}
                        autoCapitalize="none"
                        autoCorrect={false}
                    />
                </View>

                <View style={styles.campo}>
                    <Text style={[styles.label, { color: currentTheme.textSoft }]}>Senha</Text>
                    <View
                        style={[
                            styles.senhaContainer,
                            {
                                backgroundColor: currentTheme.input,
                                borderColor: currentTheme.border,
                            },
                        ]}
                    >
                        <TextInput
                            style={[styles.inputSenha, { color: currentTheme.text }]}
                            value={senha}
                            onChangeText={setSenha}
                            placeholder="Digite sua senha"
                            placeholderTextColor={currentTheme.textMuted}
                            secureTextEntry={!mostrarSenha}
                            autoCapitalize="none"
                        />

                        <Pressable style={styles.botaoVisualizar} onPress={() => setMostrarSenha(!mostrarSenha)}>
                            <Text style={[styles.textoVisualizar, { color: currentTheme.primary }]}>
                                {mostrarSenha ? "Ocultar" : "Ver"}
                            </Text>
                        </Pressable>
                    </View>
                </View>

                <Pressable style={styles.gravarContainer} onPress={() => setGravarSenha(!gravarSenha)}>
                    <View
                        style={[
                            styles.checkbox,
                            gravarSenha && styles.checkboxAtivo,
                            { borderColor: currentTheme.primary },
                        ]}
                    >
                        {gravarSenha && <Text style={styles.check}>✓</Text>}
                    </View>
                    <Text style={[styles.gravarTexto, { color: currentTheme.textSoft }]}>Gravar Senha</Text>
                </Pressable>

                <Pressable
                    style={[
                        styles.botaoEntrar,
                        { backgroundColor: currentTheme.primary },
                        carregando && styles.botaoDesabilitado,
                    ]}
                    onPress={realizarLogin}
                    disabled={carregando}
                >
                    <Text style={styles.textoBotao}>{carregando ? "Entrando..." : "Entrar"}</Text>
                </Pressable>

                <Pressable style={styles.botaoCadastro} onPress={irParaCadastro}>
                    <Text style={[styles.textoCadastro, { color: currentTheme.primary }]}>Cadastrar-se</Text>
                </Pressable>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 16,
        paddingTop: 16,
    },
    themeToggleWrap: {
        width: "100%",
        alignItems: "center",
        marginBottom: 14,
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
    formulario: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        paddingVertical: 20,
    },
    logo: {
        fontSize: 42,
        fontWeight: "800",
        textAlign: "center",
        letterSpacing: 2.5,
        color: "#1d7be8",
        marginBottom: 12,
    },
    titulo: {
        fontSize: 20,
        fontWeight: "700",
        textAlign: "center",
    },
    subtitulo: {
        fontSize: 14,
        textAlign: "center",
        marginTop: 8,
        marginBottom: 32,
        opacity: 0.8,
    },
    campo: {
        width: "100%",
        maxWidth: 360,
        marginBottom: 18,
    },
    label: {
        fontSize: 12,
        fontWeight: "700",
        marginBottom: 10,
        letterSpacing: 0.3,
        opacity: 0.85,
    },
    input: {
        height: 50,
        borderWidth: 1.5,
        borderRadius: 12,
        paddingHorizontal: 16,
        fontSize: 15,
        fontWeight: "500",
    },
    senhaContainer: {
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1.5,
        borderRadius: 12,
        paddingHorizontal: 4,
    },
    inputSenha: {
        flex: 1,
        height: 50,
        paddingHorizontal: 14,
        fontSize: 15,
        fontWeight: "500",
    },
    botaoVisualizar: {
        paddingHorizontal: 14,
    },
    textoVisualizar: {
        fontWeight: "600",
        fontSize: 12,
    },
    gravarContainer: {
        width: "100%",
        maxWidth: 360,
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 24,
    },
    checkbox: {
        width: 22,
        height: 22,
        borderWidth: 2,
        borderRadius: 6,
        alignItems: "center",
        justifyContent: "center",
        marginRight: 12,
        backgroundColor: "transparent",
    },
    checkboxAtivo: {
        backgroundColor: "#1d7be8",
    },
    check: {
        color: "#fff",
        fontWeight: "700",
        fontSize: 12,
    },
    gravarTexto: {
        fontSize: 13,
        fontWeight: "600",
    },
    botaoEntrar: {
        width: "100%",
        maxWidth: 360,
        height: 52,
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 16,
        shadowColor: "#1d7be8",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 6,
    },
    botaoDesabilitado: {
        opacity: 0.65,
    },
    textoBotao: {
        color: "#fff",
        fontSize: 15,
        fontWeight: "700",
        letterSpacing: 0.3,
    },
    botaoCadastro: {
        paddingVertical: 10,
    },
    textoCadastro: {
        fontSize: 14,
        fontWeight: "700",
        letterSpacing: 0.2,
    },
});
