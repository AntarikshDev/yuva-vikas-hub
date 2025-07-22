import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Home, UtensilsCrossed, ShoppingCart, Camera, CheckCircle, Clock, AlertTriangle } from "lucide-react";

const WelfareFacilitation = () => {
  const [statusFilter, setStatusFilter] = useState("");
  const [stateFilter, setStateFilter] = useState("");
  const [batchFilter, setBatchFilter] = useState("");

  const welfareData = [
    {
      id: 1,
      batch: "Batch X",
      hostelName: "Bangalore Hostel A",
      bedsAllotted: true,
      utensilsDelivered: true,
      groceriesDelivered: false,
      groceryDate: null,
      comments: "Beds and utensils arranged. Grocery delivery pending due to vendor delay.",
      lastUpdated: "2025-07-21",
      candidateCount: 15,
      state: "Karnataka"
    },
    {
      id: 2,
      batch: "Batch Y",
      hostelName: "Delhi Hostel B",
      bedsAllotted: true,
      utensilsDelivered: true,
      groceriesDelivered: true,
      groceryDate: "2025-07-20",
      comments: "All facilitation completed successfully. Candidates settling in well.",
      lastUpdated: "2025-07-20",
      candidateCount: 20,
      state: "Delhi"
    },
    {
      id: 3,
      batch: "Batch Z",
      hostelName: "Chennai Hostel C",
      bedsAllotted: false,
      utensilsDelivered: false,
      groceriesDelivered: false,
      groceryDate: null,
      comments: "Candidates arriving tomorrow. Preparing all facilities.",
      lastUpdated: "2025-07-21",
      candidateCount: 12,
      state: "Tamil Nadu"
    }
  ];

  const getStatusColor = (completed: boolean) => {
    return completed ? "default" : "secondary";
  };

  const getCompletionPercentage = (welfare: any) => {
    const total = 3;
    const completed = [welfare.bedsAllotted, welfare.utensilsDelivered, welfare.groceriesDelivered].filter(Boolean).length;
    return Math.round((completed / total) * 100);
  };

  const filteredWelfare = welfareData.filter(welfare => {
    const matchesStatus = !statusFilter || 
      (statusFilter === "completed" && getCompletionPercentage(welfare) === 100) ||
      (statusFilter === "pending" && getCompletionPercentage(welfare) < 100);
    const matchesState = !stateFilter || welfare.state === stateFilter;
    const matchesBatch = !batchFilter || welfare.batch === batchFilter;
    return matchesStatus && matchesState && matchesBatch;
  });

  const totalBatches = welfareData.length;
  const completedBatches = welfareData.filter(w => getCompletionPercentage(w) === 100).length;
  const pendingBatches = totalBatches - completedBatches;

  return (
    <div className="p-4 md:p-6 space-y-6 bg-gradient-to-br from-slate-50 to-purple-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Welfare Facilitation</h1>
          <p className="text-gray-600">Monitor hostel settling-in and welfare activities</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600 mb-1">Completed</p>
                <p className="text-2xl font-bold text-green-900">{completedBatches}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-yellow-600 mb-1">Pending</p>
                <p className="text-2xl font-bold text-yellow-900">{pendingBatches}</p>
              </div>
              <Clock className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600 mb-1">Total Batches</p>
                <p className="text-2xl font-bold text-blue-900">{totalBatches}</p>
              </div>
              <Home className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>

            <Select value={stateFilter} onValueChange={setStateFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by State" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All States</SelectItem>
                <SelectItem value="Karnataka">Karnataka</SelectItem>
                <SelectItem value="Delhi">Delhi</SelectItem>
                <SelectItem value="Tamil Nadu">Tamil Nadu</SelectItem>
              </SelectContent>
            </Select>

            <Select value={batchFilter} onValueChange={setBatchFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by Batch" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Batches</SelectItem>
                <SelectItem value="Batch X">Batch X</SelectItem>
                <SelectItem value="Batch Y">Batch Y</SelectItem>
                <SelectItem value="Batch Z">Batch Z</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline" onClick={() => {
              setStatusFilter("");
              setStateFilter("");
              setBatchFilter("");
            }}>
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Welfare Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Home className="w-5 h-5" />
            Hostel & Settling-in Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Batch</TableHead>
                  <TableHead>Hostel Name</TableHead>
                  <TableHead>Candidates</TableHead>
                  <TableHead>Beds</TableHead>
                  <TableHead>Utensils</TableHead>
                  <TableHead>Groceries</TableHead>
                  <TableHead>Progress</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredWelfare.map((welfare) => {
                  const completionPercentage = getCompletionPercentage(welfare);
                  return (
                    <TableRow key={welfare.id}>
                      <TableCell className="font-semibold">{welfare.batch}</TableCell>
                      <TableCell>{welfare.hostelName}</TableCell>
                      <TableCell>{welfare.candidateCount}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Home className={`w-4 h-4 ${welfare.bedsAllotted ? 'text-green-500' : 'text-gray-400'}`} />
                          <Badge variant={getStatusColor(welfare.bedsAllotted)}>
                            {welfare.bedsAllotted ? 'Done' : 'Pending'}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <UtensilsCrossed className={`w-4 h-4 ${welfare.utensilsDelivered ? 'text-green-500' : 'text-gray-400'}`} />
                          <Badge variant={getStatusColor(welfare.utensilsDelivered)}>
                            {welfare.utensilsDelivered ? 'Done' : 'Pending'}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <ShoppingCart className={`w-4 h-4 ${welfare.groceriesDelivered ? 'text-green-500' : 'text-gray-400'}`} />
                          <Badge variant={getStatusColor(welfare.groceriesDelivered)}>
                            {welfare.groceriesDelivered ? 'Done' : 'Pending'}
                          </Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="w-16 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-purple-600 h-2 rounded-full transition-all duration-300" 
                              style={{ width: `${completionPercentage}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium">{completionPercentage}%</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                              Update
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>Welfare Facilitation Report - {welfare.batch}</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-6">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <Label>Batch</Label>
                                  <p className="text-sm text-gray-600">{welfare.batch}</p>
                                </div>
                                <div>
                                  <Label>Hostel Name</Label>
                                  <p className="text-sm text-gray-600">{welfare.hostelName}</p>
                                </div>
                              </div>

                              <div className="space-y-4">
                                <h4 className="font-semibold">Facilitation Checklist</h4>
                                
                                <div className="flex items-center justify-between p-3 border rounded-lg">
                                  <div className="flex items-center gap-3">
                                    <Home className="w-5 h-5 text-gray-400" />
                                    <div>
                                      <p className="font-medium">Beds Allotted</p>
                                      <p className="text-sm text-gray-500">Room allocation and bed arrangement</p>
                                    </div>
                                  </div>
                                  <Switch defaultChecked={welfare.bedsAllotted} />
                                </div>

                                <div className="flex items-center justify-between p-3 border rounded-lg">
                                  <div className="flex items-center gap-3">
                                    <UtensilsCrossed className="w-5 h-5 text-gray-400" />
                                    <div>
                                      <p className="font-medium">Utensils Delivered</p>
                                      <p className="text-sm text-gray-500">Basic kitchen utensils and plates</p>
                                    </div>
                                  </div>
                                  <Switch defaultChecked={welfare.utensilsDelivered} />
                                </div>

                                <div className="flex items-center justify-between p-3 border rounded-lg">
                                  <div className="flex items-center gap-3">
                                    <ShoppingCart className="w-5 h-5 text-gray-400" />
                                    <div>
                                      <p className="font-medium">Groceries Delivered</p>
                                      <p className="text-sm text-gray-500">Essential grocery items</p>
                                    </div>
                                  </div>
                                  <Switch defaultChecked={welfare.groceriesDelivered} />
                                </div>

                                <div>
                                  <Label>Grocery Delivery Date (if applicable)</Label>
                                  <Input type="date" defaultValue={welfare.groceryDate || ""} />
                                </div>
                              </div>

                              <div>
                                <Label>Comments</Label>
                                <Textarea 
                                  defaultValue={welfare.comments}
                                  placeholder="Add your observations and remarks about the welfare facilitation"
                                  rows={3}
                                />
                              </div>

                              <div>
                                <Label>Upload Photos</Label>
                                <div className="grid grid-cols-3 gap-2 mt-2">
                                  <Button variant="outline" className="h-20 flex-col">
                                    <Camera className="w-6 h-6 mb-1" />
                                    <span className="text-xs">Room Setup</span>
                                  </Button>
                                  <Button variant="outline" className="h-20 flex-col">
                                    <Camera className="w-6 h-6 mb-1" />
                                    <span className="text-xs">Groceries</span>
                                  </Button>
                                  <Button variant="outline" className="h-20 flex-col">
                                    <Camera className="w-6 h-6 mb-1" />
                                    <span className="text-xs">General</span>
                                  </Button>
                                </div>
                              </div>

                              <Button className="w-full bg-purple-600 hover:bg-purple-700">
                                Update Facilitation Report
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Guidelines Card */}
      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <h4 className="font-semibold text-blue-900 mb-2">Welfare Facilitation Guidelines</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Ensure beds are properly allocated and rooms are clean before candidate arrival</li>
                <li>• Verify utensils are complete and in good condition</li>
                <li>• Coordinate grocery delivery timing with hostel management</li>
                <li>• Take photos as evidence of completed facilitation</li>
                <li>• Update status immediately after completion of each task</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WelfareFacilitation;