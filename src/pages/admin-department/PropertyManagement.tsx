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
  Trash2,
  Upload, 
  Download,
  FileText,
  Building,
  MapPin,
  Home,
  Calendar
} from "lucide-react";

export default function PropertyManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedProperty, setSelectedProperty] = useState<any>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [propertyData, setPropertyData] = useState([
    {
      id: 1,
      propertyName: "Training Centre - Delhi North",
      propertyType: "Training Centre",
      location: "Karol Bagh, Delhi",
      area: "5000 sq ft",
      monthlyRent: "₹2,50,000",
      securityDeposit: "₹5,00,000",
      ownerName: "Rajesh Properties Ltd",
      ownerContact: "+91 9876543210",
      status: "Active",
      contractStart: "2024-01-01",
      contractEnd: "2026-12-31",
      amenities: ["Parking", "Security", "Power Backup", "Cafeteria"]
    },
    {
      id: 2,
      propertyName: "Hostel - Mumbai Central",
      propertyType: "Accommodation",
      location: "Andheri West, Mumbai",
      area: "3000 sq ft",
      monthlyRent: "₹1,80,000",
      securityDeposit: "₹3,60,000",
      ownerName: "Mumbai Homes Pvt Ltd",
      ownerContact: "+91 9876543211",
      status: "Active",
      contractStart: "2024-03-15",
      contractEnd: "2026-03-14",
      amenities: ["Wi-Fi", "Laundry", "Common Kitchen", "Study Room"]
    },
    {
      id: 3,
      propertyName: "Office Space - Bangalore Tech Park",
      propertyType: "Office",
      location: "Electronic City, Bangalore",
      area: "2500 sq ft",
      monthlyRent: "₹1,25,000",
      securityDeposit: "₹2,50,000",
      ownerName: "Tech Park Realty",
      ownerContact: "+91 9876543212",
      status: "Under Renovation",
      contractStart: "2024-06-01",
      contractEnd: "2026-05-31",
      amenities: ["IT Infrastructure", "Conference Room", "Parking"]
    }
  ]);
  const { toast } = useToast();


  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active": return "bg-green-100 text-green-800";
      case "Under Renovation": return "bg-yellow-100 text-yellow-800";
      case "Vacant": return "bg-gray-100 text-gray-800";
      case "Expired": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Training Centre": return "bg-blue-100 text-blue-800";
      case "Accommodation": return "bg-purple-100 text-purple-800";
      case "Office": return "bg-orange-100 text-orange-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const filteredPropertyData = propertyData.filter(property => {
    const matchesSearch = property.propertyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         property.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === "all" || property.propertyType === typeFilter;
    const matchesStatus = statusFilter === "all" || property.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  const handleAddProperty = () => {
    toast({
      title: "Property Added",
      description: "New property has been added successfully.",
    });
    setShowAddForm(false);
  };

  const handleDeleteProperty = (propertyId: number) => {
    setPropertyData(prev => prev.filter(property => property.id !== propertyId));
    toast({
      title: "Property Deleted",
      description: "Property has been removed successfully.",
      variant: "destructive",
    });
  };

  return (
    <div className="min-h-screen bg-background p-4 lg:p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold">Property Management</h1>
          <p className="text-muted-foreground mt-1">Manage training centres, accommodation, and office properties</p>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-2">
          <Button variant="outline" size="sm" className="w-full sm:w-auto">
            <Download className="h-4 w-4 mr-2" />
            Export Properties
          </Button>
          <Dialog open={showAddForm} onOpenChange={setShowAddForm}>
            <DialogTrigger asChild>
              <Button size="sm" className="w-full sm:w-auto">
                <Plus className="h-4 w-4 mr-2" />
                Add Property
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add New Property</DialogTitle>
              </DialogHeader>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Property Name</Label>
                    <Input placeholder="Enter property name" />
                  </div>
                  <div>
                    <Label>Property Type</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select property type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="training-centre">Training Centre</SelectItem>
                        <SelectItem value="accommodation">Accommodation</SelectItem>
                        <SelectItem value="office">Office</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Location</Label>
                    <Input placeholder="Enter full address" />
                  </div>
                  <div>
                    <Label>Area (sq ft)</Label>
                    <Input placeholder="Enter area in sq ft" type="number" />
                  </div>
                  <div>
                    <Label>Monthly Rent</Label>
                    <Input placeholder="Enter monthly rent" />
                  </div>
                  <div>
                    <Label>Security Deposit</Label>
                    <Input placeholder="Enter security deposit" />
                  </div>
                </div>
                
                <div>
                  <Label>Amenities</Label>
                  <Textarea placeholder="List available amenities (comma separated)" />
                </div>

                <div className="flex flex-col sm:flex-row justify-end gap-3">
                  <Button variant="outline" onClick={() => setShowAddForm(false)} className="w-full sm:w-auto">
                    Cancel
                  </Button>
                  <Button onClick={handleAddProperty} className="w-full sm:w-auto">
                    Save Property
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
                placeholder="Search properties..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Filter by Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="Training Centre">Training Centre</SelectItem>
                  <SelectItem value="Accommodation">Accommodation</SelectItem>
                  <SelectItem value="Office">Office</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Filter by Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Under Renovation">Under Renovation</SelectItem>
                  <SelectItem value="Vacant">Vacant</SelectItem>
                  <SelectItem value="Expired">Expired</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" className="w-full sm:w-auto">
                <FileText className="h-4 w-4 mr-2" />
                Generate Report
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
                <p className="text-2xl font-bold">12</p>
                <p className="text-sm text-muted-foreground">Total Properties</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <Home className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-2xl font-bold text-green-600">9</p>
                <p className="text-sm text-muted-foreground">Active Properties</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <MapPin className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-2xl font-bold text-blue-600">8</p>
                <p className="text-sm text-muted-foreground">Cities Covered</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <FileText className="h-8 w-8 text-orange-600" />
              <div>
                <p className="text-2xl font-bold text-orange-600">₹25L</p>
                <p className="text-sm text-muted-foreground">Monthly Rent</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Desktop Table View */}
      <div className="hidden lg:block">
        <Card>
          <CardHeader>
            <CardTitle>Property Directory</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Property Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Area</TableHead>
                  <TableHead>Monthly Rent</TableHead>
                  <TableHead>Owner</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPropertyData.map((property) => (
                  <TableRow key={property.id}>
                    <TableCell className="font-medium">{property.propertyName}</TableCell>
                    <TableCell>
                      <Badge className={getTypeColor(property.propertyType)}>
                        {property.propertyType}
                      </Badge>
                    </TableCell>
                    <TableCell className="max-w-[200px] truncate">{property.location}</TableCell>
                    <TableCell>{property.area}</TableCell>
                    <TableCell className="font-semibold">{property.monthlyRent}</TableCell>
                    <TableCell>{property.ownerName}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(property.status)}>
                        {property.status}
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
                        <Button variant="outline" size="sm" onClick={() => handleDeleteProperty(property.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
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
        {filteredPropertyData.map((property) => (
          <Card key={property.id} className="border-l-4 border-l-primary">
            <CardContent className="p-4">
              <div className="flex flex-col space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-foreground">{property.propertyName}</h3>
                    <p className="text-sm text-muted-foreground">{property.location}</p>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Badge className={getTypeColor(property.propertyType)}>
                      {property.propertyType}
                    </Badge>
                    <Badge className={getStatusColor(property.status)}>
                      {property.status}
                    </Badge>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Area</p>
                    <p className="font-medium">{property.area}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Monthly Rent</p>
                    <p className="font-semibold text-foreground">{property.monthlyRent}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Owner</p>
                    <p className="font-medium">{property.ownerName}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Contact</p>
                    <p className="font-medium">{property.ownerContact}</p>
                  </div>
                </div>

                <div className="flex flex-col gap-2 pt-2 border-t border-border">
                  <p className="text-sm text-muted-foreground">Contract Period</p>
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>{property.contractStart} to {property.contractEnd}</span>
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
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handleDeleteProperty(property.id)}
                    className="flex-1 text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}