import { useRouter } from "expo-router";
import { useState } from "react";
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

export default function Cadastro() {
    const [login, setLogin] = useState("");
    const [senha, setSenha] = useState("");
    const [confirmarSenha, setConfirmarSenha] = useState("");
    const [mostrarSenha, setMostrarSenha] = useState(false);
    const [mostrarConfirmarSenha, setMostrarConfirmarSenha] = useState(false);
    const [carregando, setCarregando] = useState(false);

    const router = useRouter();
    const { themeMode, toggleTheme } = useTheme();
    const currentTheme = themes[themeMode] || theme;

    async function realizarCadastro() {
        if (!login || !senha || !confirmarSenha) {
            Alert.alert("Atenção", "Preencha todos os campos.");
            return;
        }

        if (senha !== confirmarSenha) {
            Alert.alert("Atenção", "As senhas não são iguais.");
            return;
        }

        try {
            setCarregando(true);
            await api.post("/cadastro", {
                login,
                senha,
            });

            Alert.alert("Sucesso", "Usuário cadastrado com sucesso!", [
                {
                    text: "OK",
                    onPress: () => router.replace("/login"),
                },
            ]);
        } catch (error) {
            const mensagem =
                error.response?.data?.mensagem ||
                error.response?.data?.message ||
                error.response?.data?.erro ||
                error.message ||
                "Erro desconhecido";

            Alert.alert("Erro no cadastro", mensagem);
        } finally {
            setCarregando(false);
        }
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
                <Text style={[styles.titulo, { color: currentTheme.text }]}>Cadastro</Text>
                <Text style={[styles.subtitulo, { color: currentTheme.textMuted }]}>Crie sua conta</Text>

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

                <Text style={[styles.label, { color: currentTheme.textSoft }]}>Senha</Text>
                <View style={[styles.inputContainer, { backgroundColor: currentTheme.input, borderColor: currentTheme.border }]}>
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

                <Text style={[styles.label, { color: currentTheme.textSoft }]}>Confirmar senha</Text>
                <View style={[styles.inputContainer, { backgroundColor: currentTheme.input, borderColor: currentTheme.border }]}>
                    <TextInput
                        style={[styles.inputSenha, { color: currentTheme.text }]}
                        value={confirmarSenha}
                        onChangeText={setConfirmarSenha}
                        placeholder="Digite a senha novamente"
                        placeholderTextColor={currentTheme.textMuted}
                        secureTextEntry={!mostrarConfirmarSenha}
                        autoCapitalize="none"
                    />
                    <Pressable style={styles.botaoVisualizar} onPress={() => setMostrarConfirmarSenha(!mostrarConfirmarSenha)}>
                        <Text style={[styles.textoVisualizar, { color: currentTheme.primary }]}>
                            {mostrarConfirmarSenha ? "Ocultar" : "Ver"}
                        </Text>
                    </Pressable>
                </View>

                <Pressable
                    style={[
                        styles.botao,
                        { backgroundColor: currentTheme.primary },
                        carregando && styles.botaoDesabilitado,
                    ]}
                    onPress={realizarCadastro}
                    disabled={carregando}
                >
                    <Text style={styles.textoBotao}>{carregando ? "Cadastrando..." : "Cadastrar"}</Text>
                </Pressable>

                <Pressable style={styles.botaoVoltar} onPress={() => router.replace("/login")} disabled={carregando}>
                    <Text style={[styles.textoVoltar, { color: currentTheme.primary }]}>Voltar para Login</Text>
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
    titulo: {
        fontSize: 20,
        fontWeight: "700",
        textAlign: "center",
        marginBottom: 8,
    },
    subtitulo: {
        fontSize: 14,
        textAlign: "center",
        marginBottom: 28,
        opacity: 0.8,
    },
    label: {
        width: "100%",
        maxWidth: 360,
        fontSize: 12,
        fontWeight: "700",
        marginBottom: 10,
        marginTop: 16,
        letterSpacing: 0.3,
        opacity: 0.85,
    },
    input: {
        width: "100%",
        maxWidth: 360,
        height: 50,
        borderWidth: 1.5,
        borderRadius: 12,
        paddingHorizontal: 16,
        fontSize: 15,
        fontWeight: "500",
        marginBottom: 6,
    },
    inputContainer: {
        width: "100%",
        maxWidth: 360,
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 1.5,
        borderRadius: 12,
        paddingHorizontal: 4,
        marginBottom: 6,
    },
    inputSenha: {
        flex: 1,
        height: 50,
        paddingHorizontal: 14,
        fontSize: 15,
        fontWeight: "500",
    },
    botaoVisualizar: {
        paddingHorizontal: 12,
    },
    textoVisualizar: {
        fontWeight: "600",
        fontSize: 13,
    },
    botao: {
        width: "100%",
        maxWidth: 360,
        height: 52,
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
        marginTop: 28,
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
    botaoVoltar: {
        width: "100%",
        maxWidth: 360,
        alignItems: "center",
        marginTop: 14,
        paddingVertical: 10,
    },
    textoVoltar: {
        fontSize: 14,
        fontWeight: "700",
        letterSpacing: 0.2,
    },
});
