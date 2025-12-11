import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MapPin, Users, AlertTriangle, CheckCircle, Phone, Camera } from "lucide-react";
import { useGetPOCDashboardQuery } from "@/store/api/apiSlice";

// Mock data for fallback
const mockKpis = [
  { label: "Upcoming Visits Today", value: 3, icon: "MapPin", color: "blue" },
  { label: "SOS Alerts Pending", value: 5, icon: "AlertTriangle", color: "red" },
  { label: "Travel Plans Pending", value: 2, icon: "Users", color: "orange" },
  { label: "Welfare Facilitation %", value: 88, icon: "CheckCircle", color: "green" },
  { label: "Batches Monitoring", value: 12, icon: "Users", color: "purple" },
  { label: "SOS Resolved This Week", value: 8, icon: "CheckCircle", color: "emerald" }
];

const mockUpcomingTasks = [
  { task: "Visit Bangalore Hostel A – Batch X", priority: "High", type: "Visit" },
  { task: "Check Grocery Delivery for Batch Y", priority: "Medium", type: "Welfare" },
  { task: "Respond to SOS – Candidate Ravi Kumar", priority: "Critical", type: "SOS" },
  { task: "Facilitate Travel Plans for Batch Z", priority: "High", type: "Travel" },
  { task: "Update Welfare Report for Batch A", priority: "Medium", type: "Report" }
];

const mockUpcomingVisits = [
  { date: "Today", visit: "Hostel Inspection – Batch X", location: "Bangalore Hostel A", time: "10:00 AM" },
  { date: "Tomorrow", visit: "Employer Visit – TechCorp", location: "TechCorp Office", time: "2:00 PM" },
  { date: "23 Jul", visit: "Candidate Check-in – Batch Y", location: "Delhi Hostel B", time: "11:00 AM" },
  { date: "24 Jul", visit: "Grocery Distribution", location: "Chennai Hostel C", time: "9:00 AM" }
];

const mockSosAlerts = [
  { candidate: "Ravi Kumar", issue: "Accommodation Issue", batch: "Batch X", priority: "Critical", time: "2 hours ago" },
  { candidate: "Priya Sharma", issue: "Salary Delay", batch: "Batch Y", priority: "High", time: "5 hours ago" },
  { candidate: "Amit Singh", issue: "Workplace Issue", batch: "Batch Z", priority: "Medium", time: "1 day ago" }
];

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  MapPin,
  AlertTriangle,
  Users,
  CheckCircle,
  Calendar,
  Clock
};

const POCDashboard = () => {
  const [stateFilter, setStateFilter] = useState("");
  const [batchFilter, setBatchFilter] = useState("");
  const [companyFilter, setCompanyFilter] = useState("");

  // RTK Query with mock fallback
  const { data: apiData, isLoading, error } = useGetPOCDashboardQuery();

  let kpis: typeof mockKpis;
  let upcomingTasks: typeof mockUpcomingTasks;
  let upcomingVisits: typeof mockUpcomingVisits;
  let sosAlerts: typeof mockSosAlerts;

  if (!apiData) {
    kpis = mockKpis;
    upcomingTasks = mockUpcomingTasks;
    upcomingVisits = mockUpcomingVisits;
    sosAlerts = mockSosAlerts;
  } else {
    kpis = apiData.kpis || apiData.data?.kpis || mockKpis;
    upcomingTasks = apiData.upcomingTasks || apiData.data?.upcomingTasks || mockUpcomingTasks;
    upcomingVisits = apiData.upcomingVisits || apiData.data?.upcomingVisits || mockUpcomingVisits;
    sosAlerts = apiData.sosAlerts || apiData.data?.sosAlerts || mockSosAlerts;
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Critical": return "destructive";
      case "High": return "destructive";
      case "Medium": return "secondary";
      case "Low": return "outline";
      default: return "outline";
    }
  };

  const getKpiColor = (color: string) => {
    const colors: Record<string, string> = {
      blue: "border-blue-200 bg-blue-50 text-blue-900",
      red: "border-red-200 bg-red-50 text-red-900",
      orange: "border-orange-200 bg-orange-50 text-orange-900",
      green: "border-green-200 bg-green-50 text-green-900",
      purple: "border-purple-200 bg-purple-50 text-purple-900",
      emerald: "border-emerald-200 bg-emerald-50 text-emerald-900"
    };
    return colors[color] || "border-gray-200 bg-gray-50 text-gray-900";
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 space-y-6 bg-gradient-to-br from-slate-50 to-purple-50 min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">POC Dashboard</h1>
          <p className="text-gray-600">Field monitoring and candidate welfare management</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="destructive" className="animate-pulse">
            {sosAlerts.length} Critical Tasks
          </Badge>
        </div>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Select value={stateFilter} onValueChange={setStateFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by State" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All States</SelectItem>
                <SelectItem value="Karnataka">Karnataka</SelectItem>
                <SelectItem value="Tamil Nadu">Tamil Nadu</SelectItem>
                <SelectItem value="Maharashtra">Maharashtra</SelectItem>
                <SelectItem value="Delhi">Delhi</SelectItem>
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

            <Select value={companyFilter} onValueChange={setCompanyFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by Company" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Companies</SelectItem>
                <SelectItem value="TechCorp">TechCorp India</SelectItem>
                <SelectItem value="RetailMax">RetailMax Ltd</SelectItem>
                <SelectItem value="ServicePro">ServicePro Pvt</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {kpis.map((kpi: any, index: number) => {
          const Icon = iconMap[kpi.icon] || MapPin;
          return (
            <Card key={index} className={getKpiColor(kpi.color)}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs mb-1 opacity-75">{kpi.label}</p>
                    <p className="text-xl md:text-2xl font-bold">
                      {kpi.label.includes('%') ? `${kpi.value}%` : kpi.value}
                    </p>
                  </div>
                  <Icon className="w-6 h-6 opacity-60" />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Upcoming Tasks
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {upcomingTasks.map((task: any, index: number) => (
              <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                <div className="flex-1">
                  <p className="text-sm font-medium">{task.task}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant={getPriorityColor(task.priority) as any} className="text-xs">
                      {task.priority}
                    </Badge>
                    <span className="text-xs text-gray-500">{task.type}</span>
                  </div>
                </div>
                <Button size="sm" variant="outline">
                  Action
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Upcoming Visits
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {upcomingVisits.map((visit: any, index: number) => (
              <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors cursor-pointer">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-medium text-blue-600">{visit.date}</span>
                    <span className="text-xs text-gray-500">{visit.time}</span>
                  </div>
                  <p className="text-sm font-medium">{visit.visit}</p>
                  <p className="text-xs text-gray-600 flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {visit.location}
                  </p>
                </div>
                <Button size="sm">
                  <Camera className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="lg:col-span-2 xl:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-500" />
              SOS Alerts
              <Badge variant="destructive" className="ml-auto">
                {sosAlerts.length}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {sosAlerts.map((sos: any, index: number) => (
              <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-red-50 border border-red-200">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-sm font-medium">{sos.candidate}</p>
                    <Badge variant={getPriorityColor(sos.priority) as any} className="text-xs">
                      {sos.priority}
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-600">{sos.issue} • {sos.batch}</p>
                  <p className="text-xs text-gray-500 mt-1">{sos.time}</p>
                </div>
                <div className="flex gap-1">
                  <Button size="sm" variant="outline">
                    <Phone className="w-3 h-3" />
                  </Button>
                  <Button size="sm">
                    View
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default POCDashboard;
