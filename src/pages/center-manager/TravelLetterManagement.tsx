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
import { MapPin, Calendar, Users, FileText, Download, Send, Clock, Building2, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const TravelLetterManagement = () => {
  const [selectedBatch, setSelectedBatch] = useState('all');
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [selectedBatchData, setSelectedBatchData] = useState<any>(null);
  const { toast } = useToast();

  // Mock data for batch-wise travel letter requests
  const batchData = [
    {
      id: 'DDU-GKY-B5',
      name: 'DDU-GKY Batch 5',
      company: 'Tech Solutions Pvt Ltd',
      totalCandidates: 25,
      travelingCandidates: 18,
      destination: 'Noida, UP',
      travelDate: '2024-02-15',
      status: 'letter_available', // requested, pending_approval, letter_available
      requestedDate: '2024-01-20',
      letterUploadedDate: '2024-02-10',
      letterUrl: '/documents/travel-letter-batch5.pdf'
    },
    {
      id: 'DDU-GKY-B6',
      name: 'DDU-GKY Batch 6',
      company: 'Hardware Plus India',
      totalCandidates: 30,
      travelingCandidates: 22,
      destination: 'Gurgaon, HR',
      travelDate: '2024-02-20',
      status: 'pending_approval',
      requestedDate: '2024-01-25',
      letterUploadedDate: null,
      letterUrl: null
    },
    {
      id: 'DDU-GKY-B7',
      name: 'DDU-GKY Batch 7',
      company: 'DataCorp Solutions',
      totalCandidates: 20,
      travelingCandidates: 15,
      destination: 'Faridabad, HR',
      travelDate: '2024-03-01',
      status: 'not_requested',
      requestedDate: null,
      letterUploadedDate: null,
      letterUrl: null
    },
    {
      id: 'DDU-GKY-B8',
      name: 'DDU-GKY Batch 8',
      company: 'Future Tech Ltd',
      totalCandidates: 28,
      travelingCandidates: 20,
      destination: 'Mumbai, MH',
      travelDate: '2024-03-10',
      status: 'requested',
      requestedDate: '2024-02-01',
      letterUploadedDate: null,
      letterUrl: null
    }
  ];

  const batches = [
    { id: 'all', name: 'All Batches' },
    ...batchData.map(batch => ({ id: batch.id, name: batch.name }))
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'letter_available':
        return <Badge className="bg-green-100 text-green-800">Letter Available</Badge>;
      case 'pending_approval':
        return <Badge className="bg-yellow-100 text-yellow-800">Pending Approval</Badge>;
      case 'requested':
        return <Badge className="bg-blue-100 text-blue-800">Requested</Badge>;
      case 'not_requested':
        return <Badge variant="secondary">Not Requested</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  const handleRequestTravelLetter = (batch: any) => {
    setSelectedBatchData(batch);
    setIsRequestModalOpen(true);
  };

  const submitTravelLetterRequest = () => {
    // Update batch status to requested and notify PPC Admin
    toast({
      title: "Travel Letter Request Submitted",
      description: `Request sent to PPC Admin for ${selectedBatchData?.name}. You will be notified when the letter is ready.`,
    });
    setIsRequestModalOpen(false);
    
    // In real implementation, this would:
    // 1. Send notification to PPC Admin
    // 2. Update batch status in database
    // 3. Create audit trail
  };

  const downloadTravelLetter = (batch: any) => {
    toast({
      title: "Downloading Travel Letter",
      description: `Travel letter for ${batch.name} is being downloaded.`,
    });
    // In real implementation, this would download the actual file
  };

  const filteredData = selectedBatch === 'all' 
    ? batchData 
    : batchData.filter(batch => batch.id === selectedBatch);

  return (
    <div className="space-y-6">
      {/* Header & Filters */}
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Travel Letter Management</h1>
          <p className="text-muted-foreground mt-1">Request and download batch-wise travel letters for company placements</p>
        </div>
        
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
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-yellow-600" />
              <div>
                <p className="text-2xl font-bold">
                  {filteredData.filter(b => b.status === 'not_requested').length}
                </p>
                <p className="text-sm text-muted-foreground">Not Requested</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">
                  {filteredData.filter(b => b.status === 'pending_approval').length}
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
                  {filteredData.filter(b => b.status === 'letter_available').length}
                </p>
                <p className="text-sm text-muted-foreground">Letters Available</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-2xl font-bold">
                  {filteredData.reduce((sum, b) => sum + b.travelingCandidates, 0)}
                </p>
                <p className="text-sm text-muted-foreground">Total Traveling</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Batch Travel Letters Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Batch-wise Travel Letter Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Batch Details</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Traveling Candidates</TableHead>
                <TableHead>Destination</TableHead>
                <TableHead>Travel Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map((batch) => (
                <TableRow key={batch.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{batch.name}</p>
                      <p className="text-sm text-muted-foreground">ID: {batch.id}</p>
                    </div>
                  </TableCell>
                  <TableCell>{batch.company}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      <span className="font-medium">{batch.travelingCandidates}</span>
                      <span className="text-muted-foreground">/ {batch.totalCandidates}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      {batch.destination}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      {batch.travelDate}
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(batch.status)}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      {batch.status === 'not_requested' && (
                        <Button 
                          size="sm"
                          onClick={() => handleRequestTravelLetter(batch)}
                        >
                          <Send className="h-4 w-4 mr-2" />
                          Request Letter
                        </Button>
                      )}
                      {batch.status === 'letter_available' && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => downloadTravelLetter(batch)}
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                      )}
                      {(batch.status === 'requested' || batch.status === 'pending_approval') && (
                        <Button variant="outline" size="sm" disabled>
                          <Clock className="h-4 w-4 mr-2" />
                          Waiting
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

      {/* Travel Letter Request Modal */}
      <Dialog open={isRequestModalOpen} onOpenChange={setIsRequestModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Request Travel Letter - {selectedBatchData?.name}</DialogTitle>
          </DialogHeader>
          
          {selectedBatchData && (
            <div className="space-y-6">
              {/* Batch Details */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Batch Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p><strong>Batch Name:</strong> {selectedBatchData.name}</p>
                      <p><strong>Batch ID:</strong> {selectedBatchData.id}</p>
                      <p><strong>Company:</strong> {selectedBatchData.company}</p>
                    </div>
                    <div>
                      <p><strong>Total Candidates:</strong> {selectedBatchData.totalCandidates}</p>
                      <p><strong>Traveling Candidates:</strong> {selectedBatchData.travelingCandidates}</p>
                      <p><strong>Destination:</strong> {selectedBatchData.destination}</p>
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
                        <label className="block text-sm font-medium mb-2">Travel Date</label>
                        <Input type="date" defaultValue={selectedBatchData.travelDate} />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Destination</label>
                        <Input defaultValue={selectedBatchData.destination} />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-2">Special Requirements/Notes</label>
                      <Textarea
                        placeholder="Any special requirements for travel arrangement, accommodation details, or other notes..."
                        rows={3}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Separator />

              {/* Important Information */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-blue-900">Important Information</h4>
                    <p className="text-sm text-blue-700 mt-1">
                      Once you submit this request, a notification will be sent to the PPC Admin team. 
                      They will process your request and upload the official travel letter for your batch. 
                      You will be notified when the letter is ready for download.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setIsRequestModalOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={submitTravelLetterRequest}>
                  <Send className="h-4 w-4 mr-2" />
                  Submit Request
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TravelLetterManagement;