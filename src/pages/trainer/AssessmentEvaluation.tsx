import { useState } from "react";
import { FileText, Star, Clock, CheckCircle, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const AssessmentEvaluation = () => {
  const [selectedAssessment, setSelectedAssessment] = useState<any>(null);
  const [marks, setMarks] = useState<string>("");
  const [comments, setComments] = useState<string>("");

  const assessments = [
    {
      id: 1,
      candidateName: "Ravi Kumar",
      candidateId: "RSD101001",
      assessmentName: "Module 1 - Customer Service Test",
      submissionDate: "2025-07-18",
      status: "pending",
      totalMarks: 100,
      timeLimit: "60 minutes",
      submittedFiles: ["answer_sheet.pdf", "practical_demo.mp4"]
    },
    {
      id: 2,
      candidateName: "Priya Sharma", 
      candidateId: "RSD101002",
      assessmentName: "Module 1 - Customer Service Test",
      submissionDate: "2025-07-18",
      status: "reviewed",
      score: 85,
      totalMarks: 100,
      timeLimit: "60 minutes",
      comments: "Good understanding of concepts"
    },
    {
      id: 3,
      candidateName: "Amit Singh",
      candidateId: "RSD101003", 
      assessmentName: "Module 2 - Sales Techniques",
      submissionDate: "2025-07-17",
      status: "pending",
      totalMarks: 100,
      timeLimit: "90 minutes",
      submittedFiles: ["assessment_answers.pdf"]
    },
    {
      id: 4,
      candidateName: "Sneha Patel",
      candidateId: "RSD101004",
      assessmentName: "Module 1 - Customer Service Test", 
      submissionDate: "2025-07-19",
      status: "pending",
      totalMarks: 100,
      timeLimit: "60 minutes",
      submittedFiles: ["answers.pdf", "case_study.docx"]
    }
  ];

  const batchReport = [
    {
      candidateName: "Ravi Kumar",
      candidateId: "RSD101001",
      module1: 78,
      module2: 85,
      module3: "-",
      average: 81.5,
      status: "Pass"
    },
    {
      candidateName: "Priya Sharma",
      candidateId: "RSD101002", 
      module1: 85,
      module2: 92,
      module3: "-",
      average: 88.5,
      status: "Pass"
    },
    {
      candidateName: "Amit Singh",
      candidateId: "RSD101003",
      module1: 72,
      module2: "-",
      module3: "-", 
      average: 72,
      status: "Pass"
    },
    {
      candidateName: "Sneha Patel",
      candidateId: "RSD101004",
      module1: "-",
      module2: "-",
      module3: "-",
      average: "-",
      status: "Pending"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "reviewed": return "default";
      case "pending": return "secondary";
      default: return "outline";
    }
  };

  const handleEvaluate = (assessment: any) => {
    setSelectedAssessment(assessment);
    setMarks("");
    setComments("");
  };

  const handleSaveEvaluation = () => {
    console.log("Saving evaluation:", { marks, comments });
    setSelectedAssessment(null);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <h1 className="text-3xl font-bold">Assessment Evaluation</h1>
        <div className="flex gap-4">
          <Select defaultValue="all">
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Filter Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="reviewed">Reviewed</SelectItem>
            </SelectContent>
          </Select>
          <Select defaultValue="rsd-101">
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select Batch" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="rsd-101">Batch RSD-101</SelectItem>
              <SelectItem value="css-102">Batch CSS-102</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Assessments</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{assessments.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {assessments.filter(a => a.status === "pending").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Reviewed</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {assessments.filter(a => a.status === "reviewed").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Score</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">82%</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="evaluation" className="space-y-6">
        <TabsList>
          <TabsTrigger value="evaluation">Assessment Evaluation</TabsTrigger>
          <TabsTrigger value="report">Batch Assessment Report</TabsTrigger>
        </TabsList>

        <TabsContent value="evaluation" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Pending Assessments</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Candidate</TableHead>
                    <TableHead>Assessment</TableHead>
                    <TableHead>Submission Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Score</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {assessments.map((assessment) => (
                    <TableRow key={assessment.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{assessment.candidateName}</div>
                          <div className="text-sm text-muted-foreground">{assessment.candidateId}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{assessment.assessmentName}</div>
                          <div className="text-sm text-muted-foreground">
                            Total: {assessment.totalMarks} marks • {assessment.timeLimit}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{assessment.submissionDate}</TableCell>
                      <TableCell>
                        <Badge variant={getStatusColor(assessment.status)}>
                          {assessment.status === "pending" ? "Pending Review" : "Reviewed"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {assessment.score ? `${assessment.score}/${assessment.totalMarks}` : "-"}
                      </TableCell>
                      <TableCell>
                        {assessment.status === "pending" ? (
                          <Button 
                            size="sm" 
                            onClick={() => handleEvaluate(assessment)}
                          >
                            Evaluate
                          </Button>
                        ) : (
                          <Button size="sm" variant="outline">
                            View Details
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="report" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Batch Assessment Progress Report</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Candidate</TableHead>
                    <TableHead>Module 1</TableHead>
                    <TableHead>Module 2</TableHead>
                    <TableHead>Module 3</TableHead>
                    <TableHead>Average</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Remarks</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {batchReport.map((candidate, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{candidate.candidateName}</div>
                          <div className="text-sm text-muted-foreground">{candidate.candidateId}</div>
                        </div>
                      </TableCell>
                      <TableCell>{candidate.module1}</TableCell>
                      <TableCell>{candidate.module2}</TableCell>
                      <TableCell>{candidate.module3}</TableCell>
                      <TableCell className="font-medium">{candidate.average}</TableCell>
                      <TableCell>
                        <Badge variant={candidate.status === "Pass" ? "default" : "secondary"}>
                          {candidate.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button size="sm" variant="outline">
                          Add Remarks
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Evaluation Modal */}
      {selectedAssessment && (
        <Dialog open={!!selectedAssessment} onOpenChange={() => setSelectedAssessment(null)}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Evaluate Assessment</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Candidate</Label>
                  <div className="font-medium">{selectedAssessment.candidateName}</div>
                  <div className="text-sm text-muted-foreground">{selectedAssessment.candidateId}</div>
                </div>
                <div>
                  <Label>Assessment</Label>
                  <div className="font-medium">{selectedAssessment.assessmentName}</div>
                  <div className="text-sm text-muted-foreground">
                    Total Marks: {selectedAssessment.totalMarks}
                  </div>
                </div>
              </div>

              <div>
                <Label>Submitted Files</Label>
                <div className="space-y-2 mt-2">
                  {selectedAssessment.submittedFiles?.map((file: string, index: number) => (
                    <div key={index} className="flex items-center justify-between p-2 border rounded">
                      <span className="text-sm">{file}</span>
                      <Button size="sm" variant="outline">View/Download</Button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="marks">Marks Scored</Label>
                  <Input 
                    id="marks"
                    type="number"
                    placeholder={`Out of ${selectedAssessment.totalMarks}`}
                    value={marks}
                    onChange={(e) => setMarks(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="percentage">Percentage</Label>
                  <Input 
                    id="percentage"
                    value={marks ? `${Math.round((parseInt(marks) / selectedAssessment.totalMarks) * 100)}%` : ""}
                    disabled
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="comments">Comments & Feedback</Label>
                <Textarea 
                  id="comments"
                  placeholder="Provide detailed feedback on performance..."
                  rows={4}
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setSelectedAssessment(null)}>
                  Cancel
                </Button>
                <Button onClick={handleSaveEvaluation}>
                  Save Evaluation
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default AssessmentEvaluation;