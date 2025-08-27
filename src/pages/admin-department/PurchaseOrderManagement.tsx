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
  Edit,
  Check,
  X,
  Clock,
  Download,
  FileText,
  ShoppingCart,
  Truck,
  Calendar,
  User,
  Building
} from "lucide-react";

const PurchaseOrderManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [selectedPO, setSelectedPO] = useState<any>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);

  // Mock data for purchase orders
  const purchaseOrderData = [
    {
      id: 1,
      poNumber: "PO-2025-001",
      vendor: "ABC Accommodation Services",
      requestedBy: "State Head - Delhi",
      requestDate: "2025-07-20",
      expectedDelivery: "2025-08-05",
      totalAmount: "₹2,50,000",
      status: "Draft",
      priority: "Medium",
      items: [
        { item: "Furniture Set", quantity: 10, unitPrice: "₹15,000", amount: "₹1,50,000" },
        { item: "Bedding & Linen", quantity: 50, unitPrice: "₹2,000", amount: "₹1,00,000" }
      ],
      stateHeadApproval: "Pending",
      adminApproval: "Pending",
      createdDate: "2025-07-20"
    },
    {
      id: 2,
      poNumber: "PO-2025-002",
      vendor: "Fresh Foods Groceries",
      requestedBy: "Center Manager - Mumbai",
      requestDate: "2025-07-18",
      expectedDelivery: "2025-07-25",
      totalAmount: "₹75,000",
      status: "State Head Approved",
      priority: "High",
      items: [
        { item: "Monthly Groceries", quantity: 1, unitPrice: "₹50,000", amount: "₹50,000" },
        { item: "Kitchen Supplies", quantity: 1, unitPrice: "₹25,000", amount: "₹25,000" }
      ],
      stateHeadApproval: "Approved",
      stateHeadApprovalDate: "2025-07-21",
      adminApproval: "Pending",
      createdDate: "2025-07-18"
    },
    {
      id: 3,
      poNumber: "PO-2025-003",
      vendor: "Quality Materials Pvt Ltd",
      requestedBy: "State Head - Karnataka",
      requestDate: "2025-07-15",
      expectedDelivery: "2025-07-30",
      totalAmount: "₹1,80,000",
      status: "Admin Approved",
      priority: "Medium",
      items: [
        { item: "Training Equipment", quantity: 5, unitPrice: "₹20,000", amount: "₹1,00,000" },
        { item: "Projection System", quantity: 2, unitPrice: "₹40,000", amount: "₹80,000" }
      ],
      stateHeadApproval: "Approved",
      stateHeadApprovalDate: "2025-07-17",
      adminApproval: "Approved",
      adminApprovalDate: "2025-07-19",
      createdDate: "2025-07-15"
    },
    {
      id: 4,
      poNumber: "PO-2025-004",
      vendor: "Swift Transport Services",
      requestedBy: "Center Manager - Chennai",
      requestDate: "2025-07-22",
      expectedDelivery: "2025-07-28",
      totalAmount: "₹45,000",
      status: "Rejected",
      priority: "Low",
      items: [
        { item: "Transportation Service", quantity: 1, unitPrice: "₹45,000", amount: "₹45,000" }
      ],
      stateHeadApproval: "Rejected",
      stateHeadApprovalDate: "2025-07-23",
      rejectionReason: "Budget constraints for this quarter",
      adminApproval: "Not Required",
      createdDate: "2025-07-22"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Draft": return "bg-gray-100 text-gray-800";
      case "State Head Approved": return "bg-yellow-100 text-yellow-800";
      case "Admin Approved": return "bg-green-100 text-green-800";
      case "Rejected": return "bg-red-100 text-red-800";
      case "Completed": return "bg-blue-100 text-blue-800";
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

  const filteredPOData = purchaseOrderData.filter(po => {
    const matchesSearch = po.poNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         po.vendor.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         po.requestedBy.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || po.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleStateHeadApproval = (poId: number, action: 'approve' | 'reject') => {
    console.log(`State Head ${action} PO:`, poId);
  };

  const handleAdminApproval = (poId: number, action: 'approve' | 'reject') => {
    console.log(`Admin ${action} PO:`, poId);
  };

  return (
    <div className="min-h-screen bg-background p-4 lg:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Purchase Order Management</h1>
          <p className="text-muted-foreground mt-1">2-Step approval process: State Head → Admin</p>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-2">
          <Button variant="outline" size="sm" className="w-full sm:w-auto">
            <Download className="h-4 w-4 mr-2" />
            Export POs
          </Button>
          <Dialog open={showCreateForm} onOpenChange={setShowCreateForm}>
            <DialogTrigger asChild>
              <Button size="sm" className="w-full sm:w-auto">
                <Plus className="h-4 w-4 mr-2" />
                Create Purchase Order
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create New Purchase Order</DialogTitle>
              </DialogHeader>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Vendor</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select vendor" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="vendor1">ABC Accommodation Services</SelectItem>
                        <SelectItem value="vendor2">Fresh Foods Groceries</SelectItem>
                        <SelectItem value="vendor3">Quality Materials Pvt Ltd</SelectItem>
                        <SelectItem value="vendor4">Swift Transport Services</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Priority</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="high">High</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="low">Low</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Expected Delivery Date</Label>
                    <Input type="date" />
                  </div>
                  <div>
                    <Label>Delivery Location</Label>
                    <Input placeholder="Enter delivery address" />
                  </div>
                </div>

                {/* Items Section */}
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <Label className="text-base font-semibold">Purchase Items</Label>
                    <Button variant="outline" size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Item
                    </Button>
                  </div>
                  
                  <div className="border rounded-lg overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Item Description</TableHead>
                          <TableHead>Quantity</TableHead>
                          <TableHead>Unit Price</TableHead>
                          <TableHead>Total</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell>
                            <Input placeholder="Enter item description" />
                          </TableCell>
                          <TableCell>
                            <Input type="number" placeholder="Qty" />
                          </TableCell>
                          <TableCell>
                            <Input placeholder="Unit price" />
                          </TableCell>
                          <TableCell>
                            <Input placeholder="Total" disabled />
                          </TableCell>
                          <TableCell>
                            <Button variant="outline" size="sm">
                              <X className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                </div>

                <div>
                  <Label>Special Instructions</Label>
                  <Textarea placeholder="Any special delivery or handling instructions..." />
                </div>

                <div className="bg-secondary/50 p-4 rounded-lg">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Subtotal:</span>
                        <span className="font-medium">₹0.00</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Tax (18%):</span>
                        <span className="font-medium">₹0.00</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Shipping:</span>
                        <span className="font-medium">₹0.00</span>
                      </div>
                      <div className="flex justify-between border-t pt-2">
                        <span className="font-semibold">Total Amount:</span>
                        <span className="font-semibold text-lg">₹0.00</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row justify-end gap-3">
                  <Button variant="outline" onClick={() => setShowCreateForm(false)} className="w-full sm:w-auto">
                    Cancel
                  </Button>
                  <Button variant="outline" className="w-full sm:w-auto">
                    Save as Draft
                  </Button>
                  <Button className="w-full sm:w-auto">
                    Submit for Approval
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search PO number, vendor..."
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
                <SelectItem value="Draft">Draft</SelectItem>
                <SelectItem value="State Head Approved">State Head Approved</SelectItem>
                <SelectItem value="Admin Approved">Admin Approved</SelectItem>
                <SelectItem value="Rejected">Rejected</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="w-full">
              <Calendar className="h-4 w-4 mr-2" />
              Date Range
            </Button>
            <Button variant="outline" className="w-full">
              <FileText className="h-4 w-4 mr-2" />
              Generate Report
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <ShoppingCart className="h-8 w-8 text-primary" />
              <div>
                <p className="text-2xl font-bold text-foreground">24</p>
                <p className="text-sm text-muted-foreground">Total Purchase Orders</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <Clock className="h-8 w-8 text-yellow-600" />
              <div>
                <p className="text-2xl font-bold text-yellow-600">8</p>
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
                <p className="text-2xl font-bold text-green-600">15</p>
                <p className="text-sm text-muted-foreground">Approved</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <Truck className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-2xl font-bold text-blue-600">₹12.5L</p>
                <p className="text-sm text-muted-foreground">Total Value</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Purchase Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle>Purchase Orders</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>PO Number</TableHead>
                <TableHead>Vendor</TableHead>
                <TableHead>Requested By</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>State Head</TableHead>
                <TableHead>Admin</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPOData.map((po) => (
                <TableRow key={po.id}>
                  <TableCell className="font-medium">{po.poNumber}</TableCell>
                  <TableCell>{po.vendor}</TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <User className="h-4 w-4 mr-1 text-muted-foreground" />
                      {po.requestedBy}
                    </div>
                  </TableCell>
                  <TableCell className="font-semibold">{po.totalAmount}</TableCell>
                  <TableCell>
                    <Badge className={getPriorityColor(po.priority)}>
                      {po.priority}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      className={
                        po.stateHeadApproval === "Approved" ? "bg-green-100 text-green-800" :
                        po.stateHeadApproval === "Rejected" ? "bg-red-100 text-red-800" :
                        "bg-yellow-100 text-yellow-800"
                      }
                    >
                      {po.stateHeadApproval}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      className={
                        po.adminApproval === "Approved" ? "bg-green-100 text-green-800" :
                        po.adminApproval === "Not Required" ? "bg-gray-100 text-gray-800" :
                        "bg-yellow-100 text-yellow-800"
                      }
                    >
                      {po.adminApproval}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(po.status)}>
                      {po.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedPO(po)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>Purchase Order Details - {po.poNumber}</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-6">
                            {/* PO Header */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <Label>PO Number</Label>
                                <p className="font-medium">{po.poNumber}</p>
                              </div>
                              <div>
                                <Label>Vendor</Label>
                                <p className="font-medium">{po.vendor}</p>
                              </div>
                              <div>
                                <Label>Requested By</Label>
                                <p className="font-medium">{po.requestedBy}</p>
                              </div>
                              <div>
                                <Label>Request Date</Label>
                                <p className="font-medium">{po.requestDate}</p>
                              </div>
                              <div>
                                <Label>Expected Delivery</Label>
                                <p className="font-medium">{po.expectedDelivery}</p>
                              </div>
                              <div>
                                <Label>Priority</Label>
                                <Badge className={getPriorityColor(po.priority)}>
                                  {po.priority}
                                </Badge>
                              </div>
                            </div>

                            {/* Items Table */}
                            <div>
                              <Label className="text-base font-semibold">Purchase Items</Label>
                              <div className="mt-2 border rounded-lg overflow-hidden">
                                <Table>
                                  <TableHeader>
                                    <TableRow>
                                      <TableHead>Item</TableHead>
                                      <TableHead>Quantity</TableHead>
                                      <TableHead>Unit Price</TableHead>
                                      <TableHead>Amount</TableHead>
                                    </TableRow>
                                  </TableHeader>
                                  <TableBody>
                                    {po.items.map((item, index) => (
                                      <TableRow key={index}>
                                        <TableCell>{item.item}</TableCell>
                                        <TableCell>{item.quantity}</TableCell>
                                        <TableCell>{item.unitPrice}</TableCell>
                                        <TableCell className="font-medium">{item.amount}</TableCell>
                                      </TableRow>
                                    ))}
                                  </TableBody>
                                </Table>
                              </div>
                              <div className="mt-4 flex justify-end">
                                <div className="text-right">
                                  <p className="text-lg font-semibold">Total Amount: {po.totalAmount}</p>
                                </div>
                              </div>
                            </div>

                            {/* Approval Timeline */}
                            <div>
                              <Label className="text-base font-semibold">Approval Timeline</Label>
                              <div className="mt-4 space-y-4">
                                <div className="flex items-center space-x-4 p-3 border rounded-lg">
                                  <Building className="h-5 w-5 text-blue-600" />
                                  <div className="flex-1">
                                    <p className="font-medium">State Head Approval</p>
                                    <p className="text-sm text-muted-foreground">
                                      Status: {po.stateHeadApproval}
                                      {po.stateHeadApprovalDate && ` - ${po.stateHeadApprovalDate}`}
                                    </p>
                                  </div>
                                  {po.stateHeadApproval === "Pending" && (
                                    <div className="flex space-x-2">
                                      <Button size="sm" className="bg-green-600 hover:bg-green-700">
                                        <Check className="h-4 w-4" />
                                      </Button>
                                      <Button variant="outline" size="sm">
                                        <X className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  )}
                                </div>

                                <div className="flex items-center space-x-4 p-3 border rounded-lg">
                                  <User className="h-5 w-5 text-green-600" />
                                  <div className="flex-1">
                                    <p className="font-medium">Admin Approval</p>
                                    <p className="text-sm text-muted-foreground">
                                      Status: {po.adminApproval}
                                      {po.adminApprovalDate && ` - ${po.adminApprovalDate}`}
                                    </p>
                                  </div>
                                  {po.adminApproval === "Pending" && po.stateHeadApproval === "Approved" && (
                                    <div className="flex space-x-2">
                                      <Button size="sm" className="bg-green-600 hover:bg-green-700">
                                        <Check className="h-4 w-4" />
                                      </Button>
                                      <Button variant="outline" size="sm">
                                        <X className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>

                            {po.rejectionReason && (
                              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                                <Label className="text-red-800 font-semibold">Rejection Reason</Label>
                                <p className="mt-1 text-red-700">{po.rejectionReason}</p>
                              </div>
                            )}
                          </div>
                        </DialogContent>
                      </Dialog>
                      
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      
                      {/* Approval buttons based on status */}
                      {po.stateHeadApproval === "Pending" && (
                        <>
                          <Button size="sm" className="bg-green-600 hover:bg-green-700">
                            <Check className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <X className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                      
                      {po.adminApproval === "Pending" && po.stateHeadApproval === "Approved" && (
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

export default PurchaseOrderManagement;