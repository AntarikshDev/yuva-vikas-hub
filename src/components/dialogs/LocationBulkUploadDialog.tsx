import React, { useState, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Upload, FileSpreadsheet, CheckCircle, AlertTriangle, X, Loader2, FileDown } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { downloadLocationTemplate, LocationType } from '@/utils/locationTemplates';

interface LocationBulkUploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  locationType: LocationType;
  onFileUpload?: (file: File) => Promise<void>;
}

export const LocationBulkUploadDialog: React.FC<LocationBulkUploadDialogProps> = ({
  open,
  onOpenChange,
  locationType,
  onFileUpload
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const locationTypeLabels: Record<LocationType, string> = {
    state: 'States',
    district: 'Districts',
    block: 'Blocks',
    panchayat: 'Panchayats',
    village: 'Villages',
    pincode: 'Pincodes'
  };

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

    // Validate file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "File size must be less than 10MB.",
        variant: "destructive",
      });
      return;
    }

    setSelectedFile(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    try {
      if (onFileUpload) {
        await onFileUpload(selectedFile);
      } else {
        // Simulate upload
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
      
      toast({
        title: "Upload successful",
        description: `${locationTypeLabels[locationType]} data uploaded successfully.`,
      });
      
      setSelectedFile(null);
      onOpenChange(false);
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

  const handleClose = () => {
    setSelectedFile(null);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileSpreadsheet className="h-5 w-5" />
            Bulk Upload {locationTypeLabels[locationType]}
          </DialogTitle>
          <DialogDescription>
            Upload location data using the standard template format
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5">
          {/* Template Download Section */}
          <Card className="border-dashed">
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm">Download Template</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Use the standard template format for bulk upload
                  </p>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => downloadLocationTemplate(locationType)}
                >
                  <FileDown className="h-4 w-4 mr-2" />
                  Download
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Template Format Preview */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Template Format</Label>
            <div className="overflow-x-auto border rounded-lg">
              <table className="w-full text-xs">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="px-2 py-1.5 text-left font-medium whitespace-nowrap">Sr No</th>
                    <th className="px-2 py-1.5 text-left font-medium whitespace-nowrap">State Code</th>
                    <th className="px-2 py-1.5 text-left font-medium whitespace-nowrap">State</th>
                    <th className="px-2 py-1.5 text-left font-medium whitespace-nowrap">District</th>
                    <th className="px-2 py-1.5 text-left font-medium whitespace-nowrap">Block</th>
                    <th className="px-2 py-1.5 text-left font-medium whitespace-nowrap">Panchayat Name</th>
                    <th className="px-2 py-1.5 text-left font-medium whitespace-nowrap">Village Name</th>
                    <th className="px-2 py-1.5 text-left font-medium whitespace-nowrap">Pincode</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t">
                    <td className="px-2 py-1.5 whitespace-nowrap">1</td>
                    <td className="px-2 py-1.5 font-medium whitespace-nowrap">JH</td>
                    <td className="px-2 py-1.5 whitespace-nowrap">Jharkhand</td>
                    <td className="px-2 py-1.5 whitespace-nowrap">Bokaro</td>
                    <td className="px-2 py-1.5 whitespace-nowrap">Bermo</td>
                    <td className="px-2 py-1.5 whitespace-nowrap">Armo</td>
                    <td className="px-2 py-1.5 whitespace-nowrap">Armo</td>
                    <td className="px-2 py-1.5 whitespace-nowrap">123456</td>
                  </tr>
                  <tr className="border-t bg-muted/30">
                    <td className="px-2 py-1.5 whitespace-nowrap">2</td>
                    <td className="px-2 py-1.5 font-medium whitespace-nowrap">JH</td>
                    <td className="px-2 py-1.5 whitespace-nowrap">Jharkhand</td>
                    <td className="px-2 py-1.5 whitespace-nowrap">Bokaro</td>
                    <td className="px-2 py-1.5 whitespace-nowrap">Bermo</td>
                    <td className="px-2 py-1.5 whitespace-nowrap">Baidhkaro East</td>
                    <td className="px-2 py-1.5 whitespace-nowrap">Baidkaro</td>
                    <td className="px-2 py-1.5 whitespace-nowrap">123456</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-xs text-muted-foreground">
              Only State Code is required. Other location levels use names only.
            </p>
          </div>

          {/* File Upload Area */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Select File to Upload</Label>
            
            {!selectedFile ? (
              <div
                className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center cursor-pointer hover:border-muted-foreground/50 transition-colors"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="h-10 w-10 mx-auto text-muted-foreground mb-3" />
                <p className="text-sm font-medium mb-1">Click to upload file</p>
                <p className="text-xs text-muted-foreground mb-3">
                  Excel (.xlsx, .xls) or CSV files
                </p>
                <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                  <AlertTriangle className="h-3 w-3" />
                  Maximum file size: 10MB
                </div>
              </div>
            ) : (
              <Card>
                <CardContent className="pt-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 min-w-0">
                      <FileSpreadsheet className="h-8 w-8 text-primary flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="font-medium text-sm truncate">{selectedFile.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {formatFileSize(selectedFile.size)}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleRemoveFile}
                      className="text-muted-foreground hover:text-destructive flex-shrink-0"
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
            <Label className="text-sm font-medium">Upload Guidelines</Label>
            <div className="text-xs text-muted-foreground space-y-1.5 bg-muted/50 p-3 rounded-lg">
              <div className="flex items-start gap-2">
                <CheckCircle className="h-3.5 w-3.5 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Ensure all mandatory fields are filled</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="h-3.5 w-3.5 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Use only the provided template format</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="h-3.5 w-3.5 text-green-600 mt-0.5 flex-shrink-0" />
                <span>State Code should be 2-letter code (e.g., JH, MH, KA)</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle className="h-3.5 w-3.5 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Verify data accuracy before uploading</span>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={handleClose}>
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
