import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

type Theme = 'light' | 'dark';

const STORAGE_KEY = 'theme';

/**
 * Pure function of the current wall-clock time — no side effects, no state.
 * 06:00–18:59 -> light ("day"), everything else -> dark ("night").
 */
function getTimeBasedTheme(): Theme {
  const hour = new Date().getHours();
  return hour >= 6 && hour < 19 ? 'light' : 'dark';
}

/**
 * Runs once, synchronously, the first time this module is used to initialize
 * state. Because it's passed as a *function* to useState (the "lazy initializer"
 * pattern), React calls it only on the very first render — no useEffect required
 * to compute a starting value.
 */
function getInitialTheme(): Theme {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved === 'light' || saved === 'dark') {
    return saved; // user already chose manually before — respect that
  }
  return getTimeBasedTheme();
}

interface ThemeContextValue {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(getInitialTheme);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => {
      const next: Theme = prev === 'dark' ? 'light' : 'dark';
      // Writing to localStorage here, inside the event handler that changed
      // the value, is a normal side effect of a user action — it doesn't need
      // useEffect. useEffect is for syncing to something *outside* React on
      // every render (e.g. an external subscription); a one-off write that
      // happens because the user just clicked something belongs right in the
      // handler that reacts to that click.
      localStorage.setItem(STORAGE_KEY, next);
      return next;
    });
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {/*
        Applying the "dark" class here is just part of this component's JSX
        output — it happens during render, like any other className. There's
        no imperative DOM mutation (no document.documentElement.classList...),
        so there's nothing here that needs an effect either.
      */}
      <div className={theme === 'dark' ? 'dark' : ''}>
        <div className="min-h-screen bg-white dark:bg-slate-950 transition-colors">
          {children}
          <ThemeToggleButton theme={theme} onToggle={toggleTheme} />
        </div>
      </div>
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return ctx;
}

function ThemeToggleButton({ theme, onToggle }: { theme: Theme; onToggle: () => void }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
      className="fixed bottom-5 right-5 z-50 flex items-center justify-center w-11 h-11 rounded-full
                 bg-slate-200 dark:bg-slate-800 border border-slate-300 dark:border-slate-700
                 text-slate-700 dark:text-slate-200 shadow-lg hover:scale-105 active:scale-95
                 transition-transform"
    >
      {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
    </button>
  );
}

function SunIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}