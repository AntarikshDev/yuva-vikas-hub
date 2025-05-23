
import React, { useState } from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";
import { Upload } from 'lucide-react';

const formSchema = z.object({
  title: z.string().min(2, "Title is required"),
  jobRole: z.string().min(1, "Job role is required"),
  counsellingStage: z.string().min(1, "Counselling stage is required"),
  description: z.string().min(10, "Description should be at least 10 characters"),
  videoFile: z.instanceof(File).optional(),
  videoUrl: z.string().url("Please enter a valid URL").optional(),
  language: z.string().min(1, "Language is required"),
});

interface VideoFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  itemId?: number;  // Added this prop
}

export function VideoForm({ open, onOpenChange, itemId }: VideoFormProps) {
  const { toast } = useToast();
  const [uploadMethod, setUploadMethod] = useState<'file' | 'url'>('file');
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      jobRole: "",
      counsellingStage: "",
      description: "",
      language: "English",
    },
  });

  // We can use the itemId for editing existing videos if needed
  React.useEffect(() => {
    if (itemId) {
      // In a real app, you would fetch the video data by itemId
      console.log(`Editing video with ID: ${itemId}`);
      setUploadMethod('url'); // Assume existing videos have URLs
      // For now, we'll just use dummy data
      form.reset({
        title: `Video ${itemId}`,
        jobRole: "customerServiceExecutive",
        counsellingStage: "stage2",
        description: `This is a description for video ${itemId}. It provides valuable information about the job role.`,
        videoUrl: `https://example.com/video${itemId}.mp4`,
        language: "English",
      });
    } else {
      form.reset({
        title: "",
        jobRole: "",
        counsellingStage: "",
        description: "",
        language: "English",
      });
    }
  }, [itemId, form]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    toast({
      title: itemId ? "Video Updated" : "Video Added",
      description: `"${values.title}" has been ${itemId ? 'updated' : 'added'} successfully`,
    });
    onOpenChange(false);
    form.reset();
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{itemId ? "Edit" : "Add"} Counselling Video</DialogTitle>
          <DialogDescription>
            {itemId ? "Update existing" : "Upload a new"} counselling video for candidates
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Video Title</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="E.g. Introduction to Customer Service" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="jobRole"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Job Role</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select job role" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="customerServiceExecutive">Customer Service Executive</SelectItem>
                        <SelectItem value="fieldSalesExecutive">Field Sales Executive</SelectItem>
                        <SelectItem value="generalDutyAssistant">General Duty Assistant</SelectItem>
                        <SelectItem value="bpoVoice">BPO Voice</SelectItem>
                        <SelectItem value="retailSalesAssociate">Retail Sales Associate</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="counsellingStage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Counselling Stage</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select stage" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="stage1">Stage 1: Introduction</SelectItem>
                        <SelectItem value="stage2">Stage 2: Job Role Overview</SelectItem>
                        <SelectItem value="stage3">Stage 3: Skill Requirements</SelectItem>
                        <SelectItem value="stage4">Stage 4: Career Opportunities</SelectItem>
                        <SelectItem value="stage5">Stage 5: Industry Expectations</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Video Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      {...field} 
                      placeholder="Enter a detailed description of this counselling video"
                      className="min-h-[100px]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="language"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Language</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select language" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="English">English</SelectItem>
                      <SelectItem value="Hindi">Hindi</SelectItem>
                      <SelectItem value="Tamil">Tamil</SelectItem>
                      <SelectItem value="Telugu">Telugu</SelectItem>
                      <SelectItem value="Marathi">Marathi</SelectItem>
                      <SelectItem value="Bengali">Bengali</SelectItem>
                      <SelectItem value="Gujarati">Gujarati</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="space-y-2">
              <div className="flex gap-2">
                <Button 
                  type="button" 
                  variant={uploadMethod === 'file' ? "default" : "outline"} 
                  onClick={() => setUploadMethod('file')}
                >
                  Upload File
                </Button>
                <Button 
                  type="button" 
                  variant={uploadMethod === 'url' ? "default" : "outline"} 
                  onClick={() => setUploadMethod('url')}
                >
                  Video URL
                </Button>
              </div>
              
              {uploadMethod === 'file' && (
                <FormField
                  control={form.control}
                  name="videoFile"
                  render={({ field: { value, onChange, ...fieldProps} }) => (
                    <FormItem>
                      <FormLabel>Upload Video File</FormLabel>
                      <FormControl>
                        <div className="flex items-center gap-2">
                          <Input
                            {...fieldProps}
                            type="file"
                            accept="video/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                onChange(file);
                              }
                            }}
                          />
                          <Button type="button" variant="outline" size="icon">
                            <Upload className="h-4 w-4" />
                          </Button>
                        </div>
                      </FormControl>
                      <FormDescription>
                        Max file size: 500MB. Supported formats: MP4, AVI, MOV
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              
              {uploadMethod === 'url' && (
                <FormField
                  control={form.control}
                  name="videoUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Video URL</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="https://example.com/video.mp4 or YouTube URL" />
                      </FormControl>
                      <FormDescription>
                        Enter a direct video link or YouTube video URL
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit">{itemId ? 'Update Video' : 'Upload Video'}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
