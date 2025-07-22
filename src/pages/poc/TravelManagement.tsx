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
import { Bus, Train, Calendar, MapPin, Users, Phone, MessageSquare, Camera } from "lucide-react";

const TravelManagement = () => {
  const [statusFilter, setStatusFilter] = useState("");
  const [stateFilter, setStateFilter] = useState("");

  const travelPlans = [
    {
      id: 1,
      batch: "Batch X",
      travelDate: "2025-07-25",
      destination: "Bangalore",
      candidateCount: 15,
      status: "Planned",
      mode: "Train",
      hostelName: "Bangalore Hostel A",
      departureTime: "08:00 AM",
      arrivalTime: "6:00 PM"
    },
    {
      id: 2,
      batch: "Batch Y",
      travelDate: "2025-07-23",
      destination: "Delhi",
      candidateCount: 20,
      status: "Completed",
      mode: "Bus",
      hostelName: "Delhi Hostel B",
      departureTime: "06:00 AM",
      arrivalTime: "8:00 PM"
    },
    {
      id: 3,
      batch: "Batch Z",
      travelDate: "2025-07-28",
      destination: "Chennai",
      candidateCount: 12,
      status: "Pending",
      mode: "Train",
      hostelName: "Chennai Hostel C",
      departureTime: "09:00 AM",
      arrivalTime: "7:00 PM"
    }
  ];

  const candidateDetails = [
    {
      id: 1,
      candidateName: "Ravi Kumar",
      batch: "Batch X",
      departureDate: "2025-07-25",
      mode: "Train",
      travelStatus: "Confirmed",
      hostelName: "Bangalore Hostel A",
      contactNumber: "+91 9876543210",
      emergencyContact: "+91 9876543211"
    },
    {
      id: 2,
      candidateName: "Priya Sharma",
      batch: "Batch X",
      departureDate: "2025-07-25",
      mode: "Train",
      travelStatus: "Pending",
      hostelName: "Bangalore Hostel A",
      contactNumber: "+91 9876543212",
      emergencyContact: "+91 9876543213"
    }
  ];

  const communicationLog = [
    {
      id: 1,
      candidateName: "Ravi Kumar",
      date: "2025-07-21",
      mode: "Phone",
      remarks: "Confirmed travel details, shared boarding point",
      pocName: "Rajesh Verma"
    },
    {
      id: 2,
      candidateName: "Priya Sharma",
      date: "2025-07-20",
      mode: "WhatsApp",
      remarks: "Sent travel documents and instructions",
      pocName: "Rajesh Verma"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Planned": return "default";
      case "Completed": return "default";
      case "Pending": return "secondary";
      case "Confirmed": return "default";
      case "Cancelled": return "destructive";
      default: return "outline";
    }
  };

  const getModeIcon = (mode: string) => {
    return mode === "Train" ? Train : Bus;
  };

  return (
    <div className="p-4 md:p-6 space-y-6 bg-gradient-to-br from-slate-50 to-purple-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Travel Management</h1>
          <p className="text-gray-600">Facilitate and monitor candidate travel plans</p>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="Planned">Planned</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
              </SelectContent>
            </Select>

            <Select value={stateFilter} onValueChange={setStateFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by Destination" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Destinations</SelectItem>
                <SelectItem value="Bangalore">Bangalore</SelectItem>
                <SelectItem value="Delhi">Delhi</SelectItem>
                <SelectItem value="Chennai">Chennai</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline">Clear Filters</Button>
          </div>
        </CardContent>
      </Card>

      {/* Travel Plans */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Travel Plans
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Batch</TableHead>
                  <TableHead>Travel Date</TableHead>
                  <TableHead>Destination</TableHead>
                  <TableHead>Candidates</TableHead>
                  <TableHead>Mode</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {travelPlans.map((plan) => {
                  const ModeIcon = getModeIcon(plan.mode);
                  return (
                    <TableRow key={plan.id}>
                      <TableCell className="font-semibold">{plan.batch}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          {plan.travelDate}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-gray-400" />
                          {plan.destination}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-gray-400" />
                          {plan.candidateCount}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <ModeIcon className="w-4 h-4 text-gray-400" />
                          {plan.mode}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusColor(plan.status)}>
                          {plan.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button size="sm" variant="outline">
                                View Details
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-4xl">
                              <DialogHeader>
                                <DialogTitle>Travel Details - {plan.batch}</DialogTitle>
                              </DialogHeader>
                              <div className="space-y-6">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <Label>Departure Time</Label>
                                    <p className="text-sm text-gray-600">{plan.departureTime}</p>
                                  </div>
                                  <div>
                                    <Label>Expected Arrival</Label>
                                    <p className="text-sm text-gray-600">{plan.arrivalTime}</p>
                                  </div>
                                  <div>
                                    <Label>Hostel Name</Label>
                                    <p className="text-sm text-gray-600">{plan.hostelName}</p>
                                  </div>
                                  <div>
                                    <Label>Travel Mode</Label>
                                    <p className="text-sm text-gray-600">{plan.mode}</p>
                                  </div>
                                </div>

                                <div>
                                  <h4 className="font-semibold mb-3">Candidate-wise Details</h4>
                                  <Table>
                                    <TableHeader>
                                      <TableRow>
                                        <TableHead>Candidate</TableHead>
                                        <TableHead>Travel Status</TableHead>
                                        <TableHead>Contact</TableHead>
                                        <TableHead>Actions</TableHead>
                                      </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                      {candidateDetails.filter(c => c.batch === plan.batch).map((candidate) => (
                                        <TableRow key={candidate.id}>
                                          <TableCell>{candidate.candidateName}</TableCell>
                                          <TableCell>
                                            <Badge variant={getStatusColor(candidate.travelStatus)}>
                                              {candidate.travelStatus}
                                            </Badge>
                                          </TableCell>
                                          <TableCell>{candidate.contactNumber}</TableCell>
                                          <TableCell>
                                            <div className="flex gap-1">
                                              <Button size="sm" variant="outline">
                                                <Phone className="w-3 h-3" />
                                              </Button>
                                              <Button size="sm" variant="outline">
                                                <MessageSquare className="w-3 h-3" />
                                              </Button>
                                              {plan.status === "Planned" && (
                                                <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                                                  Mark Complete
                                                </Button>
                                              )}
                                            </div>
                                          </TableCell>
                                        </TableRow>
                                      ))}
                                    </TableBody>
                                  </Table>
                                </div>

                                <div>
                                  <Label>Travel Remarks</Label>
                                  <Textarea placeholder="Add remarks about travel facilitation..." />
                                </div>

                                <Button className="w-full bg-purple-600 hover:bg-purple-700">
                                  Update Travel Status
                                </Button>
                              </div>
                            </DialogContent>
                          </Dialog>
                          {plan.status === "Planned" && (
                            <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                              Mark Complete
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Communication Log */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            Communication Log
            <Dialog>
              <DialogTrigger asChild>
                <Button size="sm" className="ml-auto bg-purple-600 hover:bg-purple-700">
                  Log Communication
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Log Communication</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label>Candidate</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select candidate" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ravi">Ravi Kumar</SelectItem>
                        <SelectItem value="priya">Priya Sharma</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Communication Mode</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select mode" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="phone">Phone Call</SelectItem>
                        <SelectItem value="whatsapp">WhatsApp</SelectItem>
                        <SelectItem value="in-person">In-Person</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Remarks</Label>
                    <Textarea placeholder="Enter communication details and outcomes..." />
                  </div>

                  <div>
                    <Label>Upload Screenshot (Optional)</Label>
                    <Button variant="outline" className="w-full h-20 flex-col">
                      <Camera className="w-6 h-6 mb-1" />
                      <span className="text-xs">Upload Screenshot</span>
                    </Button>
                  </div>

                  <Button className="w-full bg-purple-600 hover:bg-purple-700">
                    Log Communication
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Candidate</TableHead>
                  <TableHead>Mode</TableHead>
                  <TableHead>Remarks</TableHead>
                  <TableHead>POC</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {communicationLog.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell>{log.date}</TableCell>
                    <TableCell>{log.candidateName}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{log.mode}</Badge>
                    </TableCell>
                    <TableCell className="max-w-xs truncate">{log.remarks}</TableCell>
                    <TableCell>{log.pocName}</TableCell>
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

export default TravelManagement;