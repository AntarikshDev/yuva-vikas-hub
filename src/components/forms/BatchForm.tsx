
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
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { useToast } from "@/hooks/use-toast";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

const formSchema = z.object({
  name: z.string().min(2, "Batch name is required"),
  jobRole: z.string().min(1, "Job role is required"),
  center: z.string().min(1, "Center is required"),
  trainer: z.string().min(1, "Trainer is required"),
  startDate: z.date({
    required_error: "Start date is required",
  }),
  endDate: z.date({
    required_error: "End date is required",
  }),
  maxStrength: z.coerce.number().min(5, "Minimum 5 candidates required"),
});

interface BatchFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function BatchForm({ open, onOpenChange }: BatchFormProps) {
  const { toast } = useToast();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      jobRole: "",
      center: "",
      trainer: "",
      maxStrength: 30,
    },
  });

  // Dummy data
  const jobRoles = [
    { value: "cse", label: "Customer Service Executive" },
    { value: "fse", label: "Field Sales Executive" },
    { value: "gda", label: "General Duty Assistant" },
    { value: "bpo", label: "BPO Voice" },
    { value: "rsa", label: "Retail Sales Associate" },
  ];
  
  const centers = [
    { value: "delhi_center", label: "Delhi Center" },
    { value: "mumbai_center", label: "Mumbai Center" },
    { value: "bangalore_center", label: "Bangalore Center" },
    { value: "chennai_center", label: "Chennai Center" },
    { value: "kolkata_center", label: "Kolkata Center" },
  ];
  
  const trainers = [
    { value: "rajiv_sharma", label: "Rajiv Sharma" },
    { value: "priya_desai", label: "Priya Desai" },
    { value: "suresh_kumar", label: "Suresh Kumar" },
    { value: "lakshmi_n", label: "Lakshmi N" },
    { value: "aman_gupta", label: "Aman Gupta" },
  ];

  function onSubmit(values: z.infer<typeof formSchema>) {
    // Validate that end date is after start date
    if (values.endDate < values.startDate) {
      form.setError("endDate", { 
        type: "manual", 
        message: "End date must be after start date" 
      });
      return;
    }
    
    toast({
      title: "Batch Created",
      description: `${values.name} has been created successfully`,
    });
    onOpenChange(false);
    form.reset();
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Create New Batch</DialogTitle>
          <DialogDescription>
            Set up a new training batch with all required details
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Batch Name</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="E.g. CSE Batch 01" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
                        {jobRoles.map((role) => (
                          <SelectItem key={role.value} value={role.value}>
                            {role.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="center"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Training Center</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select center" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {centers.map((center) => (
                          <SelectItem key={center.value} value={center.value}>
                            {center.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="trainer"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Trainer</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select trainer" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {trainers.map((trainer) => (
                          <SelectItem key={trainer.value} value={trainer.value}>
                            {trainer.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Start Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date < new Date()}
                          initialFocus
                          className="pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>End Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date < (form.getValues("startDate") || new Date())}
                          initialFocus
                          className="pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="maxStrength"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Maximum Batch Strength</FormLabel>
                  <FormControl>
                    <Input {...field} type="number" min="5" placeholder="30" />
                  </FormControl>
                  <FormDescription>
                    Maximum number of candidates in this batch
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit">Create Batch</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
