import React, { useState, useRef, useEffect } from 'react';
import { Task, Priority } from '../types';
import {
  Check,
  Trash2,
  Edit2,
  Calendar,
  Tag,
  AlertCircle,
  X,
  Clock,
} from 'lucide-react';
import { motion } from 'motion/react';

interface TaskItemProps {
  task: Task;
  onToggleComplete: (id: string) => void;
  onDeleteTask: (id: string) => void;
  onEditTask: (id: string, newTitle: string, newPriority?: Priority) => void;
  announceMessage?: (msg: string) => void;
}

export const TaskItem: React.FC<TaskItemProps> = ({
  task,
  onToggleComplete,
  onDeleteTask,
  onEditTask,
  announceMessage,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const editInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && editInputRef.current) {
      editInputRef.current.focus();
      editInputRef.current.select();
    }
  }, [isEditing]);

  const handleSaveEdit = () => {
    const trimmed = editTitle.trim();
    if (trimmed && trimmed !== task.title) {
      onEditTask(task.id, trimmed);
      if (announceMessage) {
        announceMessage(`Task updated to ${trimmed}`);
      }
    } else {
      setEditTitle(task.title);
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSaveEdit();
    } else if (e.key === 'Escape') {
      setEditTitle(task.title);
      setIsEditing(false);
    }
  };

  const priorityBadges = {
    low: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
    medium: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
    high: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20',
  };

  const isOverdue =
    task.dueDate &&
    !task.completed &&
    new Date(task.dueDate).setHours(0, 0, 0, 0) < new Date().setHours(0, 0, 0, 0);

  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: 10, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, x: -20, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      className={`group relative flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 sm:p-4 rounded-xl border transition-all ${
        task.completed
          ? 'bg-slate-50/60 dark:bg-slate-900/40 border-slate-200/60 dark:border-slate-800/60 text-slate-400 dark:text-slate-500'
          : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100 shadow-xs hover:border-slate-300 dark:hover:border-slate-700'
      }`}
      role="listitem"
    >
      <div className="flex items-start sm:items-center gap-3 flex-1 min-w-0">
        {/* Completion Checkbox */}
        <button
          type="button"
          onClick={() => {
            onToggleComplete(task.id);
            if (announceMessage) {
              announceMessage(
                task.completed ? `Marked task incomplete: ${task.title}` : `Completed task: ${task.title}`
              );
            }
          }}
          className={`flex-shrink-0 w-6 h-6 rounded-lg border flex items-center justify-center transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 mt-0.5 sm:mt-0 ${
            task.completed
              ? 'bg-indigo-600 border-indigo-600 text-white shadow-xs'
              : 'border-slate-300 dark:border-slate-700 hover:border-indigo-500 bg-slate-50 dark:bg-slate-800/80'
          }`}
          aria-label={task.completed ? `Mark "${task.title}" as incomplete` : `Mark "${task.title}" as complete`}
          aria-checked={task.completed}
          role="checkbox"
        >
          {task.completed && (
            <motion.div
              initial={{ scale: 0, rotate: -20 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            >
              <Check className="w-4 h-4 stroke-[3]" />
            </motion.div>
          )}
        </button>

        {/* Task Title or Edit Form */}
        <div className="flex-1 min-w-0">
          {isEditing ? (
            <div className="flex items-center gap-2 w-full">
              <input
                ref={editInputRef}
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-1 bg-slate-100 dark:bg-slate-800 border border-indigo-500 rounded-lg px-2.5 py-1 text-sm text-slate-900 dark:text-slate-100 focus:outline-none"
                aria-label="Edit task title"
              />
              <button
                type="button"
                onClick={handleSaveEdit}
                className="p-1.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                aria-label="Save task edit"
              >
                <Check className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => {
                  setEditTitle(task.title);
                  setIsEditing(false);
                }}
                className="p-1.5 bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-lg hover:bg-slate-300"
                aria-label="Cancel editing"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div>
              <span
                onDoubleClick={() => setIsEditing(true)}
                className={`text-sm font-medium break-words block cursor-pointer select-none ${
                  task.completed ? 'line-through text-slate-400 dark:text-slate-500' : ''
                }`}
                title="Double click to edit task title"
              >
                {task.title}
              </span>

              {/* Task Metadata Badges */}
              <div className="flex flex-wrap items-center gap-2 mt-1 text-[11px]">
                {/* Priority Badge */}
                <span
                  className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full font-medium border text-[10px] uppercase tracking-wider ${
                    priorityBadges[task.priority]
                  }`}
                >
                  <AlertCircle className="w-2.5 h-2.5" />
                  {task.priority}
                </span>

                {/* Category Badge */}
                {task.category && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-medium">
                    <Tag className="w-2.5 h-2.5 text-slate-400" />
                    {task.category}
                  </span>
                )}

                {/* Due Date Indicator */}
                {task.dueDate && (
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md font-medium ${
                      isOverdue
                        ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <Calendar className="w-2.5 h-2.5" />
                    {new Date(task.dueDate).toLocaleDateString(undefined, {
                      month: 'short',
                      day: 'numeric',
                    })}
                    {isOverdue && ' (Overdue)'}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-1 self-end sm:self-center opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
        {!isEditing && (
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
            aria-label={`Edit task "${task.title}"`}
            title="Edit task"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
        )}

        <button
          type="button"
          onClick={() => {
            onDeleteTask(task.id);
            if (announceMessage) {
              announceMessage(`Deleted task: ${task.title}`);
            }
          }}
          className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500"
          aria-label={`Delete task "${task.title}"`}
          title="Delete task"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </motion.li>
  );
};
