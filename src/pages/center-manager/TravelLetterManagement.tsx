import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { MapPin, Calendar, Users, FileText, Download, Send, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const TravelLetterManagement = () => {
  const [selectedBatch, setSelectedBatch] = useState('all');
  const [isLetterModalOpen, setIsLetterModalOpen] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState<any>(null);
  const { toast } = useToast();

  // Mock data for travel letters
  const travelLetters = [
    {
      id: 'TL-001',
      candidateName: 'Ravi Kumar',
      batch: 'DDU-GKY-B5',
      company: 'Tech Solutions Pvt Ltd',
      fromLocation: 'Delhi',
      toLocation: 'Noida',
      travelDate: '2024-01-25',
      mode: 'Bus',
      amount: '500',
      status: 'approved',
      requestDate: '2024-01-20'
    },
    {
      id: 'TL-002',
      candidateName: 'Priya Sharma',
      batch: 'DDU-GKY-B6',
      company: 'Hardware Plus',
      fromLocation: 'Delhi',
      toLocation: 'Gurgaon',
      travelDate: '2024-01-28',
      mode: 'Metro',
      amount: '200',
      status: 'pending',
      requestDate: '2024-01-22'
    },
    {
      id: 'TL-003',
      candidateName: 'Amit Singh',
      batch: 'DDU-GKY-B5',
      company: 'DataCorp Solutions',
      fromLocation: 'Delhi',
      toLocation: 'Faridabad',
      travelDate: '2024-01-30',
      mode: 'Bus',
      amount: '300',
      status: 'rejected',
      requestDate: '2024-01-23'
    }
  ];

  const batches = [
    { id: 'all', name: 'All Batches' },
    { id: 'DDU-GKY-B5', name: 'DDU-GKY Batch 5' },
    { id: 'DDU-GKY-B6', name: 'DDU-GKY Batch 6' },
    { id: 'DDU-GKY-B7', name: 'DDU-GKY Batch 7' },
  ];

  const travelModes = [
    { id: 'bus', name: 'Bus' },
    { id: 'train', name: 'Train' },
    { id: 'metro', name: 'Metro' },
    { id: 'taxi', name: 'Taxi' },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-100 text-green-800">Approved</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rejected</Badge>;
      case 'issued':
        return <Badge className="bg-blue-100 text-blue-800">Letter Issued</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const handleLetterAction = (action: 'approve' | 'reject' | 'issue') => {
    toast({
      title: `Travel Letter ${action}d`,
      description: `Travel letter for ${selectedCandidate?.candidateName} has been ${action}d.`,
    });
    setIsLetterModalOpen(false);
  };

  const generateBulkLetters = () => {
    toast({
      title: "Bulk Letters Generated",
      description: "Travel letters have been generated for all approved requests.",
    });
  };

  const filteredData = selectedBatch === 'all' 
    ? travelLetters 
    : travelLetters.filter(letter => letter.batch === selectedBatch);

  return (
    <div className="space-y-6">
      {/* Header & Filters */}
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Travel Letter Management</h1>
        
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
          
          <Button variant="outline" onClick={generateBulkLetters}>
            <Download className="h-4 w-4 mr-2" />
            Generate Bulk Letters
          </Button>
          
          <Button>
            <FileText className="h-4 w-4 mr-2" />
            New Travel Request
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-yellow-600" />
              <div>
                <p className="text-2xl font-bold">
                  {filteredData.filter(l => l.status === 'pending').length}
                </p>
                <p className="text-sm text-muted-foreground">Pending Approval</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-2xl font-bold">
                  {filteredData.filter(l => l.status === 'approved').length}
                </p>
                <p className="text-sm text-muted-foreground">Approved</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Send className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">
                  {filteredData.filter(l => l.status === 'issued').length}
                </p>
                <p className="text-sm text-muted-foreground">Letters Issued</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-2xl font-bold">
                  ₹{filteredData.reduce((sum, l) => sum + parseInt(l.amount), 0)}
                </p>
                <p className="text-sm text-muted-foreground">Total Amount</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Travel Letters Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Travel Letter Requests
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Letter ID</TableHead>
                <TableHead>Candidate Name</TableHead>
                <TableHead>Batch</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>From → To</TableHead>
                <TableHead>Travel Date</TableHead>
                <TableHead>Mode</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map((letter) => (
                <TableRow key={letter.id}>
                  <TableCell className="font-medium">{letter.id}</TableCell>
                  <TableCell>{letter.candidateName}</TableCell>
                  <TableCell>{letter.batch}</TableCell>
                  <TableCell>{letter.company}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {letter.fromLocation}
                      <MapPin className="h-3 w-3" />
                      {letter.toLocation}
                    </div>
                  </TableCell>
                  <TableCell>{letter.travelDate}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{letter.mode}</Badge>
                  </TableCell>
                  <TableCell>₹{letter.amount}</TableCell>
                  <TableCell>{getStatusBadge(letter.status)}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => {
                          setSelectedCandidate(letter);
                          setIsLetterModalOpen(true);
                        }}
                      >
                        Review
                      </Button>
                      {letter.status === 'approved' && (
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Travel Letter Review Modal */}
      <Dialog open={isLetterModalOpen} onOpenChange={setIsLetterModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Review Travel Letter - {selectedCandidate?.id}</DialogTitle>
          </DialogHeader>
          
          {selectedCandidate && (
            <div className="space-y-6">
              {/* Candidate Details */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Candidate Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p><strong>Name:</strong> {selectedCandidate.candidateName}</p>
                      <p><strong>Batch:</strong> {selectedCandidate.batch}</p>
                      <p><strong>Company:</strong> {selectedCandidate.company}</p>
                    </div>
                    <div>
                      <p><strong>Request Date:</strong> {selectedCandidate.requestDate}</p>
                      <p><strong>Travel Date:</strong> {selectedCandidate.travelDate}</p>
                      <p><strong>Status:</strong> {getStatusBadge(selectedCandidate.status)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Travel Details */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Travel Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">From Location</label>
                        <Input defaultValue={selectedCandidate.fromLocation} />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">To Location</label>
                        <Input defaultValue={selectedCandidate.toLocation} />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Travel Mode</label>
                        <Select defaultValue={selectedCandidate.mode.toLowerCase()}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {travelModes.map((mode) => (
                              <SelectItem key={mode.id} value={mode.id}>
                                {mode.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Travel Amount</label>
                        <Input defaultValue={selectedCandidate.amount} />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">Travel Date</label>
                      <Input type="date" defaultValue={selectedCandidate.travelDate} />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Separator />

              {/* Review Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Centre Manager Review</h3>
                
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Review Comments
                  </label>
                  <Textarea
                    placeholder="Add your review comments..."
                    rows={3}
                  />
                </div>
                
                <div className="flex justify-end gap-3">
                  <Button variant="outline" onClick={() => setIsLetterModalOpen(false)}>
                    Cancel
                  </Button>
                  <Button 
                    variant="destructive" 
                    onClick={() => handleLetterAction('reject')}
                  >
                    Reject
                  </Button>
                  <Button onClick={() => handleLetterAction('approve')}>
                    Approve
                  </Button>
                  {selectedCandidate.status === 'approved' && (
                    <Button onClick={() => handleLetterAction('issue')}>
                      Issue Letter
                    </Button>
                  )}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TravelLetterManagement;