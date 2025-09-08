import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Eye, Check, X, MessageCircle, Edit, Calendar, User, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface DocumentComplianceDialogProps {
  candidate: any;
  open: boolean;
  onClose: () => void;
  counsellingData?: any;
  parentCounsellingData?: any;
  onEditCounselling?: () => void;
  onEditParentCounselling?: () => void;
}

const mockDocuments = [
  { id: 1, name: "Aadhaar Card", status: "approved", uploadDate: "2025-01-10" },
  { id: 2, name: "Bank Passbook", status: "approved", uploadDate: "2025-01-12" },
  { id: 3, name: "BPL Certificate", status: "pending", uploadDate: "2025-01-14" },
  { id: 4, name: "Education Proof", status: "rejected", uploadDate: "2025-01-15" },
  { id: 5, name: "Caste Certificate", status: "pending", uploadDate: "2025-01-16" }
];

export function DocumentComplianceDialog({ 
  candidate, 
  open, 
  onClose, 
  counsellingData, 
  parentCounsellingData, 
  onEditCounselling, 
  onEditParentCounselling 
}: DocumentComplianceDialogProps) {
  const [selectedDocument, setSelectedDocument] = useState<any>(null);
  const [comment, setComment] = useState("");
  const [documents, setDocuments] = useState(mockDocuments);
  const { toast } = useToast();

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-100 text-green-800">Approved</Badge>;
      case "rejected":
        return <Badge className="bg-red-100 text-red-800">Rejected</Badge>;
      case "pending":
        return <Badge variant="secondary">Pending</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const handleDocumentAction = (docId: number, action: string) => {
    setDocuments(prev => prev.map(doc => 
      doc.id === docId 
        ? { ...doc, status: action === "approve" ? "approved" : "rejected" }
        : doc
    ));

    toast({
      title: `Document ${action === "approve" ? "Approved" : "Rejected"}`,
      description: `Document has been ${action === "approve" ? "approved" : "rejected"} successfully.`,
    });

    if (action === "reject") {
      setComment("");
    }
  };

  const handleAddComment = (docId: number) => {
    if (!comment.trim()) return;
    
    toast({
      title: "Comment Added",
      description: "Comment has been added to the document.",
    });
    setComment("");
    setSelectedDocument(null);
  };

  const renderCounsellingSession = (sessionData: any, type: "counselling" | "parent") => {
    if (!sessionData) return null;

    return (
      <Card className="mb-4">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg flex items-center gap-2">
              {type === "counselling" ? (
                <>
                  <User className="h-5 w-5" />
                  Counselling Sessions
                </>
              ) : (
                <>
                  <MessageCircle className="h-5 w-5" />
                  Parent Counselling
                </>
              )}
            </CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={type === "counselling" ? onEditCounselling : onEditParentCounselling}
              className="flex items-center gap-2"
            >
              <Edit className="h-4 w-4" />
              Edit
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {type === "counselling" ? (
            <div className="space-y-4">
              {["stage1", "stage2", "stage3"].map((stage, index) => {
                const stageData = sessionData[stage];
                if (!stageData?.date) return null;
                
                return (
                  <div key={stage} className="border rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <Badge variant="outline">Stage {index + 1}</Badge>
                      <span className="text-sm text-muted-foreground flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {stageData.date}
                      </span>
                    </div>
                    <p className="text-sm mb-2">{stageData.notes}</p>
                    <Badge className={
                      stageData.readiness === "excellent" ? "bg-green-100 text-green-800" :
                      stageData.readiness === "good" ? "bg-blue-100 text-blue-800" :
                      stageData.readiness === "average" ? "bg-yellow-100 text-yellow-800" :
                      "bg-red-100 text-red-800"
                    }>
                      {stageData.readiness}
                    </Badge>
                  </div>
                );
              })}
              <div className="text-sm text-muted-foreground flex items-center gap-1">
                <Clock className="h-3 w-3" />
                Current Stage: {sessionData.currentStage || "Stage 1"}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Parent Name:</label>
                  <p className="text-sm">{sessionData.parentName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Session Date:</label>
                  <p className="text-sm flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {sessionData.sessionDate}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium">Session Time:</label>
                  <p className="text-sm">{sessionData.sessionTime}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Consent Status:</label>
                  <Badge className={
                    sessionData.consent === "given" ? "bg-green-100 text-green-800" :
                    sessionData.consent === "pending" ? "bg-yellow-100 text-yellow-800" :
                    "bg-red-100 text-red-800"
                  }>
                    {sessionData.consent}
                  </Badge>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">Parent Feedback:</label>
                <p className="text-sm mt-1 p-2 bg-muted rounded">{sessionData.feedback}</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-xl text-primary">
            Document Compliance - {candidate.name}
          </DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="max-h-[80vh] pr-4">
          <div className="space-y-6">
            {/* Documents Section */}
            <Card>
              <CardHeader>
                <CardTitle>Document Status</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Document Name</TableHead>
                      <TableHead>Upload Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {documents.map((doc) => (
                      <TableRow key={doc.id}>
                        <TableCell className="font-medium">{doc.name}</TableCell>
                        <TableCell>{doc.uploadDate}</TableCell>
                        <TableCell>{getStatusBadge(doc.status)}</TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button size="sm" variant="outline">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleDocumentAction(doc.id, "approve")}
                              disabled={doc.status === "approved"}
                            >
                              <Check className="h-4 w-4" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleDocumentAction(doc.id, "reject")}
                              disabled={doc.status === "rejected"}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => setSelectedDocument(doc)}
                            >
                              <MessageCircle className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                {/* Compliance Summary */}
                <div className="grid grid-cols-3 gap-4 mt-6">
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      {documents.filter(d => d.status === "approved").length}
                    </div>
                    <div className="text-sm text-muted-foreground">Approved</div>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-yellow-600">
                      {documents.filter(d => d.status === "pending").length}
                    </div>
                    <div className="text-sm text-muted-foreground">Pending</div>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-red-600">
                      {documents.filter(d => d.status === "rejected").length}
                    </div>
                    <div className="text-sm text-muted-foreground">Rejected</div>
                  </div>
                </div>

                {/* Comment Section */}
                {selectedDocument && (
                  <div className="border rounded-lg p-4 bg-muted/30 mt-6">
                    <Label>Add Comment for {selectedDocument.name}</Label>
                    <Textarea
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Enter your comment or reason for rejection..."
                      className="mt-2"
                      rows={3}
                    />
                    <div className="flex gap-2 mt-3">
                      <Button 
                        size="sm" 
                        onClick={() => handleAddComment(selectedDocument.id)}
                      >
                        Add Comment
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => setSelectedDocument(null)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}

                {/* Bulk Actions */}
                <div className="flex gap-2 mt-6">
                  <Button variant="outline">
                    Remind All Pending Candidates
                  </Button>
                  <Button variant="outline">
                    Export Compliance Report
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Counselling Sessions Section */}
            {(counsellingData || parentCounsellingData) && (
              <>
                <Separator />
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Counselling Information</h3>
                  {renderCounsellingSession(counsellingData, "counselling")}
                  {renderCounsellingSession(parentCounsellingData, "parent")}
                </div>
              </>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}