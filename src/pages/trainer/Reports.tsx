import { Download, FileText, Calendar, TrendingUp, BarChart3 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const Reports = () => {
  const reportTypes = [
    {
      id: 1,
      name: "Attendance Summary",
      description: "Comprehensive attendance report for candidates",
      icon: Calendar,
      lastGenerated: "2025-07-18",
      format: ["PDF", "Excel"]
    },
    {
      id: 2,
      name: "Curriculum Progress",
      description: "Module-wise completion status and progress tracking",
      icon: TrendingUp,
      lastGenerated: "2025-07-17",
      format: ["PDF", "Excel"]
    },
    {
      id: 3,
      name: "Assessment Results",
      description: "Detailed assessment scores and analysis",
      icon: BarChart3,
      lastGenerated: "2025-07-16",
      format: ["PDF", "Excel"]
    },
    {
      id: 4,
      name: "Feedback Summary",
      description: "Candidate feedback and performance ratings",
      icon: FileText,
      lastGenerated: "2025-07-15",
      format: ["PDF", "Excel"]
    }
  ];

  const previewData = {
    attendance: [
      { candidate: "Ravi Kumar", present: 18, absent: 2, percentage: 90 },
      { candidate: "Priya Sharma", present: 19, absent: 1, percentage: 95 },
      { candidate: "Amit Singh", present: 16, absent: 4, percentage: 80 },
      { candidate: "Sneha Patel", present: 20, absent: 0, percentage: 100 }
    ],
    curriculum: [
      { module: "Customer Service", total: 12, completed: 10, progress: 83 },
      { module: "Sales Techniques", total: 8, completed: 6, progress: 75 },
      { module: "Product Knowledge", total: 10, completed: 8, progress: 80 }
    ]
  };

  const handleGenerateReport = (reportId: number, format: string) => {
    console.log(`Generating report ${reportId} in ${format} format`);
    // Simulate report generation
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <h1 className="text-3xl font-bold">Reports & Analytics</h1>
        <div className="flex flex-col sm:flex-row gap-4">
          <Select defaultValue="rsd-101">
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder="Select Batch" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="rsd-101">Batch RSD-101</SelectItem>
              <SelectItem value="css-102">Batch CSS-102</SelectItem>
              <SelectItem value="bfs-103">Batch BFS-103</SelectItem>
            </SelectContent>
          </Select>
          <DateRangePicker dateRange={{ from: undefined, to: undefined }} onDateRangeChange={() => {}} />
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Reports Generated</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Attendance</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">91%</div>
            <p className="text-xs text-muted-foreground">Current batch</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Curriculum Progress</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">79%</div>
            <p className="text-xs text-muted-foreground">Overall completion</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Assessment Avg</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">84%</div>
            <p className="text-xs text-muted-foreground">All assessments</p>
          </CardContent>
        </Card>
      </div>

      {/* Report Types */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {reportTypes.map((report) => (
          <Card key={report.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <report.icon className="h-5 w-5" />
                {report.name}
              </CardTitle>
              <p className="text-sm text-muted-foreground">{report.description}</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Last Generated:</span>
                <span>{report.lastGenerated}</span>
              </div>
              <div className="flex gap-2">
                {report.format.map((format) => (
                  <Button 
                    key={format}
                    size="sm" 
                    variant="outline"
                    onClick={() => handleGenerateReport(report.id, format)}
                  >
                    <Download className="h-4 w-4 mr-1" />
                    {format}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Report Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Attendance Preview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Attendance Summary Preview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Candidate</TableHead>
                  <TableHead>Present</TableHead>
                  <TableHead>Absent</TableHead>
                  <TableHead>Percentage</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {previewData.attendance.map((record, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{record.candidate}</TableCell>
                    <TableCell>{record.present}</TableCell>
                    <TableCell>{record.absent}</TableCell>
                    <TableCell>
                      <Badge variant={record.percentage >= 80 ? "default" : "destructive"}>
                        {record.percentage}%
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Curriculum Progress Preview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Curriculum Progress Preview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {previewData.curriculum.map((module, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{module.module}</span>
                    <span className="text-sm text-muted-foreground">
                      {module.completed}/{module.total} sessions
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full" 
                        style={{ width: `${module.progress}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium">{module.progress}%</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Export Options */}
      <Card>
        <CardHeader>
          <CardTitle>Bulk Export Options</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <Button className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Export All Reports (ZIP)
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Generate Custom Report
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Schedule Report
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Reports;