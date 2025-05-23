
import React, { useState } from 'react';
import { MainLayout } from '@/layouts/MainLayout';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { CalendarIcon, Plus, Users, Search, Edit, Calendar, CheckCircle, FileText, UserPlus, Filter } from 'lucide-react';
import { format } from 'date-fns';
import { DateRangePicker } from '@/components/ui/date-range-picker';
import { DateRange } from 'react-day-picker';

const BatchManagement = () => {
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(2023, 10, 15),
    to: new Date(2023, 12, 31)
  });

  // Dummy data for batches
  const batches = [
    { 
      id: 'B001', 
      name: 'CSE Batch 01', 
      center: 'Delhi Center', 
      jobRole: 'Customer Service Executive', 
      trainer: 'Rajiv Sharma',
      startDate: '2023-11-15',
      endDate: '2023-12-30',
      strength: 25,
      maxStrength: 30,
      progress: 65,
      status: 'active'
    },
    { 
      id: 'B002', 
      name: 'FSE Batch 02', 
      center: 'Mumbai Center', 
      jobRole: 'Field Sales Executive', 
      trainer: 'Priya Desai',
      startDate: '2023-10-20',
      endDate: '2023-12-15',
      strength: 28,
      maxStrength: 30,
      progress: 80,
      status: 'active'
    },
    { 
      id: 'B003', 
      name: 'GDA Batch 01', 
      center: 'Bangalore Center', 
      jobRole: 'General Duty Assistant', 
      trainer: 'Suresh Kumar',
      startDate: '2023-11-01',
      endDate: '2023-12-20',
      strength: 22,
      maxStrength: 25,
      progress: 70,
      status: 'active'
    },
    { 
      id: 'B004', 
      name: 'RSA Batch 03', 
      center: 'Chennai Center', 
      jobRole: 'Retail Sales Associate', 
      trainer: 'Lakshmi N',
      startDate: '2023-09-15',
      endDate: '2023-11-15',
      strength: 20,
      maxStrength: 25,
      progress: 100,
      status: 'completed'
    },
    { 
      id: 'B005', 
      name: 'BPO Batch 01', 
      center: 'Pune Center', 
      jobRole: 'BPO Voice', 
      trainer: 'Aman Gupta',
      startDate: '2023-11-25',
      endDate: '2024-01-15',
      strength: 15,
      maxStrength: 30,
      progress: 20,
      status: 'active'
    },
  ];

  return (
    <MainLayout role="super_admin">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Batch Management</h1>
            <p className="text-muted-foreground">
              Create and manage training batches across centers.
            </p>
          </div>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Create Batch
          </Button>
        </div>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <CardTitle>Active Batches</CardTitle>
              <div className="flex flex-col md:flex-row gap-3">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                  <Input className="pl-8 w-full md:w-[250px]" placeholder="Search batches..." />
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="h-10 gap-1">
                    <Filter className="h-3.5 w-3.5" />
                    Filter
                  </Button>
                  <DateRangePicker
                    dateRange={dateRange}
                    onDateRangeChange={setDateRange}
                    className="w-[300px]"
                  />
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableCaption>List of all training batches</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Batch ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Center</TableHead>
                  <TableHead>Job Role</TableHead>
                  <TableHead>Trainer</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Strength</TableHead>
                  <TableHead>Progress</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {batches.map((batch) => (
                  <TableRow key={batch.id}>
                    <TableCell className="font-mono">{batch.id}</TableCell>
                    <TableCell className="font-medium">{batch.name}</TableCell>
                    <TableCell>{batch.center}</TableCell>
                    <TableCell>{batch.jobRole}</TableCell>
                    <TableCell>{batch.trainer}</TableCell>
                    <TableCell>
                      <div className="flex flex-col text-xs">
                        <span>Start: {format(new Date(batch.startDate), 'dd MMM yyyy')}</span>
                        <span>End: {format(new Date(batch.endDate), 'dd MMM yyyy')}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      {batch.strength}/{batch.maxStrength}
                    </TableCell>
                    <TableCell className="w-[120px]">
                      <div className="space-y-1">
                        <Progress value={batch.progress} className="h-2" />
                        <span className="text-xs text-gray-500">{batch.progress}% Complete</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={batch.status === 'active' ? "default" : batch.status === 'completed' ? "success" : "secondary"}>
                        {batch.status === 'active' ? 'Active' : batch.status === 'completed' ? 'Completed' : 'Pending'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-1">
                        <Button variant="ghost" size="icon" className="h-7 w-7">
                          <Edit className="h-3.5 w-3.5" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7">
                          <UserPlus className="h-3.5 w-3.5" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7">
                          <FileText className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="bg-green-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-800">
                <CheckCircle className="h-5 w-5" />
                Completed Batches
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-green-700">24</div>
              <p className="text-sm text-green-600 mt-1">Last 6 months</p>
            </CardContent>
          </Card>
          
          <Card className="bg-blue-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-800">
                <Calendar className="h-5 w-5" />
                Upcoming Batches
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-blue-700">12</div>
              <p className="text-sm text-blue-600 mt-1">Next 30 days</p>
            </CardContent>
          </Card>
          
          <Card className="bg-purple-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-purple-800">
                <Users className="h-5 w-5" />
                Total Trainees
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-purple-700">738</div>
              <p className="text-sm text-purple-600 mt-1">Currently in training</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default BatchManagement;
