import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Briefcase, Building, Users, Calendar, Phone, Mail, MapPin, FileText, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import LocalCompanyForm from '@/components/forms/LocalCompanyForm';

const PlacementCoordination = () => {
  const [selectedBatch, setSelectedBatch] = useState('all');
  const [isCompanyModalOpen, setIsCompanyModalOpen] = useState(false);
  const [isAddCompanyModalOpen, setIsAddCompanyModalOpen] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState<any>(null);
  const { toast } = useToast();

  // Mock data for local placement candidates (willing for local placement)
  const localPlacementCandidates = [
    {
      id: 'C-001',
      name: 'Ravi Kumar',
      batch: 'DDU-GKY-B5',
      course: 'Data Entry Operator',
      status: 'placed',
      company: 'Tech Solutions Pvt Ltd',
      salary: '15000',
      joinDate: '2024-02-01',
      location: 'Local - Noida',
      phone: '+91-9876543210',
      willingForLocal: true
    },
    {
      id: 'C-002',
      name: 'Priya Sharma',
      batch: 'DDU-GKY-B6',
      course: 'Computer Hardware',
      status: 'interview_scheduled',
      company: 'Hardware Plus',
      salary: '18000',
      joinDate: '2024-02-05',
      location: 'Local - Gurgaon',
      phone: '+91-9876543211',
      willingForLocal: true
    },
    {
      id: 'C-003',
      name: 'Amit Singh',
      batch: 'DDU-GKY-B5',
      course: 'Data Entry Operator',
      status: 'ready',
      company: '',
      salary: '',
      joinDate: '',
      location: '',
      phone: '+91-9876543212',
      willingForLocal: true
    },
    {
      id: 'C-004',
      name: 'Sunita Devi',
      batch: 'DDU-GKY-B6',
      course: 'Retail Sales Associate',
      status: 'ready',
      company: '',
      salary: '',
      joinDate: '',
      location: '',
      phone: '+91-9876543213',
      willingForLocal: true
    },
    {
      id: 'C-005',
      name: 'Rajesh Yadav',
      batch: 'DDU-GKY-B7',
      course: 'Computer Hardware',
      status: 'ready',
      company: '',
      salary: '',
      joinDate: '',
      location: '',
      phone: '+91-9876543214',
      willingForLocal: true
    }
  ];

  // Mock data for local companies added by center manager
  const localCompanies = [
    {
      id: 'LC-001',
      name: 'Tech Solutions Pvt Ltd',
      industry: 'IT Services',
      location: 'Noida (Local)',
      contact: 'Mr. Sharma',
      phone: '+91-9876543210',
      email: 'hr@techsolutions.com',
      openings: 25,
      skills: ['Data Entry', 'Computer Basics'],
      salary: '15000-20000',
      jobRoles: 'Data Entry Operator, Computer Operator',
      workingHours: '9 AM - 6 PM',
      addedBy: 'Center Manager',
      dateAdded: '2024-01-15'
    },
    {
      id: 'LC-002',
      name: 'Hardware Plus',
      industry: 'Computer Hardware',
      location: 'Gurgaon (Local)',
      contact: 'Ms. Priya',
      phone: '+91-9876543211',
      email: 'careers@hardwareplus.com',
      openings: 15,
      skills: ['Hardware Repair', 'Troubleshooting'],
      salary: '18000-25000',
      jobRoles: 'Hardware Technician, Support Executive',
      workingHours: '10 AM - 7 PM',
      addedBy: 'Center Manager',
      dateAdded: '2024-01-20'
    },
    {
      id: 'LC-003',
      name: 'Local Retail Store',
      industry: 'Retail',
      location: 'Delhi (Local)',
      contact: 'Mr. Gupta',
      phone: '+91-9876543212',
      email: 'hr@localretail.com',
      openings: 10,
      skills: ['Customer Service', 'Sales'],
      salary: '12000-18000',
      jobRoles: 'Sales Associate, Customer Service Executive',
      workingHours: '10 AM - 8 PM',
      addedBy: 'Center Manager',
      dateAdded: '2024-01-25'
    }
  ];

  const batches = [
    { id: 'all', name: 'All Batches' },
    { id: 'DDU-GKY-B5', name: 'DDU-GKY Batch 5' },
    { id: 'DDU-GKY-B6', name: 'DDU-GKY Batch 6' },
    { id: 'DDU-GKY-B7', name: 'DDU-GKY Batch 7' },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'placed':
        return <Badge className="bg-green-100 text-green-800">Placed</Badge>;
      case 'interview_scheduled':
        return <Badge className="bg-blue-100 text-blue-800">Interview Scheduled</Badge>;
      case 'ready':
        return <Badge className="bg-yellow-100 text-yellow-800">Ready for Placement</Badge>;
      case 'in_process':
        return <Badge className="bg-purple-100 text-purple-800">In Process</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const handleCandidateAction = (candidate: any, action: string) => {
    toast({
      title: "Action Completed",
      description: `${action} has been updated for ${candidate.name}.`,
    });
  };

  const filteredData = selectedBatch === 'all' 
    ? localPlacementCandidates 
    : localPlacementCandidates.filter(candidate => candidate.batch === selectedBatch);

  return (
    <div className="space-y-6">
      {/* Header & Filters */}
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Local Placement Coordination</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage candidates willing for local placement and add local companies in your state
          </p>
        </div>
        
        <div className="flex gap-3">
          <Select value={selectedBatch} onValueChange={setSelectedBatch}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by Batch" />
            </SelectTrigger>
            <SelectContent>
              {batches.map((batch) => (
                <SelectItem key={batch.id} value={batch.id}>
                  {batch.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Button onClick={() => setIsAddCompanyModalOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Local Company
          </Button>
        </div>
      </div>

      <Tabs defaultValue="candidates" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="candidates">Local Candidates</TabsTrigger>
          <TabsTrigger value="companies">Local Companies</TabsTrigger>
          <TabsTrigger value="pipeline">Placement Pipeline</TabsTrigger>
        </TabsList>

        {/* Candidate Status Tab */}
        <TabsContent value="candidates">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                Candidates Willing for Local Placement
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Candidates who have opted for local placement through the mobile app
              </p>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Candidate Name</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Batch</TableHead>
                    <TableHead>Course</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Local Company</TableHead>
                    <TableHead>Salary</TableHead>
                    <TableHead>Join Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredData.map((candidate) => (
                    <TableRow key={candidate.id}>
                      <TableCell className="font-medium">{candidate.name}</TableCell>
                      <TableCell>{candidate.phone}</TableCell>
                      <TableCell>{candidate.batch}</TableCell>
                      <TableCell>{candidate.course}</TableCell>
                      <TableCell>{getStatusBadge(candidate.status)}</TableCell>
                      <TableCell>{candidate.company || '-'}</TableCell>
                      <TableCell>{candidate.salary ? `₹${candidate.salary}` : '-'}</TableCell>
                      <TableCell>{candidate.joinDate || '-'}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => {
                              setSelectedCandidate(candidate);
                              setIsCompanyModalOpen(true);
                            }}
                          >
                            Assign
                          </Button>
                          <Button variant="outline" size="sm">
                            Contact
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

        {/* Company Partners Tab */}
        <TabsContent value="companies">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5" />
                Local Companies in Your State
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Companies you have added for local placement opportunities
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {localCompanies.map((company) => (
                  <Card key={company.id} className="border">
                    <CardHeader>
                      <CardTitle className="text-lg">{company.name}</CardTitle>
                      <div className="flex gap-2">
                        <Badge variant="outline">{company.industry}</Badge>
                        <Badge variant="secondary">Local</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="h-4 w-4" />
                        {company.location}
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="h-4 w-4" />
                        {company.phone}
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="h-4 w-4" />
                        {company.email}
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Briefcase className="h-4 w-4" />
                        {company.openings} openings
                      </div>
                      <div className="text-sm">
                        <strong>Job Roles:</strong> {company.jobRoles}
                      </div>
                      <div className="text-sm">
                        <strong>Working Hours:</strong> {company.workingHours}
                      </div>
                      <div className="text-sm">
                        <strong>Salary:</strong> ₹{company.salary}
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {company.skills.map((skill, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="flex-1">
                          Contact
                        </Button>
                        <Button variant="outline" size="sm" className="flex-1">
                          Edit
                        </Button>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Added on {company.dateAdded}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Placement Pipeline Tab */}
        <TabsContent value="pipeline">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Ready for Local Placement</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-yellow-600">
                  {localPlacementCandidates.filter(c => c.status === 'ready').length}
                </div>
                <p className="text-sm text-muted-foreground">Local Candidates</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Interview Scheduled</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-600">
                  {localPlacementCandidates.filter(c => c.status === 'interview_scheduled').length}
                </div>
                <p className="text-sm text-muted-foreground">Local Candidates</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Locally Placed</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">
                  {localPlacementCandidates.filter(c => c.status === 'placed').length}
                </div>
                <p className="text-sm text-muted-foreground">Local Candidates</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Local Companies</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-purple-600">
                  {localCompanies.length}
                </div>
                <p className="text-sm text-muted-foreground">Added Companies</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Company Assignment Modal */}
      <Dialog open={isCompanyModalOpen} onOpenChange={setIsCompanyModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign Company to {selectedCandidate?.name}</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Select Company</label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a company" />
                </SelectTrigger>
                <SelectContent>
                  {localCompanies.map((company) => (
                    <SelectItem key={company.id} value={company.id}>
                      {company.name} - {company.location}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Expected Salary</label>
              <Input placeholder="Enter salary amount" />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Interview Date</label>
              <Input type="date" />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Notes</label>
              <Textarea placeholder="Add any notes or comments..." rows={3} />
            </div>
            
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setIsCompanyModalOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => {
                handleCandidateAction(selectedCandidate, 'Company Assignment');
                setIsCompanyModalOpen(false);
              }}>
                Assign Company
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Local Company Modal */}
      <LocalCompanyForm 
        open={isAddCompanyModalOpen} 
        onOpenChange={setIsAddCompanyModalOpen} 
      />
    </div>
  );
};

export default PlacementCoordination;