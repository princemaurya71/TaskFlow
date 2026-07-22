export type Priority = 'low' | 'medium' | 'high';

export type FilterStatus = 'all' | 'active' | 'completed';

export type SortOption = 'created-desc' | 'created-asc' | 'priority-desc' | 'due-date';

export type ThemeMode = 'light' | 'dark' | 'system';

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  priority: Priority;
  category: string;
  dueDate?: string;
  createdAt: string;
  completedAt?: string;
}

export interface ToastNotification {
  id: string;
  message: string;
  type?: 'success' | 'info' | 'undo';
  actionLabel?: string;
  onAction?: () => void;
}

export interface KeyboardShortcut {
  key: string;
  description: string;
  category: 'Navigation' | 'Actions' | 'General';
}
