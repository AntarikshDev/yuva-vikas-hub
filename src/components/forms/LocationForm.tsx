
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
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Schema for adding a new state
const stateSchema = z.object({
  code: z.string().min(1, "State code is required"),
  name: z.string().min(2, "State name is required"),
  isActive: z.boolean().default(true)
});

// Schema for adding a new district
const districtSchema = z.object({
  state: z.string().min(1, "State is required"),
  name: z.string().min(2, "District name is required"),
  isActive: z.boolean().default(true)
});

interface LocationFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  itemId?: number;  // Added this prop
}

export function LocationForm({ open, onOpenChange, itemId }: LocationFormProps) {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<"state" | "district">("state");
  
  const stateForm = useForm<z.infer<typeof stateSchema>>({
    resolver: zodResolver(stateSchema),
    defaultValues: {
      code: "",
      name: "",
      isActive: true
    },
  });
  
  const districtForm = useForm<z.infer<typeof districtSchema>>({
    resolver: zodResolver(districtSchema),
    defaultValues: {
      state: "",
      name: "",
      isActive: true
    },
  });

  // List of states in India (for the district form)
  const states = [
    { value: "AN", label: "Andaman and Nicobar Islands" },
    { value: "AP", label: "Andhra Pradesh" },
    { value: "AR", label: "Arunachal Pradesh" },
    { value: "AS", label: "Assam" },
    { value: "BR", label: "Bihar" },
    { value: "CH", label: "Chandigarh" },
    { value: "CG", label: "Chhattisgarh" },
    { value: "DN", label: "Dadra and Nagar Haveli" },
    { value: "DD", label: "Daman and Diu" },
    { value: "DL", label: "Delhi" },
    { value: "GA", label: "Goa" },
    { value: "GJ", label: "Gujarat" },
    { value: "HR", label: "Haryana" },
    { value: "HP", label: "Himachal Pradesh" },
    { value: "JK", label: "Jammu and Kashmir" },
    { value: "JH", label: "Jharkhand" },
    { value: "KA", label: "Karnataka" },
    { value: "KL", label: "Kerala" },
    { value: "LA", label: "Ladakh" },
    { value: "LD", label: "Lakshadweep" },
    { value: "MP", label: "Madhya Pradesh" },
    { value: "MH", label: "Maharashtra" },
    { value: "MN", label: "Manipur" },
    { value: "ML", label: "Meghalaya" },
    { value: "MZ", label: "Mizoram" },
    { value: "NL", label: "Nagaland" },
    { value: "OR", label: "Odisha" },
    { value: "PY", label: "Puducherry" },
    { value: "PB", label: "Punjab" },
    { value: "RJ", label: "Rajasthan" },
    { value: "SK", label: "Sikkim" },
    { value: "TN", label: "Tamil Nadu" },
    { value: "TS", label: "Telangana" },
    { value: "TR", label: "Tripura" },
    { value: "UP", label: "Uttar Pradesh" },
    { value: "UK", label: "Uttarakhand" },
    { value: "WB", label: "West Bengal" },
  ];

  // We can use the itemId for editing existing locations if needed
  React.useEffect(() => {
    if (itemId) {
      // In a real app, you would fetch the location data by itemId
      console.log(`Editing location with ID: ${itemId}`);
      
      if (itemId % 2 === 0) {
        // Edit state
        setActiveTab("state");
        stateForm.reset({
          code: `ST${itemId}`,
          name: `State ${itemId}`,
          isActive: true
        });
      } else {
        // Edit district
        setActiveTab("district");
        districtForm.reset({
          state: "DL",
          name: `District ${itemId}`,
          isActive: true
        });
      }
    } else {
      stateForm.reset({
        code: "",
        name: "",
        isActive: true
      });
      
      districtForm.reset({
        state: "",
        name: "",
        isActive: true
      });
    }
  }, [itemId, stateForm, districtForm]);

  function onSubmitState(values: z.infer<typeof stateSchema>) {
    toast({
      title: itemId ? "State Updated" : "State Added",
      description: `${values.name} has been ${itemId ? 'updated' : 'added'} successfully`,
    });
    stateForm.reset();
    onOpenChange(false);
  }
  
  function onSubmitDistrict(values: z.infer<typeof districtSchema>) {
    const stateName = states.find(s => s.value === values.state)?.label || values.state;
    toast({
      title: itemId ? "District Updated" : "District Added",
      description: `${values.name} (${stateName}) has been ${itemId ? 'updated' : 'added'} successfully`,
    });
    districtForm.reset();
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>{itemId ? "Edit" : "Add"} Location</DialogTitle>
          <DialogDescription>
            {itemId ? "Update existing" : "Add new"} states or districts to the system
          </DialogDescription>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "state" | "district")} className="w-full">
          <TabsList className="grid grid-cols-2 w-full">
            <TabsTrigger value="state">
              {itemId && activeTab === "state" ? "Edit State" : "Add State"}
            </TabsTrigger>
            <TabsTrigger value="district">
              {itemId && activeTab === "district" ? "Edit District" : "Add District"}
            </TabsTrigger>
          </TabsList>
          
          {/* State Form */}
          <TabsContent value="state" className="space-y-4 pt-4">
            <Form {...stateForm}>
              <form onSubmit={stateForm.handleSubmit(onSubmitState)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={stateForm.control}
                    name="code"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>State Code</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="E.g. MH" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={stateForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>State Name</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="E.g. Maharashtra" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={stateForm.control}
                  name="isActive"
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
                  <Button type="submit">{itemId && activeTab === "state" ? 'Update State' : 'Save State'}</Button>
                </DialogFooter>
              </form>
            </Form>
          </TabsContent>
          
          {/* District Form */}
          <TabsContent value="district" className="space-y-4 pt-4">
            <Form {...districtForm}>
              <form onSubmit={districtForm.handleSubmit(onSubmitDistrict)} className="space-y-4">
                <FormField
                  control={districtForm.control}
                  name="state"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>State</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select state" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {states.map(state => (
                            <SelectItem key={state.value} value={state.value}>{state.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={districtForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>District Name</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="E.g. Mumbai" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={districtForm.control}
                  name="isActive"
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
                  <Button type="submit">{itemId && activeTab === "district" ? 'Update District' : 'Save District'}</Button>
                </DialogFooter>
              </form>
            </Form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
