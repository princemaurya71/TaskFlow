import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ToastNotification } from '../types';
import { CheckCircle, Undo2, X } from 'lucide-react';

interface ToastProps {
  toast: ToastNotification | null;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ toast, onClose }) => {
  return (
    <AnimatePresence>
      {toast && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="fixed bottom-5 right-5 z-50 flex items-center gap-3 px-4 py-3 bg-slate-900 dark:bg-slate-100 text-slate-100 dark:text-slate-900 rounded-2xl shadow-xl border border-slate-800 dark:border-slate-200 text-xs font-medium max-w-sm"
          role="status"
          aria-live="polite"
        >
          <CheckCircle className="w-4 h-4 text-emerald-400 dark:text-emerald-600 flex-shrink-0" />
          <span className="flex-1">{toast.message}</span>

          {toast.actionLabel && toast.onAction && (
            <button
              onClick={() => {
                toast.onAction?.();
                onClose();
              }}
              className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-indigo-400 dark:text-indigo-600 hover:bg-slate-800 dark:hover:bg-slate-200 rounded-lg transition-colors"
            >
              <Undo2 className="w-3.5 h-3.5" />
              {toast.actionLabel}
            </button>
          )}

          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-200 dark:text-slate-500 dark:hover:text-slate-800 rounded-md"
            aria-label="Dismiss notification"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
