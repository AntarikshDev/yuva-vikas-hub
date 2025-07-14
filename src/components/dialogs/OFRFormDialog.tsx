import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Upload, FileText, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface OFRFormDialogProps {
  candidate: any;
  open: boolean;
  onClose: () => void;
}

export function OFRFormDialog({ candidate, open, onClose }: OFRFormDialogProps) {
  const [formData, setFormData] = useState({
    candidateName: candidate.name,
    batch: candidate.batch,
    employerName: "",
    jobRole: "",
    salary: "",
    location: "",
    digitalSignature: null
  });
  const [showPreview, setShowPreview] = useState(false);
  const { toast } = useToast();

  const handleGeneratePreview = () => {
    if (!formData.employerName || !formData.jobRole || !formData.salary || !formData.location) {
      toast({
        title: "Missing Information",
        description: "Please fill all required fields before generating preview.",
        variant: "destructive"
      });
      return;
    }
    setShowPreview(true);
  };

  const handleSaveDraft = () => {
    toast({
      title: "Draft Saved",
      description: "OFR form has been saved as draft.",
    });
  };

  const handleFinalizeSubmit = () => {
    if (!formData.digitalSignature) {
      toast({
        title: "Digital Signature Required",
        description: "Please upload digital signature before finalizing.",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: "OFR Finalized",
      description: "OFR form has been finalized and submitted successfully.",
    });
    onClose();
  };

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl text-primary">
            OFR Form Generation - {candidate.name}
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Form Section */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>OFR Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Candidate Name</Label>
                    <Input
                      value={formData.candidateName}
                      disabled
                      className="bg-muted"
                    />
                  </div>
                  <div>
                    <Label>Batch</Label>
                    <Input
                      value={formData.batch}
                      disabled
                      className="bg-muted"
                    />
                  </div>
                </div>

                <div>
                  <Label>Employer Name *</Label>
                  <Input
                    value={formData.employerName}
                    onChange={(e) => updateFormData("employerName", e.target.value)}
                    placeholder="Enter employer company name"
                  />
                </div>

                <div>
                  <Label>Job Role *</Label>
                  <Input
                    value={formData.jobRole}
                    onChange={(e) => updateFormData("jobRole", e.target.value)}
                    placeholder="Enter job role/position"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Salary *</Label>
                    <Input
                      value={formData.salary}
                      onChange={(e) => updateFormData("salary", e.target.value)}
                      placeholder="Enter salary amount"
                    />
                  </div>
                  <div>
                    <Label>Location *</Label>
                    <Input
                      value={formData.location}
                      onChange={(e) => updateFormData("location", e.target.value)}
                      placeholder="Enter job location"
                    />
                  </div>
                </div>

                <div>
                  <Label>Digital Signature</Label>
                  <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                    <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">Upload signature (PNG/JPEG)</p>
                    <Input 
                      type="file" 
                      className="mt-2" 
                      accept=".png,.jpg,.jpeg"
                      onChange={(e) => updateFormData("digitalSignature", e.target.files?.[0])}
                    />
                  </div>
                  {formData.digitalSignature && (
                    <Badge className="mt-2 bg-green-100 text-green-800">
                      Signature uploaded
                    </Badge>
                  )}
                </div>

                <Button onClick={handleGeneratePreview} className="w-full">
                  <FileText className="h-4 w-4 mr-2" />
                  Generate Preview
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Preview Section */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>OFR Preview</CardTitle>
              </CardHeader>
              <CardContent>
                {showPreview ? (
                  <div className="space-y-4">
                    <div className="border rounded-lg p-4 bg-muted/30">
                      <h3 className="text-lg font-bold text-center mb-4">
                        OFFER OF EMPLOYMENT
                      </h3>
                      
                      <div className="space-y-2 text-sm">
                        <p><strong>Candidate:</strong> {formData.candidateName}</p>
                        <p><strong>Batch:</strong> {formData.batch}</p>
                        <p><strong>Employer:</strong> {formData.employerName}</p>
                        <p><strong>Position:</strong> {formData.jobRole}</p>
                        <p><strong>Salary:</strong> ₹{formData.salary}</p>
                        <p><strong>Location:</strong> {formData.location}</p>
                        <p><strong>Date:</strong> {new Date().toLocaleDateString()}</p>
                      </div>

                      <div className="mt-4 pt-4 border-t">
                        <p className="text-xs text-muted-foreground">
                          This is a system generated offer letter.
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button variant="outline" className="flex-1">
                        <Download className="h-4 w-4 mr-2" />
                        Download PDF
                      </Button>
                    </div>

                    <div className="flex gap-2 pt-4">
                      <Button onClick={handleSaveDraft} variant="outline" className="flex-1">
                        Save Draft
                      </Button>
                      <Button onClick={handleFinalizeSubmit} className="flex-1">
                        Finalize & Submit
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Fill the form and click "Generate Preview" to see the OFR</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}