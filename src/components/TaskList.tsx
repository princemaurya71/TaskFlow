import React from 'react';
import { Task, Priority } from '../types';
import { TaskItem } from './TaskItem';
import { AnimatePresence, motion } from 'motion/react';
import { CheckCircle2, ListFilter, Sparkles } from 'lucide-react';

interface TaskListProps {
  tasks: Task[];
  totalTaskCount: number;
  onToggleComplete: (id: string) => void;
  onDeleteTask: (id: string) => void;
  onEditTask: (id: string, newTitle: string, newPriority?: Priority) => void;
  searchQuery: string;
  announceMessage?: (msg: string) => void;
}

export const TaskList: React.FC<TaskListProps> = ({
  tasks,
  totalTaskCount,
  onToggleComplete,
  onDeleteTask,
  onEditTask,
  searchQuery,
  announceMessage,
}) => {
  if (tasks.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center py-12 px-4 text-center rounded-2xl bg-slate-50/50 dark:bg-slate-900/30 border border-dashed border-slate-200 dark:border-slate-800"
      >
        <div className="p-3.5 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-500 mb-3">
          {totalTaskCount === 0 ? (
            <Sparkles className="w-6 h-6" />
          ) : searchQuery ? (
            <ListFilter className="w-6 h-6" />
          ) : (
            <CheckCircle2 className="w-6 h-6" />
          )}
        </div>
        <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-1">
          {totalTaskCount === 0
            ? 'Your todo list is empty'
            : searchQuery
            ? 'No tasks found'
            : 'No tasks in this view'}
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs">
          {totalTaskCount === 0
            ? 'Add a task using the input field above to organize your day.'
            : searchQuery
            ? `No tasks matching "${searchQuery}". Try clearing your search.`
            : 'All tasks in this filter have been completed or removed.'}
        </p>
      </motion.div>
    );
  }

  return (
    <ul
      className="space-y-2.5"
      role="list"
      aria-label="Tasks list"
    >
      <AnimatePresence mode="popLayout">
        {tasks.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            onToggleComplete={onToggleComplete}
            onDeleteTask={onDeleteTask}
            onEditTask={onEditTask}
            announceMessage={announceMessage}
          />
        ))}
      </AnimatePresence>
    </ul>
  );
};
