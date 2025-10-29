import React, { useState } from 'react';
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
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';

interface ReportScheduleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ReportScheduleDialog: React.FC<ReportScheduleDialogProps> = ({
  open,
  onOpenChange,
}) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    reportType: 'target-vs-achieved',
    format: 'pdf',
    cadence: 'weekly',
    recipients: '',
    maskPII: true,
  });

  const handleSubmit = async () => {
    // Integration point: POST /api/mobilisation/reports/schedule
    console.log('Schedule report:', formData);

    toast({
      title: 'Report Scheduled',
      description: 'Your report has been scheduled successfully.',
    });

    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Schedule Report</DialogTitle>
          <DialogDescription>
            Create a scheduled report with automatic delivery
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="reportType">Report Type</Label>
            <Select
              value={formData.reportType}
              onValueChange={(value) =>
                setFormData({ ...formData, reportType: value })
              }
            >
              <SelectTrigger id="reportType">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="target-vs-achieved">
                  Target vs Achieved
                </SelectItem>
                <SelectItem value="district-performance">
                  District Performance
                </SelectItem>
                <SelectItem value="mobiliser-leaderboard">
                  Mobiliser Leaderboard
                </SelectItem>
                <SelectItem value="visit-logs">Visit Logs</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="format">Format</Label>
              <Select
                value={formData.format}
                onValueChange={(value) =>
                  setFormData({ ...formData, format: value })
                }
              >
                <SelectTrigger id="format">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="csv">CSV</SelectItem>
                  <SelectItem value="excel">Excel</SelectItem>
                  <SelectItem value="pdf">PDF</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="cadence">Frequency</Label>
              <Select
                value={formData.cadence}
                onValueChange={(value) =>
                  setFormData({ ...formData, cadence: value })
                }
              >
                <SelectTrigger id="cadence">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="recipients">Recipients (Email)</Label>
            <Input
              id="recipients"
              placeholder="email1@example.com, email2@example.com"
              value={formData.recipients}
              onChange={(e) =>
                setFormData({ ...formData, recipients: e.target.value })
              }
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="maskPII"
              checked={formData.maskPII}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, maskPII: checked as boolean })
              }
            />
            <Label htmlFor="maskPII" className="cursor-pointer">
              Mask personally identifiable information (PII)
            </Label>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Schedule Report</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
