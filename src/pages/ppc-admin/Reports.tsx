import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { DateRange } from "react-day-picker";
import { CalendarIcon, FileText, Download, Send, Clock, Plus, Eye } from "lucide-react";
import { format } from "date-fns";

const Reports = () => {
  const [isScheduleOpen, setIsScheduleOpen] = useState(false);
  const [dateRange, setDateRange] = useState<DateRange | undefined>();

  const reportTypes = [
    {
      name: "Pre-Placement Compliance",
      description: "Counselling, Assessment, and Declaration status",
      lastGenerated: "2025-07-20",
      recipients: 3
    },
    {
      name: "Post-Placement Welfare",
      description: "Travel, Hostel, and Groceries tracking",
      lastGenerated: "2025-07-19",
      recipients: 2
    },
    {
      name: "SOS Actions Summary",
      description: "All SOS requests and resolution status",
      lastGenerated: "2025-07-21",
      recipients: 5
    },
    {
      name: "POC Visit Summary",
      description: "POC visit reports and effectiveness",
      lastGenerated: "2025-07-18",
      recipients: 2
    }
  ];

  const scheduledReports = [
    {
      reportName: "Pre-Placement Compliance",
      frequency: "Weekly",
      nextRun: "2025-07-28",
      recipients: ["admin@lnj.com", "manager@lnj.com"],
      status: "Active"
    },
    {
      reportName: "SOS Actions Summary", 
      frequency: "Daily",
      nextRun: "2025-07-22",
      recipients: ["ppc-head@lnj.com", "sos-team@lnj.com"],
      status: "Active"
    },
    {
      reportName: "POC Visit Summary",
      frequency: "Monthly",
      nextRun: "2025-08-01",
      recipients: ["poc-manager@lnj.com"],
      status: "Paused"
    }
  ];

  const generateReport = (reportName: string) => {
    // Mock report generation
    console.log(`Generating ${reportName} report...`);
  };

  const previewReport = (reportName: string) => {
    // Mock report preview
    console.log(`Previewing ${reportName} report...`);
  };

  return (
    <div className="p-6 space-y-6 bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
          <p className="text-gray-600">Generate and schedule compliance reports</p>
        </div>
        <Button className="bg-purple-600 hover:bg-purple-700">
          <Download className="w-4 h-4 mr-2" />
          Export Dashboard Snapshot
        </Button>
      </div>

      <Tabs defaultValue="reports-library" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="reports-library">Reports Library</TabsTrigger>
          <TabsTrigger value="scheduled-reports">Scheduled Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="reports-library">
          <div className="space-y-6">
            {/* Report Filters */}
            <Card>
              <CardHeader>
                <CardTitle>Report Filters</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select State" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="karnataka">Karnataka</SelectItem>
                      <SelectItem value="maharashtra">Maharashtra</SelectItem>
                      <SelectItem value="delhi">Delhi</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Centre" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="center-a">Bangalore Center A</SelectItem>
                      <SelectItem value="center-b">Mumbai Center B</SelectItem>
                      <SelectItem value="center-c">Delhi Center C</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Company" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="techcorp">TechCorp India</SelectItem>
                      <SelectItem value="retailmax">RetailMax Ltd</SelectItem>
                      <SelectItem value="servicepro">ServicePro Pvt</SelectItem>
                    </SelectContent>
                  </Select>

                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="justify-start text-left font-normal">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dateRange?.from ? (
                          dateRange.to ? (
                            <>
                              {format(dateRange.from, "LLL dd, y")} -{" "}
                              {format(dateRange.to, "LLL dd, y")}
                            </>
                          ) : (
                            format(dateRange.from, "LLL dd, y")
                          )
                        ) : (
                          <span>Pick a date range</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        initialFocus
                        mode="range"
                        defaultMonth={dateRange?.from}
                        selected={dateRange}
                        onSelect={setDateRange}
                        numberOfMonths={2}
                      />
                    </PopoverContent>
                  </Popover>

                  <Button className="bg-purple-600 hover:bg-purple-700">
                    Apply Filters
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Available Reports */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {reportTypes.map((report, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{report.name}</CardTitle>
                        <p className="text-sm text-gray-600 mt-1">{report.description}</p>
                      </div>
                      <FileText className="w-6 h-6 text-purple-600" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span>Last Generated:</span>
                        <span className="text-gray-600">{report.lastGenerated}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Recipients:</span>
                        <Badge variant="secondary">{report.recipients}</Badge>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => previewReport(report.name)}
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          Preview
                        </Button>
                        <Button 
                          size="sm" 
                          className="bg-purple-600 hover:bg-purple-700"
                          onClick={() => generateReport(report.name)}
                        >
                          <Download className="w-4 h-4 mr-1" />
                          Generate
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Export Options */}
            <Card>
              <CardHeader>
                <CardTitle>Export Options</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4">
                  <Button variant="outline">
                    <FileText className="w-4 h-4 mr-2" />
                    Export as PDF
                  </Button>
                  <Button variant="outline">
                    <FileText className="w-4 h-4 mr-2" />
                    Export as Excel
                  </Button>
                  <Button variant="outline">
                    <Send className="w-4 h-4 mr-2" />
                    Email Report
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="scheduled-reports">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Scheduled Reports
                </CardTitle>
                <Dialog open={isScheduleOpen} onOpenChange={setIsScheduleOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-purple-600 hover:bg-purple-700">
                      <Plus className="w-4 h-4 mr-2" />
                      Schedule Report
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>Schedule New Report</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="reportType">Report Type</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select report type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pre-placement">Pre-Placement Compliance</SelectItem>
                            <SelectItem value="post-placement">Post-Placement Welfare</SelectItem>
                            <SelectItem value="sos">SOS Actions Summary</SelectItem>
                            <SelectItem value="poc">POC Visit Summary</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="frequency">Frequency</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select frequency" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="daily">Daily</SelectItem>
                            <SelectItem value="weekly">Weekly</SelectItem>
                            <SelectItem value="monthly">Monthly</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="recipients">Recipient Emails (comma-separated)</Label>
                        <Input 
                          id="recipients" 
                          placeholder="email1@company.com, email2@company.com"
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button className="flex-1 bg-purple-600 hover:bg-purple-700">
                          Schedule Report
                        </Button>
                        <Button variant="outline" onClick={() => setIsScheduleOpen(false)}>
                          Cancel
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Report Name</TableHead>
                      <TableHead>Frequency</TableHead>
                      <TableHead>Next Run</TableHead>
                      <TableHead>Recipients</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {scheduledReports.map((report, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-semibold">{report.reportName}</TableCell>
                        <TableCell>{report.frequency}</TableCell>
                        <TableCell>{report.nextRun}</TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            {report.recipients.map((email, idx) => (
                              <Badge key={idx} variant="outline" className="text-xs">
                                {email}
                              </Badge>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={report.status === "Active" ? "default" : "secondary"}>
                            {report.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">Edit</Button>
                            <Button 
                              size="sm" 
                              variant={report.status === "Active" ? "outline" : "default"}
                            >
                              {report.status === "Active" ? "Pause" : "Resume"}
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Reports;