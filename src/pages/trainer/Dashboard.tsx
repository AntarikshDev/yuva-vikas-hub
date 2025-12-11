import { Calendar, Clock, Upload, FileText, TrendingUp, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { useGetTrainerDashboardQuery } from "@/store/api/apiSlice";
import { useState } from "react";

// Mock data for fallback
const mockKpis = [
  { label: "Sessions Scheduled Today", value: "3", icon: "Calendar" },
  { label: "Attendance Marked", value: "80%", icon: "Users" },
  { label: "Video Logs Pending", value: "2", icon: "Upload" },
  { label: "Assessments Pending", value: "5", icon: "FileText" },
  { label: "Curriculum Completion", value: "65%", icon: "TrendingUp" },
  { label: "Parent Interactions", value: "1", icon: "Clock" },
];

const mockPendingTasks = [
  { id: 1, task: "Mark attendance for Batch RSD-101", priority: "high" },
  { id: 2, task: "Upload Video Log for Session Y", priority: "medium" },
  { id: 3, task: "Evaluate Assessment for Candidate Z", priority: "high" },
  { id: 4, task: "Complete feedback for 3 candidates", priority: "low" },
];

const mockUpcomingSchedule = [
  { date: "2025-07-19", session: "Retail Sales – Customer Interaction Role Play", time: "10:00 AM" },
  { date: "2025-07-20", session: "Soft Skills – Communication Training", time: "2:00 PM" },
  { date: "2025-07-21", session: "Technical Skills – POS System", time: "11:00 AM" },
];

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Calendar,
  Users,
  Upload,
  FileText,
  TrendingUp,
  Clock
};

const Dashboard = () => {
  const [selectedBatch, setSelectedBatch] = useState("rsd-101");

  // RTK Query with mock fallback
  const { data: apiData, isLoading, error } = useGetTrainerDashboardQuery({ batchId: selectedBatch });

  let kpis: typeof mockKpis;
  let pendingTasks: typeof mockPendingTasks;
  let upcomingSchedule: typeof mockUpcomingSchedule;

  if (!apiData) {
    kpis = mockKpis;
    pendingTasks = mockPendingTasks;
    upcomingSchedule = mockUpcomingSchedule;
  } else {
    kpis = apiData.kpis || apiData.data?.kpis || mockKpis;
    pendingTasks = apiData.pendingTasks || apiData.data?.pendingTasks || mockPendingTasks;
    upcomingSchedule = apiData.upcomingSchedule || apiData.data?.upcomingSchedule || mockUpcomingSchedule;
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "destructive";
      case "medium": return "secondary";
      default: return "outline";
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <h1 className="text-3xl font-bold">Trainer Dashboard</h1>
        <div className="flex flex-col sm:flex-row gap-4">
          <Select value={selectedBatch} onValueChange={setSelectedBatch}>
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {kpis.map((kpi: any, index: number) => {
          const Icon = iconMap[kpi.icon] || Calendar;
          return (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {kpi.label}
                </CardTitle>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{kpi.value}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Pending Tasks
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {pendingTasks.map((task: any) => (
              <div key={task.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Badge variant={getPriorityColor(task.priority) as any}>
                    {task.priority}
                  </Badge>
                  <span className="text-sm">{task.task}</span>
                </div>
                <Button size="sm" variant="outline">
                  Action
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Upcoming Schedule
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {upcomingSchedule.map((schedule: any, index: number) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 cursor-pointer">
                <div>
                  <div className="font-medium">{schedule.session}</div>
                  <div className="text-sm text-muted-foreground">
                    {schedule.date} at {schedule.time}
                  </div>
                </div>
                <Button size="sm" variant="outline">
                  View Details
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Button className="h-20 flex-col gap-2">
          <Users className="h-6 w-6" />
          Mark Attendance
        </Button>
        <Button variant="outline" className="h-20 flex-col gap-2">
          <Upload className="h-6 w-6" />
          Upload Video Log
        </Button>
        <Button variant="outline" className="h-20 flex-col gap-2">
          <FileText className="h-6 w-6" />
          View Assessments
        </Button>
        <Button variant="outline" className="h-20 flex-col gap-2">
          <Calendar className="h-6 w-6" />
          View Schedule
        </Button>
      </div>
    </div>
  );
};

export default Dashboard;
