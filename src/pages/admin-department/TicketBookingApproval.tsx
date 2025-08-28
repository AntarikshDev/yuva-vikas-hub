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

export default function TicketBookingApproval() {
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
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Ticket Booking Approvals</h1>
          <p className="text-muted-foreground mt-1">Review and approve travel booking requests</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export Bookings
          </Button>
          <Button variant="outline" size="sm">
            <FileText className="h-4 w-4 mr-2" />
            Generate Report
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <Plane className="h-8 w-8 text-primary" />
              <div>
                <p className="text-2xl font-bold">28</p>
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
        <CardContent>
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
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      {booking.status === "Pending Approval" && (
                        <>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="text-green-600"
                            onClick={() => handleApproval(booking.id, 'approve')}
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="text-red-600"
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
}