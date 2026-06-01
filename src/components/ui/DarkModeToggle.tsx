"use client";

import { useEffect, useSyncExternalStore } from "react";
import { Moon, Sun } from "lucide-react";

type Theme = "light" | "dark";

const listeners = new Set<() => void>();

function subscribe(callback: () => void) {
  listeners.add(callback);
  return () => listeners.delete(callback);
}

// Snapshot = the actual state of the <html> element (single source of truth).
function getSnapshot(): Theme {
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

function getServerSnapshot(): Theme {
  return "light";
}

// Reads the user's saved/preferred theme (used once on mount).
function getPreferredTheme(): Theme {
  const stored = localStorage.getItem("theme");
  if (stored === "dark" || stored === "light") return stored;
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function applyTheme(theme: Theme) {
  document.documentElement.classList.toggle("dark", theme === "dark");
  localStorage.setItem("theme", theme);
  listeners.forEach((l) => l());
}

export function DarkModeToggle() {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const dark = theme === "dark";

  // Apply the persisted preference to the document on first mount.
  // (Side effect only — no React state is set here.)
  useEffect(() => {
    applyTheme(getPreferredTheme());
  }, []);

  return (
    <button
      onClick={() => applyTheme(dark ? "light" : "dark")}
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
      className="w-9 h-9 rounded-xl flex items-center justify-center text-[#64748b] hover:bg-[#f1f5f9] dark:hover:bg-[#1e2d45] dark:text-[#94a3b8] transition-all"
    >
      {dark ? <Sun size={17} /> : <Moon size={17} />}
    </button>
  );
}
