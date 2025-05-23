
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
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Switch } from "@/components/ui/switch";

const formSchema = z.object({
  code: z.string().min(1, "Job role code is required"),
  title: z.string().min(2, "Job role title is required"),
  sector: z.string().min(1, "Sector is required"),
  level: z.string().min(1, "NSQF level is required"),
  status: z.boolean().default(true)
});

interface JobRoleFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  itemId?: number;  // Added this prop
}

export function JobRoleForm({ open, onOpenChange, itemId }: JobRoleFormProps) {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      code: "",
      title: "",
      sector: "",
      level: "",
      status: true
    },
  });

  // We can use the itemId for editing existing job roles if needed
  React.useEffect(() => {
    if (itemId) {
      // In a real app, you would fetch the job role data by itemId
      console.log(`Editing job role with ID: ${itemId}`);
      // For now, we'll just use dummy data
      form.reset({
        code: `JR${itemId}`,
        title: `Job Role ${itemId}`,
        sector: "IT-ITES",
        level: "NSQF 3",
        status: true
      });
    } else {
      form.reset({
        code: "",
        title: "",
        sector: "",
        level: "",
        status: true
      });
    }
  }, [itemId, form]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    toast({
      title: itemId ? "Job Role Updated" : "Job Role Added",
      description: `${values.title} has been ${itemId ? 'updated' : 'added'} successfully`,
    });
    onOpenChange(false);
    form.reset();
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>{itemId ? "Edit" : "Add New"} Job Role</DialogTitle>
          <DialogDescription>
            {itemId ? "Update existing" : "Create a new"} job role for training programs
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Job Role Code</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="E.g. JR001" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Job Role Title</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="E.g. Customer Service Executive" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="sector"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sector</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select sector" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="IT-ITES">IT-ITES</SelectItem>
                      <SelectItem value="Retail">Retail</SelectItem>
                      <SelectItem value="Healthcare">Healthcare</SelectItem>
                      <SelectItem value="Hospitality">Hospitality</SelectItem>
                      <SelectItem value="Banking">Banking</SelectItem>
                      <SelectItem value="Logistics">Logistics</SelectItem>
                      <SelectItem value="Manufacturing">Manufacturing</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="level"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>NSQF Level</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select level" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="NSQF 1">NSQF 1</SelectItem>
                      <SelectItem value="NSQF 2">NSQF 2</SelectItem>
                      <SelectItem value="NSQF 3">NSQF 3</SelectItem>
                      <SelectItem value="NSQF 4">NSQF 4</SelectItem>
                      <SelectItem value="NSQF 5">NSQF 5</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
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
              <Button type="submit">{itemId ? 'Update' : 'Save'}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
