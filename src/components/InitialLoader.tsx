import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, ListTodo, Sparkles } from 'lucide-react';

interface InitialLoaderProps {
  onComplete: () => void;
}

export const InitialLoader: React.FC<InitialLoaderProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(() => {
            setIsVisible(false);
            setTimeout(onComplete, 400); // allow exit animation to finish
          }, 300);
          return 100;
        }
        return prev + 15;
      });
    }, 60);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100"
          role="status"
          aria-label="Loading application"
        >
          <div className="flex flex-col items-center max-w-xs w-full px-6">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="relative mb-6 p-4 rounded-2xl bg-indigo-600/10 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20"
            >
              <ListTodo className="w-10 h-10 animate-pulse" />
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: [0, 1.2, 1] }}
                transition={{ delay: 0.3, duration: 0.4 }}
                className="absolute -top-1 -right-1 p-1 bg-indigo-600 text-white rounded-full shadow-lg"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.15 }}
              className="text-center mb-6"
            >
              <h1 className="text-xl font-semibold tracking-tight flex items-center justify-center gap-1.5">
                <span>Todo List</span>
                <Sparkles className="w-4 h-4 text-amber-500" />
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Local-first • Offline Ready • Private
              </p>
            </motion.div>

            {/* Progress bar */}
            <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden mb-2">
              <motion.div
                className="bg-gradient-to-r from-indigo-500 to-indigo-600 h-full rounded-full"
                style={{ width: `${progress}%` }}
                transition={{ ease: 'easeOut', duration: 0.1 }}
              />
            </div>

            <div className="flex justify-between w-full text-[11px] text-slate-400 dark:text-slate-500 font-mono">
              <span>Loading workspace...</span>
              <span>{Math.min(100, progress)}%</span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
