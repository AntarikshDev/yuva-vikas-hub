import { useState } from "react";
import { Calendar, Clock, Book, Users, CheckCircle, Download, Play, FileText, Video } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

const CurriculumSchedule = () => {
  const [selectedWeek, setSelectedWeek] = useState("current");
  const [selectedBatch, setSelectedBatch] = useState("all");

  const currentCurriculum = {
    title: "Retail Sales Foundation",
    jobRole: "Sales Associate",
    totalDuration: "40 Hours",
    totalModules: 8,
    completedModules: 5,
    progress: 62.5,
    startDate: "2025-01-15",
    expectedCompletion: "2025-02-28"
  };

  const weeklySchedule = [
    {
      week: "Week 1",
      date: "Jan 15-19, 2025",
      modules: [
        {
          id: 1,
          name: "Introduction to Retail",
          duration: "5 Hours",
          status: "completed",
          scheduledTime: "Mon 9:00 AM - 2:00 PM",
          materials: ["PDF Guide", "Video Tutorial"],
          assessment: "Quiz",
          batch: "RSD2025-01"
        },
        {
          id: 2,
          name: "Product Knowledge",
          duration: "8 Hours",
          status: "completed",
          scheduledTime: "Tue-Wed 9:00 AM - 1:00 PM",
          materials: ["Product Catalog", "Training Manual"],
          assessment: "Practical Test",
          batch: "RSD2025-01"
        }
      ]
    },
    {
      week: "Week 2",
      date: "Jan 22-26, 2025",
      modules: [
        {
          id: 3,
          name: "Customer Interaction",
          duration: "6 Hours",
          status: "completed",
          scheduledTime: "Mon 9:00 AM - 3:00 PM",
          materials: ["Communication Guide", "Role Play Videos"],
          assessment: "Role Play Assessment",
          batch: "RSD2025-01"
        },
        {
          id: 4,
          name: "Sales Techniques",
          duration: "8 Hours",
          status: "in-progress",
          scheduledTime: "Tue-Wed 9:00 AM - 1:00 PM",
          materials: ["Sales Manual", "Case Studies"],
          assessment: "Sales Simulation",
          batch: "RSD2025-01"
        }
      ]
    },
    {
      week: "Week 3",
      date: "Jan 29 - Feb 2, 2025",
      modules: [
        {
          id: 5,
          name: "POS Systems",
          duration: "4 Hours",
          status: "scheduled",
          scheduledTime: "Mon 9:00 AM - 1:00 PM",
          materials: ["System Manual", "Practice Software"],
          assessment: "Hands-on Test",
          batch: "RSD2025-01"
        },
        {
          id: 6,
          name: "Inventory Management",
          duration: "5 Hours",
          status: "scheduled",
          scheduledTime: "Tue 9:00 AM - 2:00 PM",
          materials: ["Inventory Guide", "Software Training"],
          assessment: "Project Work",
          batch: "RSD2025-01"
        }
      ]
    }
  ];

  const batches = [
    { id: "RSD2025-01", name: "RSD2025-01", students: 28, progress: 62.5 },
    { id: "RSD2025-02", name: "RSD2025-02", students: 25, progress: 45.0 },
    { id: "CSR2025-01", name: "CSR2025-01", students: 22, progress: 38.2 }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-green-100 text-green-800";
      case "in-progress": return "bg-blue-100 text-blue-800";
      case "scheduled": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed": return <CheckCircle className="h-4 w-4" />;
      case "in-progress": return <Play className="h-4 w-4" />;
      case "scheduled": return <Clock className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Curriculum Schedule</h1>
          <p className="text-muted-foreground">Track your training schedule and progress</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Download Schedule
          </Button>
          <Button>
            <Calendar className="h-4 w-4 mr-2" />
            View Calendar
          </Button>
        </div>
      </div>

      {/* Current Curriculum Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Book className="h-5 w-5" />
            Current Curriculum: {currentCurriculum.title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div>
              <p className="text-sm text-muted-foreground">Job Role</p>
              <p className="font-medium">{currentCurriculum.jobRole}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Duration</p>
              <p className="font-medium">{currentCurriculum.totalDuration}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Progress</p>
              <div className="space-y-2">
                <Progress value={currentCurriculum.progress} className="h-2" />
                <p className="text-sm">{currentCurriculum.completedModules}/{currentCurriculum.totalModules} modules completed</p>
              </div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Expected Completion</p>
              <p className="font-medium">{currentCurriculum.expectedCompletion}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Select value={selectedWeek} onValueChange={setSelectedWeek}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="Select week" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="current">Current Week</SelectItem>
            <SelectItem value="week1">Week 1</SelectItem>
            <SelectItem value="week2">Week 2</SelectItem>
            <SelectItem value="week3">Week 3</SelectItem>
            <SelectItem value="all">All Weeks</SelectItem>
          </SelectContent>
        </Select>
        <Select value={selectedBatch} onValueChange={setSelectedBatch}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="Select batch" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Batches</SelectItem>
            {batches.map((batch) => (
              <SelectItem key={batch.id} value={batch.id}>
                {batch.name} ({batch.students} students)
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Tabs defaultValue="schedule" className="space-y-6">
        <TabsList>
          <TabsTrigger value="schedule">Weekly Schedule</TabsTrigger>
          <TabsTrigger value="materials">Learning Materials</TabsTrigger>
          <TabsTrigger value="progress">Student Progress</TabsTrigger>
        </TabsList>

        <TabsContent value="schedule" className="space-y-6">
          {weeklySchedule.map((week) => (
            <Card key={week.week}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{week.week}</span>
                  <Badge variant="outline">{week.date}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {week.modules.map((module) => (
                    <div key={module.id} className="border rounded-lg p-4 space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium">{module.name}</h4>
                            <Badge className={getStatusColor(module.status)}>
                              {getStatusIcon(module.status)}
                              {module.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">Duration: {module.duration}</p>
                          <p className="text-sm text-muted-foreground">Scheduled: {module.scheduledTime}</p>
                          <p className="text-sm text-muted-foreground">Batch: {module.batch}</p>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            <Play className="h-4 w-4 mr-1" />
                            Start
                          </Button>
                          <Button size="sm" variant="outline">
                            <FileText className="h-4 w-4 mr-1" />
                            Materials
                          </Button>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t">
                        <div>
                          <p className="text-sm font-medium mb-2">Learning Materials:</p>
                          <div className="flex flex-wrap gap-2">
                            {module.materials.map((material, idx) => (
                              <Badge key={idx} variant="secondary" className="text-xs">
                                {material.includes('Video') ? (
                                  <Video className="h-3 w-3 mr-1" />
                                ) : (
                                  <FileText className="h-3 w-3 mr-1" />
                                )}
                                {material}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div>
                          <p className="text-sm font-medium mb-2">Assessment:</p>
                          <Badge variant="outline">{module.assessment}</Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="materials" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Learning Materials Library</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Module</TableHead>
                    <TableHead>Material Type</TableHead>
                    <TableHead>Format</TableHead>
                    <TableHead>Size</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>Introduction to Retail</TableCell>
                    <TableCell>Training Manual</TableCell>
                    <TableCell>PDF</TableCell>
                    <TableCell>2.5 MB</TableCell>
                    <TableCell>
                      <Button size="sm" variant="outline">
                        <Download className="h-4 w-4 mr-1" />
                        Download
                      </Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Product Knowledge</TableCell>
                    <TableCell>Video Tutorial</TableCell>
                    <TableCell>MP4</TableCell>
                    <TableCell>45.2 MB</TableCell>
                    <TableCell>
                      <Button size="sm" variant="outline">
                        <Play className="h-4 w-4 mr-1" />
                        Play
                      </Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Customer Interaction</TableCell>
                    <TableCell>Role Play Scripts</TableCell>
                    <TableCell>PDF</TableCell>
                    <TableCell>1.8 MB</TableCell>
                    <TableCell>
                      <Button size="sm" variant="outline">
                        <Download className="h-4 w-4 mr-1" />
                        Download
                      </Button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="progress" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {batches.map((batch) => (
              <Card key={batch.id}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{batch.name}</span>
                    <Badge variant="outline">
                      <Users className="h-3 w-3 mr-1" />
                      {batch.students}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Overall Progress</span>
                        <span>{batch.progress}%</span>
                      </div>
                      <Progress value={batch.progress} className="h-2" />
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Students:</span>
                      <span>{batch.students}</span>
                    </div>
                    <Button size="sm" variant="outline" className="w-full">
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CurriculumSchedule;