
import React, { useState } from 'react';
import { DateRange } from "react-day-picker";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { 
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type FilterOption = {
  id: string;
  label: string;
  type: 'select' | 'date' | 'date-range' | 'text';
  options?: { value: string; label: string }[];
};

type FilterBarProps = {
  filters: FilterOption[];
  actions?: React.ReactNode;
  onFilterChange?: (filterId: string, value: any) => void;
};

export const EnhancedFilterBar: React.FC<FilterBarProps> = ({
  filters,
  actions,
  onFilterChange,
}) => {
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [selectValues, setSelectValues] = useState<Record<string, string>>({});

  const handleDateRangeChange = (range: DateRange | undefined) => {
    setDateRange(range);
    // If a filter for date range exists, call onFilterChange
    const dateFilter = filters.find(f => f.type === 'date-range');
    if (dateFilter && onFilterChange) {
      onFilterChange(dateFilter.id, range);
    }
  };

  const handleSelectChange = (filterId: string, value: string) => {
    setSelectValues(prev => ({ ...prev, [filterId]: value }));
    if (onFilterChange) {
      onFilterChange(filterId, value);
    }
  };

  return (
    <div className="rounded-lg border border-neutral-200 bg-white shadow-sm">
      <div className="flex flex-col space-y-3 p-4 md:flex-row md:items-center md:space-y-0 md:space-x-4">
        {filters.map((filter) => (
          <div key={filter.id} className="flex-1 min-w-[200px]">
            {filter.type === 'select' && filter.options && (
              <div className="space-y-1">
                <label htmlFor={filter.id} className="text-xs font-medium">
                  {filter.label}
                </label>
                <Select
                  value={selectValues[filter.id]}
                  onValueChange={(value) => handleSelectChange(filter.id, value)}
                >
                  <SelectTrigger id={filter.id} className="w-full">
                    <SelectValue placeholder={`Select ${filter.label}`} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>{filter.label}</SelectLabel>
                      {filter.options.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            )}
            
            {filter.type === 'date-range' && (
              <div className="space-y-1">
                <label htmlFor={filter.id} className="text-xs font-medium">
                  {filter.label}
                </label>
                <DateRangePicker
                  dateRange={dateRange}
                  onDateRangeChange={handleDateRangeChange}
                  placeholder={`Select ${filter.label}`}
                />
              </div>
            )}
          </div>
        ))}
        
        {actions && (
          <div className="flex space-x-2 md:ml-auto md:mt-6">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
}
