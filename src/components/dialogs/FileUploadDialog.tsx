import React, { useState, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Upload, FileSpreadsheet, CheckCircle, AlertTriangle, X, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface FileUploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  uploadType: 'attendance' | 'curriculum' | 'activities' | null;
  onFileUpload: (file: File, type: string) => Promise<void>;
  batchInfo: {
    date: string;
    session: string;
    batch: string;
  };
}

export const FileUploadDialog: React.FC<FileUploadDialogProps> = ({
  open,
  onOpenChange,
  uploadType,
  onFileUpload,
  batchInfo
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const uploadTypeConfig = {
    attendance: {
      title: 'Upload Attendance Data',
      description: 'Upload attendance data for the selected batch and session',
      icon: <FileSpreadsheet className="h-6 w-6" />,
      acceptedFormats: 'Excel (.xlsx, .xls) or CSV files',
      template: 'Attendance Template'
    },
    curriculum: {
      title: 'Upload ACPL Curriculum Progress',
      description: 'Upload curriculum progress and assessment data',
      icon: <FileSpreadsheet className="h-6 w-6" />,
      acceptedFormats: 'Excel (.xlsx, .xls) or CSV files',
      template: 'Curriculum Progress Template'
    },
    activities: {
      title: 'Upload Other Activities',
      description: 'Upload other training activities and events data',
      icon: <FileSpreadsheet className="h-6 w-6" />,
      acceptedFormats: 'Excel (.xlsx, .xls) or CSV files',
      template: 'Activities Template'
    }
  };

  const config = uploadType ? uploadTypeConfig[uploadType] : null;

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ['.xlsx', '.xls', '.csv'];
    const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));
    
    if (!validTypes.includes(fileExtension)) {
      toast({
        title: "Invalid file type",
        description: "Please upload Excel (.xlsx, .xls) or CSV files only.",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "File size must be less than 5MB.",
        variant: "destructive",
      });
      return;
    }

    setSelectedFile(file);
  };

  const handleUpload = async () => {
    if (!selectedFile || !uploadType) return;

    // Validate that all batch information is provided
    if (!batchInfo.date || !batchInfo.session || !batchInfo.batch) {
      toast({
        title: "Missing Information",
        description: "Please select date, session, and batch before uploading.",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    try {
      await onFileUpload(selectedFile, uploadType);
      setSelectedFile(null);
      onOpenChange(false);
      
      toast({
        title: "Upload successful",
        description: `${config?.title} completed successfully.`,
      });
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "There was an error uploading your file. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {config?.icon}
            {config?.title}
          </DialogTitle>
          <DialogDescription>
            {config?.description}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Batch Information */}
          <Card>
            <CardContent className="pt-4">
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <Label className="text-muted-foreground">Date</Label>
                  <p className="font-medium">{batchInfo.date || 'Not selected'}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Session</Label>
                  <p className="font-medium">{batchInfo.session || 'Not selected'}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Batch</Label>
                  <p className="font-medium">{batchInfo.batch || 'Not selected'}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* File Upload Area */}
          <div className="space-y-4">
            <Label>Select File to Upload</Label>
            
            {!selectedFile ? (
              <div
                className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center cursor-pointer hover:border-muted-foreground/50 transition-colors"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-lg font-medium mb-2">Click to upload file</p>
                <p className="text-sm text-muted-foreground mb-4">
                  {config?.acceptedFormats}
                </p>
                <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                  <AlertTriangle className="h-3 w-3" />
                  Maximum file size: 5MB
                </div>
              </div>
            ) : (
              <Card>
                <CardContent className="pt-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <FileSpreadsheet className="h-8 w-8 text-blue-600" />
                      <div>
                        <p className="font-medium">{selectedFile.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {formatFileSize(selectedFile.size)}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleRemoveFile}
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept=".xlsx,.xls,.csv"
              style={{ display: 'none' }}
              onChange={handleFileSelect}
            />
          </div>

          {/* Guidelines */}
          <div className="space-y-2">
            <Label>Upload Guidelines</Label>
            <div className="text-sm text-muted-foreground space-y-2 bg-muted/50 p-3 rounded-lg">
              <div className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Ensure all mandatory fields are filled</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Use only the provided {config?.template} format</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Verify data accuracy before uploading</span>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button 
            onClick={handleUpload} 
            disabled={!selectedFile || isUploading}
            className="min-w-[100px]"
          >
            {isUploading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4 mr-2" />
                Upload
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};