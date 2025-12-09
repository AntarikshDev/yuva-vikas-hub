import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowRight, TrendingUp, TrendingDown, User, Calendar, Target, Award, MapPin, Phone, Mail } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend, Area, AreaChart } from 'recharts';

interface EmployeePerformanceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  employee: {
    name: string;
    target: number;
    achieved: Record<string, number>;
    ytd?: number;
  } | null;
}

interface PipelineStage {
  name: string;
  value: number;
  target: number;
  color: string;
  gradient: string;
}

// Generate performance data based on time period
const generateTableData = (baseValue: number, period: 'daily' | 'weekly' | 'monthly') => {
  const periods = period === 'daily' 
    ? ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    : period === 'weekly'
    ? ['Week 1', 'Week 2', 'Week 3', 'Week 4']
    : ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'];

  const multiplier = period === 'daily' ? 0.05 : period === 'weekly' ? 0.15 : 0.08;
  
  return periods.map((name, index) => {
    const ofr = Math.floor(baseValue * multiplier * (0.8 + Math.random() * 0.4));
    const migration = Math.floor(ofr * (0.88 + Math.random() * 0.1));
    const enrolled = Math.floor(migration * (0.85 + Math.random() * 0.1));
    const training = Math.floor(enrolled * (0.9 + Math.random() * 0.08));
    const placed = Math.floor(training * (0.75 + Math.random() * 0.15));
    const retained = Math.floor(placed * (0.8 + Math.random() * 0.15));
    
    return {
      period: name,
      ofr,
      migration,
      enrolled,
      training,
      placed,
      retained,
    };
  });
};

// Mock employee details
const getEmployeeDetails = (name: string) => ({
  name,
  employeeId: `EMP${Math.floor(1000 + Math.random() * 9000)}`,
  role: 'Mobiliser',
  region: 'North Region',
  state: 'Uttar Pradesh',
  district: 'Lucknow',
  joiningDate: '2023-04-15',
  phone: '+91 98765 43210',
  email: `${name.toLowerCase().replace(' ', '.')}@company.com`,
  rating: 4.2,
});

// Mock pipeline data for employee
const getEmployeePipeline = (baseValue: number): PipelineStage[] => [
  { 
    name: 'OFR', 
    value: baseValue, 
    target: Math.ceil(baseValue * 1.2),
    color: 'bg-blue-500',
    gradient: 'from-blue-500 to-blue-600'
  },
  { 
    name: 'Migration', 
    value: Math.floor(baseValue * 0.92), 
    target: Math.ceil(baseValue * 1.1),
    color: 'bg-indigo-500',
    gradient: 'from-indigo-500 to-indigo-600'
  },
  { 
    name: 'Enrolled', 
    value: Math.floor(baseValue * 0.85), 
    target: Math.ceil(baseValue * 1.0),
    color: 'bg-violet-500',
    gradient: 'from-violet-500 to-purple-600'
  },
  { 
    name: 'Training', 
    value: Math.floor(baseValue * 0.78), 
    target: Math.ceil(baseValue * 0.9),
    color: 'bg-purple-500',
    gradient: 'from-purple-500 to-purple-600'
  },
  { 
    name: 'Placed', 
    value: Math.floor(baseValue * 0.65), 
    target: Math.ceil(baseValue * 0.75),
    color: 'bg-fuchsia-500',
    gradient: 'from-fuchsia-500 to-pink-600'
  },
  { 
    name: 'Retained', 
    value: Math.floor(baseValue * 0.55), 
    target: Math.ceil(baseValue * 0.6),
    color: 'bg-pink-500',
    gradient: 'from-pink-500 to-rose-600'
  },
];

const PipelineCard: React.FC<{ stage: PipelineStage; index: number; total: number; baseValue: number }> = ({ 
  stage, 
  index, 
  total,
  baseValue 
}) => {
  const percentOfTotal = ((stage.value / baseValue) * 100).toFixed(1);
  const targetPercent = Math.round((stage.value / stage.target) * 100);
  const isFirst = index === 0;
  
  return (
    <div className="flex items-center gap-2">
      <div 
        className={`relative overflow-hidden rounded-xl p-5 text-white min-w-[150px] shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl bg-gradient-to-br ${stage.gradient}`}
      >
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -translate-y-10 translate-x-10" />
        <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/5 rounded-full translate-y-8 -translate-x-8" />
        
        <div className="relative z-10">
          <div className="text-xs font-medium opacity-90 mb-2">{stage.name}</div>
          <div className="text-3xl font-bold tracking-tight">{stage.value.toLocaleString()}</div>
          <div className="text-xs opacity-80 mt-2">{percentOfTotal}% of total</div>
          {!isFirst && (
            <div className="flex items-center gap-1 mt-1 text-xs opacity-80">
              <TrendingDown className="h-3 w-3" />
              <span>-{(100 - parseFloat(percentOfTotal)).toFixed(1)}% drop</span>
            </div>
          )}
          <div className="mt-3 pt-2 border-t border-white/20">
            <div className="flex items-center justify-between text-xs">
              <span className="opacity-80">Target: {stage.target}</span>
              <Badge variant="secondary" className="bg-white/20 text-white text-[10px] px-1.5 py-0.5">
                {targetPercent}%
              </Badge>
            </div>
          </div>
        </div>
      </div>
      {index < total - 1 && (
        <ArrowRight className="h-6 w-6 text-muted-foreground flex-shrink-0 animate-pulse" />
      )}
    </div>
  );
};

const MetricCard: React.FC<{ 
  label: string; 
  value: number | string; 
  icon: React.ReactNode;
  trend?: number;
  color?: string;
}> = ({ label, value, icon, trend, color = 'bg-primary/10' }) => (
  <div className={`${color} rounded-xl p-4 transition-all duration-200 hover:shadow-md`}>
    <div className="flex items-center justify-between mb-2">
      <div className="p-2 rounded-lg bg-background/50">{icon}</div>
      {trend !== undefined && (
        <div className={`flex items-center gap-1 text-xs ${trend >= 0 ? 'text-green-600' : 'text-red-500'}`}>
          {trend >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
          {Math.abs(trend)}%
        </div>
      )}
    </div>
    <div className="text-2xl font-bold text-foreground">{value}</div>
    <div className="text-xs text-muted-foreground mt-1">{label}</div>
  </div>
);

const PerformanceDataTable: React.FC<{ data: ReturnType<typeof generateTableData>; period: string }> = ({ data, period }) => {
  const totals = data.reduce((acc, row) => ({
    ofr: acc.ofr + row.ofr,
    migration: acc.migration + row.migration,
    enrolled: acc.enrolled + row.enrolled,
    training: acc.training + row.training,
    placed: acc.placed + row.placed,
    retained: acc.retained + row.retained,
  }), { ofr: 0, migration: 0, enrolled: 0, training: 0, placed: 0, retained: 0 });

  return (
    <Card className="overflow-hidden">
      <CardHeader className="bg-muted/30 border-b py-3">
        <CardTitle className="text-sm font-medium">
          {period === 'daily' ? 'Daily' : period === 'weekly' ? 'Weekly' : 'Monthly'} Performance Data
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/20">
                <TableHead className="font-semibold">Period</TableHead>
                <TableHead className="text-right font-semibold text-blue-600">OFR</TableHead>
                <TableHead className="text-right font-semibold text-indigo-600">Migration</TableHead>
                <TableHead className="text-right font-semibold text-violet-600">Enrolled</TableHead>
                <TableHead className="text-right font-semibold text-purple-600">Training</TableHead>
                <TableHead className="text-right font-semibold text-fuchsia-600">Placed</TableHead>
                <TableHead className="text-right font-semibold text-pink-600">Retained</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((row, index) => (
                <TableRow key={index} className="hover:bg-muted/30 transition-colors">
                  <TableCell className="font-medium">{row.period}</TableCell>
                  <TableCell className="text-right">{row.ofr}</TableCell>
                  <TableCell className="text-right">{row.migration}</TableCell>
                  <TableCell className="text-right">{row.enrolled}</TableCell>
                  <TableCell className="text-right">{row.training}</TableCell>
                  <TableCell className="text-right">{row.placed}</TableCell>
                  <TableCell className="text-right">{row.retained}</TableCell>
                </TableRow>
              ))}
              <TableRow className="bg-muted/40 font-semibold border-t-2">
                <TableCell>Total</TableCell>
                <TableCell className="text-right text-blue-600">{totals.ofr}</TableCell>
                <TableCell className="text-right text-indigo-600">{totals.migration}</TableCell>
                <TableCell className="text-right text-violet-600">{totals.enrolled}</TableCell>
                <TableCell className="text-right text-purple-600">{totals.training}</TableCell>
                <TableCell className="text-right text-fuchsia-600">{totals.placed}</TableCell>
                <TableCell className="text-right text-pink-600">{totals.retained}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

const PerformanceCharts: React.FC<{ data: ReturnType<typeof generateTableData>; period: string }> = ({ data, period }) => {
  const chartColors = {
    ofr: '#3b82f6',
    migration: '#6366f1',
    enrolled: '#8b5cf6',
    training: '#a855f7',
    placed: '#d946ef',
    retained: '#ec4899',
  };

  return (
    <div className="grid gap-6">
      {/* Bar Chart */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Performance Comparison</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="period" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
                <YAxis tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--popover))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                  }}
                />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="ofr" fill={chartColors.ofr} name="OFR" radius={[4, 4, 0, 0]} />
                <Bar dataKey="migration" fill={chartColors.migration} name="Migration" radius={[4, 4, 0, 0]} />
                <Bar dataKey="enrolled" fill={chartColors.enrolled} name="Enrolled" radius={[4, 4, 0, 0]} />
                <Bar dataKey="placed" fill={chartColors.placed} name="Placed" radius={[4, 4, 0, 0]} />
                <Bar dataKey="retained" fill={chartColors.retained} name="Retained" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Line Chart - Trend Analysis */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Trend Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="period" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
                <YAxis tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--popover))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                  }}
                />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Line type="monotone" dataKey="ofr" stroke={chartColors.ofr} strokeWidth={2} dot={{ r: 4 }} name="OFR" />
                <Line type="monotone" dataKey="placed" stroke={chartColors.placed} strokeWidth={2} dot={{ r: 4 }} name="Placed" />
                <Line type="monotone" dataKey="retained" stroke={chartColors.retained} strokeWidth={2} dot={{ r: 4 }} name="Retained" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Area Chart - Cumulative Flow */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Pipeline Flow</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="period" tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
                <YAxis tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--popover))', 
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                  }}
                />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Area type="monotone" dataKey="ofr" stackId="1" stroke={chartColors.ofr} fill={chartColors.ofr} fillOpacity={0.6} name="OFR" />
                <Area type="monotone" dataKey="enrolled" stackId="2" stroke={chartColors.enrolled} fill={chartColors.enrolled} fillOpacity={0.6} name="Enrolled" />
                <Area type="monotone" dataKey="retained" stackId="3" stroke={chartColors.retained} fill={chartColors.retained} fillOpacity={0.6} name="Retained" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export const EmployeePerformanceDialog: React.FC<EmployeePerformanceDialogProps> = ({
  open,
  onOpenChange,
  employee
}) => {
  const [timePeriod, setTimePeriod] = useState<'daily' | 'weekly' | 'monthly'>('monthly');

  if (!employee) return null;

  const baseValue = employee.achieved?.total || employee.ytd || 45;
  const employeeDetails = getEmployeeDetails(employee.name);
  const pipeline = getEmployeePipeline(baseValue);
  const tableData = generateTableData(baseValue, timePeriod);

  const totalAchieved = pipeline[0].value;
  const totalTarget = pipeline[0].target;
  const overallPercent = Math.round((totalAchieved / totalTarget) * 100);
  const retentionRate = Math.round((pipeline[5].value / pipeline[4].value) * 100);
  const placementRate = Math.round((pipeline[4].value / pipeline[2].value) * 100);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="pb-4 border-b">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="h-16 w-16 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-primary-foreground text-xl font-bold shadow-lg">
                {employee.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <DialogTitle className="text-2xl">{employee.name}</DialogTitle>
                <div className="flex flex-wrap items-center gap-2 mt-1 text-sm text-muted-foreground">
                  <Badge variant="outline">{employeeDetails.employeeId}</Badge>
                  <span>•</span>
                  <span>{employeeDetails.role}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {employeeDetails.district}, {employeeDetails.state}
                  </span>
                </div>
                <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Phone className="h-3 w-3" />
                    {employeeDetails.phone}
                  </span>
                  <span className="flex items-center gap-1">
                    <Mail className="h-3 w-3" />
                    {employeeDetails.email}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={overallPercent >= 100 ? 'default' : overallPercent >= 80 ? 'secondary' : 'destructive'} className="text-sm px-3 py-1">
                {overallPercent}% Target Achieved
              </Badge>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6 pt-4">
          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <MetricCard 
              label="Total OFR" 
              value={pipeline[0].value} 
              icon={<User className="h-4 w-4 text-blue-600" />}
              trend={8}
              color="bg-blue-50 dark:bg-blue-950/30"
            />
            <MetricCard 
              label="Placements" 
              value={pipeline[4].value} 
              icon={<Award className="h-4 w-4 text-green-600" />}
              trend={5}
              color="bg-green-50 dark:bg-green-950/30"
            />
            <MetricCard 
              label="Placement Rate" 
              value={`${placementRate}%`} 
              icon={<Target className="h-4 w-4 text-purple-600" />}
              trend={-2}
              color="bg-purple-50 dark:bg-purple-950/30"
            />
            <MetricCard 
              label="Retention Rate" 
              value={`${retentionRate}%`} 
              icon={<TrendingUp className="h-4 w-4 text-amber-600" />}
              trend={3}
              color="bg-amber-50 dark:bg-amber-950/30"
            />
          </div>

          {/* Performance Pipeline */}
          <Card className="overflow-hidden">
            <CardHeader className="bg-muted/30 border-b">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Target className="h-5 w-5 text-primary" />
                Performance Pipeline
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 pb-4">
              <div className="flex items-center gap-2 overflow-x-auto pb-4 scrollbar-thin">
                {pipeline.map((stage, index) => (
                  <PipelineCard 
                    key={stage.name} 
                    stage={stage} 
                    index={index} 
                    total={pipeline.length}
                    baseValue={pipeline[0].value}
                  />
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Time Period Tabs */}
          <Tabs value={timePeriod} onValueChange={(v) => setTimePeriod(v as typeof timePeriod)}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                Performance Analysis
              </h3>
              <TabsList>
                <TabsTrigger value="daily">Daily</TabsTrigger>
                <TabsTrigger value="weekly">Weekly</TabsTrigger>
                <TabsTrigger value="monthly">Monthly</TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="daily" className="mt-0 space-y-6">
              <PerformanceDataTable data={tableData} period="daily" />
              <PerformanceCharts data={tableData} period="daily" />
            </TabsContent>

            <TabsContent value="weekly" className="mt-0 space-y-6">
              <PerformanceDataTable data={tableData} period="weekly" />
              <PerformanceCharts data={tableData} period="weekly" />
            </TabsContent>

            <TabsContent value="monthly" className="mt-0 space-y-6">
              <PerformanceDataTable data={tableData} period="monthly" />
              <PerformanceCharts data={tableData} period="monthly" />
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
};
