
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
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  mobile: z.string().min(10, "Mobile number must be at least 10 digits"),
  role: z.string().min(1, "Role is required"),
  center: z.string().optional(),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

interface UserFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId?: number;  // Added this prop
}

export function UserForm({ open, onOpenChange, userId }: UserFormProps) {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      mobile: "",
      role: "",
      center: "",
      password: "",
    },
  });

  // We can use the userId for editing existing users if needed
  React.useEffect(() => {
    if (userId) {
      // In a real app, you would fetch the user data by userId
      console.log(`Editing user with ID: ${userId}`);
      // For now, we'll just use dummy data
      form.reset({
        name: `User ${userId}`,
        email: `user${userId}@example.com`,
        mobile: "9876543210",
        role: "center_manager",
        center: "delhi_center",
        password: "password123",
      });
    } else {
      form.reset({
        name: "",
        email: "",
        mobile: "",
        role: "",
        center: "",
        password: "",
      });
    }
  }, [userId, form]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    toast({
      title: userId ? "User Updated" : "User Added",
      description: `${values.name} has been ${userId ? 'updated' : 'added'} as ${values.role}`,
    });
    onOpenChange(false);
    form.reset();
  }

  // Determine if center field should be shown based on selected role
  const showCenterField = form.watch("role") !== "super_admin" && 
                          form.watch("role") !== "outreach_admin" && 
                          form.watch("role") !== "accounts_team";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>{userId ? "Edit" : "Add New"} User</DialogTitle>
          <DialogDescription>
            {userId ? "Update existing" : "Create a new"} user account with role-based permissions
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter full name" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input {...field} type="email" placeholder="Enter email address" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="mobile"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mobile Number</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter mobile number" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="role"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="super_admin">Super Admin</SelectItem>
                      <SelectItem value="state_head">State Head</SelectItem>
                      <SelectItem value="center_manager">Center Manager</SelectItem>
                      <SelectItem value="mobilizer">Mobilizer</SelectItem>
                      <SelectItem value="ppc_team">PPC Team</SelectItem>
                      <SelectItem value="trainer">Trainer</SelectItem>
                      <SelectItem value="outreach_admin">Outreach Admin</SelectItem>
                      <SelectItem value="accounts_team">Accounts Team</SelectItem>
                      <SelectItem value="audit">Audit</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            {showCenterField && (
              <FormField
                control={form.control}
                name="center"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Assigned Center</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select center" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="delhi_center">Delhi Center</SelectItem>
                        <SelectItem value="mumbai_center">Mumbai Center</SelectItem>
                        <SelectItem value="bangalore_center">Bangalore Center</SelectItem>
                        <SelectItem value="chennai_center">Chennai Center</SelectItem>
                        <SelectItem value="kolkata_center">Kolkata Center</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{userId ? "Reset" : "Initial"} Password</FormLabel>
                  <FormControl>
                    <Input {...field} type="password" placeholder={userId ? "Reset password" : "Set initial password"} />
                  </FormControl>
                  <FormDescription>
                    User will be prompted to change password on first login
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit">{userId ? 'Update User' : 'Create User'}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
