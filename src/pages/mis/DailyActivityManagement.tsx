import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Upload, Calendar, Users, FileSpreadsheet, CheckCircle, AlertTriangle, Download, Plus, Loader2 } from 'lucide-react';
import { DataTable } from '@/components/common/DataTable';
import { BatchCreationDialog } from '@/components/dialogs/BatchCreationDialog';
import { FileUploadDialog } from '@/components/dialogs/FileUploadDialog';
import { useToast } from '@/hooks/use-toast';

const DailyActivityManagement = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedSession, setSelectedSession] = useState('');
  const [selectedBatch, setSelectedBatch] = useState('');
  const [isBatchDialogOpen, setIsBatchDialogOpen] = useState(false);
  const [isFileUploadDialogOpen, setIsFileUploadDialogOpen] = useState(false);
  const [uploadType, setUploadType] = useState<'attendance' | 'curriculum' | 'activities' | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [notes, setNotes] = useState('');
  const { toast } = useToast();

  // Remove file input refs as we'll use the dialog

  // Mock data for batches - now stateful to allow adding new batches
  const [batches, setBatches] = useState([
    { id: 'B2024-01', name: 'Batch B2024-01 - Retail Sales', candidates: 45 },
    { id: 'B2024-02', name: 'Batch B2024-02 - Customer Service', candidates: 38 },
    { id: 'B2024-03', name: 'Batch B2024-03 - Data Entry', candidates: 42 }
  ]);

  // Mock data for recent uploads - now stateful to allow adding new uploads
  const [recentUploads, setRecentUploads] = useState([
    {
      id: 1,
      date: '2025-08-20',
      session: 'Morning',
      batch: 'B2024-01',
      type: 'Attendance',
      status: 'completed',
      uploadedBy: 'MIS User',
      uploadTime: '09:30 AM'
    },
    {
      id: 2,
      date: '2025-08-20',
      session: 'Afternoon',
      batch: 'B2024-02',
      type: 'Curriculum',
      status: 'completed',
      uploadedBy: 'MIS User',
      uploadTime: '02:15 PM'
    },
    {
      id: 3,
      date: '2025-08-19',
      session: 'Evening',
      batch: 'B2024-03',
      type: 'Activities',
      status: 'pending',
      uploadedBy: 'MIS User',
      uploadTime: '06:45 PM'
    }
  ]);

  const columns = [
    {
      id: 'date',
      header: 'Date',
      cell: (item: any) => item.date,
    },
    {
      id: 'session',
      header: 'Session',
      cell: (item: any) => item.session,
    },
    {
      id: 'batch',
      header: 'Batch',
      cell: (item: any) => item.batch,
    },
    {
      id: 'type',
      header: 'Type',
      cell: (item: any) => item.type,
    },
    {
      id: 'status',
      header: 'Status',
      cell: (item: any) => (
        <Badge variant={item.status === 'completed' ? 'default' : 'secondary'}>
          {item.status}
        </Badge>
      ),
    },
    {
      id: 'uploadTime',
      header: 'Upload Time',
      cell: (item: any) => item.uploadTime,
    }
  ];

  const handleFileUpload = (type: 'attendance' | 'curriculum' | 'activities') => {
    setUploadType(type);
    setIsFileUploadDialogOpen(true);
  };

  const handleFileUploadProcess = async (file: File, type: string) => {
    setIsUploading(true);

    try {
      // Simulate file upload with a delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Add new upload to recent uploads
      const newUpload = {
        id: Date.now(),
        date: selectedDate,
        session: selectedSession,
        batch: selectedBatch,
        type: type.charAt(0).toUpperCase() + type.slice(1),
        status: 'completed',
        uploadedBy: 'MIS User',
        uploadTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setRecentUploads(prev => [newUpload, ...prev]);

      // Reset form
      setNotes('');
      
    } catch (error) {
      throw error;
    } finally {
      setIsUploading(false);
    }
  };

  const handleBatchCreated = (newBatch: any) => {
    setBatches(prev => [...prev, {
      id: newBatch.id,
      name: `${newBatch.id} - ${newBatch.name}`,
      candidates: newBatch.candidates
    }]);
  };

  return (
    <div className="p-3 sm:p-6 space-y-6">
      {/* Header */}
      <div className="border-b pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">Daily Activity Management</h1>
            <p className="text-muted-foreground">Upload daily attendance, curriculum progress, and activity data</p>
          </div>
          <Button onClick={() => setIsBatchDialogOpen(true)} className="flex items-center gap-2 whitespace-nowrap">
            <Plus className="h-4 w-4" />
            Create Batch
          </Button>
        </div>
      </div>

      {/* Upload Section */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
        {/* Upload Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Upload Daily Data
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="session">Session</Label>
                <Select value={selectedSession} onValueChange={setSelectedSession}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Session" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="morning">Morning (9:00 AM - 12:00 PM)</SelectItem>
                    <SelectItem value="afternoon">Afternoon (1:00 PM - 5:00 PM)</SelectItem>
                    <SelectItem value="evening">Evening (6:00 PM - 8:00 PM)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <Label htmlFor="batch">Select Batch</Label>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setIsBatchDialogOpen(true)}
                  className="text-xs h-6 px-2"
                >
                  <Plus className="h-3 w-3 mr-1" />
                  New
                </Button>
              </div>
              <Select value={selectedBatch} onValueChange={setSelectedBatch}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Batch" />
                </SelectTrigger>
                <SelectContent>
                  {batches.map((batch) => (
                    <SelectItem key={batch.id} value={batch.id}>
                      {batch.name} ({batch.candidates} candidates)
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label>Upload Type</Label>
                <div className="grid grid-cols-1 gap-2">
                  <Button 
                    variant="outline" 
                    className="justify-start" 
                    onClick={() => handleFileUpload('attendance')}
                    disabled={isUploading}
                  >
                    {isUploading ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Users className="h-4 w-4 mr-2" />
                    )}
                    Upload Attendance Data (Excel/CSV)
                  </Button>
                  <Button 
                    variant="outline" 
                    className="justify-start"
                    onClick={() => handleFileUpload('curriculum')}
                    disabled={isUploading}
                  >
                    {isUploading ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <FileSpreadsheet className="h-4 w-4 mr-2" />
                    )}
                    Upload ACPL Curriculum Progress
                  </Button>
                  <Button 
                    variant="outline" 
                    className="justify-start"
                    onClick={() => handleFileUpload('activities')}
                    disabled={isUploading}
                  >
                    {isUploading ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Calendar className="h-4 w-4 mr-2" />
                    )}
                    Upload Other Activities
                  </Button>
                </div>
              </div>
            </div>

            <div>
              <Label htmlFor="notes">Additional Notes</Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Any additional notes about the session or activities..."
                className="min-h-[80px]"
              />
            </div>

          </CardContent>
        </Card>

        {/* Template Downloads & Guidelines */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download className="h-5 w-5" />
              Templates & Guidelines
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <h4 className="font-medium">Download Templates</h4>
              <div className="space-y-2">
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <FileSpreadsheet className="h-4 w-4 mr-2" />
                  Attendance Template (Excel)
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <FileSpreadsheet className="h-4 w-4 mr-2" />
                  Curriculum Progress Template
                </Button>
                <Button variant="outline" size="sm" className="w-full justify-start">
                  <FileSpreadsheet className="h-4 w-4 mr-2" />
                  Activities Template
                </Button>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium">Upload Guidelines</h4>
              <div className="text-sm text-muted-foreground space-y-2">
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                  <span>Upload data for the previous day before 10:00 AM</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                  <span>Ensure all mandatory fields are filled</span>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600 mt-0.5" />
                  <span>Use only provided templates for uploads</span>
                </div>
                <div className="flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 text-orange-600 mt-0.5" />
                  <span>Maximum file size: 5MB</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium">Data Requirements</h4>
              <div className="text-sm text-muted-foreground space-y-1">
                <p><strong>Attendance:</strong> Candidate ID, Name, Session, Status (P/A/L)</p>
                <p><strong>Curriculum:</strong> Module completed, Progress %, Assessment scores</p>
                <p><strong>Activities:</strong> Activity type, Duration, Participants</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Uploads */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Recent Uploads
            </span>
            <Button variant="outline" size="sm">View All</Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <DataTable
            columns={columns}
            data={recentUploads}
          />
        </CardContent>
      </Card>

      <BatchCreationDialog
        open={isBatchDialogOpen}
        onOpenChange={setIsBatchDialogOpen}
        onBatchCreated={handleBatchCreated}
      />

      <FileUploadDialog
        open={isFileUploadDialogOpen}
        onOpenChange={setIsFileUploadDialogOpen}
        uploadType={uploadType}
        onFileUpload={handleFileUploadProcess}
        batchInfo={{
          date: selectedDate,
          session: selectedSession,
          batch: selectedBatch
        }}
      />
    </div>
  );
};

export default DailyActivityManagement;