import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { CheckCircle, XCircle, Eye, FileText, MessageSquare } from 'lucide-react';

const CounsellingVerification = () => {
  const [selectedBatch, setSelectedBatch] = useState('all');
  const [selectedStage, setSelectedStage] = useState('all');
  const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState<any>(null);
  const [verificationComments, setVerificationComments] = useState('');

  // Mock data for counselling tracker
  const counsellingData = [
    {
      id: 'C-001',
      name: 'Ravi Kumar',
      batch: 'DDU-GKY-B5',
      stage1: 'completed',
      stage2: 'completed',
      stage3: 'pending',
      parentCounselling: true,
      finalized: false,
      sessions: [
        { stage: 1, date: '2024-01-10', notes: 'Initial counselling completed. Candidate showed interest in data entry work.', counsellor: 'Dr. Priya Sharma' },
        { stage: 2, date: '2024-01-15', notes: 'Career guidance provided. Discussed salary expectations and job responsibilities.', counsellor: 'Dr. Priya Sharma' },
      ],
      parentConsent: {
        photo: '/placeholder.svg',
        notes: 'Parent consent obtained. Father signed the form.',
        date: '2024-01-12'
      }
    },
    {
      id: 'C-002',
      name: 'Priya Sharma',
      batch: 'DDU-GKY-B6',
      stage1: 'completed',
      stage2: 'completed',
      stage3: 'completed',
      parentCounselling: true,
      finalized: true,
      sessions: [
        { stage: 1, date: '2024-01-08', notes: 'Candidate very motivated. Good technical aptitude.', counsellor: 'Dr. Amit Singh' },
        { stage: 2, date: '2024-01-12', notes: 'Discussed placement opportunities. Ready for computer hardware course.', counsellor: 'Dr. Amit Singh' },
        { stage: 3, date: '2024-01-18', notes: 'Final assessment completed. Recommended for placement.', counsellor: 'Dr. Amit Singh' },
      ],
      parentConsent: {
        photo: '/placeholder.svg',
        notes: 'Mother provided consent. All documents verified.',
        date: '2024-01-10'
      }
    },
    {
      id: 'C-003',
      name: 'Amit Singh',
      batch: 'DDU-GKY-B5',
      stage1: 'completed',
      stage2: 'pending',
      stage3: 'not_started',
      parentCounselling: false,
      finalized: false,
      sessions: [
        { stage: 1, date: '2024-01-09', notes: 'Basic counselling done. Need to work on communication skills.', counsellor: 'Dr. Priya Sharma' },
      ],
      parentConsent: null
    }
  ];

  const batches = [
    { id: 'all', name: 'All Batches' },
    { id: 'DDU-GKY-B5', name: 'DDU-GKY Batch 5' },
    { id: 'DDU-GKY-B6', name: 'DDU-GKY Batch 6' },
    { id: 'DDU-GKY-B7', name: 'DDU-GKY Batch 7' },
  ];

  const stages = [
    { id: 'all', name: 'All Stages' },
    { id: '1', name: 'Stage 1' },
    { id: '2', name: 'Stage 2' },
    { id: '3', name: 'Stage 3' },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800">Completed</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case 'not_started':
        return <Badge variant="secondary">Not Started</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const handleVerification = (action: 'verify' | 'reject') => {
    // Handle verification logic
    console.log(`${action} candidate:`, selectedCandidate?.id, 'Comments:', verificationComments);
    setIsVerificationModalOpen(false);
    setVerificationComments('');
  };

  const openVerificationModal = (candidate: any) => {
    setSelectedCandidate(candidate);
    setIsVerificationModalOpen(true);
  };

  return (
    <div className="space-y-6">
        {/* Header & Filters */}
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Counselling Completion Tracker</h1>
          
          <div className="flex gap-3">
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

            <Select value={selectedStage} onValueChange={setSelectedStage}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by Stage" />
              </SelectTrigger>
              <SelectContent>
                {stages.map((stage) => (
                  <SelectItem key={stage.id} value={stage.id}>
                    {stage.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Counselling Tracker Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Counselling Completion Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Candidate Name</TableHead>
                  <TableHead>Batch</TableHead>
                  <TableHead>Stage 1</TableHead>
                  <TableHead>Stage 2</TableHead>
                  <TableHead>Stage 3</TableHead>
                  <TableHead>Parent Counselling</TableHead>
                  <TableHead>Finalized</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {counsellingData.map((candidate) => (
                  <TableRow key={candidate.id}>
                    <TableCell className="font-medium">{candidate.name}</TableCell>
                    <TableCell>{candidate.batch}</TableCell>
                    <TableCell>{getStatusBadge(candidate.stage1)}</TableCell>
                    <TableCell>{getStatusBadge(candidate.stage2)}</TableCell>
                    <TableCell>{getStatusBadge(candidate.stage3)}</TableCell>
                    <TableCell>
                      {candidate.parentCounselling ? (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-600" />
                      )}
                    </TableCell>
                    <TableCell>
                      {candidate.finalized ? (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      ) : (
                        <XCircle className="h-5 w-5 text-red-600" />
                      )}
                    </TableCell>
                    <TableCell>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => openVerificationModal(candidate)}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Verification Modal */}
        <Dialog open={isVerificationModalOpen} onOpenChange={setIsVerificationModalOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Counselling Verification - {selectedCandidate?.name}</DialogTitle>
            </DialogHeader>
            
            {selectedCandidate && (
              <div className="space-y-6">
                {/* Candidate Summary */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Candidate Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p><strong>Name:</strong> {selectedCandidate.name}</p>
                        <p><strong>Batch:</strong> {selectedCandidate.batch}</p>
                      </div>
                      <div>
                        <p><strong>Parent Counselling:</strong> {selectedCandidate.parentCounselling ? 'Yes' : 'No'}</p>
                        <p><strong>Finalized:</strong> {selectedCandidate.finalized ? 'Yes' : 'No'}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Session Notes */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MessageSquare className="h-5 w-5" />
                      Counselling Session Notes
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {selectedCandidate.sessions.map((session: any, index: number) => (
                        <div key={index} className="border rounded-lg p-4">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-medium">Stage {session.stage} Counselling</h4>
                            <Badge variant="outline">{session.date}</Badge>
                          </div>
                          <p className="text-gray-700 mb-2">{session.notes}</p>
                          <p className="text-sm text-gray-500">Counsellor: {session.counsellor}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Parent Consent */}
                {selectedCandidate.parentConsent && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Parent Consent Details</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <img 
                            src={selectedCandidate.parentConsent.photo} 
                            alt="Parent consent" 
                            className="w-full h-48 object-cover rounded-lg border"
                          />
                        </div>
                        <div>
                          <p><strong>Date:</strong> {selectedCandidate.parentConsent.date}</p>
                          <p><strong>Notes:</strong> {selectedCandidate.parentConsent.notes}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                <Separator />

                {/* Verification Section */}
                <Card>
                  <CardHeader>
                    <CardTitle>Centre Manager Verification</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Verification Comments
                        </label>
                        <Textarea
                          value={verificationComments}
                          onChange={(e) => setVerificationComments(e.target.value)}
                          placeholder="Add your verification comments or notes..."
                          rows={4}
                        />
                      </div>
                      
                      <div className="flex justify-end gap-3">
                        <Button variant="outline" onClick={() => setIsVerificationModalOpen(false)}>
                          Cancel
                        </Button>
                        <Button 
                          variant="destructive" 
                          onClick={() => handleVerification('reject')}
                        >
                          Reject
                        </Button>
                        <Button onClick={() => handleVerification('verify')}>
                          Mark as Verified
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
  );
};

export default CounsellingVerification;