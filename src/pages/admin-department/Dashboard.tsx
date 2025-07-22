import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  DollarSign, 
  Ticket, 
  Users, 
  CreditCard, 
  Wallet, 
  ShoppingCart, 
  AlertCircle, 
  FileText,
  Calendar,
  Bell,
  TrendingUp,
  TrendingDown,
  Clock
} from "lucide-react";

const Dashboard = () => {
  const [selectedCentre, setSelectedCentre] = useState("");
  const [selectedBatch, setSelectedBatch] = useState("");
  const [dateRange, setDateRange] = useState("");

  // Mock data for KPIs
  const kpiData = [
    {
      title: "Total Rent Paid This Month",
      value: "₹5,00,000",
      icon: DollarSign,
      trend: "+12%",
      trendUp: true,
      color: "text-green-600"
    },
    {
      title: "Ticket Bookings Pending Approval",
      value: "20",
      icon: Ticket,
      trend: "+5",
      trendUp: false,
      color: "text-orange-600"
    },
    {
      title: "Vendor Payments Pending",
      value: "₹2,00,000",
      icon: Users,
      trend: "-8%",
      trendUp: false,
      color: "text-red-600"
    },
    {
      title: "Total Vendor Payments This Month",
      value: "₹8,00,000",
      icon: CreditCard,
      trend: "+15%",
      trendUp: true,
      color: "text-blue-600"
    },
    {
      title: "Petty Cash Balance",
      value: "₹50,000",
      icon: Wallet,
      trend: "-₹5,000",
      trendUp: false,
      color: "text-purple-600"
    },
    {
      title: "Materials Purchased This Month",
      value: "₹3,00,000",
      icon: ShoppingCart,
      trend: "+20%",
      trendUp: true,
      color: "text-indigo-600"
    },
    {
      title: "Center Service Complaints Open",
      value: "3",
      icon: AlertCircle,
      trend: "-2",
      trendUp: true,
      color: "text-yellow-600"
    },
    {
      title: "Upcoming Approvals",
      value: "2 Rent Invoices Pending",
      icon: FileText,
      trend: "+1",
      trendUp: false,
      color: "text-pink-600"
    }
  ];

  // Mock data for vendor payments summary
  const vendorPaymentsSummary = [
    { category: "Accommodation", amount: "₹3,50,000", percentage: 44 },
    { category: "Groceries", amount: "₹2,00,000", percentage: 25 },
    { category: "Materials", amount: "₹1,50,000", percentage: 19 },
    { category: "Transport", amount: "₹1,00,000", percentage: 12 }
  ];

  // Mock data for pending tasks
  const pendingTasks = [
    { task: "Approve Rent Payment for Centre A", priority: "High", due: "Today" },
    { task: "Process Ticket Booking for Candidate X", priority: "Medium", due: "Tomorrow" },
    { task: "Vendor Payment Approval Due", priority: "High", due: "Today" },
    { task: "Review Facility Service Request", priority: "Low", due: "This Week" }
  ];

  // Mock data for upcoming events
  const upcomingEvents = [
    { date: "2025-07-22", event: "Rent Payment Due - Centre A", type: "payment" },
    { date: "2025-07-23", event: "Vendor Payment - ABC Corp", type: "vendor" },
    { date: "2025-07-25", event: "Service Delivery - Groceries", type: "service" },
    { date: "2025-07-28", event: "Monthly Report Generation", type: "report" }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High": return "bg-red-100 text-red-800";
      case "Medium": return "bg-yellow-100 text-yellow-800";
      case "Low": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case "payment": return "bg-blue-100 text-blue-800";
      case "vendor": return "bg-purple-100 text-purple-800";
      case "service": return "bg-green-100 text-green-800";
      case "report": return "bg-orange-100 text-orange-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Administration Dashboard</h1>
          <p className="text-gray-600 mt-1">Manage center operations, payments, and administrative workflows</p>
        </div>
        <div className="flex items-center gap-2 mt-4 sm:mt-0">
          <Button variant="outline" size="sm">
            <Bell className="h-4 w-4 mr-2" />
            Notifications
          </Button>
          <Button size="sm">
            <FileText className="h-4 w-4 mr-2" />
            Generate Report
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Centre Name</label>
              <Select value={selectedCentre} onValueChange={setSelectedCentre}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Centre" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Centres</SelectItem>
                  <SelectItem value="centre-a">Centre A - Delhi</SelectItem>
                  <SelectItem value="centre-b">Centre B - Mumbai</SelectItem>
                  <SelectItem value="centre-c">Centre C - Bangalore</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Batch</label>
              <Select value={selectedBatch} onValueChange={setSelectedBatch}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Batch" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Batches</SelectItem>
                  <SelectItem value="batch-2024-01">Batch 2024-01</SelectItem>
                  <SelectItem value="batch-2024-02">Batch 2024-02</SelectItem>
                  <SelectItem value="batch-2024-03">Batch 2024-03</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Date Range</label>
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Date Range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="week">This Week</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                  <SelectItem value="quarter">This Quarter</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiData.map((kpi, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg bg-gray-100`}>
                    <kpi.icon className={`h-6 w-6 ${kpi.color}`} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">{kpi.title}</p>
                    <p className="text-2xl font-bold text-gray-900">{kpi.value}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`flex items-center text-sm ${kpi.trendUp ? 'text-green-600' : 'text-red-600'}`}>
                    {kpi.trendUp ? <TrendingUp className="h-4 w-4 mr-1" /> : <TrendingDown className="h-4 w-4 mr-1" />}
                    {kpi.trend}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Real-Time Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Vendor Payments Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <CreditCard className="h-5 w-5 mr-2" />
              Vendor Payments Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {vendorPaymentsSummary.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700">{item.category}</span>
                      <span className="text-sm text-gray-600">{item.amount}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${item.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Pending Tasks Widget */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="h-5 w-5 mr-2" />
              Pending Tasks
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {pendingTasks.map((task, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{task.task}</p>
                    <p className="text-xs text-gray-600 mt-1">Due: {task.due}</p>
                  </div>
                  <Badge className={getPriorityColor(task.priority)}>
                    {task.priority}
                  </Badge>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4">
              View All Tasks
            </Button>
          </CardContent>
        </Card>

        {/* Upcoming Events Calendar Widget */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="h-5 w-5 mr-2" />
              Upcoming Events
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {upcomingEvents.map((event, index) => (
                <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <span className="text-xs font-bold text-blue-600">
                        {new Date(event.date).getDate()}
                      </span>
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">{event.event}</p>
                    <div className="flex items-center mt-1">
                      <Badge className={`text-xs ${getEventTypeColor(event.type)}`}>
                        {event.type}
                      </Badge>
                      <span className="text-xs text-gray-500 ml-2">{event.date}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <Button variant="outline" className="w-full mt-4">
              View Calendar
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;