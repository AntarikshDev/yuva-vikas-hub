import React, { useState } from 'react';
import { MainLayout } from '@/layouts/MainLayout';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { 
  CalendarIcon, Plus, Users, Search, Edit, Calendar, 
  CheckCircle, FileText, UserPlus, Filter, X
} from 'lucide-react';
import { format } from 'date-fns';
import { DateRangePicker } from '@/components/ui/date-range-picker';
import { DateRange } from 'react-day-picker';
import { BatchForm } from '@/components/forms/BatchForm';
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from '@/components/ui/popover';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { useToast } from '@/hooks/use-toast';
import { DataTable } from '@/components/common/DataTable';

// Define the Batch type to ensure consistency
interface Batch {
  id: string;
  name: string;
  center: string;
  jobRole: string;
  trainer: string;
  startDate: string;
  endDate: string;
  strength: number;
  maxStrength: number;
  progress: number;
  status: string;
}

const BatchManagement = () => {
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: new Date(2023, 10, 15),
    to: new Date(2023, 12, 31)
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [createBatchOpen, setCreateBatchOpen] = useState(false);
  const [editBatchOpen, setEditBatchOpen] = useState(false);
  const [viewDetailsOpen, setViewDetailsOpen] = useState(false);
  const [addStudentsOpen, setAddStudentsOpen] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState<Batch | null>(null);
  const [filterOpen, setFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    status: '',
    center: '',
    jobRole: ''
  });

  const { toast } = useToast();

  // Updated batches state with the proper type
  const [batches, setBatches] = useState<Batch[]>([
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
  ]);

  // Filter data based on search term and filters
  const filteredBatches = batches.filter(batch => {
    const matchesSearch = batch.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         batch.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         batch.center.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         batch.jobRole.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatusFilter = filters.status === '' || batch.status === filters.status;
    const matchesCenterFilter = filters.center === '' || batch.center === filters.center;
    const matchesJobRoleFilter = filters.jobRole === '' || batch.jobRole === filters.jobRole;
    
    const matchesDateFilter = !dateRange || !dateRange.from || !dateRange.to || 
      (new Date(batch.startDate) >= dateRange.from && new Date(batch.endDate) <= dateRange.to);

    return matchesSearch && matchesStatusFilter && matchesCenterFilter && matchesJobRoleFilter && matchesDateFilter;
  });

  // Centers for filter
  const centers = [...new Set(batches.map(b => b.center))];
  // Job roles for filter
  const jobRoles = [...new Set(batches.map(b => b.jobRole))];

  // Updated handle batch creation to ensure dates are formatted as strings
  const handleBatchCreation = (batchData) => {
    const newBatch: Batch = {
      id: `B00${batches.length + 1}`,
      name: batchData.name,
      center: batchData.center,
      jobRole: batchData.jobRole,
      trainer: batchData.trainer,
      startDate: format(batchData.startDate, 'yyyy-MM-dd'),
      endDate: format(batchData.endDate, 'yyyy-MM-dd'),
      strength: 0,
      maxStrength: batchData.maxStrength,
      progress: 0,
      status: 'active'
    };
    
    setBatches([...batches, newBatch]);
    setCreateBatchOpen(false);
    
    toast({
      title: "Batch Created",
      description: `${newBatch.name} has been successfully created.`,
    });
  };

  // Handle edit batch
  const handleEditBatch = (batch) => {
    setSelectedBatch(batch);
    setEditBatchOpen(true);
  };

  // Handle add students to batch
  const handleAddStudents = (batch) => {
    setSelectedBatch(batch);
    setAddStudentsOpen(true);
  };

  // Handle view batch details
  const handleViewDetails = (batch) => {
    setSelectedBatch(batch);
    setViewDetailsOpen(true);
  };

  // Handle clear filters
  const handleClearFilters = () => {
    setFilters({
      status: '',
      center: '',
      jobRole: ''
    });
    setDateRange(undefined);
    setSearchTerm('');
    setFilterOpen(false);
  };

  return (
    <MainLayout role="admin">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Batch Management</h1>
            <p className="text-muted-foreground">
              Create and manage training batches across centers.
            </p>
          </div>
          <Button className="gap-2" onClick={() => setCreateBatchOpen(true)}>
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
                  <Input 
                    className="pl-8 w-full md:w-[250px]" 
                    placeholder="Search batches..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="flex gap-2">
                  <Popover open={filterOpen} onOpenChange={setFilterOpen}>
                    <PopoverTrigger asChild>
                      <Button variant="outline" size="sm" className="h-10 gap-1">
                        <Filter className="h-3.5 w-3.5" />
                        Filter
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80 p-4">
                      <div className="space-y-4">
                        <h4 className="font-medium text-sm">Filter Batches</h4>
                        
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Status</label>
                          <select 
                            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                            value={filters.status}
                            onChange={(e) => setFilters({...filters, status: e.target.value})}
                          >
                            <option value="">All Statuses</option>
                            <option value="active">Active</option>
                            <option value="completed">Completed</option>
                            <option value="upcoming">Upcoming</option>
                          </select>
                        </div>
                        
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Center</label>
                          <select 
                            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                            value={filters.center}
                            onChange={(e) => setFilters({...filters, center: e.target.value})}
                          >
                            <option value="">All Centers</option>
                            {centers.map(center => (
                              <option key={center} value={center}>{center}</option>
                            ))}
                          </select>
                        </div>
                        
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Job Role</label>
                          <select 
                            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                            value={filters.jobRole}
                            onChange={(e) => setFilters({...filters, jobRole: e.target.value})}
                          >
                            <option value="">All Job Roles</option>
                            {jobRoles.map(role => (
                              <option key={role} value={role}>{role}</option>
                            ))}
                          </select>
                        </div>
                        
                        <div className="pt-2 flex justify-between">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={handleClearFilters}
                          >
                            Reset
                          </Button>
                          <Button 
                            size="sm" 
                            onClick={() => setFilterOpen(false)}
                          >
                            Apply Filters
                          </Button>
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>
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
                {filteredBatches.map((batch) => (
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
                      <Badge variant={batch.status === "active" ? "default" : 
                        batch.status === "completed" ? "secondary" : "outline"}>
                        {batch.status.charAt(0).toUpperCase() + batch.status.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-1">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-7 w-7"
                          onClick={() => handleEditBatch(batch)}
                        >
                          <Edit className="h-3.5 w-3.5" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-7 w-7"
                          onClick={() => handleAddStudents(batch)}
                        >
                          <UserPlus className="h-3.5 w-3.5" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-7 w-7"
                          onClick={() => handleViewDetails(batch)}
                        >
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

      {/* Create Batch Form Dialog */}
      <BatchForm 
        open={createBatchOpen} 
        onOpenChange={setCreateBatchOpen}
        onSubmit={handleBatchCreation}
      />

      {/* Edit Batch Sheet */}
      <Sheet open={editBatchOpen} onOpenChange={setEditBatchOpen}>
        <SheetContent className="sm:max-w-md">
          <SheetHeader>
            <SheetTitle>Edit Batch</SheetTitle>
            <SheetDescription>
              Update details for {selectedBatch?.name}
            </SheetDescription>
          </SheetHeader>
          <div className="py-6">
            {selectedBatch && (
              <BatchForm
                open={true}
                onOpenChange={() => setEditBatchOpen(false)}
                initialData={selectedBatch}
                isEditing={true}
                onSubmit={(data) => {
                  // Update batch in the batches list with proper date formatting
                  const updatedBatches = batches.map(batch => 
                    batch.id === selectedBatch.id ? {
                      ...batch,
                      name: data.name,
                      jobRole: data.jobRole,
                      center: data.center,
                      trainer: data.trainer,
                      startDate: format(data.startDate, 'yyyy-MM-dd'),
                      endDate: format(data.endDate, 'yyyy-MM-dd'),
                      maxStrength: data.maxStrength
                    } : batch
                  );
                  
                  setBatches(updatedBatches);
                  setEditBatchOpen(false);
                  toast({
                    title: "Batch Updated",
                    description: `${data.name} has been successfully updated.`,
                  });
                }}
              />
            )}
          </div>
        </SheetContent>
      </Sheet>

      {/* Add Students Sheet */}
      <Sheet open={addStudentsOpen} onOpenChange={setAddStudentsOpen}>
        <SheetContent className="sm:max-w-md">
          <SheetHeader>
            <SheetTitle>Add Students to Batch</SheetTitle>
            <SheetDescription>
              Select students to add to {selectedBatch?.name}
            </SheetDescription>
          </SheetHeader>
          <div className="py-6">
            {selectedBatch && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <h3 className="text-sm font-medium">Batch Information</h3>
                  <div className="grid grid-cols-2 gap-4 bg-muted/50 p-3 rounded-md">
                    <div>
                      <div className="text-xs text-muted-foreground">Batch ID</div>
                      <div className="font-medium">{selectedBatch.id}</div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">Current Strength</div>
                      <div className="font-medium">{selectedBatch.strength}/{selectedBatch.maxStrength}</div>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <h3 className="text-sm font-medium">Available Students</h3>
                    <Input 
                      placeholder="Search students..." 
                      className="max-w-[200px]" 
                    />
                  </div>

                  <div className="border rounded-md max-h-[300px] overflow-y-auto">
                    {/* Dummy student data for demonstration */}
                    {[1, 2, 3, 4, 5].map(i => (
                      <div key={i} className="flex items-center justify-between p-3 border-b last:border-0">
                        <div>
                          <div className="font-medium">Student {i}</div>
                          <div className="text-xs text-muted-foreground">ID: STU00{i}</div>
                        </div>
                        <Button size="sm" variant="outline">
                          Add
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setAddStudentsOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={() => {
                    setAddStudentsOpen(false);
                    toast({
                      title: "Students Added",
                      description: "Selected students have been added to the batch.",
                    });
                  }}>
                    Save Changes
                  </Button>
                </div>
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>

      {/* View Details Sheet */}
      <Sheet open={viewDetailsOpen} onOpenChange={setViewDetailsOpen}>
        <SheetContent className="sm:max-w-xl">
          <SheetHeader>
            <SheetTitle>Batch Details</SheetTitle>
            <SheetDescription>
              Detailed information about {selectedBatch?.name}
            </SheetDescription>
          </SheetHeader>
          <div className="py-6">
            {selectedBatch && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <h3 className="text-sm font-medium">Basic Information</h3>
                    <div className="space-y-2">
                      <div>
                        <div className="text-xs text-muted-foreground">Batch ID</div>
                        <div className="font-medium">{selectedBatch.id}</div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground">Batch Name</div>
                        <div className="font-medium">{selectedBatch.name}</div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground">Job Role</div>
                        <div className="font-medium">{selectedBatch.jobRole}</div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground">Status</div>
                        <div>
                          <Badge variant={selectedBatch.status === "active" ? "default" : 
                            selectedBatch.status === "completed" ? "secondary" : "outline"}>
                            {selectedBatch.status.charAt(0).toUpperCase() + selectedBatch.status.slice(1)}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <h3 className="text-sm font-medium">Location & Trainer</h3>
                    <div className="space-y-2">
                      <div>
                        <div className="text-xs text-muted-foreground">Training Center</div>
                        <div className="font-medium">{selectedBatch.center}</div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground">Trainer</div>
                        <div className="font-medium">{selectedBatch.trainer}</div>
                      </div>
                      <div>
                        <div className="text-xs text-muted-foreground">Duration</div>
                        <div className="font-medium">
                          {format(new Date(selectedBatch.startDate), 'dd MMM yyyy')} - {format(new Date(selectedBatch.endDate), 'dd MMM yyyy')}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <h3 className="text-sm font-medium">Progress & Strength</h3>
                  <div className="bg-muted/50 p-4 rounded-md">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Training Progress</span>
                      <span className="text-sm">{selectedBatch.progress}%</span>
                    </div>
                    <Progress value={selectedBatch.progress} className="h-2 mb-4" />
                    
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">Batch Enrollment</span>
                      <span className="text-sm">{selectedBatch.strength}/{selectedBatch.maxStrength}</span>
                    </div>
                    <Progress 
                      value={(selectedBatch.strength / selectedBatch.maxStrength) * 100} 
                      className="h-2" 
                    />
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <h3 className="text-sm font-medium">Enrolled Students ({selectedBatch.strength})</h3>
                    <Button variant="outline" size="sm" className="h-8">
                      <FileText className="h-3.5 w-3.5 mr-2" />
                      Export List
                    </Button>
                  </div>
                  
                  <div className="border rounded-md max-h-[200px] overflow-y-auto">
                    {/* Dummy student list for demonstration */}
                    {Array.from({ length: selectedBatch.strength }, (_, i) => (
                      <div key={i} className="flex items-center justify-between p-3 border-b last:border-0">
                        <div>
                          <div className="font-medium">Student Name {i + 1}</div>
                          <div className="text-xs text-muted-foreground">ID: STU00{i + 1}</div>
                        </div>
                        <Badge variant={i % 2 === 0 ? "default" : "secondary"}>
                          {i % 2 === 0 ? "Active" : "On Leave"}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </MainLayout>
  );
};

export default BatchManagement;
