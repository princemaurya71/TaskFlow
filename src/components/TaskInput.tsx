import React, { useState, useRef, useEffect, useId } from 'react';
import { Priority } from '../types';
import { Plus, Tag, Calendar, AlertCircle, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface TaskInputProps {
  onAddTask: (task: {
    title: string;
    priority: Priority;
    category: string;
    dueDate?: string;
  }) => void;
  inputRef?: React.RefObject<HTMLInputElement | null>;
  announceMessage?: (msg: string) => void;
}

const CATEGORY_OPTIONS = ['General', 'Work', 'Personal', 'Health', 'Finance', 'Urgent'];

export const TaskInput: React.FC<TaskInputProps> = ({
  onAddTask,
  inputRef,
  announceMessage,
}) => {
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [category, setCategory] = useState<string>('General');
  const [dueDate, setDueDate] = useState<string>('');
  const [showDetails, setShowDetails] = useState(false);
  
  const internalRef = useRef<HTMLInputElement>(null);
  const activeInputRef = inputRef || internalRef;
  const inputId = useId();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedTitle = title.trim();
    if (!trimmedTitle) return;

    onAddTask({
      title: trimmedTitle,
      priority,
      category: category || 'General',
      dueDate: dueDate || undefined,
    });

    setTitle('');
    setDueDate('');
    setShowDetails(false);
    
    if (announceMessage) {
      announceMessage(`Task added: ${trimmedTitle}`);
    }
  };

  const priorityColors = {
    low: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
    medium: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
    high: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20',
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white dark:bg-slate-900 rounded-2xl p-3 border border-slate-200 dark:border-slate-800 shadow-sm transition-all focus-within:border-indigo-500/50 dark:focus-within:border-indigo-500/50 focus-within:ring-2 focus-within:ring-indigo-500/20 mb-6"
    >
      <div className="flex items-center gap-2">
        <input
          id={inputId}
          ref={activeInputRef as React.RefObject<HTMLInputElement>}
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          onFocus={() => setShowDetails(true)}
          placeholder="Add a new task... (Press Enter to save)"
          className="flex-1 bg-transparent border-0 px-3 py-2 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-0"
          aria-label="New task title"
        />

        <button
          type="button"
          onClick={() => setShowDetails(!showDetails)}
          className={`p-2 text-xs font-medium rounded-lg transition-colors flex items-center gap-1 ${
            showDetails
              ? 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200'
              : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
          }`}
          title="More task details (Priority, Tag, Date)"
          aria-label="Toggle task options"
          aria-expanded={showDetails}
        >
          <span className="text-[11px] font-semibold uppercase tracking-wider hidden sm:inline">
            Options
          </span>
          <ChevronDown
            className={`w-4 h-4 transition-transform duration-200 ${
              showDetails ? 'rotate-180' : ''
            }`}
          />
        </button>

        <button
          type="submit"
          disabled={!title.trim()}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 disabled:hover:bg-indigo-600 text-white font-medium text-sm rounded-xl shadow-sm transition-all flex items-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 min-h-[40px]"
          aria-label="Add task"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Add</span>
        </button>
      </div>

      <AnimatePresence>
        {showDetails && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden border-t border-slate-100 dark:border-slate-800/80 mt-2.5 pt-2.5"
          >
            <div className="flex flex-wrap items-center gap-3 text-xs px-1">
              {/* Priority Selection */}
              <div className="flex items-center gap-1.5">
                <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1 text-[11px]">
                  <AlertCircle className="w-3.5 h-3.5" /> Priority:
                </span>
                <div className="flex gap-1" role="radiogroup" aria-label="Task priority">
                  {(['low', 'medium', 'high'] as Priority[]).map((p) => (
                    <button
                      key={p}
                      type="button"
                      role="radio"
                      aria-checked={priority === p}
                      onClick={() => setPriority(p)}
                      className={`px-2 py-0.5 rounded-md text-[11px] font-medium border capitalize transition-all ${
                        priority === p
                          ? priorityColors[p] + ' font-semibold ring-1 ring-current'
                          : 'bg-slate-50 dark:bg-slate-800 text-slate-500 border-slate-200 dark:border-slate-700/60 hover:bg-slate-100 dark:hover:bg-slate-700'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              {/* Category Selector */}
              <div className="flex items-center gap-1.5">
                <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1 text-[11px]">
                  <Tag className="w-3.5 h-3.5" /> Tag:
                </span>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700/60 rounded-md px-2 py-0.5 text-[11px] focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  aria-label="Select category tag"
                >
                  {CATEGORY_OPTIONS.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              {/* Due Date Input */}
              <div className="flex items-center gap-1.5 ml-auto">
                <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1 text-[11px]">
                  <Calendar className="w-3.5 h-3.5" /> Due:
                </span>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700/60 rounded-md px-2 py-0.5 text-[11px] focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  aria-label="Select task due date"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </form>
  );
};
