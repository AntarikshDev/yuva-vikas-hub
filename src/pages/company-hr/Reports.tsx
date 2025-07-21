import React, { useState } from 'react';
import { FileText, Download, Eye, Calendar, Filter, BarChart3 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Mock data for reports
const mockReportTypes = [
  {
    id: 1,
    name: "Batch Progress Report",
    description: "Comprehensive report on batch training progress and completion rates",
    category: "Training",
    lastGenerated: "2025-07-20",
    frequency: "Weekly"
  },
  {
    id: 2,
    name: "Candidate Readiness Report",
    description: "Assessment of candidates ready for interview and placement",
    category: "Placement",
    lastGenerated: "2025-07-19",
    frequency: "Daily"
  },
  {
    id: 3,
    name: "Offer Letters Issued Report",
    description: "Summary of offer letters issued and pending responses",
    category: "HR",
    lastGenerated: "2025-07-18",
    frequency: "Monthly"
  },
  {
    id: 4,
    name: "Travel Confirmations Report",
    description: "Status of candidate travel arrangements and confirmations",
    category: "Travel",
    lastGenerated: "2025-07-17",
    frequency: "Weekly"
  },
  {
    id: 5,
    name: "Feedback Summary Report",
    description: "Analysis of candidate and centre feedback with resolution status",
    category: "Feedback",
    lastGenerated: "2025-07-16",
    frequency: "Bi-weekly"
  }
];

const mockGeneratedReports = [
  {
    id: 1,
    name: "Batch Progress Report - Week 29",
    type: "Batch Progress Report",
    generatedDate: "2025-07-20",
    generatedBy: "System Auto",
    format: "PDF",
    size: "2.3 MB",
    status: "Ready",
    downloadUrl: "#"
  },
  {
    id: 2,
    name: "Candidate Readiness - July 2025",
    type: "Candidate Readiness Report",
    generatedDate: "2025-07-19",
    generatedBy: "HR Admin",
    format: "Excel",
    size: "1.8 MB",
    status: "Ready",
    downloadUrl: "#"
  },
  {
    id: 3,
    name: "Travel Status - Batch RSA-001",
    type: "Travel Confirmations Report",
    generatedDate: "2025-07-18",
    generatedBy: "Travel Coordinator",
    format: "PDF",
    size: "1.2 MB",
    status: "Processing",
    downloadUrl: "#"
  }
];

const Reports: React.FC = () => {
  const [activeTab, setActiveTab] = useState("generate");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedState, setSelectedState] = useState<string>("");
  const [selectedCentre, setSelectedCentre] = useState<string>("");
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedReport, setSelectedReport] = useState<any>(null);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [isDashboardExportOpen, setIsDashboardExportOpen] = useState(false);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Training': return 'bg-blue-100 text-blue-800';
      case 'Placement': return 'bg-green-100 text-green-800';
      case 'HR': return 'bg-purple-100 text-purple-800';
      case 'Travel': return 'bg-orange-100 text-orange-800';
      case 'Feedback': return 'bg-pink-100 text-pink-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Ready': return 'bg-green-100 text-green-800';
      case 'Processing': return 'bg-yellow-100 text-yellow-800';
      case 'Failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredReportTypes = mockReportTypes.filter(report => {
    return (
      (!selectedCategory || report.category === selectedCategory) &&
      (!searchTerm || report.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
       report.description.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  });

  const generateReport = (reportType: any) => {
    console.log("Generating report:", reportType, {
      state: selectedState,
      centre: selectedCentre,
      dateRange: dateRange
    });
    // Implementation for report generation
  };

  const previewReport = (report: any) => {
    setSelectedReport(report);
    setIsPreviewModalOpen(true);
  };

  const downloadReport = (report: any) => {
    console.log("Downloading report:", report.name);
    // Implementation for report download
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
          <p className="text-gray-600 mt-1">Generate and manage comprehensive reports</p>
        </div>
        
        <Button onClick={() => setIsDashboardExportOpen(true)}>
          <Download className="h-4 w-4 mr-2" />
          Export Dashboard Snapshot
        </Button>
      </div>

      {/* Report Categories Overview */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Training Reports</CardTitle>
            <BarChart3 className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {mockReportTypes.filter(r => r.category === 'Training').length}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Placement Reports</CardTitle>
            <BarChart3 className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {mockReportTypes.filter(r => r.category === 'Placement').length}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">HR Reports</CardTitle>
            <BarChart3 className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {mockReportTypes.filter(r => r.category === 'HR').length}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Travel Reports</CardTitle>
            <BarChart3 className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {mockReportTypes.filter(r => r.category === 'Travel').length}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Feedback Reports</CardTitle>
            <BarChart3 className="h-4 w-4 text-pink-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-pink-600">
              {mockReportTypes.filter(r => r.category === 'Feedback').length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Report Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="generate">Generate Reports</TabsTrigger>
          <TabsTrigger value="history">Report History</TabsTrigger>
        </TabsList>
        
        <TabsContent value="generate">
          <div className="space-y-6">
            {/* Filters for Report Generation */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Filter className="h-5 w-5" />
                  Report Filters
                </CardTitle>
                <CardDescription>Configure parameters for report generation</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                  <Input
                    placeholder="Search reports..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Training">Training</SelectItem>
                      <SelectItem value="Placement">Placement</SelectItem>
                      <SelectItem value="HR">HR</SelectItem>
                      <SelectItem value="Travel">Travel</SelectItem>
                      <SelectItem value="Feedback">Feedback</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={selectedState} onValueChange={setSelectedState}>
                    <SelectTrigger>
                      <SelectValue placeholder="State" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="karnataka">Karnataka</SelectItem>
                      <SelectItem value="tamil-nadu">Tamil Nadu</SelectItem>
                      <SelectItem value="kerala">Kerala</SelectItem>
                      <SelectItem value="andhra-pradesh">Andhra Pradesh</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={selectedCentre} onValueChange={setSelectedCentre}>
                    <SelectTrigger>
                      <SelectValue placeholder="Centre" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bangalore">Bangalore</SelectItem>
                      <SelectItem value="chennai">Chennai</SelectItem>
                      <SelectItem value="cochin">Cochin</SelectItem>
                      <SelectItem value="hyderabad">Hyderabad</SelectItem>
                    </SelectContent>
                  </Select>

                  <Button variant="outline" onClick={() => {
                    setSelectedCategory("");
                    setSelectedState("");
                    setSelectedCentre("");
                    setSearchTerm("");
                    setDateRange({ start: "", end: "" });
                  }}>
                    Clear Filters
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div>
                    <Label htmlFor="startDate">Start Date</Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={dateRange.start}
                      onChange={(e) => setDateRange({...dateRange, start: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="endDate">End Date</Label>
                    <Input
                      id="endDate"
                      type="date"
                      value={dateRange.end}
                      onChange={(e) => setDateRange({...dateRange, end: e.target.value})}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Available Reports */}
            <Card>
              <CardHeader>
                <CardTitle>Available Reports ({filteredReportTypes.length})</CardTitle>
                <CardDescription>Select a report type to generate with current filters</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredReportTypes.map((report) => (
                    <Card key={report.id} className="hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="space-y-2">
                            <CardTitle className="text-lg">{report.name}</CardTitle>
                            <Badge className={getCategoryColor(report.category)} variant="secondary">
                              {report.category}
                            </Badge>
                          </div>
                          <FileText className="h-5 w-5 text-gray-500" />
                        </div>
                        <CardDescription>{report.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2 text-sm text-gray-600">
                          <p><strong>Frequency:</strong> {report.frequency}</p>
                          <p><strong>Last Generated:</strong> {report.lastGenerated}</p>
                        </div>
                        <div className="flex gap-2 mt-4">
                          <Button 
                            size="sm" 
                            className="flex-1"
                            onClick={() => generateReport(report)}
                          >
                            Generate Report
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Generated Reports History</CardTitle>
              <CardDescription>Download and manage previously generated reports</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Report Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Generated Date</TableHead>
                    <TableHead>Generated By</TableHead>
                    <TableHead>Format</TableHead>
                    <TableHead>Size</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockGeneratedReports.map((report) => (
                    <TableRow key={report.id}>
                      <TableCell className="font-medium">{report.name}</TableCell>
                      <TableCell>{report.type}</TableCell>
                      <TableCell>{report.generatedDate}</TableCell>
                      <TableCell>{report.generatedBy}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{report.format}</Badge>
                      </TableCell>
                      <TableCell>{report.size}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(report.status)} variant="secondary">
                          {report.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => previewReport(report)}
                            disabled={report.status !== 'Ready'}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => downloadReport(report)}
                            disabled={report.status !== 'Ready'}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Report Preview Modal */}
      <Dialog open={isPreviewModalOpen} onOpenChange={setIsPreviewModalOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>Report Preview</DialogTitle>
            <DialogDescription>
              {selectedReport?.name}
            </DialogDescription>
          </DialogHeader>
          
          {selectedReport && (
            <div className="space-y-4">
              <div className="border rounded-lg p-4 bg-gray-50">
                <h4 className="font-medium mb-2">Report Details:</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div><strong>Type:</strong> {selectedReport.type}</div>
                  <div><strong>Generated:</strong> {selectedReport.generatedDate}</div>
                  <div><strong>Format:</strong> {selectedReport.format}</div>
                  <div><strong>Size:</strong> {selectedReport.size}</div>
                </div>
              </div>
              
              <div className="border rounded-lg p-8 bg-white min-h-[400px] text-center">
                <FileText className="h-24 w-24 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-600">Report preview would be displayed here</p>
                <p className="text-sm text-gray-500 mt-2">
                  This is a placeholder for the actual report content
                </p>
              </div>
              
              <div className="flex gap-4">
                <Button 
                  className="flex-1"
                  onClick={() => downloadReport(selectedReport)}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download Report
                </Button>
                <Button 
                  className="flex-1" 
                  variant="outline"
                  onClick={() => setIsPreviewModalOpen(false)}
                >
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Dashboard Export Modal */}
      <Dialog open={isDashboardExportOpen} onOpenChange={setIsDashboardExportOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Export Dashboard Snapshot</DialogTitle>
            <DialogDescription>
              Export current dashboard KPIs and task panel as PDF
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium mb-2">Snapshot will include:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Current KPI values</li>
                <li>• Pending tasks list</li>
                <li>• Upcoming schedule</li>
                <li>• Generation timestamp</li>
              </ul>
            </div>
            
            <div className="flex gap-4">
              <Button 
                className="flex-1"
                onClick={() => {
                  console.log("Exporting dashboard snapshot");
                  setIsDashboardExportOpen(false);
                }}
              >
                <Download className="h-4 w-4 mr-2" />
                Export PDF
              </Button>
              <Button 
                className="flex-1" 
                variant="outline"
                onClick={() => setIsDashboardExportOpen(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Reports;