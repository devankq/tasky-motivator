
import React from 'react';
import { cn } from '@/lib/utils';

interface FilterTabsProps {
  filter: string;
  onFilterChange: (filter: string) => void;
  activeCount: number;
  completedCount: number;
}

const FilterTabs: React.FC<FilterTabsProps> = ({ 
  filter, 
  onFilterChange,
  activeCount,
  completedCount
}) => {
  return (
    <div className="flex items-center justify-center mb-6">
      <div className="glass-container p-1 flex space-x-1">
        <button
          onClick={() => onFilterChange('all')}
          className={cn(
            "filter-tab rounded-lg transition-all duration-200",
            filter === 'all' ? 
              "bg-white shadow-sm" : 
              "hover:bg-white/50"
          )}
        >
          All ({activeCount + completedCount})
        </button>
        <button
          onClick={() => onFilterChange('active')}
          className={cn(
            "filter-tab rounded-lg transition-all duration-200",
            filter === 'active' ? 
              "bg-white shadow-sm" : 
              "hover:bg-white/50"
          )}
        >
          Active ({activeCount})
        </button>
        <button
          onClick={() => onFilterChange('completed')}
          className={cn(
            "filter-tab rounded-lg transition-all duration-200",
            filter === 'completed' ? 
              "bg-white shadow-sm" : 
              "hover:bg-white/50"
          )}
        >
          Completed ({completedCount})
        </button>
      </div>
    </div>
  );
};

export default FilterTabs;
