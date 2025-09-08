import { useState } from "react";
import { Book, Users, Clock, TrendingUp, Calendar, CheckCircle, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface CurriculumProgressCardProps {
  userRole: 'center-manager' | 'state-head';
}

const CurriculumProgressCard = ({ userRole }: CurriculumProgressCardProps) => {
  const [selectedTimeframe, setSelectedTimeframe] = useState("current");

  const curriculumProgress = [
    {
      id: 1,
      title: "Retail Sales Foundation",
      centers: userRole === 'state-head' ? 12 : 1,
      totalStudents: userRole === 'state-head' ? 450 : 28,
      completedStudents: userRole === 'state-head' ? 315 : 18,
      avgProgress: userRole === 'state-head' ? 75 : 64,
      startDate: "2025-01-15",
      expectedCompletion: "2025-02-28",
      status: "active",
      weeklyProgress: 8.5,
      atRiskStudents: userRole === 'state-head' ? 25 : 3,
      completedModules: 5,
      totalModules: 8
    },
    {
      id: 2,
      title: "Customer Service Excellence",
      centers: userRole === 'state-head' ? 8 : 1,
      totalStudents: userRole === 'state-head' ? 320 : 25,
      completedStudents: userRole === 'state-head' ? 192 : 15,
      avgProgress: userRole === 'state-head' ? 60 : 55,
      startDate: "2025-01-12",
      expectedCompletion: "2025-02-25",
      status: "active",
      weeklyProgress: 7.2,
      atRiskStudents: userRole === 'state-head' ? 18 : 4,
      completedModules: 3,
      totalModules: 6
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-800";
      case "delayed": return "bg-red-100 text-red-800";
      case "completed": return "bg-blue-100 text-blue-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return "bg-green-500";
    if (progress >= 60) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <Card className="col-span-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Book className="h-5 w-5" />
            Curriculum Progress Tracking
          </CardTitle>
          <div className="flex gap-2">
            <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
              <SelectTrigger className="w-[150px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="current">Current Month</SelectItem>
                <SelectItem value="quarter">This Quarter</SelectItem>
                <SelectItem value="year">This Year</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm">
              <Calendar className="h-4 w-4 mr-2" />
              View Schedule
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {curriculumProgress.map((curriculum) => (
            <div key={curriculum.id} className="border rounded-lg p-4 space-y-4">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <h4 className="font-medium text-lg">{curriculum.title}</h4>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      {curriculum.totalStudents} students
                    </span>
                    {userRole === 'state-head' && (
                      <span className="flex items-center gap-1">
                        <Book className="h-4 w-4" />
                        {curriculum.centers} centers
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {curriculum.completedModules}/{curriculum.totalModules} modules
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={getStatusColor(curriculum.status)}>
                    {curriculum.status}
                  </Badge>
                  <Badge variant="outline">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    +{curriculum.weeklyProgress}% this week
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Overall Progress</span>
                    <span className="font-medium">{curriculum.avgProgress}%</span>
                  </div>
                  <Progress 
                    value={curriculum.avgProgress} 
                    className="h-3"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Completion Rate</span>
                    <span className="font-medium">
                      {Math.round((curriculum.completedStudents / curriculum.totalStudents) * 100)}%
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {curriculum.completedStudents}/{curriculum.totalStudents} students completed
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-red-600">At Risk Students</span>
                    <span className="font-medium text-red-600">{curriculum.atRiskStudents}</span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Students with &lt;60% progress
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Expected Completion</span>
                    <span className="font-medium">{curriculum.expectedCompletion}</span>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Started: {curriculum.startDate}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t">
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-1 text-green-600">
                    <CheckCircle className="h-4 w-4" />
                    <span>{curriculum.completedStudents} completed</span>
                  </div>
                  <div className="flex items-center gap-1 text-red-600">
                    <AlertTriangle className="h-4 w-4" />
                    <span>{curriculum.atRiskStudents} at risk</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">
                    View Details
                  </Button>
                  <Button size="sm" variant="outline">
                    Student Progress
                  </Button>
                  {userRole === 'state-head' && (
                    <Button size="sm" variant="outline">
                      Center Comparison
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 p-4 bg-muted/50 rounded-lg">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {curriculumProgress.reduce((sum, curr) => sum + curr.completedStudents, 0)}
            </div>
            <div className="text-sm text-muted-foreground">Students Completed</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {Math.round(curriculumProgress.reduce((sum, curr) => sum + curr.avgProgress, 0) / curriculumProgress.length)}%
            </div>
            <div className="text-sm text-muted-foreground">Avg Progress</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">
              {curriculumProgress.reduce((sum, curr) => sum + curr.atRiskStudents, 0)}
            </div>
            <div className="text-sm text-muted-foreground">At Risk Students</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {userRole === 'state-head' 
                ? curriculumProgress.reduce((sum, curr) => sum + curr.centers, 0)
                : curriculumProgress.length
              }
            </div>
            <div className="text-sm text-muted-foreground">
              {userRole === 'state-head' ? 'Total Centers' : 'Active Programs'}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CurriculumProgressCard;