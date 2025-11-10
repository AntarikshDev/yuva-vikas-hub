import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DataTable } from '@/components/common/DataTable';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Download, Target } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

interface ClusterPerformanceTableProps {
  clusters: Array<{
    clusterId: string;
    name: string;
    state: string;
    districts: string[];
    managers: number;
    target: number;
    achieved: number;
    percentAchieved: number;
    status: 'On Track' | 'At Risk' | 'Off Track';
  }>;
  isLoading: boolean;
}

export const ClusterPerformanceTable: React.FC<ClusterPerformanceTableProps> = ({ clusters, isLoading }) => {
  const [searchTerm, setSearchTerm] = useState('');

  if (isLoading) {
    return <Skeleton className="h-96" />;
  }

  const getStatusVariant = (status: string) => {
    if (status === 'On Track') return 'default';
    if (status === 'At Risk') return 'secondary';
    return 'destructive';
  };

  const columns = [
    {
      id: 'rank',
      header: 'Rank',
      cell: (row: any) => {
        const index = filteredClusters.findIndex(c => c.clusterId === row.clusterId);
        return <div className="font-medium text-sm">{index + 1}</div>;
      },
    },
    {
      id: 'name',
      header: 'Cluster Name',
      cell: (row: any) => (
        <div>
          <div className="font-medium">{row.name}</div>
          <div className="text-xs text-muted-foreground">{row.state}</div>
        </div>
      ),
    },
    {
      id: 'districts',
      header: 'Districts',
      cell: (row: any) => (
        <div className="text-sm">{row.districts.join(', ')}</div>
      ),
    },
    {
      id: 'managers',
      header: 'Managers',
      cell: (row: any) => (
        <div className="text-center font-medium">{row.managers}</div>
      ),
    },
    {
      id: 'target',
      header: 'Target',
      cell: (row: any) => (
        <div className="text-right font-medium">{row.target.toLocaleString()}</div>
      ),
    },
    {
      id: 'achieved',
      header: 'Achieved',
      cell: (row: any) => (
        <div className="text-right font-medium text-green-600">{row.achieved.toLocaleString()}</div>
      ),
    },
    {
      id: 'percentAchieved',
      header: '% Achieved',
      cell: (row: any) => (
        <div className="text-right">
          <Badge variant={row.percentAchieved >= 90 ? 'default' : row.percentAchieved >= 75 ? 'secondary' : 'destructive'}>
            {row.percentAchieved.toFixed(1)}%
          </Badge>
        </div>
      ),
    },
    {
      id: 'status',
      header: 'Status',
      cell: (row: any) => (
        <Badge variant={getStatusVariant(row.status)}>
          {row.status}
        </Badge>
      ),
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: (row: any) => (
        <div className="flex gap-2">
          <Button size="sm" variant="outline">
            <Download className="h-3 w-3 mr-1" />
            Export
          </Button>
          <Button size="sm" variant="outline">
            <Target className="h-3 w-3 mr-1" />
            Assign
          </Button>
        </div>
      ),
    },
  ];

  const filteredClusters = clusters.filter(
    (cluster) =>
      cluster.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cluster.state.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Cluster Performance</CardTitle>
      </CardHeader>
      <CardContent>
        <DataTable
          columns={columns}
          data={filteredClusters}
        />
      </CardContent>
    </Card>
  );
};
