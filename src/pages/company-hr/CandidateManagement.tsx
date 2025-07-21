import React, { useState } from 'react';
import { FileText, Download, Upload, User, Phone, Mail, Eye, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";

// Mock data
const mockCandidates = [
  {
    id: 1,
    name: "Ravi Kumar",
    batch: "Batch RSA-001",
    jobRole: "Retail Sales Associate",
    stage: "Ready for Interview",
    attendancePercentage: 92,
    assessmentScore: 85,
    phone: "+91 9876543201",
    email: "ravi.kumar@email.com",
    address: "123 Main St, Bangalore",
    documents: ["Aadhar", "PAN", "Educational Certificate"],
    offerLetterStatus: "Not Issued",
    joiningDate: null,
    salary: null,
    location: "Bangalore"
  },
  {
    id: 2,
    name: "Priya Sharma",
    batch: "Batch RSA-001",
    jobRole: "Retail Sales Associate",
    stage: "Documents Pending",
    attendancePercentage: 88,
    assessmentScore: 78,
    phone: "+91 9876543202",
    email: "priya.sharma@email.com",
    address: "456 Park Ave, Mumbai",
    documents: ["Aadhar", "Educational Certificate"],
    offerLetterStatus: "Not Issued",
    joiningDate: null,
    salary: null,
    location: "Mumbai"
  },
  {
    id: 3,
    name: "Amit Patel",
    batch: "Batch CSE-002",
    jobRole: "Customer Service Executive",
    stage: "Ready for Interview",
    attendancePercentage: 95,
    assessmentScore: 82,
    phone: "+91 9876543203",
    email: "amit.patel@email.com",
    address: "789 Oak St, Chennai",
    documents: ["Aadhar", "PAN", "Educational Certificate", "Medical Certificate"],
    offerLetterStatus: "Issued",
    joiningDate: "2025-08-01",
    salary: "18000",
    location: "Chennai"
  }
];

const CandidateManagement: React.FC = () => {
  const [selectedBatch, setSelectedBatch] = useState<string>("");
  const [selectedJobRole, setSelectedJobRole] = useState<string>("");
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedCandidates, setSelectedCandidates] = useState<number[]>([]);
  const [isOfferLetterModalOpen, setIsOfferLetterModalOpen] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState<any>(null);

  // Offer letter form state
  const [offerLetterData, setOfferLetterData] = useState({
    candidateName: "",
    jobRole: "",
    salary: "",
    ctc: "",
    designation: "",
    joiningDate: "",
    joiningLocation: "",
    companyLogo: null,
    digitalSignature: null
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Ready for Interview': return 'bg-green-100 text-green-800';
      case 'Documents Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Interview Scheduled': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getOfferStatusColor = (status: string) => {
    switch (status) {
      case 'Issued': return 'bg-green-100 text-green-800';
      case 'Not Issued': return 'bg-red-100 text-red-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredCandidates = mockCandidates.filter(candidate => {
    return (
      (!selectedBatch || candidate.batch === selectedBatch) &&
      (!selectedJobRole || candidate.jobRole === selectedJobRole) &&
      (!selectedStatus || candidate.stage === selectedStatus) &&
      (!searchTerm || candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
       candidate.email.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  });

  const handleCandidateSelection = (candidateId: number, checked: boolean) => {
    if (checked) {
      setSelectedCandidates([...selectedCandidates, candidateId]);
    } else {
      setSelectedCandidates(selectedCandidates.filter(id => id !== candidateId));
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedCandidates(filteredCandidates.map(c => c.id));
    } else {
      setSelectedCandidates([]);
    }
  };

  const openOfferLetterModal = (candidate: any) => {
    setSelectedCandidate(candidate);
    setOfferLetterData({
      candidateName: candidate.name,
      jobRole: candidate.jobRole,
      salary: candidate.salary || "",
      ctc: "",
      designation: "",
      joiningDate: candidate.joiningDate || "",
      joiningLocation: candidate.location,
      companyLogo: null,
      digitalSignature: null
    });
    setIsOfferLetterModalOpen(true);
  };

  const handleBulkOfferLetters = () => {
    const selectedCandidateData = filteredCandidates.filter(c => selectedCandidates.includes(c.id));
    console.log("Generating bulk offer letters for:", selectedCandidateData);
    // Implementation for bulk offer letter generation
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Candidate Management</h1>
          <p className="text-gray-600 mt-1">Manage candidates and generate offer letters</p>
        </div>
        
        <div className="flex gap-2">
          <Button 
            onClick={handleBulkOfferLetters}
            disabled={selectedCandidates.length === 0}
            className="flex items-center gap-2"
          >
            <FileText className="h-4 w-4" />
            Bulk Offer Letters ({selectedCandidates.length})
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <Input
              placeholder="Search candidates..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            
            <Select value={selectedBatch} onValueChange={setSelectedBatch}>
              <SelectTrigger>
                <SelectValue placeholder="Batch" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Batch RSA-001">Batch RSA-001</SelectItem>
                <SelectItem value="Batch CSE-002">Batch CSE-002</SelectItem>
                <SelectItem value="Batch DEO-003">Batch DEO-003</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedJobRole} onValueChange={setSelectedJobRole}>
              <SelectTrigger>
                <SelectValue placeholder="Job Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Retail Sales Associate">Retail Sales Associate</SelectItem>
                <SelectItem value="Customer Service Executive">Customer Service Executive</SelectItem>
                <SelectItem value="Data Entry Operator">Data Entry Operator</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Ready for Interview">Ready for Interview</SelectItem>
                <SelectItem value="Documents Pending">Documents Pending</SelectItem>
                <SelectItem value="Interview Scheduled">Interview Scheduled</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" onClick={() => {
              setSelectedBatch("");
              setSelectedJobRole("");
              setSelectedStatus("");
              setSearchTerm("");
            }}>
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Candidates Table */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Candidates ({filteredCandidates.length})</CardTitle>
              <CardDescription>Select candidates for bulk operations</CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="select-all"
                checked={selectedCandidates.length === filteredCandidates.length && filteredCandidates.length > 0}
                onCheckedChange={handleSelectAll}
              />
              <Label htmlFor="select-all">Select All</Label>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">Select</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Batch</TableHead>
                <TableHead>Stage</TableHead>
                <TableHead>Attendance</TableHead>
                <TableHead>Assessment</TableHead>
                <TableHead>Contact</TableHead>
                <TableHead>Offer Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCandidates.map((candidate) => (
                <TableRow key={candidate.id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedCandidates.includes(candidate.id)}
                      onCheckedChange={(checked) => handleCandidateSelection(candidate.id, checked as boolean)}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-gray-500" />
                      <span className="font-medium">{candidate.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>{candidate.batch}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(candidate.stage)} variant="secondary">
                      {candidate.stage}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className="font-medium">{candidate.attendancePercentage}%</span>
                  </TableCell>
                  <TableCell>
                    <span className="font-medium">{candidate.assessmentScore}%</span>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center gap-1 text-xs">
                        <Phone className="h-3 w-3" />
                        <span>{candidate.phone}</span>
                      </div>
                      <div className="flex items-center gap-1 text-xs">
                        <Mail className="h-3 w-3" />
                        <span>{candidate.email}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getOfferStatusColor(candidate.offerLetterStatus)} variant="secondary">
                      {candidate.offerLetterStatus}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => openOfferLetterModal(candidate)}
                        disabled={candidate.offerLetterStatus === 'Issued'}
                      >
                        <FileText className="h-4 w-4 mr-1" />
                        {candidate.offerLetterStatus === 'Issued' ? 'Issued' : 'Generate Offer'}
                      </Button>
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Offer Letter Modal */}
      <Dialog open={isOfferLetterModalOpen} onOpenChange={setIsOfferLetterModalOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Generate Offer Letter</DialogTitle>
            <DialogDescription>
              Create and customize offer letter for {selectedCandidate?.name}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="candidateName">Candidate Name</Label>
                <Input
                  id="candidateName"
                  value={offerLetterData.candidateName}
                  disabled
                />
              </div>
              <div>
                <Label htmlFor="jobRole">Job Role</Label>
                <Input
                  id="jobRole"
                  value={offerLetterData.jobRole}
                  onChange={(e) => setOfferLetterData({...offerLetterData, jobRole: e.target.value})}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="salary">Monthly Salary</Label>
                <Input
                  id="salary"
                  placeholder="18000"
                  value={offerLetterData.salary}
                  onChange={(e) => setOfferLetterData({...offerLetterData, salary: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="ctc">Annual CTC</Label>
                <Input
                  id="ctc"
                  placeholder="216000"
                  value={offerLetterData.ctc}
                  onChange={(e) => setOfferLetterData({...offerLetterData, ctc: e.target.value})}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="designation">Designation</Label>
                <Input
                  id="designation"
                  placeholder="Sales Associate"
                  value={offerLetterData.designation}
                  onChange={(e) => setOfferLetterData({...offerLetterData, designation: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="joiningDate">Joining Date</Label>
                <Input
                  id="joiningDate"
                  type="date"
                  value={offerLetterData.joiningDate}
                  onChange={(e) => setOfferLetterData({...offerLetterData, joiningDate: e.target.value})}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="joiningLocation">Joining Location</Label>
              <Input
                id="joiningLocation"
                value={offerLetterData.joiningLocation}
                onChange={(e) => setOfferLetterData({...offerLetterData, joiningLocation: e.target.value})}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="companyLogo">Company Logo</Label>
                <Input
                  id="companyLogo"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setOfferLetterData({...offerLetterData, companyLogo: e.target.files?.[0] || null})}
                />
              </div>
              <div>
                <Label htmlFor="digitalSignature">Digital Signature</Label>
                <Input
                  id="digitalSignature"
                  type="file"
                  accept="image/*"
                  onChange={(e) => setOfferLetterData({...offerLetterData, digitalSignature: e.target.files?.[0] || null})}
                />
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <Button className="flex-1">
                <Eye className="h-4 w-4 mr-2" />
                Preview PDF
              </Button>
              <Button className="flex-1" variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Download PDF
              </Button>
              <Button 
                className="flex-1" 
                onClick={() => {
                  // Update candidate status to "Issued"
                  setIsOfferLetterModalOpen(false);
                }}
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Issue Offer Letter
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CandidateManagement;