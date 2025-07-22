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
import { AlertTriangle, Phone, Search, Camera, Upload, Clock, CheckCircle } from "lucide-react";

const SOSManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [stateFilter, setStateFilter] = useState("");
  const [batchFilter, setBatchFilter] = useState("");

  const sosData = [
    {
      id: 1,
      candidateName: "Ravi Kumar",
      batch: "Batch X",
      sosType: "Accommodation Issue",
      raisedDate: "2025-07-21",
      status: "Open",
      priority: "Critical",
      description: "Hostel room not allocated as promised, sleeping in common area",
      contactNumber: "+91 9876543210",
      company: "TechCorp India",
      location: "Bangalore"
    },
    {
      id: 2,
      candidateName: "Priya Sharma",
      batch: "Batch Y", 
      sosType: "Salary Delay",
      raisedDate: "2025-07-20",
      status: "In Progress",
      priority: "High",
      description: "First month salary not received, facing financial difficulties",
      contactNumber: "+91 9876543211",
      company: "RetailMax Ltd",
      location: "Delhi"
    },
    {
      id: 3,
      candidateName: "Amit Singh",
      batch: "Batch Z",
      sosType: "Workplace Issue",
      raisedDate: "2025-07-19",
      status: "Resolved",
      priority: "Medium",
      description: "Excessive overtime without proper compensation",
      contactNumber: "+91 9876543212",
      company: "ServicePro Pvt",
      location: "Chennai"
    },
    {
      id: 4,
      candidateName: "Neha Gupta",
      batch: "Batch A",
      sosType: "Health Issue",
      raisedDate: "2025-07-18",
      status: "Open",
      priority: "High",
      description: "Medical emergency, need assistance with hospital admission",
      contactNumber: "+91 9876543213",
      company: "HealthCare Corp",
      location: "Mumbai"
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
    const matchesState = !stateFilter || sos.location === stateFilter;
    const matchesBatch = !batchFilter || sos.batch === batchFilter;
    return matchesSearch && matchesStatus && matchesState && matchesBatch;
  });

  const openSOS = sosData.filter(sos => sos.status === "Open").length;
  const inProgressSOS = sosData.filter(sos => sos.status === "In Progress").length;
  const resolvedSOS = sosData.filter(sos => sos.status === "Resolved").length;

  return (
    <div className="p-4 md:p-6 space-y-6 bg-gradient-to-br from-slate-50 to-purple-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">SOS Management</h1>
          <p className="text-gray-600">Track and resolve candidate SOS alerts</p>
        </div>
        <div className="flex items-center gap-2">
          {openSOS > 0 && (
            <Badge variant="destructive" className="animate-pulse">
              {openSOS} Open SOS
            </Badge>
          )}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search SOS..."
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

            <Select value={stateFilter} onValueChange={setStateFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by Location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Locations</SelectItem>
                <SelectItem value="Bangalore">Bangalore</SelectItem>
                <SelectItem value="Delhi">Delhi</SelectItem>
                <SelectItem value="Chennai">Chennai</SelectItem>
                <SelectItem value="Mumbai">Mumbai</SelectItem>
              </SelectContent>
            </Select>

            <Select value={batchFilter} onValueChange={setBatchFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by Batch" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Batches</SelectItem>
                <SelectItem value="Batch X">Batch X</SelectItem>
                <SelectItem value="Batch Y">Batch Y</SelectItem>
                <SelectItem value="Batch Z">Batch Z</SelectItem>
                <SelectItem value="Batch A">Batch A</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" onClick={() => {
              setSearchTerm("");
              setStatusFilter("");
              setStateFilter("");
              setBatchFilter("");
            }}>
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
            SOS Alerts ({filteredSOS.length} items)
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
                  <TableHead>SOS Type</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Raised Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSOS.map((sos) => (
                  <TableRow key={sos.id} className={sos.priority === "Critical" ? "bg-red-50" : ""}>
                    <TableCell>
                      <Badge variant={getPriorityColor(sos.priority)}>
                        {sos.priority}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-semibold">{sos.candidateName}</TableCell>
                    <TableCell>{sos.batch}</TableCell>
                    <TableCell>{sos.sosType}</TableCell>
                    <TableCell>{sos.location}</TableCell>
                    <TableCell>{sos.raisedDate}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusColor(sos.status)}>
                        {sos.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Phone className="w-4 h-4" />
                        </Button>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                              Resolve
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>SOS Resolution - {sos.candidateName}</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <Label>Candidate Name</Label>
                                  <p className="text-sm text-gray-600">{sos.candidateName}</p>
                                </div>
                                <div>
                                  <Label>Contact Number</Label>
                                  <div className="flex items-center gap-2">
                                    <p className="text-sm text-gray-600">{sos.contactNumber}</p>
                                    <Button size="sm" variant="outline">
                                      <Phone className="w-3 h-3" />
                                    </Button>
                                  </div>
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
                              </div>
                              
                              <div>
                                <Label>Issue Description</Label>
                                <Textarea value={sos.description} readOnly />
                              </div>

                              <div>
                                <Label>Resolution Action</Label>
                                <Textarea placeholder="Describe the action taken to resolve this SOS..." />
                              </div>

                              <div>
                                <Label>Upload Supporting Evidence</Label>
                                <div className="grid grid-cols-2 gap-2 mt-2">
                                  <Button variant="outline" className="h-20 flex-col">
                                    <Camera className="w-6 h-6 mb-1" />
                                    <span className="text-xs">Take Photo</span>
                                  </Button>
                                  <Button variant="outline" className="h-20 flex-col">
                                    <Upload className="w-6 h-6 mb-1" />
                                    <span className="text-xs">Upload File</span>
                                  </Button>
                                </div>
                              </div>

                              <div>
                                <Label>Status Update</Label>
                                <Select>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Update status" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="in-progress">Mark In Progress</SelectItem>
                                    <SelectItem value="resolved">Mark as Resolved</SelectItem>
                                    <SelectItem value="escalated">Escalate to PPC Admin</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>

                              <Button className="w-full bg-purple-600 hover:bg-purple-700">
                                Submit Resolution
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SOSManagement;