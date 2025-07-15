import React, { useState } from "react";
import { MainLayout } from "@/layouts/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertCircle, Users, FileText, CheckCircle, Clock, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const mockPendingTasks = {
  counselling: [
    {
      id: 1,
      candidateName: "John Doe",
      batch: "Batch 2025-01",
      stage: "Stage 2",
      dueDate: "2025-01-20",
      priority: "high",
      notes: "Waiting for document verification"
    },
    {
      id: 2,
      candidateName: "Jane Smith",
      batch: "Batch 2025-01",
      stage: "Stage 1",
      dueDate: "2025-01-18",
      priority: "medium",
      notes: "Initial assessment pending"
    }
  ],
  parentConsent: [
    {
      id: 1,
      candidateName: "Mike Johnson",
      parentName: "David Johnson",
      batch: "Batch 2025-02",
      contactNumber: "+91 9876543212",
      scheduledDate: "2025-01-19",
      priority: "high"
    },
    {
      id: 2,
      candidateName: "Sarah Wilson",
      parentName: "Linda Wilson",
      batch: "Batch 2025-01",
      contactNumber: "+91 9876543213",
      scheduledDate: "2025-01-21",
      priority: "low"
    }
  ],
  ofr: [
    {
      id: 1,
      candidateName: "Alex Brown",
      batch: "Batch 2025-02",
      company: "Tech Corp",
      jobRole: "Software Developer",
      salary: "₹25,000",
      dueDate: "2025-01-22",
      priority: "medium"
    }
  ],
  documents: [
    {
      id: 1,
      candidateName: "Emma Davis",
      batch: "Batch 2025-01",
      missingDocs: ["Bank Passbook", "Caste Certificate"],
      submissionDate: "2025-01-17",
      priority: "high"
    },
    {
      id: 2,
      candidateName: "Tom Wilson",
      batch: "Batch 2025-02",
      missingDocs: ["Education Proof"],
      submissionDate: "2025-01-19",
      priority: "low"
    }
  ]
};

export default function PendingTasks() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("counselling");

  const handleMarkComplete = (taskType: string, taskId: number) => {
    toast({
      title: "Task Completed",
      description: `${taskType} task has been marked as completed.`,
    });
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "high":
        return <Badge variant="destructive">High Priority</Badge>;
      case "medium":
        return <Badge variant="secondary">Medium Priority</Badge>;
      case "low":
        return <Badge variant="outline">Low Priority</Badge>;
      default:
        return <Badge variant="outline">Normal</Badge>;
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case "high":
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case "medium":
        return <Clock className="h-4 w-4 text-orange-500" />;
      default:
        return <CheckCircle className="h-4 w-4 text-green-500" />;
    }
  };

  const getTotalTasks = () => {
    return Object.values(mockPendingTasks).reduce((total, tasks) => total + tasks.length, 0);
  };

  const getHighPriorityTasks = () => {
    return Object.values(mockPendingTasks).reduce((total, tasks) => {
      return total + tasks.filter((task: any) => task.priority === "high").length;
    }, 0);
  };

  return (
    <MainLayout role="counsellor">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Pending Tasks</h1>
            <p className="text-muted-foreground">
              Manage all pending counselling, consent, OFR, and document tasks
            </p>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold">{getTotalTasks()}</div>
                  <p className="text-xs text-muted-foreground">Total Pending</p>
                </div>
                <Clock className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-red-600">{getHighPriorityTasks()}</div>
                  <p className="text-xs text-muted-foreground">High Priority</p>
                </div>
                <AlertCircle className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold">{mockPendingTasks.counselling.length}</div>
                  <p className="text-xs text-muted-foreground">Counselling</p>
                </div>
                <Users className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold">{mockPendingTasks.documents.length}</div>
                  <p className="text-xs text-muted-foreground">Documents</p>
                </div>
                <FileText className="h-8 w-8 text-muted-foreground" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabbed Task Lists */}
        <Card>
          <CardHeader>
            <CardTitle>Task Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="counselling">
                  Counselling ({mockPendingTasks.counselling.length})
                </TabsTrigger>
                <TabsTrigger value="parentConsent">
                  Parent Consent ({mockPendingTasks.parentConsent.length})
                </TabsTrigger>
                <TabsTrigger value="ofr">
                  OFR ({mockPendingTasks.ofr.length})
                </TabsTrigger>
                <TabsTrigger value="documents">
                  Documents ({mockPendingTasks.documents.length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="counselling" className="mt-6">
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Candidate</TableHead>
                        <TableHead>Batch</TableHead>
                        <TableHead>Stage</TableHead>
                        <TableHead>Due Date</TableHead>
                        <TableHead>Priority</TableHead>
                        <TableHead>Notes</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockPendingTasks.counselling.map((task) => (
                        <TableRow key={task.id}>
                          <TableCell className="font-medium">{task.candidateName}</TableCell>
                          <TableCell>{task.batch}</TableCell>
                          <TableCell>{task.stage}</TableCell>
                          <TableCell>{task.dueDate}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {getPriorityIcon(task.priority)}
                              {getPriorityBadge(task.priority)}
                            </div>
                          </TableCell>
                          <TableCell className="max-w-xs truncate">{task.notes}</TableCell>
                          <TableCell>
                            <Button size="sm" onClick={() => handleMarkComplete("Counselling", task.id)}>
                              Start Session
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>

              <TabsContent value="parentConsent" className="mt-6">
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Candidate</TableHead>
                        <TableHead>Parent Name</TableHead>
                        <TableHead>Batch</TableHead>
                        <TableHead>Contact</TableHead>
                        <TableHead>Scheduled Date</TableHead>
                        <TableHead>Priority</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockPendingTasks.parentConsent.map((task) => (
                        <TableRow key={task.id}>
                          <TableCell className="font-medium">{task.candidateName}</TableCell>
                          <TableCell>{task.parentName}</TableCell>
                          <TableCell>{task.batch}</TableCell>
                          <TableCell>{task.contactNumber}</TableCell>
                          <TableCell>{task.scheduledDate}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {getPriorityIcon(task.priority)}
                              {getPriorityBadge(task.priority)}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Button size="sm" onClick={() => handleMarkComplete("Parent Consent", task.id)}>
                              Call Parent
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>

              <TabsContent value="ofr" className="mt-6">
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Candidate</TableHead>
                        <TableHead>Batch</TableHead>
                        <TableHead>Company</TableHead>
                        <TableHead>Job Role</TableHead>
                        <TableHead>Salary</TableHead>
                        <TableHead>Due Date</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockPendingTasks.ofr.map((task) => (
                        <TableRow key={task.id}>
                          <TableCell className="font-medium">{task.candidateName}</TableCell>
                          <TableCell>{task.batch}</TableCell>
                          <TableCell>{task.company}</TableCell>
                          <TableCell>{task.jobRole}</TableCell>
                          <TableCell>{task.salary}</TableCell>
                          <TableCell>{task.dueDate}</TableCell>
                          <TableCell>
                            <Button size="sm" onClick={() => handleMarkComplete("OFR", task.id)}>
                              Generate OFR
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>

              <TabsContent value="documents" className="mt-6">
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Candidate</TableHead>
                        <TableHead>Batch</TableHead>
                        <TableHead>Missing Documents</TableHead>
                        <TableHead>Submission Date</TableHead>
                        <TableHead>Priority</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockPendingTasks.documents.map((task) => (
                        <TableRow key={task.id}>
                          <TableCell className="font-medium">{task.candidateName}</TableCell>
                          <TableCell>{task.batch}</TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-1">
                              {task.missingDocs.map((doc, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {doc}
                                </Badge>
                              ))}
                            </div>
                          </TableCell>
                          <TableCell>{task.submissionDate}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {getPriorityIcon(task.priority)}
                              {getPriorityBadge(task.priority)}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex gap-2">
                              <Button size="sm" variant="outline">
                                <Eye className="mr-1 h-3 w-3" />
                                Review
                              </Button>
                              <Button size="sm" onClick={() => handleMarkComplete("Document", task.id)}>
                                Remind
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}