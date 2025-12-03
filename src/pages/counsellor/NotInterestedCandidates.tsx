import { useState, useEffect } from "react";
import { MainLayout } from "@/layouts/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Search, RefreshCw, Phone, Eye, Edit2, UserX, Pencil, Save, X, Loader2 } from "lucide-react";

// Mock data for districts
const mockDistricts = [
  "Mumbai", "Pune", "Nagpur", "Nashik", "Aurangabad", "Solapur", "Amravati", "Kolhapur"
];

// Generate not interested candidates data
const generateNotInterestedCandidates = () => {
  const firstNames = ["Aadhya", "Bhavesh", "Chitra", "Dhiraj", "Ekta", "Falguni", "Gaurav", "Himani", "Ishaan", "Jaya"];
  const lastNames = ["Sharma", "Patel", "Singh", "Kumar", "Desai", "Shah", "Gupta", "Yadav", "Mehta", "Joshi"];
  const fatherNames = ["Ramesh", "Kiran", "Suresh", "Mahesh", "Rajesh", "Dinesh", "Naresh", "Mukesh", "Hitesh", "Prakash"];
  const districts = ["Mumbai", "Pune", "Nagpur"];
  const communities = ["General", "OBC", "SC", "ST"];
  const bloodGroups = ["O+", "A+", "B+", "AB+", "O-", "A-", "B-", "AB-"];
  const languages = ["Hindi", "Marathi", "Gujarati", "English"];
  const religions = ["Hindu", "Muslim", "Christian", "Buddhist", "Sikh"];
  const notInterestedReasons = [
    "Family objection",
    "Found other job",
    "Relocation issues",
    "Salary expectations not met",
    "Health concerns",
    "Personal reasons",
    "Education commitment",
    "Distance from home"
  ];
  
  const candidates = [];
  
  for (let i = 1; i <= 35; i++) {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const fatherName = fatherNames[Math.floor(Math.random() * fatherNames.length)];
    
    candidates.push({
      id: i,
      name: `${firstName} ${lastName}`,
      fatherName: `${fatherName} ${lastName}`,
      mobile: `987654${String(3210 + i).padStart(4, '0')}`,
      email: `${firstName.toLowerCase()}${i}@email.com`,
      district: districts[Math.floor(Math.random() * districts.length)],
      status: "Not Interested",
      reason: notInterestedReasons[Math.floor(Math.random() * notInterestedReasons.length)],
      bloodGroup: bloodGroups[Math.floor(Math.random() * bloodGroups.length)],
      motherTongue: languages[Math.floor(Math.random() * languages.length)],
      religion: religions[Math.floor(Math.random() * religions.length)],
      community: communities[Math.floor(Math.random() * communities.length)],
      motherName: `Sunita ${lastName}`,
      guardiansName: `${fatherName} ${lastName}`,
      maritalStatus: Math.random() > 0.8 ? "Married" : "Single",
      annualIncome: `${Math.floor(Math.random() * 300000 + 150000).toLocaleString()}`,
      address: `Plot ${Math.floor(Math.random() * 500 + 100)}, Sector ${Math.floor(Math.random() * 20 + 1)}, ${districts[Math.floor(Math.random() * districts.length)]}`,
      dateMarkedNotInterested: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toLocaleDateString(),
    });
  }
  
  return candidates;
};

const mockNotInterestedCandidates = generateNotInterestedCandidates();

const statusOptions = [
  "Ready for Migration",
  "Not Interested",
  "Need More Counselling", 
  "Need Parent Counselling",
];

export default function NotInterestedCandidates() {
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [candidates, setCandidates] = useState(mockNotInterestedCandidates);
  const [selectedCandidate, setSelectedCandidate] = useState<any>(null);
  const [showDetailsDialog, setShowDetailsDialog] = useState(false);
  const [counsellingNotes, setCounsellingNotes] = useState("");
  const [newStatus, setNewStatus] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editFormData, setEditFormData] = useState<any>({});
  const { toast } = useToast();

  // Reset edit form when candidate changes
  useEffect(() => {
    if (selectedCandidate) {
      setEditFormData({
        name: selectedCandidate.name || '',
        fatherName: selectedCandidate.fatherName || '',
        mobile: selectedCandidate.mobile || '',
        email: selectedCandidate.email || '',
        bloodGroup: selectedCandidate.bloodGroup || '',
        motherTongue: selectedCandidate.motherTongue || '',
        religion: selectedCandidate.religion || '',
        community: selectedCandidate.community || '',
        motherName: selectedCandidate.motherName || '',
        guardiansName: selectedCandidate.guardiansName || '',
        maritalStatus: selectedCandidate.maritalStatus || '',
        annualIncome: selectedCandidate.annualIncome || '',
        address: selectedCandidate.address || '',
        district: selectedCandidate.district || '',
      });
      setIsEditing(false);
      setNewStatus(selectedCandidate.status);
      setCounsellingNotes("");
    }
  }, [selectedCandidate]);

  const handleFieldChange = (field: string, value: string) => {
    setEditFormData((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleSaveChanges = async () => {
    setIsSaving(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Update candidates list with edited data
      const updatedCandidates = candidates.map(c =>
        c.id === selectedCandidate.id ? { ...c, ...editFormData } : c
      );
      setCandidates(updatedCandidates);
      
      // Update selectedCandidate
      setSelectedCandidate({ ...selectedCandidate, ...editFormData });
      
      toast({
        title: "Changes Saved",
        description: "Candidate details have been updated successfully.",
      });
      setIsEditing(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save changes. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setEditFormData({
      name: selectedCandidate.name || '',
      fatherName: selectedCandidate.fatherName || '',
      mobile: selectedCandidate.mobile || '',
      email: selectedCandidate.email || '',
      bloodGroup: selectedCandidate.bloodGroup || '',
      motherTongue: selectedCandidate.motherTongue || '',
      religion: selectedCandidate.religion || '',
      community: selectedCandidate.community || '',
      motherName: selectedCandidate.motherName || '',
      guardiansName: selectedCandidate.guardiansName || '',
      maritalStatus: selectedCandidate.maritalStatus || '',
      annualIncome: selectedCandidate.annualIncome || '',
      address: selectedCandidate.address || '',
      district: selectedCandidate.district || '',
    });
    setIsEditing(false);
  };

  const filteredCandidates = candidates.filter(candidate => {
    const matchesDistrict = !selectedDistrict || candidate.district === selectedDistrict;
    const matchesSearch = !searchTerm || 
      candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      candidate.mobile.includes(searchTerm) ||
      candidate.fatherName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesDistrict && matchesSearch;
  });

  const handleReset = () => {
    setSelectedDistrict("");
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
    const updatedCandidatesList = candidates.map(c => 
      c.id === selectedCandidate.id 
        ? { ...c, status: newStatus, counsellingNotes }
        : c
    );

    // If status changed from "Not Interested", remove from this list
    if (newStatus !== "Not Interested") {
      setCandidates(updatedCandidatesList.filter(c => c.status === "Not Interested"));
      toast({
        title: "Status Updated",
        description: `${selectedCandidate.name}'s status updated to "${newStatus}". Candidate moved from Not Interested list.`,
      });
    } else {
      setCandidates(updatedCandidatesList);
      toast({
        title: "Status Updated",
        description: `${selectedCandidate.name}'s details have been updated.`,
      });
    }

    setShowDetailsDialog(false);
    setCounsellingNotes("");
    setNewStatus("");
  };

  return (
    <MainLayout role="counsellor">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-primary">Not Interested Candidates</h1>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <UserX className="h-4 w-4" />
            Candidates marked as not interested
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-red-600">{candidates.length}</div>
              <p className="text-sm text-muted-foreground">Total Not Interested</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-orange-600">
                {candidates.filter(c => c.reason === "Family objection").length}
              </div>
              <p className="text-sm text-muted-foreground">Family Objection</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-blue-600">
                {candidates.filter(c => c.reason === "Found other job").length}
              </div>
              <p className="text-sm text-muted-foreground">Found Other Job</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-purple-600">
                {candidates.filter(c => !["Family objection", "Found other job"].includes(c.reason)).length}
              </div>
              <p className="text-sm text-muted-foreground">Other Reasons</p>
            </CardContent>
          </Card>
        </div>

        {/* Filter Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Search & Filter
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
                <Label htmlFor="search">Search Candidate</Label>
                <Input
                  id="search"
                  placeholder="Search by name, mobile, or father's name..."
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

        {/* Candidates List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserX className="h-5 w-5" />
              Not Interested Candidates ({filteredCandidates.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Father's Name</TableHead>
                  <TableHead>Mobile</TableHead>
                  <TableHead>District</TableHead>
                  <TableHead>Reason</TableHead>
                  <TableHead>Date Marked</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCandidates.map((candidate) => (
                  <TableRow key={candidate.id}>
                    <TableCell className="font-medium">{candidate.name}</TableCell>
                    <TableCell>{candidate.fatherName}</TableCell>
                    <TableCell>{candidate.mobile}</TableCell>
                    <TableCell>{candidate.district}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                        {candidate.reason}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{candidate.dateMarkedNotInterested}</TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleCallCandidate(candidate)}
                          title="Call Candidate"
                        >
                          <Phone className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleViewDetails(candidate)}
                          title="View Details"
                        >
                          <Eye className="h-3 w-3" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            
            {filteredCandidates.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                No candidates found matching your criteria.
              </div>
            )}
          </CardContent>
        </Card>

        {/* Candidate Details Dialog */}
        <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader className="flex flex-row items-center justify-between pr-8">
              <div>
                <DialogTitle>Candidate Details & Verification</DialogTitle>
                <DialogDescription>View and edit candidate information, update status</DialogDescription>
              </div>
              {!isEditing ? (
                <Button variant="outline" size="sm" onClick={() => setIsEditing(true)} className="gap-2">
                  <Pencil className="h-4 w-4" />
                  Edit
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={handleCancelEdit} className="gap-1">
                    <X className="h-4 w-4" />
                    Cancel
                  </Button>
                  <Button size="sm" onClick={handleSaveChanges} disabled={isSaving} className="gap-1">
                    {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                    {isSaving ? 'Saving...' : 'Save'}
                  </Button>
                </div>
              )}
            </DialogHeader>
            
            {selectedCandidate && (
              <div className="space-y-6 mt-2">
                {/* Basic Information */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Basic Information</CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <Label className="text-sm text-muted-foreground">Full Name</Label>
                      {isEditing ? (
                        <Input value={editFormData.name} onChange={(e) => handleFieldChange('name', e.target.value)} />
                      ) : (
                        <p className="font-medium">{selectedCandidate.name}</p>
                      )}
                    </div>
                    <div className="space-y-1">
                      <Label className="text-sm text-muted-foreground">Father's Name</Label>
                      {isEditing ? (
                        <Input value={editFormData.fatherName} onChange={(e) => handleFieldChange('fatherName', e.target.value)} />
                      ) : (
                        <p className="font-medium">{selectedCandidate.fatherName}</p>
                      )}
                    </div>
                    <div className="space-y-1">
                      <Label className="text-sm text-muted-foreground">Mobile</Label>
                      {isEditing ? (
                        <Input type="tel" value={editFormData.mobile} onChange={(e) => handleFieldChange('mobile', e.target.value)} />
                      ) : (
                        <p className="font-medium">{selectedCandidate.mobile}</p>
                      )}
                    </div>
                    <div className="space-y-1">
                      <Label className="text-sm text-muted-foreground">Email</Label>
                      {isEditing ? (
                        <Input type="email" value={editFormData.email} onChange={(e) => handleFieldChange('email', e.target.value)} />
                      ) : (
                        <p className="font-medium">{selectedCandidate.email}</p>
                      )}
                    </div>
                    <div className="space-y-1">
                      <Label className="text-sm text-muted-foreground">District</Label>
                      {isEditing ? (
                        <Select value={editFormData.district} onValueChange={(value) => handleFieldChange('district', value)}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {mockDistricts.map((district) => (
                              <SelectItem key={district} value={district}>{district}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        <p className="font-medium">{selectedCandidate.district}</p>
                      )}
                    </div>
                    <div className="space-y-1">
                      <Label className="text-sm text-muted-foreground">Reason for Not Interested</Label>
                      <p className="font-medium text-red-600">{selectedCandidate.reason}</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Personal Details */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Personal Details</CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <Label className="text-sm text-muted-foreground">Blood Group</Label>
                      {isEditing ? (
                        <Select value={editFormData.bloodGroup} onValueChange={(value) => handleFieldChange('bloodGroup', value)}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {["O+", "A+", "B+", "AB+", "O-", "A-", "B-", "AB-"].map((bg) => (
                              <SelectItem key={bg} value={bg}>{bg}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        <p className="font-medium">{selectedCandidate.bloodGroup}</p>
                      )}
                    </div>
                    <div className="space-y-1">
                      <Label className="text-sm text-muted-foreground">Mother Tongue</Label>
                      {isEditing ? (
                        <Select value={editFormData.motherTongue} onValueChange={(value) => handleFieldChange('motherTongue', value)}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {["Hindi", "Marathi", "Gujarati", "English", "Tamil", "Telugu", "Bengali"].map((lang) => (
                              <SelectItem key={lang} value={lang}>{lang}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        <p className="font-medium">{selectedCandidate.motherTongue}</p>
                      )}
                    </div>
                    <div className="space-y-1">
                      <Label className="text-sm text-muted-foreground">Religion</Label>
                      {isEditing ? (
                        <Select value={editFormData.religion} onValueChange={(value) => handleFieldChange('religion', value)}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {["Hindu", "Muslim", "Christian", "Buddhist", "Sikh", "Jain", "Other"].map((rel) => (
                              <SelectItem key={rel} value={rel}>{rel}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        <p className="font-medium">{selectedCandidate.religion}</p>
                      )}
                    </div>
                    <div className="space-y-1">
                      <Label className="text-sm text-muted-foreground">Community</Label>
                      {isEditing ? (
                        <Select value={editFormData.community} onValueChange={(value) => handleFieldChange('community', value)}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {["General", "OBC", "SC", "ST", "EWS"].map((comm) => (
                              <SelectItem key={comm} value={comm}>{comm}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        <p className="font-medium">{selectedCandidate.community}</p>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Family Details */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Family Details</CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <Label className="text-sm text-muted-foreground">Mother's Name</Label>
                      {isEditing ? (
                        <Input value={editFormData.motherName} onChange={(e) => handleFieldChange('motherName', e.target.value)} />
                      ) : (
                        <p className="font-medium">{selectedCandidate.motherName}</p>
                      )}
                    </div>
                    <div className="space-y-1">
                      <Label className="text-sm text-muted-foreground">Guardian's Name</Label>
                      {isEditing ? (
                        <Input value={editFormData.guardiansName} onChange={(e) => handleFieldChange('guardiansName', e.target.value)} />
                      ) : (
                        <p className="font-medium">{selectedCandidate.guardiansName}</p>
                      )}
                    </div>
                    <div className="space-y-1">
                      <Label className="text-sm text-muted-foreground">Marital Status</Label>
                      {isEditing ? (
                        <Select value={editFormData.maritalStatus} onValueChange={(value) => handleFieldChange('maritalStatus', value)}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {["Single", "Married", "Divorced", "Widowed"].map((status) => (
                              <SelectItem key={status} value={status}>{status}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        <p className="font-medium">{selectedCandidate.maritalStatus}</p>
                      )}
                    </div>
                    <div className="space-y-1">
                      <Label className="text-sm text-muted-foreground">Annual Income</Label>
                      {isEditing ? (
                        <Input value={editFormData.annualIncome} onChange={(e) => handleFieldChange('annualIncome', e.target.value)} />
                      ) : (
                        <p className="font-medium">₹{selectedCandidate.annualIncome}</p>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Address */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Address</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-1">
                      <Label className="text-sm text-muted-foreground">Full Address</Label>
                      {isEditing ? (
                        <Textarea value={editFormData.address} onChange={(e) => handleFieldChange('address', e.target.value)} rows={2} />
                      ) : (
                        <p className="font-medium">{selectedCandidate.address}</p>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Counselling Notes & Status Update */}
                <Card className="border-green-200 bg-green-50/50">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base text-green-800">Re-engage & Update Status</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-1">
                      <Label htmlFor="notes">Counselling Notes</Label>
                      <Textarea
                        id="notes"
                        placeholder="Enter counselling notes and observations..."
                        value={counsellingNotes}
                        onChange={(e) => setCounsellingNotes(e.target.value)}
                        rows={4}
                      />
                    </div>
                    
                    <div className="space-y-1">
                      <Label htmlFor="status">Update Status</Label>
                      <Select value={newStatus} onValueChange={setNewStatus}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select new status" />
                        </SelectTrigger>
                        <SelectContent>
                          {statusOptions.map((status) => (
                            <SelectItem key={status} value={status}>
                              {status}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-muted-foreground mt-1">
                        Change status to "Ready for Migration" to move candidate back to migration pipeline
                      </p>
                    </div>

                    <div className="flex gap-2 pt-4">
                      <Button onClick={handleUpdateStatus} className="bg-green-600 hover:bg-green-700">
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
