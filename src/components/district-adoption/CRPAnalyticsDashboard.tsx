import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell 
} from 'recharts';
import { 
  TrendingUp, TrendingDown, Users, IndianRupee, Target, Award, 
  MapPin, Activity, BarChart3 
} from 'lucide-react';
import type { CRPNetworkAnalytics, StateWiseCRPStats } from '@/types/crpAccounts';

interface CRPAnalyticsDashboardProps {
  workOrderId?: string;
}

// Mock analytics data
const mockAnalytics: CRPNetworkAnalytics = {
  summary: {
    totalCRPs: 156,
    totalActiveCRPs: 142,
    totalOFRs: 4520,
    totalEnrollments: 1850,
    totalInvestment: 596000,
    avgOFRPerCRP: 29,
    avgEnrollmentPerCRP: 12,
    overallROI: 3.2,
  },
  stateWiseStats: [
    {
      stateId: 'jharkhand',
      stateName: 'Jharkhand',
      totalCRPs: 85,
      activeCRPs: 78,
      totalOFRs: 2450,
      totalEnrollments: 980,
      totalInvestment: 318500,
      avgROI: 3.5,
      conversionRate: 40,
    },
    {
      stateId: 'bihar',
      stateName: 'Bihar',
      totalCRPs: 45,
      activeCRPs: 42,
      totalOFRs: 1320,
      totalEnrollments: 550,
      totalInvestment: 177000,
      avgROI: 3.1,
      conversionRate: 42,
    },
    {
      stateId: 'odisha',
      stateName: 'Odisha',
      totalCRPs: 26,
      activeCRPs: 22,
      totalOFRs: 750,
      totalEnrollments: 320,
      totalInvestment: 100500,
      avgROI: 2.8,
      conversionRate: 43,
    },
  ],
  topPerformingCRPs: [
    { crpId: '1', crpName: 'Ram Kumar Sharma', stateName: 'Jharkhand', districtName: 'Ranchi', ofrCount: 85, enrollmentCount: 42, earnings: 12700 },
    { crpId: '2', crpName: 'Sunita Devi', stateName: 'Jharkhand', districtName: 'Ranchi', ofrCount: 78, enrollmentCount: 38, earnings: 11500 },
    { crpId: '6', crpName: 'Amit Singh', stateName: 'Bihar', districtName: 'Patna', ofrCount: 72, enrollmentCount: 35, earnings: 10600 },
    { crpId: '7', crpName: 'Priya Kumari', stateName: 'Jharkhand', districtName: 'Hazaribagh', ofrCount: 68, enrollmentCount: 32, earnings: 9800 },
    { crpId: '8', crpName: 'Rajesh Mahato', stateName: 'Bihar', districtName: 'Gaya', ofrCount: 65, enrollmentCount: 30, earnings: 9250 },
  ],
  monthlyTrend: [
    { month: 'Sep 2023', ofrs: 320, enrollments: 120, investment: 44000 },
    { month: 'Oct 2023', ofrs: 380, enrollments: 145, investment: 52000 },
    { month: 'Nov 2023', ofrs: 420, enrollments: 165, investment: 58000 },
    { month: 'Dec 2023', ofrs: 450, enrollments: 180, investment: 62000 },
    { month: 'Jan 2024', ofrs: 520, enrollments: 210, investment: 72000 },
    { month: 'Feb 2024', ofrs: 580, enrollments: 240, investment: 80000 },
  ],
};

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

export const CRPAnalyticsDashboard: React.FC<CRPAnalyticsDashboardProps> = ({ workOrderId }) => {
  const [selectedPeriod, setSelectedPeriod] = useState('6months');
  const [analytics] = useState<CRPNetworkAnalytics>(mockAnalytics);

  const getROIColor = (roi: number) => {
    if (roi >= 3.5) return 'text-green-600';
    if (roi >= 2.5) return 'text-blue-600';
    if (roi >= 1.5) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getROIBadge = (roi: number) => {
    if (roi >= 3.5) return <Badge className="bg-green-100 text-green-800">Excellent</Badge>;
    if (roi >= 2.5) return <Badge className="bg-blue-100 text-blue-800">Good</Badge>;
    if (roi >= 1.5) return <Badge className="bg-yellow-100 text-yellow-800">Average</Badge>;
    return <Badge className="bg-red-100 text-red-800">Poor</Badge>;
  };

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total CRPs</p>
                <p className="text-2xl font-bold">{analytics.summary.totalCRPs}</p>
                <p className="text-xs text-green-600">{analytics.summary.totalActiveCRPs} active</p>
              </div>
              <Users className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total OFRs</p>
                <p className="text-2xl font-bold">{analytics.summary.totalOFRs.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">Avg: {analytics.summary.avgOFRPerCRP}/CRP</p>
              </div>
              <Target className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Investment</p>
                <p className="text-2xl font-bold">₹{(analytics.summary.totalInvestment / 1000).toFixed(0)}K</p>
                <p className="text-xs text-muted-foreground">{analytics.summary.totalEnrollments} enrollments</p>
              </div>
              <IndianRupee className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Overall ROI</p>
                <p className={`text-2xl font-bold ${getROIColor(analytics.summary.overallROI)}`}>
                  {analytics.summary.overallROI}x
                </p>
                {getROIBadge(analytics.summary.overallROI)}
              </div>
              <TrendingUp className="h-8 w-8 text-emerald-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* State-wise Performance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              State-wise CRP Network Strength
            </CardTitle>
            <CardDescription>Performance comparison across states</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analytics.stateWiseStats}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="stateName" />
                <YAxis yAxisId="left" orientation="left" stroke="#3b82f6" />
                <YAxis yAxisId="right" orientation="right" stroke="#10b981" />
                <Tooltip />
                <Legend />
                <Bar yAxisId="left" dataKey="totalCRPs" fill="#3b82f6" name="Total CRPs" />
                <Bar yAxisId="left" dataKey="activeCRPs" fill="#93c5fd" name="Active CRPs" />
                <Bar yAxisId="right" dataKey="conversionRate" fill="#10b981" name="Conversion %" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Investment Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <IndianRupee className="h-5 w-5" />
              Investment Distribution by State
            </CardTitle>
            <CardDescription>Where CRP investment is flowing</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={analytics.stateWiseStats}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ stateName, percent }) => `${stateName} (${(percent * 100).toFixed(0)}%)`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="totalInvestment"
                >
                  {analytics.stateWiseStats.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => `₹${value.toLocaleString()}`} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Monthly Trend */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Monthly Performance Trend
            </CardTitle>
            <CardDescription>OFRs, Enrollments & Investment over time</CardDescription>
          </div>
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-[150px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="3months">Last 3 Months</SelectItem>
              <SelectItem value="6months">Last 6 Months</SelectItem>
              <SelectItem value="1year">Last 1 Year</SelectItem>
            </SelectContent>
          </Select>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={analytics.monthlyTrend}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis yAxisId="left" orientation="left" stroke="#3b82f6" />
              <YAxis yAxisId="right" orientation="right" stroke="#10b981" />
              <Tooltip />
              <Legend />
              <Line yAxisId="left" type="monotone" dataKey="ofrs" stroke="#3b82f6" strokeWidth={2} name="OFRs" />
              <Line yAxisId="left" type="monotone" dataKey="enrollments" stroke="#10b981" strokeWidth={2} name="Enrollments" />
              <Line yAxisId="right" type="monotone" dataKey="investment" stroke="#8b5cf6" strokeWidth={2} name="Investment (₹)" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* State-wise Details Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              State-wise ROI Analysis
            </CardTitle>
            <CardDescription>Investment performance by state</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>State</TableHead>
                  <TableHead className="text-center">CRPs</TableHead>
                  <TableHead className="text-right">Investment</TableHead>
                  <TableHead className="text-center">ROI</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {analytics.stateWiseStats.map((state: StateWiseCRPStats) => (
                  <TableRow key={state.stateId}>
                    <TableCell className="font-medium">{state.stateName}</TableCell>
                    <TableCell className="text-center">
                      {state.activeCRPs}/{state.totalCRPs}
                    </TableCell>
                    <TableCell className="text-right">
                      ₹{(state.totalInvestment / 1000).toFixed(0)}K
                    </TableCell>
                    <TableCell className={`text-center font-bold ${getROIColor(state.avgROI)}`}>
                      {state.avgROI}x
                    </TableCell>
                    <TableCell>{getROIBadge(state.avgROI)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Top Performing CRPs */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              Top Performing CRPs
            </CardTitle>
            <CardDescription>Highest contributing CRPs</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>#</TableHead>
                  <TableHead>CRP Name</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead className="text-center">OFRs</TableHead>
                  <TableHead className="text-right">Earnings</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {analytics.topPerformingCRPs.map((crp, index) => (
                  <TableRow key={crp.crpId}>
                    <TableCell>
                      <Badge variant={index < 3 ? 'default' : 'outline'}>
                        {index + 1}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium">{crp.crpName}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {crp.districtName}, {crp.stateName}
                    </TableCell>
                    <TableCell className="text-center">{crp.ofrCount}</TableCell>
                    <TableCell className="text-right font-medium text-green-600">
                      ₹{crp.earnings.toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Investment Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Investment Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
                <span className="font-medium text-green-800 dark:text-green-200">Strong Network</span>
              </div>
              <p className="text-sm text-green-700 dark:text-green-300">
                Jharkhand has the strongest CRP network with 3.5x ROI and 40% conversion rate.
              </p>
            </div>
            <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
              <div className="flex items-center gap-2 mb-2">
                <Activity className="h-5 w-5 text-blue-600" />
                <span className="font-medium text-blue-800 dark:text-blue-200">Growing Investment</span>
              </div>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                Monthly investment has grown 82% in the last 6 months with consistent enrollment growth.
              </p>
            </div>
            <div className="p-4 rounded-lg bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800">
              <div className="flex items-center gap-2 mb-2">
                <TrendingDown className="h-5 w-5 text-yellow-600" />
                <span className="font-medium text-yellow-800 dark:text-yellow-200">Focus Area</span>
              </div>
              <p className="text-sm text-yellow-700 dark:text-yellow-300">
                Odisha needs attention with 2.8x ROI. Consider training programs to improve conversion.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
