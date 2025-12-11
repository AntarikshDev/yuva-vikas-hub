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
import { Search, RefreshCw, Download, Phone, Eye, Edit2, Users, FileText, MapPin, Pencil, Save, X, Loader2, MessageSquare, Clock } from "lucide-react";
import { useGetOFRsQuery, useSearchMobilizersMutation, useUpdateCandidateStatusMutation } from "@/store/api/apiSlice";

// Mock data
const mockDistricts = [
  "Mumbai", "Pune", "Nagpur", "Nashik", "Aurangabad", "Solapur", "Amravati", "Kolhapur"
];

// Generate followup notes for a candidate
const generateFollowupNotes = (candidateId: number) => {
  const noteStatuses = ["Pending", "InProgress", "Completed"];
  const noteTexts = [
    "Called but not picked",
    "Left voicemail, waiting for callback",
    "Spoke briefly, asked to call back later",
    "Follow-up completed, candidate interested"
  ];
  
  const numNotes = Math.floor(Math.random() * 5); // 0 to 4 notes
  const notes = [];
  
  for (let i = 0; i < numNotes; i++) {
    const baseDate = new Date();
    baseDate.setDate(baseDate.getDate() - (numNotes - i));
    
    notes.push({
      note_id: `note-${candidateId}-${i}`,
      candidate_id: candidateId,
      notes: noteTexts[Math.min(i, noteTexts.length - 1)],
      status: noteStatuses[Math.min(i, noteStatuses.length - 1)],
      created_at: baseDate.toISOString(),
      updated_at: baseDate.toISOString()
    });
  }
  
  return notes;
};

// Generate comprehensive candidate data for all mobilizers
const generateCandidates = () => {
  const firstNames = ["Aadhya", "Bhavesh", "Chitra", "Dhiraj", "Ekta", "Falguni", "Gaurav", "Himani", "Ishaan", "Jaya"];
  const lastNames = ["Sharma", "Patel", "Singh", "Kumar", "Desai", "Shah", "Gupta", "Yadav", "Mehta", "Joshi"];
  const fatherNames = ["Ramesh", "Kiran", "Suresh", "Mahesh", "Rajesh", "Dinesh", "Naresh", "Mukesh", "Hitesh", "Prakash"];
  const districts = ["Mumbai", "Pune", "Nagpur"];
  const communities = ["General", "OBC", "SC", "ST"];
  const bloodGroups = ["O+", "A+", "B+", "AB+", "O-", "A-", "B-", "AB-"];
  const languages = ["Hindi", "Marathi", "Gujarati", "English"];
  const religions = ["Hindu", "Muslim", "Christian", "Buddhist", "Sikh"];
  
  const candidates = [];
  let id = 1;
  
  const mobilizerCounts = {
    "Rajesh Kumar": 45,
    "Priya Sharma": 32, 
    "Amit Patel": 28,
    "Sneha Desai": 19,
    "Vikram Singh": 38
  };
  
  Object.entries(mobilizerCounts).forEach(([mobilizer, count]) => {
    for (let i = 0; i < count; i++) {
      const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
      const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
      const fatherName = fatherNames[Math.floor(Math.random() * fatherNames.length)];
      const candidateId = id++;
      
      candidates.push({
        id: candidateId,
        name: `${firstName} ${lastName}`,
        fatherName: `${fatherName} ${lastName}`,
        mobile: `987654${String(3210 + i).padStart(4, '0')}`,
        email: `${firstName.toLowerCase()}${i}@email.com`,
        district: districts[Math.floor(Math.random() * districts.length)],
        status: "Pending Verification",
        mobilizer: mobilizer,
        bloodGroup: bloodGroups[Math.floor(Math.random() * bloodGroups.length)],
        motherTongue: languages[Math.floor(Math.random() * languages.length)],
        religion: religions[Math.floor(Math.random() * religions.length)],
        community: communities[Math.floor(Math.random() * communities.length)],
        motherName: `Sunita ${lastName}`,
        guardiansName: `${fatherName} ${lastName}`,
        maritalStatus: Math.random() > 0.8 ? "Married" : "Single",
        spouseName: Math.random() > 0.8 ? `Spouse ${lastName}` : "",
        annualIncome: `${Math.floor(Math.random() * 300000 + 150000).toLocaleString()}`,
        address: `Plot ${Math.floor(Math.random() * 500 + 100)}, Sector ${Math.floor(Math.random() * 20 + 1)}, ${districts[Math.floor(Math.random() * districts.length)]}`,
        followup_notes: generateFollowupNotes(candidateId)
      });
    }
  });
  
  return candidates;
};

const mockCandidates = generateCandidates();

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

const initialMobilizers = [
  { id: 1, name: "Rajesh Kumar", type: "Mobiliser Manager", district: "Mumbai", ofrCount: 45 },
  { id: 2, name: "Priya Sharma", type: "CRP", district: "Mumbai", ofrCount: 32 },
  { id: 3, name: "Amit Patel", type: "Mobiliser Manager", district: "Pune", ofrCount: 28 },
  { id: 4, name: "Sneha Desai", type: "CRP", district: "Pune", ofrCount: 19 },
  { id: 5, name: "Vikram Singh", type: "Mobiliser Manager", district: "Nagpur", ofrCount: 38 },
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
  const [mobilizers, setMobilizers] = useState(initialMobilizers);
  const [updatedCandidates, setUpdatedCandidates] = useState<any[]>([]);
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
    }
  }, [selectedCandidate]);

  const handleFieldChange = (field: string, value: string) => {
    setEditFormData((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleSaveChanges = async () => {
    setIsSaving(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Update the pulled candidates with edited data
      const updatedPulledCandidates = pulledCandidates.map(c =>
        c.id === selectedCandidate.id ? { ...c, ...editFormData } : c
      );
      setPulledCandidates(updatedPulledCandidates);
      
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

  const filteredMobilizers = mobilizers.filter(mobilizer => {
    const matchesDistrict = !selectedDistrict || mobilizer.district === selectedDistrict;
    const matchesSearch = !searchTerm || 
      mobilizer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mobilizer.type.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesDistrict && matchesSearch;
  });

  const handlePullOFRs = (mobilizer: any) => {
    // Get candidates for this mobilizer, applying any previous status updates
    let candidates = mockCandidates.filter(c => c.mobilizer === mobilizer.name);
    
    // Apply any status updates that have been made
    candidates = candidates.map(candidate => {
      const updated = updatedCandidates.find(u => u.id === candidate.id);
      return updated ? { ...candidate, status: updated.status, counsellingNotes: updated.counsellingNotes } : candidate;
    });
    
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

    // Update the candidate status in pulled candidates
    const updatedPulledCandidates = pulledCandidates.map(c => 
      c.id === selectedCandidate.id 
        ? { ...c, status: newStatus, counsellingNotes }
        : c
    );
    setPulledCandidates(updatedPulledCandidates);

    // Store the updated candidate for persistence across pulls
    const updatedCandidate = { id: selectedCandidate.id, status: newStatus, counsellingNotes };
    setUpdatedCandidates(prev => {
      const existing = prev.find(u => u.id === selectedCandidate.id);
      if (existing) {
        return prev.map(u => u.id === selectedCandidate.id ? updatedCandidate : u);
      } else {
        return [...prev, updatedCandidate];
      }
    });

    // If status is "Ready for Migration", decrease the mobilizer's OFR count
    if (newStatus === "Ready for Migration") {
      const mobilizerName = selectedCandidate.mobilizer;
      setMobilizers(prev => 
        prev.map(m => 
          m.name === mobilizerName 
            ? { ...m, ofrCount: Math.max(0, m.ofrCount - 1) }
            : m
        )
      );
    }

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
              <DialogDescription>Review and process candidate applications</DialogDescription>
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
            <DialogHeader className="flex flex-row items-center justify-between pr-8">
              <div>
                <DialogTitle>Candidate Details & Verification</DialogTitle>
                <DialogDescription>View and edit candidate information</DialogDescription>
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

                {/* Followups Card */}
                {selectedCandidate.followup_notes && selectedCandidate.followup_notes.length > 0 && (
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base flex items-center gap-2">
                        <MessageSquare className="h-4 w-4" />
                        Followups ({selectedCandidate.followup_notes.length})
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {selectedCandidate.followup_notes.map((followup: any, index: number) => {
                          const isLastOfFour = selectedCandidate.followup_notes.length === 4 && index === 3;
                          const followupLabel = isLastOfFour ? "Final Call" : `Followup ${index + 1}`;
                          
                          const getStatusBadgeColor = (status: string) => {
                            switch (status) {
                              case "Completed": return "bg-green-100 text-green-800";
                              case "InProgress": return "bg-blue-100 text-blue-800";
                              case "Pending": return "bg-yellow-100 text-yellow-800";
                              default: return "bg-gray-100 text-gray-800";
                            }
                          };
                          
                          return (
                            <div key={followup.note_id} className="border rounded-lg p-3 bg-muted/30">
                              <div className="flex items-center justify-between mb-2">
                                <span className={`font-medium text-sm ${isLastOfFour ? 'text-primary' : ''}`}>
                                  {followupLabel}
                                </span>
                                <Badge className={getStatusBadgeColor(followup.status)}>
                                  {followup.status}
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground mb-2">{followup.notes}</p>
                              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                <Clock className="h-3 w-3" />
                                {new Date(followup.created_at).toLocaleString()}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>
                )}

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
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Counselling & Status Update</CardTitle>
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