
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { StatusBadge } from '@/components/common/StatusBadge';
import { Badge } from '@/components/ui/badge';
import { User, Phone, Mail, MapPin, Calendar, Users } from 'lucide-react';

interface TrainerDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  trainer: {
    id: number;
    name: string;
    center: string;
    district: string;
    specialization: string[];
    experience: number;
    activeBatches: number;
    totalCandidates: number;
    placedCandidates: number;
    placementRate: number;
    avgSalary: number;
    contact: {
      phone: string;
      email: string;
    };
    status: string;
  };
}

export function TrainerDetailsDialog({ open, onOpenChange, trainer }: TrainerDetailsDialogProps) {
  const batches = [
    { id: 'WD001', name: 'Web Development Batch 1', candidates: 25, startDate: '2024-01-15', endDate: '2024-06-15' },
    { id: 'GD002', name: 'Graphic Design Batch 2', candidates: 20, startDate: '2024-02-01', endDate: '2024-07-01' },
    { id: 'DM003', name: 'Digital Marketing Batch 3', candidates: 22, startDate: '2024-03-01', endDate: '2024-08-01' },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[85vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            {trainer.name} - Trainer Details
          </DialogTitle>
        </DialogHeader>
        
        <div className="overflow-y-auto max-h-[calc(85vh-120px)] pr-2">
          <div className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-lg mb-3">Basic Information</h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      <span>{trainer.center}, {trainer.district}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span>{trainer.experience} years experience</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-gray-500" />
                      <span>{trainer.contact.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-gray-500" />
                      <span>{trainer.contact.email}</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-green-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-lg mb-3">Specializations</h3>
                  <div className="flex flex-wrap gap-2">
                    {trainer.specialization.map((spec) => (
                      <Badge key={spec} variant="secondary">{spec}</Badge>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="bg-purple-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-lg mb-3">Performance Metrics</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>Active Batches:</span>
                      <span className="font-semibold">{trainer.activeBatches}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Total Candidates:</span>
                      <span className="font-semibold">{trainer.totalCandidates}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Placed Candidates:</span>
                      <span className="font-semibold">{trainer.placedCandidates}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Placement Rate:</span>
                      <span className="font-semibold">{trainer.placementRate}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Avg Salary:</span>
                      <span className="font-semibold">₹{trainer.avgSalary.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-semibold text-lg mb-3">Status</h3>
                  <StatusBadge
                    variant={trainer.status === 'Active' ? 'success' : 'error'}
                    label={trainer.status}
                  />
                </div>
              </div>
            </div>
            
            {/* Current Batches */}
            <div className="bg-orange-50 p-4 rounded-lg">
              <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                <Users className="h-5 w-5" />
                Current Batches
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">Batch ID</th>
                      <th className="text-left py-2">Name</th>
                      <th className="text-center py-2">Candidates</th>
                      <th className="text-center py-2">Start Date</th>
                      <th className="text-center py-2">End Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {batches.map((batch) => (
                      <tr key={batch.id} className="border-b">
                        <td className="py-2 font-medium">{batch.id}</td>
                        <td className="py-2">{batch.name}</td>
                        <td className="py-2 text-center">{batch.candidates}</td>
                        <td className="py-2 text-center">{batch.startDate}</td>
                        <td className="py-2 text-center">{batch.endDate}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
