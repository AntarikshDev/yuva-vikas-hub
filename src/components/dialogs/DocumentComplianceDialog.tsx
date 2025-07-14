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
import { Eye, Check, X, MessageCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface DocumentComplianceDialogProps {
  candidate: any;
  open: boolean;
  onClose: () => void;
}

const mockDocuments = [
  { id: 1, name: "Aadhaar Card", status: "approved", uploadDate: "2025-01-10" },
  { id: 2, name: "Bank Passbook", status: "approved", uploadDate: "2025-01-12" },
  { id: 3, name: "BPL Certificate", status: "pending", uploadDate: "2025-01-14" },
  { id: 4, name: "Education Proof", status: "rejected", uploadDate: "2025-01-15" },
  { id: 5, name: "Caste Certificate", status: "pending", uploadDate: "2025-01-16" }
];

export function DocumentComplianceDialog({ candidate, open, onClose }: DocumentComplianceDialogProps) {
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

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl text-primary">
            Document Compliance - {candidate.name}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Documents Table */}
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
          <div className="grid grid-cols-3 gap-4">
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
            <div className="border rounded-lg p-4 bg-muted/30">
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
          <div className="flex gap-2">
            <Button variant="outline">
              Remind All Pending Candidates
            </Button>
            <Button variant="outline">
              Export Compliance Report
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}