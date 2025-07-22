import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Calendar, Users, Building, Phone, TrendingUp, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const PostPlacementTracking = () => {
  const [selectedBatch, setSelectedBatch] = useState('all');
  const [selectedPeriod, setSelectedPeriod] = useState('30days');
  const [isFollowUpModalOpen, setIsFollowUpModalOpen] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState<any>(null);
  const { toast } = useToast();

  // Mock data for post-placement tracking
  const placedCandidates = [
    {
      id: 'C-001',
      name: 'Ravi Kumar',
      batch: 'DDU-GKY-B5',
      company: 'Tech Solutions Pvt Ltd',
      position: 'Data Entry Operator',
      joinDate: '2024-01-15',
      salary: '15000',
      status: 'working',
      lastFollowUp: '2024-01-20',
      retention: 90,
      followUps: [
        { date: '2024-01-20', status: 'working', notes: 'Candidate is doing well, satisfied with work' },
        { date: '2024-01-25', status: 'working', notes: 'Good performance, no issues reported' }
      ]
    },
    {
      id: 'C-002',
      name: 'Priya Sharma',
      batch: 'DDU-GKY-B6',
      company: 'Hardware Plus',
      position: 'Hardware Technician',
      joinDate: '2024-01-20',
      salary: '18000',
      status: 'working',
      lastFollowUp: '2024-01-25',
      retention: 95,
      followUps: [
        { date: '2024-01-25', status: 'working', notes: 'Excellent performance, completed probation successfully' }
      ]
    },
    {
      id: 'C-003',
      name: 'Amit Singh',
      batch: 'DDU-GKY-B5',
      company: 'DataCorp Solutions',
      position: 'Data Entry Operator',
      joinDate: '2024-01-10',
      salary: '16000',
      status: 'resigned',
      lastFollowUp: '2024-01-22',
      retention: 75,
      followUps: [
        { date: '2024-01-18', status: 'working', notes: 'Some adjustment issues, need counseling' },
        { date: '2024-01-22', status: 'resigned', notes: 'Resigned due to family issues, seeking local opportunity' }
      ]
    }
  ];

  const batches = [
    { id: 'all', name: 'All Batches' },
    { id: 'DDU-GKY-B5', name: 'DDU-GKY Batch 5' },
    { id: 'DDU-GKY-B6', name: 'DDU-GKY Batch 6' },
    { id: 'DDU-GKY-B7', name: 'DDU-GKY Batch 7' },
  ];

  const periods = [
    { id: '30days', name: 'Last 30 Days' },
    { id: '90days', name: 'Last 90 Days' },
    { id: '6months', name: 'Last 6 Months' },
    { id: '1year', name: 'Last 1 Year' },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'working':
        return <Badge className="bg-green-100 text-green-800">Working</Badge>;
      case 'resigned':
        return <Badge variant="destructive">Resigned</Badge>;
      case 'terminated':
        return <Badge variant="destructive">Terminated</Badge>;
      case 'on_leave':
        return <Badge className="bg-yellow-100 text-yellow-800">On Leave</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const getRetentionColor = (percentage: number) => {
    if (percentage >= 85) return 'text-green-600';
    if (percentage >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const handleFollowUpSave = () => {
    toast({
      title: "Follow-up Saved",
      description: `Follow-up has been recorded for ${selectedCandidate?.name}.`,
    });
    setIsFollowUpModalOpen(false);
  };

  const filteredData = selectedBatch === 'all' 
    ? placedCandidates 
    : placedCandidates.filter(candidate => candidate.batch === selectedBatch);

  const workingCandidates = filteredData.filter(c => c.status === 'working').length;
  const totalPlaced = filteredData.length;
  const retentionRate = totalPlaced > 0 ? Math.round((workingCandidates / totalPlaced) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Header & Filters */}
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Post-Placement Tracking</h1>
        
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

          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select Period" />
            </SelectTrigger>
            <SelectContent>
              {periods.map((period) => (
                <SelectItem key={period.id} value={period.id}>
                  {period.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">{totalPlaced}</p>
                <p className="text-sm text-muted-foreground">Total Placed</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-2xl font-bold">{workingCandidates}</p>
                <p className="text-sm text-muted-foreground">Currently Working</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-600" />
              <div>
                <p className="text-2xl font-bold">
                  {filteredData.filter(c => c.status === 'resigned' || c.status === 'terminated').length}
                </p>
                <p className="text-sm text-muted-foreground">Attrition</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Building className="h-5 w-5 text-purple-600" />
              <div>
                <p className={`text-2xl font-bold ${getRetentionColor(retentionRate)}`}>
                  {retentionRate}%
                </p>
                <p className="text-sm text-muted-foreground">Retention Rate</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Post-Placement Tracking Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Candidate Tracking Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Candidate Name</TableHead>
                <TableHead>Batch</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Position</TableHead>
                <TableHead>Join Date</TableHead>
                <TableHead>Salary</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Retention %</TableHead>
                <TableHead>Last Follow-up</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map((candidate) => (
                <TableRow key={candidate.id}>
                  <TableCell className="font-medium">{candidate.name}</TableCell>
                  <TableCell>{candidate.batch}</TableCell>
                  <TableCell>{candidate.company}</TableCell>
                  <TableCell>{candidate.position}</TableCell>
                  <TableCell>{candidate.joinDate}</TableCell>
                  <TableCell>₹{candidate.salary}</TableCell>
                  <TableCell>{getStatusBadge(candidate.status)}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Progress value={candidate.retention} className="w-16" />
                      <span className={`text-sm font-medium ${getRetentionColor(candidate.retention)}`}>
                        {candidate.retention}%
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>{candidate.lastFollowUp}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          setSelectedCandidate(candidate);
                          setIsFollowUpModalOpen(true);
                        }}
                      >
                        <Phone className="h-4 w-4 mr-2" />
                        Follow-up
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Follow-up Modal */}
      <Dialog open={isFollowUpModalOpen} onOpenChange={setIsFollowUpModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Post-Placement Follow-up - {selectedCandidate?.name}</DialogTitle>
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
                      <p><strong>Company:</strong> {selectedCandidate.company}</p>
                      <p><strong>Position:</strong> {selectedCandidate.position}</p>
                    </div>
                    <div>
                      <p><strong>Join Date:</strong> {selectedCandidate.joinDate}</p>
                      <p><strong>Salary:</strong> ₹{selectedCandidate.salary}</p>
                      <p><strong>Current Status:</strong> {getStatusBadge(selectedCandidate.status)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Previous Follow-ups */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Previous Follow-ups</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {selectedCandidate.followUps.map((followUp: any, index: number) => (
                      <div key={index} className="border rounded-lg p-3">
                        <div className="flex justify-between items-start mb-2">
                          <span className="font-medium">{followUp.date}</span>
                          {getStatusBadge(followUp.status)}
                        </div>
                        <p className="text-sm text-gray-700">{followUp.notes}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* New Follow-up */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Record New Follow-up</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Follow-up Date</label>
                      <Input type="date" defaultValue={new Date().toISOString().split('T')[0]} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Current Status</label>
                      <Select defaultValue={selectedCandidate.status}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="working">Working</SelectItem>
                          <SelectItem value="resigned">Resigned</SelectItem>
                          <SelectItem value="terminated">Terminated</SelectItem>
                          <SelectItem value="on_leave">On Leave</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-2">Follow-up Notes</label>
                    <Textarea 
                      placeholder="Enter details about the follow-up conversation..."
                      rows={4}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Satisfaction Level (1-10)</label>
                      <Input type="number" min="1" max="10" placeholder="Rate satisfaction" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Next Follow-up Date</label>
                      <Input type="date" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setIsFollowUpModalOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleFollowUpSave}>
                  Save Follow-up
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PostPlacementTracking;