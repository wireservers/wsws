"use client";

import { createContext, useContext } from "react";
import { type ReactNode, useEffect, useState } from "react";

export function ClientProviders({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const stored = window.localStorage.getItem("wireservers-template-theme");
    if (stored === "dark" || stored === "light") setTheme(stored);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("theme-dark", theme === "dark");
    document.documentElement.classList.toggle("theme-light", theme === "light");
    window.localStorage.setItem("wireservers-template-theme", theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme: () => setTheme((value) => (value === "light" ? "dark" : "light")) }}>
      {children}
    </ThemeContext.Provider>
  );
}

const ThemeContext = createContext({
  theme: "light" as "light" | "dark",
  toggleTheme: () => {},
});

export function useThemeMode() {
  return useContext(ThemeContext);
}
