
import React from 'react';
import { MainLayout } from '@/layouts/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, UserPlus, Flag, ArrowUpRight, Filter, Download } from 'lucide-react';

const SosEscalationTracker = () => {
  // Dummy data for SOS cases
  const sosCases = [
    { 
      id: 'SOS001', 
      candidate: 'Rahul Sharma', 
      category: 'Payment Delay', 
      center: 'Delhi Center',
      dateRaised: '2023-11-05',
      assignedTo: 'Ankit Gupta',
      priority: 'high',
      status: 'open'
    },
    { 
      id: 'SOS002', 
      candidate: 'Priya Patel', 
      category: 'Hostel Issue', 
      center: 'Mumbai Center',
      dateRaised: '2023-11-03',
      assignedTo: 'Neha Singh',
      priority: 'medium',
      status: 'inprogress'
    },
    { 
      id: 'SOS003', 
      candidate: 'Amit Kumar', 
      category: 'Document Loss', 
      center: 'Bangalore Center',
      dateRaised: '2023-11-01',
      assignedTo: 'Rajesh Kumar',
      priority: 'low',
      status: 'inprogress'
    },
    { 
      id: 'SOS004', 
      candidate: 'Sneha Singh', 
      category: 'Travel Issues', 
      center: 'Pune Center',
      dateRaised: '2023-10-28',
      assignedTo: 'Sanjay Patel',
      priority: 'high',
      status: 'escalated'
    },
    { 
      id: 'SOS005', 
      candidate: 'Vikram Reddy', 
      category: 'Placement Complaint', 
      center: 'Chennai Center',
      dateRaised: '2023-10-25',
      assignedTo: 'Lakshmi N',
      priority: 'medium',
      status: 'resolved'
    },
  ];

  // Dummy SOS metrics
  const sosMetrics = {
    total: 42,
    open: 15,
    inprogress: 18,
    escalated: 5,
    resolved: 47,
    avgResolutionTime: '2.3 days'
  };

  return (
    <MainLayout role="super_admin">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">SOS & Escalation Tracker</h1>
            <p className="text-muted-foreground">
              Track and manage candidate issues and escalations.
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              Export
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          <Card className="bg-gradient-to-br from-gray-50 to-gray-100">
            <CardContent className="p-4">
              <div className="text-3xl font-bold">{sosMetrics.total}</div>
              <p className="text-sm text-gray-600 mt-1">Total SOS Cases</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-red-50 to-red-100">
            <CardContent className="p-4">
              <div className="text-3xl font-bold text-red-700">{sosMetrics.open}</div>
              <p className="text-sm text-red-600 mt-1">Open Cases</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-amber-50 to-amber-100">
            <CardContent className="p-4">
              <div className="text-3xl font-bold text-amber-700">{sosMetrics.inprogress}</div>
              <p className="text-sm text-amber-600 mt-1">In Progress</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-purple-50 to-purple-100">
            <CardContent className="p-4">
              <div className="text-3xl font-bold text-purple-700">{sosMetrics.escalated}</div>
              <p className="text-sm text-purple-600 mt-1">Escalated</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-green-50 to-green-100">
            <CardContent className="p-4">
              <div className="text-3xl font-bold text-green-700">{sosMetrics.resolved}</div>
              <p className="text-sm text-green-600 mt-1">Resolved This Month</p>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100">
            <CardContent className="p-4">
              <div className="text-3xl font-bold text-blue-700">{sosMetrics.avgResolutionTime}</div>
              <p className="text-sm text-blue-600 mt-1">Avg. Resolution Time</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList>
            <TabsTrigger value="all">All Cases</TabsTrigger>
            <TabsTrigger value="open">Open</TabsTrigger>
            <TabsTrigger value="inprogress">In Progress</TabsTrigger>
            <TabsTrigger value="escalated">Escalated</TabsTrigger>
            <TabsTrigger value="resolved">Resolved</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="space-y-4 pt-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="relative sm:max-w-xs flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input className="pl-8 w-full" placeholder="Search cases..." />
              </div>
              <Button variant="outline" className="gap-2">
                <Filter className="h-4 w-4" />
                Filter
              </Button>
            </div>
            
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableCaption>All SOS cases</TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Case ID</TableHead>
                      <TableHead>Candidate</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Center</TableHead>
                      <TableHead>Date Raised</TableHead>
                      <TableHead>Assigned To</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sosCases.map((sosCase) => (
                      <TableRow key={sosCase.id}>
                        <TableCell className="font-mono">{sosCase.id}</TableCell>
                        <TableCell className="font-medium">{sosCase.candidate}</TableCell>
                        <TableCell>{sosCase.category}</TableCell>
                        <TableCell>{sosCase.center}</TableCell>
                        <TableCell>{sosCase.dateRaised}</TableCell>
                        <TableCell>{sosCase.assignedTo}</TableCell>
                        <TableCell>
                          <Badge variant={
                            sosCase.priority === 'high' ? "destructive" : 
                            sosCase.priority === 'medium' ? "default" : "secondary"
                          }>
                            {sosCase.priority}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={
                            sosCase.status === 'open' ? "outline" : 
                            sosCase.status === 'inprogress' ? "default" : 
                            sosCase.status === 'escalated' ? "destructive" : "success"
                          }>
                            {sosCase.status === 'inprogress' ? 'In Progress' : 
                             sosCase.status.charAt(0).toUpperCase() + sosCase.status.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-1">
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <UserPlus className="h-3.5 w-3.5" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Flag className="h-3.5 w-3.5" />
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
          
          <TabsContent value="open" className="pt-4">
            <Card className="min-h-[300px]">
              <CardHeader>
                <CardTitle>Open SOS Cases</CardTitle>
              </CardHeader>
              <CardContent className="flex items-center justify-center">
                <p className="text-center text-muted-foreground">This view will display only open SOS cases.</p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="inprogress" className="pt-4">
            <Card className="min-h-[300px]">
              <CardHeader>
                <CardTitle>In Progress SOS Cases</CardTitle>
              </CardHeader>
              <CardContent className="flex items-center justify-center">
                <p className="text-center text-muted-foreground">This view will display only in-progress SOS cases.</p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="escalated" className="pt-4">
            <Card className="min-h-[300px]">
              <CardHeader>
                <CardTitle>Escalated SOS Cases</CardTitle>
              </CardHeader>
              <CardContent className="flex items-center justify-center">
                <p className="text-center text-muted-foreground">This view will display only escalated SOS cases.</p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="resolved" className="pt-4">
            <Card className="min-h-[300px]">
              <CardHeader>
                <CardTitle>Resolved SOS Cases</CardTitle>
              </CardHeader>
              <CardContent className="flex items-center justify-center">
                <p className="text-center text-muted-foreground">This view will display only resolved SOS cases.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default SosEscalationTracker;
