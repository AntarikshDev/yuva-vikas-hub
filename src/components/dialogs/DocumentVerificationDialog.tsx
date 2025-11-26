import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle2, XCircle, FileCheck } from "lucide-react";

interface DocumentVerificationDialogProps {
  open: boolean;
  onClose: () => void;
  candidate: any;
  onVerificationComplete: (data: any) => void;
}

interface DocumentCheck {
  applicationForm: string;
  ageCertificate: string;
  incomeProof: string;
  categoryProof: string;
  categoryType: string;
  idProof: string;
  educationalProof: string;
  consentProof: string;
  domicileProof: string;
}

export function DocumentVerificationDialog({ 
  open, 
  onClose, 
  candidate,
  onVerificationComplete 
}: DocumentVerificationDialogProps) {
  const { toast } = useToast();
  
  const [documentChecks, setDocumentChecks] = useState<DocumentCheck>({
    applicationForm: "",
    ageCertificate: "",
    incomeProof: "",
    categoryProof: "",
    categoryType: "",
    idProof: "",
    educationalProof: "",
    consentProof: "",
    domicileProof: "",
  });

  const handleDocumentChange = (field: keyof DocumentCheck, value: string) => {
    setDocumentChecks(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const isFormComplete = () => {
    return Object.entries(documentChecks).every(([key, value]) => {
      if (key === "categoryType") return true; // Optional
      return value !== "";
    });
  };

  const handleFinalSubmit = () => {
    if (!isFormComplete()) {
      toast({
        title: "Incomplete Verification",
        description: "Please check all documents before submitting",
        variant: "destructive"
      });
      return;
    }

    const allVerified = Object.entries(documentChecks).every(([key, value]) => {
      if (key === "categoryType") return true;
      return value === "yes";
    });

    if (!allVerified) {
      toast({
        title: "Documents Incomplete",
        description: "Some documents are not in the correct format. Please review before submitting.",
        variant: "destructive"
      });
      return;
    }

    onVerificationComplete(documentChecks);
    toast({
      title: "Verification Complete",
      description: "All documents have been verified successfully",
    });
  };

  const renderDocumentRow = (
    title: string,
    criteria: string,
    documentName: string,
    field: keyof DocumentCheck
  ) => (
    <div className="grid grid-cols-4 gap-4 py-4 border-b items-center">
      <div>
        <p className="font-medium text-sm">{title}</p>
      </div>
      <div>
        <p className="text-sm text-muted-foreground">{criteria}</p>
      </div>
      <div>
        <p className="text-sm">{documentName}</p>
      </div>
      <div>
        <RadioGroup
          value={documentChecks[field]}
          onValueChange={(value) => handleDocumentChange(field, value)}
          className="flex gap-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="yes" id={`${field}-yes`} />
            <Label htmlFor={`${field}-yes`} className="cursor-pointer">Yes</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="no" id={`${field}-no`} />
            <Label htmlFor={`${field}-no`} className="cursor-pointer">No</Label>
          </div>
        </RadioGroup>
      </div>
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileCheck className="h-5 w-5" />
            Document Verification - {candidate?.name}
          </DialogTitle>
          <DialogDescription>
            Verify that all eligibility documents are in the correct format and collected
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Candidate Basic Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Candidate Information</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-3 gap-4">
              <div>
                <Label className="text-sm font-medium">Name</Label>
                <p className="text-sm">{candidate?.name}</p>
              </div>
              <div>
                <Label className="text-sm font-medium">Father's Name</Label>
                <p className="text-sm">{candidate?.fatherName}</p>
              </div>
              <div>
                <Label className="text-sm font-medium">Age</Label>
                <p className="text-sm">{candidate?.age} Years</p>
              </div>
              <div>
                <Label className="text-sm font-medium">Category</Label>
                <p className="text-sm">{candidate?.community}</p>
              </div>
              <div>
                <Label className="text-sm font-medium">Education</Label>
                <p className="text-sm">{candidate?.education}</p>
              </div>
              <div>
                <Label className="text-sm font-medium">Mobile</Label>
                <p className="text-sm">{candidate?.mobile}</p>
              </div>
            </CardContent>
          </Card>

          {/* Document Verification Checklist */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Eligibility Criteria Documents</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {/* Header Row */}
                <div className="grid grid-cols-4 gap-4 pb-2 border-b bg-muted/50 p-2 rounded-t-lg">
                  <div><p className="font-semibold text-sm">Parameters</p></div>
                  <div><p className="font-semibold text-sm">Criteria</p></div>
                  <div><p className="font-semibold text-sm">Document Checked & Collected</p></div>
                  <div><p className="font-semibold text-sm">Tick Mark ✓</p></div>
                </div>

                {/* Candidate Information */}
                {renderDocumentRow(
                  "Candidate Information",
                  "Filled in & Complete",
                  "Application Form / OFR & PP Photographs- 6 Nos.",
                  "applicationForm"
                )}

                {/* Age */}
                {renderDocumentRow(
                  "Age",
                  "18-28 Years",
                  "Copy of 10th Certificate / School leaving certificate / Birth Certificate",
                  "ageCertificate"
                )}

                {/* Income Proof */}
                {renderDocumentRow(
                  "Income Proof",
                  "BPL Category",
                  "Copy of BPL Card",
                  "incomeProof"
                )}

                {/* Category Proof */}
                <div className="grid grid-cols-4 gap-4 py-4 border-b items-start">
                  <div>
                    <p className="font-medium text-sm">Category Proof</p>
                  </div>
                  <div className="space-y-2">
                    <RadioGroup
                      value={documentChecks.categoryType}
                      onValueChange={(value) => handleDocumentChange("categoryType", value)}
                      className="space-y-2"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="sc" id="cat-sc" />
                        <Label htmlFor="cat-sc" className="cursor-pointer">SC</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="st" id="cat-st" />
                        <Label htmlFor="cat-st" className="cursor-pointer">ST</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="minority" id="cat-minority" />
                        <Label htmlFor="cat-minority" className="cursor-pointer">Minority</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="obc" id="cat-obc" />
                        <Label htmlFor="cat-obc" className="cursor-pointer">OBC</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="others" id="cat-others" />
                        <Label htmlFor="cat-others" className="cursor-pointer">Others</Label>
                      </div>
                    </RadioGroup>
                  </div>
                  <div>
                    <p className="text-sm">Copy of Caste Certificate</p>
                  </div>
                  <div>
                    <RadioGroup
                      value={documentChecks.categoryProof}
                      onValueChange={(value) => handleDocumentChange("categoryProof", value)}
                      className="flex gap-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="yes" id="categoryProof-yes" />
                        <Label htmlFor="categoryProof-yes" className="cursor-pointer">Yes</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="no" id="categoryProof-no" />
                        <Label htmlFor="categoryProof-no" className="cursor-pointer">No</Label>
                      </div>
                    </RadioGroup>
                  </div>
                </div>

                {/* ID Proof */}
                {renderDocumentRow(
                  "Id Proof",
                  "Aadhar Enrolment No.",
                  "Copy of Aadhar Card",
                  "idProof"
                )}

                {/* Educational Proof */}
                {renderDocumentRow(
                  "Educational Proof",
                  "As per Industry / SSC requirement based upon the sector/trade",
                  "Copy of High School / Intermediate / School Leaving Certificate",
                  "educationalProof"
                )}

                {/* Consent Proof */}
                {renderDocumentRow(
                  "Consent Proof",
                  "Document signed by the Parent giving his/her consent towards joining the program",
                  "Parent Consent Form",
                  "consentProof"
                )}

                {/* Domicile Proof */}
                {renderDocumentRow(
                  "Domicile Proof",
                  "",
                  "Copy of Domicile",
                  "domicileProof"
                )}
              </div>
            </CardContent>
          </Card>

          {/* Verification Summary */}
          <Card className="bg-muted/30">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <span>Verified: {Object.values(documentChecks).filter(v => v === "yes").length}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <XCircle className="h-4 w-4 text-red-600" />
                    <span>Not Verified: {Object.values(documentChecks).filter(v => v === "no").length}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span>Pending: {Object.values(documentChecks).filter(v => v === "").length}</span>
                  </div>
                </div>
                <Button 
                  onClick={handleFinalSubmit}
                  size="lg"
                  disabled={!isFormComplete()}
                  className="min-w-[200px]"
                >
                  <FileCheck className="h-4 w-4 mr-2" />
                  Final Submit
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}
