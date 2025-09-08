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
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ParentCounsellingDialogProps {
  candidate: any;
  open: boolean;
  onClose: () => void;
  onUpdate?: (sessionData: any) => void;
}

export function ParentCounsellingDialog({ candidate, open, onClose, onUpdate }: ParentCounsellingDialogProps) {
  const [formData, setFormData] = useState({
    candidateName: candidate.name,
    parentName: "",
    sessionDate: "",
    sessionTime: "",
    parentConsent: "",
    feedback: "",
    parentPhoto: null
  });
  const { toast } = useToast();

  const handleSave = () => {
    if (formData.parentName && formData.sessionDate && formData.parentConsent && formData.feedback) {
      const sessionData = {
        candidateId: candidate.id,
        parentName: formData.parentName,
        sessionDate: formData.sessionDate,
        sessionTime: formData.sessionTime,
        consent: formData.parentConsent,
        feedback: formData.feedback,
        lastUpdated: new Date().toISOString()
      };
      
      onUpdate?.(sessionData);
      
      toast({
        title: "Parent Counselling Saved",
        description: "Parent counselling session has been recorded successfully.",
      });
      onClose();
    } else {
      toast({
        title: "Incomplete Data",
        description: "Please fill all required fields before saving.",
        variant: "destructive"
      });
    }
  };

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl text-primary">
            Parent Counselling - {candidate.name}
          </DialogTitle>
        </DialogHeader>

        <Card>
          <CardHeader>
            <CardTitle>Parent Counselling Session</CardTitle>
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
                <Label>Parent Name</Label>
                <Input
                  value={formData.parentName}
                  onChange={(e) => updateFormData("parentName", e.target.value)}
                  placeholder="Enter parent's name"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Session Date</Label>
                <Input
                  type="date"
                  value={formData.sessionDate}
                  onChange={(e) => updateFormData("sessionDate", e.target.value)}
                />
              </div>
              <div>
                <Label>Session Time</Label>
                <Input
                  type="time"
                  value={formData.sessionTime}
                  onChange={(e) => updateFormData("sessionTime", e.target.value)}
                />
              </div>
            </div>

            <div>
              <Label>Parent Consent</Label>
              <Select
                value={formData.parentConsent}
                onValueChange={(value) => updateFormData("parentConsent", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select consent status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="yes">Yes - Consent Given</SelectItem>
                  <SelectItem value="no">No - Consent Denied</SelectItem>
                  <SelectItem value="conditional">Conditional Consent</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Parent Feedback</Label>
              <Textarea
                placeholder="Enter parent's feedback and concerns..."
                value={formData.feedback}
                onChange={(e) => updateFormData("feedback", e.target.value)}
                rows={4}
              />
            </div>

            <div>
              <Label>Parent Photo</Label>
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">Upload parent photo (JPEG/PDF)</p>
                <Input 
                  type="file" 
                  className="mt-2" 
                  accept=".jpg,.jpeg,.pdf"
                  onChange={(e) => updateFormData("parentPhoto", e.target.files?.[0])}
                />
              </div>
            </div>

            <div className="flex gap-2 pt-4">
              <Button onClick={handleSave} className="flex-1">
                Save & Mark Completed
              </Button>
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
}