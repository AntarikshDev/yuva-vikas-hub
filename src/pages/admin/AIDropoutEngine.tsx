
import React from 'react';
import { MainLayout } from '@/layouts/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { AlertTriangle, ArrowUpRight, Clock, MessageCircle, CheckCircle } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const AIDropoutEngine = () => {
  // Dummy data for candidates at risk
  const candidatesAtRisk = [
    { 
      id: 'C001', 
      name: 'Rahul Sharma', 
      batch: 'CSE Batch 01', 
      center: 'Delhi Center',
      daysAbsent: 4,
      riskScore: 85,
      reasons: ['Attendance', 'Performance', 'Family Issues'],
      status: 'high'
    },
    { 
      id: 'C002', 
      name: 'Priya Patel', 
      batch: 'FSE Batch 02', 
      center: 'Mumbai Center',
      daysAbsent: 3,
      riskScore: 75,
      reasons: ['Performance', 'Transportation'],
      status: 'high'
    },
    { 
      id: 'C003', 
      name: 'Amit Kumar', 
      batch: 'GDA Batch 01', 
      center: 'Bangalore Center',
      daysAbsent: 2,
      riskScore: 65,
      reasons: ['Financial Issues', 'Health'],
      status: 'medium'
    },
    { 
      id: 'C004', 
      name: 'Sneha Singh', 
      batch: 'BPO Batch 01', 
      center: 'Pune Center',
      daysAbsent: 2,
      riskScore: 60,
      reasons: ['Attendance'],
      status: 'medium'
    },
    { 
      id: 'C005', 
      name: 'Vikram Reddy', 
      batch: 'CSE Batch 01', 
      center: 'Delhi Center',
      daysAbsent: 1,
      riskScore: 55,
      reasons: ['Performance'],
      status: 'medium'
    },
  ];

  // Dummy data for risk distribution by batch
  const riskByBatch = [
    { name: 'CSE Batch 01', value: 30 },
    { name: 'FSE Batch 02', value: 25 },
    { name: 'GDA Batch 01', value: 20 },
    { name: 'BPO Batch 01', value: 15 },
    { name: 'RSA Batch 03', value: 10 },
  ];

  // Colors for the pie chart
  const COLORS = ['#ef4444', '#f97316', '#f59e0b', '#84cc16', '#10b981'];

  return (
    <MainLayout role="admin">
      <div className="space-y-6">
        <div>
          <div className="flex items-center space-x-2 mb-1">
            <h1 className="text-2xl font-bold tracking-tight">AI Dropout Engine</h1>
            <Badge variant="outline" className="text-purple-600 bg-purple-50 border-purple-200">Phase 3</Badge>
          </div>
          <p className="text-muted-foreground">
            AI-powered predictions to identify candidates at risk of dropping out.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-red-50">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-red-800">
                <AlertTriangle className="h-5 w-5" />
                High Risk Candidates
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-red-700">24</div>
              <p className="text-sm text-red-600 mt-1">Immediate intervention needed</p>
            </CardContent>
          </Card>
          
          <Card className="bg-amber-50">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-amber-800">
                <Clock className="h-5 w-5" />
                Medium Risk Candidates
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-amber-700">42</div>
              <p className="text-sm text-amber-600 mt-1">Monitoring required</p>
            </CardContent>
          </Card>
          
          <Card className="bg-green-50">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-green-800">
                <CheckCircle className="h-5 w-5" />
                Interventions Successful
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-green-700">18</div>
              <p className="text-sm text-green-600 mt-1">This month</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Top Candidates at Risk</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableCaption>Candidates with highest dropout risk score</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Batch</TableHead>
                    <TableHead>Center</TableHead>
                    <TableHead>Absent Days</TableHead>
                    <TableHead>Risk Factors</TableHead>
                    <TableHead>Risk Level</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {candidatesAtRisk.map((candidate) => (
                    <TableRow key={candidate.id}>
                      <TableCell className="font-medium">{candidate.name}</TableCell>
                      <TableCell>{candidate.batch}</TableCell>
                      <TableCell>{candidate.center}</TableCell>
                      <TableCell>{candidate.daysAbsent}</TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {candidate.reasons.map((reason, index) => (
                            <span key={index} className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold">
                              {reason}
                            </span>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <progress
                            className={`h-2 w-16 ${
                              candidate.status === 'high' ? 'bg-red-100 [&::-webkit-progress-value]:bg-red-500 [&::-moz-progress-bar]:bg-red-500' : 
                              candidate.status === 'medium' ? 'bg-amber-100 [&::-webkit-progress-value]:bg-amber-500 [&::-moz-progress-bar]:bg-amber-500' : 
                              'bg-green-100 [&::-webkit-progress-value]:bg-green-500 [&::-moz-progress-bar]:bg-green-500'
                            }`}
                            value={candidate.riskScore}
                            max="100"
                          />
                          <span className="text-xs font-medium">{candidate.riskScore}%</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-1">
                          <Button variant="outline" size="sm" className="h-7">
                            <MessageCircle className="h-3.5 w-3.5 mr-1" />
                            PPC
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Risk Distribution by Batch</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={riskByBatch}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                  >
                    {riskByBatch.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Risk Factors Analysis</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <Card className="border-l-4 border-l-red-500">
              <CardContent className="p-4">
                <h3 className="font-bold text-gray-700">Attendance Issues</h3>
                <div className="text-3xl font-bold mt-2 mb-1">65%</div>
                <div className="text-sm text-gray-500 flex items-center">
                  <ArrowUpRight className="h-3.5 w-3.5 mr-1 text-red-500" />
                  <span>12% increase from last month</span>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-l-4 border-l-amber-500">
              <CardContent className="p-4">
                <h3 className="font-bold text-gray-700">Performance Concerns</h3>
                <div className="text-3xl font-bold mt-2 mb-1">42%</div>
                <div className="text-sm text-gray-500 flex items-center">
                  <ArrowUpRight className="h-3.5 w-3.5 mr-1 text-amber-500" />
                  <span>5% increase from last month</span>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-l-4 border-l-blue-500">
              <CardContent className="p-4">
                <h3 className="font-bold text-gray-700">Financial Constraints</h3>
                <div className="text-3xl font-bold mt-2 mb-1">38%</div>
                <div className="text-sm text-gray-500 flex items-center">
                  <ArrowUpRight className="h-3.5 w-3.5 mr-1 text-blue-500" />
                  <span>8% increase from last month</span>
                </div>
              </CardContent>
            </Card>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default AIDropoutEngine;
