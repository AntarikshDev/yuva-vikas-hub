import React, { useState } from 'react';
import { Eye, Calendar, Users, Phone, Mail, MapPin } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Mock data
const mockBatches = [
  {
    id: 1,
    name: "Batch RSA-001",
    jobRole: "Retail Sales Associate",
    startDate: "2025-07-22",
    currentStage: "Training",
    centreName: "LNJ Skills Centre - Bangalore",
    contactPerson: "Rajesh Kumar",
    contactPhone: "+91 9876543210",
    contactEmail: "rajesh.kumar@lnj.com",
    location: "Bangalore, Karnataka",
    totalCandidates: 25,
    readyCandidates: 18,
    candidates: [
      { name: "Ravi Kumar", counsellingStage: 3, assessmentScore: 85, attendance: 92, phone: "+91 9876543201", email: "ravi.kumar@email.com" },
      { name: "Priya Sharma", counsellingStage: 3, assessmentScore: 78, attendance: 88, phone: "+91 9876543202", email: "priya.sharma@email.com" },
      { name: "Amit Patel", counsellingStage: 2, assessmentScore: 82, attendance: 95, phone: "+91 9876543203", email: "amit.patel@email.com" }
    ],
    travelPlans: [
      { candidate: "Ravi Kumar", status: "Confirmed", departureDate: "2025-07-25", destination: "Mumbai" },
      { candidate: "Priya Sharma", status: "Pending", departureDate: "2025-07-26", destination: "Delhi" }
    ],
    assessments: [
      { candidate: "Ravi Kumar", marks: 85, status: "Pass", trainerRemarks: "Excellent communication skills" },
      { candidate: "Priya Sharma", marks: 78, status: "Pass", trainerRemarks: "Good technical knowledge" }
    ]
  },
  {
    id: 2,
    name: "Batch CSE-002",
    jobRole: "Customer Service Executive",
    startDate: "2025-07-15",
    currentStage: "Placement",
    centreName: "LNJ Skills Centre - Chennai",
    contactPerson: "Meera Nair",
    contactPhone: "+91 9876543211",
    contactEmail: "meera.nair@lnj.com",
    location: "Chennai, Tamil Nadu",
    totalCandidates: 30,
    readyCandidates: 28,
    candidates: [
      { name: "Suresh Babu", counsellingStage: 3, assessmentScore: 90, attendance: 96, phone: "+91 9876543204", email: "suresh.babu@email.com" },
      { name: "Lakshmi Devi", counsellingStage: 3, assessmentScore: 87, attendance: 94, phone: "+91 9876543205", email: "lakshmi.devi@email.com" }
    ],
    travelPlans: [
      { candidate: "Suresh Babu", status: "Confirmed", departureDate: "2025-07-23", destination: "Bangalore" }
    ],
    assessments: [
      { candidate: "Suresh Babu", marks: 90, status: "Pass", trainerRemarks: "Outstanding performance" }
    ]
  }
];

const BatchManagement: React.FC = () => {
  const [selectedState, setSelectedState] = useState<string>("");
  const [selectedCentre, setSelectedCentre] = useState<string>("");
  const [selectedJobRole, setSelectedJobRole] = useState<string>("");
  const [selectedStage, setSelectedStage] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedBatch, setSelectedBatch] = useState<any>(null);

  const getStageColor = (stage: string) => {
    switch (stage) {
      case 'Mobilisation': return 'bg-blue-100 text-blue-800';
      case 'Training': return 'bg-yellow-100 text-yellow-800';
      case 'Placement': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCounsellingBadge = (stage: number) => {
    const colors = ['bg-red-100 text-red-800', 'bg-yellow-100 text-yellow-800', 'bg-green-100 text-green-800'];
    const labels = ['Stage 1', 'Stage 2', 'Stage 3'];
    return { color: colors[stage - 1] || colors[0], label: labels[stage - 1] || 'Pending' };
  };

  const filteredBatches = mockBatches.filter(batch => {
    return (
      (!selectedState || batch.location.toLowerCase().includes(selectedState.toLowerCase())) &&
      (!selectedCentre || batch.centreName.toLowerCase().includes(selectedCentre.toLowerCase())) &&
      (!selectedJobRole || batch.jobRole === selectedJobRole) &&
      (!selectedStage || batch.currentStage === selectedStage) &&
      (!searchTerm || batch.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
       batch.jobRole.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  });

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Batch Management</h1>
          <p className="text-gray-600 mt-1">Overview of upcoming batches and candidate management</p>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
            <Input
              placeholder="Search batches..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="lg:col-span-2"
            />
            
            <Select value={selectedState} onValueChange={setSelectedState}>
              <SelectTrigger>
                <SelectValue placeholder="State" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="karnataka">Karnataka</SelectItem>
                <SelectItem value="tamil-nadu">Tamil Nadu</SelectItem>
                <SelectItem value="kerala">Kerala</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedCentre} onValueChange={setSelectedCentre}>
              <SelectTrigger>
                <SelectValue placeholder="Centre" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bangalore">Bangalore</SelectItem>
                <SelectItem value="chennai">Chennai</SelectItem>
                <SelectItem value="cochin">Cochin</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedJobRole} onValueChange={setSelectedJobRole}>
              <SelectTrigger>
                <SelectValue placeholder="Job Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Retail Sales Associate">Retail Sales Associate</SelectItem>
                <SelectItem value="Customer Service Executive">Customer Service Executive</SelectItem>
                <SelectItem value="Data Entry Operator">Data Entry Operator</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedStage} onValueChange={setSelectedStage}>
              <SelectTrigger>
                <SelectValue placeholder="Stage" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Mobilisation">Mobilisation</SelectItem>
                <SelectItem value="Training">Training</SelectItem>
                <SelectItem value="Placement">Placement</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Batches Table */}
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Batches ({filteredBatches.length})</CardTitle>
          <CardDescription>Click on a batch to view detailed information</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Batch Name</TableHead>
                <TableHead>Job Role</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead>Stage</TableHead>
                <TableHead>Centre</TableHead>
                <TableHead>Contact Person</TableHead>
                <TableHead>Candidates</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBatches.map((batch) => (
                <TableRow key={batch.id}>
                  <TableCell className="font-medium">{batch.name}</TableCell>
                  <TableCell>{batch.jobRole}</TableCell>
                  <TableCell>{batch.startDate}</TableCell>
                  <TableCell>
                    <Badge className={getStageColor(batch.currentStage)} variant="secondary">
                      {batch.currentStage}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">{batch.centreName.split(' - ')[1]}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium text-sm">{batch.contactPerson}</p>
                      <div className="flex items-center gap-2 text-xs text-gray-600">
                        <Phone className="h-3 w-3" />
                        <span>{batch.contactPhone}</span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <span className="font-medium">{batch.readyCandidates}</span>
                      <span className="text-gray-600">/{batch.totalCandidates}</span>
                      <p className="text-xs text-gray-600">ready</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => setSelectedBatch(batch)}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            View Details
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>{selectedBatch?.name} - Details</DialogTitle>
                            <DialogDescription>
                              Comprehensive batch information and candidate management
                            </DialogDescription>
                          </DialogHeader>
                          
                          {selectedBatch && (
                            <Tabs defaultValue="candidates" className="w-full">
                              <TabsList className="grid w-full grid-cols-3">
                                <TabsTrigger value="candidates">Candidates</TabsTrigger>
                                <TabsTrigger value="travel">Travel Plans</TabsTrigger>
                                <TabsTrigger value="assessments">Assessments</TabsTrigger>
                              </TabsList>
                              
                              <TabsContent value="candidates" className="space-y-4">
                                <div className="rounded-md border">
                                  <Table>
                                    <TableHeader>
                                      <TableRow>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Counselling</TableHead>
                                        <TableHead>Assessment</TableHead>
                                        <TableHead>Attendance</TableHead>
                                        <TableHead>Contact</TableHead>
                                      </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                      {selectedBatch.candidates.map((candidate: any, index: number) => {
                                        const counsellingBadge = getCounsellingBadge(candidate.counsellingStage);
                                        return (
                                          <TableRow key={index}>
                                            <TableCell className="font-medium">{candidate.name}</TableCell>
                                            <TableCell>
                                              <Badge className={counsellingBadge.color} variant="secondary">
                                                {counsellingBadge.label}
                                              </Badge>
                                            </TableCell>
                                            <TableCell>
                                              <span className="font-medium">{candidate.assessmentScore}%</span>
                                            </TableCell>
                                            <TableCell>
                                              <span className="font-medium">{candidate.attendance}%</span>
                                            </TableCell>
                                            <TableCell>
                                              <div className="space-y-1">
                                                <div className="flex items-center gap-1 text-xs">
                                                  <Phone className="h-3 w-3" />
                                                  <span>{candidate.phone}</span>
                                                </div>
                                                <div className="flex items-center gap-1 text-xs">
                                                  <Mail className="h-3 w-3" />
                                                  <span>{candidate.email}</span>
                                                </div>
                                              </div>
                                            </TableCell>
                                          </TableRow>
                                        );
                                      })}
                                    </TableBody>
                                  </Table>
                                </div>
                              </TabsContent>
                              
                              <TabsContent value="travel" className="space-y-4">
                                <div className="rounded-md border">
                                  <Table>
                                    <TableHeader>
                                      <TableRow>
                                        <TableHead>Candidate</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Departure Date</TableHead>
                                        <TableHead>Destination</TableHead>
                                        <TableHead>Actions</TableHead>
                                      </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                      {selectedBatch.travelPlans.map((plan: any, index: number) => (
                                        <TableRow key={index}>
                                          <TableCell className="font-medium">{plan.candidate}</TableCell>
                                          <TableCell>
                                            <Badge 
                                              className={plan.status === 'Confirmed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'} 
                                              variant="secondary"
                                            >
                                              {plan.status}
                                            </Badge>
                                          </TableCell>
                                          <TableCell>{plan.departureDate}</TableCell>
                                          <TableCell>{plan.destination}</TableCell>
                                          <TableCell>
                                            {plan.status === 'Pending' && (
                                              <Button size="sm" variant="outline">
                                                Confirm Travel
                                              </Button>
                                            )}
                                          </TableCell>
                                        </TableRow>
                                      ))}
                                    </TableBody>
                                  </Table>
                                </div>
                              </TabsContent>
                              
                              <TabsContent value="assessments" className="space-y-4">
                                <div className="rounded-md border">
                                  <Table>
                                    <TableHeader>
                                      <TableRow>
                                        <TableHead>Candidate</TableHead>
                                        <TableHead>Marks</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Trainer Remarks</TableHead>
                                      </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                      {selectedBatch.assessments.map((assessment: any, index: number) => (
                                        <TableRow key={index}>
                                          <TableCell className="font-medium">{assessment.candidate}</TableCell>
                                          <TableCell>
                                            <span className="font-medium">{assessment.marks}%</span>
                                          </TableCell>
                                          <TableCell>
                                            <Badge 
                                              className={assessment.status === 'Pass' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'} 
                                              variant="secondary"
                                            >
                                              {assessment.status}
                                            </Badge>
                                          </TableCell>
                                          <TableCell>{assessment.trainerRemarks}</TableCell>
                                        </TableRow>
                                      ))}
                                    </TableBody>
                                  </Table>
                                </div>
                              </TabsContent>
                            </Tabs>
                          )}
                        </DialogContent>
                      </Dialog>
                      
                      <Button size="sm" variant="outline">
                        <Calendar className="h-4 w-4 mr-1" />
                        Schedule
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default BatchManagement;