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
import { Building2, MapPin, Users, Car, Home, AlertTriangle, Eye, Plus } from "lucide-react";

const PostPlacementManagement = () => {
  const [isCreateCompanyOpen, setIsCreateCompanyOpen] = useState(false);
  const [selectedTravelBatch, setSelectedTravelBatch] = useState("");

  const companies = [
    {
      name: "TechCorp India",
      state: "Karnataka",
      activeBatches: 3,
      assignedHRs: 2,
      industry: "Technology"
    },
    {
      name: "RetailMax Ltd",
      state: "Maharashtra", 
      activeBatches: 2,
      assignedHRs: 1,
      industry: "Retail"
    },
    {
      name: "ServicePro Pvt",
      state: "Delhi",
      activeBatches: 4,
      assignedHRs: 3,
      industry: "Services"
    }
  ];

  const travelStatus = [
    {
      batch: "Batch X",
      candidateCount: 25,
      departureDate: "2025-07-25",
      location: "Bangalore Tech Park",
      status: "Pending"
    },
    {
      batch: "Batch Y",
      candidateCount: 30,
      departureDate: "2025-07-28",
      location: "Mumbai Corporate Center",
      status: "Confirmed"
    },
    {
      batch: "Batch Z",
      candidateCount: 20,
      departureDate: "2025-07-30",
      location: "Delhi Business Hub",
      status: "Pending"
    }
  ];

  const hostelAllocation = [
    {
      batch: "Batch X",
      hostelName: "Bangalore Hostel A",
      groceryDelivered: true,
      roomsAllotted: true,
      comments: "All arrangements completed"
    },
    {
      batch: "Batch Y",
      hostelName: "Mumbai Hostel B",
      groceryDelivered: false,
      roomsAllotted: true,
      comments: "Grocery delivery pending"
    },
    {
      batch: "Batch Z",
      hostelName: "Delhi Hostel C",
      groceryDelivered: true,
      roomsAllotted: false,
      comments: "Room allocation in progress"
    }
  ];

  const welfareTracker = [
    {
      batch: "Batch X",
      candidateName: "Ravi Kumar",
      employer: "TechCorp India",
      retentionMonths: 3,
      sosRaised: false,
      lastPocVisit: "2025-07-15"
    },
    {
      batch: "Batch Y",
      candidateName: "Priya Sharma",
      employer: "RetailMax Ltd",
      retentionMonths: 6,
      sosRaised: true,
      lastPocVisit: "2025-07-18"
    },
    {
      batch: "Batch Z",
      candidateName: "Amit Singh",
      employer: "ServicePro Pvt",
      retentionMonths: 2,
      sosRaised: false,
      lastPocVisit: "2025-07-20"
    }
  ];

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Post-Placement Management</h1>
          <p className="text-gray-600">Manage companies, travel plans, and candidate welfare</p>
        </div>
      </div>

      <Tabs defaultValue="companies" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="companies">Company Management</TabsTrigger>
          <TabsTrigger value="travel">Travel Monitoring</TabsTrigger>
          <TabsTrigger value="welfare">Candidate Welfare</TabsTrigger>
        </TabsList>

        <TabsContent value="companies">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="w-5 h-5" />
                  Company Management
                </CardTitle>
                <Dialog open={isCreateCompanyOpen} onOpenChange={setIsCreateCompanyOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-purple-600 hover:bg-purple-700">
                      <Plus className="w-4 h-4 mr-2" />
                      Create Company
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>Create New Company</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="companyName">Company Name</Label>
                        <Input id="companyName" placeholder="Enter company name" />
                      </div>
                      <div>
                        <Label htmlFor="industry">Industry</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select industry" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="technology">Technology</SelectItem>
                            <SelectItem value="retail">Retail</SelectItem>
                            <SelectItem value="services">Services</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="contactPerson">Contact Person</Label>
                        <Input id="contactPerson" placeholder="Enter contact person name" />
                      </div>
                      <div>
                        <Label htmlFor="state">State</Label>
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
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" placeholder="Enter email" />
                      </div>
                      <div>
                        <Label htmlFor="phone">Phone</Label>
                        <Input id="phone" placeholder="Enter phone number" />
                      </div>
                      <div className="flex gap-2">
                        <Button className="flex-1 bg-purple-600 hover:bg-purple-700">Create Company</Button>
                        <Button variant="outline" onClick={() => setIsCreateCompanyOpen(false)}>Cancel</Button>
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
                      <TableHead>Company Name</TableHead>
                      <TableHead>Industry</TableHead>
                      <TableHead>State</TableHead>
                      <TableHead>Active Batches</TableHead>
                      <TableHead>Assigned HRs</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {companies.map((company, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-semibold">{company.name}</TableCell>
                        <TableCell>{company.industry}</TableCell>
                        <TableCell>{company.state}</TableCell>
                        <TableCell>
                          <Badge variant="secondary">{company.activeBatches}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{company.assignedHRs}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">Assign Batches</Button>
                            <Button size="sm" variant="outline">HR Access</Button>
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

        <TabsContent value="travel">
          <div className="space-y-6">
            {/* Travel Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Car className="w-5 h-5" />
                  Travel Status Monitoring
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Batch</TableHead>
                        <TableHead>Candidate Count</TableHead>
                        <TableHead>Departure Date</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {travelStatus.map((travel, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-semibold">{travel.batch}</TableCell>
                          <TableCell>{travel.candidateCount}</TableCell>
                          <TableCell>{travel.departureDate}</TableCell>
                          <TableCell>{travel.location}</TableCell>
                          <TableCell>
                            <Badge variant={travel.status === "Confirmed" ? "default" : "secondary"}>
                              {travel.status}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button size="sm" variant="outline">
                                  <Eye className="w-4 h-4 mr-1" />
                                  View Details
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Travel Details - {travel.batch}</DialogTitle>
                                </DialogHeader>
                                <div className="space-y-4">
                                  <p>Candidate-wise travel details would be displayed here...</p>
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

            {/* Hostel Allocation */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Home className="w-5 h-5" />
                  Hostel & Grocery Allocation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Batch</TableHead>
                        <TableHead>Hostel Name</TableHead>
                        <TableHead>Grocery Delivered</TableHead>
                        <TableHead>Rooms Allotted</TableHead>
                        <TableHead>Comments</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {hostelAllocation.map((hostel, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-semibold">{hostel.batch}</TableCell>
                          <TableCell>{hostel.hostelName}</TableCell>
                          <TableCell>
                            <Badge variant={hostel.groceryDelivered ? "default" : "destructive"}>
                              {hostel.groceryDelivered ? "Yes" : "No"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge variant={hostel.roomsAllotted ? "default" : "destructive"}>
                              {hostel.roomsAllotted ? "Yes" : "No"}
                            </Badge>
                          </TableCell>
                          <TableCell>{hostel.comments}</TableCell>
                          <TableCell>
                            <Button size="sm" variant="outline">Update Status</Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="welfare">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Post-Placement Candidate Welfare
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Batch</TableHead>
                      <TableHead>Candidate Name</TableHead>
                      <TableHead>Employer</TableHead>
                      <TableHead>Retention (Months)</TableHead>
                      <TableHead>SOS Raised</TableHead>
                      <TableHead>Last POC Visit</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {welfareTracker.map((welfare, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-semibold">{welfare.batch}</TableCell>
                        <TableCell>{welfare.candidateName}</TableCell>
                        <TableCell>{welfare.employer}</TableCell>
                        <TableCell>
                          <Badge variant={welfare.retentionMonths >= 6 ? "default" : "secondary"}>
                            {welfare.retentionMonths}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {welfare.sosRaised ? (
                            <Badge variant="destructive">
                              <AlertTriangle className="w-3 h-3 mr-1" />
                              Yes
                            </Badge>
                          ) : (
                            <Badge variant="default">No</Badge>
                          )}
                        </TableCell>
                        <TableCell>{welfare.lastPocVisit}</TableCell>
                        <TableCell>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button size="sm" variant="outline">Add Remarks</Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Add Welfare Remarks - {welfare.candidateName}</DialogTitle>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div>
                                  <Label htmlFor="remarks">PPC Admin Remarks</Label>
                                  <Textarea id="remarks" placeholder="Enter welfare remarks..." />
                                </div>
                                <Button className="w-full bg-purple-600 hover:bg-purple-700">Save Remarks</Button>
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

export default PostPlacementManagement;