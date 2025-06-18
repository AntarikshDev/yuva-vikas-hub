
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
import { Calendar, User, Clock, MapPin } from 'lucide-react';
import { DateRange } from 'react-day-picker';

interface TrainerScheduleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  trainer: {
    id: number;
    name: string;
    center: string;
    batches: string[];
  };
}

export function TrainerScheduleDialog({ open, onOpenChange, trainer }: TrainerScheduleDialogProps) {
  const [dateRange, setDateRange] = useState<DateRange | undefined>();

  const scheduleData = [
    { 
      date: '2024-06-01', 
      status: 'Present', 
      checkIn: '09:00 AM', 
      checkOut: '05:00 PM',
      batch: 'WD001',
      schedule: '09:00-12:00 (Theory), 01:00-05:00 (Practical)'
    },
    { 
      date: '2024-06-02', 
      status: 'Present', 
      checkIn: '09:15 AM', 
      checkOut: '05:05 PM',
      batch: 'GD002',
      schedule: '09:00-12:00 (Design), 01:00-05:00 (Software)'
    },
    { 
      date: '2024-06-03', 
      status: 'Absent', 
      checkIn: '-', 
      checkOut: '-',
      batch: 'DM003',
      schedule: '09:00-12:00 (Marketing), 01:00-05:00 (Analytics)'
    },
    { 
      date: '2024-06-04', 
      status: 'Present', 
      checkIn: '08:45 AM', 
      checkOut: '05:00 PM',
      batch: 'WD001',
      schedule: '09:00-12:00 (JavaScript), 01:00-05:00 (Project)'
    },
    { 
      date: '2024-06-05', 
      status: 'Present', 
      checkIn: '09:00 AM', 
      checkOut: '05:00 PM',
      batch: 'GD002',
      schedule: '09:00-12:00 (Photoshop), 01:00-05:00 (Portfolio)'
    },
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
      <DialogContent className="max-w-6xl max-h-[85vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            {trainer.name} - Schedule & Attendance
          </DialogTitle>
        </DialogHeader>
        
        <div className="overflow-y-auto max-h-[calc(85vh-120px)] pr-2">
          <div className="space-y-6">
            {/* Trainer Info */}
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-blue-600" />
                  <span className="font-medium">Center: {trainer.center}</span>
                </div>
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-blue-600" />
                  <span className="font-medium">Batches: {trainer.batches.join(', ')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-blue-600" />
                  <span className="font-medium">Total Working Days: 22</span>
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
            
            {/* Schedule & Attendance Table */}
            <div className="bg-white border rounded-lg">
              <div className="p-4 border-b">
                <h3 className="font-semibold text-lg flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Daily Schedule & Attendance Record
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left">Date</th>
                      <th className="px-4 py-3 text-center">Status</th>
                      <th className="px-4 py-3 text-center">Check In</th>
                      <th className="px-4 py-3 text-center">Check Out</th>
                      <th className="px-4 py-3 text-center">Batch</th>
                      <th className="px-4 py-3 text-left">Schedule</th>
                    </tr>
                  </thead>
                  <tbody>
                    {scheduleData.map((record, index) => (
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
                          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">
                            {record.batch}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm">{record.schedule}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            
            {/* Summary Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-green-50 p-3 rounded-lg text-center">
                <div className="text-2xl font-bold text-green-700">20</div>
                <div className="text-sm text-green-600">Present Days</div>
              </div>
              <div className="bg-red-50 p-3 rounded-lg text-center">
                <div className="text-2xl font-bold text-red-700">1</div>
                <div className="text-sm text-red-600">Absent Days</div>
              </div>
              <div className="bg-blue-50 p-3 rounded-lg text-center">
                <div className="text-2xl font-bold text-blue-700">3</div>
                <div className="text-sm text-blue-600">Active Batches</div>
              </div>
              <div className="bg-purple-50 p-3 rounded-lg text-center">
                <div className="text-2xl font-bold text-purple-700">95%</div>
                <div className="text-sm text-purple-600">Attendance Rate</div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
