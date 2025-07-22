import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { FileText, Download, Calendar, Filter, BarChart, TrendingUp, Users } from "lucide-react";

const Reports = () => {
  const [reportType, setReportType] = useState("");
  const [stateFilter, setStateFilter] = useState("");
  const [batchFilter, setBatchFilter] = useState("");
  const [dateRange, setDateRange] = useState("");

  const reportCategories = [
    {
      name: "Visits Completed",
      description: "All visits with media uploads and reports",
      count: 45,
      icon: Users,
      color: "blue"
    },
    {
      name: "SOS Actions Summary",
      description: "SOS alerts resolved and pending",
      count: 23,
      icon: TrendingUp,
      color: "red"
    },
    {
      name: "Travel Facilitation",
      description: "Travel plans and candidate movement",
      count: 12,
      icon: BarChart,
      color: "green"
    },
    {
      name: "Welfare Facilitation",
      description: "Hostel and settling-in activities",
      count: 18,
      icon: FileText,
      color: "purple"
    }
  ];

  const generatedReports = [
    {
      id: 1,
      reportName: "Visits Completed - July 2025",
      type: "Visits Completed",
      generatedDate: "2025-07-21",
      period: "July 1-21, 2025",
      state: "Karnataka",
      status: "Generated",
      fileSize: "2.3 MB"
    },
    {
      id: 2,
      reportName: "SOS Actions Summary - Week 3",
      type: "SOS Actions Summary",
      generatedDate: "2025-07-20",
      period: "July 15-21, 2025",
      state: "All States",
      status: "Generated",
      fileSize: "1.8 MB"
    },
    {
      id: 3,
      reportName: "Travel Facilitation - Batch X",
      type: "Travel Facilitation",
      generatedDate: "2025-07-19",
      period: "July 1-19, 2025",
      state: "Karnataka",
      status: "Generating",
      fileSize: "Pending"
    }
  ];

  const getIconColor = (color: string) => {
    const colors = {
      blue: "text-blue-500",
      red: "text-red-500",
      green: "text-green-500",
      purple: "text-purple-500"
    };
    return colors[color as keyof typeof colors] || "text-gray-500";
  };

  const getCardColor = (color: string) => {
    const colors = {
      blue: "border-blue-200 bg-blue-50",
      red: "border-red-200 bg-red-50",
      green: "border-green-200 bg-green-50",
      purple: "border-purple-200 bg-purple-50"
    };
    return colors[color as keyof typeof colors] || "border-gray-200 bg-gray-50";
  };

  return (
    <div className="p-4 md:p-6 space-y-6 bg-gradient-to-br from-slate-50 to-purple-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Reports & Analytics</h1>
          <p className="text-gray-600">Generate and export field activity reports</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-purple-600 hover:bg-purple-700">
              <FileText className="w-4 h-4 mr-2" />
              Generate New Report
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Generate New Report</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Report Type</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select report type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="visits">Visits Completed</SelectItem>
                    <SelectItem value="sos">SOS Actions Summary</SelectItem>
                    <SelectItem value="travel">Travel Facilitation</SelectItem>
                    <SelectItem value="welfare">Welfare Facilitation</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Start Date</Label>
                  <Input type="date" />
                </div>
                <div>
                  <Label>End Date</Label>
                  <Input type="date" />
                </div>
              </div>

              <div>
                <Label>State Filter</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select state" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All States</SelectItem>
                    <SelectItem value="Karnataka">Karnataka</SelectItem>
                    <SelectItem value="Delhi">Delhi</SelectItem>
                    <SelectItem value="Tamil Nadu">Tamil Nadu</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Batch Filter</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select batch" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Batches</SelectItem>
                    <SelectItem value="Batch X">Batch X</SelectItem>
                    <SelectItem value="Batch Y">Batch Y</SelectItem>
                    <SelectItem value="Batch Z">Batch Z</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Export Format</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pdf">PDF Report</SelectItem>
                    <SelectItem value="excel">Excel Spreadsheet</SelectItem>
                    <SelectItem value="both">Both PDF & Excel</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button className="w-full bg-purple-600 hover:bg-purple-700">
                Generate Report
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Report Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {reportCategories.map((category, index) => {
          const IconComponent = category.icon;
          return (
            <Card key={index} className={getCardColor(category.color)}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <IconComponent className={`w-8 h-8 ${getIconColor(category.color)}`} />
                  <Badge variant="outline">{category.count}</Badge>
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">{category.name}</h3>
                <p className="text-sm text-gray-600">{category.description}</p>
                <Button size="sm" variant="outline" className="w-full mt-3">
                  Generate Report
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <Select value={reportType} onValueChange={setReportType}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by Report Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="visits">Visits Completed</SelectItem>
                <SelectItem value="sos">SOS Actions</SelectItem>
                <SelectItem value="travel">Travel Facilitation</SelectItem>
                <SelectItem value="welfare">Welfare Facilitation</SelectItem>
              </SelectContent>
            </Select>

            <Select value={stateFilter} onValueChange={setStateFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by State" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All States</SelectItem>
                <SelectItem value="Karnataka">Karnataka</SelectItem>
                <SelectItem value="Delhi">Delhi</SelectItem>
                <SelectItem value="Tamil Nadu">Tamil Nadu</SelectItem>
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

            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger>
                <SelectValue placeholder="Date Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Dates</SelectItem>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Generated Reports Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Generated Reports
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Report Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Period</TableHead>
                  <TableHead>State</TableHead>
                  <TableHead>Generated Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {generatedReports.map((report) => (
                  <TableRow key={report.id}>
                    <TableCell className="font-medium">{report.reportName}</TableCell>
                    <TableCell>{report.type}</TableCell>
                    <TableCell>{report.period}</TableCell>
                    <TableCell>{report.state}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        {report.generatedDate}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={report.status === "Generated" ? "default" : "secondary"}>
                        {report.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        {report.status === "Generated" && (
                          <>
                            <Button size="sm" variant="outline">
                              <Download className="w-4 h-4 mr-1" />
                              PDF
                            </Button>
                            <Button size="sm" variant="outline">
                              <Download className="w-4 h-4 mr-1" />
                              Excel
                            </Button>
                          </>
                        )}
                        {report.status === "Generating" && (
                          <Badge variant="secondary">Processing...</Badge>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600 mb-1">Total Reports Generated</p>
                <p className="text-2xl font-bold text-blue-900">23</p>
              </div>
              <FileText className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600 mb-1">This Month</p>
                <p className="text-2xl font-bold text-green-900">8</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-purple-200 bg-purple-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-600 mb-1">This Week</p>
                <p className="text-2xl font-bold text-purple-900">3</p>
              </div>
              <BarChart className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Reports;