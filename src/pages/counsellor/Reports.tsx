import { useState } from "react";
import { MainLayout } from "@/layouts/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DateRange } from "react-day-picker";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { Download, Play, FileSpreadsheet, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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
  const [selectedCentre, setSelectedCentre] = useState("");
  const [selectedBatch, setSelectedBatch] = useState("");
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [runningReport, setRunningReport] = useState<string>("");
  const [reportData, setReportData] = useState<any[]>([]);
  const { toast } = useToast();

  const handleRunReport = (reportName: string) => {
    setRunningReport(reportName);
    // Simulate API call
    setTimeout(() => {
      setReportData(mockReportData);
      setRunningReport("");
      toast({
        title: "Report Generated",
        description: `${reportName} has been generated successfully.`,
      });
    }, 2000);
  };

  const handleExport = (format: string) => {
    toast({
      title: "Export Started",
      description: `Report export in ${format} format has been initiated.`,
    });
  };

  return (
    <MainLayout role="counsellor">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-3xl font-bold text-primary">Reports & Analytics</h1>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Report Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
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
          </CardContent>
        </Card>

        {/* Report Categories */}
        <div className="grid gap-6">
          {reportCategories.map((category) => (
            <Card key={category.title}>
              <CardHeader>
                <CardTitle>{category.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {category.reports.map((report) => (
                    <div key={report.name} className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <h4 className="font-medium">{report.name}</h4>
                        <p className="text-sm text-muted-foreground">{report.description}</p>
                      </div>
                      <Button
                        onClick={() => handleRunReport(report.name)}
                        disabled={runningReport === report.name}
                        size="sm"
                      >
                        <Play className="h-4 w-4 mr-2" />
                        {runningReport === report.name ? "Running..." : "Run"}
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Report Preview */}
        {reportData.length > 0 && (
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Report Preview</CardTitle>
                <div className="flex gap-2">
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
                      <TableCell>{item.placementStatus}</TableCell>
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