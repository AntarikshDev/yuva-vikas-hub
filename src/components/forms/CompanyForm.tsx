
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

const formSchema = z.object({
  name: z.string().min(2, "Company name is required"),
  sector: z.string().min(1, "Sector is required"),
  location: z.string().min(1, "Location is required"),
  contactPerson: z.string().min(2, "Contact person is required"),
  contactEmail: z.string().email("Invalid email address"),
  contactPhone: z.string().min(10, "Invalid phone number"),
  address: z.string().min(5, "Address is required"),
  status: z.boolean().default(true)
});

interface CompanyFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  itemId?: number;  // Added this prop
}

export function CompanyForm({ open, onOpenChange, itemId }: CompanyFormProps) {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      sector: "",
      location: "",
      contactPerson: "",
      contactEmail: "",
      contactPhone: "",
      address: "",
      status: true
    },
  });

  // We can use the itemId for editing existing companies if needed
  React.useEffect(() => {
    if (itemId) {
      // In a real app, you would fetch the company data by itemId
      console.log(`Editing company with ID: ${itemId}`);
      // For now, we'll just use dummy data
      form.reset({
        name: `Company ${itemId}`,
        sector: "IT-ITES",
        location: "Delhi NCR",
        contactPerson: "John Doe",
        contactEmail: `contact${itemId}@example.com`,
        contactPhone: "9876543210",
        address: "123 Main Street, Delhi",
        status: true
      });
    } else {
      form.reset({
        name: "",
        sector: "",
        location: "",
        contactPerson: "",
        contactEmail: "",
        contactPhone: "",
        address: "",
        status: true
      });
    }
  }, [itemId, form]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    toast({
      title: itemId ? "Company Updated" : "Company Added",
      description: `${values.name} has been ${itemId ? 'updated' : 'added'} successfully`,
    });
    onOpenChange(false);
    form.reset();
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>{itemId ? "Edit" : "Add New"} Company</DialogTitle>
          <DialogDescription>
            {itemId ? "Update existing company" : "Add a new company"} for placement opportunities
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="E.g. TechServices Ltd." />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-2 gap-4">
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
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="E.g. Pan India, Delhi NCR" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Office Address</FormLabel>
                  <FormControl>
                    <Textarea {...field} placeholder="Enter office address" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-1 gap-4">
              <p className="text-sm font-medium">Primary Contact</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="contactPerson"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contact Person</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="E.g. John Doe" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="contactPhone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contact Phone</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="E.g. 9876543210" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="contactEmail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contact Email</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="E.g. john@example.com" type="email" />
                  </FormControl>
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
                    <FormDescription>
                      Set company as active for placement opportunities
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
