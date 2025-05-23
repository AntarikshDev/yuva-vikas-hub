
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

const formSchema = z.object({
  code: z.string().min(1, "Code is required"),
  name: z.string().min(2, "Travel mode name is required"),
  baseRate: z.coerce.number().min(0, "Base rate cannot be negative"),
  perKmRate: z.coerce.number().min(0, "Per KM rate cannot be negative"),
  maxDistance: z.coerce.number().optional(),
  isPublic: z.boolean().default(true),
  status: z.boolean().default(true)
});

interface TravelModeFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  itemId?: number;  // Added this prop
}

export function TravelModeForm({ open, onOpenChange, itemId }: TravelModeFormProps) {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      code: "",
      name: "",
      baseRate: 0,
      perKmRate: 0,
      maxDistance: undefined,
      isPublic: true,
      status: true
    },
  });

  // We can use the itemId for editing existing travel modes if needed
  React.useEffect(() => {
    if (itemId) {
      // In a real app, you would fetch the travel mode data by itemId
      console.log(`Editing travel mode with ID: ${itemId}`);
      // For now, we'll just use dummy data
      form.reset({
        code: `TM${itemId}`,
        name: `Travel Mode ${itemId}`,
        baseRate: 50 + itemId,
        perKmRate: 5 + (itemId * 0.5),
        maxDistance: itemId * 100,
        isPublic: true,
        status: true
      });
    } else {
      form.reset({
        code: "",
        name: "",
        baseRate: 0,
        perKmRate: 0,
        maxDistance: undefined,
        isPublic: true,
        status: true
      });
    }
  }, [itemId, form]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    toast({
      title: itemId ? "Travel Mode Updated" : "Travel Mode Added",
      description: `${values.name} has been ${itemId ? 'updated' : 'added'} successfully`,
    });
    onOpenChange(false);
    form.reset();
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>{itemId ? "Edit" : "Add New"} Travel Mode</DialogTitle>
          <DialogDescription>
            {itemId ? "Update existing" : "Create a new"} travel mode for travel scheduling and expense calculation
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
                    <FormLabel>Code</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="E.g. BUS" />
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
                    <FormLabel>Travel Mode Name</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="E.g. Bus" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="baseRate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Base Rate (₹)</FormLabel>
                    <FormControl>
                      <Input {...field} type="number" min="0" step="0.01" />
                    </FormControl>
                    <FormDescription>
                      Base cost for this mode of travel
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="perKmRate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Per KM Rate (₹)</FormLabel>
                    <FormControl>
                      <Input {...field} type="number" min="0" step="0.01" />
                    </FormControl>
                    <FormDescription>
                      Cost per kilometer traveled
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="maxDistance"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Maximum Distance (KM)</FormLabel>
                  <FormControl>
                    <Input 
                      {...field} 
                      type="number" 
                      min="0" 
                      value={field.value === undefined ? "" : field.value}
                      onChange={e => {
                        const value = e.target.value === "" ? undefined : Number(e.target.value);
                        field.onChange(value);
                      }}
                    />
                  </FormControl>
                  <FormDescription>
                    Optional: Maximum recommended distance for this travel mode
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="isPublic"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel>Public Transport</FormLabel>
                    <FormDescription>
                      Is this a public transportation mode?
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
                    <FormDescription>
                      Make this travel mode available for selection
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
