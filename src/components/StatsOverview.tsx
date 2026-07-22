import React from 'react';
import { motion } from 'motion/react';
import { CheckCircle2, Circle, AlertCircle } from 'lucide-react';

interface StatsOverviewProps {
  total: number;
  completed: number;
  active: number;
  highPriorityCount: number;
}

export const StatsOverview: React.FC<StatsOverviewProps> = ({
  total,
  completed,
  active,
  highPriorityCount,
}) => {
  if (total === 0) return null;

  const percentage = Math.round((completed / total) * 100);

  return (
    <div className="mb-6 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-2xs">
      <div className="flex items-center justify-between text-xs font-medium text-slate-600 dark:text-slate-400 mb-2">
        <span>Task Completion</span>
        <span className="font-semibold text-slate-900 dark:text-slate-100 font-mono">
          {percentage}% ({completed}/{total})
        </span>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-100 dark:bg-slate-800 h-2 rounded-full overflow-hidden mb-3">
        <motion.div
          className="bg-gradient-to-r from-indigo-500 to-emerald-500 h-full rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      </div>

      {/* Badges */}
      <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-1">
          <Circle className="w-3 h-3 text-amber-500" />
          <span>{active} active</span>
        </div>
        <div className="flex items-center gap-1">
          <CheckCircle2 className="w-3 h-3 text-emerald-500" />
          <span>{completed} done</span>
        </div>
        {highPriorityCount > 0 && (
          <div className="flex items-center gap-1 text-rose-500 font-medium ml-auto">
            <AlertCircle className="w-3 h-3" />
            <span>{highPriorityCount} urgent</span>
          </div>
        )}
      </div>
    </div>
  );
};
