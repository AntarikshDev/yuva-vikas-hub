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
  FileText,
  ChefHat,
  Clock,
  Star,
  MapPin,
  Phone,
  Mail
} from "lucide-react";

export default function FoodVendorManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [selectedVendor, setSelectedVendor] = useState<any>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const { toast } = useToast();

  // Mock data for food vendors
  const foodVendorData = [
    {
      id: 1,
      vendorName: "Annapoorna Catering Services",
      category: "Catering",
      location: "Delhi",
      contactPerson: "Ravi Kumar",
      phone: "+91 9876543210",
      email: "ravi@annapoorna.com",
      rating: 4.5,
      specialties: ["North Indian", "South Indian", "Continental"],
      capacity: "500 people",
      priceRange: "₹80-120 per plate",
      status: "Active",
      contractStart: "2024-01-15",
      contractEnd: "2024-12-31",
      lastOrderDate: "2025-07-20",
      totalOrders: 45,
      monthlyAmount: "₹2,50,000",
      fssaiLicense: "FSSAI12345678",
      gstNumber: "27ABCDE1234F1Z5"
    },
    {
      id: 2,
      vendorName: "Fresh & Healthy Meals",
      category: "Meal Service",
      location: "Mumbai",
      contactPerson: "Priya Sharma",
      phone: "+91 9876543211",
      email: "priya@freshhealthy.com",
      rating: 4.2,
      specialties: ["Healthy Meals", "Diet Food", "Juice Bar"],
      capacity: "300 people",
      priceRange: "₹60-100 per plate",
      status: "Active",
      contractStart: "2024-03-01",
      contractEnd: "2025-02-28",
      lastOrderDate: "2025-07-18",
      totalOrders: 32,
      monthlyAmount: "₹1,80,000",
      fssaiLicense: "FSSAI87654321",
      gstNumber: "27FGHIJ5678K2L6"
    },
    {
      id: 3,
      vendorName: "Spice Garden Restaurant",
      category: "Restaurant",
      location: "Bangalore",
      contactPerson: "Amit Singh",
      phone: "+91 9876543212",
      email: "amit@spicegarden.com",
      rating: 4.7,
      specialties: ["Punjabi", "Chinese", "Italian"],
      capacity: "200 people",
      priceRange: "₹100-150 per plate",
      status: "Pending Approval",
      contractStart: "2024-06-01",
      contractEnd: "2025-05-31",
      lastOrderDate: "2025-07-15",
      totalOrders: 28,
      monthlyAmount: "₹1,40,000",
      fssaiLicense: "FSSAI11223344",
      gstNumber: "29MNOPQ9012R3S7"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active": return "bg-success/10 text-success border-success/20";
      case "Pending Approval": return "bg-warning/10 text-warning border-warning/20";
      case "Suspended": return "bg-destructive/10 text-destructive border-destructive/20";
      case "Contract Expired": return "bg-muted text-muted-foreground border-border";
      default: return "bg-muted text-muted-foreground border-border";
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Catering": return "bg-primary/10 text-primary border-primary/20";
      case "Meal Service": return "bg-success/10 text-success border-success/20";
      case "Restaurant": return "bg-secondary/10 text-secondary-foreground border-secondary/20";
      case "Snacks & Sweets": return "bg-accent/10 text-accent-foreground border-accent/20";
      default: return "bg-muted text-muted-foreground border-border";
    }
  };

  const getRatingStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`h-4 w-4 ${
          index < rating ? 'text-warning fill-current' : 'text-muted-foreground/40'
        }`}
      />
    ));
  };

  const filteredVendorData = foodVendorData.filter(vendor => {
    const matchesSearch = vendor.vendorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vendor.contactPerson.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !categoryFilter || categoryFilter === "all" || vendor.category === categoryFilter;
    const matchesStatus = !statusFilter || statusFilter === "all" || vendor.status === statusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleAddVendor = () => {
    toast({
      title: "Food Vendor Added",
      description: "New food vendor has been added successfully and sent for approval.",
    });
    setShowAddForm(false);
  };

  const handleApproveVendor = (vendorId: number) => {
    toast({
      title: "Vendor Approved",
      description: "Food vendor has been approved successfully.",
    });
  };

  const handleRejectVendor = (vendorId: number) => {
    toast({
      title: "Vendor Rejected",
      description: "Food vendor has been rejected.",
      variant: "destructive",
    });
  };

  return (
    <div className="min-h-screen bg-background p-4 lg:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold">Food Vendor Management</h1>
          <p className="text-muted-foreground mt-1">Manage food vendors, catering services, and meal providers</p>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-2">
          <Button variant="outline" size="sm" className="w-full sm:w-auto">
            <Download className="h-4 w-4 mr-2" />
            Export Vendors
          </Button>
          <Dialog open={showAddForm} onOpenChange={setShowAddForm}>
            <DialogTrigger asChild>
              <Button size="sm" className="w-full sm:w-auto">
                <Plus className="h-4 w-4 mr-2" />
                Add Food Vendor
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add New Food Vendor</DialogTitle>
              </DialogHeader>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Vendor Name</Label>
                    <Input placeholder="Enter vendor business name" />
                  </div>
                  <div>
                    <Label>Category</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="catering">Catering</SelectItem>
                        <SelectItem value="meal-service">Meal Service</SelectItem>
                        <SelectItem value="restaurant">Restaurant</SelectItem>
                        <SelectItem value="snacks-sweets">Snacks & Sweets</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Contact Person</Label>
                    <Input placeholder="Primary contact person" />
                  </div>
                  <div>
                    <Label>Phone Number</Label>
                    <Input placeholder="Contact phone number" />
                  </div>
                </div>
                
                <div>
                  <Label>Specialties</Label>
                  <Textarea placeholder="List food specialties (comma separated)" />
                </div>

                <div className="flex flex-col sm:flex-row justify-end gap-3">
                  <Button variant="outline" onClick={() => setShowAddForm(false)} className="w-full sm:w-auto">
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
                placeholder="Search food vendors..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Filter by Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="Catering">Catering</SelectItem>
                  <SelectItem value="Meal Service">Meal Service</SelectItem>
                  <SelectItem value="Restaurant">Restaurant</SelectItem>
                  <SelectItem value="Snacks & Sweets">Snacks & Sweets</SelectItem>
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
                  <SelectItem value="Contract Expired">Contract Expired</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <ChefHat className="h-8 w-8 text-primary" />
              <div>
                <p className="text-2xl font-bold">25</p>
                <p className="text-sm text-muted-foreground">Total Food Vendors</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <Check className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-2xl font-bold text-green-600">18</p>
                <p className="text-sm text-muted-foreground">Active Vendors</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <Clock className="h-8 w-8 text-yellow-600" />
              <div>
                <p className="text-2xl font-bold text-yellow-600">5</p>
                <p className="text-sm text-muted-foreground">Pending Approvals</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <Star className="h-8 w-8 text-orange-600" />
              <div>
                <p className="text-2xl font-bold text-orange-600">4.3</p>
                <p className="text-sm text-muted-foreground">Average Rating</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Desktop Table View */}
      <div className="hidden lg:block">
        <Card>
          <CardHeader>
            <CardTitle>Food Vendor Directory</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Vendor Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Monthly Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredVendorData.map((vendor) => (
                  <TableRow key={vendor.id}>
                    <TableCell className="font-medium">{vendor.vendorName}</TableCell>
                    <TableCell>
                      <Badge className={getCategoryColor(vendor.category)}>
                        {vendor.category}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-1 text-muted-foreground" />
                        {vendor.location}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <p className="text-sm font-medium">{vendor.contactPerson}</p>
                        <p className="text-xs text-muted-foreground">{vendor.phone}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        {getRatingStars(Math.floor(vendor.rating))}
                        <span className="text-sm font-medium ml-1">{vendor.rating}</span>
                      </div>
                    </TableCell>
                    <TableCell className="font-semibold">{vendor.monthlyAmount}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(vendor.status)}>
                        {vendor.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        {vendor.status === "Pending Approval" && (
                          <>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="text-green-600"
                              onClick={() => handleApproveVendor(vendor.id)}
                            >
                              <Check className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="text-red-600"
                              onClick={() => handleRejectVendor(vendor.id)}
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

      {/* Mobile Card View */}
      <div className="lg:hidden space-y-4">
        {filteredVendorData.map((vendor) => (
          <Card key={vendor.id} className="border-l-4 border-l-primary">
            <CardContent className="p-4">
              <div className="flex flex-col space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-foreground">{vendor.vendorName}</h3>
                    <div className="flex items-center mt-1">
                      <MapPin className="h-3 w-3 mr-1 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">{vendor.location}</p>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Badge className={getCategoryColor(vendor.category)}>
                      {vendor.category}
                    </Badge>
                    <Badge className={getStatusColor(vendor.status)}>
                      {vendor.status}
                    </Badge>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Contact Person</p>
                    <p className="font-medium">{vendor.contactPerson}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Phone</p>
                    <p className="font-medium">{vendor.phone}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Rating</p>
                    <div className="flex items-center space-x-1">
                      {getRatingStars(Math.floor(vendor.rating))}
                      <span className="font-medium ml-1">{vendor.rating}</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Monthly Amount</p>
                    <p className="font-semibold text-foreground">{vendor.monthlyAmount}</p>
                  </div>
                </div>

                <div className="flex flex-col gap-2 pt-2 border-t border-border">
                  <p className="text-sm text-muted-foreground">Specialties</p>
                  <div className="flex flex-wrap gap-1">
                    {vendor.specialties.slice(0, 3).map((specialty, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {specialty}
                      </Badge>
                    ))}
                    {vendor.specialties.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{vendor.specialties.length - 3} more
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Eye className="h-4 w-4 mr-2" />
                    View Details
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                  {vendor.status === "Pending Approval" && (
                    <>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1 text-green-600"
                        onClick={() => handleApproveVendor(vendor.id)}
                      >
                        <Check className="h-4 w-4 mr-2" />
                        Approve
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="flex-1 text-red-600"
                        onClick={() => handleRejectVendor(vendor.id)}
                      >
                        <X className="h-4 w-4 mr-2" />
                        Reject
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}