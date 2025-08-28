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
  Filter, 
  Eye, 
  Check, 
  X, 
  Upload, 
  Download,
  FileText,
  AlertCircle
} from "lucide-react";

const RentManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedRent, setSelectedRent] = useState<any>(null);

  // Mock data for rent payments
  const rentData = [
    {
      id: 1,
      centreName: "Centre A - Delhi",
      rentAmount: "₹1,00,000",
      serviceCharges: "₹10,000",
      totalAmount: "₹1,10,000",
      paymentStatus: "Pending",
      paymentDate: "2025-07-25",
      dueDate: "2025-07-30",
      invoiceNumber: "INV-2025-001",
      lastPaidDate: "2025-06-25"
    },
    {
      id: 2,
      centreName: "Centre B - Mumbai",
      rentAmount: "₹1,50,000",
      serviceCharges: "₹15,000",
      totalAmount: "₹1,65,000",
      paymentStatus: "Completed",
      paymentDate: "2025-07-20",
      dueDate: "2025-07-30",
      invoiceNumber: "INV-2025-002",
      lastPaidDate: "2025-07-20"
    },
    {
      id: 3,
      centreName: "Centre C - Bangalore",
      rentAmount: "₹1,25,000",
      serviceCharges: "₹12,500",
      totalAmount: "₹1,37,500",
      paymentStatus: "Overdue",
      paymentDate: "",
      dueDate: "2025-07-15",
      invoiceNumber: "INV-2025-003",
      lastPaidDate: "2025-05-15"
    },
    {
      id: 4,
      centreName: "Centre D - Chennai",
      rentAmount: "₹90,000",
      serviceCharges: "₹9,000",
      totalAmount: "₹99,000",
      paymentStatus: "Pending",
      paymentDate: "",
      dueDate: "2025-08-01",
      invoiceNumber: "INV-2025-004",
      lastPaidDate: "2025-06-01"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed": return "bg-green-100 text-green-800";
      case "Pending": return "bg-yellow-100 text-yellow-800";
      case "Overdue": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const filteredRentData = rentData.filter(rent => {
    const matchesSearch = rent.centreName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         rent.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || rent.paymentStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleApprovePayment = (rentId: number) => {
    console.log("Approving payment for rent ID:", rentId);
    // Implementation for payment approval
  };

  const handleRejectPayment = (rentId: number) => {
    console.log("Rejecting payment for rent ID:", rentId);
    // Implementation for payment rejection
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Rent Management</h1>
          <p className="text-gray-600 mt-1">Manage center rent payments and approvals</p>
        </div>
        <div className="flex items-center gap-2 mt-4 sm:mt-0">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button size="sm">
            <FileText className="h-4 w-4 mr-2" />
            Generate Report
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search centres or invoice numbers..."
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
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
                <SelectItem value="Overdue">Overdue</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              More Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">12</p>
              <p className="text-sm text-gray-600">Total Centres</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-yellow-600">4</p>
              <p className="text-sm text-gray-600">Pending Payments</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-red-600">1</p>
              <p className="text-sm text-gray-600">Overdue Payments</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">₹15,00,000</p>
              <p className="text-sm text-gray-600">Total This Month</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Rent Table */}
      <Card>
        <CardHeader>
          <CardTitle>Rent Payments</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Centre Name</TableHead>
                <TableHead>Invoice #</TableHead>
                <TableHead>Rent Amount</TableHead>
                <TableHead>Total Amount</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRentData.map((rent) => (
                <TableRow key={rent.id}>
                  <TableCell className="font-medium">{rent.centreName}</TableCell>
                  <TableCell>{rent.invoiceNumber}</TableCell>
                  <TableCell>{rent.rentAmount}</TableCell>
                  <TableCell className="font-semibold">{rent.totalAmount}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      {rent.paymentStatus === "Overdue" && (
                        <AlertCircle className="h-4 w-4 text-red-500 mr-1" />
                      )}
                      {rent.dueDate}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(rent.paymentStatus)}>
                      {rent.paymentStatus}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedRent(rent)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Rent Payment Invoice - {rent.invoiceNumber}</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-6">
                            {/* Invoice Details */}
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label>Centre Name</Label>
                                <p className="font-medium">{rent.centreName}</p>
                              </div>
                              <div>
                                <Label>Invoice Number</Label>
                                <p className="font-medium">{rent.invoiceNumber}</p>
                              </div>
                              <div>
                                <Label>Rent Amount</Label>
                                <Input defaultValue={rent.rentAmount} />
                              </div>
                              <div>
                                <Label>Service Charges</Label>
                                <Input defaultValue={rent.serviceCharges} />
                              </div>
                              <div>
                                <Label>Total Payment</Label>
                                <Input defaultValue={rent.totalAmount} className="font-bold" />
                              </div>
                              <div>
                                <Label>Due Date</Label>
                                <p className="font-medium">{rent.dueDate}</p>
                              </div>
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
                                    Upload PDF, JPG, or PNG (Max 10MB)
                                  </p>
                                </div>
                              </div>
                            </div>

                            {/* Remarks */}
                            <div>
                              <Label>Remarks</Label>
                              <Textarea 
                                placeholder="Add any remarks or notes..."
                                className="mt-1"
                              />
                            </div>

                            {/* Action Buttons */}
                            <div className="flex justify-end space-x-3">
                              <Button 
                                variant="outline" 
                                onClick={() => handleRejectPayment(rent.id)}
                              >
                                <X className="h-4 w-4 mr-2" />
                                Reject
                              </Button>
                              <Button 
                                onClick={() => handleApprovePayment(rent.id)}
                                className="bg-green-600 hover:bg-green-700"
                              >
                                <Check className="h-4 w-4 mr-2" />
                                Approve Payment
                              </Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                      
                      {rent.paymentStatus === "Pending" && (
                        <Button
                          size="sm"
                          onClick={() => handleApprovePayment(rent.id)}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <Check className="h-4 w-4" />
                        </Button>
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

export default RentManagement;