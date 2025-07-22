import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DateRangePicker } from '@/components/ui/date-range-picker';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { Calendar, Users, Download, Upload, CheckCircle, XCircle } from 'lucide-react';
import { DateRange } from 'react-day-picker';
import { useToast } from '@/hooks/use-toast';

const AttendanceModule = () => {
  const [selectedBatch, setSelectedBatch] = useState('all');
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [selectedDate, setSelectedDate] = useState('2024-01-15');
  const { toast } = useToast();

  // Mock data for attendance
  const attendanceData = [
    {
      id: 'C-001',
      name: 'Ravi Kumar',
      batch: 'DDU-GKY-B5',
      totalDays: 20,
      present: 18,
      absent: 2,
      attendance: 90,
      todayStatus: 'present'
    },
    {
      id: 'C-002',
      name: 'Priya Sharma',
      batch: 'DDU-GKY-B6',
      totalDays: 20,
      present: 16,
      absent: 4,
      attendance: 80,
      todayStatus: 'absent'
    },
    {
      id: 'C-003',
      name: 'Amit Singh',
      batch: 'DDU-GKY-B5',
      totalDays: 20,
      present: 19,
      absent: 1,
      attendance: 95,
      todayStatus: 'present'
    },
    {
      id: 'C-004',
      name: 'Sunita Devi',
      batch: 'DDU-GKY-B7',
      totalDays: 15,
      present: 12,
      absent: 3,
      attendance: 80,
      todayStatus: 'present'
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

  const filteredData = selectedBatch === 'all' 
    ? attendanceData 
    : attendanceData.filter(student => student.batch === selectedBatch);

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

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">{filteredData.length}</p>
                <p className="text-sm text-muted-foreground">Total Students</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-2xl font-bold">
                  {filteredData.filter(s => s.todayStatus === 'present').length}
                </p>
                <p className="text-sm text-muted-foreground">Present Today</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <XCircle className="h-5 w-5 text-red-600" />
              <div>
                <p className="text-2xl font-bold">
                  {filteredData.filter(s => s.todayStatus === 'absent').length}
                </p>
                <p className="text-sm text-muted-foreground">Absent Today</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-2xl font-bold">
                  {Math.round(filteredData.reduce((acc, s) => acc + s.attendance, 0) / filteredData.length)}%
                </p>
                <p className="text-sm text-muted-foreground">Avg. Attendance</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Daily Attendance Marking */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Daily Attendance - {selectedDate}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium">Date:</label>
                <input 
                  type="date" 
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="border rounded px-2 py-1"
                />
              </div>
              <Button onClick={handleBulkAttendance}>
                Save Attendance
              </Button>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student Name</TableHead>
                  <TableHead>Batch</TableHead>
                  <TableHead>Present</TableHead>
                  <TableHead>Absent</TableHead>
                  <TableHead>Remarks</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell className="font-medium">{student.name}</TableCell>
                    <TableCell>{student.batch}</TableCell>
                    <TableCell>
                      <Checkbox 
                        checked={student.todayStatus === 'present'}
                        id={`present-${student.id}`}
                      />
                    </TableCell>
                    <TableCell>
                      <Checkbox 
                        checked={student.todayStatus === 'absent'}
                        id={`absent-${student.id}`}
                      />
                    </TableCell>
                    <TableCell>
                      <input 
                        type="text" 
                        placeholder="Add remarks..."
                        className="border rounded px-2 py-1 w-full"
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Attendance Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Attendance Summary Report</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student Name</TableHead>
                <TableHead>Batch</TableHead>
                <TableHead>Total Days</TableHead>
                <TableHead>Present</TableHead>
                <TableHead>Absent</TableHead>
                <TableHead>Attendance %</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map((student) => (
                <TableRow key={student.id}>
                  <TableCell className="font-medium">{student.name}</TableCell>
                  <TableCell>{student.batch}</TableCell>
                  <TableCell>{student.totalDays}</TableCell>
                  <TableCell>{student.present}</TableCell>
                  <TableCell>{student.absent}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Progress value={student.attendance} className="w-16" />
                      <span className={`text-sm font-medium ${getAttendanceColor(student.attendance)}`}>
                        {student.attendance}%
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant={student.attendance >= 85 ? 'default' : 
                               student.attendance >= 75 ? 'secondary' : 'destructive'}
                    >
                      {student.attendance >= 85 ? 'Good' : 
                       student.attendance >= 75 ? 'Average' : 'Poor'}
                    </Badge>
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