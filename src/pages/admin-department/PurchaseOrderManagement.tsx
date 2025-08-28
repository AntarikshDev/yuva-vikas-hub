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

export default function PurchaseOrderManagement() {
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
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Purchase Order Management</h1>
          <p className="text-muted-foreground mt-1">2-Step approval process: State Head → Admin</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export POs
          </Button>
          <Dialog open={showCreateForm} onOpenChange={setShowCreateForm}>
            <DialogTrigger asChild>
              <Button size="sm">
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

                <div>
                  <Label>Special Instructions</Label>
                  <Textarea placeholder="Any special delivery or handling instructions..." />
                </div>

                <div className="flex justify-end gap-3">
                  <Button variant="outline" onClick={() => setShowCreateForm(false)}>
                    Cancel
                  </Button>
                  <Button variant="outline">
                    Save as Draft
                  </Button>
                  <Button>
                    Submit for Approval
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <ShoppingCart className="h-8 w-8 text-primary" />
              <div>
                <p className="text-2xl font-bold">24</p>
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
        <CardContent>
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
                        po.adminApproval === "Rejected" ? "bg-red-100 text-red-800" :
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
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                      {po.status === "State Head Approved" && (
                        <>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="text-green-600"
                            onClick={() => handleAdminApproval(po.id, 'approve')}
                          >
                            <Check className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="text-red-600"
                            onClick={() => handleAdminApproval(po.id, 'reject')}
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