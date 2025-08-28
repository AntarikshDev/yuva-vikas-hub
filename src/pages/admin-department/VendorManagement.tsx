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
  Plus, 
  Eye, 
  Edit, 
  Check, 
  X, 
  Upload, 
  Download,
  Building,
  Phone,
  Mail,
  CreditCard,
  Calendar
} from "lucide-react";

const VendorManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [serviceFilter, setServiceFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedVendor, setSelectedVendor] = useState<any>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const { toast } = useToast();

  // Mock data for vendors
  const vendorData = [
    {
      id: 1,
      vendorName: "ABC Accommodation Services",
      serviceType: "Accommodation",
      contactPerson: "Rajesh Kumar",
      phone: "+91 9876543210",
      email: "rajesh@abcservices.com",
      paymentStatus: "Active",
      totalPayments: "₹5,00,000",
      lastPayment: "2025-07-20",
      contractDate: "2024-01-15",
      paymentTerms: "Net-30"
    },
    {
      id: 2,
      vendorName: "Fresh Foods Groceries",
      serviceType: "Groceries",
      contactPerson: "Priya Sharma",
      phone: "+91 9876543211",
      email: "priya@freshfoods.com",
      paymentStatus: "Pending Approval",
      totalPayments: "₹2,50,000",
      lastPayment: "2025-07-15",
      contractDate: "2024-03-01",
      paymentTerms: "Net-15"
    },
    {
      id: 3,
      vendorName: "Quality Materials Pvt Ltd",
      serviceType: "Materials",
      contactPerson: "Amit Singh",
      phone: "+91 9876543212",
      email: "amit@qualitymaterials.com",
      paymentStatus: "Active",
      totalPayments: "₹3,75,000",
      lastPayment: "2025-07-18",
      contractDate: "2024-02-10",
      paymentTerms: "Net-45"
    },
    {
      id: 4,
      vendorName: "Swift Transport Services",
      serviceType: "Transport",
      contactPerson: "Neha Patel",
      phone: "+91 9876543213",
      email: "neha@swifttransport.com",
      paymentStatus: "Suspended",
      totalPayments: "₹1,25,000",
      lastPayment: "2025-06-30",
      contractDate: "2024-04-20",
      paymentTerms: "Net-30"
    }
  ];

  // Mock data for vendor payments
  const vendorPayments = [
    {
      id: 1,
      vendorName: "ABC Accommodation Services",
      amount: "₹1,00,000",
      serviceType: "Accommodation",
      paymentDate: "2025-07-25",
      status: "Pending Approval",
      invoiceNumber: "INV-ABC-001"
    },
    {
      id: 2,
      vendorName: "Fresh Foods Groceries",
      amount: "₹50,000",
      serviceType: "Groceries",
      paymentDate: "2025-07-20",
      status: "Paid",
      invoiceNumber: "INV-FF-002"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active": return "bg-green-100 text-green-800";
      case "Pending Approval": return "bg-yellow-100 text-yellow-800";
      case "Suspended": return "bg-red-100 text-red-800";
      case "Paid": return "bg-blue-100 text-blue-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const filteredVendorData = vendorData.filter(vendor => {
    const matchesSearch = vendor.vendorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vendor.contactPerson.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesService = serviceFilter === "all" || vendor.serviceType === serviceFilter;
    const matchesStatus = statusFilter === "all" || vendor.paymentStatus === statusFilter;
    return matchesSearch && matchesService && matchesStatus;
  });

  const handleAddVendor = () => {
    toast({
      title: "Vendor Added",
      description: "New vendor has been added successfully and sent for approval.",
    });
    setShowCreateForm(false);
  };

  const handleApprovePayment = (paymentId: number) => {
    toast({
      title: "Payment Approved",
      description: "Vendor payment has been approved successfully.",
    });
  };

  const handleRejectPayment = (paymentId: number) => {
    toast({
      title: "Payment Rejected",
      description: "Vendor payment has been rejected.",
      variant: "destructive",
    });
  };

  return (
    <div className="min-h-screen bg-background p-4 lg:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Vendor Management</h1>
          <p className="text-muted-foreground mt-1">Manage vendors and their payment approvals</p>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-2">
          <Button variant="outline" size="sm" className="w-full sm:w-auto">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Dialog open={showCreateForm} onOpenChange={setShowCreateForm}>
            <DialogTrigger asChild>
              <Button size="sm" className="w-full sm:w-auto">
                <Plus className="h-4 w-4 mr-2" />
                Add Vendor
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create New Vendor</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Vendor Name</Label>
                    <Input placeholder="Enter vendor name" />
                  </div>
                  <div>
                    <Label>Service Type</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select service type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="accommodation">Accommodation</SelectItem>
                        <SelectItem value="groceries">Groceries</SelectItem>
                        <SelectItem value="materials">Materials</SelectItem>
                        <SelectItem value="transport">Transport</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Contact Person</Label>
                    <Input placeholder="Contact person name" />
                  </div>
                  <div>
                    <Label>Phone</Label>
                    <Input placeholder="Phone number" />
                  </div>
                  <div>
                    <Label>Email</Label>
                    <Input placeholder="Email address" type="email" />
                  </div>
                  <div>
                    <Label>Payment Terms</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select payment terms" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="net-15">Net-15</SelectItem>
                        <SelectItem value="net-30">Net-30</SelectItem>
                        <SelectItem value="net-45">Net-45</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label>Bank Details</Label>
                  <Textarea placeholder="Enter bank account details" />
                </div>
                <div>
                  <Label>Upload Contract/Agreement</Label>
                  <div className="mt-2 border-2 border-dashed border-border rounded-lg p-6 text-center">
                    <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
                    <div className="mt-4">
                      <Button variant="outline">
                        Choose File
                      </Button>
                      <p className="mt-2 text-sm text-muted-foreground">
                        Upload PDF or DOC (Max 10MB)
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3">
                  <Button variant="outline" onClick={() => setShowCreateForm(false)} className="w-full sm:w-auto">
                    Cancel
                  </Button>
                  <Button onClick={handleAddVendor} className="w-full sm:w-auto">
                    Save & Submit for Approval
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search vendors..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Select value={serviceFilter} onValueChange={setServiceFilter}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Filter by Service" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Services</SelectItem>
                  <SelectItem value="Accommodation">Accommodation</SelectItem>
                  <SelectItem value="Groceries">Groceries</SelectItem>
                  <SelectItem value="Materials">Materials</SelectItem>
                  <SelectItem value="Transport">Transport</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Filter by Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Pending Approval">Pending Approval</SelectItem>
                  <SelectItem value="Suspended">Suspended</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" className="w-full sm:w-auto">
                <Plus className="h-4 w-4 mr-2" />
                Advanced Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <Building className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-2xl font-bold text-gray-900">24</p>
                <p className="text-sm text-gray-600">Total Vendors</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <Check className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-2xl font-bold text-green-600">18</p>
                <p className="text-sm text-gray-600">Active Vendors</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <CreditCard className="h-8 w-8 text-yellow-600" />
              <div>
                <p className="text-2xl font-bold text-yellow-600">5</p>
                <p className="text-sm text-gray-600">Pending Approvals</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <X className="h-8 w-8 text-red-600" />
              <div>
                <p className="text-2xl font-bold text-red-600">1</p>
                <p className="text-sm text-gray-600">Suspended</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Vendors Table */}
      <Card>
        <CardHeader>
          <CardTitle>Vendor Directory</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Vendor Name</TableHead>
                <TableHead>Service Type</TableHead>
                <TableHead>Contact Person</TableHead>
                <TableHead>Contact Info</TableHead>
                <TableHead>Total Payments</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredVendorData.map((vendor) => (
                <TableRow key={vendor.id}>
                  <TableCell className="font-medium">{vendor.vendorName}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{vendor.serviceType}</Badge>
                  </TableCell>
                  <TableCell>{vendor.contactPerson}</TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center text-sm text-gray-600">
                        <Phone className="h-3 w-3 mr-1" />
                        {vendor.phone}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Mail className="h-3 w-3 mr-1" />
                        {vendor.email}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="font-semibold">{vendor.totalPayments}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(vendor.paymentStatus)}>
                      {vendor.paymentStatus}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedVendor(vendor)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Vendor Details - {vendor.vendorName}</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <Label>Vendor Name</Label>
                                <p className="font-medium">{vendor.vendorName}</p>
                              </div>
                              <div>
                                <Label>Service Type</Label>
                                <p className="font-medium">{vendor.serviceType}</p>
                              </div>
                              <div>
                                <Label>Contact Person</Label>
                                <p className="font-medium">{vendor.contactPerson}</p>
                              </div>
                              <div>
                                <Label>Payment Terms</Label>
                                <p className="font-medium">{vendor.paymentTerms}</p>
                              </div>
                              <div>
                                <Label>Contract Date</Label>
                                <p className="font-medium">{vendor.contractDate}</p>
                              </div>
                              <div>
                                <Label>Last Payment</Label>
                                <p className="font-medium">{vendor.lastPayment}</p>
                              </div>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Vendor Payments Table */}
      <Card>
        <CardHeader>
          <CardTitle>Pending Vendor Payments</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Vendor Name</TableHead>
                <TableHead>Invoice #</TableHead>
                <TableHead>Service Type</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Payment Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {vendorPayments.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell className="font-medium">{payment.vendorName}</TableCell>
                  <TableCell>{payment.invoiceNumber}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{payment.serviceType}</Badge>
                  </TableCell>
                  <TableCell className="font-semibold">{payment.amount}</TableCell>
                  <TableCell>{payment.paymentDate}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(payment.status)}>
                      {payment.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      {payment.status === "Pending Approval" && (
                        <>
                          <Button size="sm" className="bg-green-600 hover:bg-green-700">
                            <Check className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
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

export default VendorManagement;