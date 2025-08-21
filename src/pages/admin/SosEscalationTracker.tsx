import React, { useState, useEffect } from 'react';
import { MainLayout } from '@/layouts/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, UserPlus, Flag, ArrowUpRight, MoreHorizontal, Calendar, Filter, Download, FileText } from 'lucide-react';
import { DataTable, Column } from '@/components/common/DataTable';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { EnhancedFilterBar } from '@/components/common/EnhancedFilterBar';

type SosCase = {
  id: string;
  candidate: string;
  category: string;
  center: string;
  dateRaised: string;
  assignedTo: string;
  priority: 'high' | 'medium' | 'low';
  status: 'open' | 'inprogress' | 'escalated' | 'resolved';
  description?: string;
};

type SosMetrics = {
  total: number;
  open: number;
  inprogress: number;
  escalated: number;
  resolved: number;
  avgResolutionTime: string;
};

const SosEscalationTracker = () => {
  // State management
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredCases, setFilteredCases] = useState<SosCase[]>([]);
  const [activeTab, setActiveTab] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCase, setSelectedCase] = useState<SosCase | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [exportDialogOpen, setExportDialogOpen] = useState(false);
  const { toast } = useToast();

  // Dummy data for SOS cases
  const sosCases: SosCase[] = [
    { 
      id: 'SOS001', 
      candidate: 'Rahul Sharma', 
      category: 'Payment Delay', 
      center: 'Delhi Center',
      dateRaised: '2023-11-05',
      assignedTo: 'Ankit Gupta',
      priority: 'high',
      status: 'open',
      description: 'Candidate has not received stipend for the last month. Multiple follow-ups done with the finance team.'
    },
    { 
      id: 'SOS002', 
      candidate: 'Priya Patel', 
      category: 'Hostel Issue', 
      center: 'Mumbai Center',
      dateRaised: '2023-11-03',
      assignedTo: 'Neha Singh',
      priority: 'medium',
      status: 'inprogress',
      description: 'Poor living conditions in the hostel. Water leakage reported in room 204.'
    },
    { 
      id: 'SOS003', 
      candidate: 'Amit Kumar', 
      category: 'Document Loss', 
      center: 'Bangalore Center',
      dateRaised: '2023-11-01',
      assignedTo: 'Rajesh Kumar',
      priority: 'low',
      status: 'inprogress',
      description: 'Lost original ID proof documents during travel. Needs help getting duplicates.'
    },
    { 
      id: 'SOS004', 
      candidate: 'Sneha Singh', 
      category: 'Travel Issues', 
      center: 'Pune Center',
      dateRaised: '2023-10-28',
      assignedTo: 'Sanjay Patel',
      priority: 'high',
      status: 'escalated',
      description: 'No transport available from remote village to training center. Distance is 25km.'
    },
    { 
      id: 'SOS005', 
      candidate: 'Vikram Reddy', 
      category: 'Placement Complaint', 
      center: 'Chennai Center',
      dateRaised: '2023-10-25',
      assignedTo: 'Lakshmi N',
      priority: 'medium',
      status: 'resolved',
      description: 'Offered salary is lower than what was promised during training. Difference is 2000 INR.'
    },
    { 
      id: 'SOS006', 
      candidate: 'Anjali Verma', 
      category: 'Harassment Complaint', 
      center: 'Delhi Center',
      dateRaised: '2023-10-22',
      assignedTo: 'Unassigned',
      priority: 'high',
      status: 'open',
      description: 'Reported verbal harassment by a co-trainee. Requires immediate counseling session.'
    },
    { 
      id: 'SOS007', 
      candidate: 'Karthik Nair', 
      category: 'Training Quality', 
      center: 'Hyderabad Center',
      dateRaised: '2023-10-18',
      assignedTo: 'Ravi Kumar',
      priority: 'medium',
      status: 'resolved',
      description: 'Complaint about outdated training material not matching current industry standards.'
    },
  ];

  // Dummy SOS metrics
  const sosMetrics: SosMetrics = {
    total: 42,
    open: 15,
    inprogress: 18,
    escalated: 5,
    resolved: 47,
    avgResolutionTime: '2.3 days'
  };

  // Filter options for filter bar
  const filterOptions = [
    {
      id: 'priority',
      label: 'Priority',
      type: 'select' as const,
      options: [
        { value: 'high', label: 'High' },
        { value: 'medium', label: 'Medium' },
        { value: 'low', label: 'Low' }
      ]
    },
    {
      id: 'center',
      label: 'Center',
      type: 'select' as const,
      options: [
        { value: 'Delhi Center', label: 'Delhi Center' },
        { value: 'Mumbai Center', label: 'Mumbai Center' },
        { value: 'Bangalore Center', label: 'Bangalore Center' },
        { value: 'Pune Center', label: 'Pune Center' },
        { value: 'Chennai Center', label: 'Chennai Center' },
        { value: 'Hyderabad Center', label: 'Hyderabad Center' }
      ]
    },
    {
      id: 'dateRange',
      label: 'Date Range',
      type: 'date-range' as const
    }
  ];

  // Define columns for the data table
  const columns: Column<SosCase>[] = [
    {
      id: 'id',
      header: 'Case ID',
      cell: (row) => <span className="font-mono">{row.id}</span>,
    },
    {
      id: 'candidate',
      header: 'Candidate',
      cell: (row) => <span className="font-medium">{row.candidate}</span>,
    },
    {
      id: 'category',
      header: 'Category',
      cell: (row) => <span>{row.category}</span>,
    },
    {
      id: 'center',
      header: 'Center',
      cell: (row) => <span>{row.center}</span>,
    },
    {
      id: 'dateRaised',
      header: 'Date Raised',
      cell: (row) => <span>{row.dateRaised}</span>,
    },
    {
      id: 'assignedTo',
      header: 'Assigned To',
      cell: (row) => <span>{row.assignedTo}</span>,
    },
    {
      id: 'priority',
      header: 'Priority',
      cell: (row) => (
        <Badge variant={
          row.priority === 'high' ? "destructive" : 
          row.priority === 'medium' ? "default" : "secondary"
        }>
          {row.priority}
        </Badge>
      ),
    },
    {
      id: 'status',
      header: 'Status',
      cell: (row) => (
        <Badge variant={
          row.status === 'open' ? "outline" : 
          row.status === 'inprogress' ? "default" : 
          row.status === 'escalated' ? "destructive" : "secondary"
        }>
          {row.status === 'inprogress' ? 'In Progress' : 
           row.status.charAt(0).toUpperCase() + row.status.slice(1)}
        </Badge>
      ),
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: (row) => (
        <div className="flex space-x-1">
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8" 
            onClick={() => handleAssign(row)}
            title="Assign"
          >
            <UserPlus className="h-3.5 w-3.5" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8" 
            onClick={() => handleEscalate(row)}
            title="Escalate"
          >
            <Flag className="h-3.5 w-3.5" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8" 
            onClick={() => handleViewDetails(row)}
            title="View Details"
          >
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Button>
        </div>
      ),
    },
  ];

  // Handle search input
  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  // Filter cases based on search query and active tab
  useEffect(() => {
    let filtered = [...sosCases];
    
    if (searchQuery) {
      filtered = filtered.filter(
        (sosCase) =>
          sosCase.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
          sosCase.candidate.toLowerCase().includes(searchQuery.toLowerCase()) ||
          sosCase.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
          sosCase.center.toLowerCase().includes(searchQuery.toLowerCase()) ||
          sosCase.assignedTo.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    if (activeTab !== 'all') {
      filtered = filtered.filter((sosCase) => sosCase.status === activeTab);
    }
    
    setFilteredCases(filtered);
  }, [searchQuery, activeTab, sosCases]);

  // Handle tab change
  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  // Handle assign button click
  const handleAssign = (sosCase: SosCase) => {
    setSelectedCase(sosCase);
    setAssignDialogOpen(true);
  };

  // Handle escalate button click
  const handleEscalate = (sosCase: SosCase) => {
    toast({
      title: "Case Escalated",
      description: `Case ${sosCase.id} has been escalated to the management team.`,
    });
  };

  // Handle view details button click
  const handleViewDetails = (sosCase: SosCase) => {
    setSelectedCase(sosCase);
    setDetailsOpen(true);
  };

  // Handle assign case submission
  const handleAssignSubmit = () => {
    setAssignDialogOpen(false);
    toast({
      title: "Case Assigned",
      description: `Case ${selectedCase?.id} has been assigned successfully.`,
    });
  };

  // Handle export
  const handleExport = () => {
    setExportDialogOpen(true);
  };

  // Handle export submission
  const handleExportSubmit = (format: string) => {
    setExportDialogOpen(false);
    toast({
      title: "Export Started",
      description: `Exporting SOS cases in ${format} format. The file will be available shortly.`,
    });
  };

  // Handle advanced filter changes
  const handleFilterChange = (filterId: string, value: any) => {
    console.log(`Filter changed: ${filterId} = ${JSON.stringify(value)}`);
    // In a real app, you would filter the data based on these filters
    toast({
      title: "Filters Applied",
      description: "The data has been filtered according to your criteria.",
    });
  };

  return (
    <MainLayout role="admin">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">SOS & Escalation Tracker</h1>
            <p className="text-muted-foreground">
              Track and manage candidate issues and escalations.
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2" onClick={handleExport}>
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

        {showFilters && (
          <EnhancedFilterBar 
            filters={filterOptions}
            onFilterChange={handleFilterChange}
            actions={
              <Button 
                variant="outline" 
                onClick={() => setShowFilters(false)}
              >
                Hide Filters
              </Button>
            }
          />
        )}

        <Tabs defaultValue="all" value={activeTab} onValueChange={handleTabChange} className="w-full">
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
                <Input 
                  className="pl-8 w-full" 
                  placeholder="Search cases..." 
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                />
              </div>
              <Button 
                variant="outline" 
                className="gap-2"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="h-4 w-4" />
                {showFilters ? "Hide Filters" : "Show Filters"}
              </Button>
            </div>
            
            <Card>
              <CardContent className="p-0">
                <DataTable 
                  columns={columns} 
                  data={filteredCases}
                />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="open" className="pt-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
              <div className="relative sm:max-w-xs flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input 
                  className="pl-8 w-full" 
                  placeholder="Search open cases..." 
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                />
              </div>
              <Button 
                variant="outline" 
                className="gap-2"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="h-4 w-4" />
                {showFilters ? "Hide Filters" : "Show Filters"}
              </Button>
            </div>
            <Card>
              <CardContent className="p-0">
                <DataTable 
                  columns={columns} 
                  data={filteredCases}
                />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="inprogress" className="pt-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
              <div className="relative sm:max-w-xs flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input 
                  className="pl-8 w-full" 
                  placeholder="Search in-progress cases..." 
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                />
              </div>
              <Button 
                variant="outline" 
                className="gap-2"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="h-4 w-4" />
                {showFilters ? "Hide Filters" : "Show Filters"}
              </Button>
            </div>
            <Card>
              <CardContent className="p-0">
                <DataTable 
                  columns={columns} 
                  data={filteredCases}
                />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="escalated" className="pt-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
              <div className="relative sm:max-w-xs flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input 
                  className="pl-8 w-full" 
                  placeholder="Search escalated cases..." 
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                />
              </div>
              <Button 
                variant="outline" 
                className="gap-2"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="h-4 w-4" />
                {showFilters ? "Hide Filters" : "Show Filters"}
              </Button>
            </div>
            <Card>
              <CardContent className="p-0">
                <DataTable 
                  columns={columns} 
                  data={filteredCases}
                />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="resolved" className="pt-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
              <div className="relative sm:max-w-xs flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input 
                  className="pl-8 w-full" 
                  placeholder="Search resolved cases..." 
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                />
              </div>
              <Button 
                variant="outline" 
                className="gap-2"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter className="h-4 w-4" />
                {showFilters ? "Hide Filters" : "Show Filters"}
              </Button>
            </div>
            <Card>
              <CardContent className="p-0">
                <DataTable 
                  columns={columns} 
                  data={filteredCases}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Case Details Dialog */}
        <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>SOS Case Details - {selectedCase?.id}</DialogTitle>
              <DialogDescription>
                View complete information about this SOS case.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="text-sm font-medium">Candidate:</span>
                <span className="col-span-3">{selectedCase?.candidate}</span>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="text-sm font-medium">Category:</span>
                <span className="col-span-3">{selectedCase?.category}</span>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="text-sm font-medium">Center:</span>
                <span className="col-span-3">{selectedCase?.center}</span>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="text-sm font-medium">Date Raised:</span>
                <span className="col-span-3">{selectedCase?.dateRaised}</span>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="text-sm font-medium">Assigned To:</span>
                <span className="col-span-3">{selectedCase?.assignedTo}</span>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="text-sm font-medium">Priority:</span>
                <span className="col-span-3">
                  <Badge variant={
                    selectedCase?.priority === 'high' ? "destructive" : 
                    selectedCase?.priority === 'medium' ? "default" : "secondary"
                  }>
                    {selectedCase?.priority}
                  </Badge>
                </span>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="text-sm font-medium">Status:</span>
                <span className="col-span-3">
                  <Badge variant={
                    selectedCase?.status === 'open' ? "outline" : 
                    selectedCase?.status === 'inprogress' ? "default" : 
                    selectedCase?.status === 'escalated' ? "destructive" : "secondary"
                  }>
                    {selectedCase?.status === 'inprogress' ? 'In Progress' : 
                    selectedCase?.status && selectedCase.status.charAt(0).toUpperCase() + selectedCase.status.slice(1)}
                  </Badge>
                </span>
              </div>
              <div className="grid grid-cols-4 gap-4">
                <span className="text-sm font-medium">Description:</span>
                <p className="col-span-3">{selectedCase?.description}</p>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDetailsOpen(false)}>Close</Button>
              <Button onClick={() => handleAssign(selectedCase as SosCase)}>Assign Case</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Assign Case Dialog */}
        <Dialog open={assignDialogOpen} onOpenChange={setAssignDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Assign Case - {selectedCase?.id}</DialogTitle>
              <DialogDescription>
                Assign this case to team member for resolution.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="text-sm font-medium">Case:</span>
                <span className="col-span-3">{selectedCase?.id} - {selectedCase?.category}</span>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="text-sm font-medium">Assign To:</span>
                <select className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                  <option value="">Select team member</option>
                  <option value="ankit">Ankit Gupta</option>
                  <option value="neha">Neha Singh</option>
                  <option value="rajesh">Rajesh Kumar</option>
                  <option value="sanjay">Sanjay Patel</option>
                  <option value="lakshmi">Lakshmi N</option>
                </select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="text-sm font-medium">Priority:</span>
                <select className="col-span-3 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="text-sm font-medium">Notes:</span>
                <textarea className="col-span-3 flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"></textarea>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setAssignDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleAssignSubmit}>Assign Case</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Export Dialog */}
        <Dialog open={exportDialogOpen} onOpenChange={setExportDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Export SOS Cases</DialogTitle>
              <DialogDescription>
                Choose format and options for exporting case data.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="text-sm font-medium">Format:</span>
                <div className="col-span-3 flex space-x-2">
                  <Button variant="outline" onClick={() => handleExportSubmit('Excel')} className="flex items-center gap-2">
                    <FileText className="h-4 w-4" /> Excel
                  </Button>
                  <Button variant="outline" onClick={() => handleExportSubmit('CSV')} className="flex items-center gap-2">
                    <FileText className="h-4 w-4" /> CSV
                  </Button>
                  <Button variant="outline" onClick={() => handleExportSubmit('PDF')} className="flex items-center gap-2">
                    <FileText className="h-4 w-4" /> PDF
                  </Button>
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="text-sm font-medium">Date Range:</span>
                <div className="col-span-3 flex items-center space-x-2">
                  <Button variant="outline" size="sm" className="gap-2">
                    <Calendar className="h-4 w-4" />
                    Start Date
                  </Button>
                  <span>to</span>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Calendar className="h-4 w-4" />
                    End Date
                  </Button>
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <span className="text-sm font-medium">Include:</span>
                <div className="col-span-3 flex flex-col space-y-2">
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" defaultChecked className="rounded border-gray-300" />
                    <span>Case Details</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" defaultChecked className="rounded border-gray-300" />
                    <span>Resolution History</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" defaultChecked className="rounded border-gray-300" />
                    <span>Assignment History</span>
                  </label>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setExportDialogOpen(false)}>Cancel</Button>
              <Button onClick={() => handleExportSubmit('Excel')}>Export</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  );
};

export default SosEscalationTracker;
