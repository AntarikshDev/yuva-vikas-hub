import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

interface KPIAlertDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const KPIAlertDialog: React.FC<KPIAlertDialogProps> = ({ open, onOpenChange }) => {
  const { toast } = useToast();

  const [metricName, setMetricName] = useState('');
  const [targetValue, setTargetValue] = useState('');
  const [thresholdType, setThresholdType] = useState('');
  const [frequency, setFrequency] = useState('');

  const handleSubmit = () => {
    console.log('Creating KPI alert:', {
      metricName,
      targetValue,
      thresholdType,
      frequency,
    });

    toast({
      title: 'Success',
      description: 'KPI alert configured successfully',
    });

    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Configure KPI Alert</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="metricName">Metric Name</Label>
            <Select value={metricName} onValueChange={setMetricName}>
              <SelectTrigger>
                <SelectValue placeholder="Select metric" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="placement-rate">Placement Rate</SelectItem>
                <SelectItem value="retention-rate">Retention Rate</SelectItem>
                <SelectItem value="mobilisation">Mobilisation</SelectItem>
                <SelectItem value="enrollment">Enrollment</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="targetValue">Target Value (%)</Label>
            <Input
              id="targetValue"
              type="number"
              placeholder="Enter target value"
              value={targetValue}
              onChange={(e) => setTargetValue(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="thresholdType">Threshold Type</Label>
            <Select value={thresholdType} onValueChange={setThresholdType}>
              <SelectTrigger>
                <SelectValue placeholder="Select threshold type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="below">Below Target</SelectItem>
                <SelectItem value="above">Above Target</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="frequency">Alert Frequency</Label>
            <Select value={frequency} onValueChange={setFrequency}>
              <SelectTrigger>
                <SelectValue placeholder="Select frequency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="realtime">Real-time</SelectItem>
                <SelectItem value="daily">Daily Digest</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>
            Save Alert
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
