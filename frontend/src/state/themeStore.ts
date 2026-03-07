import { create } from "zustand";
import { persist } from "zustand/middleware";

export type ThemeName = "light" | "dark" | "ocean" | "sunset" | "forest";

const BASE_THEME_BY_SELECTION: Record<ThemeName, "light" | "dark"> = {
  light: "light",
  dark: "dark",
  ocean: "light",
  sunset: "light",
  forest: "light"
};

const ACCENT_BY_SELECTION: Record<ThemeName, string> = {
  light: "teal",
  dark: "teal",
  ocean: "ocean",
  sunset: "sunset",
  forest: "forest"
};

export const THEME_OPTIONS: Array<{ value: ThemeName; label: string }> = [
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
  { value: "ocean", label: "Ocean" },
  { value: "sunset", label: "Sunset" },
  { value: "forest", label: "Forest" }
];

function applyThemeToDom(theme: ThemeName) {
  const root = document.documentElement;
  root.setAttribute("data-theme", BASE_THEME_BY_SELECTION[theme]);
  root.setAttribute("data-accent", ACCENT_BY_SELECTION[theme]);
}

function normalizeTheme(input: unknown): ThemeName {
  const value = String(input ?? "light").toLowerCase() as ThemeName;
  const allowed = new Set<ThemeName>(["light", "dark", "ocean", "sunset", "forest"]);
  return allowed.has(value) ? value : "light";
}

interface ThemeState {
  theme: ThemeName;
  isDark: boolean;
  setTheme: (theme: ThemeName) => void;
  toggleTheme: () => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: "light",
      isDark: false,
      setTheme: (theme: ThemeName) => {
        const normalized = normalizeTheme(theme);
        applyThemeToDom(normalized);
        set({
          theme: normalized,
          isDark: BASE_THEME_BY_SELECTION[normalized] === "dark"
        });
      },
      toggleTheme: () => {
        const current = get().theme;
        get().setTheme(current === "dark" ? "light" : "dark");
      }
    }),
    {
      name: "theme-storage",
      onRehydrateStorage: () => (state) => {
        if (!state) return;
        const normalized = normalizeTheme(state.theme);
        applyThemeToDom(normalized);
        state.theme = normalized;
        state.isDark = BASE_THEME_BY_SELECTION[normalized] === "dark";
      }
    }
  )
);

export function initializeTheme() {
  const saved = localStorage.getItem("theme-storage");
  let theme: ThemeName = "light";

  if (saved) {
    try {
      const parsed = JSON.parse(saved) as { state?: { theme?: ThemeName } };
      theme = normalizeTheme(parsed.state?.theme);
    } catch {
      theme = "light";
    }
  } else {
    const prefersDark =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches;
    theme = prefersDark ? "dark" : "light";
  }

  applyThemeToDom(theme);
  useThemeStore.getState().setTheme(theme);
}
