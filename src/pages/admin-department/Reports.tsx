import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { 
  FileText, 
  Download, 
  Calendar, 
  BarChart3, 
  PieChart, 
  TrendingUp,
  Filter,
  Plus,
  Clock,
  CheckCircle
} from "lucide-react";

const Reports = () => {
  const [selectedReport, setSelectedReport] = useState("all");
  const [dateRange, setDateRange] = useState("this-month");
  const [centreFilter, setCentreFilter] = useState("all");
  const [showScheduleForm, setShowScheduleForm] = useState(false);

  // Mock data for pre-configured reports
  const reportTypes = [
    {
      id: "rent-payments",
      title: "Rent Payments Report",
      description: "Complete rent payment details by centre",
      icon: FileText,
      category: "Financial"
    },
    {
      id: "vendor-payments",
      title: "Vendor Payments Summary",
      description: "Vendor payment analysis and breakdowns",
      icon: BarChart3,
      category: "Financial"
    },
    {
      id: "petty-cash",
      title: "Petty Cash Report",
      description: "Petty cash usage and balance tracking",
      icon: PieChart,
      category: "Financial"
    },
    {
      id: "ticket-bookings",
      title: "Ticket Bookings Summary",
      description: "Travel booking statistics and costs",
      icon: TrendingUp,
      category: "Operations"
    },
    {
      id: "expense-analysis",
      title: "Expense Analysis",
      description: "Category-wise expense breakdown",
      icon: BarChart3,
      category: "Financial"
    },
    {
      id: "operational-summary",
      title: "Operational Summary",
      description: "Overall administrative operations overview",
      icon: FileText,
      category: "Operations"
    }
  ];

  // Mock data for scheduled reports
  const scheduledReports = [
    {
      id: 1,
      reportName: "Monthly Rent Summary",
      frequency: "Monthly",
      nextRunDate: "2025-08-01",
      lastRun: "2025-07-01",
      status: "Active",
      recipients: "admin@lnj.com, finance@lnj.com"
    },
    {
      id: 2,
      reportName: "Weekly Vendor Payments",
      frequency: "Weekly",
      nextRunDate: "2025-07-28",
      lastRun: "2025-07-21",
      status: "Active",
      recipients: "admin@lnj.com"
    },
    {
      id: 3,
      reportName: "Daily Expense Report",
      frequency: "Daily",
      nextRunDate: "2025-07-23",
      lastRun: "2025-07-22",
      status: "Paused",
      recipients: "finance@lnj.com"
    }
  ];

  // Mock data for recent reports
  const recentReports = [
    {
      id: 1,
      reportName: "Rent Payments - July 2025",
      generatedDate: "2025-07-22",
      fileSize: "2.3 MB",
      status: "Ready",
      type: "PDF"
    },
    {
      id: 2,
      reportName: "Vendor Payments Summary - Q2 2025",
      generatedDate: "2025-07-20",
      fileSize: "1.8 MB",
      status: "Ready",
      type: "Excel"
    },
    {
      id: 3,
      reportName: "Expense Analysis - June 2025",
      generatedDate: "2025-07-18",
      fileSize: "3.1 MB",
      status: "Processing",
      type: "PDF"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active": return "bg-green-100 text-green-800";
      case "Ready": return "bg-blue-100 text-blue-800";
      case "Paused": return "bg-yellow-100 text-yellow-800";
      case "Processing": return "bg-orange-100 text-orange-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Financial": return "bg-purple-100 text-purple-800";
      case "Operations": return "bg-blue-100 text-blue-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const handleGenerateReport = () => {
    console.log("Generating report:", {
      reportType: selectedReport,
      dateRange,
      centre: centreFilter
    });
    // Implementation for report generation
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
          <p className="text-gray-600 mt-1">Generate and manage administrative reports</p>
        </div>
        <div className="flex items-center gap-2 mt-4 sm:mt-0">
          <Dialog open={showScheduleForm} onOpenChange={setShowScheduleForm}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Clock className="h-4 w-4 mr-2" />
                Schedule Report
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Schedule Automated Report</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>Report Type</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select report type" />
                    </SelectTrigger>
                    <SelectContent>
                      {reportTypes.map((report) => (
                        <SelectItem key={report.id} value={report.id}>
                          {report.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Frequency</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="quarterly">Quarterly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Email Recipients</Label>
                  <Input placeholder="Enter email addresses (comma separated)" />
                </div>
                <div className="flex justify-end space-x-3">
                  <Button variant="outline" onClick={() => setShowScheduleForm(false)}>
                    Cancel
                  </Button>
                  <Button>
                    Schedule Report
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Custom Report
          </Button>
        </div>
      </div>

      {/* Report Generation */}
      <Card>
        <CardHeader>
          <CardTitle>Generate Report</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div>
              <Label>Report Type</Label>
              <Select value={selectedReport} onValueChange={setSelectedReport}>
                <SelectTrigger>
                  <SelectValue placeholder="Select report type" />
                </SelectTrigger>
                <SelectContent>
                  {reportTypes.map((report) => (
                    <SelectItem key={report.id} value={report.id}>
                      {report.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Centre</Label>
              <Select value={centreFilter} onValueChange={setCentreFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Select centre" />
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
              <Label>Date Range</Label>
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select date range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="this-month">This Month</SelectItem>
                  <SelectItem value="last-month">Last Month</SelectItem>
                  <SelectItem value="this-quarter">This Quarter</SelectItem>
                  <SelectItem value="last-quarter">Last Quarter</SelectItem>
                  <SelectItem value="custom">Custom Range</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button 
                className="w-full"
                onClick={handleGenerateReport}
                disabled={!selectedReport}
              >
                <BarChart3 className="h-4 w-4 mr-2" />
                Generate Report
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Pre-configured Reports */}
      <Card>
        <CardHeader>
          <CardTitle>Available Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {reportTypes.map((report) => (
              <Card key={report.id} className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex items-start space-x-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <report.icon className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{report.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">{report.description}</p>
                      <div className="flex items-center justify-between mt-3">
                        <Badge className={getCategoryColor(report.category)}>
                          {report.category}
                        </Badge>
                        <Button size="sm" variant="outline">
                          <Download className="h-3 w-3 mr-1" />
                          Generate
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Scheduled Reports */}
      <Card>
        <CardHeader>
          <CardTitle>Scheduled Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Report Name</TableHead>
                <TableHead>Frequency</TableHead>
                <TableHead>Next Run</TableHead>
                <TableHead>Last Run</TableHead>
                <TableHead>Recipients</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {scheduledReports.map((report) => (
                <TableRow key={report.id}>
                  <TableCell className="font-medium">{report.reportName}</TableCell>
                  <TableCell>{report.frequency}</TableCell>
                  <TableCell>{report.nextRunDate}</TableCell>
                  <TableCell>{report.lastRun}</TableCell>
                  <TableCell className="max-w-xs truncate">{report.recipients}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(report.status)}>
                      {report.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                      <Button variant="outline" size="sm">
                        Run Now
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Recent Reports */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Report Name</TableHead>
                <TableHead>Generated Date</TableHead>
                <TableHead>File Size</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentReports.map((report) => (
                <TableRow key={report.id}>
                  <TableCell className="font-medium">{report.reportName}</TableCell>
                  <TableCell>{report.generatedDate}</TableCell>
                  <TableCell>{report.fileSize}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{report.type}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(report.status)}>
                      {report.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      {report.status === "Ready" && (
                        <Button size="sm">
                          <Download className="h-4 w-4 mr-1" />
                          Download
                        </Button>
                      )}
                      {report.status === "Processing" && (
                        <Button size="sm" variant="outline" disabled>
                          <Clock className="h-4 w-4 mr-1" />
                          Processing
                        </Button>
                      )}
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

export default Reports;