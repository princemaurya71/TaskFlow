import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { Task, FilterStatus, Priority, SortOption, ThemeMode, ToastNotification } from './types';
import { useLocalStorage } from './hooks/useLocalStorage';
import { InitialLoader } from './components/InitialLoader';
import { Header } from './components/Header';
import { TaskInput } from './components/TaskInput';
import { TaskFilters } from './components/TaskFilters';
import { TaskList } from './components/TaskList';
import { StatsOverview } from './components/StatsOverview';
import { ShortcutsModal } from './components/ShortcutsModal';
import { Toast } from './components/Toast';

const DEFAULT_SAMPLE_TASKS: Task[] = [
  {
    id: 'sample-1',
    title: 'Welcome to your minimalist Todo List!',
    completed: false,
    priority: 'high',
    category: 'General',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'sample-2',
    title: 'Press "?" to view all keyboard shortcuts',
    completed: false,
    priority: 'medium',
    category: 'Work',
    createdAt: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: 'sample-3',
    title: 'Try marking tasks complete or switching theme',
    completed: true,
    priority: 'low',
    category: 'Personal',
    createdAt: new Date(Date.now() - 7200000).toISOString(),
    completedAt: new Date().toISOString(),
  },
];

export default function App() {
  const [tasks, setTasks] = useLocalStorage<Task[]>('todolist_tasks_v1', []);
  const [theme, setTheme] = useLocalStorage<ThemeMode>('todolist_theme_v1', 'system');
  
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPriority, setSelectedPriority] = useState<Priority | 'all'>('all');
  const [sortOption, setSortOption] = useState<SortOption>('created-desc');
  
  const [isLoading, setIsLoading] = useState(true);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);
  const [announcement, setAnnouncement] = useState('');
  const [toast, setToast] = useState<ToastNotification | null>(null);

  // Buffer for undoing clear completed or single task delete
  const [deletedTasksBuffer, setDeletedTasksBuffer] = useState<Task[]>([]);

  const taskInputRef = useRef<HTMLInputElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Screen reader announcer
  const announceMessage = useCallback((msg: string) => {
    setAnnouncement(msg);
    setTimeout(() => setAnnouncement(''), 3000);
  }, []);

  // Show toast with auto-hide
  const showToast = useCallback((msg: string, actionLabel?: string, onAction?: () => void) => {
    const id = Date.now().toString();
    setToast({ id, message: msg, actionLabel, onAction });
    setTimeout(() => {
      setToast((current) => (current?.id === id ? null : current));
    }, 5000);
  }, []);

  // Dark mode class handler on <html>
  useEffect(() => {
    const root = document.documentElement;
    const applyTheme = (isDark: boolean) => {
      if (isDark) {
        root.classList.add('dark');
        root.style.colorScheme = 'dark';
      } else {
        root.classList.remove('dark');
        root.style.colorScheme = 'light';
      }
    };

    if (theme === 'system') {
      const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      applyTheme(systemDark);

      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const listener = (e: MediaQueryListEvent) => applyTheme(e.matches);
      mediaQuery.addEventListener('change', listener);
      return () => mediaQuery.removeEventListener('change', listener);
    } else {
      applyTheme(theme === 'dark');
    }
  }, [theme]);

  // Keyboard Shortcuts Handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const isInputActive = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT';

      // '?' key toggles shortcuts modal when not in input
      if (e.key === '?' && !isInputActive) {
        e.preventDefault();
        setIsShortcutsOpen((prev) => !prev);
        return;
      }

      // Escape key handles closing or blurring
      if (e.key === 'Escape') {
        if (isShortcutsOpen) {
          setIsShortcutsOpen(false);
          return;
        }
        if (isInputActive) {
          (target as HTMLElement).blur();
          return;
        }
        if (searchQuery) {
          setSearchQuery('');
          return;
        }
      }

      // Shortcut: N or Cmd/Ctrl + K to focus task input
      if (((e.key.toLowerCase() === 'n' && !isInputActive) || ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k'))) {
        e.preventDefault();
        taskInputRef.current?.focus();
        return;
      }

      // Shortcut: '/' to focus search
      if (e.key === '/' && !isInputActive) {
        e.preventDefault();
        searchInputRef.current?.focus();
        return;
      }

      // Shortcut: 1, 2, 3 for tabs when not typing
      if (!isInputActive) {
        if (e.key === '1') setFilterStatus('all');
        if (e.key === '2') setFilterStatus('active');
        if (e.key === '3') setFilterStatus('completed');
      }

      // Shortcut: Shift + C to clear completed
      if (e.shiftKey && e.key.toUpperCase() === 'C' && !isInputActive) {
        e.preventDefault();
        handleClearCompleted();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isShortcutsOpen, searchQuery]);

  // Task actions
  const handleAddTask = (newTaskData: {
    title: string;
    priority: Priority;
    category: string;
    dueDate?: string;
  }) => {
    const newTask: Task = {
      id: Date.now().toString(),
      title: newTaskData.title,
      completed: false,
      priority: newTaskData.priority,
      category: newTaskData.category,
      dueDate: newTaskData.dueDate,
      createdAt: new Date().toISOString(),
    };
    setTasks((prev) => [newTask, ...prev]);
    showToast(`Task "${newTaskData.title}" added`);
  };

  const handleToggleComplete = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          const completed = !t.completed;
          return {
            ...t,
            completed,
            completedAt: completed ? new Date().toISOString() : undefined,
          };
        }
        return t;
      })
    );
  };

  const handleDeleteTask = (id: string) => {
    const taskToDelete = tasks.find((t) => t.id === id);
    if (!taskToDelete) return;

    setTasks((prev) => prev.filter((t) => t.id !== id));
    setDeletedTasksBuffer([taskToDelete]);

    showToast(`Deleted "${taskToDelete.title}"`, 'Undo', () => {
      setTasks((prev) => [taskToDelete, ...prev]);
      announceMessage(`Restored task: ${taskToDelete.title}`);
    });
  };

  const handleEditTask = (id: string, newTitle: string, newPriority?: Priority) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id
          ? {
              ...t,
              title: newTitle,
              priority: newPriority || t.priority,
            }
          : t
      )
    );
  };

  const handleClearCompleted = () => {
    const completedTasks = tasks.filter((t) => t.completed);
    if (completedTasks.length === 0) return;

    setTasks((prev) => prev.filter((t) => !t.completed));
    setDeletedTasksBuffer(completedTasks);

    showToast(`Cleared ${completedTasks.length} finished task(s)`, 'Undo', () => {
      setTasks((prev) => [...prev, ...completedTasks]);
      announceMessage(`Restored ${completedTasks.length} task(s)`);
    });
  };

  // Filtered & sorted tasks calculation
  const filteredTasks = useMemo(() => {
    return tasks
      .filter((task) => {
        // Status filter
        if (filterStatus === 'active' && task.completed) return false;
        if (filterStatus === 'completed' && !task.completed) return false;

        // Priority filter
        if (selectedPriority !== 'all' && task.priority !== selectedPriority) return false;

        // Search filter
        if (searchQuery.trim()) {
          const query = searchQuery.toLowerCase();
          const matchesTitle = task.title.toLowerCase().includes(query);
          const matchesCategory = task.category.toLowerCase().includes(query);
          if (!matchesTitle && !matchesCategory) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortOption === 'created-asc') {
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        }
        if (sortOption === 'priority-desc') {
          const weight = { high: 3, medium: 2, low: 1 };
          return weight[b.priority] - weight[a.priority];
        }
        if (sortOption === 'due-date') {
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        }
        // Default: created-desc
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
  }, [tasks, filterStatus, selectedPriority, searchQuery, sortOption]);

  const totalCount = tasks.length;
  const completedCount = tasks.filter((t) => t.completed).length;
  const activeCount = totalCount - completedCount;
  const highPriorityCount = tasks.filter((t) => !t.completed && t.priority === 'high').length;

  return (
    <div className="min-h-screen bg-slate-100/70 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200 antialiased selection:bg-indigo-500 selection:text-white">
      {/* Screen Reader Live Region for Accessibility */}
      <div
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
        role="status"
      >
        {announcement}
      </div>

      {/* Initial Loader Splash Screen */}
      {isLoading && <InitialLoader onComplete={() => setIsLoading(false)} />}

      {/* Main Container */}
      <main className="max-w-2xl mx-auto px-4 py-8 sm:py-12">
        {/* Header */}
        <Header
          theme={theme}
          onThemeChange={setTheme}
          onOpenShortcuts={() => setIsShortcutsOpen(true)}
          totalCount={totalCount}
          completedCount={completedCount}
        />

        {/* Task Input Form */}
        <TaskInput
          onAddTask={handleAddTask}
          inputRef={taskInputRef}
          announceMessage={announceMessage}
        />

        {/* Stats Progress Overview */}
        <StatsOverview
          total={totalCount}
          completed={completedCount}
          active={activeCount}
          highPriorityCount={highPriorityCount}
        />

        {/* Task Search & Filter Controls */}
        <TaskFilters
          filterStatus={filterStatus}
          onFilterChange={setFilterStatus}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedPriority={selectedPriority}
          onPriorityFilterChange={setSelectedPriority}
          sortOption={sortOption}
          onSortChange={setSortOption}
          completedCount={completedCount}
          activeCount={activeCount}
          onClearCompleted={handleClearCompleted}
          searchInputRef={searchInputRef}
        />

        {/* Task List */}
        <TaskList
          tasks={filteredTasks}
          totalTaskCount={totalCount}
          onToggleComplete={handleToggleComplete}
          onDeleteTask={handleDeleteTask}
          onEditTask={handleEditTask}
          searchQuery={searchQuery}
          announceMessage={announceMessage}
        />

        {/* Footer info */}
        <footer className="mt-12 pt-6 border-t border-slate-200/60 dark:border-slate-800/60 text-center text-[11px] text-slate-400 dark:text-slate-500 space-y-1">
          <p>
            Stored safely on your device using LocalStorage • Works offline
          </p>
          <p>
            Press <kbd className="px-1 py-0.5 bg-slate-200 dark:bg-slate-800 rounded font-mono">?</kbd> for keyboard navigation guide
          </p>
        </footer>
      </main>

      {/* Shortcuts Guide Modal */}
      <ShortcutsModal
        isOpen={isShortcutsOpen}
        onClose={() => setIsShortcutsOpen(false)}
      />

      {/* Toast Feedback with Undo */}
      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}
