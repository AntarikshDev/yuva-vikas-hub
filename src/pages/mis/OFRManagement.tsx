import { useState } from "react";
import { MainLayout } from "@/layouts/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Search, RefreshCw, Download, Eye, Users, FileText, MapPin, CheckCircle2 } from "lucide-react";
import { DocumentVerificationDialog } from "@/components/dialogs/DocumentVerificationDialog";
import { useGetOFRsQuery, useVerifyOFRMutation } from "@/store/api/apiSlice";

// Mock data
const mockDistricts = [
  "Mumbai", "Pune", "Nagpur", "Nashik", "Aurangabad", "Solapur", "Amravati", "Kolhapur"
];

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
      
      candidates.push({
        id: id++,
        name: `${firstName} ${lastName}`,
        fatherName: `${fatherName} ${lastName}`,
        mobile: `987654${String(3210 + i).padStart(4, '0')}`,
        email: `${firstName.toLowerCase()}${i}@email.com`,
        district: districts[Math.floor(Math.random() * districts.length)],
        status: "Pending Verification",
        verificationStatus: "Not Verified",
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
        age: Math.floor(Math.random() * 10 + 18),
        education: "10th Pass"
      });
    }
  });
  
  return candidates;
};

const mockCandidates = generateCandidates();

const initialMobilizers = [
  { id: 1, name: "Rajesh Kumar", type: "Mobiliser Manager", district: "Mumbai", ofrCount: 45 },
  { id: 2, name: "Priya Sharma", type: "CRP", district: "Mumbai", ofrCount: 32 },
  { id: 3, name: "Amit Patel", type: "Mobiliser Manager", district: "Pune", ofrCount: 28 },
  { id: 4, name: "Sneha Desai", type: "CRP", district: "Pune", ofrCount: 19 },
  { id: 5, name: "Vikram Singh", type: "Mobiliser Manager", district: "Nagpur", ofrCount: 38 },
];

export default function OFRManagement() {
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [pulledCandidates, setPulledCandidates] = useState<any[]>([]);
  const [showCandidatesDialog, setShowCandidatesDialog] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState<any>(null);
  const [showVerificationDialog, setShowVerificationDialog] = useState(false);
  const [mobilizers, setMobilizers] = useState(initialMobilizers);
  const [updatedCandidates, setUpdatedCandidates] = useState<any[]>([]);
  const { toast } = useToast();

  const filteredMobilizers = mobilizers.filter(mobilizer => {
    const matchesDistrict = !selectedDistrict || mobilizer.district === selectedDistrict;
    const matchesSearch = !searchTerm || 
      mobilizer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mobilizer.type.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesDistrict && matchesSearch;
  });

  const handlePullOFRs = (mobilizer: any) => {
    let candidates = mockCandidates.filter(c => c.mobilizer === mobilizer.name);
    
    candidates = candidates.map(candidate => {
      const updated = updatedCandidates.find(u => u.id === candidate.id);
      return updated ? { ...candidate, ...updated } : candidate;
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
    setSearchTerm("");
  };

  const handleVerifyDocuments = (candidate: any) => {
    setSelectedCandidate(candidate);
    setShowVerificationDialog(true);
  };

  const handleVerificationComplete = (verificationData: any) => {
    const updatedCandidate = {
      id: selectedCandidate.id,
      verificationStatus: "Verified",
      verificationData: verificationData
    };

    const updatedPulledCandidates = pulledCandidates.map(c => 
      c.id === selectedCandidate.id 
        ? { ...c, verificationStatus: "Verified" }
        : c
    );
    setPulledCandidates(updatedPulledCandidates);

    setUpdatedCandidates(prev => {
      const existing = prev.find(u => u.id === selectedCandidate.id);
      if (existing) {
        return prev.map(u => u.id === selectedCandidate.id ? updatedCandidate : u);
      } else {
        return [...prev, updatedCandidate];
      }
    });

    toast({
      title: "Documents Verified",
      description: `${selectedCandidate.name}'s documents have been verified successfully`,
    });

    setShowVerificationDialog(false);
  };

  const getVerificationStatusColor = (status: string) => {
    switch (status) {
      case "Verified": return "bg-green-100 text-green-800";
      case "Not Verified": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <MainLayout role="mis">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-primary">OFR Document Verification</h1>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <FileText className="h-4 w-4" />
            Verify candidate documents for OFR compliance
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
              <DialogTitle>Pulled Candidate OFRs - Document Verification</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Father's Name</TableHead>
                    <TableHead>Mobile</TableHead>
                    <TableHead>District</TableHead>
                    <TableHead>Verification Status</TableHead>
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
                        <Badge className={getVerificationStatusColor(candidate.verificationStatus)}>
                          {candidate.verificationStatus}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant={candidate.verificationStatus === "Verified" ? "outline" : "default"}
                            onClick={() => handleVerifyDocuments(candidate)}
                          >
                            {candidate.verificationStatus === "Verified" ? (
                              <>
                                <CheckCircle2 className="h-3 w-3 mr-1" />
                                View
                              </>
                            ) : (
                              <>
                                <Eye className="h-3 w-3 mr-1" />
                                Verify
                              </>
                            )}
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

        {/* Document Verification Dialog */}
        {selectedCandidate && (
          <DocumentVerificationDialog
            open={showVerificationDialog}
            onClose={() => setShowVerificationDialog(false)}
            candidate={selectedCandidate}
            onVerificationComplete={handleVerificationComplete}
          />
        )}
      </div>
    </MainLayout>
  );
}
