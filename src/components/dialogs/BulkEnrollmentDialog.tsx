import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { CheckCircle, AlertTriangle, Users } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface BulkEnrollmentDialogProps {
  open: boolean;
  onClose: () => void;
  candidates: any[];
  onBulkUpdate: (candidateIds: string[]) => void;
}

export function BulkEnrollmentDialog({ open, onClose, candidates, onBulkUpdate }: BulkEnrollmentDialogProps) {
  const [selectedCandidates, setSelectedCandidates] = useState<string[]>([]);
  const [isUpdating, setIsUpdating] = useState(false);
  const { toast } = useToast();

  // Filter candidates who can be enrolled (migrated but not enrolled)
  const eligibleCandidates = candidates.filter(
    candidate => candidate.migrationStatus === 'Migrated' && candidate.enrollmentStatus === 'Pending'
  );

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedCandidates(eligibleCandidates.map(c => c.id));
    } else {
      setSelectedCandidates([]);
    }
  };

  const handleSelectCandidate = (candidateId: string, checked: boolean) => {
    if (checked) {
      setSelectedCandidates(prev => [...prev, candidateId]);
    } else {
      setSelectedCandidates(prev => prev.filter(id => id !== candidateId));
    }
  };

  const handleBulkEnrollment = async () => {
    if (selectedCandidates.length === 0) return;

    setIsUpdating(true);
    
    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      onBulkUpdate(selectedCandidates);
      
      toast({
        title: "Bulk Enrollment Complete",
        description: `Successfully enrolled ${selectedCandidates.length} candidates`,
      });
      
      setSelectedCandidates([]);
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to complete bulk enrollment",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Bulk Mark as Enrolled
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Summary */}
          <div className="grid grid-cols-3 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{eligibleCandidates.length}</div>
                  <p className="text-sm text-muted-foreground">Eligible for Enrollment</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{selectedCandidates.length}</div>
                  <p className="text-sm text-muted-foreground">Selected</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">
                    {candidates.length - eligibleCandidates.length}
                  </div>
                  <p className="text-sm text-muted-foreground">Not Eligible</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {eligibleCandidates.length === 0 ? (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-8">
                  <AlertTriangle className="h-12 w-12 text-orange-500 mx-auto mb-4" />
                  <h3 className="font-medium text-lg mb-2">No Eligible Candidates</h3>
                  <p className="text-muted-foreground">
                    There are no candidates who can be enrolled at this time.
                    Only candidates with "Migrated" status and "Pending" enrollment can be enrolled.
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <>
              {/* Selection Controls */}
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="select-all"
                        checked={selectedCandidates.length === eligibleCandidates.length}
                        onCheckedChange={handleSelectAll}
                      />
                      <label htmlFor="select-all" className="text-sm font-medium">
                        Select All Eligible Candidates
                      </label>
                    </div>
                    <Badge variant="outline">
                      {selectedCandidates.length} of {eligibleCandidates.length} selected
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Candidate List */}
              <Card>
                <CardContent className="pt-6">
                  <ScrollArea className="h-64">
                    <div className="space-y-3">
                      {eligibleCandidates.map((candidate) => (
                        <div
                          key={candidate.id}
                          className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50"
                        >
                          <div className="flex items-center space-x-3">
                            <Checkbox
                              checked={selectedCandidates.includes(candidate.id)}
                              onCheckedChange={(checked) => 
                                handleSelectCandidate(candidate.id, checked as boolean)
                              }
                            />
                            <div>
                              <p className="font-medium">{candidate.name}</p>
                              <p className="text-sm text-muted-foreground">
                                {candidate.id} • {candidate.company} • {candidate.placementLocation}
                              </p>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Badge variant="default">Migrated</Badge>
                            <Badge variant="secondary">Pending</Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>

              {/* Confirmation */}
              {selectedCandidates.length > 0 && (
                <Card className="border-green-200 bg-green-50">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-green-900">Ready to Enroll</h4>
                        <p className="text-sm text-green-700">
                          {selectedCandidates.length} candidates will be marked as "Enrolled".
                          This action will update their enrollment status in the system.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </div>

        <DialogFooter className="flex gap-2 mt-6 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleBulkEnrollment}
            disabled={selectedCandidates.length === 0 || isUpdating}
          >
            {isUpdating ? "Enrolling..." : `Enroll ${selectedCandidates.length} Candidates`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}