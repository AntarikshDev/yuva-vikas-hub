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
  Eye, 
  Check,
  X,
  Clock,
  Download,
  FileText,
  Plane,
  Train,
  Bus,
  Calendar,
  User,
  MapPin,
  CreditCard
} from "lucide-react";

const TicketBookingApproval = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [selectedBooking, setSelectedBooking] = useState<any>(null);

  // Mock data for ticket booking requests
  const ticketBookingData = [
    {
      id: 1,
      bookingId: "TB-2025-001",
      passengerName: "Rahul Sharma",
      requestedBy: "State Head - Delhi",
      travelType: "Flight",
      from: "Delhi",
      to: "Mumbai",
      departureDate: "2025-08-15",
      returnDate: "2025-08-17",
      purpose: "Center Inspection",
      estimatedAmount: "₹12,500",
      actualAmount: "₹11,800",
      status: "Pending Approval",
      priority: "High",
      requestDate: "2025-07-22",
      preferredTime: "Morning",
      classType: "Economy",
      urgency: "Urgent",
      approvalLevel: "Admin"
    },
    {
      id: 2,
      bookingId: "TB-2025-002",
      passengerName: "Priya Patel",
      requestedBy: "Center Manager - Bangalore",
      travelType: "Train",
      from: "Bangalore",
      to: "Chennai",
      departureDate: "2025-08-10",
      returnDate: "2025-08-12",
      purpose: "Training Program",
      estimatedAmount: "₹3,200",
      actualAmount: "₹2,950",
      status: "Approved",
      priority: "Medium",
      requestDate: "2025-07-20",
      preferredTime: "Evening",
      classType: "AC 2-Tier",
      urgency: "Normal",
      approvalLevel: "Admin",
      approvalDate: "2025-07-21",
      approvedBy: "Admin User"
    },
    {
      id: 3,
      bookingId: "TB-2025-003",
      passengerName: "Amit Kumar",
      requestedBy: "Trainer - Pune",
      travelType: "Bus",
      from: "Pune",
      to: "Aurangabad",
      departureDate: "2025-08-05",
      returnDate: "2025-08-06",
      purpose: "Candidate Interview",
      estimatedAmount: "₹800",
      actualAmount: "₹750",
      status: "Rejected",
      priority: "Low",
      requestDate: "2025-07-18",
      preferredTime: "Morning",
      classType: "AC Sleeper",
      urgency: "Normal",
      approvalLevel: "State Head",
      rejectionDate: "2025-07-19",
      rejectionReason: "Alternative local candidate available"
    },
    {
      id: 4,
      bookingId: "TB-2025-004",
      passengerName: "Neha Singh",
      requestedBy: "Counsellor - Jaipur",
      travelType: "Flight",
      from: "Jaipur",
      to: "Kolkata",
      departureDate: "2025-08-20",
      returnDate: "2025-08-22",
      purpose: "Parent Counselling",
      estimatedAmount: "₹15,000",
      actualAmount: "₹14,200",
      status: "Pending Approval",
      priority: "Medium",
      requestDate: "2025-07-23",
      preferredTime: "Afternoon",
      classType: "Business",
      urgency: "Normal",
      approvalLevel: "Admin"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Pending Approval": return "bg-yellow-100 text-yellow-800";
      case "Approved": return "bg-green-100 text-green-800";
      case "Rejected": return "bg-red-100 text-red-800";
      case "Booked": return "bg-blue-100 text-blue-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High": return "bg-red-100 text-red-800";
      case "Medium": return "bg-yellow-100 text-yellow-800";
      case "Low": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getTravelIcon = (type: string) => {
    switch (type) {
      case "Flight": return <Plane className="h-4 w-4" />;
      case "Train": return <Train className="h-4 w-4" />;
      case "Bus": return <Bus className="h-4 w-4" />;
      default: return <MapPin className="h-4 w-4" />;
    }
  };

  const filteredBookingData = ticketBookingData.filter(booking => {
    const matchesSearch = booking.bookingId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         booking.passengerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         booking.requestedBy.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || booking.status === statusFilter;
    const matchesType = !typeFilter || booking.travelType === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const handleApproval = (bookingId: number, action: 'approve' | 'reject') => {
    console.log(`${action} booking:`, bookingId);
  };

  return (
    <div className="min-h-screen bg-background p-4 lg:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Ticket Booking Approvals</h1>
          <p className="text-muted-foreground mt-1">Review and approve travel booking requests</p>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-2">
          <Button variant="outline" size="sm" className="w-full sm:w-auto">
            <Download className="h-4 w-4 mr-2" />
            Export Bookings
          </Button>
          <Button variant="outline" size="sm" className="w-full sm:w-auto">
            <FileText className="h-4 w-4 mr-2" />
            Generate Report
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search booking ID, passenger..."
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
                <SelectItem value="">All Status</SelectItem>
                <SelectItem value="Pending Approval">Pending Approval</SelectItem>
                <SelectItem value="Approved">Approved</SelectItem>
                <SelectItem value="Rejected">Rejected</SelectItem>
                <SelectItem value="Booked">Booked</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by Travel Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Types</SelectItem>
                <SelectItem value="Flight">Flight</SelectItem>
                <SelectItem value="Train">Train</SelectItem>
                <SelectItem value="Bus">Bus</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="w-full">
              <Calendar className="h-4 w-4 mr-2" />
              Date Range
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <Plane className="h-8 w-8 text-primary" />
              <div>
                <p className="text-2xl font-bold text-foreground">28</p>
                <p className="text-sm text-muted-foreground">Total Requests</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <Clock className="h-8 w-8 text-yellow-600" />
              <div>
                <p className="text-2xl font-bold text-yellow-600">12</p>
                <p className="text-sm text-muted-foreground">Pending Approval</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <Check className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-2xl font-bold text-green-600">14</p>
                <p className="text-sm text-muted-foreground">Approved</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <CreditCard className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-2xl font-bold text-blue-600">₹2.8L</p>
                <p className="text-sm text-muted-foreground">Total Budget</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Ticket Booking Requests Table */}
      <Card>
        <CardHeader>
          <CardTitle>Travel Booking Requests</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Booking ID</TableHead>
                <TableHead>Passenger</TableHead>
                <TableHead>Travel Details</TableHead>
                <TableHead>Purpose</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBookingData.map((booking) => (
                <TableRow key={booking.id}>
                  <TableCell className="font-medium">{booking.bookingId}</TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <p className="font-medium">{booking.passengerName}</p>
                      <p className="text-xs text-muted-foreground">{booking.requestedBy}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center">
                        {getTravelIcon(booking.travelType)}
                        <span className="ml-1 text-sm font-medium">{booking.travelType}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {booking.from} → {booking.to}
                      </p>
                      <p className="text-xs text-muted-foreground">{booking.departureDate}</p>
                    </div>
                  </TableCell>
                  <TableCell className="max-w-[150px] truncate">{booking.purpose}</TableCell>
                  <TableCell className="font-semibold">{booking.estimatedAmount}</TableCell>
                  <TableCell>
                    <Badge className={getPriorityColor(booking.priority)}>
                      {booking.priority}
                    </Badge>
                  </TableCell>
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
                        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>Travel Booking Details - {booking.bookingId}</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-6">
                            {/* Booking Header */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <Label>Booking ID</Label>
                                <p className="font-medium">{booking.bookingId}</p>
                              </div>
                              <div>
                                <Label>Request Date</Label>
                                <p className="font-medium">{booking.requestDate}</p>
                              </div>
                              <div>
                                <Label>Passenger Name</Label>
                                <p className="font-medium">{booking.passengerName}</p>
                              </div>
                              <div>
                                <Label>Requested By</Label>
                                <p className="font-medium">{booking.requestedBy}</p>
                              </div>
                            </div>

                            {/* Travel Details */}
                            <div>
                              <Label className="text-base font-semibold">Travel Information</Label>
                              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <Label>Travel Type</Label>
                                  <div className="flex items-center mt-1">
                                    {getTravelIcon(booking.travelType)}
                                    <span className="ml-2 font-medium">{booking.travelType}</span>
                                  </div>
                                </div>
                                <div>
                                  <Label>Class/Type</Label>
                                  <p className="font-medium">{booking.classType}</p>
                                </div>
                                <div>
                                  <Label>From</Label>
                                  <p className="font-medium">{booking.from}</p>
                                </div>
                                <div>
                                  <Label>To</Label>
                                  <p className="font-medium">{booking.to}</p>
                                </div>
                                <div>
                                  <Label>Departure Date</Label>
                                  <p className="font-medium">{booking.departureDate}</p>
                                </div>
                                <div>
                                  <Label>Return Date</Label>
                                  <p className="font-medium">{booking.returnDate}</p>
                                </div>
                                <div>
                                  <Label>Preferred Time</Label>
                                  <p className="font-medium">{booking.preferredTime}</p>
                                </div>
                                <div>
                                  <Label>Priority</Label>
                                  <Badge className={getPriorityColor(booking.priority)}>
                                    {booking.priority}
                                  </Badge>
                                </div>
                              </div>
                            </div>

                            {/* Financial Details */}
                            <div>
                              <Label className="text-base font-semibold">Cost Information</Label>
                              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <Label>Estimated Amount</Label>
                                  <p className="font-medium text-lg">{booking.estimatedAmount}</p>
                                </div>
                                <div>
                                  <Label>Actual Amount</Label>
                                  <p className="font-medium text-lg text-green-600">{booking.actualAmount}</p>
                                </div>
                              </div>
                            </div>

                            {/* Purpose */}
                            <div>
                              <Label>Travel Purpose</Label>
                              <p className="mt-1 p-3 bg-secondary/50 rounded-md">{booking.purpose}</p>
                            </div>

                            {/* Approval Section */}
                            <div>
                              <Label className="text-base font-semibold">Approval Status</Label>
                              <div className="mt-4 p-4 border rounded-lg">
                                <div className="flex items-center justify-between">
                                  <div>
                                    <p className="font-medium">Admin Approval</p>
                                    <p className="text-sm text-muted-foreground">
                                      Current Status: {booking.status}
                                    </p>
                                    {booking.approvalDate && (
                                      <p className="text-sm text-muted-foreground">
                                        Approved on: {booking.approvalDate} by {booking.approvedBy}
                                      </p>
                                    )}
                                  </div>
                                  <Badge className={getStatusColor(booking.status)}>
                                    {booking.status}
                                  </Badge>
                                </div>
                              </div>
                            </div>

                            {booking.rejectionReason && (
                              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                                <Label className="text-red-800 font-semibold">Rejection Reason</Label>
                                <p className="mt-1 text-red-700">{booking.rejectionReason}</p>
                              </div>
                            )}

                            {/* Admin Remarks */}
                            {booking.status === "Pending Approval" && (
                              <div>
                                <Label>Admin Remarks</Label>
                                <Textarea 
                                  placeholder="Add remarks for approval/rejection..."
                                  className="mt-1"
                                />
                              </div>
                            )}

                            {/* Action Buttons */}
                            {booking.status === "Pending Approval" && (
                              <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t">
                                <Button variant="outline">
                                  <X className="h-4 w-4 mr-2" />
                                  Reject Request
                                </Button>
                                <Button className="bg-green-600 hover:bg-green-700">
                                  <Check className="h-4 w-4 mr-2" />
                                  Approve Booking
                                </Button>
                              </div>
                            )}
                          </div>
                        </DialogContent>
                      </Dialog>
                      
                      {booking.status === "Pending Approval" && (
                        <>
                          <Button 
                            size="sm" 
                            className="bg-green-600 hover:bg-green-700"
                            onClick={() => handleApproval(booking.id, 'approve')}
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleApproval(booking.id, 'reject')}
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

export default TicketBookingApproval;