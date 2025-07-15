import React, { useState } from "react";
import { MainLayout } from "@/layouts/MainLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Video, Check, X, Search, Filter } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const mockVideoLogs = [
  {
    id: 1,
    videoName: "Pre-Placement Counselling Session 1",
    datePlayed: "2025-01-15",
    candidateName: "John Doe",
    status: "reviewed",
    duration: "45 min",
    notes: "Candidate showed good understanding"
  },
  {
    id: 2,
    videoName: "Parent Counselling Video Guide",
    datePlayed: "2025-01-14",
    candidateName: "Jane Smith",
    status: "pending",
    duration: "30 min",
    notes: ""
  },
  {
    id: 3,
    videoName: "OFR Process Explanation",
    datePlayed: "2025-01-13",
    candidateName: "Mike Johnson",
    status: "reviewed",
    duration: "25 min",
    notes: "Parent questions addressed"
  },
  {
    id: 4,
    videoName: "Document Compliance Training",
    datePlayed: "2025-01-12",
    candidateName: "Sarah Wilson",
    status: "not_reviewed",
    duration: "35 min",
    notes: ""
  }
];

export default function VideoLogs() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredLogs = mockVideoLogs.filter(log => {
    const matchesSearch = log.videoName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.candidateName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || log.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleMarkReviewed = (logId: number) => {
    toast({
      title: "Video Marked as Reviewed",
      description: "The video log has been marked as reviewed.",
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "reviewed":
        return <Badge variant="default" className="bg-green-100 text-green-800">Reviewed</Badge>;
      case "pending":
        return <Badge variant="secondary">Pending</Badge>;
      case "not_reviewed":
        return <Badge variant="destructive">Not Reviewed</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <MainLayout role="counsellor">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Video Logs Record</h1>
            <p className="text-muted-foreground">
              Track and validate counselling videos for compliance
            </p>
          </div>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search videos or candidates..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant={statusFilter === "all" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setStatusFilter("all")}
                >
                  All
                </Button>
                <Button
                  variant={statusFilter === "reviewed" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setStatusFilter("reviewed")}
                >
                  Reviewed
                </Button>
                <Button
                  variant={statusFilter === "pending" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setStatusFilter("pending")}
                >
                  Pending
                </Button>
                <Button
                  variant={statusFilter === "not_reviewed" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setStatusFilter("not_reviewed")}
                >
                  Not Reviewed
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Video Logs Table */}
        <Card>
          <CardHeader>
            <CardTitle>Video Logs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Video Name</TableHead>
                    <TableHead>Candidate</TableHead>
                    <TableHead>Date Played</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Notes</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLogs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <Video className="h-4 w-4 text-muted-foreground" />
                          {log.videoName}
                        </div>
                      </TableCell>
                      <TableCell>{log.candidateName}</TableCell>
                      <TableCell>{log.datePlayed}</TableCell>
                      <TableCell>{log.duration}</TableCell>
                      <TableCell>{getStatusBadge(log.status)}</TableCell>
                      <TableCell className="max-w-xs truncate">
                        {log.notes || "No notes"}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          {log.status !== "reviewed" && (
                            <Button
                              size="sm"
                              onClick={() => handleMarkReviewed(log.id)}
                            >
                              <Check className="mr-1 h-3 w-3" />
                              Mark Reviewed
                            </Button>
                          )}
                          <Button size="sm" variant="outline">
                            <Video className="mr-1 h-3 w-3" />
                            View
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Summary Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="p-6">
              <div className="text-2xl font-bold">
                {mockVideoLogs.filter(log => log.status === "reviewed").length}
              </div>
              <p className="text-xs text-muted-foreground">Videos Reviewed</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-2xl font-bold">
                {mockVideoLogs.filter(log => log.status === "pending").length}
              </div>
              <p className="text-xs text-muted-foreground">Pending Review</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-2xl font-bold">
                {mockVideoLogs.filter(log => log.status === "not_reviewed").length}
              </div>
              <p className="text-xs text-muted-foreground">Not Reviewed</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="text-2xl font-bold">{mockVideoLogs.length}</div>
              <p className="text-xs text-muted-foreground">Total Videos</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}