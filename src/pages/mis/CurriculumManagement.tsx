import { useState } from "react";
import { Upload, Plus, Search, Calendar, Book, Users, CheckCircle, Clock, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const CurriculumManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const curriculumData = [
    {
      id: 1,
      title: "Retail Sales Foundation",
      jobRole: "Sales Associate",
      duration: "40 Hours",
      modules: 8,
      uploadDate: "2025-01-15",
      status: "Active",
      assignedCenters: 12,
      completedCenters: 8,
      trainersAssigned: 25,
      studentsEnrolled: 450,
      avgProgress: 75
    },
    {
      id: 2,
      title: "Customer Service Excellence",
      jobRole: "Customer Service Representative",
      duration: "35 Hours",
      modules: 6,
      uploadDate: "2025-01-12",
      status: "Active",
      assignedCenters: 8,
      completedCenters: 5,
      trainersAssigned: 18,
      studentsEnrolled: 320,
      avgProgress: 60
    },
    {
      id: 3,
      title: "Digital Marketing Basics",
      jobRole: "Digital Marketing Assistant",
      duration: "50 Hours",
      modules: 10,
      uploadDate: "2025-01-10",
      status: "Draft",
      assignedCenters: 0,
      completedCenters: 0,
      trainersAssigned: 0,
      studentsEnrolled: 0,
      avgProgress: 0
    }
  ];

  const modules = [
    { id: 1, name: "Introduction to Retail", duration: "5 Hours", order: 1 },
    { id: 2, name: "Product Knowledge", duration: "8 Hours", order: 2 },
    { id: 3, name: "Customer Interaction", duration: "6 Hours", order: 3 },
    { id: 4, name: "Sales Techniques", duration: "8 Hours", order: 4 },
    { id: 5, name: "POS Systems", duration: "4 Hours", order: 5 },
    { id: 6, name: "Inventory Management", duration: "5 Hours", order: 6 },
    { id: 7, name: "Communication Skills", duration: "6 Hours", order: 7 },
    { id: 8, name: "Assessment & Certification", duration: "3 Hours", order: 8 }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active": return "bg-green-100 text-green-800";
      case "Draft": return "bg-yellow-100 text-yellow-800";
      case "Archived": return "bg-gray-100 text-gray-800";
      default: return "bg-blue-100 text-blue-800";
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Curriculum Management</h1>
          <p className="text-muted-foreground">Upload and manage training curricula for different job roles</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Upload New Curriculum
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Upload New Curriculum</DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Curriculum Title</Label>
                  <Input id="title" placeholder="Enter curriculum title" />
                </div>
                <div>
                  <Label htmlFor="jobRole">Job Role</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select job role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sales">Sales Associate</SelectItem>
                      <SelectItem value="customer-service">Customer Service Representative</SelectItem>
                      <SelectItem value="digital-marketing">Digital Marketing Assistant</SelectItem>
                      <SelectItem value="data-entry">Data Entry Operator</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="duration">Total Duration (Hours)</Label>
                  <Input id="duration" type="number" placeholder="40" />
                </div>
                <div>
                  <Label htmlFor="level">Skill Level</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">Beginner</SelectItem>
                      <SelectItem value="intermediate">Intermediate</SelectItem>
                      <SelectItem value="advanced">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea 
                  id="description" 
                  placeholder="Provide a detailed description of the curriculum..."
                  rows={3}
                />
              </div>

              {/* Module Upload */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Curriculum Modules</h3>
                
                {modules.map((module, index) => (
                  <Card key={module.id}>
                    <CardContent className="pt-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <Label>Module {module.order}: {module.name}</Label>
                          <Input placeholder="Duration (hours)" defaultValue={module.duration} />
                        </div>
                        <div>
                          <Label>Learning Materials</Label>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                              <Upload className="h-4 w-4 mr-2" />
                              Upload PDF
                            </Button>
                            <Button variant="outline" size="sm">
                              <Upload className="h-4 w-4 mr-2" />
                              Upload Video
                            </Button>
                          </div>
                        </div>
                        <div>
                          <Label>Assessment</Label>
                          <Button variant="outline" size="sm" className="w-full">
                            <Upload className="h-4 w-4 mr-2" />
                            Upload Quiz/Test
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline">Save as Draft</Button>
                <Button>Upload & Activate</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Curricula</CardTitle>
            <Book className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">+2 from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Programs</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">Currently running</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,250</div>
            <p className="text-xs text-muted-foreground">Across all programs</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Completion</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">78%</div>
            <p className="text-xs text-muted-foreground">Overall progress</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search curricula..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select>
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
            <SelectItem value="archived">Archived</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Curriculum Table */}
      <Card>
        <CardHeader>
          <CardTitle>Curriculum Library</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Curriculum Details</TableHead>
                <TableHead>Duration & Modules</TableHead>
                <TableHead>Assignment Status</TableHead>
                <TableHead>Progress Overview</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {curriculumData.map((curriculum) => (
                <TableRow key={curriculum.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{curriculum.title}</div>
                      <div className="text-sm text-muted-foreground">{curriculum.jobRole}</div>
                      <div className="text-xs text-muted-foreground">Uploaded: {curriculum.uploadDate}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{curriculum.duration}</div>
                      <div className="text-sm text-muted-foreground">{curriculum.modules} modules</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="text-sm">Centers: {curriculum.assignedCenters}</div>
                      <div className="text-sm">Trainers: {curriculum.trainersAssigned}</div>
                      <div className="text-sm">Students: {curriculum.studentsEnrolled}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span>{curriculum.avgProgress}%</span>
                      </div>
                      <Progress value={curriculum.avgProgress} className="h-2" />
                      <div className="text-xs text-muted-foreground">
                        {curriculum.completedCenters}/{curriculum.assignedCenters} centers completed
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(curriculum.status)}>
                      {curriculum.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">Edit</Button>
                      <Button size="sm" variant="outline">Assign</Button>
                      <Button size="sm" variant="outline">View</Button>
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

export default CurriculumManagement;