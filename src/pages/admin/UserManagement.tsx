
import React, { useState } from 'react';
import { MainLayout } from '@/layouts/MainLayout';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Filter, Plus, Edit, UserMinus, RotateCw, User, Users, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { UserForm } from '@/components/forms/UserForm';
import { RoleMatrixForm } from '@/components/forms/RoleMatrixForm';
import { UserFilterDialog, UserFilters } from '@/components/dialogs/UserFilterDialog';
import { UserActionDialog } from '@/components/dialogs/UserActionDialog';
import { useToast } from '@/hooks/use-toast';

const UserManagement = () => {
  // State for dialog forms
  const [userFormOpen, setUserFormOpen] = useState(false);
  const [roleMatrixOpen, setRoleMatrixOpen] = useState(false);
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);
  const [userActionDialog, setUserActionDialog] = useState<{
    open: boolean;
    type: 'deactivate' | 'reactivate' | 'delete';
    userName: string;
    userId: number;
  }>({
    open: false,
    type: 'deactivate',
    userName: '',
    userId: 0,
  });
  const [editUserId, setEditUserId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [appliedFilters, setAppliedFilters] = useState<UserFilters>({
    role: '',
    center: '',
    status: '',
  });

  const { toast } = useToast();

  // Dummy data for users
  const [users, setUsers] = useState([
    { id: 1, name: 'John Doe', email: 'john@example.com', mobile: '9876543210', role: 'State Head', center: 'Delhi Center', status: 'active' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', mobile: '9876543211', role: 'Center Manager', center: 'Mumbai Center', status: 'active' },
    { id: 3, name: 'Alice Johnson', email: 'alice@example.com', mobile: '9876543212', role: 'Mobilizer', center: 'Pune Center', status: 'inactive' },
    { id: 4, name: 'Bob Wilson', email: 'bob@example.com', mobile: '9876543213', role: 'Trainer', center: 'Chennai Center', status: 'active' },
    { id: 5, name: 'Carol Williams', email: 'carol@example.com', mobile: '9876543214', role: 'PPC Team', center: 'Kolkata Center', status: 'active' },
  ]);

  // Filter users based on search query and applied filters
  const filteredUsers = users.filter(user => {
    // Search filtering
    if (searchQuery && !user.name.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !user.email.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !user.mobile.includes(searchQuery)) {
      return false;
    }

    // Role filtering
    if (appliedFilters.role && appliedFilters.role !== 'all' && 
        user.role.toLowerCase() !== appliedFilters.role.toLowerCase()) {
      return false;
    }

    // Center filtering
    if (appliedFilters.center && appliedFilters.center !== 'all' && 
        !user.center.toLowerCase().includes(appliedFilters.center.toLowerCase())) {
      return false;
    }

    // Status filtering
    if (appliedFilters.status && appliedFilters.status !== 'all' && 
        user.status !== appliedFilters.status) {
      return false;
    }

    return true;
  });

  const handleEditUser = (userId: number) => {
    setEditUserId(userId);
    setUserFormOpen(true);
    toast({
      title: "Edit user",
      description: `Opening edit form for user #${userId}`,
    });
  };

  const handleUserAction = (type: 'deactivate' | 'reactivate' | 'delete', user: { id: number; name: string }) => {
    setUserActionDialog({
      open: true,
      type,
      userName: user.name,
      userId: user.id,
    });
  };

  const handleActionConfirm = () => {
    const { type, userId } = userActionDialog;
    
    if (type === 'delete') {
      setUsers(users.filter(user => user.id !== userId));
    } else {
      setUsers(users.map(user => {
        if (user.id === userId) {
          return {
            ...user,
            status: type === 'deactivate' ? 'inactive' : 'active'
          };
        }
        return user;
      }));
    }
  };

  const handleApplyFilters = (filters: UserFilters) => {
    setAppliedFilters(filters);
  };

  return (
    <MainLayout role="admin">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">User & Role Management</h1>
            <p className="text-muted-foreground">
              Manage user accounts and role permissions across the platform.
            </p>
          </div>
          <Button className="gap-2" onClick={() => {setEditUserId(null); setUserFormOpen(true)}}>
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
                    <div className="relative">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                      <Input 
                        type="search" 
                        placeholder="Search users..." 
                        className="pl-8 max-w-sm" 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="h-8 gap-1"
                      onClick={() => setFilterDialogOpen(true)}
                    >
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
                    {filteredUsers.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-10 text-muted-foreground">
                          No users match your search criteria
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredUsers.map((user) => (
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
                              <Button 
                                variant="outline" 
                                size="icon" 
                                className="h-8 w-8"
                                onClick={() => handleEditUser(user.id)}
                              >
                                <Edit className="h-3.5 w-3.5" />
                              </Button>
                              <Button 
                                variant="outline" 
                                size="icon" 
                                className="h-8 w-8"
                                onClick={() => handleUserAction(
                                  user.status === 'active' ? 'deactivate' : 'reactivate',
                                  user
                                )}
                              >
                                <RotateCw className="h-3.5 w-3.5" />
                              </Button>
                              <Button 
                                variant="outline" 
                                size="icon" 
                                className="h-8 w-8"
                                onClick={() => handleUserAction('delete', user)}
                              >
                                <UserMinus className="h-3.5 w-3.5" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
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
      <UserForm open={userFormOpen} onOpenChange={setUserFormOpen} userId={editUserId} />

      {/* Role Matrix Dialog */}
      <RoleMatrixForm open={roleMatrixOpen} onOpenChange={setRoleMatrixOpen} />

      {/* Filter Dialog */}
      <UserFilterDialog 
        open={filterDialogOpen} 
        onOpenChange={setFilterDialogOpen} 
        onApplyFilter={handleApplyFilters}
      />

      {/* User Action Dialog */}
      <UserActionDialog
        type={userActionDialog.type}
        open={userActionDialog.open}
        onOpenChange={(open) => setUserActionDialog({ ...userActionDialog, open })}
        userName={userActionDialog.userName}
        onConfirm={handleActionConfirm}
      />
    </MainLayout>
  );
};

export default UserManagement;
