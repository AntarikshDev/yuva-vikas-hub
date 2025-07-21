import { useState } from "react";
import { Calendar, Clock, BookOpen, CheckCircle, AlertCircle, XCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const CurriculumPlanner = () => {
  const [selectedDate, setSelectedDate] = useState<string>("2025-07-19");

  const curriculumData = [
    {
      module: "Retail Sales Fundamentals",
      totalSessions: 12,
      completed: 8,
      progress: 67,
      sessions: [
        { id: 1, topic: "Customer Service Basics", date: "2025-07-15", status: "completed" },
        { id: 2, topic: "Product Knowledge", date: "2025-07-16", status: "completed" },
        { id: 3, topic: "Sales Techniques", date: "2025-07-19", status: "pending" },
        { id: 4, topic: "Handling Objections", date: "2025-07-20", status: "pending" },
      ]
    },
    {
      module: "Soft Skills Development",
      totalSessions: 8,
      completed: 5,
      progress: 63,
      sessions: [
        { id: 5, topic: "Communication Skills", date: "2025-07-17", status: "completed" },
        { id: 6, topic: "Team Work", date: "2025-07-18", status: "overdue" },
        { id: 7, topic: "Time Management", date: "2025-07-21", status: "pending" },
      ]
    }
  ];

  const dailySchedule = [
    {
      id: 1,
      sessionName: "Retail Sales – Customer Interaction Role Play",
      topic: "Advanced Customer Handling Techniques",
      plannedTime: "10:00 AM - 12:00 PM",
      room: "Training Room A",
      status: "pending"
    },
    {
      id: 2,
      sessionName: "Soft Skills – Communication Training",
      topic: "Effective Verbal Communication",
      plannedTime: "2:00 PM - 4:00 PM",
      room: "Virtual Link: zoom.us/j/123456789",
      status: "pending"
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed": return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "overdue": return <XCircle className="h-4 w-4 text-red-500" />;
      default: return <AlertCircle className="h-4 w-4 text-orange-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "default";
      case "overdue": return "destructive";
      default: return "secondary";
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <h1 className="text-3xl font-bold">Curriculum Planner</h1>
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
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Calendar className="h-4 w-4 mr-2" />
                Daily Schedule
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl">
              <DialogHeader>
                <DialogTitle>Daily Schedule - {selectedDate}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                {dailySchedule.map((session) => (
                  <Card key={session.id}>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div className="space-y-2">
                          <h3 className="font-semibold">{session.sessionName}</h3>
                          <p className="text-sm text-muted-foreground">{session.topic}</p>
                          <div className="flex items-center gap-4 text-sm">
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              {session.plannedTime}
                            </div>
                            <div>{session.room}</div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm">Start Session</Button>
                          <Button size="sm" variant="outline">Mark Completed</Button>
                          <Button size="sm" variant="outline">Upload Video</Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs defaultValue="progress" className="space-y-6">
        <TabsList>
          <TabsTrigger value="progress">Progress Tracker</TabsTrigger>
          <TabsTrigger value="calendar">Calendar View</TabsTrigger>
        </TabsList>

        <TabsContent value="progress" className="space-y-6">
          {/* Progress Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {curriculumData.map((module) => (
              <Card key={module.module}>
                <CardHeader>
                  <CardTitle className="text-lg">{module.module}</CardTitle>
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-4 w-4" />
                    <span className="text-sm text-muted-foreground">
                      {module.completed}/{module.totalSessions} sessions
                    </span>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span className="font-medium">{module.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full" 
                        style={{ width: `${module.progress}%` }}
                      ></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Detailed Session List */}
          <Card>
            <CardHeader>
              <CardTitle>Session Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {curriculumData.map((module) => (
                  <div key={module.module} className="space-y-2">
                    <h3 className="font-semibold text-lg border-b pb-2">{module.module}</h3>
                    <div className="space-y-2">
                      {module.sessions.map((session) => (
                        <div key={session.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center gap-3">
                            {getStatusIcon(session.status)}
                            <div>
                              <div className="font-medium">{session.topic}</div>
                              <div className="text-sm text-muted-foreground">{session.date}</div>
                            </div>
                          </div>
                          <Badge variant={getStatusColor(session.status)}>
                            {session.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="calendar" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Calendar View</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-2 mb-4">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                  <div key={day} className="p-2 text-center font-medium text-sm">
                    {day}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-2">
                {Array.from({ length: 35 }, (_, i) => {
                  const date = new Date(2025, 6, i - 5); // July 2025
                  const hasSession = [15, 16, 17, 18, 19, 20, 21].includes(date.getDate());
                  const sessionStatus = date.getDate() < 18 ? "completed" : 
                                       date.getDate() === 18 ? "overdue" : "pending";
                  
                  return (
                    <div 
                      key={i} 
                      className={`
                        p-2 h-20 border rounded cursor-pointer transition-colors
                        ${hasSession ? 'bg-muted hover:bg-muted/80' : 'hover:bg-muted/50'}
                        ${date.getMonth() !== 6 ? 'text-muted-foreground' : ''}
                      `}
                      onClick={() => setSelectedDate(date.toISOString().split('T')[0])}
                    >
                      <div className="text-sm font-medium">{date.getDate()}</div>
                      {hasSession && (
                        <Badge 
                          variant={getStatusColor(sessionStatus)} 
                          className="text-xs mt-1"
                        >
                          Session
                        </Badge>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CurriculumPlanner;