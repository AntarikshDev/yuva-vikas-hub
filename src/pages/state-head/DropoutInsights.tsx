
import React, { useState } from 'react';
import { MainLayout } from '@/layouts/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/common/StatusBadge';
import { DataTable } from '@/components/common/DataTable';
import { AlertTriangle, TrendingDown, Users, Brain } from 'lucide-react';

const DropoutInsights: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);

  const atRiskCandidates = [
    {
      candidateId: 'LNJ-MH-2024-001',
      name: 'Rahul Sharma',
      center: 'Mumbai Central',
      batch: 'Healthcare Batch 08',
      riskScore: 85,
      riskFactors: ['Low attendance', 'Poor performance'],
      lastActive: '2 days ago',
      phone: '+91 9876543210'
    },
    {
      candidateId: 'LNJ-MH-2024-089',
      name: 'Priya Patel',
      center: 'Andheri Center',
      batch: 'Retail Batch 12',
      riskScore: 78,
      riskFactors: ['Family issues', 'Financial constraints'],
      lastActive: '1 day ago',
      phone: '+91 9876543211'
    },
    {
      candidateId: 'LNJ-PU-2024-045',
      name: 'Amit Kumar',
      center: 'Pune East',
      batch: 'Logistics Batch 05',
      riskScore: 72,
      riskFactors: ['Irregular attendance', 'Course difficulty'],
      lastActive: '3 days ago',
      phone: '+91 9876543212'
    },
  ];

  const columns = [
    {
      id: 'candidate',
      header: 'Candidate',
      cell: (row: any) => (
        <div>
          <div className="font-medium">{row.name}</div>
          <div className="text-xs text-gray-500">{row.candidateId}</div>
        </div>
      ),
    },
    {
      id: 'center',
      header: 'Center & Batch',
      cell: (row: any) => (
        <div>
          <div className="font-medium">{row.center}</div>
          <div className="text-xs text-gray-500">{row.batch}</div>
        </div>
      ),
    },
    {
      id: 'riskScore',
      header: 'Risk Score',
      cell: (row: any) => (
        <div className="text-center">
          <div className={`font-bold text-lg ${
            row.riskScore >= 80 ? 'text-red-600' : 
            row.riskScore >= 60 ? 'text-orange-600' : 'text-yellow-600'
          }`}>
            {row.riskScore}%
          </div>
          <StatusBadge
            variant={row.riskScore >= 80 ? 'error' : row.riskScore >= 60 ? 'warning' : 'info'}
            label={row.riskScore >= 80 ? 'High Risk' : row.riskScore >= 60 ? 'Medium Risk' : 'Low Risk'}
            size="sm"
          />
        </div>
      ),
    },
    {
      id: 'factors',
      header: 'Risk Factors',
      cell: (row: any) => (
        <div className="space-y-1">
          {row.riskFactors.map((factor: string, idx: number) => (
            <div key={idx} className="text-xs bg-red-50 text-red-700 px-2 py-1 rounded">
              {factor}
            </div>
          ))}
        </div>
      ),
    },
    {
      id: 'lastActive',
      header: 'Last Active',
      cell: (row: any) => (
        <div className="text-sm text-gray-600">{row.lastActive}</div>
      ),
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: (row: any) => (
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            Notify PPC
          </Button>
          <Button variant="default" size="sm">
            Escalate
          </Button>
        </div>
      ),
    },
  ];

  return (
    <MainLayout role="state_head">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center">
            <Brain className="h-8 w-8 mr-3 text-purple-600" />
            Dropout Insights
          </h1>
          <p className="text-muted-foreground">
            AI-powered predictions and analysis for candidate dropout prevention
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">High Risk Candidates</p>
                  <p className="text-3xl font-bold text-red-600">12</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Medium Risk</p>
                  <p className="text-3xl font-bold text-orange-600">28</p>
                </div>
                <TrendingDown className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Prevented Dropouts</p>
                  <p className="text-3xl font-bold text-green-600">45</p>
                </div>
                <Users className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Prediction Accuracy</p>
                  <p className="text-3xl font-bold text-blue-600">87%</p>
                </div>
                <Brain className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="rounded-md border bg-white">
          <div className="p-4 border-b">
            <h2 className="text-lg font-semibold">Top 10 Candidates at Risk of Dropping</h2>
            <p className="text-sm text-muted-foreground">AI-flagged candidates requiring immediate attention</p>
          </div>
          <DataTable
            columns={columns}
            data={atRiskCandidates}
            isLoading={isLoading}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Dropout Risk Heatmap</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center text-muted-foreground">
                <div className="text-center">
                  <TrendingDown className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Heatmap visualization would appear here</p>
                  <p className="text-xs">Risk distribution across centers and job roles</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Risk Factor Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center text-muted-foreground">
                <div className="text-center">
                  <Brain className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Risk factor breakdown chart would appear here</p>
                  <p className="text-xs">Common factors contributing to dropout risk</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default DropoutInsights;
