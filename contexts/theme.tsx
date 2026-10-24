"use client";

import { createContext, type PropsWithChildren, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark";

export const ThemeContext = createContext<{
  theme: Theme;
  toggleTheme: (theme?: Theme) => void;
}>({
  theme: "dark",
  toggleTheme: () => {},
});

export function ThemeProvider({ children }: PropsWithChildren) {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window === "undefined") {
      return "dark";
    }

    const savedTheme = window.localStorage.getItem("travel-planner-theme");
    return savedTheme === "light" || savedTheme === "dark" ? savedTheme : "dark";
  });

  const toggleTheme = (theme?: Theme) => {
    if (typeof theme === "string") {
      setTheme(theme);
    } else {
      setTheme((theme) => (theme === "light" ? "dark" : "light"));
    }
  };

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }

    localStorage.setItem("travel-planner-theme", theme);
  }, [theme]);

  return <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>;
}

export const useTheme = () => {
  const context = useContext(ThemeContext);

  return {
    ...context,
    isDark: context.theme === "dark",
  };
};
