import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, UserPlus, Edit, RotateCcw, ShieldCheck, Search } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

const UserManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);

  // Mock data
  const users = [
    {
      id: 1,
      name: 'Anil Kumar',
      email: 'anil.kumar@example.com',
      phone: '+91-9876543210',
      role: 'Center Manager',
      status: 'Active',
      lastLogin: '2025-07-17 14:30',
      centres: ['Delhi-001', 'Delhi-002']
    },
    {
      id: 2,
      name: 'Priya Sharma',
      email: 'priya.sharma@example.com',
      phone: '+91-9876543211',
      role: 'Counsellor',
      status: 'Active',
      lastLogin: '2025-07-17 16:45',
      centres: ['Mumbai-001']
    },
    {
      id: 3,
      name: 'Rajesh Singh',
      email: 'rajesh.singh@example.com',
      phone: '+91-9876543212',
      role: 'State Head',
      status: 'Inactive',
      lastLogin: '2025-07-15 10:20',
      centres: ['UP-001', 'UP-002', 'UP-003']
    }
  ];

  const roles = [
    {
      id: 1,
      name: 'Super Admin',
      permissions: ['user_management', 'system_settings', 'reports', 'audit_logs'],
      userCount: 3
    },
    {
      id: 2,
      name: 'State Head',
      permissions: ['state_overview', 'center_performance', 'reports'],
      userCount: 12
    },
    {
      id: 3,
      name: 'Center Manager',
      permissions: ['enrollment', 'documents', 'placement'],
      userCount: 45
    },
    {
      id: 4,
      name: 'Counsellor',
      permissions: ['candidate_management', 'counselling', 'mandatory_sheets'],
      userCount: 89
    }
  ];

  const allPermissions = [
    { id: 'user_management', name: 'User Management', category: 'Admin' },
    { id: 'system_settings', name: 'System Settings', category: 'Admin' },
    { id: 'reports', name: 'Reports & Analytics', category: 'Reporting' },
    { id: 'audit_logs', name: 'Audit Logs', category: 'Admin' },
    { id: 'state_overview', name: 'State Overview', category: 'Operations' },
    { id: 'center_performance', name: 'Center Performance', category: 'Operations' },
    { id: 'enrollment', name: 'Enrollment Management', category: 'Operations' },
    { id: 'documents', name: 'Document Management', category: 'Operations' },
    { id: 'placement', name: 'Placement Management', category: 'Operations' },
    { id: 'candidate_management', name: 'Candidate Management', category: 'Operations' },
    { id: 'counselling', name: 'Counselling', category: 'Operations' },
    { id: 'mandatory_sheets', name: 'Mandatory Sheets', category: 'Documentation' }
  ];

  const centres = [
    { id: 'delhi-001', name: 'Delhi-001' },
    { id: 'delhi-002', name: 'Delhi-002' },
    { id: 'mumbai-001', name: 'Mumbai-001' },
    { id: 'up-001', name: 'UP-001' },
    { id: 'up-002', name: 'UP-002' },
    { id: 'up-003', name: 'UP-003' }
  ];

  const filteredUsers = users.filter(user => {
    return (
      (searchTerm === '' || 
       user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
       user.email.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (filterRole === 'all' || user.role === filterRole) &&
      (filterStatus === 'all' || user.status === filterStatus)
    );
  });

  const handleEditUser = (user: any) => {
    setSelectedUser(user);
    setIsEditModalOpen(true);
  };

  const getStatusBadge = (status: string) => {
    return status === 'Active' ? 
      <Badge variant="default" className="bg-green-100 text-green-800">Active</Badge> :
      <Badge variant="secondary">Inactive</Badge>;
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="border-b pb-4">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Users className="h-8 w-8" />
          User & Role Management
        </h1>
      </div>

      <Tabs defaultValue="users" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="users">User Management</TabsTrigger>
          <TabsTrigger value="roles">Role Management</TabsTrigger>
        </TabsList>

        {/* User Management Tab */}
        <TabsContent value="users" className="space-y-6">
          {/* Filters and Search */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>User List</span>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="flex items-center gap-2">
                      <UserPlus className="h-4 w-4" />
                      Add New User
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>Add New User</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label>Name</Label>
                        <Input placeholder="Enter full name" />
                      </div>
                      <div>
                        <Label>Email</Label>
                        <Input type="email" placeholder="Enter email" />
                      </div>
                      <div>
                        <Label>Phone</Label>
                        <Input placeholder="Enter phone number" />
                      </div>
                      <div>
                        <Label>Role</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select role" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="super_admin">Super Admin</SelectItem>
                            <SelectItem value="state_head">State Head</SelectItem>
                            <SelectItem value="center_manager">Center Manager</SelectItem>
                            <SelectItem value="counsellor">Counsellor</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex gap-2">
                        <Button>Create User</Button>
                        <Button variant="outline">Cancel</Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap items-center gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <Search className="h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-64"
                  />
                </div>

                <Select value={filterRole} onValueChange={setFilterRole}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Filter by role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Roles</SelectItem>
                    <SelectItem value="Super Admin">Super Admin</SelectItem>
                    <SelectItem value="State Head">State Head</SelectItem>
                    <SelectItem value="Center Manager">Center Manager</SelectItem>
                    <SelectItem value="Counsellor">Counsellor</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="Inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Users Table */}
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Login</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{user.name}</p>
                          <p className="text-sm text-muted-foreground">{user.email}</p>
                        </div>
                      </TableCell>
                      <TableCell>{user.role}</TableCell>
                      <TableCell>{getStatusBadge(user.status)}</TableCell>
                      <TableCell className="text-sm">{user.lastLogin}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditUser(user)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="outline" size="sm">
                                <RotateCcw className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Reset Password</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to reset the password for {user.name}? 
                                  A new temporary password will be sent to their email.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction>Reset Password</AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Role Management Tab */}
        <TabsContent value="roles" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5" />
                  Role Management
                </span>
                <Dialog open={isRoleModalOpen} onOpenChange={setIsRoleModalOpen}>
                  <DialogTrigger asChild>
                    <Button>Add New Role</Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Add New Role</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label>Role Name</Label>
                        <Input placeholder="Enter role name" />
                      </div>
                      <div>
                        <Label>Permissions</Label>
                        <div className="space-y-4 max-h-64 overflow-y-auto">
                          {Object.entries(
                            allPermissions.reduce((acc, perm) => {
                              if (!acc[perm.category]) acc[perm.category] = [];
                              acc[perm.category].push(perm);
                              return acc;
                            }, {} as Record<string, typeof allPermissions>)
                          ).map(([category, perms]) => (
                            <div key={category} className="space-y-2">
                              <h4 className="font-medium text-sm text-muted-foreground">{category}</h4>
                              {perms.map((perm) => (
                                <div key={perm.id} className="flex items-center space-x-2">
                                  <Checkbox id={perm.id} />
                                  <Label htmlFor={perm.id} className="text-sm">{perm.name}</Label>
                                </div>
                              ))}
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button onClick={() => setIsRoleModalOpen(false)}>Create Role</Button>
                        <Button variant="outline" onClick={() => setIsRoleModalOpen(false)}>Cancel</Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Role Name</TableHead>
                    <TableHead>Permissions</TableHead>
                    <TableHead>Users</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {roles.map((role) => (
                    <TableRow key={role.id}>
                      <TableCell className="font-medium">{role.name}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {role.permissions.slice(0, 3).map((perm) => (
                            <Badge key={perm} variant="outline" className="text-xs">
                              {perm.replace('_', ' ')}
                            </Badge>
                          ))}
                          {role.permissions.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{role.permissions.length - 3} more
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{role.userCount}</TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Edit User Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4">
              <div>
                <Label>Name</Label>
                <Input defaultValue={selectedUser.name} />
              </div>
              <div>
                <Label>Email</Label>
                <Input type="email" defaultValue={selectedUser.email} />
              </div>
              <div>
                <Label>Phone</Label>
                <Input defaultValue={selectedUser.phone} />
              </div>
              <div>
                <Label>Role</Label>
                <Select defaultValue={selectedUser.role.toLowerCase().replace(' ', '_')}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="super_admin">Super Admin</SelectItem>
                    <SelectItem value="state_head">State Head</SelectItem>
                    <SelectItem value="center_manager">Center Manager</SelectItem>
                    <SelectItem value="counsellor">Counsellor</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Assigned Centres</Label>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {centres.map((centre) => (
                    <div key={centre.id} className="flex items-center space-x-2">
                      <Checkbox 
                        id={centre.id} 
                        defaultChecked={selectedUser.centres.includes(centre.name)}
                      />
                      <Label htmlFor={centre.id} className="text-sm">{centre.name}</Label>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex gap-2">
                <Button onClick={() => setIsEditModalOpen(false)}>Save Changes</Button>
                <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>Cancel</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserManagement;