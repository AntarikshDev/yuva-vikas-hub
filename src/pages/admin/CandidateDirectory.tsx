
import React, { useState } from 'react';
import { MainLayout } from '@/layouts/MainLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DateRangePicker } from '@/components/ui/date-range-picker';
import { DateRange } from 'react-day-picker';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter, Download, Eye, FileText, UserCog, MoreHorizontal } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const CandidateDirectory = () => {
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(2023, 9, 1),
    to: new Date(2023, 11, 31)
  });

  // Dummy data for candidates
  const candidates = [
    { 
      id: 'C001', 
      name: 'Rahul Sharma', 
      mobile: '9876543210', 
      district: 'Delhi', 
      state: 'Delhi',
      center: 'Delhi Center',
      batch: 'CSE Batch 01',
      jobRole: 'Customer Service Executive',
      category: 'A',
      status: 'training',
      mobilizer: 'Amit Kumar'
    },
    { 
      id: 'C002', 
      name: 'Priya Patel', 
      mobile: '9876543211', 
      district: 'Mumbai', 
      state: 'Maharashtra',
      center: 'Mumbai Center',
      batch: 'FSE Batch 02',
      jobRole: 'Field Sales Executive',
      category: 'B',
      status: 'placed',
      mobilizer: 'Sanjay Patel'
    },
    { 
      id: 'C003', 
      name: 'Amit Singh', 
      mobile: '9876543212', 
      district: 'Bangalore Urban', 
      state: 'Karnataka',
      center: 'Bangalore Center',
      batch: 'GDA Batch 01',
      jobRole: 'General Duty Assistant',
      category: 'A',
      status: 'placed',
      mobilizer: 'Lakshmi N'
    },
    { 
      id: 'C004', 
      name: 'Sneha Gupta', 
      mobile: '9876543213', 
      district: 'Pune', 
      state: 'Maharashtra',
      center: 'Pune Center',
      batch: 'BPO Batch 01',
      jobRole: 'BPO Voice',
      category: 'C',
      status: 'dropout',
      mobilizer: 'Rajesh Kumar'
    },
    { 
      id: 'C005', 
      name: 'Vikram Reddy', 
      mobile: '9876543214', 
      district: 'Chennai', 
      state: 'Tamil Nadu',
      center: 'Chennai Center',
      batch: 'RSA Batch 03',
      jobRole: 'Retail Sales Associate',
      category: 'B',
      status: 'training',
      mobilizer: 'Ankit Gupta'
    },
    { 
      id: 'C006', 
      name: 'Kavita Nair', 
      mobile: '9876543215', 
      district: 'Trivandrum', 
      state: 'Kerala',
      center: 'Trivandrum Center',
      batch: 'CSE Batch 02',
      jobRole: 'Customer Service Executive',
      category: 'A',
      status: 'placed',
      mobilizer: 'Meena S'
    },
    { 
      id: 'C007', 
      name: 'Raj Malhotra', 
      mobile: '9876543216', 
      district: 'Hyderabad', 
      state: 'Telangana',
      center: 'Hyderabad Center',
      batch: 'FSE Batch 01',
      jobRole: 'Field Sales Executive',
      category: 'B',
      status: 'pending',
      mobilizer: 'Venkat K'
    },
  ];

  // Get unique states, centers, job roles, etc. for filters
  const states = [...new Set(candidates.map(c => c.state))];
  const jobRoles = [...new Set(candidates.map(c => c.jobRole))];
  const centers = [...new Set(candidates.map(c => c.center))];
  const categories = [...new Set(candidates.map(c => c.category))];
  const statuses = [...new Set(candidates.map(c => c.status))];

  return (
    <MainLayout role="super_admin">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Candidate Directory</h1>
            <p className="text-muted-foreground">
              Comprehensive database of all registered candidates.
            </p>
          </div>
        </div>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Filter Candidates</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input className="pl-8" placeholder="Search by name, ID, mobile..." />
              </div>
              
              <Select>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select State" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All States</SelectItem>
                  {states.map((state) => (
                    <SelectItem key={state} value={state.toLowerCase()}>{state}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Center" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Centers</SelectItem>
                  {centers.map((center) => (
                    <SelectItem key={center} value={center.toLowerCase()}>{center}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Job Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Job Roles</SelectItem>
                  {jobRoles.map((role) => (
                    <SelectItem key={role} value={role.toLowerCase()}>{role}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  {statuses.map((status) => (
                    <SelectItem key={status} value={status}>{status.charAt(0).toUpperCase() + status.slice(1)}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 mt-4 items-end">
              <div className="w-full sm:w-auto sm:flex-1">
                <Label className="text-xs mb-1 block">Registration Date Range</Label>
                <DateRangePicker
                  dateRange={dateRange}
                  onDateRangeChange={setDateRange}
                />
              </div>
              <div className="flex gap-2">
                <Button variant="outline" className="gap-2">
                  <Filter className="h-4 w-4" />
                  More Filters
                </Button>
                <Button className="gap-2">
                  <Search className="h-4 w-4" />
                  Apply Filters
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle>
                Candidates
                <Badge variant="outline" className="ml-2">
                  {candidates.length} results
                </Badge>
              </CardTitle>
              <Button variant="outline" className="gap-2">
                <Download className="h-4 w-4" />
                Export
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableCaption>List of all registered candidates</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Mobile</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Center</TableHead>
                  <TableHead>Job Role</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {candidates.map((candidate) => (
                  <TableRow key={candidate.id}>
                    <TableCell className="font-mono">{candidate.id}</TableCell>
                    <TableCell className="font-medium">{candidate.name}</TableCell>
                    <TableCell>{candidate.mobile}</TableCell>
                    <TableCell>{`${candidate.district}, ${candidate.state}`}</TableCell>
                    <TableCell>{candidate.center}</TableCell>
                    <TableCell className="max-w-[180px] truncate">{candidate.jobRole}</TableCell>
                    <TableCell>
                      <Badge variant={
                        candidate.category === 'A' ? "default" : 
                        candidate.category === 'B' ? "secondary" : "outline"
                      }>
                        Category {candidate.category}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={
                        candidate.status === 'placed' ? "success" : 
                        candidate.status === 'training' ? "default" : 
                        candidate.status === 'dropout' ? "destructive" : "outline"
                      }>
                        {candidate.status.charAt(0).toUpperCase() + candidate.status.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem className="flex items-center gap-2 cursor-pointer">
                            <Eye className="h-4 w-4" />
                            View Profile
                          </DropdownMenuItem>
                          <DropdownMenuItem className="flex items-center gap-2 cursor-pointer">
                            <FileText className="h-4 w-4" />
                            Download Documents
                          </DropdownMenuItem>
                          <DropdownMenuItem className="flex items-center gap-2 cursor-pointer">
                            <UserCog className="h-4 w-4" />
                            Change Category
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="flex items-center gap-2 cursor-pointer">
                            Reassign Batch
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default CandidateDirectory;
