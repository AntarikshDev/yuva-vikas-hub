import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/store';
import { assignTargets } from '@/store/slices/mobilisationSlice';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
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
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';

interface TargetAssignmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const TargetAssignmentDialog: React.FC<TargetAssignmentDialogProps> = ({
  open,
  onOpenChange,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    targetType: 'mobilisations',
    totalValue: '',
    period: '',
    allocationMethod: 'equal',
    cascadeToManagers: false,
    notifyRecipients: true,
    notes: '',
  });

  const handleSubmit = async () => {
    try {
      await dispatch(
        assignTargets({
          ...formData,
          totalValue: parseInt(formData.totalValue),
        })
      ).unwrap();

      toast({
        title: 'Targets Assigned',
        description: 'Target assignments have been created successfully.',
      });

      onOpenChange(false);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to assign targets. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Assign State Targets</DialogTitle>
          <DialogDescription>
            Create and allocate targets to districts and managers
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="targetType">Target Type</Label>
              <Select
                value={formData.targetType}
                onValueChange={(value) =>
                  setFormData({ ...formData, targetType: value })
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
              <Label htmlFor="totalValue">Total Target Value</Label>
              <Input
                id="totalValue"
                type="number"
                placeholder="50000"
                value={formData.totalValue}
                onChange={(e) =>
                  setFormData({ ...formData, totalValue: e.target.value })
                }
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="period">Period</Label>
            <Input
              id="period"
              placeholder="e.g., January 2025"
              value={formData.period}
              onChange={(e) =>
                setFormData({ ...formData, period: e.target.value })
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="allocationMethod">Allocation Method</Label>
            <Select
              value={formData.allocationMethod}
              onValueChange={(value) =>
                setFormData({ ...formData, allocationMethod: value })
              }
            >
              <SelectTrigger id="allocationMethod">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="equal">Equal Split</SelectItem>
                <SelectItem value="population">Weighted by Population</SelectItem>
                <SelectItem value="historical">
                  Weighted by Historical Achievement
                </SelectItem>
                <SelectItem value="manual">Manual Allocation</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes / Justification</Label>
            <Textarea
              id="notes"
              placeholder="Provide context or justification for this target assignment..."
              value={formData.notes}
              onChange={(e) =>
                setFormData({ ...formData, notes: e.target.value })
              }
              rows={3}
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="cascade"
                checked={formData.cascadeToManagers}
                onCheckedChange={(checked) =>
                  setFormData({
                    ...formData,
                    cascadeToManagers: checked as boolean,
                  })
                }
              />
              <Label htmlFor="cascade" className="cursor-pointer">
                Auto-cascade to managers and mobilisers
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="notify"
                checked={formData.notifyRecipients}
                onCheckedChange={(checked) =>
                  setFormData({
                    ...formData,
                    notifyRecipients: checked as boolean,
                  })
                }
              />
              <Label htmlFor="notify" className="cursor-pointer">
                Send notifications to recipients
              </Label>
            </div>
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
