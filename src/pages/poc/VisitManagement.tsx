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
import { Calendar, Camera, Video, Phone, MapPin, Clock, Upload, Eye } from "lucide-react";

const VisitManagement = () => {
  const [viewMode, setViewMode] = useState("month");
  const [stateFilter, setStateFilter] = useState("");
  const [batchFilter, setBatchFilter] = useState("");
  const [hostelFilter, setHostelFilter] = useState("");

  const visits = [
    {
      id: 1,
      date: "2025-07-21",
      time: "10:00 AM",
      location: "Bangalore Hostel A",
      batch: "Batch X",
      visitType: "Hostel Visit",
      status: "Scheduled",
      candidates: 15,
      purpose: "Welfare Check & Grocery Distribution"
    },
    {
      id: 2,
      date: "2025-07-22",
      time: "2:00 PM",
      location: "TechCorp Office",
      batch: "Batch Y",
      visitType: "Employer Visit",
      status: "Completed",
      candidates: 20,
      purpose: "Workplace Assessment"
    },
    {
      id: 3,
      date: "2025-07-23",
      time: "11:00 AM",
      location: "Delhi Hostel B",
      batch: "Batch Z",
      visitType: "Candidate Interaction",
      status: "Pending",
      candidates: 12,
      purpose: "Individual Counselling"
    }
  ];

  const visitHistory = [
    {
      id: 1,
      date: "2025-07-20",
      location: "Chennai Hostel C",
      batch: "Batch A",
      visitType: "Hostel Visit",
      status: "Completed",
      mediaCount: 3,
      remarks: "All facilities checked, minor plumbing issue reported"
    },
    {
      id: 2,
      date: "2025-07-19",
      location: "RetailMax Store",
      batch: "Batch B",
      visitType: "Employer Visit",
      status: "Completed",
      mediaCount: 5,
      remarks: "Good working conditions, candidates adjusting well"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Scheduled": return "default";
      case "Completed": return "default";
      case "Pending": return "secondary";
      case "Cancelled": return "destructive";
      default: return "outline";
    }
  };

  return (
    <div className="p-4 md:p-6 space-y-6 bg-gradient-to-br from-slate-50 to-purple-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Visit Management</h1>
          <p className="text-gray-600">Schedule, track and report field visits</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setViewMode(viewMode === "month" ? "week" : "month")}>
            {viewMode === "month" ? "Week View" : "Month View"}
          </Button>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-purple-600 hover:bg-purple-700">
                Schedule Visit
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Schedule New Visit</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Visit Date</Label>
                    <Input type="date" />
                  </div>
                  <div>
                    <Label>Visit Time</Label>
                    <Input type="time" />
                  </div>
                </div>
                
                <div>
                  <Label>Visit Type</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select visit type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hostel">Hostel Visit</SelectItem>
                      <SelectItem value="employer">Employer Visit</SelectItem>
                      <SelectItem value="candidate">Candidate Interaction</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Batch</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select batch" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="batch-x">Batch X</SelectItem>
                        <SelectItem value="batch-y">Batch Y</SelectItem>
                        <SelectItem value="batch-z">Batch Z</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Location</Label>
                    <Input placeholder="Enter location" />
                  </div>
                </div>

                <div>
                  <Label>Purpose</Label>
                  <Textarea placeholder="Describe the purpose of this visit" />
                </div>

                <Button className="w-full bg-purple-600 hover:bg-purple-700">
                  Schedule Visit
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Select value={stateFilter} onValueChange={setStateFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by State" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All States</SelectItem>
                <SelectItem value="Karnataka">Karnataka</SelectItem>
                <SelectItem value="Tamil Nadu">Tamil Nadu</SelectItem>
                <SelectItem value="Delhi">Delhi</SelectItem>
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
              </SelectContent>
            </Select>

            <Select value={hostelFilter} onValueChange={setHostelFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by Hostel" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Locations</SelectItem>
                <SelectItem value="Bangalore Hostel A">Bangalore Hostel A</SelectItem>
                <SelectItem value="Delhi Hostel B">Delhi Hostel B</SelectItem>
                <SelectItem value="Chennai Hostel C">Chennai Hostel C</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline">Clear Filters</Button>
          </div>
        </CardContent>
      </Card>

      {/* Visit Schedule */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Visit Schedule ({viewMode} view)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Batch</TableHead>
                  <TableHead>Visit Type</TableHead>
                  <TableHead>Candidates</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {visits.map((visit) => (
                  <TableRow key={visit.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <div>
                          <p className="font-medium">{visit.date}</p>
                          <p className="text-sm text-gray-500">{visit.time}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        {visit.location}
                      </div>
                    </TableCell>
                    <TableCell>{visit.batch}</TableCell>
                    <TableCell>{visit.visitType}</TableCell>
                    <TableCell>{visit.candidates}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusColor(visit.status)}>
                        {visit.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        {visit.status === "Scheduled" && (
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                                <Camera className="w-4 h-4 mr-1" />
                                Report
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle>Visit Report - {visit.location}</DialogTitle>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <Label>Visit Type</Label>
                                    <Select defaultValue={visit.visitType.toLowerCase().replace(" ", "-")}>
                                      <SelectTrigger>
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="hostel-visit">Hostel Visit</SelectItem>
                                        <SelectItem value="employer-visit">Employer Visit</SelectItem>
                                        <SelectItem value="candidate-interaction">Candidate Interaction</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                  <div>
                                    <Label>Batch</Label>
                                    <Input value={visit.batch} readOnly />
                                  </div>
                                </div>

                                <div>
                                  <Label>Upload Proof</Label>
                                  <div className="grid grid-cols-3 gap-2 mt-2">
                                    <Button variant="outline" className="h-20 flex-col">
                                      <Camera className="w-6 h-6 mb-1" />
                                      <span className="text-xs">Photo</span>
                                    </Button>
                                    <Button variant="outline" className="h-20 flex-col">
                                      <Video className="w-6 h-6 mb-1" />
                                      <span className="text-xs">Video Call</span>
                                    </Button>
                                    <Button variant="outline" className="h-20 flex-col">
                                      <Upload className="w-6 h-6 mb-1" />
                                      <span className="text-xs">Upload</span>
                                    </Button>
                                  </div>
                                </div>

                                <div>
                                  <Label>Candidates Met</Label>
                                  <Select>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select candidates" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="all">All Candidates</SelectItem>
                                      <SelectItem value="specific">Specific Candidates</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>

                                <div>
                                  <Label>Visit Remarks</Label>
                                  <Textarea placeholder="Enter your observations and remarks about the visit" rows={4} />
                                </div>

                                <Button className="w-full bg-purple-600 hover:bg-purple-700">
                                  Submit Visit Report
                                </Button>
                              </div>
                            </DialogContent>
                          </Dialog>
                        )}
                        <Button size="sm" variant="outline">
                          <Eye className="w-4 h-4" />
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

      {/* Visit History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Visit History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Batch</TableHead>
                  <TableHead>Visit Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Media</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {visitHistory.map((visit) => (
                  <TableRow key={visit.id}>
                    <TableCell>{visit.date}</TableCell>
                    <TableCell>{visit.location}</TableCell>
                    <TableCell>{visit.batch}</TableCell>
                    <TableCell>{visit.visitType}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusColor(visit.status)}>
                        {visit.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Camera className="w-4 h-4 text-gray-400" />
                        <span className="text-sm">{visit.mediaCount} files</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button size="sm" variant="outline">
                        <Eye className="w-4 h-4 mr-1" />
                        View Report
                      </Button>
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

export default VisitManagement;