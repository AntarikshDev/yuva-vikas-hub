import { useState } from "react";
import { MainLayout } from "@/layouts/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Calendar, CalendarDays, FileText, Users, AlertTriangle, CheckCircle, Clock, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { DateRange } from "react-day-picker";
import { DateRangePicker } from "@/components/ui/date-range-picker";

// Mock data
const mockKpis = [
  {
    label: "Pending Counselling Sessions",
    value: 12,
    icon: Users,
    status: "warning",
    subtitle: "candidates pending"
  },
  {
    label: "Parent Counselling Pending", 
    value: 3,
    icon: Calendar,
    status: "danger",
    subtitle: "parents not counselled"
  },
  {
    label: "OFRs To Generate",
    value: 5,
    icon: FileText,
    status: "warning", 
    subtitle: "OFRs left"
  },
  {
    label: "Document Compliance",
    value: 78,
    icon: CheckCircle,
    status: "success",
    subtitle: "% complete"
  }
];

const mockAlerts = [
  { id: 1, text: "2 Parent Consents Overdue", status: "danger", priority: "high" },
  { id: 2, text: "5 Counselling Sessions Due Today", status: "warning", priority: "medium" },
  { id: 3, text: "3 OFRs Ready for Generation", status: "info", priority: "low" },
  { id: 4, text: "Document Review Required - Batch A", status: "warning", priority: "medium" }
];

export default function CounsellorDashboard() {
  const [selectedCentre, setSelectedCentre] = useState("");
  const [selectedBatch, setSelectedBatch] = useState("");
  const [dateRange, setDateRange] = useState<DateRange | undefined>();

  const getStatusColor = (status: string) => {
    switch (status) {
      case "success": return "text-green-600 bg-green-50";
      case "warning": return "text-yellow-600 bg-yellow-50";
      case "danger": return "text-red-600 bg-red-50";
      default: return "text-blue-600 bg-blue-50";
    }
  };

  const getAlertIcon = (status: string) => {
    switch (status) {
      case "danger": return <XCircle className="h-4 w-4" />;
      case "warning": return <AlertTriangle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  return (
    <MainLayout role="counsellor">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-3xl font-bold text-primary">Counsellor Dashboard</h1>
          
          {/* Filter Bar */}
          <div className="flex flex-wrap gap-3">
            <Select value={selectedCentre} onValueChange={setSelectedCentre}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Select Centre" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="centre-a">Centre A</SelectItem>
                <SelectItem value="centre-b">Centre B</SelectItem>
                <SelectItem value="centre-c">Centre C</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedBatch} onValueChange={setSelectedBatch}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Select Batch" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="batch-1">Batch 2025-01</SelectItem>
                <SelectItem value="batch-2">Batch 2025-02</SelectItem>
                <SelectItem value="batch-3">Batch 2025-03</SelectItem>
              </SelectContent>
            </Select>

            <DateRangePicker
              dateRange={dateRange}
              onDateRangeChange={setDateRange}
              placeholder="Select date range"
            />
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {mockKpis.map((kpi, index) => {
            const Icon = kpi.icon;
            return (
              <Card key={index} className="card-hover">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {kpi.label}
                  </CardTitle>
                  <div className={`rounded-full p-2 ${getStatusColor(kpi.status)}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-primary">
                    {kpi.value}{kpi.label.includes("Compliance") ? "%" : ""}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {kpi.subtitle}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Alerts Widget */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-600" />
              Alerts & Overdue Items
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockAlerts.map((alert) => (
                <div key={alert.id} className="flex items-center justify-between p-3 rounded-lg border">
                  <div className="flex items-center gap-3">
                    <div className={getStatusColor(alert.status)}>
                      {getAlertIcon(alert.status)}
                    </div>
                    <span className="text-sm">{alert.text}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={alert.priority === "high" ? "destructive" : 
                                    alert.priority === "medium" ? "default" : "secondary"}>
                      {alert.priority}
                    </Badge>
                    <Button variant="outline" size="sm">
                      View
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button className="h-20 flex-col gap-2" variant="outline">
                <Users className="h-6 w-6" />
                <span className="text-sm">New Counselling</span>
              </Button>
              <Button className="h-20 flex-col gap-2" variant="outline">
                <Calendar className="h-6 w-6" />
                <span className="text-sm">Parent Counselling</span>
              </Button>
              <Button className="h-20 flex-col gap-2" variant="outline">
                <FileText className="h-6 w-6" />
                <span className="text-sm">Generate OFR</span>
              </Button>
              <Button className="h-20 flex-col gap-2" variant="outline">
                <CheckCircle className="h-6 w-6" />
                <span className="text-sm">Review Documents</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}