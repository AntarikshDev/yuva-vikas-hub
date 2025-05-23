
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Filter } from 'lucide-react';

interface FilterOption {
  id: string;
  label: string;
  options?: { value: string; label: string }[];
  type: 'select' | 'date' | 'text' | 'date-range';
}

interface FilterBarProps {
  onSearch?: (query: string) => void;
  filters?: FilterOption[];
  onFilterChange?: (filters: Record<string, any>) => void;
  className?: string;
  actions?: React.ReactNode;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  onSearch,
  filters = [],
  onFilterChange,
  className = '',
  actions,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState<Record<string, any>>({});

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch?.(searchQuery);
  };

  const handleFilterChange = (id: string, value: any) => {
    const newFilters = { ...activeFilters, [id]: value };
    if (!value) delete newFilters[id];
    
    setActiveFilters(newFilters);
    onFilterChange?.(newFilters);
  };

  const clearFilters = () => {
    setActiveFilters({});
    onFilterChange?.({});
    setSearchQuery('');
    onSearch?.('');
  };

  const hasActiveFilters = Object.keys(activeFilters).length > 0 || searchQuery;

  return (
    <div className={`flex flex-col space-y-2 bg-white p-4 sm:flex-row sm:items-center sm:space-x-2 sm:space-y-0 ${className}`}>
      <form onSubmit={handleSearch} className="relative flex-1">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-neutral-500" />
        <Input
          placeholder="Search..."
          className="pl-9"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </form>
      
      {filters.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {filters.map((filter) => (
            <div key={filter.id} className="flex-shrink-0">
              {filter.type === 'select' && (
                <select
                  className="h-10 rounded-md border border-neutral-200 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                  value={activeFilters[filter.id] || ''}
                  onChange={(e) => handleFilterChange(filter.id, e.target.value)}
                >
                  <option value="">{filter.label}</option>
                  {filter.options?.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              )}
              {filter.type === 'date' && (
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-neutral-500">{filter.label}:</span>
                  <input
                    type="date"
                    className="h-10 rounded-md border border-neutral-200 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                    value={activeFilters[filter.id] || ''}
                    onChange={(e) => handleFilterChange(filter.id, e.target.value)}
                  />
                </div>
              )}
              {filter.type === 'date-range' && (
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-neutral-500">{filter.label}:</span>
                  <input
                    type="date"
                    className="h-10 rounded-md border border-neutral-200 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                    value={activeFilters[`${filter.id}_start`] || ''}
                    onChange={(e) => handleFilterChange(`${filter.id}_start`, e.target.value)}
                  />
                  <span className="text-xs">to</span>
                  <input
                    type="date"
                    className="h-10 rounded-md border border-neutral-200 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                    value={activeFilters[`${filter.id}_end`] || ''}
                    onChange={(e) => handleFilterChange(`${filter.id}_end`, e.target.value)}
                  />
                </div>
              )}
            </div>
          ))}
          
          {hasActiveFilters && (
            <Button
              variant="outline"
              size="sm"
              onClick={clearFilters}
              className="h-10"
            >
              Clear
            </Button>
          )}
        </div>
      )}
      
      {actions && (
        <div className="flex justify-end space-x-2">
          {actions}
        </div>
      )}
    </div>
  );
};
