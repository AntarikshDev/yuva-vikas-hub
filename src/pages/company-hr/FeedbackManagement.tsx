import React, { useState } from 'react';
import { MessageSquare, AlertTriangle, CheckCircle, Clock, User, Building } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Mock data
const mockCandidateFeedback = [
  {
    id: 1,
    candidateName: "Ravi Kumar",
    batch: "Batch RSA-001",
    issueCategory: "Workplace",
    issue: "Working hours are too long without breaks",
    description: "We are being asked to work 12 hours without proper breaks which is affecting our health.",
    date: "2025-07-20",
    status: "Open",
    priority: "High",
    response: null,
    phone: "+91 9876543201",
    email: "ravi.kumar@email.com"
  },
  {
    id: 2,
    candidateName: "Priya Sharma",
    batch: "Batch RSA-001",
    issueCategory: "Accommodation",
    issue: "Poor accommodation facilities",
    description: "The accommodation provided has poor hygiene conditions and inadequate facilities.",
    date: "2025-07-19",
    status: "In Progress",
    priority: "Medium",
    response: "We are working with the accommodation provider to resolve this issue.",
    phone: "+91 9876543202",
    email: "priya.sharma@email.com"
  },
  {
    id: 3,
    candidateName: "Amit Patel",
    batch: "Batch CSE-002",
    issueCategory: "Salary",
    issue: "Salary payment delayed",
    description: "Salary for last month has not been credited to the account as promised.",
    date: "2025-07-18",
    status: "Resolved",
    priority: "High",
    response: "Salary has been processed and will be credited within 2 working days.",
    phone: "+91 9876543203",
    email: "amit.patel@email.com"
  }
];

const mockCentreFeedback = [
  {
    id: 1,
    centreName: "LNJ Skills Centre - Bangalore",
    contactPerson: "Rajesh Kumar",
    issueCategory: "Infrastructure",
    issue: "Training equipment malfunction",
    description: "Computer systems in training lab are frequently malfunctioning affecting training quality.",
    date: "2025-07-20",
    status: "Open",
    priority: "High",
    response: null
  },
  {
    id: 2,
    centreName: "LNJ Skills Centre - Chennai",
    contactPerson: "Meera Nair",
    issueCategory: "Staffing",
    issue: "Shortage of trainers",
    description: "Need additional trainers for upcoming batches to maintain quality of training.",
    date: "2025-07-19",
    status: "In Progress",
    priority: "Medium",
    response: "Recruitment process has been initiated for additional trainers."
  }
];

const FeedbackManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState("candidate");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedFeedback, setSelectedFeedback] = useState<any>(null);
  const [isResponseModalOpen, setIsResponseModalOpen] = useState(false);
  const [responseText, setResponseText] = useState("");
  const [isIssueModalOpen, setIsIssueModalOpen] = useState(false);
  
  // Issue reporting form state
  const [issueData, setIssueData] = useState({
    candidates: [],
    issueType: "",
    description: "",
    document: null
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Open': return 'bg-red-100 text-red-800';
      case 'In Progress': return 'bg-yellow-100 text-yellow-800';
      case 'Resolved': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'bg-red-100 text-red-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredCandidateFeedback = mockCandidateFeedback.filter(feedback => {
    return (
      (!selectedCategory || feedback.issueCategory === selectedCategory) &&
      (!selectedStatus || feedback.status === selectedStatus) &&
      (!searchTerm || feedback.candidateName.toLowerCase().includes(searchTerm.toLowerCase()) || 
       feedback.issue.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  });

  const filteredCentreFeedback = mockCentreFeedback.filter(feedback => {
    return (
      (!selectedCategory || feedback.issueCategory === selectedCategory) &&
      (!selectedStatus || feedback.status === selectedStatus) &&
      (!searchTerm || feedback.centreName.toLowerCase().includes(searchTerm.toLowerCase()) || 
       feedback.issue.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  });

  const openResponseModal = (feedback: any) => {
    setSelectedFeedback(feedback);
    setResponseText(feedback.response || "");
    setIsResponseModalOpen(true);
  };

  const markAsResolved = (feedbackId: number) => {
    console.log("Marking feedback as resolved:", feedbackId);
    // Implementation to update feedback status
  };

  const submitResponse = () => {
    console.log("Submitting response for feedback:", selectedFeedback.id, responseText);
    setIsResponseModalOpen(false);
    setResponseText("");
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Feedback & Issues Management</h1>
          <p className="text-gray-600 mt-1">Monitor and respond to candidate and centre feedback</p>
        </div>
        
        <Button onClick={() => setIsIssueModalOpen(true)}>
          <AlertTriangle className="h-4 w-4 mr-2" />
          Raise Issue to LNJ
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Feedback</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {mockCandidateFeedback.length + mockCentreFeedback.length}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open Issues</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {[...mockCandidateFeedback, ...mockCentreFeedback].filter(f => f.status === 'Open').length}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {[...mockCandidateFeedback, ...mockCentreFeedback].filter(f => f.status === 'In Progress').length}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Resolved</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {[...mockCandidateFeedback, ...mockCentreFeedback].filter(f => f.status === 'Resolved').length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Input
              placeholder="Search feedback..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Workplace">Workplace</SelectItem>
                <SelectItem value="Accommodation">Accommodation</SelectItem>
                <SelectItem value="Salary">Salary</SelectItem>
                <SelectItem value="Infrastructure">Infrastructure</SelectItem>
                <SelectItem value="Staffing">Staffing</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Open">Open</SelectItem>
                <SelectItem value="In Progress">In Progress</SelectItem>
                <SelectItem value="Resolved">Resolved</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" onClick={() => {
              setSelectedCategory("");
              setSelectedStatus("");
              setSearchTerm("");
            }}>
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Feedback Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="candidate">Candidate Feedback</TabsTrigger>
          <TabsTrigger value="centre">Centre Feedback</TabsTrigger>
        </TabsList>
        
        <TabsContent value="candidate">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Candidate Feedback ({filteredCandidateFeedback.length})
              </CardTitle>
              <CardDescription>Feedback and issues reported by candidates</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Candidate</TableHead>
                    <TableHead>Batch</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Issue</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCandidateFeedback.map((feedback) => (
                    <TableRow key={feedback.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{feedback.candidateName}</p>
                          <p className="text-sm text-gray-600">{feedback.phone}</p>
                        </div>
                      </TableCell>
                      <TableCell>{feedback.batch}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{feedback.issueCategory}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="max-w-xs">
                          <p className="font-medium truncate">{feedback.issue}</p>
                          <p className="text-sm text-gray-600 truncate">{feedback.description}</p>
                        </div>
                      </TableCell>
                      <TableCell>{feedback.date}</TableCell>
                      <TableCell>
                        <Badge className={getPriorityColor(feedback.priority)} variant="secondary">
                          {feedback.priority}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(feedback.status)} variant="secondary">
                          {feedback.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => openResponseModal(feedback)}
                          >
                            {feedback.response ? 'View Response' : 'Add Response'}
                          </Button>
                          {feedback.status !== 'Resolved' && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => markAsResolved(feedback.id)}
                            >
                              <CheckCircle className="h-4 w-4" />
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
        </TabsContent>
        
        <TabsContent value="centre">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5" />
                Centre Feedback ({filteredCentreFeedback.length})
              </CardTitle>
              <CardDescription>Feedback and issues reported by training centres</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Centre</TableHead>
                    <TableHead>Contact Person</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Issue</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCentreFeedback.map((feedback) => (
                    <TableRow key={feedback.id}>
                      <TableCell>
                        <p className="font-medium">{feedback.centreName}</p>
                      </TableCell>
                      <TableCell>{feedback.contactPerson}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{feedback.issueCategory}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="max-w-xs">
                          <p className="font-medium truncate">{feedback.issue}</p>
                          <p className="text-sm text-gray-600 truncate">{feedback.description}</p>
                        </div>
                      </TableCell>
                      <TableCell>{feedback.date}</TableCell>
                      <TableCell>
                        <Badge className={getPriorityColor(feedback.priority)} variant="secondary">
                          {feedback.priority}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(feedback.status)} variant="secondary">
                          {feedback.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => openResponseModal(feedback)}
                          >
                            {feedback.response ? 'View Response' : 'Add Response'}
                          </Button>
                          {feedback.status !== 'Resolved' && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => markAsResolved(feedback.id)}
                            >
                              <CheckCircle className="h-4 w-4" />
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
        </TabsContent>
      </Tabs>

      {/* Response Modal */}
      <Dialog open={isResponseModalOpen} onOpenChange={setIsResponseModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {selectedFeedback?.response ? 'View Response' : 'Add Response'}
            </DialogTitle>
            <DialogDescription>
              {selectedFeedback?.issue}
            </DialogDescription>
          </DialogHeader>
          
          {selectedFeedback && (
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium mb-2">Issue Details:</h4>
                <p className="text-sm text-gray-700">{selectedFeedback.description}</p>
                <div className="mt-2 flex gap-4 text-sm text-gray-600">
                  <span>Category: {selectedFeedback.issueCategory}</span>
                  <span>Priority: {selectedFeedback.priority}</span>
                  <span>Date: {selectedFeedback.date}</span>
                </div>
              </div>
              
              <div>
                <Label htmlFor="response">Response</Label>
                <Textarea
                  id="response"
                  placeholder="Enter your response to this feedback..."
                  value={responseText}
                  onChange={(e) => setResponseText(e.target.value)}
                  rows={4}
                  disabled={selectedFeedback.status === 'Resolved'}
                />
              </div>
              
              {selectedFeedback.status !== 'Resolved' && (
                <div className="flex gap-4">
                  <Button onClick={submitResponse} className="flex-1">
                    Submit Response
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => markAsResolved(selectedFeedback.id)}
                    className="flex-1"
                  >
                    Mark as Resolved
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Issue Reporting Modal */}
      <Dialog open={isIssueModalOpen} onOpenChange={setIsIssueModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Raise Issue to LNJ</DialogTitle>
            <DialogDescription>
              Report issues or concerns that require LNJ's attention
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="issueType">Issue Type</Label>
              <Select value={issueData.issueType} onValueChange={(value) => setIssueData({...issueData, issueType: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Issue Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Salary Delay">Salary Delay</SelectItem>
                  <SelectItem value="Accommodation">Accommodation Issues</SelectItem>
                  <SelectItem value="Training Quality">Training Quality</SelectItem>
                  <SelectItem value="Centre Infrastructure">Centre Infrastructure</SelectItem>
                  <SelectItem value="Policy Violation">Policy Violation</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe the issue in detail..."
                value={issueData.description}
                onChange={(e) => setIssueData({...issueData, description: e.target.value})}
                rows={4}
              />
            </div>

            <div>
              <Label htmlFor="document">Attach Document (Optional)</Label>
              <Input
                id="document"
                type="file"
                onChange={(e) => setIssueData({...issueData, document: e.target.files?.[0] || null})}
              />
            </div>

            <div className="flex gap-4 pt-4">
              <Button className="flex-1" onClick={() => setIsIssueModalOpen(false)}>
                Submit Issue
              </Button>
              <Button 
                className="flex-1" 
                variant="outline" 
                onClick={() => setIssueData({candidates: [], issueType: "", description: "", document: null})}
              >
                Reset Form
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FeedbackManagement;