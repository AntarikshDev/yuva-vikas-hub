import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { User, Phone, Mail, MapPin, Calendar, Building, Briefcase, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CandidateDetailsDialogProps {
  open: boolean;
  onClose: () => void;
  candidate: any;
  onStatusUpdate: (candidateId: string, newMigrationStatus: string, newEnrollmentStatus: string) => void;
}

export function CandidateDetailsDialog({ open, onClose, candidate, onStatusUpdate }: CandidateDetailsDialogProps) {
  const [selectedMigrationStatus, setSelectedMigrationStatus] = useState(candidate?.migrationStatus || '');
  const [selectedEnrollmentStatus, setSelectedEnrollmentStatus] = useState(candidate?.enrollmentStatus || '');
  const [isUpdating, setIsUpdating] = useState(false);
  const { toast } = useToast();

  if (!candidate) return null;

  const handleStatusUpdate = async () => {
    setIsUpdating(true);
    
    // Mock API call
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      onStatusUpdate(candidate.id, selectedMigrationStatus, selectedEnrollmentStatus);
      
      toast({
        title: "Status Updated",
        description: `Successfully updated candidate status`,
      });
      
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update candidate status",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const hasChanges = selectedMigrationStatus !== candidate.migrationStatus || 
                    selectedEnrollmentStatus !== candidate.enrollmentStatus;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Candidate Details - {candidate.name}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Full Name</p>
                    <p className="font-medium">{candidate.name}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{candidate.id}</Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Phone Number</p>
                    <p className="font-medium">{candidate.phone}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium">{candidate.email}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Training & Placement Details */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Training & Placement Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Building className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Batch ID</p>
                    <p className="font-medium">{candidate.batchId}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Briefcase className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Job Role</p>
                    <p className="font-medium">{candidate.jobRole}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Building className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Company</p>
                    <p className="font-medium">{candidate.company}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Placement Location</p>
                    <p className="font-medium">{candidate.placementLocation}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Timeline</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Counsellor Approval</p>
                    <p className="font-medium">{candidate.counsellorApproval}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Travel Date</p>
                    <p className="font-medium">{candidate.travelDate}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Separator />

          {/* Status Management */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Status Management</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Migration Status</label>
                  <Select value={selectedMigrationStatus} onValueChange={setSelectedMigrationStatus}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Ready for Migration">Ready for Migration</SelectItem>
                      <SelectItem value="Migrated">Migrated</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    Current: <Badge variant="outline">{candidate.migrationStatus}</Badge>
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Enrollment Status</label>
                  <Select 
                    value={selectedEnrollmentStatus} 
                    onValueChange={setSelectedEnrollmentStatus}
                    disabled={selectedMigrationStatus !== 'Migrated'}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Pending">Pending</SelectItem>
                      <SelectItem value="Enrolled">Enrolled</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    Current: <Badge variant="outline">{candidate.enrollmentStatus}</Badge>
                  </p>
                  {selectedMigrationStatus !== 'Migrated' && (
                    <p className="text-xs text-yellow-600">
                      Enrollment can only be updated for migrated candidates
                    </p>
                  )}
                </div>
              </div>

              {hasChanges && (
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <h4 className="font-medium text-blue-900 mb-2">Status Changes Preview</h4>
                  <div className="space-y-1 text-sm">
                    {selectedMigrationStatus !== candidate.migrationStatus && (
                      <p className="text-blue-700">
                        Migration Status: {candidate.migrationStatus} → {selectedMigrationStatus}
                      </p>
                    )}
                    {selectedEnrollmentStatus !== candidate.enrollmentStatus && (
                      <p className="text-blue-700">
                        Enrollment Status: {candidate.enrollmentStatus} → {selectedEnrollmentStatus}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <DialogFooter className="flex gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleStatusUpdate} 
            disabled={!hasChanges || isUpdating}
          >
            {isUpdating ? "Updating..." : "Update Status"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}