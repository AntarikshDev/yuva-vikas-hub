import React, { useState } from 'react';
import { MainLayout } from '@/layouts/MainLayout';
import { EnhancedFilterBar } from '@/components/common/EnhancedFilterBar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { StatusBadge } from '@/components/common/StatusBadge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Download, Eye, Users, User, Search, Filter } from 'lucide-react';
import { CandidateAttendanceDialog } from '@/components/dialogs/CandidateAttendanceDialog';
import { TrainerScheduleDialog } from '@/components/dialogs/TrainerScheduleDialog';

const Attendance: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [candidateDialogOpen, setCandidateDialogOpen] = useState(false);
  const [trainerDialogOpen, setTrainerDialogOpen] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState<any>(null);
  const [selectedTrainer, setSelectedTrainer] = useState<any>(null);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [showAtRiskOnly, setShowAtRiskOnly] = useState(false);
  
  const filterOptions = [
    {
      id: 'batch',
      label: 'Batch',
      type: 'select' as const,
      options: [
        { value: 'all', label: 'All Batches' },
        { value: 'wd001', label: 'WD001' },
        { value: 'gd002', label: 'GD002' },
        { value: 'dm003', label: 'DM003' },
      ],
    },
    {
      id: 'district',
      label: 'District',
      type: 'select' as const,
      options: [
        { value: 'all', label: 'All Districts' },
        { value: 'mumbai', label: 'Mumbai' },
        { value: 'pune', label: 'Pune' },
        { value: 'nagpur', label: 'Nagpur' },
      ],
    },
    {
      id: 'center',
      label: 'Center',
      type: 'select' as const,
      options: [
        { value: 'all', label: 'All Centers' },
        { value: 'mumbai-central', label: 'Mumbai Central' },
        { value: 'andheri', label: 'Andheri' },
        { value: 'pune-east', label: 'Pune East' },
      ],
    },
    {
      id: 'dateRange',
      label: 'Date Range',
      type: 'date-range' as const,
    },
  ];

  // Sample candidate attendance data
  const candidateAttendanceData = [
    {
      id: 1,
      name: 'John Doe',
      batch: 'WD001',
      center: 'Mumbai Central',
      totalDays: 20,
      presentDays: 18,
      absentDays: 2,
      attendancePercentage: 90,
      lastAttended: '2024-06-17',
      status: 'Active',
    },
    {
      id: 2,
      name: 'Jane Smith',
      batch: 'GD002',
      center: 'Andheri',
      totalDays: 20,
      presentDays: 16,
      absentDays: 4,
      attendancePercentage: 80,
      lastAttended: '2024-06-16',
      status: 'Active',
    },
    {
      id: 3,
      name: 'Alice Johnson',
      batch: 'DM003',
      center: 'Pune East',
      totalDays: 20,
      presentDays: 12,
      absentDays: 8,
      attendancePercentage: 60,
      lastAttended: '2024-06-10',
      status: 'At Risk',
    },
  ];

  // Sample trainer attendance data
  const trainerAttendanceData = [
    {
      id: 1,
      name: 'Rajesh Kumar',
      center: 'Mumbai Central',
      batches: ['WD001', 'GD002'],
      totalDays: 22,
      presentDays: 22,
      absentDays: 0,
      attendancePercentage: 100,
      lastAttended: '2024-06-17',
      status: 'Active',
    },
    {
      id: 2,
      name: 'Priya Sharma',
      center: 'Andheri',
      batches: ['DM003'],
      totalDays: 22,
      presentDays: 20,
      absentDays: 2,
      attendancePercentage: 91,
      lastAttended: '2024-06-17',
      status: 'Active',
    },
    {
      id: 3,
      name: 'Amit Patil',
      center: 'Pune East',
      batches: ['MD004', 'DS005'],
      totalDays: 22,
      presentDays: 19,
      absentDays: 3,
      attendancePercentage: 86,
      lastAttended: '2024-06-15',
      status: 'Active',
    },
  ];

  const candidateColumns = [
    {
      id: 'candidate',
      header: 'Candidate',
      cell: (row: any) => (
        <div>
          <div className="font-medium">{row.name}</div>
          <div className="text-xs text-gray-500">{row.batch} • {row.center}</div>
        </div>
      ),
    },
    {
      id: 'attendance',
      header: 'Attendance',
      cell: (row: any) => (
        <div className="text-center">
          <div className="font-medium">{row.presentDays}/{row.totalDays}</div>
          <div className="text-xs text-gray-500">Present/Total</div>
        </div>
      ),
    },
    {
      id: 'percentage',
      header: 'Attendance %',
      cell: (row: any) => (
        <div className="text-center">
          <div className="font-medium">{row.attendancePercentage}%</div>
          <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
            <div 
              className={`h-1.5 rounded-full ${
                row.attendancePercentage >= 85 ? 'bg-green-500' : 
                row.attendancePercentage >= 75 ? 'bg-yellow-500' : 'bg-red-500'
              }`}
              style={{ width: `${row.attendancePercentage}%` }}
            />
          </div>
        </div>
      ),
    },
    {
      id: 'lastAttended',
      header: 'Last Attended',
      cell: (row: any) => (
        <div className="text-center text-sm">{row.lastAttended}</div>
      ),
    },
    {
      id: 'status',
      header: 'Status',
      cell: (row: any) => (
        <StatusBadge
          variant={
            row.status === 'Active' ? 'success' : 
            row.status === 'At Risk' ? 'warning' : 'error'
          }
          label={row.status}
        />
      ),
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: (row: any) => (
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => {
            setSelectedCandidate(row);
            setCandidateDialogOpen(true);
          }}
        >
          <Eye className="h-4 w-4 mr-1" />
          View Details
        </Button>
      ),
    },
  ];

  const trainerColumns = [
    {
      id: 'trainer',
      header: 'Trainer',
      cell: (row: any) => (
        <div>
          <div className="font-medium">{row.name}</div>
          <div className="text-xs text-gray-500">{row.center}</div>
        </div>
      ),
    },
    {
      id: 'batches',
      header: 'Batches',
      cell: (row: any) => (
        <div className="text-center">
          <div className="font-medium">{row.batches.length}</div>
          <div className="text-xs text-gray-500">{row.batches.join(', ')}</div>
        </div>
      ),
    },
    {
      id: 'attendance',
      header: 'Attendance',
      cell: (row: any) => (
        <div className="text-center">
          <div className="font-medium">{row.presentDays}/{row.totalDays}</div>
          <div className="text-xs text-gray-500">Present/Total</div>
        </div>
      ),
    },
    {
      id: 'percentage',
      header: 'Attendance %',
      cell: (row: any) => (
        <div className="text-center">
          <div className="font-medium">{row.attendancePercentage}%</div>
          <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
            <div 
              className={`h-1.5 rounded-full ${
                row.attendancePercentage >= 95 ? 'bg-green-500' : 
                row.attendancePercentage >= 85 ? 'bg-yellow-500' : 'bg-red-500'
              }`}
              style={{ width: `${row.attendancePercentage}%` }}
            />
          </div>
        </div>
      ),
    },
    {
      id: 'lastAttended',
      header: 'Last Attended',
      cell: (row: any) => (
        <div className="text-center text-sm">{row.lastAttended}</div>
      ),
    },
    {
      id: 'status',
      header: 'Status',
      cell: (row: any) => (
        <StatusBadge
          variant={row.status === 'Active' ? 'success' : 'error'}
          label={row.status}
        />
      ),
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: (row: any) => (
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => {
            setSelectedTrainer(row);
            setTrainerDialogOpen(true);
          }}
        >
          <Eye className="h-4 w-4 mr-1" />
          View Schedule
        </Button>
      ),
    },
  ];

  const handleFilterChange = (filterId: string, value: any) => {
    console.log("Filter changed:", filterId, value);
  };

  return (
    <MainLayout role="state_head">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Attendance</h1>
          <p className="text-muted-foreground">
            Track attendance for candidates and trainers across all centers
          </p>
        </div>
        
        <EnhancedFilterBar
          filters={filterOptions}
          onFilterChange={handleFilterChange}
          actions={
            <Button variant="outline" className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Export Attendance Report
            </Button>
          }
        />

        <Tabs defaultValue="candidates" className="space-y-4">
          <TabsList>
            <TabsTrigger value="candidates" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Candidates
            </TabsTrigger>
            <TabsTrigger value="trainers" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Trainers
            </TabsTrigger>
          </TabsList>

          <TabsContent value="candidates">
            <Card>
              <CardHeader>
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Candidate Attendance
                    <span className="text-sm text-muted-foreground">
                      (Absent candidates requiring remarks)
                    </span>
                  </CardTitle>
                  
                  <div className="flex flex-wrap gap-3">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search candidates..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 w-64"
                      />
                    </div>
                    
                    <Select value={showAtRiskOnly ? 'at-risk' : 'all'} onValueChange={(value) => setShowAtRiskOnly(value === 'at-risk')}>
                      <SelectTrigger className="w-48">
                        <Filter className="h-4 w-4 mr-2" />
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Candidates</SelectItem>
                        <SelectItem value="at-risk">At Risk Only</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Candidate Name</TableHead>
                      <TableHead>Attendance</TableHead>
                      <TableHead>Attendance %</TableHead>
                      <TableHead>Last Attended</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Absent Reason</TableHead>
                      <TableHead>Expected Return</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {candidateAttendanceData
                      .filter(candidate => {
                        const matchesSearch = candidate.name.toLowerCase().includes(searchTerm.toLowerCase());
                        const matchesAtRisk = !showAtRiskOnly || candidate.status === 'At Risk';
                        return matchesSearch && matchesAtRisk;
                      })
                      .map((candidate) => (
                        <TableRow key={candidate.id}>
                          <TableCell>
                            <div>
                              <div className="font-medium">{candidate.name}</div>
                              <div className="text-xs text-muted-foreground">{candidate.batch} • {candidate.center}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-center">
                              <div className="font-medium">{candidate.presentDays}/{candidate.totalDays}</div>
                              <div className="text-xs text-muted-foreground">Present/Total</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-center">
                              <div className="font-medium">{candidate.attendancePercentage}%</div>
                              <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                                <div 
                                  className={`h-1.5 rounded-full ${
                                    candidate.attendancePercentage >= 85 ? 'bg-green-500' : 
                                    candidate.attendancePercentage >= 75 ? 'bg-yellow-500' : 'bg-red-500'
                                  }`}
                                  style={{ width: `${candidate.attendancePercentage}%` }}
                                />
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="text-center text-sm">{candidate.lastAttended}</TableCell>
                          <TableCell>
                            <StatusBadge
                              variant={
                                candidate.status === 'Active' ? 'success' : 
                                candidate.status === 'At Risk' ? 'warning' : 'error'
                              }
                              label={candidate.status}
                            />
                          </TableCell>
                          <TableCell>
                            <Textarea
                              placeholder="Why absent?"
                              className="min-h-[60px] resize-none"
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              type="date"
                              className="w-full"
                            />
                          </TableCell>
                          <TableCell>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => {
                                setSelectedCandidate(candidate);
                                setCandidateDialogOpen(true);
                              }}
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              View Details
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="trainers">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Trainer Attendance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Trainer Name</TableHead>
                      <TableHead>Batches</TableHead>
                      <TableHead>Attendance</TableHead>
                      <TableHead>Attendance %</TableHead>
                      <TableHead>Last Attended</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {trainerAttendanceData.map((trainer) => (
                      <TableRow key={trainer.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{trainer.name}</div>
                            <div className="text-xs text-muted-foreground">{trainer.center}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-center">
                            <div className="font-medium">{trainer.batches.length}</div>
                            <div className="text-xs text-muted-foreground">{trainer.batches.join(', ')}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-center">
                            <div className="font-medium">{trainer.presentDays}/{trainer.totalDays}</div>
                            <div className="text-xs text-muted-foreground">Present/Total</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-center">
                            <div className="font-medium">{trainer.attendancePercentage}%</div>
                            <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                              <div 
                                className={`h-1.5 rounded-full ${
                                  trainer.attendancePercentage >= 95 ? 'bg-green-500' : 
                                  trainer.attendancePercentage >= 85 ? 'bg-yellow-500' : 'bg-red-500'
                                }`}
                                style={{ width: `${trainer.attendancePercentage}%` }}
                              />
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-center text-sm">{trainer.lastAttended}</TableCell>
                        <TableCell>
                          <StatusBadge
                            variant={trainer.status === 'Active' ? 'success' : 'error'}
                            label={trainer.status}
                          />
                        </TableCell>
                        <TableCell>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => {
                              setSelectedTrainer(trainer);
                              setTrainerDialogOpen(true);
                            }}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            View Schedule
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
      </div>
      
      {selectedCandidate && (
        <CandidateAttendanceDialog
          open={candidateDialogOpen}
          onOpenChange={setCandidateDialogOpen}
          candidate={selectedCandidate}
        />
      )}
      
      {selectedTrainer && (
        <TrainerScheduleDialog
          open={trainerDialogOpen}
          onOpenChange={setTrainerDialogOpen}
          trainer={selectedTrainer}
        />
      )}
    </MainLayout>
  );
};

export default Attendance;
