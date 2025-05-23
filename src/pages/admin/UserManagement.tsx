
import React, { useState } from 'react';
import { MainLayout } from '@/layouts/MainLayout';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Filter, Plus, Edit, UserMinus, RotateCw, User, Users } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from "@/hooks/use-toast";
import * as z from "zod";
import { ScrollArea } from "@/components/ui/scroll-area";

const UserManagement = () => {
  // State for dialog forms
  const [userFormOpen, setUserFormOpen] = useState(false);
  const [roleMatrixOpen, setRoleMatrixOpen] = useState(false);
  const { toast } = useToast();

  // Dummy data for users
  const users = [
    { id: 1, name: 'John Doe', email: 'john@example.com', mobile: '9876543210', role: 'State Head', center: 'Delhi Center', status: 'active' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', mobile: '9876543211', role: 'Center Manager', center: 'Mumbai Center', status: 'active' },
    { id: 3, name: 'Alice Johnson', email: 'alice@example.com', mobile: '9876543212', role: 'Mobilizer', center: 'Pune Center', status: 'inactive' },
    { id: 4, name: 'Bob Wilson', email: 'bob@example.com', mobile: '9876543213', role: 'Trainer', center: 'Chennai Center', status: 'active' },
    { id: 5, name: 'Carol Williams', email: 'carol@example.com', mobile: '9876543214', role: 'PPC Team', center: 'Kolkata Center', status: 'active' },
  ];

  // User Form Schema
  const userFormSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    mobile: z.string().min(10, "Mobile number must be at least 10 digits"),
    role: z.string().min(1, "Role is required"),
    center: z.string().optional(),
    password: z.string().min(8, "Password must be at least 8 characters"),
  });

  const userForm = useForm<z.infer<typeof userFormSchema>>({
    resolver: zodResolver(userFormSchema),
    defaultValues: {
      name: "",
      email: "",
      mobile: "",
      role: "",
      center: "",
      password: "",
    },
  });

  // Role Matrix States
  const [selectedRole, setSelectedRole] = useState<string>('center_manager');
  const [permissionMatrix, setPermissionMatrix] = useState<Record<string, Record<string, boolean>>>({});

  // Define modules and permissions for the matrix
  const modules = [
    { id: 'dashboard', name: 'Dashboard' },
    { id: 'users', name: 'User & Role Management' },
    { id: 'master_data', name: 'Master Data Management' },
    { id: 'documents', name: 'Document Generator' },
    { id: 'batches', name: 'Batch Management' },
    { id: 'candidates', name: 'Candidate Directory' },
    { id: 'reports', name: 'Reports & Analytics' },
    { id: 'videos', name: 'Video Log Manager' },
    { id: 'ai_dropout', name: 'AI Dropout Engine' },
    { id: 'quality', name: 'Quality Tracker' },
    { id: 'sos', name: 'SOS & Escalation Tracker' },
    { id: 'export', name: 'Data Export Hub' },
    { id: 'settings', name: 'System Settings' },
  ];

  const permissions = [
    { id: 'view', name: 'View' },
    { id: 'create', name: 'Create' },
    { id: 'edit', name: 'Edit' },
    { id: 'delete', name: 'Delete' },
  ];

  // Initialize permission matrix
  React.useEffect(() => {
    const initialMatrix: Record<string, Record<string, boolean>> = {};
    modules.forEach(module => {
      initialMatrix[module.id] = {};
      permissions.forEach(permission => {
        initialMatrix[module.id][permission.id] = false;
      });
    });
    setPermissionMatrix(initialMatrix);
  }, []);

  // User form submission
  const onUserSubmit = (values: z.infer<typeof userFormSchema>) => {
    toast({
      title: "User Added",
      description: `${values.name} has been added as ${values.role}`,
    });
    setUserFormOpen(false);
    userForm.reset();
  };

  // Handle checkbox changes for role matrix
  const handlePermissionChange = (moduleId: string, permissionId: string, checked: boolean) => {
    setPermissionMatrix(prev => ({
      ...prev,
      [moduleId]: {
        ...prev[moduleId],
        [permissionId]: checked,
      }
    }));
  };

  // Handle select all for a module
  const handleSelectAllForModule = (moduleId: string, checked: boolean) => {
    setPermissionMatrix(prev => {
      const updatedModule = { ...prev[moduleId] };
      permissions.forEach(permission => {
        updatedModule[permission.id] = checked;
      });
      return {
        ...prev,
        [moduleId]: updatedModule
      };
    });
  };

  // Save role matrix changes
  const handleRoleMatrixSave = () => {
    toast({
      title: "Role Permissions Updated",
      description: `Permissions for ${selectedRole} have been updated`,
    });
    setRoleMatrixOpen(false);
  };

  return (
    <MainLayout role="super_admin">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">User & Role Management</h1>
            <p className="text-muted-foreground">
              Manage user accounts and role permissions across the platform.
            </p>
          </div>
          <Button className="gap-2" onClick={() => setUserFormOpen(true)}>
            <Plus className="h-4 w-4" />
            Add New User
          </Button>
        </div>

        <Tabs defaultValue="users" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="users" className="flex gap-2 items-center">
              <User className="h-4 w-4" />
              User Directory
            </TabsTrigger>
            <TabsTrigger value="roles" className="flex gap-2 items-center">
              <Users className="h-4 w-4" />
              Role Matrix
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="users" className="space-y-4 pt-4">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle>User Directory</CardTitle>
                  <div className="flex items-center gap-2">
                    <Input type="search" placeholder="Search users..." className="max-w-sm" />
                    <Button variant="outline" size="sm" className="h-8 gap-1">
                      <Filter className="h-3.5 w-3.5" />
                      Filter
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableCaption>List of all users in the system</TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Mobile</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Center</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{user.mobile}</TableCell>
                        <TableCell>{user.role}</TableCell>
                        <TableCell>{user.center}</TableCell>
                        <TableCell>
                          <Badge variant={user.status === 'active' ? "default" : "secondary"}>
                            {user.status === 'active' ? 'Active' : 'Inactive'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-1">
                            <Button variant="outline" size="icon" className="h-8 w-8">
                              <Edit className="h-3.5 w-3.5" />
                            </Button>
                            <Button variant="outline" size="icon" className="h-8 w-8">
                              <RotateCw className="h-3.5 w-3.5" />
                            </Button>
                            <Button variant="outline" size="icon" className="h-8 w-8">
                              <UserMinus className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="roles" className="pt-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Role Permission Matrix</CardTitle>
                  <Button onClick={() => setRoleMatrixOpen(true)}>Configure Role Permissions</Button>
                </div>
              </CardHeader>
              <CardContent>
                <p className="mb-4">Configure access permissions for each role in the system.</p>
                <div className="border rounded-md p-4">
                  <p className="text-center text-muted-foreground">Click the button above to configure role permissions.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* User Form Dialog */}
      <Dialog open={userFormOpen} onOpenChange={setUserFormOpen}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>Add New User</DialogTitle>
            <DialogDescription>
              Create a new user account with role-based permissions
            </DialogDescription>
          </DialogHeader>
          <Form {...userForm}>
            <form onSubmit={userForm.handleSubmit(onUserSubmit)} className="space-y-4">
              <FormField
                control={userForm.control}
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
                control={userForm.control}
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
                control={userForm.control}
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
                control={userForm.control}
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
              {userForm.watch("role") !== "super_admin" && 
               userForm.watch("role") !== "outreach_admin" && 
               userForm.watch("role") !== "accounts_team" && (
                <FormField
                  control={userForm.control}
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
                control={userForm.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Initial Password</FormLabel>
                    <FormControl>
                      <Input {...field} type="password" placeholder="Set initial password" />
                    </FormControl>
                    <FormDescription>
                      User will be prompted to change password on first login
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setUserFormOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Create User</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Role Matrix Dialog */}
      <Dialog open={roleMatrixOpen} onOpenChange={setRoleMatrixOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>Role Permission Matrix</DialogTitle>
            <DialogDescription>
              Configure access permissions for each role in the system
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <div className="mb-4">
              <FormLabel htmlFor="role-select">Select Role</FormLabel>
              <Select value={selectedRole} onValueChange={setSelectedRole}>
                <SelectTrigger id="role-select" className="w-full">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
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
            </div>
            
            <ScrollArea className="h-[400px] pr-4">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="text-left p-2 sticky top-0 bg-gray-100 z-10">Module</th>
                    {permissions.map(permission => (
                      <th key={permission.id} className="text-center p-2 sticky top-0 bg-gray-100 z-10">
                        {permission.name}
                      </th>
                    ))}
                    <th className="text-center p-2 sticky top-0 bg-gray-100 z-10">All</th>
                  </tr>
                </thead>
                <tbody>
                  {modules.map(module => (
                    <tr key={module.id} className="border-b">
                      <td className="p-2">{module.name}</td>
                      {permissions.map(permission => (
                        <td key={permission.id} className="text-center p-2">
                          <Checkbox
                            id={`${module.id}-${permission.id}`}
                            checked={permissionMatrix[module.id]?.[permission.id] || false}
                            onCheckedChange={(checked) => 
                              handlePermissionChange(module.id, permission.id, checked === true)
                            }
                          />
                        </td>
                      ))}
                      <td className="text-center p-2">
                        <Checkbox
                          id={`${module.id}-all`}
                          onCheckedChange={(checked) => 
                            handleSelectAllForModule(module.id, checked === true)
                          }
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </ScrollArea>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setRoleMatrixOpen(false)}>
              Cancel
            </Button>
            <Button type="button" onClick={handleRoleMatrixSave}>
              Save Permissions
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
};

export default UserManagement;
