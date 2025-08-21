import React from 'react';
import { MainLayout } from '@/layouts/MainLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Circle, CheckCircle, AlertTriangle } from 'lucide-react';

const QualityTracker = () => {
  // Dummy data for quality metrics
  const qualityMetrics = [
    { id: 1, name: 'Candidate Feedback Score', target: '4.5/5', actual: '4.7/5', status: 'good' },
    { id: 2, name: 'Trainer Performance Index', target: '85%', actual: '82%', status: 'warning' },
    { id: 3, name: 'Center Infrastructure Score', target: '90%', actual: '95%', status: 'good' },
    { id: 4, name: 'Batch Completion Rate', target: '75%', actual: '70%', status: 'warning' },
    { id: 5, name: 'Placement Success Rate', target: '60%', actual: '65%', status: 'good' },
    { id: 6, name: 'Mobilizer Conversion Rate', target: '15%', actual: '12%', status: 'warning' },
  ];

  return (
    <MainLayout role="admin">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Quality Tracker</h1>
            <p className="text-muted-foreground">
              Monitor key performance indicators to ensure quality standards are met.
            </p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Key Quality Metrics</CardTitle>
            <CardDescription>
              Track performance against targets for various quality indicators.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableCaption>List of quality metrics and their current status</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Metric</TableHead>
                  <TableHead>Target</TableHead>
                  <TableHead>Actual</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {qualityMetrics.map((metric) => (
                  <TableRow key={metric.id}>
                    <TableCell className="font-medium">{metric.name}</TableCell>
                    <TableCell>{metric.target}</TableCell>
                    <TableCell>{metric.actual}</TableCell>
                    <TableCell>
                      <Badge variant={metric.status === "good" ? "secondary" : 
                        metric.status === "warning" ? "outline" : "default"}>
                        {metric.status === "good" ? <CheckCircle className="h-3.5 w-3.5 mr-1" /> : 
                         metric.status === "warning" ? <AlertTriangle className="h-3.5 w-3.5 mr-1" /> : 
                         <Circle className="h-3.5 w-3.5 mr-1" />}
                        {metric.status.charAt(0).toUpperCase() + metric.status.slice(1)}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default QualityTracker;
