import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar, Users, Plus, FileDown, Eye } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const EnrollmentBatch = () => {
  const [selectedBatch, setSelectedBatch] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [isBatchRosterOpen, setIsBatchRosterOpen] = useState(false);
  const [selectedCandidates, setSelectedCandidates] = useState<string[]>([]);

  // Mock data for pending enrollments
  const pendingEnrollments = [
    { id: 'M-001', name: 'Ravi Kumar', mobilisationId: 'MOB-2024-001', course: 'Data Entry Operator', status: 'pending', batch: null },
    { id: 'M-002', name: 'Priya Sharma', mobilisationId: 'MOB-2024-002', course: 'Computer Hardware', status: 'pending', batch: null },
    { id: 'M-003', name: 'Amit Singh', mobilisationId: 'MOB-2024-003', course: 'Data Entry Operator', status: 'assigned', batch: 'DDU-GKY-B5' },
    { id: 'M-004', name: 'Sunita Devi', mobilisationId: 'MOB-2024-004', course: 'Tailoring', status: 'pending', batch: null },
  ];

  // Mock data for batches
  const batches = [
    { 
      id: 'DDU-GKY-B5', 
      name: 'DDU-GKY Batch 5', 
      course: 'Data Entry Operator',
      startDate: '2024-01-15',
      capacity: 30,
      enrolled: 28,
      status: 'active'
    },
    { 
      id: 'DDU-GKY-B6', 
      name: 'DDU-GKY Batch 6', 
      course: 'Computer Hardware',
      startDate: '2024-02-01',
      capacity: 25,
      enrolled: 22,
      status: 'active'
    },
    { 
      id: 'DDU-GKY-B7', 
      name: 'DDU-GKY Batch 7', 
      course: 'Tailoring',
      startDate: '2024-02-15',
      capacity: 20,
      enrolled: 18,
      status: 'upcoming'
    },
  ];

  // Mock roster data
  const rosterData = [
    { id: 'C-001', name: 'Ravi Kumar', mobilisationId: 'MOB-2024-001', status: 'active', attendance: 95 },
    { id: 'C-002', name: 'Priya Sharma', mobilisationId: 'MOB-2024-002', status: 'active', attendance: 88 },
    { id: 'C-003', name: 'Amit Singh', mobilisationId: 'MOB-2024-003', status: 'active', attendance: 92 },
  ];

  const handleCandidateSelect = (candidateId: string, checked: boolean) => {
    if (checked) {
      setSelectedCandidates(prev => [...prev, candidateId]);
    } else {
      setSelectedCandidates(prev => prev.filter(id => id !== candidateId));
    }
  };

  const handleAssignToBatch = () => {
    // Handle batch assignment logic
    setIsAssignModalOpen(false);
    setSelectedCandidates([]);
  };

  return (
    <div className="space-y-6">
        <Tabs defaultValue="calendar" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="calendar">Batch Calendar</TabsTrigger>
            <TabsTrigger value="pending">Pending Enrollments</TabsTrigger>
            <TabsTrigger value="management">Batch Management</TabsTrigger>
          </TabsList>

          {/* Batch Calendar View */}
          <TabsContent value="calendar">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Batch Calendar View
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {batches.map((batch) => (
                    <Card key={batch.id} className="cursor-pointer hover:shadow-md transition-shadow">
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-lg">{batch.name}</CardTitle>
                          <Badge variant={batch.status === 'active' ? 'default' : 'secondary'}>
                            {batch.status}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <p><strong>Course:</strong> {batch.course}</p>
                          <p><strong>Start Date:</strong> {batch.startDate}</p>
                          <p><strong>Enrolled:</strong> {batch.enrolled}/{batch.capacity}</p>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full" 
                              style={{ width: `${(batch.enrolled / batch.capacity) * 100}%` }}
                            ></div>
                          </div>
                          <Dialog open={isBatchRosterOpen} onOpenChange={setIsBatchRosterOpen}>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm" className="w-full mt-2">
                                <Eye className="h-4 w-4 mr-2" />
                                View Roster
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-4xl">
                              <DialogHeader>
                                <DialogTitle>Batch Roster - {batch.name}</DialogTitle>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                  <div>
                                    <p><strong>Course:</strong> {batch.course}</p>
                                    <p><strong>Total Enrolled:</strong> {batch.enrolled} students</p>
                                  </div>
                                  <Button>
                                    <FileDown className="h-4 w-4 mr-2" />
                                    Export Roster
                                  </Button>
                                </div>
                                <Table>
                                  <TableHeader>
                                    <TableRow>
                                      <TableHead>Name</TableHead>
                                      <TableHead>Mobilisation ID</TableHead>
                                      <TableHead>Status</TableHead>
                                      <TableHead>Attendance %</TableHead>
                                    </TableRow>
                                  </TableHeader>
                                  <TableBody>
                                    {rosterData.map((student) => (
                                      <TableRow key={student.id}>
                                        <TableCell>{student.name}</TableCell>
                                        <TableCell>{student.mobilisationId}</TableCell>
                                        <TableCell>
                                          <Badge variant={student.status === 'active' ? 'default' : 'secondary'}>
                                            {student.status}
                                          </Badge>
                                        </TableCell>
                                        <TableCell>{student.attendance}%</TableCell>
                                      </TableRow>
                                    ))}
                                  </TableBody>
                                </Table>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Pending Enrollments */}
          <TabsContent value="pending">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Pending Enrollments
                  </CardTitle>
                  <div className="flex gap-2">
                    <Select value={selectedBatch} onValueChange={setSelectedBatch}>
                      <SelectTrigger className="w-48">
                        <SelectValue placeholder="Filter by Batch" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Batches</SelectItem>
                        {batches.map((batch) => (
                          <SelectItem key={batch.id} value={batch.id}>
                            {batch.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                      <SelectTrigger className="w-48">
                        <SelectValue placeholder="Filter by Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="assigned">Assigned</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-muted-foreground">
                      {selectedCandidates.length} candidate(s) selected
                    </p>
                    <Dialog open={isAssignModalOpen} onOpenChange={setIsAssignModalOpen}>
                      <DialogTrigger asChild>
                        <Button disabled={selectedCandidates.length === 0}>
                          <Plus className="h-4 w-4 mr-2" />
                          Assign to Batch
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Assign Candidates to Batch</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <p>Assigning {selectedCandidates.length} candidate(s) to batch:</p>
                          <Select>
                            <SelectTrigger>
                              <SelectValue placeholder="Select Batch" />
                            </SelectTrigger>
                            <SelectContent>
                              {batches.map((batch) => (
                                <SelectItem key={batch.id} value={batch.id}>
                                  {batch.name} ({batch.capacity - batch.enrolled} slots available)
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <div className="flex justify-end gap-2">
                            <Button variant="outline" onClick={() => setIsAssignModalOpen(false)}>
                              Cancel
                            </Button>
                            <Button onClick={handleAssignToBatch}>
                              Assign
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>

                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-12">
                          <Checkbox />
                        </TableHead>
                        <TableHead>Candidate Name</TableHead>
                        <TableHead>Mobilisation ID</TableHead>
                        <TableHead>Course</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Current Batch</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {pendingEnrollments.map((candidate) => (
                        <TableRow key={candidate.id}>
                          <TableCell>
                            <Checkbox 
                              checked={selectedCandidates.includes(candidate.id)}
                              onCheckedChange={(checked) => 
                                handleCandidateSelect(candidate.id, checked as boolean)
                              }
                            />
                          </TableCell>
                          <TableCell>{candidate.name}</TableCell>
                          <TableCell>{candidate.mobilisationId}</TableCell>
                          <TableCell>{candidate.course}</TableCell>
                          <TableCell>
                            <Badge variant={candidate.status === 'pending' ? 'secondary' : 'default'}>
                              {candidate.status}
                            </Badge>
                          </TableCell>
                          <TableCell>{candidate.batch || 'Not Assigned'}</TableCell>
                          <TableCell>
                            <Button variant="outline" size="sm">
                              View Details
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Batch Management */}
          <TabsContent value="management">
            <Card>
              <CardHeader>
                <CardTitle>Batch Management</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-end">
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Create New Batch
                    </Button>
                  </div>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Batch Name</TableHead>
                        <TableHead>Course</TableHead>
                        <TableHead>Start Date</TableHead>
                        <TableHead>Capacity</TableHead>
                        <TableHead>Enrolled</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {batches.map((batch) => (
                        <TableRow key={batch.id}>
                          <TableCell>{batch.name}</TableCell>
                          <TableCell>{batch.course}</TableCell>
                          <TableCell>{batch.startDate}</TableCell>
                          <TableCell>{batch.capacity}</TableCell>
                          <TableCell>{batch.enrolled}</TableCell>
                          <TableCell>
                            <Badge variant={batch.status === 'active' ? 'default' : 'secondary'}>
                              {batch.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm">
                                Edit
                              </Button>
                              <Button variant="outline" size="sm">
                                <Eye className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
  );
};

export default EnrollmentBatch;