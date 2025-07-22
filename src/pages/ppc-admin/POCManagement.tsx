import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Users, MapPin, Plus, Eye, Camera, Calendar as CalendarComponentIcon } from "lucide-react";
import { format } from "date-fns";

const POCManagement = () => {
  const [isCreatePOCOpen, setIsCreatePOCOpen] = useState(false);
  const [isCreateVisitOpen, setIsCreateVisitOpen] = useState(false);
  const [visitDate, setVisitDate] = useState<Date>();

  const pocList = [
    {
      name: "Rajesh Verma",
      state: "Karnataka",
      assignedBatches: 3,
      lastVisitDate: "2025-07-20",
      contact: "+91 9876543210",
      email: "rajesh.verma@lnj.com"
    },
    {
      name: "Priya Patel",
      state: "Maharashtra",
      assignedBatches: 2,
      lastVisitDate: "2025-07-18",
      contact: "+91 9876543211",
      email: "priya.patel@lnj.com"
    },
    {
      name: "Amit Singh",
      state: "Delhi",
      assignedBatches: 4,
      lastVisitDate: "2025-07-19",
      contact: "+91 9876543212",
      email: "amit.singh@lnj.com"
    }
  ];

  const visitPlans = [
    {
      pocName: "Rajesh Verma",
      batch: "Batch X",
      location: "Bangalore Tech Park Hostel",
      visitDate: "2025-07-25",
      purpose: "Student Welfare Check",
      status: "Scheduled"
    },
    {
      pocName: "Priya Patel",
      batch: "Batch Y",
      location: "Mumbai Corporate Center",
      visitDate: "2025-07-26",
      purpose: "Hostel Inspection",
      status: "Completed"
    },
    {
      pocName: "Amit Singh",
      batch: "Batch Z",
      location: "Delhi Business Hub",
      visitDate: "2025-07-27",
      purpose: "Employer Visit",
      status: "Scheduled"
    }
  ];

  const visitReports = [
    {
      pocName: "Rajesh Verma",
      batch: "Batch X",
      visitCompleted: true,
      visitDate: "2025-07-20",
      remarks: "All students are well-settled. Hostel facilities are good."
    },
    {
      pocName: "Priya Patel",
      batch: "Batch Y",
      visitCompleted: false,
      visitDate: "2025-07-18",
      remarks: "Visit pending due to transport issues"
    },
    {
      pocName: "Amit Singh",
      batch: "Batch Z",
      visitCompleted: true,
      visitDate: "2025-07-19",
      remarks: "Minor accommodation issues reported. Resolved with management."
    }
  ];

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">POC Management</h1>
          <p className="text-gray-600">Manage POC users, visit planning, and reporting</p>
        </div>
      </div>

      <Tabs defaultValue="poc-users" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="poc-users">POC Users</TabsTrigger>
          <TabsTrigger value="visit-planning">Visit Planning</TabsTrigger>
          <TabsTrigger value="visit-reports">Visit Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="poc-users">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  POC User Management
                </CardTitle>
                <Dialog open={isCreatePOCOpen} onOpenChange={setIsCreatePOCOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-purple-600 hover:bg-purple-700">
                      <Plus className="w-4 h-4 mr-2" />
                      Create POC
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>Create New POC User</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="pocName">Full Name</Label>
                        <Input id="pocName" placeholder="Enter POC name" />
                      </div>
                      <div>
                        <Label htmlFor="pocContact">Contact Number</Label>
                        <Input id="pocContact" placeholder="Enter contact number" />
                      </div>
                      <div>
                        <Label htmlFor="pocEmail">Email</Label>
                        <Input id="pocEmail" type="email" placeholder="Enter email" />
                      </div>
                      <div>
                        <Label htmlFor="pocState">Assigned State</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select state" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="karnataka">Karnataka</SelectItem>
                            <SelectItem value="maharashtra">Maharashtra</SelectItem>
                            <SelectItem value="delhi">Delhi</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="pocPhoto">Upload Photo</Label>
                        <div className="flex items-center gap-2">
                          <Input id="pocPhoto" type="file" accept="image/*" />
                          <Button size="sm" variant="outline">
                            <Camera className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button className="flex-1 bg-purple-600 hover:bg-purple-700">Create POC</Button>
                        <Button variant="outline" onClick={() => setIsCreatePOCOpen(false)}>Cancel</Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>State</TableHead>
                      <TableHead>Assigned Batches</TableHead>
                      <TableHead>Last Visit</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pocList.map((poc, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-semibold">{poc.name}</TableCell>
                        <TableCell>{poc.contact}</TableCell>
                        <TableCell>{poc.email}</TableCell>
                        <TableCell>{poc.state}</TableCell>
                        <TableCell>
                          <Badge variant="secondary">{poc.assignedBatches}</Badge>
                        </TableCell>
                        <TableCell>{poc.lastVisitDate}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">Assign Batches</Button>
                            <Button size="sm" variant="outline">View Credentials</Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="visit-planning">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center gap-2">
                  <CalendarComponentIcon className="w-5 h-5" />
                  POC Visit Planning
                </CardTitle>
                <Dialog open={isCreateVisitOpen} onOpenChange={setIsCreateVisitOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-purple-600 hover:bg-purple-700">
                      <Plus className="w-4 h-4 mr-2" />
                      Plan Visit
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>Create Visit Plan</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="visitPOC">Select POC</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select POC" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="rajesh">Rajesh Verma</SelectItem>
                            <SelectItem value="priya">Priya Patel</SelectItem>
                            <SelectItem value="amit">Amit Singh</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="visitBatch">Batch</Label>
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
                        <Label htmlFor="visitLocation">Location</Label>
                        <Input id="visitLocation" placeholder="Enter visit location" />
                      </div>
                      <div>
                        <Label>Visit Date</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="outline" className="w-full justify-start text-left font-normal">
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {visitDate ? format(visitDate, "PPP") : "Pick a date"}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar
                              mode="single"
                              selected={visitDate}
                              onSelect={setVisitDate}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                      <div>
                        <Label htmlFor="visitPurpose">Purpose</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select purpose" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="welfare">Student Welfare</SelectItem>
                            <SelectItem value="hostel">Hostel Inspection</SelectItem>
                            <SelectItem value="employer">Employer Visit</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex gap-2">
                        <Button className="flex-1 bg-purple-600 hover:bg-purple-700">Schedule Visit</Button>
                        <Button variant="outline" onClick={() => setIsCreateVisitOpen(false)}>Cancel</Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>POC Name</TableHead>
                      <TableHead>Batch</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Visit Date</TableHead>
                      <TableHead>Purpose</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {visitPlans.map((visit, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-semibold">{visit.pocName}</TableCell>
                        <TableCell>{visit.batch}</TableCell>
                        <TableCell>{visit.location}</TableCell>
                        <TableCell>{visit.visitDate}</TableCell>
                        <TableCell>{visit.purpose}</TableCell>
                        <TableCell>
                          <Badge variant={visit.status === "Completed" ? "default" : "secondary"}>
                            {visit.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">
                              <Eye className="w-4 h-4 mr-1" />
                              View
                            </Button>
                            {visit.status === "Scheduled" && (
                              <Button size="sm" variant="outline">Edit</Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="visit-reports">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                Visit Reports & Tracking
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>POC Name</TableHead>
                      <TableHead>Batch</TableHead>
                      <TableHead>Visit Date</TableHead>
                      <TableHead>Visit Completed</TableHead>
                      <TableHead>Remarks</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {visitReports.map((report, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-semibold">{report.pocName}</TableCell>
                        <TableCell>{report.batch}</TableCell>
                        <TableCell>{report.visitDate}</TableCell>
                        <TableCell>
                          <Badge variant={report.visitCompleted ? "default" : "destructive"}>
                            {report.visitCompleted ? "Yes" : "No"}
                          </Badge>
                        </TableCell>
                        <TableCell className="max-w-xs truncate">{report.remarks}</TableCell>
                        <TableCell>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button size="sm" variant="outline">
                                <Eye className="w-4 h-4 mr-1" />
                                View Full Report
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Visit Report - {report.batch}</DialogTitle>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div>
                                  <Label>POC Name</Label>
                                  <p className="text-sm text-gray-600">{report.pocName}</p>
                                </div>
                                <div>
                                  <Label>Visit Date</Label>
                                  <p className="text-sm text-gray-600">{report.visitDate}</p>
                                </div>
                                <div>
                                  <Label>Full Remarks</Label>
                                  <Textarea value={report.remarks} readOnly />
                                </div>
                                <div>
                                  <Label>PPC Admin Comments</Label>
                                  <Textarea placeholder="Add your comments..." />
                                </div>
                                <Button className="w-full bg-purple-600 hover:bg-purple-700">Save Comments</Button>
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
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default POCManagement;