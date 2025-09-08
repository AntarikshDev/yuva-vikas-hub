import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { DateRangePicker } from '@/components/ui/date-range-picker';
import { FileText, Download, Calendar, Filter } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
interface MigrationReportDialogProps {
  open: boolean;
  onClose: () => void;
}
export function MigrationReportDialog({
  open,
  onClose
}: MigrationReportDialogProps) {
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: undefined,
    to: undefined
  });
  const [selectedBatch, setSelectedBatch] = useState('all');
  const [selectedCompany, setSelectedCompany] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [reportFormat, setReportFormat] = useState('excel');
  const [includeDetails, setIncludeDetails] = useState({
    candidateInfo: true,
    contactDetails: true,
    placementInfo: true,
    migrationDates: true,
    enrollmentStatus: true
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const {
    toast
  } = useToast();
  const handleGenerateReport = async () => {
    if (!dateRange.from || !dateRange.to) {
      toast({
        title: "Date Range Required",
        description: "Please select a date range for the report",
        variant: "destructive"
      });
      return;
    }
    setIsGenerating(true);
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 3000));
      toast({
        title: "Report Generated",
        description: "Migration report has been generated and downloaded successfully"
      });
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate migration report",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };
  return <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Export Migration Report
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Date Range */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Calendar className="h-5 w-5" />
                Date Range
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Label>Select date range for migration data</Label>
                <DateRangePicker dateRange={dateRange.from && dateRange.to ? {
                from: dateRange.from,
                to: dateRange.to
              } : undefined} onDateRangeChange={range => setDateRange({
                from: range?.from,
                to: range?.to
              })} />
              </div>
            </CardContent>
          </Card>

          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Filter className="h-5 w-5" />
                Filters
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Batch</Label>
                  <Select value={selectedBatch} onValueChange={setSelectedBatch}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select batch" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Batches</SelectItem>
                      <SelectItem value="B2024-01">B2024-01</SelectItem>
                      <SelectItem value="B2024-02">B2024-02</SelectItem>
                      <SelectItem value="B2024-03">B2024-03</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                

                

                <div className="space-y-2">
                  <Label>Migration Status</Label>
                  <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="ready">Ready for Migration</SelectItem>
                      <SelectItem value="migrated">Migrated</SelectItem>
                      <SelectItem value="enrolled">Enrolled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Report Details */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Report Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Report Format</Label>
                  <Select value={reportFormat} onValueChange={setReportFormat}>
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="excel">Excel (.xlsx)</SelectItem>
                      <SelectItem value="csv">CSV (.csv)</SelectItem>
                      <SelectItem value="pdf">PDF (.pdf)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <Label>Include in Report</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox id="candidate-info" checked={includeDetails.candidateInfo} onCheckedChange={checked => setIncludeDetails(prev => ({
                      ...prev,
                      candidateInfo: checked as boolean
                    }))} />
                      <Label htmlFor="candidate-info" className="text-sm">
                        Candidate Information
                      </Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox id="contact-details" checked={includeDetails.contactDetails} onCheckedChange={checked => setIncludeDetails(prev => ({
                      ...prev,
                      contactDetails: checked as boolean
                    }))} />
                      <Label htmlFor="contact-details" className="text-sm">
                        Contact Details
                      </Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox id="placement-info" checked={includeDetails.placementInfo} onCheckedChange={checked => setIncludeDetails(prev => ({
                      ...prev,
                      placementInfo: checked as boolean
                    }))} />
                      <Label htmlFor="placement-info" className="text-sm">
                        Placement Information
                      </Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox id="migration-dates" checked={includeDetails.migrationDates} onCheckedChange={checked => setIncludeDetails(prev => ({
                      ...prev,
                      migrationDates: checked as boolean
                    }))} />
                      <Label htmlFor="migration-dates" className="text-sm">
                        Migration Dates
                      </Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox id="enrollment-status" checked={includeDetails.enrollmentStatus} onCheckedChange={checked => setIncludeDetails(prev => ({
                      ...prev,
                      enrollmentStatus: checked as boolean
                    }))} />
                      <Label htmlFor="enrollment-status" className="text-sm">
                        Enrollment Status
                      </Label>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <DialogFooter className="flex gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleGenerateReport} disabled={isGenerating}>
            <Download className="h-4 w-4 mr-2" />
            {isGenerating ? "Generating..." : "Generate Report"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>;
}