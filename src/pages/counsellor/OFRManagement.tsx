import { useState } from "react";
import { MainLayout } from "@/layouts/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Search, RefreshCw, Download, Phone, Eye, Edit2, Users, FileText, MapPin } from "lucide-react";

// Mock data
const mockDistricts = [
  "Mumbai", "Pune", "Nagpur", "Nashik", "Aurangabad", "Solapur", "Amravati", "Kolhapur"
];

const mockMobilizers = [
  { id: 1, name: "Rajesh Kumar", type: "Mobiliser Manager", district: "Mumbai", ofrCount: 45 },
  { id: 2, name: "Priya Sharma", type: "CRP", district: "Mumbai", ofrCount: 32 },
  { id: 3, name: "Amit Patel", type: "Mobiliser Manager", district: "Pune", ofrCount: 28 },
  { id: 4, name: "Sneha Desai", type: "CRP", district: "Pune", ofrCount: 19 },
  { id: 5, name: "Vikram Singh", type: "Mobiliser Manager", district: "Nagpur", ofrCount: 38 },
];

const mockCandidates = [
  {
    id: 1,
    name: "Aadhya Sharma",
    fatherName: "Ramesh Sharma",
    mobile: "9876543210",
    email: "aadhya@email.com",
    district: "Mumbai",
    status: "Pending Verification",
    mobilizer: "Rajesh Kumar",
    bloodGroup: "O+",
    motherTongue: "Hindi",
    religion: "Hindu",
    community: "General",
    motherName: "Sunita Sharma",
    guardiansName: "Ramesh Sharma",
    maritalStatus: "Single",
    spouseName: "",
    annualIncome: "2,50,000",
    address: "Plot 123, Sector 15, Vashi, Mumbai"
  },
  {
    id: 2,
    name: "Bhavesh Patel",
    fatherName: "Kiran Patel",
    mobile: "9876543211",
    email: "bhavesh@email.com",
    district: "Mumbai",
    status: "Pending Verification",
    mobilizer: "Rajesh Kumar",
    bloodGroup: "A+",
    motherTongue: "Gujarati",
    religion: "Hindu",
    community: "OBC",
    motherName: "Meera Patel",
    guardiansName: "Kiran Patel",
    maritalStatus: "Single",
    spouseName: "",
    annualIncome: "1,80,000",
    address: "A-45, Andheri West, Mumbai"
  }
];

const candidateStatuses = [
  "Ready for Migration",
  "Not Interested",
  "Need More Counselling", 
  "Need Parent Counselling",
  "Health Issue",
  "Not Now but in Near Future",
  "Documents Pending",
  "Verification Failed"
];

export default function OFRManagement() {
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedMobilizer, setSelectedMobilizer] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [pulledCandidates, setPulledCandidates] = useState<any[]>([]);
  const [showCandidatesDialog, setShowCandidatesDialog] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState<any>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [counsellingNotes, setCounsellingNotes] = useState("");
  const [newStatus, setNewStatus] = useState("");
  const { toast } = useToast();

  const filteredMobilizers = mockMobilizers.filter(mobilizer => {
    const matchesDistrict = !selectedDistrict || mobilizer.district === selectedDistrict;
    const matchesSearch = !searchTerm || 
      mobilizer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mobilizer.type.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesDistrict && matchesSearch;
  });

  const handlePullOFRs = (mobilizer: any) => {
    const candidates = mockCandidates.filter(c => c.mobilizer === mobilizer.name);
    setPulledCandidates(candidates);
    setShowCandidatesDialog(true);
    toast({
      title: "OFRs Pulled Successfully",
      description: `Pulled ${candidates.length} candidate OFRs from ${mobilizer.name}`,
    });
  };

  const handleReset = () => {
    setSelectedDistrict("");
    setSelectedMobilizer("");
    setSearchTerm("");
  };

  const handleCallCandidate = (candidate: any) => {
    toast({
      title: "Calling Candidate",
      description: `Initiating call to ${candidate.name} (${candidate.mobile})`,
    });
  };

  const handleViewDetails = (candidate: any) => {
    setSelectedCandidate(candidate);
    setNewStatus(candidate.status);
    setShowDetailsDialog(true);
  };

  const handleUpdateStatus = () => {
    if (!newStatus) {
      toast({
        title: "Status Required",
        description: "Please select a status before updating.",
        variant: "destructive"
      });
      return;
    }

    // Update the candidate status
    const updatedCandidates = pulledCandidates.map(c => 
      c.id === selectedCandidate.id 
        ? { ...c, status: newStatus, counsellingNotes }
        : c
    );
    setPulledCandidates(updatedCandidates);

    toast({
      title: "Status Updated",
      description: `${selectedCandidate.name}'s status updated to "${newStatus}"`,
    });

    setShowDetailsDialog(false);
    setCounsellingNotes("");
    setNewStatus("");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Ready for Migration": return "bg-green-100 text-green-800";
      case "Not Interested": return "bg-red-100 text-red-800";
      case "Need More Counselling": return "bg-yellow-100 text-yellow-800";
      case "Need Parent Counselling": return "bg-orange-100 text-orange-800";
      case "Health Issue": return "bg-purple-100 text-purple-800";
      case "Not Now but in Near Future": return "bg-blue-100 text-blue-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <MainLayout role="counsellor">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-primary">OFR Management</h1>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <FileText className="h-4 w-4" />
            Pull and process candidate OFRs from mobilizers
          </div>
        </div>

        {/* Filter Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Filter OFRs
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="district">District</Label>
                <Select value={selectedDistrict} onValueChange={setSelectedDistrict}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select District" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockDistricts.map((district) => (
                      <SelectItem key={district} value={district}>
                        {district}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="search">Search Mobilizer</Label>
                <Input
                  id="search"
                  placeholder="Search by name or type..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="space-y-2 flex items-end">
                <Button onClick={handleReset} variant="outline" className="w-full">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Reset
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Mobilizers List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Available OFRs by Mobilizer
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredMobilizers.map((mobilizer) => (
                <div key={mobilizer.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="flex-1">
                      <h4 className="font-semibold">{mobilizer.name}</h4>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Badge variant="outline">{mobilizer.type}</Badge>
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {mobilizer.district}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">{mobilizer.ofrCount}</div>
                      <div className="text-xs text-muted-foreground">OFRs Available</div>
                    </div>
                    <Button onClick={() => handlePullOFRs(mobilizer)}>
                      <Download className="h-4 w-4 mr-2" />
                      Pull OFRs
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Candidates Dialog */}
        <Dialog open={showCandidatesDialog} onOpenChange={setShowCandidatesDialog}>
          <DialogContent className="max-w-6xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Pulled Candidate OFRs</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Father's Name</TableHead>
                    <TableHead>Mobile</TableHead>
                    <TableHead>District</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pulledCandidates.map((candidate) => (
                    <TableRow key={candidate.id}>
                      <TableCell className="font-medium">{candidate.name}</TableCell>
                      <TableCell>{candidate.fatherName}</TableCell>
                      <TableCell>{candidate.mobile}</TableCell>
                      <TableCell>{candidate.district}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(candidate.status)}>
                          {candidate.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleCallCandidate(candidate)}
                          >
                            <Phone className="h-3 w-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleViewDetails(candidate)}
                          >
                            <Eye className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </DialogContent>
        </Dialog>

        {/* Candidate Details Dialog */}
        <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Candidate Details & Verification</DialogTitle>
            </DialogHeader>
            
            {selectedCandidate && (
              <div className="space-y-6">
                {/* Basic Information */}
                <Card>
                  <CardHeader>
                    <CardTitle>Basic Information</CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium">Full Name</Label>
                      <p className="text-sm">{selectedCandidate.name}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Father's Name</Label>
                      <p className="text-sm">{selectedCandidate.fatherName}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Mobile</Label>
                      <p className="text-sm">{selectedCandidate.mobile}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Email</Label>
                      <p className="text-sm">{selectedCandidate.email}</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Personal Details */}
                <Card>
                  <CardHeader>
                    <CardTitle>Personal Details</CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium">Blood Group</Label>
                      <p className="text-sm">{selectedCandidate.bloodGroup}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Mother Tongue</Label>
                      <p className="text-sm">{selectedCandidate.motherTongue}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Religion</Label>
                      <p className="text-sm">{selectedCandidate.religion}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Community</Label>
                      <p className="text-sm">{selectedCandidate.community}</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Family Details */}
                <Card>
                  <CardHeader>
                    <CardTitle>Family Details</CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium">Mother's Name</Label>
                      <p className="text-sm">{selectedCandidate.motherName}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Guardian's Name</Label>
                      <p className="text-sm">{selectedCandidate.guardiansName}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Marital Status</Label>
                      <p className="text-sm">{selectedCandidate.maritalStatus}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Annual Income</Label>
                      <p className="text-sm">₹{selectedCandidate.annualIncome}</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Address */}
                <Card>
                  <CardHeader>
                    <CardTitle>Address</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">{selectedCandidate.address}</p>
                  </CardContent>
                </Card>

                {/* Counselling Notes & Status Update */}
                <Card>
                  <CardHeader>
                    <CardTitle>Counselling & Status Update</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="notes">Counselling Notes</Label>
                      <Textarea
                        id="notes"
                        placeholder="Enter counselling notes and observations..."
                        value={counsellingNotes}
                        onChange={(e) => setCounsellingNotes(e.target.value)}
                        rows={4}
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="status">Update Status</Label>
                      <Select value={newStatus} onValueChange={setNewStatus}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select new status" />
                        </SelectTrigger>
                        <SelectContent>
                          {candidateStatuses.map((status) => (
                            <SelectItem key={status} value={status}>
                              {status}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex gap-2 pt-4">
                      <Button onClick={handleUpdateStatus}>
                        <Edit2 className="h-4 w-4 mr-2" />
                        Update Status
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={() => handleCallCandidate(selectedCandidate)}
                      >
                        <Phone className="h-4 w-4 mr-2" />
                        Call Candidate
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  );
}