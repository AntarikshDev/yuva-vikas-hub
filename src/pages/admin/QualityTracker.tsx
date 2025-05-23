
import React from 'react';
import { MainLayout } from '@/layouts/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, FileCheck, Video, Clock, User, BarChart3, PieChart, LineChart } from 'lucide-react';
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const QualityTracker = () => {
  // Dummy data for center quality comparison
  const centerQualityData = [
    {
      center: 'Delhi Center',
      counselling: 92,
      videoCompletion: 85,
      documentation: 78,
      placement: 88
    },
    {
      center: 'Mumbai Center',
      counselling: 85,
      videoCompletion: 90,
      documentation: 82,
      placement: 80
    },
    {
      center: 'Bangalore Center',
      counselling: 88,
      videoCompletion: 75,
      documentation: 90,
      placement: 85
    },
    {
      center: 'Chennai Center',
      counselling: 80,
      videoCompletion: 82,
      documentation: 75,
      placement: 70
    },
    {
      center: 'Pune Center',
      counselling: 90,
      videoCompletion: 78,
      documentation: 85,
      placement: 92
    },
  ];

  // Dummy data for quality issues
  const qualityIssues = [
    { 
      id: 1, 
      center: 'Delhi Center', 
      issue: 'Incomplete Documentation', 
      severity: 'high',
      affectedCount: 24,
      dateDetected: '2023-11-05',
      status: 'open'
    },
    { 
      id: 2, 
      center: 'Mumbai Center', 
      issue: 'Low Video Completion Rate', 
      severity: 'medium',
      affectedCount: 18,
      dateDetected: '2023-11-02',
      status: 'in-progress'
    },
    { 
      id: 3, 
      center: 'Bangalore Center', 
      issue: 'Counselling Session Delays', 
      severity: 'medium',
      affectedCount: 15,
      dateDetected: '2023-10-28',
      status: 'in-progress'
    },
    { 
      id: 4, 
      center: 'Pune Center', 
      issue: 'Placement Delay', 
      severity: 'low',
      affectedCount: 12,
      dateDetected: '2023-11-01',
      status: 'resolved'
    },
    { 
      id: 5, 
      center: 'Chennai Center', 
      issue: 'Missing Candidate Photos', 
      severity: 'low',
      affectedCount: 30,
      dateDetected: '2023-10-25',
      status: 'resolved'
    },
  ];

  return (
    <MainLayout role="super_admin">
      <div className="space-y-6">
        <div>
          <div className="flex items-center space-x-2 mb-1">
            <h1 className="text-2xl font-bold tracking-tight">Quality Tracker</h1>
            <Badge variant="outline" className="text-purple-600 bg-purple-50 border-purple-200">Phase 3</Badge>
          </div>
          <p className="text-muted-foreground">
            Track and improve quality metrics across centers and programs.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="rounded-full bg-blue-100 p-3">
                  <FileCheck className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-blue-700">Counselling Completion</p>
                  <h2 className="text-2xl font-bold text-blue-900">92%</h2>
                </div>
              </div>
              <Progress className="mt-4 h-1.5" value={92} />
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-purple-50 to-indigo-50 hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="rounded-full bg-purple-100 p-3">
                  <Video className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-purple-700">Video View Completion</p>
                  <h2 className="text-2xl font-bold text-purple-900">78%</h2>
                </div>
              </div>
              <Progress className="mt-4 h-1.5" value={78} />
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-amber-50 to-yellow-50 hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="rounded-full bg-amber-100 p-3">
                  <Clock className="h-6 w-6 text-amber-600" />
                </div>
                <div>
                  <p className="text-sm text-amber-700">Placement Delay Avg.</p>
                  <h2 className="text-2xl font-bold text-amber-900">5.2 days</h2>
                </div>
              </div>
              <Progress className="mt-4 h-1.5" value={72} />
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-br from-green-50 to-emerald-50 hover:shadow-md transition-shadow">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className="rounded-full bg-green-100 p-3">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-green-700">Documentation Complete</p>
                  <h2 className="text-2xl font-bold text-green-900">85%</h2>
                </div>
              </div>
              <Progress className="mt-4 h-1.5" value={85} />
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="comparison" className="w-full">
          <TabsList className="w-full max-w-md grid grid-cols-3">
            <TabsTrigger value="comparison" className="flex gap-2 items-center">
              <BarChart3 className="h-4 w-4" />
              Center Comparison
            </TabsTrigger>
            <TabsTrigger value="trends" className="flex gap-2 items-center">
              <LineChart className="h-4 w-4" />
              Quality Trends
            </TabsTrigger>
            <TabsTrigger value="issues" className="flex gap-2 items-center">
              <PieChart className="h-4 w-4" />
              Quality Issues
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="comparison" className="space-y-6 pt-6">
            <Card>
              <CardHeader>
                <CardTitle>Center Quality Metrics Comparison</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <RechartsBarChart data={centerQualityData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="center" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="counselling" name="Counselling Completion %" fill="#818cf8" />
                    <Bar dataKey="videoCompletion" name="Video Completion %" fill="#a78bfa" />
                    <Bar dataKey="documentation" name="Documentation Complete %" fill="#34d399" />
                    <Bar dataKey="placement" name="Placement Success %" fill="#fbbf24" />
                  </RechartsBarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="trends" className="pt-6">
            <Card>
              <CardHeader>
                <CardTitle>Quality Metrics Trends</CardTitle>
              </CardHeader>
              <CardContent className="min-h-[400px] flex items-center justify-center">
                <p className="text-muted-foreground">Quality trends chart will be displayed here.</p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="issues" className="pt-6">
            <Card>
              <CardHeader>
                <CardTitle>Quality Issues Log</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableCaption>Recent quality issues detected across centers</TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Center</TableHead>
                      <TableHead>Issue</TableHead>
                      <TableHead>Severity</TableHead>
                      <TableHead>Affected Count</TableHead>
                      <TableHead>Date Detected</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {qualityIssues.map((issue) => (
                      <TableRow key={issue.id}>
                        <TableCell className="font-medium">{issue.center}</TableCell>
                        <TableCell>{issue.issue}</TableCell>
                        <TableCell>
                          <Badge variant={
                            issue.severity === 'high' ? "destructive" : 
                            issue.severity === 'medium' ? "default" : "secondary"
                          }>
                            {issue.severity}
                          </Badge>
                        </TableCell>
                        <TableCell>{issue.affectedCount}</TableCell>
                        <TableCell>{issue.dateDetected}</TableCell>
                        <TableCell>
                          <Badge variant={
                            issue.status === 'open' ? "outline" : 
                            issue.status === 'in-progress' ? "default" : "success"
                          }>
                            {issue.status === 'open' ? 'Open' : 
                             issue.status === 'in-progress' ? 'In Progress' : 'Resolved'}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default QualityTracker;
