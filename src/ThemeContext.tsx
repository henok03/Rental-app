import { createContext, useContext, useState, useEffect } from "react";
import type { Dispatch, SetStateAction, ReactNode } from "react";

type ThemeContextType = {
  dark: boolean;
  setDark: Dispatch<SetStateAction<boolean>>;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const STORAGE_KEY = "cs-theme-dark";

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [dark, setDark] = useState<boolean>(() => {
    if (typeof window === "undefined") return true;
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return stored !== null ? stored === "true" : true;
  });

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, String(dark));
  }, [dark]);

  return (
    <ThemeContext.Provider value={{ dark, setDark }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme must be used within a <ThemeProvider>");
  }
  return ctx;
}