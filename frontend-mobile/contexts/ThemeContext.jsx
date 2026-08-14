import { createContext, useContext, useMemo, useState } from "react";

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
    const [themeMode, setThemeMode] = useState("dark");

    const value = useMemo(
        () => ({
            themeMode,
            toggleTheme: () =>
                setThemeMode((current) =>
                    current === "dark" ? "light" : "dark"
                ),
        }),
        [themeMode]
    );

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);

    if (!context) {
        throw new Error("useTheme must be used within ThemeProvider");
    }

    return context;
}

export default ThemeContext;
