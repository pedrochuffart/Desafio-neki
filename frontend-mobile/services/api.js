import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const baseUrl = "http://192.168.1.2:8087";

export const api = axios.create({
    baseURL: baseUrl,
    timeout: 15000,
    headers: {
        "Content-Type": "application/json",
    },
});

api.interceptors.request.use(
    async (config) => {
        const token = await AsyncStorage.getItem("token");

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => Promise.reject(error)
);

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const status = error.response?.status;

        if (status === 401 || status === 403) {
            await AsyncStorage.multiRemove([
                "token",
                "usuarioId",
                "loginSalvo",
                "senhaSalva",
            ]);
        }

        return Promise.reject(error);
    }
);