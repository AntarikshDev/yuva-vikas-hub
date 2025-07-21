import React, { useState } from 'react';
import { Bell, CalendarDays, Users, FileText, Plane, MessageSquare, UserCheck } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

// Mock data
const mockData = {
  kpis: [
    { label: "Upcoming Batches Assigned", value: 5, icon: Users, color: "text-blue-600" },
    { label: "Candidates Ready for Interview", value: 120, icon: UserCheck, color: "text-green-600" },
    { label: "Offer Letters Pending", value: 35, icon: FileText, color: "text-orange-600" },
    { label: "Travel Plans Pending", value: 20, icon: Plane, color: "text-purple-600" },
    { label: "New Feedback This Week", value: 15, icon: MessageSquare, color: "text-indigo-600" },
    { label: "Guest Sessions Scheduled", value: 2, icon: CalendarDays, color: "text-pink-600" }
  ],
  tasks: [
    { id: 1, task: "Issue 10 Offer Letters for Batch X", priority: "high", dueDate: "Today" },
    { id: 2, task: "Confirm Travel Plans for 8 Candidates of Batch Y", priority: "medium", dueDate: "Tomorrow" },
    { id: 3, task: "Review Candidate Feedback for Batch Z", priority: "low", dueDate: "This Week" },
    { id: 4, task: "Schedule Guest Session for Retail Excellence", priority: "medium", dueDate: "Next Week" }
  ],
  upcomingSchedule: [
    { date: "2025-07-21", event: "Guest Session – Retail Excellence", type: "session" },
    { date: "2025-07-22", event: "Interview Panel - Batch X", type: "interview" },
    { date: "2025-07-23", event: "Travel Departure - 5 Candidates", type: "travel" },
    { date: "2025-07-24", event: "Batch Y Final Assessment", type: "assessment" },
    { date: "2025-07-25", event: "Company Visit - Batch Z", type: "visit" }
  ]
};

const Dashboard: React.FC = () => {
  const [selectedState, setSelectedState] = useState<string>("");
  const [selectedCity, setSelectedCity] = useState<string>("");
  const [selectedJobRole, setSelectedJobRole] = useState<string>("");

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'default';
    }
  };

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'session': return 'bg-blue-100 text-blue-800';
      case 'interview': return 'bg-green-100 text-green-800';
      case 'travel': return 'bg-purple-100 text-purple-800';
      case 'assessment': return 'bg-orange-100 text-orange-800';
      case 'visit': return 'bg-pink-100 text-pink-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Company HR Dashboard</h1>
          <p className="text-gray-600 mt-1">Manage candidates, batches, and hiring processes</p>
        </div>
        
        {/* Filters */}
        <div className="flex flex-wrap gap-3">
          <Select value={selectedState} onValueChange={setSelectedState}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select State" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="karnataka">Karnataka</SelectItem>
              <SelectItem value="tamil-nadu">Tamil Nadu</SelectItem>
              <SelectItem value="kerala">Kerala</SelectItem>
              <SelectItem value="andhra-pradesh">Andhra Pradesh</SelectItem>
            </SelectContent>
          </Select>

          <Select value={selectedCity} onValueChange={setSelectedCity}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select City" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="bangalore">Bangalore</SelectItem>
              <SelectItem value="chennai">Chennai</SelectItem>
              <SelectItem value="cochin">Cochin</SelectItem>
              <SelectItem value="hyderabad">Hyderabad</SelectItem>
            </SelectContent>
          </Select>

          <Select value={selectedJobRole} onValueChange={setSelectedJobRole}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Job Role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="retail-sales">Retail Sales Associate</SelectItem>
              <SelectItem value="customer-service">Customer Service Executive</SelectItem>
              <SelectItem value="data-entry">Data Entry Operator</SelectItem>
              <SelectItem value="warehouse">Warehouse Associate</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockData.kpis.map((kpi, index) => {
          const Icon = kpi.icon;
          return (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {kpi.label}
                </CardTitle>
                <Icon className={`h-5 w-5 ${kpi.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900">{kpi.value}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending Tasks Panel */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-orange-600" />
              Pending Actions
            </CardTitle>
            <CardDescription>
              Tasks requiring immediate attention
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {mockData.tasks.map((task) => (
              <div key={task.id} className="flex items-start justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900 mb-1">{task.task}</p>
                  <p className="text-xs text-gray-600">Due: {task.dueDate}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={getPriorityColor(task.priority)}>
                    {task.priority}
                  </Badge>
                  <Button size="sm" variant="outline">
                    Action
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Upcoming Schedule Widget */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarDays className="h-5 w-5 text-blue-600" />
              Upcoming Schedule
            </CardTitle>
            <CardDescription>
              Next 7 days events and activities
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {mockData.upcomingSchedule.map((schedule, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">{schedule.event}</p>
                  <p className="text-xs text-gray-600">{schedule.date}</p>
                </div>
                <Badge 
                  className={getEventTypeColor(schedule.type)}
                  variant="secondary"
                >
                  {schedule.type}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Frequently used actions for faster workflow</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button className="h-16 flex flex-col items-center justify-center gap-2" variant="outline">
              <FileText className="h-5 w-5" />
              <span className="text-sm">Generate Offer Letters</span>
            </Button>
            <Button className="h-16 flex flex-col items-center justify-center gap-2" variant="outline">
              <Plane className="h-5 w-5" />
              <span className="text-sm">Confirm Travel Plans</span>
            </Button>
            <Button className="h-16 flex flex-col items-center justify-center gap-2" variant="outline">
              <CalendarDays className="h-5 w-5" />
              <span className="text-sm">Schedule Interview</span>
            </Button>
            <Button className="h-16 flex flex-col items-center justify-center gap-2" variant="outline">
              <Users className="h-5 w-5" />
              <span className="text-sm">View Candidates</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;