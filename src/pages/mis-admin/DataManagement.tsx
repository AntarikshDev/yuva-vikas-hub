import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { RefreshCw, Database, Search, AlertTriangle, CheckCircle, XCircle, Upload } from 'lucide-react';

const DataManagement = () => {
  const [activeTab, setActiveTab] = useState('sync-queue');
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);

  // Mock data for sync queue
  const syncQueueData = [
    {
      id: 1,
      dataType: 'Mobilisation',
      pendingRecords: 45,
      lastAttempt: '2025-07-18 10:30',
      status: 'Failed',
      error: 'Connection timeout'
    },
    {
      id: 2,
      dataType: 'Attendance',
      pendingRecords: 12,
      lastAttempt: '2025-07-18 10:25',
      status: 'Processing',
      error: null
    },
    {
      id: 3,
      dataType: 'Documents',
      pendingRecords: 8,
      lastAttempt: '2025-07-18 10:20',
      status: 'Success',
      error: null
    },
    {
      id: 4,
      dataType: 'Placement',
      pendingRecords: 23,
      lastAttempt: '2025-07-18 10:15',
      status: 'Failed',
      error: 'Data validation error'
    }
  ];

  // Mock backup history
  const backupHistory = [
    {
      id: 1,
      date: '2025-07-18',
      fileName: 'backup_20250718_030000.sql',
      status: 'Completed',
      size: '2.4 GB'
    },
    {
      id: 2,
      date: '2025-07-17',
      fileName: 'backup_20250717_030000.sql',
      status: 'Completed',
      size: '2.3 GB'
    },
    {
      id: 3,
      date: '2025-07-16',
      fileName: 'backup_20250716_030000.sql',
      status: 'Failed',
      size: '-'
    }
  ];

  // Mock candidate data for correction
  const candidateData = {
    id: 'CAND-001',
    name: 'Ravi Kumar',
    email: 'ravi.kumar@example.com',
    phone: '+91-9876543210',
    aadhaar: '1234-5678-9012',
    address: 'Delhi, India',
    course: 'Retail Sales Associate',
    batch: 'DDU-GKY Batch 5',
    status: 'Enrolled'
  };

  const getStatusBadge = (status: string) => {
    const colors = {
      'Failed': 'bg-red-100 text-red-800',
      'Processing': 'bg-yellow-100 text-yellow-800',
      'Success': 'bg-green-100 text-green-800',
      'Completed': 'bg-green-100 text-green-800'
    };
    return <Badge className={colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800'}>{status}</Badge>;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Failed':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'Processing':
        return <RefreshCw className="h-4 w-4 text-yellow-500 animate-spin" />;
      case 'Success':
      case 'Completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="border-b pb-4">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Database className="h-8 w-8" />
          Data Management
        </h1>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="sync-queue">Data Sync Queue</TabsTrigger>
          <TabsTrigger value="correction">Data Correction</TabsTrigger>
          <TabsTrigger value="backup">Archive & Backup</TabsTrigger>
        </TabsList>

        {/* Data Sync Queue Tab */}
        <TabsContent value="sync-queue" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <RefreshCw className="h-5 w-5" />
                Data Sync Queue Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Data Type</TableHead>
                    <TableHead>Pending Records</TableHead>
                    <TableHead>Last Attempt</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Error</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {syncQueueData.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.dataType}</TableCell>
                      <TableCell>{item.pendingRecords}</TableCell>
                      <TableCell>{item.lastAttempt}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(item.status)}
                          {getStatusBadge(item.status)}
                        </div>
                      </TableCell>
                      <TableCell>
                        {item.error && (
                          <span className="text-red-600 text-sm">{item.error}</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={item.status === 'Processing'}
                          className="flex items-center gap-2"
                        >
                          <RefreshCw className="h-4 w-4" />
                          Retry Sync
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Sync Summary */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Pending</p>
                    <p className="text-2xl font-bold">88</p>
                  </div>
                  <AlertTriangle className="h-8 w-8 text-orange-500" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Failed Today</p>
                    <p className="text-2xl font-bold text-red-600">2</p>
                  </div>
                  <XCircle className="h-8 w-8 text-red-500" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Processed Today</p>
                    <p className="text-2xl font-bold text-green-600">1,247</p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-green-500" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Success Rate</p>
                    <p className="text-2xl font-bold">93.4%</p>
                  </div>
                  <Database className="h-8 w-8 text-blue-500" />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Data Correction Tab */}
        <TabsContent value="correction" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Search className="h-5 w-5" />
                  Data Correction
                </span>
                <Dialog open={isSearchModalOpen} onOpenChange={setIsSearchModalOpen}>
                  <DialogTrigger asChild>
                    <Button>Search Candidate</Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Search Candidate for Data Correction</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <Search className="h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Enter Candidate ID or Name"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <Button>Search</Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* Candidate Data Form */}
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Candidate ID</Label>
                    <Input value={candidateData.id} readOnly className="bg-gray-50" />
                  </div>
                  <div>
                    <Label>Name</Label>
                    <Input defaultValue={candidateData.name} />
                  </div>
                  <div>
                    <Label>Email</Label>
                    <Input defaultValue={candidateData.email} />
                  </div>
                  <div>
                    <Label>Phone</Label>
                    <Input defaultValue={candidateData.phone} />
                  </div>
                  <div>
                    <Label>Aadhaar Number</Label>
                    <Input defaultValue={candidateData.aadhaar} />
                  </div>
                  <div>
                    <Label>Course</Label>
                    <Input defaultValue={candidateData.course} />
                  </div>
                  <div>
                    <Label>Batch</Label>
                    <Input defaultValue={candidateData.batch} />
                  </div>
                  <div>
                    <Label>Status</Label>
                    <Input defaultValue={candidateData.status} />
                  </div>
                </div>
                <div>
                  <Label>Address</Label>
                  <Textarea defaultValue={candidateData.address} rows={3} />
                </div>
                <div>
                  <Label>Correction Notes</Label>
                  <Textarea placeholder="Enter details about the corrections made..." rows={3} />
                </div>
                <div className="flex gap-2">
                  <Button>Save Corrections</Button>
                  <Button variant="outline">Cancel</Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Corrections */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Data Corrections</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Candidate ID</TableHead>
                    <TableHead>Field Modified</TableHead>
                    <TableHead>Modified By</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>CAND-001</TableCell>
                    <TableCell>Phone Number</TableCell>
                    <TableCell>MIS Admin</TableCell>
                    <TableCell>2025-07-18 09:30</TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm">View Details</Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>CAND-002</TableCell>
                    <TableCell>Address</TableCell>
                    <TableCell>MIS Admin</TableCell>
                    <TableCell>2025-07-17 14:15</TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm">View Details</Button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Archive & Backup Tab */}
        <TabsContent value="backup" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Backup History</span>
                <Button className="flex items-center gap-2">
                  <Upload className="h-4 w-4" />
                  Create Backup
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>File Name</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Size</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {backupHistory.map((backup) => (
                    <TableRow key={backup.id}>
                      <TableCell>{backup.date}</TableCell>
                      <TableCell className="font-mono text-sm">{backup.fileName}</TableCell>
                      <TableCell>{getStatusBadge(backup.status)}</TableCell>
                      <TableCell>{backup.size}</TableCell>
                      <TableCell>
                        {backup.status === 'Completed' && (
                          <Button variant="outline" size="sm">Download</Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Archive Settings */}
          <Card>
            <CardHeader>
              <CardTitle>Archive Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base">Auto-Archive</Label>
                    <p className="text-sm text-muted-foreground">Automatically archive old records</p>
                  </div>
                  <Switch />
                </div>
                <div>
                  <Label>Retention Period (months)</Label>
                  <Input defaultValue="12" type="number" className="w-32" />
                </div>
                <div>
                  <Label>Archive Location</Label>
                  <Input defaultValue="/archive/lnj-skill-dev/" readOnly className="bg-gray-50" />
                </div>
                <Button>Update Settings</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DataManagement;