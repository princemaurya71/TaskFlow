import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Keyboard, Command } from 'lucide-react';
import { KeyboardShortcut } from '../types';

interface ShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SHORTCUTS: KeyboardShortcut[] = [
  { key: 'N or Cmd+K', description: 'Focus new task input', category: 'Actions' },
  { key: '/', description: 'Focus search bar', category: 'Navigation' },
  { key: '1, 2, 3', description: 'Switch tabs (All, Active, Completed)', category: 'Navigation' },
  { key: 'Shift + C', description: 'Clear all finished tasks', category: 'Actions' },
  { key: 'Escape', description: 'Clear search / blur input / close modal', category: 'General' },
  { key: '?', description: 'Open / close this shortcuts guide', category: 'General' },
];

export const ShortcutsModal: React.FC<ShortcutsModalProps> = ({ isOpen, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs"
          role="dialog"
          aria-modal="true"
          aria-labelledby="shortcuts-title"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0"
          />

          {/* Modal Box */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 10 }}
            transition={{ type: 'spring', duration: 0.3, bounce: 0 }}
            className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800 z-10"
          >
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400">
                  <Keyboard className="w-5 h-5" />
                </div>
                <div>
                  <h2 id="shortcuts-title" className="text-base font-semibold text-slate-900 dark:text-slate-100">
                    Keyboard Shortcuts
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Fast navigation without touching your mouse
                  </p>
                </div>
              </div>

              <button
                onClick={onClose}
                className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                aria-label="Close keyboard shortcuts dialog"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="mt-4 space-y-3 max-h-[60vh] overflow-y-auto pr-1">
              {SHORTCUTS.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-xs"
                >
                  <span className="text-slate-700 dark:text-slate-300 font-medium">
                    {item.description}
                  </span>
                  <kbd className="px-2 py-1 font-mono font-semibold text-[11px] bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 rounded-md border border-slate-200 dark:border-slate-700 shadow-xs">
                    {item.key}
                  </kbd>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-end">
              <button
                onClick={onClose}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white text-white dark:text-slate-900 font-medium text-xs rounded-xl transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
              >
                Got it
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
