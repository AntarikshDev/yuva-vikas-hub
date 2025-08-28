import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Search, 
  Plus, 
  Eye, 
  Check, 
  X, 
  Upload, 
  Download,
  Plane,
  Train,
  Bus,
  Calendar,
  MapPin,
  Clock
} from "lucide-react";

const TicketBooking = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [stateFilter, setStateFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedBooking, setSelectedBooking] = useState<any>(null);

  // Mock data for ticket bookings
  const ticketBookings = [
    {
      id: 1,
      candidateName: "Ravi Kumar",
      candidateId: "CND001",
      centre: "Centre A - Delhi",
      state: "Delhi",
      travelDate: "2025-07-25",
      departure: "Delhi",
      arrival: "Mumbai",
      modeOfTransport: "Train",
      ticketPrice: "₹1,200",
      status: "Pending",
      requestDate: "2025-07-20",
      purpose: "Interview at Company XYZ",
      seatPreference: "AC 2-Tier"
    },
    {
      id: 2,
      candidateName: "Priya Sharma",
      candidateId: "CND002",
      centre: "Centre B - Mumbai",
      state: "Maharashtra",
      travelDate: "2025-07-28",
      departure: "Mumbai",
      arrival: "Bangalore",
      modeOfTransport: "Flight",
      ticketPrice: "₹4,500",
      status: "Booked",
      requestDate: "2025-07-18",
      purpose: "Training Program",
      seatPreference: "Economy"
    },
    {
      id: 3,
      candidateName: "Amit Singh",
      candidateId: "CND003",
      centre: "Centre C - Bangalore",
      state: "Karnataka",
      travelDate: "2025-07-30",
      departure: "Bangalore",
      arrival: "Chennai",
      modeOfTransport: "Bus",
      ticketPrice: "₹800",
      status: "Rejected",
      requestDate: "2025-07-19",
      purpose: "Job Interview",
      seatPreference: "AC Sleeper"
    },
    {
      id: 4,
      candidateName: "Neha Patel",
      candidateId: "CND004",
      centre: "Centre D - Chennai",
      state: "Tamil Nadu",
      travelDate: "2025-08-02",
      departure: "Chennai",
      arrival: "Hyderabad",
      modeOfTransport: "Train",
      ticketPrice: "₹950",
      status: "Pending",
      requestDate: "2025-07-21",
      purpose: "Assessment Center",
      seatPreference: "AC 3-Tier"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Booked": return "bg-green-100 text-green-800";
      case "Pending": return "bg-yellow-100 text-yellow-800";
      case "Rejected": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getTransportIcon = (mode: string) => {
    switch (mode) {
      case "Flight": return <Plane className="h-4 w-4" />;
      case "Train": return <Train className="h-4 w-4" />;
      case "Bus": return <Bus className="h-4 w-4" />;
      default: return <MapPin className="h-4 w-4" />;
    }
  };

  const filteredBookings = ticketBookings.filter(booking => {
    const matchesSearch = booking.candidateName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         booking.candidateId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesState = stateFilter === "all" || booking.state === stateFilter;
    const matchesStatus = statusFilter === "all" || booking.status === statusFilter;
    return matchesSearch && matchesState && matchesStatus;
  });

  const handleApproveBooking = (bookingId: number) => {
    console.log("Approving booking:", bookingId);
    // Implementation for booking approval
  };

  const handleRejectBooking = (bookingId: number) => {
    console.log("Rejecting booking:", bookingId);
    // Implementation for booking rejection
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Ticket Booking & Travel Management</h1>
          <p className="text-gray-600 mt-1">Manage candidate travel requests and ticket bookings</p>
        </div>
        <div className="flex items-center gap-2 mt-4 sm:mt-0">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            New Booking
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <Calendar className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-2xl font-bold text-blue-600">15</p>
                <p className="text-sm text-gray-600">Total Bookings</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <Check className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-2xl font-bold text-green-600">8</p>
                <p className="text-sm text-gray-600">Confirmed</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <Clock className="h-8 w-8 text-yellow-600" />
              <div>
                <p className="text-2xl font-bold text-yellow-600">5</p>
                <p className="text-sm text-gray-600">Pending</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <X className="h-8 w-8 text-red-600" />
              <div>
                <p className="text-2xl font-bold text-red-600">2</p>
                <p className="text-sm text-gray-600">Rejected</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search candidates..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={stateFilter} onValueChange={setStateFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by State" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All States</SelectItem>
                <SelectItem value="Delhi">Delhi</SelectItem>
                <SelectItem value="Maharashtra">Maharashtra</SelectItem>
                <SelectItem value="Karnataka">Karnataka</SelectItem>
                <SelectItem value="Tamil Nadu">Tamil Nadu</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Booked">Booked</SelectItem>
                <SelectItem value="Rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Calendar className="h-4 w-4 mr-2" />
              Date Range
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Bookings Table */}
      <Card>
        <CardHeader>
          <CardTitle>Ticket Booking Requests</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Candidate</TableHead>
                <TableHead>Centre</TableHead>
                <TableHead>Travel Details</TableHead>
                <TableHead>Mode</TableHead>
                <TableHead>Travel Date</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Purpose</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBookings.map((booking) => (
                <TableRow key={booking.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{booking.candidateName}</p>
                      <p className="text-sm text-gray-600">{booking.candidateId}</p>
                    </div>
                  </TableCell>
                  <TableCell>{booking.centre}</TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center text-sm">
                        <MapPin className="h-3 w-3 mr-1" />
                        {booking.departure} → {booking.arrival}
                      </div>
                      <p className="text-xs text-gray-600">{booking.seatPreference}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      {getTransportIcon(booking.modeOfTransport)}
                      <span className="text-sm">{booking.modeOfTransport}</span>
                    </div>
                  </TableCell>
                  <TableCell>{booking.travelDate}</TableCell>
                  <TableCell className="font-semibold">{booking.ticketPrice}</TableCell>
                  <TableCell className="max-w-xs truncate">{booking.purpose}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(booking.status)}>
                      {booking.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedBooking(booking)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Ticket Booking Details - {booking.candidateId}</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-6">
                            {/* Candidate Details */}
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label>Candidate Name</Label>
                                <p className="font-medium">{booking.candidateName}</p>
                              </div>
                              <div>
                                <Label>Candidate ID</Label>
                                <p className="font-medium">{booking.candidateId}</p>
                              </div>
                              <div>
                                <Label>Centre</Label>
                                <p className="font-medium">{booking.centre}</p>
                              </div>
                              <div>
                                <Label>Request Date</Label>
                                <p className="font-medium">{booking.requestDate}</p>
                              </div>
                            </div>

                            {/* Travel Information */}
                            <div className="border-t pt-4">
                              <h3 className="font-semibold mb-3">Travel Information</h3>
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <Label>Travel Date</Label>
                                  <Input defaultValue={booking.travelDate} type="date" />
                                </div>
                                <div>
                                  <Label>Mode of Transport</Label>
                                  <Select defaultValue={booking.modeOfTransport}>
                                    <SelectTrigger>
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="Train">Train</SelectItem>
                                      <SelectItem value="Bus">Bus</SelectItem>
                                      <SelectItem value="Flight">Flight</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div>
                                  <Label>Departure</Label>
                                  <Input defaultValue={booking.departure} />
                                </div>
                                <div>
                                  <Label>Arrival</Label>
                                  <Input defaultValue={booking.arrival} />
                                </div>
                                <div>
                                  <Label>Seat Preference</Label>
                                  <Input defaultValue={booking.seatPreference} />
                                </div>
                                <div>
                                  <Label>Ticket Price</Label>
                                  <Input defaultValue={booking.ticketPrice} />
                                </div>
                              </div>
                            </div>

                            {/* Purpose */}
                            <div>
                              <Label>Purpose of Travel</Label>
                              <Textarea 
                                defaultValue={booking.purpose}
                                className="mt-1"
                              />
                            </div>

                            {/* Payment Proof Upload */}
                            <div>
                              <Label>Upload Payment Proof</Label>
                              <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                                <div className="mt-4">
                                  <Button variant="outline">
                                    Choose File
                                  </Button>
                                  <p className="mt-2 text-sm text-gray-500">
                                    Upload payment receipt (PDF, JPG, PNG)
                                  </p>
                                </div>
                              </div>
                            </div>

                            {/* Action Buttons */}
                            {booking.status === "Pending" && (
                              <div className="flex justify-end space-x-3">
                                <Button 
                                  variant="outline" 
                                  onClick={() => handleRejectBooking(booking.id)}
                                >
                                  <X className="h-4 w-4 mr-2" />
                                  Reject
                                </Button>
                                <Button 
                                  onClick={() => handleApproveBooking(booking.id)}
                                  className="bg-green-600 hover:bg-green-700"
                                >
                                  <Check className="h-4 w-4 mr-2" />
                                  Approve & Book
                                </Button>
                              </div>
                            )}
                          </div>
                        </DialogContent>
                      </Dialog>
                      
                      {booking.status === "Pending" && (
                        <>
                          <Button
                            size="sm"
                            onClick={() => handleApproveBooking(booking.id)}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleRejectBooking(booking.id)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </>
                      )}
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

export default TicketBooking;