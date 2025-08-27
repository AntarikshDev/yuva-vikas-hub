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
  Upload, 
  Download,
  FileText,
  ChefHat,
  Clock,
  Star,
  MapPin
} from "lucide-react";

const FoodVendorManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [selectedVendor, setSelectedVendor] = useState<any>(null);
  const [showAddForm, setShowAddForm] = useState(false);

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
    },
    {
      id: 4,
      vendorName: "Traditional Sweets & Snacks",
      category: "Snacks & Sweets",
      location: "Jaipur",
      contactPerson: "Neha Patel",
      phone: "+91 9876543213",
      email: "neha@traditionalsweets.com",
      rating: 4.3,
      specialties: ["Rajasthani Sweets", "Namkeen", "Festival Special"],
      capacity: "100 people",
      priceRange: "₹40-80 per plate",
      status: "Suspended",
      contractStart: "2024-04-20",
      contractEnd: "2025-04-19",
      lastOrderDate: "2025-06-30",
      totalOrders: 15,
      monthlyAmount: "₹80,000",
      fssaiLicense: "FSSAI55667788",
      gstNumber: "08TUVWX3456Y7Z8"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active": return "bg-green-100 text-green-800";
      case "Pending Approval": return "bg-yellow-100 text-yellow-800";
      case "Suspended": return "bg-red-100 text-red-800";
      case "Contract Expired": return "bg-gray-100 text-gray-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Catering": return "bg-blue-100 text-blue-800";
      case "Meal Service": return "bg-green-100 text-green-800";
      case "Restaurant": return "bg-purple-100 text-purple-800";
      case "Snacks & Sweets": return "bg-orange-100 text-orange-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getRatingStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`h-4 w-4 ${
          index < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  const filteredVendorData = foodVendorData.filter(vendor => {
    const matchesSearch = vendor.vendorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vendor.contactPerson.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !categoryFilter || vendor.category === categoryFilter;
    const matchesStatus = !statusFilter || vendor.status === statusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-background p-4 lg:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground">Food Vendor Management</h1>
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
                  <div>
                    <Label>Email Address</Label>
                    <Input placeholder="Business email" type="email" />
                  </div>
                  <div>
                    <Label>Location</Label>
                    <Input placeholder="City/Area" />
                  </div>
                  <div>
                    <Label>FSSAI License</Label>
                    <Input placeholder="FSSAI registration number" />
                  </div>
                  <div>
                    <Label>GST Number</Label>
                    <Input placeholder="GST registration number" />
                  </div>
                  <div>
                    <Label>Capacity</Label>
                    <Input placeholder="e.g., 500 people per day" />
                  </div>
                  <div>
                    <Label>Price Range</Label>
                    <Input placeholder="e.g., ₹80-120 per plate" />
                  </div>
                </div>
                
                <div>
                  <Label>Specialties</Label>
                  <Textarea placeholder="List food specialties (comma separated)" />
                </div>

                <div>
                  <Label>Upload Documents</Label>
                  <div className="mt-2 border-2 border-dashed border-border rounded-lg p-6 text-center">
                    <Upload className="mx-auto h-12 w-12 text-muted-foreground" />
                    <div className="mt-4">
                      <Button variant="outline">
                        Choose Files
                      </Button>
                      <p className="mt-2 text-sm text-muted-foreground">
                        Upload FSSAI license, GST certificate, menu card, photos (PDF, JPG, PNG - Max 10MB each)
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row justify-end gap-3">
                  <Button variant="outline" onClick={() => setShowAddForm(false)} className="w-full sm:w-auto">
                    Cancel
                  </Button>
                  <Button className="w-full sm:w-auto">
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search food vendors..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Categories</SelectItem>
                <SelectItem value="Catering">Catering</SelectItem>
                <SelectItem value="Meal Service">Meal Service</SelectItem>
                <SelectItem value="Restaurant">Restaurant</SelectItem>
                <SelectItem value="Snacks & Sweets">Snacks & Sweets</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Status</SelectItem>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Pending Approval">Pending Approval</SelectItem>
                <SelectItem value="Suspended">Suspended</SelectItem>
                <SelectItem value="Contract Expired">Contract Expired</SelectItem>
              </SelectContent>
            </Select>
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
              <ChefHat className="h-8 w-8 text-primary" />
              <div>
                <p className="text-2xl font-bold text-foreground">25</p>
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

      {/* Food Vendors Table */}
      <Card>
        <CardHeader>
          <CardTitle>Food Vendor Directory</CardTitle>
        </CardHeader>
        <CardContent className="overflow-x-auto">
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
                        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle>Food Vendor Details - {vendor.vendorName}</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <Label>Vendor Name</Label>
                                <p className="font-medium">{vendor.vendorName}</p>
                              </div>
                              <div>
                                <Label>Category</Label>
                                <Badge className={getCategoryColor(vendor.category)}>
                                  {vendor.category}
                                </Badge>
                              </div>
                              <div>
                                <Label>Contact Person</Label>
                                <p className="font-medium">{vendor.contactPerson}</p>
                              </div>
                              <div>
                                <Label>Phone & Email</Label>
                                <div className="space-y-1">
                                  <p className="font-medium">{vendor.phone}</p>
                                  <p className="text-sm text-muted-foreground">{vendor.email}</p>
                                </div>
                              </div>
                              <div>
                                <Label>Location</Label>
                                <p className="font-medium">{vendor.location}</p>
                              </div>
                              <div>
                                <Label>Rating</Label>
                                <div className="flex items-center space-x-1">
                                  {getRatingStars(Math.floor(vendor.rating))}
                                  <span className="font-medium ml-2">{vendor.rating}/5</span>
                                </div>
                              </div>
                              <div>
                                <Label>Capacity</Label>
                                <p className="font-medium">{vendor.capacity}</p>
                              </div>
                              <div>
                                <Label>Price Range</Label>
                                <p className="font-medium">{vendor.priceRange}</p>
                              </div>
                              <div>
                                <Label>FSSAI License</Label>
                                <p className="font-medium">{vendor.fssaiLicense}</p>
                              </div>
                              <div>
                                <Label>GST Number</Label>
                                <p className="font-medium">{vendor.gstNumber}</p>
                              </div>
                              <div>
                                <Label>Total Orders</Label>
                                <p className="font-medium">{vendor.totalOrders} orders</p>
                              </div>
                              <div>
                                <Label>Monthly Amount</Label>
                                <p className="font-medium text-lg">{vendor.monthlyAmount}</p>
                              </div>
                            </div>
                            
                            <div>
                              <Label>Food Specialties</Label>
                              <div className="flex flex-wrap gap-2 mt-2">
                                {vendor.specialties.map((specialty, index) => (
                                  <Badge key={index} variant="outline">
                                    {specialty}
                                  </Badge>
                                ))}
                              </div>
                            </div>

                            <div>
                              <Label>Documents & Certificates</Label>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                                <Button variant="outline" size="sm">
                                  <FileText className="h-4 w-4 mr-2" />
                                  FSSAI License
                                </Button>
                                <Button variant="outline" size="sm">
                                  <FileText className="h-4 w-4 mr-2" />
                                  GST Certificate
                                </Button>
                                <Button variant="outline" size="sm">
                                  <FileText className="h-4 w-4 mr-2" />
                                  Menu Card
                                </Button>
                                <Button variant="outline" size="sm">
                                  <FileText className="h-4 w-4 mr-2" />
                                  Kitchen Photos
                                </Button>
                              </div>
                            </div>

                            {vendor.status === "Pending Approval" && (
                              <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t">
                                <Button variant="outline">
                                  <X className="h-4 w-4 mr-2" />
                                  Reject
                                </Button>
                                <Button className="bg-green-600 hover:bg-green-700">
                                  <Check className="h-4 w-4 mr-2" />
                                  Approve Vendor
                                </Button>
                              </div>
                            )}
                          </div>
                        </DialogContent>
                      </Dialog>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      {vendor.status === "Pending Approval" && (
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

export default FoodVendorManagement;