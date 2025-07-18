import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Settings, Plus, Edit, Trash2, TestTube, Wifi, MapPin, GraduationCap, Package, Building, CreditCard } from 'lucide-react';

const LookupConfiguration = () => {
  const [activeTab, setActiveTab] = useState('centres');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeviceModalOpen, setIsDeviceModalOpen] = useState(false);

  // Mock data for different lookup types
  const lookupData = {
    centres: [
      { id: 1, name: 'Delhi Training Centre', code: 'DTC-001', status: 'Active', region: 'North' },
      { id: 2, name: 'Mumbai Training Centre', code: 'MTC-002', status: 'Active', region: 'West' },
      { id: 3, name: 'Bangalore Training Centre', code: 'BTC-003', status: 'Inactive', region: 'South' }
    ],
    courses: [
      { id: 1, name: 'Retail Sales Associate', code: 'RSA-101', status: 'Active', duration: '3 months' },
      { id: 2, name: 'Customer Service Executive', code: 'CSE-102', status: 'Active', duration: '2 months' },
      { id: 3, name: 'Data Entry Operator', code: 'DEO-103', status: 'Active', duration: '1 month' }
    ],
    batches: [
      { id: 1, name: 'DDU-GKY Batch 5', code: 'DGB-005', status: 'Active', centre: 'Delhi Training Centre' },
      { id: 2, name: 'DDU-GKY Batch 6', code: 'DGB-006', status: 'Active', centre: 'Mumbai Training Centre' },
      { id: 3, name: 'DDU-GKY Batch 7', code: 'DGB-007', status: 'Completed', centre: 'Bangalore Training Centre' }
    ],
    idTypes: [
      { id: 1, name: 'Aadhaar Card', code: 'AADHAAR', status: 'Active', required: true },
      { id: 2, name: 'PAN Card', code: 'PAN', status: 'Active', required: false },
      { id: 3, name: 'Voter ID', code: 'VOTER', status: 'Active', required: false }
    ],
    states: [
      { id: 1, name: 'Delhi', code: 'DL', status: 'Active', region: 'North' },
      { id: 2, name: 'Maharashtra', code: 'MH', status: 'Active', region: 'West' },
      { id: 3, name: 'Karnataka', code: 'KA', status: 'Active', region: 'South' }
    ],
    cities: [
      { id: 1, name: 'New Delhi', code: 'ND', status: 'Active', state: 'Delhi' },
      { id: 2, name: 'Mumbai', code: 'MUM', status: 'Active', state: 'Maharashtra' },
      { id: 3, name: 'Bangalore', code: 'BLR', status: 'Active', state: 'Karnataka' }
    ]
  };

  // Mock device data
  const devices = [
    { id: 1, centreName: 'Delhi Training Centre', deviceId: 'DEV-001', status: 'Online', lastSync: '2025-07-18 10:30' },
    { id: 2, centreName: 'Mumbai Training Centre', deviceId: 'DEV-002', status: 'Offline', lastSync: '2025-07-17 16:45' },
    { id: 3, centreName: 'Bangalore Training Centre', deviceId: 'DEV-003', status: 'Online', lastSync: '2025-07-18 09:15' }
  ];

  // Mock incentive rules
  const incentiveRules = [
    { id: 1, role: 'Counsellor', commission: 5, milestoneType: 'Enrollment', amount: 500 },
    { id: 2, role: 'Center Manager', commission: 3, milestoneType: 'Placement', amount: 1000 },
    { id: 3, role: 'State Head', commission: 2, milestoneType: 'Retention', amount: 1500 }
  ];

  // Mock message templates
  const messageTemplates = [
    { id: 1, name: 'Enrollment Reminder', type: 'Reminder', lastModified: '2025-07-15', status: 'Active' },
    { id: 2, name: 'Document Submission Alert', type: 'Alert', lastModified: '2025-07-14', status: 'Active' },
    { id: 3, name: 'Placement Confirmation', type: 'Notification', lastModified: '2025-07-13', status: 'Draft' }
  ];

  const getStatusBadge = (status: string) => {
    const colors = {
      'Active': 'bg-green-100 text-green-800',
      'Inactive': 'bg-red-100 text-red-800',
      'Completed': 'bg-blue-100 text-blue-800',
      'Online': 'bg-green-100 text-green-800',
      'Offline': 'bg-red-100 text-red-800',
      'Draft': 'bg-yellow-100 text-yellow-800'
    };
    return <Badge className={colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800'}>{status}</Badge>;
  };

  const getTabIcon = (tab: string) => {
    const icons = {
      centres: Building,
      courses: GraduationCap,
      batches: Package,
      idTypes: CreditCard,
      states: MapPin,
      cities: MapPin
    };
    const Icon = icons[tab as keyof typeof icons] || Settings;
    return <Icon className="h-4 w-4" />;
  };

  const renderTabContent = (tabKey: string) => {
    const data = lookupData[tabKey as keyof typeof lookupData];
    
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              {getTabIcon(tabKey)}
              {tabKey.charAt(0).toUpperCase() + tabKey.slice(1)} Management
            </span>
            <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Add {tabKey.slice(0, -1)}
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New {tabKey.slice(0, -1)}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label>Name</Label>
                    <Input placeholder={`Enter ${tabKey.slice(0, -1)} name`} />
                  </div>
                  <div>
                    <Label>Code</Label>
                    <Input placeholder={`Enter ${tabKey.slice(0, -1)} code`} />
                  </div>
                  <div>
                    <Label>Status</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={() => setIsAddModalOpen(false)}>Add</Button>
                    <Button variant="outline" onClick={() => setIsAddModalOpen(false)}>Cancel</Button>
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
                <TableHead>Name</TableHead>
                <TableHead>Code</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((item: any) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell>{item.code}</TableCell>
                  <TableCell>{getStatusBadge(item.status)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="border-b pb-4">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Settings className="h-8 w-8" />
          Lookup & Configuration Management
        </h1>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="centres">Centres</TabsTrigger>
          <TabsTrigger value="courses">Courses</TabsTrigger>
          <TabsTrigger value="batches">Batches</TabsTrigger>
          <TabsTrigger value="idTypes">ID Types</TabsTrigger>
          <TabsTrigger value="states">States</TabsTrigger>
          <TabsTrigger value="cities">Cities</TabsTrigger>
        </TabsList>

        {Object.keys(lookupData).map((tabKey) => (
          <TabsContent key={tabKey} value={tabKey}>
            {renderTabContent(tabKey)}
          </TabsContent>
        ))}
      </Tabs>

      {/* Biometric Device Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Wifi className="h-5 w-5" />
              Biometric Device Configuration
            </span>
            <Dialog open={isDeviceModalOpen} onOpenChange={setIsDeviceModalOpen}>
              <DialogTrigger asChild>
                <Button>Configure Device</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Configure Biometric Device</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label>Device IP</Label>
                    <Input placeholder="192.168.1.100" />
                  </div>
                  <div>
                    <Label>Port</Label>
                    <Input placeholder="4370" />
                  </div>
                  <div>
                    <Label>Centre Assignment</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select centre" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="delhi">Delhi Training Centre</SelectItem>
                        <SelectItem value="mumbai">Mumbai Training Centre</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={() => setIsDeviceModalOpen(false)}>Save Configuration</Button>
                    <Button variant="outline">
                      <TestTube className="h-4 w-4 mr-2" />
                      Test Connection
                    </Button>
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
                <TableHead>Centre Name</TableHead>
                <TableHead>Device ID</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Sync</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {devices.map((device) => (
                <TableRow key={device.id}>
                  <TableCell>{device.centreName}</TableCell>
                  <TableCell>{device.deviceId}</TableCell>
                  <TableCell>{getStatusBadge(device.status)}</TableCell>
                  <TableCell>{device.lastSync}</TableCell>
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

      {/* Incentive & Commission Rules */}
      <Card>
        <CardHeader>
          <CardTitle>Incentive & Commission Rules</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Role</TableHead>
                <TableHead>Commission %</TableHead>
                <TableHead>Milestone Type</TableHead>
                <TableHead>Amount (₹)</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {incentiveRules.map((rule) => (
                <TableRow key={rule.id}>
                  <TableCell>{rule.role}</TableCell>
                  <TableCell>{rule.commission}%</TableCell>
                  <TableCell>{rule.milestoneType}</TableCell>
                  <TableCell>₹{rule.amount}</TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="mt-4">
            <Button>Update Rules</Button>
          </div>
        </CardContent>
      </Card>

      {/* WhatsApp & Email Template Manager */}
      <Card>
        <CardHeader>
          <CardTitle>WhatsApp & Email Template Manager</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Last Modified</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {messageTemplates.map((template) => (
                <TableRow key={template.id}>
                  <TableCell>{template.name}</TableCell>
                  <TableCell>{template.type}</TableCell>
                  <TableCell>{template.lastModified}</TableCell>
                  <TableCell>{getStatusBadge(template.status)}</TableCell>
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
    </div>
  );
};

export default LookupConfiguration;