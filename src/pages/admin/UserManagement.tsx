
import React from 'react';
import { MainLayout } from '@/layouts/MainLayout';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Filter, Plus, Edit, UserMinus, RotateCw, User, Users } from 'lucide-react';

const UserManagement = () => {
  // Dummy data for users
  const users = [
    { id: 1, name: 'John Doe', email: 'john@example.com', mobile: '9876543210', role: 'State Head', center: 'Delhi Center', status: 'active' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', mobile: '9876543211', role: 'Center Manager', center: 'Mumbai Center', status: 'active' },
    { id: 3, name: 'Alice Johnson', email: 'alice@example.com', mobile: '9876543212', role: 'Mobilizer', center: 'Pune Center', status: 'inactive' },
    { id: 4, name: 'Bob Wilson', email: 'bob@example.com', mobile: '9876543213', role: 'Trainer', center: 'Chennai Center', status: 'active' },
    { id: 5, name: 'Carol Williams', email: 'carol@example.com', mobile: '9876543214', role: 'PPC Team', center: 'Kolkata Center', status: 'active' },
  ];

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
          <Button className="gap-2">
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
                <CardTitle>Role Permission Matrix</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4">Configure access permissions for each role in the system.</p>
                <div className="border rounded-md p-4">
                  <p className="text-center text-muted-foreground">Role matrix management interface will be implemented here.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default UserManagement;
