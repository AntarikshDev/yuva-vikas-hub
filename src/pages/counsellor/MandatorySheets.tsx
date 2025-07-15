import React, { useState } from "react";
import { MainLayout } from "@/layouts/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { FileDown, Check, Eye, Upload } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const mockSheetData = [
  {
    id: 1,
    title: "Counselling Sheet Generator",
    description: "Generate counselling sheets as per Placement & Counselling Sheet.xlsx format",
    status: "pending"
  },
  {
    id: 2,
    title: "Declaration by Centre Manager",
    description: "View-only preview of Declaration by Centre Manager.docx",
    status: "acknowledged"
  },
  {
    id: 3,
    title: "Declaration Letter – Candidate Wise",
    description: "Company, salary, lodging/fooding amounts for placed candidates",
    status: "completed"
  }
];

export default function MandatorySheets() {
  const { toast } = useToast();
  const [selectedCandidate, setSelectedCandidate] = useState("all");
  const [formData, setFormData] = useState({
    candidateName: "",
    sessionDate: "",
    notes: "",
    readinessLevel: ""
  });

  const handleDownloadSheet = () => {
    toast({
      title: "Download Started",
      description: "Counselling sheet is being downloaded as Excel file.",
    });
  };

  const handleAcknowledge = (sheetId: number) => {
    toast({
      title: "Acknowledged",
      description: "Declaration has been marked as acknowledged.",
    });
  };

  const handleSubmit = () => {
    toast({
      title: "Sheet Saved",
      description: "Counselling sheet has been saved successfully.",
    });
  };

  return (
    <MainLayout role="counsellor">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Mandatory Sheets & Declarations</h1>
            <p className="text-muted-foreground">
              Manage all mandatory sheets and declarations required for counselling
            </p>
          </div>
        </div>

        <div className="grid gap-6">
          {/* Counselling Sheet Generator */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileDown className="h-5 w-5" />
                Counselling Sheet Generator
              </CardTitle>
              <CardDescription>
                Generate counselling sheets as per Placement & Counselling Sheet.xlsx format
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="candidate">Select Candidate</Label>
                  <Select value={selectedCandidate} onValueChange={setSelectedCandidate}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select candidate" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Candidates</SelectItem>
                      <SelectItem value="john">John Doe</SelectItem>
                      <SelectItem value="jane">Jane Smith</SelectItem>
                      <SelectItem value="mike">Mike Johnson</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sessionDate">Session Date</Label>
                  <Input
                    id="sessionDate"
                    type="date"
                    value={formData.sessionDate}
                    onChange={(e) => setFormData({ ...formData, sessionDate: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="readiness">Readiness Level</Label>
                  <Select value={formData.readinessLevel} onValueChange={(value) => setFormData({ ...formData, readinessLevel: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select readiness level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="excellent">Excellent</SelectItem>
                      <SelectItem value="good">Good</SelectItem>
                      <SelectItem value="average">Average</SelectItem>
                      <SelectItem value="poor">Poor</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="notes">Session Notes</Label>
                  <Textarea
                    id="notes"
                    placeholder="Enter counselling session notes..."
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    rows={3}
                  />
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <Button onClick={handleDownloadSheet} variant="outline">
                  <FileDown className="mr-2 h-4 w-4" />
                  Download as Excel
                </Button>
                <Button onClick={handleSubmit}>
                  Save & Submit
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Declaration Sheets */}
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Declaration by Centre Manager
                  <Badge variant="secondary">View Only</Badge>
                </CardTitle>
                <CardDescription>
                  Auto-filled declaration by Centre Manager
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      Declaration content preview will be displayed here...
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Eye className="mr-2 h-4 w-4" />
                      View Full Document
                    </Button>
                    <Button size="sm" onClick={() => handleAcknowledge(2)}>
                      <Check className="mr-2 h-4 w-4" />
                      Mark Acknowledged
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Declaration Letter - Candidate Wise
                  <Badge variant="secondary">View Only</Badge>
                </CardTitle>
                <CardDescription>
                  Company, salary, and lodging details for placed candidates
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="overflow-hidden rounded-md border">
                    <table className="w-full text-sm">
                      <thead className="bg-muted">
                        <tr>
                          <th className="p-2 text-left">Company</th>
                          <th className="p-2 text-left">Salary</th>
                          <th className="p-2 text-left">Lodging</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-t">
                          <td className="p-2">Tech Corp</td>
                          <td className="p-2">₹25,000</td>
                          <td className="p-2">₹5,000</td>
                        </tr>
                        <tr className="border-t">
                          <td className="p-2">Innovation Ltd</td>
                          <td className="p-2">₹30,000</td>
                          <td className="p-2">₹6,000</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <Button variant="outline" size="sm">
                    <Eye className="mr-2 h-4 w-4" />
                    View Complete List
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}