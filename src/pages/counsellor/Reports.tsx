import { useState } from "react";
import { MainLayout } from "@/layouts/MainLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DateRange } from "react-day-picker";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { Download, Eye, FileSpreadsheet, FileText, Calendar, BarChart2, TrendingUp, PieChart, Filter } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

const reportCategories = [
  {
    title: "Mobilisation Reports",
    reports: [
      { name: "Candidate Registration Report", description: "List of all registered candidates" },
      { name: "Source-wise Mobilisation", description: "Candidates by mobilisation source" },
      { name: "Weekly Mobilisation Summary", description: "Weekly registration trends" }
    ]
  },
  {
    title: "Enrollment Reports", 
    reports: [
      { name: "Batch Enrollment Report", description: "Enrollment details by batch" },
      { name: "Course-wise Enrollment", description: "Enrollment by course type" },
      { name: "Enrollment vs Target", description: "Achievement against targets" }
    ]
  },
  {
    title: "Attendance Reports",
    reports: [
      { name: "Daily Attendance Report", description: "Day-wise attendance details" },
      { name: "Low Attendance Alert", description: "Candidates with poor attendance" },
      { name: "Trainer Attendance Summary", description: "Trainer attendance overview" }
    ]
  },
  {
    title: "Placement Reports",
    reports: [
      { name: "Placement Summary Report", description: "Overall placement statistics" },
      { name: "Employer-wise Placements", description: "Placements by employer" },
      { name: "Salary Distribution Report", description: "Placement salary analysis" }
    ]
  },
  {
    title: "Post-Placement Reports",
    reports: [
      { name: "Retention Report", description: "Job retention statistics" },
      { name: "Follow-up Status", description: "Post-placement follow-up status" },
      { name: "Career Progression", description: "Career growth tracking" }
    ]
  }
];

const mockReportData = [
  { id: 1, candidateName: "Rajesh Kumar", batch: "Batch 2025-01", course: "Retail", placementStatus: "Placed", salary: "15000" },
  { id: 2, candidateName: "Priya Sharma", batch: "Batch 2025-01", course: "IT-ITeS", placementStatus: "Pending", salary: "-" },
  { id: 3, candidateName: "Amit Singh", batch: "Batch 2025-02", course: "Healthcare", placementStatus: "Placed", salary: "18000" },
  { id: 4, candidateName: "Sunita Devi", batch: "Batch 2025-01", course: "Retail", placementStatus: "Placed", salary: "16000" },
  { id: 5, candidateName: "Vikash Yadav", batch: "Batch 2025-02", course: "Construction", placementStatus: "Pending", salary: "-" }
];

export default function CounsellorReports() {
  const [selectedTab, setSelectedTab] = useState("mobilisation");
  const [selectedCentre, setSelectedCentre] = useState("all");
  const [selectedBatch, setSelectedBatch] = useState("all");
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [loadingReport, setLoadingReport] = useState<string | null>(null);
  const [activeReport, setActiveReport] = useState<string | null>(null);
  const [reportData, setReportData] = useState<any[]>([]);
  const { toast } = useToast();

  const handleViewReport = (reportName: string) => {
    setLoadingReport(reportName);
    // Simulate API call
    setTimeout(() => {
      setReportData(mockReportData);
      setLoadingReport(null);
      setActiveReport(reportName);
      toast({
        title: "Report Loaded",
        description: `${reportName} has been loaded successfully.`,
      });
    }, 1500);
  };

  const handleExport = (format: string) => {
    toast({
      title: "Export Started",
      description: `Report export in ${format} format has been initiated.`,
    });
  };

  // Find the currently selected category based on tab
  const getCurrentCategory = () => {
    switch(selectedTab) {
      case "mobilisation": return reportCategories[0];
      case "enrollment": return reportCategories[1];
      case "attendance": return reportCategories[2];
      case "placement": return reportCategories[3];
      case "post-placement": return reportCategories[4];
      default: return reportCategories[0];
    }
  };

  return (
    <MainLayout role="counsellor">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-primary">Reports & Analytics</h1>
            <p className="text-muted-foreground mt-1">View and analyze candidate performance and outcomes</p>
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Calendar className="h-4 w-4 mr-2" />
              Schedule Reports
            </Button>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Saved Filters
            </Button>
          </div>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Report Filters</CardTitle>
            <CardDescription>Narrow down your report data with these filters</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <Select value={selectedCentre} onValueChange={setSelectedCentre}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Select Centre" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Centres</SelectItem>
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
                  <SelectItem value="all">All Batches</SelectItem>
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

              <Button variant="secondary" className="ml-auto">
                Apply Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Report Categories as Tabs */}
        <Tabs defaultValue="mobilisation" value={selectedTab} onValueChange={setSelectedTab} className="w-full">
          <TabsList className="grid grid-cols-5 mb-6">
            <TabsTrigger value="mobilisation">Mobilisation</TabsTrigger>
            <TabsTrigger value="enrollment">Enrollment</TabsTrigger>
            <TabsTrigger value="attendance">Attendance</TabsTrigger>
            <TabsTrigger value="placement">Placement</TabsTrigger>
            <TabsTrigger value="post-placement">Post-Placement</TabsTrigger>
          </TabsList>

          {/* Reports grid for the selected category */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {getCurrentCategory().reports.map((report) => (
              <Card key={report.name} className={`border ${activeReport === report.name ? 'border-primary shadow-md' : ''}`}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{report.name}</CardTitle>
                    {activeReport === report.name && <Badge variant="outline" className="bg-primary/10">Active</Badge>}
                  </div>
                  <CardDescription>{report.description}</CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex justify-between items-center mt-4">
                    <div className="flex gap-1 items-center text-sm text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      <span>Updated daily</span>
                    </div>
                    <Button 
                      onClick={() => handleViewReport(report.name)}
                      disabled={loadingReport === report.name}
                      size="sm"
                      variant={activeReport === report.name ? "default" : "outline"}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      {loadingReport === report.name ? "Loading..." : "View Report"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </Tabs>

        {/* Report Visualization */}
        {activeReport && (
          <Card className="mt-8">
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="flex items-center">
                    {activeReport}
                    <Badge className="ml-3" variant="outline">
                      {selectedCentre === "all" ? "All Centres" : selectedCentre}
                    </Badge>
                    <Badge className="ml-2" variant="outline">
                      {selectedBatch === "all" ? "All Batches" : selectedBatch}
                    </Badge>
                  </CardTitle>
                  <CardDescription>Last updated: Today at 09:15 AM</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <BarChart2 className="h-4 w-4 mr-2" />
                    Charts
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleExport("CSV")}>
                    <FileSpreadsheet className="h-4 w-4 mr-2" />
                    Export CSV
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleExport("PDF")}>
                    <FileText className="h-4 w-4 mr-2" />
                    Export PDF
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Candidate Name</TableHead>
                    <TableHead>Batch</TableHead>
                    <TableHead>Course</TableHead>
                    <TableHead>Placement Status</TableHead>
                    <TableHead>Salary</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reportData.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.candidateName}</TableCell>
                      <TableCell>{item.batch}</TableCell>
                      <TableCell>{item.course}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={`${item.placementStatus === "Placed" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}>
                          {item.placementStatus}
                        </Badge>
                      </TableCell>
                      <TableCell>{item.salary !== "-" ? `₹${item.salary}` : item.salary}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
      </div>
    </MainLayout>
  );
}