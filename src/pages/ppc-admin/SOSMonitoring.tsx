import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { AlertTriangle, Clock, CheckCircle, Eye, Search, Filter } from "lucide-react";

const SOSMonitoring = () => {
  console.log("SOS Monitoring component loaded");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [sosTypeFilter, setSosTypeFilter] = useState("");

  const sosData = [
    {
      candidateName: "Ravi Kumar",
      batch: "Batch X",
      sosType: "Salary Delay",
      raisedDate: "2025-07-20",
      status: "Open",
      priority: "High",
      description: "Salary payment delayed by 15 days",
      pocAssigned: "Rajesh Verma",
      company: "TechCorp India"
    },
    {
      candidateName: "Priya Sharma",
      batch: "Batch Y", 
      sosType: "Hostel Issue",
      raisedDate: "2025-07-18",
      status: "In Progress",
      priority: "Medium",
      description: "Accommodation facilities not as promised",
      pocAssigned: "Priya Patel",
      company: "RetailMax Ltd"
    },
    {
      candidateName: "Amit Singh",
      batch: "Batch Z",
      sosType: "Workplace Issue",
      raisedDate: "2025-07-19",
      status: "Resolved",
      priority: "Low",
      description: "Working hours exceeded standard limits",
      pocAssigned: "Amit Singh",
      company: "ServicePro Pvt"
    },
    {
      candidateName: "Neha Gupta",
      batch: "Batch A",
      sosType: "Harassment",
      raisedDate: "2025-07-21",
      status: "Open",
      priority: "Critical",
      description: "Workplace harassment reported",
      pocAssigned: "Rajesh Verma",
      company: "TechCorp India"
    },
    {
      candidateName: "Vikash Yadav",
      batch: "Batch B",
      sosType: "Safety Concern",
      raisedDate: "2025-07-17",
      status: "In Progress",
      priority: "High",
      description: "Unsafe working conditions",
      pocAssigned: "Priya Patel",
      company: "IndustrialMax Corp"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Open": return "destructive";
      case "In Progress": return "secondary";
      case "Resolved": return "default";
      default: return "outline";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Critical": return "destructive";
      case "High": return "destructive";
      case "Medium": return "secondary";
      case "Low": return "outline";
      default: return "outline";
    }
  };

  const filteredSOS = sosData.filter(sos => {
    const matchesSearch = sos.candidateName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         sos.batch.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         sos.sosType.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || sos.status === statusFilter;
    const matchesType = !sosTypeFilter || sos.sosType === sosTypeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const openSOS = sosData.filter(sos => sos.status === "Open").length;
  const inProgressSOS = sosData.filter(sos => sos.status === "In Progress").length;
  const resolvedSOS = sosData.filter(sos => sos.status === "Resolved").length;
  const criticalSOS = sosData.filter(sos => sos.priority === "Critical").length;

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">SOS Monitoring & Actions</h1>
          <p className="text-gray-600">Monitor and resolve candidate SOS requests</p>
        </div>
        <div className="flex items-center gap-2">
          {criticalSOS > 0 && (
            <Badge variant="destructive" className="animate-pulse">
              {criticalSOS} Critical SOS
            </Badge>
          )}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-red-600 mb-1">Open SOS</p>
                <p className="text-2xl font-bold text-red-900">{openSOS}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-yellow-600 mb-1">In Progress</p>
                <p className="text-2xl font-bold text-yellow-900">{inProgressSOS}</p>
              </div>
              <Clock className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600 mb-1">Resolved</p>
                <p className="text-2xl font-bold text-green-900">{resolvedSOS}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-purple-200 bg-purple-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-600 mb-1">Critical Priority</p>
                <p className="text-2xl font-bold text-purple-900">{criticalSOS}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search candidate, batch, or SOS type..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="Open">Open</SelectItem>
                <SelectItem value="In Progress">In Progress</SelectItem>
                <SelectItem value="Resolved">Resolved</SelectItem>
              </SelectContent>
            </Select>

            <Select value={sosTypeFilter} onValueChange={setSosTypeFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by SOS Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="Salary Delay">Salary Delay</SelectItem>
                <SelectItem value="Hostel Issue">Hostel Issue</SelectItem>
                <SelectItem value="Workplace Issue">Workplace Issue</SelectItem>
                <SelectItem value="Harassment">Harassment</SelectItem>
                <SelectItem value="Safety Concern">Safety Concern</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* SOS Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            SOS Tracker ({filteredSOS.length} items)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Priority</TableHead>
                  <TableHead>Candidate</TableHead>
                  <TableHead>Batch</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>SOS Type</TableHead>
                  <TableHead>Raised Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>POC Assigned</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSOS.map((sos, index) => (
                  <TableRow key={index} className={sos.priority === "Critical" ? "bg-red-50" : ""}>
                    <TableCell>
                      <Badge variant={getPriorityColor(sos.priority)}>
                        {sos.priority}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-semibold">{sos.candidateName}</TableCell>
                    <TableCell>{sos.batch}</TableCell>
                    <TableCell>{sos.company}</TableCell>
                    <TableCell>{sos.sosType}</TableCell>
                    <TableCell>{sos.raisedDate}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusColor(sos.status)}>
                        {sos.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{sos.pocAssigned}</TableCell>
                    <TableCell>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button size="sm" variant="outline">
                            <Eye className="w-4 h-4 mr-1" />
                            View Details
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>SOS Details - {sos.candidateName}</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label>Candidate Name</Label>
                                <p className="text-sm text-gray-600">{sos.candidateName}</p>
                              </div>
                              <div>
                                <Label>Batch</Label>
                                <p className="text-sm text-gray-600">{sos.batch}</p>
                              </div>
                              <div>
                                <Label>Company</Label>
                                <p className="text-sm text-gray-600">{sos.company}</p>
                              </div>
                              <div>
                                <Label>SOS Type</Label>
                                <p className="text-sm text-gray-600">{sos.sosType}</p>
                              </div>
                              <div>
                                <Label>Priority</Label>
                                <Badge variant={getPriorityColor(sos.priority)}>
                                  {sos.priority}
                                </Badge>
                              </div>
                              <div>
                                <Label>Status</Label>
                                <Badge variant={getStatusColor(sos.status)}>
                                  {sos.status}
                                </Badge>
                              </div>
                            </div>
                            
                            <div>
                              <Label>Description</Label>
                              <Textarea value={sos.description} readOnly />
                            </div>

                            <div>
                              <Label>PPC Admin Remarks</Label>
                              <Textarea placeholder="Add your remarks on this SOS case..." />
                            </div>

                            <div>
                              <Label>Action Status</Label>
                              <Select>
                                <SelectTrigger>
                                  <SelectValue placeholder="Update status" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="in-progress">Mark In Progress</SelectItem>
                                  <SelectItem value="resolved">Mark as Resolved</SelectItem>
                                  <SelectItem value="escalated">Escalate to Management</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>

                            <div className="flex gap-2">
                              <Button className="flex-1 bg-purple-600 hover:bg-purple-700">
                                Update SOS
                              </Button>
                              <Button variant="outline">
                                Contact POC
                              </Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Action Flow Info */}
      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <h4 className="font-semibold text-blue-900 mb-2">SOS Action Flow</h4>
              <p className="text-sm text-blue-700">
                When POC updates issue resolution in their app, status auto-updates here. 
                PPC Admin can add final remarks and verify resolution completion.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SOSMonitoring;