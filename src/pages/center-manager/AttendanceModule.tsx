import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DateRangePicker } from '@/components/ui/date-range-picker';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Search, Eye, Filter, Calendar, Users, Download, Upload, CheckCircle, XCircle } from 'lucide-react';
import { DateRange } from 'react-day-picker';
import { useToast } from '@/hooks/use-toast';
import { StatusBadge } from '@/components/common/StatusBadge';

const AttendanceModule = () => {
  const [selectedBatch, setSelectedBatch] = useState('all');
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [searchTerm, setSearchTerm] = useState('');
  const [showAtRiskOnly, setShowAtRiskOnly] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState<any>(null);
  const { toast } = useToast();

  // Mock data for attendance - showing only absent candidates that need remarks
  const attendanceData = [
    {
      id: 'C-001',
      name: 'Ravi Kumar',
      batch: 'DDU-GKY-B5',
      center: 'Mumbai Central',
      totalDays: 20,
      present: 18,
      absent: 2,
      attendancePercentage: 90,
      lastAttended: '2024-06-17',
      status: 'Active',
      absentReason: '',
      expectedReturnDate: ''
    },
    {
      id: 'C-002',
      name: 'Priya Sharma',
      batch: 'DDU-GKY-B6',
      center: 'Andheri',
      totalDays: 20,
      present: 16,
      absent: 4,
      attendancePercentage: 80,
      lastAttended: '2024-06-16',
      status: 'Active',
      absentReason: '',
      expectedReturnDate: ''
    },
    {
      id: 'C-003',
      name: 'Alice Johnson',
      batch: 'DDU-GKY-B5',
      center: 'Pune East',
      totalDays: 20,
      present: 12,
      absent: 8,
      attendancePercentage: 60,
      lastAttended: '2024-06-10',
      status: 'At Risk',
      absentReason: '',
      expectedReturnDate: ''
    },
    {
      id: 'C-004',
      name: 'Sunita Devi',
      batch: 'DDU-GKY-B7',
      center: 'Mumbai Central',
      totalDays: 15,
      present: 12,
      absent: 3,
      attendancePercentage: 80,
      lastAttended: '2024-06-15',
      status: 'Active',
      absentReason: '',
      expectedReturnDate: ''
    }
  ];

  const batches = [
    { id: 'all', name: 'All Batches' },
    { id: 'DDU-GKY-B5', name: 'DDU-GKY Batch 5' },
    { id: 'DDU-GKY-B6', name: 'DDU-GKY Batch 6' },
    { id: 'DDU-GKY-B7', name: 'DDU-GKY Batch 7' },
  ];

  const getAttendanceColor = (percentage: number) => {
    if (percentage >= 85) return 'text-green-600';
    if (percentage >= 75) return 'text-yellow-600';
    return 'text-red-600';
  };

  const handleBulkAttendance = () => {
    toast({
      title: "Attendance Updated",
      description: "Bulk attendance has been saved successfully.",
    });
  };

  const handleExportAttendance = () => {
    toast({
      title: "Export Initiated",
      description: "Attendance report is being generated and will be downloaded shortly.",
    });
  };

  // Filter data based on search term, batch selection, and at-risk filter
  const filteredData = attendanceData
    .filter(student => {
      const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesBatch = selectedBatch === 'all' || student.batch === selectedBatch;
      const matchesAtRisk = !showAtRiskOnly || student.status === 'At Risk';
      return matchesSearch && matchesBatch && matchesAtRisk;
    });

  const handleViewDetails = (candidate: any) => {
    setSelectedCandidate(candidate);
  };

  return (
    <div className="space-y-6">
      {/* Header & Filters */}
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Attendance Management</h1>
        
        <div className="flex flex-wrap gap-3">
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

          <DateRangePicker
            dateRange={dateRange}
            onDateRangeChange={setDateRange}
            className="w-48"
            placeholder="Select Date Range"
          />

          <Button variant="outline" onClick={handleExportAttendance}>
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>

          <Button>
            <Upload className="h-4 w-4 mr-2" />
            Bulk Upload
          </Button>
        </div>
      </div>

      {/* Candidate Attendance Card */}
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
              {filteredData.map((candidate) => (
                <TableRow key={candidate.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{candidate.name}</div>
                      <div className="text-xs text-muted-foreground">{candidate.batch} • {candidate.center}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-center">
                      <div className="font-medium">{candidate.present}/{candidate.totalDays}</div>
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
                      value={candidate.absentReason}
                      onChange={(e) => {
                        const updatedData = attendanceData.map(item =>
                          item.id === candidate.id ? { ...item, absentReason: e.target.value } : item
                        );
                        // Update the state here if you want to persist changes
                      }}
                      className="min-h-[60px] resize-none"
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="date"
                      value={candidate.expectedReturnDate}
                      onChange={(e) => {
                        const updatedData = attendanceData.map(item =>
                          item.id === candidate.id ? { ...item, expectedReturnDate: e.target.value } : item
                        );
                        // Update the state here if you want to persist changes
                      }}
                      className="w-full"
                    />
                  </TableCell>
                  <TableCell>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleViewDetails(candidate)}
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

    </div>
  );
};

export default AttendanceModule;