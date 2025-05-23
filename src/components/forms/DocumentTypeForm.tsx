
import React from 'react';
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
import { useToast } from "@/hooks/use-toast";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const formSchema = z.object({
  code: z.string().min(1, "Document code is required"),
  name: z.string().min(2, "Document name is required"),
  category: z.string().min(1, "Document category is required"),
  required: z.boolean().default(false),
  maxSize: z.coerce.number().min(1, "Size limit must be at least 1MB"),
  allowedFormats: z.array(z.string()).min(1, "At least one format must be allowed"),
  status: z.boolean().default(true)
});

interface DocumentTypeFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DocumentTypeForm({ open, onOpenChange }: DocumentTypeFormProps) {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      code: "",
      name: "",
      category: "",
      required: false,
      maxSize: 5,
      allowedFormats: ["pdf"],
      status: true
    },
  });

  const categories = [
    { value: "identity", label: "Identity Proof" },
    { value: "address", label: "Address Proof" },
    { value: "education", label: "Educational Qualification" },
    { value: "experience", label: "Work Experience" },
    { value: "banking", label: "Banking Information" },
    { value: "certificate", label: "Certification" },
    { value: "other", label: "Other" },
  ];
  
  const docFormats = [
    { value: "pdf", label: "PDF" },
    { value: "jpg", label: "JPG/JPEG" },
    { value: "png", label: "PNG" },
    { value: "doc", label: "DOC/DOCX" },
  ];

  function onSubmit(values: z.infer<typeof formSchema>) {
    toast({
      title: "Document Type Added",
      description: `${values.name} has been added successfully`,
    });
    onOpenChange(false);
    form.reset();
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Add Document Type</DialogTitle>
          <DialogDescription>
            Create a new document type for candidate submissions
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Document Code</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="E.g. AADHAR" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Document Name</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="E.g. Aadhar Card" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map(cat => (
                        <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="maxSize"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Maximum File Size (MB)</FormLabel>
                  <FormControl>
                    <Input {...field} type="number" min="1" />
                  </FormControl>
                  <FormDescription>
                    Maximum allowed size in megabytes
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="allowedFormats"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Allowed Formats</FormLabel>
                  <div className="grid grid-cols-2 gap-2">
                    {docFormats.map(format => (
                      <div key={format.value} className="flex items-center space-x-2">
                        <input 
                          type="checkbox" 
                          id={`format-${format.value}`}
                          checked={field.value.includes(format.value)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              field.onChange([...field.value, format.value]);
                            } else {
                              field.onChange(field.value.filter(val => val !== format.value));
                            }
                          }}
                          className="w-4 h-4 rounded border-gray-300"
                        />
                        <label htmlFor={`format-${format.value}`} className="text-sm">
                          {format.label}
                        </label>
                      </div>
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="required"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel>Required Document</FormLabel>
                    <FormDescription>
                      Is this a mandatory document for candidates?
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel>Active</FormLabel>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit">Save</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
