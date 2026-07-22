import React, { useRef } from 'react';
import { FilterStatus, Priority, SortOption } from '../types';
import { Search, Trash2, SlidersHorizontal, X } from 'lucide-react';

interface TaskFiltersProps {
  filterStatus: FilterStatus;
  onFilterChange: (status: FilterStatus) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedPriority: Priority | 'all';
  onPriorityFilterChange: (priority: Priority | 'all') => void;
  sortOption: SortOption;
  onSortChange: (sort: SortOption) => void;
  completedCount: number;
  activeCount:number;
  onClearCompleted: () => void;
  searchInputRef?: React.RefObject<HTMLInputElement | null>;
}

export const TaskFilters: React.FC<TaskFiltersProps> = ({
  filterStatus,
  onFilterChange,
  searchQuery,
  onSearchChange,
  selectedPriority,
  onPriorityFilterChange,
  sortOption,
  onSortChange,
  completedCount,
  activeCount,
  onClearCompleted,
  searchInputRef,
}) => {
  const tabs: { id: FilterStatus; label: string; keyHint: string }[] = [
    { id: 'all', label: 'All', keyHint: '1' },
    { id: 'active', label: 'Active', keyHint: `${activeCount}` },
    { id: 'completed', label: 'Completed', keyHint: `${completedCount}` },
  ];

  return (
    <div className="space-y-3 mb-6 bg-slate-50/70 dark:bg-slate-900/60 p-3 rounded-2xl border border-slate-200/80 dark:border-slate-800/80">
      {/* Top row: Search input & Clear Completed button */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
        {/* Search bar */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            ref={searchInputRef as React.RefObject<HTMLInputElement>}
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search tasks... (Press '/' to search)"
            className="w-full pl-9 pr-8 py-1.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            aria-label="Search tasks"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              aria-label="Clear search query"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Clear Completed Button */}
        {completedCount > 0 && (
          <button
            onClick={onClearCompleted}
            className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-medium text-rose-600 dark:text-rose-400 bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-950/80 border border-rose-200 dark:border-rose-900/50 rounded-xl transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500"
            title="Remove all completed tasks (Shift + C)"
            aria-label={`Clear ${completedCount} finished tasks`}
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear finished ({completedCount})</span>
          </button>
        )}
      </div>

      {/* Bottom row: Filter Tabs & Sorting */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-200/60 dark:border-slate-800/60 pt-2.5">
        {/* Filter Tabs */}
        <div className="flex items-center gap-1 bg-white dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-800" role="tablist">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              role="tab"
              aria-selected={filterStatus === tab.id}
              onClick={() => onFilterChange(tab.id)}
              className={`px-3 py-1 text-xs font-medium rounded-lg transition-all flex items-center gap-1.5 ${
                filterStatus === tab.id
                  ? 'bg-indigo-600 text-white shadow-xs font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <span>{tab.label}</span>
              <kbd className={`text-[10px] font-mono px-1 rounded ${
                filterStatus === tab.id
                  ? 'bg-indigo-700 text-indigo-100'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
              }`}>
                {tab.keyHint}
              </kbd>
            </button>
          ))}
        </div>

        {/* Priority Filter & Sort Options */}
        <div className="flex items-center gap-2">
          {/* Priority Filter Dropdown */}
          <select
            value={selectedPriority}
            onChange={(e) => onPriorityFilterChange(e.target.value as Priority | 'all')}
            className="bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 rounded-xl px-2.5 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
            aria-label="Filter by priority"
          >
            <option value="all">All Priorities</option>
            <option value="high">High Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="low">Low Priority</option>
          </select>

          {/* Sort Dropdown */}
          <select
            value={sortOption}
            onChange={(e) => onSortChange(e.target.value as SortOption)}
            className="bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 rounded-xl px-2.5 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
            aria-label="Sort tasks by"
          >
            <option value="created-desc">Newest First</option>
            <option value="created-asc">Oldest First</option>
            <option value="priority-desc">Priority (High to Low)</option>
            <option value="due-date">Due Date</option>
          </select>
        </div>
      </div>
    </div>
  );
};
