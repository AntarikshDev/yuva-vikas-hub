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
import { useToast } from "@/hooks/use-toast";
import { 
  Search, 
  Filter, 
  Eye, 
  Check, 
  X, 
  Upload, 
  Download,
  FileText,
  AlertCircle,
  Building,
  Calendar,
  CreditCard
} from "lucide-react";

const RentManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedRent, setSelectedRent] = useState<any>(null);
  const [rentData, setRentData] = useState([
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
  ]);
  const { toast } = useToast();


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
    setRentData(prev => 
      prev.map(rent => 
        rent.id === rentId 
          ? { ...rent, paymentStatus: "Completed", paymentDate: new Date().toISOString().split('T')[0] }
          : rent
      )
    );
    toast({
      title: "Payment Approved",
      description: "Rent payment has been approved successfully.",
    });
  };

  const handleRejectPayment = (rentId: number) => {
    setRentData(prev => 
      prev.map(rent => 
        rent.id === rentId 
          ? { ...rent, paymentStatus: "Rejected" }
          : rent
      )
    );
    toast({
      title: "Payment Rejected",
      description: "Rent payment has been rejected.",
      variant: "destructive",
    });
  };

  return (
    <div className="min-h-screen bg-background p-4 lg:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Rent Management</h1>
          <p className="text-muted-foreground mt-1">Manage center rent payments and approvals</p>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-2">
          <Button variant="outline" size="sm" className="w-full sm:w-auto">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button size="sm" className="w-full sm:w-auto">
            <FileText className="h-4 w-4 mr-2" />
            Generate Report
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search centres or invoice numbers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Filter by Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                  <SelectItem value="Overdue">Overdue</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" className="w-full sm:w-auto">
                <Filter className="h-4 w-4 mr-2" />
                More Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <Building className="h-8 w-8 text-primary" />
              <div>
                <p className="text-2xl font-bold text-foreground">12</p>
                <p className="text-sm text-muted-foreground">Total Centres</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <Calendar className="h-8 w-8 text-yellow-600" />
              <div>
                <p className="text-2xl font-bold text-yellow-600">4</p>
                <p className="text-sm text-muted-foreground">Pending Payments</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <AlertCircle className="h-8 w-8 text-red-600" />
              <div>
                <p className="text-2xl font-bold text-red-600">1</p>
                <p className="text-sm text-muted-foreground">Overdue Payments</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <CreditCard className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-2xl font-bold text-green-600">₹15,00,000</p>
                <p className="text-sm text-muted-foreground">Total This Month</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Desktop Table View */}
      <div className="hidden lg:block">
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
                                <div className="mt-2 border-2 border-dashed border-border rounded-lg p-6 text-center">
                                  <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
                                  <div className="mt-4">
                                    <Button variant="outline">
                                      Choose File
                                    </Button>
                                    <p className="mt-2 text-sm text-muted-foreground">
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

      {/* Mobile Card View */}
      <div className="lg:hidden space-y-4">
        {filteredRentData.map((rent) => (
          <Card key={rent.id} className="border-l-4 border-l-primary">
            <CardContent className="p-4">
              <div className="flex flex-col space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-foreground">{rent.centreName}</h3>
                    <p className="text-sm text-muted-foreground">{rent.invoiceNumber}</p>
                  </div>
                  <Badge className={getStatusColor(rent.paymentStatus)}>
                    {rent.paymentStatus}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Rent Amount</p>
                    <p className="font-medium">{rent.rentAmount}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Total Amount</p>
                    <p className="font-semibold text-foreground">{rent.totalAmount}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Due Date</p>
                    <p className="font-medium flex items-center">
                      {rent.paymentStatus === "Overdue" && (
                        <AlertCircle className="h-3 w-3 text-red-500 mr-1" />
                      )}
                      {rent.dueDate}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Last Paid</p>
                    <p className="font-medium">{rent.lastPaidDate}</p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => setSelectedRent(rent)}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Rent Payment Invoice - {rent.invoiceNumber}</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-6">
                        {/* Invoice Details */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                          <div className="mt-2 border-2 border-dashed border-border rounded-lg p-6 text-center">
                            <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
                            <div className="mt-4">
                              <Button variant="outline">
                                Choose File
                              </Button>
                              <p className="mt-2 text-sm text-muted-foreground">
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
                        <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3">
                          <Button 
                            variant="outline" 
                            onClick={() => handleRejectPayment(rent.id)}
                            className="w-full sm:w-auto"
                          >
                            <X className="h-4 w-4 mr-2" />
                            Reject
                          </Button>
                          <Button 
                            onClick={() => handleApprovePayment(rent.id)}
                            className="bg-green-600 hover:bg-green-700 w-full sm:w-auto"
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
                      className="bg-green-600 hover:bg-green-700 flex-1"
                    >
                      <Check className="h-4 w-4 mr-2" />
                      Approve
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default RentManagement;