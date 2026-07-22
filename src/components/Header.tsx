import React from 'react';
import { ThemeMode } from '../types';
import { Sun, Moon, Monitor, Keyboard, CheckCircle2, ShieldCheck } from 'lucide-react';
import { motion } from 'motion/react';

interface HeaderProps {
  theme: ThemeMode;
  onThemeChange: (mode: ThemeMode) => void;
  onOpenShortcuts: () => void;
  totalCount: number;
  completedCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  theme,
  onThemeChange,
  onOpenShortcuts,
  totalCount,
  completedCount,
}) => {
  const nextThemeMode = (): ThemeMode => {
    if (theme === 'system') return 'light';
    if (theme === 'light') return 'dark';
    return 'system';
  };

  const getThemeIcon = () => {
    if (theme === 'light') return <Sun className="w-4 h-4 text-amber-500" />;
    if (theme === 'dark') return <Moon className="w-4 h-4 text-indigo-400" />;
    return <Monitor className="w-4 h-4 text-slate-500 dark:text-slate-400" />;
  };

  const getThemeLabel = () => {
    if (theme === 'light') return 'Light theme (Click for Dark)';
    if (theme === 'dark') return 'Dark theme (Click for System)';
    return 'System theme (Click for Light)';
  };

  return (
    <header className="mb-6 pb-5 border-b border-slate-200/80 dark:border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-indigo-600 text-white shadow-sm shadow-indigo-600/20">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
              Todo List
              <span className="inline-flex items-center gap-1 text-[11px] font-normal px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                <ShieldCheck className="w-3 h-3" />
                Local Storage
              </span>
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {totalCount === 0
                ? 'Your list is empty. Add a task to get started.'
                : `${completedCount} of ${totalCount} tasks completed`}
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 self-start sm:justify-end">
        {/* Keyboard shortcuts trigger */}
        <button
          onClick={onOpenShortcuts}
          className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700/80 rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
          aria-label="Open keyboard shortcuts modal"
          title="Keyboard Shortcuts (Press ?)"
        >
          <Keyboard className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
          <span className="hidden sm:inline">Shortcuts</span>
          <kbd className="hidden sm:inline-block px-1.5 py-0.5 text-[10px] font-mono font-semibold bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded">
            ?
          </kbd>
        </button>

        {/* Theme mode toggle */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => onThemeChange(nextThemeMode())}
          className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-200 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700/80 rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
          aria-label={getThemeLabel()}
          title={getThemeLabel()}
        >
          {getThemeIcon()}
          <span className="capitalize text-xs font-medium">{theme}</span>
        </motion.button>
      </div>
    </header>
  );
};
