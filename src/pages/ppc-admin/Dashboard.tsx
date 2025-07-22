import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Calendar, Bell, Users, FileText, MapPin, AlertTriangle, CheckCircle, Clock } from "lucide-react";

const Dashboard = () => {
  const [selectedState, setSelectedState] = useState("");
  const [selectedCentre, setSelectedCentre] = useState("");

  const kpiData = [
    { label: "Total Batches Under Monitoring", value: 15, icon: Users, color: "bg-blue-500" },
    { label: "Counselling Completion %", value: 88, icon: CheckCircle, color: "bg-green-500" },
    { label: "Assessments Completed %", value: 92, icon: FileText, color: "bg-purple-500" },
    { label: "Offer Letters Issued", value: 120, icon: FileText, color: "bg-indigo-500" },
    { label: "Travel Plans Confirmed", value: 85, icon: MapPin, color: "bg-orange-500" },
    { label: "Candidates in Post-Placement", value: 450, icon: Users, color: "bg-teal-500" },
    { label: "SOS Requests (Open)", value: 7, icon: AlertTriangle, color: "bg-red-500" },
    { label: "POC Visits This Week", value: 3, icon: Calendar, color: "bg-yellow-500" }
  ];

  const centreStatus = [
    { batch: "Batch X", status: "Counselling Stage-2 Running", center: "Delhi Center A", progress: 75 },
    { batch: "Batch Y", status: "Interview Practice Completed", center: "Mumbai Center B", progress: 90 },
    { batch: "Batch Z", status: "Assessment Phase", center: "Bangalore Center C", progress: 60 },
    { batch: "Batch A", status: "Travel Planning", center: "Chennai Center D", progress: 95 }
  ];

  const pendingActions = [
    "Review Declaration by Centre Manager – 3 Batches",
    "Check Candidate Declaration Letters – 12 Pending",
    "Verify Travel Status for Batch Z",
    "Approve Hostel Allocation for Batch Y"
  ];

  const upcomingEvents = [
    { date: "2025-07-21", event: "POC Hostel Visit – Bangalore", type: "visit" },
    { date: "2025-07-22", event: "Batch X Interview", type: "interview" },
    { date: "2025-07-23", event: "Travel Departure – Batch Y", type: "travel" },
    { date: "2025-07-24", event: "POC Employer Visit – Chennai", type: "visit" }
  ];

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">PPC Admin Dashboard</h1>
          <p className="text-gray-600">Monitor pre & post-placement compliance across all centers</p>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Bell className="w-4 h-4 mr-2" />
            Notifications
            <Badge className="ml-2 bg-red-500">5</Badge>
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <Select value={selectedState} onValueChange={setSelectedState}>
              <SelectTrigger>
                <SelectValue placeholder="Select State" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="karnataka">Karnataka</SelectItem>
                <SelectItem value="maharashtra">Maharashtra</SelectItem>
                <SelectItem value="delhi">Delhi</SelectItem>
                <SelectItem value="tamil-nadu">Tamil Nadu</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedCentre} onValueChange={setSelectedCentre}>
              <SelectTrigger>
                <SelectValue placeholder="Select Centre" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="center-a">Delhi Center A</SelectItem>
                <SelectItem value="center-b">Mumbai Center B</SelectItem>
                <SelectItem value="center-c">Bangalore Center C</SelectItem>
              </SelectContent>
            </Select>

            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select Batch" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="batch-x">Batch X</SelectItem>
                <SelectItem value="batch-y">Batch Y</SelectItem>
                <SelectItem value="batch-z">Batch Z</SelectItem>
              </SelectContent>
            </Select>

            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select Company" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="company-a">TechCorp India</SelectItem>
                <SelectItem value="company-b">RetailMax Ltd</SelectItem>
                <SelectItem value="company-c">ServicePro Pvt</SelectItem>
              </SelectContent>
            </Select>

            <Button className="bg-purple-600 hover:bg-purple-700">
              Apply Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiData.map((kpi, index) => {
          const IconComponent = kpi.icon;
          return (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">{kpi.label}</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {typeof kpi.value === 'number' && kpi.label.includes('%') ? `${kpi.value}%` : kpi.value}
                    </p>
                  </div>
                  <div className={`p-3 rounded-full ${kpi.color} text-white`}>
                    <IconComponent className="w-5 h-5" />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Live Centre Status */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Live Centre Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {centreStatus.map((status, index) => (
                <div key={index} className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-semibold text-gray-900">{status.batch}</h4>
                      <p className="text-sm text-gray-600">{status.center}</p>
                    </div>
                    <Badge variant={status.progress >= 90 ? "default" : status.progress >= 70 ? "secondary" : "outline"}>
                      {status.progress}%
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-700 mb-2">{status.status}</p>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${status.progress}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Pending Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Pending Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {pendingActions.map((action, index) => (
                <div key={index} className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-gray-700">{action}</p>
                  <Button size="sm" variant="outline" className="mt-2 text-xs">
                    Take Action
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Events Calendar */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Upcoming Events (Next 7 Days)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {upcomingEvents.map((event, index) => (
              <div key={index} className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-semibold text-blue-900">{event.date}</span>
                </div>
                <p className="text-sm text-gray-700">{event.event}</p>
                <Badge className="mt-2" variant={
                  event.type === 'visit' ? 'default' : 
                  event.type === 'interview' ? 'secondary' : 'outline'
                }>
                  {event.type}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;