import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { AlertCircle, CheckCircle, XCircle, Eye, Send, FileCheck } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const DocumentCompliance = () => {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [isActionModalOpen, setIsActionModalOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<any>(null);
  const [actionType, setActionType] = useState<'approve' | 'reject'>('approve');
  const [comments, setComments] = useState('');
  const { toast } = useToast();

  // Mock data for document compliance
  const documentsData = [
    {
      id: 'C-001',
      name: 'Ravi Kumar',
      batch: 'DDU-GKY-B5',
      aadhaar: 'approved',
      bankPassbook: 'approved',
      bpl: 'approved',
      education: 'pending',
      caste: 'approved',
      otherDocs: 'rejected',
      compliance: 83.3,
      lastUpdated: '2024-01-15'
    },
    {
      id: 'C-002',
      name: 'Priya Sharma',
      batch: 'DDU-GKY-B6',
      aadhaar: 'approved',
      bankPassbook: 'pending',
      bpl: 'rejected',
      education: 'approved',
      caste: 'approved',
      otherDocs: 'approved',
      compliance: 66.7,
      lastUpdated: '2024-01-14'
    },
    {
      id: 'C-003',
      name: 'Amit Singh',
      batch: 'DDU-GKY-B5',
      aadhaar: 'approved',
      bankPassbook: 'approved',
      bpl: 'approved',
      education: 'approved',
      caste: 'approved',
      otherDocs: 'approved',
      compliance: 100,
      lastUpdated: '2024-01-13'
    },
    {
      id: 'C-004',
      name: 'Sunita Devi',
      batch: 'DDU-GKY-B7',
      aadhaar: 'pending',
      bankPassbook: 'pending',
      bpl: 'pending',
      education: 'pending',
      caste: 'pending',
      otherDocs: 'pending',
      compliance: 0,
      lastUpdated: '2024-01-16'
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'rejected':
        return <XCircle className="h-5 w-5 text-red-600" />;
      case 'pending':
        return <AlertCircle className="h-5 w-5 text-yellow-600" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-400" />;
    }
  };

  const getComplianceColor = (percentage: number) => {
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const filteredData = documentsData.filter(doc => {
    if (selectedFilter === 'all') return true;
    if (selectedFilter === 'missing') return doc.compliance < 100;
    if (selectedFilter === 'approved') return doc.compliance === 100;
    if (selectedFilter === 'rejected') {
      return [doc.aadhaar, doc.bankPassbook, doc.bpl, doc.education, doc.caste, doc.otherDocs].includes('rejected');
    }
    return true;
  });

  const handleDocumentAction = (document: any, docType: string, action: 'approve' | 'reject') => {
    setSelectedDocument({ ...document, docType });
    setActionType(action);
    setIsActionModalOpen(true);
  };

  const submitAction = () => {
    toast({
      title: `Document ${actionType}d`,
      description: `${selectedDocument.name}'s ${selectedDocument.docType} has been ${actionType}d.`,
    });
    setIsActionModalOpen(false);
    setComments('');
  };

  const sendBulkReminder = () => {
    toast({
      title: "Reminder Sent",
      description: "Bulk reminder sent to all candidates with pending documents.",
    });
  };

  return (
    <div className="space-y-6">
        {/* Header & Filters */}
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Document Compliance Tracker</h1>
          
          <div className="flex gap-3">
            <Select value={selectedFilter} onValueChange={setSelectedFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Documents</SelectItem>
                <SelectItem value="missing">Missing/Incomplete</SelectItem>
                <SelectItem value="approved">All Approved</SelectItem>
                <SelectItem value="rejected">Has Rejected</SelectItem>
              </SelectContent>
            </Select>
            
            <Button onClick={sendBulkReminder} className="flex items-center gap-2">
              <Send className="h-4 w-4" />
              Send Bulk Reminder
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-2xl font-bold">1</p>
                  <p className="text-sm text-muted-foreground">Fully Compliant</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-yellow-600" />
                <div>
                  <p className="text-2xl font-bold">2</p>
                  <p className="text-sm text-muted-foreground">Partially Complete</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <XCircle className="h-5 w-5 text-red-600" />
                <div>
                  <p className="text-2xl font-bold">1</p>
                  <p className="text-sm text-muted-foreground">Not Started</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <FileCheck className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-2xl font-bold">62.5%</p>
                  <p className="text-sm text-muted-foreground">Avg. Compliance</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Document Compliance Table */}
        <Card>
          <CardHeader>
            <CardTitle>Document Status Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Candidate Name</TableHead>
                    <TableHead>Batch</TableHead>
                    <TableHead className="text-center">Aadhaar</TableHead>
                    <TableHead className="text-center">Bank Passbook</TableHead>
                    <TableHead className="text-center">BPL Certificate</TableHead>
                    <TableHead className="text-center">Education</TableHead>
                    <TableHead className="text-center">Caste Certificate</TableHead>
                    <TableHead className="text-center">Other Docs</TableHead>
                    <TableHead>Compliance %</TableHead>
                    <TableHead>Last Updated</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredData.map((candidate) => (
                    <TableRow key={candidate.id}>
                      <TableCell className="font-medium">{candidate.name}</TableCell>
                      <TableCell>{candidate.batch}</TableCell>
                      <TableCell className="text-center">
                        <div className="flex justify-center gap-1">
                          {getStatusIcon(candidate.aadhaar)}
                          {candidate.aadhaar === 'pending' && (
                            <div className="flex gap-1 ml-2">
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="h-6 px-2 text-xs"
                                onClick={() => handleDocumentAction(candidate, 'Aadhaar', 'approve')}
                              >
                                ✓
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="h-6 px-2 text-xs"
                                onClick={() => handleDocumentAction(candidate, 'Aadhaar', 'reject')}
                              >
                                ✗
                              </Button>
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex justify-center gap-1">
                          {getStatusIcon(candidate.bankPassbook)}
                          {candidate.bankPassbook === 'pending' && (
                            <div className="flex gap-1 ml-2">
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="h-6 px-2 text-xs"
                                onClick={() => handleDocumentAction(candidate, 'Bank Passbook', 'approve')}
                              >
                                ✓
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="h-6 px-2 text-xs"
                                onClick={() => handleDocumentAction(candidate, 'Bank Passbook', 'reject')}
                              >
                                ✗
                              </Button>
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex justify-center gap-1">
                          {getStatusIcon(candidate.bpl)}
                          {candidate.bpl === 'pending' && (
                            <div className="flex gap-1 ml-2">
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="h-6 px-2 text-xs"
                                onClick={() => handleDocumentAction(candidate, 'BPL Certificate', 'approve')}
                              >
                                ✓
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="h-6 px-2 text-xs"
                                onClick={() => handleDocumentAction(candidate, 'BPL Certificate', 'reject')}
                              >
                                ✗
                              </Button>
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex justify-center gap-1">
                          {getStatusIcon(candidate.education)}
                          {candidate.education === 'pending' && (
                            <div className="flex gap-1 ml-2">
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="h-6 px-2 text-xs"
                                onClick={() => handleDocumentAction(candidate, 'Education Certificate', 'approve')}
                              >
                                ✓
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="h-6 px-2 text-xs"
                                onClick={() => handleDocumentAction(candidate, 'Education Certificate', 'reject')}
                              >
                                ✗
                              </Button>
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex justify-center gap-1">
                          {getStatusIcon(candidate.caste)}
                          {candidate.caste === 'pending' && (
                            <div className="flex gap-1 ml-2">
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="h-6 px-2 text-xs"
                                onClick={() => handleDocumentAction(candidate, 'Caste Certificate', 'approve')}
                              >
                                ✓
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="h-6 px-2 text-xs"
                                onClick={() => handleDocumentAction(candidate, 'Caste Certificate', 'reject')}
                              >
                                ✗
                              </Button>
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex justify-center gap-1">
                          {getStatusIcon(candidate.otherDocs)}
                          {candidate.otherDocs === 'pending' && (
                            <div className="flex gap-1 ml-2">
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="h-6 px-2 text-xs"
                                onClick={() => handleDocumentAction(candidate, 'Other Documents', 'approve')}
                              >
                                ✓
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="h-6 px-2 text-xs"
                                onClick={() => handleDocumentAction(candidate, 'Other Documents', 'reject')}
                              >
                                ✗
                              </Button>
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Progress value={candidate.compliance} className="w-16" />
                          <span className={`text-sm font-medium ${getComplianceColor(candidate.compliance)}`}>
                            {candidate.compliance}%
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {candidate.lastUpdated}
                      </TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Document Action Modal */}
        <Dialog open={isActionModalOpen} onOpenChange={setIsActionModalOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {actionType === 'approve' ? 'Approve' : 'Reject'} Document
              </DialogTitle>
            </DialogHeader>
            
            {selectedDocument && (
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p><strong>Candidate:</strong> {selectedDocument.name}</p>
                  <p><strong>Document:</strong> {selectedDocument.docType}</p>
                  <p><strong>Action:</strong> {actionType}</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Comments {actionType === 'reject' && <span className="text-red-500">*</span>}
                  </label>
                  <Textarea
                    value={comments}
                    onChange={(e) => setComments(e.target.value)}
                    placeholder={
                      actionType === 'approve' 
                        ? "Optional approval comments..." 
                        : "Please provide reason for rejection..."
                    }
                    rows={3}
                  />
                </div>
                
                <div className="flex justify-end gap-3">
                  <Button variant="outline" onClick={() => setIsActionModalOpen(false)}>
                    Cancel
                  </Button>
                  <Button 
                    onClick={submitAction}
                    disabled={actionType === 'reject' && !comments.trim()}
                    variant={actionType === 'approve' ? 'default' : 'destructive'}
                  >
                    {actionType === 'approve' ? 'Approve' : 'Reject'}
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
  );
};

export default DocumentCompliance;