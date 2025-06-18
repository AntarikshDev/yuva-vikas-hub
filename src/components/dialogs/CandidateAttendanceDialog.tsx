
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { DateRangePicker } from '@/components/ui/date-range-picker';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/common/StatusBadge';
import { Calendar, User, MapPin } from 'lucide-react';
import { DateRange } from 'react-day-picker';

interface CandidateAttendanceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  candidate: {
    id: number;
    name: string;
    batch: string;
    center: string;
  };
}

export function CandidateAttendanceDialog({ open, onOpenChange, candidate }: CandidateAttendanceDialogProps) {
  const [dateRange, setDateRange] = useState<DateRange | undefined>();

  const attendanceData = [
    { date: '2024-06-01', status: 'Present', checkIn: '09:00 AM', checkOut: '05:00 PM' },
    { date: '2024-06-02', status: 'Present', checkIn: '09:15 AM', checkOut: '05:05 PM' },
    { date: '2024-06-03', status: 'Absent', checkIn: '-', checkOut: '-' },
    { date: '2024-06-04', status: 'Present', checkIn: '08:45 AM', checkOut: '05:00 PM' },
    { date: '2024-06-05', status: 'Late', checkIn: '09:30 AM', checkOut: '05:00 PM' },
    { date: '2024-06-06', status: 'Present', checkIn: '09:00 AM', checkOut: '05:10 PM' },
    { date: '2024-06-07', status: 'Present', checkIn: '08:55 AM', checkOut: '05:00 PM' },
    { date: '2024-06-08', status: 'Present', checkIn: '09:00 AM', checkOut: '05:00 PM' },
    { date: '2024-06-09', status: 'Present', checkIn: '09:05 AM', checkOut: '05:00 PM' },
    { date: '2024-06-10', status: 'Absent', checkIn: '-', checkOut: '-' },
  ];

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'Present': return 'success';
      case 'Absent': return 'error';
      case 'Late': return 'warning';
      default: return 'default';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[85vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            {candidate.name} - Attendance Details
          </DialogTitle>
        </DialogHeader>
        
        <div className="overflow-y-auto max-h-[calc(85vh-120px)] pr-2">
          <div className="space-y-6">
            {/* Candidate Info */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-blue-600" />
                  <span className="font-medium">Batch: {candidate.batch}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-blue-600" />
                  <span className="font-medium">Center: {candidate.center}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-blue-600" />
                  <span className="font-medium">Total Days: 20</span>
                </div>
              </div>
            </div>
            
            {/* Date Range Filter */}
            <div className="flex items-center gap-4">
              <span className="font-medium">Filter by Date Range:</span>
              <DateRangePicker
                dateRange={dateRange}
                onDateRangeChange={setDateRange}
                placeholder="Select date range"
              />
              <Button variant="outline" size="sm">Apply Filter</Button>
            </div>
            
            {/* Attendance Calendar View */}
            <div className="bg-white border rounded-lg">
              <div className="p-4 border-b">
                <h3 className="font-semibold text-lg">Daily Attendance Record</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left">Date</th>
                      <th className="px-4 py-3 text-center">Status</th>
                      <th className="px-4 py-3 text-center">Check In</th>
                      <th className="px-4 py-3 text-center">Check Out</th>
                      <th className="px-4 py-3 text-center">Hours</th>
                    </tr>
                  </thead>
                  <tbody>
                    {attendanceData.map((record, index) => (
                      <tr key={index} className="border-b hover:bg-gray-50">
                        <td className="px-4 py-3 font-medium">{record.date}</td>
                        <td className="px-4 py-3 text-center">
                          <StatusBadge
                            variant={getStatusVariant(record.status)}
                            label={record.status}
                            size="sm"
                          />
                        </td>
                        <td className="px-4 py-3 text-center">{record.checkIn}</td>
                        <td className="px-4 py-3 text-center">{record.checkOut}</td>
                        <td className="px-4 py-3 text-center">
                          {record.status === 'Present' || record.status === 'Late' ? '8 hrs' : '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            
            {/* Summary Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-green-50 p-3 rounded-lg text-center">
                <div className="text-2xl font-bold text-green-700">7</div>
                <div className="text-sm text-green-600">Present Days</div>
              </div>
              <div className="bg-red-50 p-3 rounded-lg text-center">
                <div className="text-2xl font-bold text-red-700">2</div>
                <div className="text-sm text-red-600">Absent Days</div>
              </div>
              <div className="bg-yellow-50 p-3 rounded-lg text-center">
                <div className="text-2xl font-bold text-yellow-700">1</div>
                <div className="text-sm text-yellow-600">Late Days</div>
              </div>
              <div className="bg-blue-50 p-3 rounded-lg text-center">
                <div className="text-2xl font-bold text-blue-700">80%</div>
                <div className="text-sm text-blue-600">Attendance Rate</div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
