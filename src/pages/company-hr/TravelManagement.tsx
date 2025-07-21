import React, { useState } from 'react';
import { Plane, Download, CheckCircle, Clock, MapPin, Calendar } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

// Mock data
const mockTravelData = [
  {
    id: 1,
    candidateName: "Ravi Kumar",
    batch: "Batch RSA-001",
    departureDate: "2025-07-25",
    travelMode: "Flight",
    destination: "Mumbai",
    status: "Pending",
    reportingManager: "Suresh Babu",
    reportingLocation: "Phoenix Mall, Lower Parel",
    accommodationDetails: "Hotel Residency, Near Office",
    travelBudget: "5000",
    phone: "+91 9876543201",
    email: "ravi.kumar@email.com"
  },
  {
    id: 2,
    candidateName: "Priya Sharma",
    batch: "Batch RSA-001",
    departureDate: "2025-07-26",
    travelMode: "Train",
    destination: "Delhi",
    status: "Confirmed",
    reportingManager: "Meera Nair",
    reportingLocation: "DLF Mall, Gurgaon",
    accommodationDetails: "Company Guest House",
    travelBudget: "3000",
    phone: "+91 9876543202",
    email: "priya.sharma@email.com"
  },
  {
    id: 3,
    candidateName: "Amit Patel",
    batch: "Batch CSE-002",
    departureDate: "2025-07-28",
    travelMode: "Bus",
    destination: "Pune",
    status: "Confirmed",
    reportingManager: "Rajesh Kumar",
    reportingLocation: "Tech Park, Hinjewadi",
    accommodationDetails: "PG Accommodation Arranged",
    travelBudget: "2500",
    phone: "+91 9876543203",
    email: "amit.patel@email.com"
  }
];

const TravelManagement: React.FC = () => {
  const [selectedBatch, setSelectedBatch] = useState<string>("");
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedTravel, setSelectedTravel] = useState<any>(null);
  const [isTravelLetterModalOpen, setIsTravelLetterModalOpen] = useState(false);

  // Travel letter form state
  const [travelLetterData, setTravelLetterData] = useState({
    candidateName: "",
    travelDate: "",
    companyName: "",
    reportingManager: "",
    joiningLocation: "",
    accommodationDetails: "",
    emergencyContact: "",
    specialInstructions: ""
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Confirmed': return 'bg-green-100 text-green-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTravelModeIcon = (mode: string) => {
    switch (mode) {
      case 'Flight': return '✈️';
      case 'Train': return '🚂';
      case 'Bus': return '🚌';
      default: return '🚗';
    }
  };

  const filteredTravelData = mockTravelData.filter(travel => {
    return (
      (!selectedBatch || travel.batch === selectedBatch) &&
      (!selectedStatus || travel.status === selectedStatus) &&
      (!searchTerm || travel.candidateName.toLowerCase().includes(searchTerm.toLowerCase()) || 
       travel.destination.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  });

  const openTravelLetterModal = (travel: any) => {
    setSelectedTravel(travel);
    setTravelLetterData({
      candidateName: travel.candidateName,
      travelDate: travel.departureDate,
      companyName: "ABC Company Ltd.",
      reportingManager: travel.reportingManager,
      joiningLocation: travel.reportingLocation,
      accommodationDetails: travel.accommodationDetails,
      emergencyContact: "+91 9999999999",
      specialInstructions: ""
    });
    setIsTravelLetterModalOpen(true);
  };

  const confirmTravel = (travelId: number) => {
    // Implementation to confirm travel
    console.log("Confirming travel for ID:", travelId);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Travel Management</h1>
          <p className="text-gray-600 mt-1">Manage candidate travel plans and generate travel letters</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Travel Plans</CardTitle>
            <Plane className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockTravelData.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Confirmed</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {mockTravelData.filter(t => t.status === 'Confirmed').length}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {mockTravelData.filter(t => t.status === 'Pending').length}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Week</CardTitle>
            <Calendar className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {mockTravelData.filter(t => new Date(t.departureDate) >= new Date()).length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Input
              placeholder="Search candidates or destinations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            
            <Select value={selectedBatch} onValueChange={setSelectedBatch}>
              <SelectTrigger>
                <SelectValue placeholder="Batch" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Batch RSA-001">Batch RSA-001</SelectItem>
                <SelectItem value="Batch CSE-002">Batch CSE-002</SelectItem>
                <SelectItem value="Batch DEO-003">Batch DEO-003</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Confirmed">Confirmed</SelectItem>
                <SelectItem value="Cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" onClick={() => {
              setSelectedBatch("");
              setSelectedStatus("");
              setSearchTerm("");
            }}>
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Travel Plans Table */}
      <Card>
        <CardHeader>
          <CardTitle>Travel Plans ({filteredTravelData.length})</CardTitle>
          <CardDescription>Manage candidate travel arrangements and confirmations</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Candidate</TableHead>
                <TableHead>Batch</TableHead>
                <TableHead>Departure</TableHead>
                <TableHead>Travel Mode</TableHead>
                <TableHead>Destination</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Budget</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTravelData.map((travel) => (
                <TableRow key={travel.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{travel.candidateName}</p>
                      <p className="text-sm text-gray-600">{travel.phone}</p>
                    </div>
                  </TableCell>
                  <TableCell>{travel.batch}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span>{travel.departureDate}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span>{getTravelModeIcon(travel.travelMode)}</span>
                      <span>{travel.travelMode}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      <span>{travel.destination}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(travel.status)} variant="secondary">
                      {travel.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className="font-medium">₹{travel.travelBudget}</span>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      {travel.status === 'Pending' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => confirmTravel(travel.id)}
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Confirm
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => openTravelLetterModal(travel)}
                      >
                        <Download className="h-4 w-4 mr-1" />
                        Travel Letter
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Travel Letter Modal */}
      <Dialog open={isTravelLetterModalOpen} onOpenChange={setIsTravelLetterModalOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Generate Travel Letter</DialogTitle>
            <DialogDescription>
              Create travel authorization letter for {selectedTravel?.candidateName}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="candidateName">Candidate Name</Label>
                <Input
                  id="candidateName"
                  value={travelLetterData.candidateName}
                  disabled
                />
              </div>
              <div>
                <Label htmlFor="travelDate">Travel Date</Label>
                <Input
                  id="travelDate"
                  type="date"
                  value={travelLetterData.travelDate}
                  onChange={(e) => setTravelLetterData({...travelLetterData, travelDate: e.target.value})}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="companyName">Company Name</Label>
                <Input
                  id="companyName"
                  value={travelLetterData.companyName}
                  onChange={(e) => setTravelLetterData({...travelLetterData, companyName: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="reportingManager">Reporting Manager</Label>
                <Input
                  id="reportingManager"
                  value={travelLetterData.reportingManager}
                  onChange={(e) => setTravelLetterData({...travelLetterData, reportingManager: e.target.value})}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="joiningLocation">Joining Location</Label>
              <Input
                id="joiningLocation"
                value={travelLetterData.joiningLocation}
                onChange={(e) => setTravelLetterData({...travelLetterData, joiningLocation: e.target.value})}
              />
            </div>

            <div>
              <Label htmlFor="accommodationDetails">Accommodation Details</Label>
              <Textarea
                id="accommodationDetails"
                value={travelLetterData.accommodationDetails}
                onChange={(e) => setTravelLetterData({...travelLetterData, accommodationDetails: e.target.value})}
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="emergencyContact">Emergency Contact</Label>
                <Input
                  id="emergencyContact"
                  value={travelLetterData.emergencyContact}
                  onChange={(e) => setTravelLetterData({...travelLetterData, emergencyContact: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="specialInstructions">Special Instructions</Label>
                <Textarea
                  id="specialInstructions"
                  placeholder="Any special instructions for travel..."
                  value={travelLetterData.specialInstructions}
                  onChange={(e) => setTravelLetterData({...travelLetterData, specialInstructions: e.target.value})}
                  rows={3}
                />
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <Button className="flex-1" variant="outline">
                Preview PDF
              </Button>
              <Button 
                className="flex-1"
                onClick={() => setIsTravelLetterModalOpen(false)}
              >
                <Download className="h-4 w-4 mr-2" />
                Download Travel Letter
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TravelManagement;