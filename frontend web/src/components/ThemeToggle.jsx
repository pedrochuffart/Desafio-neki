import { useEffect, useState } from "react";

function ThemeToggle() {
    const [theme, setTheme] = useState(() => localStorage.getItem("neki-theme") || "light");

    useEffect(() => {
        document.documentElement.dataset.theme = theme;
        localStorage.setItem("neki-theme", theme);
    }, [theme]);

    return <button type="button" className="theme-toggle" onClick={() => setTheme(theme === "light" ? "dark" : "light")} aria-label={theme === "light" ? "Ativar modo escuro" : "Ativar modo claro"}>{theme === "light" ? "☾" : "☀"}</button>;
}

export default ThemeToggle;
