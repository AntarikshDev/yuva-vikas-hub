
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

const formSchema = z.object({
  metricName: z.string().min(1, "Metric name is required"),
  targetValue: z.string().min(1, "Target value is required"),
  thresholdType: z.enum(["above", "below", "equal"]),
  alertFrequency: z.enum(["daily", "weekly", "monthly"]),
  notifyUsers: z.array(z.string()).optional(),
});

interface KpiAlertFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function KpiAlertForm({ open, onOpenChange }: KpiAlertFormProps) {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      metricName: "",
      targetValue: "",
      thresholdType: "above",
      alertFrequency: "daily",
      notifyUsers: [],
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    toast({
      title: "KPI Alert Set",
      description: `Alert created for ${values.metricName}`,
    });
    onOpenChange(false);
    form.reset();
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Set KPI Target Alert</DialogTitle>
          <DialogDescription>
            Create a new alert when KPIs cross specified thresholds
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="metricName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>KPI Metric</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select metric" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="candidateRegistration">Candidate Registration Rate</SelectItem>
                      <SelectItem value="placementRate">Placement Rate</SelectItem>
                      <SelectItem value="retentionRate">Retention Rate</SelectItem>
                      <SelectItem value="dropoutRate">Dropout Rate</SelectItem>
                      <SelectItem value="mobilizerEfficiency">Mobilizer Efficiency</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="targetValue"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Target Value</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="E.g. 85%" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="thresholdType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Threshold Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select threshold type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="above">Above Target</SelectItem>
                      <SelectItem value="below">Below Target</SelectItem>
                      <SelectItem value="equal">Equal to Target</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="alertFrequency"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Alert Frequency</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select frequency" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit">Save Alert</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
