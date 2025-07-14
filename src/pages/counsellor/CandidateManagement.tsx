import { useState } from "react";
import { MainLayout } from "@/layouts/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Search, Eye, FileText, MessageCircle, UserCheck, ChevronLeft, ChevronRight } from "lucide-react";
import { MultiStageCounsellingDialog } from "@/components/dialogs/MultiStageCounsellingDialog";
import { ParentCounsellingDialog } from "@/components/dialogs/ParentCounsellingDialog";
import { OFRFormDialog } from "@/components/dialogs/OFRFormDialog";
import { DocumentComplianceDialog } from "@/components/dialogs/DocumentComplianceDialog";

// Mock data
const mockCandidates = [
  {
    id: 1,
    name: "Rajesh Kumar",
    batch: "Batch 2025-01",
    stage: "Stage 2",
    parentCounselling: "Completed",
    ofrStatus: "Pending",
    contactNumber: "9876543210"
  },
  {
    id: 2,
    name: "Priya Sharma",
    batch: "Batch 2025-01", 
    stage: "Stage 1",
    parentCounselling: "Pending",
    ofrStatus: "Not Started",
    contactNumber: "9876543211"
  },
  {
    id: 3,
    name: "Amit Singh",
    batch: "Batch 2025-02",
    stage: "Stage 3",
    parentCounselling: "Completed",
    ofrStatus: "Generated",
    contactNumber: "9876543212"
  },
  {
    id: 4,
    name: "Sunita Devi",
    batch: "Batch 2025-01",
    stage: "Stage 1",
    parentCounselling: "Pending",
    ofrStatus: "Pending",
    contactNumber: "9876543213"
  },
  {
    id: 5,
    name: "Vikash Yadav",
    batch: "Batch 2025-02",
    stage: "Stage 2",
    parentCounselling: "Completed",
    ofrStatus: "Pending",
    contactNumber: "9876543214"
  }
];

export default function CandidateManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStage, setSelectedStage] = useState("");
  const [selectedBatch, setSelectedBatch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCandidate, setSelectedCandidate] = useState<any>(null);
  const [dialogType, setDialogType] = useState<string>("");

  const itemsPerPage = 10;
  const filteredCandidates = mockCandidates.filter(candidate => {
    return (
      candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (selectedStage === "" || candidate.stage === selectedStage) &&
      (selectedBatch === "" || candidate.batch === selectedBatch)
    );
  });

  const totalPages = Math.ceil(filteredCandidates.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedCandidates = filteredCandidates.slice(startIndex, startIndex + itemsPerPage);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Completed":
      case "Generated":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Completed</Badge>;
      case "Pending":
        return <Badge variant="secondary">Pending</Badge>;
      case "Not Started":
        return <Badge variant="outline">Not Started</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const handleAction = (action: string, candidate: any) => {
    setSelectedCandidate(candidate);
    setDialogType(action);
  };

  const closeDialog = () => {
    setSelectedCandidate(null);
    setDialogType("");
  };

  return (
    <MainLayout role="counsellor">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-primary">Candidate Management</h1>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <div className="flex-1 min-w-[200px]">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by Name/ID"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <Select value={selectedStage} onValueChange={setSelectedStage}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="All Stages" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Stages</SelectItem>
                  <SelectItem value="Stage 1">Stage 1</SelectItem>
                  <SelectItem value="Stage 2">Stage 2</SelectItem>
                  <SelectItem value="Stage 3">Stage 3</SelectItem>
                </SelectContent>
              </Select>
              <Select value={selectedBatch} onValueChange={setSelectedBatch}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="All Batches" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Batches</SelectItem>
                  <SelectItem value="Batch 2025-01">Batch 2025-01</SelectItem>
                  <SelectItem value="Batch 2025-02">Batch 2025-02</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Candidates Table */}
        <Card>
          <CardHeader>
            <CardTitle>Candidates List</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Candidate Name</TableHead>
                  <TableHead>Batch</TableHead>
                  <TableHead>Current Stage</TableHead>
                  <TableHead>Parent Counselling</TableHead>
                  <TableHead>OFR Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedCandidates.map((candidate) => (
                  <TableRow key={candidate.id}>
                    <TableCell className="font-medium">{candidate.name}</TableCell>
                    <TableCell>{candidate.batch}</TableCell>
                    <TableCell>{candidate.stage}</TableCell>
                    <TableCell>{getStatusBadge(candidate.parentCounselling)}</TableCell>
                    <TableCell>{getStatusBadge(candidate.ofrStatus)}</TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleAction("counselling", candidate)}
                        >
                          <UserCheck className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleAction("parent", candidate)}
                        >
                          <MessageCircle className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleAction("documents", candidate)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleAction("ofr", candidate)}
                        >
                          <FileText className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {/* Pagination */}
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-muted-foreground">
                Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredCandidates.length)} of{" "}
                {filteredCandidates.length} candidates
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Dialogs */}
        {dialogType === "counselling" && selectedCandidate && (
          <MultiStageCounsellingDialog
            candidate={selectedCandidate}
            open={true}
            onClose={closeDialog}
          />
        )}
        {dialogType === "parent" && selectedCandidate && (
          <ParentCounsellingDialog
            candidate={selectedCandidate}
            open={true}
            onClose={closeDialog}
          />
        )}
        {dialogType === "ofr" && selectedCandidate && (
          <OFRFormDialog
            candidate={selectedCandidate}
            open={true}
            onClose={closeDialog}
          />
        )}
        {dialogType === "documents" && selectedCandidate && (
          <DocumentComplianceDialog
            candidate={selectedCandidate}
            open={true}
            onClose={closeDialog}
          />
        )}
      </div>
    </MainLayout>
  );
}