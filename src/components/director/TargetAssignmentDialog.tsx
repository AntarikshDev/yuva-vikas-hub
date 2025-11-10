import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { DateRangePicker } from '@/components/ui/date-range-picker';
import { useToast } from '@/hooks/use-toast';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/store';
import { assignNationalTargets } from '@/store/slices/directorSlice';
import { format, differenceInDays } from 'date-fns';
import { DateRange } from 'react-day-picker';

interface TargetAssignmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const TargetAssignmentDialog: React.FC<TargetAssignmentDialogProps> = ({ open, onOpenChange }) => {
  const { toast } = useToast();
  const dispatch = useDispatch<AppDispatch>();

  const [targetType, setTargetType] = useState('');
  const [totalValue, setTotalValue] = useState('');
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [allocationMethod, setAllocationMethod] = useState('');
  const [cascadeToManagers, setCascadeToManagers] = useState(false);
  const [notifyAssignees, setNotifyAssignees] = useState(true);
  const [notes, setNotes] = useState('');

  const handleSubmit = async () => {
    if (!targetType || !totalValue || !dateRange?.from || !dateRange?.to || !allocationMethod) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      });
      return;
    }

    try {
      await dispatch(assignNationalTargets({
        targetType,
        totalValue: parseInt(totalValue),
        startDate: format(dateRange.from, 'yyyy-MM-dd'),
        endDate: format(dateRange.to, 'yyyy-MM-dd'),
        allocationMethod,
        cascadeToManagers,
        notifyAssignees,
        notes,
      })).unwrap();

      toast({
        title: 'Success',
        description: 'Targets assigned successfully',
      });

      onOpenChange(false);
      // Reset form
      setTargetType('');
      setTotalValue('');
      setDateRange(undefined);
      setAllocationMethod('');
      setNotes('');
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to assign targets',
        variant: 'destructive',
      });
    }
  };

  const duration = dateRange?.from && dateRange?.to 
    ? differenceInDays(dateRange.to, dateRange.from) + 1
    : 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Assign National Targets</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="targetType">Target Type *</Label>
              <Select value={targetType} onValueChange={setTargetType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select target type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mobilisation">Mobilisation</SelectItem>
                  <SelectItem value="enrollment">Enrollment</SelectItem>
                  <SelectItem value="placement">Placement</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="totalValue">Total Target Value *</Label>
              <Input
                id="totalValue"
                type="number"
                placeholder="Enter target value"
                value={totalValue}
                onChange={(e) => setTotalValue(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Period *</Label>
            <DateRangePicker
              dateRange={dateRange}
              onDateRangeChange={setDateRange}
            />
            {duration > 0 && dateRange?.from && dateRange?.to && (
              <p className="text-sm text-muted-foreground">
                Duration: {duration} day{duration !== 1 ? 's' : ''} 
                ({format(dateRange.from, 'MMM dd, yyyy')} - {format(dateRange.to, 'MMM dd, yyyy')})
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="allocationMethod">Allocation Method *</Label>
            <Select value={allocationMethod} onValueChange={setAllocationMethod}>
              <SelectTrigger>
                <SelectValue placeholder="Select allocation method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="manual">Manual</SelectItem>
                <SelectItem value="equal">Equal Split</SelectItem>
                <SelectItem value="population">Weighted by Population</SelectItem>
                <SelectItem value="historical">Weighted by Historical Achievement</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="cascade"
                checked={cascadeToManagers}
                onCheckedChange={(checked) => setCascadeToManagers(checked as boolean)}
              />
              <Label htmlFor="cascade" className="text-sm font-normal cursor-pointer">
                Cascade to lower levels (managers and mobilisers)
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="notify"
                checked={notifyAssignees}
                onCheckedChange={(checked) => setNotifyAssignees(checked as boolean)}
              />
              <Label htmlFor="notify" className="text-sm font-normal cursor-pointer">
                Notify assignees (Email & In-app)
              </Label>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Justification / Notes</Label>
            <Textarea
              id="notes"
              placeholder="Enter any justification or additional notes..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>
            Assign Targets
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
