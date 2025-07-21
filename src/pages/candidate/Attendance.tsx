import { Calendar, Clock, TrendingUp, CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const Attendance = () => {
  const attendanceStats = [
    { label: "Overall Attendance", value: "92%", icon: TrendingUp },
    { label: "Days Present", value: "23/25", icon: CheckCircle },
    { label: "Current Streak", value: "7 days", icon: Calendar },
    { label: "This Month", value: "18/20", icon: Clock },
  ];

  const attendanceData = [
    { date: "2025-07-21", status: "present", session: "Morning Session", checkIn: "09:00 AM", checkOut: "05:00 PM" },
    { date: "2025-07-20", status: "present", session: "Morning Session", checkIn: "09:15 AM", checkOut: "05:00 PM" },
    { date: "2025-07-19", status: "present", session: "Morning Session", checkIn: "08:45 AM", checkOut: "05:00 PM" },
    { date: "2025-07-18", status: "absent", session: "Morning Session", checkIn: "-", checkOut: "-" },
    { date: "2025-07-17", status: "present", session: "Morning Session", checkIn: "09:00 AM", checkOut: "05:00 PM" },
    { date: "2025-07-16", status: "present", session: "Morning Session", checkIn: "09:10 AM", checkOut: "05:15 PM" },
    { date: "2025-07-15", status: "present", session: "Morning Session", checkIn: "08:50 AM", checkOut: "05:00 PM" },
    { date: "2025-07-14", status: "present", session: "Morning Session", checkIn: "09:05 AM", checkOut: "05:10 PM" },
    { date: "2025-07-13", status: "present", session: "Morning Session", checkIn: "09:00 AM", checkOut: "05:00 PM" },
    { date: "2025-07-12", status: "late", session: "Morning Session", checkIn: "09:30 AM", checkOut: "05:00 PM" },
  ];

  const monthlyView = Array.from({ length: 31 }, (_, i) => {
    const day = i + 1;
    const isPresent = Math.random() > 0.2; // 80% attendance simulation
    const isWeekend = [6, 7, 13, 14, 20, 21, 27, 28].includes(day);
    
    return {
      day,
      status: isWeekend ? 'weekend' : (isPresent ? 'present' : 'absent'),
      isToday: day === 21
    };
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "present": return "default";
      case "absent": return "destructive";
      case "late": return "secondary";
      default: return "outline";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "present": return "✓";
      case "absent": return "✗";
      case "late": return "⏰";
      default: return "-";
    }
  };

  const getDayColor = (status: string, isToday: boolean) => {
    if (isToday) return "bg-blue-500 text-white";
    switch (status) {
      case "present": return "bg-green-100 text-green-800";
      case "absent": return "bg-red-100 text-red-800";
      case "weekend": return "bg-gray-100 text-gray-600";
      default: return "bg-white";
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <h1 className="text-3xl font-bold">My Attendance</h1>
        <Button variant="outline">
          Download Attendance Report
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {attendanceStats.map((stat, index) => (
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

      {/* Monthly Calendar View */}
      <Card>
        <CardHeader>
          <CardTitle>July 2025 - Monthly Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-7 gap-2 mb-4">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <div key={day} className="p-2 text-center font-medium text-sm text-muted-foreground">
                  {day}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-2">
              {monthlyView.map((day) => (
                <div 
                  key={day.day}
                  className={`
                    p-3 text-center rounded border cursor-pointer transition-colors
                    ${getDayColor(day.status, day.isToday)}
                    hover:opacity-80
                  `}
                >
                  <div className="text-sm font-medium">{day.day}</div>
                  <div className="text-xs mt-1">
                    {getStatusIcon(day.status)}
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-100 rounded"></div>
                <span>Present</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-red-100 rounded"></div>
                <span>Absent</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-gray-100 rounded"></div>
                <span>Weekend</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-blue-500 rounded"></div>
                <span>Today</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Attendance Log */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Attendance Log</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {attendanceData.map((record, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <div className="font-medium">{record.date}</div>
                    <div className="text-sm text-muted-foreground">{record.session}</div>
                  </div>
                  <Badge variant={getStatusColor(record.status)}>
                    {record.status}
                  </Badge>
                </div>
                
                <div className="flex items-center gap-6 text-sm">
                  <div>
                    <div className="font-medium">Check In</div>
                    <div className="text-muted-foreground">{record.checkIn}</div>
                  </div>
                  <div>
                    <div className="font-medium">Check Out</div>
                    <div className="text-muted-foreground">{record.checkOut}</div>
                  </div>
                  {record.status === "present" && (
                    <div>
                      <div className="font-medium">Hours</div>
                      <div className="text-muted-foreground">8h 0m</div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Attendance Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Weekly Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"].map((day, index) => {
                const percentage = [95, 88, 92, 96, 85][index];
                return (
                  <div key={day} className="flex items-center justify-between">
                    <span className="font-medium">{day}</span>
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full" 
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium">{percentage}%</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Attendance Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="font-medium text-yellow-800">Reminder</div>
                <div className="text-sm text-yellow-700">
                  Maintain 80% attendance for course completion certificate
                </div>
              </div>
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="font-medium text-green-800">Good Job!</div>
                <div className="text-sm text-green-700">
                  You're currently exceeding the minimum attendance requirement
                </div>
              </div>
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="font-medium text-blue-800">Tip</div>
                <div className="text-sm text-blue-700">
                  Regular attendance helps in better skill development and placement opportunities
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Attendance;