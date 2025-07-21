import { TrendingUp, BookOpen, Clock, CheckCircle, Star } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

const TrainingProgress = () => {
  const progressStats = [
    { label: "Overall Progress", value: 65, icon: TrendingUp },
    { label: "Modules Completed", value: "3/5", icon: BookOpen },
    { label: "Attendance Rate", value: "92%", icon: Clock },
    { label: "Assessments Passed", value: "8/10", icon: CheckCircle },
  ];

  const modules = [
    {
      id: 1,
      name: "Customer Service Fundamentals",
      progress: 100,
      status: "completed",
      sessions: 12,
      completedSessions: 12,
      grade: "A",
      startDate: "2025-06-01",
      completionDate: "2025-06-15"
    },
    {
      id: 2,
      name: "Product Knowledge",
      progress: 100,
      status: "completed",
      sessions: 8,
      completedSessions: 8,
      grade: "B+",
      startDate: "2025-06-16",
      completionDate: "2025-06-25"
    },
    {
      id: 3,
      name: "Sales Techniques",
      progress: 80,
      status: "in-progress",
      sessions: 10,
      completedSessions: 8,
      grade: "Pending",
      startDate: "2025-06-26",
      completionDate: "Expected: 2025-07-20"
    },
    {
      id: 4,
      name: "Communication Skills",
      progress: 30,
      status: "in-progress",
      sessions: 6,
      completedSessions: 2,
      grade: "Pending",
      startDate: "2025-07-15",
      completionDate: "Expected: 2025-07-25"
    },
    {
      id: 5,
      name: "Placement Preparation",
      progress: 0,
      status: "upcoming",
      sessions: 8,
      completedSessions: 0,
      grade: "Not Started",
      startDate: "2025-08-01",
      completionDate: "Expected: 2025-08-15"
    }
  ];

  const recentActivities = [
    { date: "2025-07-19", activity: "Completed Session: Advanced Sales Techniques", type: "session" },
    { date: "2025-07-18", activity: "Assessment Submitted: Product Knowledge Test", type: "assessment" },
    { date: "2025-07-17", activity: "Attended Workshop: Customer Handling", type: "workshop" },
    { date: "2025-07-16", activity: "Video Log Reviewed: Role Play Exercise", type: "video" },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "default";
      case "in-progress": return "secondary";
      default: return "outline";
    }
  };

  const getGradeColor = (grade: string) => {
    if (grade.startsWith("A")) return "text-green-600";
    if (grade.startsWith("B")) return "text-blue-600";
    if (grade.startsWith("C")) return "text-yellow-600";
    return "text-gray-600";
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <h1 className="text-3xl font-bold">Training Progress</h1>
        <Button variant="outline">
          Download Progress Report
        </Button>
      </div>

      {/* Progress Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {progressStats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.label}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Overall Progress */}
      <Card>
        <CardHeader>
          <CardTitle>Course Progress Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-lg font-medium">Retail Sales Development Course</span>
              <span className="text-2xl font-bold">65%</span>
            </div>
            <Progress value={65} className="h-3" />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Started: June 1, 2025</span>
              <span>Expected Completion: August 31, 2025</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Modules Progress */}
      <Card>
        <CardHeader>
          <CardTitle>Module-wise Progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {modules.map((module) => (
              <Card key={module.id}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="font-semibold">{module.name}</h3>
                      <div className="text-sm text-muted-foreground">
                        {module.completedSessions}/{module.sessions} sessions completed
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant={getStatusColor(module.status)}>
                        {module.status.replace("-", " ")}
                      </Badge>
                      <div className={`text-sm font-medium mt-1 ${getGradeColor(module.grade)}`}>
                        Grade: {module.grade}
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Progress</span>
                      <span className="text-sm font-medium">{module.progress}%</span>
                    </div>
                    <Progress value={module.progress} className="h-2" />
                  </div>

                  <div className="flex justify-between text-xs text-muted-foreground mt-2">
                    <span>Started: {module.startDate}</span>
                    <span>{module.completionDate}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activities */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activities</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentActivities.map((activity, index) => (
              <div key={index} className="flex items-center gap-3 p-3 border rounded-lg">
                <div className="flex-shrink-0">
                  {activity.type === "session" && <BookOpen className="h-5 w-5 text-blue-500" />}
                  {activity.type === "assessment" && <CheckCircle className="h-5 w-5 text-green-500" />}
                  {activity.type === "workshop" && <Star className="h-5 w-5 text-purple-500" />}
                  {activity.type === "video" && <div className="h-5 w-5 text-orange-500">🎥</div>}
                </div>
                <div className="flex-1">
                  <div className="font-medium">{activity.activity}</div>
                  <div className="text-sm text-muted-foreground">{activity.date}</div>
                </div>
                <Badge variant="outline">
                  {activity.type}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TrainingProgress;