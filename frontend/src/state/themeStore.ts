import { create } from "zustand";
import { persist } from "zustand/middleware";

type Theme = "light" | "dark";

interface ThemeState {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  isDark: boolean;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: "light",
      setTheme: (theme: Theme) => {
        set({ theme });
        // Apply theme to DOM
        const root = document.documentElement;
        if (theme === "dark") {
          root.setAttribute("data-theme", "dark");
        } else {
          root.removeAttribute("data-theme");
        }
      },
      toggleTheme: () => {
        const currentTheme = get().theme;
        const newTheme = currentTheme === "light" ? "dark" : "light";
        get().setTheme(newTheme);
      },
      isDark: false,
    }),
    {
      name: "theme-storage",
      onRehydrateStorage: () => (state) => {
        // Apply theme on rehydration
        if (state?.theme === "dark") {
          document.documentElement.setAttribute("data-theme", "dark");
        }
      },
    }
  )
);

// Initialize theme on mount
export function initializeTheme() {
  const savedTheme = localStorage.getItem("theme-storage");
  let theme: Theme = "light";
  
  if (savedTheme) {
    try {
      const parsed = JSON.parse(savedTheme);
      theme = parsed.state?.theme || "light";
    } catch (e) {
      console.warn("Failed to parse saved theme, using light theme");
    }
  } else {
    // Check system preference
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    theme = prefersDark ? "dark" : "light";
  }

  // Apply initial theme
  const root = document.documentElement;
  if (theme === "dark") {
    root.setAttribute("data-theme", "dark");
  } else {
    root.removeAttribute("data-theme");
  }

  // Update store
  useThemeStore.getState().setTheme(theme);
}