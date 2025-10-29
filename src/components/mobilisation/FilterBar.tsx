import React from 'react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { DateRangePicker } from '@/components/ui/date-range-picker';
import { DateRange } from 'react-day-picker';

interface FilterBarProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  filters: any;
  onFiltersChange: (filters: any) => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  open,
  onOpenChange,
  filters,
  onFiltersChange,
}) => {
  const [localFilters, setLocalFilters] = React.useState(filters);

  const handleApply = () => {
    onFiltersChange(localFilters);
    onOpenChange(false);
  };

  const handleReset = () => {
    const resetFilters = {
      dateRange: [null, null],
      campaign: '',
      targetType: 'mobilisations',
      geoLevel: 'state',
      status: '',
      searchQuery: '',
    };
    setLocalFilters(resetFilters);
    onFiltersChange(resetFilters);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle>Filters</SheetTitle>
          <SheetDescription>
            Apply filters to refine the mobilisation data
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-6 py-6">
          <div className="space-y-2">
            <Label>Date Range</Label>
            <DateRangePicker
              dateRange={undefined}
              onDateRangeChange={(range: DateRange | undefined) =>
                setLocalFilters({
                  ...localFilters,
                  dateRange: range
                    ? [range.from?.toISOString() || null, range.to?.toISOString() || null]
                    : [null, null],
                })
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="campaign">Campaign / Project</Label>
            <Select
              value={localFilters.campaign}
              onValueChange={(value) =>
                setLocalFilters({ ...localFilters, campaign: value })
              }
            >
              <SelectTrigger id="campaign">
                <SelectValue placeholder="All campaigns" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Campaigns</SelectItem>
                <SelectItem value="campaign1">Campaign 1</SelectItem>
                <SelectItem value="campaign2">Campaign 2</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="targetType">Target Type</Label>
            <Select
              value={localFilters.targetType}
              onValueChange={(value) =>
                setLocalFilters({ ...localFilters, targetType: value })
              }
            >
              <SelectTrigger id="targetType">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mobilisations">Mobilisations</SelectItem>
                <SelectItem value="enrollments">Enrollments</SelectItem>
                <SelectItem value="placements">Placements</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select
              value={localFilters.status}
              onValueChange={(value) =>
                setLocalFilters({ ...localFilters, status: value })
              }
            >
              <SelectTrigger id="status">
                <SelectValue placeholder="All statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Statuses</SelectItem>
                <SelectItem value="on-track">On Track</SelectItem>
                <SelectItem value="at-risk">At Risk</SelectItem>
                <SelectItem value="off-track">Off Track</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="search">Search</Label>
            <Input
              id="search"
              placeholder="Search by name, ID, phone..."
              value={localFilters.searchQuery}
              onChange={(e) =>
                setLocalFilters({ ...localFilters, searchQuery: e.target.value })
              }
            />
          </div>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" onClick={handleReset} className="flex-1">
            Reset
          </Button>
          <Button onClick={handleApply} className="flex-1">
            Apply Filters
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};
