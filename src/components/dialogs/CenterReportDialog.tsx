
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Download, TrendingUp, Users, Target } from 'lucide-react';

interface CenterReportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  centerName: string;
}

export function CenterReportDialog({ open, onOpenChange, centerName }: CenterReportDialogProps) {
  const reportData = {
    overview: {
      totalCandidates: 156,
      placedCandidates: 142,
      placementRate: 91,
      avgSalary: 19200,
      activeBatches: 5,
    },
    monthlyStats: [
      { month: 'Jan', candidates: 25, placed: 23, rate: 92 },
      { month: 'Feb', candidates: 28, placed: 25, rate: 89 },
      { month: 'Mar', candidates: 32, placed: 30, rate: 94 },
      { month: 'Apr', candidates: 29, placed: 26, rate: 90 },
      { month: 'May', candidates: 24, placed: 21, rate: 88 },
      { month: 'Jun', candidates: 18, placed: 17, rate: 94 },
    ],
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{centerName} - Performance Report</DialogTitle>
        </DialogHeader>
        
        <div className="mt-4 space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-600" />
                <span className="text-sm font-medium text-blue-600">Total Candidates</span>
              </div>
              <div className="text-2xl font-bold text-blue-700">{reportData.overview.totalCandidates}</div>
            </div>
            
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-center gap-2">
                <Target className="h-5 w-5 text-green-600" />
                <span className="text-sm font-medium text-green-600">Placed</span>
              </div>
              <div className="text-2xl font-bold text-green-700">{reportData.overview.placedCandidates}</div>
            </div>
            
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-purple-600" />
                <span className="text-sm font-medium text-purple-600">Placement Rate</span>
              </div>
              <div className="text-2xl font-bold text-purple-700">{reportData.overview.placementRate}%</div>
            </div>
            
            <div className="bg-orange-50 p-4 rounded-lg">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-orange-600">Avg Salary</span>
              </div>
              <div className="text-2xl font-bold text-orange-700">₹{reportData.overview.avgSalary.toLocaleString()}</div>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-3">Monthly Performance</h3>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-200">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border border-gray-200 px-4 py-2 text-left">Month</th>
                    <th className="border border-gray-200 px-4 py-2 text-center">Candidates</th>
                    <th className="border border-gray-200 px-4 py-2 text-center">Placed</th>
                    <th className="border border-gray-200 px-4 py-2 text-center">Rate</th>
                  </tr>
                </thead>
                <tbody>
                  {reportData.monthlyStats.map((stat) => (
                    <tr key={stat.month}>
                      <td className="border border-gray-200 px-4 py-2 font-medium">{stat.month}</td>
                      <td className="border border-gray-200 px-4 py-2 text-center">{stat.candidates}</td>
                      <td className="border border-gray-200 px-4 py-2 text-center">{stat.placed}</td>
                      <td className="border border-gray-200 px-4 py-2 text-center">{stat.rate}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
          <div className="flex justify-end gap-2">
            <Button variant="outline">
              <Download className="h-4 w-4 mr-1" />
              Download Report
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
