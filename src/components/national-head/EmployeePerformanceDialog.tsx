import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowRight, TrendingDown, Calendar, Target, MapPin, Phone, Mail, MessageSquarePlus } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { PerformanceReviewDialog } from './PerformanceReviewDialog';
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
  
  return periods.map((name) => {
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
});

// Mock pipeline data for employee
const getEmployeePipeline = (baseValue: number): PipelineStage[] => [
  { 
    name: 'OFR', 
    value: baseValue, 
    target: Math.ceil(baseValue * 1.2),
    gradient: 'from-blue-500 to-blue-600'
  },
  { 
    name: 'Migration', 
    value: Math.floor(baseValue * 0.92), 
    target: Math.ceil(baseValue * 1.1),
    gradient: 'from-indigo-500 to-indigo-600'
  },
  { 
    name: 'Enrolled', 
    value: Math.floor(baseValue * 0.85), 
    target: Math.ceil(baseValue * 1.0),
    gradient: 'from-violet-500 to-purple-600'
  },
  { 
    name: 'Training', 
    value: Math.floor(baseValue * 0.78), 
    target: Math.ceil(baseValue * 0.9),
    gradient: 'from-purple-500 to-purple-600'
  },
  { 
    name: 'Placed', 
    value: Math.floor(baseValue * 0.65), 
    target: Math.ceil(baseValue * 0.75),
    gradient: 'from-fuchsia-500 to-pink-600'
  },
  { 
    name: 'Retained', 
    value: Math.floor(baseValue * 0.55), 
    target: Math.ceil(baseValue * 0.6),
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
    <div className="flex items-center gap-1 flex-1">
      <div 
        className={`relative overflow-hidden rounded-lg p-3 text-white w-full shadow-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-xl bg-gradient-to-br ${stage.gradient}`}
      >
        <div className="absolute top-0 right-0 w-10 h-10 bg-white/10 rounded-full -translate-y-5 translate-x-5" />
        
        <div className="relative z-10">
          <div className="text-[10px] font-medium opacity-90 mb-0.5">{stage.name}</div>
          <div className="text-lg font-bold tracking-tight">{stage.value.toLocaleString()}</div>
          <div className="text-[10px] opacity-80">{percentOfTotal}%</div>
          {!isFirst && (
            <div className="flex items-center gap-0.5 text-[9px] opacity-80">
              <TrendingDown className="h-2 w-2" />
              <span>-{(100 - parseFloat(percentOfTotal)).toFixed(0)}%</span>
            </div>
          )}
          <div className="mt-1.5 pt-1 border-t border-white/20">
            <div className="flex items-center justify-between text-[9px]">
              <span className="opacity-80">T: {stage.target}</span>
              <Badge variant="secondary" className="bg-white/20 text-white text-[8px] px-1 py-0">
                {targetPercent}%
              </Badge>
            </div>
          </div>
        </div>
      </div>
      {index < total - 1 && (
        <ArrowRight className="h-3 w-3 text-muted-foreground flex-shrink-0" />
      )}
    </div>
  );
};

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
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/20">
              <TableHead className="font-semibold text-xs">Period</TableHead>
              <TableHead className="text-center font-semibold text-xs text-blue-600">OFR</TableHead>
              <TableHead className="text-center font-semibold text-xs text-indigo-600">Migration</TableHead>
              <TableHead className="text-center font-semibold text-xs text-violet-600">Enrolled</TableHead>
              <TableHead className="text-center font-semibold text-xs text-purple-600">Training</TableHead>
              <TableHead className="text-center font-semibold text-xs text-fuchsia-600">Placed</TableHead>
              <TableHead className="text-center font-semibold text-xs text-pink-600">Retained</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((row, index) => (
              <TableRow key={index} className="hover:bg-muted/30 transition-colors">
                <TableCell className="font-medium text-xs py-2">{row.period}</TableCell>
                <TableCell className="text-center text-xs py-2">{row.ofr}</TableCell>
                <TableCell className="text-center text-xs py-2">{row.migration}</TableCell>
                <TableCell className="text-center text-xs py-2">{row.enrolled}</TableCell>
                <TableCell className="text-center text-xs py-2">{row.training}</TableCell>
                <TableCell className="text-center text-xs py-2">{row.placed}</TableCell>
                <TableCell className="text-center text-xs py-2">{row.retained}</TableCell>
              </TableRow>
            ))}
            <TableRow className="bg-muted/40 font-semibold border-t-2">
              <TableCell className="text-xs py-2">Total</TableCell>
              <TableCell className="text-center text-xs py-2 text-blue-600">{totals.ofr}</TableCell>
              <TableCell className="text-center text-xs py-2 text-indigo-600">{totals.migration}</TableCell>
              <TableCell className="text-center text-xs py-2 text-violet-600">{totals.enrolled}</TableCell>
              <TableCell className="text-center text-xs py-2 text-purple-600">{totals.training}</TableCell>
              <TableCell className="text-center text-xs py-2 text-fuchsia-600">{totals.placed}</TableCell>
              <TableCell className="text-center text-xs py-2 text-pink-600">{totals.retained}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

const PerformanceChart: React.FC<{ data: ReturnType<typeof generateTableData> }> = ({ data }) => {
  const chartColors = {
    ofr: '#3b82f6',
    migration: '#6366f1',
    enrolled: '#8b5cf6',
    training: '#a855f7',
    placed: '#d946ef',
    retained: '#ec4899',
  };

  return (
    <Card>
      <CardHeader className="pb-2 bg-muted/30 border-b">
        <CardTitle className="text-sm font-medium">Performance Comparison</CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="period" tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} />
              <YAxis tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--popover))', 
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                  fontSize: '11px'
                }}
              />
              <Legend wrapperStyle={{ fontSize: 10 }} />
              <Bar dataKey="ofr" fill={chartColors.ofr} name="OFR" radius={[3, 3, 0, 0]} />
              <Bar dataKey="migration" fill={chartColors.migration} name="Migration" radius={[3, 3, 0, 0]} />
              <Bar dataKey="enrolled" fill={chartColors.enrolled} name="Enrolled" radius={[3, 3, 0, 0]} />
              <Bar dataKey="placed" fill={chartColors.placed} name="Placed" radius={[3, 3, 0, 0]} />
              <Bar dataKey="retained" fill={chartColors.retained} name="Retained" radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export const EmployeePerformanceDialog: React.FC<EmployeePerformanceDialogProps> = ({
  open,
  onOpenChange,
  employee
}) => {
  const [timePeriod, setTimePeriod] = useState<'daily' | 'weekly' | 'monthly'>('monthly');
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);

  if (!employee) return null;

  const baseValue = employee.achieved?.total || employee.ytd || 45;
  const employeeDetails = getEmployeeDetails(employee.name);
  const pipeline = getEmployeePipeline(baseValue);
  const tableData = generateTableData(baseValue, timePeriod);

  const totalAchieved = pipeline[0].value;
  const totalTarget = pipeline[0].target;
  const overallPercent = Math.round((totalAchieved / totalTarget) * 100);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl w-[95vw] max-h-[90vh] overflow-y-auto overflow-x-hidden">
        <DialogHeader className="pb-3 border-b">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-primary-foreground text-lg font-bold shadow-lg">
                {employee.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <DialogTitle className="text-xl">{employee.name}</DialogTitle>
                <div className="flex flex-wrap items-center gap-2 mt-0.5 text-xs text-muted-foreground">
                  <Badge variant="outline" className="text-[10px]">{employeeDetails.employeeId}</Badge>
                  <span>•</span>
                  <span>{employeeDetails.role}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {employeeDetails.district}
                  </span>
                </div>
                <div className="flex items-center gap-3 mt-1 text-[10px] text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Phone className="h-2.5 w-2.5" />
                    {employeeDetails.phone}
                  </span>
                  <span className="flex items-center gap-1">
                    <Mail className="h-2.5 w-2.5" />
                    {employeeDetails.email}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex flex-col items-end gap-2">
              <Badge variant={overallPercent >= 100 ? 'default' : overallPercent >= 80 ? 'secondary' : 'destructive'} className="text-xs px-2 py-1">
                {overallPercent}% Target
              </Badge>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setReviewDialogOpen(true)}
                className="gap-1.5 text-xs h-7 bg-gradient-to-r from-amber-500/10 to-yellow-500/10 border-amber-500/30 hover:border-amber-500/50 hover:bg-gradient-to-r hover:from-amber-500/20 hover:to-yellow-500/20"
              >
                <MessageSquarePlus className="h-3.5 w-3.5 text-amber-500" />
                Add Review
              </Button>
            </div>
          </div>
          
          <PerformanceReviewDialog
            open={reviewDialogOpen}
            onOpenChange={setReviewDialogOpen}
            employeeName={employee.name}
          />
        </DialogHeader>

        <div className="space-y-4 pt-3">
          {/* Performance Pipeline */}
          <Card className="overflow-hidden">
            <CardHeader className="bg-muted/30 border-b py-2">
              <CardTitle className="flex items-center gap-2 text-sm">
                <Target className="h-4 w-4 text-primary" />
                Performance Pipeline
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-3 pb-2">
              <div className="grid grid-cols-6 gap-1">
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

          {/* Time Period Filter */}
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold flex items-center gap-2">
              <Calendar className="h-4 w-4 text-primary" />
              Performance Analysis
            </h3>
            <Tabs value={timePeriod} onValueChange={(v) => setTimePeriod(v as typeof timePeriod)}>
              <TabsList className="h-8">
                <TabsTrigger value="daily" className="text-xs px-3 h-6">Daily</TabsTrigger>
                <TabsTrigger value="weekly" className="text-xs px-3 h-6">Weekly</TabsTrigger>
                <TabsTrigger value="monthly" className="text-xs px-3 h-6">Monthly</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* Performance Chart */}
          <PerformanceChart data={tableData} />

          {/* Performance Table */}
          <PerformanceDataTable data={tableData} period={timePeriod} />
        </div>
      </DialogContent>
    </Dialog>
  );
};
