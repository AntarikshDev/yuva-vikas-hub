import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/store';
import { assignTargets } from '@/store/slices/mobilisationSlice';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { DateRangePicker } from '@/components/ui/date-range-picker';
import { toast } from 'sonner';
import { DateRange } from 'react-day-picker';
import { format } from 'date-fns';

interface TargetAssignmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const TargetAssignmentDialog: React.FC<TargetAssignmentDialogProps> = ({
  open,
  onOpenChange,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const [targetType, setTargetType] = useState('mobilisations');
  const [totalValue, setTotalValue] = useState('');
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [allocationMethod, setAllocationMethod] = useState('equal');
  const [cascadeToManagers, setCascadeToManagers] = useState(true);
  const [notifyAssignees, setNotifyAssignees] = useState(true);
  const [notes, setNotes] = useState('');

  const handleSubmit = async () => {
    if (!totalValue || !dateRange?.from || !dateRange?.to) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      await dispatch(
        assignTargets({
          targetType,
          totalValue: parseInt(totalValue),
          period: {
            from: format(dateRange.from, 'yyyy-MM-dd'),
            to: format(dateRange.to, 'yyyy-MM-dd'),
            duration: `${Math.ceil((dateRange.to.getTime() - dateRange.from.getTime()) / (1000 * 60 * 60 * 24))} days`
          },
          allocationMethod,
          cascadeToManagers,
          notifyAssignees,
          notes,
        })
      ).unwrap();

      toast.success('Targets assigned successfully');
      onOpenChange(false);
      
      // Reset form
      setTotalValue('');
      setDateRange(undefined);
      setNotes('');
    } catch (error) {
      toast.error('Failed to assign targets');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Assign State Targets</DialogTitle>
          <DialogDescription>
            Set targets for clusters and cascade them down to managers and mobilisers
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Target Type */}
          <div className="space-y-2">
            <Label htmlFor="targetType">Target Type</Label>
            <Select value={targetType} onValueChange={setTargetType}>
              <SelectTrigger id="targetType">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mobilisations">Mobilisations</SelectItem>
                <SelectItem value="counselling">Counselling Sessions</SelectItem>
                <SelectItem value="enrollments">Enrollments</SelectItem>
                <SelectItem value="placements">Placements</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Total Value */}
          <div className="space-y-2">
            <Label htmlFor="totalValue">Total Target Value</Label>
            <Input
              id="totalValue"
              type="number"
              placeholder="Enter total target value"
              value={totalValue}
              onChange={(e) => setTotalValue(e.target.value)}
            />
          </div>

          {/* Period with Date Range Picker */}
          <div className="space-y-2">
            <Label>Target Period</Label>
            <DateRangePicker
              dateRange={dateRange}
              onDateRangeChange={setDateRange}
              placeholder="Select date range"
            />
            {dateRange?.from && dateRange?.to && (
              <p className="text-sm text-muted-foreground">
                Duration: {Math.ceil((dateRange.to.getTime() - dateRange.from.getTime()) / (1000 * 60 * 60 * 24))} days
              </p>
            )}
          </div>

          {/* Allocation Method */}
          <div className="space-y-2">
            <Label htmlFor="allocationMethod">Allocation Method</Label>
            <Select value={allocationMethod} onValueChange={setAllocationMethod}>
              <SelectTrigger id="allocationMethod">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="equal">Equal Distribution</SelectItem>
                <SelectItem value="weighted">Weighted by Past Performance</SelectItem>
                <SelectItem value="capacity">Based on Team Capacity</SelectItem>
                <SelectItem value="manual">Manual Assignment</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Options */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="cascade"
                checked={cascadeToManagers}
                onCheckedChange={(checked) =>
                  setCascadeToManagers(checked as boolean)
                }
              />
              <Label
                htmlFor="cascade"
                className="text-sm font-normal cursor-pointer"
              >
                Automatically cascade to managers and mobilisers
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="notify"
                checked={notifyAssignees}
                onCheckedChange={(checked) =>
                  setNotifyAssignees(checked as boolean)
                }
              />
              <Label
                htmlFor="notify"
                className="text-sm font-normal cursor-pointer"
              >
                Send notification to all assignees
              </Label>
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Additional Notes</Label>
            <Textarea
              id="notes"
              placeholder="Add any additional instructions or context..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Assign Targets</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};