import { useState } from "react";
import { Check, X, Users, Calendar, Download } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const AttendanceManagement = () => {
  const [selectedCandidates, setSelectedCandidates] = useState<string[]>([]);

  const candidateAttendance = [
    {
      id: "1",
      name: "Ravi Kumar",
      days: [true, true, false, true, true, true, false],
      overall: 85
    },
    {
      id: "2", 
      name: "Priya Sharma",
      days: [true, false, true, true, true, true, true],
      overall: 92
    },
    {
      id: "3",
      name: "Amit Singh",
      days: [false, true, true, false, true, true, true],
      overall: 78
    },
    {
      id: "4",
      name: "Sneha Patel",
      days: [true, true, true, true, false, true, true],
      overall: 95
    },
    {
      id: "5",
      name: "Rohit Gupta",
      days: [true, true, true, true, true, false, true],
      overall: 88
    }
  ];

  const trainerAttendance = [
    { date: "2025-07-15", status: "Present", checkIn: "09:00 AM", checkOut: "05:00 PM" },
    { date: "2025-07-16", status: "Present", checkIn: "09:15 AM", checkOut: "05:30 PM" },
    { date: "2025-07-17", status: "Present", checkIn: "08:45 AM", checkOut: "05:00 PM" },
    { date: "2025-07-18", status: "Present", checkIn: "09:00 AM", checkOut: "05:15 PM" },
    { date: "2025-07-19", status: "Pending", checkIn: "-", checkOut: "-" }
  ];

  const dates = ["15", "16", "17", "18", "19", "20", "21"];

  const handleCandidateToggle = (candidateId: string) => {
    setSelectedCandidates(prev => 
      prev.includes(candidateId) 
        ? prev.filter(id => id !== candidateId)
        : [...prev, candidateId]
    );
  };

  const handleMarkAllPresent = () => {
    setSelectedCandidates(candidateAttendance.map(c => c.id));
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <h1 className="text-3xl font-bold">Attendance Management</h1>
        <div className="flex gap-4">
          <Select defaultValue="rsd-101">
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select Batch" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="rsd-101">Batch RSD-101</SelectItem>
              <SelectItem value="css-102">Batch CSS-102</SelectItem>
            </SelectContent>
          </Select>
          <Button>
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Candidates</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">25</div>
            <p className="text-xs text-muted-foreground">Active in batch</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Attendance</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">87%</div>
            <p className="text-xs text-muted-foreground">This week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Present Today</CardTitle>
            <Check className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">22/25</div>
            <p className="text-xs text-muted-foreground">88% attendance</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="candidates" className="space-y-6">
        <TabsList>
          <TabsTrigger value="candidates">Candidate Attendance</TabsTrigger>
          <TabsTrigger value="trainer">Trainer Attendance</TabsTrigger>
        </TabsList>

        <TabsContent value="candidates" className="space-y-6">
          <div className="flex justify-between items-center">
            <div className="flex gap-4">
              <Dialog>
                <DialogTrigger asChild>
                  <Button>
                    <Calendar className="h-4 w-4 mr-2" />
                    Mark Attendance
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Mark Attendance</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                     <div className="grid grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="batch">Batch</Label>
                        <Select defaultValue="rsd-101">
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="rsd-101">Batch RSD-101</SelectItem>
                            <SelectItem value="css-102">Batch CSS-102</SelectItem>
                            <SelectItem value="js-103">Batch JS-103</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="date">Date</Label>
                        <Input type="date" id="date" defaultValue="2025-07-19" />
                      </div>
                      <div>
                        <Label htmlFor="session">Session/Class</Label>
                        <Select defaultValue="morning">
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="morning">Morning Session</SelectItem>
                            <SelectItem value="afternoon">Afternoon Session</SelectItem>
                            <SelectItem value="class1">Class 1 - Introduction</SelectItem>
                            <SelectItem value="class2">Class 2 - Basic Concepts</SelectItem>
                            <SelectItem value="class3">Class 3 - Practical Work</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <Label>Select Candidates</Label>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          onClick={handleMarkAllPresent}
                        >
                          Mark All Present
                        </Button>
                      </div>
                      
                      <div className="space-y-2 max-h-60 overflow-y-auto">
                        {candidateAttendance.map((candidate) => (
                          <div key={candidate.id} className="flex items-center space-x-2">
                            <Checkbox 
                              id={candidate.id}
                              checked={selectedCandidates.includes(candidate.id)}
                              onCheckedChange={() => handleCandidateToggle(candidate.id)}
                            />
                            <Label htmlFor={candidate.id}>{candidate.name}</Label>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex justify-end gap-2">
                      <Button variant="outline">Cancel</Button>
                      <Button>Save Attendance</Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Candidate Attendance Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Candidate Name</TableHead>
                    {dates.map(date => (
                      <TableHead key={date} className="text-center">Jul {date}</TableHead>
                    ))}
                    <TableHead className="text-center">Overall %</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {candidateAttendance.map((candidate) => (
                    <TableRow key={candidate.id}>
                      <TableCell className="font-medium">{candidate.name}</TableCell>
                      {candidate.days.map((present, index) => (
                        <TableCell key={index} className="text-center">
                          {present ? (
                            <Check className="h-4 w-4 text-green-500 mx-auto" />
                          ) : (
                            <X className="h-4 w-4 text-red-500 mx-auto" />
                          )}
                        </TableCell>
                      ))}
                      <TableCell className="text-center font-medium">
                        <span className={candidate.overall >= 80 ? "text-green-600" : "text-red-600"}>
                          {candidate.overall}%
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trainer" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>My Attendance Record</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Check In</TableHead>
                    <TableHead>Check Out</TableHead>
                    <TableHead>Hours</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {trainerAttendance.map((record, index) => (
                    <TableRow key={index}>
                      <TableCell>{record.date}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          record.status === "Present" 
                            ? "bg-green-100 text-green-800" 
                            : "bg-yellow-100 text-yellow-800"
                        }`}>
                          {record.status}
                        </span>
                      </TableCell>
                      <TableCell>{record.checkIn}</TableCell>
                      <TableCell>{record.checkOut}</TableCell>
                      <TableCell>
                        {record.status === "Present" ? "8 hrs" : "-"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AttendanceManagement;