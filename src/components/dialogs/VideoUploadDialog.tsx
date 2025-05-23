
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Upload, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface VideoUploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpload: (videoData: VideoData) => void;
}

export interface VideoData {
  title: string;
  description: string;
  jobRole: string;
  language: string;
  stage: string;
  file?: File;
}

export const VideoUploadDialog = ({ open, onOpenChange, onUpload }: VideoUploadDialogProps) => {
  const { toast } = useToast();
  const [videoData, setVideoData] = useState<VideoData>({
    title: '',
    description: '',
    jobRole: '',
    language: '',
    stage: '',
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleChange = (field: keyof VideoData, value: string) => {
    setVideoData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const resetForm = () => {
    setVideoData({
      title: '',
      description: '',
      jobRole: '',
      language: '',
      stage: '',
    });
    setSelectedFile(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!videoData.title || !videoData.jobRole || !selectedFile) {
      toast({
        title: "Missing information",
        description: "Please fill all required fields and select a video file.",
        variant: "destructive"
      });
      return;
    }
    
    setIsUploading(true);
    
    // Simulate upload process
    setTimeout(() => {
      onUpload({ ...videoData, file: selectedFile });
      toast({
        title: "Video uploaded successfully",
        description: `${videoData.title} has been uploaded and is being processed.`,
      });
      resetForm();
      setIsUploading(false);
      onOpenChange(false);
    }, 1500);
  };

  return (
    <Dialog open={open} onOpenChange={(newOpen) => {
      if (!isUploading) {
        onOpenChange(newOpen);
        if (!newOpen) resetForm();
      }
    }}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Upload Counselling Video</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Video Title*</Label>
            <Input 
              id="title" 
              value={videoData.title} 
              onChange={(e) => handleChange('title', e.target.value)} 
              required 
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea 
              id="description" 
              value={videoData.description} 
              onChange={(e) => handleChange('description', e.target.value)}
              rows={3}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="jobRole">Job Role*</Label>
              <Select 
                value={videoData.jobRole} 
                onValueChange={(value) => handleChange('jobRole', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select job role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="customer-service">Customer Service Executive</SelectItem>
                  <SelectItem value="field-sales">Field Sales Executive</SelectItem>
                  <SelectItem value="healthcare">General Duty Assistant</SelectItem>
                  <SelectItem value="bpo-voice">BPO Voice</SelectItem>
                  <SelectItem value="retail-sales">Retail Sales Associate</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="language">Language</Label>
              <Select 
                value={videoData.language} 
                onValueChange={(value) => handleChange('language', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="english">English</SelectItem>
                  <SelectItem value="hindi">Hindi</SelectItem>
                  <SelectItem value="tamil">Tamil</SelectItem>
                  <SelectItem value="telugu">Telugu</SelectItem>
                  <SelectItem value="kannada">Kannada</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="stage">Counselling Stage</Label>
            <Select 
              value={videoData.stage} 
              onValueChange={(value) => handleChange('stage', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select stage" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="stage1">Stage 1</SelectItem>
                <SelectItem value="stage2">Stage 2</SelectItem>
                <SelectItem value="stage3">Stage 3</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="videoFile">Video File*</Label>
            <div className="border-2 border-dashed rounded-md p-6 flex flex-col items-center">
              {selectedFile ? (
                <div className="w-full">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-sm font-medium truncate max-w-[300px]">{selectedFile.name}</div>
                    <Button 
                      type="button" 
                      variant="ghost" 
                      size="sm"
                      onClick={() => setSelectedFile(null)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="text-xs text-gray-500">{(selectedFile.size / (1024 * 1024)).toFixed(2)} MB</div>
                </div>
              ) : (
                <>
                  <Upload className="h-8 w-8 text-gray-400 mb-2" />
                  <Label 
                    htmlFor="videoFile" 
                    className="text-sm text-blue-600 hover:text-blue-800 cursor-pointer"
                  >
                    Click to upload
                  </Label>
                  <span className="text-xs text-gray-500 mt-1">MP4, WebM or MKV (max 100MB)</span>
                </>
              )}
              <Input 
                id="videoFile" 
                type="file" 
                accept="video/*" 
                onChange={handleFileChange} 
                className="sr-only" 
              />
            </div>
          </div>
          
          <DialogFooter className="mt-6">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => {
                if (!isUploading) {
                  resetForm();
                  onOpenChange(false);
                }
              }}
              disabled={isUploading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isUploading}>
              {isUploading ? "Uploading..." : "Upload Video"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
